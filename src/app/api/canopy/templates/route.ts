import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { z } from "zod";
import type { Job } from "@prisma/client";

/* -------------------------------------------------------------------
   Field key → Job model mapping

   These keys correspond to the toggle switches in the Create Template
   modal. Each key maps to one or more columns on the Job model.

   ------------------------------------------------------------------- */

const FIELD_EXTRACTORS: Record<string, (job: Job) => unknown> = {
  title: (job) => job.title,
  climateCategory: (job) => ({
    climateCategory: job.climateCategory,
    pathwayId: job.pathwayId,
  }),
  employmentType: (job) => job.employmentType,
  experienceLevel: (job) => job.experienceLevel,
  educationLevel: (job) => job.educationLevel,
  description: (job) => job.description,
  responsibilities: (job) => job.description, // MVP: same source as description
  qualifications: (job) => ({
    requiredCerts: job.requiredCerts,
    greenSkills: job.greenSkills,
  }),
  specialEducation: (job) => job.requiredCerts,
};

/* -------------------------------------------------------------------
   Helper: authenticate and get organizationId
   ------------------------------------------------------------------- */

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
    include: {
      orgMemberships: {
        select: { organizationId: true },
      },
    },
  });

  if (!account || account.orgMemberships.length === 0) {
    return { error: "No organization found", status: 403, organizationId: null };
  }

  return {
    error: null,
    status: null,
    organizationId: account.orgMemberships[0].organizationId,
  };
}

/* -------------------------------------------------------------------
   GET /api/canopy/templates

   Returns the authenticated employer's organization job templates.
   ------------------------------------------------------------------- */

export async function GET() {
  try {
    const { error, status, organizationId } = await getAuthenticatedOrg();
    if (error || !organizationId) {
      return NextResponse.json({ error }, { status: status ?? 500 });
    }

    const templates = await prisma.jobTemplate.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    const formattedTemplates = templates.map((template) => {
      let activeFields: string[] = [];
      try {
        activeFields = JSON.parse(template.activeFields) as string[];
      } catch {
        logger.warn("Malformed activeFields JSON", { templateId: template.id });
      }

      return {
        id: template.id,
        name: template.name,
        sourceJobId: template.sourceJobId,
        activeFields,
        createdAt: template.createdAt.toISOString(),
        updatedAt: template.updatedAt.toISOString(),
      };
    });

    return NextResponse.json({ templates: formattedTemplates });
  } catch (error) {
    logger.error("Error fetching job templates", {
      error: formatError(error),
      endpoint: "/api/canopy/templates",
    });
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 });
  }
}

/* -------------------------------------------------------------------
   POST /api/canopy/templates

   Creates a new job template from an existing role.
   ------------------------------------------------------------------- */

const CreateTemplateSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  sourceJobId: z.string().min(1, "Source job is required"),
  activeFields: z.array(z.string()).min(1, "At least one field must be selected"),
});

export async function POST(request: NextRequest) {
  try {
    const { error, status, organizationId } = await getAuthenticatedOrg();
    if (error || !organizationId) {
      return NextResponse.json({ error }, { status: status ?? 500 });
    }

    // Validate input
    const body = await request.json();
    const result = CreateTemplateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, sourceJobId, activeFields } = result.data;

    // Fetch source job (scoped by organizationId to prevent cross-tenant access)
    const sourceJob = await prisma.job.findFirst({
      where: {
        id: sourceJobId,
        organizationId,
      },
    });

    if (!sourceJob) {
      return NextResponse.json({ error: "Source job not found" }, { status: 404 });
    }

    // Build fieldData from source job using only the active fields
    const fieldData: Record<string, unknown> = {};

    for (const fieldKey of activeFields) {
      const extractor = FIELD_EXTRACTORS[fieldKey];
      if (extractor) {
        fieldData[fieldKey] = extractor(sourceJob);
      }
    }

    // Create the template
    const template = await prisma.jobTemplate.create({
      data: {
        name,
        sourceJobId,
        organizationId,
        fieldData: JSON.stringify(fieldData),
        activeFields: JSON.stringify(activeFields),
      },
    });

    logger.info("Job template created", {
      templateId: template.id,
      organizationId,
      sourceJobId,
      name,
    });

    // activeFields was just stringified above — safe to parse back
    let parsedActiveFields: string[] = activeFields;
    try {
      parsedActiveFields = JSON.parse(template.activeFields) as string[];
    } catch {
      // Fallback to the input array (already validated by Zod)
    }

    return NextResponse.json(
      {
        template: {
          id: template.id,
          name: template.name,
          sourceJobId: template.sourceJobId,
          activeFields: parsedActiveFields,
          createdAt: template.createdAt.toISOString(),
          updatedAt: template.updatedAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error("Error creating job template", {
      error: formatError(error),
      endpoint: "/api/canopy/templates",
    });
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 });
  }
}
