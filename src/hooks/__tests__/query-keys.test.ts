import { describe, it, expect } from "vitest";
import { queryKeys } from "../queries/keys";

describe("queryKeys", () => {
  describe("canopy.all", () => {
    it("returns the top-level canopy key", () => {
      expect(queryKeys.canopy.all).toEqual(["canopy"]);
    });
  });

  describe("canopy.roles", () => {
    it("all returns base roles key", () => {
      expect(queryKeys.canopy.roles.all).toEqual(["canopy", "roles"]);
    });

    it("list returns list key without filters", () => {
      expect(queryKeys.canopy.roles.list()).toEqual(["canopy", "roles", "list"]);
    });

    it("list returns list key with filters", () => {
      const filters = { status: "PUBLISHED" };
      expect(queryKeys.canopy.roles.list(filters)).toEqual([
        "canopy",
        "roles",
        "list",
        { status: "PUBLISHED" },
      ]);
    });

    it("detail includes the role ID", () => {
      expect(queryKeys.canopy.roles.detail("role_123")).toEqual([
        "canopy",
        "roles",
        "detail",
        "role_123",
      ]);
    });
  });

  describe("canopy.candidates", () => {
    it("all returns base candidates key", () => {
      expect(queryKeys.canopy.candidates.all).toEqual(["canopy", "candidates"]);
    });

    it("list returns list key without filters", () => {
      expect(queryKeys.canopy.candidates.list()).toEqual(["canopy", "candidates", "list"]);
    });

    it("list returns list key with filters", () => {
      const filters = { stage: "interview" };
      expect(queryKeys.canopy.candidates.list(filters)).toEqual([
        "canopy",
        "candidates",
        "list",
        { stage: "interview" },
      ]);
    });

    it("detail includes the seeker ID", () => {
      expect(queryKeys.canopy.candidates.detail("seeker_456")).toEqual([
        "canopy",
        "candidates",
        "detail",
        "seeker_456",
      ]);
    });
  });

  describe("hierarchical key strategy", () => {
    it("roles.all is a prefix of roles.list", () => {
      const allKey = queryKeys.canopy.roles.all;
      const listKey = queryKeys.canopy.roles.list();
      // The list key starts with the all key elements
      expect(listKey.slice(0, allKey.length)).toEqual([...allKey]);
    });

    it("canopy.all is a prefix of all canopy sub-keys", () => {
      const topLevel = queryKeys.canopy.all;
      expect(queryKeys.canopy.dashboard.all[0]).toBe(topLevel[0]);
      expect(queryKeys.canopy.roles.all[0]).toBe(topLevel[0]);
      expect(queryKeys.canopy.candidates.all[0]).toBe(topLevel[0]);
      expect(queryKeys.canopy.team.all[0]).toBe(topLevel[0]);
    });
  });
});
