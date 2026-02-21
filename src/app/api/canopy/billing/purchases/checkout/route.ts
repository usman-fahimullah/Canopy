/**
 * POST /api/canopy/billing/purchases/checkout
 * Creates a Stripe Checkout session for a listing or pack purchase.
 * Requires ADMIN, RECRUITER role.
 */
import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, canManageBilling } from "@/lib/access-control";
import { paymentLimiter } from "@/lib/rate-limit";
import { logger, formatError } from "@/lib/logger";
import { prisma } from "@/lib/db";
import { ListingPurchaseSchema } from "@/lib/validators/billing";
import { createListingPurchaseCheckout } from "@/lib/services/billing";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = await paymentLimiter.check(5, `listing-checkout:${ip}`);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429 }
      );
    }

    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canManageBilling(ctx)) {
      return NextResponse.json(
        { error: "Only admins and recruiters can make purchases" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const result = ListingPurchaseSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }

    const { purchaseType } = result.data;

    const [org, account] = await Promise.all([
      prisma.organization.findUniqueOrThrow({
        where: { id: ctx.organizationId },
        select: { name: true },
      }),
      prisma.account.findUniqueOrThrow({
        where: { id: ctx.accountId },
        select: { email: true },
      }),
    ]);

    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/canopy/settings/billing`;

    const checkoutUrl = await createListingPurchaseCheckout(
      ctx.organizationId,
      org.name,
      account.email,
      purchaseType,
      returnUrl
    );

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    logger.error("Error creating listing purchase checkout", {
      error: formatError(error),
      endpoint: "/api/canopy/billing/purchases/checkout",
    });
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
