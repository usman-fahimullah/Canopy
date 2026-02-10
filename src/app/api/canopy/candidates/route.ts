import { NextRequest, NextResponse } from "next/server";
import { logger, formatError } from "@/lib/logger";
import { z } from "zod";
import { getAuthContext } from "@/lib/access-control";
import { fetchCandidatesList } from "@/lib/services/candidates";

/**
 * GET /api/canopy/candidates
 *
 * List all candidates (applications) across org's jobs with advanced filtering and pagination.
 * Org-scoped via job.organizationId
 */

const GetCandidatesSchema = z.object({
  skip: z.coerce.number().int().min(0).default(0),
  take: z.coerce.number().int().min(1).max(100).default(20),
  stage: z.string().optional(),
  matchScoreMin: z.coerce.number().min(0).max(100).optional(),
  matchScoreMax: z.coerce.number().min(0).max(100).optional(),
  source: z.string().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  experienceLevel: z.enum(["ENTRY", "INTERMEDIATE", "SENIOR", "EXECUTIVE"]).optional(),
  search: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate query params
    const params = GetCandidatesSchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
    if (!params.success) {
      return NextResponse.json(
        { error: "Invalid parameters", details: params.error.flatten() },
        { status: 422 }
      );
    }

    const data = await fetchCandidatesList(ctx, params.data);
    return NextResponse.json(data);
  } catch (error) {
    logger.error("Error fetching candidates", {
      error: formatError(error),
      endpoint: "/api/canopy/candidates",
    });
    return NextResponse.json({ error: "Failed to fetch candidates" }, { status: 500 });
  }
}
