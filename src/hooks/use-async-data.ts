"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * useAsyncData — Consistent data fetching hook with proper state machine.
 *
 * Replaces the manual useState + useEffect pattern across the codebase.
 * Guarantees exactly one of: loading | success | error at any time.
 *
 * Features:
 * - Proper state machine (no invalid state combinations)
 * - Automatic cleanup on unmount (prevents state updates after unmount)
 * - Refetch function for manual refresh
 * - Stale-while-revalidate: keeps previous data visible during refetch
 * - Dependency-based re-fetching
 *
 * @example
 * ```tsx
 * const { data, error, isLoading, refetch } = useAsyncData(
 *   () => fetch("/api/candidates").then(r => r.json()),
 *   [organizationId]
 * );
 * ```
 */

type AsyncState<T> =
  | { status: "loading"; data: T | null; error: null }
  | { status: "success"; data: T; error: null }
  | { status: "error"; data: T | null; error: string };

interface UseAsyncDataOptions {
  /** Skip fetching (useful for conditional queries) */
  enabled?: boolean;
  /** Keep previous data visible while refetching */
  keepPreviousData?: boolean;
}

interface UseAsyncDataReturn<T> {
  /** The fetched data (null during initial load) */
  data: T | null;
  /** Error message if the fetch failed */
  error: string | null;
  /** True during the initial load (no previous data) */
  isLoading: boolean;
  /** True during any fetch (including refetch with stale data visible) */
  isFetching: boolean;
  /** Current state status */
  status: "loading" | "success" | "error";
  /** Manually trigger a refetch */
  refetch: () => void;
}

export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList = [],
  options: UseAsyncDataOptions = {}
): UseAsyncDataReturn<T> {
  const { enabled = true, keepPreviousData = true } = options;

  const [state, setState] = useState<AsyncState<T>>({
    status: "loading",
    data: null,
    error: null,
  });
  const [isFetching, setIsFetching] = useState(false);

  // Track mount status to prevent updates after unmount
  const mountedRef = useRef(true);
  // Track the current fetch to handle race conditions
  const fetchIdRef = useRef(0);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const executeFetch = useCallback(async () => {
    if (!enabled) return;

    const fetchId = ++fetchIdRef.current;
    setIsFetching(true);

    // Only show loading state if we don't have previous data
    if (!keepPreviousData || state.data === null) {
      setState((prev) => ({
        status: "loading",
        data: prev.data,
        error: null,
      }));
    }

    try {
      const result = await fetcher();

      // Only update if this is still the most recent fetch and component is mounted
      if (mountedRef.current && fetchId === fetchIdRef.current) {
        setState({ status: "success", data: result, error: null });
        setIsFetching(false);
      }
    } catch (err) {
      if (mountedRef.current && fetchId === fetchIdRef.current) {
        const message = err instanceof Error ? err.message : "An unexpected error occurred";
        setState((prev) => ({
          status: "error",
          data: keepPreviousData ? prev.data : null,
          error: message,
        }));
        setIsFetching(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  // Fetch on mount and when dependencies change
  useEffect(() => {
    executeFetch();
  }, [executeFetch]);

  return {
    data: state.data,
    error: state.error,
    isLoading: state.status === "loading" && state.data === null,
    isFetching,
    status: state.status,
    refetch: executeFetch,
  };
}
