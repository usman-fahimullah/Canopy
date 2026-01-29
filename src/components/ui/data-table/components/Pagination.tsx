"use client";

/**
 * DataTable Pagination Component
 *
 * Pagination controls for DataTable with page size selector.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../../button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../dropdown";
import {
  CaretLeft,
  CaretRight,
  CaretDoubleLeft,
  CaretDoubleRight,
} from "@phosphor-icons/react";

// ============================================
// TablePagination
// ============================================

export interface TablePaginationProps {
  /** Current page (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Current page size */
  pageSize: number;
  /** Total number of items */
  totalItems: number;
  /** Available page size options */
  pageSizeOptions?: number[];
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Callback when page size changes */
  onPageSizeChange?: (pageSize: number) => void;
  /** Show page size selector */
  showPageSizeSelector?: boolean;
  /** Show item count summary */
  showItemCount?: boolean;
  /** Additional className */
  className?: string;
}

export function TablePagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
  showPageSizeSelector = true,
  showItemCount = true,
  className,
}: TablePaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 px-2 py-3",
        className
      )}
    >
      {/* Left side: Item count and page size */}
      <div className="flex items-center gap-4">
        {showItemCount && (
          <span className="text-sm text-[var(--foreground-muted)]">
            {totalItems > 0
              ? `${startItem}-${endItem} of ${totalItems}`
              : "No results"}
          </span>
        )}

        {showPageSizeSelector && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--foreground-muted)]">Show</span>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-[var(--foreground-muted)]">
              per page
            </span>
          </div>
        )}
      </div>

      {/* Right side: Page navigation */}
      <div className="flex items-center gap-1">
        {/* First page */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={!canGoPrevious}
          className="h-8 w-8 p-0"
          aria-label="Go to first page"
        >
          <CaretDoubleLeft className="h-4 w-4" />
        </Button>

        {/* Previous page */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          className="h-8 w-8 p-0"
          aria-label="Go to previous page"
        >
          <CaretLeft className="h-4 w-4" />
        </Button>

        {/* Page indicator */}
        <span className="px-3 text-sm text-[var(--foreground-default)]">
          Page {currentPage} of {totalPages || 1}
        </span>

        {/* Next page */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          className="h-8 w-8 p-0"
          aria-label="Go to next page"
        >
          <CaretRight className="h-4 w-4" />
        </Button>

        {/* Last page */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={!canGoNext}
          className="h-8 w-8 p-0"
          aria-label="Go to last page"
        >
          <CaretDoubleRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ============================================
// SimplePagination (compact version)
// ============================================

export interface SimplePaginationProps {
  /** Current page (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Additional className */
  className?: string;
}

export function SimplePagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: SimplePaginationProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="h-8 w-8 p-0"
      >
        <CaretLeft className="h-4 w-4" />
      </Button>

      <span className="text-sm text-[var(--foreground-muted)] min-w-[60px] text-center">
        {currentPage} / {totalPages || 1}
      </span>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="h-8 w-8 p-0"
      >
        <CaretRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
