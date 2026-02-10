import { cache } from "react";
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
 * Extended auth context that includes shell authorization data.
 * Used by Server Components and authorizeShell() via React cache().
 */
export interface CachedAuthContext extends AuthContext {
  /** Whether the user has a seeker profile or "talent" in activeRoles */
  hasTalentRole: boolean;
  /** Whether the user has a coach profile or "coach" in activeRoles */
  hasCoachRole: boolean;
  /** Whether the user has org membership or "employer" in activeRoles */
  hasEmployerRole: boolean;
}

/**
 * Shared helper: fetch assigned job IDs for scoped roles.
 */
async function fetchAssignedJobIds(
  memberId: string,
  organizationId: string
): Promise<string[]> {
  const [recruiterJobs, hmJobs, reviewerAssignments] = await Promise.all([
    prisma.job.findMany({
      where: { recruiterId: memberId, organizationId },
      select: { id: true },
    }),
    prisma.job.findMany({
      where: { hiringManagerId: memberId, organizationId },
      select: { id: true },
    }),
    prisma.jobAssignment.findMany({
      where: { memberId, job: { organizationId } },
      select: { jobId: true },
    }),
  ]);

  const jobIdSet = new Set<string>();
  recruiterJobs.forEach((j) => jobIdSet.add(j.id));
  hmJobs.forEach((j) => jobIdSet.add(j.id));
  reviewerAssignments.forEach((a) => jobIdSet.add(a.jobId));
  return Array.from(jobIdSet);
}

/**
 * Request-scoped cached auth context for Server Components.
 *
 * Uses React cache() to deduplicate within a single server request.
 * If the layout calls this and a page also calls it, the Supabase call
 * and DB queries only execute ONCE.
 *
 * Do NOT use in API route handlers — they run in separate request contexts.
 * Use getAuthContext() for API routes instead.
 */
export const getCachedAuthContext = cache(
  async (): Promise<CachedAuthContext | null> => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    // Single query that fetches everything both authorizeShell and pages need
    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      select: {
        id: true,
        activeRoles: true,
        seekerProfile: { select: { id: true } },
        coachProfile: { select: { id: true } },
        orgMemberships: {
          select: { id: true, organizationId: true, role: true },
          take: 1,
        },
      },
    });
    if (!account) return null;

    const activeRoles = account.activeRoles || [];
    const membership = account.orgMemberships[0] ?? null;

    // Shell authorization flags
    const hasTalentRole =
      !!account.seekerProfile || activeRoles.includes("talent");
    const hasCoachRole =
      !!account.coachProfile || activeRoles.includes("coach");
    const hasEmployerRole =
      account.orgMemberships.length > 0 || activeRoles.includes("employer");

    // If no org membership, return context with shell flags but no org data
    if (!membership) {
      return {
        accountId: account.id,
        memberId: "",
        organizationId: "",
        role: "MEMBER" as OrgMemberRole,
        hasFullAccess: false,
        assignedJobIds: [],
        hasTalentRole,
        hasCoachRole,
        hasEmployerRole,
      };
    }

    const hasFullAccess = FULL_ACCESS_ROLES.includes(membership.role);
    const assignedJobIds = hasFullAccess
      ? []
      : await fetchAssignedJobIds(membership.id, membership.organizationId);

    return {
      accountId: account.id,
      memberId: membership.id,
      organizationId: membership.organizationId,
      role: membership.role,
      hasFullAccess,
      assignedJobIds,
      hasTalentRole,
      hasCoachRole,
      hasEmployerRole,
    };
  }
);

/**
 * Authenticate the current user and return their org context + access scope.
 * Returns null if unauthenticated or not an org member.
 *
 * Used by API route handlers (which can't share React cache() with pages).
 * Optimized: combines account + membership into a single DB query.
 */
export async function getAuthContext(): Promise<AuthContext | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Single query: account with its first org membership (eliminates one round-trip)
  const account = await prisma.account.findUnique({
    where: { supabaseId: user.id },
    select: {
      id: true,
      orgMemberships: {
        select: { id: true, organizationId: true, role: true },
        take: 1,
      },
    },
  });
  if (!account) return null;

  const membership = account.orgMemberships[0];
  if (!membership) return null;

  const hasFullAccess = FULL_ACCESS_ROLES.includes(membership.role);
  const assignedJobIds = hasFullAccess
    ? []
    : await fetchAssignedJobIds(membership.id, membership.organizationId);

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
