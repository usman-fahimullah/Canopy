import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";

/**
 * GET /api/canopy/candidates/[id]
 *
 * Fetch a candidate (seeker profile) with all applications, scores,
 * and notes scoped to the current user's organization.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // --- Auth ---
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      select: { id: true },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const membership = await prisma.organizationMember.findFirst({
      where: { accountId: account.id },
      select: { id: true, organizationId: true },
    });

    if (!membership) {
      return NextResponse.json({ error: "Organization membership required" }, { status: 403 });
    }

    const orgId = membership.organizationId;

    // --- Fetch candidate ---
    const seeker = await prisma.seekerProfile.findUnique({
      where: { id },
      select: {
        id: true,
        resumeUrl: true,
        skills: true,
        greenSkills: true,
        certifications: true,
        yearsExperience: true,
        aiSummary: true,
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
          where: { job: { organizationId: orgId } },
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
              select: { id: true, title: true, stages: true, climateCategory: true },
            },
            scores: {
              select: {
                id: true,
                overallRating: true,
                recommendation: true,
                comments: true,
                responses: true,
                createdAt: true,
                scorer: {
                  select: {
                    id: true,
                    account: {
                      select: { name: true, avatar: true },
                    },
                  },
                },
              },
              orderBy: { createdAt: "desc" },
            },
            offer: {
              select: {
                id: true,
                status: true,
                salary: true,
                salaryCurrency: true,
                startDate: true,
                department: true,
                signingMethod: true,
                sentAt: true,
                viewedAt: true,
                signedAt: true,
                withdrawnAt: true,
                createdAt: true,
              },
            },
            interviews: {
              select: {
                id: true,
                scheduledAt: true,
                duration: true,
                type: true,
                location: true,
                meetingLink: true,
                status: true,
                notes: true,
                completedAt: true,
                cancelledAt: true,
                createdAt: true,
                interviewer: {
                  select: {
                    account: { select: { name: true, avatar: true } },
                  },
                },
              },
              orderBy: { scheduledAt: "desc" },
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
                  select: { name: true, avatar: true },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 50,
        },
      },
    });

    if (!seeker) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    }

    if (seeker.applications.length === 0) {
      return NextResponse.json(
        { error: "No applications found for this candidate in your organization" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: seeker, orgMemberId: membership.id });
  } catch (error) {
    logger.error("Failed to fetch candidate", {
      error: formatError(error),
    });
    return NextResponse.json({ error: "Failed to fetch candidate" }, { status: 500 });
  }
}
