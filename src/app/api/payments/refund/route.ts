import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { paymentLimiter } from "@/lib/rate-limit";
import { logger, formatError } from "@/lib/logger";
import { RefundSchema } from "@/lib/validators/api";
import { createAuditLog } from "@/lib/audit";

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 refund attempts per minute per IP
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = await paymentLimiter.check(5, `refund:${ip}`);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = RefundSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }
    const { bookingId, reason } = result.data;

    // Get booking with session
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        session: true,
        mentee: {
          include: { account: true },
        },
        coach: {
          include: { account: true },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Check if user is the mentee or coach
    const isMentee = booking.mentee.account.supabaseId === user.id;
    const isCoach = booking.coach.account.supabaseId === user.id;

    if (!isMentee && !isCoach) {
      return NextResponse.json({ error: "Not authorized to refund this booking" }, { status: 403 });
    }

    if (booking.status !== "PAID") {
      return NextResponse.json({ error: "Booking is not in a refundable state" }, { status: 400 });
    }

    // Calculate refund amount based on cancellation policy
    const hoursUntilSession =
      (booking.session.scheduledAt.getTime() - Date.now()) / (1000 * 60 * 60);
    let refundPercent = 100;
    let refundReason = reason || "Cancellation";

    if (isCoach) {
      // Coach cancellation - always full refund
      refundPercent = 100;
      refundReason = "Coach cancelled";
    } else if (isMentee) {
      if (hoursUntilSession < 24) {
        // Less than 24 hours - 50% refund
        refundPercent = 50;
        refundReason = "Late cancellation (< 24 hours)";
      }
    }

    const refundAmount = Math.round(booking.amount * (refundPercent / 100));

    // Process refund via Stripe
    if (!booking.stripePaymentIntentId) {
      return NextResponse.json(
        { error: "No payment intent found for this booking" },
        { status: 400 }
      );
    }

    const refund = await stripe.refunds.create({
      payment_intent: booking.stripePaymentIntentId,
      amount: refundAmount,
      reason: "requested_by_customer",
      metadata: {
        bookingId: booking.id,
        sessionId: booking.sessionId,
        cancelledBy: isMentee ? "mentee" : "coach",
        reason: refundReason,
      },
    });

    // Wrap DB updates in transaction for consistency
    await prisma.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id: booking.id },
        data: {
          status: refundPercent === 100 ? "REFUNDED" : "PARTIALLY_REFUNDED",
          refundAmount,
          refundReason,
          refundedAt: new Date(),
        },
      });

      await tx.session.update({
        where: { id: booking.sessionId },
        data: {
          status: "CANCELLED",
          cancelledBy: isMentee ? "mentee" : "coach",
          cancellationReason: refundReason,
          cancelledAt: new Date(),
        },
      });

      const coachPayoutRefund = Math.round(booking.coachPayout * (refundPercent / 100));
      await tx.coachProfile.update({
        where: { id: booking.coachId },
        data: {
          totalEarnings: { decrement: coachPayoutRefund },
          totalSessions: { decrement: 1 },
        },
      });
    });

    // Audit log: track refund
    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      select: { id: true },
    });
    await createAuditLog({
      action: "REFUND",
      entityType: "Booking",
      entityId: booking.id,
      userId: account?.id,
      changes: {
        status: {
          from: booking.status,
          to: refundPercent === 100 ? "REFUNDED" : "PARTIALLY_REFUNDED",
        },
        refundAmount: { from: 0, to: refundAmount },
      },
      metadata: {
        stripeRefundId: refund.id,
        refundPercent,
        reason: refundReason,
        cancelledBy: isMentee ? "mentee" : "coach",
        ip,
      },
    });

    return NextResponse.json({
      success: true,
      refundId: refund.id,
      refundAmount,
      refundPercent,
      reason: refundReason,
    });
  } catch (error) {
    logger.error("Refund error", { error: formatError(error), endpoint: "/api/payments/refund" });
    return NextResponse.json({ error: "Failed to process refund" }, { status: 500 });
  }
}
