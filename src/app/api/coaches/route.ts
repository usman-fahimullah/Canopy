import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";

// GET - List active coaches for browse page
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sector = searchParams.get("sector");
    const expertise = searchParams.get("expertise");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minRating = searchParams.get("minRating");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "rating";
    const featured = searchParams.get("featured");

    // Build where clause
    const where: Record<string, unknown> = {
      status: "ACTIVE",
      isActive: true,
    };

    if (sector) {
      where.sectors = { has: sector };
    }

    if (expertise) {
      where.expertise = { has: expertise };
    }

    if (minPrice || maxPrice) {
      const sessionRate: Record<string, number> = {};
      const minPriceNum = minPrice ? parseInt(minPrice) : NaN;
      const maxPriceNum = maxPrice ? parseInt(maxPrice) : NaN;
      if (!Number.isNaN(minPriceNum)) sessionRate.gte = minPriceNum * 100;
      if (!Number.isNaN(maxPriceNum)) sessionRate.lte = maxPriceNum * 100;
      if (Object.keys(sessionRate).length > 0) where.sessionRate = sessionRate;
    }

    if (minRating) {
      const ratingNum = parseFloat(minRating);
      if (!Number.isNaN(ratingNum) && ratingNum >= 0 && ratingNum <= 5) {
        where.rating = { gte: ratingNum };
      }
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { headline: { contains: search, mode: "insensitive" } },
        { bio: { contains: search, mode: "insensitive" } },
      ];
    }

    // Build orderBy
    let orderBy: Record<string, string> | Record<string, string>[] = { rating: "desc" };
    switch (sort) {
      case "price_low":
        orderBy = { sessionRate: "asc" };
        break;
      case "price_high":
        orderBy = { sessionRate: "desc" };
        break;
      case "sessions":
        orderBy = { totalSessions: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      default:
        orderBy = [{ isFeatured: "desc" }, { rating: "desc" }];
    }

    const coaches = await prisma.coachProfile.findMany({
      where,
      include: {
        account: {
          select: { name: true },
        },
        _count: {
          select: { reviews: true },
        },
      },
      orderBy,
      take: 100,
    });

    // Format for frontend
    const formattedCoaches = coaches.map((coach) => ({
      id: coach.id,
      firstName: coach.firstName,
      lastName: coach.lastName,
      photoUrl: coach.photoUrl,
      headline: coach.headline,
      bio: coach.bio,
      expertise: coach.expertise,
      sectors: coach.sectors,
      yearsInClimate: coach.yearsInClimate,
      sessionRate: coach.sessionRate,
      sessionDuration: coach.sessionDuration,
      rating: coach.rating,
      reviewCount: coach._count.reviews,
      totalSessions: coach.totalSessions,
      isFeatured: coach.isFeatured,
    }));

    return NextResponse.json({ coaches: formattedCoaches });
  } catch (error) {
    logger.error("Fetch coaches error", { error: formatError(error), endpoint: "/api/coaches" });
    return NextResponse.json({ error: "Failed to fetch coaches" }, { status: 500 });
  }
}
