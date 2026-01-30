import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

// GET — get current coach's availability settings
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      include: { coachProfile: true },
    });

    if (!account?.coachProfile) {
      return NextResponse.json({ error: "Coach profile not found" }, { status: 404 });
    }

    const coach = account.coachProfile;

    return NextResponse.json({
      availability: coach.availability ? JSON.parse(coach.availability) : null,
      sessionDuration: coach.sessionDuration,
      bufferTime: coach.bufferTime,
      maxSessionsPerWeek: coach.maxSessionsPerWeek,
      videoLink: coach.videoLink,
    });
  } catch (error) {
    console.error("Fetch availability error:", error);
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 });
  }
}

// PUT — update coach's availability settings
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      include: { coachProfile: true },
    });

    if (!account?.coachProfile) {
      return NextResponse.json({ error: "Coach profile not found" }, { status: 404 });
    }

    const body = await request.json();
    const { availability, sessionDuration, bufferTime, maxSessionsPerWeek, videoLink } = body;

    const updateData: Record<string, unknown> = {};

    if (availability !== undefined) {
      updateData.availability = JSON.stringify(availability);
    }
    if (sessionDuration !== undefined) {
      updateData.sessionDuration = sessionDuration;
    }
    if (bufferTime !== undefined) {
      updateData.bufferTime = bufferTime;
    }
    if (maxSessionsPerWeek !== undefined) {
      updateData.maxSessionsPerWeek = maxSessionsPerWeek;
    }
    if (videoLink !== undefined) {
      updateData.videoLink = videoLink;
    }

    const updated = await prisma.coachProfile.update({
      where: { id: account.coachProfile.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      availability: updated.availability ? JSON.parse(updated.availability) : null,
      sessionDuration: updated.sessionDuration,
      bufferTime: updated.bufferTime,
      maxSessionsPerWeek: updated.maxSessionsPerWeek,
      videoLink: updated.videoLink,
    });
  } catch (error) {
    console.error("Update availability error:", error);
    return NextResponse.json({ error: "Failed to update availability" }, { status: 500 });
  }
}
