import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import {
  type Shell,
  type EntryIntent,
  type OnboardingProgress,
  createOnboardingProgress,
  createRoleOnboardingState,
  completeRoleOnboarding,
} from "@/lib/onboarding/types";

// Helper function to parse years of experience string into a number
function parseYearsExperience(yearsExp: string): number | null {
  const mapping: Record<string, number> = {
    "less-than-1": 0,
    "1-3": 2,
    "3-7": 5,
    "7-10": 8,
    "10+": 10,
  };
  return mapping[yearsExp] ?? null;
}

// POST — Handle onboarding submission for any shell
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

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
      // Action type
      action, // "set-intent" | "complete-profile" | "complete-role" | "activate-role"

      // Intent selection
      entryIntent, // "talent" | "coach" | "employer"

      // Base profile fields
      firstName,
      lastName,
      linkedinUrl,
      bio,

      // Role being onboarded
      shell, // "talent" | "coach" | "employer"

      // Talent-specific fields
      careerStage,
      skills,
      sectors,
      goals,
      yearsExperience,
      roleTypes,
      transitionTimeline,
      locationPreference,
      salaryRange,
      jobTitle,

      // Coach-specific fields
      headline,
      expertise,
      sessionTypes,
      sessionRate,
      yearsInClimate,
      availability,

      // Employer-specific fields
      companyName,
      companyDescription,
      companyWebsite,
      companyLocation,
      companySize,
      userTitle,

      // Legacy support — old candid onboarding sends "role" instead of "shell"
      role,
      email,
    } = body;

    // Handle legacy candid onboarding format
    const effectiveAction = action || (role ? "complete-role" : undefined);
    const effectiveShell: Shell | undefined =
      shell || (role === "seeker" || role === "mentor" ? "talent" : role === "coach" ? "coach" : undefined);

    // Get or create onboarding progress
    let progress: OnboardingProgress =
      (account.onboardingProgress as OnboardingProgress | null) ||
      createOnboardingProgress();

    const accountUpdate: Record<string, unknown> = {};

    // ── Action: Set entry intent ─────────────────────────────────
    if (effectiveAction === "set-intent" && entryIntent) {
      accountUpdate.entryIntent = entryIntent;

      // Activate the role for onboarding
      progress.roles[entryIntent as Shell] = createRoleOnboardingState(
        entryIntent as Shell,
      );

      // Add to active roles if not already there
      const activeRoles = [...(account.activeRoles || [])];
      if (!activeRoles.includes(entryIntent)) {
        activeRoles.push(entryIntent);
      }
      accountUpdate.activeRoles = activeRoles;

      // Set as primary if no primary yet
      if (!account.primaryRole) {
        accountUpdate.primaryRole = entryIntent;
      }

      accountUpdate.onboardingProgress = progress;

      await prisma.account.update({
        where: { id: account.id },
        data: accountUpdate,
      });

      return NextResponse.json({ success: true, action: "set-intent" });
    }

    // ── Action: Complete base profile ────────────────────────────
    if (effectiveAction === "complete-profile") {
      if (firstName && lastName) {
        accountUpdate.name = `${firstName} ${lastName}`;
      }
      if (linkedinUrl) accountUpdate.linkedinUrl = linkedinUrl;
      if (bio) accountUpdate.bio = bio;

      progress.baseProfileComplete = true;
      accountUpdate.onboardingProgress = progress;

      await prisma.account.update({
        where: { id: account.id },
        data: accountUpdate,
      });

      return NextResponse.json({ success: true, action: "complete-profile" });
    }

    // ── Action: Complete role onboarding ──────────────────────────
    if (
      (effectiveAction === "complete-role" || effectiveAction === "activate-role") &&
      effectiveShell
    ) {
      // Update shared account fields
      if (firstName && lastName) {
        accountUpdate.name = `${firstName} ${lastName}`;
      }
      if (linkedinUrl) accountUpdate.linkedinUrl = linkedinUrl;
      if (bio) accountUpdate.bio = bio;

      // ── Talent / Seeker ────────────────────────────────────────
      if (effectiveShell === "talent") {
        if (!account.seekerProfile) {
          await prisma.seekerProfile.create({
            data: {
              accountId: account.id,
              targetSectors: sectors || [],
              headline: jobTitle || goals?.[0] || null,
              isMentor: role === "mentor",
              mentorTopics: role === "mentor" ? sectors || [] : [],
              skills: skills || [],
              careerStage: careerStage || null,
              yearsExperience: yearsExperience
                ? parseYearsExperience(yearsExperience)
                : null,
            },
          });
        } else {
          await prisma.seekerProfile.update({
            where: { id: account.seekerProfile.id },
            data: {
              targetSectors: sectors || account.seekerProfile.targetSectors,
              headline:
                jobTitle ||
                goals?.[0] ||
                account.seekerProfile.headline,
              isMentor: role === "mentor"
                ? true
                : account.seekerProfile.isMentor,
              mentorTopics: role === "mentor"
                ? sectors || []
                : account.seekerProfile.mentorTopics,
              skills: skills || account.seekerProfile.skills,
              careerStage:
                careerStage || account.seekerProfile.careerStage,
              yearsExperience: yearsExperience
                ? parseYearsExperience(yearsExperience)
                : account.seekerProfile.yearsExperience,
            },
          });
        }
      }

      // ── Coach ──────────────────────────────────────────────────
      if (effectiveShell === "coach") {
        if (!account.coachProfile) {
          await prisma.coachProfile.create({
            data: {
              accountId: account.id,
              firstName: firstName || null,
              lastName: lastName || null,
              bio: bio || null,
              headline: headline || null,
              sectors: sectors || [],
              expertise: expertise || [],
              sessionTypes: sessionTypes || [],
              sessionRate: sessionRate || 15000,
              yearsInClimate: yearsInClimate || null,
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
              headline: headline || account.coachProfile.headline,
              sectors: sectors || account.coachProfile.sectors,
              expertise: expertise || account.coachProfile.expertise,
              sessionTypes: sessionTypes || account.coachProfile.sessionTypes,
              sessionRate: sessionRate || account.coachProfile.sessionRate,
              yearsInClimate:
                yearsInClimate || account.coachProfile.yearsInClimate,
            },
          });
        }
      }

      // ── Employer ───────────────────────────────────────────────
      if (effectiveShell === "employer" && companyName) {
        // Create organization and membership
        const slug = companyName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

        const org = await prisma.organization.upsert({
          where: { slug },
          create: {
            name: companyName,
            slug,
            description: companyDescription || null,
            website: companyWebsite || null,
            location: companyLocation || null,
          },
          update: {
            description: companyDescription || undefined,
            website: companyWebsite || undefined,
            location: companyLocation || undefined,
          },
        });

        // Create org membership if not exists
        const existingMembership = await prisma.organizationMember.findUnique({
          where: {
            accountId_organizationId: {
              accountId: account.id,
              organizationId: org.id,
            },
          },
        });

        if (!existingMembership) {
          await prisma.organizationMember.create({
            data: {
              accountId: account.id,
              organizationId: org.id,
              role: "OWNER",
              title: userTitle || null,
            },
          });
        }
      }

      // ── Update onboarding progress ─────────────────────────────
      // Ensure role state exists
      if (!progress.roles[effectiveShell]) {
        progress.roles[effectiveShell] = createRoleOnboardingState(effectiveShell);
      }

      // Mark role as complete
      progress = completeRoleOnboarding(progress, effectiveShell);

      // Mark base profile as complete if we have name
      if (account.name || (firstName && lastName)) {
        progress.baseProfileComplete = true;
      }

      // Add to active roles
      const activeRoles = [...(account.activeRoles || [])];
      if (!activeRoles.includes(effectiveShell)) {
        activeRoles.push(effectiveShell);
      }
      accountUpdate.activeRoles = activeRoles;

      // Set primary role if not set
      if (!account.primaryRole) {
        accountUpdate.primaryRole = effectiveShell;
      }

      accountUpdate.onboardingProgress = progress;

      await prisma.account.update({
        where: { id: account.id },
        data: accountUpdate,
      });

      return NextResponse.json({
        success: true,
        action: effectiveAction,
        shell: effectiveShell,
      });
    }

    return NextResponse.json(
      { error: "Invalid action or missing required fields" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 },
    );
  }
}
