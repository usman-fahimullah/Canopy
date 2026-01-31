import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";

export type CandidRole = "seeker" | "mentor" | "coach" | "admin";

interface RoleResponse {
  role: CandidRole;
  roles: CandidRole[];
  seekerProfile: boolean;
  coachProfile: boolean;
  isMentor: boolean;
  isAdmin: boolean;
}

// GET - Get the current user's role(s) in Candid
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

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

    // Determine roles
    const roles: CandidRole[] = [];
    let primaryRole: CandidRole = "seeker";

    // Check if admin (owner of any org)
    const isAdmin = account.orgMemberships.some(m => m.role === "OWNER" || m.role === "ADMIN");
    if (isAdmin) {
      roles.push("admin");
    }

    // Check if coach (approved)
    const hasCoachProfile = !!account.coachProfile;
    const isActiveCoach = account.coachProfile?.status === "ACTIVE" || account.coachProfile?.status === "APPROVED";
    if (isActiveCoach) {
      roles.push("coach");
      primaryRole = "coach";
    }

    // Check if mentor (seeker with isMentor=true)
    const hasSeekerProfile = !!account.seekerProfile;
    const isMentor = account.seekerProfile?.isMentor || false;
    if (isMentor) {
      roles.push("mentor");
      if (primaryRole === "seeker") primaryRole = "mentor";
    }

    // Everyone with a seeker profile is a seeker
    if (hasSeekerProfile) {
      roles.push("seeker");
    }

    // Default to seeker if no roles
    if (roles.length === 0) {
      roles.push("seeker");
    }

    const response: RoleResponse = {
      role: primaryRole,
      roles,
      seekerProfile: hasSeekerProfile,
      coachProfile: hasCoachProfile,
      isMentor,
      isAdmin,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Fetch role error:", error);
    return NextResponse.json(
      { error: "Failed to fetch role" },
      { status: 500 }
    );
  }
}
