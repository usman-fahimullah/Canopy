import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { getAuthContext } from "@/lib/access-control";
import { sendEmail } from "@/lib/email";
import { renderTemplate } from "@/lib/email/render";

/**
 * POST /api/canopy/emails/bulk-send
 *
 * Send personalized emails to multiple candidates.
 * Variables are interpolated per-recipient.
 */
const BulkSendSchema = z.object({
  applicationIds: z.array(z.string().min(1)).min(1).max(200),
  subject: z.string().min(1).max(300),
  body: z.string().min(1),
  templateId: z.string().optional(),
});

const BATCH_SIZE = 10;
const BATCH_DELAY_MS = 1000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only pipeline managers can bulk send
    if (!["ADMIN", "RECRUITER", "HIRING_MANAGER"].includes(ctx.role)) {
      return NextResponse.json(
        { error: "You do not have permission to send bulk emails" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const result = BulkSendSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }

    const { applicationIds, subject, body: emailBody } = result.data;

    // Fetch all applications + candidate data in one query (no N+1)
    const applications = await prisma.application.findMany({
      where: {
        id: { in: applicationIds },
        job: { organizationId: ctx.organizationId },
        deletedAt: null,
      },
      select: {
        id: true,
        seeker: {
          select: {
            account: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
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

    if (applications.length === 0) {
      return NextResponse.json({ error: "No matching candidates found" }, { status: 404 });
    }

    let sent = 0;
    let failed = 0;
    const errors: string[] = [];

    // Send in batches to respect rate limits
    for (let i = 0; i < applications.length; i += BATCH_SIZE) {
      const batch = applications.slice(i, i + BATCH_SIZE);

      await Promise.allSettled(
        batch.map(async (app) => {
          try {
            const candidateName = app.seeker.account.name || "Candidate";
            const candidateEmail = app.seeker.account.email;
            const jobTitle = app.job.title;
            const companyName = app.job.organization.name;

            // Interpolate variables per-recipient
            const variables: Record<string, string> = {
              candidate_name: candidateName,
              job_title: jobTitle,
              company_name: companyName,
            };

            const personalizedSubject = renderTemplate(subject, variables);
            const personalizedBody = renderTemplate(emailBody, variables);

            // Wrap in simple branded HTML template
            const htmlBody = `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="padding: 32px; background-color: #ffffff;">
                  ${personalizedBody}
                </div>
                <div style="background-color: #F3F7F6; padding: 24px; text-align: center;">
                  <p style="margin: 0; color: #666; font-size: 14px;">
                    &copy; ${new Date().getFullYear()} Canopy by Green Jobs Board
                  </p>
                </div>
              </div>
            `;

            await sendEmail({
              to: candidateEmail,
              subject: personalizedSubject,
              html: htmlBody,
              text: personalizedBody.replace(/<[^>]*>/g, ""),
            });

            sent++;
          } catch (err) {
            failed++;
            errors.push(
              `${app.seeker.account.email}: ${err instanceof Error ? err.message : "Unknown error"}`
            );
          }
        })
      );

      // Delay between batches (except last batch)
      if (i + BATCH_SIZE < applications.length) {
        await sleep(BATCH_DELAY_MS);
      }
    }

    logger.info("Bulk email sent", {
      sent,
      failed,
      total: applications.length,
      organizationId: ctx.organizationId,
      endpoint: "POST /api/canopy/emails/bulk-send",
    });

    return NextResponse.json({
      sent,
      failed,
      total: applications.length,
      ...(errors.length > 0 ? { errors: errors.slice(0, 10) } : {}),
    });
  } catch (error) {
    logger.error("Bulk email failed", {
      error: formatError(error),
      endpoint: "POST /api/canopy/emails/bulk-send",
    });
    return NextResponse.json({ error: "Failed to send bulk emails" }, { status: 500 });
  }
}
