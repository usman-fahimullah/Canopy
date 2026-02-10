/**
 * Syndication Service
 *
 * Orchestrates posting, updating, and removing jobs on external platforms.
 * Called by the queue webhook handler (async) or directly for testing.
 */

import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import type { SyndicationPlatform, SyndicationAction, SyndicationJobPayload } from "./types";
import { getAdapter } from "./platforms";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://greenjobsboard.us";

/**
 * Enqueue a syndication task by creating a "pending" SyndicationLog entry.
 *
 * The queue consumer (webhook) picks up pending logs and processes them.
 * This design avoids coupling to any specific queue provider — works with
 * cron polling, QStash, or any push-based trigger.
 */
export async function enqueueSyndication(
  jobId: string,
  platforms: SyndicationPlatform[],
  action: SyndicationAction
) {
  const logs = await prisma.syndicationLog.createMany({
    data: platforms.map((platform) => ({
      jobId,
      platform,
      action,
      status: "pending",
    })),
  });

  logger.info("Enqueued syndication tasks", {
    jobId,
    platforms,
    action,
    count: logs.count,
  });

  return logs;
}

/**
 * Process all pending syndication logs.
 *
 * Called by the webhook endpoint on each trigger (cron or push).
 * Processes up to `batchSize` logs per invocation to stay within
 * serverless execution limits.
 */
export async function processPendingSyndication(batchSize = 20) {
  const pendingLogs = await prisma.syndicationLog.findMany({
    where: { status: "pending" },
    orderBy: { createdAt: "asc" },
    take: batchSize,
    include: {
      job: {
        select: {
          id: true,
          title: true,
          description: true,
          location: true,
          locationType: true,
          employmentType: true,
          salaryMin: true,
          salaryMax: true,
          salaryCurrency: true,
          climateCategory: true,
          publishedAt: true,
          closesAt: true,
          organizationId: true,
          organization: {
            select: { id: true, name: true, logo: true, slug: true },
          },
        },
      },
    },
  });

  if (pendingLogs.length === 0) {
    return { processed: 0, succeeded: 0, failed: 0 };
  }

  let succeeded = 0;
  let failed = 0;

  for (const log of pendingLogs) {
    try {
      const adapter = getAdapter(log.platform as SyndicationPlatform);

      if (!adapter) {
        await prisma.syndicationLog.update({
          where: { id: log.id },
          data: {
            status: "failed",
            error: `No adapter for platform: ${log.platform}`,
          },
        });
        failed++;
        continue;
      }

      const payload: SyndicationJobPayload = {
        jobId: log.job.id,
        organizationId: log.job.organization.id,
        title: log.job.title,
        description: log.job.description,
        location: log.job.location,
        locationType: log.job.locationType,
        employmentType: log.job.employmentType,
        salaryMin: log.job.salaryMin,
        salaryMax: log.job.salaryMax,
        salaryCurrency: log.job.salaryCurrency,
        climateCategory: log.job.climateCategory,
        publishedAt: log.job.publishedAt,
        closesAt: log.job.closesAt,
        applyUrl: `${APP_URL}/apply/${log.job.id}`,
        organization: log.job.organization,
      };

      let result;

      switch (log.action) {
        case "post":
          result = await adapter.post(payload);
          break;
        case "update": {
          // Find existing externalId for this platform
          const existingLog = await prisma.syndicationLog.findFirst({
            where: {
              jobId: log.jobId,
              platform: log.platform,
              status: "success",
              externalId: { not: null },
            },
            orderBy: { createdAt: "desc" },
          });
          if (existingLog?.externalId) {
            result = await adapter.update(payload, existingLog.externalId);
          } else {
            // No existing post — fall back to new post
            result = await adapter.post(payload);
          }
          break;
        }
        case "remove": {
          const removeLog = await prisma.syndicationLog.findFirst({
            where: {
              jobId: log.jobId,
              platform: log.platform,
              status: "success",
              externalId: { not: null },
            },
            orderBy: { createdAt: "desc" },
          });
          if (removeLog?.externalId) {
            result = await adapter.remove(removeLog.externalId);
          } else {
            // Nothing to remove
            result = { success: true };
          }
          break;
        }
        default:
          result = { success: false, error: `Unknown action: ${log.action}` };
      }

      await prisma.syndicationLog.update({
        where: { id: log.id },
        data: {
          status: result.success ? "success" : "failed",
          externalId: result.externalId ?? log.externalId,
          error: result.error ?? null,
        },
      });

      if (result.success) {
        succeeded++;
      } else {
        failed++;
      }
    } catch (error) {
      logger.error("Syndication processing error", {
        logId: log.id,
        jobId: log.jobId,
        platform: log.platform,
        error: formatError(error),
      });

      await prisma.syndicationLog.update({
        where: { id: log.id },
        data: {
          status: "failed",
          error: error instanceof Error ? error.message : "Unknown error",
        },
      });
      failed++;
    }
  }

  logger.info("Syndication batch complete", {
    processed: pendingLogs.length,
    succeeded,
    failed,
  });

  return { processed: pendingLogs.length, succeeded, failed };
}

/**
 * Get syndication status for a job across all platforms.
 */
export async function getJobSyndicationStatus(jobId: string) {
  const logs = await prisma.syndicationLog.findMany({
    where: { jobId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      platform: true,
      action: true,
      status: true,
      externalId: true,
      error: true,
      createdAt: true,
    },
  });

  // Group by platform, get latest status
  const platforms = new Map<string, (typeof logs)[number]>();
  for (const log of logs) {
    if (!platforms.has(log.platform)) {
      platforms.set(log.platform, log);
    }
  }

  return {
    logs,
    latestByPlatform: Object.fromEntries(platforms),
  };
}

/**
 * Retry a failed syndication log entry.
 */
export async function retrySyndication(logId: string) {
  const log = await prisma.syndicationLog.findUnique({
    where: { id: logId },
    select: { id: true, status: true },
  });

  if (!log || log.status !== "failed") {
    return null;
  }

  return prisma.syndicationLog.update({
    where: { id: logId },
    data: { status: "pending", error: null },
  });
}
