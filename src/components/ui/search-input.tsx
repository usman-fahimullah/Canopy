"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { MagnifyingGlass, MapPin, X, WarningOctagon } from "@phosphor-icons/react";
import { Button } from "./button";

/**
 * Search Input components based on Trails Design System
 *
 * Figma specs:
 * - Search input: Responsive width (fills container), 56px height
 * - Location input: 218px default width (or full width with size="full"), 56px height
 * - Background: neutral-100 (#FAF9F7)
 * - Border: neutral-200 (#F2EDE9) default, neutral-300 hover, green-600 focused, red-600 error
 * - Border radius: 16px (rounded-2xl)
 * - Padding: 16px
 * - Icon size: 24px
 * - Typography: 18px DM Sans Medium, -0.36px tracking
 * - Placeholder color: neutral-600 (#7A7671)
 * - Text color: neutral-800 (#1F1D1C) or green-800 (#0A3D2C)
 *
 * Recently Searched dropdown:
 * - Shadow: 2px 4px 16px rgba(31, 29, 28, 0.12)
 * - Border radius: 12px
 * - Item padding: 12px 16px
 */

// ============================================
// SEARCH INPUT
// ============================================

const searchInputVariants = cva(
  [
    "flex items-center w-full",
    "bg-[var(--input-background)]",
    "border border-solid",
    "rounded-2xl overflow-hidden",
    "transition-colors duration-fast",
  ],
  {
    variants: {
      state: {
        default: "border-[var(--input-border)] hover:border-[var(--input-border-hover)]",
        hover: "border-[var(--input-border-hover)]",
        focused: "border-[var(--input-border-focus)]",
        typing: "border-[var(--input-border-focus)]",
        error: "border-[var(--input-border-error)]",
        focusedError: "border-[var(--input-border-error)]",
      },
      size: {
        default: "h-14 px-4 gap-2",
        compact: "h-12 px-3 gap-2",
      },
    },
    defaultVariants: {
      state: "default",
      size: "default",
    },
  }
);

export interface SearchInputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof searchInputVariants> {
  /** Error state */
  error?: boolean;
  /** Error message */
  errorMessage?: string;
  /** Container class name */
  containerClassName?: string;
  /** Input size variant */
  size?: "default" | "compact";
  /** Callback when value changes */
  onValueChange?: (value: string) => void;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      containerClassName,
      error = false,
      errorMessage,
      size = "default",
      value,
      defaultValue,
      onChange,
      onValueChange,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? value ?? "");
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current!);

    const currentValue = value !== undefined ? value : internalValue;
    const hasValue = currentValue && String(currentValue).length > 0;

    const getState = (): "default" | "hover" | "focused" | "typing" | "error" | "focusedError" => {
      if (error && isFocused) return "focusedError";
      if (error) return "error";
      if (isFocused && hasValue) return "typing";
      if (isFocused) return "focused";
      return "default";
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
      onValueChange?.(e.target.value);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const state = getState();

    return (
      <div className={cn("w-full", containerClassName)}>
        <div
          className={cn(searchInputVariants({ state, size }), className)}
          onClick={() => inputRef.current?.focus()}
        >
          {/* Search Icon */}
          <MagnifyingGlass
            size={24}
            weight="bold"
            className="shrink-0 text-[var(--primitive-neutral-900)]"
          />

          {/* Cursor indicator when focused without value */}
          {isFocused && !hasValue && (
            <div className="flex h-[21px] w-0 items-center justify-center">
              <div
                className={cn(
                  "h-full w-[1px] animate-pulse",
                  error ? "bg-[var(--input-border-error)]" : "bg-[var(--input-border-focus)]"
                )}
              />
            </div>
          )}

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={currentValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(
              "min-w-0 flex-1 bg-transparent outline-none",
              "text-lg font-medium leading-6 tracking-[-0.36px]",
              "placeholder:text-[var(--input-foreground-placeholder)]",
              hasValue
                ? "text-[var(--foreground-brand-emphasis)]"
                : "text-[var(--foreground-subtle)]"
            )}
            {...props}
          />

          {/* Error Icon */}
          {error && (
            <WarningOctagon
              size={24}
              weight="fill"
              className="shrink-0 text-[var(--foreground-error)]"
            />
          )}
        </div>

        {/* Error Message */}
        {error && errorMessage && (
          <p className="mt-1.5 text-sm text-[var(--foreground-error)]">{errorMessage}</p>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

// ============================================
// LOCATION INPUT
// ============================================

const locationInputVariants = cva(
  [
    "flex items-center",
    "bg-[var(--input-background)]",
    "border border-solid",
    "rounded-2xl overflow-hidden",
    "transition-colors duration-fast",
  ],
  {
    variants: {
      state: {
        default: "border-[var(--input-border)] hover:border-[var(--input-border-hover)]",
        hover: "border-[var(--input-border-hover)]",
        focused: "border-[var(--input-border-focus)]",
        typing: "border-[var(--input-border-focus)]",
        error: "border-[var(--input-border-error)]",
        focusedError: "border-[var(--input-border-error)]",
      },
      size: {
        default: "h-14 px-4 gap-2 w-[218px]",
        compact: "h-12 px-3 gap-2 w-[200px]",
        full: "h-14 px-4 gap-2 w-full",
      },
    },
    defaultVariants: {
      state: "default",
      size: "default",
    },
  }
);

export interface LocationInputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof locationInputVariants> {
  /** Error state */
  error?: boolean;
  /** Error message */
  errorMessage?: string;
  /** Container class name */
  containerClassName?: string;
  /** Input size variant */
  size?: "default" | "compact" | "full";
  /** Callback when value changes */
  onValueChange?: (value: string) => void;
}

const LocationInput = React.forwardRef<HTMLInputElement, LocationInputProps>(
  (
    {
      className,
      containerClassName,
      error = false,
      errorMessage,
      size = "default",
      value,
      defaultValue,
      onChange,
      onValueChange,
      onFocus,
      onBlur,
      placeholder = "City, state, or zip code",
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? value ?? "");
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current!);

    const currentValue = value !== undefined ? value : internalValue;
    const hasValue = currentValue && String(currentValue).length > 0;

    const getState = (): "default" | "hover" | "focused" | "typing" | "error" | "focusedError" => {
      if (error && isFocused) return "focusedError";
      if (error) return "error";
      if (isFocused && hasValue) return "typing";
      if (isFocused) return "focused";
      return "default";
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
      onValueChange?.(e.target.value);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const state = getState();

    return (
      <div className={cn("shrink-0", containerClassName)}>
        <div
          className={cn(locationInputVariants({ state, size }), className)}
          onClick={() => inputRef.current?.focus()}
        >
          {/* Map Pin Icon */}
          <MapPin
            size={24}
            weight="fill"
            className="shrink-0 text-[var(--primitive-neutral-900)]"
          />

          {/* Cursor indicator when focused without value */}
          {isFocused && !hasValue && (
            <div className="flex h-[21px] w-0 items-center justify-center">
              <div
                className={cn(
                  "h-full w-[1px] animate-pulse",
                  error ? "bg-[var(--input-border-error)]" : "bg-[var(--input-border-focus)]"
                )}
              />
            </div>
          )}

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={currentValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={cn(
              "min-w-0 flex-1 bg-transparent outline-none",
              "text-lg font-medium leading-6 tracking-[-0.36px]",
              "placeholder:text-[var(--input-foreground-placeholder)]",
              "overflow-hidden text-ellipsis whitespace-nowrap",
              hasValue ? "text-[var(--foreground-muted)]" : "text-[var(--foreground-subtle)]"
            )}
            {...props}
          />

          {/* Error Icon */}
          {error && (
            <WarningOctagon
              size={24}
              weight="fill"
              className="shrink-0 text-[var(--foreground-error)]"
            />
          )}
        </div>

        {/* Error Message */}
        {error && errorMessage && (
          <p className="mt-1.5 text-sm text-[var(--foreground-error)]">{errorMessage}</p>
        )}
      </div>
    );
  }
);

LocationInput.displayName = "LocationInput";

// ============================================
// RECENTLY SEARCHED ITEM
// ============================================

export interface RecentlySearchedItemProps {
  /** The search term text */
  text: string;
  /** Callback when item is clicked */
  onClick?: () => void;
  /** Callback when delete button is clicked */
  onDelete?: () => void;
  /** Additional class name */
  className?: string;
}

const RecentlySearchedItem = React.forwardRef<HTMLDivElement, RecentlySearchedItemProps>(
  ({ text, onClick, onDelete, className }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full items-center gap-1 px-4 py-3",
          "cursor-pointer",
          "transition-colors duration-fast",
          isHovered && "rounded-2xl bg-[var(--input-background)]",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        {/* Text */}
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-lg font-medium leading-6 tracking-[-0.36px]",
              "text-[var(--primitive-neutral-800)]",
              "overflow-hidden text-ellipsis whitespace-nowrap"
            )}
          >
            {text}
          </p>
        </div>

        {/* Delete Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          className={cn(
            "shrink-0 rounded-2xl p-2.5",
            "transition-colors duration-fast",
            isHovered
              ? "bg-[var(--background-muted)] hover:bg-[var(--background-emphasized)]"
              : "bg-[var(--background-default)] hover:bg-[var(--background-interactive-hover)]"
          )}
          aria-label={`Remove "${text}" from recent searches`}
        >
          <X size={24} weight="bold" className="text-[var(--primitive-neutral-900)]" />
        </button>
      </div>
    );
  }
);

RecentlySearchedItem.displayName = "RecentlySearchedItem";

// ============================================
// RECENTLY SEARCHED DROPDOWN
// ============================================

export interface RecentlySearchedDropdownProps {
  /** List of recently searched items */
  items: Array<{
    id: string;
    text: string;
  }>;
  /** Callback when an item is clicked */
  onItemClick?: (item: { id: string; text: string }) => void;
  /** Callback when an item's delete button is clicked */
  onItemDelete?: (item: { id: string; text: string }) => void;
  /** Maximum number of items to show (1-5) */
  maxItems?: 1 | 2 | 3 | 4 | 5;
  /** Additional class name */
  className?: string;
  /** Whether the dropdown is visible */
  open?: boolean;
}

const RecentlySearchedDropdown = React.forwardRef<HTMLDivElement, RecentlySearchedDropdownProps>(
  ({ items, onItemClick, onItemDelete, maxItems = 5, className, open = true }, ref) => {
    if (!open || items.length === 0) return null;

    const displayItems = items.slice(0, maxItems);

    return (
      <div
        ref={ref}
        className={cn(
          "bg-[var(--primitive-neutral-0)]",
          "overflow-hidden rounded-xl px-4",
          "shadow-[2px_4px_16px_0px_rgba(31,29,28,0.12)]",
          className
        )}
      >
        {displayItems.map((item) => (
          <RecentlySearchedItem
            key={item.id}
            text={item.text}
            onClick={() => onItemClick?.(item)}
            onDelete={() => onItemDelete?.(item)}
          />
        ))}
      </div>
    );
  }
);

RecentlySearchedDropdown.displayName = "RecentlySearchedDropdown";

// ============================================
// SEARCH BAR (COMPOSITE)
// ============================================

export interface SearchBarProps {
  /** Search input value */
  searchValue?: string;
  /** Search input default value */
  defaultSearchValue?: string;
  /** Callback when search value changes */
  onSearchChange?: (value: string) => void;
  /** Search input placeholder */
  searchPlaceholder?: string;
  /** Whether to show location input */
  showLocation?: boolean;
  /** Location input value */
  locationValue?: string;
  /** Location input default value */
  defaultLocationValue?: string;
  /** Callback when location value changes */
  onLocationChange?: (value: string) => void;
  /** Location input placeholder */
  locationPlaceholder?: string;
  /** Button text */
  buttonText?: string;
  /** Callback when search button is clicked */
  onSearch?: (search: string, location?: string) => void;
  /** Recently searched items */
  recentSearches?: Array<{ id: string; text: string }>;
  /** Callback when a recent search is clicked */
  onRecentSearchClick?: (item: { id: string; text: string }) => void;
  /** Callback when a recent search is deleted */
  onRecentSearchDelete?: (item: { id: string; text: string }) => void;
  /** Whether to show recently searched dropdown */
  showRecentSearches?: boolean;
  /** Search input error state */
  searchError?: boolean;
  /** Location input error state */
  locationError?: boolean;
  /** Additional class name */
  className?: string;
}

const SearchBar = React.forwardRef<HTMLDivElement, SearchBarProps>(
  (
    {
      searchValue,
      defaultSearchValue,
      onSearchChange,
      searchPlaceholder = "Search by title, company name, etc.",
      showLocation = true,
      locationValue,
      defaultLocationValue,
      onLocationChange,
      locationPlaceholder = "City, state, or zip code",
      buttonText = "Search",
      onSearch,
      recentSearches = [],
      onRecentSearchClick,
      onRecentSearchDelete,
      showRecentSearches = false,
      searchError = false,
      locationError = false,
      className,
    },
    ref
  ) => {
    const [internalSearchValue, setInternalSearchValue] = React.useState(
      defaultSearchValue ?? searchValue ?? ""
    );
    const [internalLocationValue, setInternalLocationValue] = React.useState(
      defaultLocationValue ?? locationValue ?? ""
    );
    const [isSearchFocused, setIsSearchFocused] = React.useState(false);

    const currentSearchValue = searchValue !== undefined ? searchValue : internalSearchValue;
    const currentLocationValue =
      locationValue !== undefined ? locationValue : internalLocationValue;

    const handleSearchChange = (value: string) => {
      if (searchValue === undefined) {
        setInternalSearchValue(value);
      }
      onSearchChange?.(value);
    };

    const handleLocationChange = (value: string) => {
      if (locationValue === undefined) {
        setInternalLocationValue(value);
      }
      onLocationChange?.(value);
    };

    const handleSearch = () => {
      onSearch?.(currentSearchValue, showLocation ? currentLocationValue : undefined);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    };

    const shouldShowDropdown = showRecentSearches && isSearchFocused && recentSearches.length > 0;

    return (
      <div ref={ref} className={cn("flex flex-col gap-2", className)}>
        {/* Main search bar row */}
        <div className="flex h-14 items-center gap-4">
          {/* Search Input */}
          <SearchInput
            value={currentSearchValue}
            onValueChange={handleSearchChange}
            placeholder={searchPlaceholder}
            error={searchError}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => {
              // Delay to allow click on dropdown items
              setTimeout(() => setIsSearchFocused(false), 200);
            }}
            onKeyDown={handleKeyDown}
            containerClassName="flex-1"
          />

          {/* Location Input */}
          {showLocation && (
            <LocationInput
              value={currentLocationValue}
              onValueChange={handleLocationChange}
              placeholder={locationPlaceholder}
              error={locationError}
              onKeyDown={handleKeyDown}
            />
          )}

          {/* Search Button */}
          <Button variant="primary" size="lg" onClick={handleSearch} className="shrink-0">
            {buttonText}
          </Button>
        </div>

        {/* Recently Searched Dropdown */}
        {shouldShowDropdown && (
          <RecentlySearchedDropdown
            items={recentSearches}
            onItemClick={(item) => {
              handleSearchChange(item.text);
              onRecentSearchClick?.(item);
            }}
            onItemDelete={onRecentSearchDelete}
            className="w-full"
          />
        )}
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";

// ============================================
// EXPORTS
// ============================================

export {
  SearchInput,
  searchInputVariants,
  LocationInput,
  locationInputVariants,
  RecentlySearchedItem,
  RecentlySearchedDropdown,
  SearchBar,
};
