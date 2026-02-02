import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ── Hoisted mocks (available before vi.mock factories execute) ───

const { mockGetUser, mockPrisma, mockStandardLimiter } = vi.hoisted(() => {
  const mockGetUser = vi.fn();
  const mockPrisma = {
    account: {
      findUnique: vi.fn(),
    },
    notification: {
      findMany: vi.fn(),
      count: vi.fn(),
      updateMany: vi.fn(),
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

import { GET, PUT } from "../notifications/route";

// ── Test fixtures ────────────────────────────────────────────────

const BASE_URL = "http://localhost:3000/api/notifications";

const mockUser = {
  id: "supabase-user-1",
  email: "test@greenjobsboard.us",
};

const mockAccount = {
  id: "account-1",
  supabaseId: "supabase-user-1",
  email: "test@greenjobsboard.us",
};

const mockNotifications = [
  {
    id: "notif-1",
    accountId: "account-1",
    type: "SESSION_BOOKED",
    title: "Session Confirmed",
    body: "Your session is confirmed.",
    readAt: null,
    createdAt: new Date("2026-01-15T10:00:00Z"),
  },
  {
    id: "notif-2",
    accountId: "account-1",
    type: "NEW_MESSAGE",
    title: "New message from Jane",
    body: "Hey, how are you?",
    readAt: new Date("2026-01-14T10:00:00Z"),
    createdAt: new Date("2026-01-14T09:00:00Z"),
  },
  {
    id: "notif-3",
    accountId: "account-1",
    type: "REVIEW_REQUEST",
    title: "How was your session?",
    body: "Share your feedback!",
    readAt: null,
    createdAt: new Date("2026-01-13T10:00:00Z"),
  },
];

// ── Tests: GET ───────────────────────────────────────────────────

describe("GET /api/notifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUser.mockResolvedValue({ data: { user: mockUser } });
    mockPrisma.account.findUnique.mockResolvedValue(mockAccount);
    mockPrisma.notification.findMany.mockResolvedValue(mockNotifications);
    mockPrisma.notification.count.mockResolvedValue(2);
  });

  it("returns 401 when not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const req = new NextRequest(BASE_URL, { method: "GET" });
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Unauthorized");
  });

  it("returns 404 when account not found", async () => {
    mockPrisma.account.findUnique.mockResolvedValue(null);

    const req = new NextRequest(BASE_URL, { method: "GET" });
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe("Account not found");
  });

  it("returns notifications for authenticated user", async () => {
    const req = new NextRequest(BASE_URL, { method: "GET" });
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.notifications).toHaveLength(3);
    expect(json.unreadCount).toBe(2);
  });

  it("respects the limit parameter", async () => {
    const req = new NextRequest(`${BASE_URL}?limit=5`, { method: "GET" });
    await GET(req);

    expect(mockPrisma.notification.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 5,
      })
    );
  });

  it("caps limit at 50", async () => {
    const req = new NextRequest(`${BASE_URL}?limit=100`, { method: "GET" });
    await GET(req);

    expect(mockPrisma.notification.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 50,
      })
    );
  });

  it("defaults limit to 20 when not specified", async () => {
    const req = new NextRequest(BASE_URL, { method: "GET" });
    await GET(req);

    expect(mockPrisma.notification.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 20,
      })
    );
  });

  it("filters unread only when unreadOnly=true", async () => {
    const req = new NextRequest(`${BASE_URL}?unreadOnly=true`, { method: "GET" });
    await GET(req);

    expect(mockPrisma.notification.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          accountId: "account-1",
          readAt: null,
        }),
      })
    );
  });

  it("includes both read and unread when unreadOnly is not true", async () => {
    const req = new NextRequest(`${BASE_URL}?unreadOnly=false`, { method: "GET" });
    await GET(req);

    const callArgs = mockPrisma.notification.findMany.mock.calls[0][0];
    expect(callArgs.where).toEqual({ accountId: "account-1" });
  });

  it("orders notifications by createdAt descending", async () => {
    const req = new NextRequest(BASE_URL, { method: "GET" });
    await GET(req);

    expect(mockPrisma.notification.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { createdAt: "desc" },
      })
    );
  });
});

// ── Tests: PUT ───────────────────────────────────────────────────

describe("PUT /api/notifications (mark all read)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUser.mockResolvedValue({ data: { user: mockUser } });
    mockPrisma.account.findUnique.mockResolvedValue(mockAccount);
    mockPrisma.notification.updateMany.mockResolvedValue({ count: 2 });
    mockStandardLimiter.check.mockResolvedValue({
      success: true,
      remaining: 9,
      reset: Date.now() + 60000,
    });
  });

  it("returns 401 when not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const req = new NextRequest(BASE_URL, { method: "PUT" });
    const res = await PUT(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Unauthorized");
  });

  it("returns 404 when account not found", async () => {
    mockPrisma.account.findUnique.mockResolvedValue(null);

    const req = new NextRequest(BASE_URL, { method: "PUT" });
    const res = await PUT(req);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe("Account not found");
  });

  it("marks all unread notifications as read", async () => {
    const req = new NextRequest(BASE_URL, { method: "PUT" });
    const res = await PUT(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(mockPrisma.notification.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          accountId: "account-1",
          readAt: null,
        },
        data: expect.objectContaining({
          readAt: expect.any(Date),
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

    const req = new NextRequest(BASE_URL, { method: "PUT" });
    const res = await PUT(req);
    const json = await res.json();

    expect(res.status).toBe(429);
    expect(json.error).toContain("Too many requests");
  });
});
