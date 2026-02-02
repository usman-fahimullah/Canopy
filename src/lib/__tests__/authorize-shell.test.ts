import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockRedirect, mockGetServerUser, mockFindUnique } = vi.hoisted(() => ({
  mockRedirect: vi.fn(),
  mockGetServerUser: vi.fn(),
  mockFindUnique: vi.fn(),
}));

vi.mock("next/navigation", () => ({ redirect: (...args: unknown[]) => { mockRedirect(...args); throw new Error("NEXT_REDIRECT"); } }));
vi.mock("@/lib/supabase/get-server-user", () => ({ getServerUser: () => mockGetServerUser() }));
vi.mock("@/lib/db", () => ({ prisma: { account: { findUnique: mockFindUnique } } }));

import { authorizeShell } from "../shell/authorize-shell";

describe("authorizeShell", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("redirects to /login when no user", async () => {
    mockGetServerUser.mockResolvedValue(null);
    await expect(authorizeShell("talent")).rejects.toThrow("NEXT_REDIRECT");
    expect(mockRedirect).toHaveBeenCalledWith("/login");
  });

  it("redirects to /login when no account found", async () => {
    mockGetServerUser.mockResolvedValue({ id: "u1" });
    mockFindUnique.mockResolvedValue(null);
    await expect(authorizeShell("talent")).rejects.toThrow("NEXT_REDIRECT");
    expect(mockRedirect).toHaveBeenCalledWith("/login");
  });

  it("authorizes talent shell with seekerProfile", async () => {
    mockGetServerUser.mockResolvedValue({ id: "u1" });
    mockFindUnique.mockResolvedValue({ activeRoles: [], seekerProfile: { id: "sp1" }, coachProfile: null, orgMemberships: [] });
    await expect(authorizeShell("talent")).resolves.toBeUndefined();
  });

  it("authorizes talent shell with activeRoles", async () => {
    mockGetServerUser.mockResolvedValue({ id: "u1" });
    mockFindUnique.mockResolvedValue({ activeRoles: ["talent"], seekerProfile: null, coachProfile: null, orgMemberships: [] });
    await expect(authorizeShell("talent")).resolves.toBeUndefined();
  });

  it("authorizes coach shell with coachProfile", async () => {
    mockGetServerUser.mockResolvedValue({ id: "u1" });
    mockFindUnique.mockResolvedValue({ activeRoles: [], seekerProfile: null, coachProfile: { id: "cp1" }, orgMemberships: [] });
    await expect(authorizeShell("coach")).resolves.toBeUndefined();
  });

  it("authorizes employer shell with orgMemberships", async () => {
    mockGetServerUser.mockResolvedValue({ id: "u1" });
    mockFindUnique.mockResolvedValue({ activeRoles: [], seekerProfile: null, coachProfile: null, orgMemberships: [{ id: "m1" }] });
    await expect(authorizeShell("employer")).resolves.toBeUndefined();
  });

  it("redirects to /onboarding when unauthorized for talent", async () => {
    mockGetServerUser.mockResolvedValue({ id: "u1" });
    mockFindUnique.mockResolvedValue({ activeRoles: [], seekerProfile: null, coachProfile: null, orgMemberships: [] });
    await expect(authorizeShell("talent")).rejects.toThrow("NEXT_REDIRECT");
    expect(mockRedirect).toHaveBeenCalledWith("/onboarding");
  });

  it("redirects to /onboarding when unauthorized for employer", async () => {
    mockGetServerUser.mockResolvedValue({ id: "u1" });
    mockFindUnique.mockResolvedValue({ activeRoles: ["talent"], seekerProfile: null, coachProfile: null, orgMemberships: [] });
    await expect(authorizeShell("employer")).rejects.toThrow("NEXT_REDIRECT");
    expect(mockRedirect).toHaveBeenCalledWith("/onboarding");
  });
});
