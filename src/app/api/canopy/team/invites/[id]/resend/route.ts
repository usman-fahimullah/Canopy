import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";
import { sendEmail, teamInviteEmail } from "@/lib/email";

/**
 * POST /api/canopy/team/invites/[id]/resend
 *
 * Resend a pending invite with a fresh token and extended expiry.
 * ADMIN only.
 */
export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const membership = await prisma.organizationMember.findFirst({
      where: {
        accountId: account.id,
        role: { in: ["ADMIN"] },
      },
      include: { organization: true },
    });
    if (!membership) {
      return NextResponse.json({ error: "Only admins can resend invites" }, { status: 403 });
    }

    const invite = await prisma.teamInvite.findUnique({ where: { id } });

    if (!invite || invite.organizationId !== membership.organizationId) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    if (invite.status !== "PENDING") {
      return NextResponse.json({ error: "Only pending invites can be resent" }, { status: 400 });
    }

    // Generate new token and extend expiry
    const newToken = randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.teamInvite.update({
      where: { id },
      data: { token: newToken, expiresAt },
    });

    // Send email (non-blocking)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const acceptUrl = `${appUrl}/invite/accept?token=${newToken}`;
    const inviterName = account.name || account.email;

    sendEmail(
      teamInviteEmail({
        recipientEmail: invite.email,
        inviterName,
        companyName: membership.organization.name,
        role: invite.role,
        acceptUrl,
      })
    ).catch((err) => {
      logger.error("Failed to resend invite email", {
        error: formatError(err),
        email: invite.email,
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Failed to resend invite", { error: formatError(error) });
    return NextResponse.json({ error: "Failed to resend invite" }, { status: 500 });
  }
}
