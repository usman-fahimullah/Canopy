import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";

// GET - Fetch a single job by ID with full details for the job detail page
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: jobId } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch job with related data
    const job = await prisma.job.findUnique({
      where: { id: jobId },
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
            description: true,
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
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Only return published jobs
    if (job.status !== "PUBLISHED") {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Fetch recruiter for this job's organization (first RECRUITER or ADMIN member)
    const recruiterMember = await prisma.organizationMember.findFirst({
      where: {
        organizationId: job.organizationId,
        role: { in: ["RECRUITER", "ADMIN"] },
      },
      orderBy: [
        { role: "asc" }, // RECRUITER sorts before ADMIN alphabetically
      ],
      include: {
        account: {
          select: {
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    const recruiter = recruiterMember
      ? {
          name: recruiterMember.account.name ?? recruiterMember.account.email,
          title: recruiterMember.title,
          avatar: recruiterMember.account.avatar,
        }
      : null;

    // Check if user has saved this job
    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      include: {
        seekerProfile: {
          include: {
            savedJobs: {
              where: { jobId },
              select: { seekerId: true, jobId: true, notes: true },
            },
          },
        },
      },
    });

    const isSaved = (account?.seekerProfile?.savedJobs?.length ?? 0) > 0;
    const savedNotes = account?.seekerProfile?.savedJobs?.[0]?.notes ?? null;

    // Fetch candidate similar jobs with multi-signal scoring
    // Pull more candidates than needed so we can score and rank
    const orConditions: Array<Record<string, unknown>> = [];
    if (job.pathwayId) orConditions.push({ pathwayId: job.pathwayId });
    if (job.climateCategory) orConditions.push({ climateCategory: job.climateCategory });
    if (job.locationType) orConditions.push({ locationType: job.locationType });
    if (job.experienceLevel) orConditions.push({ experienceLevel: job.experienceLevel });

    const candidateSimilarJobs =
      orConditions.length > 0
        ? await prisma.job.findMany({
            where: {
              id: { not: jobId },
              status: "PUBLISHED",
              OR: orConditions,
            },
            include: {
              organization: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  logo: true,
                  isBipocOwned: true,
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
            take: 20,
            orderBy: { publishedAt: "desc" },
          })
        : [];

    // Score and rank similar jobs
    const scoredJobs = candidateSimilarJobs
      .map((sj) => {
        let score = 0;
        // Pathway match: +3
        if (job.pathwayId && sj.pathwayId === job.pathwayId) score += 3;
        // Location type match: +2
        if (sj.locationType === job.locationType) score += 2;
        // Experience level match: +1
        if (job.experienceLevel && sj.experienceLevel === job.experienceLevel) score += 1;
        // Same organization: +1
        if (sj.organizationId === job.organizationId) score += 1;
        return { ...sj, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    return NextResponse.json({
      job: {
        id: job.id,
        title: job.title,
        slug: job.slug,
        description: job.description,
        location: job.location,
        locationType: job.locationType,
        employmentType: job.employmentType,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        salaryCurrency: job.salaryCurrency,
        salaryPeriod: job.salaryPeriod,
        climateCategory: job.climateCategory,
        impactDescription: job.impactDescription,
        greenSkills: job.greenSkills,
        requiredCerts: job.requiredCerts,
        experienceLevel: job.experienceLevel,
        educationLevel: job.educationLevel,
        descriptionHtml: job.descriptionHtml,
        isFeatured: job.isFeatured,
        publishedAt: job.publishedAt,
        closesAt: job.closesAt,
        organization: job.organization,
        pathway: job.pathway,
        recruiter,
        isSaved,
        savedNotes,
      },
      similarJobs: scoredJobs.map((sj) => ({
        id: sj.id,
        title: sj.title,
        slug: sj.slug,
        location: sj.location,
        locationType: sj.locationType,
        employmentType: sj.employmentType,
        climateCategory: sj.climateCategory,
        experienceLevel: sj.experienceLevel,
        pathwayId: sj.pathwayId,
        organizationId: sj.organizationId,
        organization: sj.organization,
        pathway: sj.pathway,
        score: sj.score,
      })),
    });
  } catch (error) {
    logger.error("Fetch job detail error", {
      error: formatError(error),
      endpoint: "/api/jobs/[id]",
    });
    return NextResponse.json({ error: "Failed to fetch job details" }, { status: 500 });
  }
}
