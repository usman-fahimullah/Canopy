"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  CaretDoubleLeft,
  CaretDoubleRight,
  CaretLeft,
  CaretRight,
  CaretUp,
  CaretDown,
  MagnifyingGlass,
  CircleNotch,
  X,
  Columns,
  Check,
  Funnel,
  ArrowsDownUp,
  DotsThree,
  Envelope,
  UserMinus,
  ArrowRight,
  Export,
  Tag,
  Eye,
  EyeSlash,
  CaretRight as ChevronRight,
  DotsSixVertical,
  DownloadSimple,
  PencilSimple,
  ArrowsOutLineHorizontal,
  FileXls,
  FileCsv,
} from "@phosphor-icons/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "./sheet";
import { Input } from "./input";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Badge } from "./badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./dropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from "./dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

// ============================================
// Table Primitive Components
// ============================================

export type TableDensity = "compact" | "default" | "comfortable";

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
  ({ className, striped, hoverable, bordered = true, density = "default", ...props }, ref) => (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        bordered && "rounded-2xl border border-[var(--table-border)] bg-[var(--table-background)]"
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

export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  /** Make header sticky when scrolling */
  sticky?: boolean;
}

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, sticky, ...props }, ref) => (
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
  )
);
TableHeader.displayName = "TableHeader";

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  )
);
TableBody.displayName = "TableBody";

export interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

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

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
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

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sorted?: "asc" | "desc" | false;
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
        "whitespace-nowrap text-caption",
        "[&:has([role=checkbox])]:pr-0",
        sortable &&
          "cursor-pointer select-none transition-colors duration-150 hover:text-[var(--foreground-default)]",
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
              <CaretUp className="h-3.5 w-3.5 text-[var(--foreground-brand)]" weight="bold" />
            ) : sorted === "desc" ? (
              <CaretDown className="h-3.5 w-3.5 text-[var(--foreground-brand)]" weight="bold" />
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

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  /** Make this cell sticky on the left */
  sticky?: boolean;
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, sticky, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        // Density-based padding
        "[[data-density=compact]_&]:px-3 [[data-density=compact]_&]:py-2",
        "[[data-density=default]_&]:px-6 [[data-density=default]_&]:py-4",
        "[[data-density=comfortable]_&]:px-6 [[data-density=comfortable]_&]:py-5",
        "align-middle text-[var(--table-foreground)] [&:has([role=checkbox])]:pr-0",
        sticky && "sticky left-0 z-10 bg-inherit",
        className
      )}
      {...props}
    />
  )
);
TableCell.displayName = "TableCell";

export interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {}

const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className, ...props }, ref) => (
    <caption
      ref={ref}
      className={cn("mt-4 text-body-sm text-[var(--foreground-muted)]", className)}
      {...props}
    />
  )
);
TableCaption.displayName = "TableCaption";

// ============================================
// Table Link - For clickable cells
// ============================================

export interface TableLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
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
        "rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-1",
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
// Column Configuration Types
// ============================================

export type ColumnFilterType = "text" | "select" | "number" | "date" | "dateRange";

export interface ColumnFilterConfig {
  /** Filter type */
  type: ColumnFilterType;
  /** Options for select filter */
  options?: { label: string; value: string }[];
  /** Placeholder text */
  placeholder?: string;
}

export type EditableCellType = "text" | "number" | "select" | "date";

export interface EditableCellConfig {
  /** Type of editor to show */
  type: EditableCellType;
  /** Options for select type */
  options?: { label: string; value: string }[];
  /** Placeholder text */
  placeholder?: string;
  /** Validation function - return error message or undefined if valid */
  validate?: (value: unknown) => string | undefined;
}

export interface Column<T> {
  /** Unique column identifier */
  id: string;
  /** Column header text */
  header: string;
  /** Object key to access data */
  accessorKey?: keyof T;
  /** Function to access data */
  accessorFn?: (row: T) => React.ReactNode;
  /** Enable sorting for this column */
  sortable?: boolean;
  /** Include in search filter (default: true) */
  filterable?: boolean;
  /** Column filter configuration */
  filterConfig?: ColumnFilterConfig;
  /** Custom cell renderer */
  cell?: (row: T) => React.ReactNode;
  /** Column cell className */
  className?: string;
  /** Column width (e.g., "200px", "20%") */
  width?: string;
  /** Minimum width */
  minWidth?: string;
  /** Make column sticky */
  sticky?: boolean;
  /** Pin column to left or right */
  pinned?: "left" | "right";
  /** Column is visible by default (default: true) */
  defaultVisible?: boolean;
  /** Enable inline editing for this column */
  editable?: boolean;
  /** Configuration for editable cell */
  editConfig?: EditableCellConfig;
  /** Enable column resizing */
  resizable?: boolean;
}

// ============================================
// Bulk Action Types
// ============================================

export interface BulkAction<T> {
  /** Unique action identifier */
  id: string;
  /** Action label */
  label: string;
  /** Action icon */
  icon?: React.ReactNode;
  /** Action handler - receives selected rows */
  onAction: (selectedRows: T[]) => void;
  /** Variant for styling */
  variant?: "default" | "destructive";
  /** Show in primary toolbar or overflow menu */
  showInToolbar?: boolean;
}

// ============================================
// Row Action Types
// ============================================

export interface RowAction<T> {
  /** Unique action identifier */
  id: string;
  /** Action label */
  label: string;
  /** Action icon */
  icon?: React.ReactNode;
  /** Action handler - receives the row */
  onAction: (row: T) => void;
  /** Variant for styling */
  variant?: "default" | "destructive";
  /** Whether this action should be hidden for certain rows */
  hidden?: (row: T) => boolean;
  /** Whether this action should be disabled for certain rows */
  disabled?: (row: T) => boolean;
}

// ============================================
// ATS Helper Components
// ============================================

/** Stage badge with ATS color coding */
export interface StageBadgeProps {
  stage: string;
  className?: string;
}

const stageVariantMap: Record<
  string,
  "secondary" | "info" | "default" | "warning" | "success" | "error"
> = {
  applied: "secondary",
  new: "secondary",
  screening: "info",
  interview: "default",
  assessment: "default",
  offer: "warning",
  hired: "success",
  rejected: "error",
  withdrawn: "secondary",
};

export function StageBadge({ stage, className }: StageBadgeProps) {
  const normalizedStage = stage.toLowerCase();
  const variant = stageVariantMap[normalizedStage] || "secondary";

  return (
    <Badge variant={variant} className={className}>
      {stage}
    </Badge>
  );
}

/** Match score display with color coding */
export interface MatchScoreProps {
  score: number;
  showLabel?: boolean;
  className?: string;
}

export function MatchScore({ score, showLabel = false, className }: MatchScoreProps) {
  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-[var(--foreground-success)]";
    if (s >= 50) return "text-[var(--foreground-warning)]";
    return "text-[var(--foreground-error)]";
  };

  const getScoreBg = (s: number) => {
    if (s >= 80) return "bg-[var(--background-success)]";
    if (s >= 50) return "bg-[var(--background-warning)]";
    return "bg-[var(--background-error)]";
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "rounded-full px-2 py-0.5 text-sm font-medium",
          getScoreColor(score),
          getScoreBg(score)
        )}
      >
        {score}%
      </div>
      {showLabel && (
        <span className="text-sm text-[var(--foreground-muted)]">
          {score >= 80 ? "High" : score >= 50 ? "Medium" : "Low"} match
        </span>
      )}
    </div>
  );
}

/** Days in stage indicator */
export interface DaysInStageProps {
  appliedDate: Date | string;
  stageChangedDate?: Date | string;
  warningThreshold?: number;
  dangerThreshold?: number;
  className?: string;
}

export function DaysInStage({
  appliedDate,
  stageChangedDate,
  warningThreshold = 7,
  dangerThreshold = 14,
  className,
}: DaysInStageProps) {
  const referenceDate = stageChangedDate ? new Date(stageChangedDate) : new Date(appliedDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - referenceDate.getTime());
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const getColor = () => {
    if (days >= dangerThreshold) return "text-[var(--foreground-error)]";
    if (days >= warningThreshold) return "text-[var(--foreground-warning)]";
    return "text-[var(--foreground-muted)]";
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn("text-sm font-medium", getColor(), className)}>{days}d</span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{days} days in current stage</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/** Next action indicator */
export interface NextActionProps {
  action: string;
  urgent?: boolean;
  className?: string;
}

export function NextAction({ action, urgent, className }: NextActionProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "h-2 w-2 rounded-full",
          urgent ? "animate-pulse bg-[var(--foreground-error)]" : "bg-[var(--foreground-muted)]"
        )}
      />
      <span className={cn("text-sm", urgent && "font-medium text-[var(--foreground-error)]")}>
        {action}
      </span>
    </div>
  );
}

// ============================================
// Export Utilities
// ============================================

export type ExportFormat = "csv" | "xlsx" | "json";

export interface ExportOptions<T> {
  /** Data to export */
  data: T[];
  /** Columns to include (exports all visible if not specified) */
  columns: Column<T>[];
  /** File name without extension */
  filename?: string;
  /** Export format */
  format?: ExportFormat;
  /** Custom value formatter for cells */
  formatValue?: (value: unknown, column: Column<T>, row: T) => string;
}

/**
 * Export data table to CSV, XLSX (tab-separated), or JSON
 */
export function exportTableData<T extends Record<string, unknown>>({
  data,
  columns,
  filename = "export",
  format = "csv",
  formatValue,
}: ExportOptions<T>): void {
  const visibleColumns = columns.filter((c) => c.defaultVisible !== false);

  // Build header row
  const headers = visibleColumns.map((col) => col.header);

  // Build data rows
  const rows = data.map((row) => {
    return visibleColumns.map((col) => {
      const rawValue = col.accessorKey ? row[col.accessorKey] : col.accessorFn?.(row);

      if (formatValue) {
        return formatValue(rawValue, col, row);
      }

      // Handle common types
      if (rawValue === null || rawValue === undefined) return "";
      if (rawValue instanceof Date) return rawValue.toISOString().split("T")[0];
      if (typeof rawValue === "object") return JSON.stringify(rawValue);
      return String(rawValue);
    });
  });

  let content: string;
  let mimeType: string;
  let extension: string;

  switch (format) {
    case "csv":
      content = [
        headers.join(","),
        ...rows.map((row) =>
          row
            .map((cell) => {
              // Escape quotes and wrap in quotes if contains comma or newline
              const escaped = String(cell).replace(/"/g, '""');
              return escaped.includes(",") || escaped.includes("\n") || escaped.includes('"')
                ? `"${escaped}"`
                : escaped;
            })
            .join(",")
        ),
      ].join("\n");
      mimeType = "text/csv;charset=utf-8;";
      extension = "csv";
      break;

    case "xlsx":
      // Tab-separated for easy Excel import
      content = [
        headers.join("\t"),
        ...rows.map((row) => row.map((cell) => String(cell).replace(/\t/g, " ")).join("\t")),
      ].join("\n");
      mimeType = "text/tab-separated-values;charset=utf-8;";
      extension = "tsv";
      break;

    case "json":
      const jsonData = data.map((row) => {
        const obj: Record<string, unknown> = {};
        visibleColumns.forEach((col) => {
          const value = col.accessorKey ? row[col.accessorKey] : col.accessorFn?.(row);
          obj[col.id] = value;
        });
        return obj;
      });
      content = JSON.stringify(jsonData, null, 2);
      mimeType = "application/json;charset=utf-8;";
      extension = "json";
      break;

    default:
      return;
  }

  // Create and trigger download
  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.${extension}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

// ============================================
// Export Menu Component
// ============================================

interface ExportMenuProps<T extends Record<string, unknown>> {
  data: T[];
  columns: Column<T>[];
  filename?: string;
  formatValue?: (value: unknown, column: Column<T>, row: T) => string;
  disabled?: boolean;
}

function ExportMenu<T extends Record<string, unknown>>({
  data,
  columns,
  filename = "export",
  formatValue,
  disabled,
}: ExportMenuProps<T>) {
  const handleExport = (format: ExportFormat) => {
    exportTableData({ data, columns, filename, format, formatValue });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled || data.length === 0}
          className="gap-1.5"
        >
          <DownloadSimple className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Export Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport("csv")}>
          <FileCsv className="mr-2 h-4 w-4" />
          CSV (.csv)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("xlsx")}>
          <FileXls className="mr-2 h-4 w-4" />
          Excel (.tsv)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("json")}>
          <Export className="mr-2 h-4 w-4" />
          JSON (.json)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================================
// Bulk Edit Modal
// ============================================

interface BulkEditModalProps<T> {
  open: boolean;
  onClose: () => void;
  selectedRows: T[];
  columns: Column<T>[];
  onSave: (columnId: string, value: unknown) => void;
}

function BulkEditModal<T>({ open, onClose, selectedRows, columns, onSave }: BulkEditModalProps<T>) {
  const [selectedColumn, setSelectedColumn] = React.useState<string>("");
  const [editValue, setEditValue] = React.useState<unknown>("");

  // Get editable columns
  const editableColumns = columns.filter((col) => col.editable && col.editConfig);

  // Get selected column config
  const selectedColumnConfig = editableColumns.find((col) => col.id === selectedColumn);
  const editConfig = selectedColumnConfig?.editConfig;

  const handleSave = () => {
    if (selectedColumn && editValue !== undefined) {
      onSave(selectedColumn, editValue);
      onClose();
      setSelectedColumn("");
      setEditValue("");
    }
  };

  React.useEffect(() => {
    if (!open) {
      setSelectedColumn("");
      setEditValue("");
    }
  }, [open]);

  if (!open || editableColumns.length === 0) return null;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Bulk Edit</SheetTitle>
          <SheetDescription>
            Update {selectedRows.length} selected row{selectedRows.length !== 1 ? "s" : ""}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Column Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--foreground-default)]">
              Field to update
            </label>
            <Select value={selectedColumn} onValueChange={setSelectedColumn}>
              <SelectTrigger>
                <SelectValue placeholder="Select a field..." />
              </SelectTrigger>
              <SelectContent>
                {editableColumns.map((col) => (
                  <SelectItem key={col.id} value={col.id}>
                    {col.header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Value Input */}
          {selectedColumn && editConfig && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--foreground-default)]">
                New value
              </label>
              {editConfig.type === "text" && (
                <Input
                  value={String(editValue ?? "")}
                  onChange={(e) => setEditValue(e.target.value)}
                  placeholder={editConfig.placeholder}
                />
              )}
              {editConfig.type === "number" && (
                <Input
                  type="number"
                  value={editValue !== null && editValue !== undefined ? String(editValue) : ""}
                  onChange={(e) => setEditValue(e.target.value ? Number(e.target.value) : null)}
                  placeholder={editConfig.placeholder}
                />
              )}
              {editConfig.type === "select" && (
                <Select value={String(editValue ?? "")} onValueChange={setEditValue}>
                  <SelectTrigger>
                    <SelectValue placeholder={editConfig.placeholder || "Select..."} />
                  </SelectTrigger>
                  <SelectContent>
                    {editConfig.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {editConfig.type === "date" && (
                <Input
                  type="date"
                  value={editValue ? String(editValue) : ""}
                  onChange={(e) => setEditValue(e.target.value)}
                />
              )}
            </div>
          )}

          {/* Preview */}
          {selectedColumn && (
            <div className="rounded-lg border border-[var(--border-muted)] bg-[var(--background-subtle)] p-3">
              <p className="text-sm text-[var(--foreground-muted)]">
                This will update the <strong>{selectedColumnConfig?.header}</strong> field for{" "}
                <strong>{selectedRows.length}</strong> selected row
                {selectedRows.length !== 1 ? "s" : ""}.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleSave}
              disabled={!selectedColumn || editValue === undefined || editValue === ""}
            >
              Update {selectedRows.length} row{selectedRows.length !== 1 ? "s" : ""}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ============================================
// Comparison View Component
// ============================================

interface ComparisonViewProps<T> {
  rows: T[];
  columns: Column<T>[];
  onClose: () => void;
  getRowId: (row: T) => string;
  title?: string;
}

function ComparisonView<T extends Record<string, unknown>>({
  rows,
  columns,
  onClose,
  getRowId,
  title = "Compare",
}: ComparisonViewProps<T>) {
  if (rows.length < 2) return null;

  // Filter to comparable columns (those with accessorKey)
  const comparableColumns = columns.filter((col) => col.accessorKey || col.accessorFn);

  return (
    <Sheet open={rows.length >= 2} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl lg:max-w-4xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ArrowsOutLineHorizontal className="h-5 w-5" />
            {title}
          </SheetTitle>
          <SheetDescription>Comparing {rows.length} items side by side</SheetDescription>
        </SheetHeader>

        <div className="mt-6 overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[var(--table-border)]">
                <th className="sticky left-0 bg-[var(--background-subtle)] px-4 py-3 text-left text-caption font-medium text-[var(--foreground-muted)]">
                  Field
                </th>
                {rows.map((row, index) => (
                  <th
                    key={getRowId(row)}
                    className="min-w-[200px] bg-[var(--background-subtle)] px-4 py-3 text-left text-caption font-medium text-[var(--foreground-default)]"
                  >
                    Item {index + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparableColumns.map((col) => {
                const values = rows.map((row) => {
                  if (col.cell) return col.cell(row);
                  if (col.accessorFn) return col.accessorFn(row);
                  if (col.accessorKey) {
                    const val = row[col.accessorKey];
                    return val !== null && val !== undefined ? String(val) : "—";
                  }
                  return "—";
                });

                // Check if values differ
                const allSame = values.every((v, _, arr) => {
                  const str1 = typeof v === "string" ? v : JSON.stringify(v);
                  const str2 = typeof arr[0] === "string" ? arr[0] : JSON.stringify(arr[0]);
                  return str1 === str2;
                });

                return (
                  <tr
                    key={col.id}
                    className={cn(
                      "border-b border-[var(--table-border)]",
                      !allSame && "bg-[var(--background-warning)]/30"
                    )}
                  >
                    <td className="sticky left-0 bg-[var(--background-subtle)] px-4 py-3 text-sm font-medium text-[var(--foreground-muted)]">
                      {col.header}
                    </td>
                    {values.map((value, index) => (
                      <td
                        key={`${col.id}-${index}`}
                        className="px-4 py-3 text-sm text-[var(--foreground-default)]"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ============================================
// Bulk Action Toolbar
// ============================================

interface BulkActionToolbarProps<T> {
  selectedCount: number;
  totalCount: number;
  actions: BulkAction<T>[];
  selectedRows: T[];
  onClearSelection: () => void;
  onSelectAll: () => void;
  allSelected: boolean;
}

function BulkActionToolbar<T>({
  selectedCount,
  totalCount,
  actions,
  selectedRows,
  onClearSelection,
  onSelectAll,
  allSelected,
}: BulkActionToolbarProps<T>) {
  const toolbarActions = actions.filter((a) => a.showInToolbar !== false);
  const overflowActions = actions.filter((a) => a.showInToolbar === false);

  return (
    <div className="flex animate-fade-in items-center gap-4 rounded-lg border border-[var(--border-brand)] bg-[var(--background-brand-subtle)] px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-[var(--foreground-brand)]">
          {selectedCount} selected
        </span>
        {selectedCount < totalCount && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onSelectAll}
            className="text-[var(--foreground-brand)] hover:text-[var(--foreground-brand-emphasis)]"
          >
            Select all {totalCount}
          </Button>
        )}
      </div>

      <div className="h-4 w-px bg-[var(--border-brand)]" />

      <div className="flex items-center gap-2">
        {toolbarActions.map((action) => (
          <Button
            key={action.id}
            variant={action.variant === "destructive" ? "destructive" : "secondary"}
            size="sm"
            onClick={() => action.onAction(selectedRows)}
            className="gap-1.5"
          >
            {action.icon}
            {action.label}
          </Button>
        ))}

        {overflowActions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <DotsThree className="h-4 w-4" weight="bold" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {overflowActions.map((action) => (
                <DropdownMenuItem
                  key={action.id}
                  onClick={() => action.onAction(selectedRows)}
                  className={
                    action.variant === "destructive" ? "text-[var(--foreground-error)]" : undefined
                  }
                >
                  {action.icon && <span className="mr-2">{action.icon}</span>}
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="ml-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="gap-1.5 text-[var(--foreground-muted)]"
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </Button>
      </div>
    </div>
  );
}

// ============================================
// Row Expansion Panel
// ============================================

export interface RowExpansionPanelProps<T> {
  row: T | null;
  open: boolean;
  onClose: () => void;
  title?: string | ((row: T) => string);
  description?: string | ((row: T) => string);
  children: (row: T) => React.ReactNode;
  side?: "right" | "left";
  className?: string;
}

function RowExpansionPanel<T>({
  row,
  open,
  onClose,
  title,
  description,
  children,
  side = "right",
  className,
}: RowExpansionPanelProps<T>) {
  if (!row) return null;

  const resolvedTitle = typeof title === "function" ? title(row) : title;
  const resolvedDescription = typeof description === "function" ? description(row) : description;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side={side} className={cn("w-full sm:max-w-lg", className)}>
        {(resolvedTitle || resolvedDescription) && (
          <SheetHeader>
            {resolvedTitle && <SheetTitle>{resolvedTitle}</SheetTitle>}
            {resolvedDescription && <SheetDescription>{resolvedDescription}</SheetDescription>}
          </SheetHeader>
        )}
        <div className="mt-6">{children(row)}</div>
      </SheetContent>
    </Sheet>
  );
}

// ============================================
// Column Filter Types and Components
// ============================================

export type ColumnFilterValue =
  | string
  | number
  | { min?: number; max?: number }
  | { start?: Date; end?: Date }
  | null;

export interface ActiveFilter {
  columnId: string;
  columnHeader: string;
  value: ColumnFilterValue;
  type: ColumnFilterType;
}

interface FilterChipProps {
  filter: ActiveFilter;
  onRemove: () => void;
}

function FilterChip({ filter, onRemove }: FilterChipProps) {
  const getDisplayValue = () => {
    if (filter.value === null) return "";
    if (typeof filter.value === "string") return filter.value;
    if (typeof filter.value === "number") return String(filter.value);
    if ("min" in filter.value || "max" in filter.value) {
      const { min, max } = filter.value as { min?: number; max?: number };
      if (min !== undefined && max !== undefined) return `${min} - ${max}`;
      if (min !== undefined) return `≥ ${min}`;
      if (max !== undefined) return `≤ ${max}`;
    }
    return "";
  };

  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--background-brand-subtle)] px-2.5 py-1 text-caption text-[var(--foreground-brand)]">
      <span className="font-medium">{filter.columnHeader}:</span>
      <span>{getDisplayValue()}</span>
      <button
        onClick={onRemove}
        className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-[var(--background-brand-muted)]"
        aria-label={`Remove ${filter.columnHeader} filter`}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

interface ColumnFilterPopoverProps<T> {
  column: Column<T>;
  value: ColumnFilterValue;
  onChange: (value: ColumnFilterValue) => void;
  data: T[];
}

function ColumnFilterPopover<T>({ column, value, onChange, data }: ColumnFilterPopoverProps<T>) {
  const [localValue, setLocalValue] = React.useState<ColumnFilterValue>(value);
  const filterConfig = column.filterConfig;
  const filterType = filterConfig?.type || "text";

  // Auto-detect options for select filter if not provided
  const selectOptions = React.useMemo(() => {
    if (filterConfig?.options) return filterConfig.options;
    if (filterType !== "select" || !column.accessorKey) return [];

    const uniqueValues = new Set<string>();
    data.forEach((row) => {
      const val = row[column.accessorKey!];
      if (val !== null && val !== undefined) {
        uniqueValues.add(String(val));
      }
    });
    return Array.from(uniqueValues)
      .sort()
      .map((v) => ({ label: v, value: v }));
  }, [data, column.accessorKey, filterConfig?.options, filterType]);

  const handleApply = () => {
    onChange(localValue);
  };

  const handleClear = () => {
    setLocalValue(null);
    onChange(null);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "rounded p-1 transition-colors",
            "hover:bg-[var(--background-interactive-hover)]",
            value !== null && "text-[var(--foreground-brand)]"
          )}
          aria-label={`Filter by ${column.header}`}
        >
          <Funnel className="h-3.5 w-3.5" weight={value !== null ? "fill" : "regular"} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <div className="space-y-3">
          <div className="text-sm font-medium text-[var(--foreground-default)]">
            Filter: {column.header}
          </div>

          {filterType === "text" && (
            <Input
              type="text"
              placeholder={filterConfig?.placeholder || "Enter value..."}
              value={(localValue as string) || ""}
              onChange={(e) => setLocalValue(e.target.value || null)}
              className="h-8"
            />
          )}

          {filterType === "select" && (
            <Select
              value={(localValue as string) || ""}
              onValueChange={(val) => setLocalValue(val || null)}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder={filterConfig?.placeholder || "Select..."} />
              </SelectTrigger>
              <SelectContent>
                {selectOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {filterType === "number" && (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={
                  typeof localValue === "object" && localValue !== null && "min" in localValue
                    ? (localValue.min ?? "")
                    : ""
                }
                onChange={(e) => {
                  const min = e.target.value ? Number(e.target.value) : undefined;
                  setLocalValue((prev) => {
                    const prevObj =
                      typeof prev === "object" && prev !== null && "min" in prev ? prev : {};
                    return { ...prevObj, min };
                  });
                }}
                className="h-8"
              />
              <span className="text-[var(--foreground-muted)]">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={
                  typeof localValue === "object" && localValue !== null && "max" in localValue
                    ? (localValue.max ?? "")
                    : ""
                }
                onChange={(e) => {
                  const max = e.target.value ? Number(e.target.value) : undefined;
                  setLocalValue((prev) => {
                    const prevObj =
                      typeof prev === "object" && prev !== null && "max" in prev ? prev : {};
                    return { ...prevObj, max };
                  });
                }}
                className="h-8"
              />
            </div>
          )}

          <div className="flex items-center justify-between border-t border-[var(--border-muted)] pt-2">
            <Button variant="ghost" size="sm" onClick={handleClear}>
              Clear
            </Button>
            <Button variant="primary" size="sm" onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ============================================
// Skeleton Row for Loading State
// ============================================

function SkeletonCell({ width = "100%" }: { width?: string }) {
  return (
    <div className="h-4 animate-pulse rounded bg-[var(--background-muted)]" style={{ width }} />
  );
}

interface SkeletonRowsProps {
  rows: number;
  columns: number;
  hasCheckbox?: boolean;
  hasExpand?: boolean;
  hasActions?: boolean;
  density?: TableDensity;
}

function SkeletonRows({ rows, columns, hasCheckbox, hasExpand, hasActions }: SkeletonRowsProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {hasExpand && (
            <TableCell className="w-10">
              <div className="h-4 w-4 animate-pulse rounded bg-[var(--background-muted)]" />
            </TableCell>
          )}
          {hasCheckbox && (
            <TableCell className="w-12">
              <div className="h-4 w-4 animate-pulse rounded bg-[var(--background-muted)]" />
            </TableCell>
          )}
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TableCell key={colIndex}>
              <SkeletonCell
                width={colIndex === 0 ? "60%" : colIndex === columns - 1 ? "40%" : "80%"}
              />
            </TableCell>
          ))}
          {hasActions && (
            <TableCell className="w-12">
              <div className="h-6 w-6 animate-pulse rounded bg-[var(--background-muted)]" />
            </TableCell>
          )}
        </TableRow>
      ))}
    </>
  );
}

// ============================================
// Row Actions Cell
// ============================================

interface RowActionsCellProps<T> {
  row: T;
  actions: RowAction<T>[];
}

function RowActionsCell<T>({ row, actions }: RowActionsCellProps<T>) {
  const visibleActions = actions.filter((action) => !action.hidden?.(row));

  if (visibleActions.length === 0) return null;

  // If only 1-2 actions, show them inline
  if (visibleActions.length <= 2) {
    return (
      <div className="flex items-center gap-1">
        {visibleActions.map((action) => (
          <TooltipProvider key={action.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onAction(row);
                  }}
                  disabled={action.disabled?.(row)}
                  className={cn(
                    "rounded-md p-1.5 transition-colors",
                    "hover:bg-[var(--background-interactive-hover)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)]",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    action.variant === "destructive" &&
                      "text-[var(--foreground-error)] hover:bg-[var(--background-error)]"
                  )}
                >
                  {action.icon || <DotsThree className="h-4 w-4" weight="bold" />}
                </button>
              </TooltipTrigger>
              <TooltipContent>{action.label}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    );
  }

  // Otherwise show dropdown menu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "rounded-md p-1.5 transition-colors",
            "hover:bg-[var(--background-interactive-hover)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)]"
          )}
        >
          <DotsThree className="h-4 w-4" weight="bold" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {visibleActions.map((action) => (
          <DropdownMenuItem
            key={action.id}
            onClick={() => action.onAction(row)}
            disabled={action.disabled?.(row)}
            className={cn(action.variant === "destructive" && "text-[var(--foreground-error)]")}
          >
            {action.icon && <span className="mr-2">{action.icon}</span>}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================================
// Editable Cell
// ============================================

interface EditableCellProps<T> {
  row: T;
  column: Column<T>;
  value: unknown;
  onSave: (rowId: string, columnId: string, value: unknown) => void;
  getRowId: (row: T) => string;
}

function EditableCell<T>({ row, column, value, onSave, getRowId }: EditableCellProps<T>) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState<unknown>(value);
  const [error, setError] = React.useState<string | undefined>();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const editConfig = column.editConfig;
  const editType = editConfig?.type || "text";

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  React.useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditValue(value);
    setError(undefined);
  };

  const handleSave = () => {
    // Validate if validator exists
    if (editConfig?.validate) {
      const validationError = editConfig.validate(editValue);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    onSave(getRowId(row), column.id, editValue);
    setIsEditing(false);
    setError(undefined);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(value);
    setError(undefined);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  if (!isEditing) {
    return (
      <div
        className="group -m-1 flex min-h-[24px] cursor-pointer items-center gap-2 rounded p-1 transition-colors hover:bg-[var(--background-interactive-hover)]"
        onClick={handleStartEdit}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleStartEdit();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`Edit ${column.header}`}
      >
        <span className="flex-1">
          {column.cell
            ? column.cell(row)
            : column.accessorFn
              ? column.accessorFn(row)
              : String(value ?? "")}
        </span>
        <span className="opacity-0 transition-opacity group-hover:opacity-100">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className="text-[var(--foreground-muted)]"
          >
            <path
              d="M8.5 1.5L10.5 3.5L4 10H2V8L8.5 1.5Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1">
        {editType === "text" && (
          <Input
            ref={inputRef}
            type="text"
            value={String(editValue ?? "")}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            placeholder={editConfig?.placeholder}
            className={cn("h-7 text-sm", error && "border-[var(--border-error)]")}
          />
        )}
        {editType === "number" && (
          <Input
            ref={inputRef}
            type="number"
            value={editValue !== null && editValue !== undefined ? String(editValue) : ""}
            onChange={(e) => setEditValue(e.target.value ? Number(e.target.value) : null)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            placeholder={editConfig?.placeholder}
            className={cn("h-7 text-sm", error && "border-[var(--border-error)]")}
          />
        )}
        {editType === "select" && (
          <Select
            value={String(editValue ?? "")}
            onValueChange={(val) => {
              setEditValue(val);
              onSave(getRowId(row), column.id, val);
              setIsEditing(false);
            }}
          >
            <SelectTrigger className="h-7 text-sm">
              <SelectValue placeholder={editConfig?.placeholder || "Select..."} />
            </SelectTrigger>
            <SelectContent>
              {editConfig?.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {editType === "date" && (
          <Input
            ref={inputRef}
            type="date"
            value={editValue ? String(editValue) : ""}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className={cn("h-7 text-sm", error && "border-[var(--border-error)]")}
          />
        )}
      </div>
      {error && <p className="text-xs text-[var(--foreground-error)]">{error}</p>}
    </div>
  );
}

// ============================================
// Column Resize Handle
// ============================================

interface ColumnResizeHandleProps {
  columnId: string;
  onResize: (columnId: string, delta: number) => void;
  onResizeEnd: () => void;
}

function ColumnResizeHandle({ columnId, onResize, onResizeEnd }: ColumnResizeHandleProps) {
  const [isResizing, setIsResizing] = React.useState(false);
  const startXRef = React.useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    startXRef.current = e.clientX;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - startXRef.current;
      startXRef.current = e.clientX;
      onResize(columnId, delta);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      onResizeEnd();
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      className={cn(
        "absolute bottom-0 right-0 top-0 w-1 cursor-col-resize",
        "transition-colors hover:bg-[var(--border-brand)]",
        "group-hover:bg-[var(--border-muted)]",
        isResizing && "bg-[var(--border-brand)]"
      )}
      onMouseDown={handleMouseDown}
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize column"
    >
      <div
        className={cn(
          "absolute right-0 top-1/2 h-4 w-0.5 -translate-y-1/2 bg-[var(--border-default)]",
          "opacity-0 transition-opacity group-hover:opacity-100",
          isResizing && "bg-[var(--border-brand)] opacity-100"
        )}
      />
    </div>
  );
}

// ============================================
// Sortable Table Head (for column reordering)
// ============================================

interface SortableTableHeadProps<T> {
  column: Column<T>;
  colIndex: number;
  sortConfig: { key: string; direction: "asc" | "desc" } | null;
  onSort: (columnId: string) => void;
  stickyFirstColumn: boolean;
  selectable: boolean;
  columnFilters: boolean;
  filterValues: Record<string, ColumnFilterValue>;
  onFilterChange: (columnId: string, value: ColumnFilterValue) => void;
  data: T[];
  resizable: boolean;
  columnWidth?: number;
  onResize: (columnId: string, delta: number) => void;
  onResizeEnd: () => void;
  reorderable: boolean;
}

function SortableTableHead<T>({
  column,
  colIndex,
  sortConfig,
  onSort,
  stickyFirstColumn,
  selectable,
  columnFilters,
  filterValues,
  onFilterChange,
  data,
  resizable,
  columnWidth,
  onResize,
  onResizeEnd,
  reorderable,
}: SortableTableHeadProps<T>) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id,
  });

  const isColumnResizable = resizable && column.resizable !== false;

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    width: columnWidth ? `${columnWidth}px` : column.width,
    minWidth: column.minWidth,
  };

  return (
    <TableHead
      ref={setNodeRef}
      sortable={column.sortable}
      sorted={sortConfig?.key === column.id ? sortConfig.direction : false}
      onSort={() => onSort(column.id)}
      className={cn(
        column.className,
        isColumnResizable && "group relative",
        isDragging && "z-50 shadow-lg"
      )}
      sticky={stickyFirstColumn && colIndex === 0 && !selectable}
      style={style}
      {...attributes}
    >
      <div className="flex items-center gap-1">
        {reorderable && (
          <button
            {...listeners}
            className="-ml-1 cursor-grab rounded p-0.5 transition-colors hover:bg-[var(--background-interactive-hover)] active:cursor-grabbing"
            aria-label="Drag to reorder column"
          >
            <DotsSixVertical className="h-3.5 w-3.5 text-[var(--foreground-muted)]" weight="bold" />
          </button>
        )}
        <span>{column.header}</span>
        {columnFilters && column.filterConfig && (
          <ColumnFilterPopover
            column={column}
            value={filterValues[column.id] ?? null}
            onChange={(value) => onFilterChange(column.id, value)}
            data={data}
          />
        )}
      </div>
      {isColumnResizable && (
        <ColumnResizeHandle columnId={column.id} onResize={onResize} onResizeEnd={onResizeEnd} />
      )}
    </TableHead>
  );
}

// ============================================
// Group Row Header
// ============================================

interface GroupRowProps<T> {
  groupValue: string;
  rows: T[];
  isExpanded: boolean;
  onToggle: () => void;
  colSpan: number;
  renderGroupHeader?: (groupValue: string, rows: T[]) => React.ReactNode;
}

function GroupRow<T>({
  groupValue,
  rows,
  isExpanded,
  onToggle,
  colSpan,
  renderGroupHeader,
}: GroupRowProps<T>) {
  return (
    <TableRow className="bg-[var(--background-subtle)] hover:bg-[var(--background-interactive-hover)]">
      <TableCell colSpan={colSpan} className="py-2">
        <button
          onClick={onToggle}
          className="flex w-full items-center gap-2 text-left font-medium text-[var(--foreground-default)]"
        >
          <span className={cn("transition-transform duration-150", isExpanded && "rotate-90")}>
            <ChevronRight className="h-4 w-4 text-[var(--foreground-muted)]" />
          </span>
          {renderGroupHeader ? (
            renderGroupHeader(groupValue, rows)
          ) : (
            <span className="flex items-center gap-2">
              <span>{groupValue || "(No value)"}</span>
              <Badge variant="secondary" className="text-xs">
                {rows.length}
              </Badge>
            </span>
          )}
        </button>
      </TableCell>
    </TableRow>
  );
}

// ============================================
// Column Visibility Menu
// ============================================

interface ColumnVisibilityMenuProps<T> {
  columns: Column<T>[];
  visibleColumns: Set<string>;
  onToggleColumn: (columnId: string) => void;
  onResetColumns: () => void;
}

function ColumnVisibilityMenu<T>({
  columns,
  visibleColumns,
  onToggleColumn,
  onResetColumns,
}: ColumnVisibilityMenuProps<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Columns className="h-4 w-4" />
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={visibleColumns.has(column.id)}
            onCheckedChange={() => onToggleColumn(column.id)}
          >
            {column.header}
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onResetColumns}>Reset to default</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================================
// DataTable - Full-featured table
// ============================================

export interface DataTableProps<T> {
  /** Array of data objects to display */
  data: T[];
  /** Column configuration array */
  columns: Column<T>[];
  /** Enable row selection */
  selectable?: boolean;
  /** Currently selected row IDs (controlled) */
  selectedRows?: Set<string>;
  /** Callback when selection changes */
  onSelectionChange?: (selectedRows: Set<string>) => void;
  /** Get unique ID for a row */
  getRowId?: (row: T) => string;
  /** Enable search/filter */
  searchable?: boolean;
  /** Placeholder for search input */
  searchPlaceholder?: string;
  /** Enable pagination */
  paginated?: boolean;
  /** Initial rows per page */
  pageSize?: number;
  /** Page size options */
  pageSizeOptions?: number[];
  /** Empty state message */
  emptyMessage?: string;
  /** Loading state */
  loading?: boolean;
  /** Additional class name */
  className?: string;
  /** Callback when row is clicked */
  onRowClick?: (row: T) => void;
  /** Enable column visibility toggle */
  columnToggle?: boolean;
  /** Bulk actions configuration */
  bulkActions?: BulkAction<T>[];
  /** Make first column sticky */
  stickyFirstColumn?: boolean;
  /** Striped rows */
  striped?: boolean;
  /** Custom empty state content */
  emptyState?: React.ReactNode;
  /** Custom loading state content */
  loadingState?: React.ReactNode;
  /** Toolbar content (rendered between search and table) */
  toolbar?: React.ReactNode;
  /** Accessible label for the table */
  "aria-label"?: string;
  /** Enable row expansion with slide-out panel */
  expandable?: boolean;
  /** Content renderer for expanded row panel */
  renderExpandedRow?: (row: T) => React.ReactNode;
  /** Title for expansion panel */
  expansionTitle?: string | ((row: T) => string);
  /** Description for expansion panel */
  expansionDescription?: string | ((row: T) => string);
  /** Side for expansion panel (default: right) */
  expansionSide?: "right" | "left";
  /** Controlled expanded row (for external state management) */
  expandedRow?: T | null;
  /** Callback when expanded row changes */
  onExpandedRowChange?: (row: T | null) => void;
  /** Row actions configuration */
  rowActions?: RowAction<T>[];
  /** Row density - affects padding and row height */
  density?: TableDensity;
  /** Enable skeleton loading instead of spinner */
  skeletonLoading?: boolean;
  /** Number of skeleton rows to show */
  skeletonRows?: number;
  /** Enable column-specific filters */
  columnFilters?: boolean;
  /** Controlled column filter values */
  filterValues?: Record<string, ColumnFilterValue>;
  /** Callback when filter values change */
  onFilterChange?: (filters: Record<string, ColumnFilterValue>) => void;
  /** Callback when a cell is edited inline */
  onCellEdit?: (rowId: string, columnId: string, value: unknown) => void;
  /** Enable column resizing */
  resizable?: boolean;
  /** Controlled column widths */
  columnWidths?: Record<string, number>;
  /** Callback when column widths change */
  onColumnWidthsChange?: (widths: Record<string, number>) => void;
  /** Enable column reordering via drag-and-drop */
  reorderable?: boolean;
  /** Controlled column order (array of column IDs) */
  columnOrder?: string[];
  /** Callback when column order changes */
  onColumnOrderChange?: (order: string[]) => void;
  /** Column ID to group rows by */
  groupBy?: string;
  /** Controlled expanded groups (Set of group values) */
  expandedGroups?: Set<string>;
  /** Callback when expanded groups change */
  onExpandedGroupsChange?: (groups: Set<string>) => void;
  /** Custom group header renderer */
  renderGroupHeader?: (groupValue: string, rows: T[]) => React.ReactNode;
  /** Whether groups are expanded by default */
  groupsExpandedByDefault?: boolean;
  /** Enable virtualization for large datasets */
  virtualized?: boolean;
  /** Height of the table container (required for virtualization) */
  tableHeight?: number;
  /** Estimated row height for virtualization */
  estimatedRowHeight?: number;
  /** Enable export functionality */
  exportable?: boolean;
  /** Filename for exports (without extension) */
  exportFilename?: string;
  /** Custom value formatter for exports */
  exportFormatValue?: (value: unknown, column: Column<T>, row: T) => string;
  /** Enable bulk edit for selected rows */
  bulkEditable?: boolean;
  /** Callback when bulk edit is saved */
  onBulkEdit?: (rowIds: string[], columnId: string, value: unknown) => void;
  /** Enable comparison mode for selected rows */
  comparable?: boolean;
  /** Maximum rows to compare (default: 4) */
  maxCompareRows?: number;
  /** Title for comparison view */
  compareTitle?: string;
}

function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  selectable = false,
  selectedRows: controlledSelectedRows,
  onSelectionChange,
  getRowId = (row) => String(row.id),
  searchable = false,
  searchPlaceholder = "Search...",
  paginated = false,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  emptyMessage = "No results found.",
  loading = false,
  className,
  onRowClick,
  columnToggle = false,
  bulkActions = [],
  stickyFirstColumn = false,
  striped = false,
  emptyState,
  loadingState,
  toolbar,
  "aria-label": ariaLabel = "Data table",
  expandable = false,
  renderExpandedRow,
  expansionTitle,
  expansionDescription,
  expansionSide = "right",
  expandedRow: controlledExpandedRow,
  onExpandedRowChange,
  rowActions = [],
  density = "default",
  skeletonLoading = false,
  skeletonRows = 5,
  columnFilters = false,
  filterValues: controlledFilterValues,
  onFilterChange,
  onCellEdit,
  resizable = false,
  columnWidths: controlledColumnWidths,
  onColumnWidthsChange,
  reorderable = false,
  columnOrder: controlledColumnOrder,
  onColumnOrderChange,
  groupBy,
  expandedGroups: controlledExpandedGroups,
  onExpandedGroupsChange,
  renderGroupHeader,
  groupsExpandedByDefault = true,
  virtualized = false,
  tableHeight = 400,
  estimatedRowHeight = 52,
  exportable = false,
  exportFilename = "export",
  exportFormatValue,
  bulkEditable = false,
  onBulkEdit,
  comparable = false,
  maxCompareRows = 4,
  compareTitle = "Compare Items",
}: DataTableProps<T>) {
  // Search state
  const [searchQuery, setSearchQuery] = React.useState("");

  // Sort state
  const [sortConfig, setSortConfig] = React.useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(initialPageSize);

  // Selection state (uncontrolled)
  const [internalSelectedRows, setInternalSelectedRows] = React.useState<Set<string>>(new Set());
  const selectedRows = controlledSelectedRows ?? internalSelectedRows;
  const setSelectedRows = onSelectionChange ?? setInternalSelectedRows;

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = React.useState<Set<string>>(() => {
    return new Set(columns.filter((c) => c.defaultVisible !== false).map((c) => c.id));
  });

  // Keyboard navigation state
  const [focusedRowIndex, setFocusedRowIndex] = React.useState(-1);
  const tableRef = React.useRef<HTMLTableElement>(null);
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  // Range selection state (for shift+click)
  const lastSelectedIndexRef = React.useRef<number>(-1);

  // Expansion state (uncontrolled)
  const [internalExpandedRow, setInternalExpandedRow] = React.useState<T | null>(null);
  const expandedRow =
    controlledExpandedRow !== undefined ? controlledExpandedRow : internalExpandedRow;
  const setExpandedRow = onExpandedRowChange ?? setInternalExpandedRow;

  // Bulk edit modal state
  const [bulkEditOpen, setBulkEditOpen] = React.useState(false);

  // Comparison view state
  const [comparisonOpen, setComparisonOpen] = React.useState(false);

  // Column filter state (uncontrolled)
  const [internalFilterValues, setInternalFilterValues] = React.useState<
    Record<string, ColumnFilterValue>
  >({});
  const filterValues = controlledFilterValues ?? internalFilterValues;
  const setFilterValues = onFilterChange ?? setInternalFilterValues;

  // Column width state (uncontrolled)
  const [internalColumnWidths, setInternalColumnWidths] = React.useState<Record<string, number>>(
    () => {
      // Initialize with column widths if specified
      const widths: Record<string, number> = {};
      columns.forEach((col) => {
        if (col.width) {
          const numWidth = parseInt(col.width, 10);
          if (!isNaN(numWidth)) {
            widths[col.id] = numWidth;
          }
        }
      });
      return widths;
    }
  );
  const columnWidths = controlledColumnWidths ?? internalColumnWidths;
  const setColumnWidths = onColumnWidthsChange ?? setInternalColumnWidths;

  // Handle column resize
  const handleColumnResize = (columnId: string, delta: number) => {
    const currentWidth = columnWidths[columnId] ?? 150; // Default width
    const newWidth = Math.max(50, currentWidth + delta); // Minimum 50px
    setColumnWidths({ ...columnWidths, [columnId]: newWidth });
  };

  const handleResizeEnd = () => {
    // Could be used for analytics or saving state
  };

  // Column order state (uncontrolled)
  const [internalColumnOrder, setInternalColumnOrder] = React.useState<string[]>(() =>
    columns.map((c) => c.id)
  );
  const columnOrder = controlledColumnOrder ?? internalColumnOrder;
  const setColumnOrder = onColumnOrderChange ?? setInternalColumnOrder;

  // dnd-kit sensors for column reordering
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle column drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = columnOrder.indexOf(String(active.id));
      const newIndex = columnOrder.indexOf(String(over.id));

      setColumnOrder(arrayMove(columnOrder, oldIndex, newIndex));
    }
  };

  // Expanded groups state (uncontrolled)
  const [internalExpandedGroups, setInternalExpandedGroups] = React.useState<Set<string>>(() => {
    if (groupsExpandedByDefault && groupBy) {
      // Initialize all groups as expanded
      const allGroupValues = new Set<string>();
      data.forEach((row) => {
        const column = columns.find((c) => c.id === groupBy);
        if (column?.accessorKey) {
          allGroupValues.add(String(row[column.accessorKey] ?? ""));
        }
      });
      return allGroupValues;
    }
    return new Set();
  });
  const expandedGroups = controlledExpandedGroups ?? internalExpandedGroups;
  const setExpandedGroups = onExpandedGroupsChange ?? setInternalExpandedGroups;

  // Handle group toggle
  const handleGroupToggle = (groupValue: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupValue)) {
      newExpanded.delete(groupValue);
    } else {
      newExpanded.add(groupValue);
    }
    setExpandedGroups(newExpanded);
  };

  // Active filters for display
  const activeFilters = React.useMemo(() => {
    const filters: ActiveFilter[] = [];
    Object.entries(filterValues).forEach(([columnId, value]) => {
      if (value !== null && value !== undefined) {
        const column = columns.find((c) => c.id === columnId);
        if (column) {
          filters.push({
            columnId,
            columnHeader: column.header,
            value,
            type: column.filterConfig?.type || "text",
          });
        }
      }
    });
    return filters;
  }, [filterValues, columns]);

  // Handle column filter change
  const handleFilterChange = (columnId: string, value: ColumnFilterValue) => {
    setFilterValues({
      ...filterValues,
      [columnId]: value,
    });
  };

  // Remove a filter
  const handleRemoveFilter = (columnId: string) => {
    const newFilters = { ...filterValues };
    delete newFilters[columnId];
    setFilterValues(newFilters);
  };

  // Clear all filters
  const handleClearAllFilters = () => {
    setFilterValues({});
  };

  // Filter data based on search query and column filters
  const filteredData = React.useMemo(() => {
    let result = data;

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((row) => {
        return columns.some((column) => {
          if (column.filterable === false) return false;
          const value = column.accessorKey ? row[column.accessorKey] : column.accessorFn?.(row);
          return String(value ?? "")
            .toLowerCase()
            .includes(query);
        });
      });
    }

    // Apply column-specific filters
    if (columnFilters) {
      Object.entries(filterValues).forEach(([columnId, filterValue]) => {
        if (filterValue === null || filterValue === undefined) return;

        const column = columns.find((c) => c.id === columnId);
        if (!column || !column.accessorKey) return;

        const filterType = column.filterConfig?.type || "text";

        result = result.filter((row) => {
          const cellValue = row[column.accessorKey!];
          if (cellValue === null || cellValue === undefined) return false;

          switch (filterType) {
            case "text":
              return String(cellValue).toLowerCase().includes(String(filterValue).toLowerCase());
            case "select":
              return String(cellValue) === String(filterValue);
            case "number":
              if (typeof filterValue === "object" && "min" in filterValue) {
                const numValue = Number(cellValue);
                const { min, max } = filterValue as { min?: number; max?: number };
                if (min !== undefined && numValue < min) return false;
                if (max !== undefined && numValue > max) return false;
                return true;
              }
              return true;
            default:
              return true;
          }
        });
      });
    }

    return result;
  }, [data, searchQuery, columns, filterValues, columnFilters]);

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return filteredData;

    const column = columns.find((c) => c.id === sortConfig.key);
    if (!column) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = column.accessorKey ? a[column.accessorKey] : column.accessorFn?.(a);
      const bValue = column.accessorKey ? b[column.accessorKey] : column.accessorFn?.(b);

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sortConfig, columns]);

  // Group data by the specified column
  const groupedData = React.useMemo(() => {
    if (!groupBy) return null;

    const column = columns.find((c) => c.id === groupBy);
    if (!column || !column.accessorKey) return null;

    const groups = new Map<string, T[]>();
    sortedData.forEach((row) => {
      const key = column.accessorKey;
      const groupValue = key ? String(row[key] ?? "") : "";
      if (!groups.has(groupValue)) {
        groups.set(groupValue, []);
      }
      const group = groups.get(groupValue);
      if (group) group.push(row);
    });

    return Array.from(groups.entries()).map(([value, rows]) => ({
      groupValue: value,
      rows,
    }));
  }, [groupBy, sortedData, columns]);

  // Paginate data
  const paginatedData = React.useMemo(() => {
    if (!paginated) return sortedData;

    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, paginated, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Get visible columns (respecting order and pinning)
  const displayColumns = React.useMemo(() => {
    let visibleCols = columns.filter((c) => visibleColumns.has(c.id));

    if (reorderable) {
      // Sort by column order
      visibleCols = visibleCols.sort((a, b) => {
        const aIndex = columnOrder.indexOf(a.id);
        const bIndex = columnOrder.indexOf(b.id);
        // Columns not in order go to the end
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      });
    }

    // Separate pinned columns
    const pinnedLeft = visibleCols.filter((c) => c.pinned === "left");
    const pinnedRight = visibleCols.filter((c) => c.pinned === "right");
    const unpinned = visibleCols.filter((c) => !c.pinned);

    // Return in order: left-pinned, unpinned, right-pinned
    return [...pinnedLeft, ...unpinned, ...pinnedRight];
  }, [columns, visibleColumns, columnOrder, reorderable]);

  // Calculate cumulative widths for pinned column positioning
  const pinnedColumnOffsets = React.useMemo(() => {
    const offsets: Record<string, number> = {};
    let leftOffset = 0;
    let rightOffset = 0;

    // Calculate left offsets
    displayColumns.forEach((col) => {
      if (col.pinned === "left") {
        offsets[col.id] = leftOffset;
        const width = columnWidths[col.id] ?? (col.width ? parseInt(col.width, 10) : 150);
        leftOffset += width;
      }
    });

    // Calculate right offsets (reversed)
    [...displayColumns].reverse().forEach((col) => {
      if (col.pinned === "right") {
        offsets[col.id] = rightOffset;
        const width = columnWidths[col.id] ?? (col.width ? parseInt(col.width, 10) : 150);
        rightOffset += width;
      }
    });

    return offsets;
  }, [displayColumns, columnWidths]);

  // Row virtualizer for large datasets
  const rowVirtualizer = useVirtualizer({
    count: virtualized ? (groupedData ? 0 : paginatedData.length) : 0,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => estimatedRowHeight,
    overscan: 5,
    enabled: virtualized && !groupedData, // Disable virtualization for grouped data
  });

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Handle sort
  const handleSort = (columnId: string) => {
    setSortConfig((current) => {
      if (current?.key !== columnId) {
        return { key: columnId, direction: "asc" };
      }
      if (current.direction === "asc") {
        return { key: columnId, direction: "desc" };
      }
      return null;
    });
  };

  // Handle row selection with shift+click range selection
  const handleRowSelect = (rowId: string, rowIndex: number, shiftKey: boolean = false) => {
    const newSelected = new Set(selectedRows);

    // Shift+click for range selection
    if (shiftKey && lastSelectedIndexRef.current >= 0 && selectable) {
      const start = Math.min(lastSelectedIndexRef.current, rowIndex);
      const end = Math.max(lastSelectedIndexRef.current, rowIndex);

      for (let i = start; i <= end; i++) {
        if (paginatedData[i]) {
          newSelected.add(getRowId(paginatedData[i]));
        }
      }
    } else {
      // Normal click
      if (newSelected.has(rowId)) {
        newSelected.delete(rowId);
      } else {
        newSelected.add(rowId);
      }
    }

    lastSelectedIndexRef.current = rowIndex;
    setSelectedRows(newSelected);
  };

  // Handle select all on current page
  const handleSelectAllPage = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map(getRowId)));
    }
  };

  // Handle select all filtered results
  const handleSelectAllFiltered = () => {
    setSelectedRows(new Set(sortedData.map(getRowId)));
  };

  // Clear selection
  const handleClearSelection = () => {
    setSelectedRows(new Set());
  };

  // Column visibility toggle
  const handleToggleColumn = (columnId: string) => {
    setVisibleColumns((prev) => {
      const next = new Set(prev);
      if (next.has(columnId)) {
        next.delete(columnId);
      } else {
        next.add(columnId);
      }
      return next;
    });
  };

  // Reset columns to default
  const handleResetColumns = () => {
    setVisibleColumns(new Set(columns.filter((c) => c.defaultVisible !== false).map((c) => c.id)));
  };

  // Handle row expansion
  const handleRowExpand = (row: T) => {
    if (expandedRow && getRowId(expandedRow) === getRowId(row)) {
      setExpandedRow(null);
    } else {
      setExpandedRow(row);
    }
  };

  const handleCloseExpansion = () => {
    setExpandedRow(null);
  };

  // Handle bulk edit save
  const handleBulkEditSave = (columnId: string, value: unknown) => {
    if (onBulkEdit && selectedRows.size > 0) {
      onBulkEdit(Array.from(selectedRows), columnId, value);
    }
    setBulkEditOpen(false);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!paginatedData.length) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedRowIndex((prev) => Math.min(prev + 1, paginatedData.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedRowIndex((prev) => Math.max(prev - 1, 0));
        break;
      case "Enter":
        if (focusedRowIndex >= 0) {
          if (expandable && renderExpandedRow) {
            handleRowExpand(paginatedData[focusedRowIndex]);
          } else if (onRowClick) {
            onRowClick(paginatedData[focusedRowIndex]);
          }
        }
        break;
      case " ":
        if (focusedRowIndex >= 0 && selectable) {
          e.preventDefault();
          handleRowSelect(getRowId(paginatedData[focusedRowIndex]), focusedRowIndex, e.shiftKey);
        }
        break;
      case "Home":
        e.preventDefault();
        setFocusedRowIndex(0);
        break;
      case "End":
        e.preventDefault();
        setFocusedRowIndex(paginatedData.length - 1);
        break;
      case "Escape":
        if (expandedRow) {
          e.preventDefault();
          handleCloseExpansion();
        }
        break;
    }
  };

  const isAllPageSelected =
    paginatedData.length > 0 && paginatedData.every((row) => selectedRows.has(getRowId(row)));
  const isSomeSelected = selectedRows.size > 0 && !isAllPageSelected;

  // Get selected row objects for bulk actions
  const selectedRowObjects = React.useMemo(() => {
    return sortedData.filter((row) => selectedRows.has(getRowId(row)));
  }, [sortedData, selectedRows, getRowId]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Top toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Search */}
          {searchable && (
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[var(--foreground-muted)]" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] hover:text-[var(--foreground-default)]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}
          {toolbar}
        </div>

        <div className="flex items-center gap-2">
          {/* Compare button */}
          {comparable &&
            selectable &&
            selectedRows.size >= 2 &&
            selectedRows.size <= maxCompareRows && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setComparisonOpen(true)}
                className="gap-1.5"
              >
                <ArrowsOutLineHorizontal className="h-4 w-4" />
                Compare ({selectedRows.size})
              </Button>
            )}

          {/* Bulk edit button */}
          {bulkEditable &&
            selectable &&
            selectedRows.size > 0 &&
            columns.some((c) => c.editable) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBulkEditOpen(true)}
                className="gap-1.5"
              >
                <PencilSimple className="h-4 w-4" />
                Edit ({selectedRows.size})
              </Button>
            )}

          {/* Export menu */}
          {exportable && (
            <ExportMenu
              data={sortedData}
              columns={displayColumns}
              filename={exportFilename}
              formatValue={exportFormatValue}
            />
          )}

          {/* Column toggle */}
          {columnToggle && (
            <ColumnVisibilityMenu
              columns={columns}
              visibleColumns={visibleColumns}
              onToggleColumn={handleToggleColumn}
              onResetColumns={handleResetColumns}
            />
          )}
        </div>
      </div>

      {/* Bulk action toolbar */}
      {selectable && selectedRows.size > 0 && bulkActions.length > 0 && (
        <BulkActionToolbar
          selectedCount={selectedRows.size}
          totalCount={sortedData.length}
          actions={bulkActions}
          selectedRows={selectedRowObjects}
          onClearSelection={handleClearSelection}
          onSelectAll={handleSelectAllFiltered}
          allSelected={selectedRows.size === sortedData.length}
        />
      )}

      {/* Filter chips */}
      {columnFilters && activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-[var(--border-muted)] bg-[var(--background-subtle)] p-3">
          <span className="mr-1 text-caption text-[var(--foreground-muted)]">Filters:</span>
          {activeFilters.map((filter) => (
            <FilterChip
              key={filter.columnId}
              filter={filter}
              onRemove={() => handleRemoveFilter(filter.columnId)}
            />
          ))}
          <button
            onClick={handleClearAllFilters}
            className="ml-2 text-caption text-[var(--foreground-muted)] underline underline-offset-2 hover:text-[var(--foreground-default)]"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Table */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div
          ref={tableContainerRef}
          className={cn("overflow-auto", virtualized && "relative")}
          onKeyDown={handleKeyDown}
          role="grid"
          aria-label={ariaLabel}
          aria-rowcount={sortedData.length + 1}
          tabIndex={0}
          style={virtualized ? { height: tableHeight } : undefined}
        >
          <Table ref={tableRef} hoverable bordered striped={striped} density={density}>
            <TableHeader sticky>
              <TableRow>
                {expandable && renderExpandedRow && (
                  <TableHead className="w-10" sticky={stickyFirstColumn && !selectable}>
                    <span className="sr-only">Expand</span>
                  </TableHead>
                )}
                {selectable && (
                  <TableHead className="w-12" sticky={stickyFirstColumn && !expandable}>
                    <Checkbox
                      checked={isAllPageSelected ? true : isSomeSelected ? "indeterminate" : false}
                      onCheckedChange={handleSelectAllPage}
                      aria-label={isAllPageSelected ? "Deselect all" : "Select all"}
                    />
                  </TableHead>
                )}
                {reorderable ? (
                  <SortableContext
                    items={displayColumns.map((c) => c.id)}
                    strategy={horizontalListSortingStrategy}
                  >
                    {displayColumns.map((column, colIndex) => (
                      <SortableTableHead
                        key={column.id}
                        column={column}
                        colIndex={colIndex}
                        sortConfig={sortConfig}
                        onSort={handleSort}
                        stickyFirstColumn={stickyFirstColumn}
                        selectable={selectable}
                        columnFilters={columnFilters}
                        filterValues={filterValues}
                        onFilterChange={handleFilterChange}
                        data={data}
                        resizable={resizable}
                        columnWidth={columnWidths[column.id]}
                        onResize={handleColumnResize}
                        onResizeEnd={handleResizeEnd}
                        reorderable={reorderable}
                      />
                    ))}
                  </SortableContext>
                ) : (
                  displayColumns.map((column, colIndex) => {
                    const isColumnResizable = resizable && column.resizable !== false;
                    const columnWidth = columnWidths[column.id];
                    const isPinned = !!column.pinned;
                    const pinnedOffset = pinnedColumnOffsets[column.id];

                    return (
                      <TableHead
                        key={column.id}
                        sortable={column.sortable}
                        sorted={sortConfig?.key === column.id ? sortConfig.direction : false}
                        onSort={() => handleSort(column.id)}
                        className={cn(
                          column.className,
                          isColumnResizable && "group relative",
                          isPinned && "sticky z-20 bg-[var(--table-background-header)]",
                          column.pinned === "left" && "border-r border-[var(--table-border)]",
                          column.pinned === "right" && "border-l border-[var(--table-border)]"
                        )}
                        sticky={(stickyFirstColumn && colIndex === 0 && !selectable) || isPinned}
                        style={{
                          width: columnWidth ? `${columnWidth}px` : column.width,
                          minWidth: column.minWidth,
                          ...(column.pinned === "left" && { left: `${pinnedOffset}px` }),
                          ...(column.pinned === "right" && { right: `${pinnedOffset}px` }),
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <span>{column.header}</span>
                          {columnFilters && column.filterConfig && (
                            <ColumnFilterPopover
                              column={column}
                              value={filterValues[column.id] ?? null}
                              onChange={(value) => handleFilterChange(column.id, value)}
                              data={data}
                            />
                          )}
                        </div>
                        {isColumnResizable && (
                          <ColumnResizeHandle
                            columnId={column.id}
                            onResize={handleColumnResize}
                            onResizeEnd={handleResizeEnd}
                          />
                        )}
                      </TableHead>
                    );
                  })
                )}
                {rowActions.length > 0 && (
                  <TableHead className="w-12">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                skeletonLoading ? (
                  <SkeletonRows
                    rows={skeletonRows}
                    columns={displayColumns.length}
                    hasCheckbox={selectable}
                    hasExpand={expandable && !!renderExpandedRow}
                    hasActions={rowActions.length > 0}
                    density={density}
                  />
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={
                        displayColumns.length +
                        (selectable ? 1 : 0) +
                        (expandable && renderExpandedRow ? 1 : 0) +
                        (rowActions.length > 0 ? 1 : 0)
                      }
                      className="h-32 text-center"
                    >
                      {loadingState || (
                        <div className="flex animate-fade-in flex-col items-center justify-center gap-3">
                          <div className="relative">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--background-brand-subtle)]">
                              <CircleNotch className="h-5 w-5 animate-spin text-[var(--foreground-brand)]" />
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-[var(--foreground-default)]">
                              Loading data
                            </p>
                            <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">
                              Please wait...
                            </p>
                          </div>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )
              ) : paginatedData.length === 0 && !groupedData ? (
                <TableRow>
                  <TableCell
                    colSpan={
                      displayColumns.length +
                      (selectable ? 1 : 0) +
                      (expandable && renderExpandedRow ? 1 : 0) +
                      (rowActions.length > 0 ? 1 : 0)
                    }
                    className="h-32 text-center"
                  >
                    {emptyState || (
                      <div className="flex animate-fade-in flex-col items-center justify-center gap-3 py-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--background-muted)]">
                          <MagnifyingGlass className="h-6 w-6 text-[var(--foreground-muted)]" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-[var(--foreground-default)]">
                            {emptyMessage}
                          </p>
                          {searchQuery && (
                            <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                              Try adjusting your search or filters
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ) : groupedData ? (
                // Grouped rows rendering
                groupedData.map(({ groupValue, rows: groupRows }) => {
                  const isGroupExpanded = expandedGroups.has(groupValue);
                  const totalColSpan =
                    displayColumns.length +
                    (selectable ? 1 : 0) +
                    (expandable && renderExpandedRow ? 1 : 0) +
                    (rowActions.length > 0 ? 1 : 0);

                  return (
                    <React.Fragment key={groupValue}>
                      <GroupRow
                        groupValue={groupValue}
                        rows={groupRows}
                        isExpanded={isGroupExpanded}
                        onToggle={() => handleGroupToggle(groupValue)}
                        colSpan={totalColSpan}
                        renderGroupHeader={renderGroupHeader}
                      />
                      {isGroupExpanded &&
                        groupRows.map((row, rowIndex) => {
                          const rowId = getRowId(row);
                          const isSelected = selectedRows.has(rowId);
                          const isFocused = rowIndex === focusedRowIndex;
                          const isRowExpanded = expandedRow
                            ? getRowId(expandedRow) === rowId
                            : false;

                          return (
                            <TableRow
                              key={rowId}
                              selected={isSelected}
                              onClick={() => {
                                if (expandable && renderExpandedRow) {
                                  handleRowExpand(row);
                                } else {
                                  onRowClick?.(row);
                                }
                              }}
                              className={cn(
                                (onRowClick || (expandable && renderExpandedRow)) &&
                                  "cursor-pointer",
                                isFocused && "ring-2 ring-inset ring-[var(--ring-color)]",
                                isRowExpanded && "bg-[var(--table-background-row-selected)]"
                              )}
                              aria-rowindex={rowIndex + 2}
                              aria-expanded={
                                expandable && renderExpandedRow ? isRowExpanded : undefined
                              }
                            >
                              {expandable && renderExpandedRow && (
                                <TableCell
                                  sticky={stickyFirstColumn && !selectable}
                                  className="w-10"
                                >
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRowExpand(row);
                                    }}
                                    className={cn(
                                      "rounded p-1 transition-transform duration-150",
                                      "hover:bg-[var(--background-interactive-hover)]",
                                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)]",
                                      isRowExpanded && "rotate-90"
                                    )}
                                    aria-label={isRowExpanded ? "Collapse row" : "Expand row"}
                                  >
                                    <ChevronRight className="h-4 w-4 text-[var(--foreground-muted)]" />
                                  </button>
                                </TableCell>
                              )}
                              {selectable && (
                                <TableCell sticky={stickyFirstColumn && !expandable}>
                                  <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={() => handleRowSelect(rowId, rowIndex)}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (e.shiftKey) {
                                        e.preventDefault();
                                        handleRowSelect(rowId, rowIndex, true);
                                      }
                                    }}
                                    aria-label={`Select row ${rowIndex + 1}`}
                                  />
                                </TableCell>
                              )}
                              {displayColumns.map((column, colIndex) => {
                                const cellValue = column.accessorKey
                                  ? row[column.accessorKey]
                                  : undefined;
                                const isEditable = column.editable && onCellEdit;
                                const isPinned = !!column.pinned;
                                const pinnedOffset = pinnedColumnOffsets[column.id];

                                return (
                                  <TableCell
                                    key={column.id}
                                    className={cn(
                                      column.className,
                                      isPinned && "sticky z-10 bg-inherit",
                                      column.pinned === "left" &&
                                        "border-r border-[var(--table-border)]",
                                      column.pinned === "right" &&
                                        "border-l border-[var(--table-border)]"
                                    )}
                                    sticky={
                                      (stickyFirstColumn &&
                                        colIndex === 0 &&
                                        !selectable &&
                                        !expandable) ||
                                      isPinned
                                    }
                                    onClick={isEditable ? (e) => e.stopPropagation() : undefined}
                                    style={{
                                      ...(column.pinned === "left" && {
                                        left: `${pinnedOffset}px`,
                                      }),
                                      ...(column.pinned === "right" && {
                                        right: `${pinnedOffset}px`,
                                      }),
                                    }}
                                  >
                                    {isEditable ? (
                                      <EditableCell
                                        row={row}
                                        column={column}
                                        value={cellValue}
                                        onSave={onCellEdit}
                                        getRowId={getRowId}
                                      />
                                    ) : column.cell ? (
                                      column.cell(row)
                                    ) : column.accessorFn ? (
                                      column.accessorFn(row)
                                    ) : column.accessorKey ? (
                                      String(row[column.accessorKey] ?? "")
                                    ) : null}
                                  </TableCell>
                                );
                              })}
                              {rowActions.length > 0 && (
                                <TableCell className="w-12">
                                  <RowActionsCell row={row} actions={rowActions} />
                                </TableCell>
                              )}
                            </TableRow>
                          );
                        })}
                    </React.Fragment>
                  );
                })
              ) : virtualized && !groupedData ? (
                // Virtualized non-grouped rows rendering
                <>
                  {/* Spacer for virtualization - before visible rows */}
                  <tr style={{ height: `${rowVirtualizer.getVirtualItems()[0]?.start ?? 0}px` }} />
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const row = paginatedData[virtualRow.index];
                    if (!row) return null;

                    const rowId = getRowId(row);
                    const isSelected = selectedRows.has(rowId);
                    const isFocused = virtualRow.index === focusedRowIndex;
                    const isExpanded = expandedRow ? getRowId(expandedRow) === rowId : false;

                    return (
                      <TableRow
                        key={rowId}
                        data-index={virtualRow.index}
                        selected={isSelected}
                        onClick={() => {
                          if (expandable && renderExpandedRow) {
                            handleRowExpand(row);
                          } else {
                            onRowClick?.(row);
                          }
                        }}
                        className={cn(
                          (onRowClick || (expandable && renderExpandedRow)) && "cursor-pointer",
                          isFocused && "ring-2 ring-inset ring-[var(--ring-color)]",
                          isExpanded && "bg-[var(--table-background-row-selected)]"
                        )}
                        aria-rowindex={virtualRow.index + 2}
                        aria-expanded={expandable && renderExpandedRow ? isExpanded : undefined}
                        style={{ height: `${virtualRow.size}px` }}
                      >
                        {expandable && renderExpandedRow && (
                          <TableCell sticky={stickyFirstColumn && !selectable} className="w-10">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRowExpand(row);
                              }}
                              className={cn(
                                "rounded p-1 transition-transform duration-150",
                                "hover:bg-[var(--background-interactive-hover)]",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)]",
                                isExpanded && "rotate-90"
                              )}
                              aria-label={isExpanded ? "Collapse row" : "Expand row"}
                            >
                              <ChevronRight className="h-4 w-4 text-[var(--foreground-muted)]" />
                            </button>
                          </TableCell>
                        )}
                        {selectable && (
                          <TableCell sticky={stickyFirstColumn && !expandable}>
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => handleRowSelect(rowId, virtualRow.index)}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (e.shiftKey) {
                                  e.preventDefault();
                                  handleRowSelect(rowId, virtualRow.index, true);
                                }
                              }}
                              aria-label={`Select row ${virtualRow.index + 1}`}
                            />
                          </TableCell>
                        )}
                        {displayColumns.map((column, colIndex) => {
                          const cellValue = column.accessorKey
                            ? row[column.accessorKey]
                            : undefined;
                          const isEditable = column.editable && onCellEdit;
                          const isPinned = !!column.pinned;
                          const pinnedOffset = pinnedColumnOffsets[column.id];

                          return (
                            <TableCell
                              key={column.id}
                              className={cn(
                                column.className,
                                isPinned && "sticky z-10 bg-inherit",
                                column.pinned === "left" && "border-r border-[var(--table-border)]",
                                column.pinned === "right" && "border-l border-[var(--table-border)]"
                              )}
                              sticky={
                                (stickyFirstColumn &&
                                  colIndex === 0 &&
                                  !selectable &&
                                  !expandable) ||
                                isPinned
                              }
                              onClick={isEditable ? (e) => e.stopPropagation() : undefined}
                              style={{
                                ...(column.pinned === "left" && { left: `${pinnedOffset}px` }),
                                ...(column.pinned === "right" && { right: `${pinnedOffset}px` }),
                              }}
                            >
                              {isEditable ? (
                                <EditableCell
                                  row={row}
                                  column={column}
                                  value={cellValue}
                                  onSave={onCellEdit}
                                  getRowId={getRowId}
                                />
                              ) : column.cell ? (
                                column.cell(row)
                              ) : column.accessorFn ? (
                                column.accessorFn(row)
                              ) : column.accessorKey ? (
                                String(row[column.accessorKey] ?? "")
                              ) : null}
                            </TableCell>
                          );
                        })}
                        {rowActions.length > 0 && (
                          <TableCell className="w-12">
                            <RowActionsCell row={row} actions={rowActions} />
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                  {/* Spacer for virtualization - after visible rows */}
                  <tr
                    style={{
                      height: `${rowVirtualizer.getTotalSize() - (rowVirtualizer.getVirtualItems()[rowVirtualizer.getVirtualItems().length - 1]?.end ?? 0)}px`,
                    }}
                  />
                </>
              ) : (
                // Non-grouped, non-virtualized rows rendering
                paginatedData.map((row, rowIndex) => {
                  const rowId = getRowId(row);
                  const isSelected = selectedRows.has(rowId);
                  const isFocused = rowIndex === focusedRowIndex;
                  const isExpanded = expandedRow ? getRowId(expandedRow) === rowId : false;

                  return (
                    <TableRow
                      key={rowId}
                      selected={isSelected}
                      onClick={() => {
                        if (expandable && renderExpandedRow) {
                          handleRowExpand(row);
                        } else {
                          onRowClick?.(row);
                        }
                      }}
                      className={cn(
                        (onRowClick || (expandable && renderExpandedRow)) && "cursor-pointer",
                        isFocused && "ring-2 ring-inset ring-[var(--ring-color)]",
                        isExpanded && "bg-[var(--table-background-row-selected)]"
                      )}
                      aria-rowindex={rowIndex + 2}
                      aria-expanded={expandable && renderExpandedRow ? isExpanded : undefined}
                    >
                      {expandable && renderExpandedRow && (
                        <TableCell sticky={stickyFirstColumn && !selectable} className="w-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRowExpand(row);
                            }}
                            className={cn(
                              "rounded p-1 transition-transform duration-150",
                              "hover:bg-[var(--background-interactive-hover)]",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)]",
                              isExpanded && "rotate-90"
                            )}
                            aria-label={isExpanded ? "Collapse row" : "Expand row"}
                          >
                            <ChevronRight className="h-4 w-4 text-[var(--foreground-muted)]" />
                          </button>
                        </TableCell>
                      )}
                      {selectable && (
                        <TableCell sticky={stickyFirstColumn && !expandable}>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleRowSelect(rowId, rowIndex)}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (e.shiftKey) {
                                e.preventDefault();
                                handleRowSelect(rowId, rowIndex, true);
                              }
                            }}
                            aria-label={`Select row ${rowIndex + 1}`}
                          />
                        </TableCell>
                      )}
                      {displayColumns.map((column, colIndex) => {
                        const cellValue = column.accessorKey ? row[column.accessorKey] : undefined;
                        const isEditable = column.editable && onCellEdit;
                        const isPinned = !!column.pinned;
                        const pinnedOffset = pinnedColumnOffsets[column.id];

                        return (
                          <TableCell
                            key={column.id}
                            className={cn(
                              column.className,
                              isPinned && "sticky z-10 bg-inherit",
                              column.pinned === "left" && "border-r border-[var(--table-border)]",
                              column.pinned === "right" && "border-l border-[var(--table-border)]"
                            )}
                            sticky={
                              (stickyFirstColumn && colIndex === 0 && !selectable && !expandable) ||
                              isPinned
                            }
                            onClick={isEditable ? (e) => e.stopPropagation() : undefined}
                            style={{
                              ...(column.pinned === "left" && { left: `${pinnedOffset}px` }),
                              ...(column.pinned === "right" && { right: `${pinnedOffset}px` }),
                            }}
                          >
                            {isEditable ? (
                              <EditableCell
                                row={row}
                                column={column}
                                value={cellValue}
                                onSave={onCellEdit}
                                getRowId={getRowId}
                              />
                            ) : column.cell ? (
                              column.cell(row)
                            ) : column.accessorFn ? (
                              column.accessorFn(row)
                            ) : column.accessorKey ? (
                              String(row[column.accessorKey] ?? "")
                            ) : null}
                          </TableCell>
                        );
                      })}
                      {rowActions.length > 0 && (
                        <TableCell className="w-12">
                          <RowActionsCell row={row} actions={rowActions} />
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </DndContext>

      {/* Pagination */}
      {paginated && totalPages > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-[var(--border-muted)] bg-[var(--background-subtle)] px-4 py-3">
          <div className="text-sm text-[var(--foreground-muted)]">
            Showing{" "}
            <span className="font-medium text-[var(--foreground-default)]">
              {(currentPage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-[var(--foreground-default)]">
              {Math.min(currentPage * pageSize, sortedData.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-[var(--foreground-default)]">
              {sortedData.length}
            </span>{" "}
            results
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--foreground-muted)]">Rows per page:</span>
              <Select
                value={String(pageSize)}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map((option) => (
                    <SelectItem key={option} value={String(option)}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="h-5 w-px bg-[var(--border-muted)]" />
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                aria-label="First page"
                className="h-8 w-8 transition-all duration-150 hover:scale-105 active:scale-95"
              >
                <CaretDoubleLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className="h-8 w-8 transition-all duration-150 hover:scale-105 active:scale-95"
              >
                <CaretLeft className="h-4 w-4" />
              </Button>
              <div className="min-w-[100px] px-3 py-1 text-center">
                <span className="text-sm font-medium text-[var(--foreground-default)]">
                  {currentPage}
                </span>
                <span className="text-sm text-[var(--foreground-muted)]"> of {totalPages}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className="h-8 w-8 transition-all duration-150 hover:scale-105 active:scale-95"
              >
                <CaretRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                aria-label="Last page"
                className="h-8 w-8 transition-all duration-150 hover:scale-105 active:scale-95"
              >
                <CaretDoubleRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Row Expansion Panel */}
      {expandable && renderExpandedRow && (
        <RowExpansionPanel
          row={expandedRow}
          open={expandedRow !== null}
          onClose={handleCloseExpansion}
          title={expansionTitle}
          description={expansionDescription}
          side={expansionSide}
        >
          {renderExpandedRow}
        </RowExpansionPanel>
      )}

      {/* Bulk Edit Modal */}
      {bulkEditable && (
        <BulkEditModal
          open={bulkEditOpen}
          onClose={() => setBulkEditOpen(false)}
          selectedRows={selectedRowObjects}
          columns={columns}
          onSave={handleBulkEditSave}
        />
      )}

      {/* Comparison View */}
      {comparable && comparisonOpen && selectedRowObjects.length >= 2 && (
        <ComparisonView
          rows={selectedRowObjects.slice(0, maxCompareRows)}
          columns={displayColumns}
          onClose={() => setComparisonOpen(false)}
          getRowId={getRowId}
          title={compareTitle}
        />
      )}
    </div>
  );
}

// ============================================
// Preset Bulk Actions for ATS
// ============================================

export function createATSBulkActions<T extends { id: string }>(handlers: {
  onMoveToStage?: (rows: T[], stage: string) => void;
  onReject?: (rows: T[]) => void;
  onEmail?: (rows: T[]) => void;
  onExport?: (rows: T[]) => void;
  onAddTags?: (rows: T[], tags: string[]) => void;
}): BulkAction<T>[] {
  const actions: BulkAction<T>[] = [];

  if (handlers.onMoveToStage) {
    actions.push({
      id: "move-stage",
      label: "Move to Stage",
      icon: <ArrowRight className="h-4 w-4" />,
      onAction: (rows) => handlers.onMoveToStage?.(rows, ""), // Stage selection handled by parent
      showInToolbar: true,
    });
  }

  if (handlers.onEmail) {
    actions.push({
      id: "email",
      label: "Send Email",
      icon: <Envelope className="h-4 w-4" />,
      onAction: handlers.onEmail,
      showInToolbar: true,
    });
  }

  if (handlers.onReject) {
    actions.push({
      id: "reject",
      label: "Reject",
      icon: <UserMinus className="h-4 w-4" />,
      onAction: handlers.onReject,
      variant: "destructive",
      showInToolbar: true,
    });
  }

  if (handlers.onExport) {
    actions.push({
      id: "export",
      label: "Export",
      icon: <Export className="h-4 w-4" />,
      onAction: handlers.onExport,
      showInToolbar: false,
    });
  }

  if (handlers.onAddTags) {
    actions.push({
      id: "add-tags",
      label: "Add Tags",
      icon: <Tag className="h-4 w-4" />,
      onAction: (rows) => handlers.onAddTags?.(rows, []), // Tag selection handled by parent
      showInToolbar: false,
    });
  }

  return actions;
}

// ============================================
// Exports
// ============================================

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableLink,
  DataTable,
  // Export utilities (exportTableData already exported inline)
  ExportMenu,
  // Bulk edit
  BulkEditModal,
  // Comparison view
  ComparisonView,
};
