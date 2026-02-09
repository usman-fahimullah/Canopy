import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { getAuthContext, canAccessJob } from "@/lib/access-control";
import {
  ASSIGNABLE_PHASE_GROUPS,
  resolveJobStages,
  type PhaseGroup,
} from "@/lib/pipeline/stage-registry";

/**
 * GET /api/canopy/roles/[id]/pipeline
 *
 * Get the pipeline stages for a specific job.
 * Returns the full stage definitions with phase groups.
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: jobId } = await params;

    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canAccessJob(ctx, jobId)) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        organizationId: ctx.organizationId,
      },
      select: { id: true, stages: true },
    });

    if (!job) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    const stages = resolveJobStages(job.stages);

    return NextResponse.json({
      data: {
        stages: stages.map((s) => ({
          id: s.id,
          name: s.name,
          phaseGroup: s.phaseGroup,
          isBuiltIn: s.isBuiltIn,
        })),
        assignablePhaseGroups: ASSIGNABLE_PHASE_GROUPS,
      },
    });
  } catch (error) {
    logger.error("Error fetching pipeline stages", {
      error: formatError(error),
      endpoint: "/api/canopy/roles/[id]/pipeline",
    });
    return NextResponse.json({ error: "Failed to fetch pipeline stages" }, { status: 500 });
  }
}

/**
 * PUT /api/canopy/roles/[id]/pipeline
 *
 * Update the pipeline stages for a specific job.
 * Requires ADMIN or RECRUITER role.
 */

const validPhaseGroups = ASSIGNABLE_PHASE_GROUPS.map((g) => g.value);

const StageSchema = z.object({
  id: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Stage ID must be lowercase alphanumeric with hyphens"),
  name: z.string().min(1).max(100),
  phaseGroup: z.enum(validPhaseGroups as [string, ...string[]]) as z.ZodType<PhaseGroup>,
});

const UpdatePipelineSchema = z.object({
  stages: z.array(StageSchema).min(2, "Pipeline must have at least 2 stages").max(20),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: jobId } = await params;

    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only ADMIN and RECRUITER can modify pipeline
    if (!["ADMIN", "RECRUITER"].includes(ctx.role)) {
      return NextResponse.json(
        { error: "Only admins and recruiters can modify pipeline stages" },
        { status: 403 }
      );
    }

    if (!canAccessJob(ctx, jobId)) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        organizationId: ctx.organizationId,
      },
      select: { id: true },
    });

    if (!job) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    const body = await request.json();
    const result = UpdatePipelineSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }

    const { stages } = result.data;

    // Validate no duplicate IDs
    const ids = stages.map((s) => s.id);
    if (new Set(ids).size !== ids.length) {
      return NextResponse.json({ error: "Duplicate stage IDs are not allowed" }, { status: 422 });
    }

    // Must have at least one "applied" phase group stage and one "hired" stage
    const hasApplied = stages.some((s) => s.phaseGroup === "applied");
    const hasHired = stages.some((s) => s.phaseGroup === "hired");
    if (!hasApplied || !hasHired) {
      return NextResponse.json(
        { error: "Pipeline must include at least one Applied and one Hired stage" },
        { status: 422 }
      );
    }

    // Serialize stages to JSON
    const stagesJson = JSON.stringify(
      stages.map((s) => ({
        id: s.id,
        name: s.name,
        phaseGroup: s.phaseGroup,
      }))
    );

    await prisma.job.update({
      where: { id: jobId },
      data: { stages: stagesJson },
    });

    logger.info("Pipeline stages updated", {
      jobId,
      stageCount: stages.length,
      endpoint: "/api/canopy/roles/[id]/pipeline",
    });

    return NextResponse.json({
      data: { stages: stages.map((s) => ({ id: s.id, name: s.name, phaseGroup: s.phaseGroup })) },
    });
  } catch (error) {
    logger.error("Error updating pipeline stages", {
      error: formatError(error),
      endpoint: "/api/canopy/roles/[id]/pipeline",
    });
    return NextResponse.json({ error: "Failed to update pipeline stages" }, { status: 500 });
  }
}
