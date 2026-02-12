import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { CLIMATE_TEMPLATES, getClimateTemplate } from "@/lib/templates/climate-templates";
import { logger, formatError } from "@/lib/logger";
import { z } from "zod";

/* -------------------------------------------------------------------
   GET /api/canopy/templates/prebuilt

   Returns the list of pre-built climate job templates.
   ------------------------------------------------------------------- */

export async function GET() {
  try {
    const templates = CLIMATE_TEMPLATES.map((t) => ({
      id: t.id,
      name: t.name,
      title: t.title,
      climateCategory: t.climateCategory,
      experienceLevel: t.experienceLevel,
      greenSkills: t.greenSkills,
      requiredCerts: t.requiredCerts,
    }));

    return NextResponse.json({ templates });
  } catch (error) {
    logger.error("Error fetching prebuilt templates", {
      error: formatError(error),
      endpoint: "/api/canopy/templates/prebuilt",
    });
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 });
  }
}

/* -------------------------------------------------------------------
   POST /api/canopy/templates/prebuilt

   Creates a new draft role from a pre-built climate template.
   ------------------------------------------------------------------- */

const CreateFromTemplateSchema = z.object({
  templateId: z.string().min(1, "Template ID is required"),
});

export async function POST(request: NextRequest) {
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
      include: { orgMemberships: { select: { organizationId: true, role: true } } },
    });

    if (!account || account.orgMemberships.length === 0) {
      return NextResponse.json({ error: "No organization found" }, { status: 403 });
    }

    const organizationId = account.orgMemberships[0].organizationId;

    const body = await request.json();
    const result = CreateFromTemplateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const template = getClimateTemplate(result.data.templateId);
    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    // Generate a unique slug
    const baseSlug = template.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const slug = `${baseSlug}-${Date.now().toString(36)}`;

    const job = await prisma.job.create({
      data: {
        title: template.title,
        slug,
        description: template.description,
        employmentType: template.employmentType,
        experienceLevel: template.experienceLevel,
        climateCategory: template.climateCategory,
        greenSkills: template.greenSkills,
        requiredCerts: template.requiredCerts,
        impactDescription: template.impactDescription,
        stages: JSON.stringify(template.suggestedStages),
        status: "DRAFT",
        organizationId,
        formConfig: {
          structuredDescription: {
            description: template.description,
            responsibilities: "",
            requiredQuals: "",
            desiredQuals: "",
          },
        },
      },
      select: { id: true, title: true, slug: true, status: true },
    });

    logger.info("Role created from prebuilt template", {
      jobId: job.id,
      templateId: template.id,
      organizationId,
    });

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    logger.error("Error creating role from template", {
      error: formatError(error),
      endpoint: "/api/canopy/templates/prebuilt",
    });
    return NextResponse.json({ error: "Failed to create role from template" }, { status: 500 });
  }
}
