import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import type { AuthContext } from "@/lib/access-control";

/* -------------------------------------------------------------------
   Types
   ------------------------------------------------------------------- */

export interface TemplateListItem {
  id: string;
  name: string;
  sourceJobId: string | null;
  activeFields: string[];
  createdAt: string;
  updatedAt: string;
}

/* -------------------------------------------------------------------
   Service
   ------------------------------------------------------------------- */

/**
 * Fetch all templates for the authenticated user's org.
 *
 * Callable from both Server Components and API routes.
 */
export async function fetchTemplatesList(ctx: AuthContext): Promise<TemplateListItem[]> {
  const templates = await prisma.jobTemplate.findMany({
    where: { organizationId: ctx.organizationId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return templates.map((template) => {
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
}
