"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Avatar } from "./avatar";
import { Badge } from "./badge";
import { Tooltip } from "./tooltip";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isToday,
  isBefore,
  isPast,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  setHours,
  setMinutes,
  parseISO,
  differenceInMinutes,
  addMinutes,
} from "date-fns";
import {
  CaretLeft,
  CaretRight,
  Clock,
  VideoCamera,
  Phone,
  MapPin,
  Plus,
  DotsThree,
  User,
  Calendar as CalendarIcon,
  GlobeHemisphereWest,
  CheckCircle,
  X,
  ArrowRight,
  Users,
  Link as LinkIcon,
  Copy,
} from "@phosphor-icons/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./dropdown";
import { SegmentedController } from "./segmented-controller";
import { logger, formatError } from "@/lib/logger";
import {
  type InterviewType,
  type SchedulerEvent,
  type SchedulerProps,
  type WeekViewProps,
  type DayViewProps,
  type MonthViewProps,
  type BookingTimeSlot as TimeSlot,
  COMMON_TIMEZONES,
  getUserTimezone,
  getTimezoneAbbreviation,
  getEventPosition,
} from "@/lib/scheduling";

// Re-export types and values for consumers importing from this file
export type {
  InterviewType,
  SchedulerEvent,
  SchedulerProps,
  WeekViewProps,
  DayViewProps,
  MonthViewProps,
};
export type { BookingTimeSlot as TimeSlot } from "@/lib/scheduling";
export { COMMON_TIMEZONES, getUserTimezone, getTimezoneAbbreviation, getEventPosition };

export const getInterviewIcon = (type?: InterviewType) => {
  switch (type) {
    case "video":
      return <VideoCamera className="h-3 w-3" />;
    case "phone":
      return <Phone className="h-3 w-3" />;
    case "onsite":
      return <MapPin className="h-3 w-3" />;
    default:
      return <Clock className="h-3 w-3" />;
  }
};

export const defaultEventColors: Record<InterviewType, string> = {
  video: "bg-badge-info-background border-badge-info-border",
  phone: "bg-badge-success-background border-badge-success-border",
  onsite: "bg-badge-accent-background border-badge-accent-border",
};

/* ============================================
   Time Slots Grid
   ============================================ */
interface TimeSlotsProps {
  startHour: number;
  endHour: number;
  slotDuration: number;
}

const TimeSlots: React.FC<TimeSlotsProps> = ({ startHour, endHour, slotDuration }) => {
  const slots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(
      <div key={hour} className="relative h-12 border-b border-border-muted">
        <span className="absolute -top-2.5 left-2 text-xs text-foreground-muted">
          {format(setHours(new Date(), hour), "h a")}
        </span>
      </div>
    );
  }
  return <div className="flex flex-col">{slots}</div>;
};

// EventCard — extracted to ./event-card.tsx
import { EventCard } from "./event-card";

// TimezoneSelector — extracted to ./timezone-selector.tsx
import { TimezoneSelector } from "./timezone-selector";

// TimeSlotPicker, UpcomingInterviews, BookingLink — extracted to separate files
// Re-exported at bottom of this file

/* ============================================
   REMOVED: TimeSlotPicker (see ./time-slot-picker.tsx)
   REMOVED: UpcomingInterviews (see ./upcoming-interviews.tsx)
   REMOVED: BookingLink (see ./booking-link.tsx)
   ============================================ */

/* ============================================
   Week View
   ============================================ */
const WeekView: React.FC<WeekViewProps> = ({
  events,
  selectedDate = new Date(),
  onDateChange,
  onEventClick,
  onSlotClick,
  startHour = 8,
  endHour = 18,
  slotDuration = 30,
}) => {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = direction === "prev" ? subWeeks(selectedDate, 1) : addWeeks(selectedDate, 1);
    onDateChange?.(newDate);
  };

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => {
      const eventStart = typeof event.start === "string" ? parseISO(event.start) : event.start;
      return isSameDay(eventStart, day);
    });
  };

  const handleSlotClick = (day: Date, hour: number) => {
    const start = setMinutes(setHours(day, hour), 0);
    const end = addMinutes(start, slotDuration);
    onSlotClick?.(start, end);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-muted px-4 py-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigateWeek("prev")}>
            <CaretLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigateWeek("next")}>
            <CaretRight className="h-4 w-4" />
          </Button>
          <h2 className="ml-2 text-lg font-medium">
            {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
          </h2>
        </div>
        <Button variant="outline" size="sm" onClick={() => onDateChange?.(new Date())}>
          Today
        </Button>
      </div>

      {/* Calendar grid */}
      <div className="flex flex-1 overflow-hidden">
        {/* Time column */}
        <div className="w-16 flex-shrink-0 border-r border-border-muted pt-10">
          <TimeSlots startHour={startHour} endHour={endHour} slotDuration={slotDuration} />
        </div>

        {/* Days columns */}
        <div className="flex flex-1 overflow-x-auto">
          {days.map((day) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentDay = isToday(day);

            return (
              <div
                key={day.toISOString()}
                className="min-w-32 flex-1 border-r border-border-muted last:border-r-0"
              >
                {/* Day header */}
                <div
                  className={cn(
                    "flex h-10 flex-col items-center justify-center border-b border-border-muted",
                    isCurrentDay && "bg-background-brand-subtle"
                  )}
                >
                  <span className="text-xs text-foreground-muted">{format(day, "EEE")}</span>
                  <span
                    className={cn("text-sm font-medium", isCurrentDay && "text-foreground-brand")}
                  >
                    {format(day, "d")}
                  </span>
                </div>

                {/* Time slots */}
                <div className="relative">
                  {/* Slot grid */}
                  {Array.from({ length: endHour - startHour }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={cn(
                        "h-12 w-full border-b border-border-muted",
                        "hover:bg-background-brand-subtle/50 active:bg-background-brand-subtle",
                        "transition-colors duration-fast",
                        "focus:ring-ring-color focus:outline-none focus:ring-1 focus:ring-inset"
                      )}
                      onClick={() => handleSlotClick(day, startHour + i)}
                      aria-label={`Schedule at ${startHour + i}:00`}
                    />
                  ))}

                  {/* Events */}
                  <div className="pointer-events-none absolute inset-0">
                    {dayEvents.map((event) => {
                      const position = getEventPosition(event, startHour, endHour);
                      return (
                        <div
                          key={event.id}
                          className="pointer-events-auto absolute left-1 right-1"
                          style={{ top: position.top, height: position.height }}
                        >
                          <EventCard
                            event={event}
                            onClick={onEventClick}
                            compact={
                              differenceInMinutes(
                                typeof event.end === "string" ? parseISO(event.end) : event.end,
                                typeof event.start === "string"
                                  ? parseISO(event.start)
                                  : event.start
                              ) < 45
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ============================================
   Day View
   ============================================ */
const DayView: React.FC<DayViewProps> = ({
  events,
  selectedDate = new Date(),
  onDateChange,
  onEventClick,
  onSlotClick,
  startHour = 8,
  endHour = 18,
  slotDuration = 30,
}) => {
  const navigateDay = (direction: "prev" | "next") => {
    const newDate = direction === "prev" ? addDays(selectedDate, -1) : addDays(selectedDate, 1);
    onDateChange?.(newDate);
  };

  const dayEvents = events.filter((event) => {
    const eventStart = typeof event.start === "string" ? parseISO(event.start) : event.start;
    return isSameDay(eventStart, selectedDate);
  });

  const handleSlotClick = (hour: number) => {
    const start = setMinutes(setHours(selectedDate, hour), 0);
    const end = addMinutes(start, slotDuration);
    onSlotClick?.(start, end);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-muted px-4 py-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigateDay("prev")}>
            <CaretLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigateDay("next")}>
            <CaretRight className="h-4 w-4" />
          </Button>
          <h2 className="ml-2 text-lg font-medium">{format(selectedDate, "EEEE, MMMM d, yyyy")}</h2>
        </div>
        <Button variant="outline" size="sm" onClick={() => onDateChange?.(new Date())}>
          Today
        </Button>
      </div>

      {/* Day grid */}
      <div className="flex flex-1 overflow-auto">
        {/* Time column */}
        <div className="w-16 flex-shrink-0 border-r border-border-muted">
          <TimeSlots startHour={startHour} endHour={endHour} slotDuration={slotDuration} />
        </div>

        {/* Day column */}
        <div className="relative flex-1">
          {/* Slot grid */}
          {Array.from({ length: endHour - startHour }).map((_, i) => (
            <button
              key={i}
              type="button"
              className={cn(
                "h-12 w-full border-b border-border-muted",
                "hover:bg-background-brand-subtle/50 active:bg-background-brand-subtle",
                "transition-colors duration-fast",
                "focus:ring-ring-color focus:outline-none focus:ring-1 focus:ring-inset"
              )}
              onClick={() => handleSlotClick(startHour + i)}
              aria-label={`Schedule at ${startHour + i}:00`}
            />
          ))}

          {/* Events */}
          <div className="pointer-events-none absolute inset-0 p-2">
            {dayEvents.map((event) => {
              const position = getEventPosition(event, startHour, endHour);
              return (
                <div
                  key={event.id}
                  className="pointer-events-auto absolute left-2 right-2"
                  style={{ top: position.top, height: position.height }}
                >
                  <EventCard event={event} onClick={onEventClick} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================
   Month View
   ============================================ */
const MonthView: React.FC<MonthViewProps> = ({
  events,
  selectedDate = new Date(),
  onDateChange,
  onEventClick,
  onSlotClick,
}) => {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = direction === "prev" ? subMonths(selectedDate, 1) : addMonths(selectedDate, 1);
    onDateChange?.(newDate);
  };

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => {
      const eventStart = typeof event.start === "string" ? parseISO(event.start) : event.start;
      return isSameDay(eventStart, day);
    });
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-muted px-4 py-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigateMonth("prev")}>
            <CaretLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigateMonth("next")}>
            <CaretRight className="h-4 w-4" />
          </Button>
          <h2 className="ml-2 text-lg font-medium">{format(selectedDate, "MMMM yyyy")}</h2>
        </div>
        <Button variant="outline" size="sm" onClick={() => onDateChange?.(new Date())}>
          Today
        </Button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-border-muted">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className="py-2 text-center text-xs font-medium text-foreground-muted">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid flex-1 auto-rows-fr grid-cols-7 overflow-hidden">
        {days.map((day) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentDay = isToday(day);
          const isCurrentMonth = isSameMonth(day, selectedDate);

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "min-h-24 border-b border-r border-border-muted p-1",
                "hover:bg-background-brand-subtle/30 cursor-pointer",
                "transition-colors duration-fast",
                !isCurrentMonth && "bg-background-subtle opacity-50"
              )}
              onClick={() => {
                const start = setHours(day, 9);
                onSlotClick?.(start, addMinutes(start, 60));
              }}
            >
              <div
                className={cn(
                  "mb-1 flex h-7 w-7 items-center justify-center rounded-full text-sm",
                  isCurrentDay && "bg-background-brand text-foreground-on-emphasis"
                )}
              >
                {format(day, "d")}
              </div>
              <div className="space-y-0.5 overflow-hidden">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick?.(event);
                    }}
                    className={cn(
                      "cursor-pointer truncate rounded px-1.5 py-0.5 text-xs",
                      "transition-opacity duration-fast hover:opacity-80 active:opacity-100",
                      event.type ? defaultEventColors[event.type] : "bg-badge-primary-background"
                    )}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <Badge variant="secondary" className="w-full justify-center py-0.5 text-xs">
                    +{dayEvents.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ============================================
   Main Scheduler Component
   ============================================ */
const Scheduler = React.forwardRef<HTMLDivElement, SchedulerProps>(
  (
    {
      events,
      view = "week",
      selectedDate = new Date(),
      onDateChange,
      onEventClick,
      onSlotClick,
      onEventCreate,
      onEventUpdate,
      className,
      startHour = 8,
      endHour = 18,
      slotDuration = 30,
    },
    ref
  ) => {
    const [currentView, setCurrentView] = React.useState(view);

    const commonProps = {
      events,
      selectedDate,
      onDateChange,
      onEventClick,
      onSlotClick,
      startHour,
      endHour,
      slotDuration,
    };

    return (
      <div
        ref={ref}
        className={cn(
          "bg-surface-default flex flex-col overflow-hidden rounded-lg border border-border-muted",
          className
        )}
      >
        {/* View switcher */}
        <div className="flex items-center gap-2 border-b border-border-muted bg-background-subtle px-4 py-2">
          <SegmentedController
            options={[
              { value: "day", label: "Day" },
              { value: "week", label: "Week" },
              { value: "month", label: "Month" },
            ]}
            value={currentView}
            onValueChange={(value) => setCurrentView(value as "day" | "week" | "month")}
          />
        </div>

        {/* View content */}
        <div className="flex-1 overflow-hidden">
          {currentView === "week" && <WeekView {...commonProps} />}
          {currentView === "day" && <DayView {...commonProps} />}
          {currentView === "month" && <MonthView {...commonProps} />}
        </div>
      </div>
    );
  }
);
Scheduler.displayName = "Scheduler";

/* ============================================
   Interview Scheduler (ATS-specific)
   ============================================ */
interface InterviewSchedulerProps extends Omit<SchedulerProps, "events"> {
  interviews: SchedulerEvent[];
  onScheduleInterview?: (start: Date, end: Date) => void;
}

const InterviewScheduler: React.FC<InterviewSchedulerProps> = ({
  interviews,
  onScheduleInterview,
  ...props
}) => {
  return (
    <Scheduler
      events={interviews}
      onSlotClick={(start, end) => onScheduleInterview?.(start, end)}
      {...props}
    />
  );
};

/* ============================================
   Exports
   ============================================ */
export { Scheduler, WeekView, DayView, MonthView, InterviewScheduler, EventCard, TimezoneSelector };

// Re-export extracted components for backward compatibility
export { TimeSlotPicker } from "./time-slot-picker";
export { UpcomingInterviews } from "./upcoming-interviews";
export { BookingLink } from "./booking-link";
