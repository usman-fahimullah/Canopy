import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { createAuditLog } from "@/lib/audit";
import { apiSuccess, apiError, apiValidationError, apiNotFound } from "@/lib/api-response";
import { UpdateEmailTemplateSchema } from "@/lib/validators/email-templates";

/**
 * GET /api/canopy/email-templates/[id]
 *
 * Get a single email template by ID.
 * Auth: org member.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return apiError("Unauthorized", 401);
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
    });

    if (!account) {
      return apiNotFound("Account not found");
    }

    // Get the template
    const template = await prisma.emailTemplate.findUnique({
      where: { id: id },
    });

    if (!template) {
      return apiNotFound("Email template not found");
    }

    // Verify org access
    const membership = await prisma.organizationMember.findFirst({
      where: {
        accountId: account.id,
        organizationId: template.organizationId,
      },
    });

    if (!membership) {
      return apiError("No access to this template", 403);
    }

    logger.info("Email template retrieved", {
      templateId: template.id,
      endpoint: "/api/canopy/email-templates/[id]",
    });

    return NextResponse.json({ template }, { status: 200 });
  } catch (error) {
    logger.error("Error retrieving email template", {
      error: formatError(error),
      endpoint: "/api/canopy/email-templates/[id]",
    });
    return apiError("Failed to retrieve template", 500);
  }
}

/**
 * PATCH /api/canopy/email-templates/[id]
 *
 * Update an email template.
 * Auth: org member with ADMIN/RECRUITER role.
 * Cannot update default templates.
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return apiError("Unauthorized", 401);
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
    });

    if (!account) {
      return apiNotFound("Account not found");
    }

    // Get the template
    const template = await prisma.emailTemplate.findUnique({
      where: { id: id },
    });

    if (!template) {
      return apiNotFound("Email template not found");
    }

    // Check if default (cannot update default templates)
    if (template.isDefault) {
      return apiError("Cannot update default email templates", 403);
    }

    // Verify org access with proper role
    const membership = await prisma.organizationMember.findFirst({
      where: {
        accountId: account.id,
        organizationId: template.organizationId,
        role: { in: ["ADMIN", "RECRUITER"] },
      },
    });

    if (!membership) {
      return apiError("Insufficient permissions", 403);
    }

    // Parse and validate update data
    const body = await request.json();
    const result = UpdateEmailTemplateSchema.safeParse(body);
    if (!result.success) {
      return apiValidationError(result.error);
    }

    const data = result.data;

    // Update template
    const updated = await prisma.emailTemplate.update({
      where: { id: id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.subject && { subject: data.subject }),
        ...(data.content && { content: data.content }),
        ...(data.variables && { variables: data.variables }),
      },
    });

    await createAuditLog({
      action: "UPDATE",
      entityType: "EmailTemplate",
      entityId: updated.id,
      userId: account.id,
      metadata: {
        templateName: updated.name,
        changes: Object.keys(data),
      },
    });

    logger.info("Email template updated", {
      templateId: updated.id,
      endpoint: "/api/canopy/email-templates/[id]",
    });

    return NextResponse.json({ template: updated }, { status: 200 });
  } catch (error) {
    logger.error("Error updating email template", {
      error: formatError(error),
      endpoint: "/api/canopy/email-templates/[id]",
    });
    return apiError("Failed to update template", 500);
  }
}

/**
 * DELETE /api/canopy/email-templates/[id]
 *
 * Delete an email template.
 * Auth: org member with ADMIN role.
 * Cannot delete default templates.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return apiError("Unauthorized", 401);
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
    });

    if (!account) {
      return apiNotFound("Account not found");
    }

    // Get the template
    const template = await prisma.emailTemplate.findUnique({
      where: { id: id },
    });

    if (!template) {
      return apiNotFound("Email template not found");
    }

    // Check if default (cannot delete default templates)
    if (template.isDefault) {
      return apiError("Cannot delete default email templates", 403);
    }

    // Verify org access with ADMIN role
    const membership = await prisma.organizationMember.findFirst({
      where: {
        accountId: account.id,
        organizationId: template.organizationId,
        role: { in: ["ADMIN"] },
      },
    });

    if (!membership) {
      return apiError("Insufficient permissions", 403);
    }

    // Delete template
    await prisma.emailTemplate.delete({
      where: { id: id },
    });

    await createAuditLog({
      action: "DELETE",
      entityType: "EmailTemplate",
      entityId: id,
      userId: account.id,
      metadata: {
        templateName: template.name,
      },
    });

    logger.info("Email template deleted", {
      templateId: id,
      endpoint: "/api/canopy/email-templates/[id]",
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    logger.error("Error deleting email template", {
      error: formatError(error),
      endpoint: "/api/canopy/email-templates/[id]",
    });
    return apiError("Failed to delete template", 500);
  }
}
