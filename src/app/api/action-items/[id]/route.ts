import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";
import { standardLimiter } from "@/lib/rate-limit";
import { UpdateActionItemSchema } from "@/lib/validators/api";

// PATCH — update action item status/description
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Rate limit: 20 action item updates per minute per IP
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = await standardLimiter.check(20, `action-item-update:${ip}`);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429 }
      );
    }

    const { id: actionItemId } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      include: { seekerProfile: true, coachProfile: true },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const actionItem = await prisma.actionItem.findUnique({
      where: { id: actionItemId },
    });

    if (!actionItem) {
      return NextResponse.json({ error: "Action item not found" }, { status: 404 });
    }

    // Both coach and mentee can update
    const isCoach = account.coachProfile?.id === actionItem.coachId;
    const isMentee = account.seekerProfile?.id === actionItem.menteeId;

    if (!isCoach && !isMentee) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await request.json();
    const result = UpdateActionItemSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }
    const { description, status, dueDate } = result.data;

    const updateData: Record<string, unknown> = {};

    if (description !== undefined && isCoach) {
      updateData.description = description;
    }

    if (status !== undefined) {
      updateData.status = status;
      if (status === "COMPLETED") {
        updateData.completedAt = new Date();
      } else if (status === "PENDING") {
        updateData.completedAt = null;
      }
    }

    if (dueDate !== undefined && isCoach) {
      updateData.dueDate = dueDate ? new Date(dueDate) : null;
    }

    const updated = await prisma.actionItem.update({
      where: { id: actionItemId },
      data: updateData,
    });

    return NextResponse.json({ actionItem: updated });
  } catch (error) {
    logger.error("Update action item error", {
      error: formatError(error),
      endpoint: "/api/action-items/[id]",
    });
    return NextResponse.json({ error: "Failed to update action item" }, { status: 500 });
  }
}

// DELETE — remove action item (coach only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limit: 10 action item deletes per minute per IP
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = await standardLimiter.check(10, `action-item-delete:${ip}`);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429 }
      );
    }

    const { id: actionItemId } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      include: { coachProfile: true },
    });

    if (!account?.coachProfile) {
      return NextResponse.json({ error: "Only coaches can delete action items" }, { status: 403 });
    }

    const actionItem = await prisma.actionItem.findUnique({
      where: { id: actionItemId },
    });

    if (!actionItem) {
      return NextResponse.json({ error: "Action item not found" }, { status: 404 });
    }

    if (actionItem.coachId !== account.coachProfile.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    await prisma.actionItem.delete({
      where: { id: actionItemId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Delete action item error", {
      error: formatError(error),
      endpoint: "/api/action-items/[id]",
    });
    return NextResponse.json({ error: "Failed to delete action item" }, { status: 500 });
  }
}
