import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { softDelete } from "@/lib/soft-delete";
import { logger, formatError } from "@/lib/logger";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      include: {
        orgMemberships: {
          select: { organizationId: true, role: true },
        },
      },
    });

    if (!account || account.orgMemberships.length === 0) {
      return NextResponse.json({ error: "No organization found" }, { status: 403 });
    }

    const organizationId = account.orgMemberships[0].organizationId;

    // Verify the application belongs to a job in this org
    const application = await prisma.application.findUnique({
      where: { id },
      select: { id: true, job: { select: { organizationId: true } } },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (application.job.organizationId !== organizationId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await softDelete("application", id, account.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error soft-deleting application", {
      error: formatError(error),
      endpoint: "/api/canopy/applications/[id]/delete",
    });
    return NextResponse.json({ error: "Failed to delete application" }, { status: 500 });
  }
}
