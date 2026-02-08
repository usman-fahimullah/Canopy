import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMediaQuery } from "../use-media-query";

describe("useMediaQuery", () => {
  let listeners: Map<string, (event: MediaQueryListEvent) => void>;
  let matchStates: Map<string, boolean>;

  beforeEach(() => {
    listeners = new Map();
    matchStates = new Map();

    vi.stubGlobal("matchMedia", (query: string) => {
      const matches = matchStates.get(query) ?? false;
      return {
        matches,
        media: query,
        addEventListener: (_: string, handler: (event: MediaQueryListEvent) => void) => {
          listeners.set(query, handler);
        },
        removeEventListener: vi.fn(),
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns false when query does not match", () => {
    matchStates.set("(max-width: 768px)", false);
    const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));
    expect(result.current).toBe(false);
  });

  it("returns true when query matches", () => {
    matchStates.set("(max-width: 768px)", true);
    const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));
    expect(result.current).toBe(true);
  });

  it("updates when media query changes", () => {
    matchStates.set("(max-width: 768px)", false);
    const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));

    expect(result.current).toBe(false);

    // Simulate media query change
    act(() => {
      const handler = listeners.get("(max-width: 768px)");
      if (handler) {
        handler({ matches: true } as MediaQueryListEvent);
      }
    });

    expect(result.current).toBe(true);
  });

  it("re-subscribes when query changes", () => {
    matchStates.set("(max-width: 768px)", false);
    matchStates.set("(max-width: 1024px)", true);

    const { result, rerender } = renderHook(({ query }) => useMediaQuery(query), {
      initialProps: { query: "(max-width: 768px)" },
    });

    expect(result.current).toBe(false);

    rerender({ query: "(max-width: 1024px)" });
    expect(result.current).toBe(true);
  });
});
