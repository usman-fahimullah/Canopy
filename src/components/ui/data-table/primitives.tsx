"use client";

/**
 * Table Primitive Components
 *
 * Low-level building blocks for tables. These are the fundamental
 * components that DataTable and EnhancedDataTable are built upon.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { CaretUp, CaretDown, ArrowsDownUp } from "@phosphor-icons/react";
import type { TableDensity } from "./types";

// ============================================
// Table Root
// ============================================

export interface TableRootProps extends React.HTMLAttributes<HTMLTableElement> {
  /** Enable striped rows */
  striped?: boolean;
  /** Enable hover state on rows */
  hoverable?: boolean;
  /** Make the table container have a border */
  bordered?: boolean;
  /** Row density - affects padding and row height */
  density?: TableDensity;
}

const Table = React.forwardRef<HTMLTableElement, TableRootProps>(
  (
    { className, striped, hoverable, bordered = true, density = "default", ...props },
    ref
  ) => (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        bordered &&
          "rounded-2xl border border-[var(--table-border)] bg-[var(--table-background)]"
      )}
    >
      <div className="overflow-x-auto">
        <table
          ref={ref}
          data-striped={striped ? "true" : undefined}
          data-hoverable={hoverable ? "true" : undefined}
          data-density={density}
          className={cn("w-full caption-bottom text-body-sm", className)}
          {...props}
        />
      </div>
    </div>
  )
);
Table.displayName = "Table";

// ============================================
// Table Header
// ============================================

export interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  /** Make header sticky when scrolling */
  sticky?: boolean;
}

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  TableHeaderProps
>(({ className, sticky, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      "bg-[var(--table-background-header)]",
      "[&_tr]:border-b [&_tr]:border-[var(--table-border)]",
      sticky && "sticky top-0 z-10",
      className
    )}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

// ============================================
// Table Body
// ============================================

export interface TableBodyProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
);
TableBody.displayName = "TableBody";

// ============================================
// Table Footer
// ============================================

export interface TableFooterProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn(
        "border-t border-[var(--table-border)] bg-[var(--table-background-header)] font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
);
TableFooter.displayName = "TableFooter";

// ============================================
// Table Row
// ============================================

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /** Whether this row is selected */
  selected?: boolean;
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, selected, ...props }, ref) => (
    <tr
      ref={ref}
      data-selected={selected ? "true" : undefined}
      aria-selected={selected || undefined}
      className={cn(
        "border-b border-[var(--table-border)] bg-[var(--table-background)] transition-colors duration-150",
        // Striped rows (when parent table has data-striped)
        "[[data-striped=true]_&:nth-child(even)]:bg-[var(--table-background-row-stripe)]",
        // Hoverable rows (when parent table has data-hoverable)
        "[[data-hoverable=true]_&]:hover:bg-[var(--table-background-row-hover)]",
        // Selected state
        selected && "bg-[var(--table-background-row-selected)]",
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = "TableRow";

// ============================================
// Table Head Cell
// ============================================

export interface TableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /** Enable sorting for this column */
  sortable?: boolean;
  /** Current sort direction */
  sorted?: "asc" | "desc" | false;
  /** Callback when sort is triggered */
  onSort?: () => void;
  /** Make this column sticky on the left */
  sticky?: boolean;
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, children, sortable, sorted, onSort, sticky, ...props }, ref) => (
    <th
      ref={ref}
      aria-sort={
        sorted === "asc"
          ? "ascending"
          : sorted === "desc"
            ? "descending"
            : sortable
              ? "none"
              : undefined
      }
      className={cn(
        // Density-based height and padding
        "[[data-density=compact]_&]:h-8 [[data-density=compact]_&]:px-3",
        "[[data-density=default]_&]:h-12 [[data-density=default]_&]:px-6",
        "[[data-density=comfortable]_&]:h-14 [[data-density=comfortable]_&]:px-6",
        "text-left align-middle font-medium text-[var(--table-foreground-header)]",
        "text-caption whitespace-nowrap",
        "[&:has([role=checkbox])]:pr-0",
        sortable &&
          "cursor-pointer select-none hover:text-[var(--foreground-default)] transition-colors duration-150",
        sticky && "sticky left-0 z-20 bg-[var(--table-background-header)]",
        className
      )}
      onClick={sortable ? onSort : undefined}
      onKeyDown={
        sortable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSort?.();
              }
            }
          : undefined
      }
      tabIndex={sortable ? 0 : undefined}
      role={sortable ? "button" : undefined}
      {...props}
    >
      <div className="flex items-center gap-1.5">
        {children}
        {sortable && (
          <span className="flex-shrink-0">
            {sorted === "asc" ? (
              <CaretUp
                className="h-3.5 w-3.5 text-[var(--foreground-brand)]"
                weight="bold"
              />
            ) : sorted === "desc" ? (
              <CaretDown
                className="h-3.5 w-3.5 text-[var(--foreground-brand)]"
                weight="bold"
              />
            ) : (
              <ArrowsDownUp className="h-3.5 w-3.5 opacity-40" />
            )}
          </span>
        )}
      </div>
    </th>
  )
);
TableHead.displayName = "TableHead";

// ============================================
// Table Cell
// ============================================

export interface TableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {
  /** Make this cell sticky on the left */
  sticky?: boolean;
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, sticky, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        // Density-based padding
        "[[data-density=compact]_&]:py-2 [[data-density=compact]_&]:px-3",
        "[[data-density=default]_&]:py-4 [[data-density=default]_&]:px-6",
        "[[data-density=comfortable]_&]:py-5 [[data-density=comfortable]_&]:px-6",
        "align-middle text-[var(--table-foreground)] [&:has([role=checkbox])]:pr-0",
        sticky && "sticky left-0 z-10 bg-inherit",
        className
      )}
      {...props}
    />
  )
);
TableCell.displayName = "TableCell";

// ============================================
// Table Caption
// ============================================

export interface TableCaptionProps
  extends React.HTMLAttributes<HTMLTableCaptionElement> {}

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  TableCaptionProps
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn(
      "mt-4 text-body-sm text-[var(--foreground-muted)]",
      className
    )}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

// ============================================
// Table Link (for clickable cells)
// ============================================

export interface TableLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
}

const TableLink = React.forwardRef<HTMLAnchorElement, TableLinkProps>(
  ({ className, children, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(
        "text-[var(--foreground-brand)] hover:text-[var(--foreground-brand-emphasis)]",
        "underline underline-offset-2",
        "transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-1 rounded",
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
);
TableLink.displayName = "TableLink";

// ============================================
// Exports
// ============================================

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  TableLink,
};
