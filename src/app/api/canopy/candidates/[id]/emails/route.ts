import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { getAuthContext, canAccessJob } from "@/lib/access-control";

/**
 * GET /api/canopy/candidates/[id]/emails
 *
 * Fetch the email thread for a candidate's application(s).
 * Returns emails grouped-ready by stageId, ordered by most recent first.
 *
 * Query params:
 *   - applicationId (required): scope emails to a specific application
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
      return NextResponse.json(
        { error: "applicationId query parameter is required" },
        { status: 400 }
      );
    }

    // Verify the application belongs to this seeker and the user's org
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

    // Check job access for scoped roles
    if (!canAccessJob(ctx, application.jobId)) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Fetch emails for this application
    const emails = await prisma.emailLog.findMany({
      where: {
        applicationId,
        organizationId: ctx.organizationId,
      },
      select: {
        id: true,
        subject: true,
        body: true,
        recipientEmail: true,
        recipientName: true,
        sendType: true,
        stageId: true,
        status: true,
        createdAt: true,
        sentBy: {
          select: {
            account: {
              select: { name: true, avatar: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const data = emails.map((e) => ({
      id: e.id,
      subject: e.subject,
      body: e.body,
      recipientEmail: e.recipientEmail,
      recipientName: e.recipientName,
      sendType: e.sendType,
      stageId: e.stageId,
      status: e.status,
      createdAt: e.createdAt,
      senderName: e.sentBy.account.name,
      senderAvatar: e.sentBy.account.avatar,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    logger.error("Error fetching email thread", {
      error: formatError(error),
      endpoint: "/api/canopy/candidates/[id]/emails",
    });
    return NextResponse.json({ error: "Failed to fetch emails" }, { status: 500 });
  }
}
