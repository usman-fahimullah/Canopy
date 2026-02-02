import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";
import { CreateExperienceSchema } from "@/lib/validators/api";

// GET — list experiences for current user
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

    const experiences = await prisma.workExperience.findMany({
      where: { seekerId: account.seekerProfile.id },
      orderBy: { startDate: "desc" },
      take: 100,
    });

    return NextResponse.json({ experiences });
  } catch (error) {
    logger.error("Fetch experiences error", { error: formatError(error), endpoint: "/api/experience" });
    return NextResponse.json(
      { error: "Failed to fetch experiences" },
      { status: 500 }
    );
  }
}

// POST — create new experience
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
    const result = CreateExperienceSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }
    const {
      companyName,
      jobTitle,
      employmentType,
      workType,
      startDate,
      endDate,
      isCurrent,
      description,
      skills,
    } = result.data;

    const experience = await prisma.workExperience.create({
      data: {
        seekerId: account.seekerProfile.id,
        companyName: companyName.trim(),
        jobTitle: jobTitle.trim(),
        employmentType: (employmentType || "FULL_TIME") as "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP",
        workType: (workType || "ONSITE") as "ONSITE" | "REMOTE" | "HYBRID",
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isCurrent: !!isCurrent,
        description: description?.trim() || null,
        skills: skills || [],
      },
    });

    return NextResponse.json({ experience }, { status: 201 });
  } catch (error) {
    logger.error("Create experience error", { error: formatError(error), endpoint: "/api/experience" });
    return NextResponse.json(
      { error: "Failed to create experience" },
      { status: 500 }
    );
  }
}
