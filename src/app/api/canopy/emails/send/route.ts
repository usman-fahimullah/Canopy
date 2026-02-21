import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { getAuthContext, canManagePipeline } from "@/lib/access-control";
import { canMessageCandidates } from "@/lib/billing/feature-gates";
import { sendEmail } from "@/lib/email";
import { renderTemplate } from "@/lib/email/render";
import { trackActivity } from "@/lib/track-activity";

/**
 * POST /api/canopy/emails/send
 *
 * Send an email to one or more candidates. Supports template variable
 * interpolation via {{variable}} placeholders.
 *
 * Used by CandidateEmailDialog for single-candidate email.
 */
const SendEmailSchema = z.object({
  to: z.array(z.string().email()).min(1).max(50),
  cc: z.array(z.string().email()).optional(),
  bcc: z.array(z.string().email()).optional(),
  subject: z.string().min(1).max(300),
  body: z.string().min(1),
  applicationId: z.string().optional(),
  templateId: z.string().optional(),
  /** Pipeline stage this email is being sent at */
  stageId: z.string().optional(),
  // Variables for template interpolation
  variables: z.record(z.string(), z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canManagePipeline(ctx)) {
      return NextResponse.json(
        { error: "You do not have permission to send emails" },
        { status: 403 }
      );
    }

    // Billing gate: messaging requires ATS plan
    const messagingGate = canMessageCandidates(ctx.planTier);
    if (!messagingGate.allowed) {
      return NextResponse.json(
        {
          error: messagingGate.reason,
          upgradeRequired: messagingGate.upgradeRequired,
          requiredTier: messagingGate.upgradeRequired,
        },
        { status: 403 }
      );
    }

    const rawBody = await request.json();
    const result = SendEmailSchema.safeParse(rawBody);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }

    const { to, cc, bcc, subject, body, applicationId, templateId, stageId, variables } =
      result.data;

    // Get organization info for email branding
    const org = await prisma.organization.findUnique({
      where: { id: ctx.organizationId },
      select: { name: true },
    });
    const companyName = org?.name ?? "Our Team";

    // Get sender info
    const sender = await prisma.account.findUnique({
      where: { id: ctx.accountId },
      select: { name: true, email: true },
    });
    const senderName = sender?.name ?? "Hiring Team";

    // Interpolate template variables in subject and body
    const templateVars: Record<string, string> = {
      company_name: companyName,
      sender_name: senderName,
      ...variables,
    };

    const renderedSubject = renderTemplate(subject, templateVars);
    const renderedBody = renderTemplate(body, templateVars);

    // Build branded HTML wrapper
    const html = buildEmailHtml(renderedBody, companyName);
    const text = stripHtml(renderedBody);

    // Send to each recipient
    let sent = 0;
    const errors: string[] = [];

    for (const recipient of to) {
      const emailResult = await sendEmail({
        to: recipient,
        subject: renderedSubject,
        html,
        text,
        replyTo: sender?.email,
      });

      if (emailResult.success) {
        sent++;
        // Fire-and-forget: log successful send
        prisma.emailLog
          .create({
            data: {
              organizationId: ctx.organizationId,
              sentById: ctx.memberId,
              recipientEmail: recipient,
              recipientName: variables?.candidate_name ?? null,
              applicationId: applicationId ?? null,
              subject: renderedSubject,
              body: renderedBody,
              templateId: templateId ?? null,
              status: "SENT",
              sendType: "MANUAL",
              stageId: stageId ?? null,
            },
          })
          .catch((err) => {
            logger.error("Failed to log email send", {
              error: formatError(err),
              recipientEmail: recipient,
            });
          });
      } else {
        errors.push(`${recipient}: ${emailResult.error}`);
        // Fire-and-forget: log failed send
        prisma.emailLog
          .create({
            data: {
              organizationId: ctx.organizationId,
              sentById: ctx.memberId,
              recipientEmail: recipient,
              recipientName: variables?.candidate_name ?? null,
              applicationId: applicationId ?? null,
              subject: renderedSubject,
              body: renderedBody,
              templateId: templateId ?? null,
              status: "FAILED",
              error: emailResult.error ?? "Unknown error",
              sendType: "MANUAL",
              stageId: stageId ?? null,
            },
          })
          .catch((err) => {
            logger.error("Failed to log email failure", {
              error: formatError(err),
              recipientEmail: recipient,
            });
          });
      }
    }

    // Send CC/BCC (informational, not tracked)
    if (cc?.length) {
      for (const recipient of cc) {
        await sendEmail({ to: recipient, subject: renderedSubject, html, text }).catch((err) => {
          logger.warn("Failed to send CC email (non-blocking)", {
            error: formatError(err),
            recipient,
          });
        });
      }
    }
    if (bcc?.length) {
      for (const recipient of bcc) {
        await sendEmail({ to: recipient, subject: renderedSubject, html, text }).catch((err) => {
          logger.warn("Failed to send BCC email (non-blocking)", {
            error: formatError(err),
            recipient,
          });
        });
      }
    }

    // Track user activity
    trackActivity(ctx.accountId);

    logger.info("Email sent", {
      sent,
      total: to.length,
      applicationId,
      endpoint: "/api/canopy/emails/send",
    });

    return NextResponse.json({
      success: true,
      sent,
      total: to.length,
      ...(errors.length > 0 ? { errors } : {}),
    });
  } catch (error) {
    logger.error("Error sending email", {
      error: formatError(error),
      endpoint: "/api/canopy/emails/send",
    });
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}

/**
 * Wrap email body in branded HTML template matching existing hiring-templates.ts style.
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
