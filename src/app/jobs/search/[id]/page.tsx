import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { JobDetailView } from "./_components/JobDetailView";
import type { JobDetail, SimilarJob, Recruiter } from "./_components/types";

/**
 * Job Detail Page — Server Component
 * Fetches job data server-side via Prisma and renders the detail layout.
 *
 * @figma https://www.figma.com/design/uyjitGccNs5zxBfJsfrgg8/Pathways-MVP?node-id=1425-24686
 */

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getJobDetail(jobId: string): Promise<{
  job: JobDetail;
  similarJobs: SimilarJob[];
} | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    // Fetch job with related data
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            isBipocOwned: true,
            isWomenOwned: true,
            isVeteranOwned: true,
            description: true,
          },
        },
        pathway: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
            color: true,
          },
        },
      },
    });

    if (!job || job.status !== "PUBLISHED") return null;

    // Parallel fetches: recruiter, saved status, similar jobs
    const [recruiterMember, account, candidateSimilarJobs] = await Promise.all([
      // Recruiter
      prisma.organizationMember.findFirst({
        where: {
          organizationId: job.organizationId,
          role: { in: ["RECRUITER", "OWNER", "ADMIN"] },
        },
        orderBy: [{ role: "asc" }],
        include: {
          account: {
            select: { name: true, email: true, avatar: true },
          },
        },
      }),
      // Saved status
      prisma.account.findUnique({
        where: { supabaseId: user.id },
        include: {
          seekerProfile: {
            include: {
              savedJobs: {
                where: { jobId },
                select: { seekerId: true, jobId: true, notes: true },
              },
            },
          },
        },
      }),
      // Similar jobs candidates
      (async () => {
        const orConditions: Array<Record<string, unknown>> = [];
        if (job.pathwayId) orConditions.push({ pathwayId: job.pathwayId });
        if (job.climateCategory) orConditions.push({ climateCategory: job.climateCategory });
        if (job.locationType) orConditions.push({ locationType: job.locationType });
        if (job.experienceLevel) orConditions.push({ experienceLevel: job.experienceLevel });

        if (orConditions.length === 0) return [];

        return prisma.job.findMany({
          where: {
            id: { not: jobId },
            status: "PUBLISHED",
            OR: orConditions,
          },
          include: {
            organization: {
              select: {
                id: true,
                name: true,
                slug: true,
                logo: true,
                isBipocOwned: true,
              },
            },
            pathway: {
              select: {
                id: true,
                name: true,
                slug: true,
                icon: true,
                color: true,
              },
            },
          },
          take: 20,
          orderBy: { publishedAt: "desc" },
        });
      })(),
    ]);

    const recruiter: Recruiter | null = recruiterMember
      ? {
          name: recruiterMember.account.name ?? recruiterMember.account.email,
          title: recruiterMember.title,
          avatar: recruiterMember.account.avatar,
        }
      : null;

    const isSaved = (account?.seekerProfile?.savedJobs?.length ?? 0) > 0;
    const savedNotes = account?.seekerProfile?.savedJobs?.[0]?.notes ?? null;

    // Score and rank similar jobs
    const scoredJobs: SimilarJob[] = candidateSimilarJobs
      .map((sj) => {
        let score = 0;
        if (job.pathwayId && sj.pathwayId === job.pathwayId) score += 3;
        if (sj.locationType === job.locationType) score += 2;
        if (job.experienceLevel && sj.experienceLevel === job.experienceLevel) score += 1;
        if (sj.organizationId === job.organizationId) score += 1;
        return {
          id: sj.id,
          title: sj.title,
          slug: sj.slug,
          location: sj.location,
          locationType: sj.locationType,
          employmentType: sj.employmentType,
          climateCategory: sj.climateCategory,
          experienceLevel: sj.experienceLevel,
          pathwayId: sj.pathwayId,
          organizationId: sj.organizationId,
          organization: sj.organization,
          pathway: sj.pathway,
          score,
        };
      })
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
      .slice(0, 3);

    return {
      job: {
        id: job.id,
        title: job.title,
        slug: job.slug,
        description: job.description,
        location: job.location,
        locationType: job.locationType,
        employmentType: job.employmentType,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        salaryCurrency: job.salaryCurrency,
        climateCategory: job.climateCategory,
        impactDescription: job.impactDescription,
        greenSkills: job.greenSkills,
        requiredCerts: job.requiredCerts,
        experienceLevel: job.experienceLevel,
        isFeatured: job.isFeatured,
        publishedAt: job.publishedAt?.toISOString() ?? null,
        closesAt: job.closesAt?.toISOString() ?? null,
        organization: job.organization,
        pathway: job.pathway,
        recruiter,
        isSaved,
        savedNotes,
      },
      similarJobs: scoredJobs,
    };
  } catch (error) {
    logger.error("Fetch job detail error", {
      error: formatError(error),
      endpoint: "jobs/search/[id]/page",
    });
    return null;
  }
}

/**
 * generateMetadata — Open Graph + Twitter Cards for job detail pages.
 */
export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const { id: jobId } = await params;
  const job = await prisma.job.findUnique({
    where: { id: jobId, status: "PUBLISHED" },
    select: {
      title: true,
      description: true,
      location: true,
      organization: { select: { name: true, logo: true } },
    },
  });

  if (!job) return { title: "Job Not Found" };

  const plainDescription = job.description
    .replace(/<[^>]*>/g, "")
    .slice(0, 160)
    .trim();

  const title = `${job.title} at ${job.organization.name}`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://greenjobsboard.us";

  return {
    title,
    description: plainDescription,
    openGraph: {
      title,
      description: plainDescription,
      type: "website",
      url: `${appUrl}/jobs/search/${jobId}`,
      ...(job.organization.logo
        ? { images: [{ url: job.organization.logo, alt: job.organization.name }] }
        : {}),
    },
    twitter: {
      card: "summary",
      title,
      description: plainDescription,
    },
  };
}

/**
 * Build Google Jobs JSON-LD structured data (JobPosting schema).
 */
function buildJobPostingJsonLd(job: JobDetail) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://greenjobsboard.us";

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.publishedAt,
    ...(job.closesAt ? { validThrough: job.closesAt } : {}),
    employmentType: mapEmploymentType(job.employmentType),
    hiringOrganization: {
      "@type": "Organization",
      name: job.organization.name,
      ...(job.organization.logo ? { logo: job.organization.logo } : {}),
    },
    url: `${appUrl}/jobs/search/${job.id}`,
  };

  // Job location or TELECOMMUTE
  if (job.locationType === "REMOTE") {
    jsonLd.jobLocationType = "TELECOMMUTE";
  }
  if (job.location) {
    jsonLd.jobLocation = {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
      },
    };
  }

  // Salary info
  if (job.salaryMin || job.salaryMax) {
    jsonLd.baseSalary = {
      "@type": "MonetaryAmount",
      currency: job.salaryCurrency || "USD",
      value: {
        "@type": "QuantitativeValue",
        ...(job.salaryMin && job.salaryMax
          ? { minValue: job.salaryMin, maxValue: job.salaryMax }
          : job.salaryMin
            ? { value: job.salaryMin }
            : { value: job.salaryMax }),
        unitText: "YEAR",
      },
    };
  }

  return jsonLd;
}

function mapEmploymentType(type: string): string {
  const map: Record<string, string> = {
    FULL_TIME: "FULL_TIME",
    PART_TIME: "PART_TIME",
    CONTRACT: "CONTRACTOR",
    INTERNSHIP: "INTERN",
  };
  return map[type] || "OTHER";
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id: jobId } = await params;
  const result = await getJobDetail(jobId);

  if (!result) {
    notFound();
  }

  const { job, similarJobs } = result;
  const jsonLd = buildJobPostingJsonLd(job);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JobDetailView job={job} similarJobs={similarJobs} />
    </>
  );
}
