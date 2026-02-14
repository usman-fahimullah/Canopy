import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";
import { AVATAR_PRESET_SRCS } from "@/lib/profile/avatar-presets";

/**
 * PATCH /api/canopy/candidates/[id]/avatar
 *
 * Update a candidate's avatar (preset selection only).
 * The [id] here is the seekerProfile ID.
 * Org-scoped: validates the candidate has an application in the user's org.
 */
const UpdateAvatarSchema = z.object({
  avatarSrc: z.string().min(1, "Avatar source is required"),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: seekerId } = await params;

    // 1. Auth check
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get account + org membership
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

    // 3. Verify candidate belongs to this org (has application for one of org's jobs)
    const seekerProfile = await prisma.seekerProfile.findUnique({
      where: { id: seekerId },
      select: {
        accountId: true,
        applications: {
          where: { job: { organizationId: membership.organizationId } },
          select: { id: true },
          take: 1,
        },
      },
    });

    if (!seekerProfile || seekerProfile.applications.length === 0) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    }

    // 4. Validate input
    const body = await request.json();
    const result = UpdateAvatarSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }

    const { avatarSrc } = result.data;

    // 5. Validate it's a known preset
    if (!AVATAR_PRESET_SRCS.has(avatarSrc)) {
      return NextResponse.json({ error: "Invalid avatar preset" }, { status: 422 });
    }

    // 6. Update the candidate's account avatar
    await prisma.account.update({
      where: { id: seekerProfile.accountId },
      data: { avatar: avatarSrc },
    });

    logger.info("Candidate avatar updated by employer", {
      seekerId,
      avatarSrc,
      organizationId: membership.organizationId,
      endpoint: "PATCH /api/canopy/candidates/[id]/avatar",
    });

    return NextResponse.json({ success: true, avatar: avatarSrc });
  } catch (error) {
    logger.error("Failed to update candidate avatar", {
      error: formatError(error),
      endpoint: "PATCH /api/canopy/candidates/[id]/avatar",
    });
    return NextResponse.json({ error: "Failed to update avatar" }, { status: 500 });
  }
}
