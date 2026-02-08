import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";

/**
 * POST /api/jobs/offers/[id]/view
 * Record that the candidate viewed the offer. Updates viewedAt and status.
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
      include: {
        application: {
          include: {
            seeker: { select: { accountId: true } },
          },
        },
        organization: { select: { id: true } },
      },
    });

    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    // Only the candidate can mark as viewed
    if (offer.application.seeker.accountId !== account.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Only update if not already viewed (idempotent)
    if (offer.status === "SENT") {
      const now = new Date();

      await prisma.$transaction(async (tx) => {
        await tx.offerRecord.update({
          where: { id },
          data: {
            status: "VIEWED",
            viewedAt: now,
          },
        });

        // Notify employer that candidate viewed the offer
        // Find org members to notify
        const orgMembers = await tx.organizationMember.findMany({
          where: {
            organizationId: offer.organization.id,
            role: { in: ["ADMIN", "RECRUITER"] },
          },
          select: { accountId: true },
        });

        if (orgMembers.length > 0) {
          await tx.notification.createMany({
            data: orgMembers.map((m) => ({
              accountId: m.accountId,
              type: "OFFER_VIEWED" as const,
              title: "Candidate viewed your offer",
              body: `The candidate has viewed the offer letter.`,
              data: JSON.stringify({
                link: `/canopy/roles/${offer.application.jobId}/applications/${offer.applicationId}`,
              }),
            })),
          });
        }
      });

      return NextResponse.json({ success: true, viewedAt: now.toISOString() });
    }

    // Already viewed or further along — no-op
    return NextResponse.json({ success: true, viewedAt: offer.viewedAt?.toISOString() || null });
  } catch (error) {
    logger.error("Error recording offer view", {
      error: formatError(error),
      endpoint: "/api/jobs/offers/[id]/view",
    });
    return NextResponse.json({ error: "Failed to record view" }, { status: 500 });
  }
}
