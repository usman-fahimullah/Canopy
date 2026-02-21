import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  getAuthenticatedAccount,
  isAdminAccount,
  unauthorizedResponse,
  forbiddenResponse,
} from "@/lib/auth-helpers";
import { AdminPlanChangeSchema } from "@/lib/validators/billing";
import { logger, formatError } from "@/lib/logger";

/**
 * POST /api/admin/canopy/organizations/[orgId]/plan
 *
 * Change an organization's plan tier directly (admin override, bypasses Stripe checkout).
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
    const parsed = AdminPlanChangeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { planTier, reason } = parsed.data;

    // Verify org exists and get current tier
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      select: { id: true, name: true, planTier: true },
    });

    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    if (org.planTier === planTier) {
      return NextResponse.json(
        { error: `Organization is already on the ${planTier} plan` },
        { status: 422 }
      );
    }

    const previousTier = org.planTier;

    // Update plan tier
    await prisma.organization.update({
      where: { id: orgId },
      data: { planTier },
    });

    // Log admin action
    await prisma.adminAccessLog.create({
      data: {
        adminAccountId: account.id,
        action: "plan_change",
        targetOrganizationId: orgId,
        details: {
          previousTier,
          newTier: planTier,
          reason,
        },
      },
    });

    logger.info("Admin plan change", {
      adminAccountId: account.id,
      organizationId: orgId,
      organizationName: org.name,
      previousTier,
      newTier: planTier,
      reason,
    });

    return NextResponse.json({
      data: {
        organizationId: orgId,
        previousTier,
        newTier: planTier,
      },
    });
  } catch (error) {
    logger.error("Admin plan change error", {
      error: formatError(error),
      endpoint: "/api/admin/canopy/organizations/[orgId]/plan",
    });
    return NextResponse.json({ error: "Failed to change plan" }, { status: 500 });
  }
}
