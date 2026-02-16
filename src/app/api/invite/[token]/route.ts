import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";
import { standardLimiter } from "@/lib/rate-limit";

interface RouteContext {
  params: Promise<{ token: string }>;
}

// GET — Validate invite token and return invite details
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // Rate limit: 5 token lookups per minute per IP to prevent enumeration
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = await standardLimiter.check(5, `invite-token:${ip}`);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429 }
      );
    }

    const { token } = await context.params;

    const invite = await prisma.teamInvite.findUnique({
      where: { token },
      include: {
        organization: {
          select: { id: true, name: true, logo: true, description: true },
        },
        invitedBy: {
          select: { name: true, email: true },
        },
      },
    });

    if (!invite) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    if (invite.status !== "PENDING") {
      return NextResponse.json(
        { error: `Invitation has already been ${invite.status.toLowerCase()}` },
        { status: 410 }
      );
    }

    if (new Date() > invite.expiresAt) {
      // Mark as expired
      await prisma.teamInvite.update({
        where: { id: invite.id },
        data: { status: "EXPIRED" },
      });
      return NextResponse.json({ error: "Invitation has expired" }, { status: 410 });
    }

    return NextResponse.json({
      invite: {
        id: invite.id,
        email: invite.email,
        role: invite.role,
        expiresAt: invite.expiresAt.toISOString(),
        organization: invite.organization,
        invitedBy: {
          name: invite.invitedBy.name || invite.invitedBy.email,
        },
      },
    });
  } catch (error) {
    logger.error("Invite GET error", {
      error: formatError(error),
      endpoint: "/api/invite/[token]",
    });
    return NextResponse.json({ error: "Failed to validate invitation" }, { status: 500 });
  }
}

// POST — Accept invite (requires authentication)
export async function POST(_request: NextRequest, context: RouteContext) {
  try {
    const { token } = await context.params;

    // Require authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized — sign in or create an account first" },
        { status: 401 }
      );
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const invite = await prisma.teamInvite.findUnique({
      where: { token },
      include: {
        organization: { select: { id: true, name: true } },
      },
    });

    if (!invite) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    if (invite.status !== "PENDING") {
      return NextResponse.json(
        { error: `Invitation has already been ${invite.status.toLowerCase()}` },
        { status: 410 }
      );
    }

    if (new Date() > invite.expiresAt) {
      await prisma.teamInvite.update({
        where: { id: invite.id },
        data: { status: "EXPIRED" },
      });
      return NextResponse.json({ error: "Invitation has expired" }, { status: 410 });
    }

    // Check if user is already a member of this organization
    const existingMember = await prisma.organizationMember.findFirst({
      where: {
        accountId: account.id,
        organizationId: invite.organizationId,
      },
    });

    if (existingMember) {
      // Mark invite as accepted even if already a member
      await prisma.teamInvite.update({
        where: { id: invite.id },
        data: { status: "ACCEPTED", acceptedAt: new Date() },
      });
      return NextResponse.json({
        success: true,
        message: "You are already a member of this organization",
        organizationId: invite.organizationId,
      });
    }

    // Accept: create org membership + mark invite as accepted in a transaction
    const updatedRoles = account.activeRoles.includes("employer")
      ? account.activeRoles
      : [...account.activeRoles, "employer"];

    await prisma.$transaction([
      prisma.organizationMember.create({
        data: {
          accountId: account.id,
          organizationId: invite.organizationId,
          role: invite.role,
          departmentId: invite.departmentId ?? undefined,
        },
      }),
      prisma.teamInvite.update({
        where: { id: invite.id },
        data: { status: "ACCEPTED", acceptedAt: new Date() },
      }),
      prisma.account.update({
        where: { id: account.id },
        data: { activeRoles: updatedRoles },
      }),
    ]);

    return NextResponse.json({
      success: true,
      organizationId: invite.organizationId,
      organizationName: invite.organization.name,
      role: invite.role,
    });
  } catch (error) {
    logger.error("Invite POST error", {
      error: formatError(error),
      endpoint: "/api/invite/[token]",
    });
    return NextResponse.json({ error: "Failed to accept invitation" }, { status: 500 });
  }
}
