import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/access-control";
import { standardLimiter } from "@/lib/rate-limit";
import { logger, formatError } from "@/lib/logger";
import { SlackConfigSchema } from "@/lib/validators/integrations";

/**
 * PATCH /api/canopy/integrations/slack/config
 *
 * Save Slack configuration (selected channel) for the org's Slack connection.
 * Auth: ADMIN
 */
export async function PATCH(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = await standardLimiter.check(30, ip);
    if (!success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (ctx.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can configure Slack settings" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = SlackConfigSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 422 }
      );
    }

    // Find the active Slack connection for this org
    const connection = await prisma.integrationConnection.findFirst({
      where: {
        organizationId: ctx.organizationId,
        provider: "slack",
        status: "active",
      },
    });

    if (!connection) {
      return NextResponse.json({ error: "No active Slack connection found" }, { status: 404 });
    }

    // Update the config JSON
    await prisma.integrationConnection.update({
      where: { id: connection.id },
      data: {
        config: { channelId: parsed.data.channelId },
      },
    });

    logger.info("Slack config updated", {
      organizationId: ctx.organizationId,
      channelId: parsed.data.channelId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Failed to update Slack config", {
      error: formatError(error),
      endpoint: "PATCH /api/canopy/integrations/slack/config",
    });
    return NextResponse.json({ error: "Failed to update Slack configuration" }, { status: 500 });
  }
}
