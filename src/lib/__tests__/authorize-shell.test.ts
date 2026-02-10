import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockRedirect, mockGetCachedAuthContext } = vi.hoisted(() => ({
  mockRedirect: vi.fn(),
  mockGetCachedAuthContext: vi.fn(),
}));

vi.mock("next/navigation", () => ({ redirect: (...args: unknown[]) => { mockRedirect(...args); throw new Error("NEXT_REDIRECT"); } }));
vi.mock("@/lib/access-control", () => ({ getCachedAuthContext: () => mockGetCachedAuthContext() }));

import { authorizeShell } from "../shell/authorize-shell";

describe("authorizeShell", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("redirects to /login when no user", async () => {
    mockGetCachedAuthContext.mockResolvedValue(null);
    await expect(authorizeShell("talent")).rejects.toThrow("NEXT_REDIRECT");
    expect(mockRedirect).toHaveBeenCalledWith("/login");
  });

  it("authorizes talent shell with hasTalentRole", async () => {
    mockGetCachedAuthContext.mockResolvedValue({ hasTalentRole: true, hasCoachRole: false, hasEmployerRole: false });
    await expect(authorizeShell("talent")).resolves.toBeUndefined();
  });

  it("authorizes coach shell with hasCoachRole", async () => {
    mockGetCachedAuthContext.mockResolvedValue({ hasTalentRole: false, hasCoachRole: true, hasEmployerRole: false });
    await expect(authorizeShell("coach")).resolves.toBeUndefined();
  });

  it("authorizes employer shell with hasEmployerRole", async () => {
    mockGetCachedAuthContext.mockResolvedValue({ hasTalentRole: false, hasCoachRole: false, hasEmployerRole: true });
    await expect(authorizeShell("employer")).resolves.toBeUndefined();
  });

  it("redirects to /onboarding when unauthorized for talent", async () => {
    mockGetCachedAuthContext.mockResolvedValue({ hasTalentRole: false, hasCoachRole: false, hasEmployerRole: false });
    await expect(authorizeShell("talent")).rejects.toThrow("NEXT_REDIRECT");
    expect(mockRedirect).toHaveBeenCalledWith("/onboarding");
  });

  it("redirects to /onboarding when unauthorized for employer", async () => {
    mockGetCachedAuthContext.mockResolvedValue({ hasTalentRole: true, hasCoachRole: false, hasEmployerRole: false });
    await expect(authorizeShell("employer")).rejects.toThrow("NEXT_REDIRECT");
    expect(mockRedirect).toHaveBeenCalledWith("/onboarding");
  });
});
