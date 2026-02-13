import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { getAuthContext, canManagePipeline } from "@/lib/access-control";

/**
 * POST /api/canopy/emails/schedule
 *
 * Schedule an email for future delivery. Creates a ScheduledEmail record
 * with status PENDING. A background cron job will pick it up at the
 * scheduled time and send it.
 */
const RecipientSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  applicationId: z.string().optional(),
});

const ScheduleEmailSchema = z.object({
  recipients: z.array(RecipientSchema).min(1).max(200),
  subject: z.string().min(1).max(300),
  body: z.string().min(1),
  templateId: z.string().optional(),
  scheduledFor: z.string().datetime(), // ISO 8601
});

export async function POST(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canManagePipeline(ctx)) {
      return NextResponse.json(
        { error: "You do not have permission to schedule emails" },
        { status: 403 }
      );
    }

    const rawBody = await request.json();
    const result = ScheduleEmailSchema.safeParse(rawBody);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }

    const { recipients, subject, body, templateId, scheduledFor } = result.data;

    // Validate scheduledFor is in the future
    const scheduledDate = new Date(scheduledFor);
    if (scheduledDate <= new Date()) {
      return NextResponse.json(
        { error: "scheduledFor must be a future date and time" },
        { status: 422 }
      );
    }

    const scheduled = await prisma.scheduledEmail.create({
      data: {
        organizationId: ctx.organizationId,
        createdById: ctx.memberId,
        recipients: JSON.stringify(recipients),
        subject,
        body,
        templateId: templateId ?? null,
        scheduledFor: scheduledDate,
        status: "PENDING",
      },
      select: {
        id: true,
        scheduledFor: true,
      },
    });

    logger.info("Email scheduled", {
      scheduledEmailId: scheduled.id,
      recipientCount: recipients.length,
      scheduledFor: scheduled.scheduledFor.toISOString(),
      organizationId: ctx.organizationId,
      endpoint: "POST /api/canopy/emails/schedule",
    });

    return NextResponse.json(
      {
        id: scheduled.id,
        scheduledFor: scheduled.scheduledFor.toISOString(),
        recipientCount: recipients.length,
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error("Failed to schedule email", {
      error: formatError(error),
      endpoint: "POST /api/canopy/emails/schedule",
    });
    return NextResponse.json({ error: "Failed to schedule email" }, { status: 500 });
  }
}

/**
 * GET /api/canopy/emails/schedule
 *
 * List scheduled emails for the authenticated user's organization.
 * Supports optional status filter and pagination.
 *
 * Query params:
 *   status  — optional filter: PENDING | SENT | CANCELLED | FAILED
 *   skip    — pagination offset (default 0)
 *   take    — page size (default 20, max 100)
 */
const ListScheduledSchema = z.object({
  status: z.enum(["PENDING", "SENT", "CANCELLED", "FAILED"]).optional(),
  skip: z.coerce.number().int().min(0).default(0),
  take: z.coerce.number().int().min(1).max(100).default(20),
});

export async function GET(request: NextRequest) {
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

    const params = Object.fromEntries(request.nextUrl.searchParams);
    const result = ListScheduledSchema.safeParse(params);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }

    const { status, skip, take } = result.data;

    const where = {
      organizationId: ctx.organizationId,
      ...(status ? { status } : {}),
    };

    const [data, total] = await Promise.all([
      prisma.scheduledEmail.findMany({
        where,
        select: {
          id: true,
          subject: true,
          recipients: true,
          scheduledFor: true,
          status: true,
          createdAt: true,
        },
        orderBy: { scheduledFor: "desc" },
        skip,
        take,
      }),
      prisma.scheduledEmail.count({ where }),
    ]);

    // Parse recipients to extract count without exposing full list
    const items = data.map((item) => {
      let recipientCount = 0;
      try {
        const parsed = JSON.parse(item.recipients) as unknown[];
        recipientCount = parsed.length;
      } catch {
        recipientCount = 0;
      }

      return {
        id: item.id,
        subject: item.subject,
        recipientCount,
        scheduledFor: item.scheduledFor.toISOString(),
        status: item.status,
        createdAt: item.createdAt.toISOString(),
      };
    });

    return NextResponse.json({
      data: items,
      meta: { total, skip, take },
    });
  } catch (error) {
    logger.error("Failed to list scheduled emails", {
      error: formatError(error),
      endpoint: "GET /api/canopy/emails/schedule",
    });
    return NextResponse.json({ error: "Failed to list scheduled emails" }, { status: 500 });
  }
}
