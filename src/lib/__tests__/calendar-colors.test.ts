import { describe, it, expect } from "vitest";
import {
  CALENDAR_ATTENDEE_COLORS,
  getAttendeeColor,
  getAttendeeColorClasses,
  createAttendeeColorMap,
  getAttendeeDotColor,
  getAttendeeBorderColor,
  getAttendeeForegroundColor,
} from "../calendar-colors";

describe("CALENDAR_ATTENDEE_COLORS", () => {
  it("has 8 colors", () => {
    expect(CALENDAR_ATTENDEE_COLORS).toHaveLength(8);
  });

  it("each color has id, name, and cssVar", () => {
    CALENDAR_ATTENDEE_COLORS.forEach((color) => {
      expect(color).toHaveProperty("id");
      expect(color).toHaveProperty("name");
      expect(color).toHaveProperty("cssVar");
      expect(color.cssVar).toMatch(/^calendar-attendee-\d+$/);
    });
  });
});

describe("getAttendeeColor", () => {
  it("returns the first color for index 0", () => {
    expect(getAttendeeColor(0)).toBe(CALENDAR_ATTENDEE_COLORS[0]);
  });

  it("wraps around when index exceeds palette size", () => {
    expect(getAttendeeColor(8)).toBe(CALENDAR_ATTENDEE_COLORS[0]);
    expect(getAttendeeColor(9)).toBe(CALENDAR_ATTENDEE_COLORS[1]);
  });

  it("handles large indices", () => {
    const result = getAttendeeColor(100);
    expect(CALENDAR_ATTENDEE_COLORS).toContain(result);
  });
});

describe("getAttendeeColorClasses", () => {
  it("returns background, foreground, border, and eventCard classes", () => {
    const classes = getAttendeeColorClasses(0);
    expect(classes).toHaveProperty("background");
    expect(classes).toHaveProperty("foreground");
    expect(classes).toHaveProperty("border");
    expect(classes).toHaveProperty("eventCard");
  });

  it("references the correct CSS variable", () => {
    const classes = getAttendeeColorClasses(2);
    const color = CALENDAR_ATTENDEE_COLORS[2];
    expect(classes.background).toContain(color.cssVar);
    expect(classes.foreground).toContain(color.cssVar);
    expect(classes.border).toContain(color.cssVar);
  });
});

describe("createAttendeeColorMap", () => {
  it("creates a map from IDs to colors", () => {
    const map = createAttendeeColorMap(["alice", "bob", "carol"]);
    expect(map.size).toBe(3);
    expect(map.get("alice")).toBe(CALENDAR_ATTENDEE_COLORS[0]);
    expect(map.get("bob")).toBe(CALENDAR_ATTENDEE_COLORS[1]);
    expect(map.get("carol")).toBe(CALENDAR_ATTENDEE_COLORS[2]);
  });

  it("handles numeric IDs", () => {
    const map = createAttendeeColorMap([1, 2, 3]);
    expect(map.get(1)).toBe(CALENDAR_ATTENDEE_COLORS[0]);
  });

  it("handles empty array", () => {
    const map = createAttendeeColorMap([]);
    expect(map.size).toBe(0);
  });
});

describe("getAttendeeDotColor", () => {
  it("returns a CSS variable reference", () => {
    const result = getAttendeeDotColor(0);
    expect(result).toMatch(/^var\(--calendar-attendee-\d+-background\)$/);
  });
});

describe("getAttendeeBorderColor", () => {
  it("returns a CSS variable reference for border", () => {
    const result = getAttendeeBorderColor(0);
    expect(result).toMatch(/^var\(--calendar-attendee-\d+-border\)$/);
  });
});

describe("getAttendeeForegroundColor", () => {
  it("returns a CSS variable reference for foreground", () => {
    const result = getAttendeeForegroundColor(0);
    expect(result).toMatch(/^var\(--calendar-attendee-\d+-foreground\)$/);
  });
});
