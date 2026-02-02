import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";

// POST - Create or update Stripe Connect account and return onboarding link
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get coach profile
    const coach = await prisma.coachProfile.findFirst({
      where: {
        account: {
          supabaseId: user.id,
        },
      },
      include: {
        account: true,
      },
    });

    if (!coach) {
      return NextResponse.json(
        { error: "Coach profile not found" },
        { status: 404 }
      );
    }

    let stripeAccountId = coach.stripeAccountId;

    // Create Stripe Connect account if doesn't exist
    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: "express",
        country: "US",
        email: user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: "individual",
        metadata: {
          coachId: coach.id,
          accountId: coach.accountId,
        },
      });

      stripeAccountId = account.id;

      // Save Stripe account ID to coach profile
      await prisma.coachProfile.update({
        where: { id: coach.id },
        data: { stripeAccountId },
      });
    }

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/candid/settings/payments?refresh=true`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/candid/settings/payments?success=true`,
      type: "account_onboarding",
    });

    return NextResponse.json({
      url: accountLink.url,
      accountId: stripeAccountId,
    });
  } catch (error) {
    logger.error("Stripe Connect error", { error: formatError(error), endpoint: "/api/stripe/connect" });
    return NextResponse.json(
      { error: "Failed to create Stripe Connect account" },
      { status: 500 }
    );
  }
}

// GET - Check Stripe Connect account status
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get coach profile
    const coach = await prisma.coachProfile.findFirst({
      where: {
        account: {
          supabaseId: user.id,
        },
      },
    });

    if (!coach) {
      return NextResponse.json(
        { error: "Coach profile not found" },
        { status: 404 }
      );
    }

    if (!coach.stripeAccountId) {
      return NextResponse.json({
        connected: false,
        onboardingComplete: false,
        payoutsEnabled: false,
        chargesEnabled: false,
      });
    }

    // Get account details from Stripe
    const account = await stripe.accounts.retrieve(coach.stripeAccountId);

    return NextResponse.json({
      connected: true,
      onboardingComplete: account.details_submitted,
      payoutsEnabled: account.payouts_enabled,
      chargesEnabled: account.charges_enabled,
      accountId: account.id,
    });
  } catch (error) {
    logger.error("Stripe Connect status error", { error: formatError(error), endpoint: "/api/stripe/connect" });
    return NextResponse.json(
      { error: "Failed to get Stripe Connect status" },
      { status: 500 }
    );
  }
}
