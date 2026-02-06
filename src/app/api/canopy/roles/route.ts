import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";

/**
 * GET /api/canopy/roles
 *
 * Returns the authenticated employer's organization roles (all statuses).
 * Includes pathway/category info and application counts for the roles table.
 */
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

    const jobs = await prisma.job.findMany({
      where: { organizationId },
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
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    const formattedJobs = jobs.map((job) => ({
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
      applicationCount: job._count.applications,
    }));

    return NextResponse.json({ jobs: formattedJobs });
  } catch (error) {
    logger.error("Error fetching employer roles", {
      error: formatError(error),
      endpoint: "/api/canopy/roles",
    });
    return NextResponse.json({ error: "Failed to fetch roles" }, { status: 500 });
  }
}
