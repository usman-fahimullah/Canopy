import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";

// GET — full session detail with coach, mentee, booking, review, actionItems
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

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        coach: {
          include: {
            account: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
        },
        mentee: {
          include: {
            account: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
        },
        booking: {
          select: {
            id: true,
            amount: true,
            status: true,
            refundAmount: true,
            refundedAt: true,
            // Exclude: stripePaymentIntentId, stripeCheckoutSessionId, stripeTransferId, platformFee, coachPayout
          },
        },
        review: true,
        actionItems: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Verify user is participant
    const isCoach = account.coachProfile?.id === session.coachId;
    const isMentee = account.seekerProfile?.id === session.menteeId;

    if (!isCoach && !isMentee) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    return NextResponse.json({
      session,
      userRole: isCoach ? "coach" : "mentee",
    });
  } catch (error) {
    logger.error("Fetch session detail error", { error: formatError(error), endpoint: "/api/sessions/[id]" });
    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 500 }
    );
  }
}
