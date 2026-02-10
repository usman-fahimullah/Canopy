import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { z } from "zod";
import { getAuthContext } from "@/lib/access-control";
import { fetchRolesList } from "@/lib/services/roles";

/**
 * GET /api/canopy/roles
 *
 * Returns the authenticated employer's organization roles (all statuses).
 * Includes pathway/category info and application counts for the roles table.
 */
const GetRolesSchema = z.object({
  skip: z.coerce.number().int().min(0).default(0),
  take: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(["DRAFT", "PUBLISHED", "PAUSED", "CLOSED"]).optional(),
  employmentType: z
    .enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "VOLUNTEER"])
    .optional(),
  locationType: z.enum(["ONSITE", "REMOTE", "HYBRID"]).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate query params
    const params = GetRolesSchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
    if (!params.success) {
      return NextResponse.json(
        { error: "Invalid parameters", details: params.error.flatten() },
        { status: 422 }
      );
    }

    const data = await fetchRolesList(ctx, params.data);
    return NextResponse.json(data);
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
    .enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "VOLUNTEER"])
    .optional()
    .default("FULL_TIME"),
  salaryMin: z.number().int().positive().optional().nullable(),
  salaryMax: z.number().int().positive().optional().nullable(),
  salaryCurrency: z.string().optional().default("USD"),
  salaryPeriod: z.enum(["ANNUAL", "HOURLY", "WEEKLY", "MONTHLY"]).optional().nullable(),
  climateCategory: z.string().optional().nullable(),
  impactDescription: z.string().optional().nullable(),
  requiredCerts: z.array(z.string()).optional().default([]),
  greenSkills: z.array(z.string()).optional().default([]),
  experienceLevel: z.enum(["ENTRY", "INTERMEDIATE", "SENIOR", "EXECUTIVE"]).optional().nullable(),
  educationLevel: z
    .enum([
      "NONE",
      "HIGH_SCHOOL",
      "ASSOCIATE",
      "BACHELOR",
      "MASTER",
      "DOCTORATE",
      "VOCATIONAL",
      "PROFESSIONAL",
    ])
    .optional()
    .nullable(),
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
        salaryPeriod: data.salaryPeriod,
        climateCategory: data.climateCategory,
        impactDescription: data.impactDescription,
        requiredCerts: data.requiredCerts,
        greenSkills: data.greenSkills,
        experienceLevel: data.experienceLevel,
        educationLevel: data.educationLevel,
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
