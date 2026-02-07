import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { getAuthContext, canSubmitScorecard, canAccessJob } from "@/lib/access-control";

/**
 * POST /api/canopy/candidates/[id]/scores
 *
 * Submit a review score for a candidate's application.
 */
const CreateScoreSchema = z.object({
  applicationId: z.string().min(1),
  overallRating: z.number().int().min(1).max(5),
  recommendation: z.enum(["STRONG_YES", "YES", "NEUTRAL", "NO", "STRONG_NO"]),
  comments: z.string().optional(),
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: seekerId } = await params;

    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canSubmitScorecard(ctx)) {
      return NextResponse.json({ error: "Viewers cannot submit scores" }, { status: 403 });
    }

    // --- Validate body ---
    const body = await request.json();
    const parsed = CreateScoreSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const { applicationId, overallRating, recommendation, comments } = parsed.data;

    // --- Verify application belongs to this seeker + accessible job ---
    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        seekerId,
        job: { organizationId: ctx.organizationId },
      },
      select: { id: true, jobId: true },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Scoped access: verify user can access this job
    if (!canAccessJob(ctx, application.jobId)) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // --- Create score ---
    const score = await prisma.score.create({
      data: {
        applicationId,
        scorerId: ctx.memberId,
        overallRating,
        recommendation,
        comments: comments ?? null,
        responses: "{}",
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
            account: {
              select: { name: true, avatar: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ data: score }, { status: 201 });
  } catch (error) {
    logger.error("Failed to create score", {
      error: formatError(error),
    });
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
