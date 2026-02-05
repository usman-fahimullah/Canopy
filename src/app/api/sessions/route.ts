import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { createReviewRequestNotification } from "@/lib/notifications";
import { logger, formatError } from "@/lib/logger";
import { standardLimiter } from "@/lib/rate-limit";
import { UpdateSessionSchema } from "@/lib/validators/api";

// GET - List sessions for current user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const role = searchParams.get("role") || "mentee"; // mentee or coach

    // Find user's profile
    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      include: {
        seekerProfile: true,
        coachProfile: true,
      },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    let rawSessions;

    if (role === "coach" && account.coachProfile) {
      rawSessions = await prisma.session.findMany({
        where: {
          coachId: account.coachProfile.id,
          ...(status
            ? { status: status as "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW" }
            : {}),
        },
        include: {
          mentee: {
            include: { account: { select: { name: true, email: true, avatar: true } } },
          },
          booking: true,
          review: true,
        },
        orderBy: { scheduledAt: "desc" },
        take: 100,
      });
    } else if (account.seekerProfile) {
      rawSessions = await prisma.session.findMany({
        where: {
          menteeId: account.seekerProfile.id,
          ...(status
            ? { status: status as "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW" }
            : {}),
        },
        include: {
          coach: {
            include: { account: { select: { name: true, email: true, avatar: true } } },
          },
          booking: true,
          review: true,
        },
        orderBy: { scheduledAt: "desc" },
        take: 100,
      });
    } else {
      return NextResponse.json({ sessions: [] });
    }

    // Flatten participant data to match SessionParticipant shape
    // Components expect coach.name, coach.avatar (not coach.account.name)
    const sessions = rawSessions.map((s) => {
      const { coach, mentee, ...rest } = s as Record<string, unknown>;

      const result: Record<string, unknown> = { ...rest };

      if (coach && typeof coach === "object") {
        const c = coach as Record<string, unknown>;
        const acct = c.account as Record<string, unknown> | undefined;
        result.coach = {
          id: c.id,
          firstName: c.firstName,
          lastName: c.lastName,
          name: acct?.name ?? ([c.firstName, c.lastName].filter(Boolean).join(" ") || undefined),
          avatar: acct?.avatar ?? undefined,
          photoUrl: c.photoUrl ?? undefined,
          headline: c.headline ?? undefined,
        };
      }

      if (mentee && typeof mentee === "object") {
        const m = mentee as Record<string, unknown>;
        const acct = m.account as Record<string, unknown> | undefined;
        result.mentee = {
          id: m.id,
          name: acct?.name ?? undefined,
          avatar: acct?.avatar ?? undefined,
          email: acct?.email ?? undefined,
        };
      }

      return result;
    });

    return NextResponse.json({ sessions });
  } catch (error) {
    logger.error("Fetch sessions error", { error: formatError(error), endpoint: "/api/sessions" });
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}

// PATCH - Update session (mark complete, add notes)
export async function PATCH(request: NextRequest) {
  try {
    // Rate limit: 10 session updates per minute per IP
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = await standardLimiter.check(10, `session-update:${ip}`);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = UpdateSessionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }
    const { sessionId, status, coachNotes } = result.data;

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
    const isCoach = session.coach.account.supabaseId === user.id;
    const isMentee = session.mentee.account.supabaseId === user.id;

    if (!isCoach && !isMentee) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const updateData: Record<string, unknown> = {};

    if (status === "COMPLETED" && isCoach) {
      updateData.status = "COMPLETED";
      updateData.completedAt = new Date();
    }

    if (coachNotes && isCoach) {
      updateData.coachNotes = coachNotes;
    }

    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data: updateData,
    });

    // Send review request notification on completion
    if (status === "COMPLETED" && isCoach) {
      createReviewRequestNotification({
        id: session.id,
        scheduledAt: session.scheduledAt,
        coach: session.coach,
        mentee: session.mentee,
      }).catch((err) => {
        logger.error("Failed to send review request notification", { error: formatError(err) });
      });
    }

    return NextResponse.json({ success: true, session: updatedSession });
  } catch (error) {
    logger.error("Update session error", { error: formatError(error), endpoint: "/api/sessions" });
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
  }
}
