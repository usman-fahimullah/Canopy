import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import {
  getAuthenticatedAccount,
  isAdminAccount,
  unauthorizedResponse,
  forbiddenResponse,
} from "@/lib/auth-helpers";
import { logger, formatError } from "@/lib/logger";
import { standardLimiter } from "@/lib/rate-limit";
import { createCoachStatusNotification } from "@/lib/notifications";
import { safeJsonParse } from "@/lib/safe-json";
import { createAuditLog } from "@/lib/audit";

const rejectBodySchema = z.object({
  reason: z.string().max(2000).optional().default(""),
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Rate limit: 10 admin actions per minute per IP
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = await standardLimiter.check(10, `admin-reject:${ip}`);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429 }
      );
    }

    const { id } = await params;

    const account = await getAuthenticatedAccount();
    if (!account) return unauthorizedResponse();
    if (!isAdminAccount(account)) return forbiddenResponse();

    // Parse and validate optional rejection reason
    let rejectionReason = "";
    try {
      const rawBody = await request.json();
      const parsed = rejectBodySchema.safeParse(rawBody);
      if (parsed.success) {
        rejectionReason = parsed.data.reason || "";
      }
    } catch {
      // No body provided — rejection reason is optional
    }

    // Get the coach profile
    const coach = await prisma.coachProfile.findUnique({
      where: { id },
      include: {
        account: true,
      },
    });

    if (!coach) {
      return NextResponse.json({ error: "Coach not found" }, { status: 404 });
    }

    if (coach.status !== "PENDING") {
      return NextResponse.json({ error: "Coach is not in pending status" }, { status: 400 });
    }

    // Update coach status to REJECTED
    const existingAvailability = safeJsonParse<Record<string, unknown>>(coach.availability, {});
    const updatedCoach = await prisma.coachProfile.update({
      where: { id },
      data: {
        status: "REJECTED",
        availability: JSON.stringify({
          ...existingAvailability,
          rejectionReason,
          rejectedAt: new Date().toISOString(),
        }),
      },
    });

    // Audit log: track admin rejection
    await createAuditLog({
      action: "REJECT",
      entityType: "CoachProfile",
      entityId: id,
      userId: account.id,
      changes: { status: { from: coach.status, to: "REJECTED" } },
      metadata: { reason: rejectionReason, ip },
    });

    await createCoachStatusNotification({
      accountId: coach.account.id,
      status: "REJECTED",
      coachName: coach.firstName || coach.account.name || "Coach",
      email: coach.account.email,
    }).catch((err) => {
      logger.error("Failed to send rejection notification", {
        error: formatError(err),
        endpoint: "/api/admin/coaches/[id]/reject",
      });
    });

    return NextResponse.json({
      success: true,
      coach: updatedCoach,
      message: "Coach rejected",
    });
  } catch (error) {
    logger.error("Reject coach error", {
      error: formatError(error),
      endpoint: "/api/admin/coaches/[id]/reject",
    });
    return NextResponse.json({ error: "Failed to reject coach" }, { status: 500 });
  }
}
