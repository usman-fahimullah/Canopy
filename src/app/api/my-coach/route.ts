import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";

// GET - Fetch current user's assigned coach
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find user's account and seeker profile
    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      include: { seekerProfile: true },
    });

    if (!account?.seekerProfile) {
      return NextResponse.json({ coach: null });
    }

    // Find active coach assignment
    const assignment = await prisma.coachAssignment.findFirst({
      where: {
        seekerId: account.seekerProfile.id,
        status: "ACTIVE",
      },
      include: {
        coach: {
          include: {
            account: { select: { name: true, email: true } },
            _count: { select: { reviews: true } },
          },
        },
      },
      orderBy: { startedAt: "desc" },
    });

    if (!assignment) {
      return NextResponse.json({ coach: null });
    }

    const coach = assignment.coach;

    // Count upcoming sessions with this coach
    const upcomingSessionsCount = await prisma.session.count({
      where: {
        coachId: coach.id,
        menteeId: account.seekerProfile.id,
        status: "SCHEDULED",
        scheduledAt: { gte: new Date() },
      },
    });

    // Get next session with this coach
    const nextSession = await prisma.session.findFirst({
      where: {
        coachId: coach.id,
        menteeId: account.seekerProfile.id,
        status: "SCHEDULED",
        scheduledAt: { gte: new Date() },
      },
      orderBy: { scheduledAt: "asc" },
    });

    return NextResponse.json({
      coach: {
        id: coach.id,
        firstName: coach.firstName,
        lastName: coach.lastName,
        photoUrl: coach.photoUrl,
        headline: coach.headline,
        bio: coach.bio,
        expertise: coach.expertise,
        sectors: coach.sectors,
        rating: coach.rating,
        reviewCount: coach._count.reviews,
        totalSessions: coach.totalSessions,
        sessionsCompleted: assignment.sessionsCompleted,
        upcomingSessionsCount,
        nextSession: nextSession
          ? {
              id: nextSession.id,
              title: nextSession.title,
              scheduledAt: nextSession.scheduledAt.toISOString(),
              duration: nextSession.duration,
              videoLink: nextSession.videoLink,
            }
          : null,
      },
    });
  } catch (error) {
    logger.error("Fetch my-coach error", { error: formatError(error), endpoint: "/api/my-coach" });
    return NextResponse.json(
      { error: "Failed to fetch coach" },
      { status: 500 }
    );
  }
}
