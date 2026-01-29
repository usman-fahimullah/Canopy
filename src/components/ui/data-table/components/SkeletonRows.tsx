"use client";

/**
 * Skeleton Loading Components for DataTable
 *
 * Loading state UI for table rows.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import type { TableDensity } from "../types";

// ============================================
// SkeletonCell
// ============================================

export interface SkeletonCellProps {
  /** Width of the skeleton */
  width?: string;
  /** Additional className */
  className?: string;
}

export function SkeletonCell({ width = "100%", className }: SkeletonCellProps) {
  return (
    <div
      className={cn(
        "h-4 bg-[var(--background-muted)] rounded animate-pulse",
        className
      )}
      style={{ width }}
    />
  );
}

// ============================================
// SkeletonRow
// ============================================

export interface SkeletonRowProps {
  /** Number of columns */
  columns: number;
  /** Has checkbox column */
  hasCheckbox?: boolean;
  /** Has expand column */
  hasExpand?: boolean;
  /** Has actions column */
  hasActions?: boolean;
  /** Row density */
  density?: TableDensity;
  /** Additional className */
  className?: string;
}

export function SkeletonRow({
  columns,
  hasCheckbox,
  hasExpand,
  hasActions,
  density = "default",
  className,
}: SkeletonRowProps) {
  const paddingClass = {
    compact: "py-2 px-3",
    default: "py-4 px-6",
    comfortable: "py-5 px-6",
  }[density];

  return (
    <tr className={cn("border-b border-[var(--table-border)]", className)}>
      {hasExpand && (
        <td className={cn("w-10", paddingClass)}>
          <div className="h-4 w-4 bg-[var(--background-muted)] rounded animate-pulse" />
        </td>
      )}
      {hasCheckbox && (
        <td className={cn("w-12", paddingClass)}>
          <div className="h-4 w-4 bg-[var(--background-muted)] rounded animate-pulse" />
        </td>
      )}
      {Array.from({ length: columns }).map((_, colIndex) => (
        <td key={colIndex} className={paddingClass}>
          <SkeletonCell
            width={
              colIndex === 0 ? "60%" : colIndex === columns - 1 ? "40%" : "80%"
            }
          />
        </td>
      ))}
      {hasActions && (
        <td className={cn("w-12", paddingClass)}>
          <div className="h-6 w-6 bg-[var(--background-muted)] rounded animate-pulse" />
        </td>
      )}
    </tr>
  );
}

// ============================================
// SkeletonRows (multiple)
// ============================================

export interface SkeletonRowsProps {
  /** Number of rows to display */
  rows: number;
  /** Number of columns */
  columns: number;
  /** Has checkbox column */
  hasCheckbox?: boolean;
  /** Has expand column */
  hasExpand?: boolean;
  /** Has actions column */
  hasActions?: boolean;
  /** Row density */
  density?: TableDensity;
}

export function SkeletonRows({
  rows,
  columns,
  hasCheckbox,
  hasExpand,
  hasActions,
  density,
}: SkeletonRowsProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <SkeletonRow
          key={rowIndex}
          columns={columns}
          hasCheckbox={hasCheckbox}
          hasExpand={hasExpand}
          hasActions={hasActions}
          density={density}
        />
      ))}
    </>
  );
}

// ============================================
// SkeletonTable (full table skeleton)
// ============================================

export interface SkeletonTableProps {
  /** Number of rows */
  rows?: number;
  /** Number of columns */
  columns?: number;
  /** Show header */
  showHeader?: boolean;
  /** Show pagination */
  showPagination?: boolean;
  /** Row density */
  density?: TableDensity;
  /** Additional className */
  className?: string;
}

export function SkeletonTable({
  rows = 5,
  columns = 5,
  showHeader = true,
  showPagination = true,
  density = "default",
  className,
}: SkeletonTableProps) {
  const paddingClass = {
    compact: "py-2 px-3",
    default: "py-4 px-6",
    comfortable: "py-5 px-6",
  }[density];

  const headerHeight = {
    compact: "h-8",
    default: "h-12",
    comfortable: "h-14",
  }[density];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Table container */}
      <div className="rounded-2xl border border-[var(--table-border)] bg-[var(--table-background)] overflow-hidden">
        <table className="w-full">
          {showHeader && (
            <thead className="bg-[var(--table-background-header)]">
              <tr className="border-b border-[var(--table-border)]">
                {Array.from({ length: columns }).map((_, i) => (
                  <th
                    key={i}
                    className={cn(
                      headerHeight,
                      paddingClass,
                      "text-left"
                    )}
                  >
                    <SkeletonCell width={i === 0 ? "50%" : "70%"} />
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            <SkeletonRows rows={rows} columns={columns} density={density} />
          </tbody>
        </table>
      </div>

      {/* Pagination skeleton */}
      {showPagination && (
        <div className="flex items-center justify-between px-2">
          <SkeletonCell width="120px" className="h-4" />
          <div className="flex items-center gap-2">
            <SkeletonCell width="32px" className="h-8 rounded-md" />
            <SkeletonCell width="80px" className="h-4" />
            <SkeletonCell width="32px" className="h-8 rounded-md" />
          </div>
        </div>
      )}
    </div>
  );
}
