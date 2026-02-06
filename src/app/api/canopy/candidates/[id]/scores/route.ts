import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";

/**
 * POST /api/canopy/candidates/[id]/scores
 *
 * Submit a review score for a candidate's application.
 */
const CreateScoreSchema = z.object({
  applicationId: z.string().min(1),
  overallRating: z.number().int().min(1).max(5),
  recommendation: z.enum(["STRONG_YES", "YES", "NEUTRAL", "NO", "STRONG_NO"]),
  comments: z.string().optional(),
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: seekerId } = await params;

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
      select: { id: true, organizationId: true },
    });

    if (!membership) {
      return NextResponse.json({ error: "Organization membership required" }, { status: 403 });
    }

    // --- Validate body ---
    const body = await request.json();
    const parsed = CreateScoreSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const { applicationId, overallRating, recommendation, comments } = parsed.data;

    // --- Verify application belongs to this seeker + org ---
    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        seekerId,
        job: { organizationId: membership.organizationId },
      },
      select: { id: true },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // --- Create score ---
    const score = await prisma.score.create({
      data: {
        applicationId,
        scorerId: membership.id,
        overallRating,
        recommendation,
        comments: comments ?? null,
        responses: "{}",
      },
      select: {
        id: true,
        overallRating: true,
        recommendation: true,
        comments: true,
        createdAt: true,
        scorer: {
          select: {
            id: true,
            account: {
              select: { name: true, avatar: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ data: score }, { status: 201 });
  } catch (error) {
    logger.error("Failed to create score", {
      error: formatError(error),
    });
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
