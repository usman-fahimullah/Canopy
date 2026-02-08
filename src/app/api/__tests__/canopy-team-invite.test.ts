import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ── Hoisted mocks ───────────────────────────────────────────

const { mockPrisma, mockSupabase, mockStandardLimiter, mockSendEmail } = vi.hoisted(() => {
  const mockPrisma = {
    account: { findUnique: vi.fn() },
    organizationMember: { findFirst: vi.fn() },
    teamInvite: { findFirst: vi.fn(), create: vi.fn() },
  };
  const mockSupabase = {
    auth: { getUser: vi.fn() },
  };
  const mockStandardLimiter = {
    check: vi.fn(),
  };
  const mockSendEmail = vi.fn();
  return { mockPrisma, mockSupabase, mockStandardLimiter, mockSendEmail };
});

vi.mock("@/lib/db", () => ({ prisma: mockPrisma }));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue(mockSupabase),
}));

vi.mock("@/lib/rate-limit", () => ({
  standardLimiter: mockStandardLimiter,
}));

vi.mock("@/lib/email", () => ({
  sendEmail: mockSendEmail.mockResolvedValue(undefined),
  teamInviteEmail: vi.fn().mockReturnValue({ to: "test@example.com", subject: "Invite" }),
}));

vi.mock("@/lib/logger", () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
  formatError: vi.fn((e: unknown) => (e instanceof Error ? e.message : String(e))),
}));

// ── Import handler after mocks ──────────────────────────────

import { POST } from "../canopy/team/invite/route";

// ── Tests ───────────────────────────────────────────────────

describe("POST /api/canopy/team/invite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStandardLimiter.check.mockResolvedValue({ success: true });
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: "supabase-1" } },
    });
    mockPrisma.account.findUnique.mockResolvedValue({
      id: "account-1",
      name: "Admin User",
      email: "admin@example.com",
    });
    mockPrisma.organizationMember.findFirst.mockResolvedValue({
      id: "member-1",
      organization: { id: "org-1", name: "Solaris Energy Co." },
    });
    mockPrisma.teamInvite.findFirst.mockResolvedValue(null); // No existing invite
    mockPrisma.teamInvite.create.mockImplementation(({ data }) => ({
      id: "invite-1",
      ...data,
    }));
  });

  it("returns 429 when rate limited", async () => {
    mockStandardLimiter.check.mockResolvedValue({ success: false });
    const req = new NextRequest("http://localhost:3000/api/canopy/team/invite", {
      method: "POST",
      body: JSON.stringify({
        invites: [{ email: "test@example.com", role: "MEMBER" }],
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(429);
  });

  it("returns 401 when not authenticated", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });
    const req = new NextRequest("http://localhost:3000/api/canopy/team/invite", {
      method: "POST",
      body: JSON.stringify({
        invites: [{ email: "test@example.com", role: "MEMBER" }],
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 403 when user is not ADMIN", async () => {
    mockPrisma.organizationMember.findFirst.mockResolvedValue(null);
    const req = new NextRequest("http://localhost:3000/api/canopy/team/invite", {
      method: "POST",
      body: JSON.stringify({
        invites: [{ email: "test@example.com", role: "MEMBER" }],
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  it("returns 422 for invalid email", async () => {
    const req = new NextRequest("http://localhost:3000/api/canopy/team/invite", {
      method: "POST",
      body: JSON.stringify({
        invites: [{ email: "not-an-email", role: "MEMBER" }],
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(422);
  });

  it("returns 422 for empty invites array", async () => {
    const req = new NextRequest("http://localhost:3000/api/canopy/team/invite", {
      method: "POST",
      body: JSON.stringify({ invites: [] }),
    });
    const res = await POST(req);
    expect(res.status).toBe(422);
  });

  it("creates invites and sends emails", async () => {
    const req = new NextRequest("http://localhost:3000/api/canopy/team/invite", {
      method: "POST",
      body: JSON.stringify({
        invites: [{ email: "new@example.com", role: "RECRUITER" }],
      }),
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.count).toBe(1);
    expect(mockPrisma.teamInvite.create).toHaveBeenCalledTimes(1);
    expect(mockSendEmail).toHaveBeenCalledTimes(1);
  });

  it("skips duplicate pending invites", async () => {
    mockPrisma.teamInvite.findFirst.mockResolvedValue({ id: "existing-invite" });
    const req = new NextRequest("http://localhost:3000/api/canopy/team/invite", {
      method: "POST",
      body: JSON.stringify({
        invites: [{ email: "existing@example.com", role: "MEMBER" }],
      }),
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.count).toBe(0);
    expect(mockPrisma.teamInvite.create).not.toHaveBeenCalled();
  });

  it("returns 500 on database error", async () => {
    mockPrisma.teamInvite.findFirst.mockRejectedValue(new Error("DB error"));
    const req = new NextRequest("http://localhost:3000/api/canopy/team/invite", {
      method: "POST",
      body: JSON.stringify({
        invites: [{ email: "test@example.com", role: "MEMBER" }],
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});
