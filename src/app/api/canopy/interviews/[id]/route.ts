import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { createAuditLog } from "@/lib/audit";
import { UpdateInterviewSchema } from "@/lib/validators/interviews";

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/canopy/interviews/[id]
 *
 * Get interview detail
 * Auth: any org member
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
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

    // Get first org membership
    const membership = await prisma.organizationMember.findFirst({
      where: { accountId: account.id },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "You are not a member of any organization" },
        { status: 403 }
      );
    }

    // Fetch interview with org scoping
    const interview = await prisma.interview.findUnique({
      where: { id: params.id },
      include: {
        application: {
          select: {
            id: true,
            seeker: {
              select: {
                account: { select: { name: true } },
              },
            },
            job: { select: { id: true, title: true } },
          },
        },
        interviewer: {
          select: {
            id: true,
            account: { select: { id: true, name: true, email: true, avatar: true } },
          },
        },
      },
    });

    if (!interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    // Verify org membership
    if (interview.organizationId !== membership.organizationId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    logger.info("Interview retrieved", {
      interviewId: params.id,
      endpoint: `/api/canopy/interviews/${params.id}`,
    });

    return NextResponse.json({ data: interview });
  } catch (error) {
    logger.error("Error retrieving interview", {
      error: formatError(error),
      endpoint: `/api/canopy/interviews/${params.id}`,
    });
    return NextResponse.json({ error: "Failed to retrieve interview" }, { status: 500 });
  }
}

/**
 * PATCH /api/canopy/interviews/[id]
 *
 * Update interview
 * Auth: OWNER/ADMIN/RECRUITER
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
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

    // Fetch interview first
    const interview = await prisma.interview.findUnique({
      where: { id: params.id },
    });

    if (!interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    // Verify user is a member of this org with appropriate role
    const membership = await prisma.organizationMember.findFirst({
      where: {
        accountId: account.id,
        organizationId: interview.organizationId,
        role: { in: ["OWNER", "ADMIN", "RECRUITER"] },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Insufficient permissions. Must be OWNER, ADMIN, or RECRUITER." },
        { status: 403 }
      );
    }

    // Parse and validate body
    const body = await request.json();
    const result = UpdateInterviewSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }

    const data = result.data;

    // Build update data
    const updateData: any = {};

    if (data.scheduledAt) updateData.scheduledAt = new Date(data.scheduledAt);
    if (data.duration !== undefined) updateData.duration = data.duration;
    if (data.type) updateData.type = data.type;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.meetingLink !== undefined) updateData.meetingLink = data.meetingLink;
    if (data.notes !== undefined) updateData.notes = data.notes;

    // Handle status changes with special logic
    if (data.status) {
      updateData.status = data.status;

      if (data.status === "CANCELLED" && !interview.cancelledAt) {
        updateData.cancelledAt = new Date();
      }

      if (data.status === "COMPLETED" && !interview.completedAt) {
        updateData.completedAt = new Date();
      }

      // If status is changed away from CANCELLED or COMPLETED, clear those timestamps
      if (data.status === "SCHEDULED") {
        updateData.cancelledAt = null;
        updateData.completedAt = null;
      }
    }

    // Update interview
    const updatedInterview = await prisma.interview.update({
      where: { id: params.id },
      data: updateData,
      include: {
        application: {
          select: {
            id: true,
            seeker: {
              select: {
                account: { select: { name: true } },
              },
            },
            job: { select: { id: true, title: true } },
          },
        },
        interviewer: {
          select: {
            id: true,
            account: { select: { id: true, name: true, email: true, avatar: true } },
          },
        },
      },
    });

    await createAuditLog({
      action: "UPDATE",
      entityType: "Interview",
      entityId: params.id,
      userId: account.id,
      metadata: {
        applicationId: interview.applicationId,
        statusChange: data.status ? `${interview.status} → ${data.status}` : undefined,
      },
    });

    logger.info("Interview updated", {
      interviewId: params.id,
      endpoint: `/api/canopy/interviews/${params.id}`,
    });

    return NextResponse.json({ data: updatedInterview });
  } catch (error) {
    logger.error("Error updating interview", {
      error: formatError(error),
      endpoint: `/api/canopy/interviews/${params.id}`,
    });
    return NextResponse.json({ error: "Failed to update interview" }, { status: 500 });
  }
}

/**
 * DELETE /api/canopy/interviews/[id]
 *
 * Delete interview
 * Auth: OWNER/ADMIN/RECRUITER
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
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

    // Fetch interview first
    const interview = await prisma.interview.findUnique({
      where: { id: params.id },
    });

    if (!interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    // Verify user is a member of this org with appropriate role
    const membership = await prisma.organizationMember.findFirst({
      where: {
        accountId: account.id,
        organizationId: interview.organizationId,
        role: { in: ["OWNER", "ADMIN", "RECRUITER"] },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Insufficient permissions. Must be OWNER, ADMIN, or RECRUITER." },
        { status: 403 }
      );
    }

    // Delete interview
    await prisma.interview.delete({
      where: { id: params.id },
    });

    await createAuditLog({
      action: "DELETE",
      entityType: "Interview",
      entityId: params.id,
      userId: account.id,
      metadata: {
        applicationId: interview.applicationId,
      },
    });

    logger.info("Interview deleted", {
      interviewId: params.id,
      endpoint: `/api/canopy/interviews/${params.id}`,
    });

    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    logger.error("Error deleting interview", {
      error: formatError(error),
      endpoint: `/api/canopy/interviews/${params.id}`,
    });
    return NextResponse.json({ error: "Failed to delete interview" }, { status: 500 });
  }
}
