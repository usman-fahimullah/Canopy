import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthenticatedAccount, isAdminAccount, unauthorizedResponse, forbiddenResponse } from "@/lib/auth-helpers";
import { logger, formatError } from "@/lib/logger";
import { createCoachStatusNotification } from "@/lib/notifications";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const account = await getAuthenticatedAccount();
    if (!account) return unauthorizedResponse();
    if (!isAdminAccount(account)) return forbiddenResponse();

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

    await createCoachStatusNotification({
      accountId: coach.account.id,
      status: "APPROVED",
      coachName: coach.firstName || coach.account.name || "Coach",
      email: coach.account.email,
    }).catch((err) => {
      logger.error("Failed to send approval notification", { error: formatError(err), endpoint: "/api/admin/coaches/[id]/approve" });
    });

    return NextResponse.json({
      success: true,
      coach: updatedCoach,
      message: "Coach approved successfully",
    });
  } catch (error) {
    logger.error("Approve coach error", { error: formatError(error), endpoint: "/api/admin/coaches/[id]/approve" });
    return NextResponse.json(
      { error: "Failed to approve coach" },
      { status: 500 }
    );
  }
}
