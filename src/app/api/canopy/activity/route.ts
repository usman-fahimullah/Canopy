import { NextRequest, NextResponse } from "next/server";
import { logger, formatError } from "@/lib/logger";
import { getAuthContext } from "@/lib/access-control";
import { getActivityFeed } from "@/lib/services/activity-service";

/**
 * GET /api/canopy/activity
 *
 * Fetch the activity feed (audit log entries) with optional filters.
 * Query params: entityType, entityId, seekerId, limit, offset
 */
export async function GET(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const entityType = searchParams.get("entityType") ?? undefined;
    const entityId = searchParams.get("entityId") ?? undefined;
    const seekerId = searchParams.get("seekerId") ?? undefined;
    const limit = parseInt(searchParams.get("limit") ?? "20", 10);
    const offset = parseInt(searchParams.get("offset") ?? "0", 10);

    const result = await getActivityFeed({
      organizationId: ctx.organizationId,
      entityType,
      entityId,
      seekerId,
      limit: Math.min(limit, 100), // Cap at 100
      offset,
    });

    return NextResponse.json({ data: result });
  } catch (error) {
    logger.error("Failed to fetch activity feed", {
      error: formatError(error),
      endpoint: "/api/canopy/activity",
    });
    return NextResponse.json({ error: "Failed to fetch activity feed" }, { status: 500 });
  }
}
