import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { z } from "zod";

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

    // Parse and validate query params
    const params = GetCandidatesSchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
    if (!params.success) {
      return NextResponse.json(
        { error: "Invalid parameters", details: params.error.flatten() },
        { status: 422 }
      );
    }

    const { skip, take, stage, matchScoreMin, matchScoreMax, source, dateFrom, dateTo, experienceLevel, search } =
      params.data;

    // Build where clause for applications
    const applicationWhere: any = {
      job: {
        organizationId,
      },
    };

    // Add filters
    if (stage) {
      applicationWhere.stage = stage;
    }
    if (matchScoreMin !== undefined || matchScoreMax !== undefined) {
      applicationWhere.matchScore = {};
      if (matchScoreMin !== undefined) {
        applicationWhere.matchScore.gte = matchScoreMin;
      }
      if (matchScoreMax !== undefined) {
        applicationWhere.matchScore.lte = matchScoreMax;
      }
    }
    if (source) {
      applicationWhere.source = source;
    }
    if (dateFrom || dateTo) {
      applicationWhere.createdAt = {};
      if (dateFrom) {
        applicationWhere.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        applicationWhere.createdAt.lte = new Date(dateTo);
      }
    }
    if (experienceLevel) {
      applicationWhere.job = {
        ...applicationWhere.job,
        experienceLevel,
      };
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
          seeker: {
            select: {
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
    });
  } catch (error) {
    logger.error("Error fetching candidates", {
      error: formatError(error),
      endpoint: "/api/canopy/candidates",
    });
    return NextResponse.json({ error: "Failed to fetch candidates" }, { status: 500 });
  }
}
