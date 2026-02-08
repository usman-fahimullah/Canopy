import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";

// ── Hoisted mocks (available before vi.mock factories execute) ───

const {
  mockGetAuthenticatedAccount,
  mockIsAdminAccount,
  mockPrisma,
  mockStandardLimiter,
  mockCreateCoachStatusNotification,
} = vi.hoisted(() => {
  const mockGetAuthenticatedAccount = vi.fn();
  const mockIsAdminAccount = vi.fn();
  const mockPrisma = {
    coachProfile: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  };
  const mockStandardLimiter = {
    check: vi.fn().mockResolvedValue({ success: true, remaining: 9, reset: Date.now() + 60000 }),
  };
  const mockCreateCoachStatusNotification = vi.fn().mockResolvedValue({});
  return {
    mockGetAuthenticatedAccount,
    mockIsAdminAccount,
    mockPrisma,
    mockStandardLimiter,
    mockCreateCoachStatusNotification,
  };
});

// ── Module mocks ─────────────────────────────────────────────────

vi.mock("@/lib/auth-helpers", () => ({
  getAuthenticatedAccount: () => mockGetAuthenticatedAccount(),
  isAdminAccount: (account: unknown) => mockIsAdminAccount(account),
  unauthorizedResponse: () => NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
  forbiddenResponse: (message = "Admin access required") =>
    NextResponse.json({ error: message }, { status: 403 }),
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

vi.mock("@/lib/notifications", () => ({
  createCoachStatusNotification: mockCreateCoachStatusNotification,
}));

// ── Import handlers after mocks ──────────────────────────────────

import { POST as approvePost } from "../admin/coaches/[id]/approve/route";
import { POST as rejectPost } from "../admin/coaches/[id]/reject/route";

// ── Test fixtures ────────────────────────────────────────────────

const APPROVE_URL = "http://localhost:3000/api/admin/coaches/coach-1/approve";
const REJECT_URL = "http://localhost:3000/api/admin/coaches/coach-1/reject";

const mockAdminAccount = {
  id: "admin-1",
  email: "admin@greenjobsboard.us",
  orgMemberships: [{ role: "ADMIN", organizationId: "org-1" }],
};

const mockNonAdminAccount = {
  id: "user-1",
  email: "user@greenjobsboard.us",
  orgMemberships: [{ role: "MEMBER", organizationId: "org-1" }],
};

const mockPendingCoach = {
  id: "coach-1",
  status: "PENDING",
  firstName: "Jane",
  lastName: "Doe",
  availability: null,
  account: {
    id: "account-2",
    email: "jane@greenjobsboard.us",
    name: "Jane Doe",
  },
};

const mockApprovedCoach = {
  id: "coach-1",
  status: "APPROVED",
  firstName: "Jane",
  account: {
    id: "account-2",
    email: "jane@greenjobsboard.us",
    name: "Jane Doe",
  },
};

function makeApproveParams(): { params: Promise<{ id: string }> } {
  return { params: Promise.resolve({ id: "coach-1" }) };
}

function makeRejectParams(): { params: Promise<{ id: string }> } {
  return { params: Promise.resolve({ id: "coach-1" }) };
}

// ── Tests: Approve ───────────────────────────────────────────────

describe("POST /api/admin/coaches/[id]/approve", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAuthenticatedAccount.mockResolvedValue(mockAdminAccount);
    mockIsAdminAccount.mockReturnValue(true);
    mockPrisma.coachProfile.findUnique.mockResolvedValue(mockPendingCoach);
    mockPrisma.coachProfile.update.mockResolvedValue({ ...mockPendingCoach, status: "APPROVED" });
    mockStandardLimiter.check.mockResolvedValue({
      success: true,
      remaining: 9,
      reset: Date.now() + 60000,
    });
  });

  it("returns 401 when not authenticated", async () => {
    mockGetAuthenticatedAccount.mockResolvedValue(null);

    const req = new NextRequest(APPROVE_URL, { method: "POST" });
    const res = await approvePost(req, makeApproveParams());
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Unauthorized");
  });

  it("returns 403 when user is not admin", async () => {
    mockGetAuthenticatedAccount.mockResolvedValue(mockNonAdminAccount);
    mockIsAdminAccount.mockReturnValue(false);

    const req = new NextRequest(APPROVE_URL, { method: "POST" });
    const res = await approvePost(req, makeApproveParams());
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.error).toContain("Admin access required");
  });

  it("returns 404 when coach not found", async () => {
    mockPrisma.coachProfile.findUnique.mockResolvedValue(null);

    const req = new NextRequest(APPROVE_URL, { method: "POST" });
    const res = await approvePost(req, makeApproveParams());
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe("Coach not found");
  });

  it("returns 400 when coach is not in pending status", async () => {
    mockPrisma.coachProfile.findUnique.mockResolvedValue(mockApprovedCoach);

    const req = new NextRequest(APPROVE_URL, { method: "POST" });
    const res = await approvePost(req, makeApproveParams());
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Coach is not in pending status");
  });

  it("successfully approves a pending coach", async () => {
    const req = new NextRequest(APPROVE_URL, { method: "POST" });
    const res = await approvePost(req, makeApproveParams());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.message).toBe("Coach approved successfully");
    expect(mockPrisma.coachProfile.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "coach-1" },
        data: expect.objectContaining({
          status: "APPROVED",
          approvalDate: expect.any(Date),
        }),
      })
    );
  });

  it("sends approval notification after approving", async () => {
    const req = new NextRequest(APPROVE_URL, { method: "POST" });
    await approvePost(req, makeApproveParams());

    expect(mockCreateCoachStatusNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        accountId: "account-2",
        status: "APPROVED",
      })
    );
  });

  it("returns 429 when rate limited", async () => {
    mockStandardLimiter.check.mockResolvedValue({
      success: false,
      remaining: 0,
      reset: Date.now() + 60000,
    });

    const req = new NextRequest(APPROVE_URL, { method: "POST" });
    const res = await approvePost(req, makeApproveParams());
    const json = await res.json();

    expect(res.status).toBe(429);
    expect(json.error).toContain("Too many requests");
  });
});

// ── Tests: Reject ────────────────────────────────────────────────

describe("POST /api/admin/coaches/[id]/reject", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAuthenticatedAccount.mockResolvedValue(mockAdminAccount);
    mockIsAdminAccount.mockReturnValue(true);
    mockPrisma.coachProfile.findUnique.mockResolvedValue(mockPendingCoach);
    mockPrisma.coachProfile.update.mockResolvedValue({ ...mockPendingCoach, status: "REJECTED" });
    mockStandardLimiter.check.mockResolvedValue({
      success: true,
      remaining: 9,
      reset: Date.now() + 60000,
    });
  });

  it("returns 401 when not authenticated", async () => {
    mockGetAuthenticatedAccount.mockResolvedValue(null);

    const req = new NextRequest(REJECT_URL, { method: "POST" });
    const res = await rejectPost(req, makeRejectParams());
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Unauthorized");
  });

  it("returns 403 when user is not admin", async () => {
    mockGetAuthenticatedAccount.mockResolvedValue(mockNonAdminAccount);
    mockIsAdminAccount.mockReturnValue(false);

    const req = new NextRequest(REJECT_URL, { method: "POST" });
    const res = await rejectPost(req, makeRejectParams());
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.error).toContain("Admin access required");
  });

  it("returns 404 when coach not found", async () => {
    mockPrisma.coachProfile.findUnique.mockResolvedValue(null);

    const req = new NextRequest(REJECT_URL, { method: "POST" });
    const res = await rejectPost(req, makeRejectParams());
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe("Coach not found");
  });

  it("returns 400 when coach is not in pending status", async () => {
    mockPrisma.coachProfile.findUnique.mockResolvedValue(mockApprovedCoach);

    const req = new NextRequest(REJECT_URL, { method: "POST" });
    const res = await rejectPost(req, makeRejectParams());
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Coach is not in pending status");
  });

  it("successfully rejects a coach with a reason", async () => {
    const req = new NextRequest(REJECT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: "Insufficient experience" }),
    });
    const res = await rejectPost(req, makeRejectParams());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.message).toBe("Coach rejected");
    expect(mockPrisma.coachProfile.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "coach-1" },
        data: expect.objectContaining({
          status: "REJECTED",
        }),
      })
    );
  });

  it("handles missing reason gracefully (no body)", async () => {
    const req = new NextRequest(REJECT_URL, { method: "POST" });
    const res = await rejectPost(req, makeRejectParams());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
  });

  it("sends rejection notification after rejecting", async () => {
    const req = new NextRequest(REJECT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: "Not enough experience" }),
    });
    await rejectPost(req, makeRejectParams());

    expect(mockCreateCoachStatusNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        accountId: "account-2",
        status: "REJECTED",
      })
    );
  });
});
