import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { z } from "zod";
import { getAuthContext, canManagePipeline } from "@/lib/access-control";

const ENDPOINT = "POST /api/canopy/roles/bulk-import";

const BulkImportRowSchema = z.object({
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
  closesAt: z.string().datetime().optional().nullable(),
});

const BulkImportSchema = z.object({
  roles: z
    .array(BulkImportRowSchema)
    .min(1, "At least one role is required")
    .max(50, "Maximum 50 roles per import"),
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

/**
 * Given a base slug and a set of already-taken slugs, return a unique variant.
 * Appends -1, -2, ... until a free slug is found, also tracking newly
 * generated slugs so sibling rows in the same batch don't collide.
 */
function uniqueSlug(base: string, taken: Set<string>): string {
  let slug = base;
  let suffix = 0;
  while (taken.has(slug)) {
    suffix++;
    slug = `${base}-${suffix}`;
  }
  taken.add(slug);
  return slug;
}

export async function POST(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canManagePipeline(ctx)) {
      return NextResponse.json(
        { error: "You do not have permission to import roles" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const result = BulkImportSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }

    const { roles: rows } = result.data;
    const orgId = ctx.organizationId;

    const created = await prisma.$transaction(async (tx) => {
      // Fetch all existing slugs for the org in one query (avoid N+1)
      const existingJobs = await tx.job.findMany({
        where: { organizationId: orgId },
        select: { slug: true },
      });
      const taken = new Set(existingJobs.map((j) => j.slug));

      const jobs: { id: string; title: string; slug: string }[] = [];

      for (const row of rows) {
        const slug = uniqueSlug(slugify(row.title), taken);

        const job = await tx.job.create({
          data: {
            title: row.title,
            slug,
            description: row.description,
            location: row.location,
            locationType: row.locationType,
            employmentType: row.employmentType,
            salaryMin: row.salaryMin,
            salaryMax: row.salaryMax,
            salaryCurrency: "USD",
            closesAt: row.closesAt ? new Date(row.closesAt) : null,
            status: "DRAFT",
            organizationId: orgId,
          },
          select: { id: true, title: true, slug: true },
        });

        jobs.push(job);
      }

      return jobs;
    });

    logger.info("Bulk role import completed", {
      organizationId: orgId,
      count: created.length,
      endpoint: ENDPOINT,
    });

    return NextResponse.json({ created: created.length, roles: created }, { status: 201 });
  } catch (error) {
    logger.error("Error during bulk role import", {
      error: formatError(error),
      endpoint: ENDPOINT,
    });
    return NextResponse.json({ error: "Failed to import roles" }, { status: 500 });
  }
}
