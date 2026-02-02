import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ── Hoisted mocks (available before vi.mock factories execute) ───

const { mockGetUser, mockPrisma, mockStandardLimiter } = vi.hoisted(() => {
  const mockGetUser = vi.fn();
  const mockPrisma = {
    account: {
      findUnique: vi.fn(),
    },
    workExperience: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };
  const mockStandardLimiter = {
    check: vi.fn().mockResolvedValue({ success: true, remaining: 9, reset: Date.now() + 60000 }),
  };
  return { mockGetUser, mockPrisma, mockStandardLimiter };
});

// ── Module mocks ─────────────────────────────────────────────────

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: { getUser: () => mockGetUser() },
  }),
}));

vi.mock("@/lib/db", () => ({
  prisma: mockPrisma,
}));

vi.mock("@/lib/logger", () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
  formatError: vi.fn((e: unknown) => (e instanceof Error ? e.message : String(e))),
}));

vi.mock("@/lib/rate-limit", () => ({
  standardLimiter: mockStandardLimiter,
}));

// ── Import handlers after mocks ──────────────────────────────────

import { GET, POST } from "../experience/route";
import { PATCH, DELETE } from "../experience/[id]/route";

// ── Test fixtures ────────────────────────────────────────────────

const BASE_URL = "http://localhost:3000/api/experience";
const ITEM_URL = "http://localhost:3000/api/experience/exp-1";

const mockUser = {
  id: "supabase-user-1",
  email: "test@greenjobsboard.us",
};

const mockAccountWithSeeker = {
  id: "account-1",
  supabaseId: "supabase-user-1",
  email: "test@greenjobsboard.us",
  seekerProfile: {
    id: "seeker-1",
  },
};

const mockAccountWithoutSeeker = {
  id: "account-1",
  supabaseId: "supabase-user-1",
  email: "test@greenjobsboard.us",
  seekerProfile: null,
};

const mockExperiences = [
  {
    id: "exp-1",
    seekerId: "seeker-1",
    companyName: "Solaris Energy Co.",
    jobTitle: "Solar Engineer",
    employmentType: "FULL_TIME",
    workType: "ONSITE",
    startDate: new Date("2023-01-01"),
    endDate: null,
    isCurrent: true,
    description: "Designing solar panels",
    skills: ["Solar", "Engineering"],
  },
  {
    id: "exp-2",
    seekerId: "seeker-1",
    companyName: "GreenLeaf Solar",
    jobTitle: "Junior Engineer",
    employmentType: "FULL_TIME",
    workType: "REMOTE",
    startDate: new Date("2021-06-01"),
    endDate: new Date("2022-12-31"),
    isCurrent: false,
    description: null,
    skills: [],
  },
];

const validCreateData = {
  companyName: "Aurora Climate",
  jobTitle: "Climate Analyst",
  startDate: "2024-01-01",
  employmentType: "FULL_TIME",
};

// ── Tests: GET /api/experience ───────────────────────────────────

describe("GET /api/experience", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUser.mockResolvedValue({ data: { user: mockUser } });
    mockPrisma.account.findUnique.mockResolvedValue(mockAccountWithSeeker);
    mockPrisma.workExperience.findMany.mockResolvedValue(mockExperiences);
  });

  it("returns 401 when not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Unauthorized");
  });

  it("returns 404 when seeker profile not found", async () => {
    mockPrisma.account.findUnique.mockResolvedValue(mockAccountWithoutSeeker);

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe("Seeker profile not found");
  });

  it("returns experiences for authenticated user", async () => {
    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.experiences).toHaveLength(2);
    expect(json.experiences[0].companyName).toBe("Solaris Energy Co.");
  });

  it("queries with correct seekerId and ordering", async () => {
    await GET();

    expect(mockPrisma.workExperience.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { seekerId: "seeker-1" },
        orderBy: { startDate: "desc" },
        take: 100,
      })
    );
  });
});

// ── Tests: POST /api/experience ──────────────────────────────────

describe("POST /api/experience", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUser.mockResolvedValue({ data: { user: mockUser } });
    mockPrisma.account.findUnique.mockResolvedValue(mockAccountWithSeeker);
    mockPrisma.workExperience.create.mockResolvedValue({
      id: "exp-new",
      seekerId: "seeker-1",
      ...validCreateData,
    });
    mockStandardLimiter.check.mockResolvedValue({
      success: true,
      remaining: 9,
      reset: Date.now() + 60000,
    });
  });

  it("returns 401 when not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const req = new NextRequest(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validCreateData),
    });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Unauthorized");
  });

  it("returns 404 when seeker profile not found", async () => {
    mockPrisma.account.findUnique.mockResolvedValue(mockAccountWithoutSeeker);

    const req = new NextRequest(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validCreateData),
    });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe("Seeker profile not found");
  });

  it("creates experience with valid data", async () => {
    const req = new NextRequest(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validCreateData),
    });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.experience).toBeDefined();
    expect(mockPrisma.workExperience.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          seekerId: "seeker-1",
          companyName: "Aurora Climate",
          jobTitle: "Climate Analyst",
        }),
      })
    );
  });

  it("returns 422 for missing required fields", async () => {
    const req = new NextRequest(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyName: "" }),
    });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(422);
    expect(json.error).toBe("Validation failed");
    expect(json.details).toBeDefined();
  });

  it("returns 422 for invalid data (empty jobTitle)", async () => {
    const req = new NextRequest(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...validCreateData, jobTitle: "" }),
    });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(422);
    expect(json.error).toBe("Validation failed");
  });

  it("returns 429 when rate limited", async () => {
    mockStandardLimiter.check.mockResolvedValue({
      success: false,
      remaining: 0,
      reset: Date.now() + 60000,
    });

    const req = new NextRequest(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validCreateData),
    });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(429);
    expect(json.error).toContain("Too many requests");
  });
});

// ── Tests: PATCH /api/experience/[id] ────────────────────────────

describe("PATCH /api/experience/[id]", () => {
  const routeParams = { params: { id: "exp-1" } };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUser.mockResolvedValue({ data: { user: mockUser } });
    mockPrisma.account.findUnique.mockResolvedValue(mockAccountWithSeeker);
    mockPrisma.workExperience.findUnique.mockResolvedValue(mockExperiences[0]);
    mockPrisma.workExperience.update.mockResolvedValue({
      ...mockExperiences[0],
      companyName: "Updated Company",
    });
    mockStandardLimiter.check.mockResolvedValue({
      success: true,
      remaining: 9,
      reset: Date.now() + 60000,
    });
  });

  it("returns 401 when not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const req = new NextRequest(ITEM_URL, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyName: "Updated" }),
    });
    const res = await PATCH(req, routeParams);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Unauthorized");
  });

  it("returns 404 when experience not found", async () => {
    mockPrisma.workExperience.findUnique.mockResolvedValue(null);

    const req = new NextRequest(ITEM_URL, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyName: "Updated" }),
    });
    const res = await PATCH(req, routeParams);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe("Not found");
  });

  it("returns 404 when experience belongs to a different seeker", async () => {
    mockPrisma.workExperience.findUnique.mockResolvedValue({
      ...mockExperiences[0],
      seekerId: "different-seeker",
    });

    const req = new NextRequest(ITEM_URL, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyName: "Updated" }),
    });
    const res = await PATCH(req, routeParams);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe("Not found");
  });

  it("updates experience with valid data", async () => {
    const req = new NextRequest(ITEM_URL, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyName: "Updated Company", skills: ["Python"] }),
    });
    const res = await PATCH(req, routeParams);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.experience).toBeDefined();
    expect(mockPrisma.workExperience.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "exp-1" },
        data: expect.objectContaining({
          companyName: "Updated Company",
          skills: ["Python"],
        }),
      })
    );
  });

  it("returns 422 for invalid update data", async () => {
    const req = new NextRequest(ITEM_URL, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      // endDate as a number is invalid
      body: JSON.stringify({ endDate: 12345 }),
    });
    const res = await PATCH(req, routeParams);
    const json = await res.json();

    expect(res.status).toBe(422);
    expect(json.error).toBe("Validation failed");
  });
});

// ── Tests: DELETE /api/experience/[id] ───────────────────────────

describe("DELETE /api/experience/[id]", () => {
  const routeParams = { params: { id: "exp-1" } };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUser.mockResolvedValue({ data: { user: mockUser } });
    mockPrisma.account.findUnique.mockResolvedValue(mockAccountWithSeeker);
    mockPrisma.workExperience.findUnique.mockResolvedValue(mockExperiences[0]);
    mockPrisma.workExperience.delete.mockResolvedValue(mockExperiences[0]);
    mockStandardLimiter.check.mockResolvedValue({
      success: true,
      remaining: 9,
      reset: Date.now() + 60000,
    });
  });

  it("returns 401 when not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const req = new NextRequest(ITEM_URL, { method: "DELETE" });
    const res = await DELETE(req, routeParams);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Unauthorized");
  });

  it("returns 404 when experience not found", async () => {
    mockPrisma.workExperience.findUnique.mockResolvedValue(null);

    const req = new NextRequest(ITEM_URL, { method: "DELETE" });
    const res = await DELETE(req, routeParams);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe("Not found");
  });

  it("returns 404 when experience belongs to a different seeker", async () => {
    mockPrisma.workExperience.findUnique.mockResolvedValue({
      ...mockExperiences[0],
      seekerId: "different-seeker",
    });

    const req = new NextRequest(ITEM_URL, { method: "DELETE" });
    const res = await DELETE(req, routeParams);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe("Not found");
  });

  it("deletes experience successfully", async () => {
    const req = new NextRequest(ITEM_URL, { method: "DELETE" });
    const res = await DELETE(req, routeParams);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(mockPrisma.workExperience.delete).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "exp-1" },
      })
    );
  });

  it("returns 429 when rate limited", async () => {
    mockStandardLimiter.check.mockResolvedValue({
      success: false,
      remaining: 0,
      reset: Date.now() + 60000,
    });

    const req = new NextRequest(ITEM_URL, { method: "DELETE" });
    const res = await DELETE(req, routeParams);
    const json = await res.json();

    expect(res.status).toBe(429);
    expect(json.error).toContain("Too many requests");
  });
});
