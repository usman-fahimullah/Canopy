import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ── Hoisted mocks ───────────────────────────────────────────

const { mockPrisma, mockGetAuthContext, mockScopedJobWhere, mockSupabase } = vi.hoisted(() => {
  const mockPrisma = {
    job: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    account: {
      findUnique: vi.fn(),
    },
  };
  const mockGetAuthContext = vi.fn();
  const mockScopedJobWhere = vi.fn();
  const mockSupabase = {
    auth: {
      getUser: vi.fn(),
    },
  };
  return { mockPrisma, mockGetAuthContext, mockScopedJobWhere, mockSupabase };
});

vi.mock("@/lib/db", () => ({
  prisma: mockPrisma,
}));

vi.mock("@/lib/access-control", () => ({
  getAuthContext: mockGetAuthContext,
  scopedJobWhere: mockScopedJobWhere,
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue(mockSupabase),
}));

vi.mock("@/lib/logger", () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
  formatError: vi.fn((e: unknown) => (e instanceof Error ? e.message : String(e))),
}));

// ── Import handlers after mocks ─────────────────────────────

import { GET, POST } from "../canopy/roles/route";

// ── Fixtures ────────────────────────────────────────────────

const mockCtx = {
  organizationId: "org-1",
  accountId: "account-1",
  memberId: "member-1",
  role: "ADMIN" as const,
  hasFullAccess: true,
  assignedJobIds: [],
};

const mockJobs = [
  {
    id: "job-1",
    title: "Solar Engineer",
    slug: "solar-engineer",
    location: "Denver, CO",
    locationType: "ONSITE",
    status: "PUBLISHED",
    publishedAt: new Date("2025-06-01"),
    closesAt: null,
    climateCategory: "Renewable Energy",
    pathway: { id: "p-1", name: "Energy", slug: "energy", icon: "Lightning", color: "yellow" },
    recruiter: { id: "m-1", account: { name: "Alice", avatar: null } },
    hiringManager: null,
    _count: { applications: 5, reviewerAssignments: 2 },
  },
];

// ── GET Tests ───────────────────────────────────────────────

describe("GET /api/canopy/roles", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAuthContext.mockResolvedValue(mockCtx);
    mockScopedJobWhere.mockReturnValue({ organizationId: "org-1" });
    mockPrisma.job.findMany.mockResolvedValue(mockJobs);
    mockPrisma.job.count.mockResolvedValue(1);
  });

  it("returns 401 when not authenticated", async () => {
    mockGetAuthContext.mockResolvedValue(null);
    const req = new NextRequest("http://localhost:3000/api/canopy/roles");
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("returns formatted jobs with meta", async () => {
    const req = new NextRequest("http://localhost:3000/api/canopy/roles");
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.jobs).toHaveLength(1);
    expect(body.jobs[0].title).toBe("Solar Engineer");
    expect(body.jobs[0].applicationCount).toBe(5);
    expect(body.jobs[0].reviewerCount).toBe(2);
    expect(body.jobs[0].recruiter.name).toBe("Alice");
    expect(body.jobs[0].hiringManager).toBeNull();
    expect(body.meta.total).toBe(1);
    expect(body.userRole).toBe("ADMIN");
  });

  it("uses scopedJobWhere for access control", async () => {
    const req = new NextRequest("http://localhost:3000/api/canopy/roles");
    await GET(req);
    expect(mockScopedJobWhere).toHaveBeenCalledWith(mockCtx);
  });

  it("applies status filter", async () => {
    const req = new NextRequest("http://localhost:3000/api/canopy/roles?status=DRAFT");
    await GET(req);
    const call = mockPrisma.job.findMany.mock.calls[0][0];
    expect(call.where.status).toBe("DRAFT");
  });

  it("applies employmentType filter", async () => {
    const req = new NextRequest("http://localhost:3000/api/canopy/roles?employmentType=CONTRACT");
    await GET(req);
    const call = mockPrisma.job.findMany.mock.calls[0][0];
    expect(call.where.employmentType).toBe("CONTRACT");
  });

  it("applies locationType filter", async () => {
    const req = new NextRequest("http://localhost:3000/api/canopy/roles?locationType=REMOTE");
    await GET(req);
    const call = mockPrisma.job.findMany.mock.calls[0][0];
    expect(call.where.locationType).toBe("REMOTE");
  });

  it("applies pagination", async () => {
    const req = new NextRequest("http://localhost:3000/api/canopy/roles?skip=20&take=10");
    await GET(req);
    const call = mockPrisma.job.findMany.mock.calls[0][0];
    expect(call.skip).toBe(20);
    expect(call.take).toBe(10);
  });

  it("returns 422 for invalid enum value", async () => {
    const req = new NextRequest("http://localhost:3000/api/canopy/roles?status=INVALID");
    const res = await GET(req);
    expect(res.status).toBe(422);
  });

  it("returns 500 on database error", async () => {
    mockPrisma.job.findMany.mockRejectedValue(new Error("DB error"));
    const req = new NextRequest("http://localhost:3000/api/canopy/roles");
    const res = await GET(req);
    expect(res.status).toBe(500);
  });
});

// ── POST Tests ──────────────────────────────────────────────

describe("POST /api/canopy/roles", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: "supabase-1" } },
    });
    mockPrisma.account.findUnique.mockResolvedValue({
      id: "account-1",
      orgMemberships: [{ organizationId: "org-1" }],
    });
    mockPrisma.job.findUnique.mockResolvedValue(null); // Slug doesn't exist
    mockPrisma.job.create.mockResolvedValue({
      id: "new-job-1",
      title: "Wind Technician",
      slug: "wind-technician",
      status: "DRAFT",
    });
  });

  it("returns 401 when not authenticated", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });
    const req = new NextRequest("http://localhost:3000/api/canopy/roles", {
      method: "POST",
      body: JSON.stringify({ title: "Test" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 403 when no organization found", async () => {
    mockPrisma.account.findUnique.mockResolvedValue({
      id: "account-1",
      orgMemberships: [],
    });
    const req = new NextRequest("http://localhost:3000/api/canopy/roles", {
      method: "POST",
      body: JSON.stringify({ title: "Test" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  it("creates a role with valid data", async () => {
    const req = new NextRequest("http://localhost:3000/api/canopy/roles", {
      method: "POST",
      body: JSON.stringify({ title: "Wind Technician" }),
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.job.title).toBe("Wind Technician");
    expect(body.job.status).toBe("DRAFT");
  });

  it("validates required title field", async () => {
    const req = new NextRequest("http://localhost:3000/api/canopy/roles", {
      method: "POST",
      body: JSON.stringify({ title: "" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("creates job with correct organizationId and DRAFT status", async () => {
    const req = new NextRequest("http://localhost:3000/api/canopy/roles", {
      method: "POST",
      body: JSON.stringify({
        title: "ESG Analyst",
        locationType: "REMOTE",
        employmentType: "CONTRACT",
      }),
    });
    await POST(req);

    const createCall = mockPrisma.job.create.mock.calls[0][0];
    expect(createCall.data.organizationId).toBe("org-1");
    expect(createCall.data.status).toBe("DRAFT");
    expect(createCall.data.locationType).toBe("REMOTE");
    expect(createCall.data.employmentType).toBe("CONTRACT");
  });

  it("returns 500 on database error", async () => {
    mockPrisma.job.create.mockRejectedValue(new Error("DB error"));
    const req = new NextRequest("http://localhost:3000/api/canopy/roles", {
      method: "POST",
      body: JSON.stringify({ title: "Test" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});
