import { describe, it, expect } from "vitest";
import {
  cn, formatCurrency, formatDate, truncate, getInitials,
  slugify, isDefined, generateId, sanitizeHtml,
} from "../utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-2", "py-2")).toBe("px-2 py-2");
  });
  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });
  it("resolves tailwind conflicts (last wins)", () => {
    const result = cn("px-2", "px-4");
    expect(result).toBe("px-4");
  });
});

describe("formatCurrency", () => {
  it("formats USD by default", () => {
    const result = formatCurrency(1234.56);
    expect(result).toContain("1,234.56");
  });
  it("formats different currencies", () => {
    const result = formatCurrency(100, "EUR", "de-DE");
    expect(result).toBeTruthy();
  });
});

describe("formatDate", () => {
  it("formats a Date object", () => {
    const result = formatDate(new Date("2025-01-15"));
    expect(result).toContain("2025");
    expect(result).toContain("January");
  });
  it("formats a date string", () => {
    const result = formatDate("2025-06-01");
    expect(result).toContain("2025");
  });
  it("accepts custom options", () => {
    const result = formatDate(new Date("2025-01-15"), { month: "short" });
    expect(result).toContain("Jan");
  });
});

describe("truncate", () => {
  it("does not truncate short strings", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });
  it("truncates long strings with ellipsis", () => {
    expect(truncate("hello world!", 5)).toBe("hello...");
  });
  it("handles exact length", () => {
    expect(truncate("hello", 5)).toBe("hello");
  });
});

describe("getInitials", () => {
  it("extracts initials from two-word name", () => {
    expect(getInitials("John Doe")).toBe("JD");
  });
  it("handles single name", () => {
    expect(getInitials("Madonna")).toBe("MA");
  });
  it("handles three-word name (first + last)", () => {
    expect(getInitials("John Michael Doe")).toBe("JD");
  });
  it("handles reversed comma format", () => {
    expect(getInitials("Doe, John")).toBe("JD");
  });
  it("skips common prefixes", () => {
    expect(getInitials("Dr. John Doe")).toBe("JD");
  });
  it("skips common suffixes", () => {
    expect(getInitials("John Doe Jr.")).toBe("JD");
  });
  it("returns ? for empty string", () => {
    expect(getInitials("")).toBe("?");
  });
  it("returns ? for whitespace-only", () => {
    expect(getInitials("   ")).toBe("?");
  });
});

describe("slugify", () => {
  it("converts to lowercase kebab-case", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });
  it("removes special characters", () => {
    expect(slugify("Hello! @World#")).toBe("hello-world");
  });
  it("trims leading/trailing hyphens", () => {
    expect(slugify(" -Hello- ")).toBe("hello");
  });
  it("collapses multiple separators", () => {
    expect(slugify("a   b---c")).toBe("a-b-c");
  });
});

describe("isDefined", () => {
  it("returns true for defined values", () => {
    expect(isDefined("hello")).toBe(true);
    expect(isDefined(0)).toBe(true);
    expect(isDefined(false)).toBe(true);
  });
  it("returns false for null", () => {
    expect(isDefined(null)).toBe(false);
  });
  it("returns false for undefined", () => {
    expect(isDefined(undefined)).toBe(false);
  });
});

describe("generateId", () => {
  it("generates a string id", () => {
    const id = generateId();
    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(0);
  });
  it("applies prefix when provided", () => {
    const id = generateId("usr");
    expect(id.startsWith("usr_")).toBe(true);
  });
  it("generates unique ids", () => {
    const a = generateId();
    const b = generateId();
    expect(a).not.toBe(b);
  });
});

describe("sanitizeHtml", () => {
  it("allows safe tags", () => {
    expect(sanitizeHtml("<p>Hello</p>")).toBe("<p>Hello</p>");
    expect(sanitizeHtml("<b>Bold</b>")).toBe("<b>Bold</b>");
  });
  it("strips script tags completely", () => {
    expect(sanitizeHtml("<script>alert(1)</script>")).toBe("");
  });
  it("strips iframe tags", () => {
    expect(sanitizeHtml("<iframe src=x></iframe>")).toBe("");
  });
  it("removes event handlers", () => {
    const result = sanitizeHtml('<div onclick="alert(1)">text</div>');
    expect(result).not.toContain("onclick");
    expect(result).toContain("text");
  });
  it("blocks javascript: URLs in href", () => {
    const result = sanitizeHtml('<a href="javascript:alert(1)">click</a>');
    expect(result).not.toContain("javascript");
  });
  it("allows safe URLs in href", () => {
    const result = sanitizeHtml('<a href="https://example.com">link</a>');
    expect(result).toContain("https://example.com");
  });
  it("strips disallowed tags but preserves text", () => {
    const result = sanitizeHtml("<custom>text</custom>");
    expect(result).toBe("text");
    expect(result).not.toContain("<custom>");
  });
});