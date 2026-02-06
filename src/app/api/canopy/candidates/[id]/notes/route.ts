import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";

/**
 * POST /api/canopy/candidates/[id]/notes
 *
 * Add a note about a candidate (scoped to the organization).
 */
const CreateNoteSchema = z.object({
  content: z.string().min(1, "Note content is required").max(5000),
  mentions: z.array(z.string()).optional().default([]),
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
    const parsed = CreateNoteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const { content, mentions } = parsed.data;

    // --- Verify the seeker has applications in this org ---
    const applicationCount = await prisma.application.count({
      where: {
        seekerId,
        job: { organizationId: membership.organizationId },
      },
    });

    if (applicationCount === 0) {
      return NextResponse.json(
        { error: "Candidate not found in your organization" },
        { status: 404 }
      );
    }

    // --- Create note ---
    const note = await prisma.note.create({
      data: {
        seekerId,
        orgMemberAuthorId: membership.id,
        content,
        mentions,
      },
      select: {
        id: true,
        content: true,
        mentions: true,
        createdAt: true,
        orgMemberAuthor: {
          select: {
            account: {
              select: { name: true, avatar: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ data: note }, { status: 201 });
  } catch (error) {
    logger.error("Failed to create note", {
      error: formatError(error),
    });
    return NextResponse.json({ error: "Failed to add note" }, { status: 500 });
  }
}
