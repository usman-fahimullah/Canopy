import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ── Hoisted mocks (available before vi.mock factories execute) ───

const { mockGetUser, mockPrisma, mockStandardLimiter } = vi.hoisted(() => {
  const mockGetUser = vi.fn();
  const mockPrisma = {
    account: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    seekerProfile: {
      update: vi.fn(),
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

import { GET, PATCH } from "../profile/route";

// ── Test fixtures ────────────────────────────────────────────────

const BASE_URL = "http://localhost:3000/api/profile";

const mockUser = {
  id: "supabase-user-1",
  email: "test@greenjobsboard.us",
};

const mockAccount = {
  id: "account-1",
  supabaseId: "supabase-user-1",
  email: "test@greenjobsboard.us",
  name: "Test User",
  avatar: null,
  phone: null,
  location: null,
  timezone: null,
  bio: null,
  seekerProfile: {
    id: "seeker-1",
    headline: "Climate Engineer",
    skills: ["React"],
    greenSkills: [],
  },
  coachProfile: null,
};

// ── Tests ────────────────────────────────────────────────────────

describe("GET /api/profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUser.mockResolvedValue({ data: { user: mockUser } });
    mockPrisma.account.findUnique.mockResolvedValue(mockAccount);
  });

  it("returns 401 when not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Unauthorized");
  });

  it("returns 404 when account not found", async () => {
    mockPrisma.account.findUnique.mockResolvedValue(null);

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe("Account not found");
  });

  it("returns profile data for authenticated user", async () => {
    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.account).toBeDefined();
    expect(json.account.id).toBe("account-1");
    expect(json.account.email).toBe("test@greenjobsboard.us");
    expect(json.account.seekerProfile).toBeDefined();
  });

  it("includes seekerProfile and coachProfile in response", async () => {
    const res = await GET();
    const json = await res.json();

    expect(json.account.seekerProfile).toEqual(expect.objectContaining({ id: "seeker-1" }));
    expect(json.account.coachProfile).toBeNull();
  });

  it("queries with correct supabaseId", async () => {
    await GET();

    expect(mockPrisma.account.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { supabaseId: "supabase-user-1" },
        include: { seekerProfile: true, coachProfile: true },
      })
    );
  });
});

describe("PATCH /api/profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUser.mockResolvedValue({ data: { user: mockUser } });
    mockPrisma.account.findUnique.mockResolvedValue(mockAccount);
    mockPrisma.account.update.mockResolvedValue(mockAccount);
    mockPrisma.seekerProfile.update.mockResolvedValue(mockAccount.seekerProfile);
    mockStandardLimiter.check.mockResolvedValue({
      success: true,
      remaining: 9,
      reset: Date.now() + 60000,
    });
  });

  it("returns 401 when not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const req = new NextRequest(BASE_URL, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "New Name" }),
    });
    const res = await PATCH(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Unauthorized");
  });

  it("returns 404 when account not found", async () => {
    mockPrisma.account.findUnique.mockResolvedValue(null);

    const req = new NextRequest(BASE_URL, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "New Name" }),
    });
    const res = await PATCH(req);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe("Account not found");
  });

  it("returns 422 for invalid input (name too long)", async () => {
    const req = new NextRequest(BASE_URL, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "a".repeat(101) }),
    });
    const res = await PATCH(req);
    const json = await res.json();

    expect(res.status).toBe(422);
    expect(json.error).toBe("Validation failed");
    expect(json.details).toBeDefined();
  });

  it("returns 422 for invalid avatar URL", async () => {
    const req = new NextRequest(BASE_URL, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatar: "not-a-url" }),
    });
    const res = await PATCH(req);
    const json = await res.json();

    expect(res.status).toBe(422);
    expect(json.error).toBe("Validation failed");
  });

  it("updates account fields successfully", async () => {
    const updatedAccount = { ...mockAccount, name: "Jane Doe", bio: "Updated bio" };
    mockPrisma.account.update.mockResolvedValue(updatedAccount);
    mockPrisma.account.findUnique
      .mockResolvedValueOnce(mockAccount)
      .mockResolvedValueOnce(updatedAccount);

    const req = new NextRequest(BASE_URL, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Jane Doe", bio: "Updated bio" }),
    });
    const res = await PATCH(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.account).toBeDefined();
    expect(mockPrisma.account.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "account-1" },
        data: expect.objectContaining({
          name: "Jane Doe",
          bio: "Updated bio",
        }),
      })
    );
  });

  it("updates seeker profile fields when seekerProfile exists", async () => {
    mockPrisma.account.findUnique
      .mockResolvedValueOnce(mockAccount)
      .mockResolvedValueOnce(mockAccount);

    const req = new NextRequest(BASE_URL, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ headline: "Senior Engineer", skills: ["Python", "TensorFlow"] }),
    });
    const res = await PATCH(req);

    expect(res.status).toBe(200);
    expect(mockPrisma.seekerProfile.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "seeker-1" },
        data: expect.objectContaining({
          headline: "Senior Engineer",
          skills: ["Python", "TensorFlow"],
        }),
      })
    );
  });

  it("returns 429 when rate limited", async () => {
    mockStandardLimiter.check.mockResolvedValue({
      success: false,
      remaining: 0,
      reset: Date.now() + 60000,
    });

    const req = new NextRequest(BASE_URL, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "New Name" }),
    });
    const res = await PATCH(req);
    const json = await res.json();

    expect(res.status).toBe(429);
    expect(json.error).toContain("Too many requests");
  });

  it("does not update account when no account fields are provided", async () => {
    mockPrisma.account.findUnique
      .mockResolvedValueOnce(mockAccount)
      .mockResolvedValueOnce(mockAccount);

    const req = new NextRequest(BASE_URL, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ headline: "Updated headline" }),
    });
    const res = await PATCH(req);

    expect(res.status).toBe(200);
    expect(mockPrisma.account.update).not.toHaveBeenCalled();
    expect(mockPrisma.seekerProfile.update).toHaveBeenCalled();
  });
});
