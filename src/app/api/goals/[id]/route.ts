import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

// PATCH — update goal (title, progress, status)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: goalId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

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
    const { title, description, progress, status, icon, targetDate } = body;

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (icon !== undefined) updateData.icon = icon;
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
    console.error("Update goal error:", error);
    return NextResponse.json(
      { error: "Failed to update goal" },
      { status: 500 }
    );
  }
}

// POST — add milestone to goal
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: goalId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

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
    const { title } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const milestone = await prisma.milestone.create({
      data: {
        goalId,
        title: title.trim(),
        order: goal.milestones.length,
      },
    });

    return NextResponse.json({ milestone }, { status: 201 });
  } catch (error) {
    console.error("Add milestone error:", error);
    return NextResponse.json(
      { error: "Failed to add milestone" },
      { status: 500 }
    );
  }
}
