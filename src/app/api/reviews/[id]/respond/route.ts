import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";
import { RespondToReviewSchema } from "@/lib/validators/api";

// POST — coach writes response to a review
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reviewId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      include: { coachProfile: true },
    });

    if (!account?.coachProfile) {
      return NextResponse.json({ error: "Only coaches can respond to reviews" }, { status: 403 });
    }

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (review.coachId !== account.coachProfile.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    if (review.coachResponse) {
      return NextResponse.json({ error: "Response already submitted" }, { status: 400 });
    }

    const body = await request.json();
    const result = RespondToReviewSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }
    const { response } = result.data;

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: { coachResponse: response.trim() },
    });

    return NextResponse.json({ success: true, review: updated });
  } catch (error) {
    logger.error("Review respond error", { error: formatError(error), endpoint: "/api/reviews/[id]/respond" });
    return NextResponse.json(
      { error: "Failed to respond to review" },
      { status: 500 }
    );
  }
}
