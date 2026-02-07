import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";
import { z } from "zod";

/**
 * GET /api/canopy/candidates/duplicates
 *
 * Find potential duplicate candidates in the organization by email.
 *
 * Query params:
 * - email: string (required) - Email address to search for duplicates
 */

const duplicatesQuerySchema = z.object({
  email: z.string().email("Invalid email format"),
});

interface DuplicateCandidate {
  seekerId: string;
  name: string | null;
  email: string;
  applicationCount: number;
  jobs: string[];
}

export async function GET(request: NextRequest) {
  try {
    // --- Auth ---
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

    const orgId = membership.organizationId;

    // --- Parse query params ---
    const queryParams = duplicatesQuerySchema.parse({
      email: request.nextUrl.searchParams.get("email"),
    });

    // --- Find all seekers with this email in the organization ---
    const seekers = await prisma.seekerProfile.findMany({
      where: {
        account: { email: queryParams.email },
        applications: {
          some: {
            job: { organizationId: orgId },
          },
        },
      },
      select: {
        id: true,
        account: {
          select: {
            name: true,
            email: true,
          },
        },
        applications: {
          where: {
            job: { organizationId: orgId },
          },
          select: {
            id: true,
            job: {
              select: { title: true },
            },
          },
        },
      },
    });

    const duplicates: DuplicateCandidate[] = seekers.map((seeker) => ({
      seekerId: seeker.id,
      name: seeker.account.name,
      email: seeker.account.email,
      applicationCount: seeker.applications.length,
      jobs: seeker.applications.map((app) => app.job.title),
    }));

    logger.info("Duplicates checked", {
      email: queryParams.email,
      duplicateCount: duplicates.length,
      organizationId: orgId,
      endpoint: "/api/canopy/candidates/duplicates",
    });

    return NextResponse.json({
      data: {
        duplicates,
        hasDuplicates: duplicates.length > 1,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.flatten() },
        { status: 400 }
      );
    }

    logger.error("Failed to check for duplicates", {
      error: formatError(error),
      endpoint: "/api/canopy/candidates/duplicates",
    });
    return NextResponse.json({ error: "Failed to check for duplicates" }, { status: 500 });
  }
}
