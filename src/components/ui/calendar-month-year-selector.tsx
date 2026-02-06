"use client";

import * as React from "react";
import { format, setMonth, setYear, getMonth, getYear, startOfToday } from "date-fns";
import { CaretDown } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

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

/** Generate years array (10 years before and after current year) */
function generateYears() {
  const currentYear = getYear(startOfToday());
  const years: number[] = [];
  for (let i = currentYear - 10; i <= currentYear + 10; i++) {
    years.push(i);
  }
  return years;
}

export interface MonthYearSelectorProps {
  month: Date;
  onMonthChange: (date: Date) => void;
}

function MonthYearSelector({ month, onMonthChange }: MonthYearSelectorProps) {
  const [showMonthDropdown, setShowMonthDropdown] = React.useState(false);
  const [showYearDropdown, setShowYearDropdown] = React.useState(false);
  const years = React.useMemo(() => generateYears(), []);

  const monthRef = React.useRef<HTMLDivElement>(null);
  const yearRef = React.useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (monthRef.current && !monthRef.current.contains(event.target as Node)) {
        setShowMonthDropdown(false);
      }
      if (yearRef.current && !yearRef.current.contains(event.target as Node)) {
        setShowYearDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      <div className="relative" ref={monthRef}>
        <button
          type="button"
          onClick={() => {
            setShowMonthDropdown(!showMonthDropdown);
            setShowYearDropdown(false);
          }}
          className={cn(
            "flex items-center gap-1 rounded-lg px-2 py-1",
            "text-lg font-semibold text-[var(--calendar-header-foreground)]",
            "hover:bg-[var(--calendar-nav-background)]",
            "transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2"
          )}
        >
          {format(month, "MMMM")}
          <CaretDown size={16} weight="bold" />
        </button>

        {showMonthDropdown && (
          <div
            className={cn(
              "absolute left-0 top-full z-50 mt-1",
              "max-h-[280px] min-w-[140px] overflow-y-auto",
              "rounded-xl border border-[var(--border-default)]",
              "bg-[var(--background-default)] py-2",
              "shadow-[var(--shadow-dropdown)]"
            )}
          >
            {MONTHS.map((monthName, index) => (
              <button
                key={monthName}
                type="button"
                onClick={() => handleMonthSelect(index)}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm",
                  "hover:bg-[var(--background-interactive-hover)]",
                  "transition-colors duration-150",
                  getMonth(month) === index &&
                    "bg-[var(--background-brand-subtle)] font-medium text-[var(--foreground-brand-emphasis)]"
                )}
              >
                {monthName}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Year Dropdown */}
      <div className="relative" ref={yearRef}>
        <button
          type="button"
          onClick={() => {
            setShowYearDropdown(!showYearDropdown);
            setShowMonthDropdown(false);
          }}
          className={cn(
            "flex items-center gap-1 rounded-lg px-2 py-1",
            "text-lg font-semibold text-[var(--calendar-header-foreground)]",
            "hover:bg-[var(--calendar-nav-background)]",
            "transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2"
          )}
        >
          {format(month, "yyyy")}
          <CaretDown size={16} weight="bold" />
        </button>

        {showYearDropdown && (
          <div
            className={cn(
              "absolute left-0 top-full z-50 mt-1",
              "max-h-[280px] min-w-[100px] overflow-y-auto",
              "rounded-xl border border-[var(--border-default)]",
              "bg-[var(--background-default)] py-2",
              "shadow-[var(--shadow-dropdown)]"
            )}
          >
            {years.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => handleYearSelect(year)}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm",
                  "hover:bg-[var(--background-interactive-hover)]",
                  "transition-colors duration-150",
                  getYear(month) === year &&
                    "bg-[var(--background-brand-subtle)] font-medium text-[var(--foreground-brand-emphasis)]"
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

MonthYearSelector.displayName = "MonthYearSelector";

export { MonthYearSelector };
