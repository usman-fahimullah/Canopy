/**
 * Candid (coaching) Stripe webhook handlers.
 * Extracted from the original webhook/route.ts — logic unchanged.
 */
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { createAuditLog } from "@/lib/audit";
import { createSessionBookedNotifications } from "@/lib/notifications";
import type Stripe from "stripe";

// =================================================================
// Checkout Completed — Candid coaching session
// =================================================================

export async function handleCandidCheckout(session: Stripe.Checkout.Session) {
  const metadata = session.metadata;

  if (!metadata?.coachId || !metadata?.menteeId || !metadata?.sessionDate) {
    logger.error("Missing metadata in checkout session", { endpoint: "/api/stripe/webhook" });
    return;
  }

  const coachId = metadata.coachId;
  const menteeId = metadata.menteeId;
  const sessionDate = new Date(metadata.sessionDate);
  const sessionDuration = parseInt(metadata.sessionDuration || "60");
  const sessionType = metadata.sessionType || "ONE_ON_ONE";
  const sessionNotes = metadata.notes || null;
  const coachPayout = parseInt(metadata.coachPayout || "0");
  const platformFee = parseInt(metadata.platformFee || "0");

  // Verify both coach and mentee exist before creating any records
  const [coach, mentee] = await Promise.all([
    prisma.coachProfile.findUnique({
      where: { id: coachId },
      select: { id: true, videoLink: true, status: true },
    }),
    prisma.seekerProfile.findUnique({
      where: { id: menteeId },
      select: { id: true },
    }),
  ]);

  if (!coach) {
    logger.error("Webhook: coach not found for checkout", {
      coachId,
      checkoutSessionId: session.id,
      endpoint: "/api/stripe/webhook",
    });
    return;
  }

  if (!mentee) {
    logger.error("Webhook: mentee not found for checkout", {
      menteeId,
      checkoutSessionId: session.id,
      endpoint: "/api/stripe/webhook",
    });
    return;
  }

  if (coach.status !== "ACTIVE" && coach.status !== "APPROVED") {
    logger.error("Webhook: coach is not active", {
      coachId,
      coachStatus: coach.status,
      checkoutSessionId: session.id,
      endpoint: "/api/stripe/webhook",
    });
    return;
  }

  // Wrap all DB writes in a transaction for consistency
  const coachingSession = await prisma.$transaction(async (tx) => {
    const createdSession = await tx.session.create({
      data: {
        coachId,
        menteeId,
        scheduledAt: sessionDate,
        duration: sessionDuration,
        title: sessionType !== "ONE_ON_ONE" ? sessionType : null,
        menteeMessage: sessionNotes,
        status: "SCHEDULED",
        videoLink: coach.videoLink,
      },
    });

    await tx.booking.create({
      data: {
        sessionId: createdSession.id,
        menteeId,
        coachId,
        amount: session.amount_total || 0,
        platformFee,
        coachPayout,
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId: session.payment_intent as string,
        status: "PAID",
        paidAt: new Date(),
      },
    });

    await tx.coachProfile.update({
      where: { id: coachId },
      data: {
        totalSessions: { increment: 1 },
        totalEarnings: { increment: coachPayout },
      },
    });

    return createdSession;
  });

  // Audit log: track payment completed
  await createAuditLog({
    action: "CREATE",
    entityType: "Booking",
    entityId: coachingSession.id,
    changes: { status: { from: null, to: "PAID" } },
    metadata: {
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId: session.payment_intent as string,
      amount: session.amount_total,
      webhookEvent: "checkout.session.completed",
    },
  });

  // Send booking notifications to both parties
  const fullSession = await prisma.session.findUnique({
    where: { id: coachingSession.id },
    include: {
      coach: { include: { account: true } },
      mentee: { include: { account: true } },
    },
  });

  if (fullSession) {
    createSessionBookedNotifications({
      id: fullSession.id,
      scheduledAt: fullSession.scheduledAt,
      duration: fullSession.duration,
      videoLink: fullSession.videoLink,
      coach: fullSession.coach,
      mentee: fullSession.mentee,
    }).catch((err) => {
      logger.error("Failed to send booking notifications", { error: formatError(err) });
    });
  }
}

// =================================================================
// Payment Succeeded — Candid booking
// =================================================================

export async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const booking = await prisma.booking.findUnique({
    where: { stripePaymentIntentId: paymentIntent.id },
  });

  if (booking && booking.status !== "PAID") {
    const previousStatus = booking.status;
    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: "PAID",
        paidAt: new Date(),
      },
    });

    await createAuditLog({
      action: "UPDATE",
      entityType: "Booking",
      entityId: booking.id,
      changes: { status: { from: previousStatus, to: "PAID" } },
      metadata: {
        stripePaymentIntentId: paymentIntent.id,
        webhookEvent: "payment_intent.succeeded",
      },
    });
  }
}

// =================================================================
// Payment Failed — Candid booking
// =================================================================

export async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const booking = await prisma.booking.findUnique({
    where: { stripePaymentIntentId: paymentIntent.id },
  });

  if (booking) {
    await prisma.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id: booking.id },
        data: { status: "FAILED" },
      });

      await tx.session.update({
        where: { id: booking.sessionId },
        data: {
          status: "CANCELLED",
          cancellationReason: "Payment failed",
          cancelledAt: new Date(),
        },
      });
    });

    await createAuditLog({
      action: "UPDATE",
      entityType: "Booking",
      entityId: booking.id,
      changes: { status: { from: booking.status, to: "FAILED" } },
      metadata: {
        stripePaymentIntentId: paymentIntent.id,
        webhookEvent: "payment_intent.payment_failed",
      },
    });
  }
}

// =================================================================
// Refund — Candid booking
// =================================================================

export async function handleCandidRefund(charge: Stripe.Charge) {
  if (!charge.payment_intent) return;

  const booking = await prisma.booking.findUnique({
    where: { stripePaymentIntentId: charge.payment_intent as string },
  });

  if (booking) {
    const refundAmount = charge.amount_refunded;
    const isFullRefund = refundAmount >= booking.amount;

    await prisma.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id: booking.id },
        data: {
          status: isFullRefund ? "REFUNDED" : "PARTIALLY_REFUNDED",
          refundAmount,
          refundedAt: new Date(),
        },
      });

      await tx.coachProfile.update({
        where: { id: booking.coachId },
        data: {
          totalEarnings: { decrement: booking.coachPayout },
          totalSessions: { decrement: 1 },
        },
      });
    });

    await createAuditLog({
      action: "REFUND",
      entityType: "Booking",
      entityId: booking.id,
      changes: {
        status: { from: booking.status, to: isFullRefund ? "REFUNDED" : "PARTIALLY_REFUNDED" },
        refundAmount: { from: booking.refundAmount || 0, to: refundAmount },
      },
      metadata: {
        stripeChargeId: charge.id,
        stripePaymentIntentId: charge.payment_intent,
        webhookEvent: "charge.refunded",
        isFullRefund,
      },
    });
  }
}

// =================================================================
// Account Updated — Stripe Connect coach onboarding
// =================================================================

export async function handleAccountUpdated(account: Stripe.Account) {
  const coach = await prisma.coachProfile.findFirst({
    where: { stripeAccountId: account.id },
  });

  if (coach && account.details_submitted && account.charges_enabled) {
    await prisma.coachProfile.update({
      where: { id: coach.id },
      data: {
        status: coach.status === "PENDING" ? "APPROVED" : coach.status,
      },
    });
  }
}
