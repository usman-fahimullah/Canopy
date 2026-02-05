import { NextRequest, NextResponse } from "next/server";
import { logger, formatError } from "@/lib/logger";
import { processGoalReminders } from "@/lib/notifications";

/**
 * POST /api/cron/goal-reminders
 *
 * Process goal reminder notifications.
 * Should be called daily by a cron job service (Vercel Cron, etc.)
 *
 * Requires CRON_SECRET environment variable for authentication.
 */
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get("authorization");
    const expectedSecret = process.env.CRON_SECRET;

    if (!expectedSecret) {
      logger.warn("CRON_SECRET not configured", { endpoint: "/api/cron/goal-reminders" });
      return NextResponse.json({ error: "Cron not configured" }, { status: 500 });
    }

    if (authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Process reminders
    const result = await processGoalReminders();

    logger.info("Goal reminders processed", {
      ...result,
      endpoint: "/api/cron/goal-reminders",
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    logger.error("Error processing goal reminders", {
      error: formatError(error),
      endpoint: "/api/cron/goal-reminders",
    });
    return NextResponse.json({ error: "Failed to process goal reminders" }, { status: 500 });
  }
}

// Also support GET for easy testing in development
export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  return POST(request);
}
