import { describe, it, expect } from "vitest";
import { isAdminAccount } from "../auth-helpers";

describe("isAdminAccount", () => {
  it("returns false for null account", () => {
    expect(isAdminAccount(null)).toBe(false);
  });

  it("returns false for account with no org memberships", () => {
    expect(isAdminAccount({ orgMemberships: [] })).toBe(false);
  });

  it("returns false for MEMBER role", () => {
    expect(isAdminAccount({ orgMemberships: [{ role: "MEMBER" }] })).toBe(
      false
    );
  });

  it("returns false for VIEWER role", () => {
    expect(isAdminAccount({ orgMemberships: [{ role: "VIEWER" }] })).toBe(
      false
    );
  });

  it("returns true for ADMIN role", () => {
    expect(isAdminAccount({ orgMemberships: [{ role: "ADMIN" }] })).toBe(true);
  });

  it("returns true for OWNER role", () => {
    expect(isAdminAccount({ orgMemberships: [{ role: "OWNER" }] })).toBe(true);
  });

  it("returns true if any membership is admin", () => {
    expect(
      isAdminAccount({
        orgMemberships: [{ role: "MEMBER" }, { role: "ADMIN" }],
      })
    ).toBe(true);
  });
});
