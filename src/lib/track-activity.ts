import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";

const DEBOUNCE_MS = 5 * 60 * 1000; // 5 minutes
const recentUpdates = new Map<string, number>();

/**
 * Track user activity — updates lastActiveAt at most once every 5 minutes
 * per account. Call fire-and-forget (no await) from API routes.
 */
export function trackActivity(accountId: string): void {
  const now = Date.now();
  const lastUpdate = recentUpdates.get(accountId);

  if (lastUpdate && now - lastUpdate < DEBOUNCE_MS) {
    return;
  }

  recentUpdates.set(accountId, now);

  // Periodic cleanup to prevent memory leak
  if (recentUpdates.size > 1000) {
    const threshold = now - DEBOUNCE_MS;
    const keysToDelete: string[] = [];
    recentUpdates.forEach((ts, id) => {
      if (ts < threshold) keysToDelete.push(id);
    });
    keysToDelete.forEach((id) => recentUpdates.delete(id));
  }

  prisma.account
    .update({
      where: { id: accountId },
      data: { lastActiveAt: new Date() },
    })
    .catch((error) => {
      logger.error("Failed to track activity", {
        error: formatError(error),
        accountId,
      });
    });
}
