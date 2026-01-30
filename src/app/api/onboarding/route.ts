import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

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
