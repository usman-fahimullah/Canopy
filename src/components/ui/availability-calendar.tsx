"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
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
  addWeeks,
  subWeeks,
  setHours,
  setMinutes,
  addMinutes,
} from "date-fns";
import {
  X,
  CaretLeft,
  CaretRight,
  GlobeHemisphereWest,
  CalendarDot,
  DotsSixVertical,
} from "@phosphor-icons/react";
import {
  type Attendee,
  type AttendeeAvailability,
  type InterviewTimeSlot as TimeSlot,
  ATTENDEE_COLORS,
  TENTATIVE_PATTERN,
  HOUR_HEIGHT,
  DEFAULT_SCROLL_HOUR,
} from "@/lib/scheduling";

/* ============================================
   AvailabilityCalendar Component - Calendar Style
   ============================================ */
export type WeekViewType = "5-day" | "7-day";

export interface AvailabilityCalendarProps {
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

/* ============================================
   DraggableSlot Component - For drag-and-drop slots
   ============================================ */
export interface DraggableSlotProps {
  slot: TimeSlot;
  top: number;
  height: number;
  onRemove: () => void;
  isDragging?: boolean;
}

export const DraggableSlot: React.FC<DraggableSlotProps> = ({
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
      <div className={cn("flex h-full min-h-0 flex-col bg-[var(--card-background)]", className)}>
        {/* Calendar Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-[var(--primitive-neutral-200)] px-4 py-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => navigateWeek("prev")}
              className="rounded p-1.5 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--background-interactive-hover)] hover:text-[var(--foreground-default)]"
              aria-label="Previous week"
            >
              <CaretLeft size={16} weight="bold" />
            </button>
            <button
              type="button"
              onClick={() => navigateWeek("next")}
              className="rounded p-1.5 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--background-interactive-hover)] hover:text-[var(--foreground-default)]"
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
                    <div className="sticky top-0 z-10 flex h-12 flex-col items-center justify-center border-b border-[var(--primitive-neutral-200)] bg-[var(--card-background)]">
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
                            color: (typeof ATTENDEE_COLORS)[number];
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
                                  style={
                                    {
                                      top,
                                      height,
                                      backgroundColor: color.bg,
                                      borderLeft: `4px solid ${color.border}`,
                                      backgroundImage: showPattern ? TENTATIVE_PATTERN : undefined,
                                      "--tw-ring-color": color.border,
                                    } as unknown as React.CSSProperties
                                  }
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

export { AvailabilityCalendar };
