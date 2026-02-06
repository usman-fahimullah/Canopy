import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { RolePreviewView } from "./_components/RolePreviewView";
import type { JobDetail, Recruiter } from "@/app/jobs/search/[id]/_components/types";

/**
 * Role Review / Preview Page — Server Component
 *
 * Shows the employer a preview of how their role will look to job seekers.
 * Fetches role data (any status — including DRAFT) and transforms it to
 * the same JobDetail shape used by the seeker-facing job detail page.
 */

interface ReviewPageProps {
  params: Promise<{ id: string }>;
}

async function getRolePreview(
  roleId: string
): Promise<{ job: JobDetail; isPublished: boolean } | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
    });

    if (!account) return null;

    const membership = await prisma.organizationMember.findFirst({
      where: { accountId: account.id },
    });

    if (!membership) return null;

    // Fetch role scoped to org (any status — not just PUBLISHED)
    const job = await prisma.job.findFirst({
      where: {
        id: roleId,
        organizationId: membership.organizationId,
      },
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

    if (!job) return null;

    // Fetch recruiter (first RECRUITER/OWNER/ADMIN member)
    const recruiterMember = await prisma.organizationMember.findFirst({
      where: {
        organizationId: membership.organizationId,
        role: { in: ["RECRUITER", "OWNER", "ADMIN"] },
      },
      orderBy: [{ role: "asc" }],
      include: {
        account: {
          select: { name: true, email: true, avatar: true },
        },
      },
    });

    const recruiter: Recruiter | null = recruiterMember
      ? {
          name: recruiterMember.account.name ?? recruiterMember.account.email,
          title: recruiterMember.title,
          avatar: recruiterMember.account.avatar,
        }
      : null;

    const jobDetail: JobDetail = {
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
      isSaved: false,
      savedNotes: null,
    };

    return {
      job: jobDetail,
      isPublished: job.status === "PUBLISHED",
    };
  } catch (error) {
    logger.error("Error fetching role preview", {
      error: formatError(error),
      endpoint: "canopy/roles/[id]/review",
    });
    return null;
  }
}

export default async function RoleReviewPage({ params }: ReviewPageProps) {
  const { id: roleId } = await params;
  const result = await getRolePreview(roleId);

  if (!result) {
    notFound();
  }

  return <RolePreviewView job={result.job} roleId={roleId} isPublished={result.isPublished} />;
}
