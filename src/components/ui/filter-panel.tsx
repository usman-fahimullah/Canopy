"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Badge } from "./badge";
import { Checkbox } from "./checkbox";
import { Label } from "./label";
import { Input } from "./input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "./sheet";
import {
  FunnelSimple,
  X,
  CaretDown,
  CaretUp,
  MagnifyingGlass,
  Trash,
} from "@phosphor-icons/react";

/* ============================================
   Filter Panel Types
   ============================================ */
export type FilterType =
  | "checkbox"
  | "radio"
  | "range"
  | "search"
  | "date-range"
  | "custom";

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

export interface FilterConfig {
  id: string;
  label: string;
  type: FilterType;
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  defaultExpanded?: boolean;
  /** Custom render function for special filter types */
  render?: (
    value: FilterValue,
    onChange: (value: FilterValue) => void
  ) => React.ReactNode;
}

export type FilterValue =
  | string[]
  | string
  | number[]
  | { min?: number; max?: number }
  | { start?: Date; end?: Date }
  | undefined;

export interface FilterState {
  [filterId: string]: FilterValue;
}

export interface FilterPanelProps {
  filters: FilterConfig[];
  value: FilterState;
  onChange: (value: FilterState) => void;
  onReset?: () => void;
  className?: string;
  /** Variant: inline or sidebar */
  variant?: "inline" | "sidebar" | "sheet";
  /** Show active filter count */
  showActiveCount?: boolean;
  /** Collapsible filter groups */
  collapsible?: boolean;
}

/* ============================================
   Helper Functions
   ============================================ */
const countActiveFilters = (filters: FilterConfig[], state: FilterState): number => {
  return filters.reduce((count, filter) => {
    const value = state[filter.id];
    if (!value) return count;
    if (Array.isArray(value) && value.length === 0) return count;
    if (typeof value === "object") {
      const obj = value as Record<string, unknown>;
      if (Object.values(obj).every((v) => v === undefined)) return count;
    }
    return count + 1;
  }, 0);
};

const getActiveFilterLabels = (
  filters: FilterConfig[],
  state: FilterState
): { filterId: string; label: string; value: string }[] => {
  const labels: { filterId: string; label: string; value: string }[] = [];

  filters.forEach((filter) => {
    const value = state[filter.id];
    if (!value) return;

    if (filter.type === "checkbox" && Array.isArray(value)) {
      value.forEach((v) => {
        const option = filter.options?.find((opt) => opt.value === v);
        if (option) {
          labels.push({
            filterId: filter.id,
            label: filter.label,
            value: option.label,
          });
        }
      });
    } else if (filter.type === "range" && typeof value === "object" && "min" in value) {
      const rangeValue = value as { min?: number; max?: number };
      if (rangeValue.min !== undefined || rangeValue.max !== undefined) {
        labels.push({
          filterId: filter.id,
          label: filter.label,
          value: `${rangeValue.min ?? filter.min ?? 0} - ${rangeValue.max ?? filter.max ?? 100}`,
        });
      }
    } else if (filter.type === "search" && typeof value === "string" && value) {
      labels.push({
        filterId: filter.id,
        label: filter.label,
        value: value,
      });
    }
  });

  return labels;
};

/* ============================================
   Filter Group Component
   ============================================ */
interface FilterGroupProps {
  filter: FilterConfig;
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  collapsible?: boolean;
}

const FilterGroup: React.FC<FilterGroupProps> = ({
  filter,
  value,
  onChange,
  collapsible = true,
}) => {
  const [isOpen, setIsOpen] = React.useState(filter.defaultExpanded ?? true);
  const [searchQuery, setSearchQuery] = React.useState("");

  const content = React.useMemo(() => {
    switch (filter.type) {
      case "checkbox": {
        const selectedValues = (value as string[]) || [];
        const filteredOptions = filter.options?.filter((opt) =>
          opt.label.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
          <div className="space-y-2">
            {filter.options && filter.options.length > 5 && (
              <div className="group relative mb-3">
                <MagnifyingGlass className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted transition-colors duration-fast group-focus-within:text-foreground-brand" />
                <Input
                  placeholder={`Search ${filter.label.toLowerCase()}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 text-sm transition-all duration-fast focus:ring-2 focus:ring-ring-brand"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-foreground-muted hover:text-foreground-error hover:bg-foreground-error/10 transition-all duration-fast animate-fade-in"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            )}
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {filteredOptions?.map((option, index) => (
                <label
                  key={option.value}
                  className={cn(
                    "group flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer",
                    "hover:bg-background-muted transition-all duration-fast",
                    "animate-fade-in",
                    option.disabled && "opacity-50 cursor-not-allowed"
                  )}
                  style={{ animationDelay: `${index * 20}ms` }}
                >
                  <Checkbox
                    checked={selectedValues.includes(option.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onChange([...selectedValues, option.value]);
                      } else {
                        onChange(selectedValues.filter((v) => v !== option.value));
                      }
                    }}
                    disabled={option.disabled}
                    className="transition-transform duration-fast group-hover:scale-105"
                  />
                  <span className="flex-1 text-sm transition-colors duration-fast group-hover:text-foreground-default">{option.label}</span>
                  {option.count !== undefined && (
                    <span className="text-xs text-foreground-muted tabular-nums transition-colors duration-fast group-hover:text-foreground-subtle">
                      {option.count}
                    </span>
                  )}
                </label>
              ))}
              {filteredOptions?.length === 0 && (
                <div className="py-4 text-center animate-fade-in">
                  <div className="h-8 w-8 rounded-full bg-background-muted flex items-center justify-center mx-auto mb-2">
                    <MagnifyingGlass className="h-4 w-4 text-foreground-muted" />
                  </div>
                  <p className="text-sm text-foreground-muted">No options found</p>
                </div>
              )}
            </div>
          </div>
        );
      }

      case "range": {
        const rangeValue = (value as { min?: number; max?: number }) || {};
        const min = filter.min ?? 0;
        const max = filter.max ?? 100;

        return (
          <div className="space-y-3 px-2">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Label className="text-caption text-foreground-muted mb-1 block">Min</Label>
                <Input
                  type="number"
                  value={rangeValue.min ?? ""}
                  placeholder={String(min)}
                  onChange={(e) =>
                    onChange({ ...rangeValue, min: e.target.value ? Number(e.target.value) : undefined })
                  }
                  min={min}
                  max={rangeValue.max ?? max}
                  className="h-8 text-sm"
                />
              </div>
              <span className="text-foreground-muted pt-5">—</span>
              <div className="flex-1">
                <Label className="text-caption text-foreground-muted mb-1 block">Max</Label>
                <Input
                  type="number"
                  value={rangeValue.max ?? ""}
                  placeholder={String(max)}
                  onChange={(e) =>
                    onChange({ ...rangeValue, max: e.target.value ? Number(e.target.value) : undefined })
                  }
                  min={rangeValue.min ?? min}
                  max={max}
                  className="h-8 text-sm"
                />
              </div>
            </div>
          </div>
        );
      }

      case "search": {
        const searchValue = (value as string) || "";
        return (
          <div className="relative">
            <MagnifyingGlass className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
            <Input
              placeholder={filter.placeholder ?? `Search...`}
              value={searchValue}
              onChange={(e) => onChange(e.target.value)}
              className="pl-8"
            />
          </div>
        );
      }

      case "custom": {
        return filter.render?.(value, onChange) ?? null;
      }

      default:
        return null;
    }
  }, [filter, value, onChange, searchQuery]);

  if (collapsible) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="group flex w-full items-center justify-between py-2 px-1 text-sm font-medium hover:bg-background-muted rounded-md transition-all duration-fast">
          <span className="transition-colors duration-fast group-hover:text-foreground-brand">{filter.label}</span>
          <CaretDown className={cn(
            "h-4 w-4 text-foreground-muted transition-transform duration-fast",
            "group-hover:text-foreground-brand",
            isOpen && "-rotate-180"
          )} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 pb-4 animate-accordion-down data-[state=closed]:animate-accordion-up">{content}</CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <div className="py-2">
      <Label className="text-sm font-medium mb-2 block">{filter.label}</Label>
      {content}
    </div>
  );
};

/* ============================================
   Active Filters Bar
   ============================================ */
interface ActiveFiltersBarProps {
  filters: FilterConfig[];
  value: FilterState;
  onChange: (value: FilterState) => void;
  onReset?: () => void;
}

const ActiveFiltersBar: React.FC<ActiveFiltersBarProps> = ({
  filters,
  value,
  onChange,
  onReset,
}) => {
  const activeLabels = getActiveFilterLabels(filters, value);

  if (activeLabels.length === 0) return null;

  const removeFilter = (filterId: string, filterValue: string) => {
    const filter = filters.find((f) => f.id === filterId);
    if (!filter) return;

    const currentValue = value[filterId];

    if (filter.type === "checkbox" && Array.isArray(currentValue)) {
      const option = filter.options?.find((opt) => opt.label === filterValue);
      if (option) {
        const newValue = (currentValue as string[]).filter((v) => v !== option.value);
        const newState: FilterState = { ...value };
        if (newValue.length > 0) {
          newState[filterId] = newValue;
        } else {
          delete newState[filterId];
        }
        onChange(newState);
      }
    } else {
      const newState: FilterState = { ...value };
      delete newState[filterId];
      onChange(newState);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 py-2 animate-fade-in">
      <span className="text-sm text-foreground-muted">Active filters:</span>
      {activeLabels.map((label, index) => (
        <Badge
          key={`${label.filterId}-${label.value}-${index}`}
          variant="secondary"
          className={cn(
            "gap-1 pr-1 animate-scale-in",
            "transition-all duration-fast hover:scale-105"
          )}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <span className="text-foreground-muted">{label.label}:</span>
          {label.value}
          <button
            type="button"
            onClick={() => removeFilter(label.filterId, label.value)}
            className={cn(
              "rounded-full p-0.5 ml-0.5",
              "hover:bg-foreground-error/10 hover:text-foreground-error",
              "transition-all duration-fast hover:scale-110 active:scale-95"
            )}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      {activeLabels.length > 1 && onReset && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-6 px-2 text-foreground-error hover:text-foreground-error hover:bg-foreground-error/10 transition-all duration-fast"
        >
          <Trash className="h-3 w-3 mr-1" />
          Clear all
        </Button>
      )}
    </div>
  );
};

/* ============================================
   Filter Panel (Inline variant)
   ============================================ */
const FilterPanelInline = React.forwardRef<HTMLDivElement, FilterPanelProps>(
  (
    {
      filters,
      value,
      onChange,
      onReset,
      className,
      showActiveCount = true,
      collapsible = true,
    },
    ref
  ) => {
    const activeCount = countActiveFilters(filters, value);

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-border-muted bg-surface-default p-4",
          className
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FunnelSimple className="h-5 w-5 text-foreground-muted" />
            <h3 className="font-medium">Filters</h3>
            {showActiveCount && activeCount > 0 && (
              <Badge variant="default" size="sm">
                {activeCount}
              </Badge>
            )}
          </div>
          {onReset && activeCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onReset}>
              <Trash className="h-4 w-4 mr-1" />
              Reset
            </Button>
          )}
        </div>

        <div className="space-y-1 divide-y divide-border-muted">
          {filters.map((filter) => (
            <FilterGroup
              key={filter.id}
              filter={filter}
              value={value[filter.id]}
              onChange={(newValue) =>
                onChange({ ...value, [filter.id]: newValue })
              }
              collapsible={collapsible}
            />
          ))}
        </div>
      </div>
    );
  }
);
FilterPanelInline.displayName = "FilterPanelInline";

/* ============================================
   Filter Panel (Sheet variant for mobile)
   ============================================ */
interface FilterPanelSheetProps extends FilterPanelProps {
  trigger?: React.ReactNode;
}

const FilterPanelSheet: React.FC<FilterPanelSheetProps> = ({
  filters,
  value,
  onChange,
  onReset,
  showActiveCount = true,
  collapsible = true,
  trigger,
}) => {
  const [open, setOpen] = React.useState(false);
  const activeCount = countActiveFilters(filters, value);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger ?? (
          <Button variant="outline" className="gap-2">
            <FunnelSimple className="h-4 w-4" />
            Filters
            {showActiveCount && activeCount > 0 && (
              <Badge variant="default" size="sm">
                {activeCount}
              </Badge>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <FunnelSimple className="h-5 w-5" />
            Filters
            {activeCount > 0 && (
              <Badge variant="default" size="sm">
                {activeCount}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>
        <div className="py-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
          <div className="space-y-1 divide-y divide-border-muted">
            {filters.map((filter) => (
              <FilterGroup
                key={filter.id}
                filter={filter}
                value={value[filter.id]}
                onChange={(newValue) =>
                  onChange({ ...value, [filter.id]: newValue })
                }
                collapsible={collapsible}
              />
            ))}
          </div>
        </div>
        <SheetFooter className="gap-2">
          {onReset && (
            <Button variant="outline" onClick={onReset} className="flex-1">
              Reset
            </Button>
          )}
          <Button onClick={() => setOpen(false)} className="flex-1">
            Apply
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

/* ============================================
   Main Filter Panel Export
   ============================================ */
const FilterPanel = React.forwardRef<HTMLDivElement, FilterPanelProps>(
  ({ variant = "inline", ...props }, ref) => {
    if (variant === "sheet") {
      return <FilterPanelSheet {...props} />;
    }

    return <FilterPanelInline ref={ref} {...props} />;
  }
);
FilterPanel.displayName = "FilterPanel";

/* ============================================
   Pre-built ATS Filter Configurations
   ============================================ */
const atsFilterConfigs = {
  stage: (stages: FilterOption[]): FilterConfig => ({
    id: "stage",
    label: "Pipeline Stage",
    type: "checkbox",
    options: stages,
    defaultExpanded: true,
  }),

  source: (sources: FilterOption[]): FilterConfig => ({
    id: "source",
    label: "Source",
    type: "checkbox",
    options: sources,
  }),

  experience: (min = 0, max = 20): FilterConfig => ({
    id: "experience",
    label: "Years of Experience",
    type: "range",
    min,
    max,
    step: 1,
  }),

  salary: (min = 0, max = 300000, step = 5000): FilterConfig => ({
    id: "salary",
    label: "Expected Salary",
    type: "range",
    min,
    max,
    step,
  }),

  skills: (skills: FilterOption[]): FilterConfig => ({
    id: "skills",
    label: "Skills",
    type: "checkbox",
    options: skills,
  }),

  greenSkills: (skills: FilterOption[]): FilterConfig => ({
    id: "greenSkills",
    label: "Green Skills",
    type: "checkbox",
    options: skills,
  }),

  location: (locations: FilterOption[]): FilterConfig => ({
    id: "location",
    label: "Location",
    type: "checkbox",
    options: locations,
  }),

  matchScore: (): FilterConfig => ({
    id: "matchScore",
    label: "Match Score",
    type: "range",
    min: 0,
    max: 100,
    step: 5,
  }),

  rating: (): FilterConfig => ({
    id: "rating",
    label: "Team Rating",
    type: "checkbox",
    options: [
      { value: "5", label: "5 stars" },
      { value: "4", label: "4+ stars" },
      { value: "3", label: "3+ stars" },
      { value: "2", label: "2+ stars" },
      { value: "1", label: "1+ stars" },
    ],
  }),

  candidateSearch: (): FilterConfig => ({
    id: "search",
    label: "Search",
    type: "search",
    placeholder: "Search by name or email...",
    defaultExpanded: true,
  }),
};

/* ============================================
   Exports
   ============================================ */
export {
  FilterPanel,
  FilterPanelInline,
  FilterPanelSheet,
  FilterGroup,
  ActiveFiltersBar,
  atsFilterConfigs,
  countActiveFilters,
  getActiveFilterLabels,
};
