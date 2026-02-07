import { NextRequest } from "next/server";
import { logger, formatError } from "@/lib/logger";
import { readLimiter } from "@/lib/rate-limit";
import { apiError, apiSuccess, apiRateLimited } from "@/lib/api-response";
import { getAuthContext } from "@/lib/access-control";
import {
  getPipelineFunnel,
  getHiringStats,
  getApplicationsOverTime,
  getTopJobs,
  getSourceBreakdown,
} from "@/lib/analytics/hiring";

/**
 * GET /api/canopy/analytics
 *
 * Returns comprehensive analytics dashboard data for the employer portal.
 * Includes pipeline funnel, hiring stats, application trends, and top jobs.
 *
 * Response shape:
 * {
 *   pipeline: [{ stage: string, count: number }],
 *   stats: { timeToHire, appsPerRole, offerRate, pipelineVelocity },
 *   applicationsOverTime: [{ week: ISO date string, count: number }],
 *   topJobs: [{ id, title, applications, hired }],
 *   sourceBreakdown: [{ source: string, count: number }]
 * }
 *
 * Auth: Required (any authenticated employer member)
 * Rate limit: 60 requests per minute (read-heavy endpoint)
 */

export async function GET(request: NextRequest) {
  try {
    // --- Rate limit ---
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rateLimitResult = await readLimiter.check(60, ip);
    if (!rateLimitResult.success) {
      logger.warn("Rate limit exceeded on /api/canopy/analytics", {
        ip,
        endpoint: "/api/canopy/analytics",
      });
      return apiRateLimited();
    }

    // --- Auth ---
    const ctx = await getAuthContext();
    if (!ctx) {
      return apiError("Unauthorized", 401);
    }

    // For scoped roles, pass their assigned job IDs to filter analytics
    const jobIds = ctx.hasFullAccess ? undefined : ctx.assignedJobIds;

    // --- Fetch all analytics data in parallel ---
    const [pipeline, stats, applicationsOverTime, topJobs, sourceBreakdown] = await Promise.all([
      getPipelineFunnel(ctx.organizationId, jobIds),
      getHiringStats(ctx.organizationId, jobIds),
      getApplicationsOverTime(ctx.organizationId, jobIds),
      getTopJobs(ctx.organizationId, 5, jobIds),
      getSourceBreakdown(ctx.organizationId, jobIds),
    ]);

    logger.info("Analytics data fetched successfully", {
      organizationId: ctx.organizationId,
      endpoint: "/api/canopy/analytics",
      userId: ctx.accountId,
    });

    return apiSuccess({
      pipeline,
      stats,
      applicationsOverTime,
      topJobs,
      sourceBreakdown,
    });
  } catch (error) {
    logger.error("Failed to fetch analytics data", {
      error: formatError(error),
      endpoint: "/api/canopy/analytics",
    });
    return apiError("Failed to fetch analytics data", 500);
  }
}
