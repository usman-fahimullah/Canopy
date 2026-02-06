"use client";

import * as React from "react";
import { isSameDay } from "date-fns";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import {
  DayPicker,
  getDefaultClassNames,
  type DayButtonProps as RdpDayButtonProps,
  type DayProps as RdpDayProps,
  type MonthCaptionProps as RdpMonthCaptionProps,
} from "react-day-picker";
import type { Matcher } from "react-day-picker";
import { cn } from "@/lib/utils";
import { MonthYearSelector } from "@/components/ui/calendar-month-year-selector";

/**
 * Calendar component for date selection
 *
 * Enhanced with:
 * - Cell size variants (40px default, 44px large)
 * - Availability indicators (green dot)
 * - Due date badges (clock icon overlay)
 * - Blocked date strikethrough
 * - Month/Year dropdown selectors
 * - Connected pill shape for range selection
 * - Hover preview for range selection (via onDayMouseEnter/onDayMouseLeave)
 *
 * Uses react-day-picker v9 component overrides for custom rendering
 * while preserving built-in keyboard navigation and accessibility.
 */

// ============================================
// TYPES
// ============================================

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  /** Cell size: "40" (default) or "44" (large) */
  size?: "40" | "44";
  /** Dates with green availability dot */
  availableDates?: Date[];
  /** Dates with diagonal strikethrough (also merged into disabled) */
  blockedDates?: Date[];
  /** Dates with clock badge overlay */
  dueDates?: Date[];
  /** Show month/year dropdown selectors instead of text label */
  showMonthYearDropdowns?: boolean;
};

// ============================================
// CUSTOM DAY COMPONENT (td wrapper)
// Handles connected pill shape for ranges
// ============================================

function CustomDay({ day, modifiers, ...tdProps }: RdpDayProps) {
  const isOutside = modifiers.outside;
  const isInRange = modifiers.range_start || modifiers.range_middle || modifiers.range_end;
  const isPreview = modifiers.range_preview;
  const showRangeBg = (isInRange || isPreview) && !isOutside;

  // Determine if this is a single-day range (start === end)
  const isSingleDay = modifiers.range_start && modifiers.range_end;

  return (
    <td
      {...tdProps}
      className={cn(
        tdProps.className,
        // Range/preview background on the container
        showRangeBg && "bg-[var(--calendar-range-background)]",
        // Pill shape rounding
        modifiers.range_start && !isOutside && !isSingleDay && "rounded-l-full",
        modifiers.range_end && !isOutside && !isSingleDay && "rounded-r-full",
        isSingleDay && !isOutside && "rounded-full",
        // Preview-only dates (not yet selected) get same rounding
        isPreview && !isInRange && !isOutside && modifiers.range_preview_start && "rounded-l-full",
        isPreview && !isInRange && !isOutside && modifiers.range_preview_end && "rounded-r-full"
      )}
    />
  );
}

// ============================================
// CUSTOM DAY BUTTON COMPONENT
// Handles due dates, availability dots,
// blocked strikethrough, and all state styling
// ============================================

interface CustomDayButtonWrapperProps {
  size: "40" | "44";
  dueDates?: Date[];
  availableDates?: Date[];
  blockedDates?: Date[];
}

function createCustomDayButton({
  size,
  dueDates,
  availableDates,
  blockedDates,
}: CustomDayButtonWrapperProps) {
  const cellSize = size === "44" ? "h-11 w-11" : "h-10 w-10";

  function CustomDayButton({ day, modifiers, ...buttonProps }: RdpDayButtonProps) {
    const ref = React.useRef<HTMLButtonElement>(null);

    // Preserve react-day-picker focus management
    React.useEffect(() => {
      if (modifiers.focused) ref.current?.focus();
    }, [modifiers.focused]);

    const isDue = dueDates?.some((d) => isSameDay(d, day.date));
    const isAvailable = availableDates?.some((d) => isSameDay(d, day.date));
    const isBlocked = blockedDates?.some((d) => isSameDay(d, day.date));
    const isOutside = modifiers.outside;

    // Determine due date sub-states
    const isDueSelected = isDue && modifiers.selected;
    const isDueNotSelected = isDue && !modifiers.selected;

    // Range position for border radius
    const isRangeMiddle = modifiers.range_middle;
    const isRangeStart = modifiers.range_start;
    const isRangeEnd = modifiers.range_end;
    const isSingleDay = isRangeStart && isRangeEnd;
    const isInRange =
      modifiers.range_start ||
      modifiers.range_middle ||
      modifiers.range_end ||
      modifiers.range_preview;

    return (
      <button
        ref={ref}
        {...buttonProps}
        className={cn(
          // Base layout
          "relative flex items-center justify-center",
          cellSize,
          "transition-all duration-150",
          // Text style - 18px per Figma
          "text-lg font-normal leading-6",
          // Focus ring
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2",

          // Border radius logic for connected pill shape
          !isInRange && "rounded-2xl",
          isSingleDay && "rounded-full",
          isRangeStart && !isSingleDay && "rounded-l-full rounded-r-none",
          isRangeEnd && !isSingleDay && "rounded-l-none rounded-r-full",
          isRangeMiddle && "rounded-none",

          // Outside month - muted text
          isOutside && "text-[var(--calendar-outside-foreground)]",

          // Default state
          !modifiers.disabled &&
            !modifiers.selected &&
            !modifiers.today &&
            !isOutside &&
            !isDue &&
            !isInRange &&
            "bg-[var(--background-default)] text-[var(--foreground-default)] hover:bg-[var(--calendar-hover-background)]",

          // In range but not selected - transparent to show container bg
          !modifiers.disabled &&
            !modifiers.selected &&
            !isOutside &&
            isInRange &&
            !isDue &&
            "bg-transparent text-[var(--foreground-default)] hover:bg-[var(--calendar-range-hover-background)]",

          // Today (not selected, not in range, not due)
          modifiers.today &&
            !modifiers.selected &&
            !isOutside &&
            !isDue &&
            !isInRange &&
            "bg-[var(--calendar-today-background)] font-bold text-[var(--calendar-today-foreground)]",

          // Today in range but not selected
          modifiers.today &&
            !modifiers.selected &&
            !isOutside &&
            !isDue &&
            isInRange &&
            "bg-transparent font-bold text-[var(--foreground-default)]",

          // Selected state (not due)
          modifiers.selected &&
            !isOutside &&
            !isDue &&
            "bg-[var(--calendar-selected-background)] font-bold text-[var(--calendar-selected-foreground)]",

          // Due date (not selected)
          isDueNotSelected &&
            !isOutside &&
            "bg-[var(--calendar-due-background)] text-[var(--calendar-due-foreground)]",

          // Due date (selected)
          isDueSelected &&
            !isOutside &&
            "bg-[var(--calendar-selected-background)] font-bold text-[var(--calendar-selected-foreground)]",

          // Disabled / blocked
          modifiers.disabled &&
            !isOutside &&
            "cursor-not-allowed text-[var(--calendar-disabled-foreground)]"
        )}
      >
        <span>{buttonProps.children}</span>

        {/* Diagonal strikethrough for blocked dates */}
        {isBlocked && !isOutside && (
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
                stroke="var(--calendar-blocked-strikethrough)"
                strokeWidth="1"
              />
            </svg>
          </span>
        )}

        {/* Due date clock badge */}
        {isDue && !isOutside && (
          <span
            className={cn(
              "absolute flex items-center justify-center rounded-full",
              "border-2 border-[var(--calendar-due-badge-border)]",
              "bg-[var(--calendar-due-badge-background)]",
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
                stroke="var(--calendar-due-badge-icon)"
                strokeWidth="2"
              />
              <path
                d="M12 7V12L15 15"
                stroke="var(--calendar-due-badge-icon)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}

        {/* Availability indicator (green dot) */}
        {isAvailable && !modifiers.disabled && !isOutside && !isDue && (
          <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[var(--calendar-availability-indicator)]" />
        )}
      </button>
    );
  }

  CustomDayButton.displayName = "CustomDayButton";
  return CustomDayButton;
}

// ============================================
// CUSTOM MONTH CAPTION
// Renders MonthYearSelector dropdown when enabled,
// default label otherwise
// ============================================

interface CustomMonthCaptionWrapperProps {
  showMonthYearDropdowns: boolean;
  onCalendarMonthChange?: (date: Date) => void;
}

function createCustomMonthCaption({
  showMonthYearDropdowns,
  onCalendarMonthChange,
}: CustomMonthCaptionWrapperProps) {
  function CustomMonthCaption({ calendarMonth, displayIndex, ...divProps }: RdpMonthCaptionProps) {
    if (showMonthYearDropdowns && onCalendarMonthChange) {
      return (
        <div {...divProps}>
          <MonthYearSelector month={calendarMonth.date} onMonthChange={onCalendarMonthChange} />
        </div>
      );
    }

    // Default caption: month and year text
    return <div {...divProps} />;
  }

  CustomMonthCaption.displayName = "CustomMonthCaption";
  return CustomMonthCaption;
}

// ============================================
// CALENDAR COMPONENT
// ============================================

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  size = "40",
  availableDates,
  blockedDates,
  dueDates,
  showMonthYearDropdowns = false,
  disabled,
  modifiers: externalModifiers,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();
  const cellSize = size === "44" ? "h-11 w-11" : "h-10 w-10";

  // Merge blocked dates into the disabled prop
  const mergedDisabled = React.useMemo<Matcher[]>(() => {
    const items: Matcher[] = [];
    if (disabled) {
      if (Array.isArray(disabled)) {
        items.push(...disabled);
      } else {
        items.push(disabled);
      }
    }
    if (blockedDates?.length) {
      items.push(...blockedDates);
    }
    return items;
  }, [disabled, blockedDates]);

  // Add custom modifiers for due/available/blocked
  const mergedModifiers = React.useMemo(() => {
    return {
      due: dueDates || [],
      available: availableDates || [],
      blocked: blockedDates || [],
      ...externalModifiers,
    };
  }, [dueDates, availableDates, blockedDates, externalModifiers]);

  // Memoize component factories so they don't recreate on every render
  const CustomDayButton = React.useMemo(
    () =>
      createCustomDayButton({
        size,
        dueDates,
        availableDates,
        blockedDates,
      }),
    [size, dueDates, availableDates, blockedDates]
  );

  const CustomMonthCaption = React.useMemo(
    () =>
      createCustomMonthCaption({
        showMonthYearDropdowns,
        onCalendarMonthChange: props.onMonthChange,
      }),
    [showMonthYearDropdowns, props.onMonthChange]
  );

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      disabled={mergedDisabled.length > 0 ? mergedDisabled : undefined}
      modifiers={mergedModifiers}
      classNames={{
        // Root and structure
        root: cn(defaultClassNames.root),
        months: cn(defaultClassNames.months, "flex flex-col sm:flex-row gap-4"),
        month: cn(defaultClassNames.month, "space-y-4"),

        // Caption / Header
        month_caption: cn(
          defaultClassNames.month_caption,
          "flex justify-center pt-1 relative items-center px-10"
        ),
        caption_label: cn(
          defaultClassNames.caption_label,
          "text-lg font-semibold text-[var(--calendar-header-foreground)]"
        ),

        // Navigation
        nav: cn(defaultClassNames.nav, "flex items-center gap-1"),
        button_previous: cn(
          defaultClassNames.button_previous,
          "absolute left-1",
          "inline-flex items-center justify-center",
          "h-10 w-10 p-0 rounded-2xl",
          "bg-[var(--calendar-nav-background)]",
          "hover:bg-[var(--calendar-nav-background-hover)]",
          "text-[var(--calendar-nav-foreground)]",
          "transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2"
        ),
        button_next: cn(
          defaultClassNames.button_next,
          "absolute right-1",
          "inline-flex items-center justify-center",
          "h-10 w-10 p-0 rounded-2xl",
          "bg-[var(--calendar-nav-background)]",
          "hover:bg-[var(--calendar-nav-background-hover)]",
          "text-[var(--calendar-nav-foreground)]",
          "transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2"
        ),
        chevron: cn(defaultClassNames.chevron, "h-6 w-6"),

        // Table / Grid
        month_grid: cn(defaultClassNames.month_grid, "w-full border-collapse"),
        weekdays: cn(defaultClassNames.weekdays, "flex"),
        weekday: cn(
          defaultClassNames.weekday,
          "text-[var(--calendar-weekday-foreground)]",
          cellSize,
          "flex items-center justify-center",
          "font-medium text-sm"
        ),
        weeks: cn(defaultClassNames.weeks),
        week: cn(defaultClassNames.week, "flex w-full mt-1"),

        // Day cells (the <td> wrapper) — base sizing
        day: cn(
          defaultClassNames.day,
          "relative p-0 text-center text-base focus-within:relative focus-within:z-20",
          cellSize
        ),

        // Day button — base class (mostly overridden by CustomDayButton)
        day_button: cn(defaultClassNames.day_button),

        // States — mostly handled by CustomDayButton, but classNames
        // still applied by react-day-picker on the Day <td>
        selected: "",
        today: "",
        outside: "",
        disabled: "",
        hidden: cn("invisible"),
        range_start: "",
        range_end: "",
        range_middle: "",

        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <CaretLeft size={24} weight="bold" />
          ) : (
            <CaretRight size={24} weight="bold" />
          ),
        Day: CustomDay,
        DayButton: CustomDayButton,
        MonthCaption: CustomMonthCaption,
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
