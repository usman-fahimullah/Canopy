"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Badge } from "./badge";
import {
  CaretLeft,
  CaretRight,
  Calendar as CalendarIcon,
  GlobeHemisphereWest,
  CheckCircle,
  ArrowRight,
} from "@phosphor-icons/react";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isToday,
  isBefore,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  setHours,
  setMinutes,
  parseISO,
  addMinutes,
} from "date-fns";
import {
  type BookingTimeSlot as TimeSlot,
  type SchedulerEvent,
  getUserTimezone,
  getTimezoneAbbreviation,
} from "@/lib/scheduling";
import { TimezoneSelector } from "./timezone-selector";

/* ============================================
   Calendly-Style Time Slot Picker
   ============================================ */
export interface TimeSlotPickerProps {
  selectedDate: Date;
  onDateChange?: (date: Date) => void;
  onSlotSelect?: (start: Date, end: Date) => void;
  availableSlots?: TimeSlot[];
  events?: SchedulerEvent[];
  startHour?: number;
  endHour?: number;
  slotDuration?: number;
  timezone?: string;
  onTimezoneChange?: (timezone: string) => void;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  selectedDate,
  onDateChange,
  onSlotSelect,
  availableSlots,
  events = [],
  startHour = 9,
  endHour = 17,
  slotDuration = 30,
  timezone: initialTimezone,
  onTimezoneChange,
  title = "Select a Time",
  subtitle,
  className,
}) => {
  const [timezone, setTimezone] = React.useState(initialTimezone || getUserTimezone());
  const [selectedSlot, setSelectedSlot] = React.useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = React.useState(selectedDate);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Generate time slots for selected date
  const timeSlots = React.useMemo(() => {
    const slots: TimeSlot[] = [];
    const now = new Date();

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const slotStart = setMinutes(setHours(selectedDate, hour), minute);
        const slotEnd = addMinutes(slotStart, slotDuration);

        // Check if slot is in the past
        const isPastSlot = isBefore(slotStart, now);

        // Check if slot conflicts with existing events
        const hasConflict = events.some((event) => {
          const eventStart = typeof event.start === "string" ? parseISO(event.start) : event.start;
          const eventEnd = typeof event.end === "string" ? parseISO(event.end) : event.end;
          return slotStart < eventEnd && slotEnd > eventStart;
        });

        // Check available slots if provided
        const isAvailable = availableSlots
          ? availableSlots.some((s) => isSameDay(s.start, slotStart) && s.available)
          : true;

        slots.push({
          start: slotStart,
          end: slotEnd,
          available: !isPastSlot && !hasConflict && isAvailable,
        });
      }
    }
    return slots;
  }, [selectedDate, startHour, endHour, slotDuration, events, availableSlots]);

  const availableTimeSlots = timeSlots.filter((s) => s.available);

  const handleTimezoneChange = (tz: string) => {
    setTimezone(tz);
    onTimezoneChange?.(tz);
  };

  const handleSlotClick = (slot: TimeSlot) => {
    if (!slot.available) return;
    setSelectedSlot(slot.start);
    onSlotSelect?.(slot.start, slot.end);
  };

  const handleDayClick = (day: Date) => {
    if (isBefore(day, new Date()) && !isToday(day)) return;
    onDateChange?.(day);
    setSelectedSlot(null);
  };

  return (
    <div
      className={cn(
        "bg-surface-default flex flex-col overflow-hidden rounded-2xl border border-border-muted shadow-sm lg:flex-row",
        className
      )}
    >
      {/* Left: Calendar Panel */}
      <div className="from-background-subtle/50 border-b border-border-muted bg-gradient-to-b to-transparent p-6 lg:w-[340px] lg:border-b-0 lg:border-r">
        {/* Title Section */}
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-3">
            <div className="dark:bg-[var(--primitive-blue-800)]/30 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primitive-blue-100)]">
              <CalendarIcon className="h-5 w-5 text-[var(--primitive-blue-500)]" weight="duotone" />
            </div>
            <div>
              <h3 className="text-foreground-default text-lg font-semibold">{title}</h3>
              {subtitle && <p className="text-sm text-foreground-muted">{subtitle}</p>}
            </div>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="mb-5 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="h-9 w-9 rounded-lg hover:bg-[var(--background-interactive-hover)]"
          >
            <CaretLeft className="h-5 w-5" />
          </Button>
          <span className="text-base font-semibold">{format(currentMonth, "MMMM yyyy")}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="h-9 w-9 rounded-lg hover:bg-[var(--background-interactive-hover)]"
          >
            <CaretRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Day headers */}
        <div className="mb-3 grid grid-cols-7">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div
              key={day}
              className="py-2 text-center text-xs font-semibold uppercase tracking-wide text-foreground-muted"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid - Improved spacing */}
        <div className="grid grid-cols-7 gap-1.5">
          {calendarDays.map((day) => {
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isPastDay = isBefore(day, new Date()) && !isToday(day);
            const isCurrentDay = isToday(day);

            return (
              <button
                key={day.toISOString()}
                onClick={() => handleDayClick(day)}
                disabled={isPastDay}
                className={cn(
                  "relative h-10 w-full rounded-xl text-sm font-medium transition-all duration-150",
                  "focus:ring-ring-color focus:outline-none focus:ring-2 focus:ring-offset-1",
                  isSelected
                    ? "bg-[var(--primitive-blue-500)] text-[var(--foreground-on-emphasis)] shadow-md"
                    : isCurrentDay
                      ? "dark:bg-[var(--primitive-blue-800)]/40 bg-[var(--primitive-blue-100)] font-semibold text-[var(--primitive-blue-700)] dark:text-[var(--primitive-blue-300)]"
                      : isPastDay
                        ? "cursor-not-allowed text-foreground-disabled opacity-40"
                        : !isCurrentMonth
                          ? "text-foreground-muted/50"
                          : "text-foreground-default hover:scale-105 hover:bg-[var(--background-interactive-hover)]"
                )}
              >
                {format(day, "d")}
                {/* Today indicator dot */}
                {isCurrentDay && !isSelected && (
                  <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[var(--primitive-blue-500)]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Timezone Selector - Enhanced */}
        <div className="mt-6 border-t border-border-muted pt-5">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-foreground-muted">
            <GlobeHemisphereWest className="h-3.5 w-3.5" />
            Timezone
          </div>
          <TimezoneSelector value={timezone} onChange={handleTimezoneChange} />
        </div>
      </div>

      {/* Right: Time slots Panel */}
      <div className="flex min-h-[380px] flex-1 flex-col p-6">
        {/* Date header */}
        <div className="mb-5 flex items-center justify-between border-b border-border-muted pb-4">
          <div>
            <h4 className="text-foreground-default text-xl font-semibold">
              {format(selectedDate, "EEEE")}
            </h4>
            <p className="mt-0.5 text-sm text-foreground-muted">
              {format(selectedDate, "MMMM d, yyyy")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1 text-xs">
              {availableTimeSlots.length} available
            </Badge>
            <Badge variant="outline" className="px-3 py-1 text-xs">
              {getTimezoneAbbreviation(timezone)}
            </Badge>
          </div>
        </div>

        {availableTimeSlots.length === 0 ? (
          /* Empty state - Enhanced */
          <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800">
              <CalendarIcon className="h-8 w-8 text-foreground-muted" />
            </div>
            <p className="text-foreground-default text-lg font-semibold">No available times</p>
            <p className="mt-1 max-w-[200px] text-sm text-foreground-muted">
              Try selecting a different date to find available time slots
            </p>
          </div>
        ) : (
          /* Time slots grid - Improved */
          <div className="flex-1 overflow-hidden">
            <div className="grid max-h-[280px] grid-cols-2 gap-2.5 overflow-y-auto pr-2 sm:grid-cols-3 lg:grid-cols-4">
              {availableTimeSlots.map((slot) => {
                const isSlotSelected =
                  selectedSlot &&
                  isSameDay(selectedSlot, slot.start) &&
                  selectedSlot.getHours() === slot.start.getHours() &&
                  selectedSlot.getMinutes() === slot.start.getMinutes();

                return (
                  <button
                    key={slot.start.toISOString()}
                    onClick={() => handleSlotClick(slot)}
                    className={cn(
                      "rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-150",
                      "focus:ring-ring-color border-2 focus:outline-none focus:ring-2 focus:ring-offset-1",
                      isSlotSelected
                        ? "scale-[1.02] border-[var(--primitive-blue-500)] bg-[var(--primitive-blue-500)] text-[var(--foreground-on-emphasis)] shadow-md"
                        : "dark:hover:bg-[var(--primitive-blue-800)]/30 border-border-muted bg-[var(--background-interactive-default)] hover:scale-[1.02] hover:border-[var(--primitive-blue-300)] hover:bg-[var(--primitive-blue-100)] dark:bg-neutral-900"
                    )}
                  >
                    {format(slot.start, "h:mm a")}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Confirmation Panel - Enhanced */}
        {selectedSlot && (
          <div className="mt-auto border-t border-border-muted pt-5">
            <div className="dark:bg-[var(--primitive-blue-800)]/20 flex items-center gap-4 rounded-xl border border-[var(--primitive-blue-200)] bg-[var(--primitive-blue-100)] p-4 dark:border-[var(--primitive-blue-700)]">
              <div className="dark:bg-[var(--primitive-blue-700)]/50 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--primitive-blue-200)]">
                <CheckCircle
                  className="h-6 w-6 text-[var(--primitive-blue-500)]"
                  weight="duotone"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-base font-semibold text-[var(--primitive-blue-800)] dark:text-[var(--primitive-blue-100)]">
                  {format(selectedSlot, "h:mm a")} -{" "}
                  {format(addMinutes(selectedSlot, slotDuration), "h:mm a")}
                </p>
                <p className="text-sm text-[var(--primitive-blue-700)] dark:text-[var(--primitive-blue-300)]">
                  {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </p>
              </div>
              <Button
                onClick={() => onSlotSelect?.(selectedSlot, addMinutes(selectedSlot, slotDuration))}
                size="default"
                className="gap-2 shadow-sm"
              >
                Confirm
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

TimeSlotPicker.displayName = "TimeSlotPicker";
