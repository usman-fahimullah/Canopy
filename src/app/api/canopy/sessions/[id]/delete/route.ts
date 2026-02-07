import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { softDelete } from "@/lib/soft-delete";
import { logger, formatError } from "@/lib/logger";

export async function POST(
  request: NextRequest,
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
      select: { id: true },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 403 });
    }

    // Verify the session exists and user is a participant
    const session = await prisma.session.findUnique({
      where: { id },
      select: {
        id: true,
        coach: { select: { accountId: true } },
        mentee: { select: { accountId: true } },
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const isParticipant =
      session.coach.accountId === account.id ||
      session.mentee.accountId === account.id;

    if (!isParticipant) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await softDelete("session", id, account.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error soft-deleting session", {
      error: formatError(error),
      endpoint: "/api/canopy/sessions/[id]/delete",
    });
    return NextResponse.json({ error: "Failed to delete session" }, { status: 500 });
  }
}
