import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";

/**
 * PATCH /api/canopy/roles/[id]/applications/[appId]
 *
 * Update an application's pipeline stage (used for drag-and-drop in Kanban).
 * Org-scoped: validates the job belongs to the authenticated user's org.
 */
const UpdateApplicationSchema = z.object({
  stage: z.string().min(1, "Stage is required"),
  stageOrder: z.number().int().min(0).optional().default(0),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; appId: string }> }
) {
  try {
    const { id: jobId, appId } = await params;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const membership = await prisma.organizationMember.findFirst({
      where: { accountId: account.id },
    });

    if (!membership) {
      return NextResponse.json({ error: "Organization membership required" }, { status: 403 });
    }

    // Verify the job belongs to the user's org
    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        organizationId: membership.organizationId,
      },
      select: { id: true, stages: true },
    });

    if (!job) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    // Parse and validate the requested stage exists in job's pipeline
    let validStages: { id: string; name: string }[] = [];
    try {
      validStages = JSON.parse(job.stages);
    } catch {
      validStages = [
        { id: "applied", name: "Applied" },
        { id: "screening", name: "Screening" },
        { id: "interview", name: "Interview" },
        { id: "offer", name: "Offer" },
        { id: "hired", name: "Hired" },
      ];
    }

    const body = await request.json();
    const result = UpdateApplicationSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }

    const { stage, stageOrder } = result.data;

    const stageExists = validStages.some((s) => s.id === stage);
    if (!stageExists) {
      return NextResponse.json(
        {
          error: `Invalid stage "${stage}". Valid stages: ${validStages.map((s) => s.id).join(", ")}`,
        },
        { status: 422 }
      );
    }

    // Update the application — scoped to the correct job
    const updated = await prisma.application.updateMany({
      where: {
        id: appId,
        jobId,
      },
      data: {
        stage,
        stageOrder,
        // Track milestones
        ...(stage === "hired" ? { hiredAt: new Date() } : {}),
        ...(stage === "rejected" ? { rejectedAt: new Date() } : {}),
      },
    });

    if (updated.count === 0) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    logger.info("Application stage updated", {
      applicationId: appId,
      jobId,
      newStage: stage,
      endpoint: "/api/canopy/roles/[id]/applications/[appId]",
    });

    return NextResponse.json({ success: true, stage, stageOrder });
  } catch (error) {
    logger.error("Error updating application stage", {
      error: formatError(error),
      endpoint: "/api/canopy/roles/[id]/applications/[appId]",
    });
    return NextResponse.json({ error: "Failed to update application stage" }, { status: 500 });
  }
}
