import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { sendEmail } from "@/lib/email";

/**
 * POST /api/canopy/emails/schedule/process
 *
 * Cron endpoint: processes pending scheduled emails whose scheduledFor
 * time has passed. Sends the email to all recipients and updates status.
 *
 * Auth: Bearer token via CRON_SECRET env var (not user auth).
 * Processes max 10 scheduled emails per invocation to stay within
 * serverless execution limits.
 */

const MAX_EMAILS_PER_RUN = 10;

interface Recipient {
  email: string;
  name?: string;
  applicationId?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate via CRON_SECRET
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      logger.error("CRON_SECRET not configured", {
        endpoint: "POST /api/canopy/emails/schedule/process",
      });
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find pending emails whose scheduled time has passed
    const pendingEmails = await prisma.scheduledEmail.findMany({
      where: {
        status: "PENDING",
        scheduledFor: { lte: new Date() },
      },
      select: {
        id: true,
        organizationId: true,
        createdById: true,
        recipients: true,
        subject: true,
        body: true,
        templateId: true,
        organization: {
          select: { name: true },
        },
        createdBy: {
          select: {
            account: {
              select: { email: true },
            },
          },
        },
      },
      orderBy: { scheduledFor: "asc" },
      take: MAX_EMAILS_PER_RUN,
    });

    if (pendingEmails.length === 0) {
      return NextResponse.json({ processed: 0, sent: 0, failed: 0 });
    }

    let totalSent = 0;
    let totalFailed = 0;

    for (const scheduled of pendingEmails) {
      let recipients: Recipient[] = [];
      try {
        recipients = JSON.parse(scheduled.recipients) as Recipient[];
      } catch {
        // Invalid JSON — mark as failed
        await prisma.scheduledEmail.update({
          where: { id: scheduled.id },
          data: {
            status: "FAILED",
            error: "Invalid recipients JSON",
          },
        });
        totalFailed++;
        logger.error("Invalid recipients JSON in scheduled email", {
          scheduledEmailId: scheduled.id,
          endpoint: "POST /api/canopy/emails/schedule/process",
        });
        continue;
      }

      if (recipients.length === 0) {
        await prisma.scheduledEmail.update({
          where: { id: scheduled.id },
          data: {
            status: "FAILED",
            error: "No recipients",
          },
        });
        totalFailed++;
        continue;
      }

      const companyName = scheduled.organization.name;
      const replyTo = scheduled.createdBy.account.email;

      // Build branded HTML
      const html = buildEmailHtml(scheduled.body, companyName);
      const text = stripHtml(scheduled.body);

      let sentCount = 0;
      let failedCount = 0;
      const errors: string[] = [];

      for (const recipient of recipients) {
        const emailResult = await sendEmail({
          to: recipient.email,
          subject: scheduled.subject,
          html,
          text,
          replyTo,
        });

        if (emailResult.success) {
          sentCount++;

          // Log to EmailLog as SCHEDULED send type
          prisma.emailLog
            .create({
              data: {
                organizationId: scheduled.organizationId,
                sentById: scheduled.createdById,
                recipientEmail: recipient.email,
                recipientName: recipient.name ?? null,
                applicationId: recipient.applicationId ?? null,
                subject: scheduled.subject,
                body: scheduled.body,
                templateId: scheduled.templateId ?? null,
                status: "SENT",
                sendType: "SCHEDULED",
              },
            })
            .catch((err) => {
              logger.error("Failed to log scheduled email send", {
                error: formatError(err),
                recipientEmail: recipient.email,
                scheduledEmailId: scheduled.id,
              });
            });
        } else {
          failedCount++;
          errors.push(`${recipient.email}: ${emailResult.error}`);

          // Log failed send
          prisma.emailLog
            .create({
              data: {
                organizationId: scheduled.organizationId,
                sentById: scheduled.createdById,
                recipientEmail: recipient.email,
                recipientName: recipient.name ?? null,
                applicationId: recipient.applicationId ?? null,
                subject: scheduled.subject,
                body: scheduled.body,
                templateId: scheduled.templateId ?? null,
                status: "FAILED",
                error: emailResult.error ?? "Unknown error",
                sendType: "SCHEDULED",
              },
            })
            .catch((err) => {
              logger.error("Failed to log scheduled email failure", {
                error: formatError(err),
                recipientEmail: recipient.email,
                scheduledEmailId: scheduled.id,
              });
            });
        }
      }

      // Update the ScheduledEmail record based on results
      if (failedCount === recipients.length) {
        // All recipients failed
        await prisma.scheduledEmail.update({
          where: { id: scheduled.id },
          data: {
            status: "FAILED",
            error: errors.slice(0, 5).join("; "),
          },
        });
        totalFailed++;
      } else {
        // At least some succeeded — mark as SENT
        await prisma.scheduledEmail.update({
          where: { id: scheduled.id },
          data: {
            status: "SENT",
            sentAt: new Date(),
            ...(failedCount > 0
              ? {
                  error: `${failedCount}/${recipients.length} failed: ${errors.slice(0, 3).join("; ")}`,
                }
              : {}),
          },
        });
        totalSent++;
      }

      logger.info("Processed scheduled email", {
        scheduledEmailId: scheduled.id,
        sent: sentCount,
        failed: failedCount,
        total: recipients.length,
        endpoint: "POST /api/canopy/emails/schedule/process",
      });
    }

    logger.info("Scheduled email processing complete", {
      processed: pendingEmails.length,
      sent: totalSent,
      failed: totalFailed,
      endpoint: "POST /api/canopy/emails/schedule/process",
    });

    return NextResponse.json({
      processed: pendingEmails.length,
      sent: totalSent,
      failed: totalFailed,
    });
  } catch (error) {
    logger.error("Scheduled email processing error", {
      error: formatError(error),
      endpoint: "POST /api/canopy/emails/schedule/process",
    });
    return NextResponse.json({ error: "Failed to process scheduled emails" }, { status: 500 });
  }
}

/**
 * Wrap email body in branded HTML template matching send route style.
 */
function buildEmailHtml(bodyHtml: string, companyName: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="padding: 32px; background-color: #ffffff;">
        ${bodyHtml}
      </div>
      <div style="background-color: #F3F7F6; padding: 24px; text-align: center;">
        <p style="margin: 0; color: #666; font-size: 14px;">
          Sent via Canopy by Green Jobs Board on behalf of ${companyName}
        </p>
      </div>
    </div>
  `;
}

/**
 * Simple HTML to plain text conversion for the text fallback.
 */
function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
