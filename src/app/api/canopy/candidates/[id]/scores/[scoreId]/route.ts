import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { getAuthContext, canAccessJob } from "@/lib/access-control";

/**
 * PATCH /api/canopy/candidates/[id]/scores/[scoreId]
 *
 * Update an existing review score. Only the scorer can edit their own review.
 */
const UpdateScoreSchema = z.object({
  overallRating: z.number().int().min(1).max(5),
  recommendation: z.enum(["STRONG_YES", "YES", "NEUTRAL", "NO", "STRONG_NO"]),
  comments: z.string().nullable().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; scoreId: string }> }
) {
  try {
    const { id: seekerId, scoreId } = await params;

    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch score and verify ownership
    const score = await prisma.score.findUnique({
      where: { id: scoreId },
      select: {
        id: true,
        scorerId: true,
        application: {
          select: { seekerId: true, jobId: true, job: { select: { organizationId: true } } },
        },
      },
    });

    if (!score || score.application.seekerId !== seekerId) {
      return NextResponse.json({ error: "Score not found" }, { status: 404 });
    }

    if (score.application.job.organizationId !== ctx.organizationId) {
      return NextResponse.json({ error: "Score not found" }, { status: 404 });
    }

    if (!canAccessJob(ctx, score.application.jobId)) {
      return NextResponse.json({ error: "Score not found" }, { status: 404 });
    }

    // Only the scorer can edit their own review
    if (score.scorerId !== ctx.memberId) {
      return NextResponse.json({ error: "You can only edit your own reviews" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = UpdateScoreSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const updated = await prisma.score.update({
      where: { id: scoreId },
      data: {
        overallRating: parsed.data.overallRating,
        recommendation: parsed.data.recommendation,
        comments: parsed.data.comments ?? null,
      },
      select: {
        id: true,
        overallRating: true,
        recommendation: true,
        comments: true,
        createdAt: true,
        scorer: {
          select: {
            id: true,
            account: { select: { name: true, avatar: true } },
          },
        },
      },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    logger.error("Failed to update score", { error: formatError(error) });
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

/**
 * DELETE /api/canopy/candidates/[id]/scores/[scoreId]
 *
 * Delete a review score. Only the scorer or an admin can delete.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; scoreId: string }> }
) {
  try {
    const { id: seekerId, scoreId } = await params;

    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const score = await prisma.score.findUnique({
      where: { id: scoreId },
      select: {
        id: true,
        scorerId: true,
        application: {
          select: { seekerId: true, jobId: true, job: { select: { organizationId: true } } },
        },
      },
    });

    if (!score || score.application.seekerId !== seekerId) {
      return NextResponse.json({ error: "Score not found" }, { status: 404 });
    }

    if (score.application.job.organizationId !== ctx.organizationId) {
      return NextResponse.json({ error: "Score not found" }, { status: 404 });
    }

    if (!canAccessJob(ctx, score.application.jobId)) {
      return NextResponse.json({ error: "Score not found" }, { status: 404 });
    }

    // Only the scorer or an admin can delete
    const isOwner = score.scorerId === ctx.memberId;
    const isAdmin = ctx.role === "ADMIN";
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "You can only delete your own reviews" }, { status: 403 });
    }

    await prisma.score.delete({ where: { id: scoreId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Failed to delete score", { error: formatError(error) });
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
