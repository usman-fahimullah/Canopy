import { NextRequest, NextResponse } from "next/server";
import { getAuthContext } from "@/lib/access-control";
import { readLimiter } from "@/lib/rate-limit";
import { logger, formatError } from "@/lib/logger";
import { CalendarAvailabilitySchema } from "@/lib/validators/integrations";
import { getCalendarAvailability } from "@/lib/integrations/calendar";

/**
 * GET /api/canopy/integrations/calendar/availability
 *
 * Returns free/busy data for a team member's calendar.
 * Query params: memberId, start (ISO datetime), end (ISO datetime)
 * Auth: any org member
 */
export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = await readLimiter.check(60, ip);
    if (!success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const parsed = CalendarAvailabilitySchema.safeParse(searchParams);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const { memberId, start, end } = parsed.data;

    const slots = await getCalendarAvailability(ctx.organizationId, memberId, start, end);

    return NextResponse.json({
      data: slots,
      meta: { memberId, start, end, count: slots.length },
    });
  } catch (error) {
    logger.error("Failed to get calendar availability", {
      error: formatError(error),
      endpoint: "GET /api/canopy/integrations/calendar/availability",
    });
    return NextResponse.json({ error: "Failed to get calendar availability" }, { status: 500 });
  }
}
