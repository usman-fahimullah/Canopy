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
  List,
  Kanban as KanbanIcon,
  CalendarBlank,
  Table as TableIcon,
  Faders,
  Plus,
  FloppyDisk,
  ArrowClockwise,
  CaretLeft,
  CaretDoubleLeft,
  CaretDoubleRight,
  SortAscending,
  SortDescending,
  Bookmark,
  BookmarkSimple,
  Lightning,
  User,
  Buildings,
  MapPin,
  Calendar,
  Star,
  Clock,
  Warning,
  CheckCircle,
  XCircle,
  MinusCircle,
  Trash,
  PencilSimple,
  Copy,
  Link,
} from "@phosphor-icons/react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./sheet";
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
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "./dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

// ============================================
// Types & Interfaces
// ============================================

export type ViewType = "table" | "kanban" | "calendar" | "cards";
export type TableDensity = "compact" | "default" | "comfortable";
export type ColumnFilterType = "text" | "select" | "number" | "date" | "dateRange" | "multiSelect";
export type FieldType =
  | "text"
  | "number"
  | "select"
  | "multiSelect"
  | "date"
  | "user"
  | "badge"
  | "link"
  | "email"
  | "phone"
  | "currency"
  | "percent"
  | "rating"
  | "checkbox"
  | "progress";

// Quick filter preset
export interface QuickFilter {
  id: string;
  label: string;
  icon?: React.ReactNode;
  filters: Record<string, ColumnFilterValue>;
  /** Sort configuration for this quick filter */
  sort?: { key: string; direction: "asc" | "desc" };
}

// Saved view configuration
export interface SavedView {
  id: string;
  name: string;
  icon?: React.ReactNode;
  /** Is this the default view? */
  isDefault?: boolean;
  /** Column visibility */
  visibleColumns: string[];
  /** Column order */
  columnOrder: string[];
  /** Column widths */
  columnWidths: Record<string, number>;
  /** Active filters */
  filters: Record<string, ColumnFilterValue>;
  /** Sort configuration */
  sort?: { key: string; direction: "asc" | "desc" };
  /** Group by column */
  groupBy?: string;
  /** View type */
  viewType: ViewType;
}

export interface ColumnFilterConfig {
  type: ColumnFilterType;
  options?: { label: string; value: string; icon?: React.ReactNode; color?: string }[];
  placeholder?: string;
}

export interface EditableCellConfig {
  type: FieldType;
  options?: { label: string; value: string; icon?: React.ReactNode; color?: string }[];
  placeholder?: string;
  validate?: (value: unknown) => string | undefined;
}

export type ColumnFilterValue =
  | string
  | number
  | string[]
  | { min?: number; max?: number }
  | { start?: Date; end?: Date }
  | null;

export interface Column<T> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  accessorFn?: (row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  filterConfig?: ColumnFilterConfig;
  cell?: (row: T) => React.ReactNode;
  className?: string;
  width?: string;
  minWidth?: string;
  sticky?: boolean;
  pinned?: "left" | "right";
  defaultVisible?: boolean;
  editable?: boolean;
  editConfig?: EditableCellConfig;
  resizable?: boolean;
  /** Field type for automatic formatting */
  fieldType?: FieldType;
  /** Aggregation function for grouped data */
  aggregate?: "sum" | "count" | "avg" | "min" | "max";
}

export interface BulkAction<T> {
  id: string;
  label: string;
  icon?: React.ReactNode;
  /** Loading icon to show when action is in progress */
  loadingIcon?: React.ReactNode;
  onAction: (selectedRows: T[]) => void | Promise<void>;
  variant?: "default" | "destructive";
  showInToolbar?: boolean;
  /** Keyboard shortcut */
  shortcut?: string;
}

export interface RowAction<T> {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onAction: (row: T) => void;
  variant?: "default" | "destructive";
  hidden?: (row: T) => boolean;
  disabled?: (row: T) => boolean;
  shortcut?: string;
}

export interface ActiveFilter {
  columnId: string;
  columnHeader: string;
  value: ColumnFilterValue;
  type: ColumnFilterType;
}

// ============================================
// View Switcher Component
// ============================================

interface ViewSwitcherProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  availableViews?: ViewType[];
}

const ViewSwitcher = React.memo(function ViewSwitcher({
  currentView,
  onViewChange,
  availableViews = ["table", "kanban", "cards"],
}: ViewSwitcherProps) {
  const viewIcons: Record<ViewType, React.ReactNode> = {
    table: <TableIcon className="h-4 w-4" weight="regular" />,
    kanban: <KanbanIcon className="h-4 w-4" weight="regular" />,
    calendar: <CalendarBlank className="h-4 w-4" weight="regular" />,
    cards: <List className="h-4 w-4" weight="regular" />,
  };

  const viewLabels: Record<ViewType, string> = {
    table: "Table view",
    kanban: "Board view",
    calendar: "Calendar view",
    cards: "Cards view",
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center gap-0.5" role="tablist" aria-label="View options">
        {availableViews.map((view) => (
          <Tooltip key={view}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onViewChange(view)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-md",
                  "transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-interactive-focus)] focus-visible:ring-offset-1",
                  currentView === view
                    ? "bg-[var(--background-subtle)] text-[var(--foreground-default)]"
                    : "hover:bg-[var(--background-interactive-hover)]/50 text-[var(--foreground-muted)] hover:text-[var(--foreground-default)]"
                )}
                aria-selected={currentView === view}
                aria-label={viewLabels[view]}
                role="tab"
              >
                {viewIcons[view]}
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={4}>
              {viewLabels[view]}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
});

// ============================================
// Quick Filters Bar
// ============================================

interface QuickFiltersBarProps {
  filters: QuickFilter[];
  activeFilterId: string | null;
  onFilterSelect: (filterId: string | null) => void;
  onSaveCurrentFilter?: () => void;
}

const QuickFiltersBar = React.memo(function QuickFiltersBar({
  filters,
  activeFilterId,
  onFilterSelect,
  onSaveCurrentFilter,
}: QuickFiltersBarProps) {
  return (
    <div
      className="scrollbar-thin flex items-center gap-1 overflow-x-auto"
      role="tablist"
      aria-label="Quick filters"
    >
      <button
        onClick={() => onFilterSelect(null)}
        className={cn(
          "relative flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium",
          "transition-all duration-150 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-interactive-focus)] focus-visible:ring-offset-1",
          activeFilterId === null
            ? "border border-[var(--border-default)] bg-[var(--background-subtle)] text-[var(--foreground-default)]"
            : "hover:bg-[var(--background-interactive-hover)]/50 text-[var(--foreground-muted)] hover:text-[var(--foreground-default)]"
        )}
        aria-selected={activeFilterId === null}
        role="tab"
      >
        All
      </button>

      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterSelect(filter.id)}
          className={cn(
            "relative flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium",
            "transition-all duration-150 ease-out",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-interactive-focus)] focus-visible:ring-offset-1",
            activeFilterId === filter.id
              ? "border border-[var(--border-default)] bg-[var(--background-subtle)] text-[var(--foreground-default)]"
              : "hover:bg-[var(--background-interactive-hover)]/50 text-[var(--foreground-muted)] hover:text-[var(--foreground-default)]"
          )}
          aria-selected={activeFilterId === filter.id}
          role="tab"
        >
          {filter.icon && <span aria-hidden="true">{filter.icon}</span>}
          {filter.label}
        </button>
      ))}

      {onSaveCurrentFilter && (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onSaveCurrentFilter}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg",
                  "text-[var(--foreground-muted)] hover:text-[var(--foreground-brand)]",
                  "hover:bg-[var(--background-brand-subtle)]",
                  "transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-interactive-focus)]"
                )}
                aria-label="Save current filter"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </button>
            </TooltipTrigger>
            <TooltipContent sideOffset={8}>Save current filter</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
});

// ============================================
// Saved Views Dropdown
// ============================================

interface SavedViewsDropdownProps {
  views: SavedView[];
  currentViewId: string | null;
  onViewSelect: (viewId: string) => void;
  onSaveView?: (name: string) => void;
  onDeleteView?: (viewId: string) => void;
  onSetDefault?: (viewId: string) => void;
}

const SavedViewsDropdown = React.memo(function SavedViewsDropdown({
  views,
  currentViewId,
  onViewSelect,
  onSaveView,
  onDeleteView,
  onSetDefault,
}: SavedViewsDropdownProps) {
  const [isCreating, setIsCreating] = React.useState(false);
  const [newViewName, setNewViewName] = React.useState("");

  const handleSave = () => {
    if (newViewName.trim() && onSaveView) {
      onSaveView(newViewName.trim());
      setNewViewName("");
      setIsCreating(false);
    }
  };

  const currentView = views.find((v) => v.id === currentViewId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-2">
          <BookmarkSimple className="h-4 w-4" aria-hidden="true" />
          <span className="hidden max-w-[100px] truncate sm:inline">
            {currentView?.name || "Views"}
          </span>
          <ChevronRight className="h-3 w-3 rotate-90 opacity-50" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-60">
        <DropdownMenuLabel className="font-normal text-[var(--foreground-muted)]">
          Saved Views
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {views.length === 0 ? (
          <div className="px-3 py-6 text-center">
            <BookmarkSimple className="mx-auto mb-2 h-8 w-8 text-[var(--foreground-muted)] opacity-50" />
            <p className="text-sm text-[var(--foreground-muted)]">No saved views yet</p>
            <p className="mt-1 text-xs text-[var(--foreground-muted)] opacity-70">
              Save your current configuration as a view
            </p>
          </div>
        ) : (
          <div className="max-h-[200px] overflow-y-auto">
            {views.map((view) => (
              <DropdownMenuItem
                key={view.id}
                onClick={() => onViewSelect(view.id)}
                className="flex items-center justify-between py-2.5"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="text-[var(--foreground-muted)]">
                    {view.icon || <Bookmark className="h-4 w-4" />}
                  </span>
                  <span className="truncate">{view.name}</span>
                  {view.isDefault && (
                    <Badge variant="secondary" className="shrink-0 px-1.5 py-0 text-[10px]">
                      Default
                    </Badge>
                  )}
                </div>
                {currentViewId === view.id && (
                  <Check
                    className="ml-2 h-4 w-4 shrink-0 text-[var(--foreground-brand)]"
                    aria-label="Current view"
                  />
                )}
              </DropdownMenuItem>
            ))}
          </div>
        )}

        <DropdownMenuSeparator />

        {isCreating ? (
          <div className="space-y-2 px-2 py-2">
            <Input
              value={newViewName}
              onChange={(e) => setNewViewName(e.target.value)}
              placeholder="View name..."
              className="h-8"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") {
                  setIsCreating(false);
                  setNewViewName("");
                }
              }}
            />
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="primary"
                onClick={handleSave}
                disabled={!newViewName.trim()}
                className="flex-1"
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsCreating(false);
                  setNewViewName("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <DropdownMenuItem onClick={() => setIsCreating(true)} className="gap-2">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Save current view
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

// ============================================
// Enhanced Search with Suggestions
// ============================================

interface EnhancedSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suggestions?: { type: string; label: string; value: string }[];
  onSuggestionSelect?: (suggestion: { type: string; label: string; value: string }) => void;
  isSearching?: boolean;
  size?: "sm" | "default";
}

const EnhancedSearch = React.memo(function EnhancedSearch({
  value,
  onChange,
  placeholder = "Search...",
  suggestions = [],
  onSuggestionSelect,
  isSearching = false,
  size = "default",
}: EnhancedSearchProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const blurTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const listboxId = React.useId();

  const showSuggestions = isFocused && value.length > 0 && suggestions.length > 0;

  // Reset selection when suggestions change
  React.useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions]);

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  // Keyboard shortcut to focus search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          e.preventDefault();
          onSuggestionSelect?.(suggestions[selectedIndex]);
          setSelectedIndex(-1);
        }
        break;
      case "Escape":
        setIsFocused(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleFocus = () => {
    // Clear any pending blur timeout
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    setIsFocused(true);
  };

  const handleBlur = () => {
    // Longer delay to allow clicking on suggestions
    blurTimeoutRef.current = setTimeout(() => {
      setIsFocused(false);
      setSelectedIndex(-1);
    }, 250);
  };

  const isSmall = size === "sm";

  return (
    <div className="relative">
      <div className="group relative">
        <MagnifyingGlass
          className={cn(
            "absolute top-1/2 -translate-y-1/2",
            isSmall ? "left-2.5 h-3.5 w-3.5" : "left-3 h-4 w-4",
            "text-[var(--foreground-muted)]",
            "transition-colors duration-150",
            isFocused && "text-[var(--foreground-brand)]"
          )}
          aria-hidden="true"
        />
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "transition-all duration-200",
            isSmall ? "h-8 rounded-lg pl-8 pr-8 text-sm" : "h-10 rounded-xl pl-10 pr-24",
            isFocused && "ring-2 ring-[var(--border-interactive-focus)]"
          )}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleInputKeyDown}
          role="combobox"
          aria-expanded={showSuggestions}
          aria-haspopup="listbox"
          aria-controls={showSuggestions ? listboxId : undefined}
          aria-activedescendant={
            selectedIndex >= 0 ? `${listboxId}-option-${selectedIndex}` : undefined
          }
          aria-autocomplete="list"
        />
        <div
          className={cn(
            "absolute top-1/2 flex -translate-y-1/2 items-center gap-2",
            isSmall ? "right-2" : "right-3"
          )}
        >
          {isSearching && (
            <CircleNotch
              className={cn(
                "animate-spin text-[var(--foreground-brand)]",
                isSmall ? "h-3.5 w-3.5" : "h-4 w-4"
              )}
              aria-hidden="true"
            />
          )}
          {value && !isSearching && (
            <button
              onClick={() => onChange("")}
              className={cn(
                "rounded-md",
                isSmall ? "p-0.5" : "p-1",
                "text-[var(--foreground-muted)] hover:text-[var(--foreground-default)]",
                "hover:bg-[var(--background-interactive-hover)]",
                "transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-interactive-focus)]"
              )}
              aria-label="Clear search"
            >
              <X className={isSmall ? "h-3.5 w-3.5" : "h-4 w-4"} aria-hidden="true" />
            </button>
          )}
          {!isSmall && (
            <kbd
              className={cn(
                "hidden items-center gap-0.5 sm:inline-flex",
                "px-2 py-1 font-mono text-xs",
                "text-[var(--foreground-muted)]",
                "rounded-md bg-[var(--background-subtle)]",
                "border border-[var(--border-muted)]",
                "transition-opacity duration-150",
                value && "opacity-0"
              )}
              aria-hidden="true"
            >
              <span className="text-[10px]">⌘</span>K
            </kbd>
          )}
        </div>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Search suggestions"
          className={cn(
            "absolute left-0 right-0 top-full mt-2",
            "bg-[var(--background-default)]",
            "border border-[var(--border-default)]",
            "rounded-xl shadow-xl",
            "z-50 overflow-hidden",
            "duration-150 animate-in fade-in-0 slide-in-from-top-2"
          )}
        >
          <div className="py-1">
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.type}-${suggestion.value}-${index}`}
                id={`${listboxId}-option-${index}`}
                role="option"
                aria-selected={selectedIndex === index}
                onClick={() => {
                  onSuggestionSelect?.(suggestion);
                  setIsFocused(false);
                }}
                onMouseEnter={() => setSelectedIndex(index)}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm",
                  "transition-colors duration-100",
                  "focus-visible:outline-none",
                  selectedIndex === index
                    ? "bg-[var(--background-interactive-selected)]"
                    : "hover:bg-[var(--background-interactive-hover)]"
                )}
              >
                <span className="rounded bg-[var(--background-subtle)] px-2 py-0.5 text-xs font-medium text-[var(--foreground-muted)]">
                  {suggestion.type}
                </span>
                <span className="font-medium text-[var(--foreground-default)]">
                  {suggestion.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

// ============================================
// Column Header with Enhanced Features
// ============================================

interface EnhancedTableHeadProps<T> {
  column: Column<T>;
  sortConfig: { key: string; direction: "asc" | "desc" } | null;
  onSort: (columnId: string) => void;
  filterValue: ColumnFilterValue;
  onFilterChange: (value: ColumnFilterValue) => void;
  data: T[];
  columnWidth?: number;
  onResize?: (delta: number) => void;
  onResizeEnd?: () => void;
  isReordering?: boolean;
  dragHandleProps?: Record<string, unknown>;
}

function EnhancedTableHead<T>({
  column,
  sortConfig,
  onSort,
  filterValue,
  onFilterChange,
  data,
  columnWidth,
  onResize,
  onResizeEnd,
  isReordering,
  dragHandleProps,
}: EnhancedTableHeadProps<T>) {
  const isSorted = sortConfig?.key === column.id;
  const sortDirection = isSorted ? sortConfig.direction : null;
  const hasFilter = filterValue !== null && filterValue !== undefined;

  // Auto-detect options for select filter
  const filterOptions = React.useMemo(() => {
    if (column.filterConfig?.options) return column.filterConfig.options;
    if (!column.accessorKey) return [];

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
  }, [data, column.accessorKey, column.filterConfig?.options]);

  return (
    <th
      className={cn(
        "group relative h-10 whitespace-nowrap px-4 text-left align-middle text-caption font-medium text-[var(--table-foreground-header)]",
        "border-b border-[var(--table-border)]",
        "bg-[var(--table-background-header)]",
        column.sticky && "sticky left-0 z-20",
        (column.sortable || column.filterConfig) &&
          "cursor-pointer select-none transition-colors duration-150 hover:bg-[var(--background-interactive-hover)]"
      )}
      style={{
        width: columnWidth ? `${columnWidth}px` : column.width,
        minWidth: column.minWidth,
      }}
      onClick={column.sortable ? () => onSort(column.id) : undefined}
      scope="col"
    >
      <div className="flex items-center gap-1.5">
        {isReordering && dragHandleProps && (
          <button
            {...dragHandleProps}
            className="-ml-1 cursor-grab rounded p-0.5 transition-colors hover:bg-[var(--background-interactive-hover)] active:cursor-grabbing"
          >
            <DotsSixVertical
              className="h-3.5 w-3.5 text-[var(--foreground-muted)]"
              weight="bold"
              aria-hidden="true"
            />
          </button>
        )}

        <span className="flex-1">{column.header}</span>

        {/* Chevron dropdown for sort/filter - always visible when column has sort or filter */}
        {(column.sortable || column.filterConfig) && (
          <Popover>
            <PopoverTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  "-mr-1 flex h-5 w-5 items-center justify-center rounded",
                  "transition-all duration-150",
                  "hover:bg-[var(--background-interactive-hover)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-interactive-focus)]",
                  sortDirection || hasFilter
                    ? "text-[var(--foreground-default)]"
                    : "text-[var(--foreground-muted)]"
                )}
                aria-label={`Options for ${column.header}`}
                aria-expanded="false"
              >
                <CaretDown className="h-3.5 w-3.5" weight="bold" aria-hidden="true" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-1" align="start" onClick={(e) => e.stopPropagation()}>
              <div className="space-y-0.5">
                {/* Sort options */}
                {column.sortable && (
                  <>
                    <button
                      onClick={() => {
                        if (sortDirection === "asc") {
                          onSort(column.id); // Will toggle to desc
                        } else {
                          // Set to asc
                          onSort(column.id);
                          if (sortDirection === "desc") onSort(column.id); // Toggle again if was desc
                        }
                      }}
                      className={cn(
                        "flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm",
                        "transition-colors hover:bg-[var(--background-interactive-hover)]",
                        sortDirection === "asc" &&
                          "bg-[var(--background-interactive-selected)] text-[var(--foreground-interactive-selected)]"
                      )}
                    >
                      <SortAscending
                        className="h-4 w-4"
                        weight={sortDirection === "asc" ? "bold" : "regular"}
                      />
                      <span>Sort ascending</span>
                    </button>
                    <button
                      onClick={() => {
                        if (sortDirection !== "desc") {
                          onSort(column.id);
                          if (sortDirection !== "asc") onSort(column.id);
                        }
                      }}
                      className={cn(
                        "flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm",
                        "transition-colors hover:bg-[var(--background-interactive-hover)]",
                        sortDirection === "desc" &&
                          "bg-[var(--background-interactive-selected)] text-[var(--foreground-interactive-selected)]"
                      )}
                    >
                      <SortDescending
                        className="h-4 w-4"
                        weight={sortDirection === "desc" ? "bold" : "regular"}
                      />
                      <span>Sort descending</span>
                    </button>
                    {sortDirection && (
                      <button
                        onClick={() => {
                          // Clear sort by toggling until null
                          onSort(column.id);
                          onSort(column.id);
                        }}
                        className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-[var(--foreground-muted)] transition-colors hover:bg-[var(--background-interactive-hover)]"
                      >
                        <X className="h-4 w-4" />
                        <span>Clear sort</span>
                      </button>
                    )}
                  </>
                )}

                {/* Divider if both sort and filter */}
                {column.sortable && column.filterConfig && (
                  <div className="my-1 h-px bg-[var(--border-muted)]" />
                )}

                {/* Filter content */}
                {column.filterConfig && (
                  <div className="px-2 py-1.5">
                    <ColumnFilterContent
                      column={column}
                      value={filterValue}
                      onChange={onFilterChange}
                      options={filterOptions}
                    />
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Resize handle - only visible on hover */}
      {column.resizable !== false && onResize && (
        <div
          className={cn(
            "absolute bottom-3 right-0 top-3 w-0.5 cursor-col-resize rounded-full",
            "opacity-0 group-hover:opacity-100",
            "bg-[var(--border-muted)] hover:w-1 hover:bg-[var(--border-brand)]",
            "transition-all duration-150"
          )}
          role="separator"
          aria-orientation="vertical"
          aria-label={`Resize ${column.header} column`}
          tabIndex={-1}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const startX = e.clientX;

            const handleMouseMove = (e: MouseEvent) => {
              const delta = e.clientX - startX;
              onResize(delta);
            };

            const handleMouseUp = () => {
              onResizeEnd?.();
              document.removeEventListener("mousemove", handleMouseMove);
              document.removeEventListener("mouseup", handleMouseUp);
            };

            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
          }}
        />
      )}
    </th>
  );
}

// ============================================
// Column Filter Content
// ============================================

interface ColumnFilterContentProps<T> {
  column: Column<T>;
  value: ColumnFilterValue;
  onChange: (value: ColumnFilterValue) => void;
  options: { label: string; value: string; icon?: React.ReactNode; color?: string }[];
}

function ColumnFilterContent<T>({ column, value, onChange, options }: ColumnFilterContentProps<T>) {
  const [localValue, setLocalValue] = React.useState<ColumnFilterValue>(value);
  const filterType = column.filterConfig?.type || "text";

  const handleApply = () => {
    onChange(localValue);
  };

  const handleClear = () => {
    setLocalValue(null);
    onChange(null);
  };

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-[var(--foreground-default)]">
        Filter: {column.header}
      </div>

      {filterType === "text" && (
        <Input
          type="text"
          placeholder={column.filterConfig?.placeholder || "Enter value..."}
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
            <SelectValue placeholder={column.filterConfig?.placeholder || "Select..."} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  {option.icon}
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {filterType === "multiSelect" && (
        <div className="max-h-48 space-y-2 overflow-y-auto">
          {options.map((option) => {
            const selected = Array.isArray(localValue) && localValue.includes(option.value);
            return (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-[var(--background-interactive-hover)]"
              >
                <Checkbox
                  checked={selected}
                  onCheckedChange={(checked) => {
                    const current = Array.isArray(localValue) ? localValue : [];
                    if (checked) {
                      setLocalValue([...current, option.value]);
                    } else {
                      setLocalValue(current.filter((v) => v !== option.value));
                    }
                  }}
                />
                {option.icon}
                <span className="text-sm">{option.label}</span>
              </label>
            );
          })}
        </div>
      )}

      {filterType === "number" && (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={
              typeof localValue === "object" && localValue !== null && "min" in localValue
                ? ((localValue as { min?: number }).min ?? "")
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
                ? ((localValue as { max?: number }).max ?? "")
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
  );
}

// ============================================
// Active Filters Display
// ============================================

interface ActiveFiltersDisplayProps {
  filters: ActiveFilter[];
  onRemoveFilter: (columnId: string) => void;
  onClearAll: () => void;
}

const ActiveFiltersDisplay = React.memo(function ActiveFiltersDisplay({
  filters,
  onRemoveFilter,
  onClearAll,
}: ActiveFiltersDisplayProps) {
  if (filters.length === 0) return null;

  const getDisplayValue = (filter: ActiveFilter) => {
    if (filter.value === null) return "";
    if (typeof filter.value === "string") return filter.value;
    if (typeof filter.value === "number") return String(filter.value);
    if (Array.isArray(filter.value)) return filter.value.join(", ");
    if ("min" in filter.value || "max" in filter.value) {
      const { min, max } = filter.value as { min?: number; max?: number };
      if (min !== undefined && max !== undefined) return `${min} – ${max}`;
      if (min !== undefined) return `≥ ${min}`;
      if (max !== undefined) return `≤ ${max}`;
    }
    return "";
  };

  return (
    <div className="flex flex-wrap items-center gap-2" role="list" aria-label="Active filters">
      <Funnel className="h-4 w-4 text-[var(--foreground-muted)]" aria-hidden="true" />
      {filters.map((filter, index) => (
        <div
          key={filter.columnId}
          role="listitem"
          className={cn(
            "group inline-flex items-center gap-1.5 py-1.5 pl-3 pr-1.5",
            "bg-[var(--background-brand-subtle)] text-[var(--foreground-brand)]",
            "border-[var(--border-brand)]/30 rounded-lg border",
            "text-sm",
            "duration-200 animate-in fade-in-0 slide-in-from-left-2"
          )}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <span className="font-medium text-[var(--foreground-brand-emphasis)]">
            {filter.columnHeader}
          </span>
          <span className="text-[var(--foreground-brand)] opacity-50">:</span>
          <span className="max-w-[120px] truncate">{getDisplayValue(filter)}</span>
          <button
            onClick={() => onRemoveFilter(filter.columnId)}
            className={cn(
              "ml-1 rounded-md p-1",
              "text-[var(--foreground-brand)] opacity-60",
              "hover:bg-[var(--background-brand-muted)] hover:opacity-100",
              "transition-all duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-interactive-focus)]"
            )}
            aria-label={`Remove ${filter.columnHeader} filter`}
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      ))}
      <button
        onClick={onClearAll}
        className={cn(
          "text-sm font-medium text-[var(--foreground-muted)]",
          "hover:text-[var(--foreground-error)]",
          "transition-colors duration-150",
          "focus-visible:underline focus-visible:outline-none"
        )}
      >
        Clear all
      </button>
    </div>
  );
});

// ============================================
// Bulk Actions Toolbar (Enhanced)
// ============================================

interface BulkActionsToolbarProps<T> {
  selectedCount: number;
  totalCount: number;
  actions: BulkAction<T>[];
  selectedRows: T[];
  onClearSelection: () => void;
  onSelectAll: () => void;
}

const BulkActionsToolbar = React.memo(function BulkActionsToolbar<T>({
  selectedCount,
  totalCount,
  actions,
  selectedRows,
  onClearSelection,
  onSelectAll,
}: BulkActionsToolbarProps<T>) {
  const [loadingActionId, setLoadingActionId] = React.useState<string | null>(null);
  const toolbarActions = actions.filter((a) => a.showInToolbar !== false);
  const overflowActions = actions.filter((a) => a.showInToolbar === false);

  const handleAction = async (action: BulkAction<T>) => {
    setLoadingActionId(action.id);
    try {
      await action.onAction(selectedRows);
    } finally {
      setLoadingActionId(null);
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-4 px-5 py-3.5",
        "border border-[var(--border-default)] bg-[var(--background-subtle)]",
        "rounded-xl shadow-md",
        "duration-300 ease-out animate-in fade-in-0 slide-in-from-top-2"
      )}
      role="toolbar"
      aria-label="Bulk actions"
    >
      <div className="flex items-center gap-3">
        <Checkbox
          checked={selectedCount === totalCount}
          onCheckedChange={(checked) => {
            if (checked) onSelectAll();
            else onClearSelection();
          }}
          aria-label={selectedCount === totalCount ? "Deselect all" : "Select all"}
        />
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[var(--foreground-default)]">
            {selectedCount}
          </span>
          <span className="text-sm text-[var(--foreground-muted)]">of {totalCount} selected</span>
        </div>
        {selectedCount < totalCount && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onSelectAll}
            className="ml-1 text-[var(--foreground-link)] hover:bg-[var(--background-interactive-hover)] hover:text-[var(--foreground-link-hover)]"
          >
            Select all {totalCount}
          </Button>
        )}
      </div>

      <div className="h-5 w-px bg-[var(--border-muted)]" />

      <div className="flex items-center gap-1" role="group" aria-label="Actions">
        {toolbarActions.map((action) => {
          const isLoading = loadingActionId === action.id;
          return (
            <TooltipProvider key={action.id} delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleAction(action)}
                    disabled={loadingActionId !== null}
                    className={cn(
                      "h-8 w-8",
                      "transition-all duration-150",
                      action.variant === "destructive"
                        ? "hover:bg-[var(--background-error)]/10 text-[var(--foreground-error)]"
                        : "text-[var(--foreground-muted)] hover:bg-[var(--background-interactive-hover)] hover:text-[var(--foreground-default)]",
                      isLoading && "opacity-60"
                    )}
                    aria-label={action.label}
                  >
                    <span
                      className={cn(
                        "transition-transform duration-200",
                        isLoading && "animate-spin"
                      )}
                      aria-hidden="true"
                    >
                      {isLoading ? <CircleNotch className="h-4 w-4" /> : action.icon}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent sideOffset={8}>
                  <span>{action.label}</span>
                  {action.shortcut && (
                    <kbd className="ml-2 rounded bg-[var(--background-muted)] px-1.5 py-0.5 font-mono text-[10px]">
                      {action.shortcut}
                    </kbd>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}

        {overflowActions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="More actions">
                <DotsThree className="h-4 w-4" weight="bold" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[160px]">
              {overflowActions.map((action) => (
                <DropdownMenuItem
                  key={action.id}
                  onClick={() => action.onAction(selectedRows)}
                  className={cn(
                    "flex items-center justify-between gap-4",
                    action.variant === "destructive" &&
                      "text-[var(--foreground-error)] focus:text-[var(--foreground-error)]"
                  )}
                >
                  <span className="flex items-center gap-2">
                    {action.icon && <span aria-hidden="true">{action.icon}</span>}
                    {action.label}
                  </span>
                  {action.shortcut && (
                    <kbd className="font-mono text-[10px] opacity-50">{action.shortcut}</kbd>
                  )}
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
          className="gap-1.5 text-[var(--foreground-muted)] hover:text-[var(--foreground-default)]"
          aria-label="Clear selection"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Clear</span>
        </Button>
      </div>
    </div>
  );
}) as <T>(props: BulkActionsToolbarProps<T>) => React.ReactElement;

// ============================================
// Empty State
// ============================================

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  /** Optional secondary action */
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState = React.memo(function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
      {/* Decorative background pattern - more visible */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--background-brand-subtle)_0%,transparent_70%)] opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--border-muted)_1px,transparent_0)] bg-[size:32px_32px] opacity-30" />
      </div>

      {icon && (
        <div className="relative mb-8">
          {/* Outer glow - subtle, no animation */}
          <div className="absolute inset-0 -m-4 rounded-full bg-[var(--background-brand-subtle)] opacity-60 blur-xl" />
          {/* Middle ring */}
          <div className="absolute inset-0 -m-2 rounded-full border-2 border-dashed border-[var(--border-muted)] opacity-50" />
          {/* Inner container - clean, elevated */}
          <div className="relative rounded-2xl border border-[var(--border-muted)] bg-[var(--background-default)] p-6 shadow-lg">
            <span className="text-[var(--foreground-muted)]">{icon}</span>
          </div>
        </div>
      )}

      <h3 className="mb-3 text-xl font-semibold tracking-tight text-[var(--foreground-default)]">
        {title}
      </h3>

      {description && (
        <p className="mb-8 max-w-sm text-sm leading-relaxed text-[var(--foreground-muted)]">
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div className="flex items-center gap-3">
          {action && (
            <Button onClick={action.onClick} size="lg" className="gap-2 shadow-md">
              {action.icon && <span aria-hidden="true">{action.icon}</span>}
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="outline" size="lg" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
});

// ============================================
// Skeleton Loading State
// ============================================

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

const SkeletonTable = React.memo(function SkeletonTable({
  rows = 5,
  columns = 5,
}: SkeletonTableProps) {
  // Consistent widths to avoid layout shift
  const columnWidths = React.useMemo(() => {
    const widths = [180]; // First column is always wider
    for (let i = 1; i < columns; i++) {
      widths.push(100 + ((i * 20) % 60)); // Deterministic widths: 100, 120, 140, 100, 120...
    }
    return widths;
  }, [columns]);

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--table-border)]">
      {/* Header skeleton */}
      <div className="flex border-b border-[var(--table-border)] bg-[var(--table-background-header)]">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="flex-1 px-4 py-2.5">
            <div
              className="skeleton-shimmer h-3 rounded bg-[var(--background-muted)]"
              style={{
                width: `${Math.min(columnWidths[i], 80)}px`,
                animationDelay: `${i * 100}ms`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Rows skeleton with staggered animation */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className={cn(
            "flex border-b border-[var(--table-border)] last:border-b-0",
            "animate-in fade-in-0 slide-in-from-bottom-1"
          )}
          style={{
            animationDelay: `${rowIndex * 75}ms`,
            animationDuration: "300ms",
            animationFillMode: "backwards",
          }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="flex-1 px-4 py-3.5">
              <div
                className="skeleton-shimmer h-4 rounded bg-[var(--background-muted)]"
                style={{
                  width:
                    colIndex === 0
                      ? `${Math.min(columnWidths[0] + 40, 160)}px`
                      : `${Math.min(columnWidths[colIndex], 100)}px`,
                  animationDelay: `${(rowIndex * columns + colIndex) * 50}ms`,
                }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
});

// ============================================
// Pagination Component
// ============================================

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const Pagination = React.memo(function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div
      className="flex items-center justify-between border-t border-[var(--table-border)] bg-[var(--table-background)] px-5 py-4"
      role="navigation"
      aria-label="Table pagination"
    >
      <div className="flex items-center gap-4">
        {/* Status announcement for screen readers */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="text-sm text-[var(--foreground-muted)]"
        >
          <span className="font-medium text-[var(--foreground-default)]">
            {startItem}–{endItem}
          </span>{" "}
          of <span className="font-medium text-[var(--foreground-default)]">{totalItems}</span>{" "}
          items
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <label htmlFor="page-size-select" className="text-sm text-[var(--foreground-muted)]">
            Show:
          </label>
          <Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v))}>
            <SelectTrigger id="page-size-select" className="h-8 w-[75px]">
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
        </div>
      </div>

      <div className="flex items-center gap-1">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                aria-label="Go to first page"
              >
                <CaretDoubleLeft className="h-4 w-4" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={8}>First page</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Go to previous page"
        >
          <CaretLeft className="h-4 w-4" aria-hidden="true" />
        </Button>

        <div className="mx-1 flex items-center gap-0.5" role="group" aria-label="Page numbers">
          {/* Page numbers with smart ellipsis */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum: number;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            const isCurrentPage = currentPage === pageNum;

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={cn(
                  "h-8 min-w-[32px] rounded-lg px-2 text-sm font-medium",
                  "transition-all duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-interactive-focus)]",
                  isCurrentPage
                    ? "bg-[var(--background-brand)] text-[var(--foreground-on-emphasis)] shadow-sm"
                    : "text-[var(--foreground-muted)] hover:bg-[var(--background-interactive-hover)] hover:text-[var(--foreground-default)]"
                )}
                aria-label={`Page ${pageNum}`}
                aria-current={isCurrentPage ? "page" : undefined}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Go to next page"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Button>

        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                aria-label="Go to last page"
              >
                <CaretDoubleRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={8}>Last page (page {totalPages})</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
});

// ============================================
// Row Actions Cell
// ============================================

interface RowActionsCellProps<T> {
  row: T;
  actions: RowAction<T>[];
}

const RowActionsCell = React.memo(function RowActionsCell<T>({
  row,
  actions,
}: RowActionsCellProps<T>) {
  const visibleActions = actions.filter((action) => !action.hidden?.(row));

  if (visibleActions.length === 0) return null;

  // If only 1-2 actions, show them inline
  if (visibleActions.length <= 2) {
    return (
      <div className="flex items-center gap-0.5 opacity-0 transition-opacity duration-150 focus-within:opacity-100 group-hover:opacity-100">
        {visibleActions.map((action) => (
          <TooltipProvider key={action.id} delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onAction(row);
                  }}
                  disabled={action.disabled?.(row)}
                  className={cn(
                    "rounded-lg p-2 transition-all duration-150",
                    "text-[var(--foreground-muted)]",
                    "hover:bg-[var(--background-interactive-hover)] hover:text-[var(--foreground-default)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-interactive-focus)]",
                    "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent",
                    "active:scale-95",
                    action.variant === "destructive" &&
                      "hover:bg-[var(--background-error)] hover:text-[var(--foreground-error)]"
                  )}
                  aria-label={action.label}
                >
                  <span aria-hidden="true">
                    {action.icon || <DotsThree className="h-4 w-4" weight="bold" />}
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent sideOffset={8}>
                <span>{action.label}</span>
                {action.shortcut && (
                  <kbd className="bg-[var(--background-default)]/20 ml-2 rounded px-1.5 py-0.5 font-mono text-[10px]">
                    {action.shortcut}
                  </kbd>
                )}
              </TooltipContent>
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
            "rounded-lg p-2 transition-all duration-150",
            "text-[var(--foreground-muted)]",
            "opacity-0 focus-visible:opacity-100 group-hover:opacity-100",
            "hover:bg-[var(--background-interactive-hover)] hover:text-[var(--foreground-default)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-interactive-focus)]",
            "active:scale-95"
          )}
          aria-label="Row actions"
        >
          <DotsThree className="h-4 w-4" weight="bold" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {visibleActions.map((action, index) => (
          <React.Fragment key={action.id}>
            {index > 0 && action.variant === "destructive" && <DropdownMenuSeparator />}
            <DropdownMenuItem
              onClick={() => action.onAction(row)}
              disabled={action.disabled?.(row)}
              className={cn(
                "flex items-center justify-between gap-4",
                action.variant === "destructive" &&
                  "text-[var(--foreground-error)] focus:text-[var(--foreground-error)]"
              )}
            >
              <span className="flex items-center gap-2">
                {action.icon && <span aria-hidden="true">{action.icon}</span>}
                {action.label}
              </span>
              {action.shortcut && (
                <kbd className="font-mono text-[10px] opacity-50">{action.shortcut}</kbd>
              )}
            </DropdownMenuItem>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}) as <T>(props: RowActionsCellProps<T>) => React.ReactElement | null;

// ============================================
// Main Enhanced DataTable Component
// ============================================

export interface EnhancedDataTableProps<T> {
  /** Array of data objects */
  data: T[];
  /** Column configuration */
  columns: Column<T>[];
  /** Enable row selection */
  selectable?: boolean;
  /** Get unique ID for a row */
  getRowId?: (row: T) => string;
  /** Enable search */
  searchable?: boolean;
  /** Search placeholder */
  searchPlaceholder?: string;
  /** Enable pagination */
  paginated?: boolean;
  /** Initial page size */
  pageSize?: number;
  /** Page size options */
  pageSizeOptions?: number[];
  /** Loading state */
  loading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Empty state action */
  emptyAction?: { label: string; onClick: () => void };
  /** Additional className */
  className?: string;
  /** Row click handler */
  onRowClick?: (row: T) => void;
  /** Enable column visibility toggle */
  columnToggle?: boolean;
  /** Bulk actions */
  bulkActions?: BulkAction<T>[];
  /** Row actions */
  rowActions?: RowAction<T>[];
  /** Row density */
  density?: TableDensity;
  /** Enable column resizing */
  resizable?: boolean;
  /** Enable column reordering */
  reorderable?: boolean;
  /** Group by column ID */
  groupBy?: string;
  /** Enable virtualization */
  virtualized?: boolean;
  /** Table height for virtualization */
  tableHeight?: number;

  // View features
  /** Current view type */
  viewType?: ViewType;
  /** Callback when view changes */
  onViewChange?: (view: ViewType) => void;
  /** Available view types */
  availableViews?: ViewType[];

  // Quick filters
  /** Quick filter presets */
  quickFilters?: QuickFilter[];
  /** Active quick filter ID */
  activeQuickFilterId?: string | null;
  /** Callback when quick filter changes */
  onQuickFilterChange?: (filterId: string | null) => void;

  // Saved views
  /** Saved view configurations */
  savedViews?: SavedView[];
  /** Active saved view ID */
  activeSavedViewId?: string | null;
  /** Callback when saved view is selected */
  onSavedViewSelect?: (viewId: string) => void;
  /** Callback to save current view */
  onSaveView?: (name: string) => void;

  // Toolbar
  /** Custom toolbar content */
  toolbar?: React.ReactNode;
  /** Show toolbar */
  showToolbar?: boolean;

  // Accessibility
  "aria-label"?: string;
}

export function EnhancedDataTable<T extends Record<string, unknown>>({
  data,
  columns,
  selectable = false,
  getRowId = (row) => String(row.id),
  searchable = true,
  searchPlaceholder = "Search...",
  paginated = true,
  pageSize: initialPageSize = 25,
  pageSizeOptions = [10, 25, 50, 100],
  loading = false,
  emptyMessage = "No data found",
  emptyAction,
  className,
  onRowClick,
  columnToggle = true,
  bulkActions = [],
  rowActions = [],
  density = "default",
  resizable = true,
  reorderable = false,
  groupBy,
  virtualized = false,
  tableHeight = 600,
  viewType = "table",
  onViewChange,
  availableViews = ["table"],
  quickFilters = [],
  activeQuickFilterId = null,
  onQuickFilterChange,
  savedViews = [],
  activeSavedViewId = null,
  onSavedViewSelect,
  onSaveView,
  toolbar,
  showToolbar = true,
  "aria-label": ariaLabel = "Data table",
}: EnhancedDataTableProps<T>) {
  // State
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortConfig, setSortConfig] = React.useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(initialPageSize);
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set());
  const [visibleColumns, setVisibleColumns] = React.useState<Set<string>>(
    () => new Set(columns.filter((c) => c.defaultVisible !== false).map((c) => c.id))
  );
  const [filterValues, setFilterValues] = React.useState<Record<string, ColumnFilterValue>>({});
  const [columnWidths, setColumnWidths] = React.useState<Record<string, number>>({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>(() => columns.map((c) => c.id));
  const [focusedRowIndex, setFocusedRowIndex] = React.useState<number>(-1);

  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const rowRefs = React.useRef<Map<number, HTMLTableRowElement>>(new Map());

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

  // Filter data
  const filteredData = React.useMemo(() => {
    let result = data;

    // Search filter
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

    // Column filters
    Object.entries(filterValues).forEach(([columnId, filterValue]) => {
      if (filterValue === null || filterValue === undefined) return;

      const column = columns.find((c) => c.id === columnId);
      if (!column || !column.accessorKey) return;

      const filterType = column.filterConfig?.type || "text";

      result = result.filter((row) => {
        const cellValue = row[column.accessorKey as keyof T];
        if (cellValue === null || cellValue === undefined) return false;

        switch (filterType) {
          case "text":
            return String(cellValue).toLowerCase().includes(String(filterValue).toLowerCase());
          case "select":
            return String(cellValue) === String(filterValue);
          case "multiSelect":
            if (Array.isArray(filterValue)) {
              return filterValue.includes(String(cellValue));
            }
            return true;
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

    return result;
  }, [data, searchQuery, columns, filterValues]);

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

  // Paginate data
  const paginatedData = React.useMemo(() => {
    if (!paginated) return sortedData;
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, paginated, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Get visible columns in order
  const displayColumns = React.useMemo(() => {
    let cols = columns.filter((c) => visibleColumns.has(c.id));

    if (reorderable) {
      cols = cols.sort((a, b) => {
        const aIndex = columnOrder.indexOf(a.id);
        const bIndex = columnOrder.indexOf(b.id);
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      });
    }

    return cols;
  }, [columns, visibleColumns, columnOrder, reorderable]);

  // Handlers
  const handleSort = (columnId: string) => {
    setSortConfig((current) => {
      if (current?.key !== columnId) return { key: columnId, direction: "asc" };
      if (current.direction === "asc") return { key: columnId, direction: "desc" };
      return null;
    });
  };

  const handleRowSelect = (rowId: string) => {
    setSelectedRows((current) => {
      const newSelected = new Set(current);
      if (newSelected.has(rowId)) {
        newSelected.delete(rowId);
      } else {
        newSelected.add(rowId);
      }
      return newSelected;
    });
  };

  const handleSelectAll = React.useCallback(() => {
    const allIds = paginatedData.map(getRowId);
    setSelectedRows(new Set(allIds));
  }, [paginatedData, getRowId]);

  const handleClearSelection = React.useCallback(() => {
    setSelectedRows(new Set());
  }, []);

  const handleFilterChange = (columnId: string, value: ColumnFilterValue) => {
    setFilterValues((prev) => ({
      ...prev,
      [columnId]: value,
    }));
    setCurrentPage(1);
  };

  const handleRemoveFilter = (columnId: string) => {
    setFilterValues((prev) => {
      const newFilters = { ...prev };
      delete newFilters[columnId];
      return newFilters;
    });
  };

  const handleClearAllFilters = () => {
    setFilterValues({});
  };

  const handleToggleColumn = (columnId: string) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(columnId)) {
        newSet.delete(columnId);
      } else {
        newSet.add(columnId);
      }
      return newSet;
    });
  };

  const handleResetColumns = () => {
    setVisibleColumns(new Set(columns.filter((c) => c.defaultVisible !== false).map((c) => c.id)));
  };

  // Get selected rows data
  const selectedRowsData = React.useMemo(() => {
    return paginatedData.filter((row) => selectedRows.has(getRowId(row)));
  }, [paginatedData, selectedRows, getRowId]);

  // Keyboard navigation for table rows
  const handleTableKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLTableSectionElement>) => {
      if (paginatedData.length === 0) return;

      const currentIndex = focusedRowIndex;
      let newIndex = currentIndex;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          newIndex = currentIndex < paginatedData.length - 1 ? currentIndex + 1 : currentIndex;
          break;
        case "ArrowUp":
          e.preventDefault();
          newIndex = currentIndex > 0 ? currentIndex - 1 : 0;
          break;
        case "Home":
          e.preventDefault();
          newIndex = 0;
          break;
        case "End":
          e.preventDefault();
          newIndex = paginatedData.length - 1;
          break;
        case "Enter":
        case " ":
          if (currentIndex >= 0 && onRowClick) {
            e.preventDefault();
            onRowClick(paginatedData[currentIndex]);
          } else if (currentIndex >= 0 && selectable) {
            e.preventDefault();
            handleRowSelect(getRowId(paginatedData[currentIndex]));
          }
          return;
        default:
          return;
      }

      if (newIndex !== currentIndex) {
        setFocusedRowIndex(newIndex);
        rowRefs.current.get(newIndex)?.focus();
      }
    },
    [focusedRowIndex, paginatedData, onRowClick, selectable, getRowId]
  );

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to clear selection
      if (e.key === "Escape" && selectedRows.size > 0) {
        handleClearSelection();
      }

      // Cmd/Ctrl + A to select all
      if ((e.metaKey || e.ctrlKey) && e.key === "a" && selectable) {
        e.preventDefault();
        handleSelectAll();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedRows, selectable, handleSelectAll, handleClearSelection]);

  // Density classes - more breathing room for cleaner look
  const densityClasses = {
    compact: "py-2.5 px-4",
    default: "py-3.5 px-4",
    comfortable: "py-5 px-4",
  };

  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        {showToolbar && (
          <div className="flex items-center gap-4">
            <div className="h-9 w-64 animate-pulse rounded-lg bg-[var(--background-muted)]" />
            <div className="h-9 w-24 animate-pulse rounded-lg bg-[var(--background-muted)]" />
          </div>
        )}
        <SkeletonTable rows={pageSize} columns={displayColumns.length} />
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar */}
      {showToolbar && (
        <div className="space-y-3">
          {/* Top row: Search, Quick Filters, Views, Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search - shrunk */}
            {searchable && (
              <div className="w-48">
                <EnhancedSearch
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder={searchPlaceholder}
                  size="sm"
                />
              </div>
            )}

            {/* Quick filters - now in top row as pill tabs */}
            {quickFilters.length > 0 && onQuickFilterChange && (
              <QuickFiltersBar
                filters={quickFilters}
                activeFilterId={activeQuickFilterId}
                onFilterSelect={onQuickFilterChange}
              />
            )}

            {/* Spacer to push right-aligned items */}
            <div className="flex-1" />

            {/* View switcher - icon buttons */}
            {availableViews.length > 1 && onViewChange && (
              <ViewSwitcher
                currentView={viewType}
                onViewChange={onViewChange}
                availableViews={availableViews}
              />
            )}

            {/* Saved views */}
            {savedViews.length > 0 && onSavedViewSelect && (
              <SavedViewsDropdown
                views={savedViews}
                currentViewId={activeSavedViewId}
                onViewSelect={onSavedViewSelect}
                onSaveView={onSaveView}
              />
            )}

            {/* Column toggle - icon only */}
            {columnToggle && (
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <DropdownMenu>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Columns className="h-4 w-4" />
                          <span className="sr-only">Toggle columns</span>
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={4}>
                      Toggle columns
                    </TooltipContent>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {columns.map((column) => (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          checked={visibleColumns.has(column.id)}
                          onCheckedChange={() => handleToggleColumn(column.id)}
                        >
                          {column.header}
                        </DropdownMenuCheckboxItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleResetColumns}>
                        <ArrowClockwise className="mr-2 h-4 w-4" />
                        Reset to default
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* Custom toolbar content */}
            {toolbar}
          </div>

          {/* Active filters */}
          {activeFilters.length > 0 && (
            <ActiveFiltersDisplay
              filters={activeFilters}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
            />
          )}
        </div>
      )}

      {/* Bulk actions toolbar */}
      {selectable && selectedRows.size > 0 && bulkActions.length > 0 && (
        <BulkActionsToolbar
          selectedCount={selectedRows.size}
          totalCount={sortedData.length}
          actions={bulkActions}
          selectedRows={selectedRowsData}
          onClearSelection={handleClearSelection}
          onSelectAll={handleSelectAll}
        />
      )}

      {/* Table */}
      <div
        ref={tableContainerRef}
        className="relative overflow-hidden rounded-xl border border-[var(--table-border)] bg-[var(--table-background)]"
      >
        {sortedData.length === 0 ? (
          <EmptyState
            icon={<MagnifyingGlass className="h-8 w-8 text-[var(--foreground-muted)]" />}
            title={emptyMessage}
            description={searchQuery ? "Try adjusting your search or filters" : undefined}
            action={emptyAction}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full caption-bottom text-sm" aria-label={ariaLabel}>
              <thead className="bg-[var(--table-background-header)]">
                <tr>
                  {/* Selection checkbox */}
                  {selectable && (
                    <th className="h-10 w-12 border-b border-[var(--table-border)] bg-[var(--table-background-header)] px-4">
                      <Checkbox
                        checked={
                          selectedRows.size === paginatedData.length && paginatedData.length > 0
                        }
                        onCheckedChange={(checked) => {
                          if (checked) handleSelectAll();
                          else handleClearSelection();
                        }}
                        aria-label="Select all rows"
                      />
                    </th>
                  )}

                  {/* Column headers */}
                  {displayColumns.map((column) => (
                    <EnhancedTableHead
                      key={column.id}
                      column={column}
                      sortConfig={sortConfig}
                      onSort={handleSort}
                      filterValue={filterValues[column.id] ?? null}
                      onFilterChange={(value) => handleFilterChange(column.id, value)}
                      data={data}
                      columnWidth={columnWidths[column.id]}
                      onResize={
                        resizable
                          ? (delta) => {
                              const currentWidth = columnWidths[column.id] ?? 150;
                              setColumnWidths((prev) => ({
                                ...prev,
                                [column.id]: Math.max(50, currentWidth + delta),
                              }));
                            }
                          : undefined
                      }
                    />
                  ))}

                  {/* Row actions header */}
                  {rowActions.length > 0 && (
                    <th className="h-10 w-16 border-b border-[var(--table-border)] bg-[var(--table-background-header)] px-4" />
                  )}
                </tr>
              </thead>

              <tbody onKeyDown={handleTableKeyDown}>
                {paginatedData.map((row, index) => {
                  const rowId = getRowId(row);
                  const isSelected = selectedRows.has(rowId);
                  const isFocused = focusedRowIndex === index;

                  return (
                    <tr
                      key={rowId}
                      ref={(el) => {
                        if (el) rowRefs.current.set(index, el);
                        else rowRefs.current.delete(index);
                      }}
                      tabIndex={isFocused ? 0 : -1}
                      className={cn(
                        "group border-b border-[var(--table-border)] last:border-b-0",
                        "transition-colors duration-100 ease-out",
                        "hover:bg-[var(--table-background-row-hover)]",
                        "focus-visible:bg-[var(--table-background-row-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--border-interactive-focus)]",
                        isSelected &&
                          "bg-[var(--table-background-row-selected)] hover:bg-[var(--table-background-row-selected)]",
                        onRowClick && "cursor-pointer"
                      )}
                      onClick={() => onRowClick?.(row)}
                      onFocus={() => setFocusedRowIndex(index)}
                      aria-selected={isSelected}
                      role="row"
                    >
                      {/* Selection checkbox */}
                      {selectable && (
                        <td
                          className={cn(
                            "w-12",
                            densityClasses[density],
                            isSelected && "bg-[var(--table-background-row-selected)]"
                          )}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleRowSelect(rowId)}
                            aria-label={`Select row ${index + 1}`}
                          />
                        </td>
                      )}

                      {/* Data cells */}
                      {displayColumns.map((column, colIndex) => {
                        const cellValue = column.accessorKey
                          ? row[column.accessorKey]
                          : column.accessorFn?.(row);

                        return (
                          <td
                            key={column.id}
                            className={cn(
                              densityClasses[density],
                              "text-[var(--table-foreground)]",
                              column.sticky && "sticky left-0 z-10 bg-[var(--table-background)]",
                              column.sticky &&
                                isSelected &&
                                "bg-[var(--table-background-row-selected)]",
                              column.className
                            )}
                            style={{
                              width: columnWidths[column.id]
                                ? `${columnWidths[column.id]}px`
                                : column.width,
                              minWidth: column.minWidth,
                            }}
                          >
                            <div className="truncate">
                              {column.cell ? column.cell(row) : String(cellValue ?? "")}
                            </div>
                          </td>
                        );
                      })}

                      {/* Row actions */}
                      {rowActions.length > 0 && (
                        <td
                          className={cn(
                            "w-16",
                            densityClasses[density],
                            isSelected && "bg-[var(--table-background-row-selected)]"
                          )}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <RowActionsCell row={row} actions={rowActions} />
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {paginated && sortedData.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={sortedData.length}
            pageSizeOptions={pageSizeOptions}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        )}
      </div>
    </div>
  );
}

// ============================================
// Export Helper Components
// ============================================

export {
  ViewSwitcher,
  QuickFiltersBar,
  SavedViewsDropdown,
  EnhancedSearch,
  ActiveFiltersDisplay,
  BulkActionsToolbar,
  EmptyState,
  SkeletonTable,
  Pagination,
  RowActionsCell,
};
