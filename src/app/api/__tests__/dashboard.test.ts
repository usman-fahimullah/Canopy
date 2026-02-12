import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextResponse } from "next/server";

// ── Hoisted mocks ───────────────────────────────────────────

const { mockGetAuthContext, mockPrisma } = vi.hoisted(() => {
  const mockGetAuthContext = vi.fn();
  const mockPrisma = {
    job: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
    application: {
      findMany: vi.fn(),
      count: vi.fn(),
      groupBy: vi.fn(),
    },
    interview: {
      findMany: vi.fn(),
    },
  };
  return { mockGetAuthContext, mockPrisma };
});

vi.mock("@/lib/access-control", () => ({
  getAuthContext: () => mockGetAuthContext(),
  scopedJobWhere: (ctx: {
    organizationId: string;
    hasFullAccess: boolean;
    assignedJobIds: string[];
  }) => {
    const base: Record<string, unknown> = { organizationId: ctx.organizationId };
    if (!ctx.hasFullAccess) base.id = { in: ctx.assignedJobIds };
    return base;
  },
  scopedApplicationWhere: (ctx: {
    organizationId: string;
    hasFullAccess: boolean;
    assignedJobIds: string[];
  }) => {
    const jobFilter: Record<string, unknown> = { organizationId: ctx.organizationId };
    if (!ctx.hasFullAccess) jobFilter.id = { in: ctx.assignedJobIds };
    return { job: jobFilter, deletedAt: null };
  },
}));

vi.mock("@/lib/db", () => ({
  prisma: mockPrisma,
}));

vi.mock("@/lib/logger", () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
  formatError: vi.fn((e: unknown) => (e instanceof Error ? e.message : String(e))),
}));

// ── Import handler after mocks ──────────────────────────────

import { GET } from "../canopy/dashboard/route";

// ── Fixtures ────────────────────────────────────────────────

const mockAuthCtx = {
  accountId: "acc-1",
  memberId: "mem-1",
  organizationId: "org-1",
  role: "ADMIN",
  hasFullAccess: true,
  assignedJobIds: [],
};

// ── Tests ───────────────────────────────────────────────────

describe("GET /api/canopy/dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAuthContext.mockResolvedValue(mockAuthCtx);

    // job.findMany — recent roles with _count
    mockPrisma.job.findMany.mockResolvedValue([
      {
        id: "job-1",
        title: "Engineer",
        location: "Remote",
        locationType: "REMOTE",
        status: "PUBLISHED",
        publishedAt: new Date("2026-01-01"),
        _count: { applications: 5 },
      },
    ]);
    mockPrisma.job.count.mockResolvedValue(3);

    // application.count — called 3 times: total, new this week, hired
    mockPrisma.application.count
      .mockResolvedValueOnce(25) // total candidates
      .mockResolvedValueOnce(8) // new this week
      .mockResolvedValueOnce(2); // hired

    // application.findMany — called twice: recent applications, stale candidates
    mockPrisma.application.findMany
      .mockResolvedValueOnce([
        {
          id: "app-1",
          stage: "Applied",
          createdAt: new Date("2026-02-01"),
          seeker: { id: "s-1", account: { name: "Jane Doe", email: "jane@test.com" } },
          job: { id: "job-1", title: "Engineer" },
        },
      ])
      .mockResolvedValueOnce([]); // stale candidates

    mockPrisma.application.groupBy.mockResolvedValue([
      { stage: "Applied", _count: { _all: 10 } },
      { stage: "Interview", _count: { _all: 5 } },
    ]);

    // interview.findMany — unscored interviews
    mockPrisma.interview.findMany.mockResolvedValue([]);
  });

  it("returns 401 when not authenticated", async () => {
    mockGetAuthContext.mockResolvedValue(null);

    const res = await GET();
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("Unauthorized");
  });

  it("returns dashboard data for authenticated user", async () => {
    const res = await GET();
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.activeRolesCount).toBe(3);
    expect(body.candidateCount).toBe(25);
    expect(body.newApplicationCount).toBe(8);
    expect(body.hiredCount).toBe(2);
    expect(body.userRole).toBe("ADMIN");
  });

  it("builds pipeline stats from groupBy", async () => {
    const res = await GET();
    const body = await res.json();

    expect(body.pipelineStats.Applied).toBe(10);
    expect(body.pipelineStats.Interview).toBe(5);
    // Stages not in groupBy result should be 0
    expect(body.pipelineStats.Screening).toBe(0);
    expect(body.pipelineStats.Offer).toBe(0);
    expect(body.pipelineStats.Hired).toBe(0);
  });

  it("includes the user role in response", async () => {
    mockGetAuthContext.mockResolvedValue({ ...mockAuthCtx, role: "RECRUITER" });

    const res = await GET();
    const body = await res.json();
    expect(body.userRole).toBe("RECRUITER");
  });

  it("returns 500 on error", async () => {
    mockGetAuthContext.mockRejectedValue(new Error("Auth failed"));

    const res = await GET();
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("Failed to fetch dashboard data");
  });
});
