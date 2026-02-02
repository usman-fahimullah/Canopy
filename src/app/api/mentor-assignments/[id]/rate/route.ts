import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";
import { RateMentorSchema } from "@/lib/validators/api";

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
    const result = RateMentorSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }
    const { rating, comment } = result.data;


    // Capture for use inside transaction closure (TypeScript narrowing doesn't carry into async callbacks)
    const seekerProfileId = account.seekerProfile.id;

    // Create or update the review and recalculate rating in a transaction
    const review = await prisma.$transaction(async (tx) => {
      const rev = await tx.mentorReview.upsert({
        where: {
          assignmentId_menteeId: {
            assignmentId,
            menteeId: seekerProfileId,
          },
        },
        create: {
          assignmentId,
          menteeId: seekerProfileId,
          mentorId: assignment.mentorId,
          rating,
          comment: comment || null,
        },
        update: {
          rating,
          comment: comment || null,
        },
      });

      const allReviews = await tx.mentorReview.findMany({
        where: { mentorId: assignment.mentorId },
        select: { rating: true },
      });

      const avgRating =
        allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

      await tx.seekerProfile.update({
        where: { id: assignment.mentorId },
        data: {
          mentorRating: Math.round(avgRating * 10) / 10,
          mentorReviewCount: allReviews.length,
        },
      });

      return rev;
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    logger.error("Error rating mentor", { error: formatError(error), endpoint: "/api/mentor-assignments/rate" });
    return NextResponse.json(
      { error: "Failed to submit rating" },
      { status: 500 }
    );
  }
}
