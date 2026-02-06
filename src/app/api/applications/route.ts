import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { SubmitApplicationSchema } from "@/lib/validators/application";
import { z } from "zod";
import { createNotification } from "@/lib/notifications";

interface PipelineStage {
  id: string;
  name: string;
}

/**
 * POST /api/applications
 *
 * Submit a job application. Requires authentication (Supabase → Account → SeekerProfile).
 * The apply page uploads files separately to Supabase Storage and sends URLs in the body.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Auth check
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Resolve Account → SeekerProfile
    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      select: {
        id: true,
        seekerProfile: { select: { id: true } },
      },
    });

    if (!account?.seekerProfile) {
      return NextResponse.json(
        { error: "Seeker profile not found. Please complete your profile first." },
        { status: 403 }
      );
    }

    const seekerId = account.seekerProfile.id;

    // 3. Parse and validate request body (JSON, not FormData)
    const body = await request.json();
    const result = SubmitApplicationSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }

    const data = result.data;

    // 4. Verify job exists and is PUBLISHED
    const job = await prisma.job.findUnique({
      where: { id: data.jobId },
      select: {
        id: true,
        title: true,
        status: true,
        stages: true,
        organizationId: true,
        organization: {
          select: { name: true },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (job.status !== "PUBLISHED") {
      return NextResponse.json(
        { error: "This job is no longer accepting applications." },
        { status: 400 }
      );
    }

    // 5. Check for duplicate application
    const existing = await prisma.application.findUnique({
      where: { seekerId_jobId: { seekerId, jobId: data.jobId } },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json({ error: "You have already applied to this job." }, { status: 409 });
    }

    // 6. Parse pipeline stages to get initial stage
    let initialStage = "applied";
    try {
      const stages = JSON.parse(job.stages) as PipelineStage[];
      if (stages.length > 0) {
        initialStage = stages[0].id;
      }
    } catch {
      // Use default "applied" if stages JSON is malformed
    }

    // 7. Build formResponses JSON from submitted data
    const formResponses = JSON.stringify({
      personalDetails: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        pronouns: data.pronouns,
        location: data.location,
      },
      careerDetails: {
        currentRole: data.currentRole,
        currentCompany: data.currentCompany,
        yearsExperience: data.yearsExperience,
        linkedIn: data.linkedIn,
        portfolio: data.portfolio,
      },
      files: {
        resumeUrl: data.resumeUrl,
        resumeFileName: data.resumeFileName,
        coverLetterUrl: data.coverLetterUrl,
        coverLetterFileName: data.coverLetterFileName,
        portfolioUrl: data.portfolioUrl,
        portfolioFileName: data.portfolioFileName,
      },
      questionAnswers: data.questionAnswers,
    });

    // 8. Create Application record
    const application = await prisma.application.create({
      data: {
        seekerId,
        jobId: data.jobId,
        stage: initialStage,
        stageOrder: 0,
        formResponses,
        coverLetter: data.coverLetterUrl || null,
        source: "Green Jobs Board",
      },
      select: {
        id: true,
        stage: true,
        createdAt: true,
      },
    });

    // 9. Notify employer (fire-and-forget — don't block the response)
    notifyEmployer({
      jobId: data.jobId,
      jobTitle: job.title,
      organizationId: job.organizationId,
      applicantName: data.name,
      applicationId: application.id,
    }).catch((err) => {
      logger.error("Failed to notify employer of new application", {
        error: formatError(err),
        endpoint: "/api/applications",
      });
    });

    return NextResponse.json(
      {
        success: true,
        applicationId: application.id,
        message: "Application submitted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    // Handle Prisma unique constraint violation (race condition on duplicate)
    if (error instanceof Error && error.message.includes("Unique constraint failed")) {
      return NextResponse.json({ error: "You have already applied to this job." }, { status: 409 });
    }

    logger.error("Error submitting application", {
      error: formatError(error),
      endpoint: "/api/applications",
    });
    return NextResponse.json(
      { error: "Failed to submit application. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * Fire-and-forget: notify org OWNER/ADMIN members about a new application.
 */
async function notifyEmployer(params: {
  jobId: string;
  jobTitle: string;
  organizationId: string;
  applicantName: string;
  applicationId: string;
}) {
  const members = await prisma.organizationMember.findMany({
    where: {
      organizationId: params.organizationId,
      role: { in: ["OWNER", "ADMIN", "RECRUITER"] },
    },
    select: {
      account: { select: { id: true, email: true, name: true } },
    },
  });

  await Promise.allSettled(
    members.map((member) =>
      createNotification({
        accountId: member.account.id,
        type: "NEW_APPLICATION",
        title: "New Application",
        body: `${params.applicantName} applied for ${params.jobTitle}`,
        data: {
          jobId: params.jobId,
          applicationId: params.applicationId,
          url: `/canopy/roles/${params.jobId}`,
        },
        sendEmailNotification: true,
        emailPayload: {
          to: member.account.email,
          subject: `New application for ${params.jobTitle}`,
          html: `<p>Hi ${member.account.name || "there"},</p><p><strong>${params.applicantName}</strong> has applied for <strong>${params.jobTitle}</strong>.</p><p><a href="${process.env.NEXT_PUBLIC_APP_URL}/canopy/roles/${params.jobId}">View application</a></p>`,
          text: `Hi ${member.account.name || "there"}, ${params.applicantName} has applied for ${params.jobTitle}. View at: ${process.env.NEXT_PUBLIC_APP_URL}/canopy/roles/${params.jobId}`,
        },
      })
    )
  );
}

// ======================================================================
// GET /api/applications
//
// Retrieve the authenticated seeker's own applications.
// ======================================================================

const GetApplicationsSchema = z.object({
  stage: z.string().optional(),
  skip: z.coerce.number().int().min(0).default(0),
  take: z.coerce.number().int().min(1).max(50).default(20),
});

export async function GET(request: NextRequest) {
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
      select: {
        seekerProfile: { select: { id: true } },
      },
    });

    if (!account?.seekerProfile) {
      return NextResponse.json({ data: [], meta: { total: 0 } });
    }

    const seekerId = account.seekerProfile.id;

    const params = GetApplicationsSchema.parse(Object.fromEntries(request.nextUrl.searchParams));

    const where = {
      seekerId,
      ...(params.stage ? { stage: params.stage } : {}),
    };

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        select: {
          id: true,
          stage: true,
          source: true,
          matchScore: true,
          formResponses: true,
          createdAt: true,
          job: {
            select: {
              id: true,
              title: true,
              location: true,
              locationType: true,
              employmentType: true,
              organization: {
                select: { name: true, logo: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: params.skip,
        take: params.take,
      }),
      prisma.application.count({ where }),
    ]);

    return NextResponse.json({
      data: applications,
      meta: { total, skip: params.skip, take: params.take },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid parameters", details: error.flatten() },
        { status: 422 }
      );
    }

    logger.error("Error fetching applications", {
      error: formatError(error),
      endpoint: "/api/applications",
    });
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}
