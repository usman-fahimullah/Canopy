import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthenticatedAccount, isAdminAccount, unauthorizedResponse, forbiddenResponse } from "@/lib/auth-helpers";
import { logger, formatError } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const account = await getAuthenticatedAccount();
    if (!account) return unauthorizedResponse();
    if (!isAdminAccount(account)) return forbiddenResponse();

    // Get metrics in parallel
    const [
      pendingApplications,
      activeCoaches,
      totalSessions,
      bookings,
      reviews,
    ] = await Promise.all([
      // Pending coach applications
      prisma.coachProfile.count({
        where: { status: "PENDING" },
      }),

      // Active coaches
      prisma.coachProfile.count({
        where: { status: "ACTIVE" },
      }),

      // Total completed sessions
      prisma.session.count({
        where: { status: "COMPLETED" },
      }),

      // Get bookings for revenue calculation
      prisma.booking.findMany({
        where: { status: "PAID" },
        select: { platformFee: true },
        take: 1000,
      }),

      // Get reviews for average rating
      prisma.review.findMany({
        where: { isVisible: true },
        select: { rating: true },
        take: 1000,
      }),
    ]);

    // Calculate total platform revenue
    const totalRevenue = bookings.reduce((sum, b) => sum + b.platformFee, 0);

    // Calculate average rating
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

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

      // Rating distribution
      const ratingDist = [0, 0, 0, 0, 0]; // index 0 = 1 star, index 4 = 5 stars
      for (const r of reviews) {
        if (r.rating >= 1 && r.rating <= 5) {
          ratingDist[r.rating - 1]++;
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
      totalReviews: reviews.length,
      totalBookings: bookings.length,
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
