import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { createAuditLog } from "@/lib/audit";

/**
 * POST /api/canopy/offers/[id]/withdraw
 * Withdraw an offer before it's signed.
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const offer = await prisma.offerRecord.findUnique({
      where: { id },
      select: { id: true, status: true, organizationId: true, applicationId: true },
    });

    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    if (offer.status === "SIGNED" || offer.status === "WITHDRAWN") {
      return NextResponse.json(
        { error: `Cannot withdraw an offer in ${offer.status} status` },
        { status: 400 }
      );
    }

    const membership = await prisma.organizationMember.findFirst({
      where: {
        accountId: account.id,
        organizationId: offer.organizationId,
        role: { in: ["OWNER", "ADMIN", "RECRUITER"] },
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const previousStatus = offer.status;

    await prisma.$transaction(async (tx) => {
      await tx.offerRecord.update({
        where: { id },
        data: {
          status: "WITHDRAWN",
          withdrawnAt: new Date(),
        },
      });

      // Move application back to screening stage
      await tx.application.update({
        where: { id: offer.applicationId },
        data: { stage: "screening" },
      });
    });

    await createAuditLog({
      action: "UPDATE",
      entityType: "OfferRecord",
      entityId: id,
      userId: account.id,
      changes: { status: { from: previousStatus, to: "WITHDRAWN" } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error withdrawing offer", {
      error: formatError(error),
      endpoint: "/api/canopy/offers/[id]/withdraw",
    });
    return NextResponse.json({ error: "Failed to withdraw offer" }, { status: 500 });
  }
}
