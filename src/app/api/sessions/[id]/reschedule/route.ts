import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { isSlotAvailable } from "@/lib/availability";
import { createNotification } from "@/lib/notifications";
import { logger, formatError } from "@/lib/logger";
import { standardLimiter } from "@/lib/rate-limit";
import { RescheduleSessionSchema } from "@/lib/validators/api";

// POST — reschedule a session
// Body: { newDate: string (ISO), newTime: string (HH:MM) }
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limit: 5 reschedules per minute per IP
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = await standardLimiter.check(5, `reschedule:${ip}`);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429 }
      );
    }

    const { id: sessionId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        coach: { include: { account: true } },
        mentee: { include: { account: true } },
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Verify user is coach or mentee
    const isCoach = session.coach.account.id === account.id;
    const isMentee = session.mentee.account.id === account.id;

    if (!isCoach && !isMentee) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Must be at least 24 hours before session
    const hoursUntilSession =
      (session.scheduledAt.getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursUntilSession < 24) {
      return NextResponse.json(
        { error: "Cannot reschedule within 24 hours of the session" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const result = RescheduleSessionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }
    const { newDate } = result.data;

    const newDateTime = new Date(newDate);
    if (isNaN(newDateTime.getTime())) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }

    // Check new slot is available
    const available = await isSlotAvailable(
      session.coachId,
      newDateTime,
      session.duration
    );

    if (!available) {
      return NextResponse.json(
        { error: "The selected time slot is not available" },
        { status: 409 }
      );
    }

    // Update session
    const updated = await prisma.session.update({
      where: { id: sessionId },
      data: { scheduledAt: newDateTime },
    });

    // Notify the other party
    const reschedulerName = isCoach
      ? [session.coach.firstName, session.coach.lastName].filter(Boolean).join(" ") || session.coach.account.name || "Your coach"
      : session.mentee.account.name || "Your mentee";
    const recipientAccountId = isCoach
      ? session.mentee.account.id
      : session.coach.account.id;

    await createNotification({
      accountId: recipientAccountId,
      type: "SESSION_BOOKED", // Reuse for reschedule
      title: "Session Rescheduled",
      body: `${reschedulerName} has rescheduled the session to ${newDateTime.toLocaleDateString()}.`,
      data: {
        sessionId: session.id,
        url: `/candid/sessions/${session.id}`,
      },
    }).catch((err) => {
      logger.error("Failed to send reschedule notification", { error: formatError(err), endpoint: "/api/sessions/[id]/reschedule" });
    });

    return NextResponse.json({ success: true, session: updated });
  } catch (error) {
    logger.error("Reschedule session error", { error: formatError(error), endpoint: "/api/sessions/[id]/reschedule" });
    return NextResponse.json(
      { error: "Failed to reschedule session" },
      { status: 500 }
    );
  }
}
