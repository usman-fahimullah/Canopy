import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";

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
      include: { orgMemberships: { select: { id: true } } },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    if (account.orgMemberships.length === 0) {
      return NextResponse.json(
        { error: "Forbidden: employer organization membership required" },
        { status: 403 }
      );
    }

    // In production, fetch from database for the authenticated employer org
    // For now, return mock data matching the RecentItem interface
    const recentPostings = [
      {
        id: "role_001",
        title: "ESG Analyst",
        subtitle: "12 applications",
        href: "/canopy/roles/role_001",
      },
      {
        id: "role_002",
        title: "Solar Installation Lead",
        subtitle: "8 applications",
        href: "/canopy/roles/role_002",
      },
      {
        id: "role_003",
        title: "Climate Data Scientist",
        subtitle: "5 applications",
        href: "/canopy/roles/role_003",
      },
    ];

    return NextResponse.json(recentPostings);
  } catch (error) {
    logger.error("Error fetching recent postings", { error: formatError(error), endpoint: "/api/canopy/recent-postings" });
    return NextResponse.json([], { status: 500 });
  }
}
