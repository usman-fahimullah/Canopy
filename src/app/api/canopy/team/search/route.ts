import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";

const SearchSchema = z.object({
  q: z.string().max(100).default(""),
});

/**
 * GET /api/canopy/team/search?q=<query>
 *
 * Search org members by name or email for @mention suggestions.
 * Returns up to 10 matching members.
 */
export async function GET(request: NextRequest) {
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

    const parsed = SearchSchema.safeParse({
      q: request.nextUrl.searchParams.get("q") ?? "",
    });
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid query" }, { status: 422 });
    }
    const query = parsed.data.q;

    const members = await prisma.organizationMember.findMany({
      where: {
        organizationId: membership.organizationId,
        account: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
          ],
        },
      },
      select: {
        id: true,
        account: {
          select: {
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
      take: 10,
    });

    return NextResponse.json({ data: members });
  } catch (error) {
    logger.error("Team search error", {
      error: formatError(error),
      endpoint: "/api/canopy/team/search",
    });
    return NextResponse.json({ error: "Failed to search team" }, { status: 500 });
  }
}
