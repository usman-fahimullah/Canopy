import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { getAuthContext, canLeaveNotes, scopedApplicationWhere } from "@/lib/access-control";

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

    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canLeaveNotes(ctx)) {
      return NextResponse.json({ error: "Viewers cannot leave notes" }, { status: 403 });
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

    // --- Verify the seeker has applications in accessible jobs ---
    const applicationCount = await prisma.application.count({
      where: {
        ...scopedApplicationWhere(ctx),
        seekerId,
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
        orgMemberAuthorId: ctx.memberId,
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
