import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { getAuthContext, canAccessJob } from "@/lib/access-control";
import { safeJsonParse } from "@/lib/safe-json";

/**
 * GET /api/canopy/roles/[id]/email-automation
 *
 * Returns the email automation config for a job, plus available templates.
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: jobId } = await params;
    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canAccessJob(ctx, jobId)) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    const [job, templates] = await Promise.all([
      prisma.job.findFirst({
        where: { id: jobId, organizationId: ctx.organizationId },
        select: { emailAutomation: true, stages: true },
      }),
      prisma.emailTemplate.findMany({
        where: { organizationId: ctx.organizationId },
        select: { id: true, name: true, type: true, subject: true },
        orderBy: [{ isDefault: "desc" }, { name: "asc" }],
      }),
    ]);

    if (!job) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    const config = safeJsonParse<Record<string, { enabled: boolean; templateId: string }>>(
      job.emailAutomation,
      {}
    );

    return NextResponse.json({
      data: {
        config,
        stages: safeJsonParse<{ id: string; name: string }[]>(job.stages, []),
        templates,
      },
    });
  } catch (error) {
    logger.error("Error fetching email automation config", {
      error: formatError(error),
      endpoint: "/api/canopy/roles/[id]/email-automation",
    });
    return NextResponse.json({ error: "Failed to fetch email automation config" }, { status: 500 });
  }
}

/**
 * PUT /api/canopy/roles/[id]/email-automation
 *
 * Update the email automation config for a job.
 * Config shape: { [stageId]: { enabled: boolean, templateId: string } }
 */
const UpdateAutomationSchema = z.record(
  z.string(),
  z.object({
    enabled: z.boolean(),
    templateId: z.string().optional().default(""),
  })
);

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: jobId } = await params;
    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only ADMIN can configure automation
    if (!["ADMIN"].includes(ctx.role)) {
      return NextResponse.json(
        { error: "You do not have permission to configure email automation" },
        { status: 403 }
      );
    }

    if (!canAccessJob(ctx, jobId)) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    const body = await request.json();
    const result = UpdateAutomationSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }

    // Verify job belongs to org
    const job = await prisma.job.findFirst({
      where: { id: jobId, organizationId: ctx.organizationId },
      select: { id: true },
    });

    if (!job) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    await prisma.job.update({
      where: { id: jobId },
      data: { emailAutomation: JSON.stringify(result.data) },
    });

    logger.info("Email automation config updated", {
      jobId,
      endpoint: "/api/canopy/roles/[id]/email-automation",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error updating email automation config", {
      error: formatError(error),
      endpoint: "/api/canopy/roles/[id]/email-automation",
    });
    return NextResponse.json(
      { error: "Failed to update email automation config" },
      { status: 500 }
    );
  }
}
