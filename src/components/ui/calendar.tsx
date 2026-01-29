"use client";

import * as React from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { cn } from "@/lib/utils";

/**
 * Calendar component for date selection
 *
 * Based on Figma specs:
 * - Day cell: 40px, 16px border radius
 * - Selected: blue-400 bg, white text, bold
 * - Today: neutral-200 bg, bold text
 * - Range: blue-100 bg
 * - Navigation: IconButtons with neutral-200 bg
 * - Day labels: 14px, neutral-800
 * - Date numbers: 16px (adjusted from Figma's 18px for balance)
 * - Header: 18px font-semibold (adjusted from Figma's 24px)
 *
 * Uses react-day-picker v9 classNames API
 */

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
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
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primitive-green-500)] focus-visible:ring-offset-2"
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
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primitive-green-500)] focus-visible:ring-offset-2"
        ),
        chevron: cn(defaultClassNames.chevron, "h-6 w-6"),

        // Table / Grid
        month_grid: cn(defaultClassNames.month_grid, "w-full border-collapse"),
        weekdays: cn(defaultClassNames.weekdays, "flex"),
        weekday: cn(
          defaultClassNames.weekday,
          "text-[var(--calendar-weekday-foreground)]",
          "w-10 h-10 flex items-center justify-center",
          "font-medium text-sm"
        ),
        weeks: cn(defaultClassNames.weeks),
        week: cn(defaultClassNames.week, "flex w-full mt-1"),

        // Day cells (the <td> wrapper)
        day: cn(
          defaultClassNames.day,
          "relative p-0 text-center text-base focus-within:relative focus-within:z-20",
          "h-10 w-10"
        ),

        // Day button (the clickable button inside)
        day_button: cn(
          defaultClassNames.day_button,
          "inline-flex items-center justify-center",
          "h-10 w-10 p-0 font-normal text-base",
          "rounded-2xl",
          "text-[var(--foreground-default)]",
          "hover:bg-[var(--calendar-hover-background)]",
          "transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primitive-green-500)] focus-visible:ring-offset-2"
        ),

        // States
        selected: cn(
          "bg-[var(--calendar-selected-background)] text-[var(--calendar-selected-foreground)] font-bold rounded-2xl",
          "hover:bg-[var(--calendar-selected-background)] hover:text-[var(--calendar-selected-foreground)]",
          "focus:bg-[var(--calendar-selected-background)] focus:text-[var(--calendar-selected-foreground)]"
        ),
        today: cn(
          "bg-[var(--calendar-today-background)] text-[var(--calendar-today-foreground)] font-bold rounded-2xl"
        ),
        outside: cn(
          "text-[var(--calendar-outside-foreground)]",
          "aria-selected:bg-[var(--calendar-range-background)]/50",
          "aria-selected:text-[var(--calendar-outside-foreground)]"
        ),
        disabled: cn("text-[var(--calendar-disabled-foreground)] opacity-50"),
        hidden: cn("invisible"),

        // Range selection
        range_start: cn("range_start rounded-l-2xl"),
        range_end: cn("range_end rounded-r-2xl"),
        range_middle: cn(
          "aria-selected:bg-[var(--calendar-range-background)]",
          "aria-selected:text-[var(--calendar-range-foreground)]",
          "aria-selected:rounded-none"
        ),

        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <CaretLeft size={24} weight="bold" />
          ) : (
            <CaretRight size={24} weight="bold" />
          ),
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
