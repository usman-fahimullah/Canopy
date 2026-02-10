import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/access-control";
import { readLimiter } from "@/lib/rate-limit";
import { logger, formatError } from "@/lib/logger";

/**
 * GET /api/canopy/integrations
 *
 * List all integration connections for the authenticated org.
 * For member-scoped integrations (calendars), includes the current
 * member's connections plus any org-level connections.
 */
export async function GET(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = await readLimiter.check(60, ip);
    if (!success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const connections = await prisma.integrationConnection.findMany({
      where: {
        organizationId: ctx.organizationId,
        status: { not: "disconnected" },
      },
      select: {
        id: true,
        provider: true,
        nangoConnectionId: true,
        scope: true,
        status: true,
        providerAccountEmail: true,
        providerAccountName: true,
        config: true,
        connectedByMemberId: true,
        errorMessage: true,
        lastSyncedAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      data: connections,
      meta: { total: connections.length },
    });
  } catch (error) {
    logger.error("Failed to list integrations", {
      error: formatError(error),
      endpoint: "GET /api/canopy/integrations",
    });
    return NextResponse.json({ error: "Failed to load integrations" }, { status: 500 });
  }
}
