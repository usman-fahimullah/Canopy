import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { getAuthContext } from "@/lib/access-control";
import { createAuditLog } from "@/lib/audit";
import { slugify } from "@/lib/utils";
import { standardLimiter } from "@/lib/rate-limit";

/* -------------------------------------------------------------------
   GET /api/canopy/departments
   Returns all departments for the org (flat list; frontend builds tree).
   Auth: any org member.
   ------------------------------------------------------------------- */

export async function GET(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const departments = await prisma.department.findMany({
      where: {
        organizationId: ctx.organizationId,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        color: true,
        displayOrder: true,
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
        _count: {
          select: {
            members: true,
            jobs: true,
            children: true,
          },
        },
      },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    });

    return NextResponse.json({ departments });
  } catch (error) {
    logger.error("Error fetching departments", {
      error: formatError(error),
      endpoint: "/api/canopy/departments",
    });
    return NextResponse.json({ error: "Failed to fetch departments" }, { status: 500 });
  }
}

/* -------------------------------------------------------------------
   POST /api/canopy/departments
   Create a new department. Auth: ADMIN only.
   ------------------------------------------------------------------- */

const CreateDepartmentSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  color: z.enum(["green", "blue", "purple", "orange", "red", "yellow", "neutral"]).optional(),
  parentId: z.string().optional(),
  headId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 10 department creations per minute per IP
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success: withinLimit } = await standardLimiter.check(10, `dept-create:${ip}`);
    if (!withinLimit) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429 }
      );
    }

    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (ctx.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const result = CreateDepartmentSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }

    const { name, description, color, parentId, headId } = result.data;

    // Generate slug and ensure uniqueness within org
    let slug = slugify(name);
    const existing = await prisma.department.findUnique({
      where: {
        organizationId_slug: {
          organizationId: ctx.organizationId,
          slug,
        },
      },
      select: { id: true },
    });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    // Validate parentId belongs to same org (if provided)
    if (parentId) {
      const parent = await prisma.department.findFirst({
        where: { id: parentId, organizationId: ctx.organizationId },
        select: { id: true },
      });
      if (!parent) {
        return NextResponse.json({ error: "Parent department not found" }, { status: 422 });
      }
    }

    // Validate headId belongs to same org (if provided)
    if (headId) {
      const head = await prisma.organizationMember.findFirst({
        where: { id: headId, organizationId: ctx.organizationId },
        select: { id: true },
      });
      if (!head) {
        return NextResponse.json(
          { error: "Department head not found in organization" },
          { status: 422 }
        );
      }
    }

    // Get max displayOrder for siblings
    const maxOrder = await prisma.department.aggregate({
      where: {
        organizationId: ctx.organizationId,
        parentId: parentId ?? null,
      },
      _max: { displayOrder: true },
    });
    const displayOrder = (maxOrder._max.displayOrder ?? -1) + 1;

    const department = await prisma.department.create({
      data: {
        name,
        slug,
        description,
        color,
        displayOrder,
        parentId: parentId ?? null,
        headId: headId ?? null,
        organizationId: ctx.organizationId,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        color: true,
        displayOrder: true,
        parentId: true,
        headId: true,
      },
    });

    // Fire-and-forget audit log
    createAuditLog({
      action: "CREATE",
      entityType: "Department",
      entityId: department.id,
      userId: ctx.accountId,
      metadata: { name, parentId, organizationId: ctx.organizationId },
    }).catch((err) => logger.warn("Audit log failed (non-blocking)", { error: formatError(err) }));

    logger.info("Department created", {
      departmentId: department.id,
      organizationId: ctx.organizationId,
    });

    return NextResponse.json({ department }, { status: 201 });
  } catch (error) {
    logger.error("Error creating department", {
      error: formatError(error),
      endpoint: "/api/canopy/departments",
    });
    return NextResponse.json({ error: "Failed to create department" }, { status: 500 });
  }
}
