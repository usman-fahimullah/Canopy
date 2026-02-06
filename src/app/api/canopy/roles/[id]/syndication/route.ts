import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";
import { getJobSyndicationStatus, retrySyndication } from "@/lib/syndication/service";

/**
 * GET /api/canopy/roles/[id]/syndication
 *
 * Get syndication status for a job — logs and latest status per platform.
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    // Verify job belongs to org
    const job = await prisma.job.findFirst({
      where: { id, organizationId: membership.organizationId },
      select: { id: true, syndicationEnabled: true, status: true },
    });
    if (!job) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    const syndicationStatus = await getJobSyndicationStatus(id);

    return NextResponse.json({
      data: {
        syndicationEnabled: job.syndicationEnabled,
        jobStatus: job.status,
        ...syndicationStatus,
      },
    });
  } catch (error) {
    logger.error("Error fetching syndication status", {
      error: formatError(error),
      endpoint: "/api/canopy/roles/[id]/syndication",
    });
    return NextResponse.json({ error: "Failed to fetch syndication status" }, { status: 500 });
  }
}

/**
 * POST /api/canopy/roles/[id]/syndication
 *
 * Retry a failed syndication log entry.
 * Body: { logId: string }
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
      select: { organizationId: true },
    });
    if (!membership) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    // Verify job belongs to org
    const job = await prisma.job.findFirst({
      where: { id, organizationId: membership.organizationId },
      select: { id: true },
    });
    if (!job) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    const body = await request.json();
    const { logId } = body;

    if (!logId || typeof logId !== "string") {
      return NextResponse.json({ error: "logId is required" }, { status: 400 });
    }

    // Verify the log belongs to this job
    const log = await prisma.syndicationLog.findFirst({
      where: { id: logId, jobId: id },
    });
    if (!log) {
      return NextResponse.json({ error: "Syndication log not found" }, { status: 404 });
    }

    const retried = await retrySyndication(logId);
    if (!retried) {
      return NextResponse.json(
        { error: "Only failed syndication entries can be retried" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: retried });
  } catch (error) {
    logger.error("Error retrying syndication", {
      error: formatError(error),
      endpoint: "/api/canopy/roles/[id]/syndication",
    });
    return NextResponse.json({ error: "Failed to retry syndication" }, { status: 500 });
  }
}
