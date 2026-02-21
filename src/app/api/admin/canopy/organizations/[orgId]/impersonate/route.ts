import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  getAuthenticatedAccount,
  isAdminAccount,
  unauthorizedResponse,
  forbiddenResponse,
} from "@/lib/auth-helpers";
import { setImpersonation } from "@/lib/admin/impersonation";
import { logger, formatError } from "@/lib/logger";

/**
 * POST /api/admin/canopy/organizations/[orgId]/impersonate
 *
 * Start impersonating an organization (god mode).
 * Sets a signed HttpOnly cookie that overrides org context in getAuthContext().
 * Logs to AdminAccessLog for audit trail (via setImpersonation).
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const account = await getAuthenticatedAccount();
    if (!account) return unauthorizedResponse();
    if (!isAdminAccount(account)) return forbiddenResponse();

    const { orgId } = await params;

    // Verify org exists
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      select: { id: true, name: true, planTier: true },
    });

    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    // Set impersonation cookie + log to AdminAccessLog
    await setImpersonation(account.id, orgId);

    logger.info("Admin impersonation started via API", {
      adminAccountId: account.id,
      adminEmail: account.email,
      targetOrganizationId: orgId,
      targetOrganizationName: org.name,
    });

    return NextResponse.json({
      data: {
        impersonating: true,
        organizationId: org.id,
        organizationName: org.name,
        planTier: org.planTier,
      },
    });
  } catch (error) {
    logger.error("Admin impersonation error", {
      error: formatError(error),
      endpoint: "/api/admin/canopy/organizations/[orgId]/impersonate",
    });
    return NextResponse.json({ error: "Failed to start impersonation" }, { status: 500 });
  }
}
