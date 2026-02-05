import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { logger, formatError } from "@/lib/logger";

// GET - Get matched jobs for the current seeker based on their profile
// Supports search filters: ?search=keyword&location=city&locationType=REMOTE
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 100);

    // Search filters
    const searchQuery = searchParams.get("search")?.trim() || "";
    const locationQuery = searchParams.get("location")?.trim() || "";
    const locationTypeFilter = searchParams.get("locationType") || ""; // REMOTE, HYBRID, ONSITE

    // Get the user's account and seeker profile
    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      include: {
        seekerProfile: {
          include: {
            interestedPathways: {
              include: { pathway: true },
            },
            savedJobs: true,
          },
        },
      },
    });

    if (!account?.seekerProfile) {
      return NextResponse.json({ error: "Seeker profile not found" }, { status: 404 });
    }

    const seeker = account.seekerProfile;
    const savedJobIds = seeker.savedJobs.map((sj) => sj.jobId);

    // Build matching criteria based on seeker profile
    const pathwayIds = seeker.interestedPathways.map((sp) => sp.pathwayId);
    const seekerSkills = [...(seeker.skills || []), ...(seeker.greenSkills || [])];

    // Build search conditions
    const searchConditions: Prisma.JobWhereInput[] = [];

    // Text search filter (title, description, company name, skills)
    if (searchQuery) {
      searchConditions.push({
        OR: [
          { title: { contains: searchQuery, mode: "insensitive" } },
          { description: { contains: searchQuery, mode: "insensitive" } },
          { climateCategory: { contains: searchQuery, mode: "insensitive" } },
          { greenSkills: { hasSome: [searchQuery] } },
          { organization: { name: { contains: searchQuery, mode: "insensitive" } } },
        ],
      });
    }

    // Location filter (city, state, zip)
    if (locationQuery) {
      searchConditions.push({
        location: { contains: locationQuery, mode: "insensitive" },
      });
    }

    // Location type filter (Remote, Hybrid, Onsite)
    if (locationTypeFilter && ["REMOTE", "HYBRID", "ONSITE"].includes(locationTypeFilter)) {
      searchConditions.push({
        locationType: locationTypeFilter as "REMOTE" | "HYBRID" | "ONSITE",
      });
    }

    // Profile-based matching conditions (for when no search filters applied)
    const profileConditions: Prisma.JobWhereInput[] = [
      // Match by pathway
      pathwayIds.length > 0 ? { pathwayId: { in: pathwayIds } } : {},
      // Match by target sectors
      seeker.targetSectors.length > 0 ? { climateCategory: { in: seeker.targetSectors } } : {},
      // Match by green skills
      seekerSkills.length > 0 ? { greenSkills: { hasSome: seekerSkills } } : {},
    ].filter((condition) => Object.keys(condition).length > 0);

    // Build final where clause
    const whereClause: Prisma.JobWhereInput = {
      status: "PUBLISHED",
      // If search filters are applied, use them; otherwise fall back to profile matching
      ...(searchConditions.length > 0
        ? { AND: searchConditions }
        : profileConditions.length > 0
          ? { OR: profileConditions }
          : {}),
    };

    // Find matching jobs
    const jobs = await prisma.job.findMany({
      where: whereClause,
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
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
      take: limit * 2, // Fetch extra to allow for scoring
    });

    // Calculate match scores
    const scoredJobs = jobs.map((job) => {
      let score = 0;
      const matchReasons: string[] = [];

      // Pathway match (highest weight)
      if (job.pathwayId && pathwayIds.includes(job.pathwayId)) {
        score += 40;
        const pathwayName = job.pathway?.name;
        if (pathwayName) matchReasons.push(`Matches your ${pathwayName} interest`);
      }

      // Sector match
      if (job.climateCategory && seeker.targetSectors.includes(job.climateCategory)) {
        score += 30;
        matchReasons.push(`Aligns with your target sector`);
      }

      // Skills match
      const jobSkills = job.greenSkills || [];
      const matchingSkills = jobSkills.filter((skill) =>
        seekerSkills.some((s) => s.toLowerCase() === skill.toLowerCase())
      );
      if (matchingSkills.length > 0) {
        score += Math.min(matchingSkills.length * 10, 30);
        matchReasons.push(`${matchingSkills.length} matching skills`);
      }

      // Featured boost
      if (job.isFeatured) {
        score += 5;
      }

      // Location preference match (if we had that data)
      // For now, boost remote jobs slightly
      if (job.locationType === "REMOTE") {
        score += 5;
      }

      return {
        ...job,
        matchScore: Math.min(score, 100),
        matchReasons,
        isSaved: savedJobIds.includes(job.id),
      };
    });

    // Sort by score and take limit
    const topMatches = scoredJobs.sort((a, b) => b.matchScore - a.matchScore).slice(0, limit);

    // Format for frontend
    const formattedJobs = topMatches.map((job) => ({
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
      climateCategory: job.climateCategory,
      impactDescription: job.impactDescription,
      greenSkills: job.greenSkills,
      experienceLevel: job.experienceLevel,
      isFeatured: job.isFeatured,
      publishedAt: job.publishedAt,
      organization: job.organization,
      pathway: job.pathway,
      matchScore: job.matchScore,
      matchReasons: job.matchReasons,
      isSaved: job.isSaved,
    }));

    return NextResponse.json({ jobs: formattedJobs });
  } catch (error) {
    logger.error("Fetch job matches error", {
      error: formatError(error),
      endpoint: "/api/jobs/matches",
    });
    return NextResponse.json({ error: "Failed to fetch job matches" }, { status: 500 });
  }
}
