"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Avatar } from "./avatar";
import { Badge } from "./badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "./dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./dropdown";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  isBefore,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  setHours,
  setMinutes,
  addMinutes,
  differenceInMinutes,
  parseISO,
  isSameMonth,
  getDay,
} from "date-fns";
import {
  X,
  CaretLeft,
  CaretRight,
  Clock,
  VideoCamera,
  Phone,
  MapPin,
  Plus,
  DotsThree,
  User,
  CalendarBlank,
  GlobeHemisphereWest,
  MagnifyingGlass,
  Funnel,
  CaretDown,
  Eye,
  EyeSlash,
  Check,
  Lightning,
  Command,
  ArrowsOutSimple,
  Keyboard,
  ArrowsInSimple,
  CalendarCheck,
  Users,
  Briefcase,
  Star,
} from "@phosphor-icons/react";

/* ============================================
   Types
   ============================================ */
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date | string;
  end: Date | string;
  type?: "interview" | "meeting" | "block" | "interview-video" | "interview-phone" | "interview-onsite";
  status?: "confirmed" | "tentative" | "cancelled";
  candidateId?: string;
  candidateName?: string;
  candidateAvatar?: string;
  jobId?: string;
  jobTitle?: string;
  interviewers?: { id: string; name: string; avatar?: string; role?: string }[];
  location?: string;
  meetingLink?: string;
  notes?: string;
  color?: string;
  isAllDay?: boolean;
}

export interface CalendarFilter {
  id: string;
  label: string;
  color: string;
  enabled: boolean;
}

export interface CalendarConfig {
  id: string;
  name: string;
  email: string;
  color: string;
  visible: boolean;
}

/* ============================================
   Constants
   ============================================ */
const VIEW_OPTIONS = [
  { value: "day", label: "Day", shortcut: "D" },
  { value: "week", label: "Week", shortcut: "W" },
  { value: "month", label: "Month", shortcut: "M" },
];

const DEFAULT_FILTERS: CalendarFilter[] = [
  { id: "interviews", label: "Interviews", color: "var(--primitive-green-500)", enabled: true },
  { id: "meetings", label: "Meetings", color: "var(--primitive-blue-500)", enabled: true },
  { id: "blocks", label: "Focus Time", color: "var(--primitive-neutral-400)", enabled: true },
];

const KEYBOARD_SHORTCUTS = [
  { keys: ["T"], action: "Go to today" },
  { keys: ["J"], action: "Previous period" },
  { keys: ["K"], action: "Next period" },
  { keys: ["D"], action: "Day view" },
  { keys: ["W"], action: "Week view" },
  { keys: ["M"], action: "Month view" },
  { keys: ["N"], action: "New event" },
  { keys: ["⌘", "K"], action: "Quick search" },
  { keys: ["?"], action: "Keyboard shortcuts" },
];

/* ============================================
   Helper Functions
   ============================================ */
const getEventPosition = (
  event: CalendarEvent,
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
  const heightPercent = ((eventEndMinutes - eventStartMinutes) / totalMinutes) * 100;

  return {
    top: `${Math.max(0, topPercent)}%`,
    height: `${Math.min(100 - topPercent, Math.max(2, heightPercent))}%`,
  };
};

const getEventTypeIcon = (type?: CalendarEvent["type"]) => {
  switch (type) {
    case "interview-video":
      return <VideoCamera className="h-3 w-3" weight="fill" />;
    case "interview-phone":
      return <Phone className="h-3 w-3" weight="fill" />;
    case "interview-onsite":
      return <MapPin className="h-3 w-3" weight="fill" />;
    case "interview":
      return <Users className="h-3 w-3" weight="fill" />;
    case "meeting":
      return <CalendarBlank className="h-3 w-3" />;
    case "block":
      return <Clock className="h-3 w-3" />;
    default:
      return <CalendarBlank className="h-3 w-3" />;
  }
};

const getEventColorClass = (event: CalendarEvent): string => {
  if (event.color) return "";

  switch (event.type) {
    case "interview":
    case "interview-video":
    case "interview-phone":
    case "interview-onsite":
      return "bg-[var(--primitive-green-100)] border-[var(--primitive-green-400)] text-[var(--primitive-green-800)]";
    case "meeting":
      return "bg-[var(--primitive-blue-100)] border-[var(--primitive-blue-400)] text-[var(--primitive-blue-800)]";
    case "block":
      return "bg-[var(--primitive-neutral-200)] border-[var(--primitive-neutral-400)] text-[var(--primitive-neutral-700)]";
    default:
      return "bg-[var(--primitive-blue-100)] border-[var(--primitive-blue-400)] text-[var(--primitive-blue-800)]";
  }
};

const getUserTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "America/New_York";
  }
};

const getTimezoneAbbr = (timezone: string): string => {
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

/* ============================================
   MiniCalendar Component
   ============================================ */
interface MiniCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  events?: CalendarEvent[];
  className?: string;
}

const MiniCalendar: React.FC<MiniCalendarProps> = ({
  selectedDate,
  onDateSelect,
  events = [],
  className,
}) => {
  const [viewMonth, setViewMonth] = React.useState(selectedDate);

  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const hasEventsOnDay = (day: Date): boolean => {
    return events.some((event) => {
      const eventDate = typeof event.start === "string" ? parseISO(event.start) : event.start;
      return isSameDay(eventDate, day);
    });
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setViewMonth(subMonths(viewMonth, 1))}
          className="p-1 rounded hover:bg-[var(--primitive-neutral-200)] text-[var(--foreground-muted)] transition-colors"
        >
          <CaretLeft size={14} weight="bold" />
        </button>
        <span className="text-sm font-medium text-[var(--foreground-default)]">
          {format(viewMonth, "MMMM yyyy")}
        </span>
        <button
          onClick={() => setViewMonth(addMonths(viewMonth, 1))}
          className="p-1 rounded hover:bg-[var(--primitive-neutral-200)] text-[var(--foreground-muted)] transition-colors"
        >
          <CaretRight size={14} weight="bold" />
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 mb-1">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
          <div
            key={i}
            className="text-center text-[10px] font-medium text-[var(--foreground-muted)] py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, viewMonth);
          const hasEvents = hasEventsOnDay(day);
          const isTodayDate = isToday(day);

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateSelect(day)}
              className={cn(
                "relative h-7 w-7 flex items-center justify-center rounded text-xs transition-all",
                "hover:bg-[var(--primitive-neutral-200)]",
                isSelected && "bg-[var(--primitive-green-600)] text-white hover:bg-[var(--primitive-green-700)]",
                !isSelected && isTodayDate && "font-bold text-[var(--primitive-green-700)]",
                !isCurrentMonth && "text-[var(--foreground-muted)]/50",
                isCurrentMonth && !isSelected && !isTodayDate && "text-[var(--foreground-default)]"
              )}
            >
              {format(day, "d")}
              {/* Event indicator dot */}
              {hasEvents && !isSelected && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--primitive-green-500)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ============================================
   CalendarEvent Card Component
   ============================================ */
interface CalendarEventCardProps {
  event: CalendarEvent;
  variant?: "default" | "compact" | "minimal";
  onClick?: (event: CalendarEvent) => void;
  onContextMenu?: (event: CalendarEvent, e: React.MouseEvent) => void;
  className?: string;
}

const CalendarEventCard: React.FC<CalendarEventCardProps> = ({
  event,
  variant = "default",
  onClick,
  onContextMenu,
  className,
}) => {
  const start = typeof event.start === "string" ? parseISO(event.start) : event.start;
  const end = typeof event.end === "string" ? parseISO(event.end) : event.end;
  const durationMinutes = differenceInMinutes(end, start);
  const isCompact = variant === "compact" || durationMinutes < 45;
  const isMinimal = variant === "minimal" || durationMinutes < 30;

  return (
    <div
      onClick={() => onClick?.(event)}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu?.(event, e);
      }}
      style={event.color ? {
        backgroundColor: `${event.color}20`,
        borderColor: event.color,
        color: event.color
      } : undefined}
      className={cn(
        "rounded-md border-l-[3px] px-2 py-1 cursor-pointer overflow-hidden",
        "transition-all duration-100",
        "hover:shadow-md hover:-translate-y-[1px] active:translate-y-0 active:shadow-sm",
        getEventColorClass(event),
        className
      )}
    >
      <div className="flex items-start gap-1.5">
        {/* Icon */}
        {!isMinimal && (
          <span className="flex-shrink-0 mt-0.5 opacity-70">
            {getEventTypeIcon(event.type)}
          </span>
        )}

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className={cn(
            "font-medium truncate",
            isMinimal ? "text-[10px]" : isCompact ? "text-xs" : "text-sm"
          )}>
            {event.title}
          </p>

          {!isMinimal && (
            <p className={cn(
              "opacity-70",
              isCompact ? "text-[10px]" : "text-xs"
            )}>
              {format(start, "h:mm")} - {format(end, "h:mm a")}
            </p>
          )}

          {/* Candidate info for interviews */}
          {!isCompact && !isMinimal && event.candidateName && (
            <div className="flex items-center gap-1 mt-1">
              <Avatar
                src={event.candidateAvatar}
                name={event.candidateName}
                size="xs"
                className="w-4 h-4"
              />
              <span className="text-[10px] truncate">{event.candidateName}</span>
              {event.jobTitle && (
                <span className="text-[10px] opacity-70 truncate">· {event.jobTitle}</span>
              )}
            </div>
          )}
        </div>

        {/* Status indicator */}
        {event.status === "tentative" && (
          <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[var(--primitive-yellow-500)]" />
        )}
      </div>
    </div>
  );
};

/* ============================================
   CalendarSidebar Component
   ============================================ */
interface CalendarSidebarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  events?: CalendarEvent[];
  calendars?: CalendarConfig[];
  filters?: CalendarFilter[];
  onCalendarToggle?: (calendarId: string) => void;
  onFilterToggle?: (filterId: string) => void;
  onCreateEvent?: () => void;
  className?: string;
}

const CalendarSidebar: React.FC<CalendarSidebarProps> = ({
  selectedDate,
  onDateSelect,
  events = [],
  calendars = [],
  filters = DEFAULT_FILTERS,
  onCalendarToggle,
  onFilterToggle,
  onCreateEvent,
  className,
}) => {
  const todayEvents = events.filter((event) => {
    const eventDate = typeof event.start === "string" ? parseISO(event.start) : event.start;
    return isSameDay(eventDate, selectedDate);
  });

  const upcomingInterviews = events
    .filter((event) => {
      const eventDate = typeof event.start === "string" ? parseISO(event.start) : event.start;
      return eventDate > new Date() && event.type?.includes("interview");
    })
    .slice(0, 3);

  return (
    <div className={cn("w-64 flex flex-col bg-[var(--card-background)] border-r border-[var(--primitive-neutral-200)]", className)}>
      {/* Create Button */}
      <div className="p-4">
        <Button
          onClick={onCreateEvent}
          className="w-full gap-2"
        >
          <Plus size={16} weight="bold" />
          <span>New Event</span>
        </Button>
      </div>

      {/* Mini Calendar */}
      <div className="px-4 pb-4">
        <MiniCalendar
          selectedDate={selectedDate}
          onDateSelect={onDateSelect}
          events={events}
        />
      </div>

      {/* Divider */}
      <div className="border-t border-[var(--primitive-neutral-200)]" />

      {/* Today's Schedule */}
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <h3 className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
            {isToday(selectedDate) ? "Today's Schedule" : format(selectedDate, "MMM d")}
          </h3>
          {todayEvents.length === 0 ? (
            <p className="text-sm text-[var(--foreground-muted)] italic">
              No events scheduled
            </p>
          ) : (
            <div className="space-y-2">
              {todayEvents.slice(0, 5).map((event) => (
                <CalendarEventCard
                  key={event.id}
                  event={event}
                  variant="compact"
                />
              ))}
              {todayEvents.length > 5 && (
                <p className="text-xs text-[var(--foreground-muted)]">
                  +{todayEvents.length - 5} more
                </p>
              )}
            </div>
          )}
        </div>

        {/* Upcoming Interviews */}
        {upcomingInterviews.length > 0 && (
          <div className="px-4 pb-4">
            <h3 className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
              Upcoming Interviews
            </h3>
            <div className="space-y-2">
              {upcomingInterviews.map((event) => {
                const start = typeof event.start === "string" ? parseISO(event.start) : event.start;
                return (
                  <div
                    key={event.id}
                    className="p-2 rounded-lg bg-[var(--primitive-green-50)] border border-[var(--primitive-green-200)]"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar
                        src={event.candidateAvatar}
                        name={event.candidateName || ""}
                        size="xs"
                        className="w-6 h-6"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{event.candidateName}</p>
                        <p className="text-[10px] text-[var(--foreground-muted)]">
                          {format(start, "EEE, MMM d 'at' h:mm a")}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Calendars */}
        {calendars.length > 0 && (
          <div className="px-4 pb-4">
            <h3 className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
              My Calendars
            </h3>
            <div className="space-y-1">
              {calendars.map((cal) => (
                <label
                  key={cal.id}
                  className="flex items-center gap-2 p-1.5 rounded hover:bg-[var(--primitive-neutral-100)] cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={cal.visible}
                    onChange={() => onCalendarToggle?.(cal.id)}
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      "w-3 h-3 rounded border-2 flex items-center justify-center transition-colors",
                      cal.visible
                        ? "border-transparent"
                        : "border-[var(--primitive-neutral-400)]"
                    )}
                    style={{
                      backgroundColor: cal.visible ? cal.color : "transparent",
                    }}
                  >
                    {cal.visible && <Check size={8} weight="bold" className="text-white" />}
                  </span>
                  <span className="text-sm text-[var(--foreground-default)] truncate">
                    {cal.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="px-4 pb-4">
          <h3 className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
            Event Types
          </h3>
          <div className="space-y-1">
            {filters.map((filter) => (
              <label
                key={filter.id}
                className="flex items-center gap-2 p-1.5 rounded hover:bg-[var(--primitive-neutral-100)] cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={filter.enabled}
                  onChange={() => onFilterToggle?.(filter.id)}
                  className="sr-only"
                />
                <span
                  className={cn(
                    "w-3 h-3 rounded border-2 flex items-center justify-center transition-colors",
                    filter.enabled
                      ? "border-transparent"
                      : "border-[var(--primitive-neutral-400)]"
                  )}
                  style={{
                    backgroundColor: filter.enabled ? filter.color : "transparent",
                  }}
                >
                  {filter.enabled && <Check size={8} weight="bold" className="text-white" />}
                </span>
                <span className="text-sm text-[var(--foreground-default)]">
                  {filter.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Footer */}
      <div className="p-3 border-t border-[var(--primitive-neutral-200)]">
        <button className="flex items-center gap-2 text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground-default)] transition-colors">
          <Keyboard size={14} />
          <span>Keyboard shortcuts</span>
          <span className="ml-auto text-[10px] bg-[var(--primitive-neutral-200)] px-1.5 py-0.5 rounded">?</span>
        </button>
      </div>
    </div>
  );
};

/* ============================================
   CalendarHeader Component
   ============================================ */
interface CalendarHeaderProps {
  selectedDate: Date;
  view: "day" | "week" | "month";
  onViewChange: (view: "day" | "week" | "month") => void;
  onDateChange: (date: Date) => void;
  onSearch?: () => void;
  timezone?: string;
  onTimezoneChange?: (tz: string) => void;
  className?: string;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  selectedDate,
  view,
  onViewChange,
  onDateChange,
  onSearch,
  timezone,
  onTimezoneChange,
  className,
}) => {
  const navigatePeriod = (direction: "prev" | "next") => {
    let newDate: Date;
    switch (view) {
      case "day":
        newDate = direction === "prev" ? addDays(selectedDate, -1) : addDays(selectedDate, 1);
        break;
      case "week":
        newDate = direction === "prev" ? subWeeks(selectedDate, 1) : addWeeks(selectedDate, 1);
        break;
      case "month":
        newDate = direction === "prev" ? subMonths(selectedDate, 1) : addMonths(selectedDate, 1);
        break;
      default:
        newDate = selectedDate;
    }
    onDateChange(newDate);
  };

  const getDateRangeLabel = (): string => {
    switch (view) {
      case "day":
        return format(selectedDate, "EEEE, MMMM d, yyyy");
      case "week": {
        const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
        const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
        if (start.getMonth() === end.getMonth()) {
          return `${format(start, "MMMM d")} – ${format(end, "d, yyyy")}`;
        }
        return `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`;
      }
      case "month":
        return format(selectedDate, "MMMM yyyy");
      default:
        return "";
    }
  };

  return (
    <div className={cn(
      "flex items-center justify-between px-4 py-3 border-b border-[var(--primitive-neutral-200)] bg-[var(--card-background)]",
      className
    )}>
      {/* Left: Navigation */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigatePeriod("prev")}
            className="p-1.5 rounded hover:bg-[var(--primitive-neutral-200)] text-[var(--foreground-muted)] hover:text-[var(--foreground-default)] transition-colors"
            aria-label="Previous"
          >
            <CaretLeft size={16} weight="bold" />
          </button>
          <button
            onClick={() => navigatePeriod("next")}
            className="p-1.5 rounded hover:bg-[var(--primitive-neutral-200)] text-[var(--foreground-muted)] hover:text-[var(--foreground-default)] transition-colors"
            aria-label="Next"
          >
            <CaretRight size={16} weight="bold" />
          </button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onDateChange(new Date())}
          className="text-sm"
        >
          Today
        </Button>

        <h1 className="text-lg font-semibold text-[var(--foreground-default)]">
          {getDateRangeLabel()}
        </h1>
      </div>

      {/* Right: View Switcher & Actions */}
      <div className="flex items-center gap-3">
        {/* Timezone */}
        {timezone && (
          <div className="flex items-center gap-1.5 text-sm text-[var(--foreground-muted)]">
            <GlobeHemisphereWest size={14} />
            <span>{getTimezoneAbbr(timezone)}</span>
          </div>
        )}

        {/* Search */}
        <button
          onClick={onSearch}
          className="p-2 rounded hover:bg-[var(--primitive-neutral-200)] text-[var(--foreground-muted)] hover:text-[var(--foreground-default)] transition-colors"
          aria-label="Search"
        >
          <MagnifyingGlass size={18} />
        </button>

        {/* View Switcher */}
        <div className="flex items-center bg-[var(--primitive-neutral-100)] rounded-lg p-0.5">
          {VIEW_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onViewChange(opt.value as "day" | "week" | "month")}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                view === opt.value
                  ? "bg-[var(--background-interactive-default)] text-[var(--foreground-default)] shadow-sm"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground-default)]"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ============================================
   CalendarGrid - Day View
   ============================================ */
interface CalendarDayGridProps {
  date: Date;
  events: CalendarEvent[];
  startHour?: number;
  endHour?: number;
  onEventClick?: (event: CalendarEvent) => void;
  onSlotClick?: (start: Date, end: Date) => void;
  className?: string;
}

const CalendarDayGrid: React.FC<CalendarDayGridProps> = ({
  date,
  events,
  startHour = 7,
  endHour = 20,
  onEventClick,
  onSlotClick,
  className,
}) => {
  const dayEvents = events.filter((event) => {
    const eventDate = typeof event.start === "string" ? parseISO(event.start) : event.start;
    return isSameDay(eventDate, date);
  });

  const handleSlotClick = (hour: number) => {
    const start = setMinutes(setHours(date, hour), 0);
    const end = addMinutes(start, 60);
    onSlotClick?.(start, end);
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* All-day events */}
      <div className="flex-shrink-0 px-2 py-1 border-b border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-50)]">
        <span className="text-xs text-[var(--foreground-muted)]">All day</span>
      </div>

      {/* Time grid */}
      <div className="flex-1 flex overflow-auto">
        {/* Time labels */}
        <div className="w-16 flex-shrink-0 border-r border-[var(--primitive-neutral-200)]">
          {Array.from({ length: endHour - startHour }).map((_, i) => (
            <div key={i} className="h-16 relative">
              <span className="absolute -top-2 right-2 text-[11px] text-[var(--foreground-muted)]">
                {format(setHours(new Date(), startHour + i), "h a")}
              </span>
            </div>
          ))}
        </div>

        {/* Day column */}
        <div className="flex-1 relative">
          {/* Hour slots */}
          {Array.from({ length: endHour - startHour }).map((_, i) => (
            <button
              key={i}
              type="button"
              className={cn(
                "h-16 w-full border-b border-[var(--primitive-neutral-200)]",
                "hover:bg-[var(--primitive-green-50)] transition-colors"
              )}
              onClick={() => handleSlotClick(startHour + i)}
            >
              {/* Half hour line */}
              <div className="h-1/2 border-b border-dashed border-[var(--primitive-neutral-200)]" />
            </button>
          ))}

          {/* Events */}
          <div className="absolute inset-x-2 top-0 bottom-0 pointer-events-none">
            {dayEvents.map((event) => {
              const position = getEventPosition(event, startHour, endHour);
              return (
                <div
                  key={event.id}
                  className="absolute left-0 right-0 pointer-events-auto"
                  style={{ top: position.top, height: position.height }}
                >
                  <CalendarEventCard
                    event={event}
                    onClick={onEventClick}
                    className="h-full"
                  />
                </div>
              );
            })}
          </div>

          {/* Current time indicator */}
          {isToday(date) && (
            <div
              className="absolute left-0 right-0 z-10 pointer-events-none"
              style={{
                top: getEventPosition(
                  { id: "now", title: "", start: new Date(), end: new Date() },
                  startHour,
                  endHour
                ).top,
              }}
            >
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-[var(--primitive-red-500)]" />
                <div className="flex-1 h-0.5 bg-[var(--primitive-red-500)]" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ============================================
   CalendarGrid - Week View
   ============================================ */
interface CalendarWeekGridProps {
  date: Date;
  events: CalendarEvent[];
  startHour?: number;
  endHour?: number;
  onEventClick?: (event: CalendarEvent) => void;
  onSlotClick?: (start: Date, end: Date) => void;
  className?: string;
}

const CalendarWeekGrid: React.FC<CalendarWeekGridProps> = ({
  date,
  events,
  startHour = 7,
  endHour = 20,
  onEventClick,
  onSlotClick,
  className,
}) => {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => {
      const eventDate = typeof event.start === "string" ? parseISO(event.start) : event.start;
      return isSameDay(eventDate, day);
    });
  };

  const handleSlotClick = (day: Date, hour: number) => {
    const start = setMinutes(setHours(day, hour), 0);
    const end = addMinutes(start, 60);
    onSlotClick?.(start, end);
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Day headers */}
      <div className="flex-shrink-0 flex border-b border-[var(--primitive-neutral-200)] bg-[var(--card-background)]">
        <div className="w-16 flex-shrink-0 border-r border-[var(--primitive-neutral-200)]" />
        {days.map((day) => {
          const isTodayDate = isToday(day);
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "flex-1 py-2 text-center border-r border-[var(--primitive-neutral-200)] last:border-r-0",
                isTodayDate && "bg-[var(--primitive-green-50)]"
              )}
            >
              <p className="text-xs text-[var(--foreground-muted)]">
                {format(day, "EEE")}
              </p>
              <p
                className={cn(
                  "text-lg font-semibold mt-0.5",
                  isTodayDate
                    ? "w-8 h-8 mx-auto flex items-center justify-center rounded-full bg-[var(--primitive-green-600)] text-white"
                    : "text-[var(--foreground-default)]"
                )}
              >
                {format(day, "d")}
              </p>
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div className="flex-1 flex overflow-auto">
        {/* Time labels */}
        <div className="w-16 flex-shrink-0 border-r border-[var(--primitive-neutral-200)]">
          {Array.from({ length: endHour - startHour }).map((_, i) => (
            <div key={i} className="h-12 relative">
              <span className="absolute -top-2 right-2 text-[11px] text-[var(--foreground-muted)]">
                {format(setHours(new Date(), startHour + i), "h a")}
              </span>
            </div>
          ))}
        </div>

        {/* Day columns */}
        <div className="flex-1 flex">
          {days.map((day) => {
            const dayEvents = getEventsForDay(day);
            const isTodayDate = isToday(day);

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "flex-1 relative border-r border-[var(--primitive-neutral-200)] last:border-r-0",
                  isTodayDate && "bg-[var(--primitive-green-50)]/30"
                )}
              >
                {/* Hour slots */}
                {Array.from({ length: endHour - startHour }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={cn(
                      "h-12 w-full border-b border-[var(--primitive-neutral-200)]",
                      "hover:bg-[var(--primitive-green-100)]/50 transition-colors"
                    )}
                    onClick={() => handleSlotClick(day, startHour + i)}
                  />
                ))}

                {/* Events */}
                <div className="absolute inset-x-0.5 top-0 bottom-0 pointer-events-none">
                  {dayEvents.map((event) => {
                    const position = getEventPosition(event, startHour, endHour);
                    return (
                      <div
                        key={event.id}
                        className="absolute left-0 right-0 pointer-events-auto px-0.5"
                        style={{ top: position.top, height: position.height }}
                      >
                        <CalendarEventCard
                          event={event}
                          variant="compact"
                          onClick={onEventClick}
                          className="h-full"
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Current time indicator */}
                {isTodayDate && (
                  <div
                    className="absolute left-0 right-0 z-10 pointer-events-none"
                    style={{
                      top: getEventPosition(
                        { id: "now", title: "", start: new Date(), end: new Date() },
                        startHour,
                        endHour
                      ).top,
                    }}
                  >
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-[var(--primitive-red-500)]" />
                      <div className="flex-1 h-0.5 bg-[var(--primitive-red-500)]" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ============================================
   CalendarGrid - Month View
   ============================================ */
interface CalendarMonthGridProps {
  date: Date;
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onDayClick?: (date: Date) => void;
  className?: string;
}

const CalendarMonthGrid: React.FC<CalendarMonthGridProps> = ({
  date,
  events,
  onEventClick,
  onDayClick,
  className,
}) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => {
      const eventDate = typeof event.start === "string" ? parseISO(event.start) : event.start;
      return isSameDay(eventDate, day);
    });
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Day headers */}
      <div className="flex-shrink-0 grid grid-cols-7 border-b border-[var(--primitive-neutral-200)] bg-[var(--card-background)]">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div
            key={day}
            className="py-2 text-center text-sm font-medium text-[var(--foreground-muted)]"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="flex-1 grid grid-cols-7 auto-rows-fr overflow-hidden">
        {days.map((day) => {
          const dayEvents = getEventsForDay(day);
          const isTodayDate = isToday(day);
          const isCurrentMonth = isSameMonth(day, date);

          return (
            <div
              key={day.toISOString()}
              onClick={() => onDayClick?.(day)}
              className={cn(
                "min-h-24 p-1 border-b border-r border-[var(--primitive-neutral-200)]",
                "hover:bg-[var(--primitive-neutral-50)] cursor-pointer transition-colors",
                !isCurrentMonth && "bg-[var(--primitive-neutral-50)] opacity-60"
              )}
            >
              {/* Day number */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className={cn(
                    "w-6 h-6 flex items-center justify-center text-sm",
                    isTodayDate
                      ? "rounded-full bg-[var(--primitive-green-600)] text-white font-semibold"
                      : "text-[var(--foreground-default)]"
                  )}
                >
                  {format(day, "d")}
                </span>
              </div>

              {/* Events */}
              <div className="space-y-0.5">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick?.(event);
                    }}
                    className={cn(
                      "text-[10px] font-medium px-1.5 py-0.5 rounded truncate cursor-pointer",
                      "hover:opacity-80 transition-opacity",
                      getEventColorClass(event)
                    )}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <span className="text-[10px] text-[var(--foreground-muted)] pl-1">
                    +{dayEvents.length - 3} more
                  </span>
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
   Main RecruiterCalendarView Component
   ============================================ */
export interface RecruiterCalendarViewProps {
  events?: CalendarEvent[];
  calendars?: CalendarConfig[];
  initialView?: "day" | "week" | "month";
  initialDate?: Date;
  onEventClick?: (event: CalendarEvent) => void;
  onSlotClick?: (start: Date, end: Date) => void;
  onCreateEvent?: () => void;
  timezone?: string;
  className?: string;
}

const RecruiterCalendarView: React.FC<RecruiterCalendarViewProps> = ({
  events = [],
  calendars = [],
  initialView = "week",
  initialDate,
  onEventClick,
  onSlotClick,
  onCreateEvent,
  timezone,
  className,
}) => {
  const [view, setView] = React.useState<"day" | "week" | "month">(initialView);
  const [selectedDate, setSelectedDate] = React.useState(initialDate || new Date());
  const [filters, setFilters] = React.useState<CalendarFilter[]>(DEFAULT_FILTERS);
  const [visibleCalendars, setVisibleCalendars] = React.useState<string[]>(
    calendars.map((c) => c.id)
  );
  const [showShortcuts, setShowShortcuts] = React.useState(false);
  const currentTimezone = timezone || getUserTimezone();

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case "t":
          setSelectedDate(new Date());
          break;
        case "j":
          setSelectedDate((prev) => {
            switch (view) {
              case "day":
                return addDays(prev, -1);
              case "week":
                return subWeeks(prev, 1);
              case "month":
                return subMonths(prev, 1);
              default:
                return prev;
            }
          });
          break;
        case "k":
          setSelectedDate((prev) => {
            switch (view) {
              case "day":
                return addDays(prev, 1);
              case "week":
                return addWeeks(prev, 1);
              case "month":
                return addMonths(prev, 1);
              default:
                return prev;
            }
          });
          break;
        case "d":
          setView("day");
          break;
        case "w":
          setView("week");
          break;
        case "m":
          setView("month");
          break;
        case "n":
          onCreateEvent?.();
          break;
        case "?":
          setShowShortcuts((prev) => !prev);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [view, onCreateEvent]);

  // Filter events based on active filters and visible calendars
  const filteredEvents = React.useMemo(() => {
    return events.filter((event) => {
      // Check type filter
      const typeMatch = filters.some((f) => {
        if (!f.enabled) return false;
        if (f.id === "interviews" && event.type?.includes("interview")) return true;
        if (f.id === "meetings" && event.type === "meeting") return true;
        if (f.id === "blocks" && event.type === "block") return true;
        return false;
      });

      return typeMatch;
    });
  }, [events, filters]);

  const handleFilterToggle = (filterId: string) => {
    setFilters((prev) =>
      prev.map((f) =>
        f.id === filterId ? { ...f, enabled: !f.enabled } : f
      )
    );
  };

  const handleCalendarToggle = (calendarId: string) => {
    setVisibleCalendars((prev) =>
      prev.includes(calendarId)
        ? prev.filter((id) => id !== calendarId)
        : [...prev, calendarId]
    );
  };

  return (
    <div className={cn("flex h-full bg-[var(--primitive-neutral-100)]", className)}>
      {/* Sidebar */}
      <CalendarSidebar
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        events={filteredEvents}
        calendars={calendars.map((c) => ({
          ...c,
          visible: visibleCalendars.includes(c.id),
        }))}
        filters={filters}
        onCalendarToggle={handleCalendarToggle}
        onFilterToggle={handleFilterToggle}
        onCreateEvent={onCreateEvent}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <CalendarHeader
          selectedDate={selectedDate}
          view={view}
          onViewChange={setView}
          onDateChange={setSelectedDate}
          timezone={currentTimezone}
        />

        {/* Calendar Grid */}
        <div className="flex-1 overflow-hidden bg-[var(--card-background)]">
          {view === "day" && (
            <CalendarDayGrid
              date={selectedDate}
              events={filteredEvents}
              onEventClick={onEventClick}
              onSlotClick={onSlotClick}
            />
          )}
          {view === "week" && (
            <CalendarWeekGrid
              date={selectedDate}
              events={filteredEvents}
              onEventClick={onEventClick}
              onSlotClick={onSlotClick}
            />
          )}
          {view === "month" && (
            <CalendarMonthGrid
              date={selectedDate}
              events={filteredEvents}
              onEventClick={onEventClick}
              onDayClick={(date) => {
                setSelectedDate(date);
                setView("day");
              }}
            />
          )}
        </div>
      </div>

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowShortcuts(false)}
          />
          <div className="relative bg-[var(--background-default)] rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
              <button
                onClick={() => setShowShortcuts(false)}
                className="p-1 rounded hover:bg-[var(--primitive-neutral-200)] transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-2">
              {KEYBOARD_SHORTCUTS.map((shortcut, i) => (
                <div key={i} className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-[var(--foreground-muted)]">
                    {shortcut.action}
                  </span>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key, j) => (
                      <kbd
                        key={j}
                        className="px-2 py-0.5 text-xs font-mono bg-[var(--primitive-neutral-100)] rounded border border-[var(--primitive-neutral-300)]"
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

RecruiterCalendarView.displayName = "RecruiterCalendarView";

/* ============================================
   Exports
   ============================================ */
export {
  RecruiterCalendarView,
  CalendarSidebar,
  CalendarHeader,
  CalendarEventCard,
  CalendarDayGrid,
  CalendarWeekGrid,
  CalendarMonthGrid,
  MiniCalendar,
  getEventPosition,
  getEventTypeIcon,
  getEventColorClass,
  getUserTimezone,
  getTimezoneAbbr,
  DEFAULT_FILTERS,
  KEYBOARD_SHORTCUTS,
};
