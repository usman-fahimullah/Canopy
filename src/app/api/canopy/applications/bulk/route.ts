import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { z } from "zod";
import {
  createStageChangedNotification,
  createApplicationRejectedNotification,
} from "@/lib/notifications/hiring";

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
    // Auth check
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get organization
    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      include: {
        orgMemberships: {
          select: { organizationId: true },
        },
      },
    });

    if (!account || account.orgMemberships.length === 0) {
      return NextResponse.json({ error: "No organization found" }, { status: 403 });
    }

    const organizationId = account.orgMemberships[0].organizationId;

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
    const applications = await prisma.application.findMany({
      where: {
        id: { in: ids },
        job: { organizationId },
      },
      select: { id: true },
    });

    if (applications.length !== ids.length) {
      return NextResponse.json(
        { error: "Some applications do not belong to your organization" },
        { status: 403 }
      );
    }

    // Perform bulk update
    let updateData: any = {};
    if (action === "MOVE_STAGE") {
      updateData = { stage };
    } else if (action === "REJECT") {
      updateData = { stage: "REJECTED" };
    }

    const updated = await prisma.application.updateMany({
      where: {
        id: { in: ids },
        job: { organizationId },
      },
      data: updateData,
    });

    logger.info("Bulk applications updated", {
      organizationId,
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
    // Auth check
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get organization
    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      include: {
        orgMemberships: {
          select: { organizationId: true },
        },
      },
    });

    if (!account || account.orgMemberships.length === 0) {
      return NextResponse.json({ error: "No organization found" }, { status: 403 });
    }

    const organizationId = account.orgMemberships[0].organizationId;

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

    // Verify all application IDs belong to organization's jobs
    const applications = await prisma.application.findMany({
      where: {
        id: { in: ids },
        job: { organizationId },
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
        { error: "Some applications do not belong to your organization" },
        { status: 403 }
      );
    }

    // TODO: Implement email sending logic
    // This is a placeholder for future implementation
    logger.info("Bulk email requested", {
      organizationId,
      templateId,
      count: applications.length,
    });

    return NextResponse.json({
      success: true,
      sent: applications.length,
      message: `Prepared to send ${applications.length} emails`,
    });
  } catch (error) {
    logger.error("Error in bulk email", {
      error: formatError(error),
      endpoint: "/api/canopy/applications/bulk/email",
    });
    return NextResponse.json({ error: "Failed to send bulk emails" }, { status: 500 });
  }
}
