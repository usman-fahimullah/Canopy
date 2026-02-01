import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { type Prisma, type CareerStage } from "@prisma/client";
import {
  type Shell,
  type OnboardingProgress,
  createOnboardingProgress,
  createRoleOnboardingState,
  completeRoleOnboarding,
} from "@/lib/onboarding/types";

// ── Zod Schemas ──────────────────────────────────────────────────

const shellSchema = z.enum(["talent", "coach", "employer"]);

const baseProfileFields = {
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  linkedinUrl: z.string().url().max(500).optional().or(z.literal("")),
  bio: z.string().max(2000).optional(),
};

const setIntentSchema = z.object({
  action: z.literal("set-intent"),
  entryIntent: shellSchema,
});

const completeProfileSchema = z.object({
  action: z.literal("complete-profile"),
  ...baseProfileFields,
});

const talentFields = {
  careerStage: z.string().max(100).optional().nullable(),
  skills: z.array(z.string().max(200)).max(50).optional(),
  sectors: z.array(z.string().max(200)).max(50).optional(),
  goals: z.array(z.string().max(500)).max(20).optional(),
  yearsExperience: z.enum(["less-than-1", "1-3", "3-7", "7-10", "10+"]).optional(),
  roleTypes: z.array(z.string().max(100)).max(20).optional(),
  transitionTimeline: z.string().max(100).optional(),
  locationPreference: z.string().max(200).optional(),
  salaryRange: z.string().max(100).optional(),
  jobTitle: z.string().max(200).optional(),
};

const coachFields = {
  headline: z.string().max(300).optional(),
  expertise: z.array(z.string().max(200)).max(30).optional(),
  sessionTypes: z.array(z.string().max(100)).max(20).optional(),
  sessionRate: z.number().int().min(0).max(1000000).optional(),
  yearsInClimate: z.number().int().min(0).max(100).optional().nullable(),
  availability: z.string().max(500).optional(),
  sectors: z.array(z.string().max(200)).max(50).optional(),
};

const employerFields = {
  companyName: z.string().min(1).max(300),
  companyDescription: z.string().max(5000).optional(),
  companyWebsite: z.string().url().max(500).optional().or(z.literal("")),
  companyLocation: z.string().max(300).optional(),
  companySize: z.string().max(100).optional(),
  userTitle: z.string().max(200).optional(),
};

const talentRoleSchema = z.object({
  action: z.enum(["complete-role", "activate-role"]),
  shell: z.literal("talent"),
  ...baseProfileFields,
  ...talentFields,
  role: z.enum(["seeker", "mentor"]).optional(),
});

const coachRoleSchema = z.object({
  action: z.enum(["complete-role", "activate-role"]),
  shell: z.literal("coach"),
  ...baseProfileFields,
  ...coachFields,
});

const employerRoleSchema = z.object({
  action: z.enum(["complete-role", "activate-role"]),
  shell: z.literal("employer"),
  ...baseProfileFields,
  ...employerFields,
});

// Legacy format: sends "role" instead of "shell"+"action"
const legacyRoleSchema = z.object({
  role: z.enum(["seeker", "mentor", "coach"]),
  ...baseProfileFields,
  email: z.string().email().max(320).optional(),
  ...talentFields,
  ...coachFields,
});

type SetIntentBody = z.infer<typeof setIntentSchema>;
type CompleteProfileBody = z.infer<typeof completeProfileSchema>;
type TalentRoleBody = z.infer<typeof talentRoleSchema>;
type CoachRoleBody = z.infer<typeof coachRoleSchema>;
type EmployerRoleBody = z.infer<typeof employerRoleSchema>;
type LegacyRoleBody = z.infer<typeof legacyRoleSchema>;

const onboardingBodySchema = z.union([
  setIntentSchema,
  completeProfileSchema,
  talentRoleSchema,
  coachRoleSchema,
  employerRoleSchema,
  legacyRoleSchema,
]);

// ── Type for account updates ─────────────────────────────────────

interface AccountUpdate {
  name?: string;
  linkedinUrl?: string;
  bio?: string;
  entryIntent?: string;
  activeRoles?: string[];
  primaryRole?: string;
}

/** Convert OnboardingProgress to a plain JSON object for Prisma's Json field */
function toJsonValue(progress: OnboardingProgress): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(progress)) as Prisma.InputJsonValue;
}

// ── Helpers ──────────────────────────────────────────────────────

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

/** Generate a unique slug, appending a numeric suffix on collision */
async function generateUniqueSlug(baseName: string): Promise<string> {
  const baseSlug = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const existing = await prisma.organization.findUnique({
    where: { slug: baseSlug },
    select: { id: true },
  });

  if (!existing) return baseSlug;

  for (let i = 2; i <= 100; i++) {
    const candidate = `${baseSlug}-${i}`;
    const taken = await prisma.organization.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!taken) return candidate;
  }

  const random = Math.random().toString(36).substring(2, 8);
  return `${baseSlug}-${random}`;
}

function isSetIntent(body: unknown): body is SetIntentBody {
  return (body as SetIntentBody).action === "set-intent";
}

function isCompleteProfile(body: unknown): body is CompleteProfileBody {
  return (body as CompleteProfileBody).action === "complete-profile";
}

function isTalentRole(body: unknown): body is TalentRoleBody {
  const b = body as TalentRoleBody;
  return (b.action === "complete-role" || b.action === "activate-role") && b.shell === "talent";
}

function isCoachRole(body: unknown): body is CoachRoleBody {
  const b = body as CoachRoleBody;
  return (b.action === "complete-role" || b.action === "activate-role") && b.shell === "coach";
}

function isEmployerRole(body: unknown): body is EmployerRoleBody {
  const b = body as EmployerRoleBody;
  return (b.action === "complete-role" || b.action === "activate-role") && b.shell === "employer";
}

function isLegacy(body: unknown): body is LegacyRoleBody {
  const b = body as LegacyRoleBody;
  return "role" in b && !("action" in b);
}

// ── POST Handler ─────────────────────────────────────────────────

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
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = onboardingBodySchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.issues.map((i) => ({
            path: i.path.join("."),
            message: i.message,
          })),
        },
        { status: 400 }
      );
    }

    const body = parsed.data;

    let progress: OnboardingProgress =
      (account.onboardingProgress as OnboardingProgress | null) || createOnboardingProgress();

    const accountUpdate: AccountUpdate = {};

    // ── Action: Set entry intent ─────────────────────────────────
    if (isSetIntent(body)) {
      const intent = body.entryIntent;
      accountUpdate.entryIntent = intent;

      progress.roles[intent] = createRoleOnboardingState(intent);

      const activeRoles = [...(account.activeRoles || [])];
      if (!activeRoles.includes(intent)) {
        activeRoles.push(intent);
      }
      accountUpdate.activeRoles = activeRoles;

      if (!account.primaryRole) {
        accountUpdate.primaryRole = intent;
      }

      await prisma.account.update({
        where: { id: account.id },
        data: {
          ...accountUpdate,
          onboardingProgress: toJsonValue(progress),
        },
      });

      return NextResponse.json({ success: true, action: "set-intent" });
    }

    // ── Action: Complete base profile ────────────────────────────
    if (isCompleteProfile(body)) {
      if (body.firstName && body.lastName) {
        accountUpdate.name = `${body.firstName} ${body.lastName}`;
      }
      if (body.linkedinUrl) accountUpdate.linkedinUrl = body.linkedinUrl;
      if (body.bio) accountUpdate.bio = body.bio;

      progress.baseProfileComplete = true;

      await prisma.account.update({
        where: { id: account.id },
        data: {
          ...accountUpdate,
          onboardingProgress: toJsonValue(progress),
        },
      });

      return NextResponse.json({ success: true, action: "complete-profile" });
    }

    // ── Action: Complete talent role ─────────────────────────────
    if (isTalentRole(body)) {
      if (body.firstName && body.lastName) {
        accountUpdate.name = `${body.firstName} ${body.lastName}`;
      }
      if (body.linkedinUrl) accountUpdate.linkedinUrl = body.linkedinUrl;
      if (body.bio) accountUpdate.bio = body.bio;

      const legacyRole = body.role;

      if (!account.seekerProfile) {
        await prisma.seekerProfile.create({
          data: {
            accountId: account.id,
            targetSectors: body.sectors || [],
            headline: body.jobTitle || body.goals?.[0] || null,
            isMentor: legacyRole === "mentor",
            mentorTopics: legacyRole === "mentor" ? body.sectors || [] : [],
            skills: body.skills || [],
            careerStage: (body.careerStage as CareerStage) || null,
            yearsExperience: body.yearsExperience
              ? parseYearsExperience(body.yearsExperience)
              : null,
          },
        });
      } else {
        await prisma.seekerProfile.update({
          where: { id: account.seekerProfile.id },
          data: {
            targetSectors: body.sectors || account.seekerProfile.targetSectors,
            headline: body.jobTitle || body.goals?.[0] || account.seekerProfile.headline,
            isMentor: legacyRole === "mentor" ? true : account.seekerProfile.isMentor,
            mentorTopics:
              legacyRole === "mentor" ? body.sectors || [] : account.seekerProfile.mentorTopics,
            skills: body.skills || account.seekerProfile.skills,
            careerStage: (body.careerStage as CareerStage) || account.seekerProfile.careerStage,
            yearsExperience: body.yearsExperience
              ? parseYearsExperience(body.yearsExperience)
              : account.seekerProfile.yearsExperience,
          },
        });
      }

      return finishRoleOnboarding(account, progress, "talent", accountUpdate, body.action);
    }

    // ── Action: Complete coach role ──────────────────────────────
    if (isCoachRole(body)) {
      if (body.firstName && body.lastName) {
        accountUpdate.name = `${body.firstName} ${body.lastName}`;
      }
      if (body.linkedinUrl) accountUpdate.linkedinUrl = body.linkedinUrl;
      if (body.bio) accountUpdate.bio = body.bio;

      if (!account.coachProfile) {
        await prisma.coachProfile.create({
          data: {
            accountId: account.id,
            firstName: body.firstName || null,
            lastName: body.lastName || null,
            bio: body.bio || null,
            headline: body.headline || null,
            sectors: body.sectors || [],
            expertise: body.expertise || [],
            sessionTypes: body.sessionTypes || [],
            sessionRate: body.sessionRate || 15000,
            yearsInClimate: body.yearsInClimate || null,
            status: "PENDING",
            applicationDate: new Date(),
          },
        });
      } else {
        await prisma.coachProfile.update({
          where: { id: account.coachProfile.id },
          data: {
            firstName: body.firstName || account.coachProfile.firstName,
            lastName: body.lastName || account.coachProfile.lastName,
            bio: body.bio || account.coachProfile.bio,
            headline: body.headline || account.coachProfile.headline,
            sectors: body.sectors || account.coachProfile.sectors,
            expertise: body.expertise || account.coachProfile.expertise,
            sessionTypes: body.sessionTypes || account.coachProfile.sessionTypes,
            sessionRate: body.sessionRate || account.coachProfile.sessionRate,
            yearsInClimate: body.yearsInClimate || account.coachProfile.yearsInClimate,
          },
        });
      }

      return finishRoleOnboarding(account, progress, "coach", accountUpdate, body.action);
    }

    // ── Action: Complete employer role ───────────────────────────
    if (isEmployerRole(body)) {
      if (body.firstName && body.lastName) {
        accountUpdate.name = `${body.firstName} ${body.lastName}`;
      }
      if (body.linkedinUrl) accountUpdate.linkedinUrl = body.linkedinUrl;
      if (body.bio) accountUpdate.bio = body.bio;

      const slug = await generateUniqueSlug(body.companyName);

      // Check if user already owns an org (prevent creating duplicates)
      const existingMembership = await prisma.organizationMember.findFirst({
        where: { accountId: account.id },
        include: { organization: true },
      });

      if (existingMembership) {
        await prisma.organization.update({
          where: { id: existingMembership.organizationId },
          data: {
            name: body.companyName,
            description: body.companyDescription || undefined,
            website: body.companyWebsite || undefined,
            location: body.companyLocation || undefined,
          },
        });
      } else {
        const org = await prisma.organization.create({
          data: {
            name: body.companyName,
            slug,
            description: body.companyDescription || null,
            website: body.companyWebsite || null,
            location: body.companyLocation || null,
          },
        });

        await prisma.organizationMember.create({
          data: {
            accountId: account.id,
            organizationId: org.id,
            role: "OWNER",
            title: body.userTitle || null,
          },
        });
      }

      return finishRoleOnboarding(account, progress, "employer", accountUpdate, body.action);
    }

    // ── Legacy format ────────────────────────────────────────────
    if (isLegacy(body)) {
      const effectiveShell: Shell =
        body.role === "seeker" || body.role === "mentor" ? "talent" : "coach";

      if (body.firstName && body.lastName) {
        accountUpdate.name = `${body.firstName} ${body.lastName}`;
      }
      if (body.linkedinUrl) accountUpdate.linkedinUrl = body.linkedinUrl;
      if (body.bio) accountUpdate.bio = body.bio;

      if (effectiveShell === "talent") {
        if (!account.seekerProfile) {
          await prisma.seekerProfile.create({
            data: {
              accountId: account.id,
              targetSectors: body.sectors || [],
              headline: body.jobTitle || body.goals?.[0] || null,
              isMentor: body.role === "mentor",
              mentorTopics: body.role === "mentor" ? body.sectors || [] : [],
              skills: body.skills || [],
              careerStage: (body.careerStage as CareerStage) || null,
              yearsExperience: body.yearsExperience
                ? parseYearsExperience(body.yearsExperience)
                : null,
            },
          });
        } else {
          await prisma.seekerProfile.update({
            where: { id: account.seekerProfile.id },
            data: {
              targetSectors: body.sectors || account.seekerProfile.targetSectors,
              headline: body.jobTitle || body.goals?.[0] || account.seekerProfile.headline,
              isMentor: body.role === "mentor" ? true : account.seekerProfile.isMentor,
              mentorTopics:
                body.role === "mentor" ? body.sectors || [] : account.seekerProfile.mentorTopics,
              skills: body.skills || account.seekerProfile.skills,
              careerStage: (body.careerStage as CareerStage) || account.seekerProfile.careerStage,
              yearsExperience: body.yearsExperience
                ? parseYearsExperience(body.yearsExperience)
                : account.seekerProfile.yearsExperience,
            },
          });
        }
      } else {
        // Coach via legacy
        if (!account.coachProfile) {
          await prisma.coachProfile.create({
            data: {
              accountId: account.id,
              firstName: body.firstName || null,
              lastName: body.lastName || null,
              bio: body.bio || null,
              headline: body.headline || null,
              sectors: body.sectors || [],
              expertise: body.expertise || [],
              sessionTypes: body.sessionTypes || [],
              sessionRate: body.sessionRate || 15000,
              yearsInClimate: body.yearsInClimate || null,
              status: "PENDING",
              applicationDate: new Date(),
            },
          });
        } else {
          await prisma.coachProfile.update({
            where: { id: account.coachProfile.id },
            data: {
              firstName: body.firstName || account.coachProfile.firstName,
              lastName: body.lastName || account.coachProfile.lastName,
              bio: body.bio || account.coachProfile.bio,
              headline: body.headline || account.coachProfile.headline,
              sectors: body.sectors || account.coachProfile.sectors,
              expertise: body.expertise || account.coachProfile.expertise,
              sessionTypes: body.sessionTypes || account.coachProfile.sessionTypes,
              sessionRate: body.sessionRate || account.coachProfile.sessionRate,
              yearsInClimate: body.yearsInClimate || account.coachProfile.yearsInClimate,
            },
          });
        }
      }

      return finishRoleOnboarding(
        account,
        progress,
        effectiveShell,
        accountUpdate,
        "complete-role"
      );
    }

    return NextResponse.json(
      { error: "Invalid action or missing required fields" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json({ error: "Failed to complete onboarding" }, { status: 500 });
  }
}

// ── Shared: finalize role onboarding progress ────────────────────

async function finishRoleOnboarding(
  account: { id: string; name: string | null; activeRoles: string[]; primaryRole: string | null },
  progress: OnboardingProgress,
  shell: Shell,
  accountUpdate: AccountUpdate,
  action: string
) {
  if (!progress.roles[shell]) {
    progress.roles[shell] = createRoleOnboardingState(shell);
  }

  progress = completeRoleOnboarding(progress, shell);

  if (account.name || accountUpdate.name) {
    progress.baseProfileComplete = true;
  }

  const activeRoles = [...(account.activeRoles || [])];
  if (!activeRoles.includes(shell)) {
    activeRoles.push(shell);
  }
  accountUpdate.activeRoles = activeRoles;

  if (!account.primaryRole) {
    accountUpdate.primaryRole = shell;
  }

  await prisma.account.update({
    where: { id: account.id },
    data: {
      ...accountUpdate,
      onboardingProgress: toJsonValue(progress),
    },
  });

  return NextResponse.json({
    success: true,
    action,
    shell,
  });
}
