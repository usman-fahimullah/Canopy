import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/db", () => ({
  prisma: {
    coachProfile: { findUnique: vi.fn() },
    session: { findMany: vi.fn(), count: vi.fn() },
  },
}));

vi.mock("@/lib/logger", () => ({
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn(), debug: vi.fn() },
  formatError: vi.fn((e) => String(e)),
}));

import { parseAvailability } from "../availability";

describe("parseAvailability", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns null for null input", () => {
    expect(parseAvailability(null)).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(parseAvailability("")).toBeNull();
  });

  it("parses valid JSON availability", () => {
    const avail = {
      monday: [{ start: "09:00", end: "17:00" }],
      tuesday: [],
      wednesday: [{ start: "10:00", end: "14:00" }],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    };
    const result = parseAvailability(JSON.stringify(avail));
    expect(result).toEqual(avail);
  });

  it("returns null for invalid JSON", () => {
    expect(parseAvailability("not valid json")).toBeNull();
  });

  it("handles multiple time windows per day", () => {
    const avail = {
      monday: [
        { start: "09:00", end: "12:00" },
        { start: "14:00", end: "17:00" },
      ],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    };
    const result = parseAvailability(JSON.stringify(avail));
    expect(result).not.toBeNull();
    expect(result!.monday).toHaveLength(2);
  });
});
