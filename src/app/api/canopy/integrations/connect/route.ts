import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/access-control";
import { standardLimiter } from "@/lib/rate-limit";
import { logger, formatError } from "@/lib/logger";
import { CreateConnectSessionSchema } from "@/lib/validators/integrations";
import { createNangoConnectSession } from "@/lib/integrations/nango";
import { prisma } from "@/lib/db";

/**
 * POST /api/canopy/integrations/connect
 *
 * Create a Nango connect session for the frontend to initiate an OAuth flow.
 * Returns a session token for the Nango frontend SDK.
 */
export async function POST(request: Request) {
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

    if (!["ADMIN", "RECRUITER"].includes(ctx.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = CreateConnectSessionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 422 }
      );
    }

    // Look up member email/name for Nango end_user metadata
    const member = await prisma.organizationMember.findUnique({
      where: { id: ctx.memberId },
      select: {
        account: { select: { email: true, name: true } },
      },
    });

    const { sessionToken } = await createNangoConnectSession({
      organizationId: ctx.organizationId,
      memberId: ctx.memberId,
      memberEmail: member?.account?.email,
      memberName: member?.account?.name ?? undefined,
      provider: parsed.data.provider,
    });

    return NextResponse.json({ sessionToken });
  } catch (error) {
    logger.error("Failed to create connect session", {
      error: formatError(error),
      endpoint: "POST /api/canopy/integrations/connect",
    });
    return NextResponse.json({ error: "Failed to start connection flow" }, { status: 500 });
  }
}
