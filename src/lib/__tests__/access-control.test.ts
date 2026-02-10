import { describe, it, expect, vi } from "vitest";

// React cache() is not available in Vitest — stub it as a passthrough
vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return { ...actual, cache: (fn: unknown) => fn };
});

import type { OrgMemberRole } from "@prisma/client";
import {
  scopedJobWhere,
  scopedApplicationWhere,
  canAccessJob,
  canManagePipeline,
  canLeaveNotes,
  canSubmitScorecard,
  canManageAssignments,
  type AuthContext,
} from "../access-control";

// ── Helpers ────────────────────────────────────────────────

function makeCtx(overrides: Partial<AuthContext> = {}): AuthContext {
  return {
    accountId: "acc_1",
    memberId: "mem_1",
    organizationId: "org_1",
    role: "ADMIN",
    hasFullAccess: true,
    assignedJobIds: [],
    ...overrides,
  };
}

// ── scopedJobWhere ─────────────────────────────────────────

describe("scopedJobWhere", () => {
  it("returns org-only filter for full-access roles", () => {
    const ctx = makeCtx({ role: "ADMIN", hasFullAccess: true });
    const where = scopedJobWhere(ctx);
    expect(where).toEqual({ organizationId: "org_1" });
    expect(where).not.toHaveProperty("id");
  });

  it("adds id.in filter for scoped roles", () => {
    const ctx = makeCtx({
      role: "HIRING_MANAGER" as OrgMemberRole,
      hasFullAccess: false,
      assignedJobIds: ["job_a", "job_b"],
    });
    const where = scopedJobWhere(ctx);
    expect(where).toEqual({
      organizationId: "org_1",
      id: { in: ["job_a", "job_b"] },
    });
  });

  it("restricts to empty array when scoped with no assignments", () => {
    const ctx = makeCtx({
      role: "MEMBER" as OrgMemberRole,
      hasFullAccess: false,
      assignedJobIds: [],
    });
    const where = scopedJobWhere(ctx);
    expect(where.id).toEqual({ in: [] });
  });
});

// ── scopedApplicationWhere ─────────────────────────────────

describe("scopedApplicationWhere", () => {
  it("scopes by organization for full-access roles", () => {
    const ctx = makeCtx({ hasFullAccess: true });
    const where = scopedApplicationWhere(ctx);
    expect(where.job).toEqual({ organizationId: "org_1" });
    expect(where.deletedAt).toBeNull();
  });

  it("adds job id filter for scoped roles", () => {
    const ctx = makeCtx({
      hasFullAccess: false,
      assignedJobIds: ["job_x"],
    });
    const where = scopedApplicationWhere(ctx);
    expect(where.job).toEqual({
      organizationId: "org_1",
      id: { in: ["job_x"] },
    });
    expect(where.deletedAt).toBeNull();
  });
});

// ── canAccessJob ───────────────────────────────────────────

describe("canAccessJob", () => {
  it("allows full-access roles for any job", () => {
    const ctx = makeCtx({ hasFullAccess: true, assignedJobIds: [] });
    expect(canAccessJob(ctx, "any_job_id")).toBe(true);
  });

  it("allows scoped roles for assigned jobs", () => {
    const ctx = makeCtx({
      hasFullAccess: false,
      assignedJobIds: ["job_1", "job_2"],
    });
    expect(canAccessJob(ctx, "job_1")).toBe(true);
    expect(canAccessJob(ctx, "job_2")).toBe(true);
  });

  it("denies scoped roles for unassigned jobs", () => {
    const ctx = makeCtx({
      hasFullAccess: false,
      assignedJobIds: ["job_1"],
    });
    expect(canAccessJob(ctx, "job_99")).toBe(false);
  });
});

// ── canManagePipeline ──────────────────────────────────────

describe("canManagePipeline", () => {
  const allowed: OrgMemberRole[] = ["ADMIN", "RECRUITER", "HIRING_MANAGER"];
  const denied: OrgMemberRole[] = ["MEMBER", "VIEWER"];

  allowed.forEach((role) => {
    it(`allows ${role}`, () => {
      expect(canManagePipeline(makeCtx({ role }))).toBe(true);
    });
  });

  denied.forEach((role) => {
    it(`denies ${role}`, () => {
      expect(canManagePipeline(makeCtx({ role }))).toBe(false);
    });
  });
});

// ── canLeaveNotes ──────────────────────────────────────────

describe("canLeaveNotes", () => {
  it("allows all roles except VIEWER", () => {
    const roles: OrgMemberRole[] = ["ADMIN", "RECRUITER", "HIRING_MANAGER", "MEMBER"];
    roles.forEach((role) => {
      expect(canLeaveNotes(makeCtx({ role }))).toBe(true);
    });
  });

  it("denies VIEWER", () => {
    expect(canLeaveNotes(makeCtx({ role: "VIEWER" }))).toBe(false);
  });
});

// ── canSubmitScorecard ─────────────────────────────────────

describe("canSubmitScorecard", () => {
  it("allows all roles except VIEWER", () => {
    const roles: OrgMemberRole[] = ["ADMIN", "RECRUITER", "HIRING_MANAGER", "MEMBER"];
    roles.forEach((role) => {
      expect(canSubmitScorecard(makeCtx({ role }))).toBe(true);
    });
  });

  it("denies VIEWER", () => {
    expect(canSubmitScorecard(makeCtx({ role: "VIEWER" }))).toBe(false);
  });
});

// ── canManageAssignments ───────────────────────────────────

describe("canManageAssignments", () => {
  const allowed: OrgMemberRole[] = ["ADMIN", "RECRUITER"];
  const denied: OrgMemberRole[] = ["HIRING_MANAGER", "MEMBER", "VIEWER"];

  allowed.forEach((role) => {
    it(`allows ${role}`, () => {
      expect(canManageAssignments(makeCtx({ role }))).toBe(true);
    });
  });

  denied.forEach((role) => {
    it(`denies ${role}`, () => {
      expect(canManageAssignments(makeCtx({ role }))).toBe(false);
    });
  });
});
