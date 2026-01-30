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
    // For now, allow any authenticated user

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

    // Update coach status to APPROVED
    const updatedCoach = await prisma.coachProfile.update({
      where: { id },
      data: {
        status: "APPROVED",
        approvalDate: new Date(),
      },
    });

    // TODO: Send approval email to coach
    // await sendApprovalEmail(coach.account.email, coach.firstName);

    return NextResponse.json({
      success: true,
      coach: updatedCoach,
      message: "Coach approved successfully",
    });
  } catch (error) {
    console.error("Approve coach error:", error);
    return NextResponse.json(
      { error: "Failed to approve coach" },
      { status: 500 }
    );
  }
}
