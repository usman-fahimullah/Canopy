import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  getAuthenticatedAccount,
  isAdminAccount,
  unauthorizedResponse,
  forbiddenResponse,
} from "@/lib/auth-helpers";
import { AdminPointsChangeSchema } from "@/lib/validators/billing";
import { adjustPoints, getPoints } from "@/lib/services/loyalty-points";
import { logger, formatError } from "@/lib/logger";

/**
 * POST /api/admin/canopy/organizations/[orgId]/points
 *
 * Grant or revoke loyalty points for an organization (admin action).
 * Positive amount grants points, negative amount revokes (clamped to 0).
 * Logs to AdminAccessLog for audit trail.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const account = await getAuthenticatedAccount();
    if (!account) return unauthorizedResponse();
    if (!isAdminAccount(account)) return forbiddenResponse();

    const { orgId } = await params;

    // Validate input
    const body = await request.json();
    const parsed = AdminPointsChangeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { amount, reason } = parsed.data;

    // Verify org exists
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      select: { id: true, name: true },
    });

    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    if (amount === 0) {
      return NextResponse.json({ error: "Amount must be non-zero" }, { status: 422 });
    }

    // Get balance before change
    const beforePoints = await getPoints(orgId);

    // Adjust points
    await adjustPoints(orgId, amount);

    // Get balance after change
    const afterPoints = await getPoints(orgId);

    // Log admin action
    await prisma.adminAccessLog.create({
      data: {
        adminAccountId: account.id,
        action: amount > 0 ? "points_grant" : "points_revoke",
        targetOrganizationId: orgId,
        details: {
          requested: amount,
          beforeBalance: beforePoints.balance,
          afterBalance: afterPoints.balance,
          reason,
        },
      },
    });

    logger.info("Admin points change", {
      adminAccountId: account.id,
      organizationId: orgId,
      organizationName: org.name,
      requested: amount,
      beforeBalance: beforePoints.balance,
      afterBalance: afterPoints.balance,
      reason,
    });

    return NextResponse.json({
      data: {
        organizationId: orgId,
        requested: amount,
        beforeBalance: beforePoints.balance,
        afterBalance: afterPoints.balance,
      },
    });
  } catch (error) {
    logger.error("Admin points change error", {
      error: formatError(error),
      endpoint: "/api/admin/canopy/organizations/[orgId]/points",
    });
    return NextResponse.json({ error: "Failed to change points" }, { status: 500 });
  }
}
