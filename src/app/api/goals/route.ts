import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";
import { CreateGoalSchema } from "@/lib/validators/api";

// GET — list seeker's goals with milestones
export async function GET() {
  try {
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

    const goals = await prisma.goal.findMany({
      where: { seekerId: account.seekerProfile.id },
      include: {
        milestones: { orderBy: { order: "asc" } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ goals });
  } catch (error) {
    logger.error("Fetch goals error", { error: formatError(error), endpoint: "/api/goals" });
    return NextResponse.json(
      { error: "Failed to fetch goals" },
      { status: 500 }
    );
  }
}

// POST — create new goal
export async function POST(request: NextRequest) {
  try {
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

    const body = await request.json();
    const result = CreateGoalSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }
    const { title, description, icon, targetDate, milestones } = result.data;

    const goal = await prisma.goal.create({
      data: {
        seekerId: account.seekerProfile.id,
        title: title.trim(),
        description: description || null,
        icon: icon || null,
        targetDate: targetDate ? new Date(targetDate) : null,
        milestones: milestones && milestones.length > 0 ? {
          create: milestones.map((m: { title: string }, i: number) => ({
            title: m.title,
            order: i,
          })),
        } : undefined,
      },
      include: { milestones: true },
    });

    return NextResponse.json({ goal }, { status: 201 });
  } catch (error) {
    logger.error("Create goal error", { error: formatError(error), endpoint: "/api/goals" });
    return NextResponse.json(
      { error: "Failed to create goal" },
      { status: 500 }
    );
  }
}
