import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { safeJsonParse } from "@/lib/safe-json";
import {
  createStageChangedNotification,
  createApplicationRejectedNotification,
} from "@/lib/notifications/hiring";
import { getAuthContext, canAccessJob, canManagePipeline } from "@/lib/access-control";

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

    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only OWNER/ADMIN/RECRUITER/HIRING_MANAGER can move pipeline stages
    if (!canManagePipeline(ctx)) {
      return NextResponse.json(
        { error: "You do not have permission to move candidates" },
        { status: 403 }
      );
    }

    // Verify the job is accessible to this user (scoped roles only see assigned jobs)
    if (!canAccessJob(ctx, jobId)) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    // Verify the job belongs to the user's org
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

    // Parse and validate the requested stage exists in job's pipeline
    const validStages = safeJsonParse<{ id: string; name: string }[]>(job.stages, [
      { id: "applied", name: "Applied" },
      { id: "screening", name: "Screening" },
      { id: "interview", name: "Interview" },
      { id: "offer", name: "Offer" },
      { id: "hired", name: "Hired" },
    ]);

    const body = await request.json();
    const result = UpdateApplicationSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }

    const { stage, stageOrder } = result.data;

    // "rejected" and "talent-pool" are special action stages that can be
    // applied from any point in the pipeline (via the candidate detail page).
    // They are NOT part of the linear pipeline columns and bypass stage validation.
    const SPECIAL_ACTION_STAGES = ["rejected", "talent-pool"];
    const isSpecialStage = SPECIAL_ACTION_STAGES.includes(stage);

    if (!isSpecialStage) {
      const stageExists = validStages.some((s) => s.id === stage);
      if (!stageExists) {
        return NextResponse.json(
          {
            error: `Invalid stage "${stage}". Valid stages: ${validStages.map((s) => s.id).join(", ")}`,
          },
          { status: 422 }
        );
      }
    }

    // --- Offer stage: signal frontend to open the Offer Details Modal ---
    if (stage === "offer") {
      // Check if an offer already exists for this application
      const existingOffer = await prisma.offerRecord.findUnique({
        where: { applicationId: appId },
        select: { id: true, status: true },
      });

      if (existingOffer) {
        // Offer already exists — just update the stage
        await prisma.application.updateMany({
          where: { id: appId, jobId },
          data: { stage, stageOrder },
        });
        return NextResponse.json({
          success: true,
          stage,
          stageOrder,
          offerId: existingOffer.id,
          offerStatus: existingOffer.status,
        });
      }

      // No offer exists — tell frontend to open the modal
      return NextResponse.json({
        success: true,
        stage,
        stageOrder,
        requiresOfferModal: true,
        applicationId: appId,
      });
    }

    // --- Hired stage: verify offer is SIGNED before allowing ---
    if (stage === "hired") {
      const offer = await prisma.offerRecord.findUnique({
        where: { applicationId: appId },
        select: { id: true, status: true },
      });

      if (offer && offer.status !== "SIGNED") {
        return NextResponse.json(
          {
            error: `Cannot move to hired: offer is in ${offer.status} status. Offer must be signed first.`,
          },
          { status: 400 }
        );
      }
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
        ...(stage === "offer" ? { offeredAt: new Date() } : {}),
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

    // --- Fire-and-forget: notify the candidate of the stage change ---
    (async () => {
      try {
        // Fetch candidate and job info for the notification
        const appData = await prisma.application.findUnique({
          where: { id: appId },
          select: {
            stage: true,
            seeker: {
              select: {
                account: { select: { email: true, name: true } },
              },
            },
            job: {
              select: {
                title: true,
                organization: { select: { name: true } },
              },
            },
          },
        });

        if (!appData?.seeker?.account?.email) return;

        const candidateEmail = appData.seeker.account.email;
        const candidateName = appData.seeker.account.name ?? "Candidate";
        const jobTitle = appData.job.title;
        const companyName = appData.job.organization?.name ?? "the company";

        if (stage === "rejected") {
          await createApplicationRejectedNotification({
            applicationId: appId,
            candidateEmail,
            candidateName,
            jobTitle,
            companyName,
          });
        } else {
          // Notify for all forward-moving stages (screening, interview, offer, hired)
          const stageName = validStages.find((s) => s.id === stage)?.name ?? stage;
          await createStageChangedNotification({
            applicationId: appId,
            candidateEmail,
            candidateName,
            jobTitle,
            companyName,
            previousStage: "previous", // We don't track the old stage in this endpoint
            newStage: stageName,
          });
        }
      } catch (notifErr) {
        logger.error("Failed to send stage change notification (non-blocking)", {
          error: formatError(notifErr),
          applicationId: appId,
          newStage: stage,
        });
      }
    })();

    return NextResponse.json({ success: true, stage, stageOrder });
  } catch (error) {
    logger.error("Error updating application stage", {
      error: formatError(error),
      endpoint: "/api/canopy/roles/[id]/applications/[appId]",
    });
    return NextResponse.json({ error: "Failed to update application stage" }, { status: 500 });
  }
}
