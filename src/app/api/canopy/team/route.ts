import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";
import { trackActivity } from "@/lib/track-activity";

/**
 * GET /api/canopy/team
 *
 * Returns organization members + pending invites + current user's role.
 * Any org member can view.
 */
export async function GET() {
  try {
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

    const membership = await prisma.organizationMember.findFirst({
      where: { accountId: account.id },
    });

    if (!membership) {
      return NextResponse.json({ error: "Organization membership required" }, { status: 403 });
    }

    // Fire-and-forget activity tracking
    trackActivity(account.id);

    // Auto-expire stale invites
    await prisma.teamInvite.updateMany({
      where: {
        organizationId: membership.organizationId,
        status: "PENDING",
        expiresAt: { lt: new Date() },
      },
      data: { status: "EXPIRED" },
    });

    const [members, pendingInvites] = await Promise.all([
      prisma.organizationMember.findMany({
        where: { organizationId: membership.organizationId },
        include: {
          account: {
            select: {
              name: true,
              email: true,
              avatar: true,
              lastActiveAt: true,
            },
          },
          recruitedJobs: {
            select: { id: true, title: true },
            take: 5,
          },
          managedJobs: {
            select: { id: true, title: true },
            take: 5,
          },
          jobAssignments: {
            select: { job: { select: { id: true, title: true } } },
            take: 5,
          },
        },
        orderBy: { role: "asc" },
      }),
      prisma.teamInvite.findMany({
        where: {
          organizationId: membership.organizationId,
          status: "PENDING",
        },
        include: {
          invitedBy: {
            select: { name: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const membersData = members.map((m) => {
      // Build assignment list (deduplicated by job ID)
      const jobMap = new Map<
        string,
        { id: string; title: string; type: "recruiter" | "hiring_manager" | "reviewer" }
      >();
      for (const j of m.recruitedJobs) {
        jobMap.set(j.id, { id: j.id, title: j.title, type: "recruiter" });
      }
      for (const j of m.managedJobs) {
        if (!jobMap.has(j.id)) {
          jobMap.set(j.id, { id: j.id, title: j.title, type: "hiring_manager" });
        }
      }
      for (const a of m.jobAssignments) {
        if (!jobMap.has(a.job.id)) {
          jobMap.set(a.job.id, { id: a.job.id, title: a.job.title, type: "reviewer" });
        }
      }
      const assignedJobs = Array.from(jobMap.values());

      return {
        id: m.id,
        accountId: m.accountId,
        name: m.account.name ?? m.account.email,
        email: m.account.email,
        avatar: m.account.avatar,
        role: m.role,
        title: m.title,
        lastActiveAt: m.account.lastActiveAt?.toISOString() ?? null,
        joinedAt: m.createdAt.toISOString(),
        assignedJobs,
        assignedJobCount: assignedJobs.length,
      };
    });

    const invitesData = pendingInvites.map((inv) => ({
      id: inv.id,
      email: inv.email,
      role: inv.role,
      invitedBy: {
        name: inv.invitedBy.name ?? inv.invitedBy.email,
        email: inv.invitedBy.email,
      },
      expiresAt: inv.expiresAt.toISOString(),
      createdAt: inv.createdAt.toISOString(),
    }));

    return NextResponse.json({
      members: membersData,
      pendingInvites: invitesData,
      currentUserRole: membership.role,
      meta: {
        memberCount: membersData.length,
        pendingCount: invitesData.length,
      },
    });
  } catch (error) {
    logger.error("Failed to fetch team data", { error: formatError(error) });
    return NextResponse.json({ error: "Failed to fetch team data" }, { status: 500 });
  }
}
