import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ── Hoisted mocks ───────────────────────────────────────────

const { mockPrisma, mockSupabase } = vi.hoisted(() => {
  const mockPrisma = {
    job: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
    organizationMember: {
      findFirst: vi.fn(),
    },
    account: {
      findUnique: vi.fn(),
    },
  };
  const mockSupabase = {
    auth: { getUser: vi.fn() },
  };
  return { mockPrisma, mockSupabase };
});

vi.mock("@/lib/db", () => ({ prisma: mockPrisma }));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue(mockSupabase),
}));

vi.mock("@/lib/logger", () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
  formatError: vi.fn((e: unknown) => (e instanceof Error ? e.message : String(e))),
}));

// ── Import handler after mocks ──────────────────────────────

import { GET } from "../jobs/[id]/route";

// ── Fixtures ────────────────────────────────────────────────

const mockJob = {
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
  requiredCerts: ["NABCEP"],
  experienceLevel: "MID",
  isFeatured: false,
  publishedAt: new Date("2025-06-01"),
  closesAt: null,
  status: "PUBLISHED",
  organizationId: "org-1",
  pathwayId: "p-1",
  organization: {
    id: "org-1",
    name: "Solaris Energy Co.",
    slug: "solaris",
    logo: null,
    isBipocOwned: false,
    isWomenOwned: false,
    isVeteranOwned: false,
    description: "Solar company",
  },
  pathway: {
    id: "p-1",
    name: "Energy",
    slug: "energy",
    icon: "Lightning",
    color: "yellow",
  },
};

const mockParams = Promise.resolve({ id: "job-1" });

// ── Tests ───────────────────────────────────────────────────

describe("GET /api/jobs/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: "supabase-1" } },
    });
    mockPrisma.job.findUnique.mockResolvedValue(mockJob);
    mockPrisma.job.findMany.mockResolvedValue([]);
    mockPrisma.organizationMember.findFirst.mockResolvedValue({
      account: { name: "Recruiter", email: "recruiter@example.com", avatar: null },
      title: "Senior Recruiter",
    });
    mockPrisma.account.findUnique.mockResolvedValue({
      seekerProfile: { savedJobs: [] },
    });
  });

  it("returns 401 when not authenticated", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });
    const req = new NextRequest("http://localhost:3000/api/jobs/job-1");
    const res = await GET(req, { params: mockParams });
    expect(res.status).toBe(401);
  });

  it("returns 404 when job not found", async () => {
    mockPrisma.job.findUnique.mockResolvedValue(null);
    const req = new NextRequest("http://localhost:3000/api/jobs/job-1");
    const res = await GET(req, { params: mockParams });
    expect(res.status).toBe(404);
  });

  it("returns 404 for non-published jobs", async () => {
    mockPrisma.job.findUnique.mockResolvedValue({ ...mockJob, status: "DRAFT" });
    const req = new NextRequest("http://localhost:3000/api/jobs/job-1");
    const res = await GET(req, { params: mockParams });
    expect(res.status).toBe(404);
  });

  it("returns job details with organization and pathway", async () => {
    const req = new NextRequest("http://localhost:3000/api/jobs/job-1");
    const res = await GET(req, { params: mockParams });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.job.title).toBe("Solar Engineer");
    expect(body.job.organization.name).toBe("Solaris Energy Co.");
    expect(body.job.pathway.name).toBe("Energy");
  });

  it("includes recruiter information", async () => {
    const req = new NextRequest("http://localhost:3000/api/jobs/job-1");
    const res = await GET(req, { params: mockParams });
    const body = await res.json();

    expect(body.job.recruiter).toEqual({
      name: "Recruiter",
      title: "Senior Recruiter",
      avatar: null,
    });
  });

  it("includes saved status", async () => {
    mockPrisma.account.findUnique.mockResolvedValue({
      seekerProfile: { savedJobs: [{ seekerId: "s-1", jobId: "job-1", notes: "Great job" }] },
    });
    const req = new NextRequest("http://localhost:3000/api/jobs/job-1");
    const res = await GET(req, { params: mockParams });
    const body = await res.json();

    expect(body.job.isSaved).toBe(true);
    expect(body.job.savedNotes).toBe("Great job");
  });

  it("returns similar jobs", async () => {
    mockPrisma.job.findMany.mockResolvedValue([
      {
        id: "job-2",
        title: "Wind Technician",
        slug: "wind-tech",
        location: "Denver, CO",
        locationType: "ONSITE",
        employmentType: "FULL_TIME",
        climateCategory: "Renewable Energy",
        experienceLevel: "MID",
        pathwayId: "p-1",
        organizationId: "org-2",
        organization: {
          id: "org-2",
          name: "WindCo",
          slug: "windco",
          logo: null,
          isBipocOwned: false,
        },
        pathway: { id: "p-1", name: "Energy", slug: "energy", icon: "Lightning", color: "yellow" },
      },
    ]);
    const req = new NextRequest("http://localhost:3000/api/jobs/job-1");
    const res = await GET(req, { params: mockParams });
    const body = await res.json();

    expect(body.similarJobs).toHaveLength(1);
    expect(body.similarJobs[0].title).toBe("Wind Technician");
  });

  it("returns 500 on database error", async () => {
    mockPrisma.job.findUnique.mockRejectedValue(new Error("DB error"));
    const req = new NextRequest("http://localhost:3000/api/jobs/job-1");
    const res = await GET(req, { params: mockParams });
    expect(res.status).toBe(500);
  });
});
