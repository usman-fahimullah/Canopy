import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";

const updateRoleSchema = z.object({
  role: z.enum(["ADMIN", "RECRUITER", "HIRING_MANAGER", "MEMBER", "VIEWER"]),
});

/** Resolve the authenticated user's account and org membership (OWNER/ADMIN). */
async function getAdminContext() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized", status: 401 } as const;

  const account = await prisma.account.findUnique({
    where: { supabaseId: user.id },
  });
  if (!account) return { error: "Account not found", status: 404 } as const;

  const membership = await prisma.organizationMember.findFirst({
    where: {
      accountId: account.id,
      role: { in: ["OWNER", "ADMIN"] },
    },
  });
  if (!membership) {
    return { error: "Only owners and admins can manage team members", status: 403 } as const;
  }

  return { account, membership } as const;
}

/**
 * PATCH /api/canopy/team/members/[id]
 *
 * Change a team member's role. OWNER/ADMIN only.
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const ctx = await getAdminContext();
    if ("error" in ctx) {
      return NextResponse.json({ error: ctx.error }, { status: ctx.status });
    }

    const body = await request.json();
    const result = updateRoleSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }

    // Find the target member
    const target = await prisma.organizationMember.findUnique({
      where: { id },
    });

    if (!target || target.organizationId !== ctx.membership.organizationId) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    if (target.role === "OWNER") {
      return NextResponse.json({ error: "Cannot change the owner's role" }, { status: 403 });
    }

    if (target.id === ctx.membership.id) {
      return NextResponse.json({ error: "Cannot change your own role" }, { status: 403 });
    }

    const updated = await prisma.organizationMember.update({
      where: { id },
      data: { role: result.data.role },
      include: {
        account: {
          select: { name: true, email: true, avatar: true, lastActiveAt: true },
        },
      },
    });

    return NextResponse.json({
      member: {
        id: updated.id,
        accountId: updated.accountId,
        name: updated.account.name ?? updated.account.email,
        email: updated.account.email,
        avatar: updated.account.avatar,
        role: updated.role,
        title: updated.title,
        lastActiveAt: updated.account.lastActiveAt?.toISOString() ?? null,
        joinedAt: updated.createdAt.toISOString(),
      },
    });
  } catch (error) {
    logger.error("Failed to update member role", { error: formatError(error) });
    return NextResponse.json({ error: "Failed to update member role" }, { status: 500 });
  }
}

/**
 * DELETE /api/canopy/team/members/[id]
 *
 * Remove a team member. OWNER/ADMIN only.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ctx = await getAdminContext();
    if ("error" in ctx) {
      return NextResponse.json({ error: ctx.error }, { status: ctx.status });
    }

    const target = await prisma.organizationMember.findUnique({
      where: { id },
    });

    if (!target || target.organizationId !== ctx.membership.organizationId) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    if (target.role === "OWNER") {
      return NextResponse.json({ error: "Cannot remove the organization owner" }, { status: 403 });
    }

    if (target.id === ctx.membership.id) {
      return NextResponse.json({ error: "Cannot remove yourself from the team" }, { status: 403 });
    }

    await prisma.organizationMember.delete({ where: { id } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    logger.error("Failed to remove team member", { error: formatError(error) });
    return NextResponse.json({ error: "Failed to remove team member" }, { status: 500 });
  }
}
