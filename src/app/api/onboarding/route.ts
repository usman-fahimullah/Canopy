import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import {
  type Shell,
  type OnboardingProgress,
  createOnboardingProgress,
  createRoleOnboardingState,
  completeRoleOnboarding,
} from "@/lib/onboarding/types";

/** Typed shape for Account update — mirrors the Prisma schema fields we touch */
interface AccountUpdateData {
  name?: string;
  linkedinUrl?: string;
  bio?: string;
  entryIntent?: string;
  activeRoles?: string[];
  primaryRole?: string;
  onboardingProgress?: OnboardingProgress;
}

// ─── Zod Schemas ───────────────────────────────────────────────────

const shellEnum = z.enum(["talent", "coach", "employer"]);

const setIntentSchema = z.object({
  action: z.literal("set-intent"),
  entryIntent: shellEnum,
});

const completeProfileSchema = z.object({
  action: z.literal("complete-profile"),
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  linkedinUrl: z.string().url().max(500).optional().or(z.literal("")),
  bio: z.string().max(2000).optional(),
});

const completeRoleBaseSchema = z.object({
  action: z.enum(["complete-role", "activate-role"]),
  shell: shellEnum.optional(),

  // Shared profile fields
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  linkedinUrl: z.string().url().max(500).optional().or(z.literal("")),
  bio: z.string().max(2000).optional(),

  // Talent-specific
  careerStage: z.string().max(100).optional().nullable(),
  skills: z.array(z.string().max(200)).max(50).optional(),
  sectors: z.array(z.string().max(200)).max(50).optional(),
  goals: z.array(z.string().max(500)).max(20).optional(),
  yearsExperience: z.enum(["less-than-1", "1-3", "3-7", "7-10", "10+"]).optional().nullable(),
  roleTypes: z.array(z.string().max(100)).max(20).optional(),
  transitionTimeline: z.string().max(100).optional().nullable(),
  locationPreference: z.string().max(200).optional().nullable(),
  salaryRange: z.string().max(100).optional(),
  jobTitle: z.string().max(200).optional(),

  // Coach-specific
  headline: z.string().max(500).optional(),
  expertise: z.array(z.string().max(200)).max(50).optional(),
  sessionTypes: z.array(z.string().max(200)).max(20).optional(),
  sessionRate: z.number().int().min(0).max(100000).optional(),
  yearsInClimate: z.string().max(50).optional().nullable(),
  availability: z.string().max(200).optional().nullable(),

  // Employer-specific
  companyName: z.string().min(1).max(300).optional(),
  companyDescription: z.string().max(5000).optional(),
  companyWebsite: z.string().url().max(500).optional().or(z.literal("")),
  companyLocation: z.string().max(300).optional(),
  companySize: z.string().max(100).optional().nullable(),
  userTitle: z.string().max(200).optional(),

  // Legacy support
  role: z.enum(["seeker", "mentor", "coach"]).optional(),
  email: z.string().email().optional(),
});

const onboardingBodySchema = z.discriminatedUnion("action", [
  setIntentSchema,
  completeProfileSchema,
  completeRoleBaseSchema,
]);

/** Legacy body: old Candid onboarding sends "role" without "action" */
const legacyBodySchema = completeRoleBaseSchema.extend({
  action: z.enum(["complete-role", "activate-role"]).default("complete-role"),
  role: z.enum(["seeker", "mentor", "coach"]),
});

// ─── Helpers ───────────────────────────────────────────────────────

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

/** Generate a unique slug, appending a random suffix on collision */
async function generateUniqueOrgSlug(companyName: string): Promise<string> {
  const baseSlug = companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  // Check if base slug is available
  const existing = await prisma.organization.findUnique({
    where: { slug: baseSlug },
    select: { id: true },
  });

  if (!existing) return baseSlug;

  // Append a random 6-char suffix to avoid collision
  const suffix = Math.random().toString(36).substring(2, 8);
  return `${baseSlug}-${suffix}`;
}

// ─── Route Handler ─────────────────────────────────────────────────

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

    // Parse and validate request body
    const rawBody = await request.json();

    // Try primary schema first (has "action" field); fall back to legacy format
    // Use a flat validated type for downstream field access
    type ValidatedBody = Omit<z.infer<typeof completeRoleBaseSchema>, "action"> & {
      action: "set-intent" | "complete-profile" | "complete-role" | "activate-role";
      entryIntent?: "talent" | "coach" | "employer";
    };

    let body: ValidatedBody;
    const primaryResult = onboardingBodySchema.safeParse(rawBody);
    if (primaryResult.success) {
      body = primaryResult.data as ValidatedBody;
    } else {
      // Legacy Candid onboarding sends "role" without "action"
      const legacyResult = legacyBodySchema.safeParse(rawBody);
      if (legacyResult.success) {
        body = legacyResult.data as ValidatedBody;
      } else {
        return NextResponse.json(
          { error: "Invalid request body", details: primaryResult.error.flatten() },
          { status: 400 },
        );
      }
    }

    // Resolve effective action and shell
    const effectiveAction = body.action;

    let effectiveShell: Shell | undefined;
    if (body.shell) {
      effectiveShell = body.shell;
    } else if (body.role) {
      effectiveShell =
        body.role === "seeker" || body.role === "mentor" ? "talent" : body.role === "coach" ? "coach" : undefined;
    }

    // Get or create onboarding progress
    let progress: OnboardingProgress =
      (account.onboardingProgress as OnboardingProgress | null) ||
      createOnboardingProgress();

    const accountUpdate: AccountUpdateData = {};

    // ── Action: Set entry intent ─────────────────────────────────
    if (effectiveAction === "set-intent" && body.entryIntent) {
      const intent = body.entryIntent as Shell;

      accountUpdate.entryIntent = intent;

      // Activate the role for onboarding
      progress.roles[intent] = createRoleOnboardingState(intent);

      // Add to active roles if not already there
      const activeRoles = [...(account.activeRoles || [])];
      if (!activeRoles.includes(intent)) {
        activeRoles.push(intent);
      }
      accountUpdate.activeRoles = activeRoles;

      // Set as primary if no primary yet
      if (!account.primaryRole) {
        accountUpdate.primaryRole = intent;
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
      const { firstName, lastName, linkedinUrl, bio } = body;

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
      const { firstName, lastName, linkedinUrl, bio, role } = body;

      // Update shared account fields
      if (firstName && lastName) {
        accountUpdate.name = `${firstName} ${lastName}`;
      }
      if (linkedinUrl) accountUpdate.linkedinUrl = linkedinUrl;
      if (bio) accountUpdate.bio = bio;

      // ── Talent / Seeker ────────────────────────────────────────
      if (effectiveShell === "talent") {
        const { sectors, jobTitle, goals, skills, careerStage, yearsExperience } = body;

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
        const { headline, sectors, expertise, sessionTypes, sessionRate, yearsInClimate } = body;

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
      if (effectiveShell === "employer") {
        const { companyName, companyDescription, companyWebsite, companyLocation, userTitle } = body;

        if (companyName) {
          // Generate a unique slug to prevent collision / org takeover
          const slug = await generateUniqueOrgSlug(companyName);

          // Check if user already owns an org (avoid creating duplicates)
          const existingMembership = await prisma.organizationMember.findFirst({
            where: { accountId: account.id },
            include: { organization: true },
          });

          let org;
          if (existingMembership) {
            // Update the existing organization instead of creating a new one
            org = await prisma.organization.update({
              where: { id: existingMembership.organizationId },
              data: {
                name: companyName,
                description: companyDescription || undefined,
                website: companyWebsite || undefined,
                location: companyLocation || undefined,
              },
            });
          } else {
            // Create new organization with unique slug
            org = await prisma.organization.create({
              data: {
                name: companyName,
                slug,
                description: companyDescription || null,
                website: companyWebsite || null,
                location: companyLocation || null,
              },
            });

            // Create org membership
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
