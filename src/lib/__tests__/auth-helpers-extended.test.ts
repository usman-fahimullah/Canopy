import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock dependencies before imports
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    account: {
      findUnique: vi.fn(),
    },
  },
}));

// Must import after mocks are set up
import { isAdminAccount, getAuthenticatedAccount, unauthorizedResponse, forbiddenResponse } from "../auth-helpers";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";

const mockCreateClient = vi.mocked(createClient);
const mockFindUnique = vi.mocked(prisma.account.findUnique);

describe("isAdminAccount - platform admin emails", () => {
  const originalEnv = process.env.PLATFORM_ADMIN_EMAILS;

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.PLATFORM_ADMIN_EMAILS = originalEnv;
    } else {
      delete process.env.PLATFORM_ADMIN_EMAILS;
    }
  });

  it("returns true when account email matches PLATFORM_ADMIN_EMAILS env var", () => {
    process.env.PLATFORM_ADMIN_EMAILS = "admin@greenjobsboard.us,super@greenjobsboard.us";
    const account = { email: "admin@greenjobsboard.us", orgMemberships: [] };
    expect(isAdminAccount(account)).toBe(true);
  });

  it("is case-insensitive for email matching", () => {
    process.env.PLATFORM_ADMIN_EMAILS = "Admin@GreenJobsBoard.us";
    const account = { email: "admin@greenjobsboard.us", orgMemberships: [] };
    expect(isAdminAccount(account)).toBe(true);
  });

  it("trims whitespace from env var email entries", () => {
    process.env.PLATFORM_ADMIN_EMAILS = "  admin@greenjobsboard.us  ,  other@greenjobsboard.us  ";
    const account = { email: "admin@greenjobsboard.us", orgMemberships: [] };
    expect(isAdminAccount(account)).toBe(true);
  });

  it("returns false when email is not in admin list and no admin role", () => {
    process.env.PLATFORM_ADMIN_EMAILS = "admin@greenjobsboard.us";
    const account = { email: "user@example.com", orgMemberships: [{ role: "MEMBER" }] };
    expect(isAdminAccount(account)).toBe(false);
  });

  it("returns false for null account", () => {
    expect(isAdminAccount(null)).toBe(false);
  });

  it("returns false for account with null email and no admin role", () => {
    const account = { email: null, orgMemberships: [{ role: "MEMBER" }] };
    expect(isAdminAccount(account)).toBe(false);
  });

  it("returns false for account with undefined email and no admin role", () => {
    const account = { orgMemberships: [{ role: "VIEWER" }] };
    expect(isAdminAccount(account)).toBe(false);
  });

  it("falls back to org role check when email not in admin list", () => {
    process.env.PLATFORM_ADMIN_EMAILS = "admin@greenjobsboard.us";
    const account = { email: "other@example.com", orgMemberships: [{ role: "OWNER" }] };
    expect(isAdminAccount(account)).toBe(true);
  });

  it("returns true for ADMIN org role even without matching email", () => {
    process.env.PLATFORM_ADMIN_EMAILS = "";
    const account = { email: "user@example.com", orgMemberships: [{ role: "ADMIN" }] };
    expect(isAdminAccount(account)).toBe(true);
  });

  it("returns false for MEMBER role with no admin email match", () => {
    delete process.env.PLATFORM_ADMIN_EMAILS;
    const account = { email: "user@example.com", orgMemberships: [{ role: "MEMBER" }] };
    expect(isAdminAccount(account)).toBe(false);
  });

  it("returns true when one of multiple memberships has OWNER role", () => {
    const account = {
      email: "user@example.com",
      orgMemberships: [
        { role: "VIEWER" },
        { role: "MEMBER" },
        { role: "OWNER" },
      ],
    };
    expect(isAdminAccount(account)).toBe(true);
  });

  it("handles empty orgMemberships array with no matching email", () => {
    delete process.env.PLATFORM_ADMIN_EMAILS;
    const account = { email: "nobody@example.com", orgMemberships: [] };
    expect(isAdminAccount(account)).toBe(false);
  });
});

describe("getAuthenticatedAccount", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockCreateClient.mockReset();
    mockFindUnique.mockReset();
  });

  it("returns null when supabase user is not authenticated", async () => {
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
    } as never);

    const result = await getAuthenticatedAccount();
    expect(result).toBeNull();
  });

  it("returns account when user is authenticated", async () => {
    const mockUser = { id: "supabase-uid-123" };
    const mockAccount = {
      id: "acc_1",
      supabaseId: "supabase-uid-123",
      email: "user@example.com",
      orgMemberships: [{ role: "MEMBER", organizationId: "org_1" }],
      seekerProfile: { id: "sp_1" },
      coachProfile: null,
    };

    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser } }),
      },
    } as never);

    mockFindUnique.mockResolvedValue(mockAccount as never);

    const result = await getAuthenticatedAccount();
    expect(result).toEqual(mockAccount);
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { supabaseId: "supabase-uid-123" },
      include: {
        orgMemberships: { select: { role: true, organizationId: true } },
        seekerProfile: { select: { id: true } },
        coachProfile: { select: { id: true } },
      },
    });
  });

  it("returns null when account is not found in database", async () => {
    const mockUser = { id: "supabase-uid-999" };

    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser } }),
      },
    } as never);

    mockFindUnique.mockResolvedValue(null as never);

    const result = await getAuthenticatedAccount();
    expect(result).toBeNull();
  });
});

describe("unauthorizedResponse", () => {
  it("returns a Response with 401 status", async () => {
    const response = unauthorizedResponse();
    expect(response.status).toBe(401);
  });

  it("returns error message in JSON body", async () => {
    const response = unauthorizedResponse();
    const body = await response.json();
    expect(body).toEqual({ error: "Unauthorized" });
  });
});

describe("forbiddenResponse", () => {
  it("returns a Response with 403 status", async () => {
    const response = forbiddenResponse();
    expect(response.status).toBe(403);
  });

  it("returns default admin message", async () => {
    const response = forbiddenResponse();
    const body = await response.json();
    expect(body).toEqual({ error: "Admin access required" });
  });

  it("accepts custom message", async () => {
    const response = forbiddenResponse("Not allowed");
    const body = await response.json();
    expect(body).toEqual({ error: "Not allowed" });
  });
});
