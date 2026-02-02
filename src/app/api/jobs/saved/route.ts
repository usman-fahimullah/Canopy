import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";

// GET - Get saved jobs for the current seeker
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user's seeker profile
    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      include: {
        seekerProfile: true,
      },
    });

    if (!account?.seekerProfile) {
      return NextResponse.json({ error: "Seeker profile not found" }, { status: 404 });
    }

    // Fetch saved jobs
    const savedJobs = await prisma.savedJob.findMany({
      where: {
        seekerId: account.seekerProfile.id,
      },
      include: {
        job: {
          include: {
            organization: {
              select: {
                id: true,
                name: true,
                slug: true,
                logo: true,
                isBipocOwned: true,
                isWomenOwned: true,
                isVeteranOwned: true,
              },
            },
            pathway: {
              select: {
                id: true,
                name: true,
                slug: true,
                icon: true,
                color: true,
              },
            },
          },
        },
      },
      orderBy: { savedAt: "desc" },
      take: 100,
    });

    // Format for frontend
    const formattedJobs = savedJobs.map((saved) => ({
      id: saved.job.id,
      title: saved.job.title,
      slug: saved.job.slug,
      description: saved.job.description,
      location: saved.job.location,
      locationType: saved.job.locationType,
      employmentType: saved.job.employmentType,
      salaryMin: saved.job.salaryMin,
      salaryMax: saved.job.salaryMax,
      salaryCurrency: saved.job.salaryCurrency,
      climateCategory: saved.job.climateCategory,
      greenSkills: saved.job.greenSkills,
      experienceLevel: saved.job.experienceLevel,
      isFeatured: saved.job.isFeatured,
      status: saved.job.status,
      publishedAt: saved.job.publishedAt,
      closesAt: saved.job.closesAt,
      organization: saved.job.organization,
      pathway: saved.job.pathway,
      savedAt: saved.savedAt,
      notes: saved.notes,
      isSaved: true,
    }));

    return NextResponse.json({ jobs: formattedJobs });
  } catch (error) {
    logger.error("Fetch saved jobs error", { error: formatError(error), endpoint: "/api/jobs/saved" });
    return NextResponse.json(
      { error: "Failed to fetch saved jobs" },
      { status: 500 }
    );
  }
}
