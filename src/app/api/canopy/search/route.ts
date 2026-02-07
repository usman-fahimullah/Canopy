import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { apiError, apiSuccess, apiValidationError } from "@/lib/api-response";
import { logger } from "@/lib/logger";
import { getServerUser } from "@/lib/supabase/get-server-user";
import { getCurrentOrganization } from "@/lib/auth-helpers";

/**
 * Unified search API for candidates and roles
 *
 * GET /api/canopy/search?q=search&type=all&limit=5
 *
 * Query params:
 * - q: search term (required)
 * - type: "candidates" | "roles" | "all" (default: "all")
 * - limit: number of results per type (default: 5, max: 50)
 *
 * Returns:
 * {
 *   candidates: [{ id, name, email, ... }],
 *   roles: [{ id, title, ... }]
 * }
 */

const SearchQuerySchema = z.object({
  q: z.string().min(1, "Search term is required").max(100),
  type: z.enum(["candidates", "roles", "all"]).default("all"),
  limit: z.coerce.number().min(1).max(50).default(5),
});

export async function GET(request: NextRequest) {
  try {
    // Authorization: require authenticated user
    const user = await getServerUser();
    if (!user) {
      return apiError("Unauthorized", 401);
    }

    // Get Account from Supabase user ID
    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      select: { id: true },
    });

    if (!account) {
      return apiError("Account not found", 404);
    }

    // Get organization context
    const organization = await getCurrentOrganization(account.id);
    if (!organization) {
      return apiError("Organization not found", 404);
    }

    // Validate and parse search params
    const params = SearchQuerySchema.safeParse(
      Object.fromEntries(request.nextUrl.searchParams)
    );

    if (!params.success) {
      return apiValidationError(params.error);
    }

    const { q, type, limit } = params.data;
    const searchTerm = `%${q}%`;

    logger.info("Search initiated", {
      organizationId: organization.id,
      accountId: account.id,
      searchTerm: q,
      type,
      limit,
    });

    const response: Record<string, any> = {};

    // Search candidates if requested
    if (type === "candidates" || type === "all") {
      const candidates = await prisma.application.findMany({
        where: {
          job: {
            organizationId: organization.id,
          },
          OR: [
            {
              seeker: {
                account: {
                  name: {
                    contains: searchTerm,
                    mode: "insensitive",
                  },
                },
              },
            },
            {
              seeker: {
                account: {
                  email: {
                    contains: searchTerm,
                    mode: "insensitive",
                  },
                },
              },
            },
          ],
        },
        select: {
          id: true,
          seeker: {
            select: {
              id: true,
              account: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        take: limit,
      });

      // Transform to candidate format with deduplication
      const candidateMap = new Map();
      candidates.forEach((app) => {
        const accountId = app.seeker.account.id;
        if (!candidateMap.has(accountId)) {
          candidateMap.set(accountId, {
            id: accountId,
            name: app.seeker.account.name,
            email: app.seeker.account.email,
          });
        }
      });

      response.candidates = Array.from(candidateMap.values()).slice(0, limit);
    }

    // Search roles if requested
    if (type === "roles" || type === "all") {
      const roles = await prisma.job.findMany({
        where: {
          organizationId: organization.id,
          title: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          title: true,
        },
        take: limit,
      });

      response.roles = roles;
    }

    // Ensure both keys exist even if no results
    if (!response.candidates) response.candidates = [];
    if (!response.roles) response.roles = [];

    logger.info("Search completed", {
      organizationId: organization.id,
      candidateCount: response.candidates.length,
      roleCount: response.roles.length,
    });

    return apiSuccess(response);
  } catch (error) {
    logger.error("Search failed", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return apiError("Search failed", 500);
  }
}
