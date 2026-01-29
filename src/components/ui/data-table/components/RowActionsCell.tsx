"use client";

/**
 * RowActionsCell Component
 *
 * Displays row-level actions as inline buttons or dropdown menu.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../tooltip";
import { DotsThree } from "@phosphor-icons/react";
import type { RowAction } from "../types";

// ============================================
// RowActionsCell
// ============================================

export interface RowActionsCellProps<T> {
  /** The row data */
  row: T;
  /** Available row actions */
  actions: RowAction<T>[];
  /** Maximum actions to show inline before overflow */
  maxInline?: number;
  /** Additional className */
  className?: string;
}

export function RowActionsCell<T>({
  row,
  actions,
  maxInline = 2,
  className,
}: RowActionsCellProps<T>) {
  const visibleActions = actions.filter((action) => !action.hidden?.(row));

  if (visibleActions.length === 0) return null;

  // Show inline buttons if few actions
  if (visibleActions.length <= maxInline) {
    return (
      <div className={cn("flex items-center gap-1", className)}>
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
                    "p-1.5 rounded-md transition-colors",
                    "hover:bg-[var(--background-interactive-hover)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)]",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
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

  // Show dropdown menu for many actions
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "p-1.5 rounded-md transition-colors",
            "hover:bg-[var(--background-interactive-hover)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)]",
            className
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
            className={cn(
              action.variant === "destructive" && "text-[var(--foreground-error)]"
            )}
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
// QuickActionsRow - Inline action buttons
// ============================================

export interface QuickActionsRowProps<T> {
  /** The row data */
  row: T;
  /** Actions to display */
  actions: RowAction<T>[];
  /** Additional className */
  className?: string;
}

export function QuickActionsRow<T>({
  row,
  actions,
  className,
}: QuickActionsRowProps<T>) {
  const visibleActions = actions.filter((action) => !action.hidden?.(row));

  return (
    <div
      className={cn(
        "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
        className
      )}
    >
      {visibleActions.map((action) => (
        <button
          key={action.id}
          onClick={(e) => {
            e.stopPropagation();
            action.onAction(row);
          }}
          disabled={action.disabled?.(row)}
          className={cn(
            "p-1 rounded transition-colors",
            "hover:bg-[var(--background-interactive-hover)]",
            "disabled:opacity-50",
            action.variant === "destructive" && "text-[var(--foreground-error)]"
          )}
          title={action.label}
        >
          {action.icon}
        </button>
      ))}
    </div>
  );
}
