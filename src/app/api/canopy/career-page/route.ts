import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";
import { DEFAULT_CAREER_PAGE_CONFIG } from "@/lib/career-pages/default-template";
import type { CareerPageConfig } from "@/lib/career-pages/types";

/**
 * GET /api/canopy/career-page
 *
 * Fetch the current org's career page config.
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      select: { id: true },
    });
    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const membership = await prisma.organizationMember.findFirst({
      where: { accountId: account.id },
      select: { organizationId: true },
    });
    if (!membership) {
      return NextResponse.json({ error: "Organization membership required" }, { status: 403 });
    }

    const org = await prisma.organization.findUnique({
      where: { id: membership.organizationId },
      select: {
        id: true,
        careerPageSlug: true,
        careerPageConfig: true,
        careerPageEnabled: true,
        name: true,
        slug: true,
        primaryColor: true,
        secondaryColor: true,
        fontFamily: true,
        logo: true,
      },
    });

    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const config = (org.careerPageConfig as CareerPageConfig | null) ?? DEFAULT_CAREER_PAGE_CONFIG;

    return NextResponse.json({
      data: {
        slug: org.careerPageSlug,
        enabled: org.careerPageEnabled,
        config,
        orgName: org.name,
        orgSlug: org.slug,
        organizationId: org.id,
        // Brand fields from Organization (for initializing theme)
        orgBrand: {
          primaryColor: org.primaryColor,
          secondaryColor: org.secondaryColor,
          fontFamily: org.fontFamily,
          logo: org.logo,
        },
      },
    });
  } catch (error) {
    logger.error("Error fetching career page config", {
      error: formatError(error),
      endpoint: "/api/canopy/career-page",
    });
    return NextResponse.json({ error: "Failed to fetch career page config" }, { status: 500 });
  }
}

/**
 * PATCH /api/canopy/career-page
 *
 * Update the career page config (auto-save from editor).
 */
const UpdateCareerPageSchema = z.object({
  config: z
    .object({
      sections: z.array(
        z
          .object({
            type: z.string(),
          })
          .passthrough()
      ),
      theme: z
        .object({
          primaryColor: z.string(),
          secondaryColor: z.string().optional(),
          accentColor: z.string().optional(),
          fontFamily: z.string(),
          headingFontFamily: z.string().optional(),
          logo: z.string().optional(),
          defaultSectionPadding: z.enum(["compact", "default", "spacious"]).optional(),
        })
        .passthrough(),
    })
    .optional(),
  enabled: z.boolean().optional(),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens")
    .optional(),
});

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      select: { id: true },
    });
    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const membership = await prisma.organizationMember.findFirst({
      where: {
        accountId: account.id,
        role: { in: ["OWNER", "ADMIN"] },
      },
      select: { organizationId: true },
    });
    if (!membership) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const result = UpdateCareerPageSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }

    const data = result.data;
    const updateData: Record<string, unknown> = {};

    if (data.config !== undefined) {
      updateData.careerPageConfig = data.config;

      // Sync brand fields from career page theme → Organization
      const theme = data.config.theme;
      if (theme.primaryColor) updateData.primaryColor = theme.primaryColor;
      if (theme.secondaryColor !== undefined) updateData.secondaryColor = theme.secondaryColor;
      if (theme.fontFamily) updateData.fontFamily = theme.fontFamily;
      if (theme.logo !== undefined) updateData.logo = theme.logo || null;
    }
    if (data.enabled !== undefined) updateData.careerPageEnabled = data.enabled;
    if (data.slug !== undefined) {
      updateData.careerPageSlug = data.slug;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    await prisma.organization.update({
      where: { id: membership.organizationId },
      data: updateData,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // Handle unique constraint on slug
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "This career page URL is already taken. Please choose a different slug." },
        { status: 409 }
      );
    }

    logger.error("Error updating career page config", {
      error: formatError(error),
      endpoint: "/api/canopy/career-page",
    });
    return NextResponse.json({ error: "Failed to update career page" }, { status: 500 });
  }
}
