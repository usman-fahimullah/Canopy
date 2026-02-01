import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import Stripe from "stripe";
import { createSessionBookedNotifications } from "@/lib/notifications";

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
    console.error("Webhook signature verification failed:", err);
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
        console.warn(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const metadata = session.metadata;

  if (!metadata?.coachId || !metadata?.menteeId || !metadata?.sessionDate) {
    console.error("Missing metadata in checkout session");
    return;
  }

  const coachId = metadata.coachId;
  const menteeId = metadata.menteeId;
  const sessionDate = new Date(metadata.sessionDate);
  const sessionDuration = parseInt(metadata.sessionDuration || "60");
  const coachPayout = parseInt(metadata.coachPayout || "0");
  const platformFee = parseInt(metadata.platformFee || "0");

  // Get coach for video link
  const coach = await prisma.coachProfile.findUnique({
    where: { id: coachId },
  });

  // Create the coaching session
  const coachingSession = await prisma.session.create({
    data: {
      coachId,
      menteeId,
      scheduledAt: sessionDate,
      duration: sessionDuration,
      status: "SCHEDULED",
      videoLink: coach?.videoLink,
    },
  });

  // Create the booking record
  await prisma.booking.create({
    data: {
      sessionId: coachingSession.id,
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

  // Update coach stats
  await prisma.coachProfile.update({
    where: { id: coachId },
    data: {
      totalSessions: { increment: 1 },
      totalEarnings: { increment: coachPayout },
    },
  });

  // Session and booking created successfully

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
      console.error("Failed to send booking notifications:", err);
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
    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: "FAILED" },
    });

    // Also cancel the session
    await prisma.session.update({
      where: { id: booking.sessionId },
      data: {
        status: "CANCELLED",
        cancellationReason: "Payment failed",
        cancelledAt: new Date(),
      },
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

    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: isFullRefund ? "REFUNDED" : "PARTIALLY_REFUNDED",
        refundAmount,
        refundedAt: new Date(),
      },
    });

    // Update coach earnings
    await prisma.coachProfile.update({
      where: { id: booking.coachId },
      data: {
        totalEarnings: { decrement: booking.coachPayout },
        totalSessions: { decrement: 1 },
      },
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
