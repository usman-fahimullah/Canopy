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
      include: { seekerProfile: { select: { id: true } } },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    if (!account.seekerProfile) {
      return NextResponse.json({ error: "Forbidden: talent profile required" }, { status: 403 });
    }

    // In production, fetch from database for the authenticated user
    // For now, return mock data matching the RecentItem interface
    const recentApplications = [
      {
        id: "app_001",
        title: "Solar Project Engineer at Solaris Energy",
        subtitle: "Applied 2d ago",
        href: "/jobs/applications/app_001",
      },
      {
        id: "app_002",
        title: "ESG Analyst at GreenLeaf Analytics",
        subtitle: "Applied 5d ago",
        href: "/jobs/applications/app_002",
      },
      {
        id: "app_003",
        title: "Climate Policy Advisor at Verdant Systems",
        subtitle: "Applied 1w ago",
        href: "/jobs/applications/app_003",
      },
    ];

    return NextResponse.json(recentApplications);
  } catch (error) {
    logger.error("Error fetching recent applications", { error: formatError(error), endpoint: "/api/jobs/recent-applications" });
    return NextResponse.json([], { status: 500 });
  }
}
