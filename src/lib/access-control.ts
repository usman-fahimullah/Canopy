import { cache } from "react";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
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
  /** Member's own department ID (null if cross-functional / unassigned) */
  departmentId: string | null;
  /** Whether this member is head of any department */
  isDepartmentHead: boolean;
  /** All department IDs in the member's subtree (for dept heads); empty otherwise */
  departmentTreeIds: string[];
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
 * Fetch all descendant department IDs for a given set of root department IDs.
 * Uses iterative breadth-first traversal (safe for practical 3-level depth).
 */
async function fetchDepartmentTree(
  rootDepartmentIds: string[],
  organizationId: string
): Promise<string[]> {
  if (rootDepartmentIds.length === 0) return [];

  const allIds = new Set<string>(rootDepartmentIds);
  let frontier = [...rootDepartmentIds];

  // BFS: max 5 iterations as a safety limit (practical depth is 3)
  const MAX_DEPT_DEPTH = 5;
  for (let depth = 0; depth < MAX_DEPT_DEPTH && frontier.length > 0; depth++) {
    const children: Array<{ id: string }> = await prisma.department.findMany({
      where: {
        parentId: { in: frontier },
        organizationId,
        isActive: true,
      },
      select: { id: true },
    });

    frontier = [];
    for (const child of children) {
      if (!allIds.has(child.id)) {
        allIds.add(child.id);
        frontier.push(child.id);
      }
    }

    if (depth === MAX_DEPT_DEPTH - 1 && frontier.length > 0) {
      logger.warn("Department tree BFS hit depth limit — possible cycle or deep nesting", {
        organizationId,
        rootDepartmentIds,
        depth: MAX_DEPT_DEPTH,
        remainingFrontier: frontier.length,
      });
    }
  }

  return Array.from(allIds);
}

/**
 * Shared helper: fetch assigned job IDs for scoped roles.
 * Combines 4 sources: recruiter, hiring manager, reviewer assignments, and department.
 */
async function fetchAssignedJobIds(
  memberId: string,
  organizationId: string,
  departmentTreeIds: string[]
): Promise<string[]> {
  const queries: Promise<Array<{ id?: string; jobId?: string }>>[] = [
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
  ];

  // 4th source: department-scoped jobs
  if (departmentTreeIds.length > 0) {
    queries.push(
      prisma.job.findMany({
        where: {
          organizationId,
          departmentId: { in: departmentTreeIds },
        },
        select: { id: true },
      })
    );
  }

  const results = await Promise.all(queries);
  const [recruiterJobs, hmJobs, reviewerAssignments, deptJobs = []] = results;

  const jobIdSet = new Set<string>();
  for (const j of recruiterJobs) if (j.id) jobIdSet.add(j.id);
  for (const j of hmJobs) if (j.id) jobIdSet.add(j.id);
  for (const a of reviewerAssignments) if (a.jobId) jobIdSet.add(a.jobId);
  for (const j of deptJobs) if (j.id) jobIdSet.add(j.id);
  return Array.from(jobIdSet);
}

/**
 * Fetch department context for a member: their department, whether they
 * head any departments, and the full subtree of departments they lead.
 */
async function fetchDepartmentContext(
  memberId: string,
  departmentId: string | null,
  organizationId: string
): Promise<{
  isDepartmentHead: boolean;
  departmentTreeIds: string[];
}> {
  // Check if this member heads any departments
  const ledDepartments = await prisma.department.findMany({
    where: {
      headId: memberId,
      organizationId,
      isActive: true,
    },
    select: { id: true },
  });

  const isDepartmentHead = ledDepartments.length > 0;

  if (!isDepartmentHead) {
    // Not a dept head: tree is just their own department (if any)
    return {
      isDepartmentHead: false,
      departmentTreeIds: departmentId ? [departmentId] : [],
    };
  }

  // Dept head: tree includes all departments they lead + descendants
  const rootIds = ledDepartments.map((d) => d.id);
  // Also include their own department if it's not already a led department
  if (departmentId && !rootIds.includes(departmentId)) {
    rootIds.push(departmentId);
  }
  const departmentTreeIds = await fetchDepartmentTree(rootIds, organizationId);

  return { isDepartmentHead, departmentTreeIds };
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
export const getCachedAuthContext = cache(async (): Promise<CachedAuthContext | null> => {
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
        select: {
          id: true,
          organizationId: true,
          role: true,
          departmentId: true,
        },
        take: 1,
      },
    },
  });
  if (!account) return null;

  const activeRoles = account.activeRoles || [];
  const membership = account.orgMemberships[0] ?? null;

  // Shell authorization flags
  const hasTalentRole = !!account.seekerProfile || activeRoles.includes("talent");
  const hasCoachRole = !!account.coachProfile || activeRoles.includes("coach");
  const hasEmployerRole = account.orgMemberships.length > 0 || activeRoles.includes("employer");

  // If no org membership, return context with shell flags but no org data
  if (!membership) {
    return {
      accountId: account.id,
      memberId: "",
      organizationId: "",
      role: "MEMBER" as OrgMemberRole,
      hasFullAccess: false,
      assignedJobIds: [],
      departmentId: null,
      isDepartmentHead: false,
      departmentTreeIds: [],
      hasTalentRole,
      hasCoachRole,
      hasEmployerRole,
    };
  }

  const hasFullAccess = FULL_ACCESS_ROLES.includes(membership.role);

  // Fetch department context for scoped roles
  const deptCtx = hasFullAccess
    ? { isDepartmentHead: false, departmentTreeIds: [] as string[] }
    : await fetchDepartmentContext(
        membership.id,
        membership.departmentId,
        membership.organizationId
      );

  const assignedJobIds = hasFullAccess
    ? []
    : await fetchAssignedJobIds(
        membership.id,
        membership.organizationId,
        deptCtx.departmentTreeIds
      );

  return {
    accountId: account.id,
    memberId: membership.id,
    organizationId: membership.organizationId,
    role: membership.role,
    hasFullAccess,
    assignedJobIds,
    departmentId: membership.departmentId,
    isDepartmentHead: deptCtx.isDepartmentHead,
    departmentTreeIds: deptCtx.departmentTreeIds,
    hasTalentRole,
    hasCoachRole,
    hasEmployerRole,
  };
});

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
        select: {
          id: true,
          organizationId: true,
          role: true,
          departmentId: true,
        },
        take: 1,
      },
    },
  });
  if (!account) return null;

  const membership = account.orgMemberships[0];
  if (!membership) return null;

  const hasFullAccess = FULL_ACCESS_ROLES.includes(membership.role);

  // Fetch department context for scoped roles
  const deptCtx = hasFullAccess
    ? { isDepartmentHead: false, departmentTreeIds: [] as string[] }
    : await fetchDepartmentContext(
        membership.id,
        membership.departmentId,
        membership.organizationId
      );

  const assignedJobIds = hasFullAccess
    ? []
    : await fetchAssignedJobIds(
        membership.id,
        membership.organizationId,
        deptCtx.departmentTreeIds
      );

  return {
    accountId: account.id,
    memberId: membership.id,
    organizationId: membership.organizationId,
    role: membership.role,
    hasFullAccess,
    assignedJobIds,
    departmentId: membership.departmentId,
    isDepartmentHead: deptCtx.isDepartmentHead,
    departmentTreeIds: deptCtx.departmentTreeIds,
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

/** Only ADMIN can create/delete departments or modify the hierarchy. */
export function canManageDepartments(ctx: AuthContext): boolean {
  return ctx.role === "ADMIN";
}

/**
 * ADMIN can manage members in any department.
 * Department heads can manage members in their own department.
 */
export function canManageDepartmentMembers(ctx: AuthContext, departmentId: string): boolean {
  if (ctx.role === "ADMIN") return true;
  if (ctx.isDepartmentHead && ctx.departmentTreeIds.includes(departmentId)) {
    return true;
  }
  return false;
}
