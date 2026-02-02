import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";
import { AdminReviewActionSchema } from "@/lib/validators/api";

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
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

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
    logger.error("Admin fetch reviews error", { error: formatError(error), endpoint: "/api/admin/reviews" });
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
    const result = AdminReviewActionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }
    const { reviewId, action } = result.data;

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
    }

    // Wrap review update and rating recalculation in a transaction
    const updated = await prisma.$transaction(async (tx) => {
      const updated = await tx.review.update({
        where: { id: reviewId },
        data: updateData,
      });

      // If hiding/unhiding a review, recalculate coach rating
      if (action === "hide" || action === "unhide") {
        const visibleReviews = await tx.review.findMany({
          where: { coachId: updated.coachId, isVisible: true },
          select: { rating: true },
        });

        const avgRating = visibleReviews.length > 0
          ? visibleReviews.reduce((sum, r) => sum + r.rating, 0) / visibleReviews.length
          : 0;

        await tx.coachProfile.update({
          where: { id: updated.coachId },
          data: {
            rating: avgRating,
            reviewCount: visibleReviews.length,
          },
        });
      }

      return updated;
    });

    return NextResponse.json({ success: true, review: updated });
  } catch (error) {
    logger.error("Admin update review error", { error: formatError(error), endpoint: "/api/admin/reviews" });
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}
