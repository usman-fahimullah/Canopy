"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Banner } from "./banner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isToday,
  isBefore,
  addWeeks,
  subWeeks,
  setHours,
  setMinutes,
  addMinutes,
} from "date-fns";
import { X, CaretLeft, CaretRight, GlobeHemisphereWest, CalendarDot } from "@phosphor-icons/react";
import {
  type InterviewTimeSlot as TimeSlot,
  type RecruiterEvent,
  DEFAULT_SCROLL_HOUR,
} from "@/lib/scheduling";
import type { WeekViewType } from "./availability-calendar";

/* ============================================
   YourCalendarView Component
   ============================================ */
export interface YourCalendarViewProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  myEvents: RecruiterEvent[];
  selectedSlots: TimeSlot[];
  onSlotSelect: (slot: TimeSlot) => void;
  onSlotRemove: (slotId: string) => void;
  maxSlots?: number;
  duration: number;
  startHour?: number;
  endHour?: number;
  className?: string;
}

export const YourCalendarView: React.FC<YourCalendarViewProps> = ({
  selectedDate,
  onDateChange,
  myEvents,
  selectedSlots,
  onSlotSelect,
  onSlotRemove,
  maxSlots = 5,
  duration,
  startHour = 9,
  endHour = 18,
  className,
}) => {
  const [weekView, setWeekView] = React.useState<WeekViewType>("5-day");

  // Calculate week days based on view type
  const weekStartsOn = weekView === "7-day" ? 0 : 1;
  const weekStart = startOfWeek(selectedDate, { weekStartsOn });
  const weekEnd =
    weekView === "7-day" ? endOfWeek(selectedDate, { weekStartsOn }) : addDays(weekStart, 4);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Height per hour in pixels (matches AvailabilityCalendar)
  const LOCAL_HOUR_HEIGHT = 48;
  const totalMinutes = (endHour - startHour) * 60;

  // Refs for scroll container and tracking initial scroll
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const hasScrolledRef = React.useRef(false);

  // Hover state for preview
  const [hoveredTime, setHoveredTime] = React.useState<{
    day: Date;
    minutes: number;
  } | null>(null);

  // Auto-scroll to 8am (or start hour if later) on initial mount
  React.useEffect(() => {
    if (scrollContainerRef.current && !hasScrolledRef.current) {
      const scrollToHour = Math.max(DEFAULT_SCROLL_HOUR, startHour);
      const scrollPosition = (scrollToHour - startHour) * LOCAL_HOUR_HEIGHT;
      scrollContainerRef.current.scrollTop = scrollPosition;
      hasScrolledRef.current = true;
    }
  }, [startHour]);

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = direction === "prev" ? subWeeks(selectedDate, 1) : addWeeks(selectedDate, 1);
    onDateChange(newDate);
  };

  const getEventsForDay = (day: Date) => {
    return myEvents.filter((event) => {
      const eventDate = event.start;
      return isSameDay(eventDate, day);
    });
  };

  const getSelectedSlotsForDay = (day: Date) => {
    return selectedSlots.filter((slot) => isSameDay(slot.start, day));
  };

  // Calculate pixel position from minutes since start of day
  const getPositionFromMinutes = (minutes: number): number => {
    const dayStartMinutes = startHour * 60;
    return ((minutes - dayStartMinutes) / 60) * LOCAL_HOUR_HEIGHT;
  };

  // Calculate minutes from pixel position (snaps to 15-minute intervals)
  const getMinutesFromPosition = (y: number, snapTo: number = 15): number => {
    const totalMinutesFromStart = (y / LOCAL_HOUR_HEIGHT) * 60;
    const snapped = Math.round(totalMinutesFromStart / snapTo) * snapTo;
    return startHour * 60 + Math.max(0, Math.min(snapped, totalMinutes - duration));
  };

  // Check if a time range conflicts with events or is in the past
  const getAvailabilityForRange = (
    day: Date,
    startMinutes: number
  ): "available" | "busy" | "past" => {
    const now = new Date();
    const slotStart = addMinutes(setHours(setMinutes(day, 0), 0), startMinutes);
    const slotEnd = addMinutes(slotStart, duration);

    // Check if in the past
    if (isBefore(slotStart, now)) return "past";

    // Check conflicts with my events
    const dayEvents = getEventsForDay(day);
    const hasConflict = dayEvents.some((event) => {
      return slotStart < event.end && slotEnd > event.start;
    });

    return hasConflict ? "busy" : "available";
  };

  // Handle click on the calendar grid
  const handleGridClick = (day: Date, e: React.MouseEvent<HTMLDivElement>) => {
    if (selectedSlots.length >= maxSlots) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const minutes = getMinutesFromPosition(y);
    const availability = getAvailabilityForRange(day, minutes);

    if (availability !== "available") return;

    const slotStart = addMinutes(setHours(setMinutes(day, 0), 0), minutes);
    const slotEnd = addMinutes(slotStart, duration);

    onSlotSelect({
      id: `${slotStart.getTime()}`,
      start: slotStart,
      end: slotEnd,
    });
  };

  // Handle mouse move for hover preview
  const handleGridMouseMove = (day: Date, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const minutes = getMinutesFromPosition(y);
    setHoveredTime({ day, minutes });
  };

  // Generate hours array
  const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);

  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      {/* Header */}
      <div className="flex flex-shrink-0 items-center justify-between border-b border-[var(--primitive-neutral-200)] px-4 py-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => navigateWeek("prev")}
            className="rounded p-1.5 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--background-interactive-hover)]"
          >
            <CaretLeft size={16} weight="bold" />
          </button>
          <button
            type="button"
            onClick={() => navigateWeek("next")}
            className="rounded p-1.5 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--background-interactive-hover)]"
          >
            <CaretRight size={16} weight="bold" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-[var(--foreground-default)]">
            {format(weekStart, "MMM d")} – {format(weekEnd, "d, yyyy")}
          </span>
          <span className="flex items-center gap-1 rounded bg-[var(--primitive-neutral-100)] px-2 py-0.5 text-[11px] text-[var(--foreground-muted)]">
            <GlobeHemisphereWest size={12} />
            {Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/_/g, " ")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg bg-[var(--primitive-neutral-100)] p-0.5">
            <button
              type="button"
              onClick={() => setWeekView("5-day")}
              className={cn(
                "rounded-md px-2 py-1 text-[11px] font-medium transition-all",
                weekView === "5-day"
                  ? "bg-[var(--background-interactive-default)] text-[var(--foreground-default)] shadow-sm"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground-default)]"
              )}
            >
              5 days
            </button>
            <button
              type="button"
              onClick={() => setWeekView("7-day")}
              className={cn(
                "rounded-md px-2 py-1 text-[11px] font-medium transition-all",
                weekView === "7-day"
                  ? "bg-[var(--background-interactive-default)] text-[var(--foreground-default)] shadow-sm"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground-default)]"
              )}
            >
              7 days
            </button>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => onDateChange(new Date())}
            aria-label="Go to today"
          >
            <CalendarDot size={16} weight="fill" />
          </Button>
        </div>
      </div>

      {/* Info banner */}
      <Banner
        type="info"
        title="Click on your calendar to propose interview times"
        dismissible={false}
        className="flex-shrink-0 rounded-none"
      />

      {/* Calendar grid - Scrollable area */}
      <div ref={scrollContainerRef} className="min-h-0 flex-1 overflow-auto px-4 py-2">
        <div className="flex min-w-[600px]">
          {/* Time column */}
          <div className="w-12 flex-shrink-0 pt-10">
            {hours.map((hour) => (
              <div
                key={hour}
                className="flex items-start justify-end pr-2"
                style={{ height: LOCAL_HOUR_HEIGHT }}
              >
                <span className="-mt-1.5 text-[11px] text-[var(--foreground-muted)]">
                  {format(setHours(new Date(), hour), "ha").toLowerCase()}
                </span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((day) => {
            const dayEvents = getEventsForDay(day);
            const daySelectedSlots = getSelectedSlotsForDay(day);
            const isCurrentDay = isToday(day);

            return (
              <div key={day.toISOString()} className="min-w-[80px] flex-1">
                {/* Day header */}
                <div className="mb-1 flex h-10 flex-col items-center justify-center">
                  <span className="text-[11px] uppercase tracking-wide text-[var(--foreground-muted)]">
                    {format(day, "EEE")}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      isCurrentDay
                        ? "flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primitive-green-600)] text-[var(--foreground-on-emphasis)]"
                        : "text-[var(--foreground-default)]"
                    )}
                  >
                    {format(day, "d")}
                  </span>
                </div>

                {/* Time grid - clickable area */}
                <div
                  className="relative cursor-crosshair border-l border-[var(--primitive-neutral-200)]"
                  style={{ height: hours.length * LOCAL_HOUR_HEIGHT }}
                  onClick={(e) => handleGridClick(day, e)}
                  onMouseMove={(e) => handleGridMouseMove(day, e)}
                  onMouseLeave={() => setHoveredTime(null)}
                >
                  {/* Hour lines */}
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className="absolute left-0 right-0 border-b border-[var(--primitive-neutral-100)]"
                      style={{
                        top: (hour - startHour) * LOCAL_HOUR_HEIGHT + LOCAL_HOUR_HEIGHT - 1,
                      }}
                    />
                  ))}

                  {/* Half-hour lines (dashed) */}
                  {hours.map((hour) => (
                    <div
                      key={`${hour}-30`}
                      className="absolute left-0 right-0 border-b border-dashed border-[var(--primitive-neutral-100)]"
                      style={{
                        top: (hour - startHour) * LOCAL_HOUR_HEIGHT + LOCAL_HOUR_HEIGHT / 2,
                      }}
                    />
                  ))}

                  {/* My existing events - shown in neutral/gray to differentiate */}
                  {dayEvents.map((event) => {
                    const startMinutes = event.start.getHours() * 60 + event.start.getMinutes();
                    const endMinutes = event.end.getHours() * 60 + event.end.getMinutes();
                    const top = getPositionFromMinutes(startMinutes);
                    const height = ((endMinutes - startMinutes) / 60) * LOCAL_HOUR_HEIGHT;

                    return (
                      <div
                        key={event.id}
                        className="pointer-events-none absolute left-1 right-1 overflow-hidden rounded-lg border-l-4 border-[var(--primitive-neutral-700)] bg-[var(--primitive-neutral-600)] px-2 py-1.5"
                        style={{ top, height: Math.max(height, 24) }}
                      >
                        <p className="truncate text-[11px] font-medium text-[var(--foreground-on-emphasis)]">
                          {event.title}
                        </p>
                        {height > 35 && (
                          <p className="text-[var(--foreground-on-emphasis)]/80 text-[10px]">
                            {format(event.start, "h:mm")} – {format(event.end, "h:mm a")}
                          </p>
                        )}
                      </div>
                    );
                  })}

                  {/* Hover preview - blue to match date picker */}
                  {hoveredTime &&
                    isSameDay(hoveredTime.day, day) &&
                    selectedSlots.length < maxSlots &&
                    (() => {
                      const availability = getAvailabilityForRange(day, hoveredTime.minutes);
                      if (availability !== "available") return null;

                      const top = getPositionFromMinutes(hoveredTime.minutes);
                      const height = (duration / 60) * LOCAL_HOUR_HEIGHT;
                      const startTime = addMinutes(
                        setHours(setMinutes(day, 0), 0),
                        hoveredTime.minutes
                      );

                      return (
                        <div
                          className="bg-[var(--primitive-blue-100)]/60 pointer-events-none absolute left-1 right-1 rounded-lg border-2 border-dashed border-[var(--primitive-blue-400)] transition-all"
                          style={{ top, height }}
                        >
                          <div className="px-2 py-1.5">
                            <p className="text-[11px] font-medium text-[var(--primitive-blue-700)]">
                              {format(startTime, "h:mm a")} –{" "}
                              {format(addMinutes(startTime, duration), "h:mm a")}
                            </p>
                          </div>
                        </div>
                      );
                    })()}

                  {/* Selected time slots - unified event cards in blue */}
                  {daySelectedSlots.map((slot) => {
                    const startMinutes = slot.start.getHours() * 60 + slot.start.getMinutes();
                    const top = getPositionFromMinutes(startMinutes);
                    const height = (duration / 60) * LOCAL_HOUR_HEIGHT;

                    return (
                      <TooltipProvider key={slot.id} delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className="group absolute left-1 right-1 cursor-pointer rounded-lg border-l-4 border-[var(--primitive-blue-500)] bg-[var(--primitive-blue-400)] shadow-sm transition-colors hover:bg-[var(--primitive-blue-500)]"
                              style={{ top, height }}
                              onClick={(e) => {
                                e.stopPropagation();
                                onSlotRemove(slot.id);
                              }}
                            >
                              <div className="flex h-full flex-col overflow-hidden px-2 py-1.5">
                                <p className="truncate text-[11px] font-semibold text-[var(--foreground-on-emphasis)]">
                                  Interview Slot
                                </p>
                                <p className="text-[10px] text-[var(--foreground-on-emphasis)]">
                                  {format(slot.start, "h:mm")} – {format(slot.end, "h:mm a")}
                                </p>
                                {/* Remove indicator on hover - only show if card is tall enough */}
                                {height > 50 && (
                                  <div className="text-[var(--foreground-on-emphasis)]/80 mt-auto flex items-center gap-1 text-[10px] opacity-0 transition-opacity group-hover:opacity-100">
                                    <X size={10} />
                                    <span>Remove</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="left">
                            <p className="text-xs">Click to remove this time slot</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 border-t border-[var(--primitive-neutral-200)] bg-[var(--card-background)] px-4 py-2 text-[11px] text-[var(--foreground-muted)]">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded border-l-2 border-[var(--primitive-neutral-700)] bg-[var(--primitive-neutral-600)]" />
          <span>My events</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded border-l-2 border-[var(--primitive-blue-600)] bg-[var(--primitive-blue-500)]" />
          <span>Proposed times</span>
        </div>
      </div>
    </div>
  );
};

YourCalendarView.displayName = "YourCalendarView";
