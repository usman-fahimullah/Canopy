/**
 * GET /api/canopy/billing/purchases
 * Returns paginated purchase history for the org.
 * Requires ADMIN or RECRUITER role.
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthContext, canManageBilling } from "@/lib/access-control";
import { logger, formatError } from "@/lib/logger";
import { getPurchaseHistory } from "@/lib/services/billing";

const PurchaseHistorySchema = z.object({
  skip: z.coerce.number().int().min(0).default(0),
  take: z.coerce.number().int().min(1).max(100).default(20),
});

export async function GET(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canManageBilling(ctx)) {
      return NextResponse.json(
        { error: "Only admins and recruiters can view purchase history" },
        { status: 403 }
      );
    }

    const params = PurchaseHistorySchema.safeParse(
      Object.fromEntries(request.nextUrl.searchParams)
    );
    if (!params.success) {
      return NextResponse.json(
        { error: "Invalid parameters", details: params.error.flatten() },
        { status: 422 }
      );
    }

    const { skip, take } = params.data;
    const { purchases, total } = await getPurchaseHistory(ctx.organizationId, skip, take);

    return NextResponse.json({
      purchases,
      meta: { total, skip, take },
    });
  } catch (error) {
    logger.error("Error fetching purchase history", {
      error: formatError(error),
      endpoint: "/api/canopy/billing/purchases",
    });
    return NextResponse.json({ error: "Failed to fetch purchase history" }, { status: 500 });
  }
}
