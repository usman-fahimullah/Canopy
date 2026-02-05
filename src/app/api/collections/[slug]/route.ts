import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { JobStatus } from "@prisma/client";

/**
 * GET /api/collections/[slug]
 *
 * Returns a single collection by slug with its jobs.
 *
 * Returns: { collection: {...}, jobs: [...] }
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    // Fetch collection with sponsor
    const collection = await prisma.collection.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        gradientColors: true,
        backgroundImage: true,
        isFeatured: true,
        displayOrder: true,
        sponsor: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
      },
    });

    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    // Fetch jobs in this collection (only published jobs)
    const collectionJobs = await prisma.collectionJob.findMany({
      where: {
        collectionId: collection.id,
        job: {
          status: JobStatus.PUBLISHED,
        },
      },
      select: {
        displayOrder: true,
        job: {
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            location: true,
            locationType: true,
            employmentType: true,
            salaryMin: true,
            salaryMax: true,
            salaryCurrency: true,
            climateCategory: true,
            greenSkills: true,
            publishedAt: true,
            closesAt: true,
            organization: {
              select: {
                id: true,
                name: true,
                slug: true,
                logo: true,
                isBipocOwned: true,
              },
            },
          },
        },
      },
      orderBy: {
        displayOrder: "asc",
      },
    });

    // Transform collection
    const transformedCollection = {
      id: collection.id,
      title: collection.title,
      slug: collection.slug,
      description: collection.description,
      gradientColors: collection.gradientColors ? JSON.parse(collection.gradientColors) : null,
      backgroundImage: collection.backgroundImage,
      isFeatured: collection.isFeatured,
      displayOrder: collection.displayOrder,
      sponsor: collection.sponsor
        ? {
            id: collection.sponsor.id,
            name: collection.sponsor.name,
            logo: collection.sponsor.logo,
          }
        : null,
      jobCount: collectionJobs.length,
    };

    // Transform jobs - add isFeatured, isClosingSoon flags
    const now = new Date();
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const transformedJobs = collectionJobs.map(({ job }) => ({
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
      greenSkills: job.greenSkills,
      publishedAt: job.publishedAt,
      closesAt: job.closesAt,
      organization: {
        id: job.organization.id,
        name: job.organization.name,
        slug: job.organization.slug,
        logo: job.organization.logo,
        isBipocOwned: job.organization.isBipocOwned,
      },
      isFeatured: false, // Could be determined by other criteria
      isBipocOwned: job.organization.isBipocOwned,
      isClosingSoon: job.closesAt ? new Date(job.closesAt) <= oneWeekFromNow : false,
      isSaved: false, // Would need user context to determine
    }));

    return NextResponse.json({
      collection: transformedCollection,
      jobs: transformedJobs,
    });
  } catch (error) {
    logger.error("Error fetching collection", {
      error: formatError(error),
    });
    return NextResponse.json({ error: "Failed to fetch collection" }, { status: 500 });
  }
}
