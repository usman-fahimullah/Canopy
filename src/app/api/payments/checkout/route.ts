import { NextRequest, NextResponse } from "next/server";
import { stripe, calculateFees } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { paymentLimiter } from "@/lib/rate-limit";
import { logger, formatError } from "@/lib/logger";
import { CheckoutSchema } from "@/lib/validators/api";

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 payment attempts per minute per IP
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = await paymentLimiter.check(5, `checkout:${ip}`);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429 }
      );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const result = CheckoutSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }
    const { coachId, sessionDate, sessionDuration } = result.data;


    // Get coach profile
    const coach = await prisma.coachProfile.findUnique({
      where: { id: coachId },
      include: {
        account: true,
      },
    });

    if (!coach) {
      return NextResponse.json(
        { error: "Coach not found" },
        { status: 404 }
      );
    }

    if (!coach.stripeAccountId) {
      return NextResponse.json(
        { error: "Coach has not set up payments yet" },
        { status: 400 }
      );
    }

    // Get mentee profile
    const mentee = await prisma.seekerProfile.findFirst({
      where: {
        account: {
          supabaseId: user.id,
        },
      },
      include: {
        account: true,
      },
    });

    if (!mentee) {
      return NextResponse.json(
        { error: "Mentee profile not found" },
        { status: 404 }
      );
    }

    // Calculate fees
    const { total, platformFee, coachPayout } = calculateFees(coach.sessionRate);

    // Create Stripe Checkout session with Connect
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Coaching Session with ${coach.firstName} ${coach.lastName}`,
              description: `${sessionDuration}-minute coaching session`,
            },
            unit_amount: total,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: platformFee,
        transfer_data: {
          destination: coach.stripeAccountId,
        },
        metadata: {
          coachId: coach.id,
          menteeId: mentee.id,
          sessionDate,
          sessionDuration: sessionDuration.toString(),
        },
      },
      customer_email: user.email,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/candid/sessions/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/candid/browse/${coachId}?booking=cancelled`,
      metadata: {
        coachId: coach.id,
        menteeId: mentee.id,
        sessionDate,
        sessionDuration: sessionDuration.toString(),
        coachPayout: coachPayout.toString(),
        platformFee: platformFee.toString(),
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    logger.error("Checkout session error", { error: formatError(error), endpoint: "/api/payments/checkout" });
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
