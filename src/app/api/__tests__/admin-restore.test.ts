import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ── Hoisted mocks ───────────────────────────────────────────

const { mockPrisma, mockSupabase, mockStandardLimiter, mockRestoreRecord } = vi.hoisted(() => {
  const mockPrisma = {
    account: { findUnique: vi.fn() },
  };
  const mockSupabase = {
    auth: { getUser: vi.fn() },
  };
  const mockStandardLimiter = {
    check: vi.fn(),
  };
  const mockRestoreRecord = vi.fn();
  return { mockPrisma, mockSupabase, mockStandardLimiter, mockRestoreRecord };
});

vi.mock("@/lib/db", () => ({ prisma: mockPrisma }));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue(mockSupabase),
}));

vi.mock("@/lib/rate-limit", () => ({
  standardLimiter: mockStandardLimiter,
}));

vi.mock("@/lib/soft-delete", () => ({
  restoreRecord: mockRestoreRecord,
}));

vi.mock("@/lib/logger", () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
  formatError: vi.fn((e: unknown) => (e instanceof Error ? e.message : String(e))),
}));

// ── Import handler after mocks ──────────────────────────────

import { POST } from "../admin/restore/route";

// ── Tests ───────────────────────────────────────────────────

describe("POST /api/admin/restore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStandardLimiter.check.mockResolvedValue({ success: true });
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: "supabase-1" } },
    });
    mockPrisma.account.findUnique.mockResolvedValue({
      id: "account-1",
      orgMemberships: [{ role: "ADMIN" }],
    });
    mockRestoreRecord.mockResolvedValue(undefined);
  });

  it("returns 429 when rate limited", async () => {
    mockStandardLimiter.check.mockResolvedValue({ success: false });
    const req = new NextRequest("http://localhost:3000/api/admin/restore", {
      method: "POST",
      body: JSON.stringify({ model: "application", id: "app-1" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(429);
  });

  it("returns 401 when not authenticated", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });
    const req = new NextRequest("http://localhost:3000/api/admin/restore", {
      method: "POST",
      body: JSON.stringify({ model: "application", id: "app-1" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 403 when not admin", async () => {
    mockPrisma.account.findUnique.mockResolvedValue({
      id: "account-1",
      orgMemberships: [{ role: "MEMBER" }],
    });
    const req = new NextRequest("http://localhost:3000/api/admin/restore", {
      method: "POST",
      body: JSON.stringify({ model: "application", id: "app-1" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  it("returns 422 for invalid model", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/restore", {
      method: "POST",
      body: JSON.stringify({ model: "invalid", id: "test-1" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(422);
  });

  it("restores record successfully", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/restore", {
      method: "POST",
      body: JSON.stringify({ model: "application", id: "app-1" }),
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.restored).toEqual({ model: "application", id: "app-1" });
    expect(mockRestoreRecord).toHaveBeenCalledWith("application", "app-1", "account-1");
  });

  it("returns 500 on restore error", async () => {
    mockRestoreRecord.mockRejectedValue(new Error("Restore failed"));
    const req = new NextRequest("http://localhost:3000/api/admin/restore", {
      method: "POST",
      body: JSON.stringify({ model: "session", id: "session-1" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});
