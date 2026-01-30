import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // TODO: Add proper admin role check

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
      }),

      // Get reviews for average rating
      prisma.review.findMany({
        where: { isVisible: true },
        select: { rating: true },
      }),
    ]);

    // Calculate total platform revenue
    const totalRevenue = bookings.reduce((sum, b) => sum + b.platformFee, 0);

    // Calculate average rating
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    return NextResponse.json({
      pendingApplications,
      activeCoaches,
      totalSessions,
      totalRevenue,
      avgRating,
      totalReviews: reviews.length,
      totalBookings: bookings.length,
    });
  } catch (error) {
    console.error("Fetch metrics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}
