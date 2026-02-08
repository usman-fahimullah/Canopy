import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { getAuthContext } from "@/lib/access-control";
import { generateCSV } from "@/lib/csv/export";

/**
 * GET /api/canopy/export/analytics
 *
 * Export hiring analytics as CSV.
 * Includes per-job pipeline breakdown + application sources.
 */
export async function GET(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all jobs for the org with application counts by stage
    const jobs = await prisma.job.findMany({
      where: { organizationId: ctx.organizationId },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        _count: {
          select: { applications: true },
        },
        applications: {
          where: { deletedAt: null },
          select: {
            stage: true,
            source: true,
            createdAt: true,
            hiredAt: true,
            rejectedAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const headers = [
      "Job Title",
      "Status",
      "Created",
      "Total Applications",
      "Applied",
      "Screening",
      "Interview",
      "Offer",
      "Hired",
      "Rejected",
      "Top Source",
      "Avg Days to Hire",
    ];

    const rows = jobs.map((job) => {
      const apps = job.applications;
      const stageCounts: Record<string, number> = {};
      const sourceCounts: Record<string, number> = {};
      const hireDurations: number[] = [];

      for (const app of apps) {
        stageCounts[app.stage] = (stageCounts[app.stage] || 0) + 1;
        if (app.source) {
          sourceCounts[app.source] = (sourceCounts[app.source] || 0) + 1;
        }
        if (app.hiredAt) {
          const days = Math.round(
            (new Date(app.hiredAt).getTime() - new Date(app.createdAt).getTime()) /
              (1000 * 60 * 60 * 24)
          );
          hireDurations.push(days);
        }
      }

      const topSource = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1])[0];
      const avgDaysToHire =
        hireDurations.length > 0
          ? Math.round(hireDurations.reduce((a, b) => a + b, 0) / hireDurations.length)
          : null;

      return [
        job.title,
        job.status,
        new Date(job.createdAt).toISOString().split("T")[0],
        String(job._count.applications),
        String(stageCounts["applied"] || 0),
        String(stageCounts["screening"] || 0),
        String(stageCounts["interview"] || 0),
        String(stageCounts["offer"] || 0),
        String(stageCounts["hired"] || 0),
        String(stageCounts["rejected"] || 0),
        topSource ? `${topSource[0]} (${topSource[1]})` : "",
        avgDaysToHire != null ? String(avgDaysToHire) : "",
      ];
    });

    const csv = generateCSV(headers, rows);
    const filename = `analytics-${new Date().toISOString().split("T")[0]}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    logger.error("Error exporting analytics", {
      error: formatError(error),
      endpoint: "GET /api/canopy/export/analytics",
    });
    return NextResponse.json({ error: "Failed to export analytics" }, { status: 500 });
  }
}
