import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/access-control";
import { standardLimiter } from "@/lib/rate-limit";
import { logger, formatError } from "@/lib/logger";
import { createAuditLog } from "@/lib/audit";
import { deleteNangoConnection } from "@/lib/integrations/nango";
import type { IntegrationProvider } from "@/lib/integrations/types";

/**
 * DELETE /api/canopy/integrations/[id]
 *
 * Disconnect an integration: removes from Nango and updates local status.
 * - Org-level integrations: requires ADMIN role
 * - Member-level integrations: the connecting member or ADMIN
 */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

    const { id } = await params;

    const connection = await prisma.integrationConnection.findFirst({
      where: {
        id,
        organizationId: ctx.organizationId,
      },
    });

    if (!connection) {
      return NextResponse.json({ error: "Connection not found" }, { status: 404 });
    }

    // Authorization: org-level requires ADMIN, member-level allows the connecting member
    if (connection.scope === "organization" && ctx.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can disconnect org-level integrations" },
        { status: 403 }
      );
    }
    if (
      connection.scope === "member" &&
      connection.connectedByMemberId !== ctx.memberId &&
      ctx.role !== "ADMIN"
    ) {
      return NextResponse.json(
        { error: "Only the connecting member or an admin can disconnect" },
        { status: 403 }
      );
    }

    // Delete from Nango
    await deleteNangoConnection(
      connection.provider as IntegrationProvider,
      connection.nangoConnectionId
    );

    // Update local status
    await prisma.integrationConnection.update({
      where: { id: connection.id },
      data: { status: "disconnected" },
    });

    // Audit log
    await createAuditLog({
      action: "DISCONNECT",
      entityType: "IntegrationConnection",
      entityId: connection.id,
      userId: ctx.accountId,
      metadata: {
        provider: connection.provider,
        scope: connection.scope,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    logger.error("Failed to disconnect integration", {
      error: formatError(error),
      endpoint: "DELETE /api/canopy/integrations/[id]",
    });
    return NextResponse.json({ error: "Failed to disconnect integration" }, { status: 500 });
  }
}
