import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";

/**
 * GET /api/jobs/applications
 *
 * Get the current job seeker's applications.
 * Used for linking goals to applications.
 *
 * Query params:
 * - limit: number (default 10)
 * - days: number (default 30) - only return applications from the last N days
 */
export async function GET(request: NextRequest) {
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
      include: { seekerProfile: true },
    });

    if (!account?.seekerProfile) {
      return NextResponse.json({ error: "Seeker profile not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "10", 10), 50);
    const days = parseInt(searchParams.get("days") ?? "30", 10);

    // Calculate date threshold
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    const applications = await prisma.application.findMany({
      where: {
        seekerId: account.seekerProfile.id,
        createdAt: { gte: dateThreshold },
      },
      select: {
        id: true,
        createdAt: true,
        stage: true,
        job: {
          select: {
            id: true,
            title: true,
            organization: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({
      applications: applications.map((app) => ({
        id: app.id,
        appliedAt: app.createdAt.toISOString(),
        status: app.stage,
        job: {
          id: app.job.id,
          title: app.job.title,
          company: app.job.organization?.name ?? null,
        },
      })),
    });
  } catch (error) {
    logger.error("Error fetching seeker applications", {
      error: formatError(error),
      endpoint: "/api/jobs/applications",
    });
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}
