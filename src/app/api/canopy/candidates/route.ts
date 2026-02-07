import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { z } from "zod";
import { getAuthContext, scopedApplicationWhere } from "@/lib/access-control";
import type { Prisma } from "@prisma/client";

/**
 * GET /api/canopy/candidates
 *
 * List all candidates (applications) across org's jobs with advanced filtering and pagination.
 * Org-scoped via job.organizationId
 */

const GetCandidatesSchema = z.object({
  skip: z.coerce.number().int().min(0).default(0),
  take: z.coerce.number().int().min(1).max(100).default(20),
  stage: z.string().optional(),
  matchScoreMin: z.coerce.number().min(0).max(100).optional(),
  matchScoreMax: z.coerce.number().min(0).max(100).optional(),
  source: z.string().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  experienceLevel: z.enum(["ENTRY", "INTERMEDIATE", "SENIOR", "EXECUTIVE"]).optional(),
  search: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate query params
    const params = GetCandidatesSchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
    if (!params.success) {
      return NextResponse.json(
        { error: "Invalid parameters", details: params.error.flatten() },
        { status: 422 }
      );
    }

    const {
      skip,
      take,
      stage,
      matchScoreMin,
      matchScoreMax,
      source,
      dateFrom,
      dateTo,
      experienceLevel,
      search,
    } = params.data;

    // Build where clause — scoped by role-based access
    const baseWhere = scopedApplicationWhere(ctx);
    const applicationWhere: Prisma.ApplicationWhereInput = {
      ...baseWhere,
    };

    // Add filters
    if (stage) {
      applicationWhere.stage = stage;
    }
    if (matchScoreMin !== undefined || matchScoreMax !== undefined) {
      const matchFilter: Prisma.FloatNullableFilter = {};
      if (matchScoreMin !== undefined) matchFilter.gte = matchScoreMin;
      if (matchScoreMax !== undefined) matchFilter.lte = matchScoreMax;
      applicationWhere.matchScore = matchFilter;
    }
    if (source) {
      applicationWhere.source = source;
    }
    if (dateFrom || dateTo) {
      const dateFilter: Prisma.DateTimeFilter = {};
      if (dateFrom) dateFilter.gte = new Date(dateFrom);
      if (dateTo) dateFilter.lte = new Date(dateTo);
      applicationWhere.createdAt = dateFilter;
    }
    if (experienceLevel) {
      const existingJobFilter = (applicationWhere.job ?? {}) as Prisma.JobWhereInput;
      applicationWhere.job = { ...existingJobFilter, experienceLevel };
    }

    // Handle search (name/email in candidate)
    if (search) {
      applicationWhere.OR = [
        {
          seeker: {
            account: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
        {
          seeker: {
            account: {
              email: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
      ];
    }

    // Execute count and findMany in parallel
    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where: applicationWhere,
        select: {
          id: true,
          stage: true,
          source: true,
          matchScore: true,
          createdAt: true,
          seekerId: true,
          seeker: {
            select: {
              id: true,
              account: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          job: {
            select: {
              id: true,
              title: true,
              organizationId: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.application.count({ where: applicationWhere }),
    ]);

    // Format response
    const formattedApplications = applications.map((app) => ({
      id: app.id,
      seekerId: app.seekerId,
      stage: app.stage,
      source: app.source,
      matchScore: app.matchScore,
      createdAt: app.createdAt?.toISOString() ?? null,
      candidate: {
        id: app.seeker.account.id,
        name: app.seeker.account.name,
        email: app.seeker.account.email,
      },
      job: app.job,
    }));

    return NextResponse.json({
      applications: formattedApplications,
      meta: {
        total,
        skip,
        take,
        hasMore: skip + take < total,
      },
      userRole: ctx.role,
    });
  } catch (error) {
    logger.error("Error fetching candidates", {
      error: formatError(error),
      endpoint: "/api/canopy/candidates",
    });
    return NextResponse.json({ error: "Failed to fetch candidates" }, { status: 500 });
  }
}
