import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";

/**
 * GET /api/collections
 *
 * Returns all active collections with job counts.
 *
 * Query params:
 * - featured: "true" to filter to featured collections only
 *
 * Returns: { collections: [...], total: number }
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const featuredOnly = searchParams.get("featured") === "true";

    // Build where clause
    const where: { isActive: boolean; isFeatured?: boolean } = {
      isActive: true,
    };

    if (featuredOnly) {
      where.isFeatured = true;
    }

    // Fetch collections with sponsor and job count
    const collections = await prisma.collection.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        gradientColors: true,
        isFeatured: true,
        displayOrder: true,
        sponsor: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        _count: {
          select: {
            jobs: true,
          },
        },
      },
      orderBy: [{ displayOrder: "asc" }, { title: "asc" }],
    });

    // Transform to include jobCount at top level
    const transformedCollections = collections.map((collection) => ({
      id: collection.id,
      title: collection.title,
      slug: collection.slug,
      description: collection.description,
      gradientColors: collection.gradientColors ? JSON.parse(collection.gradientColors) : null,
      isFeatured: collection.isFeatured,
      displayOrder: collection.displayOrder,
      sponsor: collection.sponsor
        ? {
            id: collection.sponsor.id,
            name: collection.sponsor.name,
            logo: collection.sponsor.logo,
          }
        : null,
      jobCount: collection._count.jobs,
    }));

    return NextResponse.json({
      collections: transformedCollections,
      total: transformedCollections.length,
    });
  } catch (error) {
    logger.error("Error fetching collections", {
      error: formatError(error),
    });
    return NextResponse.json({ error: "Failed to fetch collections" }, { status: 500 });
  }
}
