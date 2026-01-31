import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

// PATCH — update experience
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Verify ownership
    const experience = await prisma.workExperience.findUnique({
      where: { id: params.id },
    });

    if (!experience || experience.seekerId !== account.seekerProfile.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
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

    // Build update object
    const updateData: Record<string, unknown> = {};

    if (companyName !== undefined) {
      if (!companyName?.trim()) {
        return NextResponse.json({ error: "Company name is required" }, { status: 400 });
      }
      updateData.companyName = companyName.trim();
    }

    if (jobTitle !== undefined) {
      if (!jobTitle?.trim()) {
        return NextResponse.json({ error: "Job title is required" }, { status: 400 });
      }
      updateData.jobTitle = jobTitle.trim();
    }

    if (employmentType !== undefined) updateData.employmentType = employmentType;
    if (workType !== undefined) updateData.workType = workType;
    if (startDate !== undefined) updateData.startDate = new Date(startDate);
    if (isCurrent !== undefined) updateData.isCurrent = !!isCurrent;

    if (endDate !== undefined) {
      updateData.endDate = endDate ? new Date(endDate) : null;
    }

    if (description !== undefined) {
      updateData.description = description?.trim() || null;
    }

    if (skills !== undefined) {
      updateData.skills = skills;
    }

    const updated = await prisma.workExperience.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({ experience: updated });
  } catch (error) {
    console.error("Update experience error:", error);
    return NextResponse.json(
      { error: "Failed to update experience" },
      { status: 500 }
    );
  }
}

// DELETE — delete experience
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Verify ownership
    const experience = await prisma.workExperience.findUnique({
      where: { id: params.id },
    });

    if (!experience || experience.seekerId !== account.seekerProfile.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.workExperience.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete experience error:", error);
    return NextResponse.json(
      { error: "Failed to delete experience" },
      { status: 500 }
    );
  }
}
