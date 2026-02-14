/**
 * Activity Service — Centralized activity logging and feed.
 *
 * Wraps AuditLog reads into a structured activity feed for
 * candidate timelines, application history, and dashboard feeds.
 */

import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { safeJsonParse } from "@/lib/safe-json";

/* -------------------------------------------------------------------
   Types
   ------------------------------------------------------------------- */

export interface ActivityItem {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  actorId: string | null;
  actorName: string | null;
  actorAvatar: string | null;
  changes: Record<string, { from: unknown; to: unknown }> | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  /** Human-readable summary generated from the action + changes */
  summary: string;
}

export interface ActivityFeedResult {
  items: ActivityItem[];
  total: number;
  hasMore: boolean;
}

/* -------------------------------------------------------------------
   Read: Activity Feed
   ------------------------------------------------------------------- */

/**
 * Get paginated activity feed for a specific entity or across entities.
 *
 * @param entityType - "Application", "Interview", "OfferRecord", etc.
 * @param entityId - The specific entity ID to filter by (optional)
 * @param limit - Number of items to return (default: 20)
 * @param offset - Number of items to skip (default: 0)
 */
export async function getActivityFeed(params: {
  organizationId: string;
  entityType?: string;
  entityId?: string;
  /** Get activities for all applications of a specific seeker */
  seekerId?: string;
  limit?: number;
  offset?: number;
}): Promise<ActivityFeedResult> {
  const { organizationId, entityType, entityId, seekerId, limit = 20, offset = 0 } = params;

  try {
    // Build the where clause based on filters
    const where: Record<string, unknown> = {};

    if (entityType) where.entityType = entityType;
    if (entityId) where.entityId = entityId;

    // If filtering by seeker, get all their application IDs first
    if (seekerId && !entityId) {
      const applications = await prisma.application.findMany({
        where: {
          seekerId,
          job: { organizationId },
        },
        select: { id: true },
      });
      where.entityId = { in: applications.map((a) => a.id) };
      where.entityType = "Application";
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.auditLog.count({ where }),
    ]);

    // Batch-fetch actor info for all unique userIds
    const actorIds = Array.from(new Set(logs.map((l) => l.userId).filter(Boolean))) as string[];
    const actors =
      actorIds.length > 0
        ? await prisma.account.findMany({
            where: { id: { in: actorIds } },
            select: { id: true, name: true, avatar: true },
          })
        : [];
    const actorMap = new Map(actors.map((a) => [a.id, a]));

    const items: ActivityItem[] = logs.map((log) => {
      const actor = log.userId ? actorMap.get(log.userId) : null;
      const changes = safeJsonParse<Record<string, { from: unknown; to: unknown }> | null>(
        log.changes,
        null
      );
      const metadata = safeJsonParse<Record<string, unknown> | null>(log.metadata, null);

      return {
        id: log.id,
        action: log.action,
        entityType: log.entityType,
        entityId: log.entityId,
        actorId: log.userId,
        actorName: actor?.name ?? null,
        actorAvatar: actor?.avatar ?? null,
        changes,
        metadata,
        createdAt: log.createdAt,
        summary: buildActivitySummary(log.action, log.entityType, changes, metadata, actor?.name),
      };
    });

    return {
      items,
      total,
      hasMore: offset + limit < total,
    };
  } catch (error) {
    logger.error("Failed to fetch activity feed", {
      error: formatError(error),
      entityType,
      entityId,
    });
    return { items: [], total: 0, hasMore: false };
  }
}

/* -------------------------------------------------------------------
   Helpers
   ------------------------------------------------------------------- */

function buildActivitySummary(
  action: string,
  entityType: string,
  changes: Record<string, { from: unknown; to: unknown }> | null,
  metadata: Record<string, unknown> | null,
  actorName: string | null | undefined
): string {
  const actor = actorName ?? "System";

  // Stage change
  if (entityType === "Application" && changes?.stage) {
    const from = String(changes.stage.from);
    const to = String(changes.stage.to);

    if (to === "rejected") {
      return `${actor} rejected the candidate`;
    }
    if (to === "hired") {
      return `${actor} marked the candidate as hired`;
    }
    if (to === "withdrawn") {
      return `Candidate withdrew their application`;
    }
    return `${actor} moved candidate from ${from} to ${to}`;
  }

  // Generic action summaries
  switch (action) {
    case "CREATE":
      return `${actor} created ${entityType.toLowerCase()}`;
    case "UPDATE":
      return `${actor} updated ${entityType.toLowerCase()}`;
    case "DELETE":
      return `${actor} deleted ${entityType.toLowerCase()}`;
    case "APPROVE":
      return `${actor} approved ${entityType.toLowerCase()}`;
    case "REJECT":
      return `${actor} rejected ${entityType.toLowerCase()}`;
    default:
      return `${actor} performed ${action.toLowerCase()} on ${entityType.toLowerCase()}`;
  }
}
