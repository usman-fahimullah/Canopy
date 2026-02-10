import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/access-control";
import { readLimiter } from "@/lib/rate-limit";
import { logger, formatError } from "@/lib/logger";
import { nangoProxy } from "@/lib/integrations/nango";

/**
 * GET /api/canopy/integrations/slack/channels
 *
 * List available Slack channels for the org's connected Slack workspace.
 * Auth: ADMIN/RECRUITER
 */
export async function GET(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = await readLimiter.check(30, ip);
    if (!success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!["ADMIN", "RECRUITER"].includes(ctx.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const result = await nangoProxy<{
      ok: boolean;
      channels: Array<{
        id: string;
        name: string;
        is_private: boolean;
        is_archived: boolean;
        num_members: number;
      }>;
    }>({
      provider: "slack",
      scope: "organization",
      ids: { organizationId: ctx.organizationId },
      endpoint: "/api/conversations.list",
      method: "GET",
      params: {
        types: "public_channel,private_channel",
        exclude_archived: "true",
        limit: "200",
      },
    });

    const channels = (result.channels || [])
      .filter((ch) => !ch.is_archived)
      .map((ch) => ({
        id: ch.id,
        name: ch.name,
        isPrivate: ch.is_private,
        memberCount: ch.num_members,
      }));

    return NextResponse.json({ data: channels });
  } catch (error) {
    logger.error("Failed to list Slack channels", {
      error: formatError(error),
      endpoint: "GET /api/canopy/integrations/slack/channels",
    });
    return NextResponse.json({ error: "Failed to list Slack channels" }, { status: 500 });
  }
}
