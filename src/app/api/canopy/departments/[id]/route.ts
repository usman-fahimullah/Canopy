import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { getAuthContext } from "@/lib/access-control";
import { createAuditLog } from "@/lib/audit";
import { slugify } from "@/lib/utils";

type RouteContext = { params: Promise<{ id: string }> };

/* -------------------------------------------------------------------
   Helpers
   ------------------------------------------------------------------- */

/**
 * Check if moving `departmentId` under `newParentId` would create a cycle.
 * Walks up the ancestor chain from `newParentId` to see if we encounter
 * `departmentId`. O(depth) — safe for our practical 3-level limit.
 */
async function wouldCreateCycle(
  departmentId: string,
  newParentId: string,
  organizationId: string
): Promise<boolean> {
  const MAX_ANCESTOR_DEPTH = 10;
  let currentId: string | null = newParentId;
  const visited = new Set<string>();

  while (currentId) {
    if (currentId === departmentId) return true;
    if (visited.has(currentId)) return true; // safety: existing cycle
    visited.add(currentId);

    if (visited.size > MAX_ANCESTOR_DEPTH) {
      logger.warn("wouldCreateCycle hit depth limit — possible existing cycle", {
        departmentId,
        newParentId,
        organizationId,
        depth: visited.size,
      });
      return true; // treat excessive depth as a cycle
    }

    const ancestor: { parentId: string | null } | null = await prisma.department.findFirst({
      where: { id: currentId, organizationId },
      select: { parentId: true },
    });
    currentId = ancestor?.parentId ?? null;
  }

  return false;
}

/* -------------------------------------------------------------------
   GET /api/canopy/departments/[id]
   Returns a single department with members + children.
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
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        color: true,
        displayOrder: true,
        isActive: true,
        parentId: true,
        headId: true,
        head: {
          select: {
            id: true,
            title: true,
            account: {
              select: { name: true, avatar: true },
            },
          },
        },
        children: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            _count: { select: { members: true, jobs: true } },
          },
          orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
        },
        members: {
          select: {
            id: true,
            title: true,
            role: true,
            account: {
              select: { name: true, email: true, avatar: true },
            },
          },
          take: 50,
        },
        _count: {
          select: { members: true, jobs: true, children: true },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!department) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 });
    }

    return NextResponse.json({ department });
  } catch (error) {
    logger.error("Error fetching department", {
      error: formatError(error),
      endpoint: "/api/canopy/departments/[id]",
    });
    return NextResponse.json({ error: "Failed to fetch department" }, { status: 500 });
  }
}

/* -------------------------------------------------------------------
   PATCH /api/canopy/departments/[id]
   Update a department.
   Auth: ADMIN, or department head (for their own department).
   ------------------------------------------------------------------- */

const UpdateDepartmentSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).nullable().optional(),
  color: z
    .enum(["green", "blue", "purple", "orange", "red", "yellow", "neutral"])
    .nullable()
    .optional(),
  headId: z.string().nullable().optional(),
  parentId: z.string().nullable().optional(),
  displayOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the department to check ownership + existence
    const department = await prisma.department.findFirst({
      where: { id, organizationId: ctx.organizationId },
      select: { id: true, headId: true, name: true, parentId: true },
    });

    if (!department) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 });
    }

    // Auth: ADMIN can edit any department; dept head can edit their own
    const isDeptHead = department.headId === ctx.memberId;
    if (ctx.role !== "ADMIN" && !isDeptHead) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const result = UpdateDepartmentSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }

    const updates = result.data;

    // Dept heads can only update name, description, color
    if (isDeptHead && ctx.role !== "ADMIN") {
      const restrictedFields = ["headId", "parentId", "displayOrder", "isActive"] as const;
      for (const field of restrictedFields) {
        if (updates[field] !== undefined) {
          return NextResponse.json({ error: `Only admins can update ${field}` }, { status: 403 });
        }
      }
    }

    // Validate parentId if changing
    if (updates.parentId !== undefined && updates.parentId !== null) {
      const parent = await prisma.department.findFirst({
        where: { id: updates.parentId, organizationId: ctx.organizationId },
        select: { id: true },
      });
      if (!parent) {
        return NextResponse.json({ error: "Parent department not found" }, { status: 422 });
      }

      // Check for circular reference
      const cycle = await wouldCreateCycle(id, updates.parentId, ctx.organizationId);
      if (cycle) {
        return NextResponse.json(
          { error: "Cannot move department under itself or its descendants" },
          { status: 422 }
        );
      }
    }

    // Validate headId if changing
    if (updates.headId !== undefined && updates.headId !== null) {
      const head = await prisma.organizationMember.findFirst({
        where: { id: updates.headId, organizationId: ctx.organizationId },
        select: { id: true },
      });
      if (!head) {
        return NextResponse.json(
          { error: "Department head not found in organization" },
          { status: 422 }
        );
      }
    }

    // If name changed, regenerate slug
    const data: Record<string, unknown> = { ...updates };
    if (updates.name && updates.name !== department.name) {
      let slug = slugify(updates.name);
      const existing = await prisma.department.findFirst({
        where: {
          organizationId: ctx.organizationId,
          slug,
          id: { not: id },
        },
        select: { id: true },
      });
      if (existing) {
        slug = `${slug}-${Date.now().toString(36)}`;
      }
      data.slug = slug;
    }

    const updated = await prisma.department.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        color: true,
        displayOrder: true,
        isActive: true,
        parentId: true,
        headId: true,
      },
    });

    // Fire-and-forget audit log
    createAuditLog({
      action: "UPDATE",
      entityType: "Department",
      entityId: id,
      userId: ctx.accountId,
      changes: Object.fromEntries(
        Object.entries(updates).map(([key, value]) => [
          key,
          {
            from: (department as Record<string, unknown>)[key],
            to: value,
          },
        ])
      ),
    }).catch((err) => logger.warn("Audit log failed (non-blocking)", { error: formatError(err) }));

    logger.info("Department updated", {
      departmentId: id,
      updates: Object.keys(updates),
    });

    return NextResponse.json({ department: updated });
  } catch (error) {
    logger.error("Error updating department", {
      error: formatError(error),
      endpoint: "/api/canopy/departments/[id]",
    });
    return NextResponse.json({ error: "Failed to update department" }, { status: 500 });
  }
}

/* -------------------------------------------------------------------
   DELETE /api/canopy/departments/[id]
   Delete a department. Reassigns members/jobs to null, children to parent.
   Auth: ADMIN only.
   ------------------------------------------------------------------- */

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (ctx.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const department = await prisma.department.findFirst({
      where: { id, organizationId: ctx.organizationId },
      select: { id: true, name: true, parentId: true },
    });

    if (!department) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 });
    }

    // In a transaction: reassign children/members/jobs, then delete
    await prisma.$transaction(async (tx) => {
      // Reassign child departments to this department's parent (or null)
      await tx.department.updateMany({
        where: { parentId: id },
        data: { parentId: department.parentId },
      });

      // Unlink members from this department
      await tx.organizationMember.updateMany({
        where: { departmentId: id },
        data: { departmentId: null },
      });

      // Unlink jobs from this department
      await tx.job.updateMany({
        where: { departmentId: id },
        data: { departmentId: null },
      });

      // Delete the department
      await tx.department.delete({ where: { id } });
    });

    // Fire-and-forget audit log
    createAuditLog({
      action: "DELETE",
      entityType: "Department",
      entityId: id,
      userId: ctx.accountId,
      metadata: {
        name: department.name,
        organizationId: ctx.organizationId,
      },
    }).catch((err) => logger.warn("Audit log failed (non-blocking)", { error: formatError(err) }));

    logger.info("Department deleted", {
      departmentId: id,
      name: department.name,
      organizationId: ctx.organizationId,
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    logger.error("Error deleting department", {
      error: formatError(error),
      endpoint: "/api/canopy/departments/[id]",
    });
    return NextResponse.json({ error: "Failed to delete department" }, { status: 500 });
  }
}
