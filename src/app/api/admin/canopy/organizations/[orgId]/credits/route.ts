import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  getAuthenticatedAccount,
  isAdminAccount,
  unauthorizedResponse,
  forbiddenResponse,
} from "@/lib/auth-helpers";
import { AdminCreditChangeSchema } from "@/lib/validators/billing";
import { grantCredits, revokeCredits, getCredits } from "@/lib/services/credits";
import { logger, formatError } from "@/lib/logger";

/**
 * POST /api/admin/canopy/organizations/[orgId]/credits
 *
 * Grant or revoke listing credits for an organization (admin action).
 * Positive amount grants credits, negative amount revokes.
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
    const parsed = AdminCreditChangeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { creditType, amount, reason } = parsed.data;

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
    const beforeCredits = await getCredits(orgId);
    const beforeBalance = creditType === "REGULAR" ? beforeCredits.regular : beforeCredits.boosted;

    // Grant or revoke
    let actualChange: number;
    if (amount > 0) {
      await grantCredits(orgId, creditType, amount);
      actualChange = amount;
    } else {
      const revoked = await revokeCredits(orgId, creditType, Math.abs(amount));
      actualChange = -revoked;
    }

    // Get balance after change
    const afterCredits = await getCredits(orgId);
    const afterBalance = creditType === "REGULAR" ? afterCredits.regular : afterCredits.boosted;

    // Log admin action
    await prisma.adminAccessLog.create({
      data: {
        adminAccountId: account.id,
        action: amount > 0 ? "credit_grant" : "credit_revoke",
        targetOrganizationId: orgId,
        details: {
          creditType,
          requested: amount,
          actual: actualChange,
          beforeBalance,
          afterBalance,
          reason,
        },
      },
    });

    logger.info("Admin credit change", {
      adminAccountId: account.id,
      organizationId: orgId,
      organizationName: org.name,
      creditType,
      requested: amount,
      actual: actualChange,
      beforeBalance,
      afterBalance,
      reason,
    });

    return NextResponse.json({
      data: {
        organizationId: orgId,
        creditType,
        requested: amount,
        actual: actualChange,
        beforeBalance,
        afterBalance,
      },
    });
  } catch (error) {
    logger.error("Admin credit change error", {
      error: formatError(error),
      endpoint: "/api/admin/canopy/organizations/[orgId]/credits",
    });
    return NextResponse.json({ error: "Failed to change credits" }, { status: 500 });
  }
}
