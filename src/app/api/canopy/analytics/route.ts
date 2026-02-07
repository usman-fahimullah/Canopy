import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { readLimiter } from "@/lib/rate-limit";
import { apiError, apiSuccess, apiRateLimited } from "@/lib/api-response";
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
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return apiError("Unauthorized", 401);
    }

    // Get account and org membership
    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      include: { orgMemberships: { select: { organizationId: true } } },
    });

    if (!account || account.orgMemberships.length === 0) {
      return apiError("No organization found", 403);
    }

    const organizationId = account.orgMemberships[0].organizationId;

    // --- Fetch all analytics data in parallel ---
    const [pipeline, stats, applicationsOverTime, topJobs, sourceBreakdown] = await Promise.all([
      getPipelineFunnel(organizationId),
      getHiringStats(organizationId),
      getApplicationsOverTime(organizationId),
      getTopJobs(organizationId, 5),
      getSourceBreakdown(organizationId),
    ]);

    logger.info("Analytics data fetched successfully", {
      organizationId,
      endpoint: "/api/canopy/analytics",
      userId: account.id,
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
