import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useReducedMotion } from "../use-reduced-motion";

describe("useReducedMotion", () => {
  let changeHandler: ((event: MediaQueryListEvent) => void) | null = null;

  beforeEach(() => {
    changeHandler = null;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function stubMatchMedia(matches: boolean) {
    vi.stubGlobal("matchMedia", () => ({
      matches,
      media: "(prefers-reduced-motion: reduce)",
      addEventListener: (_: string, handler: (event: MediaQueryListEvent) => void) => {
        changeHandler = handler;
      },
      removeEventListener: vi.fn(),
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  }

  it("returns false when user does not prefer reduced motion", () => {
    stubMatchMedia(false);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it("returns true when user prefers reduced motion", () => {
    stubMatchMedia(true);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it("updates when preference changes", () => {
    stubMatchMedia(false);
    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(false);

    act(() => {
      if (changeHandler) {
        changeHandler({ matches: true } as MediaQueryListEvent);
      }
    });

    expect(result.current).toBe(true);
  });
});
