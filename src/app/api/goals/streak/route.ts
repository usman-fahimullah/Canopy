import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";

/**
 * GET — Calculate and return the user's goal streak
 *
 * Streak is calculated based on consecutive days where at least one
 * milestone was completed. A day is considered "active" if any milestone
 * has a completedAt timestamp within that day.
 */
export async function GET() {
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
      include: { seekerProfile: true },
    });

    if (!account?.seekerProfile) {
      return NextResponse.json({ error: "Seeker profile not found" }, { status: 404 });
    }

    // Get all completed milestones for this user's goals, ordered by completedAt
    const completedMilestones = await prisma.milestone.findMany({
      where: {
        goal: { seekerId: account.seekerProfile.id },
        completed: true,
        completedAt: { not: null },
      },
      select: { completedAt: true },
      orderBy: { completedAt: "desc" },
    });

    if (completedMilestones.length === 0) {
      return NextResponse.json({
        streak: 0,
        isActiveToday: false,
        lastActivityDate: null,
      });
    }

    // Get unique dates (in local timezone, normalized to start of day)
    const uniqueDates = new Set<string>();
    for (const m of completedMilestones) {
      if (m.completedAt) {
        const dateStr = m.completedAt.toISOString().split("T")[0];
        uniqueDates.add(dateStr);
      }
    }

    // Convert to sorted array (most recent first)
    const sortedDates = Array.from(uniqueDates).sort((a, b) => b.localeCompare(a));

    // Today and yesterday in ISO format
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split("T")[0];

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    // Check if active today
    const isActiveToday = sortedDates[0] === todayStr;

    // Calculate streak - must be active today or yesterday to have an active streak
    let streak = 0;
    const mostRecentDate = sortedDates[0];

    if (mostRecentDate === todayStr || mostRecentDate === yesterdayStr) {
      streak = 1;
      let expectedDate = new Date(mostRecentDate);

      for (let i = 1; i < sortedDates.length; i++) {
        expectedDate.setDate(expectedDate.getDate() - 1);
        const expectedStr = expectedDate.toISOString().split("T")[0];

        if (sortedDates[i] === expectedStr) {
          streak++;
        } else {
          break;
        }
      }
    }

    return NextResponse.json({
      streak,
      isActiveToday,
      lastActivityDate: sortedDates[0] || null,
    });
  } catch (error) {
    logger.error("Fetch streak error", {
      error: formatError(error),
      endpoint: "/api/goals/streak",
    });
    return NextResponse.json({ error: "Failed to fetch streak" }, { status: 500 });
  }
}
