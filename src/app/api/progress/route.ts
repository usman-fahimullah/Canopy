import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";

interface ProgressMetrics {
  sessions: {
    completed: number;
    total: number;
    percentage: number;
  };
  actions: {
    completed: number;
    total: number;
    percentage: number;
  };
  skills: {
    count: number;
    percentage: number;
  };
  milestones: {
    completed: number;
    total: number;
    percentage: number;
  };
  goals: {
    completed: number;
    total: number;
    percentage: number;
  };
  overall: number;
}

// GET - Get progress metrics for current user
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user's account with all relevant data
    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      include: {
        seekerProfile: {
          include: {
            sessions: true,
            actionItems: true,
            goals: {
              include: {
                milestones: true,
              },
            },
          },
        },
      },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const seeker = account.seekerProfile;

    // Calculate session metrics
    const totalSessions = seeker?.sessions?.length || 0;
    const completedSessions = seeker?.sessions?.filter(
      (s) => s.status === "COMPLETED"
    ).length || 0;
    const sessionPercentage = totalSessions > 0
      ? Math.round((completedSessions / Math.max(totalSessions, 8)) * 100)
      : 0;

    // Calculate action items metrics
    const totalActions = seeker?.actionItems?.length || 0;
    const completedActions = seeker?.actionItems?.filter(
      (a) => a.status === "COMPLETED"
    ).length || 0;
    const actionPercentage = totalActions > 0
      ? Math.round((completedActions / totalActions) * 100)
      : 0;

    // Calculate skills metrics (based on profile completeness)
    const skillCount = (seeker?.skills?.length || 0) + (seeker?.greenSkills?.length || 0);
    const targetSkillCount = 10; // Target for "complete" skills
    const skillPercentage = Math.min(Math.round((skillCount / targetSkillCount) * 100), 100);

    // Calculate milestone metrics
    const allMilestones = seeker?.goals?.flatMap((g) => g.milestones) || [];
    const totalMilestones = allMilestones.length;
    const completedMilestones = allMilestones.filter((m) => m.completed).length;
    const milestonePercentage = totalMilestones > 0
      ? Math.round((completedMilestones / totalMilestones) * 100)
      : 0;

    // Calculate goal metrics
    const totalGoals = seeker?.goals?.length || 0;
    const completedGoals = seeker?.goals?.filter(
      (g) => g.status === "COMPLETED"
    ).length || 0;
    const goalPercentage = totalGoals > 0
      ? Math.round((completedGoals / totalGoals) * 100)
      : 0;

    // Calculate overall progress (weighted average)
    const weights = {
      sessions: 0.25,
      actions: 0.20,
      skills: 0.15,
      milestones: 0.25,
      goals: 0.15,
    };

    const overallProgress = Math.round(
      sessionPercentage * weights.sessions +
      actionPercentage * weights.actions +
      skillPercentage * weights.skills +
      milestonePercentage * weights.milestones +
      goalPercentage * weights.goals
    );

    const metrics: ProgressMetrics = {
      sessions: {
        completed: completedSessions,
        total: Math.max(totalSessions, 8),
        percentage: sessionPercentage,
      },
      actions: {
        completed: completedActions,
        total: totalActions || 0,
        percentage: actionPercentage,
      },
      skills: {
        count: skillCount,
        percentage: skillPercentage,
      },
      milestones: {
        completed: completedMilestones,
        total: totalMilestones,
        percentage: milestonePercentage,
      },
      goals: {
        completed: completedGoals,
        total: totalGoals,
        percentage: goalPercentage,
      },
      overall: overallProgress,
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error("Fetch progress error:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}
