import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/access-control";
import { standardLimiter } from "@/lib/rate-limit";
import { logger, formatError } from "@/lib/logger";
import { SyncConnectionSchema } from "@/lib/validators/integrations";
import { getNangoConnection } from "@/lib/integrations/nango";
import { getProviderConfig, buildNangoConnectionId } from "@/lib/integrations/types";

/**
 * POST /api/canopy/integrations/sync
 *
 * Checks the connection status directly with Nango and syncs it to the
 * local database. This is used as a fallback when the Nango webhook
 * is delayed or misconfigured — the frontend calls this after the OAuth
 * popup closes to ensure the connection is recorded.
 */
export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = await standardLimiter.check(30, ip);
    if (!success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = SyncConnectionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const { provider } = parsed.data;
    const config = getProviderConfig(provider);
    if (!config) {
      return NextResponse.json({ error: "Unknown provider" }, { status: 400 });
    }

    const connectionId = buildNangoConnectionId(config.scope, {
      organizationId: ctx.organizationId,
      memberId: ctx.memberId,
    });

    // Query Nango directly — returns null if no connection exists
    const nangoConnection = await getNangoConnection(provider, config.scope, {
      organizationId: ctx.organizationId,
      memberId: ctx.memberId,
    });

    if (!nangoConnection) {
      return NextResponse.json({
        data: { status: "not_found" },
      });
    }

    // Connection exists in Nango — upsert to our database
    const connection = await prisma.integrationConnection.upsert({
      where: {
        organizationId_provider_nangoConnectionId: {
          organizationId: ctx.organizationId,
          provider: config.nangoIntegrationId,
          nangoConnectionId: connectionId,
        },
      },
      update: {
        status: "active",
        errorMessage: null,
        updatedAt: new Date(),
      },
      create: {
        organizationId: ctx.organizationId,
        provider: config.nangoIntegrationId,
        nangoConnectionId: connectionId,
        scope: config.scope,
        status: "active",
        connectedByMemberId: config.scope === "member" ? ctx.memberId : null,
      },
      select: {
        id: true,
        provider: true,
        status: true,
        nangoConnectionId: true,
        scope: true,
        providerAccountEmail: true,
        connectedByMemberId: true,
        createdAt: true,
      },
    });

    logger.info("Integration connection synced from Nango", {
      provider,
      connectionId,
      organizationId: ctx.organizationId,
    });

    return NextResponse.json({ data: connection });
  } catch (error) {
    logger.error("Failed to sync integration connection", {
      error: formatError(error),
      endpoint: "POST /api/canopy/integrations/sync",
    });
    return NextResponse.json({ error: "Failed to sync connection status" }, { status: 500 });
  }
}
