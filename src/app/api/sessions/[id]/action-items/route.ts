import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";
import { CreateActionItemSchema } from "@/lib/validators/api";

// GET — list action items for a session
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

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

    // Verify user is participant of this session
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: { coachId: true, menteeId: true },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const isCoach = account.coachProfile?.id === session.coachId;
    const isMentee = account.seekerProfile?.id === session.menteeId;

    if (!isCoach && !isMentee) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const actionItems = await prisma.actionItem.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
      take: 100,
    });

    return NextResponse.json({ actionItems });
  } catch (error) {
    logger.error("Fetch action items error", { error: formatError(error), endpoint: "/api/sessions/[id]/action-items" });
    return NextResponse.json(
      { error: "Failed to fetch action items" },
      { status: 500 }
    );
  }
}

// POST — create action item (coach only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      include: { coachProfile: true },
    });

    if (!account?.coachProfile) {
      return NextResponse.json({ error: "Only coaches can create action items" }, { status: 403 });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: { coachId: true, menteeId: true },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (session.coachId !== account.coachProfile.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await request.json();
    const result = CreateActionItemSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }
    const { description, dueDate } = result.data;

    const actionItem = await prisma.actionItem.create({
      data: {
        sessionId,
        menteeId: session.menteeId,
        coachId: session.coachId,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    return NextResponse.json({ actionItem }, { status: 201 });
  } catch (error) {
    logger.error("Create action item error", { error: formatError(error), endpoint: "/api/sessions/[id]/action-items" });
    return NextResponse.json(
      { error: "Failed to create action item" },
      { status: 500 }
    );
  }
}
