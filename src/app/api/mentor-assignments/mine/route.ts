import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

// GET — fetch current user's mentor assignments (as mentor or mentee)
export async function GET(request: NextRequest) {
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
      include: { seekerProfile: { select: { id: true } } },
    });

    if (!account || !account.seekerProfile) {
      return NextResponse.json(
        { error: "Seeker profile required" },
        { status: 403 }
      );
    }

    const seekerProfileId = account.seekerProfile.id;
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role"); // "mentee" = show my mentors, "mentor" = show my mentees

    if (role === "mentee") {
      // Current user is the mentee — show their mentors
      const assignments = await prisma.mentorAssignment.findMany({
        where: { menteeId: seekerProfileId },
        include: {
          mentor: {
            include: {
              account: {
                select: { id: true, name: true, avatar: true },
              },
            },
          },
        },
        orderBy: { startedAt: "desc" },
      });

      const result = assignments.map((a) => ({
        id: a.mentor.id,
        assignmentId: a.id,
        name: a.mentor.account.name || "Anonymous",
        avatar: a.mentor.account.avatar,
        role: a.mentor.headline || "Climate Professional",
        specialty: a.mentor.mentorSpecialty || null,
        status: a.status,
        startedAt: a.startedAt.toISOString(),
        accountId: a.mentor.account.id,
      }));

      return NextResponse.json({ assignments: result });
    }

    if (role === "mentor") {
      // Current user is the mentor — show their mentees
      const assignments = await prisma.mentorAssignment.findMany({
        where: { mentorId: seekerProfileId },
        include: {
          mentee: {
            include: {
              account: {
                select: { id: true, name: true, avatar: true },
              },
            },
          },
        },
        orderBy: { startedAt: "desc" },
      });

      const result = assignments.map((a) => ({
        id: a.mentee.id,
        assignmentId: a.id,
        name: a.mentee.account.name || "Anonymous",
        avatar: a.mentee.account.avatar,
        goal: a.mentee.headline || null,
        status: a.status,
        startedAt: a.startedAt.toISOString(),
        accountId: a.mentee.account.id,
      }));

      return NextResponse.json({ assignments: result });
    }

    return NextResponse.json(
      { error: 'Query parameter "role" must be "mentee" or "mentor"' },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error fetching mentor assignments:", error);
    return NextResponse.json(
      { error: "Failed to fetch assignments" },
      { status: 500 }
    );
  }
}
