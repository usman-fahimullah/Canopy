import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";
import { createAuditLog } from "@/lib/audit";
import { z } from "zod";

/**
 * POST /api/canopy/candidates/merge
 *
 * Merge duplicate candidates. Moves all notes from secondary candidates to primary,
 * while keeping all applications separate (they're unique per seeker+job).
 *
 * Body:
 * {
 *   primaryId: string - The ID of the primary candidate to merge into
 *   secondaryIds: string[] - IDs of secondary candidates to merge from
 * }
 *
 * Auth: OWNER/ADMIN only
 */

const mergeCandidatesSchema = z.object({
  primaryId: z.string().cuid("Invalid primary candidate ID"),
  secondaryIds: z.array(z.string().cuid("Invalid secondary candidate ID")).min(1),
});

export async function POST(request: NextRequest) {
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
      where: {
        accountId: account.id,
        role: { in: ["OWNER", "ADMIN"] },
      },
      select: { id: true, organizationId: true },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Insufficient permissions. Must be OWNER or ADMIN." },
        { status: 403 }
      );
    }

    const orgId = membership.organizationId;

    // --- Parse body ---
    const body = await request.json();
    const result = mergeCandidatesSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }

    const { primaryId, secondaryIds } = result.data;

    // --- Verify primary candidate exists and belongs to org ---
    const primary = await prisma.seekerProfile.findUnique({
      where: { id: primaryId },
      select: {
        id: true,
        account: { select: { id: true, name: true, email: true } },
        applications: {
          where: { job: { organizationId: orgId } },
          select: { id: true },
        },
      },
    });

    if (!primary) {
      return NextResponse.json({ error: "Primary candidate not found" }, { status: 404 });
    }

    if (primary.applications.length === 0) {
      return NextResponse.json(
        { error: "Primary candidate has no applications in this organization" },
        { status: 400 }
      );
    }

    // --- Verify all secondary candidates exist and belong to org ---
    const secondaries = await prisma.seekerProfile.findMany({
      where: { id: { in: secondaryIds } },
      select: {
        id: true,
        account: { select: { name: true } },
        applications: {
          where: { job: { organizationId: orgId } },
          select: { id: true },
        },
      },
    });

    if (secondaries.length !== secondaryIds.length) {
      return NextResponse.json({ error: "Some secondary candidates not found" }, { status: 404 });
    }

    // --- Perform merge in transaction ---
    const mergedCandidate = await prisma.$transaction(async (tx) => {
      // Collect all notes from secondary candidates
      const secondaryNotes = await tx.note.findMany({
        where: {
          seekerId: { in: secondaryIds },
        },
        select: { id: true, orgMemberAuthorId: true },
      });

      // Move notes from secondary to primary
      if (secondaryNotes.length > 0) {
        await tx.note.updateMany({
          where: { id: { in: secondaryNotes.map((n) => n.id) } },
          data: { seekerId: primaryId },
        });
      }

      // Merge skills if primary is missing them
      const primaryProfile = await tx.seekerProfile.findUnique({
        where: { id: primaryId },
        select: { skills: true, greenSkills: true, certifications: true },
      });

      for (const secondary of secondaries) {
        const secondaryProfile = await tx.seekerProfile.findUnique({
          where: { id: secondary.id },
          select: { skills: true, greenSkills: true, certifications: true },
        });

        // Merge unique skills
        if (secondaryProfile) {
          const mergedSkills = Array.from(
            new Set([...(primaryProfile?.skills || []), ...(secondaryProfile.skills || [])])
          );
          const mergedGreenSkills = Array.from(
            new Set([
              ...(primaryProfile?.greenSkills || []),
              ...(secondaryProfile.greenSkills || []),
            ])
          );
          const mergedCertifications = Array.from(
            new Set([
              ...(primaryProfile?.certifications || []),
              ...(secondaryProfile.certifications || []),
            ])
          );

          await tx.seekerProfile.update({
            where: { id: primaryId },
            data: {
              skills: mergedSkills,
              greenSkills: mergedGreenSkills,
              certifications: mergedCertifications,
            },
          });
        }
      }

      // Fetch and return updated primary candidate
      return await tx.seekerProfile.findUnique({
        where: { id: primaryId },
        select: {
          id: true,
          account: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          applications: {
            where: { job: { organizationId: orgId } },
            select: {
              id: true,
              stage: true,
              matchScore: true,
              createdAt: true,
              job: { select: { id: true, title: true } },
            },
          },
          skills: true,
          greenSkills: true,
          certifications: true,
        },
      });
    });

    // --- Audit log the merge ---
    await createAuditLog({
      action: "UPDATE",
      entityType: "SeekerProfile",
      entityId: primaryId,
      userId: account.id,
      metadata: {
        action: "MERGE",
        mergedFromIds: secondaryIds,
        secondaryCount: secondaryIds.length,
      },
    });

    logger.info("Candidates merged successfully", {
      primaryId,
      secondaryIds,
      organizationId: orgId,
      endpoint: "/api/canopy/candidates/merge",
      mergedUserId: account.id,
    });

    return NextResponse.json({
      data: mergedCandidate,
      message: `Successfully merged ${secondaryIds.length} candidate(s) into ${primary.account.name}`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.flatten() },
        { status: 422 }
      );
    }

    logger.error("Failed to merge candidates", {
      error: formatError(error),
      endpoint: "/api/canopy/candidates/merge",
    });
    return NextResponse.json({ error: "Failed to merge candidates" }, { status: 500 });
  }
}
