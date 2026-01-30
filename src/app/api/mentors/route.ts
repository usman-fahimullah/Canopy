import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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

    // Search across name, bio, headline
    if (search) {
      where.OR = [
        { mentorBio: { contains: search, mode: "insensitive" } },
        { headline: { contains: search, mode: "insensitive" } },
        { account: { name: { contains: search, mode: "insensitive" } } },
      ];
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
    });

    const result = mentors.map((m) => ({
      id: m.id,
      accountId: m.account.id,
      name: m.account.name || "Anonymous",
      avatar: m.account.avatar,
      location: m.account.location,
      headline: m.headline,
      bio: m.account.bio,
      mentorBio: m.mentorBio,
      mentorTopics: m.mentorTopics,
      skills: m.skills,
      greenSkills: m.greenSkills,
      yearsExperience: m.yearsExperience,
      menteeCount: m._count.mentorAssignmentsAsMentor,
    }));

    return NextResponse.json({ mentors: result });
  } catch (error) {
    console.error("Error fetching mentors:", error);
    return NextResponse.json(
      { error: "Failed to fetch mentors" },
      { status: 500 }
    );
  }
}
