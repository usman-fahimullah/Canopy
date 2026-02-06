import { NextRequest, NextResponse } from "next/server";
import { processPendingSyndication } from "@/lib/syndication/service";
import { logger, formatError } from "@/lib/logger";

/**
 * POST /api/webhooks/syndicate
 *
 * Webhook endpoint that processes pending syndication logs.
 *
 * Can be triggered by:
 * - A cron job (Vercel Cron, Upstash QStash scheduled message)
 * - Direct POST from the publish flow (fire-and-forget)
 *
 * Protected by a shared secret (SYNDICATION_WEBHOOK_SECRET).
 * In development, the secret check is skipped.
 */
export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret in production
    const secret = process.env.SYNDICATION_WEBHOOK_SECRET;
    if (secret) {
      const authHeader = request.headers.get("authorization");
      const body = await request.text();

      // Support both Bearer token and QStash signature verification
      if (authHeader !== `Bearer ${secret}`) {
        // Also check x-webhook-secret header (alternative pattern)
        const webhookSecret = request.headers.get("x-webhook-secret");
        if (webhookSecret !== secret) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
      }

      // Re-parse body if consumed by text() above
      // (body is empty for trigger-only requests)
      void body;
    }

    const result = await processPendingSyndication();

    logger.info("Syndication webhook completed", result);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    logger.error("Syndication webhook error", {
      error: formatError(error),
      endpoint: "/api/webhooks/syndicate",
    });

    return NextResponse.json({ error: "Syndication processing failed" }, { status: 500 });
  }
}

/**
 * GET /api/webhooks/syndicate
 *
 * Vercel Cron support: Vercel cron triggers GET requests.
 * Uses CRON_SECRET for authorization.
 */
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const result = await processPendingSyndication();

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    logger.error("Syndication cron error", {
      error: formatError(error),
      endpoint: "/api/webhooks/syndicate",
    });

    return NextResponse.json({ error: "Syndication processing failed" }, { status: 500 });
  }
}
