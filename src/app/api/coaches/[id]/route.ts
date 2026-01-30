import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET - Get single coach profile
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const coach = await prisma.coachProfile.findUnique({
      where: { id },
      include: {
        account: {
          select: { name: true, location: true, timezone: true },
        },
        reviews: {
          where: { isVisible: true },
          include: {
            mentee: {
              include: { account: { select: { name: true } } },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: {
          select: { reviews: true, sessions: true },
        },
      },
    });

    if (!coach) {
      return NextResponse.json({ error: "Coach not found" }, { status: 404 });
    }

    if (coach.status !== "ACTIVE" || !coach.isActive) {
      return NextResponse.json({ error: "Coach not available" }, { status: 404 });
    }

    // Format reviews
    const formattedReviews = coach.reviews.map((review) => {
      const name = review.mentee.account.name || "Anonymous";
      const nameParts = name.split(" ");
      const displayName = nameParts.length > 1
        ? `${nameParts[0]} ${nameParts[1][0]}.`
        : nameParts[0];

      return {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        coachResponse: review.coachResponse,
        reviewerName: displayName,
        createdAt: review.createdAt,
      };
    });

    // Parse availability if it's JSON
    let availability = null;
    try {
      if (coach.availability) {
        availability = JSON.parse(coach.availability);
      }
    } catch {
      // Not JSON, use as-is
    }

    return NextResponse.json({
      coach: {
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
        videoLink: coach.videoLink,
        rating: coach.rating,
        reviewCount: coach._count.reviews,
        totalSessions: coach._count.sessions,
        isFeatured: coach.isFeatured,
        location: coach.account.location,
        timezone: coach.account.timezone,
        availability,
        reviews: formattedReviews,
      },
    });
  } catch (error) {
    console.error("Fetch coach error:", error);
    return NextResponse.json({ error: "Failed to fetch coach" }, { status: 500 });
  }
}
