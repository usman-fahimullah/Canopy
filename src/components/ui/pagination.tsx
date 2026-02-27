"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "@/components/Icons";

interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Number of page buttons to show on each side of current page */
  siblingCount?: number;
  /** Show first/last page buttons */
  showEdges?: boolean;
}

function generatePagination(
  currentPage: number,
  totalPages: number,
  siblingCount: number = 1
): (number | "ellipsis")[] {
  const totalNumbers = siblingCount * 2 + 3; // siblings + current + first + last
  const totalBlocks = totalNumbers + 2; // + 2 ellipsis

  if (totalPages <= totalBlocks) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, "ellipsis", totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + i + 1
    );
    return [1, "ellipsis", ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i
  );
  return [1, "ellipsis", ...middleRange, "ellipsis", totalPages];
}

const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    {
      className,
      currentPage,
      totalPages,
      onPageChange,
      siblingCount = 1,
      showEdges = true,
      ...props
    },
    ref
  ) => {
    const pages = generatePagination(currentPage, totalPages, siblingCount);

    return (
      <nav
        ref={ref}
        role="navigation"
        aria-label="Pagination"
        className={cn("flex items-center justify-center gap-1", className)}
        {...props}
      >
        <PaginationButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </PaginationButton>

        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <PaginationEllipsis key={`ellipsis-${index}`} />
          ) : (
            <PaginationButton
              key={page}
              onClick={() => onPageChange(page)}
              active={page === currentPage}
              aria-label={`Go to page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </PaginationButton>
          )
        )}

        <PaginationButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Go to next page"
        >
          <ChevronRight className="h-4 w-4" />
        </PaginationButton>
      </nav>
    );
  }
);

Pagination.displayName = "Pagination";

interface PaginationButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

const PaginationButton = React.forwardRef<HTMLButtonElement, PaginationButtonProps>(
  ({ className, active, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      className={cn(
        "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-body-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2",
        active
          ? "bg-[var(--primitive-blue-500)] text-[var(--foreground-on-emphasis)]"
          : "text-foreground hover:bg-background-muted",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);
PaginationButton.displayName = "PaginationButton";

const PaginationEllipsis = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      aria-hidden
      className={cn("flex h-9 w-9 items-center justify-center text-foreground-subtle", className)}
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
    </span>
  )
);
PaginationEllipsis.displayName = "PaginationEllipsis";

/**
 * Simple pagination with just prev/next and page info
 */
interface SimplePaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
}

const SimplePagination = React.forwardRef<HTMLDivElement, SimplePaginationProps>(
  (
    { className, currentPage, totalPages, totalItems, itemsPerPage, onPageChange, ...props },
    ref
  ) => {
    const startItem = totalItems ? (currentPage - 1) * (itemsPerPage || 10) + 1 : null;
    const endItem = totalItems ? Math.min(currentPage * (itemsPerPage || 10), totalItems) : null;

    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-between gap-4", className)}
        {...props}
      >
        {totalItems && (
          <span className="text-caption text-foreground-muted">
            Showing {startItem}-{endItem} of {totalItems}
          </span>
        )}

        <div className="flex items-center gap-2">
          <PaginationButton
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </PaginationButton>

          <span className="px-2 text-caption text-foreground-muted">
            Page {currentPage} of {totalPages}
          </span>

          <PaginationButton
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Next page"
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </PaginationButton>
        </div>
      </div>
    );
  }
);

SimplePagination.displayName = "SimplePagination";

export { Pagination, PaginationButton, PaginationEllipsis, SimplePagination };
