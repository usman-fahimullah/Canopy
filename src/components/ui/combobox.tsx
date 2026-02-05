"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Command as CommandPrimitive } from "cmdk";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Badge } from "./badge";
import { Checkbox } from "./checkbox";
import { CaretDown, Check, X, MagnifyingGlass, CircleNotch, Warning } from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";

/* ============================================
   Combobox Types
   ============================================ */
export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  group?: string;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  /** Success state - shows green border */
  success?: boolean;
  clearable?: boolean;
  /** Called when the search input changes - useful for async search */
  onSearchChange?: (search: string) => void;
  /** Render custom option content */
  renderOption?: (option: ComboboxOption, selected: boolean) => React.ReactNode;
}

export interface MultiComboboxProps {
  options: ComboboxOption[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  /** Success state - shows green border */
  success?: boolean;
  maxItems?: number;
  onSearchChange?: (search: string) => void;
  renderOption?: (option: ComboboxOption, selected: boolean) => React.ReactNode;
}

/* ============================================
   Single Select Combobox
   ============================================ */
const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
  (
    {
      options,
      value,
      onValueChange,
      placeholder = "Select an option...",
      searchPlaceholder = "Search...",
      emptyMessage = "No results found.",
      className,
      disabled = false,
      loading = false,
      error = false,
      success = false,
      clearable = true,
      onSearchChange,
      renderOption,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const listboxId = React.useId();

    const selectedOption = options.find((opt) => opt.value === value);

    // Group options
    const groupedOptions = React.useMemo(() => {
      const groups = new Map<string, ComboboxOption[]>();
      const ungrouped: ComboboxOption[] = [];

      options.forEach((option) => {
        if (option.group) {
          const group = groups.get(option.group) || [];
          group.push(option);
          groups.set(option.group, group);
        } else {
          ungrouped.push(option);
        }
      });

      return { groups, ungrouped };
    }, [options]);

    const handleSearchChange = (newSearch: string) => {
      setSearch(newSearch);
      onSearchChange?.(newSearch);
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            ref={ref}
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-haspopup="listbox"
            disabled={disabled}
            className={cn(
              // Base layout
              "group flex w-full items-center justify-between gap-2",
              // Sizing: matches Select component
              "rounded-lg border px-4 py-3",
              // Colors using select tokens
              "bg-[var(--select-background)]",
              "border-[var(--select-border)]",
              // Typography
              "text-body text-[var(--select-foreground)]",
              // Hover state
              "hover:border-[var(--select-border-hover)]",
              // Focus state
              "focus-visible:border-[var(--select-border-focus)] focus-visible:outline-none focus-visible:hover:border-[var(--select-border-focus)]",
              "focus-visible:bg-[var(--select-background-open)]",
              // Open state
              open && "border-[var(--select-border-focus)] bg-[var(--select-background-open)]",
              // Disabled state
              "disabled:cursor-not-allowed disabled:opacity-50",
              // Transitions
              "transition-all duration-[var(--duration-normal)] ease-[var(--ease-default)]",
              // Error state
              error && [
                "border-[var(--select-border-error)]",
                "hover:border-[var(--select-border-error)]",
                "focus-visible:border-[var(--select-border-error)]",
              ],
              // Success state
              success && [
                "border-[var(--select-border-success)]",
                "hover:border-[var(--select-border-success)]",
                "focus-visible:border-[var(--select-border-success)]",
              ],
              className
            )}
            aria-invalid={error ? "true" : undefined}
          >
            <span
              className={cn(
                "truncate transition-colors duration-[var(--duration-normal)]",
                !selectedOption && "text-[var(--select-foreground-placeholder)]"
              )}
            >
              {selectedOption ? (
                <span className="flex items-center gap-2">
                  {selectedOption.icon}
                  {selectedOption.label}
                </span>
              ) : (
                placeholder
              )}
            </span>
            <div className="flex items-center gap-2">
              {clearable && selectedOption && !disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onValueChange?.("");
                  }}
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full",
                    "text-[var(--foreground-muted)]",
                    "hover:bg-[var(--background-interactive-hover)] hover:text-[var(--foreground-default)]",
                    "transition-all duration-[var(--duration-fast)]"
                  )}
                >
                  <X className="h-4 w-4" weight="bold" />
                </button>
              )}
              {loading ? (
                <CircleNotch className="h-5 w-5 animate-spin text-[var(--foreground-brand)]" />
              ) : error ? (
                <Warning className="h-5 w-5 text-[var(--select-foreground-error)]" weight="fill" />
              ) : (
                <CaretDown
                  className={cn(
                    "h-5 w-5 text-[var(--select-icon)]",
                    "transition-transform duration-[var(--duration-normal)]",
                    open && "rotate-180"
                  )}
                  weight="bold"
                />
              )}
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            "w-[--radix-popover-trigger-width] p-0",
            "bg-[var(--select-content-background)]",
            "border border-[var(--select-border)]",
            "shadow-[var(--select-content-shadow)]",
            "overflow-hidden rounded-lg",
            "animate-in fade-in-0 zoom-in-95 duration-[var(--duration-normal)]"
          )}
          align="start"
          sideOffset={4}
        >
          <CommandPrimitive
            className="flex flex-col overflow-hidden"
            shouldFilter={!onSearchChange}
          >
            {/* Search input */}
            <div className="flex items-center gap-2 border-b border-[var(--border-muted)] px-3">
              <MagnifyingGlass className="h-4 w-4 shrink-0 text-[var(--foreground-muted)]" />
              <CommandPrimitive.Input
                value={search}
                onValueChange={handleSearchChange}
                placeholder={searchPlaceholder}
                className={cn(
                  "flex h-10 w-full bg-transparent py-3 text-body-sm",
                  "text-[var(--input-foreground)]",
                  "placeholder:text-[var(--input-foreground-placeholder)]",
                  "focus:outline-none"
                )}
              />
            </div>
            <CommandPrimitive.List id={listboxId} className="max-h-60 overflow-auto p-1">
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-2 py-6">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--background-brand-subtle)]">
                    <CircleNotch className="h-4 w-4 animate-spin text-[var(--foreground-brand)]" />
                  </div>
                  <span className="text-caption text-[var(--foreground-muted)]">Searching...</span>
                </div>
              ) : (
                <>
                  <CommandPrimitive.Empty className="py-6 text-center text-body-sm text-[var(--foreground-muted)]">
                    {emptyMessage}
                  </CommandPrimitive.Empty>

                  {/* Ungrouped options */}
                  {groupedOptions.ungrouped.map((option) => {
                    const isSelected = option.value === value;
                    return (
                      <CommandPrimitive.Item
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                        onSelect={() => {
                          onValueChange?.(option.value);
                          setOpen(false);
                          setSearch("");
                        }}
                        className={cn(
                          "relative flex cursor-pointer select-none items-center gap-2",
                          "rounded-md px-3 py-2 text-body-sm outline-none",
                          "text-[var(--select-item-foreground)]",
                          "data-[selected=true]:bg-[var(--select-item-background-hover)]",
                          "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
                          "transition-colors duration-[var(--duration-fast)]",
                          isSelected && "bg-[var(--select-item-background-selected)]"
                        )}
                      >
                        {renderOption ? (
                          renderOption(option, isSelected)
                        ) : (
                          <>
                            <div className="flex flex-1 items-center gap-2">
                              {option.icon}
                              <div className="flex flex-col">
                                <span
                                  className={cn(
                                    isSelected && "text-[var(--select-item-foreground-selected)]"
                                  )}
                                >
                                  {option.label}
                                </span>
                                {option.description && (
                                  <span className="text-caption text-[var(--foreground-muted)]">
                                    {option.description}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div
                              className={cn(
                                "flex h-4 w-4 items-center justify-center",
                                "transition-all duration-[var(--duration-fast)]",
                                isSelected ? "scale-100 opacity-100" : "scale-75 opacity-0"
                              )}
                            >
                              <Check
                                className="h-4 w-4 text-[var(--select-item-checkmark)]"
                                weight="bold"
                              />
                            </div>
                          </>
                        )}
                      </CommandPrimitive.Item>
                    );
                  })}

                  {/* Grouped options */}
                  {Array.from(groupedOptions.groups.entries()).map(([groupName, groupOptions]) => (
                    <CommandPrimitive.Group
                      key={groupName}
                      heading={groupName}
                      className={cn(
                        "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2",
                        "[&_[cmdk-group-heading]]:text-caption [&_[cmdk-group-heading]]:font-medium",
                        "[&_[cmdk-group-heading]]:text-[var(--foreground-muted)]"
                      )}
                    >
                      {groupOptions.map((option) => {
                        const isSelected = option.value === value;
                        return (
                          <CommandPrimitive.Item
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                            onSelect={() => {
                              onValueChange?.(option.value);
                              setOpen(false);
                              setSearch("");
                            }}
                            className={cn(
                              "relative flex cursor-pointer select-none items-center gap-2",
                              "rounded-md px-3 py-2 text-body-sm outline-none",
                              "text-[var(--select-item-foreground)]",
                              "data-[selected=true]:bg-[var(--select-item-background-hover)]",
                              "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
                              "transition-colors duration-[var(--duration-fast)]",
                              isSelected && "bg-[var(--select-item-background-selected)]"
                            )}
                          >
                            {renderOption ? (
                              renderOption(option, isSelected)
                            ) : (
                              <>
                                <div className="flex flex-1 items-center gap-2">
                                  {option.icon}
                                  <div className="flex flex-col">
                                    <span
                                      className={cn(
                                        isSelected &&
                                          "text-[var(--select-item-foreground-selected)]"
                                      )}
                                    >
                                      {option.label}
                                    </span>
                                    {option.description && (
                                      <span className="text-caption text-[var(--foreground-muted)]">
                                        {option.description}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div
                                  className={cn(
                                    "flex h-4 w-4 items-center justify-center",
                                    "transition-all duration-[var(--duration-fast)]",
                                    isSelected ? "scale-100 opacity-100" : "scale-75 opacity-0"
                                  )}
                                >
                                  <Check
                                    className="h-4 w-4 text-[var(--select-item-checkmark)]"
                                    weight="bold"
                                  />
                                </div>
                              </>
                            )}
                          </CommandPrimitive.Item>
                        );
                      })}
                    </CommandPrimitive.Group>
                  ))}
                </>
              )}
            </CommandPrimitive.List>
          </CommandPrimitive>
        </PopoverContent>
      </Popover>
    );
  }
);
Combobox.displayName = "Combobox";

/* ============================================
   Multi Select Combobox
   ============================================ */
const MultiCombobox = React.forwardRef<HTMLDivElement, MultiComboboxProps>(
  (
    {
      options,
      value = [],
      onValueChange,
      placeholder = "Select options...",
      searchPlaceholder = "Search...",
      emptyMessage = "No results found.",
      className,
      disabled = false,
      loading = false,
      error = false,
      success = false,
      maxItems,
      onSearchChange,
      renderOption,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);
    const multiListboxId = React.useId();

    const selectedOptions = options.filter((opt) => value.includes(opt.value));
    const canAddMore = !maxItems || value.length < maxItems;

    const handleSearchChange = (newSearch: string) => {
      setSearch(newSearch);
      onSearchChange?.(newSearch);
    };

    const handleSelect = (optionValue: string) => {
      if (value.includes(optionValue)) {
        onValueChange?.(value.filter((v) => v !== optionValue));
      } else if (canAddMore) {
        onValueChange?.([...value, optionValue]);
      }
    };

    const handleRemove = (optionValue: string) => {
      onValueChange?.(value.filter((v) => v !== optionValue));
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            ref={ref}
            role="combobox"
            aria-expanded={open}
            aria-controls={multiListboxId}
            aria-haspopup="listbox"
            aria-invalid={error ? "true" : undefined}
            className={cn(
              // Base layout
              "group flex min-h-[46px] w-full flex-wrap items-center gap-2",
              // Sizing: matches Select component
              "rounded-lg border px-4 py-2.5",
              // Colors using select tokens
              "bg-[var(--select-background)]",
              "border-[var(--select-border)]",
              // Typography
              "text-body",
              // Hover state
              "hover:border-[var(--select-border-hover)]",
              // Focus state
              "focus-within:border-[var(--select-border-focus)] focus-within:hover:border-[var(--select-border-focus)]",
              "focus-within:bg-[var(--select-background-open)]",
              // Open state
              open && "border-[var(--select-border-focus)] bg-[var(--select-background-open)]",
              // Cursor and transitions
              "cursor-text transition-all duration-[var(--duration-normal)] ease-[var(--ease-default)]",
              // Disabled state
              disabled && "cursor-not-allowed opacity-50",
              // Error state
              error && [
                "border-[var(--select-border-error)]",
                "hover:border-[var(--select-border-error)]",
                "focus-within:border-[var(--select-border-error)]",
              ],
              // Success state
              success && [
                "border-[var(--select-border-success)]",
                "hover:border-[var(--select-border-success)]",
                "focus-within:border-[var(--select-border-success)]",
              ],
              className
            )}
            onClick={() => {
              if (!disabled) {
                setOpen(true);
                inputRef.current?.focus();
              }
            }}
          >
            {selectedOptions.map((option) => (
              <Badge
                key={option.value}
                variant="secondary"
                className="animate-in fade-in-0 zoom-in-95 gap-1 pr-1"
              >
                {option.icon}
                {option.label}
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(option.value);
                    }}
                    className={cn(
                      "ml-1 flex h-5 w-5 items-center justify-center rounded-full",
                      "text-[var(--foreground-muted)]",
                      "hover:bg-[var(--background-interactive-hover)] hover:text-[var(--foreground-default)]",
                      "transition-all duration-[var(--duration-fast)]"
                    )}
                  >
                    <X className="h-3 w-3" weight="bold" />
                  </button>
                )}
              </Badge>
            ))}
            {selectedOptions.length === 0 && (
              <span className="text-[var(--select-foreground-placeholder)] transition-opacity duration-[var(--duration-normal)]">
                {placeholder}
              </span>
            )}
            <div className="ml-auto flex items-center">
              {loading ? (
                <CircleNotch className="h-5 w-5 animate-spin text-[var(--foreground-brand)]" />
              ) : (
                <CaretDown
                  className={cn(
                    "h-5 w-5 text-[var(--select-icon)]",
                    "transition-transform duration-[var(--duration-normal)]",
                    open && "rotate-180"
                  )}
                  weight="bold"
                />
              )}
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            "w-[--radix-popover-trigger-width] p-0",
            "bg-[var(--select-content-background)]",
            "border border-[var(--select-border)]",
            "shadow-[var(--select-content-shadow)]",
            "overflow-hidden rounded-lg",
            "animate-in fade-in-0 zoom-in-95 duration-[var(--duration-normal)]"
          )}
          align="start"
          sideOffset={4}
        >
          <CommandPrimitive
            className="flex flex-col overflow-hidden"
            shouldFilter={!onSearchChange}
          >
            {/* Search input */}
            <div className="flex items-center gap-2 border-b border-[var(--border-muted)] px-3">
              <MagnifyingGlass className="h-4 w-4 shrink-0 text-[var(--foreground-muted)]" />
              <CommandPrimitive.Input
                ref={inputRef}
                value={search}
                onValueChange={handleSearchChange}
                placeholder={searchPlaceholder}
                className={cn(
                  "flex h-10 w-full bg-transparent py-3 text-body-sm",
                  "text-[var(--input-foreground)]",
                  "placeholder:text-[var(--input-foreground-placeholder)]",
                  "focus:outline-none"
                )}
              />
            </div>
            <CommandPrimitive.List id={multiListboxId} className="max-h-60 overflow-auto p-1">
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-2 py-6">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--background-brand-subtle)]">
                    <CircleNotch className="h-4 w-4 animate-spin text-[var(--foreground-brand)]" />
                  </div>
                  <span className="text-caption text-[var(--foreground-muted)]">Searching...</span>
                </div>
              ) : (
                <>
                  <CommandPrimitive.Empty className="py-6 text-center text-body-sm text-[var(--foreground-muted)]">
                    {emptyMessage}
                  </CommandPrimitive.Empty>
                  {options.map((option) => {
                    const isSelected = value.includes(option.value);
                    const isDisabled = option.disabled || (!isSelected && !canAddMore);

                    return (
                      <CommandPrimitive.Item
                        key={option.value}
                        value={option.value}
                        disabled={isDisabled}
                        onSelect={() => handleSelect(option.value)}
                        className={cn(
                          "relative flex cursor-pointer select-none items-center gap-2",
                          "rounded-md px-3 py-2 text-body-sm outline-none",
                          "text-[var(--select-item-foreground)]",
                          "data-[selected=true]:bg-[var(--select-item-background-hover)]",
                          "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
                          "transition-colors duration-[var(--duration-fast)]"
                        )}
                      >
                        {renderOption ? (
                          renderOption(option, isSelected)
                        ) : (
                          <>
                            <Checkbox
                              checked={isSelected}
                              className="pointer-events-none h-5 w-5"
                              aria-hidden="true"
                            />
                            <div className="flex flex-1 items-center gap-2">
                              {option.icon}
                              <div className="flex flex-col">
                                <span>{option.label}</span>
                                {option.description && (
                                  <span className="text-caption text-[var(--foreground-muted)]">
                                    {option.description}
                                  </span>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </CommandPrimitive.Item>
                    );
                  })}
                </>
              )}
            </CommandPrimitive.List>
            {maxItems && (
              <div className="border-t border-[var(--border-muted)] px-3 py-2 text-caption text-[var(--foreground-muted)]">
                <span className="font-medium tabular-nums">{value.length}</span> / {maxItems}{" "}
                selected
              </div>
            )}
          </CommandPrimitive>
        </PopoverContent>
      </Popover>
    );
  }
);
MultiCombobox.displayName = "MultiCombobox";

/* ============================================
   Async Combobox (for API-based search)
   ============================================ */
interface AsyncComboboxProps extends Omit<ComboboxProps, "options"> {
  /** Function to fetch options based on search query */
  loadOptions: (search: string) => Promise<ComboboxOption[]>;
  /** Debounce delay in ms */
  debounceMs?: number;
  /** Minimum characters before search */
  minChars?: number;
}

const AsyncCombobox = React.forwardRef<HTMLButtonElement, AsyncComboboxProps>(
  ({ loadOptions, debounceMs = 300, minChars = 1, placeholder = "Search...", ...props }, ref) => {
    const [options, setOptions] = React.useState<ComboboxOption[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const debounceRef = React.useRef<NodeJS.Timeout>();

    const handleSearchChange = React.useCallback(
      async (search: string) => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }

        if (search.length < minChars) {
          setOptions([]);
          return;
        }

        debounceRef.current = setTimeout(async () => {
          setLoading(true);
          setError(false);
          try {
            const results = await loadOptions(search);
            setOptions(results);
          } catch (err) {
            logger.error("Failed to load options", { error: formatError(err) });
            setError(true);
            setOptions([]);
          } finally {
            setLoading(false);
          }
        }, debounceMs);
      },
      [loadOptions, debounceMs, minChars]
    );

    return (
      <Combobox
        ref={ref}
        options={options}
        loading={loading}
        error={error}
        onSearchChange={handleSearchChange}
        placeholder={placeholder}
        {...props}
      />
    );
  }
);
AsyncCombobox.displayName = "AsyncCombobox";

/* ============================================
   Exports
   ============================================ */
export { Combobox, MultiCombobox, AsyncCombobox };
