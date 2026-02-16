import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { getAuthContext } from "@/lib/access-control";
import { createAuditLog } from "@/lib/audit";

type RouteContext = { params: Promise<{ id: string }> };

/* -------------------------------------------------------------------
   GET /api/canopy/departments/[id]/members
   Returns members assigned to this department.
   Auth: any org member.
   ------------------------------------------------------------------- */

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const department = await prisma.department.findFirst({
      where: { id, organizationId: ctx.organizationId },
      select: { id: true },
    });

    if (!department) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 });
    }

    const members = await prisma.organizationMember.findMany({
      where: {
        departmentId: id,
        organizationId: ctx.organizationId,
      },
      select: {
        id: true,
        role: true,
        title: true,
        account: {
          select: { name: true, email: true, avatar: true },
        },
      },
      take: 100,
      orderBy: { account: { name: "asc" } },
    });

    return NextResponse.json({ members });
  } catch (error) {
    logger.error("Error fetching department members", {
      error: formatError(error),
      endpoint: "/api/canopy/departments/[id]/members",
    });
    return NextResponse.json({ error: "Failed to fetch department members" }, { status: 500 });
  }
}

/* -------------------------------------------------------------------
   PATCH /api/canopy/departments/[id]/members
   Sync department membership — full replacement of member IDs.
   Auth: ADMIN, or department head (for their own department).
   ------------------------------------------------------------------- */

const SyncMembersSchema = z.object({
  memberIds: z.array(z.string()).max(200),
});

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify department exists + check head
    const department = await prisma.department.findFirst({
      where: { id, organizationId: ctx.organizationId },
      select: { id: true, headId: true, name: true },
    });

    if (!department) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 });
    }

    // Auth: ADMIN can manage any department; dept head can manage their own
    const isDeptHead = department.headId === ctx.memberId;
    if (ctx.role !== "ADMIN" && !isDeptHead) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const result = SyncMembersSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }

    const { memberIds } = result.data;

    // Validate all member IDs belong to the org
    if (memberIds.length > 0) {
      const validMembers = await prisma.organizationMember.findMany({
        where: {
          id: { in: memberIds },
          organizationId: ctx.organizationId,
        },
        select: { id: true },
        take: 200,
      });
      const validIds = new Set(validMembers.map((m) => m.id));
      const invalid = memberIds.filter((mid) => !validIds.has(mid));
      if (invalid.length > 0) {
        return NextResponse.json(
          { error: `Members not found: ${invalid.join(", ")}` },
          { status: 422 }
        );
      }
    }

    // Sync: remove members no longer in list, add new members
    await prisma.$transaction(async (tx) => {
      // Remove members no longer assigned to this department
      await tx.organizationMember.updateMany({
        where: {
          departmentId: id,
          id: { notIn: memberIds },
          organizationId: ctx.organizationId,
        },
        data: { departmentId: null },
      });

      // Assign new members to this department
      if (memberIds.length > 0) {
        await tx.organizationMember.updateMany({
          where: {
            id: { in: memberIds },
            organizationId: ctx.organizationId,
          },
          data: { departmentId: id },
        });
      }
    });

    // Fetch updated members
    const members = await prisma.organizationMember.findMany({
      where: {
        departmentId: id,
        organizationId: ctx.organizationId,
      },
      select: {
        id: true,
        role: true,
        title: true,
        account: {
          select: { name: true, email: true, avatar: true },
        },
      },
      take: 100,
      orderBy: { account: { name: "asc" } },
    });

    // Fire-and-forget audit log
    createAuditLog({
      action: "UPDATE",
      entityType: "Department",
      entityId: id,
      userId: ctx.accountId,
      changes: { members: { from: "sync", to: memberIds.length } },
      metadata: {
        departmentName: department.name,
        memberCount: memberIds.length,
      },
    }).catch((err) => logger.warn("Audit log failed (non-blocking)", { error: formatError(err) }));

    logger.info("Department members synced", {
      departmentId: id,
      memberCount: memberIds.length,
    });

    return NextResponse.json({ members });
  } catch (error) {
    logger.error("Error syncing department members", {
      error: formatError(error),
      endpoint: "/api/canopy/departments/[id]/members",
    });
    return NextResponse.json({ error: "Failed to update department members" }, { status: 500 });
  }
}
