import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";

/**
 * DELETE /api/canopy/team/invites/[id]
 *
 * Revoke a pending invite. ADMIN only.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    });
    if (!membership) {
      return NextResponse.json({ error: "Only admins can revoke invites" }, { status: 403 });
    }

    const invite = await prisma.teamInvite.findUnique({ where: { id } });

    if (!invite || invite.organizationId !== membership.organizationId) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    if (invite.status !== "PENDING") {
      return NextResponse.json({ error: "Only pending invites can be revoked" }, { status: 400 });
    }

    await prisma.teamInvite.update({
      where: { id },
      data: { status: "REVOKED" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Failed to revoke invite", { error: formatError(error) });
    return NextResponse.json({ error: "Failed to revoke invite" }, { status: 500 });
  }
}
