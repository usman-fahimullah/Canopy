"use client";

/**
 * ColumnVisibilityMenu Component
 *
 * Dropdown menu for toggling column visibility.
 */

import * as React from "react";
import { Button } from "../../button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../dropdown-menu";
import { Columns } from "@phosphor-icons/react";
import type { Column } from "../types";

// ============================================
// ColumnVisibilityMenu
// ============================================

export interface ColumnVisibilityMenuProps<T> {
  /** All available columns */
  columns: Column<T>[];
  /** Set of visible column IDs */
  visibleColumns: Set<string>;
  /** Callback when a column is toggled */
  onToggleColumn: (columnId: string) => void;
  /** Callback to reset to default visibility */
  onResetColumns: () => void;
  /** Button variant */
  buttonVariant?: "outline" | "ghost" | "secondary";
  /** Button size */
  buttonSize?: "sm" | "default" | "lg";
  /** Show label on button */
  showLabel?: boolean;
}

export function ColumnVisibilityMenu<T>({
  columns,
  visibleColumns,
  onToggleColumn,
  onResetColumns,
  buttonVariant = "outline",
  buttonSize = "sm",
  showLabel = true,
}: ColumnVisibilityMenuProps<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={buttonVariant} size={buttonSize} className="gap-1.5">
          <Columns className="h-4 w-4" />
          {showLabel && "Columns"}
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
        <DropdownMenuItem onClick={onResetColumns}>
          Reset to default
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
