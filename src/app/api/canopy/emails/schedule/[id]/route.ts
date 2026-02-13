import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { getAuthContext, canManagePipeline } from "@/lib/access-control";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/canopy/emails/schedule/[id]
 *
 * Get full details of a single scheduled email, including parsed recipients.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canManagePipeline(ctx)) {
      return NextResponse.json(
        { error: "You do not have permission to view scheduled emails" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const scheduled = await prisma.scheduledEmail.findFirst({
      where: {
        id,
        organizationId: ctx.organizationId,
      },
      select: {
        id: true,
        subject: true,
        body: true,
        recipients: true,
        templateId: true,
        scheduledFor: true,
        status: true,
        sentAt: true,
        cancelledAt: true,
        error: true,
        createdAt: true,
        updatedAt: true,
        createdBy: {
          select: {
            account: {
              select: { name: true, email: true },
            },
          },
        },
      },
    });

    if (!scheduled) {
      return NextResponse.json({ error: "Scheduled email not found" }, { status: 404 });
    }

    // Parse recipients JSON
    let recipients: Array<{
      email: string;
      name?: string;
      applicationId?: string;
    }> = [];
    try {
      recipients = JSON.parse(scheduled.recipients) as typeof recipients;
    } catch {
      recipients = [];
    }

    return NextResponse.json({
      id: scheduled.id,
      subject: scheduled.subject,
      body: scheduled.body,
      recipients,
      templateId: scheduled.templateId,
      scheduledFor: scheduled.scheduledFor.toISOString(),
      status: scheduled.status,
      sentAt: scheduled.sentAt?.toISOString() ?? null,
      cancelledAt: scheduled.cancelledAt?.toISOString() ?? null,
      error: scheduled.error,
      createdAt: scheduled.createdAt.toISOString(),
      updatedAt: scheduled.updatedAt.toISOString(),
      createdBy: {
        name: scheduled.createdBy.account.name,
        email: scheduled.createdBy.account.email,
      },
    });
  } catch (error) {
    logger.error("Failed to get scheduled email", {
      error: formatError(error),
      endpoint: "GET /api/canopy/emails/schedule/[id]",
    });
    return NextResponse.json({ error: "Failed to get scheduled email" }, { status: 500 });
  }
}

/**
 * DELETE /api/canopy/emails/schedule/[id]
 *
 * Cancel a pending scheduled email. Only emails with status PENDING
 * can be cancelled. Sets status to CANCELLED and cancelledAt to now.
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canManagePipeline(ctx)) {
      return NextResponse.json(
        { error: "You do not have permission to cancel scheduled emails" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Fetch the scheduled email to verify org ownership and current status
    const scheduled = await prisma.scheduledEmail.findFirst({
      where: {
        id,
        organizationId: ctx.organizationId,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!scheduled) {
      return NextResponse.json({ error: "Scheduled email not found" }, { status: 404 });
    }

    if (scheduled.status !== "PENDING") {
      return NextResponse.json(
        {
          error: `Cannot cancel a scheduled email with status ${scheduled.status}. Only PENDING emails can be cancelled.`,
        },
        { status: 409 }
      );
    }

    await prisma.scheduledEmail.update({
      where: { id: scheduled.id },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
      },
    });

    logger.info("Scheduled email cancelled", {
      scheduledEmailId: id,
      organizationId: ctx.organizationId,
      endpoint: "DELETE /api/canopy/emails/schedule/[id]",
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    logger.error("Failed to cancel scheduled email", {
      error: formatError(error),
      endpoint: "DELETE /api/canopy/emails/schedule/[id]",
    });
    return NextResponse.json({ error: "Failed to cancel scheduled email" }, { status: 500 });
  }
}
