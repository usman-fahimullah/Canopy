import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";

/**
 * GET /api/jobs/applications/[id]/offer
 * Get the offer for an application (candidate-facing).
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: applicationId } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

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
      where: { applicationId },
      include: {
        application: {
          include: {
            seeker: {
              include: {
                account: { select: { id: true, name: true } },
              },
            },
            job: { select: { title: true } },
          },
        },
        organization: {
          select: {
            name: true,
            logo: true,
            primaryColor: true,
            fontFamily: true,
          },
        },
      },
    });

    if (!offer) {
      return NextResponse.json({ error: "No offer found" }, { status: 404 });
    }

    // Verify: user is either the candidate or an org member
    const isCandidate = offer.application.seeker.account.id === account.id;
    if (!isCandidate) {
      const isMember = await prisma.organizationMember.findFirst({
        where: { accountId: account.id, organizationId: offer.organizationId },
      });
      if (!isMember) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    return NextResponse.json({ offer });
  } catch (error) {
    logger.error("Error fetching application offer", {
      error: formatError(error),
      endpoint: "/api/jobs/applications/[id]/offer",
    });
    return NextResponse.json({ error: "Failed to fetch offer" }, { status: 500 });
  }
}
