import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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
 * Public endpoint — no auth required (anyone can view a published job's apply form).
 */
export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const { id: jobId } = params;

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
      organization: {
        select: {
          name: true,
          logo: true,
        },
      },
    },
  });

  if (!job || job.status !== "PUBLISHED") {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
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
