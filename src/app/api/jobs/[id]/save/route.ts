import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";

// POST - Save a job
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: jobId } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user's seeker profile
    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      include: { seekerProfile: true },
    });

    if (!account?.seekerProfile) {
      return NextResponse.json({ error: "Seeker profile not found" }, { status: 404 });
    }

    // Verify the job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Check if already saved
    const existing = await prisma.savedJob.findUnique({
      where: {
        seekerId_jobId: {
          seekerId: account.seekerProfile.id,
          jobId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: "Job already saved" }, { status: 409 });
    }

    // Parse optional notes from body
    let notes: string | undefined;
    try {
      const body = await request.json();
      notes = body.notes;
    } catch {
      // No body provided, that's fine
    }

    // Create saved job
    const savedJob = await prisma.savedJob.create({
      data: {
        seekerId: account.seekerProfile.id,
        jobId,
        notes,
      },
      include: {
        job: {
          select: {
            title: true,
            organization: { select: { name: true } },
          },
        },
      },
    });

    return NextResponse.json({
      message: "Job saved successfully",
      savedJob: {
        jobId: savedJob.jobId,
        savedAt: savedJob.savedAt,
        notes: savedJob.notes,
        jobTitle: savedJob.job.title,
        companyName: savedJob.job.organization.name,
      },
    });
  } catch (error) {
    console.error("Save job error:", error);
    return NextResponse.json({ error: "Failed to save job" }, { status: 500 });
  }
}

// DELETE - Unsave a job
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user's seeker profile
    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      include: { seekerProfile: true },
    });

    if (!account?.seekerProfile) {
      return NextResponse.json({ error: "Seeker profile not found" }, { status: 404 });
    }

    // Delete saved job
    await prisma.savedJob.delete({
      where: {
        seekerId_jobId: {
          seekerId: account.seekerProfile.id,
          jobId,
        },
      },
    });

    return NextResponse.json({ message: "Job unsaved successfully" });
  } catch (error) {
    // Handle case where job wasn't saved
    const prismaError = error as { code?: string };
    if (prismaError.code === "P2025") {
      return NextResponse.json({ error: "Job not in saved list" }, { status: 404 });
    }
    console.error("Unsave job error:", error);
    return NextResponse.json({ error: "Failed to unsave job" }, { status: 500 });
  }
}

// PATCH - Update notes on a saved job
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: jobId } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { notes } = body;

    // Get the user's seeker profile
    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      include: { seekerProfile: true },
    });

    if (!account?.seekerProfile) {
      return NextResponse.json({ error: "Seeker profile not found" }, { status: 404 });
    }

    // Update saved job notes
    const savedJob = await prisma.savedJob.update({
      where: {
        seekerId_jobId: {
          seekerId: account.seekerProfile.id,
          jobId,
        },
      },
      data: { notes },
    });

    return NextResponse.json({
      message: "Notes updated successfully",
      savedJob,
    });
  } catch (error) {
    const prismaError = error as { code?: string };
    if (prismaError.code === "P2025") {
      return NextResponse.json({ error: "Job not in saved list" }, { status: 404 });
    }
    console.error("Update saved job notes error:", error);
    return NextResponse.json({ error: "Failed to update notes" }, { status: 500 });
  }
}
