import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";
import { standardLimiter } from "@/lib/rate-limit";
import { CreateGoalSchema } from "@/lib/validators/api";

// GET — list seeker's goals with milestones
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

    const goalsRaw = await prisma.goal.findMany({
      where: { seekerId: account.seekerProfile.id },
      include: {
        milestones: { orderBy: { order: "asc" } },
        application: {
          select: {
            id: true,
            job: {
              select: {
                id: true,
                title: true,
                organization: { select: { name: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    // Parse milestone resources JSON
    const goals = goalsRaw.map((goal) => ({
      ...goal,
      milestones: goal.milestones.map((m) => ({
        ...m,
        resources: m.resources ? JSON.parse(m.resources) : null,
      })),
    }));

    return NextResponse.json({ goals });
  } catch (error) {
    logger.error("Fetch goals error", { error: formatError(error), endpoint: "/api/goals" });
    return NextResponse.json({ error: "Failed to fetch goals" }, { status: 500 });
  }
}

// POST — create new goal
export async function POST(request: NextRequest) {
  try {
    // Rate limit: 10 goal creates per minute per IP
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = await standardLimiter.check(10, `goals-create:${ip}`);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429 }
      );
    }

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

    const body = await request.json();
    const result = CreateGoalSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }
    const { title, description, icon, category, targetDate, applicationId, milestones } =
      result.data;

    // Validate applicationId belongs to this seeker if provided
    if (applicationId) {
      const application = await prisma.application.findFirst({
        where: { id: applicationId, seekerId: account.seekerProfile.id },
      });
      if (!application) {
        return NextResponse.json(
          { error: "Application not found or doesn't belong to you" },
          { status: 404 }
        );
      }
    }

    const goalRaw = await prisma.goal.create({
      data: {
        seekerId: account.seekerProfile.id,
        title: title.trim(),
        description: description || null,
        icon: icon || null,
        category: category || null,
        targetDate: targetDate ? new Date(targetDate) : null,
        applicationId: applicationId || null,
        milestones:
          milestones && milestones.length > 0
            ? {
                create: milestones.map((m: { title: string }, i: number) => ({
                  title: m.title,
                  order: i,
                })),
              }
            : undefined,
      },
      include: {
        milestones: true,
        application: {
          select: {
            id: true,
            job: {
              select: {
                id: true,
                title: true,
                organization: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    // Parse milestone resources JSON
    const goal = {
      ...goalRaw,
      milestones: goalRaw.milestones.map((m) => ({
        ...m,
        resources: m.resources ? JSON.parse(m.resources) : null,
      })),
    };

    return NextResponse.json({ goal }, { status: 201 });
  } catch (error) {
    logger.error("Create goal error", { error: formatError(error), endpoint: "/api/goals" });
    return NextResponse.json({ error: "Failed to create goal" }, { status: 500 });
  }
}
