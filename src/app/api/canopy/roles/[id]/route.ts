import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";
import { enqueueSyndication } from "@/lib/syndication/service";
import type { SyndicationPlatform } from "@/lib/syndication/types";
import { getAvailablePlatforms } from "@/lib/syndication/platforms";

/**
 * GET /api/canopy/roles/[id]
 *
 * Fetch a single role with its applications for the employer pipeline view.
 * Requires authenticated user with org membership that owns the job.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Get the user's org membership
    const membership = await prisma.organizationMember.findFirst({
      where: { accountId: account.id },
    });

    if (!membership) {
      return NextResponse.json({ error: "Organization membership required" }, { status: 403 });
    }

    // Fetch job scoped to org
    const job = await prisma.job.findFirst({
      where: {
        id,
        organizationId: membership.organizationId,
      },
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
        impactDescription: true,
        requiredCerts: true,
        greenSkills: true,
        experienceLevel: true,
        status: true,
        publishedAt: true,
        closesAt: true,
        stages: true,
        formConfig: true,
        formQuestions: true,
        syndicationEnabled: true,
        createdAt: true,
        updatedAt: true,
        applications: {
          select: {
            id: true,
            stage: true,
            stageOrder: true,
            matchScore: true,
            matchReasons: true,
            source: true,
            coverLetter: true,
            formResponses: true,
            knockoutPassed: true,
            rejectedAt: true,
            hiredAt: true,
            createdAt: true,
            updatedAt: true,
            seeker: {
              select: {
                id: true,
                headline: true,
                resumeUrl: true,
                skills: true,
                greenSkills: true,
                certifications: true,
                yearsExperience: true,
                account: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    avatar: true,
                  },
                },
              },
            },
          },
          orderBy: [{ stageOrder: "asc" }, { createdAt: "desc" }],
        },
        _count: {
          select: { applications: true },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    // Parse stages JSON
    let stages: { id: string; name: string }[] = [];
    try {
      stages = JSON.parse(job.stages);
    } catch {
      stages = [
        { id: "applied", name: "Applied" },
        { id: "screening", name: "Screening" },
        { id: "interview", name: "Interview" },
        { id: "offer", name: "Offer" },
        { id: "hired", name: "Hired" },
      ];
    }

    // Calculate stage counts
    const stageCounts: Record<string, number> = {};
    for (const stage of stages) {
      stageCounts[stage.id] = 0;
    }
    for (const app of job.applications) {
      const stageId = app.stage || "applied";
      if (stageCounts[stageId] !== undefined) {
        stageCounts[stageId]++;
      } else {
        stageCounts[stageId] = 1;
      }
    }

    return NextResponse.json({
      job: {
        ...job,
        stages,
        applications: undefined, // Don't nest under job
      },
      applications: job.applications,
      stageCounts,
      totalApplications: job._count.applications,
    });
  } catch (error) {
    logger.error("Error fetching role detail", {
      error: formatError(error),
      endpoint: "/api/canopy/roles/[id]",
    });
    return NextResponse.json({ error: "Failed to fetch role details" }, { status: 500 });
  }
}

/**
 * PATCH /api/canopy/roles/[id]
 *
 * Update a role's details. Supports partial updates — only provided fields
 * are changed. Covers all editable job fields for the role editor.
 */
const UpdateJobSchema = z.object({
  // Status management
  status: z.enum(["DRAFT", "PUBLISHED", "PAUSED", "CLOSED"]).optional(),

  // Core details
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  location: z.string().optional().nullable(),
  locationType: z.enum(["ONSITE", "REMOTE", "HYBRID"]).optional(),
  employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"]).optional(),

  // Compensation
  salaryMin: z.number().int().positive().optional().nullable(),
  salaryMax: z.number().int().positive().optional().nullable(),
  salaryCurrency: z.string().optional(),

  // Climate-specific
  climateCategory: z.string().optional().nullable(),
  impactDescription: z.string().optional().nullable(),
  requiredCerts: z.array(z.string()).optional(),
  greenSkills: z.array(z.string()).optional(),

  // Experience
  experienceLevel: z.enum(["ENTRY", "INTERMEDIATE", "SENIOR", "EXECUTIVE"]).optional().nullable(),

  // Dates
  closesAt: z.string().datetime().optional().nullable(),

  // Syndication
  syndicationEnabled: z.boolean().optional(),

  // Application form configuration (stored as JSON — includes structured description,
  // education, compensation, and sidebar settings alongside apply-form config)
  formConfig: z
    .object({
      personalDetails: z.record(
        z.string(),
        z.object({
          visible: z.boolean(),
          required: z.boolean(),
        })
      ),
      careerDetails: z.record(
        z.string(),
        z.object({
          visible: z.boolean(),
          required: z.boolean(),
        })
      ),
      requiredFiles: z.object({
        resume: z.boolean(),
        coverLetter: z.boolean(),
        portfolio: z.boolean(),
      }),
      // Structured description sections (stored so we can decompose on load)
      structuredDescription: z
        .object({
          description: z.string().optional(),
          responsibilities: z.string().optional(),
          requiredQuals: z.string().optional(),
          desiredQuals: z.string().optional(),
        })
        .optional(),
      // Additional form fields not in the Job schema
      educationLevel: z.string().optional(),
      educationDetails: z.string().optional(),
      payType: z.string().optional(),
      payFrequency: z.string().optional(),
      selectedBenefits: z.array(z.string()).optional(),
      compensationDetails: z.string().optional(),
      showRecruiter: z.boolean().optional(),
      externalLink: z.string().optional(),
    })
    .optional(),
  formQuestions: z
    .array(
      z.object({
        id: z.string(),
        type: z.enum(["text", "yes-no", "multiple-choice", "file-upload"]),
        title: z.string().min(1).max(500),
        required: z.boolean(),
        description: z.string().max(1000).optional(),
        options: z.array(z.string().max(200)).optional(),
      })
    )
    .optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const membership = await prisma.organizationMember.findFirst({
      where: { accountId: account.id },
    });

    if (!membership) {
      return NextResponse.json({ error: "Organization membership required" }, { status: 403 });
    }

    const body = await request.json();
    const result = UpdateJobSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }

    // Build update payload from provided fields only
    const data = result.data;
    const updateData: Record<string, unknown> = {};

    // Status + auto-set publishedAt
    if (data.status !== undefined) {
      updateData.status = data.status;
      if (data.status === "PUBLISHED") {
        updateData.publishedAt = new Date();
      }
    }

    // Core fields
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.locationType !== undefined) updateData.locationType = data.locationType;
    if (data.employmentType !== undefined) updateData.employmentType = data.employmentType;

    // Compensation
    if (data.salaryMin !== undefined) updateData.salaryMin = data.salaryMin;
    if (data.salaryMax !== undefined) updateData.salaryMax = data.salaryMax;
    if (data.salaryCurrency !== undefined) updateData.salaryCurrency = data.salaryCurrency;

    // Climate-specific
    if (data.climateCategory !== undefined) updateData.climateCategory = data.climateCategory;
    if (data.impactDescription !== undefined) updateData.impactDescription = data.impactDescription;
    if (data.requiredCerts !== undefined) updateData.requiredCerts = data.requiredCerts;
    if (data.greenSkills !== undefined) updateData.greenSkills = data.greenSkills;

    // Experience
    if (data.experienceLevel !== undefined) updateData.experienceLevel = data.experienceLevel;

    // Dates
    if (data.closesAt !== undefined) {
      updateData.closesAt = data.closesAt ? new Date(data.closesAt) : null;
    }

    // Application form config
    if (data.formConfig !== undefined) updateData.formConfig = data.formConfig;
    if (data.formQuestions !== undefined) updateData.formQuestions = data.formQuestions;

    // Syndication
    if (data.syndicationEnabled !== undefined)
      updateData.syndicationEnabled = data.syndicationEnabled;

    // Don't allow empty updates
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const updated = await prisma.job.updateMany({
      where: {
        id,
        organizationId: membership.organizationId,
      },
      data: updateData,
    });

    if (updated.count === 0) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    // Trigger syndication when job is published with syndication enabled
    if (data.status === "PUBLISHED") {
      const job = await prisma.job.findUnique({
        where: { id },
        select: { syndicationEnabled: true },
      });

      if (job?.syndicationEnabled) {
        const platforms = getAvailablePlatforms();
        enqueueSyndication(id, platforms, "post").catch((err) => {
          logger.error("Failed to enqueue syndication on publish", {
            error: formatError(err),
            jobId: id,
          });
        });
      }
    }

    // Trigger syndication removal when job is paused/closed
    if (data.status === "PAUSED" || data.status === "CLOSED") {
      const platforms = getAvailablePlatforms();
      enqueueSyndication(id, platforms, "remove").catch((err) => {
        logger.error("Failed to enqueue syndication removal", {
          error: formatError(err),
          jobId: id,
        });
      });
    }

    // Trigger syndication when syndicationEnabled is toggled on for a published job
    if (data.syndicationEnabled === true && data.status === undefined) {
      const job = await prisma.job.findUnique({
        where: { id },
        select: { status: true },
      });

      if (job?.status === "PUBLISHED") {
        const platforms = getAvailablePlatforms();
        enqueueSyndication(id, platforms, "post").catch((err) => {
          logger.error("Failed to enqueue syndication on toggle", {
            error: formatError(err),
            jobId: id,
          });
        });
      }
    }

    // Trigger syndication removal when syndicationEnabled is toggled off
    if (data.syndicationEnabled === false) {
      const platforms = getAvailablePlatforms();
      enqueueSyndication(id, platforms, "remove").catch((err) => {
        logger.error("Failed to enqueue syndication removal on toggle", {
          error: formatError(err),
          jobId: id,
        });
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error updating role", {
      error: formatError(error),
      endpoint: "/api/canopy/roles/[id]",
    });
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
}
