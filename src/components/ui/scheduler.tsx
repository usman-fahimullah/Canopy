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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./dropdown";
import { SegmentedController } from "./segmented-controller";

/* ============================================
   Scheduler Types
   ============================================ */
export type InterviewType = "video" | "phone" | "onsite";

export interface SchedulerEvent {
  id: string;
  title: string;
  start: Date | string;
  end: Date | string;
  type?: InterviewType;
  candidateId?: string;
  candidateName?: string;
  candidateAvatar?: string;
  jobId?: string;
  jobTitle?: string;
  interviewers?: { id: string; name: string; avatar?: string }[];
  location?: string;
  meetingLink?: string;
  notes?: string;
  color?: string;
}

export interface SchedulerProps {
  events: SchedulerEvent[];
  view?: "week" | "day" | "month";
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
  onEventClick?: (event: SchedulerEvent) => void;
  onSlotClick?: (start: Date, end: Date) => void;
  onEventCreate?: (event: Partial<SchedulerEvent>) => void;
  onEventUpdate?: (event: SchedulerEvent) => void;
  className?: string;
  /** Start hour of day (0-23) */
  startHour?: number;
  /** End hour of day (0-23) */
  endHour?: number;
  /** Slot duration in minutes */
  slotDuration?: number;
  /** Timezone for display (IANA format) */
  timezone?: string;
  /** Show timezone selector */
  showTimezoneSelector?: boolean;
}

export interface WeekViewProps extends SchedulerProps {}
export interface DayViewProps extends SchedulerProps {}
export interface MonthViewProps extends SchedulerProps {}

/** Available time slot for booking */
export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
}

/** Common timezones for selector */
const COMMON_TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Phoenix", label: "Arizona (MST)" },
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Paris", label: "Central European (CET)" },
  { value: "Europe/Berlin", label: "Berlin (CET)" },
  { value: "Asia/Tokyo", label: "Japan (JST)" },
  { value: "Asia/Shanghai", label: "China (CST)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST)" },
];

/* ============================================
   Helper Functions
   ============================================ */
const getUserTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "America/New_York";
  }
};

const getTimezoneAbbreviation = (timezone: string): string => {
  try {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "short",
    });
    const parts = formatter.formatToParts(date);
    const tzPart = parts.find((p) => p.type === "timeZoneName");
    return tzPart?.value || timezone;
  } catch {
    return timezone;
  }
};
const getEventPosition = (
  event: SchedulerEvent,
  startHour: number,
  endHour: number
): { top: string; height: string } => {
  const start = typeof event.start === "string" ? parseISO(event.start) : event.start;
  const end = typeof event.end === "string" ? parseISO(event.end) : event.end;

  const dayStartMinutes = startHour * 60;
  const dayEndMinutes = endHour * 60;
  const totalMinutes = dayEndMinutes - dayStartMinutes;

  const eventStartMinutes = start.getHours() * 60 + start.getMinutes();
  const eventEndMinutes = end.getHours() * 60 + end.getMinutes();

  const topPercent = ((eventStartMinutes - dayStartMinutes) / totalMinutes) * 100;
  const heightPercent =
    ((eventEndMinutes - eventStartMinutes) / totalMinutes) * 100;

  return {
    top: `${Math.max(0, topPercent)}%`,
    height: `${Math.min(100 - topPercent, heightPercent)}%`,
  };
};

const getInterviewIcon = (type?: InterviewType) => {
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

const defaultEventColors: Record<InterviewType, string> = {
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

const TimeSlots: React.FC<TimeSlotsProps> = ({
  startHour,
  endHour,
  slotDuration,
}) => {
  const slots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(
      <div
        key={hour}
        className="h-12 border-b border-border-muted relative"
      >
        <span className="absolute -top-2.5 left-2 text-xs text-foreground-muted">
          {format(setHours(new Date(), hour), "h a")}
        </span>
      </div>
    );
  }
  return <div className="flex flex-col">{slots}</div>;
};

/* ============================================
   Event Card
   ============================================ */
interface EventCardProps {
  event: SchedulerEvent;
  onClick?: (event: SchedulerEvent) => void;
  compact?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick, compact = false }) => {
  const start = typeof event.start === "string" ? parseISO(event.start) : event.start;
  const end = typeof event.end === "string" ? parseISO(event.end) : event.end;

  return (
    <div
      onClick={() => onClick?.(event)}
      className={cn(
        "rounded-md border px-2 py-1 cursor-pointer overflow-hidden",
        "shadow-sm hover:shadow-md active:shadow-sm",
        "transition-all duration-fast hover:-translate-y-0.5 active:translate-y-0",
        event.type ? defaultEventColors[event.type] : "bg-badge-primary-background border-badge-primary-border"
      )}
    >
      <div className="flex items-start gap-1.5">
        <span className="flex-shrink-0 mt-0.5">{getInterviewIcon(event.type)}</span>
        <div className="min-w-0 flex-1">
          <p className={cn("font-medium truncate", compact ? "text-xs" : "text-sm")}>
            {event.title}
          </p>
          {!compact && (
            <>
              <p className="text-xs text-foreground-muted">
                {format(start, "h:mm a")} - {format(end, "h:mm a")}
              </p>
              {event.candidateName && (
                <div className="flex items-center gap-1 mt-1">
                  <User className="h-3 w-3 text-foreground-muted" />
                  <span className="text-xs truncate">{event.candidateName}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ============================================
   Timezone Selector Component
   ============================================ */
interface TimezoneSelectorProps {
  value: string;
  onChange: (timezone: string) => void;
  className?: string;
}

const TimezoneSelector: React.FC<TimezoneSelectorProps> = ({
  value,
  onChange,
  className,
}) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <GlobeHemisphereWest className="h-4 w-4 text-foreground-muted" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-auto h-8 text-sm border-0 bg-transparent px-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {COMMON_TIMEZONES.map((tz) => (
            <SelectItem key={tz.value} value={tz.value}>
              {tz.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

/* ============================================
   Calendly-Style Time Slot Picker
   ============================================ */
interface TimeSlotPickerProps {
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

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
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
    <div className={cn(
      "flex flex-col lg:flex-row rounded-2xl border border-border-muted bg-surface-default overflow-hidden shadow-sm",
      className
    )}>
      {/* Left: Calendar Panel */}
      <div className="lg:w-[340px] p-6 border-b lg:border-b-0 lg:border-r border-border-muted bg-gradient-to-b from-background-subtle/50 to-transparent">
        {/* Title Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary-100 dark:bg-primary-900/30">
              <CalendarIcon className="h-5 w-5 text-primary-600" weight="duotone" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground-default">{title}</h3>
              {subtitle && <p className="text-sm text-foreground-muted">{subtitle}</p>}
            </div>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="h-9 w-9 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <CaretLeft className="h-5 w-5" />
          </Button>
          <span className="text-base font-semibold">{format(currentMonth, "MMMM yyyy")}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="h-9 w-9 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <CaretRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-3">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-foreground-muted py-2 uppercase tracking-wide">
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
                  "focus:outline-none focus:ring-2 focus:ring-ring-color focus:ring-offset-1",
                  isSelected
                    ? "bg-primary-600 text-white shadow-md"
                    : isCurrentDay
                    ? "bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 font-semibold"
                    : isPastDay
                    ? "text-foreground-disabled cursor-not-allowed opacity-40"
                    : !isCurrentMonth
                    ? "text-foreground-muted/50"
                    : "text-foreground-default hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:scale-105"
                )}
              >
                {format(day, "d")}
                {/* Today indicator dot */}
                {isCurrentDay && !isSelected && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary-600" />
                )}
              </button>
            );
          })}
        </div>

        {/* Timezone Selector - Enhanced */}
        <div className="mt-6 pt-5 border-t border-border-muted">
          <div className="flex items-center gap-2 text-xs text-foreground-muted mb-2 uppercase tracking-wide font-medium">
            <GlobeHemisphereWest className="h-3.5 w-3.5" />
            Timezone
          </div>
          <TimezoneSelector
            value={timezone}
            onChange={handleTimezoneChange}
          />
        </div>
      </div>

      {/* Right: Time slots Panel */}
      <div className="flex-1 p-6 min-h-[380px] flex flex-col">
        {/* Date header */}
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-border-muted">
          <div>
            <h4 className="text-xl font-semibold text-foreground-default">
              {format(selectedDate, "EEEE")}
            </h4>
            <p className="text-sm text-foreground-muted mt-0.5">
              {format(selectedDate, "MMMM d, yyyy")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs px-3 py-1">
              {availableTimeSlots.length} available
            </Badge>
            <Badge variant="outline" className="text-xs px-3 py-1">
              {getTimezoneAbbreviation(timezone)}
            </Badge>
          </div>
        </div>

        {availableTimeSlots.length === 0 ? (
          /* Empty state - Enhanced */
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 mb-4">
              <CalendarIcon className="h-8 w-8 text-foreground-muted" />
            </div>
            <p className="font-semibold text-foreground-default text-lg">No available times</p>
            <p className="text-sm text-foreground-muted mt-1 max-w-[200px]">
              Try selecting a different date to find available time slots
            </p>
          </div>
        ) : (
          /* Time slots grid - Improved */
          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-[280px] overflow-y-auto pr-2">
            {availableTimeSlots.map((slot) => {
              const isSlotSelected = selectedSlot && isSameDay(selectedSlot, slot.start) &&
                selectedSlot.getHours() === slot.start.getHours() &&
                selectedSlot.getMinutes() === slot.start.getMinutes();

              return (
                <button
                  key={slot.start.toISOString()}
                  onClick={() => handleSlotClick(slot)}
                  className={cn(
                    "px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-150",
                    "border-2 focus:outline-none focus:ring-2 focus:ring-ring-color focus:ring-offset-1",
                    isSlotSelected
                      ? "bg-primary-600 text-white border-primary-600 shadow-md scale-[1.02]"
                      : "border-border-muted bg-white dark:bg-neutral-900 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:scale-[1.02]"
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
          <div className="mt-auto pt-5 border-t border-border-muted">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary-100 dark:bg-primary-800/50 flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-primary-600" weight="duotone" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-primary-900 dark:text-primary-100">
                  {format(selectedSlot, "h:mm a")} - {format(addMinutes(selectedSlot, slotDuration), "h:mm a")}
                </p>
                <p className="text-sm text-primary-700 dark:text-primary-300">
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
    const newDate = direction === "prev"
      ? subWeeks(selectedDate, 1)
      : addWeeks(selectedDate, 1);
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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-muted">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigateWeek("prev")}>
            <CaretLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigateWeek("next")}>
            <CaretRight className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-medium ml-2">
            {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
          </h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDateChange?.(new Date())}
        >
          Today
        </Button>
      </div>

      {/* Calendar grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* Time column */}
        <div className="w-16 flex-shrink-0 border-r border-border-muted pt-10">
          <TimeSlots startHour={startHour} endHour={endHour} slotDuration={slotDuration} />
        </div>

        {/* Days columns */}
        <div className="flex-1 flex overflow-x-auto">
          {days.map((day) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentDay = isToday(day);

            return (
              <div key={day.toISOString()} className="flex-1 min-w-32 border-r border-border-muted last:border-r-0">
                {/* Day header */}
                <div
                  className={cn(
                    "h-10 flex flex-col items-center justify-center border-b border-border-muted",
                    isCurrentDay && "bg-background-brand-subtle"
                  )}
                >
                  <span className="text-xs text-foreground-muted">
                    {format(day, "EEE")}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isCurrentDay && "text-foreground-brand"
                    )}
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
                        "focus:outline-none focus:ring-1 focus:ring-inset focus:ring-ring-color"
                      )}
                      onClick={() => handleSlotClick(day, startHour + i)}
                      aria-label={`Schedule at ${startHour + i}:00`}
                    />
                  ))}

                  {/* Events */}
                  <div className="absolute inset-0 pointer-events-none">
                    {dayEvents.map((event) => {
                      const position = getEventPosition(event, startHour, endHour);
                      return (
                        <div
                          key={event.id}
                          className="absolute left-1 right-1 pointer-events-auto"
                          style={{ top: position.top, height: position.height }}
                        >
                          <EventCard
                            event={event}
                            onClick={onEventClick}
                            compact={differenceInMinutes(
                              typeof event.end === "string" ? parseISO(event.end) : event.end,
                              typeof event.start === "string" ? parseISO(event.start) : event.start
                            ) < 45}
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
    const newDate = direction === "prev"
      ? addDays(selectedDate, -1)
      : addDays(selectedDate, 1);
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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-muted">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigateDay("prev")}>
            <CaretLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigateDay("next")}>
            <CaretRight className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-medium ml-2">
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDateChange?.(new Date())}
        >
          Today
        </Button>
      </div>

      {/* Day grid */}
      <div className="flex-1 flex overflow-auto">
        {/* Time column */}
        <div className="w-16 flex-shrink-0 border-r border-border-muted">
          <TimeSlots startHour={startHour} endHour={endHour} slotDuration={slotDuration} />
        </div>

        {/* Day column */}
        <div className="flex-1 relative">
          {/* Slot grid */}
          {Array.from({ length: endHour - startHour }).map((_, i) => (
            <button
              key={i}
              type="button"
              className={cn(
                "h-12 w-full border-b border-border-muted",
                "hover:bg-background-brand-subtle/50 active:bg-background-brand-subtle",
                "transition-colors duration-fast",
                "focus:outline-none focus:ring-1 focus:ring-inset focus:ring-ring-color"
              )}
              onClick={() => handleSlotClick(startHour + i)}
              aria-label={`Schedule at ${startHour + i}:00`}
            />
          ))}

          {/* Events */}
          <div className="absolute inset-0 pointer-events-none p-2">
            {dayEvents.map((event) => {
              const position = getEventPosition(event, startHour, endHour);
              return (
                <div
                  key={event.id}
                  className="absolute left-2 right-2 pointer-events-auto"
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
    const newDate = direction === "prev"
      ? subMonths(selectedDate, 1)
      : addMonths(selectedDate, 1);
    onDateChange?.(newDate);
  };

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => {
      const eventStart = typeof event.start === "string" ? parseISO(event.start) : event.start;
      return isSameDay(eventStart, day);
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-muted">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigateMonth("prev")}>
            <CaretLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigateMonth("next")}>
            <CaretRight className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-medium ml-2">
            {format(selectedDate, "MMMM yyyy")}
          </h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDateChange?.(new Date())}
        >
          Today
        </Button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-border-muted">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-medium text-foreground-muted"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 grid grid-cols-7 auto-rows-fr overflow-hidden">
        {days.map((day) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentDay = isToday(day);
          const isCurrentMonth = isSameMonth(day, selectedDate);

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "border-b border-r border-border-muted p-1 min-h-24",
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
                  "flex items-center justify-center w-7 h-7 rounded-full text-sm mb-1",
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
                      "text-xs px-1.5 py-0.5 rounded truncate cursor-pointer",
                      "hover:opacity-80 active:opacity-100 transition-opacity duration-fast",
                      event.type ? defaultEventColors[event.type] : "bg-badge-primary-background"
                    )}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <Badge variant="secondary" className="text-xs w-full justify-center py-0.5">
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
          "flex flex-col rounded-lg border border-border-muted bg-surface-default overflow-hidden",
          className
        )}
      >
        {/* View switcher */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border-muted bg-background-subtle">
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
   Upcoming Interviews List
   ============================================ */
interface UpcomingInterviewsProps {
  interviews: SchedulerEvent[];
  maxItems?: number;
  onViewAll?: () => void;
  onInterviewClick?: (interview: SchedulerEvent) => void;
  className?: string;
}

const UpcomingInterviews: React.FC<UpcomingInterviewsProps> = ({
  interviews,
  maxItems = 5,
  onViewAll,
  onInterviewClick,
  className,
}) => {
  // Sort by start time and filter future interviews
  const upcomingInterviews = interviews
    .filter((i) => {
      const start = typeof i.start === "string" ? parseISO(i.start) : i.start;
      return start > new Date();
    })
    .sort((a, b) => {
      const aStart = typeof a.start === "string" ? parseISO(a.start) : a.start;
      const bStart = typeof b.start === "string" ? parseISO(b.start) : b.start;
      return aStart.getTime() - bStart.getTime();
    })
    .slice(0, maxItems);

  if (upcomingInterviews.length === 0) {
    return (
      <div className={cn("text-center py-8 animate-fade-in", className)}>
        <div className="w-14 h-14 rounded-full bg-background-muted flex items-center justify-center mx-auto mb-4">
          <CalendarIcon className="h-7 w-7 text-foreground-muted" />
        </div>
        <p className="font-medium text-foreground-default">No upcoming interviews</p>
        <p className="text-sm text-foreground-muted mt-1">Schedule interviews to see them here</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {upcomingInterviews.map((interview) => {
        const start = typeof interview.start === "string" ? parseISO(interview.start) : interview.start;
        const end = typeof interview.end === "string" ? parseISO(interview.end) : interview.end;

        return (
          <div
            key={interview.id}
            onClick={() => onInterviewClick?.(interview)}
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg border border-border-muted",
              "hover:bg-card-background-hover hover:shadow-sm hover:border-border-default",
              "active:shadow-none cursor-pointer",
              "transition-all duration-fast"
            )}
          >
            {/* Date badge */}
            <div className="flex-shrink-0 w-12 text-center">
              <p className="text-xs text-foreground-muted uppercase">
                {format(start, "MMM")}
              </p>
              <p className="text-2xl font-bold text-foreground-default">
                {format(start, "d")}
              </p>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {getInterviewIcon(interview.type)}
                <p className="font-medium truncate">{interview.title}</p>
              </div>
              <p className="text-sm text-foreground-muted">
                {format(start, "h:mm a")} - {format(end, "h:mm a")}
              </p>
              {interview.candidateName && (
                <div className="flex items-center gap-2 mt-2">
                  <Avatar
                    src={interview.candidateAvatar}
                    name={interview.candidateName}
                    size="xs"
                  />
                  <span className="text-sm">{interview.candidateName}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <DotsThree className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Reschedule</DropdownMenuItem>
                <DropdownMenuItem>Send reminder</DropdownMenuItem>
                <DropdownMenuItem className="text-foreground-error">
                  Cancel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      })}

      {interviews.length > maxItems && onViewAll && (
        <Button variant="ghost" className="w-full" onClick={onViewAll}>
          View all ({interviews.length})
        </Button>
      )}
    </div>
  );
};

/* ============================================
   Self-Booking Link Component
   ============================================ */
interface BookingLinkProps {
  /** The booking link URL */
  link: string;
  /** Title for the booking page */
  title?: string;
  /** Duration of the meeting in minutes */
  duration?: number;
  /** Whether the link is active */
  isActive?: boolean;
  /** Callback when link is copied */
  onCopy?: () => void;
  /** Callback to toggle link status */
  onToggleStatus?: (active: boolean) => void;
  className?: string;
}

const BookingLink: React.FC<BookingLinkProps> = ({
  link,
  title = "Schedule a Meeting",
  duration = 30,
  isActive = true,
  onCopy,
  onToggleStatus,
  className,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-border-muted bg-surface-default overflow-hidden",
        !isActive && "opacity-60",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-muted bg-gradient-to-b from-background-subtle/50 to-transparent">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary-100 dark:bg-primary-900/30">
            <LinkIcon className="h-5 w-5 text-primary-600" weight="duotone" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground-default">{title}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <Clock className="h-3.5 w-3.5 text-foreground-muted" />
              <span className="text-sm text-foreground-muted">{duration} minutes</span>
            </div>
          </div>
        </div>
        {onToggleStatus && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-foreground-muted">
              {isActive ? "Active" : "Inactive"}
            </span>
            <button
              onClick={() => onToggleStatus(!isActive)}
              className={cn(
                "relative h-6 w-11 rounded-full transition-colors duration-200",
                isActive ? "bg-primary-600" : "bg-neutral-300 dark:bg-neutral-600"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200",
                  isActive && "translate-x-5"
                )}
              />
            </button>
          </div>
        )}
      </div>

      {/* Link section */}
      <div className="p-5">
        <label className="text-xs font-medium uppercase tracking-wider text-foreground-muted mb-2 block">
          Booking Link
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-border-muted overflow-hidden">
            <LinkIcon className="h-4 w-4 text-foreground-muted flex-shrink-0" />
            <span className="text-sm font-mono text-foreground-default truncate">
              {link}
            </span>
          </div>
          <Button
            variant={copied ? "secondary" : "primary"}
            size="default"
            onClick={handleCopy}
            className="gap-2 flex-shrink-0"
          >
            {copied ? (
              <>
                <CheckCircle className="h-4 w-4" weight="fill" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </Button>
        </div>

        {/* Share options */}
        <div className="flex items-center gap-2 mt-4">
          <Button variant="outline" size="sm" className="gap-1.5 flex-1">
            <Users className="h-4 w-4" />
            Share with candidate
          </Button>
          <Button variant="ghost" size="sm" className="gap-1.5">
            <CalendarIcon className="h-4 w-4" />
            Preview
          </Button>
        </div>
      </div>

      {/* Stats (optional) */}
      <div className="px-5 py-3 border-t border-border-muted bg-neutral-50/50 dark:bg-neutral-900/30">
        <div className="flex items-center justify-between text-sm">
          <span className="text-foreground-muted">Total bookings this month</span>
          <span className="font-semibold text-foreground-default">12</span>
        </div>
      </div>
    </div>
  );
};

/* ============================================
   Exports
   ============================================ */
export {
  Scheduler,
  WeekView,
  DayView,
  MonthView,
  EventCard,
  InterviewScheduler,
  UpcomingInterviews,
  TimeSlotPicker,
  TimezoneSelector,
  BookingLink,
  getEventPosition,
  getInterviewIcon,
  getUserTimezone,
  getTimezoneAbbreviation,
  COMMON_TIMEZONES,
};
