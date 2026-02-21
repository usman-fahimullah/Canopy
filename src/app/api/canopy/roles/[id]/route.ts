import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { enqueueSyndication } from "@/lib/syndication/service";
import { getAvailablePlatforms } from "@/lib/syndication/platforms";
import { getAuthContext, canAccessJob } from "@/lib/access-control";
import { canPublishJob } from "@/lib/billing/feature-gates";
import { hasCredits, consumeCredit } from "@/lib/services/credits";

/**
 * GET /api/canopy/roles/[id]
 *
 * Fetch a single role with its applications for the employer pipeline view.
 * Requires authenticated user with org membership that owns the job.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Scoped access check
    if (!canAccessJob(ctx, id)) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    // Fetch job scoped to org
    const job = await prisma.job.findFirst({
      where: {
        id,
        organizationId: ctx.organizationId,
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
        salaryPeriod: true,
        climateCategory: true,
        impactDescription: true,
        requiredCerts: true,
        greenSkills: true,
        experienceLevel: true,
        educationLevel: true,
        descriptionHtml: true,
        status: true,
        publishedAt: true,
        closesAt: true,
        stages: true,
        formConfig: true,
        formQuestions: true,
        syndicationEnabled: true,
        departmentId: true,
        department: {
          select: { id: true, name: true, color: true },
        },
        recruiterId: true,
        hiringManagerId: true,
        recruiter: {
          select: {
            id: true,
            title: true,
            account: { select: { name: true, avatar: true } },
          },
        },
        hiringManager: {
          select: {
            id: true,
            title: true,
            account: { select: { name: true, avatar: true } },
          },
        },
        reviewerAssignments: {
          select: {
            id: true,
            member: {
              select: {
                id: true,
                title: true,
                account: { select: { name: true, avatar: true } },
              },
            },
          },
        },
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
                notes: {
                  select: { id: true, content: true, createdAt: true },
                  orderBy: { createdAt: "desc" as const },
                  take: 1,
                },
              },
            },
            scores: {
              select: {
                id: true,
                overallRating: true,
                recommendation: true,
                scorer: {
                  select: {
                    id: true,
                    account: { select: { name: true, avatar: true } },
                  },
                },
              },
            },
            interviews: {
              select: {
                id: true,
                scheduledAt: true,
                status: true,
              },
              where: { status: "SCHEDULED" },
              orderBy: { scheduledAt: "asc" as const },
              take: 1,
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
      userRole: ctx.role,
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
  descriptionHtml: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  locationType: z.enum(["ONSITE", "REMOTE", "HYBRID"]).optional(),
  employmentType: z
    .enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "VOLUNTEER"])
    .optional(),

  // Compensation
  salaryMin: z.number().int().positive().optional().nullable(),
  salaryMax: z.number().int().positive().optional().nullable(),
  salaryCurrency: z.string().optional(),
  salaryPeriod: z.enum(["ANNUAL", "HOURLY", "WEEKLY", "MONTHLY"]).optional().nullable(),

  // Climate-specific
  climateCategory: z.string().optional().nullable(),
  impactDescription: z.string().optional().nullable(),
  requiredCerts: z.array(z.string()).optional(),
  greenSkills: z.array(z.string()).optional(),

  // Experience
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

  // Dates
  closesAt: z.string().datetime().optional().nullable(),

  // Syndication
  syndicationEnabled: z.boolean().optional(),

  // Department
  departmentId: z.string().optional().nullable(),

  // Team assignment — proper DB columns (not in formConfig)
  recruiterId: z.string().optional().nullable(),
  hiringManagerId: z.string().optional().nullable(),

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
      recruiterId: z.string().optional().nullable(),
      showHiringManager: z.boolean().optional(),
      hiringManagerId: z.string().optional().nullable(),
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

    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Scoped access check
    if (!canAccessJob(ctx, id)) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
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
      // Validate required fields before publishing
      if (data.status === "PUBLISHED") {
        const currentJob = await prisma.job.findUnique({
          where: { id },
          select: {
            title: true,
            description: true,
            locationType: true,
            employmentType: true,
          },
        });

        if (!currentJob) {
          return NextResponse.json({ error: "Role not found" }, { status: 404 });
        }

        // Merge current job data with incoming update data to check final state
        const finalTitle = data.title ?? currentJob.title;
        const finalDescription = data.description ?? currentJob.description;
        const finalEmploymentType = data.employmentType ?? currentJob.employmentType;

        const missingFields: string[] = [];
        if (!finalTitle || finalTitle.trim() === "" || finalTitle === "Untitled Role") {
          missingFields.push("title");
        }
        if (!finalDescription || finalDescription.trim() === "") {
          missingFields.push("description");
        }
        if (!finalEmploymentType) {
          missingFields.push("employment type");
        }

        if (missingFields.length > 0) {
          return NextResponse.json(
            {
              error: `Cannot publish: the following required fields are missing — ${missingFields.join(", ")}. Please fill them in before publishing.`,
            },
            { status: 422 }
          );
        }

        // --- Billing gate: check plan tier and credits ---
        if (ctx.planTier === "PAY_AS_YOU_GO") {
          // Tier 1 requires a listing credit to publish
          const creditAvailable = await hasCredits(ctx.organizationId, "REGULAR");
          const gate = canPublishJob(ctx.planTier, creditAvailable);
          if (!gate.allowed) {
            return NextResponse.json(
              {
                error: gate.reason,
                upgradeRequired: gate.upgradeRequired,
                requiredTier: gate.upgradeRequired,
              },
              { status: 403 }
            );
          }
          // Consume one credit and set 30-day expiry
          await consumeCredit(ctx.organizationId, "REGULAR");
          updateData.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          logger.info("Listing credit consumed for publish", {
            organizationId: ctx.organizationId,
            jobId: id,
          });
        } else {
          // Tier 2/3: unlimited publishing, active while subscribed (no expiry)
          updateData.expiresAt = null;
        }

        updateData.publishedAt = new Date();
      }

      updateData.status = data.status;
    }

    // Core fields
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.descriptionHtml !== undefined) updateData.descriptionHtml = data.descriptionHtml;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.locationType !== undefined) updateData.locationType = data.locationType;
    if (data.employmentType !== undefined) updateData.employmentType = data.employmentType;

    // Compensation
    if (data.salaryMin !== undefined) updateData.salaryMin = data.salaryMin;
    if (data.salaryMax !== undefined) updateData.salaryMax = data.salaryMax;
    if (data.salaryCurrency !== undefined) updateData.salaryCurrency = data.salaryCurrency;
    if (data.salaryPeriod !== undefined) updateData.salaryPeriod = data.salaryPeriod;

    // Climate-specific
    if (data.climateCategory !== undefined) updateData.climateCategory = data.climateCategory;
    if (data.impactDescription !== undefined) updateData.impactDescription = data.impactDescription;
    if (data.requiredCerts !== undefined) updateData.requiredCerts = data.requiredCerts;
    if (data.greenSkills !== undefined) updateData.greenSkills = data.greenSkills;

    // Experience
    if (data.experienceLevel !== undefined) updateData.experienceLevel = data.experienceLevel;
    if (data.educationLevel !== undefined) updateData.educationLevel = data.educationLevel;

    // Dates
    if (data.closesAt !== undefined) {
      updateData.closesAt = data.closesAt ? new Date(data.closesAt) : null;
    }

    // Team assignment — persist as proper FK columns
    if (data.recruiterId !== undefined) {
      if (data.recruiterId) {
        const member = await prisma.organizationMember.findFirst({
          where: { id: data.recruiterId, organizationId: ctx.organizationId },
        });
        if (!member) {
          return NextResponse.json(
            { error: "Recruiter not found in organization" },
            { status: 422 }
          );
        }
      }
      updateData.recruiterId = data.recruiterId;
    }
    if (data.hiringManagerId !== undefined) {
      if (data.hiringManagerId) {
        const member = await prisma.organizationMember.findFirst({
          where: { id: data.hiringManagerId, organizationId: ctx.organizationId },
        });
        if (!member) {
          return NextResponse.json(
            { error: "Hiring manager not found in organization" },
            { status: 422 }
          );
        }
      }
      updateData.hiringManagerId = data.hiringManagerId;
    }

    // Department
    if (data.departmentId !== undefined) {
      if (data.departmentId) {
        const dept = await prisma.department.findFirst({
          where: { id: data.departmentId, organizationId: ctx.organizationId, isActive: true },
          select: { id: true },
        });
        if (!dept) {
          return NextResponse.json(
            { error: "Department not found in organization" },
            { status: 422 }
          );
        }
      }
      updateData.departmentId = data.departmentId;
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
        organizationId: ctx.organizationId,
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
