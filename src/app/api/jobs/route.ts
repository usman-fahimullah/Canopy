import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";

// GET - List published jobs with filters for the jobs page
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Filter parameters
    const search = searchParams.get("search");
    const pathway = searchParams.get("pathway");
    const locationType = searchParams.get("locationType");
    const experienceLevel = searchParams.get("experienceLevel");
    const employmentType = searchParams.get("employmentType");
    const minSalary = searchParams.get("minSalary");
    const maxSalary = searchParams.get("maxSalary");
    const featured = searchParams.get("featured");
    const climateCategory = searchParams.get("climateCategory");

    // Pagination
    const page = Math.max(parseInt(searchParams.get("page") || "1") || 1, 1);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20") || 20, 100);
    const skip = (page - 1) * limit;

    // Sort
    const sort = searchParams.get("sort") || "newest";

    // Build where clause
    const where: Record<string, unknown> = {
      status: "PUBLISHED",
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { organization: { name: { contains: search, mode: "insensitive" } } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }

    if (pathway) {
      where.pathwayId = pathway;
    }

    if (locationType) {
      where.locationType = locationType;
    }

    if (experienceLevel) {
      where.experienceLevel = experienceLevel;
    }

    if (employmentType) {
      where.employmentType = employmentType;
    }

    if (minSalary || maxSalary) {
      const minSalaryNum = minSalary ? parseInt(minSalary) : NaN;
      const maxSalaryNum = maxSalary ? parseInt(maxSalary) : NaN;
      if (!Number.isNaN(minSalaryNum)) where.salaryMin = { gte: minSalaryNum };
      if (!Number.isNaN(maxSalaryNum)) where.salaryMax = { lte: maxSalaryNum };
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    if (climateCategory) {
      where.climateCategory = climateCategory;
    }

    // Build orderBy
    let orderBy: Record<string, string> | Record<string, string>[] = { publishedAt: "desc" };
    switch (sort) {
      case "salary_high":
        orderBy = { salaryMax: "desc" };
        break;
      case "salary_low":
        orderBy = { salaryMin: "asc" };
        break;
      case "oldest":
        orderBy = { publishedAt: "asc" };
        break;
      case "title":
        orderBy = { title: "asc" };
        break;
      default:
        orderBy = [{ isFeatured: "desc" }, { publishedAt: "desc" }];
    }

    // Get total count for pagination
    const total = await prisma.job.count({ where });

    // Fetch jobs
    const jobs = await prisma.job.findMany({
      where,
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
        _count: {
          select: { applications: true },
        },
      },
      orderBy,
      skip,
      take: limit,
    });

    // Format for frontend
    const formattedJobs = jobs.map((job) => ({
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
      closesAt: job.closesAt,
      organization: job.organization,
      pathway: job.pathway,
      applicationCount: job._count.applications,
    }));

    return NextResponse.json({
      jobs: formattedJobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error("Fetch jobs error", { error: formatError(error), endpoint: "/api/jobs" });
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}
