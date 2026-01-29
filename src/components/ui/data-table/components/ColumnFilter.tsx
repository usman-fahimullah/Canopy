"use client";

/**
 * Column Filter Components
 *
 * Filter UI for individual columns and active filter display.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../../button";
import { Input } from "../../input";
import { Checkbox } from "../../checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../dropdown";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../popover";
import { Funnel, X } from "@phosphor-icons/react";
import type { Column, ColumnFilterValue, ColumnFilterType, ActiveFilter } from "../types";

// ============================================
// ColumnFilterPopover
// ============================================

export interface ColumnFilterPopoverProps<T> {
  /** Column configuration */
  column: Column<T>;
  /** Current filter value */
  value: ColumnFilterValue;
  /** Callback when filter changes */
  onChange: (value: ColumnFilterValue) => void;
  /** Data for auto-detecting options */
  data?: T[];
  /** Additional className */
  className?: string;
}

export function ColumnFilterPopover<T>({
  column,
  value,
  onChange,
  data = [],
  className,
}: ColumnFilterPopoverProps<T>) {
  const [localValue, setLocalValue] = React.useState<ColumnFilterValue>(value);
  const [isOpen, setIsOpen] = React.useState(false);

  const filterConfig = column.filterConfig;
  const filterType = filterConfig?.type || "text";

  // Auto-detect options for select filter if not provided
  const selectOptions = React.useMemo((): { label: string; value: string; icon?: React.ReactNode }[] => {
    if (filterConfig?.options) return filterConfig.options;
    if (filterType !== "select" || !column.accessorKey) return [];

    const uniqueValues = new Set<string>();
    data.forEach((row) => {
      const val = row[column.accessorKey as keyof T];
      if (val !== null && val !== undefined) {
        uniqueValues.add(String(val));
      }
    });
    return Array.from(uniqueValues)
      .sort()
      .map((v) => ({ label: v, value: v }));
  }, [data, column.accessorKey, filterConfig?.options, filterType]);

  // Sync local value with external value
  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleApply = () => {
    onChange(localValue);
    setIsOpen(false);
  };

  const handleClear = () => {
    setLocalValue(null);
    onChange(null);
    setIsOpen(false);
  };

  const hasValue = value !== null && value !== undefined;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "p-1 rounded transition-colors",
            "hover:bg-[var(--background-interactive-hover)]",
            hasValue && "text-[var(--foreground-brand)]",
            className
          )}
          aria-label={`Filter by ${column.header}`}
        >
          <Funnel
            className="h-3.5 w-3.5"
            weight={hasValue ? "fill" : "regular"}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <div className="space-y-3">
          <div className="text-sm font-medium text-[var(--foreground-default)]">
            Filter: {column.header}
          </div>

          {/* Text filter */}
          {filterType === "text" && (
            <Input
              type="text"
              placeholder={filterConfig?.placeholder || "Enter value..."}
              value={(localValue as string) || ""}
              onChange={(e) => setLocalValue(e.target.value || null)}
              className="h-8"
            />
          )}

          {/* Select filter */}
          {filterType === "select" && (
            <Select
              value={(localValue as string) || ""}
              onValueChange={(val) => setLocalValue(val || null)}
            >
              <SelectTrigger className="h-8">
                <SelectValue
                  placeholder={filterConfig?.placeholder || "Select..."}
                />
              </SelectTrigger>
              <SelectContent>
                {selectOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <span className="flex items-center gap-2">
                      {option.icon}
                      {option.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Multi-select filter */}
          {filterType === "multiSelect" && (
            <div className="max-h-48 overflow-y-auto space-y-1">
              {selectOptions.map((option) => {
                const selectedValues = (localValue as string[]) || [];
                const isChecked = selectedValues.includes(option.value);

                return (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[var(--background-interactive-hover)] cursor-pointer"
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setLocalValue([...selectedValues, option.value]);
                        } else {
                          setLocalValue(
                            selectedValues.filter((v) => v !== option.value)
                          );
                        }
                      }}
                    />
                    <span className="flex items-center gap-2 text-sm">
                      {option.icon}
                      {option.label}
                    </span>
                  </label>
                );
              })}
            </div>
          )}

          {/* Number range filter */}
          {filterType === "number" && (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={
                  typeof localValue === "object" &&
                  localValue !== null &&
                  "min" in localValue
                    ? (localValue.min ?? "")
                    : ""
                }
                onChange={(e) => {
                  const min = e.target.value ? Number(e.target.value) : undefined;
                  setLocalValue((prev) => {
                    const prevObj =
                      typeof prev === "object" && prev !== null && "min" in prev
                        ? prev
                        : {};
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
                  typeof localValue === "object" &&
                  localValue !== null &&
                  "max" in localValue
                    ? (localValue.max ?? "")
                    : ""
                }
                onChange={(e) => {
                  const max = e.target.value ? Number(e.target.value) : undefined;
                  setLocalValue((prev) => {
                    const prevObj =
                      typeof prev === "object" && prev !== null && "max" in prev
                        ? prev
                        : {};
                    return { ...prevObj, max };
                  });
                }}
                className="h-8"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-[var(--border-muted)]">
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
// FilterChip
// ============================================

export interface FilterChipProps {
  /** The active filter */
  filter: ActiveFilter;
  /** Callback to remove this filter */
  onRemove: () => void;
  /** Additional className */
  className?: string;
}

export function FilterChip({ filter, onRemove, className }: FilterChipProps) {
  const getDisplayValue = () => {
    if (filter.value === null) return "";
    if (typeof filter.value === "string") return filter.value;
    if (typeof filter.value === "number") return String(filter.value);
    if (Array.isArray(filter.value)) return filter.value.join(", ");
    if ("min" in filter.value || "max" in filter.value) {
      const { min, max } = filter.value as { min?: number; max?: number };
      if (min !== undefined && max !== undefined) return `${min} - ${max}`;
      if (min !== undefined) return `≥ ${min}`;
      if (max !== undefined) return `≤ ${max}`;
    }
    return "";
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1",
        "bg-[var(--background-brand-subtle)] text-[var(--foreground-brand)]",
        "rounded-full text-caption",
        className
      )}
    >
      <span className="font-medium">{filter.columnHeader}:</span>
      <span>{getDisplayValue()}</span>
      <button
        onClick={onRemove}
        className="ml-0.5 p-0.5 rounded-full hover:bg-[var(--background-brand-muted)] transition-colors"
        aria-label={`Remove ${filter.columnHeader} filter`}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

// ============================================
// ActiveFiltersDisplay
// ============================================

export interface ActiveFiltersDisplayProps {
  /** Active filters to display */
  filters: ActiveFilter[];
  /** Callback to remove a filter */
  onRemoveFilter: (columnId: string) => void;
  /** Callback to clear all filters */
  onClearAll: () => void;
  /** Additional className */
  className?: string;
}

export function ActiveFiltersDisplay({
  filters,
  onRemoveFilter,
  onClearAll,
  className,
}: ActiveFiltersDisplayProps) {
  if (filters.length === 0) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 p-3",
        "bg-[var(--background-subtle)] rounded-lg border border-[var(--border-muted)]",
        className
      )}
    >
      <span className="text-caption text-[var(--foreground-muted)] mr-1">
        Filters:
      </span>
      {filters.map((filter) => (
        <FilterChip
          key={filter.columnId}
          filter={filter}
          onRemove={() => onRemoveFilter(filter.columnId)}
        />
      ))}
      <button
        onClick={onClearAll}
        className="text-caption text-[var(--foreground-muted)] hover:text-[var(--foreground-default)] ml-2 underline underline-offset-2"
      >
        Clear all
      </button>
    </div>
  );
}
