import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { createSessionCancelledNotification } from "@/lib/notifications";
import { logger, formatError } from "@/lib/logger";
import { standardLimiter } from "@/lib/rate-limit";
import { CancelSessionSchema } from "@/lib/validators/api";

// POST — cancel a session with appropriate refund
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limit: 5 cancellations per minute per IP
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = await standardLimiter.check(5, `cancel:${ip}`);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429 }
      );
    }

    const { id: sessionId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        coach: { include: { account: true } },
        mentee: { include: { account: true } },
        booking: true,
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (session.status === "CANCELLED" || session.status === "COMPLETED") {
      return NextResponse.json(
        { error: "Session is already cancelled or completed" },
        { status: 400 }
      );
    }

    const isCoach = session.coach.account.id === account.id;
    const isMentee = session.mentee.account.id === account.id;

    if (!isCoach && !isMentee) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const rawBody = await request.json().catch(() => ({}));
    const result = CancelSessionSchema.safeParse(rawBody);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }
    const reason = result.data.reason;

    // Determine refund amount based on cancellation policy
    const hoursUntilSession =
      (session.scheduledAt.getTime() - Date.now()) / (1000 * 60 * 60);

    let refundPercent = 0;
    let refundInfo = "";

    if (isCoach) {
      // Coach cancellation: always full refund
      refundPercent = 100;
      refundInfo = "Full refund issued (coach cancellation).";
    } else if (hoursUntilSession >= 24) {
      // >24h: full refund
      refundPercent = 100;
      refundInfo = "Full refund issued (cancelled more than 24 hours before session).";
    } else {
      // <24h: 50% refund
      refundPercent = 50;
      refundInfo = "50% refund issued (cancelled less than 24 hours before session).";
    }

    // Process refund via Stripe if booking has a payment intent
    if (session.booking?.stripePaymentIntentId && refundPercent > 0) {
      const refundAmount = Math.round(
        (session.booking.amount * refundPercent) / 100
      );

      try {
        await stripe.refunds.create({
          payment_intent: session.booking.stripePaymentIntentId,
          amount: refundAmount,
        });

        // Wrap all DB writes in a transaction (Stripe refund is external, kept outside)
        const bookingId = session.booking?.id;
        if (!bookingId) {
          return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }
        const coachRefund = Math.round(
          (session.booking.coachPayout * refundPercent) / 100
        );
        await prisma.$transaction(async (tx) => {
          await tx.booking.update({
            where: { id: bookingId },
            data: {
              status: refundPercent === 100 ? "REFUNDED" : "PARTIALLY_REFUNDED",
              refundAmount,
              refundedAt: new Date(),
            },
          });

          // Update coach earnings
          await tx.coachProfile.update({
            where: { id: session.coachId },
            data: {
              totalEarnings: { decrement: coachRefund },
              totalSessions: { decrement: 1 },
            },
          });

          // Cancel the session
          await tx.session.update({
            where: { id: sessionId },
            data: {
              status: "CANCELLED",
              cancellationReason: reason,
              cancelledAt: new Date(),
              cancelledBy: account.id,
            },
          });
        });
      } catch (refundError) {
        logger.error("Refund failed", { error: formatError(refundError), endpoint: "/api/sessions/[id]/cancel" });
        // Still cancel the session even if refund fails
        refundInfo = "Session cancelled. Refund processing may be delayed.";
        // Cancel session outside transaction if refund/transaction failed
        await prisma.session.update({
          where: { id: sessionId },
          data: {
            status: "CANCELLED",
            cancellationReason: reason,
            cancelledAt: new Date(),
            cancelledBy: account.id,
          },
        });
      }
    } else {
      // No booking/payment - just cancel the session
      await prisma.session.update({
        where: { id: sessionId },
        data: {
          status: "CANCELLED",
          cancellationReason: reason,
          cancelledAt: new Date(),
          cancelledBy: account.id,
        },
      });
    }

    // Notify the other party
    const cancellerName = isCoach
      ? [session.coach.firstName, session.coach.lastName].filter(Boolean).join(" ") || session.coach.account.name || "Your coach"
      : session.mentee.account.name || "Your mentee";
    const recipientAccountId = isCoach
      ? session.mentee.account.id
      : session.coach.account.id;
    const recipientName = isCoach
      ? session.mentee.account.name || "there"
      : session.coach.account.name || "there";
    const recipientEmail = isCoach
      ? session.mentee.account.email
      : session.coach.account.email;

    await createSessionCancelledNotification({
      session: { id: session.id, scheduledAt: session.scheduledAt },
      cancelledByName: cancellerName,
      recipientAccountId,
      recipientName,
      recipientEmail,
      refundInfo,
    }).catch((err) => {
      logger.error("Failed to send cancellation notification", { error: formatError(err), endpoint: "/api/sessions/[id]/cancel" });
    });

    return NextResponse.json({
      success: true,
      refundPercent,
      refundInfo,
    });
  } catch (error) {
    logger.error("Cancel session error", { error: formatError(error), endpoint: "/api/sessions/[id]/cancel" });
    return NextResponse.json(
      { error: "Failed to cancel session" },
      { status: 500 }
    );
  }
}
