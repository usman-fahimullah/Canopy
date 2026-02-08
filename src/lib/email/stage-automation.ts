/**
 * Auto-email on stage change.
 *
 * When a candidate moves to a new pipeline stage, this service checks
 * the job's emailAutomation config and sends the appropriate template
 * email automatically.
 */

import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { sendEmail } from "@/lib/email";
import { renderTemplate } from "@/lib/email/render";
import { safeJsonParse } from "@/lib/safe-json";
import { stageChangedEmail, applicationRejectedEmail } from "@/lib/email/hiring-templates";

interface StageAutomationConfig {
  [stageId: string]: {
    enabled: boolean;
    templateId: string;
  };
}

/**
 * Check the job's email automation config and send an email to the
 * candidate if automation is enabled for the given stage.
 *
 * Call this fire-and-forget from the stage change endpoint.
 */
export async function sendStageChangeAutoEmail(params: {
  applicationId: string;
  newStage: string;
  jobId: string;
}): Promise<void> {
  const { applicationId, newStage, jobId } = params;

  try {
    // Fetch job automation config + candidate info in parallel
    const [job, application] = await Promise.all([
      prisma.job.findUnique({
        where: { id: jobId },
        select: {
          emailAutomation: true,
          title: true,
          organization: { select: { name: true } },
        },
      }),
      prisma.application.findUnique({
        where: { id: applicationId },
        select: {
          seeker: {
            select: {
              account: { select: { email: true, name: true } },
            },
          },
        },
      }),
    ]);

    if (!job || !application?.seeker?.account?.email) return;

    const candidateEmail = application.seeker.account.email;
    const candidateName = application.seeker.account.name ?? "Candidate";
    const jobTitle = job.title;
    const companyName = job.organization?.name ?? "Our Team";

    // Parse automation config
    const config = safeJsonParse<StageAutomationConfig>(job.emailAutomation, {});
    const stageConfig = config[newStage];

    // If no automation configured for this stage, skip
    if (!stageConfig?.enabled) return;

    let emailPayload: { to: string; subject: string; html: string; text: string };

    if (stageConfig.templateId) {
      // Use custom template
      const template = await prisma.emailTemplate.findUnique({
        where: { id: stageConfig.templateId },
        select: { subject: true, content: true },
      });

      if (template) {
        const variables: Record<string, string> = {
          candidate_name: candidateName,
          candidate_first_name: candidateName.split(" ")[0] ?? candidateName,
          candidate_email: candidateEmail,
          job_title: jobTitle,
          company_name: companyName,
          stage_name: newStage,
        };

        const renderedSubject = renderTemplate(template.subject, variables);
        const renderedBody = renderTemplate(template.content, variables);

        emailPayload = {
          to: candidateEmail,
          subject: renderedSubject,
          html: wrapInBrandedHtml(renderedBody, companyName),
          text: stripHtml(renderedBody),
        };
      } else {
        // Template was deleted — fall back to default
        emailPayload = getFallbackEmail(newStage, {
          candidateEmail,
          candidateName,
          jobTitle,
          companyName,
        });
      }
    } else {
      // No template selected — use built-in defaults
      emailPayload = getFallbackEmail(newStage, {
        candidateEmail,
        candidateName,
        jobTitle,
        companyName,
      });
    }

    await sendEmail(emailPayload);

    logger.info("Stage automation email sent", {
      applicationId,
      newStage,
      jobId,
      candidateEmail,
      endpoint: "lib/email/stage-automation",
    });
  } catch (error) {
    logger.error("Failed to send stage automation email", {
      error: formatError(error),
      applicationId,
      newStage,
      jobId,
      endpoint: "lib/email/stage-automation",
    });
  }
}

/**
 * Fall back to the built-in hiring-templates for common stages.
 */
function getFallbackEmail(
  stage: string,
  data: {
    candidateEmail: string;
    candidateName: string;
    jobTitle: string;
    companyName: string;
  }
): { to: string; subject: string; html: string; text: string } {
  if (stage === "rejected") {
    return applicationRejectedEmail({
      candidateEmail: data.candidateEmail,
      candidateName: data.candidateName,
      jobTitle: data.jobTitle,
      companyName: data.companyName,
    });
  }

  return stageChangedEmail({
    candidateEmail: data.candidateEmail,
    candidateName: data.candidateName,
    jobTitle: data.jobTitle,
    companyName: data.companyName,
    newStage: stage,
  });
}

function wrapInBrandedHtml(bodyHtml: string, companyName: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #0A3D2C; padding: 32px; text-align: center;">
        <h1 style="color: white; margin: 0;">Application Update</h1>
      </div>
      <div style="padding: 32px; background-color: #ffffff;">
        ${bodyHtml}
      </div>
      <div style="background-color: #F3F7F6; padding: 24px; text-align: center;">
        <p style="margin: 0; color: #666; font-size: 14px;">
          &copy; ${new Date().getFullYear()} Canopy by Green Jobs Board. Climate hiring, simplified.
        </p>
      </div>
    </div>
  `;
}

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
