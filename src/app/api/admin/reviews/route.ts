import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

// GET — list reviews for admin (with optional flagged filter)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin status
    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      include: {
        orgMemberships: { select: { role: true } },
      },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const isAdmin = account.orgMemberships.some(
      (m) => m.role === "OWNER" || m.role === "ADMIN"
    );

    if (!isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const flagged = searchParams.get("flagged");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: Record<string, unknown> = {};
    if (flagged === "true") {
      where.isFlagged = true;
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        mentee: {
          include: { account: { select: { name: true, email: true } } },
        },
        coach: {
          select: { firstName: true, lastName: true, id: true },
        },
        session: {
          select: { scheduledAt: true, id: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Admin fetch reviews error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// PATCH — admin hide/unhide/unflag review
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      include: {
        orgMemberships: { select: { role: true } },
      },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const isAdmin = account.orgMemberships.some(
      (m) => m.role === "OWNER" || m.role === "ADMIN"
    );

    if (!isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { reviewId, action } = body;

    if (!reviewId || !action) {
      return NextResponse.json({ error: "reviewId and action required" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};

    switch (action) {
      case "hide":
        updateData.isVisible = false;
        break;
      case "unhide":
        updateData.isVisible = true;
        break;
      case "unflag":
        updateData.isFlagged = false;
        updateData.flagReason = null;
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: updateData,
    });

    // If hiding a review, recalculate coach rating
    if (action === "hide" || action === "unhide") {
      const visibleReviews = await prisma.review.findMany({
        where: { coachId: updated.coachId, isVisible: true },
        select: { rating: true },
      });

      const avgRating = visibleReviews.length > 0
        ? visibleReviews.reduce((sum, r) => sum + r.rating, 0) / visibleReviews.length
        : 0;

      await prisma.coachProfile.update({
        where: { id: updated.coachId },
        data: {
          rating: avgRating,
          reviewCount: visibleReviews.length,
        },
      });
    }

    return NextResponse.json({ success: true, review: updated });
  } catch (error) {
    console.error("Admin update review error:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}
