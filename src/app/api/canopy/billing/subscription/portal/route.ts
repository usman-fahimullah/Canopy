/**
 * POST /api/canopy/billing/subscription/portal
 * Creates a Stripe Customer Portal session for managing the subscription.
 * Requires ADMIN or RECRUITER role.
 */
import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, canManageBilling } from "@/lib/access-control";
import { paymentLimiter } from "@/lib/rate-limit";
import { logger, formatError } from "@/lib/logger";
import { createPortalSession } from "@/lib/services/billing";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = await paymentLimiter.check(5, `portal-session:${ip}`);
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
        { error: "Only admins and recruiters can manage billing" },
        { status: 403 }
      );
    }

    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/canopy/settings/billing`;
    const portalUrl = await createPortalSession(ctx.organizationId, returnUrl);

    return NextResponse.json({ url: portalUrl });
  } catch (error) {
    const message =
      error instanceof Error && error.message.includes("No Stripe customer")
        ? "No active billing account found. Purchase a plan first."
        : "Failed to open billing portal";

    logger.error("Error creating portal session", {
      error: formatError(error),
      endpoint: "/api/canopy/billing/subscription/portal",
    });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
