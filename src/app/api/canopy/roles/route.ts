import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { z } from "zod";

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

/* -------------------------------------------------------------------
   POST /api/canopy/roles
   Creates a new role (job) for the authenticated employer's organization.
   ------------------------------------------------------------------- */

const CreateRoleSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional().default(""),
  location: z.string().optional().nullable(),
  locationType: z.enum(["ONSITE", "REMOTE", "HYBRID"]).optional().default("ONSITE"),
  employmentType: z
    .enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"])
    .optional()
    .default("FULL_TIME"),
  salaryMin: z.number().int().positive().optional().nullable(),
  salaryMax: z.number().int().positive().optional().nullable(),
  salaryCurrency: z.string().optional().default("USD"),
  climateCategory: z.string().optional().nullable(),
  impactDescription: z.string().optional().nullable(),
  requiredCerts: z.array(z.string()).optional().default([]),
  greenSkills: z.array(z.string()).optional().default([]),
  experienceLevel: z.enum(["ENTRY", "INTERMEDIATE", "SENIOR", "EXECUTIVE"]).optional().nullable(),
  closesAt: z.string().datetime().optional().nullable(),
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

export async function POST(request: NextRequest) {
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

    // Validate input
    const body = await request.json();
    const result = CreateRoleSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const data = result.data;

    // Generate unique slug
    const baseSlug = slugify(data.title);
    let slug = baseSlug;
    let attempt = 0;

    // Ensure slug uniqueness within the organization
    while (true) {
      const existing = await prisma.job.findUnique({
        where: { organizationId_slug: { organizationId, slug } },
        select: { id: true },
      });
      if (!existing) break;
      attempt++;
      slug = `${baseSlug}-${attempt}`;
    }

    const job = await prisma.job.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        location: data.location,
        locationType: data.locationType,
        employmentType: data.employmentType,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        salaryCurrency: data.salaryCurrency,
        climateCategory: data.climateCategory,
        impactDescription: data.impactDescription,
        requiredCerts: data.requiredCerts,
        greenSkills: data.greenSkills,
        experienceLevel: data.experienceLevel,
        closesAt: data.closesAt ? new Date(data.closesAt) : null,
        status: "DRAFT",
        organizationId,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
      },
    });

    logger.info("Role created", {
      jobId: job.id,
      organizationId,
      title: job.title,
    });

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    logger.error("Error creating role", {
      error: formatError(error),
      endpoint: "/api/canopy/roles",
    });
    return NextResponse.json({ error: "Failed to create role" }, { status: 500 });
  }
}
