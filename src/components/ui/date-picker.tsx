"use client";

import * as React from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  addDays,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  isBefore,
  isAfter,
  startOfToday,
  addWeeks,
  nextSaturday,
  nextSunday,
  setMonth,
  setYear,
  getYear,
  getMonth,
  subDays,
  startOfYear,
  endOfYear,
} from "date-fns";
import { CalendarBlank, CaretLeft, CaretRight, CaretDown, X, Check } from "@phosphor-icons/react";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

/**
 * Enhanced DatePicker
 *
 * Features:
 * - Month/Year dropdown selectors
 * - Today indicator (outline style)
 * - Disabled dates with strikethrough
 * - Range selection with solid fill
 * - Presets sidebar with radio buttons
 * - Availability indicators (dots)
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
// CONSTANTS
// ============================================

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// Generate years array (10 years before and after current year)
const generateYears = () => {
  const currentYear = getYear(startOfToday());
  const years: number[] = [];
  for (let i = currentYear - 10; i <= currentYear + 10; i++) {
    years.push(i);
  }
  return years;
};

// ============================================
// MONTH/YEAR DROPDOWN COMPONENT
// ============================================

interface MonthYearSelectorProps {
  month: Date;
  onMonthChange: (date: Date) => void;
}

function MonthYearSelector({ month, onMonthChange }: MonthYearSelectorProps) {
  const [showMonthDropdown, setShowMonthDropdown] = React.useState(false);
  const [showYearDropdown, setShowYearDropdown] = React.useState(false);
  const years = React.useMemo(() => generateYears(), []);

  const handleMonthSelect = (monthIndex: number) => {
    onMonthChange(setMonth(month, monthIndex));
    setShowMonthDropdown(false);
  };

  const handleYearSelect = (year: number) => {
    onMonthChange(setYear(month, year));
    setShowYearDropdown(false);
  };

  return (
    <div className="flex items-center gap-1">
      {/* Month Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setShowMonthDropdown(!showMonthDropdown);
            setShowYearDropdown(false);
          }}
          className={cn(
            "flex items-center gap-1 rounded-lg px-2 py-1",
            "text-lg font-semibold text-[var(--foreground-default)]",
            "hover:bg-[var(--primitive-neutral-200)]",
            "transition-colors duration-150"
          )}
        >
          {format(month, "MMMM")}
          <CaretDown size={16} weight="bold" />
        </button>

        {showMonthDropdown && (
          <div className="absolute left-0 top-full z-50 mt-1 max-h-[280px] min-w-[140px] overflow-y-auto rounded-xl border border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-0)] py-2 shadow-lg">
            {MONTHS.map((monthName, index) => (
              <button
                key={monthName}
                type="button"
                onClick={() => handleMonthSelect(index)}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm",
                  "hover:bg-[var(--primitive-neutral-100)]",
                  "transition-colors duration-150",
                  getMonth(month) === index &&
                    "bg-[var(--primitive-green-100)] font-medium text-[var(--primitive-green-800)]"
                )}
              >
                {monthName}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Year Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setShowYearDropdown(!showYearDropdown);
            setShowMonthDropdown(false);
          }}
          className={cn(
            "flex items-center gap-1 rounded-lg px-2 py-1",
            "text-lg font-semibold text-[var(--foreground-default)]",
            "hover:bg-[var(--primitive-neutral-200)]",
            "transition-colors duration-150"
          )}
        >
          {format(month, "yyyy")}
          <CaretDown size={16} weight="bold" />
        </button>

        {showYearDropdown && (
          <div className="absolute left-0 top-full z-50 mt-1 max-h-[280px] min-w-[100px] overflow-y-auto rounded-xl border border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-0)] py-2 shadow-lg">
            {years.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => handleYearSelect(year)}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm",
                  "hover:bg-[var(--primitive-neutral-100)]",
                  "transition-colors duration-150",
                  getYear(month) === year &&
                    "bg-[var(--primitive-green-100)] font-medium text-[var(--primitive-green-800)]"
                )}
              >
                {year}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// CALENDAR MONTH COMPONENT
// ============================================

interface CalendarMonthProps {
  month: Date;
  selected?: Date;
  selectedRange?: DateRange;
  onSelect?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  availableDates?: Date[];
  blockedDates?: Date[];
  dueDates?: Date[];
  hoverDate?: Date | null;
  onHover?: (date: Date | null) => void;
  isRangeMode?: boolean;
  showHeader?: boolean;
  onMonthChange?: (date: Date) => void;
  /** Cell size: 44px (large) or 40px (default) */
  size?: "40" | "44";
}

function CalendarMonth({
  month,
  selected,
  selectedRange,
  onSelect,
  minDate,
  maxDate,
  availableDates,
  blockedDates,
  dueDates,
  hoverDate,
  onHover,
  isRangeMode,
  showHeader = true,
  onMonthChange,
  size = "44",
}: CalendarMonthProps) {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days: Date[] = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const isDateDisabled = (date: Date) => {
    if (!isSameMonth(date, month)) return false; // Don't disable outside month, just hide them
    if (minDate && isBefore(date, minDate)) return true;
    if (maxDate && isAfter(date, maxDate)) return true;
    if (blockedDates?.some((blocked) => isSameDay(date, blocked))) return true;
    return false;
  };

  const isDateSelected = (date: Date) => {
    if (selected && isSameDay(date, selected)) return true;
    if (selectedRange?.from && isSameDay(date, selectedRange.from)) return true;
    if (selectedRange?.to && isSameDay(date, selectedRange.to)) return true;
    return false;
  };

  const isDateInRange = (date: Date) => {
    if (!isRangeMode) return false;

    // Check actual selection range
    if (selectedRange?.from && selectedRange?.to) {
      return isWithinInterval(date, {
        start: selectedRange.from,
        end: selectedRange.to,
      });
    }

    // Check hover preview range
    if (selectedRange?.from && hoverDate && !selectedRange.to) {
      const start = isBefore(selectedRange.from, hoverDate) ? selectedRange.from : hoverDate;
      const end = isAfter(hoverDate, selectedRange.from) ? hoverDate : selectedRange.from;
      return isWithinInterval(date, { start, end });
    }

    return false;
  };

  const isRangeStart = (date: Date) => {
    return selectedRange?.from && isSameDay(date, selectedRange.from);
  };

  const isRangeEnd = (date: Date) => {
    return selectedRange?.to && isSameDay(date, selectedRange.to);
  };

  const hasAvailability = (date: Date) => {
    return availableDates?.some((avail) => isSameDay(date, avail));
  };

  const isDueDate = (date: Date) => {
    return dueDates?.some((due) => isSameDay(date, due));
  };

  const isToday = (date: Date) => {
    return isSameDay(date, startOfToday());
  };

  // Size classes based on Figma specs
  const cellSize = size === "44" ? "h-11 w-11" : "h-10 w-10";
  const buttonSize = size === "44" ? "h-11 w-11" : "h-10 w-10";

  return (
    <div className="p-4">
      {/* Month Header with Dropdowns */}
      {showHeader && onMonthChange && (
        <div className="mb-4 flex items-center justify-center">
          <MonthYearSelector month={month} onMonthChange={onMonthChange} />
        </div>
      )}

      {/* Simple header if no dropdown needed */}
      {showHeader && !onMonthChange && (
        <div className="mb-4 text-center">
          <span className="text-lg font-semibold text-[var(--foreground-default)]">
            {format(month, "MMMM yyyy")}
          </span>
        </div>
      )}

      {/* Weekday Headers */}
      <div className="mb-2 grid grid-cols-7 gap-0">
        {WEEKDAYS.map((weekday) => (
          <div
            key={weekday}
            className={cn(
              "flex items-center justify-center text-sm font-medium text-[var(--primitive-neutral-600)]",
              cellSize
            )}
          >
            {weekday}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0">
        {weeks.map((week, weekIndex) =>
          week.map((date, dayIndex) => {
            const disabled = isDateDisabled(date);
            const isSelected = isDateSelected(date);
            const inRange = isDateInRange(date);
            const rangeStart = isRangeStart(date);
            const rangeEnd = isRangeEnd(date);
            const available = hasAvailability(date);
            const due = isDueDate(date);
            const today = isToday(date);
            const outsideMonth = !isSameMonth(date, month);

            // Determine the state for styling (matching Figma states)
            const isDueSelected = due && isSelected;
            const isDueNotSelected = due && !isSelected;

            // For connected pill shape: determine if date is in the middle of a range
            const isRangeMiddle = inRange && !rangeStart && !rangeEnd;
            // Check if this is a single-day range (start and end are the same)
            const isSingleDayRange = rangeStart && rangeEnd;

            return (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={cn(
                  "relative flex items-center justify-center",
                  cellSize,
                  // Range background fill - apply to ALL dates in range including start/end
                  inRange && !outsideMonth && "bg-[var(--primitive-blue-100)]",
                  // Range start - rounded left only on the container
                  rangeStart && !outsideMonth && "rounded-l-full",
                  // Range end - rounded right only on the container
                  rangeEnd && !outsideMonth && "rounded-r-full"
                )}
              >
                <button
                  type="button"
                  disabled={disabled || outsideMonth}
                  onClick={() => !disabled && !outsideMonth && onSelect?.(date)}
                  onMouseEnter={() => !disabled && !outsideMonth && onHover?.(date)}
                  onMouseLeave={() => onHover?.(null)}
                  className={cn(
                    "relative flex items-center justify-center",
                    buttonSize,
                    "transition-all duration-150",
                    "focus-visible:border-[var(--input-border-focus)] focus-visible:outline-none",
                    // Base text - 18px per Figma
                    "text-lg font-normal leading-6",
                    // Border radius logic for connected pill shape
                    // Default: fully rounded
                    !isRangeMode && "rounded-2xl",
                    // Range mode: adjust radius based on position
                    isRangeMode && !inRange && "rounded-2xl",
                    // Single day range or non-range selected: fully rounded
                    isRangeMode && isSingleDayRange && "rounded-full",
                    // Range start (not single day): rounded left, flat right
                    isRangeMode &&
                      rangeStart &&
                      !isSingleDayRange &&
                      "rounded-l-full rounded-r-none",
                    // Range end (not single day): flat left, rounded right
                    isRangeMode && rangeEnd && !isSingleDayRange && "rounded-l-none rounded-r-full",
                    // Range middle: no radius (square) for seamless connection
                    isRangeMode && isRangeMiddle && "rounded-none",
                    // Outside month (other month state) - muted text
                    outsideMonth && "text-[var(--primitive-neutral-500)]",
                    // Default state - white bg, neutral-800 text
                    !disabled &&
                      !isSelected &&
                      !today &&
                      !outsideMonth &&
                      !due &&
                      !inRange &&
                      "bg-[var(--primitive-neutral-0)] text-[var(--primitive-neutral-800)] hover:bg-[var(--primitive-neutral-200)]",
                    // In range but not selected - transparent bg to show container's blue-100
                    !disabled &&
                      !isSelected &&
                      !outsideMonth &&
                      inRange &&
                      "bg-transparent text-[var(--primitive-neutral-800)] hover:bg-[var(--primitive-blue-200)]",
                    // Today state - neutral-200 bg (filled), bold text
                    today &&
                      !isSelected &&
                      !outsideMonth &&
                      !due &&
                      !inRange &&
                      "bg-[var(--primitive-neutral-200)] font-bold text-[var(--primitive-neutral-800)]",
                    // Today in range but not selected
                    today &&
                      !isSelected &&
                      !outsideMonth &&
                      !due &&
                      inRange &&
                      "bg-transparent font-bold text-[var(--primitive-neutral-800)]",
                    // Selected state - blue-400 bg, white text, bold
                    isSelected &&
                      !outsideMonth &&
                      !due &&
                      "bg-[var(--primitive-blue-400)] font-bold text-[var(--primitive-neutral-0)]",
                    // Due date (not selected) - blue-200 bg, blue-800 text
                    isDueNotSelected &&
                      !outsideMonth &&
                      "bg-[var(--primitive-blue-200)] text-[var(--primitive-blue-800)]",
                    // Due date (selected) - blue-400 bg, white text, bold
                    isDueSelected &&
                      !outsideMonth &&
                      "bg-[var(--primitive-blue-400)] font-bold text-[var(--primitive-neutral-0)]",
                    // Disabled state - neutral-500 text, no background
                    disabled &&
                      !outsideMonth &&
                      "cursor-not-allowed text-[var(--primitive-neutral-500)]"
                  )}
                >
                  <span>{format(date, "d")}</span>

                  {/* Diagonal strikethrough for disabled dates (matching Figma) */}
                  {disabled && !outsideMonth && (
                    <span
                      className="pointer-events-none absolute inset-0 flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <svg width="30" height="1" viewBox="0 0 30 1" className="rotate-[-20deg]">
                        <line
                          x1="0"
                          y1="0.5"
                          x2="30"
                          y2="0.5"
                          stroke="var(--primitive-neutral-500)"
                          strokeWidth="1"
                        />
                      </svg>
                    </span>
                  )}

                  {/* Due date clock badge (matching Figma) */}
                  {due && !outsideMonth && (
                    <span
                      className={cn(
                        "absolute flex items-center justify-center rounded-full",
                        "border-2 border-[var(--primitive-neutral-0)] bg-[var(--primitive-blue-100)]",
                        size === "44"
                          ? "bottom-0 right-0 -mb-0.5 -mr-0.5 h-5 w-5"
                          : "bottom-0 right-0 h-5 w-5"
                      )}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          stroke="var(--primitive-blue-500)"
                          strokeWidth="2"
                        />
                        <path
                          d="M12 7V12L15 15"
                          stroke="var(--primitive-blue-500)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  )}

                  {/* Availability indicator (green dot) */}
                  {available && !disabled && !outsideMonth && !due && (
                    <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[var(--primitive-green-500)]" />
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ============================================
// PRESETS SIDEBAR COMPONENT
// ============================================

interface PresetsSidebarProps {
  presets: DatePreset[];
  selectedPreset?: string;
  onPresetClick: (preset: DatePreset) => void;
  showCustomOption?: boolean;
  isCustomSelected?: boolean;
}

function PresetsSidebar({
  presets,
  selectedPreset,
  onPresetClick,
  showCustomOption = true,
  isCustomSelected = false,
}: PresetsSidebarProps) {
  return (
    <div className="w-44 border-r border-[var(--primitive-neutral-200)] p-3">
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
                isSelected
                  ? "bg-[var(--primitive-blue-100)] text-[var(--primitive-blue-800)]"
                  : "text-[var(--foreground-default)] hover:bg-[var(--primitive-neutral-100)]"
              )}
            >
              {/* Radio indicator - matches RadioGroupItem styling */}
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                  "transition-colors duration-150",
                  isSelected
                    ? "border-[var(--primitive-blue-500)] bg-[var(--primitive-blue-500)]"
                    : "border-[var(--primitive-neutral-400)] bg-[var(--primitive-neutral-100)]"
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
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm",
              "transition-colors duration-150",
              isCustomSelected
                ? "bg-[var(--primitive-blue-100)] text-[var(--primitive-blue-800)]"
                : "text-[var(--foreground-default)] hover:bg-[var(--primitive-neutral-100)]"
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                "transition-colors duration-150",
                isCustomSelected
                  ? "border-[var(--primitive-blue-500)] bg-[var(--primitive-blue-500)]"
                  : "border-[var(--primitive-neutral-400)] bg-[var(--primitive-neutral-100)]"
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
// ENHANCED DATE PICKER (SINGLE)
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
      className,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [currentMonth, setCurrentMonth] = React.useState(value || startOfToday());
    const [selectedPreset, setSelectedPreset] = React.useState<string | undefined>();

    const handleSelect = (date: Date) => {
      onChange?.(date);
      setSelectedPreset(undefined); // Clear preset when manually selecting
      setOpen(false);
    };

    const handleClear = (e: React.MouseEvent | React.KeyboardEvent) => {
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

    const goToPreviousMonth = () => {
      setCurrentMonth((prev) => subMonths(prev, 1));
    };

    const goToNextMonth = () => {
      setCurrentMonth((prev) => addMonths(prev, 1));
    };

    const isCustomSelected = value && !selectedPreset;

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            ref={ref}
            type="button"
            disabled={disabled}
            className={cn(
              // Base styles matching Input component
              "flex w-full items-center gap-3",
              "rounded-2xl border p-4",
              "bg-[var(--input-background)]",
              "border-[var(--input-border)]",
              "text-left text-lg leading-6",
              "transition-all duration-150",
              "focus-visible:border-[var(--input-border-focus)] focus-visible:outline-none",
              // Default state
              !error && !success && ["hover:border-[var(--input-border-hover)]"],
              // Error state
              error && [
                "border-[var(--input-border-error)]",
                "hover:border-[var(--primitive-red-700)]",
              ],
              // Success state
              success && [
                "border-[var(--input-border-success)]",
                "hover:border-[var(--primitive-green-700)]",
              ],
              // Disabled state
              disabled && "cursor-not-allowed opacity-50",
              className
            )}
          >
            <CalendarBlank size={24} className="shrink-0 text-[var(--primitive-neutral-600)]" />
            <span
              className={cn(
                "flex-1 truncate",
                value ? "text-[var(--foreground-default)]" : "text-[var(--primitive-neutral-600)]"
              )}
            >
              {value ? format(value, dateFormat) : placeholder}
            </span>
            {clearable && value && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleClear(e);
                  }
                }}
                className={cn(
                  "-mr-2 inline-flex shrink-0 items-center justify-center",
                  "h-8 w-8 rounded-lg",
                  "text-[var(--primitive-neutral-600)]",
                  "hover:bg-[var(--primitive-neutral-200)] hover:text-[var(--foreground-default)]",
                  "transition-colors duration-150",
                  "cursor-pointer",
                  "focus-visible:border-[var(--input-border-focus)] focus-visible:outline-none"
                )}
                aria-label="Clear date"
              >
                <X size={20} />
              </span>
            )}
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto rounded-2xl border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-0)] p-0 shadow-xl"
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
                isCustomSelected={isCustomSelected}
              />
            )}

            {/* Calendar */}
            <div className="min-w-[320px]">
              {/* Navigation Header */}
              <div className="flex items-center justify-between px-4 pt-4">
                <button
                  type="button"
                  onClick={goToPreviousMonth}
                  className={cn(
                    "inline-flex items-center justify-center",
                    "h-10 w-10 rounded-full",
                    "hover:bg-[var(--primitive-neutral-200)]",
                    "text-[var(--foreground-default)]",
                    "transition-colors duration-150",
                    "focus-visible:border-[var(--input-border-focus)] focus-visible:outline-none"
                  )}
                >
                  <CaretLeft size={24} weight="bold" />
                </button>

                {/* Month/Year Selector */}
                <MonthYearSelector month={currentMonth} onMonthChange={setCurrentMonth} />

                <button
                  type="button"
                  onClick={goToNextMonth}
                  className={cn(
                    "inline-flex items-center justify-center",
                    "h-10 w-10 rounded-full",
                    "hover:bg-[var(--primitive-neutral-200)]",
                    "text-[var(--foreground-default)]",
                    "transition-colors duration-150",
                    "focus-visible:border-[var(--input-border-focus)] focus-visible:outline-none"
                  )}
                >
                  <CaretRight size={24} weight="bold" />
                </button>
              </div>

              <CalendarMonth
                month={currentMonth}
                selected={value}
                onSelect={handleSelect}
                minDate={minDate}
                maxDate={maxDate}
                availableDates={availableDates}
                blockedDates={blockedDates}
                dueDates={dueDates}
                size={size}
                showHeader={false}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);

DatePickerEnhanced.displayName = "DatePicker";

// ============================================
// ENHANCED DATE RANGE PICKER
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

    const handleSelect = (date: Date) => {
      setSelectedPreset(undefined); // Clear preset when manually selecting

      if (!value?.from || (value.from && value.to)) {
        // Start new selection
        onChange?.({ from: date, to: undefined });
      } else {
        // Complete the range
        if (isBefore(date, value.from)) {
          onChange?.({ from: date, to: value.from });
        } else {
          onChange?.({ from: value.from, to: date });
        }
      }
    };

    const handleClear = (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      onChange?.(undefined);
      setSelectedPreset(undefined);
    };

    const handlePresetClick = (preset: DatePreset) => {
      const presetValue = preset.getValue();
      if ("from" in presetValue) {
        onChange?.(presetValue as DateRange);
        setSelectedPreset(preset.label);
        if ((presetValue as DateRange).from) {
          setCurrentMonth((presetValue as DateRange).from!);
        }
      }
    };

    const goToPreviousMonth = () => {
      setCurrentMonth((prev) => subMonths(prev, 1));
    };

    const goToNextMonth = () => {
      setCurrentMonth((prev) => addMonths(prev, 1));
    };

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
            className={cn(
              // Base styles matching Input component
              "flex w-full items-center gap-3",
              "rounded-2xl border p-4",
              "bg-[var(--input-background)]",
              "border-[var(--input-border)]",
              "text-left text-lg leading-6",
              "transition-all duration-150",
              "focus-visible:border-[var(--input-border-focus)] focus-visible:outline-none",
              // Default state
              !error && !success && ["hover:border-[var(--input-border-hover)]"],
              // Error state
              error && [
                "border-[var(--input-border-error)]",
                "hover:border-[var(--primitive-red-700)]",
              ],
              // Success state
              success && [
                "border-[var(--input-border-success)]",
                "hover:border-[var(--primitive-green-700)]",
              ],
              // Disabled state
              disabled && "cursor-not-allowed opacity-50",
              className
            )}
          >
            <CalendarBlank size={24} className="shrink-0 text-[var(--primitive-neutral-600)]" />
            <span
              className={cn(
                "flex-1 truncate",
                value?.from
                  ? "text-[var(--foreground-default)]"
                  : "text-[var(--primitive-neutral-600)]"
              )}
            >
              {formatDisplayValue()}
            </span>
            {clearable && value?.from && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleClear(e);
                  }
                }}
                className={cn(
                  "-mr-2 inline-flex shrink-0 items-center justify-center",
                  "h-8 w-8 rounded-lg",
                  "text-[var(--primitive-neutral-600)]",
                  "hover:bg-[var(--primitive-neutral-200)] hover:text-[var(--foreground-default)]",
                  "transition-colors duration-150",
                  "cursor-pointer",
                  "focus-visible:border-[var(--input-border-focus)] focus-visible:outline-none"
                )}
                aria-label="Clear date range"
              >
                <X size={20} />
              </span>
            )}
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto rounded-2xl border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-0)] p-0 shadow-xl"
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
                isCustomSelected={isCustomSelected}
              />
            )}

            {/* Calendar Section */}
            <div>
              {/* Navigation Header */}
              <div className="flex items-center justify-between px-4 pt-4">
                <button
                  type="button"
                  onClick={goToPreviousMonth}
                  className={cn(
                    "inline-flex items-center justify-center",
                    "h-10 w-10 rounded-full",
                    "hover:bg-[var(--primitive-neutral-200)]",
                    "text-[var(--foreground-default)]",
                    "transition-colors duration-150",
                    "focus-visible:border-[var(--input-border-focus)] focus-visible:outline-none"
                  )}
                >
                  <CaretLeft size={24} weight="bold" />
                </button>

                {/* Show two month selectors for dual view */}
                <div className="flex items-center gap-8">
                  <MonthYearSelector month={currentMonth} onMonthChange={setCurrentMonth} />
                  {numberOfMonths === 2 && (
                    <MonthYearSelector
                      month={addMonths(currentMonth, 1)}
                      onMonthChange={(date) => setCurrentMonth(subMonths(date, 1))}
                    />
                  )}
                </div>

                <button
                  type="button"
                  onClick={goToNextMonth}
                  className={cn(
                    "inline-flex items-center justify-center",
                    "h-10 w-10 rounded-full",
                    "hover:bg-[var(--primitive-neutral-200)]",
                    "text-[var(--foreground-default)]",
                    "transition-colors duration-150",
                    "focus-visible:border-[var(--input-border-focus)] focus-visible:outline-none"
                  )}
                >
                  <CaretRight size={24} weight="bold" />
                </button>
              </div>

              {/* Side-by-Side Months */}
              <div className="flex">
                <CalendarMonth
                  month={currentMonth}
                  selectedRange={value}
                  onSelect={handleSelect}
                  minDate={minDate}
                  maxDate={maxDate}
                  availableDates={availableDates}
                  blockedDates={blockedDates}
                  dueDates={dueDates}
                  size={size}
                  hoverDate={hoverDate}
                  onHover={setHoverDate}
                  isRangeMode
                  showHeader={false}
                />
                {numberOfMonths === 2 && (
                  <CalendarMonth
                    month={addMonths(currentMonth, 1)}
                    selectedRange={value}
                    onSelect={handleSelect}
                    minDate={minDate}
                    maxDate={maxDate}
                    availableDates={availableDates}
                    blockedDates={blockedDates}
                    dueDates={dueDates}
                    size={size}
                    hoverDate={hoverDate}
                    onHover={setHoverDate}
                    isRangeMode
                    showHeader={false}
                  />
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 border-t border-[var(--primitive-neutral-200)] px-4 py-3">
                <Button
                  variant="tertiary"
                  size="sm"
                  onClick={() => {
                    onChange?.(undefined);
                    setSelectedPreset(undefined);
                  }}
                >
                  Clear
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setOpen(false)}
                  disabled={!value?.from}
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

// Re-export the interface types under legacy names (already exported inline)
// DatePickerEnhancedProps and DateRangePickerEnhancedProps are exported from their interface declarations
