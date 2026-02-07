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

// ============================================
// DROPDOWN KEYBOARD NAVIGATION HOOK
// Handles ArrowUp/Down, Home, End, Escape
// ============================================

function useDropdownKeyboard(
  isOpen: boolean,
  onClose: () => void,
  triggerRef: React.RefObject<HTMLButtonElement | null>,
  listRef: React.RefObject<HTMLDivElement | null>
) {
  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!isOpen) return;

      const list = listRef.current;
      if (!list) return;

      const items = Array.from(list.querySelectorAll<HTMLButtonElement>('[role="option"]'));
      if (items.length === 0) return;

      const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement);

      switch (event.key) {
        case "ArrowDown": {
          event.preventDefault();
          const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
          items[nextIndex]?.focus();
          break;
        }
        case "ArrowUp": {
          event.preventDefault();
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
          items[prevIndex]?.focus();
          break;
        }
        case "Home": {
          event.preventDefault();
          items[0]?.focus();
          break;
        }
        case "End": {
          event.preventDefault();
          items[items.length - 1]?.focus();
          break;
        }
        case "Escape": {
          event.preventDefault();
          onClose();
          triggerRef.current?.focus();
          break;
        }
      }
    },
    [isOpen, onClose, triggerRef, listRef]
  );

  // Auto-focus current item when dropdown opens
  React.useEffect(() => {
    if (!isOpen) return;
    const list = listRef.current;
    if (!list) return;

    // Small delay so the dropdown has rendered
    const raf = requestAnimationFrame(() => {
      const selected = list.querySelector<HTMLButtonElement>('[aria-selected="true"]');
      if (selected) {
        selected.focus();
        selected.scrollIntoView({ block: "nearest" });
      } else {
        const first = list.querySelector<HTMLButtonElement>('[role="option"]');
        first?.focus();
      }
    });

    return () => cancelAnimationFrame(raf);
  }, [isOpen, listRef]);

  return handleKeyDown;
}

export interface MonthYearSelectorProps {
  month: Date;
  onMonthChange: (date: Date) => void;
}

function MonthYearSelector({ month, onMonthChange }: MonthYearSelectorProps) {
  const [showMonthDropdown, setShowMonthDropdown] = React.useState(false);
  const [showYearDropdown, setShowYearDropdown] = React.useState(false);
  const years = React.useMemo(() => generateYears(), []);

  const monthContainerRef = React.useRef<HTMLDivElement>(null);
  const yearContainerRef = React.useRef<HTMLDivElement>(null);
  const monthTriggerRef = React.useRef<HTMLButtonElement>(null);
  const yearTriggerRef = React.useRef<HTMLButtonElement>(null);
  const monthListRef = React.useRef<HTMLDivElement>(null);
  const yearListRef = React.useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (monthContainerRef.current && !monthContainerRef.current.contains(event.target as Node)) {
        setShowMonthDropdown(false);
      }
      if (yearContainerRef.current && !yearContainerRef.current.contains(event.target as Node)) {
        setShowYearDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMonthDropdown = React.useCallback(() => setShowMonthDropdown(false), []);
  const closeYearDropdown = React.useCallback(() => setShowYearDropdown(false), []);

  const handleMonthKeyDown = useDropdownKeyboard(
    showMonthDropdown,
    closeMonthDropdown,
    monthTriggerRef,
    monthListRef
  );

  const handleYearKeyDown = useDropdownKeyboard(
    showYearDropdown,
    closeYearDropdown,
    yearTriggerRef,
    yearListRef
  );

  const handleMonthSelect = (monthIndex: number) => {
    onMonthChange(setMonth(month, monthIndex));
    setShowMonthDropdown(false);
    monthTriggerRef.current?.focus();
  };

  const handleYearSelect = (year: number) => {
    onMonthChange(setYear(month, year));
    setShowYearDropdown(false);
    yearTriggerRef.current?.focus();
  };

  return (
    <div className="flex items-center gap-1">
      {/* Month Dropdown */}
      <div className="relative" ref={monthContainerRef}>
        <button
          ref={monthTriggerRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={showMonthDropdown}
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
            ref={monthListRef}
            role="listbox"
            aria-label="Select month"
            onKeyDown={handleMonthKeyDown}
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
                role="option"
                aria-selected={getMonth(month) === index}
                onClick={() => handleMonthSelect(index)}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm",
                  "hover:bg-[var(--background-interactive-hover)]",
                  "transition-colors duration-150",
                  "focus-visible:bg-[var(--background-interactive-hover)] focus-visible:outline-none",
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
      <div className="relative" ref={yearContainerRef}>
        <button
          ref={yearTriggerRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={showYearDropdown}
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
            ref={yearListRef}
            role="listbox"
            aria-label="Select year"
            onKeyDown={handleYearKeyDown}
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
                role="option"
                aria-selected={getYear(month) === year}
                onClick={() => handleYearSelect(year)}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm",
                  "hover:bg-[var(--background-interactive-hover)]",
                  "transition-colors duration-150",
                  "focus-visible:bg-[var(--background-interactive-hover)] focus-visible:outline-none",
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
