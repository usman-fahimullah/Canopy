import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { readLimiter, standardLimiter } from "@/lib/rate-limit";

// GET — list experiences for current user
export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success: rlSuccess } = await readLimiter.check(20, `experience-get:${ip}`);
    if (!rlSuccess) {
      return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
    }

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
    });

    return NextResponse.json({ experiences });
  } catch (error) {
    console.error("Fetch experiences error:", error);
    return NextResponse.json(
      { error: "Failed to fetch experiences" },
      { status: 500 }
    );
  }
}

// POST — create new experience
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success: rlSuccess } = await standardLimiter.check(10, `experience-post:${ip}`);
    if (!rlSuccess) {
      return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
    }

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
    } = body;

    // Validation
    if (!companyName?.trim()) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 });
    }
    if (!jobTitle?.trim()) {
      return NextResponse.json({ error: "Job title is required" }, { status: 400 });
    }
    if (!startDate) {
      return NextResponse.json({ error: "Start date is required" }, { status: 400 });
    }
    if (!isCurrent && !endDate) {
      return NextResponse.json({ error: "End date is required when not current" }, { status: 400 });
    }

    const experience = await prisma.workExperience.create({
      data: {
        seekerId: account.seekerProfile.id,
        companyName: companyName.trim(),
        jobTitle: jobTitle.trim(),
        employmentType,
        workType,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isCurrent: !!isCurrent,
        description: description?.trim() || null,
        skills: skills || [],
      },
    });

    return NextResponse.json({ experience }, { status: 201 });
  } catch (error) {
    console.error("Create experience error:", error);
    return NextResponse.json(
      { error: "Failed to create experience" },
      { status: 500 }
    );
  }
}
