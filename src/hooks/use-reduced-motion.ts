"use client";

import { useState, useEffect } from "react";

/**
 * Hook to detect user's reduced motion preference
 *
 * Usage:
 * ```tsx
 * const prefersReducedMotion = useReducedMotion();
 * const animationDuration = prefersReducedMotion ? 0 : 200;
 * ```
 *
 * @returns boolean - true if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if window is defined (SSR safety)
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
}
