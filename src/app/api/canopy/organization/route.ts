import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/access-control";
import { logger, formatError } from "@/lib/logger";
import { standardLimiter } from "@/lib/rate-limit";
import { apiSuccess, apiError, apiValidationError } from "@/lib/api-response";

const UpdateOrgSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional().nullable(),
  website: z.string().url().or(z.literal("")).optional().nullable(),
  size: z.string().optional().nullable(),
  industries: z.array(z.string()).optional(),
  location: z.string().optional().nullable(),
  isBipocOwned: z.boolean().optional(),
  isWomenOwned: z.boolean().optional(),
  isVeteranOwned: z.boolean().optional(),
  primaryColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color")
    .optional(),
  secondaryColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color")
    .optional()
    .nullable(),
  fontFamily: z.string().max(100).optional(),
});

/**
 * GET /api/canopy/organization
 *
 * Returns the current user's organization profile.
 * Any org member can view.
 */
export async function GET() {
  try {
    const ctx = await getAuthContext();
    if (!ctx) {
      return apiError("Unauthorized", 401);
    }

    const organization = await prisma.organization.findUnique({
      where: { id: ctx.organizationId },
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        description: true,
        website: true,
        location: true,
        size: true,
        industries: true,
        primaryColor: true,
        secondaryColor: true,
        fontFamily: true,
        isBipocOwned: true,
        isWomenOwned: true,
        isVeteranOwned: true,
        onboardingCompleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!organization) {
      return apiError("Organization not found", 404);
    }

    return apiSuccess({ organization });
  } catch (error) {
    logger.error("Fetch organization error", {
      error: formatError(error),
      endpoint: "/api/canopy/organization",
    });
    return apiError("Failed to fetch organization", 500);
  }
}

/**
 * PATCH /api/canopy/organization
 *
 * Updates organization profile fields. ADMIN only.
 */
export async function PATCH(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = await standardLimiter.check(10, `org-update:${ip}`);
    if (!success) {
      return apiError("Too many requests. Please try again shortly.", 429);
    }

    const ctx = await getAuthContext();
    if (!ctx) {
      return apiError("Unauthorized", 401);
    }

    if (ctx.role !== "ADMIN") {
      return apiError("Only admins can update organization settings", 403);
    }

    const body = await request.json();
    const result = UpdateOrgSchema.safeParse(body);
    if (!result.success) {
      return apiValidationError(result.error);
    }

    const updated = await prisma.organization.update({
      where: { id: ctx.organizationId },
      data: result.data,
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        description: true,
        website: true,
        location: true,
        size: true,
        industries: true,
        primaryColor: true,
        secondaryColor: true,
        fontFamily: true,
        isBipocOwned: true,
        isWomenOwned: true,
        isVeteranOwned: true,
        onboardingCompleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    logger.info("Organization updated", {
      organizationId: ctx.organizationId,
      updatedBy: ctx.accountId,
    });

    return apiSuccess({ organization: updated });
  } catch (error) {
    logger.error("Update organization error", {
      error: formatError(error),
      endpoint: "/api/canopy/organization",
    });
    return apiError("Failed to update organization", 500);
  }
}
