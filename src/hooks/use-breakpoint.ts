"use client";

import { useState, useEffect } from "react";

/**
 * Breakpoint values matching Tailwind defaults
 * These should match --breakpoint-* tokens in globals.css
 */
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

type Breakpoint = keyof typeof breakpoints;

/**
 * Hook to detect current breakpoint
 *
 * Usage:
 * ```tsx
 * const breakpoint = useBreakpoint();
 * const isMobile = breakpoint === 'sm' || breakpoint === null;
 * ```
 *
 * @returns Current breakpoint name or null for mobile
 */
export function useBreakpoint(): Breakpoint | null {
  const [breakpoint, setBreakpoint] = useState<Breakpoint | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateBreakpoint = () => {
      const width = window.innerWidth;

      if (width >= breakpoints["2xl"]) {
        setBreakpoint("2xl");
      } else if (width >= breakpoints.xl) {
        setBreakpoint("xl");
      } else if (width >= breakpoints.lg) {
        setBreakpoint("lg");
      } else if (width >= breakpoints.md) {
        setBreakpoint("md");
      } else if (width >= breakpoints.sm) {
        setBreakpoint("sm");
      } else {
        setBreakpoint(null);
      }
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return breakpoint;
}

/**
 * Hook to check if viewport is at or above a breakpoint
 *
 * Usage:
 * ```tsx
 * const isDesktop = useBreakpointUp("lg");
 * ```
 */
export function useBreakpointUp(breakpoint: Breakpoint): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const query = `(min-width: ${breakpoints[breakpoint]}px)`;
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [breakpoint]);

  return matches;
}

/**
 * Hook to check if viewport is below a breakpoint
 *
 * Usage:
 * ```tsx
 * const isMobile = useBreakpointDown("md");
 * ```
 */
export function useBreakpointDown(breakpoint: Breakpoint): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const query = `(max-width: ${breakpoints[breakpoint] - 1}px)`;
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [breakpoint]);

  return matches;
}
