import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ── Hoisted mocks ───────────────────────────────────────────

const { mockPrisma } = vi.hoisted(() => {
  const mockPrisma = {
    job: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
  };
  return { mockPrisma };
});

vi.mock("@/lib/db", () => ({
  prisma: mockPrisma,
}));

vi.mock("@/lib/logger", () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
  formatError: vi.fn((e: unknown) => (e instanceof Error ? e.message : String(e))),
}));

// ── Import handler after mocks ──────────────────────────────

import { GET } from "../jobs/route";

// ── Fixtures ────────────────────────────────────────────────

const mockJobs = [
  {
    id: "job-1",
    title: "Solar Engineer",
    slug: "solar-engineer",
    description: "Install solar panels",
    location: "Denver, CO",
    locationType: "ONSITE",
    employmentType: "FULL_TIME",
    salaryMin: 60000,
    salaryMax: 80000,
    salaryCurrency: "USD",
    climateCategory: "Renewable Energy",
    impactDescription: "Reduce CO2",
    greenSkills: ["Solar Installation"],
    experienceLevel: "MID",
    isFeatured: false,
    publishedAt: new Date("2025-06-01"),
    closesAt: null,
    organization: {
      id: "org-1",
      name: "Solaris Energy Co.",
      slug: "solaris",
      logo: null,
      isBipocOwned: false,
      isWomenOwned: false,
      isVeteranOwned: false,
    },
    pathway: {
      id: "pathway-1",
      name: "Energy",
      slug: "energy",
      icon: "Lightning",
      color: "yellow",
    },
    _count: { applications: 5 },
  },
];

// ── Tests ───────────────────────────────────────────────────

describe("GET /api/jobs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma.job.count.mockResolvedValue(1);
    mockPrisma.job.findMany.mockResolvedValue(mockJobs);
  });

  it("returns jobs with pagination metadata", async () => {
    const req = new NextRequest("http://localhost:3000/api/jobs");
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.jobs).toHaveLength(1);
    expect(body.pagination).toEqual({
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
    });
  });

  it("formats job data correctly", async () => {
    const req = new NextRequest("http://localhost:3000/api/jobs");
    const res = await GET(req);
    const body = await res.json();
    const job = body.jobs[0];

    expect(job.id).toBe("job-1");
    expect(job.title).toBe("Solar Engineer");
    expect(job.organization.name).toBe("Solaris Energy Co.");
    expect(job.pathway.name).toBe("Energy");
    expect(job.applicationCount).toBe(5);
  });

  it("filters by published status", async () => {
    const req = new NextRequest("http://localhost:3000/api/jobs");
    await GET(req);

    expect(mockPrisma.job.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: "PUBLISHED",
        }),
      })
    );
  });

  it("applies search filter across multiple fields", async () => {
    const req = new NextRequest("http://localhost:3000/api/jobs?search=solar");
    await GET(req);

    const call = mockPrisma.job.findMany.mock.calls[0][0];
    expect(call.where.OR).toBeDefined();
    expect(call.where.OR).toHaveLength(4); // title, description, org name, location
  });

  it("applies pathway filter", async () => {
    const req = new NextRequest("http://localhost:3000/api/jobs?pathway=energy-1");
    await GET(req);

    const call = mockPrisma.job.findMany.mock.calls[0][0];
    expect(call.where.pathwayId).toBe("energy-1");
  });

  it("applies salary range filters with NaN guards", async () => {
    const req = new NextRequest("http://localhost:3000/api/jobs?minSalary=50000&maxSalary=100000");
    await GET(req);

    const call = mockPrisma.job.findMany.mock.calls[0][0];
    expect(call.where.salaryMin).toEqual({ gte: 50000 });
    expect(call.where.salaryMax).toEqual({ lte: 100000 });
  });

  it("ignores NaN salary values", async () => {
    const req = new NextRequest("http://localhost:3000/api/jobs?minSalary=abc&maxSalary=xyz");
    await GET(req);

    const call = mockPrisma.job.findMany.mock.calls[0][0];
    expect(call.where.salaryMin).toBeUndefined();
    expect(call.where.salaryMax).toBeUndefined();
  });

  it("applies pagination parameters", async () => {
    const req = new NextRequest("http://localhost:3000/api/jobs?page=2&limit=10");
    await GET(req);

    const call = mockPrisma.job.findMany.mock.calls[0][0];
    expect(call.skip).toBe(10);
    expect(call.take).toBe(10);
  });

  it("clamps page to minimum 1", async () => {
    const req = new NextRequest("http://localhost:3000/api/jobs?page=-5");
    await GET(req);

    const call = mockPrisma.job.findMany.mock.calls[0][0];
    expect(call.skip).toBe(0); // page 1 => skip 0
  });

  it("clamps limit to maximum 100", async () => {
    const req = new NextRequest("http://localhost:3000/api/jobs?limit=500");
    await GET(req);

    const call = mockPrisma.job.findMany.mock.calls[0][0];
    expect(call.take).toBe(100);
  });

  it("sorts by newest by default", async () => {
    const req = new NextRequest("http://localhost:3000/api/jobs");
    await GET(req);

    const call = mockPrisma.job.findMany.mock.calls[0][0];
    expect(call.orderBy).toEqual([{ isFeatured: "desc" }, { publishedAt: "desc" }]);
  });

  it("supports salary_high sort", async () => {
    const req = new NextRequest("http://localhost:3000/api/jobs?sort=salary_high");
    await GET(req);

    const call = mockPrisma.job.findMany.mock.calls[0][0];
    expect(call.orderBy).toEqual({ salaryMax: "desc" });
  });

  it("returns 500 on database error", async () => {
    mockPrisma.job.count.mockRejectedValue(new Error("DB error"));

    const req = new NextRequest("http://localhost:3000/api/jobs");
    const res = await GET(req);

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("Failed to fetch jobs");
  });
});
