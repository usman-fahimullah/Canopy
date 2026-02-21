/**
 * GET /api/canopy/billing/credits
 * Returns credit balances and loyalty points for the org.
 * Any org member can view.
 */
import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/access-control";
import { logger, formatError } from "@/lib/logger";
import { getCredits } from "@/lib/services/credits";
import { getPoints, getPointsValueCents } from "@/lib/services/loyalty-points";

export async function GET() {
  try {
    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [credits, points] = await Promise.all([
      getCredits(ctx.organizationId),
      getPoints(ctx.organizationId),
    ]);

    return NextResponse.json({
      credits,
      points: {
        ...points,
        valueCents: getPointsValueCents(points.balance),
      },
    });
  } catch (error) {
    logger.error("Error fetching credit balances", {
      error: formatError(error),
      endpoint: "/api/canopy/billing/credits",
    });
    return NextResponse.json({ error: "Failed to fetch credit balances" }, { status: 500 });
  }
}
