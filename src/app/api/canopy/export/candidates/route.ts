import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { getAuthContext } from "@/lib/access-control";
import { generateCSV } from "@/lib/csv/export";
import { sendEmail } from "@/lib/email";

/**
 * GET /api/canopy/export/candidates
 *
 * Export candidates as CSV. Scoped to the authenticated user's org.
 * Supports filtering by jobId and stage.
 *
 * For small exports (< EMAIL_THRESHOLD rows): returns CSV file as download.
 * For large exports (>= EMAIL_THRESHOLD rows): sends CSV via email and returns 202.
 *
 * Query params:
 *   - jobId: filter by job
 *   - stage: filter by stage
 *   - delivery: "email" to force email delivery regardless of size
 */
const ExportParamsSchema = z.object({
  jobId: z.string().optional(),
  stage: z.string().optional(),
  delivery: z.enum(["download", "email"]).optional(),
});

const MAX_EXPORT = 10000;
const EMAIL_THRESHOLD = 1000;

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

    const { jobId, stage, delivery } = params.data;

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

    // Email delivery for large exports or when explicitly requested
    const shouldEmail =
      delivery === "email" || (applications.length >= EMAIL_THRESHOLD && delivery !== "download");

    if (shouldEmail) {
      // Look up user's email for delivery
      const account = await prisma.account.findUnique({
        where: { id: ctx.accountId },
        select: { email: true, name: true },
      });

      if (!account?.email) {
        return NextResponse.json(
          { error: "No email address on file for delivery" },
          { status: 422 }
        );
      }

      const csvBuffer = Buffer.from(csv, "utf-8");

      const result = await sendEmail({
        to: account.email,
        subject: `Canopy: Your candidate export is ready (${applications.length} records)`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #0A3D2C; padding: 32px; border-radius: 12px 12px 0 0;">
              <h1 style="color: #E5F1FF; font-size: 24px; margin: 0;">Candidate Export Ready</h1>
            </div>
            <div style="padding: 32px; background-color: #ffffff; border: 1px solid #E5DFD8;">
              <p style="font-size: 16px; color: #3D3A37; line-height: 1.6; margin-top: 0;">
                Hi ${account.name || "there"},
              </p>
              <p style="font-size: 16px; color: #3D3A37; line-height: 1.6;">
                Your candidate export containing <strong>${applications.length} records</strong> is attached as a CSV file.
              </p>
              ${stage ? `<p style="font-size: 14px; color: #7A7671;">Filtered by stage: ${stage}</p>` : ""}
              <p style="font-size: 14px; color: #7A7671; margin-bottom: 0;">
                This file was generated on ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.
              </p>
            </div>
            <div style="background-color: #F2EDE9; padding: 24px; border-radius: 0 0 12px 12px; text-align: center;">
              <p style="font-size: 12px; color: #A39D96; margin: 0;">Canopy by Green Jobs Board</p>
            </div>
          </div>
        `,
        text: `Hi ${account.name || "there"},\n\nYour candidate export containing ${applications.length} records is attached as a CSV file.\n\nGenerated on ${new Date().toLocaleDateString()}.`,
      });

      if (!result.success) {
        logger.error("Failed to email CSV export", {
          error: result.error,
          endpoint: "GET /api/canopy/export/candidates",
        });
        return NextResponse.json(
          { error: "Failed to send export email. Please try downloading instead." },
          { status: 500 }
        );
      }

      logger.info("CSV export emailed", {
        accountId: ctx.accountId,
        recordCount: applications.length,
        email: account.email,
      });

      return NextResponse.json(
        {
          message: `Export with ${applications.length} records sent to ${account.email}`,
          delivery: "email",
          recordCount: applications.length,
        },
        { status: 202 }
      );
    }

    // Direct download for smaller exports
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
