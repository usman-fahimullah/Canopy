import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";
import { standardLimiter } from "@/lib/rate-limit";

type Params = { params: Promise<{ id: string; milestoneId: string }> };

// PATCH — toggle milestone completion
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = await standardLimiter.check(30, `milestone-toggle:${ip}`);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429 }
      );
    }

    const { id: goalId, milestoneId } = await params;
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

    // Verify goal ownership
    const goal = await prisma.goal.findUnique({
      where: { id: goalId },
      include: { milestones: true },
    });

    if (!goal || goal.seekerId !== account.seekerProfile.id) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    const milestone = goal.milestones.find((m) => m.id === milestoneId);
    if (!milestone) {
      return NextResponse.json({ error: "Milestone not found" }, { status: 404 });
    }

    // Toggle completion
    const nowCompleted = !milestone.completed;
    const updatedMilestone = await prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        completed: nowCompleted,
        completedAt: nowCompleted ? new Date() : null,
      },
    });

    // Recalculate goal progress based on milestone completion
    const totalMilestones = goal.milestones.length;
    const completedCount =
      goal.milestones.filter((m) => m.id !== milestoneId && m.completed).length +
      (nowCompleted ? 1 : 0);
    const newProgress =
      totalMilestones > 0 ? Math.round((completedCount / totalMilestones) * 100) : 0;

    await prisma.goal.update({
      where: { id: goalId },
      data: { progress: newProgress },
    });

    return NextResponse.json({ milestone: updatedMilestone, goalProgress: newProgress });
  } catch (error) {
    logger.error("Toggle milestone error", {
      error: formatError(error),
      endpoint: "/api/goals/[id]/milestones/[milestoneId]",
    });
    return NextResponse.json({ error: "Failed to update milestone" }, { status: 500 });
  }
}

// DELETE — remove milestone from goal
export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id: goalId, milestoneId } = await params;
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

    // Verify goal ownership
    const goal = await prisma.goal.findUnique({
      where: { id: goalId },
      include: { milestones: true },
    });

    if (!goal || goal.seekerId !== account.seekerProfile.id) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    const milestone = goal.milestones.find((m) => m.id === milestoneId);
    if (!milestone) {
      return NextResponse.json({ error: "Milestone not found" }, { status: 404 });
    }

    await prisma.milestone.delete({ where: { id: milestoneId } });

    // Recalculate goal progress
    const remaining = goal.milestones.filter((m) => m.id !== milestoneId);
    const completedCount = remaining.filter((m) => m.completed).length;
    const newProgress =
      remaining.length > 0 ? Math.round((completedCount / remaining.length) * 100) : 0;

    await prisma.goal.update({
      where: { id: goalId },
      data: { progress: newProgress },
    });

    return NextResponse.json({ success: true, goalProgress: newProgress });
  } catch (error) {
    logger.error("Delete milestone error", {
      error: formatError(error),
      endpoint: "/api/goals/[id]/milestones/[milestoneId]",
    });
    return NextResponse.json({ error: "Failed to delete milestone" }, { status: 500 });
  }
}
