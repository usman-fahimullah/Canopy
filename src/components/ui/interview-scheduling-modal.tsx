"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./dropdown";
import { Avatar } from "./avatar";
import { Banner } from "./banner";
import { SegmentedController } from "./segmented-controller";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  DragStartEvent,
  DragEndEvent,
  DragMoveEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isToday,
  isBefore,
  isAfter,
  addWeeks,
  subWeeks,
  setHours,
  setMinutes,
  addMinutes,
  isWithinInterval,
  differenceInMinutes,
  parseISO,
} from "date-fns";
import {
  X,
  CaretLeft,
  CaretRight,
  Clock,
  VideoCamera,
  MapPin,
  Plus,
  Users,
  GlobeHemisphereWest,
  CaretDown,
  Check,
  GoogleLogo,
  TextAlignLeft,
  CalendarBlank,
  ArrowRight,
  Info,
  Eye,
  NotePencil,
  Warning,
  CheckCircle,
  MinusCircle,
  XCircle,
  Lightning,
  Sparkle,
  EyeSlash,
  CalendarCheck,
  CalendarDot,
  DotsSixVertical,
} from "@phosphor-icons/react";

/* ============================================
   Types
   ============================================ */
export interface Attendee {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "candidate" | "interviewer" | "hiring-manager" | "recruiter";
  timezone?: string;
  calendarStatus?: "loading" | "loaded" | "error";
  availability?: AttendeeAvailability[];
}

export interface AttendeeAvailability {
  start: Date;
  end: Date;
  status: "free" | "busy" | "tentative";
  /** Event title (e.g., "Team Standup", "1:1 with Manager") */
  title?: string;
  /** Response status - indicates how important the event is to the person */
  responseStatus?: "accepted" | "tentative" | "needsAction" | "declined";
}

export interface TimeSlot {
  id: string;
  start: Date;
  end: Date;
}

/** Your own calendar event (for overlay) */
export interface RecruiterEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type?: "meeting" | "focus" | "interview" | "other";
  color?: string;
}

export interface InterviewSchedulingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    timezone?: string;
  };
  job?: {
    id: string;
    title: string;
  };
  initialAttendees?: Attendee[];
  defaults?: {
    duration?: number;
    videoProvider?: "google-meet" | "zoom" | "microsoft-teams" | "none";
    workingHoursStart?: number;
    workingHoursEnd?: number;
  };
  onSchedule?: (data: {
    title: string;
    attendees: Attendee[];
    timeSlots: TimeSlot[];
    duration: number;
    videoProvider: string;
    instructions?: string;
    internalNotes?: string;
    calendarId?: string;
  }) => void;
  onPreview?: (data: unknown) => void;
  onSuggestTimes?: () => Promise<TimeSlot[]>;
  teamMembers?: Attendee[];
  calendars?: { id: string; name: string; email: string }[];
  /** Your calendar events (recruiter's events for overlay display) */
  myCalendarEvents?: RecruiterEvent[];
  className?: string;
}

/* ============================================
   Constants
   ============================================ */
const DURATION_OPTIONS = [
  { value: "15", label: "15 min" },
  { value: "30", label: "30 min" },
  { value: "45", label: "45 min" },
  { value: "60", label: "1 hour" },
  { value: "90", label: "1h 30m" },
  { value: "120", label: "2 hours" },
];

const VIDEO_PROVIDER_OPTIONS = [
  { value: "google-meet", label: "Google Meet", icon: GoogleLogo },
  { value: "zoom", label: "Zoom", icon: VideoCamera },
  { value: "microsoft-teams", label: "MS Teams", icon: VideoCamera },
  { value: "none", label: "In person", icon: MapPin },
];

const ROLE_LABELS: Record<Attendee["role"], string> = {
  candidate: "Candidate",
  interviewer: "Interviewer",
  "hiring-manager": "Hiring Manager",
  recruiter: "Recruiter",
};

const ROLE_COLORS: Record<Attendee["role"], string> = {
  candidate: "text-[var(--primitive-blue-600)]",
  interviewer: "text-[var(--foreground-muted)]",
  "hiring-manager": "text-[var(--primitive-purple-600)]",
  recruiter: "text-[var(--primitive-green-700)]",
};

/* ============================================
   Helper Functions
   ============================================ */
const getTimezoneAbbr = (timezone?: string): string => {
  if (!timezone) return "";
  try {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "short",
    });
    const parts = formatter.formatToParts(date);
    const tzPart = parts.find((p) => p.type === "timeZoneName");
    return tzPart?.value || timezone.split("/").pop()?.replace(/_/g, " ") || "";
  } catch {
    return timezone.split("/").pop()?.replace(/_/g, " ") || "";
  }
};

/* ============================================
   AttendeeChip Component - With Role Labels
   ============================================ */
interface AttendeeChipProps {
  attendee: Attendee;
  onRemove?: () => void;
  removable?: boolean;
  showRole?: boolean;
  className?: string;
}

const AttendeeChip: React.FC<AttendeeChipProps> = ({
  attendee,
  onRemove,
  removable = true,
  showRole = true,
  className,
}) => {
  const isCandidate = attendee.role === "candidate";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5",
        "px-2 py-1.5",
        "rounded-full bg-[var(--primitive-neutral-200)]",
        "text-[13px]",
        attendee.calendarStatus === "loading" && "animate-pulse",
        className
      )}
    >
      <Avatar src={attendee.avatar} name={attendee.name} size="xs" className="h-5 w-5" />
      <span className="max-w-[100px] truncate font-medium text-[var(--foreground-default)]">
        {attendee.name.split(" ")[0]}
      </span>
      {/* Always show role for all attendees */}
      {showRole && (
        <span className={cn("text-[11px]", ROLE_COLORS[attendee.role])}>
          · {ROLE_LABELS[attendee.role]}
        </span>
      )}
      {/* Improved touch target - min 24x24px */}
      {removable && !isCandidate && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 flex min-h-[24px] min-w-[24px] items-center justify-center rounded-full p-1 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--primitive-neutral-300)] hover:text-[var(--foreground-default)]"
          aria-label={`Remove ${attendee.name}`}
        >
          <X size={12} weight="bold" />
        </button>
      )}
    </div>
  );
};

/* ============================================
   TimeSlotChip Component - Improved touch targets
   ============================================ */
interface TimeSlotChipProps {
  slot: TimeSlot;
  onRemove?: () => void;
  className?: string;
}

const TimeSlotChip: React.FC<TimeSlotChipProps> = ({ slot, onRemove, className }) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-2",
        "rounded-lg bg-[var(--primitive-blue-400)]",
        "border-l-4 border-[var(--primitive-blue-500)]",
        "text-[12px] font-medium text-white",
        "shadow-sm",
        className
      )}
    >
      <div className="flex flex-col">
        <span className="text-[11px] font-semibold">{format(slot.start, "EEE, MMM d")}</span>
        <span className="text-[10px] text-white/90">
          {format(slot.start, "h:mm")} – {format(slot.end, "h:mm a")}
        </span>
      </div>
      {/* Improved touch target - min 24x24px */}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 flex min-h-[24px] min-w-[24px] items-center justify-center rounded-full p-1 transition-colors hover:bg-[var(--primitive-blue-500)]"
          aria-label="Remove time slot"
        >
          <X size={12} weight="bold" />
        </button>
      )}
    </div>
  );
};

/* ============================================
   AvailabilityCalendar Component - Calendar Style
   ============================================ */
type WeekViewType = "5-day" | "7-day";

interface AvailabilityCalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  attendees: Attendee[];
  selectedSlots: TimeSlot[];
  onSlotSelect: (slot: TimeSlot) => void;
  onSlotRemove: (slotId: string) => void;
  onSlotUpdate?: (slotId: string, newStart: Date, newEnd: Date) => void;
  maxSlots?: number;
  duration: number;
  startHour?: number;
  endHour?: number;
  showAttendeeCalendars?: boolean;
  onToggleAttendeeCalendars?: (show: boolean) => void;
  className?: string;
}

type SlotAvailability = "available" | "partial" | "busy" | "past";

// Colors for attendee calendar overlays - using dedicated calendar palette
// These muted, harmonious colors don't conflict with semantic UI colors (red=error, green=success)
const ATTENDEE_COLORS = [
  {
    bg: "var(--calendar-attendee-1-background)",
    border: "var(--calendar-attendee-1-border)",
    text: "var(--calendar-attendee-1-foreground)",
  }, // Sage
  {
    bg: "var(--calendar-attendee-2-background)",
    border: "var(--calendar-attendee-2-border)",
    text: "var(--calendar-attendee-2-foreground)",
  }, // Terracotta
  {
    bg: "var(--calendar-attendee-3-background)",
    border: "var(--calendar-attendee-3-border)",
    text: "var(--calendar-attendee-3-foreground)",
  }, // Slate
  {
    bg: "var(--calendar-attendee-4-background)",
    border: "var(--calendar-attendee-4-border)",
    text: "var(--calendar-attendee-4-foreground)",
  }, // Orchid
  {
    bg: "var(--calendar-attendee-5-background)",
    border: "var(--calendar-attendee-5-border)",
    text: "var(--calendar-attendee-5-foreground)",
  }, // Rose
  {
    bg: "var(--calendar-attendee-6-background)",
    border: "var(--calendar-attendee-6-border)",
    text: "var(--calendar-attendee-6-foreground)",
  }, // Fern
  {
    bg: "var(--calendar-attendee-7-background)",
    border: "var(--calendar-attendee-7-border)",
    text: "var(--calendar-attendee-7-foreground)",
  }, // Wheat
  {
    bg: "var(--calendar-attendee-8-background)",
    border: "var(--calendar-attendee-8-border)",
    text: "var(--calendar-attendee-8-foreground)",
  }, // Steel
];

// CSS pattern for tentative/optional events (diagonal stripes)
const TENTATIVE_PATTERN = `repeating-linear-gradient(
  -45deg,
  transparent,
  transparent 3px,
  rgba(0, 0, 0, 0.08) 3px,
  rgba(0, 0, 0, 0.08) 6px
)`;

// Height per hour in pixels
const HOUR_HEIGHT = 48;

// Default scroll position (8am) - sensible starting point for most work schedules
const DEFAULT_SCROLL_HOUR = 8;

/* ============================================
   DraggableSlot Component - For drag-and-drop slots
   ============================================ */
interface DraggableSlotProps {
  slot: TimeSlot;
  top: number;
  height: number;
  onRemove: () => void;
  isDragging?: boolean;
}

const DraggableSlot: React.FC<DraggableSlotProps> = ({
  slot,
  top,
  height,
  onRemove,
  isDragging = false,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: slot.id,
    data: { slot },
  });

  const style: React.CSSProperties = {
    top,
    height,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.9 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "group absolute left-1 right-1 rounded-lg border-l-4 border-[var(--primitive-blue-500)] bg-[var(--primitive-blue-400)] shadow-sm transition-colors",
        isDragging
          ? "cursor-grabbing shadow-lg"
          : "cursor-grab hover:bg-[var(--primitive-blue-500)]"
      )}
      style={style}
      {...listeners}
      {...attributes}
    >
      <div className="flex h-full flex-col overflow-hidden px-2 py-1.5">
        <div className="flex items-center justify-between">
          <p className="flex-1 truncate text-[11px] font-semibold text-white">Interview Slot</p>
          <div className="flex items-center gap-0.5">
            {/* Drag handle indicator */}
            <DotsSixVertical size={12} className="text-white/60" weight="bold" />
          </div>
        </div>
        <p className="text-[10px] text-white/90">
          {format(slot.start, "h:mm")} – {format(slot.end, "h:mm a")}
        </p>
        {/* Remove button - only show if card is tall enough */}
        {height > 50 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="mt-auto flex items-center gap-1 text-[10px] text-white/80 opacity-0 transition-opacity hover:text-white group-hover:opacity-100"
          >
            <X size={10} />
            <span>Remove</span>
          </button>
        )}
      </div>
    </div>
  );
};

/* ============================================
   DroppableDay Component - Drop target for each day column
   ============================================ */
interface DroppableDayProps {
  day: Date;
  dayIndex: number;
  children: React.ReactNode;
  className?: string;
}

const DroppableDay: React.FC<DroppableDayProps> = ({ day, dayIndex, children, className }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `day-${dayIndex}`,
    data: { day, dayIndex },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "relative transition-colors",
        isOver && "bg-[var(--primitive-blue-50)]",
        className
      )}
    >
      {children}
    </div>
  );
};

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  selectedDate,
  onDateChange,
  attendees,
  selectedSlots,
  onSlotSelect,
  onSlotRemove,
  onSlotUpdate,
  maxSlots = 5,
  duration,
  startHour = 9,
  endHour = 18,
  showAttendeeCalendars = false,
  onToggleAttendeeCalendars,
  className,
}) => {
  const [hoveredTime, setHoveredTime] = React.useState<{ day: Date; minutes: number } | null>(null);
  const [activeDragId, setActiveDragId] = React.useState<string | null>(null);
  const [dropPreview, setDropPreview] = React.useState<{
    dayIndex: number;
    minutes: number;
  } | null>(null);
  const [weekView, setWeekView] = React.useState<WeekViewType>("5-day");
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const hasScrolledRef = React.useRef(false);

  // Configure drag sensors with a small activation distance to distinguish from clicks
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    })
  );

  // Calculate week days based on view type
  // 5-day: Mon-Fri (weekStartsOn: 1)
  // 7-day: Sun-Sat (weekStartsOn: 0)
  const weekStartsOn = weekView === "7-day" ? 0 : 1;
  const weekStart = startOfWeek(selectedDate, { weekStartsOn });
  const weekEnd =
    weekView === "7-day" ? endOfWeek(selectedDate, { weekStartsOn }) : addDays(weekStart, 4); // Mon-Fri = 5 days
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const todayInView = days.some((day) => isToday(day));
  const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
  const totalMinutes = (endHour - startHour) * 60;

  // Auto-scroll to 8am (or start hour if later) on initial mount
  React.useEffect(() => {
    if (scrollContainerRef.current && !hasScrolledRef.current) {
      const scrollToHour = Math.max(DEFAULT_SCROLL_HOUR, startHour);
      const scrollPosition = (scrollToHour - startHour) * HOUR_HEIGHT;
      scrollContainerRef.current.scrollTop = scrollPosition;
      hasScrolledRef.current = true;
    }
  }, [startHour]);

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = direction === "prev" ? subWeeks(selectedDate, 1) : addWeeks(selectedDate, 1);
    onDateChange(newDate);
  };

  const goToToday = () => onDateChange(new Date());

  // Get color for an attendee based on their index
  const getAttendeeColor = (index: number) => ATTENDEE_COLORS[index % ATTENDEE_COLORS.length];

  // Calculate pixel position from minutes since start of day
  const getPositionFromMinutes = (minutes: number): number => {
    const dayStartMinutes = startHour * 60;
    return ((minutes - dayStartMinutes) / 60) * HOUR_HEIGHT;
  };

  // Calculate minutes from pixel position
  const getMinutesFromPosition = (y: number, snapTo: number = 15): number => {
    const totalMinutesFromStart = (y / HOUR_HEIGHT) * 60;
    const snapped = Math.round(totalMinutesFromStart / snapTo) * snapTo;
    return startHour * 60 + Math.max(0, Math.min(snapped, totalMinutes - duration));
  };

  // Check availability for a time range
  const getAvailabilityForRange = (day: Date, startMinutes: number): SlotAvailability => {
    const slotStart = addMinutes(setHours(setMinutes(day, 0), 0), startMinutes);
    const slotEnd = addMinutes(slotStart, duration);
    const now = new Date();

    if (isBefore(slotStart, now)) return "past";

    const freeCount = attendees.filter((attendee) => {
      if (!attendee.availability || attendee.availability.length === 0) return true;
      const isBusy = attendee.availability.some((block) => {
        if (block.status === "free") return false;
        return slotStart < block.end && slotEnd > block.start;
      });
      return !isBusy;
    }).length;

    if (freeCount === attendees.length) return "available";
    if (freeCount > 0) return "partial";
    return "busy";
  };

  // Get busy attendees for a time range
  const getBusyAttendeesForRange = (day: Date, startMinutes: number): Attendee[] => {
    const slotStart = addMinutes(setHours(setMinutes(day, 0), 0), startMinutes);
    const slotEnd = addMinutes(slotStart, duration);

    return attendees.filter((attendee) => {
      if (!attendee.availability) return false;
      return attendee.availability.some((block) => {
        if (block.status === "free") return false;
        return slotStart < block.end && slotEnd > block.start;
      });
    });
  };

  // Handle click on the calendar grid
  const handleGridClick = (day: Date, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const minutes = getMinutesFromPosition(y);
    const availability = getAvailabilityForRange(day, minutes);

    if (availability === "past" || availability === "busy") return;
    if (selectedSlots.length >= maxSlots) return;

    const slotStart = addMinutes(setHours(setMinutes(day, 0), 0), minutes);

    // Check if clicking on an existing selected slot
    const existingSlot = selectedSlots.find(
      (s) => isSameDay(s.start, day) && slotStart >= s.start && slotStart < s.end
    );

    if (existingSlot) {
      onSlotRemove(existingSlot.id);
      return;
    }

    const newSlot: TimeSlot = {
      id: `${slotStart.getTime()}`,
      start: slotStart,
      end: addMinutes(slotStart, duration),
    };
    onSlotSelect(newSlot);
  };

  // Handle mouse move for hover preview
  const handleGridMouseMove = (day: Date, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const minutes = getMinutesFromPosition(y);
    setHoveredTime({ day, minutes });
  };

  // Get busy blocks for an attendee on a specific day
  const getAttendeeBusyBlocksForDay = (attendee: Attendee, day: Date) => {
    if (!attendee.availability) return [];
    return attendee.availability.filter((block) => {
      if (block.status === "free") return false;
      return isSameDay(block.start, day);
    });
  };

  // Get selected slots for a specific day
  const getSelectedSlotsForDay = (day: Date) => {
    return selectedSlots.filter((slot) => isSameDay(slot.start, day));
  };

  // Handle drag start - track which slot is being dragged
  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
    setHoveredTime(null); // Clear hover preview when dragging starts
  };

  // Handle drag move - update drop preview position
  const handleDragMove = (event: DragMoveEvent) => {
    const { active, over, delta } = event;

    if (!over) {
      setDropPreview(null);
      return;
    }

    const draggedSlot = selectedSlots.find((s) => s.id === active.id);
    if (!draggedSlot) {
      setDropPreview(null);
      return;
    }

    // Get the target day from the droppable
    const targetDayData = over.data.current as { day: Date; dayIndex: number } | undefined;
    if (!targetDayData) {
      setDropPreview(null);
      return;
    }

    // Calculate the vertical offset in minutes (based on pixel movement)
    const minutesDelta = Math.round(((delta.y / HOUR_HEIGHT) * 60) / 15) * 15; // Snap to 15-min intervals

    // Calculate new start time
    const originalStartMinutes = draggedSlot.start.getHours() * 60 + draggedSlot.start.getMinutes();
    const newStartMinutes = Math.max(
      startHour * 60,
      Math.min(originalStartMinutes + minutesDelta, endHour * 60 - duration)
    );

    setDropPreview({
      dayIndex: targetDayData.dayIndex,
      minutes: newStartMinutes,
    });
  };

  // Handle drag end - update slot position if dropped on a valid day
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, delta } = event;
    setActiveDragId(null);
    setDropPreview(null);

    if (!over || !onSlotUpdate) return;

    const draggedSlotId = active.id as string;
    const draggedSlot = selectedSlots.find((s) => s.id === draggedSlotId);
    if (!draggedSlot) return;

    // Get the target day from the droppable
    const targetDayData = over.data.current as { day: Date; dayIndex: number } | undefined;
    if (!targetDayData) return;

    const targetDay = targetDayData.day;

    // Calculate the vertical offset in minutes (based on pixel movement)
    const minutesDelta = Math.round(((delta.y / HOUR_HEIGHT) * 60) / 15) * 15; // Snap to 15-min intervals

    // Calculate new start time
    const originalStartMinutes = draggedSlot.start.getHours() * 60 + draggedSlot.start.getMinutes();
    const newStartMinutes = Math.max(
      startHour * 60,
      Math.min(originalStartMinutes + minutesDelta, endHour * 60 - duration)
    );

    // Create new start date on the target day
    const newStart = setMinutes(
      setHours(targetDay, Math.floor(newStartMinutes / 60)),
      newStartMinutes % 60
    );
    const newEnd = addMinutes(newStart, duration);

    // Don't update if position hasn't changed
    if (newStart.getTime() === draggedSlot.start.getTime()) return;

    // Check if the new position is valid (not in the past, not on a busy slot)
    const now = new Date();
    if (isBefore(newStart, now)) return;

    // Call the update handler
    onSlotUpdate(draggedSlotId, newStart, newEnd);
  };

  // Get the currently dragged slot for the overlay
  const activeDragSlot = activeDragId ? selectedSlots.find((s) => s.id === activeDragId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
    >
      <div className={cn("flex h-full min-h-0 flex-col bg-white", className)}>
        {/* Calendar Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-[var(--primitive-neutral-200)] px-4 py-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => navigateWeek("prev")}
              className="rounded p-1.5 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--primitive-neutral-100)] hover:text-[var(--foreground-default)]"
              aria-label="Previous week"
            >
              <CaretLeft size={16} weight="bold" />
            </button>
            <button
              type="button"
              onClick={() => navigateWeek("next")}
              className="rounded p-1.5 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--primitive-neutral-100)] hover:text-[var(--foreground-default)]"
              aria-label="Next week"
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
            {/* Week View Toggle */}
            <div className="flex items-center rounded-lg bg-[var(--primitive-neutral-100)] p-0.5">
              <button
                type="button"
                onClick={() => setWeekView("5-day")}
                className={cn(
                  "rounded-md px-2 py-1 text-[11px] font-medium transition-all",
                  weekView === "5-day"
                    ? "bg-white text-[var(--foreground-default)] shadow-sm"
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
                    ? "bg-white text-[var(--foreground-default)] shadow-sm"
                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground-default)]"
                )}
              >
                7 days
              </button>
            </div>

            <Button variant="outline" size="icon" onClick={goToToday} aria-label="Go to today">
              <CalendarDot size={16} weight="fill" />
            </Button>
          </div>
        </div>

        {/* Legend bar - attendee colors and visibility toggles */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-50)] px-4 py-2">
          <div className="flex items-center gap-2 text-[11px] text-[var(--foreground-muted)]">
            {/* Attendee legend chips */}
            {attendees.length > 0 && (
              <div className="flex items-center gap-2">
                {attendees.map((attendee, index) => {
                  const color = getAttendeeColor(index);
                  return (
                    <div
                      key={attendee.id}
                      className="flex items-center gap-1.5 rounded-full border px-2 py-0.5"
                      style={{
                        backgroundColor: color.bg,
                        borderColor: color.border,
                      }}
                    >
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: color.border }}
                      />
                      <span className="text-[10px] font-medium" style={{ color: color.text }}>
                        {attendee.name.split(" ")[0]}
                      </span>
                    </div>
                  );
                })}
                {/* Tentative pattern legend */}
                <div className="flex items-center gap-1.5 rounded-full border border-[var(--primitive-neutral-300)] bg-[var(--primitive-neutral-100)] px-2 py-0.5">
                  <div
                    className="h-3 w-3 rounded-sm border border-[var(--primitive-neutral-400)]"
                    style={{
                      backgroundImage: TENTATIVE_PATTERN,
                      backgroundColor: "var(--primitive-neutral-200)",
                    }}
                  />
                  <span className="text-[10px] text-[var(--foreground-muted)]">Tentative</span>
                </div>
              </div>
            )}
          </div>

          <div className="text-[11px] text-[var(--foreground-muted)]">{duration} min slots</div>
        </div>

        {/* Calendar Grid - Scrollable area */}
        <div className="min-h-0 flex-1 overflow-hidden">
          <div ref={scrollContainerRef} className="h-full overflow-auto">
            <div className="flex min-w-[700px]">
              {/* Time column */}
              <div className="w-14 flex-shrink-0 border-r border-[var(--primitive-neutral-200)]">
                {/* Header spacer */}
                <div className="h-12 border-b border-[var(--primitive-neutral-200)]" />
                {/* Hour labels */}
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="relative border-b border-[var(--primitive-neutral-100)]"
                    style={{ height: HOUR_HEIGHT }}
                  >
                    <span className="absolute -top-2 right-2 text-[11px] text-[var(--foreground-muted)]">
                      {format(setHours(new Date(), hour), "h a")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {days.map((day, dayIndex) => {
                const isCurrentDay = isToday(day);
                const isPastDay = isBefore(day, new Date()) && !isCurrentDay;
                const daySelectedSlots = getSelectedSlotsForDay(day);

                return (
                  <DroppableDay
                    key={day.toISOString()}
                    day={day}
                    dayIndex={dayIndex}
                    className={cn(
                      "min-w-[85px] flex-1 border-r border-[var(--primitive-neutral-200)] last:border-r-0",
                      isPastDay && "opacity-50"
                    )}
                  >
                    {/* Day header */}
                    <div className="sticky top-0 z-10 flex h-12 flex-col items-center justify-center border-b border-[var(--primitive-neutral-200)] bg-white">
                      <span className="text-[10px] uppercase tracking-wider text-[var(--foreground-muted)]">
                        {format(day, "EEE")}
                      </span>
                      <span
                        className={cn(
                          "mt-0.5 text-sm font-semibold",
                          isCurrentDay
                            ? "flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primitive-green-600)] text-white"
                            : "text-[var(--foreground-default)]"
                        )}
                      >
                        {format(day, "d")}
                      </span>
                    </div>

                    {/* Time grid - clickable area */}
                    <div
                      className="relative cursor-crosshair"
                      style={{ height: hours.length * HOUR_HEIGHT }}
                      onClick={(e) => handleGridClick(day, e)}
                      onMouseMove={(e) => handleGridMouseMove(day, e)}
                      onMouseLeave={() => setHoveredTime(null)}
                    >
                      {/* Hour lines */}
                      {hours.map((hour) => (
                        <div
                          key={hour}
                          className="absolute left-0 right-0 border-b border-[var(--primitive-neutral-100)]"
                          style={{ top: (hour - startHour) * HOUR_HEIGHT + HOUR_HEIGHT - 1 }}
                        />
                      ))}

                      {/* Half-hour lines (dashed) */}
                      {hours.map((hour) => (
                        <div
                          key={`${hour}-30`}
                          className="absolute left-0 right-0 border-b border-dashed border-[var(--primitive-neutral-100)]"
                          style={{ top: (hour - startHour) * HOUR_HEIGHT + HOUR_HEIGHT / 2 }}
                        />
                      ))}

                      {/* Attendee busy blocks (shown as full-width stacked event cards) */}
                      {attendees.length > 0 &&
                        (() => {
                          // Collect all events for this day with their attendee info
                          const allEvents: Array<{
                            block: AttendeeAvailability;
                            attendee: Attendee;
                            attendeeIndex: number;
                            color: (typeof ATTENDEE_COLORS)[0];
                          }> = [];

                          attendees.forEach((attendee, attendeeIndex) => {
                            const busyBlocks = getAttendeeBusyBlocksForDay(attendee, day);
                            const color = getAttendeeColor(attendeeIndex);
                            busyBlocks.forEach((block) => {
                              allEvents.push({ block, attendee, attendeeIndex, color });
                            });
                          });

                          // Sort by start time
                          allEvents.sort(
                            (a, b) => a.block.start.getTime() - b.block.start.getTime()
                          );

                          return allEvents.map(
                            ({ block, attendee, attendeeIndex, color }, eventIndex) => {
                              const startMinutes =
                                block.start.getHours() * 60 + block.start.getMinutes();
                              const endMinutes = block.end.getHours() * 60 + block.end.getMinutes();
                              const top = getPositionFromMinutes(startMinutes);
                              const height = Math.max(
                                ((endMinutes - startMinutes) / 60) * HOUR_HEIGHT,
                                24
                              );

                              // Determine visual style based on response status
                              const isOptional =
                                block.responseStatus === "needsAction" ||
                                block.responseStatus === "tentative";
                              const isTentativeBlock = block.status === "tentative";
                              const showPattern = isOptional || isTentativeBlock;

                              // Get first name for compact display
                              const firstName = attendee.name.split(" ")[0];

                              return (
                                <div
                                  key={`${attendee.id}-${eventIndex}`}
                                  className={cn(
                                    "pointer-events-auto absolute left-1 right-1 overflow-hidden rounded-md transition-all",
                                    "hover:z-20 hover:ring-2 hover:ring-offset-1",
                                    showPattern
                                      ? "opacity-85 hover:opacity-100"
                                      : "opacity-95 hover:opacity-100"
                                  )}
                                  style={{
                                    top,
                                    height,
                                    backgroundColor: color.bg,
                                    borderLeft: `4px solid ${color.border}`,
                                    backgroundImage: showPattern ? TENTATIVE_PATTERN : undefined,
                                    // @ts-expect-error CSS custom property for hover ring color
                                    "--tw-ring-color": color.border,
                                  }}
                                >
                                  <div className="flex h-full flex-col overflow-hidden px-2 py-1">
                                    {/* Row 1: Attendee color dot + Title */}
                                    <div className="flex min-h-0 items-start gap-1.5">
                                      <div
                                        className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full"
                                        style={{ backgroundColor: color.border }}
                                      />
                                      <p
                                        className="line-clamp-2 flex-1 text-[11px] font-semibold leading-tight"
                                        style={{ color: color.text }}
                                      >
                                        {block.title || "Busy"}
                                      </p>
                                    </div>
                                    {/* Row 2: Time - show if height >= 36px */}
                                    {height >= 36 && (
                                      <p
                                        className="mt-0.5 pl-3.5 text-[10px] leading-tight"
                                        style={{ color: color.text, opacity: 0.8 }}
                                      >
                                        {format(block.start, "h:mm")} –{" "}
                                        {format(block.end, "h:mm a")}
                                      </p>
                                    )}
                                    {/* Row 3: Attendee name + status indicator - show if height >= 52px */}
                                    {height >= 52 && (
                                      <div className="mt-auto flex items-center gap-1.5 pl-3.5">
                                        <p
                                          className="text-[10px] leading-tight"
                                          style={{ color: color.text, opacity: 0.75 }}
                                        >
                                          {firstName}
                                        </p>
                                        {showPattern && (
                                          <span
                                            className="rounded px-1 py-0.5 text-[9px]"
                                            style={{
                                              backgroundColor: `color-mix(in srgb, ${color.border} 20%, transparent)`,
                                              color: color.text,
                                            }}
                                          >
                                            {block.responseStatus === "tentative"
                                              ? "Maybe"
                                              : "Pending"}
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            }
                          );
                        })()}

                      {/* Hover preview */}
                      {hoveredTime &&
                        isSameDay(hoveredTime.day, day) &&
                        (() => {
                          const availability = getAvailabilityForRange(day, hoveredTime.minutes);
                          if (availability === "past" || availability === "busy") return null;

                          const top = getPositionFromMinutes(hoveredTime.minutes);
                          const height = (duration / 60) * HOUR_HEIGHT;
                          const startTime = addMinutes(
                            setHours(setMinutes(day, 0), 0),
                            hoveredTime.minutes
                          );
                          const busyAttendees = getBusyAttendeesForRange(day, hoveredTime.minutes);
                          const isMaxReached = selectedSlots.length >= maxSlots;

                          // Show "max reached" state when at capacity
                          if (isMaxReached) {
                            return (
                              <div
                                className="pointer-events-none absolute left-1 right-1 rounded-lg bg-[var(--primitive-neutral-200)] transition-all"
                                style={{ top, height }}
                              >
                                <div className="flex h-full flex-col justify-center px-2 py-1.5">
                                  <p className="text-[11px] font-medium text-[var(--primitive-neutral-600)]">
                                    Max slots reached
                                  </p>
                                  <p className="text-[10px] text-[var(--primitive-neutral-500)]">
                                    Remove a slot to add more
                                  </p>
                                </div>
                              </div>
                            );
                          }

                          return (
                            <div
                              className={cn(
                                "pointer-events-none absolute left-1 right-1 rounded-lg border-2 border-dashed transition-all",
                                availability === "partial"
                                  ? "bg-[var(--primitive-orange-100)]/50 border-[var(--primitive-orange-400)]"
                                  : "bg-[var(--primitive-blue-100)]/60 border-[var(--primitive-blue-400)]"
                              )}
                              style={{ top, height }}
                            >
                              <div className="px-2 py-1.5">
                                <p
                                  className={cn(
                                    "text-[11px] font-medium",
                                    availability === "partial"
                                      ? "text-[var(--primitive-orange-700)]"
                                      : "text-[var(--primitive-blue-700)]"
                                  )}
                                >
                                  {format(startTime, "h:mm a")} –{" "}
                                  {format(addMinutes(startTime, duration), "h:mm a")}
                                </p>
                                {availability === "partial" && busyAttendees.length > 0 && (
                                  <p className="text-[10px] text-[var(--primitive-orange-600)]">
                                    {busyAttendees.map((a) => a.name.split(" ")[0]).join(", ")} busy
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })()}

                      {/* Selected time slots - draggable event cards */}
                      {daySelectedSlots.map((slot) => {
                        const startMinutes = slot.start.getHours() * 60 + slot.start.getMinutes();
                        const top = getPositionFromMinutes(startMinutes);
                        const height = (duration / 60) * HOUR_HEIGHT;
                        const isDragging = activeDragId === slot.id;

                        return (
                          <DraggableSlot
                            key={slot.id}
                            slot={slot}
                            top={top}
                            height={height}
                            onRemove={() => onSlotRemove(slot.id)}
                            isDragging={isDragging}
                          />
                        );
                      })}

                      {/* Drop preview - shows where the slot will land */}
                      {dropPreview &&
                        dropPreview.dayIndex === dayIndex &&
                        activeDragId &&
                        (() => {
                          const previewTop = getPositionFromMinutes(dropPreview.minutes);
                          const previewHeight = (duration / 60) * HOUR_HEIGHT;
                          const previewStartTime = setMinutes(
                            setHours(day, Math.floor(dropPreview.minutes / 60)),
                            dropPreview.minutes % 60
                          );
                          const previewEndTime = addMinutes(previewStartTime, duration);
                          const isPastTime = isBefore(previewStartTime, new Date());

                          return (
                            <div
                              className={cn(
                                "pointer-events-none absolute left-1 right-1 rounded-lg transition-all",
                                isPastTime
                                  ? "bg-[var(--primitive-neutral-200)]"
                                  : "bg-[var(--primitive-blue-100)]"
                              )}
                              style={{ top: previewTop, height: previewHeight }}
                            >
                              <div className="flex h-full flex-col justify-center px-2 py-1.5">
                                <p
                                  className={cn(
                                    "text-[11px] font-medium",
                                    isPastTime
                                      ? "text-[var(--primitive-neutral-500)]"
                                      : "text-[var(--primitive-blue-600)]"
                                  )}
                                >
                                  {format(previewStartTime, "h:mm")} –{" "}
                                  {format(previewEndTime, "h:mm a")}
                                </p>
                              </div>
                            </div>
                          );
                        })()}
                    </div>
                  </DroppableDay>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Drag Overlay - shows a preview of the dragged slot */}
      <DragOverlay dropAnimation={null}>
        {activeDragSlot && (
          <div
            className="cursor-grabbing rounded-lg border-l-4 border-[var(--primitive-blue-500)] bg-[var(--primitive-blue-400)] opacity-95 shadow-lg"
            style={{
              width: "calc(100% - 8px)",
              minWidth: 80,
              height: (duration / 60) * HOUR_HEIGHT,
            }}
          >
            <div className="flex h-full flex-col overflow-hidden px-2 py-1.5">
              <div className="flex items-center justify-between">
                <p className="flex-1 truncate text-[11px] font-semibold text-white">
                  Interview Slot
                </p>
                <DotsSixVertical size={12} className="text-white/60" weight="bold" />
              </div>
              <p className="text-[10px] text-white/90">
                {format(activeDragSlot.start, "h:mm")} – {format(activeDragSlot.end, "h:mm a")}
              </p>
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

/* ============================================
   InternalNotesSection Component - With indicator
   ============================================ */
interface InternalNotesSectionProps {
  value: string;
  onChange: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

const InternalNotesSection: React.FC<InternalNotesSectionProps> = ({
  value,
  onChange,
  isOpen,
  onToggle,
  className,
}) => {
  const hasContent = value.trim().length > 0;

  return (
    <div className={className}>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex items-center gap-1.5 text-[13px] transition-colors",
          hasContent && !isOpen
            ? "text-[var(--primitive-green-700)] hover:text-[var(--primitive-green-800)]"
            : "text-[var(--foreground-muted)] hover:text-[var(--foreground-default)]"
        )}
      >
        <CaretDown
          size={14}
          weight="bold"
          className={cn("transition-transform", !isOpen && "-rotate-90")}
        />
        {hasContent && !isOpen ? <NotePencil size={14} weight="fill" /> : null}
        <span>Internal notes</span>
        {hasContent && !isOpen && (
          <span className="ml-1 rounded-full bg-[var(--primitive-green-100)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--primitive-green-700)]">
            Has notes
          </span>
        )}
      </button>
      {isOpen && (
        <div className="mt-2">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Notes for your team (not shared with candidate)"
            className="min-h-[80px] resize-none border-[var(--primitive-neutral-300)] bg-transparent text-sm focus:border-[var(--primitive-neutral-400)]"
          />
        </div>
      )}
    </div>
  );
};

/* ============================================
   AddAttendeePopover Component - More prominent
   ============================================ */
interface AddAttendeePopoverProps {
  teamMembers: Attendee[];
  existingAttendeeIds: string[];
  onAdd: (attendee: Attendee) => void;
}

const AddAttendeePopover: React.FC<AddAttendeePopoverProps> = ({
  teamMembers,
  existingAttendeeIds,
  onAdd,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const filteredMembers = teamMembers.filter(
    (member) =>
      !existingAttendeeIds.includes(member.id) &&
      (member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.email.toLowerCase().includes(search.toLowerCase()))
  );

  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelect = (member: Attendee) => {
    onAdd(member);
    setSearch("");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* More prominent Add button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex items-center gap-1 px-3 py-1.5",
          "text-[13px] font-medium",
          "border border-dashed border-[var(--primitive-neutral-400)]",
          "text-[var(--foreground-muted)]",
          "hover:border-[var(--primitive-green-400)] hover:bg-[var(--primitive-green-50)] hover:text-[var(--primitive-green-700)]",
          "rounded-full transition-all"
        )}
      >
        <Plus size={14} weight="bold" />
        <span>Add interviewer</span>
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute left-0 top-full z-50 mt-1",
            "max-h-80 w-72",
            "border border-[var(--primitive-neutral-300)] bg-white",
            "overflow-hidden rounded-lg shadow-lg"
          )}
        >
          <div className="border-b border-[var(--primitive-neutral-200)] p-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search team members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border-0 bg-[var(--primitive-neutral-100)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primitive-green-500)]"
            />
          </div>

          <div className="max-h-56 overflow-auto py-1">
            {filteredMembers.length === 0 ? (
              <div className="py-6 text-center">
                <Users size={24} className="mx-auto mb-2 text-[var(--foreground-muted)]" />
                <p className="text-sm text-[var(--foreground-muted)]">
                  {search ? "No matching team members" : "No more team members to add"}
                </p>
              </div>
            ) : (
              filteredMembers.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => handleSelect(member)}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[var(--primitive-neutral-100)]"
                >
                  <Avatar src={member.avatar} name={member.name} size="sm" className="h-8 w-8" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[var(--foreground-default)]">
                      {member.name}
                    </p>
                    <p className={cn("truncate text-[11px]", ROLE_COLORS[member.role])}>
                      {ROLE_LABELS[member.role]} · {member.email}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================
   CandidatePreviewCard - What candidate sees
   ============================================ */
interface CandidatePreviewCardProps {
  selectedSlots: TimeSlot[];
  duration: number;
  className?: string;
}

const CandidatePreviewCard: React.FC<CandidatePreviewCardProps> = ({
  selectedSlots,
  duration,
  className,
}) => {
  if (selectedSlots.length === 0) return null;

  return (
    <div
      className={cn(
        "rounded-lg border border-[var(--primitive-blue-200)] bg-[var(--primitive-blue-50)] p-3",
        className
      )}
    >
      <div className="mb-2 flex items-center gap-1.5 text-[12px] font-medium text-[var(--primitive-blue-700)]">
        <Eye size={14} />
        <span>Candidate will see</span>
      </div>
      <p className="text-[12px] text-[var(--primitive-blue-600)]">
        {selectedSlots.length} time option{selectedSlots.length !== 1 ? "s" : ""} to choose from (
        {duration} min each). They&apos;ll pick their preferred slot and confirm.
      </p>
    </div>
  );
};

/* ============================================
   SuggestTimesButton Component
   ============================================ */
interface SuggestTimesButtonProps {
  onSuggest?: () => Promise<TimeSlot[]>;
  onSuggestComplete?: (slots: TimeSlot[]) => void;
  disabled?: boolean;
  className?: string;
}

const SuggestTimesButton: React.FC<SuggestTimesButtonProps> = ({
  onSuggest,
  onSuggestComplete,
  disabled,
  className,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleClick = async () => {
    if (!onSuggest || isLoading) return;
    setIsLoading(true);
    try {
      const suggestedSlots = await onSuggest();
      onSuggestComplete?.(suggestedSlots);
    } catch (error) {
      console.error("Failed to get suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={handleClick}
            disabled={disabled || isLoading}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5",
              "text-[13px] font-medium",
              "bg-gradient-to-r from-[var(--primitive-purple-100)] to-[var(--primitive-blue-100)]",
              "border border-[var(--primitive-purple-300)]",
              "text-[var(--primitive-purple-700)]",
              "hover:from-[var(--primitive-purple-200)] hover:to-[var(--primitive-blue-200)]",
              "rounded-full transition-all",
              "disabled:cursor-not-allowed disabled:opacity-50",
              isLoading && "animate-pulse",
              className
            )}
          >
            {isLoading ? (
              <>
                <Sparkle size={14} weight="fill" className="animate-spin" />
                <span>Finding times...</span>
              </>
            ) : (
              <>
                <Lightning size={14} weight="fill" />
                <span>Suggest times</span>
              </>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">AI will find optimal times when everyone is free</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

/* ============================================
   CalendarOverlayToggle Component
   ============================================ */
interface CalendarOverlayToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  className?: string;
}

const CalendarOverlayToggle: React.FC<CalendarOverlayToggleProps> = ({
  enabled,
  onToggle,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={() => onToggle(!enabled)}
      className={cn(
        "flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[12px] font-medium transition-all",
        enabled
          ? "border border-[var(--primitive-blue-300)] bg-[var(--primitive-blue-100)] text-[var(--primitive-blue-700)]"
          : "border border-[var(--primitive-neutral-300)] bg-[var(--primitive-neutral-100)] text-[var(--foreground-muted)]",
        className
      )}
    >
      {enabled ? <Eye size={14} /> : <EyeSlash size={14} />}
      <span>Show my events</span>
    </button>
  );
};

/* ============================================
   YourCalendarView Component
   ============================================ */
interface YourCalendarViewProps {
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

const YourCalendarView: React.FC<YourCalendarViewProps> = ({
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
  const todayInView = days.some((day) => isToday(day));

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
            className="rounded p-1.5 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--primitive-neutral-200)]"
          >
            <CaretLeft size={16} weight="bold" />
          </button>
          <button
            type="button"
            onClick={() => navigateWeek("next")}
            className="rounded p-1.5 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--primitive-neutral-200)]"
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
                  ? "bg-white text-[var(--foreground-default)] shadow-sm"
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
                  ? "bg-white text-[var(--foreground-default)] shadow-sm"
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
                        ? "flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primitive-green-600)] text-white"
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
                        <p className="truncate text-[11px] font-medium text-white">{event.title}</p>
                        {height > 35 && (
                          <p className="text-[10px] text-white/80">
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
                                <p className="truncate text-[11px] font-semibold text-white">
                                  Interview Slot
                                </p>
                                <p className="text-[10px] text-white/90">
                                  {format(slot.start, "h:mm")} – {format(slot.end, "h:mm a")}
                                </p>
                                {/* Remove indicator on hover - only show if card is tall enough */}
                                {height > 50 && (
                                  <div className="mt-auto flex items-center gap-1 text-[10px] text-white/80 opacity-0 transition-opacity group-hover:opacity-100">
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
      <div className="flex items-center gap-4 border-t border-[var(--primitive-neutral-200)] bg-white px-4 py-2 text-[11px] text-[var(--foreground-muted)]">
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

/* ============================================
   Main InterviewSchedulingModal Component
   ============================================ */
export const InterviewSchedulingModal: React.FC<InterviewSchedulingModalProps> = ({
  open,
  onOpenChange,
  candidate,
  job,
  initialAttendees = [],
  defaults = {},
  onSchedule,
  onPreview,
  onSuggestTimes,
  teamMembers = [],
  calendars = [],
  myCalendarEvents = [],
  className,
}) => {
  // Form state
  const [title, setTitle] = React.useState(job ? `${job.title} Interview` : "Interview");
  const [duration, setDuration] = React.useState(String(defaults.duration || 60));
  const [videoProvider, setVideoProvider] = React.useState<string>(
    defaults.videoProvider || "google-meet"
  );
  const [selectedCalendar, setSelectedCalendar] = React.useState(calendars[0]?.id || "");
  const [instructions, setInstructions] = React.useState("");
  const [internalNotes, setInternalNotes] = React.useState("");
  const [showInternalNotes, setShowInternalNotes] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  // Tab state - "find-time" or "your-calendar"
  const [activeTab, setActiveTab] = React.useState<"find-time" | "your-calendar">("find-time");

  // Calendar overlay state for Find a Time view - default to showing your own events
  const [showCalendarOverlay, setShowCalendarOverlay] = React.useState(true);

  // Attendees state - candidate always first and non-removable
  const candidateAsAttendee: Attendee = {
    id: candidate.id,
    name: candidate.name,
    email: candidate.email,
    avatar: candidate.avatar,
    role: "candidate",
    timezone: candidate.timezone || "America/New_York",
  };

  const [attendees, setAttendees] = React.useState<Attendee[]>([
    candidateAsAttendee,
    ...initialAttendees,
  ]);

  const [selectedSlots, setSelectedSlots] = React.useState<TimeSlot[]>([]);

  const handleAddAttendee = (attendee: Attendee) => {
    setAttendees((prev) => [...prev, { ...attendee, calendarStatus: "loading" }]);
    // Simulate loading calendar availability
    setTimeout(() => {
      setAttendees((prev) =>
        prev.map((a) => (a.id === attendee.id ? { ...a, calendarStatus: "loaded" } : a))
      );
    }, 800);
  };

  const handleRemoveAttendee = (attendeeId: string) => {
    // Prevent removing candidate
    const attendee = attendees.find((a) => a.id === attendeeId);
    if (attendee?.role === "candidate") return;

    setAttendees((prev) => prev.filter((a) => a.id !== attendeeId));
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlots((prev) => [...prev, slot]);
  };

  const handleSlotRemove = (slotId: string) => {
    setSelectedSlots((prev) => prev.filter((s) => s.id !== slotId));
  };

  const handleSlotUpdate = (slotId: string, newStart: Date, newEnd: Date) => {
    setSelectedSlots((prev) =>
      prev.map((slot) =>
        slot.id === slotId
          ? { ...slot, id: `${newStart.getTime()}`, start: newStart, end: newEnd }
          : slot
      )
    );
  };

  const handleSuggestedSlots = (slots: TimeSlot[]) => {
    setSelectedSlots((prev) => {
      const existingIds = new Set(prev.map((s) => s.id));
      const newSlots = slots.filter((s) => !existingIds.has(s.id));
      return [...prev, ...newSlots].slice(0, 5);
    });
  };

  const handleSubmit = () => {
    if (onSchedule) {
      onSchedule({
        title,
        attendees,
        timeSlots: selectedSlots,
        duration: parseInt(duration),
        videoProvider,
        instructions: instructions || undefined,
        internalNotes: internalNotes || undefined,
        calendarId: selectedCalendar || undefined,
      });
    }
  };

  const handlePreview = () => {
    if (onPreview) {
      onPreview({
        title,
        attendees,
        timeSlots: selectedSlots,
        duration: parseInt(duration),
        videoProvider,
        instructions,
      });
    }
  };

  const canSubmit = selectedSlots.length >= 1 && attendees.length >= 2;

  if (!open) return null;

  const selectedVideoProvider = VIDEO_PROVIDER_OPTIONS.find((v) => v.value === videoProvider);

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={() => onOpenChange(false)} />

      {/* Modal - Full screen with margins */}
      <div
        className={cn(
          "relative m-4 flex max-h-[calc(100vh-32px)] w-full overflow-hidden rounded-2xl bg-white shadow-2xl",
          className
        )}
      >
        {/* Left Panel - Form */}
        <div className="flex h-full w-[340px] flex-shrink-0 flex-col border-r border-[var(--primitive-neutral-200)] bg-white">
          {/* Header - X button on left */}
          <div className="flex flex-shrink-0 items-center gap-3 border-b border-[var(--primitive-neutral-200)] px-4 py-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="-ml-1 flex items-center justify-center rounded-lg p-1.5 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--primitive-neutral-100)] hover:text-[var(--foreground-default)]"
              aria-label="Close modal"
            >
              <X size={20} weight="bold" />
            </button>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-[15px] font-semibold text-[var(--foreground-default)]">
                Schedule interview with {candidate.name}
              </h2>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-auto">
            {/* Interview Details Section */}
            <div className="border-b border-[var(--primitive-neutral-200)] px-4 py-3">
              <span className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                Interview Details
              </span>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event title"
                className="h-auto border-0 bg-transparent px-0 py-1 text-[15px] font-medium placeholder:text-[var(--foreground-muted)] focus:ring-0"
              />

              {/* Event Settings - Stacked rows */}
              <div className="mt-3 space-y-2">
                {/* Row 1: Duration */}
                <div className="flex items-center gap-2">
                  <Clock size={14} className="flex-shrink-0 text-[var(--foreground-muted)]" />
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger className="h-8 flex-1 rounded-lg border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-50)] text-[13px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DURATION_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Row 2: Video Provider */}
                <div className="flex items-center gap-2">
                  {selectedVideoProvider ? (
                    <selectedVideoProvider.icon
                      size={14}
                      className="flex-shrink-0 text-[var(--foreground-muted)]"
                    />
                  ) : (
                    <VideoCamera
                      size={14}
                      className="flex-shrink-0 text-[var(--foreground-muted)]"
                    />
                  )}
                  <Select value={videoProvider} onValueChange={setVideoProvider}>
                    <SelectTrigger className="h-8 flex-1 rounded-lg border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-50)] text-[13px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VIDEO_PROVIDER_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <div className="flex items-center gap-2">
                            <opt.icon size={14} />
                            <span>{opt.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Row 3: Calendar Selection */}
                {calendars.length > 0 && (
                  <div className="flex items-center gap-2">
                    <CalendarBlank
                      size={14}
                      className="flex-shrink-0 text-[var(--foreground-muted)]"
                    />
                    <Select value={selectedCalendar} onValueChange={setSelectedCalendar}>
                      <SelectTrigger className="h-8 flex-1 rounded-lg border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-50)] text-[13px]">
                        <SelectValue placeholder="Select calendar" />
                      </SelectTrigger>
                      <SelectContent>
                        {calendars.map((cal) => (
                          <SelectItem key={cal.id} value={cal.id}>
                            {cal.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>

            {/* Attendees Section */}
            <div className="border-b border-[var(--primitive-neutral-200)] px-4 py-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[12px] font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                  Attendees
                </span>
                <span className="text-[11px] text-[var(--primitive-green-700)]">
                  <GlobeHemisphereWest size={12} className="mr-1 inline" />
                  {getTimezoneAbbr(candidate.timezone) || "EST"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {attendees.map((attendee) => (
                  <AttendeeChip
                    key={attendee.id}
                    attendee={attendee}
                    onRemove={() => handleRemoveAttendee(attendee.id)}
                    removable={attendee.role !== "candidate"}
                    showRole={true}
                  />
                ))}
                <AddAttendeePopover
                  teamMembers={teamMembers}
                  existingAttendeeIds={attendees.map((a) => a.id)}
                  onAdd={handleAddAttendee}
                />
              </div>
            </div>

            {/* Proposed Times Section */}
            <div className="border-b border-[var(--primitive-neutral-200)] px-4 py-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[12px] font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                  Proposed times
                </span>
                <span className="text-[11px] text-[var(--foreground-muted)]">
                  {selectedSlots.length}/5
                  {selectedSlots.length === 5 && (
                    <span className="ml-1 text-[var(--primitive-yellow-600)]">max</span>
                  )}
                </span>
              </div>
              {selectedSlots.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {selectedSlots.map((slot) => (
                    <TimeSlotChip
                      key={slot.id}
                      slot={slot}
                      onRemove={() => handleSlotRemove(slot.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-3 text-center">
                  <CalendarBlank
                    size={24}
                    className="mx-auto mb-2 text-[var(--foreground-muted)] opacity-50"
                  />
                  <p className="mb-2 text-[12px] text-[var(--foreground-muted)]">
                    No times proposed yet
                  </p>
                  <p className="mb-3 text-[11px] text-[var(--foreground-muted)]">
                    Click available slots in the calendar →
                  </p>
                  {onSuggestTimes && (
                    <button
                      type="button"
                      onClick={() => {
                        onSuggestTimes?.()
                          .then((slots) => {
                            if (slots.length > 0) {
                              handleSuggestedSlots(slots);
                            }
                          })
                          .catch(console.error);
                      }}
                      disabled={attendees.length < 2}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all",
                        attendees.length < 2
                          ? "cursor-not-allowed bg-[var(--primitive-neutral-100)] text-[var(--foreground-muted)]"
                          : "bg-[var(--primitive-yellow-100)] text-[var(--primitive-yellow-800)] hover:bg-[var(--primitive-yellow-200)]"
                      )}
                    >
                      <Sparkle size={12} weight="fill" />
                      <span>Suggest available times</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Candidate Preview */}
            <div className="border-b border-[var(--primitive-neutral-200)] px-4 py-3">
              <CandidatePreviewCard selectedSlots={selectedSlots} duration={parseInt(duration)} />
            </div>

            {/* Instructions - Collapsible */}
            <div className="space-y-3 px-4 py-3">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <TextAlignLeft size={14} className="text-[var(--foreground-muted)]" />
                  <span className="text-[12px] font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                    Instructions
                  </span>
                  <span className="text-[11px] text-[var(--foreground-muted)]">(optional)</span>
                </div>
                <Textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Agenda, preparation tips..."
                  className="min-h-[60px] resize-none rounded-lg border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-50)] text-[13px] focus:border-[var(--primitive-neutral-400)]"
                />
              </div>

              {/* Internal Notes */}
              <InternalNotesSection
                value={internalNotes}
                onChange={setInternalNotes}
                isOpen={showInternalNotes}
                onToggle={() => setShowInternalNotes(!showInternalNotes)}
              />
            </div>
          </div>

          {/* Footer - Fixed at bottom */}
          <div className="flex-shrink-0 border-t border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-50)] px-4 py-3">
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-lg px-3 py-1.5 text-[13px] text-[var(--foreground-muted)] transition-colors hover:bg-[var(--primitive-neutral-200)] hover:text-[var(--foreground-default)]"
              >
                Cancel
              </button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        onClick={handlePreview}
                        disabled={!canSubmit}
                        size="sm"
                        className="gap-1.5"
                      >
                        <span>Preview & Send</span>
                        <ArrowRight size={14} weight="bold" />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  {!canSubmit && (
                    <TooltipContent>
                      <p className="text-xs">
                        {selectedSlots.length === 0
                          ? "Select at least one time slot"
                          : "Add at least one interviewer"}
                      </p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Right Panel - Calendar with Tabs */}
        <div className="flex h-full flex-1 flex-col overflow-hidden bg-[var(--primitive-neutral-100)]">
          {/* Tab Header - Fixed at top */}
          <div className="flex flex-shrink-0 items-center justify-between border-b border-[var(--primitive-neutral-200)] bg-white px-4 py-2">
            {/* Tab Switcher */}
            <SegmentedController
              options={[
                { value: "find-time", label: "Find a Time", icon: <Users size={16} /> },
                {
                  value: "your-calendar",
                  label: "Your Calendar",
                  icon: <CalendarBlank size={16} />,
                },
              ]}
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as "find-time" | "your-calendar")}
            />

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Calendar overlay toggle (only in Find a Time tab) */}
              {activeTab === "find-time" && myCalendarEvents.length > 0 && (
                <CalendarOverlayToggle
                  enabled={showCalendarOverlay}
                  onToggle={setShowCalendarOverlay}
                />
              )}

              {/* Suggest times button */}
              {onSuggestTimes && (
                <SuggestTimesButton
                  onSuggest={onSuggestTimes}
                  onSuggestComplete={handleSuggestedSlots}
                  disabled={attendees.length < 2}
                />
              )}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "find-time" ? (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              {/* Info Banner */}
              <Banner
                type="info"
                subtle
                title="Click on available time slots to propose times. The candidate will choose their preferred option."
                dismissible={false}
                hideIcon={false}
                className="flex-shrink-0 rounded-none"
              />

              <AvailabilityCalendar
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                attendees={attendees}
                selectedSlots={selectedSlots}
                onSlotSelect={handleSlotSelect}
                onSlotRemove={handleSlotRemove}
                onSlotUpdate={handleSlotUpdate}
                maxSlots={5}
                duration={parseInt(duration)}
                startHour={0}
                endHour={24}
                showAttendeeCalendars={showCalendarOverlay}
                onToggleAttendeeCalendars={setShowCalendarOverlay}
                className="min-h-0 flex-1"
              />
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <YourCalendarView
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                myEvents={myCalendarEvents}
                selectedSlots={selectedSlots}
                onSlotSelect={handleSlotSelect}
                onSlotRemove={handleSlotRemove}
                maxSlots={5}
                duration={parseInt(duration)}
                startHour={0}
                endHour={24}
                className="min-h-0 flex-1"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

InterviewSchedulingModal.displayName = "InterviewSchedulingModal";

/* ============================================
   Exports
   ============================================ */
export {
  AttendeeChip,
  TimeSlotChip,
  AvailabilityCalendar,
  InternalNotesSection,
  AddAttendeePopover,
  CandidatePreviewCard,
  SuggestTimesButton,
  CalendarOverlayToggle,
  YourCalendarView,
};
