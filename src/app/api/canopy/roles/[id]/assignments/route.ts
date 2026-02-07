import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { getAuthContext, canAccessJob, canManageAssignments } from "@/lib/access-control";

/**
 * GET /api/canopy/roles/[id]/assignments
 *
 * Returns the current reviewer assignments for a specific job.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canAccessJob(ctx, id)) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    const assignments = await prisma.jobAssignment.findMany({
      where: {
        jobId: id,
        job: { organizationId: ctx.organizationId },
      },
      select: {
        id: true,
        memberId: true,
        assignedAt: true,
        member: {
          select: {
            id: true,
            role: true,
            title: true,
            account: {
              select: { name: true, email: true, avatar: true },
            },
          },
        },
      },
      orderBy: { assignedAt: "asc" },
    });

    return NextResponse.json({ assignments });
  } catch (error) {
    logger.error("Error fetching job assignments", {
      error: formatError(error),
      endpoint: "/api/canopy/roles/[id]/assignments",
    });
    return NextResponse.json({ error: "Failed to fetch assignments" }, { status: 500 });
  }
}

/**
 * PATCH /api/canopy/roles/[id]/assignments
 *
 * Sync reviewer assignments for a job. Accepts the complete list of reviewer
 * member IDs — creates new assignments and deletes removed ones.
 * Auth: OWNER/ADMIN/RECRUITER only.
 */
const SyncAssignmentsSchema = z.object({
  reviewerIds: z.array(z.string()).max(50),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canManageAssignments(ctx)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Verify job exists in org
    const job = await prisma.job.findFirst({
      where: { id, organizationId: ctx.organizationId },
      select: { id: true },
    });
    if (!job) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    const body = await request.json();
    const result = SyncAssignmentsSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }

    const { reviewerIds } = result.data;

    // Validate all reviewer IDs belong to the org
    if (reviewerIds.length > 0) {
      const validMembers = await prisma.organizationMember.findMany({
        where: {
          id: { in: reviewerIds },
          organizationId: ctx.organizationId,
        },
        select: { id: true },
      });
      const validIds = new Set(validMembers.map((m) => m.id));
      const invalid = reviewerIds.filter((rid) => !validIds.has(rid));
      if (invalid.length > 0) {
        return NextResponse.json(
          { error: `Members not found: ${invalid.join(", ")}` },
          { status: 422 }
        );
      }
    }

    // Sync: delete removed, create new
    await prisma.$transaction(async (tx) => {
      // Delete assignments not in the new list
      await tx.jobAssignment.deleteMany({
        where: {
          jobId: id,
          memberId: { notIn: reviewerIds },
        },
      });

      // Upsert each reviewer (createMany with skipDuplicates)
      if (reviewerIds.length > 0) {
        await tx.jobAssignment.createMany({
          data: reviewerIds.map((memberId) => ({
            jobId: id,
            memberId,
          })),
          skipDuplicates: true,
        });
      }
    });

    // Return updated assignments
    const assignments = await prisma.jobAssignment.findMany({
      where: { jobId: id },
      select: {
        id: true,
        memberId: true,
        assignedAt: true,
        member: {
          select: {
            id: true,
            role: true,
            title: true,
            account: {
              select: { name: true, email: true, avatar: true },
            },
          },
        },
      },
      orderBy: { assignedAt: "asc" },
    });

    return NextResponse.json({ assignments });
  } catch (error) {
    logger.error("Error syncing job assignments", {
      error: formatError(error),
      endpoint: "/api/canopy/roles/[id]/assignments",
    });
    return NextResponse.json({ error: "Failed to update assignments" }, { status: 500 });
  }
}
