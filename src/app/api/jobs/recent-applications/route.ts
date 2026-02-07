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

    // Fetch real recent applications from database
    const applications = await prisma.application.findMany({
      where: { seekerId: account.seekerProfile.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        stage: true,
        createdAt: true,
        job: {
          select: {
            title: true,
            organization: {
              select: { name: true },
            },
          },
        },
      },
    });

    // Format relative time for subtitle
    const now = Date.now();
    const formatRelativeTime = (date: Date): string => {
      const diffMs = now - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return "Applied today";
      if (diffDays === 1) return "Applied 1d ago";
      if (diffDays < 7) return `Applied ${diffDays}d ago`;
      if (diffDays < 30) return `Applied ${Math.floor(diffDays / 7)}w ago`;
      return `Applied ${Math.floor(diffDays / 30)}mo ago`;
    };

    const recentApplications = applications.map((app) => ({
      id: app.id,
      title: `${app.job.title} at ${app.job.organization.name}`,
      subtitle: formatRelativeTime(app.createdAt),
      href: `/jobs/applications/${app.id}`,
    }));

    return NextResponse.json(recentApplications);
  } catch (error) {
    logger.error("Error fetching recent applications", {
      error: formatError(error),
      endpoint: "/api/jobs/recent-applications",
    });
    return NextResponse.json([], { status: 500 });
  }
}
