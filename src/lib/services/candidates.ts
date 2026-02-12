import { prisma } from "@/lib/db";
import { scopedApplicationWhere } from "@/lib/access-control";
import type { AuthContext } from "@/lib/access-control";
import type { Prisma } from "@prisma/client";

/* -------------------------------------------------------------------
   Types
   ------------------------------------------------------------------- */

export interface CandidateFilters {
  skip?: number;
  take?: number;
  stage?: string;
  matchScoreMin?: number;
  matchScoreMax?: number;
  source?: string;
  dateFrom?: string;
  dateTo?: string;
  experienceLevel?: "ENTRY" | "INTERMEDIATE" | "SENIOR" | "EXECUTIVE";
  search?: string;
  sortBy?: "name" | "email" | "stage" | "matchScore" | "source" | "createdAt";
  sortDirection?: "asc" | "desc";
}

export interface CandidateListResult {
  applications: CandidateListItem[];
  meta: {
    total: number;
    skip: number;
    take: number;
    hasMore: boolean;
  };
  userRole: string;
}

export interface CandidateListItem {
  id: string;
  seekerId: string;
  stage: string;
  source: string | null;
  matchScore: number | null;
  createdAt: string | null;
  candidate: {
    id: string;
    name: string | null;
    email: string;
  };
  job: {
    id: string;
    title: string;
    organizationId: string;
  };
}

/* -------------------------------------------------------------------
   Helpers
   ------------------------------------------------------------------- */

type SortByField = NonNullable<CandidateFilters["sortBy"]>;
type SortDir = "asc" | "desc";

function buildCandidateOrderBy(
  sortBy: SortByField,
  sortDirection: SortDir
): Prisma.ApplicationOrderByWithRelationInput {
  switch (sortBy) {
    case "name":
      return { seeker: { account: { name: sortDirection } } };
    case "email":
      return { seeker: { account: { email: sortDirection } } };
    case "stage":
      return { stage: sortDirection };
    case "matchScore":
      return { matchScore: sortDirection };
    case "source":
      return { source: sortDirection };
    case "createdAt":
    default:
      return { createdAt: sortDirection };
  }
}

/* -------------------------------------------------------------------
   Service
   ------------------------------------------------------------------- */

/**
 * Fetch paginated, filtered list of candidates (applications) for the org.
 *
 * Callable from both Server Components and API routes.
 */
export async function fetchCandidatesList(
  ctx: AuthContext,
  filters: CandidateFilters = {}
): Promise<CandidateListResult> {
  const {
    skip = 0,
    take = 20,
    stage,
    matchScoreMin,
    matchScoreMax,
    source,
    dateFrom,
    dateTo,
    experienceLevel,
    search,
    sortBy = "createdAt",
    sortDirection = "desc",
  } = filters;

  // Build where clause — scoped by role-based access
  const baseWhere = scopedApplicationWhere(ctx);
  const applicationWhere: Prisma.ApplicationWhereInput = { ...baseWhere };

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
  if (search) {
    applicationWhere.OR = [
      {
        seeker: {
          account: {
            name: { contains: search, mode: "insensitive" },
          },
        },
      },
      {
        seeker: {
          account: {
            email: { contains: search, mode: "insensitive" },
          },
        },
      },
    ];
  }

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
      orderBy: buildCandidateOrderBy(sortBy, sortDirection),
      skip,
      take,
    }),
    prisma.application.count({ where: applicationWhere }),
  ]);

  const formattedApplications: CandidateListItem[] = applications.map((app) => ({
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

  return {
    applications: formattedApplications,
    meta: {
      total,
      skip,
      take,
      hasMore: skip + take < total,
    },
    userRole: ctx.role,
  };
}
