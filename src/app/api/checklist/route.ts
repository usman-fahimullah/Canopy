import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { UpdateChecklistSchema } from "@/lib/validators/api";
import {
  CHECKLIST_ITEMS,
  DEFAULT_PIPELINE_STAGES,
  DEFAULT_COACH_SESSION_RATE,
} from "@/lib/checklist";
import type { Shell } from "@/lib/onboarding/types";

// ─── Query Param Validation ──────────────────────────────────────

const ShellSchema = z.enum(["talent", "coach", "employer"]);

// ─── Auto-Detection Per Shell ────────────────────────────────────

async function detectTalentCompletion(accountId: string): Promise<Record<string, boolean>> {
  const account = await prisma.account.findUnique({
    where: { id: accountId },
    select: {
      name: true,
      bio: true,
      seekerProfile: {
        select: {
          skills: true,
          targetSectors: true,
          careerStage: true,
          motivations: true,
          _count: {
            select: {
              savedJobs: true,
              applications: true,
            },
          },
        },
      },
    },
  });

  if (!account) return {};

  const seeker = account.seekerProfile;

  const savedCount = seeker?._count?.savedJobs ?? 0;
  const appCount = seeker?._count?.applications ?? 0;

  return {
    profile: !!(account.name && account.bio && (seeker?.skills?.length ?? 0) > 0),
    skills: (seeker?.skills?.length ?? 0) > 0 && (seeker?.targetSectors?.length ?? 0) > 0,
    preferences: seeker?.careerStage != null && (seeker?.motivations?.length ?? 0) > 0,
    browse: savedCount > 0 || appCount > 0,
    save: savedCount > 0,
  };
}

async function detectCoachCompletion(accountId: string): Promise<Record<string, boolean>> {
  const account = await prisma.account.findUnique({
    where: { id: accountId },
    select: {
      coachProfile: {
        select: {
          bio: true,
          headline: true,
          expertise: true,
          availability: true,
          sessionRate: true,
          stripeAccountId: true,
          status: true,
        },
      },
    },
  });

  const coach = account?.coachProfile;
  if (!coach) return {};

  return {
    profile: !!(coach.bio && coach.headline && (coach.expertise?.length ?? 0) > 0),
    availability: coach.availability != null,
    rate: coach.sessionRate !== DEFAULT_COACH_SESSION_RATE,
    stripe: coach.stripeAccountId != null,
    verified: coach.status === "APPROVED" || coach.status === "ACTIVE",
  };
}

async function detectEmployerCompletion(accountId: string): Promise<Record<string, boolean>> {
  // Find the user's organization membership
  const membership = await prisma.organizationMember.findFirst({
    where: { accountId },
    select: {
      organization: {
        select: {
          description: true,
          website: true,
          jobs: {
            select: {
              id: true,
              stages: true,
              _count: { select: { applications: true } },
            },
          },
          members: { select: { id: true }, take: 2 },
          teamInvites: { select: { id: true }, take: 1 },
        },
      },
    },
  });

  const org = membership?.organization;
  if (!org) return {};

  return {
    company: !!(org.description && org.website),
    role: (org.jobs?.length ?? 0) > 0,
    team: (org.members?.length ?? 0) > 1 || (org.teamInvites?.length ?? 0) > 0,
    pipeline: org.jobs?.some((j) => j.stages !== DEFAULT_PIPELINE_STAGES) ?? false,
    candidates: org.jobs?.some((j) => j._count.applications > 0) ?? false,
  };
}

const DETECTORS: Record<Shell, (accountId: string) => Promise<Record<string, boolean>>> = {
  talent: detectTalentCompletion,
  coach: detectCoachCompletion,
  employer: detectEmployerCompletion,
};

// ─── GET — Fetch checklist completion for a shell ────────────────

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate shell param
    const shellParam = request.nextUrl.searchParams.get("shell");
    const shellResult = ShellSchema.safeParse(shellParam);
    if (!shellResult.success) {
      return NextResponse.json(
        { error: "Invalid or missing shell parameter. Use ?shell=talent|coach|employer" },
        { status: 422 }
      );
    }
    const shell = shellResult.data;

    // Resolve internal account ID
    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      select: { id: true },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Run shell-specific auto-detection
    const completionMap = await DETECTORS[shell](account.id);

    // Build response using the shared config items
    const items = CHECKLIST_ITEMS[shell];
    const checklistItems = items.map((item) => ({
      id: item.id,
      label: item.label,
      completed: completionMap[item.id] ?? false,
    }));

    const completedCount = checklistItems.filter((i) => i.completed).length;
    const totalCount = checklistItems.length;

    return NextResponse.json({
      items: checklistItems,
      completed: completedCount,
      total: totalCount,
      progress: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
    });
  } catch (error) {
    logger.error("Fetch checklist error", {
      error: formatError(error),
      endpoint: "/api/checklist",
    });
    return NextResponse.json({ error: "Failed to fetch checklist" }, { status: 500 });
  }
}

// ─── PATCH — Mark a checklist item as manually completed ─────────

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = UpdateChecklistSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }
    const { itemId, completed } = result.data;

    // Manual completions are tracked in localStorage on the client.
    // This endpoint exists for analytics and future DB persistence
    // (e.g., a ChecklistCompletion model).

    return NextResponse.json({
      message: "Checklist item updated",
      itemId,
      completed,
    });
  } catch (error) {
    logger.error("Update checklist error", {
      error: formatError(error),
      endpoint: "/api/checklist",
    });
    return NextResponse.json({ error: "Failed to update checklist" }, { status: 500 });
  }
}
