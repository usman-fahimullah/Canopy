import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

interface FormFieldConfig {
  visible: boolean;
  required: boolean;
}

interface DefaultFormConfig {
  personalDetails: {
    name: FormFieldConfig;
    email: FormFieldConfig;
    dateOfBirth: FormFieldConfig;
    pronouns: FormFieldConfig;
    location: FormFieldConfig;
  };
  careerDetails: {
    currentRole: FormFieldConfig;
    currentCompany: FormFieldConfig;
    yearsExperience: FormFieldConfig;
    linkedIn: FormFieldConfig;
    portfolio: FormFieldConfig;
  };
  requiredFiles: {
    resume: boolean;
    coverLetter: boolean;
    portfolio: boolean;
  };
}

const DEFAULT_FORM_CONFIG: DefaultFormConfig = {
  personalDetails: {
    name: { visible: true, required: true },
    email: { visible: true, required: true },
    dateOfBirth: { visible: false, required: false },
    pronouns: { visible: true, required: false },
    location: { visible: true, required: true },
  },
  careerDetails: {
    currentRole: { visible: true, required: false },
    currentCompany: { visible: true, required: false },
    yearsExperience: { visible: true, required: true },
    linkedIn: { visible: true, required: false },
    portfolio: { visible: true, required: false },
  },
  requiredFiles: {
    resume: true,
    coverLetter: false,
    portfolio: false,
  },
};

/**
 * GET /api/jobs/[id]/apply-config
 *
 * Returns the job's application form configuration plus basic job info.
 *
 * - Public for PUBLISHED jobs (anyone can view the apply form).
 * - For DRAFT/PAUSED jobs, requires ?preview=true AND the requester
 *   must be an authenticated org member who owns the job.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: jobId } = await params;
  const isPreview = request.nextUrl.searchParams.get("preview") === "true";

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: {
      id: true,
      title: true,
      status: true,
      location: true,
      locationType: true,
      employmentType: true,
      formConfig: true,
      formQuestions: true,
      organizationId: true,
      organization: {
        select: {
          name: true,
          logo: true,
        },
      },
    },
  });

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  // Published jobs are publicly accessible
  // Non-published jobs require preview mode + org membership
  if (job.status !== "PUBLISHED") {
    if (!isPreview) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Verify the requester is an org member who owns this job
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const membership = await prisma.organizationMember.findFirst({
      where: {
        accountId: account.id,
        organizationId: job.organizationId,
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  // Use stored config or fall back to defaults
  const formConfig = (job.formConfig as DefaultFormConfig | null) ?? DEFAULT_FORM_CONFIG;
  const formQuestions =
    (job.formQuestions as Array<{
      id: string;
      type: string;
      title: string;
      required: boolean;
      description?: string;
      options?: string[];
    }>) ?? [];

  return NextResponse.json({
    data: {
      id: job.id,
      title: job.title,
      company: job.organization.name,
      companyLogo: job.organization.logo,
      location: job.location,
      locationType: job.locationType,
      employmentType: job.employmentType,
      personalDetails: formConfig.personalDetails,
      careerDetails: formConfig.careerDetails,
      requiredFiles: formConfig.requiredFiles,
      questions: formQuestions,
    },
  });
}
