import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { TrackedJobView } from "./_components/TrackedJobView";
import type { TrackedJobData } from "./_components/types";

/**
 * Tracked Job Detail Page — Server Component
 *
 * Shows detail view for a saved or applied job. Fetches job data,
 * saved notes, and application status server-side via Prisma.
 */

interface TrackedJobPageProps {
  params: Promise<{ jobId: string }>;
}

async function getTrackedJobData(jobId: string): Promise<TrackedJobData | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    // Get the seeker profile
    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      select: {
        seekerProfile: {
          select: { id: true },
        },
      },
    });

    const seekerId = account?.seekerProfile?.id;
    if (!seekerId) return null;

    // Fetch job with org and pathway
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
          },
        },
        pathway: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!job) return null;

    // Parallel: saved job + application
    const [savedJob, application] = await Promise.all([
      prisma.savedJob.findUnique({
        where: { seekerId_jobId: { seekerId, jobId } },
        select: { notes: true },
      }),
      prisma.application.findFirst({
        where: { seekerId, jobId },
        select: {
          id: true,
          stage: true,
          coverLetter: true,
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    // Guard: user must have saved or applied to this job
    if (!savedJob && !application) return null;

    return {
      id: job.id,
      title: job.title,
      company: job.organization.name,
      companyLogo: job.organization.logo,
      companySlug: job.organization.slug,
      pathway: job.pathway,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      salaryCurrency: job.salaryCurrency,
      experienceLevel: job.experienceLevel,
      location: job.location,
      locationType: job.locationType,
      employmentType: job.employmentType,
      notes: savedJob?.notes ?? null,
      isSaved: !!savedJob,
      applicationId: application?.id ?? null,
      applicationStatus: application?.stage ?? null,
      coverLetter: application?.coverLetter ?? null,
    };
  } catch (error) {
    logger.error("Fetch tracked job detail error", {
      error: formatError(error),
      endpoint: "jobs/applications/track/[jobId]/page",
    });
    return null;
  }
}

export default async function TrackedJobPage({ params }: TrackedJobPageProps) {
  const { jobId } = await params;
  const data = await getTrackedJobData(jobId);

  if (!data) {
    notFound();
  }

  return <TrackedJobView data={data} />;
}
