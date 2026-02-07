import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { createAuditLog } from "@/lib/audit";
import { UpdateOfferSchema } from "@/lib/validators/offer";

/**
 * GET /api/canopy/offers/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const offer = await prisma.offerRecord.findUnique({
      where: { id },
      include: {
        application: {
          include: {
            seeker: {
              include: {
                account: { select: { id: true, name: true, email: true, avatar: true } },
              },
            },
            job: { select: { id: true, title: true, organizationId: true } },
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            primaryColor: true,
            fontFamily: true,
            description: true,
          },
        },
      },
    });

    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    // Verify user has access: either org member or the candidate
    const isOrgMember = await prisma.organizationMember.findFirst({
      where: {
        accountId: account.id,
        organizationId: offer.organizationId,
      },
    });

    const isCandidate = offer.application.seeker.account.id === account.id;

    if (!isOrgMember && !isCandidate) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ offer });
  } catch (error) {
    logger.error("Error fetching offer", {
      error: formatError(error),
      endpoint: "/api/canopy/offers/[id]",
    });
    return NextResponse.json({ error: "Failed to fetch offer" }, { status: 500 });
  }
}

/**
 * PATCH /api/canopy/offers/[id]
 * Update offer details (only while in DRAFT status).
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const offer = await prisma.offerRecord.findUnique({
      where: { id },
      select: { id: true, status: true, organizationId: true },
    });

    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    if (offer.status !== "DRAFT") {
      return NextResponse.json(
        { error: "Only draft offers can be edited" },
        { status: 400 }
      );
    }

    // Verify org membership
    const membership = await prisma.organizationMember.findFirst({
      where: {
        accountId: account.id,
        organizationId: offer.organizationId,
        role: { in: ["OWNER", "ADMIN", "RECRUITER"] },
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const body = await request.json();
    const result = UpdateOfferSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }

    const updateData: Record<string, unknown> = {};
    const changes: Record<string, { from: unknown; to: unknown }> = {};

    for (const [key, value] of Object.entries(result.data)) {
      if (value !== undefined) {
        if (key === "startDate") {
          updateData[key] = new Date(value as string);
        } else {
          updateData[key] = value;
        }
        changes[key] = { from: null, to: value };
      }
    }

    const updated = await prisma.offerRecord.update({
      where: { id },
      data: updateData,
    });

    await createAuditLog({
      action: "UPDATE",
      entityType: "OfferRecord",
      entityId: id,
      userId: account.id,
      changes,
    });

    return NextResponse.json({ offer: updated });
  } catch (error) {
    logger.error("Error updating offer", {
      error: formatError(error),
      endpoint: "/api/canopy/offers/[id]",
    });
    return NextResponse.json({ error: "Failed to update offer" }, { status: 500 });
  }
}
