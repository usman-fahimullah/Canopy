import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { createNotification } from "@/lib/notifications";
import { createAuditLog } from "@/lib/audit";

/**
 * DELETE /api/jobs/applications/[id]
 *
 * Withdraw an application (soft-delete). Only the candidate who owns
 * the application may withdraw it. Sets `deletedAt` rather than
 * physically removing the record.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: applicationId } = await params;
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

    // Fetch the application and verify ownership
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        seeker: {
          include: {
            account: { select: { id: true, name: true } },
          },
        },
        job: {
          select: {
            id: true,
            title: true,
            organizationId: true,
            organization: { select: { name: true } },
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Verify the authenticated user owns this application
    if (application.seeker.account.id !== account.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Already withdrawn
    if (application.deletedAt) {
      return NextResponse.json({ error: "Application already withdrawn" }, { status: 400 });
    }

    // Soft-delete
    const now = new Date();
    await prisma.application.update({
      where: { id: applicationId },
      data: { deletedAt: now },
    });

    const candidateName = application.seeker.account.name ?? "A candidate";
    const jobTitle = application.job.title;
    const orgId = application.job.organizationId;

    // Fire-and-forget: notify employer org members
    notifyOrgOfWithdrawal({
      orgId,
      candidateName,
      jobTitle,
      jobId: application.job.id,
    }).catch((err) =>
      logger.error("Failed to notify employer of withdrawal", { error: formatError(err) })
    );

    await createAuditLog({
      action: "DELETE",
      entityType: "Application",
      entityId: applicationId,
      userId: account.id,
      changes: { deletedAt: { from: null, to: now.toISOString() } },
      metadata: { action: "candidate_withdrew" },
    });

    logger.info("Application withdrawn", {
      applicationId,
      seekerId: application.seekerId,
      jobId: application.jobId,
      endpoint: "/api/jobs/applications/[id]",
    });

    return NextResponse.json({ success: true, message: "Application withdrawn" });
  } catch (error) {
    logger.error("Error withdrawing application", {
      error: formatError(error),
      endpoint: "/api/jobs/applications/[id]",
    });
    return NextResponse.json({ error: "Failed to withdraw application" }, { status: 500 });
  }
}

/**
 * Fire-and-forget: notify org ADMIN/RECRUITER that a candidate withdrew.
 */
async function notifyOrgOfWithdrawal(params: {
  orgId: string;
  candidateName: string;
  jobTitle: string;
  jobId: string;
}) {
  const members = await prisma.organizationMember.findMany({
    where: {
      organizationId: params.orgId,
      role: { in: ["ADMIN", "RECRUITER"] },
    },
    select: { account: { select: { id: true } } },
  });

  await Promise.allSettled(
    members.map((m) =>
      createNotification({
        accountId: m.account.id,
        type: "STAGE_CHANGED",
        title: `${params.candidateName} withdrew their application`,
        body: `${params.candidateName} has withdrawn their application for ${params.jobTitle}.`,
        data: { url: `/canopy/roles/${params.jobId}` },
        sendEmailNotification: true,
      })
    )
  );
}
