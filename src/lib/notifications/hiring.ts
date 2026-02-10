// Hiring-specific notification functions for Canopy ATS
// Handles candidate notifications, approver notifications, etc.

import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { createNotification } from "@/lib/notifications";
import {
  applicationReceivedEmail,
  stageChangedEmail,
  interviewScheduledEmail,
  applicationRejectedEmail,
  approvalRequestEmail,
  approvalResponseEmail,
} from "@/lib/email/hiring-templates";
import {
  sendSlackNotification,
  buildNewApplicationMessage,
  buildInterviewScheduledMessage,
  buildStageMoveMessage,
} from "@/lib/integrations/slack";

interface ApplicationReceivedParams {
  applicationId: string;
  candidateEmail: string;
  candidateName: string;
  jobTitle: string;
  companyName: string;
  organizationId?: string;
}

/**
 * Notify candidate that their application was received
 */
export async function createApplicationReceivedNotification(params: ApplicationReceivedParams) {
  try {
    const account = await prisma.account.findUnique({
      where: { email: params.candidateEmail },
    });

    if (!account) {
      logger.warn("Candidate account not found for notification", {
        email: params.candidateEmail,
        endpoint: "lib/notifications/hiring",
      });
      return;
    }

    const emailPayload = applicationReceivedEmail({
      candidateName: params.candidateName,
      candidateEmail: params.candidateEmail,
      jobTitle: params.jobTitle,
      companyName: params.companyName,
    });

    await createNotification({
      accountId: account.id,
      type: "APPLICATION_RECEIVED" as any,
      title: `Application received for ${params.jobTitle}`,
      body: `Your application to ${params.companyName} has been received and is being reviewed.`,
      data: {
        jobTitle: params.jobTitle,
        companyName: params.companyName,
        url: `/jobs/applications`,
      },
      sendEmailNotification: true,
      emailPayload,
    });

    logger.info("Application received notification sent", {
      candidateEmail: params.candidateEmail,
      jobTitle: params.jobTitle,
      endpoint: "lib/notifications/hiring",
    });

    // Fire-and-forget Slack notification
    if (params.organizationId) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://greenjobsboard.us";
      const msg = buildNewApplicationMessage({
        candidateName: params.candidateName,
        jobTitle: params.jobTitle,
        applicationUrl: `${appUrl}/canopy/applications/${params.applicationId}`,
      });
      sendSlackNotification(params.organizationId, msg.text, msg.blocks).catch(() => {});
    }
  } catch (error) {
    logger.error("Failed to send application received notification", {
      error: formatError(error),
      email: params.candidateEmail,
      endpoint: "lib/notifications/hiring",
    });
  }
}

interface StageChangedParams {
  applicationId: string;
  candidateEmail: string;
  candidateName: string;
  jobTitle: string;
  companyName: string;
  previousStage: string;
  newStage: string;
  organizationId?: string;
}

/**
 * Notify candidate of a stage change (e.g., screening → interview)
 */
export async function createStageChangedNotification(params: StageChangedParams) {
  try {
    const account = await prisma.account.findUnique({
      where: { email: params.candidateEmail },
    });

    if (!account) {
      logger.warn("Candidate account not found for stage change notification", {
        email: params.candidateEmail,
        endpoint: "lib/notifications/hiring",
      });
      return;
    }

    const emailPayload = stageChangedEmail({
      candidateName: params.candidateName,
      candidateEmail: params.candidateEmail,
      jobTitle: params.jobTitle,
      companyName: params.companyName,
      newStage: params.newStage,
    });

    await createNotification({
      accountId: account.id,
      type: "STAGE_CHANGED" as any,
      title: `Application progressed for ${params.jobTitle}`,
      body: `Great news! Your application has moved to the ${params.newStage} stage.`,
      data: {
        applicationId: params.applicationId,
        jobTitle: params.jobTitle,
        companyName: params.companyName,
        newStage: params.newStage,
        url: `/jobs/applications/${params.applicationId}`,
      },
      sendEmailNotification: true,
      emailPayload,
    });

    logger.info("Stage changed notification sent", {
      applicationId: params.applicationId,
      newStage: params.newStage,
      endpoint: "lib/notifications/hiring",
    });

    // Fire-and-forget Slack notification
    if (params.organizationId) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://greenjobsboard.us";
      const msg = buildStageMoveMessage({
        candidateName: params.candidateName,
        jobTitle: params.jobTitle,
        previousStage: params.previousStage,
        newStage: params.newStage,
        applicationUrl: `${appUrl}/canopy/applications/${params.applicationId}`,
      });
      sendSlackNotification(params.organizationId, msg.text, msg.blocks).catch(() => {});
    }
  } catch (error) {
    logger.error("Failed to send stage changed notification", {
      error: formatError(error),
      applicationId: params.applicationId,
      endpoint: "lib/notifications/hiring",
    });
  }
}

interface InterviewScheduledParams {
  applicationId: string;
  candidateEmail: string;
  candidateName: string;
  jobTitle: string;
  companyName: string;
  interviewDate: Date;
  interviewerName: string;
  meetingLink?: string;
  organizationId?: string;
}

/**
 * Notify candidate that an interview has been scheduled
 */
export async function createInterviewScheduledNotification(params: InterviewScheduledParams) {
  try {
    const account = await prisma.account.findUnique({
      where: { email: params.candidateEmail },
    });

    if (!account) {
      logger.warn("Candidate account not found for interview notification", {
        email: params.candidateEmail,
        endpoint: "lib/notifications/hiring",
      });
      return;
    }

    const emailPayload = interviewScheduledEmail({
      candidateName: params.candidateName,
      candidateEmail: params.candidateEmail,
      jobTitle: params.jobTitle,
      companyName: params.companyName,
      interviewDate: params.interviewDate,
      interviewerName: params.interviewerName,
      meetingLink: params.meetingLink,
    });

    await createNotification({
      accountId: account.id,
      type: "INTERVIEW_SCHEDULED" as any,
      title: `Interview scheduled for ${params.jobTitle}`,
      body: `Your interview with ${params.interviewerName} is scheduled for ${params.interviewDate.toLocaleDateString()}.`,
      data: {
        applicationId: params.applicationId,
        jobTitle: params.jobTitle,
        companyName: params.companyName,
        interviewDate: params.interviewDate.toISOString(),
        url: `/jobs/applications/${params.applicationId}`,
      },
      sendEmailNotification: true,
      emailPayload,
    });

    logger.info("Interview scheduled notification sent", {
      applicationId: params.applicationId,
      interviewDate: params.interviewDate,
      endpoint: "lib/notifications/hiring",
    });

    // Fire-and-forget Slack notification
    if (params.organizationId) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://greenjobsboard.us";
      const msg = buildInterviewScheduledMessage({
        candidateName: params.candidateName,
        jobTitle: params.jobTitle,
        interviewerName: params.interviewerName,
        scheduledAt: params.interviewDate.toLocaleString(),
        applicationUrl: `${appUrl}/canopy/applications/${params.applicationId}`,
      });
      sendSlackNotification(params.organizationId, msg.text, msg.blocks).catch(() => {});
    }
  } catch (error) {
    logger.error("Failed to send interview scheduled notification", {
      error: formatError(error),
      applicationId: params.applicationId,
      endpoint: "lib/notifications/hiring",
    });
  }
}

interface ApplicationRejectedParams {
  applicationId: string;
  candidateEmail: string;
  candidateName: string;
  jobTitle: string;
  companyName: string;
  rejectionReason?: string;
}

/**
 * Notify candidate that their application was rejected
 */
export async function createApplicationRejectedNotification(params: ApplicationRejectedParams) {
  try {
    const account = await prisma.account.findUnique({
      where: { email: params.candidateEmail },
    });

    if (!account) {
      logger.warn("Candidate account not found for rejection notification", {
        email: params.candidateEmail,
        endpoint: "lib/notifications/hiring",
      });
      return;
    }

    const emailPayload = applicationRejectedEmail({
      candidateName: params.candidateName,
      candidateEmail: params.candidateEmail,
      jobTitle: params.jobTitle,
      companyName: params.companyName,
      rejectionReason: params.rejectionReason,
    });

    await createNotification({
      accountId: account.id,
      type: "APPLICATION_REJECTED" as any,
      title: `Application update for ${params.jobTitle}`,
      body: `Thank you for applying to ${params.companyName}. Unfortunately, we are moving forward with other candidates.`,
      data: {
        applicationId: params.applicationId,
        jobTitle: params.jobTitle,
        companyName: params.companyName,
        url: `/jobs/applications/${params.applicationId}`,
      },
      sendEmailNotification: true,
      emailPayload,
    });

    logger.info("Application rejected notification sent", {
      applicationId: params.applicationId,
      jobTitle: params.jobTitle,
      endpoint: "lib/notifications/hiring",
    });
  } catch (error) {
    logger.error("Failed to send application rejected notification", {
      error: formatError(error),
      applicationId: params.applicationId,
      endpoint: "lib/notifications/hiring",
    });
  }
}

interface ApprovalRequestParams {
  approvalRequestId: string;
  approverEmail: string;
  approverName: string;
  requesterName: string;
  entityType: "JOB" | "OFFER";
  entityTitle: string;
  organizationId: string;
}

/**
 * Notify approver that a new approval request is pending
 */
export async function createApprovalRequestNotification(params: ApprovalRequestParams) {
  try {
    const account = await prisma.account.findUnique({
      where: { email: params.approverEmail },
    });

    if (!account) {
      logger.warn("Approver account not found for approval notification", {
        email: params.approverEmail,
        endpoint: "lib/notifications/hiring",
      });
      return;
    }

    const emailPayload = approvalRequestEmail({
      approverName: params.approverName,
      approverEmail: params.approverEmail,
      requesterName: params.requesterName,
      entityType: params.entityType,
      entityTitle: params.entityTitle,
    });

    const actionUrl =
      params.entityType === "JOB"
        ? `/approvals/jobs/${params.approvalRequestId}`
        : `/approvals/offers/${params.approvalRequestId}`;

    await createNotification({
      accountId: account.id,
      type: "APPROVAL_PENDING" as any,
      title: `Approval needed: ${params.entityTitle}`,
      body: `${params.requesterName} requested approval for ${params.entityType === "JOB" ? "job posting" : "offer"}: ${params.entityTitle}`,
      data: {
        approvalRequestId: params.approvalRequestId,
        entityType: params.entityType,
        entityTitle: params.entityTitle,
        url: actionUrl,
      },
      sendEmailNotification: true,
      emailPayload,
    });

    logger.info("Approval request notification sent", {
      approvalRequestId: params.approvalRequestId,
      entityType: params.entityType,
      endpoint: "lib/notifications/hiring",
    });
  } catch (error) {
    logger.error("Failed to send approval request notification", {
      error: formatError(error),
      approvalRequestId: params.approvalRequestId,
      endpoint: "lib/notifications/hiring",
    });
  }
}

interface ApprovalResponseParams {
  approvalRequestId: string;
  requesterEmail: string;
  requesterName: string;
  approverName: string;
  entityType: "JOB" | "OFFER";
  entityTitle: string;
  status: "APPROVED" | "REJECTED";
  rejectionReason?: string;
  organizationId: string;
}

/**
 * Notify requester of approval decision (approved or rejected)
 */
export async function createApprovalResponseNotification(params: ApprovalResponseParams) {
  try {
    const account = await prisma.account.findUnique({
      where: { email: params.requesterEmail },
    });

    if (!account) {
      logger.warn("Requester account not found for approval response notification", {
        email: params.requesterEmail,
        endpoint: "lib/notifications/hiring",
      });
      return;
    }

    const emailPayload = approvalResponseEmail({
      requesterName: params.requesterName,
      requesterEmail: params.requesterEmail,
      approverName: params.approverName,
      entityType: params.entityType,
      entityTitle: params.entityTitle,
      status: params.status,
      rejectionReason: params.rejectionReason,
    });

    const notificationType =
      params.status === "APPROVED" ? "APPROVAL_APPROVED" : "APPROVAL_REJECTED";
    const title =
      params.status === "APPROVED"
        ? `${params.entityTitle} has been approved`
        : `${params.entityTitle} was not approved`;
    const body =
      params.status === "APPROVED"
        ? `${params.approverName} approved your ${params.entityType === "JOB" ? "job posting" : "offer"}.`
        : `${params.approverName} did not approve your ${params.entityType === "JOB" ? "job posting" : "offer"}.`;

    await createNotification({
      accountId: account.id,
      type: notificationType as any,
      title,
      body,
      data: {
        approvalRequestId: params.approvalRequestId,
        entityType: params.entityType,
        entityTitle: params.entityTitle,
        status: params.status,
        url: `/dashboard/approvals`,
      },
      sendEmailNotification: true,
      emailPayload,
    });

    logger.info("Approval response notification sent", {
      approvalRequestId: params.approvalRequestId,
      status: params.status,
      endpoint: "lib/notifications/hiring",
    });
  } catch (error) {
    logger.error("Failed to send approval response notification", {
      error: formatError(error),
      approvalRequestId: params.approvalRequestId,
      endpoint: "lib/notifications/hiring",
    });
  }
}
