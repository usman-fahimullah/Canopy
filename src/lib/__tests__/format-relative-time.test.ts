import { describe, it, expect, vi, afterEach } from "vitest";
import { formatRelativeTime } from "../format-relative-time";

describe("formatRelativeTime", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "Never" for null', () => {
    expect(formatRelativeTime(null)).toBe("Never");
  });

  it('returns "Never" for undefined', () => {
    expect(formatRelativeTime(undefined)).toBe("Never");
  });

  it('returns "Just now" for a date less than a minute ago', () => {
    const now = new Date();
    expect(formatRelativeTime(now)).toBe("Just now");
  });

  it("returns minutes ago", () => {
    vi.useFakeTimers();
    const baseTime = new Date("2025-06-15T12:00:00Z");
    vi.setSystemTime(baseTime);

    const fiveMinAgo = new Date("2025-06-15T11:55:00Z");
    expect(formatRelativeTime(fiveMinAgo)).toBe("5 mins ago");

    const oneMinAgo = new Date("2025-06-15T11:59:00Z");
    expect(formatRelativeTime(oneMinAgo)).toBe("1 min ago");
  });

  it("returns hours ago", () => {
    vi.useFakeTimers();
    const baseTime = new Date("2025-06-15T12:00:00Z");
    vi.setSystemTime(baseTime);

    const twoHoursAgo = new Date("2025-06-15T10:00:00Z");
    expect(formatRelativeTime(twoHoursAgo)).toBe("2 hours ago");

    const oneHourAgo = new Date("2025-06-15T11:00:00Z");
    expect(formatRelativeTime(oneHourAgo)).toBe("1 hour ago");
  });

  it("returns days ago", () => {
    vi.useFakeTimers();
    const baseTime = new Date("2025-06-15T12:00:00Z");
    vi.setSystemTime(baseTime);

    const oneDayAgo = new Date("2025-06-14T12:00:00Z");
    expect(formatRelativeTime(oneDayAgo)).toBe("1 day ago");

    const threeDaysAgo = new Date("2025-06-12T12:00:00Z");
    expect(formatRelativeTime(threeDaysAgo)).toBe("3 days ago");
  });

  it("returns weeks ago", () => {
    vi.useFakeTimers();
    const baseTime = new Date("2025-06-15T12:00:00Z");
    vi.setSystemTime(baseTime);

    const twoWeeksAgo = new Date("2025-06-01T12:00:00Z");
    expect(formatRelativeTime(twoWeeksAgo)).toBe("2 weeks ago");

    const oneWeekAgo = new Date("2025-06-08T12:00:00Z");
    expect(formatRelativeTime(oneWeekAgo)).toBe("1 week ago");
  });

  it("returns months ago", () => {
    vi.useFakeTimers();
    const baseTime = new Date("2025-06-15T12:00:00Z");
    vi.setSystemTime(baseTime);

    const threeMonthsAgo = new Date("2025-03-15T12:00:00Z");
    expect(formatRelativeTime(threeMonthsAgo)).toBe("3 months ago");

    const oneMonthAgo = new Date("2025-05-15T12:00:00Z");
    expect(formatRelativeTime(oneMonthAgo)).toBe("1 month ago");
  });

  it("returns years ago", () => {
    vi.useFakeTimers();
    const baseTime = new Date("2025-06-15T12:00:00Z");
    vi.setSystemTime(baseTime);

    const twoYearsAgo = new Date("2023-06-15T12:00:00Z");
    expect(formatRelativeTime(twoYearsAgo)).toBe("2 years ago");

    const oneYearAgo = new Date("2024-06-14T12:00:00Z");
    expect(formatRelativeTime(oneYearAgo)).toBe("1 year ago");
  });

  it("accepts a date string", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-15T12:00:00Z"));
    expect(formatRelativeTime("2025-06-15T11:55:00Z")).toBe("5 mins ago");
  });

  it("accepts a Date object", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-15T12:00:00Z"));
    expect(formatRelativeTime(new Date("2025-06-15T11:55:00Z"))).toBe("5 mins ago");
  });
});
