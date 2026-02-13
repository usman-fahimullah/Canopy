import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { getAuthContext, canAccessJob, canManagePipeline } from "@/lib/access-control";
import { getTransitionPlan } from "@/lib/pipeline-service";

/**
 * GET /api/canopy/roles/[id]/applications/[appId]/transition-plan?toStage=interview
 *
 * Returns the transition plan for moving a candidate from their current stage
 * to a target stage. The frontend uses this to show contextual prompts
 * (e.g., "Schedule an interview?" or "Send rejection email?") before
 * committing the stage transition.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; appId: string }> }
) {
  try {
    const { id: jobId, appId } = await params;

    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canManagePipeline(ctx)) {
      return NextResponse.json(
        { error: "You do not have permission to manage pipeline" },
        { status: 403 }
      );
    }

    if (!canAccessJob(ctx, jobId)) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    // Parse target stage from query params
    const toStage = request.nextUrl.searchParams.get("toStage");
    if (!toStage) {
      return NextResponse.json({ error: "Missing toStage query parameter" }, { status: 422 });
    }

    // Get current stage
    const application = await prisma.application.findFirst({
      where: {
        id: appId,
        jobId,
        job: { organizationId: ctx.organizationId },
      },
      select: { stage: true },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const plan = await getTransitionPlan({
      applicationId: appId,
      jobId,
      fromStage: application.stage,
      toStage,
      organizationId: ctx.organizationId,
    });

    return NextResponse.json({ data: plan });
  } catch (error) {
    logger.error("Failed to get transition plan", {
      error: formatError(error),
      endpoint: "/api/canopy/roles/[id]/applications/[appId]/transition-plan",
    });
    return NextResponse.json({ error: "Failed to compute transition plan" }, { status: 500 });
  }
}
