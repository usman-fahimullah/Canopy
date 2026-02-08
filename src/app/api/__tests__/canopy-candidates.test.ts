import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ── Hoisted mocks ───────────────────────────────────────────

const { mockPrisma, mockGetAuthContext, mockScopedApplicationWhere } = vi.hoisted(() => {
  const mockPrisma = {
    application: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  };
  const mockGetAuthContext = vi.fn();
  const mockScopedApplicationWhere = vi.fn();
  return { mockPrisma, mockGetAuthContext, mockScopedApplicationWhere };
});

vi.mock("@/lib/db", () => ({
  prisma: mockPrisma,
}));

vi.mock("@/lib/access-control", () => ({
  getAuthContext: mockGetAuthContext,
  scopedApplicationWhere: mockScopedApplicationWhere,
}));

vi.mock("@/lib/logger", () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
  formatError: vi.fn((e: unknown) => (e instanceof Error ? e.message : String(e))),
}));

// ── Import handler after mocks ──────────────────────────────

import { GET } from "../canopy/candidates/route";

// ── Fixtures ────────────────────────────────────────────────

const mockCtx = {
  organizationId: "org-1",
  accountId: "account-1",
  memberId: "member-1",
  role: "ADMIN" as const,
  hasFullAccess: true,
  assignedJobIds: [],
};

const mockApplications = [
  {
    id: "app-1",
    stage: "applied",
    source: "Green Jobs Board",
    matchScore: 85,
    createdAt: new Date("2025-06-01"),
    seekerId: "seeker-1",
    seeker: {
      id: "seeker-1",
      account: { id: "acc-1", name: "Jane Doe", email: "jane@example.com" },
    },
    job: { id: "job-1", title: "Solar Engineer", organizationId: "org-1" },
  },
];

// ── Tests ───────────────────────────────────────────────────

describe("GET /api/canopy/candidates", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAuthContext.mockResolvedValue(mockCtx);
    mockScopedApplicationWhere.mockReturnValue({
      job: { organizationId: "org-1" },
    });
    mockPrisma.application.findMany.mockResolvedValue(mockApplications);
    mockPrisma.application.count.mockResolvedValue(1);
  });

  it("returns 401 when not authenticated", async () => {
    mockGetAuthContext.mockResolvedValue(null);
    const req = new NextRequest("http://localhost:3000/api/canopy/candidates");
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("returns formatted applications with pagination meta", async () => {
    const req = new NextRequest("http://localhost:3000/api/canopy/candidates");
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.applications).toHaveLength(1);
    expect(body.applications[0].candidate.name).toBe("Jane Doe");
    expect(body.meta).toEqual({
      total: 1,
      skip: 0,
      take: 20,
      hasMore: false,
    });
    expect(body.userRole).toBe("ADMIN");
  });

  it("uses scopedApplicationWhere for access control", async () => {
    const req = new NextRequest("http://localhost:3000/api/canopy/candidates");
    await GET(req);

    expect(mockScopedApplicationWhere).toHaveBeenCalledWith(mockCtx);
  });

  it("applies stage filter", async () => {
    const req = new NextRequest("http://localhost:3000/api/canopy/candidates?stage=interview");
    await GET(req);

    const call = mockPrisma.application.findMany.mock.calls[0][0];
    expect(call.where.stage).toBe("interview");
  });

  it("applies match score range filter", async () => {
    const req = new NextRequest(
      "http://localhost:3000/api/canopy/candidates?matchScoreMin=50&matchScoreMax=90"
    );
    await GET(req);

    const call = mockPrisma.application.findMany.mock.calls[0][0];
    expect(call.where.matchScore).toEqual({ gte: 50, lte: 90 });
  });

  it("applies source filter", async () => {
    const req = new NextRequest("http://localhost:3000/api/canopy/candidates?source=LinkedIn");
    await GET(req);

    const call = mockPrisma.application.findMany.mock.calls[0][0];
    expect(call.where.source).toBe("LinkedIn");
  });

  it("applies search filter across name and email", async () => {
    const req = new NextRequest("http://localhost:3000/api/canopy/candidates?search=jane");
    await GET(req);

    const call = mockPrisma.application.findMany.mock.calls[0][0];
    expect(call.where.OR).toHaveLength(2);
  });

  it("applies experience level filter on job relation", async () => {
    const req = new NextRequest(
      "http://localhost:3000/api/canopy/candidates?experienceLevel=SENIOR"
    );
    await GET(req);

    const call = mockPrisma.application.findMany.mock.calls[0][0];
    expect(call.where.job).toMatchObject({ experienceLevel: "SENIOR" });
  });

  it("applies pagination parameters", async () => {
    const req = new NextRequest("http://localhost:3000/api/canopy/candidates?skip=10&take=5");
    await GET(req);

    const call = mockPrisma.application.findMany.mock.calls[0][0];
    expect(call.skip).toBe(10);
    expect(call.take).toBe(5);
  });

  it("returns 422 for invalid parameters", async () => {
    const req = new NextRequest("http://localhost:3000/api/canopy/candidates?take=-1");
    const res = await GET(req);
    expect(res.status).toBe(422);
  });

  it("returns 500 on database error", async () => {
    mockPrisma.application.findMany.mockRejectedValue(new Error("DB error"));
    const req = new NextRequest("http://localhost:3000/api/canopy/candidates");
    const res = await GET(req);
    expect(res.status).toBe(500);
  });
});
