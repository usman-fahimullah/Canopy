import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { standardLimiter } from "@/lib/rate-limit";

// POST — request mentorship (creates MentorAssignment with status PENDING)
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success: rlSuccess } = await standardLimiter.check(5, `mentor-assign-post:${ip}`);
    if (!rlSuccess) {
      return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
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

    if (!account || !account.seekerProfile) {
      return NextResponse.json(
        { error: "Seeker profile required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { mentorProfileId, notes } = body;

    if (!mentorProfileId) {
      return NextResponse.json(
        { error: "Mentor profile ID is required" },
        { status: 400 }
      );
    }

    // Verify mentor exists and is actually a mentor
    const mentor = await prisma.seekerProfile.findUnique({
      where: { id: mentorProfileId },
    });

    if (!mentor || !mentor.isMentor) {
      return NextResponse.json(
        { error: "Mentor not found" },
        { status: 404 }
      );
    }

    // Can't mentor yourself
    if (mentor.id === account.seekerProfile.id) {
      return NextResponse.json(
        { error: "Cannot request mentorship from yourself" },
        { status: 400 }
      );
    }

    // Check for existing assignment
    const existing = await prisma.mentorAssignment.findUnique({
      where: {
        mentorId_menteeId: {
          mentorId: mentorProfileId,
          menteeId: account.seekerProfile.id,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Mentorship already exists", assignment: existing },
        { status: 409 }
      );
    }

    const assignment = await prisma.mentorAssignment.create({
      data: {
        mentorId: mentorProfileId,
        menteeId: account.seekerProfile.id,
        status: "PENDING",
        notes: notes || null,
      },
      include: {
        mentor: {
          include: { account: { select: { name: true, avatar: true } } },
        },
        mentee: {
          include: { account: { select: { name: true, avatar: true } } },
        },
      },
    });

    return NextResponse.json({ assignment }, { status: 201 });
  } catch (error) {
    console.error("Error creating mentor assignment:", error);
    return NextResponse.json(
      { error: "Failed to request mentorship" },
      { status: 500 }
    );
  }
}

// PATCH — mentor accepts/completes assignment
export async function PATCH(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success: rlSuccess } = await standardLimiter.check(10, `mentor-assign-patch:${ip}`);
    if (!rlSuccess) {
      return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
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

    if (!account || !account.seekerProfile) {
      return NextResponse.json(
        { error: "Seeker profile required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { assignmentId, status, notes } = body;

    if (!assignmentId || !status) {
      return NextResponse.json(
        { error: "Assignment ID and status are required" },
        { status: 400 }
      );
    }

    const validStatuses = ["ACTIVE", "PAUSED", "COMPLETED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Status must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const assignment = await prisma.mentorAssignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );
    }

    // Only the mentor can accept (PENDING → ACTIVE) or complete
    const isMentor = assignment.mentorId === account.seekerProfile.id;
    const isMentee = assignment.menteeId === account.seekerProfile.id;

    if (!isMentor && !isMentee) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Only mentor can accept a PENDING request
    if (assignment.status === "PENDING" && status === "ACTIVE" && !isMentor) {
      return NextResponse.json(
        { error: "Only the mentor can accept a request" },
        { status: 403 }
      );
    }

    const updateData: Record<string, unknown> = { status };
    if (status === "COMPLETED") {
      updateData.endedAt = new Date();
    }
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const updated = await prisma.mentorAssignment.update({
      where: { id: assignmentId },
      data: updateData,
      include: {
        mentor: {
          include: { account: { select: { name: true, avatar: true } } },
        },
        mentee: {
          include: { account: { select: { name: true, avatar: true } } },
        },
      },
    });

    return NextResponse.json({ assignment: updated });
  } catch (error) {
    console.error("Error updating mentor assignment:", error);
    return NextResponse.json(
      { error: "Failed to update mentorship" },
      { status: 500 }
    );
  }
}
