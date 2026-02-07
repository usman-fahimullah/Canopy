import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthenticatedAccount, isAdminAccount, unauthorizedResponse, forbiddenResponse } from "@/lib/auth-helpers";
import { logger, formatError } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const account = await getAuthenticatedAccount();
    if (!account) return unauthorizedResponse();
    if (!isAdminAccount(account)) return forbiddenResponse();

    // Get metrics in parallel using SQL aggregates instead of in-memory calculations
    const [
      pendingApplications,
      activeCoaches,
      totalSessions,
      revenueAgg,
      reviewAgg,
    ] = await Promise.all([
      prisma.coachProfile.count({
        where: { status: "PENDING" },
      }),
      prisma.coachProfile.count({
        where: { status: "ACTIVE" },
      }),
      prisma.session.count({
        where: { status: "COMPLETED" },
      }),
      // Use Prisma aggregate for revenue instead of loading all bookings
      prisma.booking.aggregate({
        where: { status: "PAID" },
        _sum: { platformFee: true },
        _count: { _all: true },
      }),
      // Use Prisma aggregate for ratings instead of loading all reviews
      prisma.review.aggregate({
        where: { isVisible: true },
        _avg: { rating: true },
        _count: { _all: true },
      }),
    ]);

    const totalRevenue = revenueAgg._sum.platformFee ?? 0;
    const avgRating = reviewAgg._avg.rating ?? 0;

    // Extended analytics if requested
    const { searchParams } = new URL(request.url);
    const extended = searchParams.get("extended") === "true";

    let analytics = {};
    if (extended) {
      // Monthly session counts (last 6 months)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const [
        recentSessions,
        recentBookings,
        totalSeekers,
        totalMentors,
        cancelledSessions,
        noShowSessions,
      ] = await Promise.all([
        prisma.session.findMany({
          where: { scheduledAt: { gte: sixMonthsAgo } },
          select: { scheduledAt: true, status: true },
          orderBy: { scheduledAt: "asc" },
          take: 1000,
        }),
        prisma.booking.findMany({
          where: { createdAt: { gte: sixMonthsAgo }, status: "PAID" },
          select: { createdAt: true, amount: true, platformFee: true },
          orderBy: { createdAt: "asc" },
          take: 1000,
        }),
        prisma.seekerProfile.count(),
        prisma.seekerProfile.count({ where: { isMentor: true } }),
        prisma.session.count({ where: { status: "CANCELLED" } }),
        prisma.session.count({ where: { status: "NO_SHOW" } }),
      ]);

      // Group sessions by month
      const sessionsByMonth: Record<string, { total: number; completed: number; cancelled: number }> = {};
      for (const s of recentSessions) {
        const key = `${s.scheduledAt.getFullYear()}-${String(s.scheduledAt.getMonth() + 1).padStart(2, "0")}`;
        if (!sessionsByMonth[key]) sessionsByMonth[key] = { total: 0, completed: 0, cancelled: 0 };
        sessionsByMonth[key].total++;
        if (s.status === "COMPLETED") sessionsByMonth[key].completed++;
        if (s.status === "CANCELLED") sessionsByMonth[key].cancelled++;
      }

      // Group revenue by month
      const revenueByMonth: Record<string, { amount: number; fees: number }> = {};
      for (const b of recentBookings) {
        const key = `${b.createdAt.getFullYear()}-${String(b.createdAt.getMonth() + 1).padStart(2, "0")}`;
        if (!revenueByMonth[key]) revenueByMonth[key] = { amount: 0, fees: 0 };
        revenueByMonth[key].amount += b.amount;
        revenueByMonth[key].fees += b.platformFee;
      }

      // Rating distribution via SQL groupBy
      const ratingGroupBy = await prisma.review.groupBy({
        by: ["rating"],
        where: { isVisible: true },
        _count: { _all: true },
      });
      const ratingDist = [0, 0, 0, 0, 0]; // index 0 = 1 star, index 4 = 5 stars
      for (const r of ratingGroupBy) {
        if (r.rating >= 1 && r.rating <= 5) {
          ratingDist[r.rating - 1] = r._count._all;
        }
      }

      // Completion rate
      const totalNonPending = totalSessions + cancelledSessions + noShowSessions;
      const completionRate = totalNonPending > 0 ? (totalSessions / totalNonPending) * 100 : 0;

      analytics = {
        sessionsByMonth,
        revenueByMonth,
        ratingDistribution: ratingDist,
        totalSeekers,
        totalMentors,
        cancelledSessions,
        noShowSessions,
        completionRate: Math.round(completionRate * 10) / 10,
      };
    }

    return NextResponse.json({
      pendingApplications,
      activeCoaches,
      totalSessions,
      totalRevenue,
      avgRating,
      totalReviews: reviewAgg._count._all,
      totalBookings: revenueAgg._count._all,
      ...analytics,
    });
  } catch (error) {
    logger.error("Fetch metrics error", { error: formatError(error), endpoint: "/api/admin/metrics" });
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}
