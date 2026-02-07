import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";

/**
 * GET /api/canopy/members
 *
 * List organization members for the authenticated user's org.
 * Used for recruiter/hiring manager pickers in the role editor.
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const membership = await prisma.organizationMember.findFirst({
      where: { accountId: account.id },
    });

    if (!membership) {
      return NextResponse.json({ error: "Organization membership required" }, { status: 403 });
    }

    const members = await prisma.organizationMember.findMany({
      where: { organizationId: membership.organizationId },
      include: {
        account: {
          select: { name: true, email: true, avatar: true },
        },
      },
      orderBy: { role: "asc" },
    });

    const data = members.map((m) => ({
      id: m.id,
      name: m.account.name ?? m.account.email,
      email: m.account.email,
      avatar: m.account.avatar,
      role: m.role,
      title: m.title,
    }));

    return NextResponse.json({ members: data });
  } catch (error) {
    logger.error("Failed to fetch org members", { error: formatError(error) });
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}
