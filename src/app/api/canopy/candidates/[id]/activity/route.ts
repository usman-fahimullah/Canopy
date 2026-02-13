import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";
import { z } from "zod";

/**
 * GET /api/canopy/candidates/[id]/activity
 *
 * Fetch unified activity feed for a candidate, aggregating events from:
 * - Application created
 * - Notes added
 * - Scores submitted
 * - Stage changes (from audit logs)
 * - Interviews scheduled
 * - Offers (sent/viewed/signed)
 * - Email logs (sent emails)
 *
 * Query params:
 * - take: number of events to return (default: 50)
 * - skip: pagination offset (default: 0)
 */

const activityQuerySchema = z.object({
  take: z.coerce.number().int().positive().max(100).default(50),
  skip: z.coerce.number().int().nonnegative().default(0),
});

type ActivityEvent = {
  id: string;
  type: "applied" | "note" | "score" | "stage_change" | "interview" | "offer" | "email_sent";
  title: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
};

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: candidateId } = await params;

    // --- Auth ---
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      select: { id: true },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const membership = await prisma.organizationMember.findFirst({
      where: { accountId: account.id },
      select: { organizationId: true },
    });

    if (!membership) {
      return NextResponse.json({ error: "Organization membership required" }, { status: 403 });
    }

    const orgId = membership.organizationId;

    // --- Parse query params ---
    const queryParams = activityQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams));

    // --- Verify candidate exists and has applications in this org ---
    const candidate = await prisma.seekerProfile.findUnique({
      where: { id: candidateId },
      select: {
        id: true,
        applications: {
          where: { job: { organizationId: orgId } },
          select: { id: true },
        },
      },
    });

    if (!candidate || candidate.applications.length === 0) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    }

    const applicationIds = candidate.applications.map((a) => a.id);

    // --- Collect events from all sources ---
    const events: ActivityEvent[] = [];

    // 1. Application created events
    const applications = await prisma.application.findMany({
      where: { id: { in: applicationIds } },
      select: {
        id: true,
        createdAt: true,
        job: { select: { title: true } },
      },
    });

    applications.forEach((app) => {
      events.push({
        id: `app-${app.id}`,
        type: "applied",
        title: "Applied to position",
        description: `Applied to ${app.job.title}`,
        timestamp: app.createdAt,
        metadata: { applicationId: app.id, jobTitle: app.job.title },
      });
    });

    // 2. Notes added
    const notes = await prisma.note.findMany({
      where: { seekerId: candidateId },
      select: {
        id: true,
        content: true,
        createdAt: true,
        orgMemberAuthor: {
          select: {
            account: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    notes.forEach((note) => {
      events.push({
        id: `note-${note.id}`,
        type: "note",
        title: "Note added",
        description: `${note.orgMemberAuthor?.account?.name || "Unknown"}: "${note.content.substring(0, 100)}${note.content.length > 100 ? "..." : ""}"`,
        timestamp: note.createdAt,
        metadata: {
          noteId: note.id,
          authorName: note.orgMemberAuthor?.account?.name,
          content: note.content,
        },
      });
    });

    // 3. Scores submitted
    const scores = await prisma.score.findMany({
      where: { applicationId: { in: applicationIds } },
      select: {
        id: true,
        overallRating: true,
        createdAt: true,
        application: {
          select: { id: true, job: { select: { title: true } } },
        },
        scorer: {
          select: {
            account: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    scores.forEach((score) => {
      events.push({
        id: `score-${score.id}`,
        type: "score",
        title: "Score submitted",
        description: `${score.scorer.account.name} scored ${score.overallRating}/5`,
        timestamp: score.createdAt,
        metadata: {
          scoreId: score.id,
          applicationId: score.application.id,
          rating: score.overallRating,
          scorerName: score.scorer.account.name,
        },
      });
    });

    // 4. Stage changes (from audit logs)
    const auditLogs = await prisma.auditLog.findMany({
      where: {
        entityType: "Application",
        entityId: { in: applicationIds },
        action: "UPDATE",
      },
      select: {
        id: true,
        createdAt: true,
        metadata: true,
        userId: true,
      },
      orderBy: { createdAt: "desc" },
    });

    auditLogs.forEach((log) => {
      const metadata = log.metadata as Record<string, unknown> | null;
      if (metadata && "oldStage" in metadata && "newStage" in metadata) {
        events.push({
          id: `audit-${log.id}`,
          type: "stage_change",
          title: "Stage changed",
          description: `Moved from ${metadata.oldStage} to ${metadata.newStage}`,
          timestamp: log.createdAt,
          metadata: {
            auditLogId: log.id,
            oldStage: metadata.oldStage,
            newStage: metadata.newStage,
            userId: log.userId,
          },
        });
      }
    });

    // 5. Interviews scheduled
    const interviews = await prisma.interview.findMany({
      where: { applicationId: { in: applicationIds } },
      select: {
        id: true,
        scheduledAt: true,
        createdAt: true,
        type: true,
      },
      orderBy: { createdAt: "desc" },
    });

    interviews.forEach((interview) => {
      events.push({
        id: `interview-${interview.id}`,
        type: "interview",
        title: "Interview scheduled",
        description: `${interview.type || "Interview"} scheduled for ${interview.scheduledAt.toLocaleDateString()}`,
        timestamp: interview.createdAt,
        metadata: {
          interviewId: interview.id,
          type: interview.type,
          scheduledAt: interview.scheduledAt,
        },
      });
    });

    // 6. Offers
    const offers = await prisma.offerRecord.findMany({
      where: { applicationId: { in: applicationIds } },
      select: {
        id: true,
        status: true,
        createdAt: true,
        sentAt: true,
        viewedAt: true,
        signedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    offers.forEach((offer) => {
      // Add event for when offer was sent
      if (offer.sentAt) {
        events.push({
          id: `offer-sent-${offer.id}`,
          type: "offer",
          title: "Offer sent",
          description: "Offer letter sent to candidate",
          timestamp: offer.sentAt,
          metadata: {
            offerId: offer.id,
            status: offer.status,
          },
        });
      }

      // Add event for when offer was viewed
      if (offer.viewedAt) {
        events.push({
          id: `offer-viewed-${offer.id}`,
          type: "offer",
          title: "Offer viewed",
          description: "Candidate viewed offer letter",
          timestamp: offer.viewedAt,
          metadata: {
            offerId: offer.id,
            status: offer.status,
          },
        });
      }

      // Add event for when offer was signed
      if (offer.signedAt) {
        events.push({
          id: `offer-signed-${offer.id}`,
          type: "offer",
          title: "Offer signed",
          description: "Candidate signed offer letter",
          timestamp: offer.signedAt,
          metadata: {
            offerId: offer.id,
            status: offer.status,
          },
        });
      }
    });

    // 7. Email logs (sent emails)
    const emailLogs = await prisma.emailLog.findMany({
      where: { applicationId: { in: applicationIds } },
      select: {
        id: true,
        subject: true,
        status: true,
        sendType: true,
        createdAt: true,
        sentBy: {
          select: {
            account: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    emailLogs.forEach((log) => {
      const senderName = log.sentBy.account.name || "Team member";
      const typeLabel =
        log.sendType === "AUTOMATED"
          ? "Automated email"
          : log.sendType === "BULK"
            ? "Bulk email"
            : log.sendType === "SCHEDULED"
              ? "Scheduled email"
              : "Email";

      events.push({
        id: `email-${log.id}`,
        type: "email_sent",
        title: `${typeLabel} sent`,
        description: `${senderName} sent "${log.subject}"`,
        timestamp: log.createdAt,
        metadata: {
          emailLogId: log.id,
          subject: log.subject,
          status: log.status,
          sendType: log.sendType,
          senderName,
        },
      });
    });

    // --- Sort by timestamp descending and apply pagination ---
    const sortedEvents = events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    const paginatedEvents = sortedEvents.slice(
      queryParams.skip,
      queryParams.skip + queryParams.take
    );
    const total = sortedEvents.length;

    logger.info("Activity feed fetched", {
      candidateId,
      eventCount: paginatedEvents.length,
      total,
      endpoint: "/api/canopy/candidates/[id]/activity",
    });

    return NextResponse.json({
      data: {
        events: paginatedEvents,
        pagination: {
          skip: queryParams.skip,
          take: queryParams.take,
          total,
          hasMore: queryParams.skip + queryParams.take < total,
        },
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.flatten() },
        { status: 400 }
      );
    }

    logger.error("Failed to fetch activity feed", {
      error: formatError(error),
      endpoint: "/api/canopy/candidates/[id]/activity",
    });
    return NextResponse.json({ error: "Failed to fetch activity feed" }, { status: 500 });
  }
}
