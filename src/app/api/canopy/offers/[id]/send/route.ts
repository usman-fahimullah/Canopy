import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { createAuditLog } from "@/lib/audit";

/**
 * POST /api/canopy/offers/[id]/send
 * Send the offer to the candidate. Transitions DRAFT → SENT.
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
            seeker: {
              include: {
                account: { select: { id: true, name: true, email: true } },
              },
            },
            job: { select: { title: true } },
          },
        },
        organization: { select: { id: true, name: true, logo: true } },
      },
    });

    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    if (offer.status !== "DRAFT") {
      return NextResponse.json(
        { error: `Cannot send offer in ${offer.status} status. Only DRAFT offers can be sent.` },
        { status: 400 }
      );
    }

    // Verify org membership
    const membership = await prisma.organizationMember.findFirst({
      where: {
        accountId: account.id,
        organizationId: offer.organizationId,
        role: { in: ["ADMIN", "RECRUITER"] },
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const now = new Date();

    // Update offer status + create notification in a transaction
    await prisma.$transaction(async (tx) => {
      await tx.offerRecord.update({
        where: { id },
        data: {
          status: "SENT",
          sentAt: now,
        },
      });

      // Create in-app notification for the candidate
      await tx.notification.create({
        data: {
          accountId: offer.application.seeker.account.id,
          type: "OFFER_RECEIVED",
          title: `${offer.organization.name} has extended you an offer`,
          body: `You've received an offer for ${offer.application.job.title}. View the details to learn more.`,
          data: JSON.stringify({ link: `/jobs/applications/${offer.applicationId}/offer` }),
        },
      });
    });

    // Send email via Resend (fire-and-forget)
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      const candidateEmail = offer.application.seeker.account.email;
      const candidateName = offer.application.seeker.account.name || "there";
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://canopy.green";

      await resend.emails.send({
        from: `${offer.organization.name} via Canopy <offers@${process.env.RESEND_DOMAIN || "updates.canopy.green"}>`,
        to: candidateEmail,
        subject: `${offer.organization.name} has extended you an offer`,
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Congratulations, ${candidateName}!</h2>
            <p>${offer.organization.name} has extended you an offer for the <strong>${offer.application.job.title}</strong> position.</p>
            <p>View the full offer details and next steps in Canopy:</p>
            <p style="text-align: center; margin: 24px 0;">
              <a href="${appUrl}/jobs/applications/${offer.applicationId}/offer"
                 style="display: inline-block; padding: 12px 24px; background: #0F766E; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
                View Your Offer
              </a>
            </p>
            <p style="color: #666; font-size: 14px;">This email was sent via Canopy on behalf of ${offer.organization.name}.</p>
          </div>
        `,
      });
    } catch (emailError) {
      logger.error("Failed to send offer email", {
        error: formatError(emailError),
        offerId: id,
        endpoint: "/api/canopy/offers/[id]/send",
      });
      // Don't fail the request — the offer was still sent in-app
    }

    await createAuditLog({
      action: "UPDATE",
      entityType: "OfferRecord",
      entityId: id,
      userId: account.id,
      changes: { status: { from: "DRAFT", to: "SENT" } },
      metadata: {
        candidateEmail: offer.application.seeker.account.email,
        jobTitle: offer.application.job.title,
      },
    });

    logger.info("Offer sent", {
      offerId: id,
      applicationId: offer.applicationId,
      endpoint: "/api/canopy/offers/[id]/send",
    });

    return NextResponse.json({ success: true, sentAt: now.toISOString() });
  } catch (error) {
    logger.error("Error sending offer", {
      error: formatError(error),
      endpoint: "/api/canopy/offers/[id]/send",
    });
    return NextResponse.json({ error: "Failed to send offer" }, { status: 500 });
  }
}
