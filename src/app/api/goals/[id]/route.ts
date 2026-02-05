import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";
import { standardLimiter } from "@/lib/rate-limit";
import { UpdateGoalSchema, AddMilestoneSchema } from "@/lib/validators/api";

// PATCH — update goal (title, progress, status)
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Rate limit: 20 goal updates per minute per IP
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = await standardLimiter.check(20, `goals-update:${ip}`);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429 }
      );
    }

    const { id: goalId } = await params;
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

    const goal = await prisma.goal.findUnique({
      where: { id: goalId },
    });

    if (!goal || goal.seekerId !== account.seekerProfile.id) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    const body = await request.json();
    const result = UpdateGoalSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }
    const { title, description, progress, status, icon, category, targetDate } = result.data;

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (icon !== undefined) updateData.icon = icon;
    if (category !== undefined) updateData.category = category;
    if (targetDate !== undefined) updateData.targetDate = targetDate ? new Date(targetDate) : null;
    if (progress !== undefined) updateData.progress = Math.min(100, Math.max(0, progress));
    if (status !== undefined) {
      updateData.status = status;
      if (status === "COMPLETED") {
        updateData.completedAt = new Date();
        updateData.progress = 100;
      }
    }

    const updated = await prisma.goal.update({
      where: { id: goalId },
      data: updateData,
      include: { milestones: { orderBy: { order: "asc" } } },
    });

    return NextResponse.json({ goal: updated });
  } catch (error) {
    logger.error("Update goal error", { error: formatError(error), endpoint: "/api/goals/[id]" });
    return NextResponse.json({ error: "Failed to update goal" }, { status: 500 });
  }
}

// POST — add milestone to goal
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Rate limit: 10 milestone creates per minute per IP
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = await standardLimiter.check(10, `milestone-create:${ip}`);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429 }
      );
    }

    const { id: goalId } = await params;
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

    const goal = await prisma.goal.findUnique({
      where: { id: goalId },
      include: { milestones: true },
    });

    if (!goal || goal.seekerId !== account.seekerProfile.id) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    const body = await request.json();
    const milestoneResult = AddMilestoneSchema.safeParse(body);
    if (!milestoneResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: milestoneResult.error.flatten() },
        { status: 422 }
      );
    }
    const { title } = milestoneResult.data;

    const milestone = await prisma.milestone.create({
      data: {
        goalId,
        title: title.trim(),
        order: goal.milestones.length,
      },
    });

    return NextResponse.json({ milestone }, { status: 201 });
  } catch (error) {
    logger.error("Add milestone error", { error: formatError(error), endpoint: "/api/goals/[id]" });
    return NextResponse.json({ error: "Failed to add milestone" }, { status: 500 });
  }
}
