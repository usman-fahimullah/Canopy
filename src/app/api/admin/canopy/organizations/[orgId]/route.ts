import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  getAuthenticatedAccount,
  isAdminAccount,
  unauthorizedResponse,
  forbiddenResponse,
} from "@/lib/auth-helpers";
import { getCredits } from "@/lib/services/credits";
import { getPoints } from "@/lib/services/loyalty-points";
import { logger, formatError } from "@/lib/logger";

/**
 * GET /api/admin/canopy/organizations/[orgId]
 *
 * Detailed organization view for admin panel.
 * Returns plan, subscription, credits, points, job stats, team, and purchase history.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const account = await getAuthenticatedAccount();
    if (!account) return unauthorizedResponse();
    if (!isAdminAccount(account)) return forbiddenResponse();

    const { orgId } = await params;

    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        planTier: true,
        planPeriodEnd: true,
        stripeCustomerId: true,
        createdAt: true,
        members: {
          select: {
            id: true,
            role: true,
            departmentId: true,
            account: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
          take: 50,
        },
        _count: {
          select: {
            jobs: true,
            members: true,
          },
        },
      },
    });

    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    // Parallel: credits, points, subscription, job stats, recent purchases
    const [credits, points, subscription, jobStats, recentPurchases] = await Promise.all([
      getCredits(orgId),
      getPoints(orgId),
      prisma.subscription.findFirst({
        where: { organizationId: orgId },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          stripeSubscriptionId: true,
          planTier: true,
          status: true,
          currentPeriodStart: true,
          currentPeriodEnd: true,
          cancelAtPeriodEnd: true,
          amount: true,
          interval: true,
        },
      }),
      prisma.job.groupBy({
        by: ["status"],
        where: { organizationId: orgId },
        _count: { _all: true },
      }),
      prisma.purchase.findMany({
        where: { organizationId: orgId },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          purchaseType: true,
          amount: true,
          status: true,
          creditsGranted: true,
          createdAt: true,
        },
      }),
    ]);

    // Format job stats into a flat object
    const jobs: Record<string, number> = {};
    let totalJobs = 0;
    for (const stat of jobStats) {
      jobs[stat.status] = stat._count._all;
      totalJobs += stat._count._all;
    }

    return NextResponse.json({
      data: {
        id: org.id,
        name: org.name,
        slug: org.slug,
        logo: org.logo,
        planTier: org.planTier,
        planPeriodEnd: org.planPeriodEnd?.toISOString() ?? null,
        stripeCustomerId: org.stripeCustomerId,
        createdAt: org.createdAt.toISOString(),
        teamSize: org._count.members,
        members: org.members.map((m) => ({
          id: m.id,
          role: m.role,
          departmentId: m.departmentId,
          name: m.account.name,
          email: m.account.email,
          avatar: m.account.avatar,
        })),
        credits,
        points,
        subscription: subscription
          ? {
              ...subscription,
              currentPeriodStart: subscription.currentPeriodStart?.toISOString() ?? null,
              currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() ?? null,
            }
          : null,
        jobs: { ...jobs, total: totalJobs },
        recentPurchases: recentPurchases.map((p) => ({
          ...p,
          createdAt: p.createdAt.toISOString(),
        })),
      },
    });
  } catch (error) {
    logger.error("Admin org detail error", {
      error: formatError(error),
      endpoint: "/api/admin/canopy/organizations/[orgId]",
    });
    return NextResponse.json({ error: "Failed to fetch organization details" }, { status: 500 });
  }
}
