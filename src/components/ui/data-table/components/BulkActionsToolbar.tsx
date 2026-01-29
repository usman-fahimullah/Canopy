"use client";

/**
 * BulkActionsToolbar Component
 *
 * Displays when rows are selected, showing selection count and available bulk actions.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../../button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../dropdown-menu";
import { DotsThree, X } from "@phosphor-icons/react";
import type { BulkAction } from "../types";

// ============================================
// BulkActionsToolbar
// ============================================

export interface BulkActionsToolbarProps<T> {
  /** Number of selected rows */
  selectedCount: number;
  /** Total number of rows */
  totalCount: number;
  /** Available bulk actions */
  actions: BulkAction<T>[];
  /** Selected row objects */
  selectedRows: T[];
  /** Callback to clear selection */
  onClearSelection: () => void;
  /** Callback to select all rows */
  onSelectAll: () => void;
  /** Whether all rows are selected */
  allSelected: boolean;
  /** Additional className */
  className?: string;
}

export function BulkActionsToolbar<T>({
  selectedCount,
  totalCount,
  actions,
  selectedRows,
  onClearSelection,
  onSelectAll,
  allSelected,
  className,
}: BulkActionsToolbarProps<T>) {
  const toolbarActions = actions.filter((a) => a.showInToolbar !== false);
  const overflowActions = actions.filter((a) => a.showInToolbar === false);

  if (selectedCount === 0) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-4 px-4 py-3",
        "bg-[var(--background-brand-subtle)] border border-[var(--border-brand)] rounded-lg",
        "animate-in fade-in slide-in-from-top-2 duration-200",
        className
      )}
    >
      {/* Selection info */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-[var(--foreground-brand)]">
          {selectedCount} selected
        </span>
        {selectedCount < totalCount && !allSelected && (
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

      {/* Divider */}
      <div className="h-4 w-px bg-[var(--border-brand)]" />

      {/* Primary actions */}
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
            {action.shortcut && (
              <kbd className="ml-1 text-xs opacity-60">{action.shortcut}</kbd>
            )}
          </Button>
        ))}

        {/* Overflow menu */}
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
                  className={cn(
                    action.variant === "destructive" && "text-[var(--foreground-error)]"
                  )}
                >
                  {action.icon && <span className="mr-2">{action.icon}</span>}
                  {action.label}
                  {action.shortcut && (
                    <span className="ml-auto text-xs opacity-60">{action.shortcut}</span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Clear selection */}
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
// Compact variant for smaller spaces
// ============================================

export interface CompactBulkActionsProps<T> {
  /** Number of selected rows */
  selectedCount: number;
  /** Available bulk actions */
  actions: BulkAction<T>[];
  /** Selected row objects */
  selectedRows: T[];
  /** Callback to clear selection */
  onClearSelection: () => void;
  /** Additional className */
  className?: string;
}

export function CompactBulkActions<T>({
  selectedCount,
  actions,
  selectedRows,
  onClearSelection,
  className,
}: CompactBulkActionsProps<T>) {
  if (selectedCount === 0) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2",
        "bg-[var(--background-brand-subtle)] rounded-md",
        className
      )}
    >
      <span className="text-xs font-medium text-[var(--foreground-brand)]">
        {selectedCount} selected
      </span>

      <div className="flex items-center gap-1">
        {actions.slice(0, 3).map((action) => (
          <Button
            key={action.id}
            variant="ghost"
            size="sm"
            onClick={() => action.onAction(selectedRows)}
            className="h-7 px-2"
          >
            {action.icon}
          </Button>
        ))}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearSelection}
        className="h-7 px-2 ml-auto"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}
