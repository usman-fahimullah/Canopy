import { prisma } from "@/lib/db";

/**
 * Analytics calculations for the Canopy employer portal.
 * All functions require organizationId to scope queries to a single tenant.
 */

/**
 * Pipeline funnel: count applications by stage.
 * Returns counts grouped by the standard stages (Applied, Screening, Interview, Offer, Hired).
 */
export async function getPipelineFunnel(
  organizationId: string
): Promise<Array<{ stage: string; count: number }>> {
  const stages = [
    { id: "applied", name: "Applied" },
    { id: "screening", name: "Screening" },
    { id: "interview", name: "Interview" },
    { id: "offer", name: "Offer" },
    { id: "hired", name: "Hired" },
  ];

  const counts = await Promise.all(
    stages.map(async (stage) => {
      const count = await prisma.application.count({
        where: {
          job: { organizationId },
          stage: stage.id,
          deletedAt: null,
        },
      });
      return { stage: stage.name, count };
    })
  );

  return counts;
}

/**
 * Hiring stats: time to hire, apps per role, offer rate, pipeline velocity.
 */
export async function getHiringStats(
  organizationId: string
): Promise<{
  timeToHire: number | null;
  appsPerRole: number | null;
  offerRate: number | null;
  pipelineVelocity: number | null;
}> {
  // Time to hire: average days from applied (createdAt) to hired (hiredAt)
  // Only count applications that have been hired
  const hiredApps = await prisma.application.findMany({
    where: {
      job: { organizationId },
      hiredAt: { not: null },
      deletedAt: null,
    },
    select: { createdAt: true, hiredAt: true },
  });

  const timeToHire =
    hiredApps.length > 0
      ? Math.round(
          hiredApps.reduce((sum, app) => {
            const days =
              (app.hiredAt!.getTime() - app.createdAt.getTime()) / (1000 * 60 * 60 * 24);
            return sum + days;
          }, 0) / hiredApps.length
        )
      : null;

  // Apps per role: total applications / count of published roles
  const [totalApps, publishedRoles] = await Promise.all([
    prisma.application.count({
      where: {
        job: { organizationId },
        deletedAt: null,
      },
    }),
    prisma.job.count({
      where: {
        organizationId,
        status: "PUBLISHED",
      },
    }),
  ]);

  const appsPerRole = publishedRoles > 0 ? totalApps / publishedRoles : null;

  // Offer rate: % of offers vs interviews
  // Offers = applications with offeredAt set
  // Interviews = applications with at least one interview record
  const [offerCount, interviewApps] = await Promise.all([
    prisma.application.count({
      where: {
        job: { organizationId },
        offeredAt: { not: null },
        deletedAt: null,
      },
    }),
    prisma.application.findMany({
      where: {
        job: { organizationId },
        interviews: { some: {} },
        deletedAt: null,
      },
      select: { id: true },
    }),
  ]);

  const offerRate = interviewApps.length > 0 ? (offerCount / interviewApps.length) * 100 : null;

  // Pipeline velocity: average days from applied to decision (hired or rejected)
  const decidedApps = await prisma.application.findMany({
    where: {
      job: { organizationId },
      OR: [{ hiredAt: { not: null } }, { rejectedAt: { not: null } }],
      deletedAt: null,
    },
    select: { createdAt: true, hiredAt: true, rejectedAt: true },
  });

  const pipelineVelocity =
    decidedApps.length > 0
      ? Math.round(
          decidedApps.reduce((sum, app) => {
            const decisionDate = app.hiredAt || app.rejectedAt || new Date();
            const days = (decisionDate.getTime() - app.createdAt.getTime()) / (1000 * 60 * 60 * 24);
            return sum + days;
          }, 0) / decidedApps.length
        )
      : null;

  return {
    timeToHire,
    appsPerRole: appsPerRole ? Math.round(appsPerRole * 10) / 10 : null,
    offerRate: offerRate ? Math.round(offerRate) : null,
    pipelineVelocity,
  };
}

/**
 * Applications over time: count applications by week for the last 12 weeks.
 * Returns ISO date strings for the start of each week bucket.
 */
export async function getApplicationsOverTime(
  organizationId: string
): Promise<Array<{ week: string; count: number }>> {
  // Get all applications from the last 12 weeks
  const now = new Date();
  const twelveWeeksAgo = new Date(now.getTime() - 12 * 7 * 24 * 60 * 60 * 1000);

  const applications = await prisma.application.findMany({
    where: {
      job: { organizationId },
      createdAt: { gte: twelveWeeksAgo },
      deletedAt: null,
    },
    select: { createdAt: true },
  });

  // Group by ISO week (Monday = start of week)
  const weekMap = new Map<string, number>();

  applications.forEach((app) => {
    const date = new Date(app.createdAt); // Clone to avoid mutation
    // Calculate the Monday of the week for this date
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
    date.setDate(diff);
    date.setHours(0, 0, 0, 0);
    const weekStart = date.toISOString().split("T")[0];

    weekMap.set(weekStart, (weekMap.get(weekStart) || 0) + 1);
  });

  // Generate all weeks from 12 weeks ago to now, even if empty
  const result: Array<{ week: string; count: number }> = [];
  const seen = new Set<string>();
  for (let i = 11; i >= 0; i--) {
    const weekStart = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
    const day = weekStart.getDay();
    const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
    weekStart.setDate(diff);
    weekStart.setHours(0, 0, 0, 0);
    const weekStartStr = weekStart.toISOString().split("T")[0];

    // Avoid duplicate week entries
    if (seen.has(weekStartStr)) continue;
    seen.add(weekStartStr);

    result.push({
      week: weekStartStr,
      count: weekMap.get(weekStartStr) || 0,
    });
  }

  return result;
}

/**
 * Top jobs: highest 5 jobs by application count, with hired count.
 */
export async function getTopJobs(
  organizationId: string,
  limit: number = 5
): Promise<
  Array<{
    id: string;
    title: string;
    applications: number;
    hired: number;
  }>
> {
  const jobs = await prisma.job.findMany({
    where: { organizationId },
    select: { id: true, title: true },
    take: limit * 2, // Fetch more to ensure we have enough after filtering
  });

  // Get application counts for each job
  const jobsWithCounts = await Promise.all(
    jobs.map(async (job) => {
      const [applicationCount, hiredCount] = await Promise.all([
        prisma.application.count({
          where: {
            jobId: job.id,
            deletedAt: null,
          },
        }),
        prisma.application.count({
          where: {
            jobId: job.id,
            hiredAt: { not: null },
            deletedAt: null,
          },
        }),
      ]);

      return {
        id: job.id,
        title: job.title,
        applications: applicationCount,
        hired: hiredCount,
      };
    })
  );

  // Sort by application count descending and take top 5
  return jobsWithCounts
    .filter((j) => j.applications > 0) // Only include jobs with applications
    .sort((a, b) => b.applications - a.applications)
    .slice(0, limit);
}

/**
 * Source breakdown: count applications by source field.
 * null source is mapped to "Direct".
 */
export async function getSourceBreakdown(
  organizationId: string
): Promise<Array<{ source: string; count: number }>> {
  const applications = await prisma.application.findMany({
    where: {
      job: { organizationId },
      deletedAt: null,
    },
    select: { source: true },
  });

  const sourceMap = new Map<string, number>();

  applications.forEach((app) => {
    const source = app.source || "Direct";
    sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
  });

  // Convert to array and sort by count descending
  return Array.from(sourceMap.entries())
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);
}
