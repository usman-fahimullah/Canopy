import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";

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
        status: true,
        publishedAt: true,
        closesAt: true,
        stages: true,
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
 * Update job status (publish, pause, close).
 */
const UpdateJobSchema = z.object({
  status: z.enum(["DRAFT", "PUBLISHED", "PAUSED", "CLOSED"]).optional(),
  title: z.string().min(1).max(200).optional(),
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

    const updateData: Record<string, unknown> = {};
    if (result.data.status) {
      updateData.status = result.data.status;
      if (result.data.status === "PUBLISHED" && !updateData.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }
    if (result.data.title) {
      updateData.title = result.data.title;
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

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error updating role", {
      error: formatError(error),
      endpoint: "/api/canopy/roles/[id]",
    });
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
}
