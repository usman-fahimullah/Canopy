import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

// PATCH — update coach-specific fields
export async function PATCH(request: NextRequest) {
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
    const {
      firstName, lastName, photoUrl, bio, headline,
      expertise, sectors, sessionTypes,
      yearsInClimate, sessionRate, sessionDuration,
      hourlyRate, monthlyRate, videoLink,
    } = body;

    const updateData: Record<string, unknown> = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (photoUrl !== undefined) updateData.photoUrl = photoUrl;
    if (bio !== undefined) updateData.bio = bio;
    if (headline !== undefined) updateData.headline = headline;
    if (expertise !== undefined) updateData.expertise = expertise;
    if (sectors !== undefined) updateData.sectors = sectors;
    if (sessionTypes !== undefined) updateData.sessionTypes = sessionTypes;
    if (yearsInClimate !== undefined) updateData.yearsInClimate = yearsInClimate;
    if (sessionRate !== undefined) updateData.sessionRate = sessionRate;
    if (sessionDuration !== undefined) updateData.sessionDuration = sessionDuration;
    if (hourlyRate !== undefined) updateData.hourlyRate = hourlyRate;
    if (monthlyRate !== undefined) updateData.monthlyRate = monthlyRate;
    if (videoLink !== undefined) updateData.videoLink = videoLink;

    const updated = await prisma.coachProfile.update({
      where: { id: account.coachProfile.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, coach: updated });
  } catch (error) {
    console.error("Update coach profile error:", error);
    return NextResponse.json(
      { error: "Failed to update coach profile" },
      { status: 500 }
    );
  }
}
