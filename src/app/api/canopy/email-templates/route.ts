import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { createAuditLog } from "@/lib/audit";
import { standardLimiter } from "@/lib/rate-limit";
import { apiSuccess, apiError, apiValidationError, apiNotFound } from "@/lib/api-response";
import {
  CreateEmailTemplateSchema,
  EmailTemplateQuerySchema,
} from "@/lib/validators/email-templates";

/**
 * GET /api/canopy/email-templates
 *
 * List organization's email templates.
 * Auth: org member with ADMIN/RECRUITER role.
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = request.headers.get("x-forwarded-for") || "unknown";
    const limiter = await standardLimiter.check(10, identifier);
    if (!limiter.success) {
      return NextResponse.json({ error: "Rate limited" }, { status: 429 });
    }

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

    // Parse query params
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const result = EmailTemplateQuerySchema.safeParse(searchParams);
    if (!result.success) {
      return apiValidationError(result.error);
    }

    const { type, skip, take } = result.data;

    // Get org membership
    const membership = await prisma.organizationMember.findFirst({
      where: {
        accountId: account.id,
        role: { in: ["OWNER", "ADMIN", "RECRUITER"] },
      },
    });

    if (!membership) {
      return apiError("No organization access", 403);
    }

    // Build where clause
    const where: any = {
      organizationId: membership.organizationId,
    };

    if (type) {
      where.type = type;
    }

    // Fetch templates + count
    const [templates, total] = await Promise.all([
      prisma.emailTemplate.findMany({
        where,
        select: {
          id: true,
          type: true,
          name: true,
          subject: true,
          isDefault: true,
          variables: true,
          createdAt: true,
        },
        skip,
        take,
        orderBy: { createdAt: "desc" },
      }),
      prisma.emailTemplate.count({ where }),
    ]);

    logger.info("Email templates listed", {
      organizationId: membership.organizationId,
      count: templates.length,
      endpoint: "/api/canopy/email-templates",
    });

    return NextResponse.json(
      {
        data: templates,
        meta: { total, skip, take },
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Error listing email templates", {
      error: formatError(error),
      endpoint: "/api/canopy/email-templates",
    });
    return apiError("Failed to list templates", 500);
  }
}

/**
 * POST /api/canopy/email-templates
 *
 * Create a new email template.
 * Auth: org member with ADMIN/RECRUITER role.
 */
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const result = CreateEmailTemplateSchema.safeParse(body);
    if (!result.success) {
      return apiValidationError(result.error);
    }

    const data = result.data;

    // Get org membership
    const membership = await prisma.organizationMember.findFirst({
      where: {
        accountId: account.id,
        organizationId: { not: undefined },
        role: { in: ["OWNER", "ADMIN", "RECRUITER"] },
      },
    });

    if (!membership) {
      return apiError("Insufficient permissions", 403);
    }

    // Create template
    const template = await prisma.emailTemplate.create({
      data: {
        organizationId: membership.organizationId,
        type: data.type,
        name: data.name,
        subject: data.subject,
        content: data.content,
        variables: data.variables || [],
        isDefault: false,
      },
    });

    await createAuditLog({
      action: "CREATE",
      entityType: "EmailTemplate",
      entityId: template.id,
      userId: account.id,
      metadata: {
        templateName: data.name,
        templateType: data.type,
      },
    });

    logger.info("Email template created", {
      templateId: template.id,
      organizationId: membership.organizationId,
      endpoint: "/api/canopy/email-templates",
    });

    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    logger.error("Error creating email template", {
      error: formatError(error),
      endpoint: "/api/canopy/email-templates",
    });
    return apiError("Failed to create template", 500);
  }
}
