import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getServerUser } from "@/lib/supabase/get-server-user";
import { CandidateDetailView } from "./CandidateDetailView";

export default async function CandidateDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    jobId?: string;
    index?: string;
    total?: string;
    prevId?: string;
    nextId?: string;
  }>;
}) {
  const { id } = await params;
  const search = await searchParams;

  // --- Auth ---
  const user = await getServerUser();
  if (!user) redirect("/login");

  const account = await prisma.account.findUnique({
    where: { supabaseId: user.id },
    select: {
      id: true,
      orgMemberships: {
        select: { id: true, organizationId: true },
        take: 1,
      },
    },
  });

  if (!account || account.orgMemberships.length === 0) {
    redirect("/onboarding");
  }

  const orgMember = account.orgMemberships[0];
  const orgId = orgMember.organizationId;

  // --- Fetch candidate (seeker) with applications scoped to this org ---
  const seeker = await prisma.seekerProfile.findUnique({
    where: { id },
    select: {
      id: true,
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
          phone: true,
          location: true,
          pronouns: true,
          linkedinUrl: true,
        },
      },
      applications: {
        where: {
          job: { organizationId: orgId },
        },
        select: {
          id: true,
          stage: true,
          stageOrder: true,
          matchScore: true,
          source: true,
          createdAt: true,
          rejectedAt: true,
          hiredAt: true,
          job: {
            select: {
              id: true,
              title: true,
              stages: true,
            },
          },
          scores: {
            select: {
              id: true,
              overallRating: true,
              recommendation: true,
              comments: true,
              createdAt: true,
              scorer: {
                select: {
                  id: true,
                  account: {
                    select: {
                      name: true,
                      avatar: true,
                    },
                  },
                },
              },
            },
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      notes: {
        where: {
          orgMemberAuthor: { organizationId: orgId },
        },
        select: {
          id: true,
          content: true,
          mentions: true,
          createdAt: true,
          orgMemberAuthor: {
            select: {
              account: {
                select: {
                  name: true,
                  avatar: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!seeker || seeker.applications.length === 0) {
    notFound();
  }

  // Determine which application to focus on
  const activeApplication = search.jobId
    ? (seeker.applications.find((a) => a.job.id === search.jobId) ?? seeker.applications[0])
    : seeker.applications[0];

  // Navigation context
  const navContext = {
    currentIndex: search.index ? parseInt(search.index, 10) : undefined,
    totalCount: search.total ? parseInt(search.total, 10) : undefined,
    prevId: search.prevId,
    nextId: search.nextId,
  };

  return (
    <CandidateDetailView
      seeker={seeker}
      activeApplicationId={activeApplication.id}
      orgMemberId={orgMember.id}
      navContext={navContext}
    />
  );
}
