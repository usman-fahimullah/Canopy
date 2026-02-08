import { describe, it, expect } from "vitest";
import { safeJsonParse } from "../safe-json";

describe("safeJsonParse", () => {
  it("parses valid JSON object", () => {
    expect(safeJsonParse('{"key":"value"}', {})).toEqual({ key: "value" });
  });

  it("parses valid JSON array", () => {
    expect(safeJsonParse("[1,2,3]", [])).toEqual([1, 2, 3]);
  });

  it("parses valid JSON primitives", () => {
    expect(safeJsonParse("42", 0)).toBe(42);
    expect(safeJsonParse('"hello"', "")).toBe("hello");
    expect(safeJsonParse("true", false)).toBe(true);
    expect(safeJsonParse("null", "fallback")).toBeNull();
  });

  it("returns fallback for null input", () => {
    expect(safeJsonParse(null, { default: true })).toEqual({ default: true });
  });

  it("returns fallback for undefined input", () => {
    expect(safeJsonParse(undefined, [])).toEqual([]);
  });

  it("returns fallback for empty string", () => {
    expect(safeJsonParse("", "default")).toBe("default");
  });

  it("returns fallback for invalid JSON", () => {
    expect(safeJsonParse("not valid json", {})).toEqual({});
  });

  it("returns fallback for partial/malformed JSON", () => {
    expect(safeJsonParse("{incomplete", [])).toEqual([]);
    expect(safeJsonParse("[1, 2,", [])).toEqual([]);
  });

  it("handles nested JSON objects", () => {
    const input = '{"user":{"name":"John","skills":["React","TypeScript"]}}';
    const result = safeJsonParse(input, {});
    expect(result).toEqual({
      user: { name: "John", skills: ["React", "TypeScript"] },
    });
  });
});
