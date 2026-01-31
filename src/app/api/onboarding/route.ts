import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

// Helper function to parse years of experience string into a number
function parseYearsExperience(yearsExp: string): number | null {
  const mapping: Record<string, number> = {
    "less-than-1": 0,
    "1-3": 2,
    "3-7": 5,
    "7-10": 8,
    "10+": 10,
  };
  return mapping[yearsExp] || null;
}

// POST — create SeekerProfile or CoachProfile based on role, update onboarding status
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      include: { seekerProfile: true, coachProfile: true },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const body = await request.json();
    const {
      role,           // "seeker" | "mentor" | "coach"
      firstName,
      lastName,
      email,
      linkedinUrl,
      bio,
      sectors,        // string[]
      goals,          // string[] (seekers)
      availability,   // string (mentors/coaches)
      jobTitle,       // string (optional, seekers)
      yearsExperience, // string (optional, seekers)
      skills,         // string[] (seekers)
      careerStage,    // string (seekers)
      roleTypes,      // string[] (seekers)
      transitionTimeline, // string (seekers)
      locationPreference, // string (seekers)
      salaryRange,    // { min?: number, max?: number } (optional, seekers)
    } = body;

    if (!role) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 });
    }

    // Update account fields
    const accountUpdate: Record<string, unknown> = {
      onboardingCompleted: true,
    };
    if (firstName && lastName) {
      accountUpdate.name = `${firstName} ${lastName}`;
    }
    if (linkedinUrl) accountUpdate.linkedinUrl = linkedinUrl;
    if (bio) accountUpdate.bio = bio;

    await prisma.account.update({
      where: { id: account.id },
      data: accountUpdate,
    });

    if (role === "seeker" || role === "mentor") {
      // Create seeker profile if not existing
      if (!account.seekerProfile) {
        await prisma.seekerProfile.create({
          data: {
            accountId: account.id,
            targetSectors: sectors || [],
            headline: goals?.[0] || null,
            isMentor: role === "mentor",
            mentorTopics: role === "mentor" ? sectors || [] : [],
            skills: skills || [],
            careerStage: careerStage || null,
            yearsExperience: yearsExperience ? parseYearsExperience(yearsExperience) : null,
          },
        });
      } else {
        // Update existing
        await prisma.seekerProfile.update({
          where: { id: account.seekerProfile.id },
          data: {
            targetSectors: sectors || [],
            headline: goals?.[0] || account.seekerProfile.headline,
            isMentor: role === "mentor" ? true : account.seekerProfile.isMentor,
            mentorTopics: role === "mentor" ? sectors || [] : account.seekerProfile.mentorTopics,
            skills: skills || account.seekerProfile.skills,
            careerStage: careerStage || account.seekerProfile.careerStage,
            yearsExperience: yearsExperience ? parseYearsExperience(yearsExperience) : account.seekerProfile.yearsExperience,
          },
        });
      }
    }

    if (role === "coach") {
      // Create coach profile if not existing
      if (!account.coachProfile) {
        await prisma.coachProfile.create({
          data: {
            accountId: account.id,
            firstName: firstName || null,
            lastName: lastName || null,
            bio: bio || null,
            sectors: sectors || [],
            status: "PENDING",
            applicationDate: new Date(),
          },
        });
      } else {
        await prisma.coachProfile.update({
          where: { id: account.coachProfile.id },
          data: {
            firstName: firstName || account.coachProfile.firstName,
            lastName: lastName || account.coachProfile.lastName,
            bio: bio || account.coachProfile.bio,
            sectors: sectors || account.coachProfile.sectors,
          },
        });
      }
    }

    return NextResponse.json({ success: true, role });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}
