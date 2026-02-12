import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { z } from "zod";

async function getAuthenticatedOrg() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized", status: 401, organizationId: null };
  }

  const account = await prisma.account.findUnique({
    where: { supabaseId: user.id },
    include: { orgMemberships: { select: { organizationId: true } } },
  });

  if (!account || account.orgMemberships.length === 0) {
    return { error: "No organization found", status: 403, organizationId: null };
  }

  return { error: null, status: null, organizationId: account.orgMemberships[0].organizationId };
}

/* -------------------------------------------------------------------
   GET /api/canopy/templates/[id]
   ------------------------------------------------------------------- */

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { error, status, organizationId } = await getAuthenticatedOrg();
    if (error || !organizationId) {
      return NextResponse.json({ error }, { status: status ?? 500 });
    }

    const template = await prisma.jobTemplate.findFirst({
      where: { id, organizationId },
    });

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    let activeFields: string[] = [];
    let fieldData: Record<string, unknown> = {};
    try {
      activeFields = JSON.parse(template.activeFields) as string[];
    } catch {
      /* empty */
    }
    try {
      fieldData = JSON.parse(template.fieldData) as Record<string, unknown>;
    } catch {
      /* empty */
    }

    return NextResponse.json({
      template: {
        id: template.id,
        name: template.name,
        sourceJobId: template.sourceJobId,
        activeFields,
        fieldData,
        createdAt: template.createdAt.toISOString(),
        updatedAt: template.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    logger.error("Error fetching template", {
      error: formatError(error),
      endpoint: "/api/canopy/templates/[id]",
    });
    return NextResponse.json({ error: "Failed to fetch template" }, { status: 500 });
  }
}

/* -------------------------------------------------------------------
   PATCH /api/canopy/templates/[id]
   ------------------------------------------------------------------- */

const UpdateTemplateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { error, status, organizationId } = await getAuthenticatedOrg();
    if (error || !organizationId) {
      return NextResponse.json({ error }, { status: status ?? 500 });
    }

    const body = await request.json();
    const result = UpdateTemplateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const updated = await prisma.jobTemplate.updateMany({
      where: { id, organizationId },
      data: { ...(result.data.name ? { name: result.data.name } : {}) },
    });

    if (updated.count === 0) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error updating template", {
      error: formatError(error),
      endpoint: "/api/canopy/templates/[id]",
    });
    return NextResponse.json({ error: "Failed to update template" }, { status: 500 });
  }
}

/* -------------------------------------------------------------------
   DELETE /api/canopy/templates/[id]
   ------------------------------------------------------------------- */

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error, status, organizationId } = await getAuthenticatedOrg();
    if (error || !organizationId) {
      return NextResponse.json({ error }, { status: status ?? 500 });
    }

    const deleted = await prisma.jobTemplate.deleteMany({
      where: { id, organizationId },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    logger.info("Template deleted", { templateId: id, organizationId });
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error deleting template", {
      error: formatError(error),
      endpoint: "/api/canopy/templates/[id]",
    });
    return NextResponse.json({ error: "Failed to delete template" }, { status: 500 });
  }
}
