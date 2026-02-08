import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import type { OrgMemberRole, Prisma } from "@prisma/client";

// Roles with unrestricted access to all jobs/candidates
const FULL_ACCESS_ROLES: OrgMemberRole[] = ["ADMIN", "RECRUITER", "VIEWER"];

export interface AuthContext {
  accountId: string;
  memberId: string;
  organizationId: string;
  role: OrgMemberRole;
  hasFullAccess: boolean;
  /** Populated for scoped roles (HIRING_MANAGER, MEMBER); empty for full-access roles */
  assignedJobIds: string[];
}

/**
 * Authenticate the current user and return their org context + access scope.
 * Returns null if unauthenticated or not an org member.
 */
export async function getAuthContext(): Promise<AuthContext | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const account = await prisma.account.findUnique({
    where: { supabaseId: user.id },
    select: { id: true },
  });
  if (!account) return null;

  const membership = await prisma.organizationMember.findFirst({
    where: { accountId: account.id },
    select: { id: true, organizationId: true, role: true },
  });
  if (!membership) return null;

  const hasFullAccess = FULL_ACCESS_ROLES.includes(membership.role);
  let assignedJobIds: string[] = [];

  if (!hasFullAccess) {
    // Fetch all jobs this member is assigned to
    const [recruiterJobs, hmJobs, reviewerAssignments] = await Promise.all([
      prisma.job.findMany({
        where: {
          recruiterId: membership.id,
          organizationId: membership.organizationId,
        },
        select: { id: true },
      }),
      prisma.job.findMany({
        where: {
          hiringManagerId: membership.id,
          organizationId: membership.organizationId,
        },
        select: { id: true },
      }),
      prisma.jobAssignment.findMany({
        where: {
          memberId: membership.id,
          job: { organizationId: membership.organizationId },
        },
        select: { jobId: true },
      }),
    ]);

    const jobIdSet = new Set<string>();
    recruiterJobs.forEach((j) => jobIdSet.add(j.id));
    hmJobs.forEach((j) => jobIdSet.add(j.id));
    reviewerAssignments.forEach((a) => jobIdSet.add(a.jobId));
    assignedJobIds = Array.from(jobIdSet);
  }

  return {
    accountId: account.id,
    memberId: membership.id,
    organizationId: membership.organizationId,
    role: membership.role,
    hasFullAccess,
    assignedJobIds,
  };
}

/**
 * Build a Prisma `where` clause for jobs, scoped by the user's access level.
 */
export function scopedJobWhere(ctx: AuthContext): Prisma.JobWhereInput {
  const base: Prisma.JobWhereInput = { organizationId: ctx.organizationId };
  if (!ctx.hasFullAccess) {
    base.id = { in: ctx.assignedJobIds };
  }
  return base;
}

/**
 * Build a Prisma `where` clause for applications, scoped by the user's access level.
 */
export function scopedApplicationWhere(ctx: AuthContext): Prisma.ApplicationWhereInput {
  const jobFilter: Prisma.JobWhereInput = {
    organizationId: ctx.organizationId,
  };
  if (!ctx.hasFullAccess) {
    jobFilter.id = { in: ctx.assignedJobIds };
  }
  return { job: jobFilter, deletedAt: null };
}

/** Check if the user can access a specific job. */
export function canAccessJob(ctx: AuthContext, jobId: string): boolean {
  if (ctx.hasFullAccess) return true;
  return ctx.assignedJobIds.includes(jobId);
}

/** ADMIN/RECRUITER/HIRING_MANAGER can move candidates through stages. */
export function canManagePipeline(ctx: AuthContext): boolean {
  return (["ADMIN", "RECRUITER", "HIRING_MANAGER"] as OrgMemberRole[]).includes(ctx.role);
}

/** Everyone except VIEWER can leave notes. */
export function canLeaveNotes(ctx: AuthContext): boolean {
  return ctx.role !== "VIEWER";
}

/** Everyone except VIEWER can submit scorecards. */
export function canSubmitScorecard(ctx: AuthContext): boolean {
  return ctx.role !== "VIEWER";
}

/** Only ADMIN/RECRUITER can modify job assignments. */
export function canManageAssignments(ctx: AuthContext): boolean {
  return (["ADMIN", "RECRUITER"] as OrgMemberRole[]).includes(ctx.role);
}
