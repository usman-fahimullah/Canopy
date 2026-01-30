import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check authentication
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // TODO: Add proper admin role check

    // Get optional rejection reason from body
    let rejectionReason = "";
    try {
      const body = await request.json();
      rejectionReason = body.reason || "";
    } catch {
      // No body provided, that's fine
    }

    // Get the coach profile
    const coach = await prisma.coachProfile.findUnique({
      where: { id },
      include: {
        account: true,
      },
    });

    if (!coach) {
      return NextResponse.json(
        { error: "Coach not found" },
        { status: 404 }
      );
    }

    if (coach.status !== "PENDING") {
      return NextResponse.json(
        { error: "Coach is not in pending status" },
        { status: 400 }
      );
    }

    // Update coach status to REJECTED
    const updatedCoach = await prisma.coachProfile.update({
      where: { id },
      data: {
        status: "REJECTED",
        // Store rejection reason in availability JSON field for now
        availability: JSON.stringify({
          ...JSON.parse(coach.availability || "{}"),
          rejectionReason,
          rejectedAt: new Date().toISOString(),
        }),
      },
    });

    // TODO: Send rejection email to coach (optional, be kind)
    // await sendRejectionEmail(coach.account.email, coach.firstName, rejectionReason);

    return NextResponse.json({
      success: true,
      coach: updatedCoach,
      message: "Coach rejected",
    });
  } catch (error) {
    console.error("Reject coach error:", error);
    return NextResponse.json(
      { error: "Failed to reject coach" },
      { status: 500 }
    );
  }
}
