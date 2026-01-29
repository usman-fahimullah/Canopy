"use client";

import { useState, useEffect } from "react";

/**
 * Generic media query hook
 *
 * Usage:
 * ```tsx
 * const isMobile = useMediaQuery("(max-width: 768px)");
 * const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
 * ```
 *
 * @param query - Media query string
 * @returns boolean - true if media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
