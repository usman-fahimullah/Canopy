"use client";

import * as React from "react";
import {
  format,
  isBefore,
  isAfter,
  isWithinInterval,
  startOfToday,
  addDays,
  addWeeks,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";
import { CalendarBlank, X, Check } from "@phosphor-icons/react";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

/**
 * DatePicker & DateRangePicker
 *
 * Popover-based date selection components built on the enhanced Calendar.
 * Features presets sidebar, clearable selection, error/success states.
 */

// ============================================
// TYPES
// ============================================

export interface DatePreset {
  label: string;
  getValue: () => Date | DateRange;
}

export interface DatePickerEnhancedProps {
  /** Selected date */
  value?: Date;
  /** Callback when date changes */
  onChange?: (date: Date | undefined) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Date format string */
  dateFormat?: string;
  /** Disable the picker */
  disabled?: boolean;
  /** Allow clearing the selection */
  clearable?: boolean;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Error state */
  error?: boolean;
  /** Success state */
  success?: boolean;
  /** Show quick presets */
  showPresets?: boolean;
  /** Custom presets */
  presets?: DatePreset[];
  /** Dates with availability indicators (green dot) */
  availableDates?: Date[];
  /** Dates that are blocked (strikethrough) */
  blockedDates?: Date[];
  /** Dates with due indicators (clock badge) */
  dueDates?: Date[];
  /** Cell size: 44px (large) or 40px (default) */
  size?: "40" | "44";
  /** Popover alignment relative to trigger */
  popoverAlign?: "start" | "center" | "end";
  /** Popover side relative to trigger */
  popoverSide?: "top" | "right" | "bottom" | "left";
  /** Additional class names */
  className?: string;
}

export interface DateRangePickerEnhancedProps {
  /** Selected date range */
  value?: DateRange;
  /** Callback when range changes */
  onChange?: (range: DateRange | undefined) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Date format string */
  dateFormat?: string;
  /** Disable the picker */
  disabled?: boolean;
  /** Allow clearing the selection */
  clearable?: boolean;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Error state */
  error?: boolean;
  /** Success state */
  success?: boolean;
  /** Number of months to show */
  numberOfMonths?: 1 | 2;
  /** Show quick presets */
  showPresets?: boolean;
  /** Custom presets */
  presets?: DatePreset[];
  /** Show flexible dates toggle */
  showFlexibleDates?: boolean;
  /** Dates with availability indicators */
  availableDates?: Date[];
  /** Dates that are blocked */
  blockedDates?: Date[];
  /** Dates with due indicators (clock badge) */
  dueDates?: Date[];
  /** Cell size: 44px (large) or 40px (default) */
  size?: "40" | "44";
  /** Additional class names */
  className?: string;
}

// ============================================
// DEFAULT PRESETS
// ============================================

const defaultSinglePresets: DatePreset[] = [
  { label: "Today", getValue: () => startOfToday() },
  { label: "Tomorrow", getValue: () => addDays(startOfToday(), 1) },
  { label: "In 3 days", getValue: () => addDays(startOfToday(), 3) },
  { label: "In a week", getValue: () => addWeeks(startOfToday(), 1) },
];

const defaultRangePresets: DatePreset[] = [
  {
    label: "Today",
    getValue: () => ({ from: startOfToday(), to: startOfToday() }),
  },
  {
    label: "Yesterday",
    getValue: () => {
      const yesterday = subDays(startOfToday(), 1);
      return { from: yesterday, to: yesterday };
    },
  },
  {
    label: "Last 7 days",
    getValue: () => ({
      from: subDays(startOfToday(), 6),
      to: startOfToday(),
    }),
  },
  {
    label: "Last 30 days",
    getValue: () => ({
      from: subDays(startOfToday(), 29),
      to: startOfToday(),
    }),
  },
  {
    label: "This month",
    getValue: () => ({
      from: startOfMonth(startOfToday()),
      to: endOfMonth(startOfToday()),
    }),
  },
  {
    label: "This year",
    getValue: () => ({
      from: startOfYear(startOfToday()),
      to: endOfYear(startOfToday()),
    }),
  },
];

// ============================================
// PRESETS SIDEBAR COMPONENT
// ============================================

interface PresetsSidebarProps {
  presets: DatePreset[];
  selectedPreset?: string;
  onPresetClick: (preset: DatePreset) => void;
  onCustomClick?: () => void;
  showCustomOption?: boolean;
  isCustomSelected?: boolean;
}

function PresetsSidebar({
  presets,
  selectedPreset,
  onPresetClick,
  onCustomClick,
  showCustomOption = true,
  isCustomSelected = false,
}: PresetsSidebarProps) {
  return (
    <div className="w-44 border-r border-[var(--border-muted)] p-3">
      <div className="space-y-1">
        {presets.map((preset) => {
          const isSelected = selectedPreset === preset.label;
          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => onPresetClick(preset)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm",
                "transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2",
                isSelected
                  ? "bg-[var(--background-info)] text-[var(--foreground-info)]"
                  : "text-[var(--foreground-default)] hover:bg-[var(--background-interactive-hover)]"
              )}
            >
              {/* Radio indicator */}
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                  "transition-colors duration-150",
                  isSelected
                    ? "border-[var(--calendar-selected-background)] bg-[var(--calendar-selected-background)]"
                    : "border-[var(--border-interactive-default)] bg-[var(--background-interactive-default)]"
                )}
              >
                {isSelected && (
                  <span className="h-2 w-2 rounded-full bg-[var(--foreground-on-emphasis)]" />
                )}
              </span>
              <span className={cn(isSelected && "font-medium")}>{preset.label}</span>
            </button>
          );
        })}

        {/* Custom option */}
        {showCustomOption && (
          <button
            type="button"
            onClick={onCustomClick}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm",
              "transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2",
              isCustomSelected
                ? "bg-[var(--background-info)] text-[var(--foreground-info)]"
                : "text-[var(--foreground-default)] hover:bg-[var(--background-interactive-hover)]"
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                "transition-colors duration-150",
                isCustomSelected
                  ? "border-[var(--calendar-selected-background)] bg-[var(--calendar-selected-background)]"
                  : "border-[var(--border-interactive-default)] bg-[var(--background-interactive-default)]"
              )}
            >
              {isCustomSelected && (
                <span className="h-2 w-2 rounded-full bg-[var(--foreground-on-emphasis)]" />
              )}
            </span>
            <span className={cn(isCustomSelected && "font-medium")}>Custom</span>
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================
// TRIGGER BUTTON STYLES (shared)
// ============================================

const triggerClassName = (error: boolean, success: boolean, disabled: boolean) =>
  cn(
    "flex w-full items-center gap-3",
    "rounded-2xl border p-4",
    "bg-[var(--input-background)]",
    "border-[var(--input-border)]",
    "text-left text-lg leading-6",
    "transition-all duration-150",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2",
    !error && !success && "hover:border-[var(--input-border-hover)]",
    error && "border-[var(--input-border-error)] hover:border-[var(--input-border-error)]",
    success && "border-[var(--input-border-success)] hover:border-[var(--input-border-success)]",
    disabled && "cursor-not-allowed opacity-50"
  );

// ============================================
// CLEAR BUTTON
// ============================================

function ClearButton({
  onClick,
  label,
}: {
  onClick: (e: React.MouseEvent) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "-mr-2 inline-flex shrink-0 items-center justify-center",
        "h-8 w-8 rounded-lg",
        "text-[var(--foreground-subtle)]",
        "hover:bg-[var(--background-interactive-hover)] hover:text-[var(--foreground-default)]",
        "transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2"
      )}
      aria-label={label}
    >
      <X size={20} />
    </button>
  );
}

// ============================================
// DATE PICKER (SINGLE)
// ============================================

const DatePickerEnhanced = React.forwardRef<HTMLButtonElement, DatePickerEnhancedProps>(
  (
    {
      value,
      onChange,
      placeholder = "Select date",
      dateFormat = "EEE, MMM d, yyyy",
      disabled = false,
      clearable = true,
      minDate,
      maxDate,
      error = false,
      success = false,
      showPresets = true,
      presets = defaultSinglePresets,
      availableDates,
      blockedDates,
      dueDates,
      size = "44",
      popoverAlign = "start",
      popoverSide,
      className,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [currentMonth, setCurrentMonth] = React.useState(value || startOfToday());
    const [selectedPreset, setSelectedPreset] = React.useState<string | undefined>();

    const handleSelect = (date: Date | undefined) => {
      if (date) {
        onChange?.(date);
        setSelectedPreset(undefined);
        setOpen(false);
      }
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.(undefined);
      setSelectedPreset(undefined);
    };

    const handlePresetClick = (preset: DatePreset) => {
      const presetValue = preset.getValue();
      if (presetValue instanceof Date) {
        onChange?.(presetValue);
        setSelectedPreset(preset.label);
        setCurrentMonth(presetValue);
        setOpen(false);
      }
    };

    // Build disabled matchers for Calendar
    const disabledMatchers = React.useMemo(() => {
      const matchers: Array<{ before: Date } | { after: Date }> = [];
      if (minDate) matchers.push({ before: minDate });
      if (maxDate) matchers.push({ after: maxDate });
      return matchers;
    }, [minDate, maxDate]);

    const isCustomSelected = value && !selectedPreset;

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            ref={ref}
            type="button"
            disabled={disabled}
            aria-haspopup="dialog"
            aria-expanded={open}
            className={cn(triggerClassName(error, success, disabled), className)}
          >
            <CalendarBlank size={24} className="shrink-0 text-[var(--foreground-subtle)]" />
            <span
              className={cn(
                "flex-1 truncate",
                value ? "text-[var(--foreground-default)]" : "text-[var(--foreground-subtle)]"
              )}
            >
              {value ? format(value, dateFormat) : placeholder}
            </span>
            {clearable && value && <ClearButton onClick={handleClear} label="Clear date" />}
          </button>
        </PopoverTrigger>

        <PopoverContent
          aria-label="Choose a date"
          className="w-auto rounded-2xl border-[var(--border-muted)] bg-[var(--background-default)] p-0 shadow-[var(--shadow-dropdown)]"
          align={popoverAlign}
          side={popoverSide}
          sideOffset={8}
        >
          <div className="flex">
            {/* Presets Sidebar */}
            {showPresets && presets.length > 0 && (
              <PresetsSidebar
                presets={presets}
                selectedPreset={selectedPreset}
                onPresetClick={handlePresetClick}
                onCustomClick={() => setSelectedPreset(undefined)}
                isCustomSelected={isCustomSelected}
              />
            )}

            {/* Calendar */}
            <div className="min-w-[320px]">
              <Calendar
                mode="single"
                selected={value}
                onSelect={handleSelect}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                disabled={disabledMatchers.length > 0 ? disabledMatchers : undefined}
                availableDates={availableDates}
                blockedDates={blockedDates}
                dueDates={dueDates}
                size={size}
                showMonthYearDropdowns
                className="p-4"
              />

              {/* Footer */}
              <div className="flex items-center justify-end border-t border-[var(--border-muted)] px-4 py-3">
                <Button variant="tertiary" size="sm" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);

DatePickerEnhanced.displayName = "DatePicker";

// ============================================
// DATE RANGE PICKER
// ============================================

const DateRangePickerEnhanced = React.forwardRef<HTMLButtonElement, DateRangePickerEnhancedProps>(
  (
    {
      value,
      onChange,
      placeholder = "Select dates",
      dateFormat = "MMM d, yyyy",
      disabled = false,
      clearable = true,
      minDate,
      maxDate,
      error = false,
      success = false,
      numberOfMonths = 2,
      showPresets = true,
      presets = defaultRangePresets,
      showFlexibleDates = false,
      availableDates,
      blockedDates,
      dueDates,
      size = "44",
      className,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [currentMonth, setCurrentMonth] = React.useState(value?.from || startOfToday());
    const [hoverDate, setHoverDate] = React.useState<Date | null>(null);
    const [selectedPreset, setSelectedPreset] = React.useState<string | undefined>();

    // Internal range state for building the range click-by-click
    const [internalRange, setInternalRange] = React.useState<DateRange | undefined>(value);

    // Sync internal range when value prop changes
    React.useEffect(() => {
      setInternalRange(value);
    }, [value]);

    const handleSelect = (range: DateRange | undefined) => {
      setInternalRange(range);
      setSelectedPreset(undefined);
      // Don't close on select — user must click Apply
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.(undefined);
      setInternalRange(undefined);
      setSelectedPreset(undefined);
    };

    const handleApply = () => {
      onChange?.(internalRange);
      setOpen(false);
    };

    const handlePresetClick = (preset: DatePreset) => {
      const presetValue = preset.getValue();
      if ("from" in presetValue) {
        const range = presetValue as DateRange;
        setInternalRange(range);
        onChange?.(range);
        setSelectedPreset(preset.label);
        if (range.from) {
          setCurrentMonth(range.from);
        }
      }
    };

    // Build disabled matchers
    const disabledMatchers = React.useMemo(() => {
      const matchers: Array<{ before: Date } | { after: Date }> = [];
      if (minDate) matchers.push({ before: minDate });
      if (maxDate) matchers.push({ after: maxDate });
      return matchers;
    }, [minDate, maxDate]);

    // Hover preview modifiers for range selection
    const hoverModifiers = React.useMemo(() => {
      if (!internalRange?.from || internalRange?.to || !hoverDate) return {};
      const start = isBefore(internalRange.from, hoverDate) ? internalRange.from : hoverDate;
      const end = isAfter(hoverDate, internalRange.from) ? hoverDate : internalRange.from;
      return {
        range_preview: (date: Date) => {
          try {
            return isWithinInterval(date, { start, end });
          } catch {
            return false;
          }
        },
      };
    }, [internalRange, hoverDate]);

    const formatDisplayValue = () => {
      if (!value?.from) return placeholder;
      if (!value.to) return format(value.from, dateFormat);
      return `${format(value.from, dateFormat)} – ${format(value.to, dateFormat)}`;
    };

    const isCustomSelected = (value?.from || value?.to) && !selectedPreset;

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            ref={ref}
            type="button"
            disabled={disabled}
            aria-haspopup="dialog"
            aria-expanded={open}
            className={cn(triggerClassName(error, success, disabled), className)}
          >
            <CalendarBlank size={24} className="shrink-0 text-[var(--foreground-subtle)]" />
            <span
              className={cn(
                "flex-1 truncate",
                value?.from ? "text-[var(--foreground-default)]" : "text-[var(--foreground-subtle)]"
              )}
            >
              {formatDisplayValue()}
            </span>
            {clearable && value?.from && (
              <ClearButton onClick={handleClear} label="Clear date range" />
            )}
          </button>
        </PopoverTrigger>

        <PopoverContent
          aria-label="Choose a date range"
          className="w-auto rounded-2xl border-[var(--border-muted)] bg-[var(--background-default)] p-0 shadow-[var(--shadow-dropdown)]"
          align="start"
          sideOffset={8}
        >
          <div className="flex">
            {/* Presets Sidebar */}
            {showPresets && presets.length > 0 && (
              <PresetsSidebar
                presets={presets}
                selectedPreset={selectedPreset}
                onPresetClick={handlePresetClick}
                onCustomClick={() => setSelectedPreset(undefined)}
                isCustomSelected={isCustomSelected}
              />
            )}

            {/* Calendar Section */}
            <div>
              <Calendar
                mode="range"
                selected={internalRange}
                onSelect={handleSelect}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                numberOfMonths={numberOfMonths}
                disabled={disabledMatchers.length > 0 ? disabledMatchers : undefined}
                availableDates={availableDates}
                blockedDates={blockedDates}
                dueDates={dueDates}
                size={size}
                showMonthYearDropdowns
                modifiers={hoverModifiers}
                onDayMouseEnter={(date) => setHoverDate(date)}
                onDayMouseLeave={() => setHoverDate(null)}
                className="p-4"
              />

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 border-t border-[var(--border-muted)] px-4 py-3">
                <Button
                  variant="tertiary"
                  size="sm"
                  onClick={() => {
                    setInternalRange(undefined);
                    setSelectedPreset(undefined);
                  }}
                >
                  Clear
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleApply}
                  disabled={!internalRange?.from}
                  rightIcon={<Check size={16} weight="bold" />}
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);

DateRangePickerEnhanced.displayName = "DateRangePicker";

// ============================================
// EXPORTS
// ============================================

// Main exports (use these names)
const DatePicker = DatePickerEnhanced;
const DateRangePicker = DateRangePickerEnhanced;

// Type aliases for main exports
type DatePickerProps = DatePickerEnhancedProps;
type DateRangePickerProps = DateRangePickerEnhancedProps;

export {
  // Main exports
  DatePicker,
  DateRangePicker,
  defaultSinglePresets,
  defaultRangePresets,
  // Type exports
  type DatePickerProps,
  type DateRangePickerProps,
  // Legacy aliases (deprecated, use DatePicker/DateRangePicker instead)
  DatePickerEnhanced,
  DateRangePickerEnhanced,
};
