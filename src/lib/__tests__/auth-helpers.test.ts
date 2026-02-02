import { describe, it, expect, vi, beforeEach } from "vitest";
import { isAdminAccount } from "../auth-helpers";

describe("isAdminAccount", () => {
  beforeEach(() => {
    // Reset env between tests
    delete process.env.PLATFORM_ADMIN_EMAILS;
  });

  it("returns false for null account", () => {
    expect(isAdminAccount(null)).toBe(false);
  });

  it("returns false for account with no email", () => {
    expect(isAdminAccount({ orgMemberships: [] })).toBe(false);
  });

  it("returns false for account with no org memberships and non-admin email", () => {
    expect(isAdminAccount({ email: "user@example.com", orgMemberships: [] })).toBe(false);
  });

  it("returns false for OWNER role without admin email", () => {
    expect(
      isAdminAccount({
        email: "user@example.com",
        orgMemberships: [{ role: "OWNER" }],
      })
    ).toBe(false);
  });

  it("returns false for ADMIN role without admin email", () => {
    expect(
      isAdminAccount({
        email: "user@example.com",
        orgMemberships: [{ role: "ADMIN" }],
      })
    ).toBe(false);
  });

  it("returns true for account with email in PLATFORM_ADMIN_EMAILS env var", () => {
    process.env.PLATFORM_ADMIN_EMAILS = "admin@greenjobsboard.us,other@test.com";
    expect(
      isAdminAccount({
        email: "admin@greenjobsboard.us",
        orgMemberships: [],
      })
    ).toBe(true);
  });

  it("handles case-insensitive email comparison", () => {
    process.env.PLATFORM_ADMIN_EMAILS = "Admin@GreenJobsBoard.us";
    expect(
      isAdminAccount({
        email: "admin@greenjobsboard.us",
        orgMemberships: [],
      })
    ).toBe(true);
  });

  it("returns false when PLATFORM_ADMIN_EMAILS is empty string", () => {
    process.env.PLATFORM_ADMIN_EMAILS = "";
    expect(
      isAdminAccount({
        email: "admin@greenjobsboard.us",
        orgMemberships: [{ role: "OWNER" }],
      })
    ).toBe(false);
  });

  it("returns false for email not in admin list even with OWNER role", () => {
    process.env.PLATFORM_ADMIN_EMAILS = "boss@greenjobsboard.us";
    expect(
      isAdminAccount({
        email: "notboss@greenjobsboard.us",
        orgMemberships: [{ role: "OWNER" }],
      })
    ).toBe(false);
  });
});
