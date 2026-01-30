import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

// POST - Create a review
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId, rating, comment } = body;

    if (!sessionId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Invalid rating (must be 1-5)" },
        { status: 400 }
      );
    }

    // Get the session
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        mentee: { include: { account: true } },
        coach: true,
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Verify user is the mentee
    if (session.mentee.account.supabaseId !== user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: { sessionId },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "Review already submitted for this session" },
        { status: 400 }
      );
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        sessionId,
        menteeId: session.menteeId,
        coachId: session.coachId,
        rating,
        comment,
      },
    });

    // Update coach's average rating
    const allReviews = await prisma.review.findMany({
      where: { coachId: session.coachId, isVisible: true },
      select: { rating: true },
    });

    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.coachProfile.update({
      where: { id: session.coachId },
      data: {
        rating: avgRating,
        reviewCount: allReviews.length,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("Create review error:", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}

// GET - Get reviews for a coach
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const coachId = searchParams.get("coachId");

    if (!coachId) {
      return NextResponse.json({ error: "coachId required" }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: { coachId, isVisible: true },
      include: {
        mentee: {
          include: {
            account: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Format reviews for display (first name + last initial)
    const formattedReviews = reviews.map((review) => {
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

    return NextResponse.json({ reviews: formattedReviews });
  } catch (error) {
    console.error("Fetch reviews error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}
