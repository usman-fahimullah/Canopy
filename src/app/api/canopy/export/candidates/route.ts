import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { getAuthContext } from "@/lib/access-control";
import { generateCSV } from "@/lib/csv/export";

/**
 * GET /api/canopy/export/candidates
 *
 * Export candidates as CSV. Scoped to the authenticated user's org.
 * Supports filtering by jobId and stage.
 * Returns CSV file as download.
 */
const ExportParamsSchema = z.object({
  jobId: z.string().optional(),
  stage: z.string().optional(),
});

const MAX_EXPORT = 10000;

export async function GET(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = ExportParamsSchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
    if (!params.success) {
      return NextResponse.json(
        { error: "Invalid parameters", details: params.error.flatten() },
        { status: 422 }
      );
    }

    const { jobId, stage } = params.data;

    // Build where clause
    const where: Record<string, unknown> = {
      job: { organizationId: ctx.organizationId },
      deletedAt: null,
    };
    if (jobId) where.jobId = jobId;
    if (stage) where.stage = stage;

    const applications = await prisma.application.findMany({
      where,
      take: MAX_EXPORT,
      orderBy: { createdAt: "desc" },
      select: {
        stage: true,
        matchScore: true,
        source: true,
        createdAt: true,
        seeker: {
          select: {
            skills: true,
            account: {
              select: {
                name: true,
                email: true,
                phone: true,
                location: true,
              },
            },
          },
        },
        job: {
          select: {
            title: true,
          },
        },
      },
    });

    const headers = [
      "Name",
      "Email",
      "Phone",
      "Location",
      "Job",
      "Stage",
      "Applied Date",
      "Source",
      "Skills",
      "Match Score",
    ];

    const rows = applications.map((app) => [
      app.seeker.account.name ?? "",
      app.seeker.account.email,
      app.seeker.account.phone ?? "",
      app.seeker.account.location ?? "",
      app.job.title,
      app.stage,
      new Date(app.createdAt).toISOString().split("T")[0],
      app.source ?? "",
      app.seeker.skills.join("; "),
      app.matchScore != null ? String(Math.round(app.matchScore)) : "",
    ]);

    const csv = generateCSV(headers, rows);
    const filename = `candidates-${new Date().toISOString().split("T")[0]}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    logger.error("Error exporting candidates", {
      error: formatError(error),
      endpoint: "GET /api/canopy/export/candidates",
    });
    return NextResponse.json({ error: "Failed to export candidates" }, { status: 500 });
  }
}
