import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  getAuthenticatedAccount,
  isAdminAccount,
  unauthorizedResponse,
  forbiddenResponse,
} from "@/lib/auth-helpers";
import { logger, formatError } from "@/lib/logger";

/**
 * GET /api/admin/canopy/billing/overview
 *
 * Platform billing stats for admin dashboard:
 * - MRR (monthly recurring revenue)
 * - Organization count by plan tier
 * - Recent subscription and purchase activity
 */
export async function GET() {
  try {
    const account = await getAuthenticatedAccount();
    if (!account) return unauthorizedResponse();
    if (!isAdminAccount(account)) return forbiddenResponse();

    const [
      orgsByTier,
      activeSubscriptions,
      recentPurchases,
      totalRevenue,
      recentSubscriptionChanges,
    ] = await Promise.all([
      // Count orgs by plan tier
      prisma.organization.groupBy({
        by: ["planTier"],
        _count: { _all: true },
      }),

      // Active subscriptions for MRR calculation
      prisma.subscription.findMany({
        where: { status: "ACTIVE" },
        select: {
          amount: true,
          interval: true,
          planTier: true,
        },
      }),

      // Recent completed purchases (last 30 days)
      prisma.purchase.findMany({
        where: {
          status: "COMPLETED",
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
        select: {
          id: true,
          purchaseType: true,
          amount: true,
          status: true,
          createdAt: true,
          organization: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),

      // Total one-time purchase revenue (all time)
      prisma.purchase.aggregate({
        where: { status: "COMPLETED" },
        _sum: { amount: true },
        _count: { _all: true },
      }),

      // Recent subscription events (last 30 days)
      prisma.subscription.findMany({
        where: {
          updatedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
        select: {
          id: true,
          planTier: true,
          status: true,
          amount: true,
          interval: true,
          cancelAtPeriodEnd: true,
          createdAt: true,
          updatedAt: true,
          organization: { select: { id: true, name: true } },
        },
        orderBy: { updatedAt: "desc" },
        take: 10,
      }),
    ]);

    // Calculate MRR: sum of monthly amounts + annual amounts / 12
    let mrr = 0;
    for (const sub of activeSubscriptions) {
      if (sub.interval === "month") {
        mrr += sub.amount;
      } else if (sub.interval === "year") {
        mrr += Math.round(sub.amount / 12);
      }
    }

    // Format org tier counts
    const tierCounts: Record<string, number> = {};
    let totalOrgs = 0;
    for (const tier of orgsByTier) {
      tierCounts[tier.planTier] = tier._count._all;
      totalOrgs += tier._count._all;
    }

    // Count subscribers by tier
    const subscribersByTier: Record<string, number> = {};
    for (const sub of activeSubscriptions) {
      subscribersByTier[sub.planTier] = (subscribersByTier[sub.planTier] || 0) + 1;
    }

    return NextResponse.json({
      data: {
        mrr, // in cents
        arr: mrr * 12, // annualized, in cents
        totalOrgs,
        tierCounts: {
          PAY_AS_YOU_GO: tierCounts.PAY_AS_YOU_GO || 0,
          LISTINGS: tierCounts.LISTINGS || 0,
          ATS: tierCounts.ATS || 0,
        },
        activeSubscribers: activeSubscriptions.length,
        subscribersByTier: {
          LISTINGS: subscribersByTier.LISTINGS || 0,
          ATS: subscribersByTier.ATS || 0,
        },
        purchaseStats: {
          totalRevenue: totalRevenue._sum.amount || 0, // in cents
          totalPurchases: totalRevenue._count._all,
        },
        recentPurchases: recentPurchases.map((p) => ({
          id: p.id,
          purchaseType: p.purchaseType,
          amount: p.amount,
          status: p.status,
          createdAt: p.createdAt.toISOString(),
          organizationId: p.organization.id,
          organizationName: p.organization.name,
        })),
        recentSubscriptionChanges: recentSubscriptionChanges.map((s) => ({
          id: s.id,
          planTier: s.planTier,
          status: s.status,
          amount: s.amount,
          interval: s.interval,
          cancelAtPeriodEnd: s.cancelAtPeriodEnd,
          createdAt: s.createdAt.toISOString(),
          updatedAt: s.updatedAt.toISOString(),
          organizationId: s.organization.id,
          organizationName: s.organization.name,
        })),
      },
    });
  } catch (error) {
    logger.error("Admin billing overview error", {
      error: formatError(error),
      endpoint: "/api/admin/canopy/billing/overview",
    });
    return NextResponse.json({ error: "Failed to fetch billing overview" }, { status: 500 });
  }
}
