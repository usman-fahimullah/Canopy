import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ── Hoisted mocks ───────────────────────────────────────────

const { mockPrisma } = vi.hoisted(() => {
  const mockPrisma = {
    coachProfile: {
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

import { GET } from "../coaches/route";

// ── Fixtures ────────────────────────────────────────────────

const mockCoaches = [
  {
    id: "coach-1",
    firstName: "Sarah",
    lastName: "Green",
    photoUrl: null,
    headline: "Climate Career Coach",
    bio: "10 years in sustainability",
    expertise: ["Resume Review", "Interview Prep"],
    sectors: ["Renewable Energy"],
    yearsInClimate: 10,
    sessionRate: 15000, // $150 in cents
    sessionDuration: 60,
    rating: 4.8,
    totalSessions: 50,
    isFeatured: true,
    account: { name: "Sarah Green" },
    _count: { reviews: 12 },
  },
];

// ── Tests ───────────────────────────────────────────────────

describe("GET /api/coaches", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma.coachProfile.findMany.mockResolvedValue(mockCoaches);
  });

  it("returns formatted coaches", async () => {
    const req = new NextRequest("http://localhost:3000/api/coaches");
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.coaches).toHaveLength(1);
    expect(body.coaches[0]).toEqual({
      id: "coach-1",
      firstName: "Sarah",
      lastName: "Green",
      photoUrl: null,
      headline: "Climate Career Coach",
      bio: "10 years in sustainability",
      expertise: ["Resume Review", "Interview Prep"],
      sectors: ["Renewable Energy"],
      yearsInClimate: 10,
      sessionRate: 15000,
      sessionDuration: 60,
      rating: 4.8,
      reviewCount: 12,
      totalSessions: 50,
      isFeatured: true,
    });
  });

  it("filters active coaches only", async () => {
    const req = new NextRequest("http://localhost:3000/api/coaches");
    await GET(req);

    const call = mockPrisma.coachProfile.findMany.mock.calls[0][0];
    expect(call.where.status).toBe("ACTIVE");
    expect(call.where.isActive).toBe(true);
  });

  it("applies search filter", async () => {
    const req = new NextRequest("http://localhost:3000/api/coaches?search=Sarah");
    await GET(req);

    const call = mockPrisma.coachProfile.findMany.mock.calls[0][0];
    expect(call.where.OR).toBeDefined();
    expect(call.where.OR).toHaveLength(4);
  });

  it("applies price range filter with NaN guard", async () => {
    const req = new NextRequest("http://localhost:3000/api/coaches?minPrice=100&maxPrice=200");
    await GET(req);

    const call = mockPrisma.coachProfile.findMany.mock.calls[0][0];
    expect(call.where.sessionRate).toEqual({ gte: 10000, lte: 20000 }); // Converted to cents
  });

  it("ignores NaN price values", async () => {
    const req = new NextRequest("http://localhost:3000/api/coaches?minPrice=abc");
    await GET(req);

    const call = mockPrisma.coachProfile.findMany.mock.calls[0][0];
    expect(call.where.sessionRate).toBeUndefined();
  });

  it("applies rating filter with range validation", async () => {
    const req = new NextRequest("http://localhost:3000/api/coaches?minRating=4.0");
    await GET(req);

    const call = mockPrisma.coachProfile.findMany.mock.calls[0][0];
    expect(call.where.rating).toEqual({ gte: 4.0 });
  });

  it("ignores out-of-range rating values", async () => {
    const req = new NextRequest("http://localhost:3000/api/coaches?minRating=6");
    await GET(req);

    const call = mockPrisma.coachProfile.findMany.mock.calls[0][0];
    expect(call.where.rating).toBeUndefined();
  });

  it("ignores NaN rating values", async () => {
    const req = new NextRequest("http://localhost:3000/api/coaches?minRating=abc");
    await GET(req);

    const call = mockPrisma.coachProfile.findMany.mock.calls[0][0];
    expect(call.where.rating).toBeUndefined();
  });

  it("sorts by rating by default", async () => {
    const req = new NextRequest("http://localhost:3000/api/coaches");
    await GET(req);

    const call = mockPrisma.coachProfile.findMany.mock.calls[0][0];
    expect(call.orderBy).toEqual([{ isFeatured: "desc" }, { rating: "desc" }]);
  });

  it("supports price_low sort", async () => {
    const req = new NextRequest("http://localhost:3000/api/coaches?sort=price_low");
    await GET(req);

    const call = mockPrisma.coachProfile.findMany.mock.calls[0][0];
    expect(call.orderBy).toEqual({ sessionRate: "asc" });
  });

  it("applies featured filter", async () => {
    const req = new NextRequest("http://localhost:3000/api/coaches?featured=true");
    await GET(req);

    const call = mockPrisma.coachProfile.findMany.mock.calls[0][0];
    expect(call.where.isFeatured).toBe(true);
  });

  it("limits results to 100", async () => {
    const req = new NextRequest("http://localhost:3000/api/coaches");
    await GET(req);

    const call = mockPrisma.coachProfile.findMany.mock.calls[0][0];
    expect(call.take).toBe(100);
  });

  it("returns 500 on database error", async () => {
    mockPrisma.coachProfile.findMany.mockRejectedValue(new Error("DB error"));

    const req = new NextRequest("http://localhost:3000/api/coaches");
    const res = await GET(req);

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("Failed to fetch coaches");
  });
});
