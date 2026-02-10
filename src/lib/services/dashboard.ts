import { prisma } from "@/lib/db";
import { scopedJobWhere, scopedApplicationWhere } from "@/lib/access-control";
import type { AuthContext } from "@/lib/access-control";
import type { Prisma } from "@prisma/client";

/* -------------------------------------------------------------------
   Types
   ------------------------------------------------------------------- */

export interface DashboardRole {
  id: string;
  title: string;
  location: string | null;
  locationType: string;
  status: string;
  publishedAt: string | null;
  applicationCount: number;
}

export interface DashboardApplication {
  id: string;
  stage: string;
  createdAt: string;
  candidate: {
    id: string;
    name: string;
    email: string;
  };
  job: {
    id: string;
    title: string;
  };
}

export interface DashboardData {
  activeRolesCount: number;
  recentRoles: DashboardRole[];
  candidateCount: number;
  newApplicationCount: number;
  hiredCount: number;
  recentApplications: DashboardApplication[];
  pipelineStats: Record<string, number>;
  userRole: string;
}

/* -------------------------------------------------------------------
   Service
   ------------------------------------------------------------------- */

/**
 * Fetch all dashboard data for the authenticated user's org.
 *
 * Callable from both Server Components and API routes.
 */
export async function fetchDashboardData(ctx: AuthContext): Promise<DashboardData> {
  const jobWhere: Prisma.JobWhereInput = scopedJobWhere(ctx);
  const appWhere: Prisma.ApplicationWhereInput = scopedApplicationWhere(ctx);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [
    recentJobs,
    activeRolesCount,
    candidateCount,
    newApplicationCount,
    hiredCount,
    recentApplications,
    pipelineGroupBy,
  ] = await Promise.all([
    prisma.job.findMany({
      where: jobWhere,
      select: {
        id: true,
        title: true,
        location: true,
        locationType: true,
        status: true,
        publishedAt: true,
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.job.count({
      where: { ...jobWhere, status: "PUBLISHED" },
    }),
    prisma.application.count({
      where: appWhere,
    }),
    prisma.application.count({
      where: { ...appWhere, createdAt: { gte: sevenDaysAgo } },
    }),
    prisma.application.count({
      where: { ...appWhere, stage: { equals: "hired", mode: "insensitive" } },
    }),
    prisma.application.findMany({
      where: appWhere,
      select: {
        id: true,
        stage: true,
        createdAt: true,
        seeker: {
          select: {
            id: true,
            account: {
              select: { name: true, email: true },
            },
          },
        },
        job: {
          select: { id: true, title: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.application.groupBy({
      by: ["stage"],
      where: appWhere,
      _count: { _all: true },
    }),
  ]);

  // Build pipeline stats from groupBy result
  const pipelineStats: Record<string, number> = {};
  const stages = ["Applied", "Screening", "Interview", "Offer", "Hired"];
  stages.forEach((stage) => {
    const match = pipelineGroupBy.find((g) => g.stage.toLowerCase() === stage.toLowerCase());
    pipelineStats[stage] = match?._count._all ?? 0;
  });

  const recentRoles: DashboardRole[] = recentJobs.map((job) => ({
    id: job.id,
    title: job.title,
    location: job.location,
    locationType: job.locationType,
    status: job.status,
    publishedAt: job.publishedAt?.toISOString() ?? null,
    applicationCount: job._count.applications,
  }));

  const mappedApplications: DashboardApplication[] = recentApplications.map((app) => ({
    id: app.id,
    stage: app.stage,
    createdAt: app.createdAt.toISOString(),
    candidate: {
      id: app.seeker.id,
      name: app.seeker.account.name || app.seeker.account.email,
      email: app.seeker.account.email,
    },
    job: {
      id: app.job.id,
      title: app.job.title,
    },
  }));

  return {
    activeRolesCount,
    recentRoles,
    candidateCount,
    newApplicationCount,
    hiredCount,
    recentApplications: mappedApplications,
    pipelineStats,
    userRole: ctx.role,
  };
}
