/**
 * GET /api/canopy/billing/subscription
 * Returns current plan tier, features, and subscription status.
 * Any org member can view.
 */
import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/access-control";
import { logger, formatError } from "@/lib/logger";
import { getSubscriptionStatus } from "@/lib/services/billing";

export async function GET() {
  try {
    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await getSubscriptionStatus(ctx.organizationId);
    return NextResponse.json(data);
  } catch (error) {
    logger.error("Error fetching subscription status", {
      error: formatError(error),
      endpoint: "/api/canopy/billing/subscription",
    });
    return NextResponse.json({ error: "Failed to fetch subscription status" }, { status: 500 });
  }
}
