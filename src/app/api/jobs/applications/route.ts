import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";
import {
  resolveJobStages,
  resolveStage,
  getPhaseProgress,
  getSeekerSection,
  getPhaseGroup,
} from "@/lib/pipeline/stage-registry";

/**
 * GET /api/jobs/applications
 *
 * Get the current job seeker's applications with enriched data.
 * Returns stage, timestamps, offer status, and interview info
 * so candidates can track their full application journey.
 *
 * Query params:
 * - limit: number (default 50, max 100)
 * - days: number (default 365) - only return applications from the last N days
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
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50", 10), 100);
    const days = parseInt(searchParams.get("days") ?? "365", 10);

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
        updatedAt: true,
        stage: true,
        rejectedAt: true,
        hiredAt: true,
        offeredAt: true,
        job: {
          select: {
            id: true,
            title: true,
            stages: true,
            organization: {
              select: {
                name: true,
                logo: true,
              },
            },
          },
        },
        offer: {
          select: {
            id: true,
            status: true,
          },
        },
        interviews: {
          where: {
            status: { in: ["SCHEDULED", "IN_PROGRESS"] },
          },
          select: {
            id: true,
            scheduledAt: true,
            type: true,
            status: true,
          },
          orderBy: { scheduledAt: "asc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
      take: limit,
    });

    return NextResponse.json({
      seekerId: account.seekerProfile.id,
      applications: applications.map((app) => {
        // Resolve the job's pipeline stages and compute phase progress
        const jobStages = resolveJobStages(
          typeof app.job.stages === "string"
            ? app.job.stages
            : app.job.stages
              ? JSON.stringify(app.job.stages)
              : null
        );
        const resolvedStage = resolveStage({
          id: app.stage,
          name: app.stage,
          phaseGroup: undefined,
        });
        // Try to find the actual stage name from the job's pipeline
        const matchingStage = jobStages.find((s) => s.id === app.stage);
        const stageName = matchingStage?.name ?? resolvedStage.name;
        const phaseGroup = matchingStage?.phaseGroup ?? resolvedStage.phaseGroup;
        const seekerSection = getSeekerSection(app.stage);
        const phaseProgress = getPhaseProgress(app.stage, jobStages);

        return {
          id: app.id,
          appliedAt: app.createdAt.toISOString(),
          updatedAt: app.updatedAt.toISOString(),
          status: app.stage,
          rejectedAt: app.rejectedAt?.toISOString() ?? null,
          hiredAt: app.hiredAt?.toISOString() ?? null,
          offeredAt: app.offeredAt?.toISOString() ?? null,
          job: {
            id: app.job.id,
            title: app.job.title,
            company: app.job.organization?.name ?? null,
            logo: app.job.organization?.logo ?? null,
          },
          hasOffer: !!app.offer,
          offerStatus: app.offer?.status ?? null,
          nextInterview: app.interviews[0]
            ? {
                id: app.interviews[0].id,
                scheduledAt: app.interviews[0].scheduledAt.toISOString(),
                type: app.interviews[0].type,
              }
            : null,
          // Enriched stage metadata (Phase 3)
          stageName,
          phaseGroup,
          seekerSection,
          phaseProgress: {
            current: phaseProgress.current,
            total: phaseProgress.total,
            stages: phaseProgress.stageNames,
          },
        };
      }),
    });
  } catch (error) {
    logger.error("Error fetching seeker applications", {
      error: formatError(error),
      endpoint: "/api/jobs/applications",
    });
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}
