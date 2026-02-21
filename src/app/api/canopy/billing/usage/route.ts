/**
 * GET /api/canopy/billing/usage
 * Returns plan features and usage stats (credits, points, active jobs).
 * Any org member can view.
 */
import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/access-control";
import { logger, formatError } from "@/lib/logger";
import { getUsageData } from "@/lib/services/billing";

export async function GET() {
  try {
    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await getUsageData(ctx.organizationId);
    return NextResponse.json(data);
  } catch (error) {
    logger.error("Error fetching usage data", {
      error: formatError(error),
      endpoint: "/api/canopy/billing/usage",
    });
    return NextResponse.json({ error: "Failed to fetch usage data" }, { status: 500 });
  }
}
