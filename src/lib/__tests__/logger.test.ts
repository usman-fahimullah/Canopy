import { describe, it, expect, vi, beforeEach } from "vitest";
import { logger, formatError } from "../logger";

describe("logger", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("formatError", () => {
    it("extracts message from Error instances", () => {
      expect(formatError(new Error("test error"))).toBe("test error");
    });

    it("returns string errors as-is", () => {
      expect(formatError("string error")).toBe("string error");
    });

    it("converts non-string/error values to string", () => {
      expect(formatError(42)).toBe("42");
      expect(formatError(null)).toBe("null");
      expect(formatError(undefined)).toBe("undefined");
    });
  });

  describe("logger methods", () => {
    it("has debug, info, warn, error methods", () => {
      expect(typeof logger.debug).toBe("function");
      expect(typeof logger.info).toBe("function");
      expect(typeof logger.warn).toBe("function");
      expect(typeof logger.error).toBe("function");
    });

    it("calls console.error for error level", () => {
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});
      logger.error("test error", { endpoint: "/api/test" });
      expect(spy).toHaveBeenCalled();
    });

    it("calls console.warn for warn level", () => {
      const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
      logger.warn("test warning");
      expect(spy).toHaveBeenCalled();
    });

    it("calls console.log for info level", () => {
      const spy = vi.spyOn(console, "log").mockImplementation(() => {});
      logger.info("test info");
      expect(spy).toHaveBeenCalled();
    });
  });
});
