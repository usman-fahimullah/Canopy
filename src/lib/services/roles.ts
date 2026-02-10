import { prisma } from "@/lib/db";
import { scopedJobWhere } from "@/lib/access-control";
import type { AuthContext } from "@/lib/access-control";

/* -------------------------------------------------------------------
   Types
   ------------------------------------------------------------------- */

export interface RoleFilters {
  skip?: number;
  take?: number;
  status?: "DRAFT" | "PUBLISHED" | "PAUSED" | "CLOSED";
  employmentType?: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "VOLUNTEER";
  locationType?: "ONSITE" | "REMOTE" | "HYBRID";
}

export interface RoleListResult {
  jobs: RoleListItem[];
  userRole: string;
  meta: {
    total: number;
    skip: number;
    take: number;
    hasMore: boolean;
  };
}

export interface RoleListItem {
  id: string;
  title: string;
  slug: string;
  location: string | null;
  locationType: string;
  status: string;
  publishedAt: string | null;
  closesAt: string | null;
  climateCategory: string | null;
  pathway: {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    color: string | null;
  } | null;
  recruiter: {
    id: string;
    name: string | null;
    avatar: string | null;
  } | null;
  hiringManager: {
    id: string;
    name: string | null;
    avatar: string | null;
  } | null;
  applicationCount: number;
  reviewerCount: number;
}

/* -------------------------------------------------------------------
   Service
   ------------------------------------------------------------------- */

/**
 * Fetch paginated, filtered list of roles for the authenticated user's org.
 *
 * Callable from both Server Components and API routes.
 */
export async function fetchRolesList(
  ctx: AuthContext,
  filters: RoleFilters = {}
): Promise<RoleListResult> {
  const { skip = 0, take = 20, status, employmentType, locationType } = filters;

  const where = {
    ...scopedJobWhere(ctx),
    ...(status ? { status } : {}),
    ...(employmentType ? { employmentType } : {}),
    ...(locationType ? { locationType } : {}),
  };

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        location: true,
        locationType: true,
        status: true,
        publishedAt: true,
        closesAt: true,
        climateCategory: true,
        pathway: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
            color: true,
          },
        },
        recruiter: {
          select: {
            id: true,
            account: { select: { name: true, avatar: true } },
          },
        },
        hiringManager: {
          select: {
            id: true,
            account: { select: { name: true, avatar: true } },
          },
        },
        _count: { select: { applications: true, reviewerAssignments: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.job.count({ where }),
  ]);

  const formattedJobs: RoleListItem[] = jobs.map((job) => ({
    id: job.id,
    title: job.title,
    slug: job.slug,
    location: job.location,
    locationType: job.locationType,
    status: job.status,
    publishedAt: job.publishedAt?.toISOString() ?? null,
    closesAt: job.closesAt?.toISOString() ?? null,
    climateCategory: job.climateCategory,
    pathway: job.pathway,
    recruiter: job.recruiter
      ? {
          id: job.recruiter.id,
          name: job.recruiter.account.name,
          avatar: job.recruiter.account.avatar,
        }
      : null,
    hiringManager: job.hiringManager
      ? {
          id: job.hiringManager.id,
          name: job.hiringManager.account.name,
          avatar: job.hiringManager.account.avatar,
        }
      : null,
    applicationCount: job._count.applications,
    reviewerCount: job._count.reviewerAssignments,
  }));

  return {
    jobs: formattedJobs,
    userRole: ctx.role,
    meta: {
      total,
      skip,
      take,
      hasMore: skip + take < total,
    },
  };
}
