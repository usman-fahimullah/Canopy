import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

// POST — rate a mentor for a specific assignment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      include: { seekerProfile: { select: { id: true } } },
    });

    if (!account || !account.seekerProfile) {
      return NextResponse.json(
        { error: "Seeker profile required" },
        { status: 403 }
      );
    }

    const { id: assignmentId } = await params;

    const assignment = await prisma.mentorAssignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );
    }

    // Only the mentee can rate their mentor
    if (assignment.menteeId !== account.seekerProfile.id) {
      return NextResponse.json(
        { error: "Only the mentee can rate this mentor" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { rating, comment } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Create or update the review
    const review = await prisma.mentorReview.upsert({
      where: {
        assignmentId_menteeId: {
          assignmentId,
          menteeId: account.seekerProfile.id,
        },
      },
      create: {
        assignmentId,
        menteeId: account.seekerProfile.id,
        mentorId: assignment.mentorId,
        rating,
        comment: comment || null,
      },
      update: {
        rating,
        comment: comment || null,
      },
    });

    // Recalculate mentor's average rating
    const allReviews = await prisma.mentorReview.findMany({
      where: { mentorId: assignment.mentorId },
      select: { rating: true },
    });

    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.seekerProfile.update({
      where: { id: assignment.mentorId },
      data: {
        mentorRating: Math.round(avgRating * 10) / 10,
        mentorReviewCount: allReviews.length,
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("Error rating mentor:", error);
    return NextResponse.json(
      { error: "Failed to submit rating" },
      { status: 500 }
    );
  }
}
