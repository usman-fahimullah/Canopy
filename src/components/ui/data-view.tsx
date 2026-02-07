"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowCounterClockwise } from "@phosphor-icons/react";

/**
 * DataView — Wrapper that enforces loading, error, empty, and success states.
 *
 * Every data-driven view should use this component to guarantee all 4 states
 * are always rendered. Pass a skeleton layout (not a spinner) for the loading
 * state to provide perceived speed.
 *
 * @example
 * ```tsx
 * <DataView
 *   data={candidates}
 *   isLoading={isLoading}
 *   error={error}
 *   skeleton={<CandidateListSkeleton />}
 *   empty={
 *     <EmptyState
 *       title="No candidates yet"
 *       action={<Button>Add Candidate</Button>}
 *     />
 *   }
 *   onRetry={refetch}
 * >
 *   {(candidates) => (
 *     <CandidateList candidates={candidates} />
 *   )}
 * </DataView>
 * ```
 */

interface DataViewProps<T> {
  /** The data to display. Null/undefined = still loading or error. */
  data: T | null | undefined;
  /** Whether data is currently being fetched (initial load) */
  isLoading: boolean;
  /** Error message if fetch failed */
  error: string | null | undefined;
  /** Skeleton layout to show while loading (NOT a spinner) */
  skeleton: React.ReactNode;
  /** Empty state to show when data is an empty array/object */
  empty?: React.ReactNode;
  /** Called when user clicks "Try again" on error state */
  onRetry?: () => void;
  /** Render function for the success state */
  children: (data: T) => React.ReactNode;
  /** Optional className for the error container */
  className?: string;
  /** Custom function to determine if data is "empty" (default: checks array length) */
  isEmpty?: (data: T) => boolean;
}

function defaultIsEmpty<T>(data: T): boolean {
  if (Array.isArray(data)) return data.length === 0;
  if (data && typeof data === "object" && "length" in data) {
    return (data as { length: number }).length === 0;
  }
  return false;
}

export function DataView<T>({
  data,
  isLoading,
  error,
  skeleton,
  empty,
  onRetry,
  children,
  className,
  isEmpty = defaultIsEmpty,
}: DataViewProps<T>) {
  // Loading state — show skeleton
  if (isLoading) {
    return <>{skeleton}</>;
  }

  // Error state — show error with retry
  if (error) {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-4 py-16", className)}>
        <div className="text-center">
          <p className="text-body font-medium text-[var(--foreground-default)]">
            Something went wrong
          </p>
          <p className="mt-1 text-caption text-[var(--foreground-muted)]">{error}</p>
        </div>
        {onRetry && (
          <Button variant="tertiary" size="sm" onClick={onRetry}>
            <ArrowCounterClockwise size={16} weight="bold" className="mr-2" />
            Try again
          </Button>
        )}
      </div>
    );
  }

  // No data yet (shouldn't happen if isLoading/error are handled, but safety net)
  if (data == null) {
    return <>{skeleton}</>;
  }

  // Empty state
  if (empty && isEmpty(data)) {
    return <>{empty}</>;
  }

  // Success state
  return <>{children(data)}</>;
}
