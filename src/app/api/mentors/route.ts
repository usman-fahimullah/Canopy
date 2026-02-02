import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";

interface MatchReason {
  type: "shared_interest" | "common_skill" | "ask_about";
  description: string;
  highlight: string;
}

function computeMatchReasons(
  mentorTopics: string[],
  mentorSkills: string[],
  mentorGreenSkills: string[],
  seekerTopics: string[],
  seekerSkills: string[],
  seekerGreenSkills: string[],
  mentorName: string
): MatchReason[] {
  const reasons: MatchReason[] = [];

  // Shared interest: overlapping mentorTopics with seeker's targetSectors/interestedPathways
  const sharedTopics = mentorTopics.filter((t) => seekerTopics.includes(t));
  if (sharedTopics.length > 0) {
    reasons.push({
      type: "shared_interest",
      description: `${mentorName.split(" ")[0]}'s expertise in ${sharedTopics[0]} aligns with your goal`,
      highlight: sharedTopics[0],
    });
  }

  // Common skill: overlapping skills or greenSkills
  const allMentorSkills = [...mentorSkills, ...mentorGreenSkills];
  const allSeekerSkills = [...seekerSkills, ...seekerGreenSkills];
  const commonSkills = allMentorSkills.filter((s) =>
    allSeekerSkills.some((ss) => ss.toLowerCase() === s.toLowerCase())
  );
  if (commonSkills.length > 0) {
    reasons.push({
      type: "common_skill",
      description: `You both know ${commonSkills[0]}`,
      highlight: commonSkills[0],
    });
  }

  // Ask about: mentor topics the seeker doesn't have yet
  const uniqueMentorTopics = mentorTopics.filter(
    (t) => !seekerTopics.includes(t)
  );
  if (uniqueMentorTopics.length > 0) {
    reasons.push({
      type: "ask_about",
      description: `Making the transition into ${uniqueMentorTopics[0]}`,
      highlight: uniqueMentorTopics[0],
    });
  }

  return reasons.slice(0, 3);
}

function computeMatchQuality(
  reasonCount: number
): "good_match" | "great_match" | null {
  if (reasonCount >= 3) return "great_match";
  if (reasonCount >= 2) return "good_match";
  return null;
}

// GET — list mentors (SeekerProfiles where isMentor=true)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const sector = searchParams.get("sector") || "";
    const topic = searchParams.get("topic") || "";

    const where: Record<string, unknown> = {
      isMentor: true,
    };

    // Filter by sector (mentorTopics contains sector)
    if (sector) {
      where.mentorTopics = { has: sector };
    }

    if (topic) {
      where.mentorTopics = { has: topic };
    }

    // Search across name, bio, headline, specialty
    if (search) {
      where.OR = [
        { mentorBio: { contains: search, mode: "insensitive" } },
        { headline: { contains: search, mode: "insensitive" } },
        { mentorSpecialty: { contains: search, mode: "insensitive" } },
        { account: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    // Fetch current user's profile for match computation
    let seekerProfile: {
      targetSectors: string[];
      skills: string[];
      greenSkills: string[];
      mentorTopics: string[];
    } | null = null;

    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const account = await prisma.account.findUnique({
          where: { supabaseId: user.id },
          include: {
            seekerProfile: {
              select: {
                targetSectors: true,
                skills: true,
                greenSkills: true,
                mentorTopics: true,
              },
            },
          },
        });
        seekerProfile = account?.seekerProfile || null;
      }
    } catch {
      // Auth is optional for mentor match scoring — unauthenticated users see unranked results
    }

    const mentors = await prisma.seekerProfile.findMany({
      where,
      include: {
        account: {
          select: {
            id: true,
            name: true,
            avatar: true,
            location: true,
            bio: true,
          },
        },
        _count: {
          select: {
            mentorAssignmentsAsMentor: true,
          },
        },
      },
      orderBy: [
        { mentorAssignmentsAsMentor: { _count: "desc" } },
        { createdAt: "desc" },
      ],
      take: 100,
    });

    const result = mentors.map((m) => {
      const mentorName = m.account.name || "Anonymous";

      // Compute match reasons if we have a seeker profile
      const matchReasons = seekerProfile
        ? computeMatchReasons(
            m.mentorTopics,
            m.skills,
            m.greenSkills,
            [...(seekerProfile.targetSectors || []), ...(seekerProfile.mentorTopics || [])],
            seekerProfile.skills || [],
            seekerProfile.greenSkills || [],
            mentorName
          )
        : [];

      const matchQuality = computeMatchQuality(matchReasons.length);

      return {
        id: m.id,
        accountId: m.account.id,
        name: mentorName,
        avatar: m.account.avatar,
        location: m.account.location,
        role: m.headline || "Climate Professional",
        specialty: m.mentorSpecialty || (m.mentorTopics.length > 0 ? m.mentorTopics[0] : null),
        bio: m.mentorBio || m.account.bio,
        mentorTopics: m.mentorTopics,
        skills: m.skills,
        greenSkills: m.greenSkills,
        experienceYears: m.yearsExperience,
        menteeCount: m._count.mentorAssignmentsAsMentor,
        rating: m.mentorRating || 0,
        badge: m.mentorBadge || null,
        matchQuality,
        matchReasons,
      };
    });

    return NextResponse.json({ mentors: result });
  } catch (error) {
    logger.error("Error fetching mentors", { error: formatError(error), endpoint: "/api/mentors" });
    return NextResponse.json(
      { error: "Failed to fetch mentors" },
      { status: 500 }
    );
  }
}
