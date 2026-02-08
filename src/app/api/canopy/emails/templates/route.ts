import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { getAuthContext } from "@/lib/access-control";

/**
 * GET /api/canopy/emails/templates
 *
 * List email templates for the authenticated user's organization.
 * Supports filtering by type.
 */
const GetTemplatesSchema = z.object({
  type: z.enum(["REJECTION", "INTERVIEW_INVITE", "STAGE_ADVANCE", "WELCOME", "CUSTOM"]).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = GetTemplatesSchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
    if (!params.success) {
      return NextResponse.json(
        { error: "Invalid parameters", details: params.error.flatten() },
        { status: 422 }
      );
    }

    const templates = await prisma.emailTemplate.findMany({
      where: {
        organizationId: ctx.organizationId,
        ...(params.data.type ? { type: params.data.type } : {}),
      },
      orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
    });

    return NextResponse.json({ data: templates });
  } catch (error) {
    logger.error("Error fetching email templates", {
      error: formatError(error),
      endpoint: "/api/canopy/emails/templates",
    });
    return NextResponse.json({ error: "Failed to fetch email templates" }, { status: 500 });
  }
}

/**
 * POST /api/canopy/emails/templates
 *
 * Create a new email template for the organization.
 */
const CreateTemplateSchema = z.object({
  type: z.enum(["REJECTION", "INTERVIEW_INVITE", "STAGE_ADVANCE", "WELCOME", "CUSTOM"]),
  name: z.string().min(1).max(100),
  subject: z.string().min(1).max(200),
  content: z.string().min(1),
  variables: z.array(z.string()).optional().default([]),
});

export async function POST(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only OWNER/ADMIN can create templates
    if (!["OWNER", "ADMIN"].includes(ctx.role)) {
      return NextResponse.json(
        { error: "You do not have permission to create email templates" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const result = CreateTemplateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }

    const template = await prisma.emailTemplate.create({
      data: {
        organizationId: ctx.organizationId,
        ...result.data,
      },
    });

    logger.info("Email template created", {
      templateId: template.id,
      type: template.type,
      endpoint: "/api/canopy/emails/templates",
    });

    return NextResponse.json({ data: template }, { status: 201 });
  } catch (error) {
    logger.error("Error creating email template", {
      error: formatError(error),
      endpoint: "/api/canopy/emails/templates",
    });
    return NextResponse.json({ error: "Failed to create email template" }, { status: 500 });
  }
}

/**
 * PATCH /api/canopy/emails/templates
 *
 * Update an existing email template.
 * Expects `id` in the request body.
 */
const UpdateTemplateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100).optional(),
  subject: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
  variables: z.array(z.string()).optional(),
});

export async function PATCH(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!["OWNER", "ADMIN"].includes(ctx.role)) {
      return NextResponse.json(
        { error: "You do not have permission to update email templates" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const result = UpdateTemplateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }

    const { id, ...updates } = result.data;

    // Verify template belongs to org
    const existing = await prisma.emailTemplate.findFirst({
      where: { id, organizationId: ctx.organizationId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    const template = await prisma.emailTemplate.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json({ data: template });
  } catch (error) {
    logger.error("Error updating email template", {
      error: formatError(error),
      endpoint: "/api/canopy/emails/templates",
    });
    return NextResponse.json({ error: "Failed to update email template" }, { status: 500 });
  }
}

/**
 * DELETE /api/canopy/emails/templates
 *
 * Delete a non-default email template.
 * Expects `id` as a query param.
 */
export async function DELETE(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!["OWNER", "ADMIN"].includes(ctx.role)) {
      return NextResponse.json(
        { error: "You do not have permission to delete email templates" },
        { status: 403 }
      );
    }

    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Template ID is required" }, { status: 422 });
    }

    const existing = await prisma.emailTemplate.findFirst({
      where: { id, organizationId: ctx.organizationId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    if (existing.isDefault) {
      return NextResponse.json({ error: "Cannot delete default templates" }, { status: 400 });
    }

    await prisma.emailTemplate.delete({ where: { id } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    logger.error("Error deleting email template", {
      error: formatError(error),
      endpoint: "/api/canopy/emails/templates",
    });
    return NextResponse.json({ error: "Failed to delete email template" }, { status: 500 });
  }
}
