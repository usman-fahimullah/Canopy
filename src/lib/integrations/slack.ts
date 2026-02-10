/**
 * Slack Integration Service
 *
 * Sends notifications to Slack channels via Nango proxy.
 * All operations are fire-and-forget — failures never block primary operations.
 */

import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { nangoProxy } from "./nango";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SlackBlock {
  type: string;
  text?: { type: string; text: string; emoji?: boolean };
  elements?: Array<{ type: string; text?: { type: string; text: string }; url?: string }>;
  fields?: Array<{ type: string; text: string }>;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

async function getSlackConnection(organizationId: string) {
  const connection = await prisma.integrationConnection.findFirst({
    where: {
      organizationId,
      provider: "slack",
      status: "active",
    },
    select: {
      id: true,
      config: true,
    },
  });

  if (!connection) return null;

  const config = connection.config as { channelId?: string } | null;
  return {
    connectionId: connection.id,
    channelId: config?.channelId || null,
  };
}

// ---------------------------------------------------------------------------
// Core send function
// ---------------------------------------------------------------------------

/**
 * Send a notification to the org's configured Slack channel.
 * No-ops if Slack is not connected or no channel is configured.
 */
export async function sendSlackNotification(
  organizationId: string,
  text: string,
  blocks?: SlackBlock[]
): Promise<boolean> {
  try {
    const slack = await getSlackConnection(organizationId);
    if (!slack || !slack.channelId) {
      return false;
    }

    await nangoProxy({
      provider: "slack",
      scope: "organization",
      ids: { organizationId },
      endpoint: "/api/chat.postMessage",
      method: "POST",
      data: {
        channel: slack.channelId,
        text,
        ...(blocks && { blocks }),
      },
    });

    return true;
  } catch (error) {
    logger.warn("Failed to send Slack notification (best-effort)", {
      organizationId,
      error: formatError(error),
    });
    return false;
  }
}

// ---------------------------------------------------------------------------
// Message builders
// ---------------------------------------------------------------------------

export function buildNewApplicationMessage(params: {
  candidateName: string;
  jobTitle: string;
  applicationUrl: string;
}): { text: string; blocks: SlackBlock[] } {
  const text = `New application from ${params.candidateName} for ${params.jobTitle}`;
  return {
    text,
    blocks: [
      {
        type: "header",
        text: { type: "plain_text", text: "New Application", emoji: true },
      },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*Candidate:*\n${params.candidateName}` },
          { type: "mrkdwn", text: `*Position:*\n${params.jobTitle}` },
        ],
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "View Application" },
            url: params.applicationUrl,
          },
        ],
      },
    ],
  };
}

export function buildInterviewScheduledMessage(params: {
  candidateName: string;
  jobTitle: string;
  interviewerName: string;
  scheduledAt: string;
  applicationUrl: string;
}): { text: string; blocks: SlackBlock[] } {
  const text = `Interview scheduled: ${params.candidateName} for ${params.jobTitle}`;
  return {
    text,
    blocks: [
      {
        type: "header",
        text: { type: "plain_text", text: "Interview Scheduled", emoji: true },
      },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*Candidate:*\n${params.candidateName}` },
          { type: "mrkdwn", text: `*Position:*\n${params.jobTitle}` },
          { type: "mrkdwn", text: `*Interviewer:*\n${params.interviewerName}` },
          { type: "mrkdwn", text: `*When:*\n${params.scheduledAt}` },
        ],
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "View Details" },
            url: params.applicationUrl,
          },
        ],
      },
    ],
  };
}

export function buildStageMoveMessage(params: {
  candidateName: string;
  jobTitle: string;
  previousStage: string;
  newStage: string;
  applicationUrl: string;
}): { text: string; blocks: SlackBlock[] } {
  const text = `${params.candidateName} moved to ${params.newStage} for ${params.jobTitle}`;
  return {
    text,
    blocks: [
      {
        type: "header",
        text: { type: "plain_text", text: "Pipeline Update", emoji: true },
      },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*Candidate:*\n${params.candidateName}` },
          { type: "mrkdwn", text: `*Position:*\n${params.jobTitle}` },
          {
            type: "mrkdwn",
            text: `*Stage:*\n~${params.previousStage}~ → ${params.newStage}`,
          },
        ],
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "View Application" },
            url: params.applicationUrl,
          },
        ],
      },
    ],
  };
}

export function buildOfferSentMessage(params: {
  candidateName: string;
  jobTitle: string;
  applicationUrl: string;
}): { text: string; blocks: SlackBlock[] } {
  const text = `Offer sent to ${params.candidateName} for ${params.jobTitle}`;
  return {
    text,
    blocks: [
      {
        type: "header",
        text: { type: "plain_text", text: "Offer Sent", emoji: true },
      },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*Candidate:*\n${params.candidateName}` },
          { type: "mrkdwn", text: `*Position:*\n${params.jobTitle}` },
        ],
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "View Details" },
            url: params.applicationUrl,
          },
        ],
      },
    ],
  };
}
