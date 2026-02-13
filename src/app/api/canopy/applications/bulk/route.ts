import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { z } from "zod";
import {
  createStageChangedNotification,
  createApplicationRejectedNotification,
} from "@/lib/notifications/hiring";
import { getAuthContext, canManagePipeline } from "@/lib/access-control";

/**
 * PATCH /api/canopy/applications/bulk
 *
 * Bulk update applications: move stage or reject
 * Validates all IDs belong to org's jobs before updating
 */

const BulkUpdateSchema = z.object({
  ids: z.array(z.string()).min(1, "At least one application ID required"),
  action: z.enum(["MOVE_STAGE", "REJECT"]),
  stage: z.string().optional(),
});

export async function PATCH(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canManagePipeline(ctx)) {
      return NextResponse.json(
        { error: "You do not have permission to move candidates" },
        { status: 403 }
      );
    }

    // Parse and validate body
    const body = await request.json();
    const result = BulkUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }

    const { ids, action, stage } = result.data;

    // Validate MOVE_STAGE has stage
    if (action === "MOVE_STAGE" && !stage) {
      return NextResponse.json(
        { error: "Stage is required for MOVE_STAGE action" },
        { status: 400 }
      );
    }

    // Verify all application IDs belong to organization's jobs
    // For scoped roles, also verify the jobs are accessible
    const applications = await prisma.application.findMany({
      where: {
        id: { in: ids },
        job: {
          organizationId: ctx.organizationId,
          ...(!ctx.hasFullAccess && ctx.assignedJobIds.length > 0
            ? { id: { in: ctx.assignedJobIds } }
            : {}),
        },
      },
      select: { id: true },
    });

    if (applications.length !== ids.length) {
      return NextResponse.json(
        { error: "Some applications do not belong to your organization or accessible jobs" },
        { status: 403 }
      );
    }

    // Perform bulk update
    const updateData: Record<string, unknown> = {};
    if (action === "MOVE_STAGE") {
      updateData.stage = stage;
    } else if (action === "REJECT") {
      updateData.stage = "rejected";
      updateData.rejectedAt = new Date();
    }

    const updated = await prisma.application.updateMany({
      where: {
        id: { in: ids },
        job: { organizationId: ctx.organizationId },
      },
      data: updateData,
    });

    logger.info("Bulk applications updated", {
      organizationId: ctx.organizationId,
      action,
      count: updated.count,
      applicationIds: ids,
    });

    // --- Fire-and-forget: notify all affected candidates ---
    (async () => {
      try {
        const affectedApps = await prisma.application.findMany({
          where: { id: { in: ids } },
          select: {
            id: true,
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

        for (const app of affectedApps) {
          if (!app.seeker?.account?.email) continue;

          const notifParams = {
            applicationId: app.id,
            candidateEmail: app.seeker.account.email,
            candidateName: app.seeker.account.name ?? "Candidate",
            jobTitle: app.job.title,
            companyName: app.job.organization?.name ?? "the company",
          };

          if (action === "REJECT") {
            await createApplicationRejectedNotification(notifParams);
          } else if (stage) {
            await createStageChangedNotification({
              ...notifParams,
              previousStage: "previous",
              newStage: stage,
            });
          }
        }
      } catch (notifErr) {
        logger.error("Failed to send bulk stage change notifications (non-blocking)", {
          error: formatError(notifErr),
          applicationIds: ids,
        });
      }
    })();

    return NextResponse.json({
      success: true,
      updated: updated.count,
      message: `${updated.count} applications updated`,
    });
  } catch (error) {
    logger.error("Error in bulk application update", {
      error: formatError(error),
      endpoint: "/api/canopy/applications/bulk",
    });
    return NextResponse.json({ error: "Failed to update applications" }, { status: 500 });
  }
}

/**
 * POST /api/canopy/applications/bulk/email
 *
 * Bulk email applications (future use)
 * Body: { ids: string[], templateId: string, customMessage?: string }
 */

const BulkEmailSchema = z.object({
  ids: z.array(z.string()).min(1),
  templateId: z.string(),
  customMessage: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canManagePipeline(ctx)) {
      return NextResponse.json(
        { error: "You do not have permission to send bulk emails" },
        { status: 403 }
      );
    }

    // Parse and validate body
    const body = await request.json();
    const result = BulkEmailSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }

    const { ids, templateId, customMessage } = result.data;

    // Verify all application IDs belong to organization's accessible jobs
    const applications = await prisma.application.findMany({
      where: {
        id: { in: ids },
        job: {
          organizationId: ctx.organizationId,
          ...(!ctx.hasFullAccess && ctx.assignedJobIds.length > 0
            ? { id: { in: ctx.assignedJobIds } }
            : {}),
        },
      },
      select: {
        id: true,
        seeker: {
          select: {
            account: { select: { email: true, name: true } },
          },
        },
      },
    });

    if (applications.length !== ids.length) {
      return NextResponse.json(
        { error: "Some applications do not belong to your organization or accessible jobs" },
        { status: 403 }
      );
    }

    // TODO: Implement email sending logic
    // This is a placeholder for future implementation
    logger.info("Bulk email requested", {
      organizationId: ctx.organizationId,
      templateId,
      count: applications.length,
    });

    return NextResponse.json(
      {
        success: false,
        sent: 0,
        message: "Bulk email sending is not yet implemented",
      },
      { status: 501 }
    );
  } catch (error) {
    logger.error("Error in bulk email", {
      error: formatError(error),
      endpoint: "/api/canopy/applications/bulk/email",
    });
    return NextResponse.json({ error: "Failed to send bulk emails" }, { status: 500 });
  }
}
