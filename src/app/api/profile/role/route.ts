import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import type { Shell, EntryIntent, OnboardingProgress } from "@/lib/onboarding/types";

export type CandidRole = "seeker" | "mentor" | "coach" | "admin";

interface RoleResponse {
  // Account identity fields (used by ShellProvider)
  id: string;
  email: string;
  name: string;
  avatar: string | null;

  // Legacy Candid role fields (kept for backward compat with existing Candid UI)
  role: CandidRole;
  roles: CandidRole[];
  seekerProfile: boolean;
  coachProfile: boolean;
  isMentor: boolean;
  isAdmin: boolean;

  // Multi-shell fields
  activeShells: Shell[];
  primaryShell: Shell | null;
  entryIntent: EntryIntent | null;
  onboardingProgress: OnboardingProgress | null;

  // Employer org role — used for nav permission filtering
  employerOrgRole: string | null;
}

// GET - Get the current user's role(s) across all shells
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user's account with profiles
    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      include: {
        seekerProfile: {
          select: {
            id: true,
            isMentor: true,
          },
        },
        coachProfile: {
          select: {
            id: true,
            status: true,
          },
        },
        orgMemberships: {
          select: {
            role: true,
          },
        },
      },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // ── Legacy Candid role logic (unchanged) ────────────────────
    const candidRoles: CandidRole[] = [];
    let primaryCandidRole: CandidRole = "seeker";

    const isAdmin = account.orgMemberships.some((m) => m.role === "ADMIN");
    if (isAdmin) {
      candidRoles.push("admin");
    }

    const hasCoachProfile = !!account.coachProfile;
    const isActiveCoach =
      account.coachProfile?.status === "ACTIVE" || account.coachProfile?.status === "APPROVED";
    if (isActiveCoach) {
      candidRoles.push("coach");
      primaryCandidRole = "coach";
    }

    const hasSeekerProfile = !!account.seekerProfile;
    const isMentor = account.seekerProfile?.isMentor || false;
    if (isMentor) {
      candidRoles.push("mentor");
      if (primaryCandidRole === "seeker") primaryCandidRole = "mentor";
    }

    if (hasSeekerProfile) {
      candidRoles.push("seeker");
    }

    if (candidRoles.length === 0) {
      candidRoles.push("seeker");
    }

    // ── Multi-shell fields ──────────────────────────────────────
    const activeShells = (account.activeRoles || []) as Shell[];
    const primaryShell = (account.primaryRole || null) as Shell | null;
    const entryIntent = (account.entryIntent || null) as EntryIntent | null;
    const onboardingProgress = (account.onboardingProgress as OnboardingProgress | null) || null;

    // Employer org role — first membership's role (if any)
    const employerOrgRole =
      account.orgMemberships.length > 0 ? account.orgMemberships[0].role : null;

    const response: RoleResponse = {
      // Account identity
      id: account.id,
      email: account.email,
      name: account.name || "",
      avatar: account.avatar || null,

      // Legacy
      role: primaryCandidRole,
      roles: candidRoles,
      seekerProfile: hasSeekerProfile,
      coachProfile: hasCoachProfile,
      isMentor,
      isAdmin,

      // Multi-shell
      activeShells,
      primaryShell,
      entryIntent,
      onboardingProgress,

      // Employer
      employerOrgRole,
    };

    return NextResponse.json(response);
  } catch (error) {
    logger.error("Fetch role error", { error: formatError(error), endpoint: "/api/profile/role" });
    return NextResponse.json({ error: "Failed to fetch role" }, { status: 500 });
  }
}
