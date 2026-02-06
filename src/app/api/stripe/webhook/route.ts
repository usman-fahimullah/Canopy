import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import Stripe from "stripe";
import { createSessionBookedNotifications } from "@/lib/notifications";
import { logger, formatError } from "@/lib/logger";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    logger.error("Webhook signature verification failed", {
      error: formatError(err),
      endpoint: "/api/stripe/webhook",
    });
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(checkoutSession);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSucceeded(paymentIntent);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailed(paymentIntent);
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        await handleRefund(charge);
        break;
      }

      case "account.updated": {
        const account = event.data.object as Stripe.Account;
        await handleAccountUpdated(account);
        break;
      }

      default:
        logger.warn("Unhandled Stripe event type", {
          endpoint: "/api/stripe/webhook",
          eventType: event.type,
        });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error("Webhook handler error", {
      error: formatError(error),
      endpoint: "/api/stripe/webhook",
    });
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const metadata = session.metadata;

  if (!metadata?.coachId || !metadata?.menteeId || !metadata?.sessionDate) {
    logger.error("Missing metadata in checkout session", { endpoint: "/api/stripe/webhook" });
    return;
  }

  const coachId = metadata.coachId;
  const menteeId = metadata.menteeId;
  const sessionDate = new Date(metadata.sessionDate);
  const sessionDuration = parseInt(metadata.sessionDuration || "60");
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

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  // Update booking status if exists
  const booking = await prisma.booking.findUnique({
    where: { stripePaymentIntentId: paymentIntent.id },
  });

  if (booking && booking.status !== "PAID") {
    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: "PAID",
        paidAt: new Date(),
      },
    });
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
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
  }
}

async function handleRefund(charge: Stripe.Charge) {
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
  }
}

async function handleAccountUpdated(account: Stripe.Account) {
  // Update coach profile when Stripe Connect account is updated
  const coach = await prisma.coachProfile.findFirst({
    where: { stripeAccountId: account.id },
  });

  if (coach && account.details_submitted && account.charges_enabled) {
    // Coach has completed onboarding
    await prisma.coachProfile.update({
      where: { id: coach.id },
      data: {
        status: coach.status === "PENDING" ? "APPROVED" : coach.status,
      },
    });
  }
}
