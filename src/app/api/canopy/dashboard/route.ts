import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Fetch all dashboard data in parallel using SQL counts instead of in-memory filtering
    const [
      recentJobs,
      activeRolesCount,
      candidateCount,
      newApplicationCount,
      hiredCount,
      recentApplications,
      pipelineGroupBy,
    ] = await Promise.all([
      // Recent jobs for display
      prisma.job.findMany({
        where: { organizationId },
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
      // Active roles count via SQL
      prisma.job.count({
        where: { organizationId, status: "PUBLISHED" },
      }),
      // Total unique candidates
      prisma.application.count({
        where: { job: { organizationId } },
      }),
      // New applications in last 7 days via SQL
      prisma.application.count({
        where: { job: { organizationId }, createdAt: { gte: sevenDaysAgo } },
      }),
      // Hired count via SQL
      prisma.application.count({
        where: { job: { organizationId }, stage: { equals: "hired", mode: "insensitive" } },
      }),
      // Recent applications for display (only 5 needed)
      prisma.application.findMany({
        where: { job: { organizationId } },
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
      // Pipeline stage counts via SQL groupBy
      prisma.application.groupBy({
        by: ["stage"],
        where: { job: { organizationId } },
        _count: { _all: true },
      }),
    ]);

    // Build pipeline stats from groupBy result
    const pipelineStats: Record<string, number> = {};
    const stages = ["Applied", "Screening", "Interview", "Offer", "Hired"];
    stages.forEach((stage) => {
      const match = pipelineGroupBy.find(
        (g) => g.stage.toLowerCase() === stage.toLowerCase()
      );
      pipelineStats[stage] = match?._count._all ?? 0;
    });

    // Map applications to the expected shape
    const mappedApplications = recentApplications.map((app) => ({
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

    // Map jobs to the expected shape
    const recentRoles = recentJobs.map((job) => ({
      id: job.id,
      title: job.title,
      location: job.location,
      locationType: job.locationType,
      status: job.status,
      publishedAt: job.publishedAt?.toISOString() ?? null,
      applicationCount: job._count.applications,
    }));

    return NextResponse.json({
      activeRolesCount,
      recentRoles,
      candidateCount,
      newApplicationCount,
      hiredCount,
      recentApplications: mappedApplications,
      pipelineStats,
    });
  } catch (error) {
    logger.error("Error fetching dashboard data", {
      error: formatError(error),
      endpoint: "/api/canopy/dashboard",
    });
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
