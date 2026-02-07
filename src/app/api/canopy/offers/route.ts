import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { createAuditLog } from "@/lib/audit";
import { CreateOfferSchema } from "@/lib/validators/offer";

/**
 * POST /api/canopy/offers
 *
 * Create a new offer record (DRAFT status).
 * Auth: org member with OWNER/ADMIN/RECRUITER role.
 */
export async function POST(request: NextRequest) {
  try {
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

    const body = await request.json();
    const result = CreateOfferSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }

    const data = result.data;

    // Verify application exists and get the job + org
    const application = await prisma.application.findUnique({
      where: { id: data.applicationId },
      include: {
        job: { select: { id: true, organizationId: true, title: true } },
        offer: { select: { id: true } },
      },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (application.offer) {
      return NextResponse.json(
        { error: "An offer already exists for this application" },
        { status: 409 }
      );
    }

    // Verify user is a member of this org with appropriate role
    const membership = await prisma.organizationMember.findFirst({
      where: {
        accountId: account.id,
        organizationId: application.job.organizationId,
        role: { in: ["OWNER", "ADMIN", "RECRUITER"] },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Insufficient permissions. Must be OWNER, ADMIN, or RECRUITER." },
        { status: 403 }
      );
    }

    // Create offer + update application in a transaction
    const offer = await prisma.$transaction(async (tx) => {
      const created = await tx.offerRecord.create({
        data: {
          applicationId: data.applicationId,
          organizationId: application.job.organizationId,
          createdById: membership.id,
          salary: data.salary,
          salaryCurrency: data.salaryCurrency,
          startDate: new Date(data.startDate),
          department: data.department,
          managerId: data.managerId,
          notes: data.notes,
          letterContent: data.letterContent,
          signingMethod: data.signingMethod,
          signingLink: data.signingLink,
          signingDocumentUrl: data.signingDocumentUrl,
          signingInstructions: data.signingInstructions,
          status: "DRAFT",
        },
      });

      await tx.application.update({
        where: { id: data.applicationId },
        data: {
          stage: "offer",
          offeredAt: new Date(),
        },
      });

      return created;
    });

    await createAuditLog({
      action: "CREATE",
      entityType: "OfferRecord",
      entityId: offer.id,
      userId: account.id,
      metadata: {
        applicationId: data.applicationId,
        jobTitle: application.job.title,
        signingMethod: data.signingMethod,
      },
    });

    logger.info("Offer created", {
      offerId: offer.id,
      applicationId: data.applicationId,
      endpoint: "/api/canopy/offers",
    });

    return NextResponse.json({ offer }, { status: 201 });
  } catch (error) {
    logger.error("Error creating offer", {
      error: formatError(error),
      endpoint: "/api/canopy/offers",
    });
    return NextResponse.json({ error: "Failed to create offer" }, { status: 500 });
  }
}
