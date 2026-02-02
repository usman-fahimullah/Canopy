import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { type Prisma, type CareerStage } from "@prisma/client";
import { logger, formatError } from "@/lib/logger";
import { randomUUID } from "crypto";
import {
  type Shell,
  type OnboardingProgress,
  createOnboardingProgress,
  createRoleOnboardingState,
  completeRoleOnboarding,
} from "@/lib/onboarding/types";
import { sendEmail, teamInviteEmail } from "@/lib/email";

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
  pronouns: z.string().max(100).optional(),
  ethnicity: z.string().max(100).optional(),
  phone: z.string().max(50).optional(),
  location: z.string().max(300).optional(),
  profilePhotoUrl: z.string().max(500000).optional(), // data URL or uploaded URL
});

const workExperienceSchema = z.object({
  title: z.string().max(200),
  company: z.string().max(200),
  startDate: z.string().max(50).optional().default(""),
  endDate: z.string().max(50).optional().default(""),
  isCurrent: z.boolean().optional().default(false),
  description: z.string().max(2000).optional().default(""),
});

const talentFields = {
  careerStage: z.string().max(100).optional().nullable(),
  skills: z.array(z.string().max(200)).max(50).optional(),
  sectors: z.array(z.string().max(200)).max(50).optional(),
  goals: z.union([z.string().max(2000), z.array(z.string().max(500)).max(20)]).optional(),
  yearsExperience: z.enum(["less-than-1", "1-3", "3-7", "7-10", "10+"]).optional(),
  roleTypes: z.array(z.string().max(100)).max(20).optional(),
  transitionTimeline: z.string().max(100).optional(),
  locationPreference: z.string().max(200).optional(),
  salaryRange: z
    .union([
      z.string().max(100),
      z.object({
        min: z.number().nullable().optional(),
        max: z.number().nullable().optional(),
      }),
    ])
    .optional(),
  jobTitle: z.string().max(200).optional(),
  pathways: z.array(z.string().max(100)).max(20).optional(),
  categories: z.array(z.string().max(100)).max(15).optional(),
  workExperience: z.array(workExperienceSchema).max(20).optional(),
  remotePreference: z.string().max(100).optional(),
  jobTypeInterests: z.array(z.string().max(100)).max(20).optional(),
};

const coachFields = {
  headline: z.string().max(300).optional(),
  expertise: z.array(z.string().max(200)).max(30).optional(),
  sessionTypes: z.array(z.string().max(100)).max(20).optional(),
  sessionRate: z.number().int().min(0).max(1000000).optional(),
  yearsInClimate: z.number().int().min(0).max(100).optional().nullable(),
  availability: z.string().max(10000).optional(), // JSON blob for schedule + extended data
  sectors: z.array(z.string().max(200)).max(50).optional(),
  // Extended coach onboarding fields
  photoUrl: z.string().max(500000).optional(), // data URL or uploaded URL
  location: z.string().max(300).optional(),
};

const firstRoleSchema = z.object({
  title: z.string().min(1).max(300),
  category: z.string().max(100).optional(),
  location: z.string().max(300).optional(),
  workType: z.enum(["onsite", "hybrid", "remote"]).optional(),
  employmentType: z.enum(["full-time", "part-time", "contract", "internship"]).optional(),
});

const teamInviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["RECRUITER", "MEMBER"]),
});

const employerFields = {
  companyName: z.string().min(1).max(300),
  companyDescription: z.string().max(5000).optional(),
  companyWebsite: z.string().url().max(500).optional().or(z.literal("")),
  companyLocation: z.string().max(300).optional(),
  companySize: z.string().max(100).optional(),
  industries: z.array(z.string().max(100)).max(3).optional(),
  userTitle: z.string().max(200).optional(),
  hiringGoal: z.enum(["specific-role", "multiple-roles", "exploring"]).optional(),
  firstRole: firstRoleSchema.optional().nullable(),
  teamInvites: z.array(teamInviteSchema).max(20).optional(),
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
  pronouns?: string;
  ethnicity?: string;
  phone?: string;
  location?: string;
  avatar?: string;
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

    let account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      include: { seekerProfile: true, coachProfile: true },
    });

    if (!account) {
      if (!user.email) {
        return NextResponse.json({ error: "No email on auth user" }, { status: 400 });
      }

      // Defensive fallback: create account if /auth/redirect didn't create it.
      // Use upsert to handle race conditions (concurrent requests).
      account = await prisma.account.upsert({
        where: { supabaseId: user.id },
        update: {},
        create: {
          supabaseId: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.user_metadata?.full_name || null,
        },
        include: { seekerProfile: true, coachProfile: true },
      });
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
      if (body.pronouns) accountUpdate.pronouns = body.pronouns;
      if (body.ethnicity) accountUpdate.ethnicity = body.ethnicity;
      if (body.phone) accountUpdate.phone = body.phone;
      if (body.location) accountUpdate.location = body.location;
      if (body.profilePhotoUrl) accountUpdate.avatar = body.profilePhotoUrl;

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

      // Normalize goals to a string for headline usage
      const goalsText = typeof body.goals === "string" ? body.goals : body.goals?.[0] || null;

      // Build motivations array from preferences and goals
      const motivations: string[] = [];
      if (Array.isArray(body.goals) && body.goals.length > 0) {
        body.goals.forEach((g) => motivations.push(`goal:${g}`));
      }
      if (body.remotePreference) motivations.push(`remote:${body.remotePreference}`);
      if (body.locationPreference) motivations.push(`location:${body.locationPreference}`);
      if (body.transitionTimeline) motivations.push(`timeline:${body.transitionTimeline}`);
      if (body.roleTypes && body.roleTypes.length > 0) {
        body.roleTypes.forEach((rt) => motivations.push(`roleType:${rt}`));
      }
      if (body.jobTypeInterests && body.jobTypeInterests.length > 0) {
        body.jobTypeInterests.forEach((jt) => motivations.push(`jobType:${jt}`));
      }
      if (typeof body.salaryRange === "object" && body.salaryRange) {
        const { min, max } = body.salaryRange;
        if (min != null || max != null) {
          motivations.push(`salary:${min ?? ""}–${max ?? ""}`);
        }
      } else if (typeof body.salaryRange === "string" && body.salaryRange) {
        motivations.push(`salary:${body.salaryRange}`);
      }

      const seekerData = {
        targetSectors: body.pathways || body.sectors || [],
        headline: body.jobTitle || goalsText || null,
        isMentor: legacyRole === "mentor",
        mentorTopics: legacyRole === "mentor" ? body.sectors || [] : [],
        skills: body.skills || [],
        greenSkills: body.categories || [],
        careerStage: (body.careerStage as CareerStage) || null,
        yearsExperience: body.yearsExperience ? parseYearsExperience(body.yearsExperience) : null,
        motivations,
        summary: goalsText || null,
      };

      // Wrap all talent profile writes in a transaction for consistency
      const seekerProfileId = await prisma.$transaction(async (tx) => {
        let profileId: string;

        if (!account.seekerProfile) {
          const created = await tx.seekerProfile.create({
            data: {
              accountId: account.id,
              ...seekerData,
            },
          });
          profileId = created.id;
        } else {
          profileId = account.seekerProfile.id;
          await tx.seekerProfile.update({
            where: { id: profileId },
            data: {
              targetSectors:
                seekerData.targetSectors.length > 0
                  ? seekerData.targetSectors
                  : account.seekerProfile.targetSectors,
              headline: seekerData.headline || account.seekerProfile.headline,
              isMentor: legacyRole === "mentor" ? true : account.seekerProfile.isMentor,
              mentorTopics:
                legacyRole === "mentor" ? body.sectors || [] : account.seekerProfile.mentorTopics,
              skills:
                seekerData.skills.length > 0 ? seekerData.skills : account.seekerProfile.skills,
              greenSkills:
                seekerData.greenSkills.length > 0
                  ? seekerData.greenSkills
                  : account.seekerProfile.greenSkills,
              careerStage: seekerData.careerStage || account.seekerProfile.careerStage,
              yearsExperience: seekerData.yearsExperience ?? account.seekerProfile.yearsExperience,
              motivations: motivations.length > 0 ? motivations : account.seekerProfile.motivations,
              summary: seekerData.summary || account.seekerProfile.summary,
            },
          });
        }

        // Link pathways via SeekerPathway junction table
        if (body.pathways && body.pathways.length > 0) {
          const pathwayRecords = await tx.pathway.findMany({
            where: { slug: { in: body.pathways } },
            select: { id: true, slug: true },
          });

          if (pathwayRecords.length > 0) {
            await tx.seekerPathway.deleteMany({
              where: { seekerId: profileId },
            });

            await tx.seekerPathway.createMany({
              data: pathwayRecords.map((p, index) => ({
                seekerId: profileId,
                pathwayId: p.id,
                priority: index,
              })),
            });
          }
        }

        // Create work experience records
        if (body.workExperience && body.workExperience.length > 0) {
          await tx.workExperience.deleteMany({
            where: { seekerId: profileId },
          });

          await tx.workExperience.createMany({
            data: body.workExperience.map((exp) => ({
              seekerId: profileId,
              jobTitle: exp.title,
              companyName: exp.company,
              startDate: exp.startDate ? new Date(`${exp.startDate}-01`) : new Date(),
              endDate: exp.endDate && !exp.isCurrent ? new Date(`${exp.endDate}-01`) : null,
              isCurrent: exp.isCurrent ?? false,
              description: exp.description || null,
              employmentType: "FULL_TIME" as const,
              workType: "ONSITE" as const,
            })),
          });
        }

        return profileId;
      });

      return finishRoleOnboarding(account, progress, "talent", accountUpdate, body.action);
    }

    // ── Action: Complete coach role ──────────────────────────────
    if (isCoachRole(body)) {
      if (body.firstName && body.lastName) {
        accountUpdate.name = `${body.firstName} ${body.lastName}`;
      }
      if (body.linkedinUrl) accountUpdate.linkedinUrl = body.linkedinUrl;
      if (body.bio) accountUpdate.bio = body.bio;

      // Parse buffer time from availability JSON if present
      let bufferTime: number | undefined;
      if (body.availability) {
        try {
          const avail = JSON.parse(body.availability);
          if (typeof avail.bufferMinutes === "number") {
            bufferTime = avail.bufferMinutes;
          }
        } catch {
          // Not JSON, use as-is
        }
      }

      // Wrap coach profile + account update in a transaction for consistency
      await prisma.$transaction(async (tx) => {
        if (!account.coachProfile) {
          await tx.coachProfile.create({
            data: {
              accountId: account.id,
              firstName: body.firstName || null,
              lastName: body.lastName || null,
              bio: body.bio || null,
              headline: body.headline || null,
              photoUrl: body.photoUrl || null,
              sectors: body.sectors || [],
              expertise: body.expertise || [],
              sessionTypes: body.sessionTypes || [],
              sessionRate: body.sessionRate || 15000,
              yearsInClimate: body.yearsInClimate || null,
              availability: body.availability || null,
              bufferTime: bufferTime ?? 15,
              status: "PENDING",
              applicationDate: new Date(),
            },
          });
        } else {
          await tx.coachProfile.update({
            where: { id: account.coachProfile.id },
            data: {
              firstName: body.firstName || account.coachProfile.firstName,
              lastName: body.lastName || account.coachProfile.lastName,
              bio: body.bio || account.coachProfile.bio,
              headline: body.headline || account.coachProfile.headline,
              photoUrl: body.photoUrl || account.coachProfile.photoUrl,
              sectors: body.sectors || account.coachProfile.sectors,
              expertise: body.expertise || account.coachProfile.expertise,
              sessionTypes: body.sessionTypes || account.coachProfile.sessionTypes,
              sessionRate: body.sessionRate || account.coachProfile.sessionRate,
              yearsInClimate: body.yearsInClimate || account.coachProfile.yearsInClimate,
              availability: body.availability || account.coachProfile.availability,
              bufferTime: bufferTime ?? account.coachProfile.bufferTime,
            },
          });
        }
      });

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

      // Wrap org create/update, member create, and job create in a transaction
      const orgId = await prisma.$transaction(async (tx) => {
        let txOrgId: string;

        if (existingMembership) {
          txOrgId = existingMembership.organizationId;
          await tx.organization.update({
            where: { id: txOrgId },
            data: {
              name: body.companyName,
              description: body.companyDescription || undefined,
              website: body.companyWebsite || undefined,
              location: body.companyLocation || undefined,
              size: body.companySize || undefined,
              industries: body.industries || undefined,
              hiringGoal: body.hiringGoal || undefined,
            },
          });
        } else {
          const org = await tx.organization.create({
            data: {
              name: body.companyName,
              slug,
              description: body.companyDescription || null,
              website: body.companyWebsite || null,
              location: body.companyLocation || null,
              size: body.companySize || null,
              industries: body.industries || [],
              hiringGoal: body.hiringGoal || null,
            },
          });
          txOrgId = org.id;

          await tx.organizationMember.create({
            data: {
              accountId: account.id,
              organizationId: org.id,
              role: "OWNER",
              title: body.userTitle || null,
            },
          });
        }

        // Create a draft job if firstRole is provided
        if (body.firstRole) {
          const jobSlug = body.firstRole.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

          const workTypeMap: Record<string, "ONSITE" | "HYBRID" | "REMOTE"> = {
            onsite: "ONSITE",
            hybrid: "HYBRID",
            remote: "REMOTE",
          };

          const employmentTypeMap: Record<
            string,
            "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP"
          > = {
            "full-time": "FULL_TIME",
            "part-time": "PART_TIME",
            contract: "CONTRACT",
            internship: "INTERNSHIP",
          };

          await tx.job.create({
            data: {
              title: body.firstRole.title,
              slug: jobSlug,
              description: "",
              organizationId: txOrgId,
              location: body.firstRole.location || null,
              locationType: body.firstRole.workType
                ? workTypeMap[body.firstRole.workType]
                : undefined,
              employmentType: body.firstRole.employmentType
                ? employmentTypeMap[body.firstRole.employmentType]
                : undefined,
              climateCategory: body.firstRole.category || null,
              status: "DRAFT",
            },
          });
        }

        return txOrgId;
      });

      // Send team invites (non-blocking)
      if (body.teamInvites && body.teamInvites.length > 0) {
        const inviterName = accountUpdate.name || account.name || account.email;
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

        for (const invite of body.teamInvites) {
          const token = randomUUID();
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 7);

          prisma.teamInvite
            .create({
              data: {
                organizationId: orgId,
                invitedById: account.id,
                email: invite.email,
                role: invite.role,
                token,
                expiresAt,
                status: "PENDING",
              },
            })
            .then(() => {
              const acceptUrl = `${appUrl}/invite/accept?token=${token}`;
              return sendEmail(
                teamInviteEmail({
                  recipientEmail: invite.email,
                  inviterName,
                  companyName: body.companyName,
                  role: invite.role,
                  acceptUrl,
                })
              );
            })
            .catch((err) => {
              logger.error("Failed to create team invite during onboarding", {
                error: formatError(err),
                email: invite.email,
                endpoint: "/api/onboarding",
              });
            });
        }
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
    logger.error("Onboarding POST error", {
      error: formatError(error),
      endpoint: "/api/onboarding",
    });
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
