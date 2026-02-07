import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { createAuditLog } from "@/lib/audit";
import { CreateInterviewSchema } from "@/lib/validators/interviews";
import { standardLimiter } from "@/lib/rate-limit";
import { z } from "zod";

/**
 * GET /api/canopy/interviews
 *
 * List interviews for org with optional filters
 * Query params: applicationId, status, from (date), to (date), interviewerId, skip, take
 * Auth: any org member
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Get first org membership (user must be in at least one org)
    const membership = await prisma.organizationMember.findFirst({
      where: { accountId: account.id },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "You are not a member of any organization" },
        { status: 403 }
      );
    }

    // Parse query params with validation
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const querySchema = z.object({
      applicationId: z.string().optional(),
      status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED"]).optional(),
      from: z.string().datetime().optional(),
      to: z.string().datetime().optional(),
      interviewerId: z.string().optional(),
      skip: z.coerce.number().int().min(0).default(0),
      take: z.coerce.number().int().min(1).max(100).default(20),
    });

    const result = querySchema.safeParse(searchParams);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: result.error.flatten() },
        { status: 422 }
      );
    }

    const { applicationId, status, from, to, interviewerId, skip, take } = result.data;

    // Build where clause
    const where: any = {
      organizationId: membership.organizationId,
    };

    if (applicationId) where.applicationId = applicationId;
    if (status) where.status = status;
    if (interviewerId) where.interviewerId = interviewerId;

    if (from || to) {
      where.scheduledAt = {};
      if (from) where.scheduledAt.gte = new Date(from);
      if (to) where.scheduledAt.lte = new Date(to);
    }

    // Fetch interviews with related data
    const [interviews, total] = await Promise.all([
      prisma.interview.findMany({
        where,
        select: {
          id: true,
          applicationId: true,
          interviewerId: true,
          organizationId: true,
          scheduledAt: true,
          duration: true,
          type: true,
          location: true,
          meetingLink: true,
          status: true,
          notes: true,
          cancelledAt: true,
          completedAt: true,
          createdAt: true,
          updatedAt: true,
          application: {
            select: {
              id: true,
              seeker: {
                select: {
                  account: { select: { name: true } },
                },
              },
              job: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
          interviewer: {
            select: {
              id: true,
              account: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatar: true,
                },
              },
            },
          },
        },
        orderBy: { scheduledAt: "desc" },
        skip,
        take,
      }),
      prisma.interview.count({ where }),
    ]);

    logger.info("Interviews listed", {
      organizationId: membership.organizationId,
      count: interviews.length,
      endpoint: "/api/canopy/interviews",
    });

    return NextResponse.json({
      data: interviews,
      meta: {
        total,
        skip,
        take,
      },
    });
  } catch (error) {
    logger.error("Error listing interviews", {
      error: formatError(error),
      endpoint: "/api/canopy/interviews",
    });
    return NextResponse.json({ error: "Failed to list interviews" }, { status: 500 });
  }
}

/**
 * POST /api/canopy/interviews
 *
 * Create a new interview
 * Auth: OWNER/ADMIN/RECRUITER
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rateLimitResult = await standardLimiter.check(30, ip);
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const body = await request.json();
    const result = CreateInterviewSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }

    const data = result.data;

    // Verify application exists and get org context
    const application = await prisma.application.findUnique({
      where: { id: data.applicationId },
      include: {
        job: { select: { id: true, organizationId: true, title: true } },
      },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Verify user is a member of this org with appropriate role
    const membership = await prisma.organizationMember.findFirst({
      where: {
        accountId: account.id,
        organizationId: application.job.organizationId,
        role: { in: ["OWNER", "ADMIN", "RECRUITER"] },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Insufficient permissions. Must be OWNER, ADMIN, or RECRUITER." },
        { status: 403 }
      );
    }

    // Verify interviewer exists in the org
    const interviewer = await prisma.organizationMember.findUnique({
      where: { id: data.interviewerId },
    });

    if (!interviewer || interviewer.organizationId !== application.job.organizationId) {
      return NextResponse.json({ error: "Interviewer not found in this organization" }, { status: 404 });
    }

    // Create interview
    const interview = await prisma.interview.create({
      data: {
        applicationId: data.applicationId,
        interviewerId: data.interviewerId,
        organizationId: application.job.organizationId,
        scheduledAt: new Date(data.scheduledAt),
        duration: data.duration,
        type: data.type,
        location: data.location,
        meetingLink: data.meetingLink,
        notes: data.notes,
        status: "SCHEDULED",
      },
      include: {
        application: {
          select: {
            id: true,
            seeker: {
              select: {
                account: { select: { name: true } },
              },
            },
            job: { select: { id: true, title: true } },
          },
        },
        interviewer: {
          select: {
            id: true,
            account: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    await createAuditLog({
      action: "CREATE",
      entityType: "Interview",
      entityId: interview.id,
      userId: account.id,
      metadata: {
        applicationId: data.applicationId,
        jobTitle: application.job.title,
        interviewType: data.type,
        scheduledAt: data.scheduledAt,
      },
    });

    logger.info("Interview created", {
      interviewId: interview.id,
      applicationId: data.applicationId,
      endpoint: "/api/canopy/interviews",
    });

    return NextResponse.json({ data: interview }, { status: 201 });
  } catch (error) {
    logger.error("Error creating interview", {
      error: formatError(error),
      endpoint: "/api/canopy/interviews",
    });
    return NextResponse.json({ error: "Failed to create interview" }, { status: 500 });
  }
}
