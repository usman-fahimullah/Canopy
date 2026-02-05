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

    // Fetch all dashboard data in parallel, scoped to the organization
    const [jobs, applications, candidateCount] = await Promise.all([
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
        take: 50,
      }),
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
        take: 100,
      }),
      prisma.application.count({
        where: { job: { organizationId } },
      }),
    ]);

    const activeRolesCount = jobs.filter((j) => j.status === "PUBLISHED").length;

    // Pipeline stats
    const pipelineStats: Record<string, number> = {};
    const stages = ["Applied", "Screening", "Interview", "Offer", "Hired"];
    stages.forEach((stage) => {
      pipelineStats[stage] = applications.filter(
        (a) => a.stage.toLowerCase() === stage.toLowerCase()
      ).length;
    });

    // Recent applications (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newApplicationCount = applications.filter(
      (a) => new Date(a.createdAt) >= sevenDaysAgo
    ).length;

    const hiredCount = applications.filter((a) => a.stage.toLowerCase() === "hired").length;

    // Map applications to the expected shape
    const recentApplications = applications.slice(0, 5).map((app) => ({
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
    const recentRoles = jobs.slice(0, 5).map((job) => ({
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
      recentApplications,
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
