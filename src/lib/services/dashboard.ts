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

export interface AttentionItem {
  id: string;
  type: "stale" | "unscored";
  candidateName: string;
  seekerId: string;
  jobTitle: string;
  jobId: string;
  detail: string;
}

export interface AttentionData {
  staleCandidates: AttentionItem[];
  unscoredInterviews: AttentionItem[];
  totalCount: number;
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
  attention: AttentionData;
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

  const STALE_THRESHOLD_DAYS = 7;
  const staleDate = new Date();
  staleDate.setDate(staleDate.getDate() - STALE_THRESHOLD_DAYS);

  const [
    recentJobs,
    activeRolesCount,
    candidateCount,
    newApplicationCount,
    hiredCount,
    recentApplications,
    pipelineGroupBy,
    staleApplications,
    unscoredCompletedInterviews,
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
    // Stale candidates: in an active stage for 7+ days without movement
    prisma.application.findMany({
      where: {
        ...appWhere,
        updatedAt: { lte: staleDate },
        AND: [
          { NOT: { stage: { equals: "hired", mode: "insensitive" } } },
          { NOT: { stage: { equals: "rejected", mode: "insensitive" } } },
          { NOT: { stage: { equals: "withdrawn", mode: "insensitive" } } },
          { NOT: { stage: { equals: "talent-pool", mode: "insensitive" } } },
        ],
      },
      select: {
        id: true,
        stage: true,
        updatedAt: true,
        seeker: {
          select: {
            id: true,
            account: { select: { name: true, email: true } },
          },
        },
        job: { select: { id: true, title: true } },
      },
      orderBy: { updatedAt: "asc" },
      take: 10,
    }),
    // Completed interviews without any score
    prisma.interview.findMany({
      where: {
        organizationId: ctx.organizationId,
        status: "COMPLETED",
        application: {
          ...appWhere,
          scores: { none: {} },
        },
      },
      select: {
        id: true,
        completedAt: true,
        application: {
          select: {
            id: true,
            seeker: {
              select: {
                id: true,
                account: { select: { name: true, email: true } },
              },
            },
            job: { select: { id: true, title: true } },
          },
        },
      },
      orderBy: { completedAt: "desc" },
      take: 10,
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

  // Map attention items
  const staleCandidateItems: AttentionItem[] = staleApplications.map((app) => {
    const daysInStage = Math.floor((Date.now() - new Date(app.updatedAt).getTime()) / 86_400_000);
    return {
      id: app.id,
      type: "stale" as const,
      candidateName: app.seeker.account.name || app.seeker.account.email,
      seekerId: app.seeker.id,
      jobTitle: app.job.title,
      jobId: app.job.id,
      detail: `In "${app.stage}" for ${daysInStage} days`,
    };
  });

  const unscoredItems: AttentionItem[] = unscoredCompletedInterviews.map((interview) => ({
    id: interview.id,
    type: "unscored" as const,
    candidateName:
      interview.application.seeker.account.name || interview.application.seeker.account.email,
    seekerId: interview.application.seeker.id,
    jobTitle: interview.application.job.title,
    jobId: interview.application.job.id,
    detail: "Completed interview — no scorecard submitted",
  }));

  const attention: AttentionData = {
    staleCandidates: staleCandidateItems,
    unscoredInterviews: unscoredItems,
    totalCount: staleCandidateItems.length + unscoredItems.length,
  };

  return {
    activeRolesCount,
    recentRoles,
    candidateCount,
    newApplicationCount,
    hiredCount,
    recentApplications: mappedApplications,
    pipelineStats,
    userRole: ctx.role,
    attention,
  };
}
