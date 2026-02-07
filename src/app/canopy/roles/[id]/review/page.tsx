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

    // Read formConfig for recruiter/hiring manager selection
    const formConfig = job.formConfig as Record<string, unknown> | null;
    const showRecruiter = formConfig?.showRecruiter !== false;
    const selectedRecruiterId =
      typeof formConfig?.recruiterId === "string" ? formConfig.recruiterId : null;
    const showHiringManager = formConfig?.showHiringManager === true;
    const selectedHiringManagerId =
      typeof formConfig?.hiringManagerId === "string" ? formConfig.hiringManagerId : null;

    // Fetch recruiter: specific member if set, otherwise fallback to first RECRUITER/OWNER/ADMIN
    const recruiterMember = showRecruiter
      ? await prisma.organizationMember.findFirst({
          where: selectedRecruiterId
            ? { id: selectedRecruiterId, organizationId: membership.organizationId }
            : {
                organizationId: membership.organizationId,
                role: { in: ["RECRUITER", "OWNER", "ADMIN"] },
              },
          orderBy: selectedRecruiterId ? undefined : [{ role: "asc" }],
          include: {
            account: { select: { name: true, email: true, avatar: true } },
          },
        })
      : null;

    // Fetch hiring manager if enabled and selected
    const hiringManagerMember =
      showHiringManager && selectedHiringManagerId
        ? await prisma.organizationMember.findFirst({
            where: {
              id: selectedHiringManagerId,
              organizationId: membership.organizationId,
            },
            include: {
              account: { select: { name: true, email: true, avatar: true } },
            },
          })
        : null;

    const recruiter: Recruiter | null = recruiterMember
      ? {
          name: recruiterMember.account.name ?? recruiterMember.account.email,
          title: recruiterMember.title,
          avatar: recruiterMember.account.avatar,
        }
      : null;

    const hiringManager: Recruiter | null = hiringManagerMember
      ? {
          name: hiringManagerMember.account.name ?? hiringManagerMember.account.email,
          title: hiringManagerMember.title,
          avatar: hiringManagerMember.account.avatar,
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
      hiringManager,
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
