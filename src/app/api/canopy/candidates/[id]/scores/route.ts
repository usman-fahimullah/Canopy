import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { getAuthContext, canSubmitScorecard, canAccessJob } from "@/lib/access-control";
import { getScoresForApplication } from "@/lib/services/scoring-service";

/**
 * GET /api/canopy/candidates/[id]/scores?applicationId=xxx
 *
 * Fetch scores for an application with blind review enforcement.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: seekerId } = await params;

    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const applicationId = request.nextUrl.searchParams.get("applicationId");
    if (!applicationId) {
      return NextResponse.json({ error: "Missing applicationId query parameter" }, { status: 422 });
    }

    // Verify application belongs to this seeker + accessible job
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

    if (!canAccessJob(ctx, application.jobId)) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const result = await getScoresForApplication({
      applicationId,
      jobId: application.jobId,
      requesterId: ctx.memberId,
      requesterRole: ctx.role,
    });

    return NextResponse.json({ data: result });
  } catch (error) {
    logger.error("Failed to fetch scores", {
      error: formatError(error),
    });
    return NextResponse.json({ error: "Failed to fetch scores" }, { status: 500 });
  }
}

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
  /** Structured scorecard responses (JSON string with { ratings, averageRating }) */
  responses: z.string().optional(),
  /** Pipeline stage this score is being submitted at */
  stageId: z.string().optional(),
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

    const { applicationId, overallRating, recommendation, comments, responses, stageId } =
      parsed.data;

    // --- Verify application belongs to this seeker + accessible job ---
    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        seekerId,
        job: { organizationId: ctx.organizationId },
      },
      select: { id: true, jobId: true, stage: true },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Scoped access: verify user can access this job
    if (!canAccessJob(ctx, application.jobId)) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Default stageId to the application's current stage when not provided.
    // This ensures the @@unique([applicationId, scorerId, stageId]) constraint
    // works correctly — PostgreSQL treats NULL != NULL, so without a value
    // the constraint would allow unlimited duplicate scores.
    const resolvedStageId = stageId ?? application.stage;

    // --- Create score ---
    const score = await prisma.score.create({
      data: {
        applicationId,
        scorerId: ctx.memberId,
        overallRating,
        recommendation,
        comments: comments ?? null,
        responses: responses ?? "{}",
        stageId: resolvedStageId,
      },
      select: {
        id: true,
        overallRating: true,
        recommendation: true,
        comments: true,
        responses: true,
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
