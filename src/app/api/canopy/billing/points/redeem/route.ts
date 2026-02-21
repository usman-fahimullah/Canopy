/**
 * POST /api/canopy/billing/points/redeem
 * Redeems loyalty points for a discount value.
 * Requires ADMIN or RECRUITER role. Points can only be applied to Tier 1 purchases.
 */
import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, canManageBilling } from "@/lib/access-control";
import { paymentLimiter } from "@/lib/rate-limit";
import { logger, formatError } from "@/lib/logger";
import { RedeemPointsSchema } from "@/lib/validators/billing";
import { redeemPoints, getPoints, getPointsValueCents } from "@/lib/services/loyalty-points";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = await paymentLimiter.check(5, `points-redeem:${ip}`);
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
        { error: "Only admins and recruiters can redeem points" },
        { status: 403 }
      );
    }

    // Points redemption is only for Tier 1 (PAY_AS_YOU_GO)
    if (ctx.planTier !== "PAY_AS_YOU_GO") {
      return NextResponse.json(
        { error: "Loyalty points can only be redeemed on the Pay As You Go plan" },
        { status: 422 }
      );
    }

    const body = await request.json();
    const result = RedeemPointsSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }

    const { points } = result.data;

    await redeemPoints(ctx.organizationId, points);

    // Return updated balance and discount value
    const updatedPoints = await getPoints(ctx.organizationId);
    const discountCents = getPointsValueCents(points);

    logger.info("Loyalty points redeemed via API", {
      organizationId: ctx.organizationId,
      pointsRedeemed: points,
      discountCents,
    });

    return NextResponse.json({
      redeemed: points,
      discountCents,
      updatedBalance: updatedPoints.balance,
    });
  } catch (error) {
    const message =
      error instanceof Error && error.message.includes("Insufficient")
        ? error.message
        : "Failed to redeem points";

    const status = error instanceof Error && error.message.includes("Insufficient") ? 422 : 500;

    if (status === 500) {
      logger.error("Error redeeming points", {
        error: formatError(error),
        endpoint: "/api/canopy/billing/points/redeem",
      });
    }

    return NextResponse.json({ error: message }, { status });
  }
}
