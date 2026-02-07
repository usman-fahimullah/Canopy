"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Input } from "./input";
import { Calendar } from "./calendar";
import {
  Clock,
  CaretUp,
  CaretDown,
  Check,
  X,
  Lightning,
  Timer,
  GlobeHemisphereWest,
  SunHorizon,
  Sun,
  Moon,
  CloudSun,
} from "@phosphor-icons/react";
import { format, parse, isValid, isBefore, isAfter, formatDistanceToNow } from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

/* ============================================
   Constants
   ============================================ */
const DEFAULT_WORK_START_HOUR = 9;
const DEFAULT_MINUTE_STEP = 15;
const MIN_TOUCH_TARGET = 44;
const SELECTION_ANIMATION_DELAY = 220; // Increased for better visual feedback
const SPINNER_DRAG_THRESHOLD = 10; // px before drag activates

/* ============================================
   Time Period Helpers
   ============================================ */
type TimePeriod = "morning" | "afternoon" | "evening" | "night";

const getTimePeriod = (hour: number): TimePeriod => {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
};

const timePeriodConfig: Record<TimePeriod, { label: string; icon: React.ElementType }> = {
  morning: { label: "Morning", icon: SunHorizon },
  afternoon: { label: "Afternoon", icon: Sun },
  evening: { label: "Evening", icon: CloudSun },
  night: { label: "Night", icon: Moon },
};

/* ============================================
   Smart Time Suggestions
   ============================================ */
const getSmartSuggestions = (minuteStep: number): { label: string; date: Date }[] => {
  const now = new Date();
  const suggestions: { label: string; date: Date }[] = [];

  // Round current time to next step
  const roundedMinutes = Math.ceil(now.getMinutes() / minuteStep) * minuteStep;
  const inThirtyMin = new Date(now);
  inThirtyMin.setMinutes(roundedMinutes + 30, 0, 0);

  const inOneHour = new Date(now);
  inOneHour.setMinutes(roundedMinutes + 60, 0, 0);

  const thisAfternoon = new Date(now);
  thisAfternoon.setHours(14, 0, 0, 0);

  const thisEvening = new Date(now);
  thisEvening.setHours(18, 0, 0, 0);

  const tomorrowMorning = new Date(now);
  tomorrowMorning.setDate(tomorrowMorning.getDate() + 1);
  tomorrowMorning.setHours(9, 0, 0, 0);

  if (inThirtyMin > now) {
    suggestions.push({ label: "In 30 minutes", date: inThirtyMin });
  }
  if (inOneHour > now) {
    suggestions.push({ label: "In 1 hour", date: inOneHour });
  }
  if (thisAfternoon > now && now.getHours() < 14) {
    suggestions.push({ label: "This afternoon", date: thisAfternoon });
  }
  if (thisEvening > now && now.getHours() < 18) {
    suggestions.push({ label: "This evening", date: thisEvening });
  }

  return suggestions.slice(0, 3);
};

/* ============================================
   Time Picker Types
   ============================================ */
export interface TimePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  defaultValue?: Date;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  format?: "12h" | "24h";
  minuteStep?: 1 | 5 | 10 | 15 | 30;
  minTime?: Date;
  maxTime?: Date;
  showSeconds?: boolean;
  clearable?: boolean;
  error?: boolean;
  errorMessage?: string;
  success?: boolean;
  loading?: boolean;
  showNowButton?: boolean;
  showSmartSuggestions?: boolean;
  showTimePeriods?: boolean;
  timezone?: string;
  showTimezone?: boolean;
  showRelativeTime?: boolean;
  "aria-label"?: string;
  "aria-describedby"?: string;
  dir?: "ltr" | "rtl";
}

export interface TimeInputProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  defaultValue?: Date;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  format?: "12h" | "24h";
  showSeconds?: boolean;
  error?: boolean;
  errorMessage?: string;
  success?: boolean;
  loading?: boolean;
  timezone?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  dir?: "ltr" | "rtl";
}

export interface TimeSpinnerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  defaultValue?: Date;
  disabled?: boolean;
  className?: string;
  format?: "12h" | "24h";
  minuteStep?: 1 | 5 | 10 | 15 | 30;
  showSeconds?: boolean;
  error?: boolean;
  success?: boolean;
  animateColon?: boolean;
  enableDrag?: boolean;
  "aria-label"?: string;
  dir?: "ltr" | "rtl";
}

export interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  defaultValue?: Date;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  dateFormat?: string;
  timeFormat?: "12h" | "24h";
  minuteStep?: 1 | 5 | 10 | 15 | 30;
  minDate?: Date;
  maxDate?: Date;
  minTime?: Date;
  maxTime?: Date;
  error?: boolean;
  errorMessage?: string;
  success?: boolean;
  loading?: boolean;
  showNowButton?: boolean;
  timezone?: string;
  "aria-label"?: string;
  dir?: "ltr" | "rtl";
}

export interface DurationInputProps {
  value?: number;
  onChange?: (minutes: number | undefined) => void;
  defaultValue?: number;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  min?: number;
  max?: number;
  presets?: number[];
  error?: boolean;
  errorMessage?: string;
  success?: boolean;
  "aria-label"?: string;
  dir?: "ltr" | "rtl";
}

/* ============================================
   Helper Functions
   ============================================ */
const formatTime = (
  date: Date | undefined,
  is12Hour: boolean,
  showSeconds: boolean,
  timezone?: string
): string => {
  if (!date) return "";
  const formatStr = is12Hour
    ? showSeconds
      ? "h:mm:ss a"
      : "h:mm a"
    : showSeconds
      ? "HH:mm:ss"
      : "HH:mm";

  if (timezone) {
    try {
      return formatInTimeZone(date, timezone, formatStr);
    } catch {
      return format(date, formatStr);
    }
  }
  return format(date, formatStr);
};

const parseTimeSmart = (
  timeStr: string,
  is12Hour: boolean,
  showSeconds: boolean
): Date | undefined => {
  if (!timeStr || !timeStr.trim()) return undefined;

  const input = timeStr.trim().toLowerCase();
  const hasAM = /am$|a\.m\.$|a$/.test(input);
  const hasPM = /pm$|p\.m\.$|p$/.test(input);
  const period = hasAM ? "am" : hasPM ? "pm" : null;

  const cleaned = input.replace(/\s*(am|pm|a\.m\.|p\.m\.|a|p)\s*$/i, "").replace(/[^0-9:]/g, "");

  let hours: number;
  let minutes: number = 0;
  let seconds: number = 0;

  if (cleaned.includes(":")) {
    const parts = cleaned.split(":");
    hours = parseInt(parts[0], 10);
    minutes = parseInt(parts[1] || "0", 10);
    if (showSeconds && parts[2]) {
      seconds = parseInt(parts[2], 10);
    }
  } else {
    const digits = cleaned.replace(/\D/g, "");
    if (digits.length === 0) return undefined;

    if (digits.length <= 2) {
      hours = parseInt(digits, 10);
    } else if (digits.length === 3) {
      hours = parseInt(digits[0], 10);
      minutes = parseInt(digits.slice(1), 10);
    } else if (digits.length >= 4) {
      hours = parseInt(digits.slice(0, 2), 10);
      minutes = parseInt(digits.slice(2, 4), 10);
      if (showSeconds && digits.length >= 6) {
        seconds = parseInt(digits.slice(4, 6), 10);
      }
    } else {
      return undefined;
    }
  }

  if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return undefined;
  if (minutes < 0 || minutes > 59) return undefined;
  if (seconds < 0 || seconds > 59) return undefined;

  if (is12Hour) {
    if (period === "pm" && hours < 12) {
      hours += 12;
    } else if (period === "am" && hours === 12) {
      hours = 0;
    }
  }

  if (hours < 0 || hours > 23) return undefined;

  const result = new Date();
  result.setHours(hours, minutes, seconds, 0);
  return result;
};

interface TimeSlot {
  value: string;
  label: string;
  date: Date;
  period: TimePeriod;
}

const generateTimeSlots = (
  step: number,
  is12Hour: boolean,
  showSeconds: boolean,
  minTime?: Date,
  maxTime?: Date
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const baseDate = new Date();
  baseDate.setHours(0, 0, 0, 0);

  for (let minutes = 0; minutes < 24 * 60; minutes += step) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const date = new Date(baseDate);
    date.setHours(hours, mins, 0, 0);

    if (minTime) {
      const minMinutes = minTime.getHours() * 60 + minTime.getMinutes();
      if (minutes < minMinutes) continue;
    }
    if (maxTime) {
      const maxMinutes = maxTime.getHours() * 60 + maxTime.getMinutes();
      if (minutes > maxMinutes) continue;
    }

    const label = formatTime(date, is12Hour, showSeconds);
    slots.push({
      value: `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`,
      label,
      date,
      period: getTimePeriod(hours),
    });
  }

  return slots;
};

const findClosestTimeSlotIndex = (
  slots: { value: string; date: Date }[],
  targetDate?: Date
): number => {
  const target = targetDate || new Date();
  const targetMinutes = target.getHours() * 60 + target.getMinutes();

  let closestIndex = 0;
  let closestDiff = Infinity;

  slots.forEach((slot, index) => {
    const slotMinutes = slot.date.getHours() * 60 + slot.date.getMinutes();
    const diff = Math.abs(slotMinutes - targetMinutes);
    if (diff < closestDiff) {
      closestDiff = diff;
      closestIndex = index;
    }
  });

  return closestIndex;
};

const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
};

const parseDuration = (input: string): number | undefined => {
  const cleaned = input.trim().toLowerCase();

  const hhmm = cleaned.match(/(\d+)\s*h\s*(\d+)\s*m?/);
  if (hhmm) {
    return parseInt(hhmm[1], 10) * 60 + parseInt(hhmm[2], 10);
  }

  const hoursOnly = cleaned.match(/^(\d+)\s*h(our)?s?$/);
  if (hoursOnly) {
    return parseInt(hoursOnly[1], 10) * 60;
  }

  const minsOnly = cleaned.match(/^(\d+)\s*m(in(ute)?s?)?$/);
  if (minsOnly) {
    return parseInt(minsOnly[1], 10);
  }

  const plain = cleaned.match(/^(\d+)$/);
  if (plain) {
    return parseInt(plain[1], 10);
  }

  return undefined;
};

const getTimezoneAbbr = (timezone: string): string => {
  try {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "short",
    });
    const parts = formatter.formatToParts(date);
    const tzPart = parts.find((part) => part.type === "timeZoneName");
    return tzPart?.value || timezone;
  } catch {
    return timezone;
  }
};

const getRelativeTimeString = (date: Date): string => {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / 60000);

  if (diffMins < 0) {
    return formatDistanceToNow(date, { addSuffix: true });
  }
  if (diffMins < 60) {
    return `in ${diffMins} min`;
  }
  if (diffMins < 120) {
    return "in 1 hour";
  }
  if (diffMins < 1440) {
    return `in ${Math.round(diffMins / 60)} hours`;
  }
  return formatDistanceToNow(date, { addSuffix: true });
};

/* ============================================
   Spinner Column Component
   ============================================ */
interface SpinnerColumnProps {
  value: string;
  onIncrement: () => void;
  onDecrement: () => void;
  label: string;
  min: number;
  max: number;
  disabled?: boolean;
  enableDrag?: boolean;
  onDragChange?: (delta: number) => void;
}

const SpinnerColumn = React.memo(
  ({
    value,
    onIncrement,
    onDecrement,
    label,
    min,
    max,
    disabled = false,
    enableDrag = false,
    onDragChange,
  }: SpinnerColumnProps) => {
    const [isDragging, setIsDragging] = React.useState(false);
    const [dragStartY, setDragStartY] = React.useState(0);
    const [dragAccumulator, setDragAccumulator] = React.useState(0);

    const handlePointerDown = (e: React.PointerEvent) => {
      if (!enableDrag || disabled) return;
      setIsDragging(true);
      setDragStartY(e.clientY);
      setDragAccumulator(0);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
      if (!isDragging || !enableDrag) return;
      const deltaY = dragStartY - e.clientY;
      const newAccumulator = dragAccumulator + deltaY;

      if (Math.abs(newAccumulator) >= SPINNER_DRAG_THRESHOLD) {
        const steps = Math.floor(newAccumulator / SPINNER_DRAG_THRESHOLD);
        if (steps > 0) {
          for (let i = 0; i < steps; i++) onIncrement();
        } else {
          for (let i = 0; i < Math.abs(steps); i++) onDecrement();
        }
        setDragAccumulator(newAccumulator % SPINNER_DRAG_THRESHOLD);
        setDragStartY(e.clientY);
      }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
      if (isDragging) {
        setIsDragging(false);
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      }
    };

    return (
      <div className="flex flex-col items-center gap-2" role="group" aria-label={label}>
        <Button
          variant="ghost"
          size="icon"
          onClick={onIncrement}
          disabled={disabled}
          aria-label={`Increment ${label}`}
          className={cn(
            "h-11 w-11 rounded-lg",
            "text-[var(--foreground-muted)]",
            "hover:bg-[var(--background-brand-subtle)] hover:text-[var(--foreground-brand)]",
            "active:scale-90 active:bg-[var(--background-brand-muted)]",
            "transition-all duration-200 ease-out"
          )}
        >
          <CaretUp className="h-5 w-5" weight="bold" />
        </Button>
        <div
          role="spinbutton"
          aria-label={label}
          aria-valuenow={parseInt(value, 10)}
          aria-valuemin={min}
          aria-valuemax={max}
          tabIndex={disabled ? -1 : 0}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={(e) => {
            if (disabled) return;
            if (e.key === "ArrowUp") {
              e.preventDefault();
              onIncrement();
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              onDecrement();
            }
          }}
          className={cn(
            "flex h-16 w-16 items-center justify-center",
            "text-2xl font-semibold tabular-nums",
            "rounded-lg border-2",
            "bg-[var(--background-default)]",
            "border-[var(--border-muted)]",
            "shadow-sm",
            "transition-all duration-200 ease-out",
            "hover:border-[var(--border-brand)] hover:shadow-md",
            "focus:border-[var(--border-brand)] focus:outline-none",
            "focus:ring-[var(--primitive-green-500)]/20 focus:ring-4",
            enableDrag && "cursor-ns-resize select-none",
            isDragging && "scale-105 border-[var(--border-brand)] shadow-lg",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          {value}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDecrement}
          disabled={disabled}
          aria-label={`Decrement ${label}`}
          className={cn(
            "h-11 w-11 rounded-lg",
            "text-[var(--foreground-muted)]",
            "hover:bg-[var(--background-brand-subtle)] hover:text-[var(--foreground-brand)]",
            "active:scale-90 active:bg-[var(--background-brand-muted)]",
            "transition-all duration-200 ease-out"
          )}
        >
          <CaretDown className="h-5 w-5" weight="bold" />
        </Button>
      </div>
    );
  }
);
SpinnerColumn.displayName = "SpinnerColumn";

/* ============================================
   Animated Colon Component
   ============================================ */
const AnimatedColon = React.memo(
  ({ animate = false, idle = true }: { animate?: boolean; idle?: boolean }) => (
    <span
      className={cn(
        "select-none text-2xl font-semibold text-[var(--foreground-muted)]",
        "transition-opacity duration-500",
        animate && "animate-[blink_1s_ease-in-out_infinite]",
        idle && !animate && "animate-[pulse-subtle_2s_ease-in-out_infinite]"
      )}
      aria-hidden="true"
    >
      :
    </span>
  )
);
AnimatedColon.displayName = "AnimatedColon";

/* ============================================
   Shimmer Skeleton Component
   ============================================ */
const TimePickerSkeleton = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "flex items-center gap-3 rounded-lg border border-[var(--border-muted)] p-4",
      "overflow-hidden bg-[var(--background-default)]",
      className
    )}
  >
    <div className="relative h-6 w-24 overflow-hidden rounded bg-[var(--background-muted)]">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
    <div className="relative h-5 w-5 overflow-hidden rounded bg-[var(--background-muted)]">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_0.2s] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  </div>
);

/* ============================================
   Time Period Header Component
   ============================================ */
const TimePeriodHeader = React.memo(({ period }: { period: TimePeriod }) => {
  const config = timePeriodConfig[period];
  const Icon = config.icon;
  return (
    <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-[var(--border-muted)] bg-[var(--background-default)] px-3 py-2">
      <Icon className="h-4 w-4 text-[var(--foreground-muted)]" weight="fill" />
      <span className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
        {config.label}
      </span>
    </div>
  );
});
TimePeriodHeader.displayName = "TimePeriodHeader";

/* ============================================
   Scroll Container with Gradient Masks
   ============================================ */
const ScrollContainer = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; className?: string }
>(({ children, className }, ref) => {
  const [showTopMask, setShowTopMask] = React.useState(false);
  const [showBottomMask, setShowBottomMask] = React.useState(true);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = target;
    setShowTopMask(scrollTop > 10);
    setShowBottomMask(scrollTop < scrollHeight - clientHeight - 10);
  };

  return (
    <div className="relative">
      {/* Top gradient mask */}
      <div
        className={cn(
          "pointer-events-none absolute left-0 right-0 top-0 z-10 h-8",
          "bg-gradient-to-b from-[var(--background-default)] to-transparent",
          "transition-opacity duration-200",
          showTopMask ? "opacity-100" : "opacity-0"
        )}
      />
      <div ref={ref} className={cn("overflow-auto", className)} onScroll={handleScroll}>
        {children}
      </div>
      {/* Bottom gradient mask */}
      <div
        className={cn(
          "pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-8",
          "bg-gradient-to-t from-[var(--background-default)] to-transparent",
          "transition-opacity duration-200",
          showBottomMask ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
});
ScrollContainer.displayName = "ScrollContainer";

/* ============================================
   Time Picker (Dropdown style)
   ============================================ */
const TimePicker = React.forwardRef<HTMLButtonElement, TimePickerProps>(
  (
    {
      value: controlledValue,
      onChange,
      defaultValue,
      placeholder = "Select time",
      disabled = false,
      className,
      format: timeFormat = "12h",
      minuteStep = DEFAULT_MINUTE_STEP,
      minTime,
      maxTime,
      showSeconds = false,
      clearable = true,
      error = false,
      errorMessage,
      success = false,
      loading = false,
      showNowButton = true,
      showSmartSuggestions = true,
      showTimePeriods = true,
      timezone,
      showTimezone = false,
      showRelativeTime = true,
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedBy,
      dir = "ltr",
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState<Date | undefined>(defaultValue);
    const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
    const [justSelected, setJustSelected] = React.useState<string | null>(null);
    const [isClosing, setIsClosing] = React.useState(false);
    const listRef = React.useRef<HTMLDivElement>(null);

    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    const is12Hour = timeFormat === "12h";
    const timeSlots = React.useMemo(
      () => generateTimeSlots(minuteStep, is12Hour, showSeconds, minTime, maxTime),
      [minuteStep, is12Hour, showSeconds, minTime, maxTime]
    );

    const smartSuggestions = React.useMemo(
      () => (showSmartSuggestions ? getSmartSuggestions(minuteStep) : []),
      [showSmartSuggestions, minuteStep]
    );

    // Group time slots by period
    const groupedSlots = React.useMemo(() => {
      if (!showTimePeriods) return null;
      const groups: Record<TimePeriod, TimeSlot[]> = {
        morning: [],
        afternoon: [],
        evening: [],
        night: [],
      };
      timeSlots.forEach((slot) => {
        groups[slot.period].push(slot);
      });
      return groups;
    }, [timeSlots, showTimePeriods]);

    const displayValue = value ? formatTime(value, is12Hour, showSeconds, timezone) : "";
    const timezoneAbbr = timezone && showTimezone ? getTimezoneAbbr(timezone) : null;
    const relativeTime = value && showRelativeTime ? getRelativeTimeString(value) : null;

    const currentValueStr = value
      ? `${value.getHours().toString().padStart(2, "0")}:${value.getMinutes().toString().padStart(2, "0")}`
      : "";

    const currentIndex = timeSlots.findIndex((slot) => slot.value === currentValueStr);

    const handleClose = React.useCallback(() => {
      setIsClosing(true);
      setTimeout(() => {
        setOpen(false);
        setIsClosing(false);
      }, 150);
    }, []);

    const handleSelect = React.useCallback(
      (slot: { value: string; date: Date }) => {
        const newDate = value ? new Date(value) : new Date();
        newDate.setHours(slot.date.getHours(), slot.date.getMinutes(), 0, 0);

        setJustSelected(slot.value);

        setTimeout(() => {
          if (!isControlled) {
            setInternalValue(newDate);
          }
          onChange?.(newDate);
          setJustSelected(null);
          handleClose();
        }, SELECTION_ANIMATION_DELAY);
      },
      [value, isControlled, onChange, handleClose]
    );

    const handleNow = React.useCallback(() => {
      const now = new Date();
      const minutes = Math.round(now.getMinutes() / minuteStep) * minuteStep;
      now.setMinutes(minutes, 0, 0);

      if (!isControlled) {
        setInternalValue(now);
      }
      onChange?.(now);
      handleClose();
    }, [isControlled, onChange, minuteStep, handleClose]);

    const handleClear = React.useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isControlled) {
          setInternalValue(undefined);
        }
        onChange?.(undefined);
      },
      [isControlled, onChange]
    );

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        if (!open) {
          if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
          }
          return;
        }

        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setHighlightedIndex((prev) => (prev < timeSlots.length - 1 ? prev + 1 : 0));
            break;
          case "ArrowUp":
            e.preventDefault();
            setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : timeSlots.length - 1));
            break;
          case "Enter":
            e.preventDefault();
            if (highlightedIndex >= 0 && highlightedIndex < timeSlots.length) {
              handleSelect(timeSlots[highlightedIndex]);
            }
            break;
          case "Escape":
            e.preventDefault();
            handleClose();
            break;
          case "Home":
            e.preventDefault();
            setHighlightedIndex(0);
            break;
          case "End":
            e.preventDefault();
            setHighlightedIndex(timeSlots.length - 1);
            break;
          case "n":
            if (showNowButton) {
              e.preventDefault();
              handleNow();
            }
            break;
        }
      },
      [
        open,
        currentIndex,
        timeSlots,
        highlightedIndex,
        handleSelect,
        showNowButton,
        handleNow,
        handleClose,
      ]
    );

    React.useEffect(() => {
      if (open && highlightedIndex >= 0 && listRef.current) {
        const items = listRef.current.querySelectorAll('[role="option"]');
        const highlightedEl = items[highlightedIndex] as HTMLElement;
        if (highlightedEl) {
          highlightedEl.scrollIntoView({ block: "nearest" });
        }
      }
    }, [highlightedIndex, open]);

    React.useEffect(() => {
      if (open && listRef.current) {
        const scrollIndex = currentIndex >= 0 ? currentIndex : findClosestTimeSlotIndex(timeSlots);
        setHighlightedIndex(scrollIndex);

        setTimeout(() => {
          const items = listRef.current?.querySelectorAll('[role="option"]');
          const targetEl = items?.[scrollIndex] as HTMLElement;
          if (targetEl) {
            targetEl.scrollIntoView({ block: "center" });
          }
        }, 0);
      }
    }, [open, currentIndex, timeSlots]);

    const errorId = errorMessage ? `${ariaDescribedBy || "time-picker"}-error` : undefined;

    if (loading) {
      return <TimePickerSkeleton className={className} />;
    }

    const renderTimeSlots = () => {
      if (showTimePeriods && groupedSlots) {
        return (
          <>
            {(Object.entries(groupedSlots) as [TimePeriod, TimeSlot[]][]).map(([period, slots]) => {
              if (slots.length === 0) return null;
              return (
                <React.Fragment key={period}>
                  <TimePeriodHeader period={period} />
                  {slots.map((slot) => {
                    const globalIndex = timeSlots.findIndex((s) => s.value === slot.value);
                    const isSelected = slot.value === currentValueStr;
                    const isHighlighted = globalIndex === highlightedIndex;
                    const isAnimating = slot.value === justSelected;
                    return (
                      <button
                        key={slot.value}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelect(slot)}
                        onMouseEnter={() => setHighlightedIndex(globalIndex)}
                        className={cn(
                          "flex w-full items-center justify-between gap-3",
                          "mx-1 rounded-lg px-4 py-3",
                          "text-base font-medium",
                          "transition-all duration-200 ease-out",
                          "focus:outline-none",
                          isHighlighted && !isSelected && "bg-[var(--background-subtle)]",
                          isSelected &&
                            "bg-[var(--background-brand-subtle)] text-[var(--foreground-brand)]",
                          isAnimating &&
                            "scale-[0.96] bg-[var(--background-brand-muted)] shadow-inner"
                        )}
                      >
                        <span>{slot.label}</span>
                        <div
                          className={cn(
                            "flex h-5 w-5 items-center justify-center",
                            "transition-all duration-200 ease-out",
                            isSelected || isAnimating
                              ? "scale-100 opacity-100"
                              : "scale-50 opacity-0"
                          )}
                        >
                          <Check className="h-5 w-5 text-[var(--foreground-brand)]" weight="bold" />
                        </div>
                      </button>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </>
        );
      }

      return timeSlots.map((slot, index) => {
        const isSelected = slot.value === currentValueStr;
        const isHighlighted = index === highlightedIndex;
        const isAnimating = slot.value === justSelected;
        return (
          <button
            key={slot.value}
            type="button"
            role="option"
            aria-selected={isSelected}
            onClick={() => handleSelect(slot)}
            onMouseEnter={() => setHighlightedIndex(index)}
            className={cn(
              "flex w-full items-center justify-between gap-3",
              "mx-1 rounded-lg px-4 py-3",
              "text-base font-medium",
              "transition-all duration-200 ease-out",
              "focus:outline-none",
              isHighlighted && !isSelected && "bg-[var(--background-subtle)]",
              isSelected && "bg-[var(--background-brand-subtle)] text-[var(--foreground-brand)]",
              isAnimating && "scale-[0.96] bg-[var(--background-brand-muted)] shadow-inner"
            )}
          >
            <span>{slot.label}</span>
            <div
              className={cn(
                "flex h-5 w-5 items-center justify-center",
                "transition-all duration-200 ease-out",
                isSelected || isAnimating ? "scale-100 opacity-100" : "scale-50 opacity-0"
              )}
            >
              <Check className="h-5 w-5 text-[var(--foreground-brand)]" weight="bold" />
            </div>
          </button>
        );
      });
    };

    return (
      <div className="relative" dir={dir}>
        <Popover open={open && !isClosing} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            {/* eslint-disable-next-line jsx-a11y/role-supports-aria-props -- aria-invalid is valid on form-associated triggers */}
            <button
              ref={ref}
              type="button"
              disabled={disabled}
              onKeyDown={handleKeyDown}
              aria-label={ariaLabel || "Select time"}
              aria-describedby={[ariaDescribedBy, errorId].filter(Boolean).join(" ") || undefined}
              aria-invalid={error || undefined}
              aria-expanded={open}
              aria-haspopup="listbox"
              className={cn(
                "group flex w-full items-center justify-between gap-3",
                "rounded-lg border p-4",
                "border-[var(--input-border)] bg-[var(--input-background)]",
                "hover:border-[var(--input-border-hover)]",
                "focus:border-[var(--input-border-focus)] focus:outline-none",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "transition-all duration-200 ease-out",
                error && "border-[var(--input-border-error)]",
                success && "border-[var(--input-border-success)]",
                className
              )}
            >
              <div className="flex flex-col items-start gap-0.5">
                <span
                  className={cn(
                    "text-lg leading-6 transition-colors duration-200",
                    !displayValue && "text-[var(--input-foreground-placeholder)]"
                  )}
                >
                  {displayValue || placeholder}
                  {timezoneAbbr && displayValue && (
                    <span className="ml-2 text-sm text-[var(--foreground-muted)]">
                      ({timezoneAbbr})
                    </span>
                  )}
                </span>
                {relativeTime && displayValue && (
                  <span className="text-xs text-[var(--foreground-muted)]">{relativeTime}</span>
                )}
              </div>
              <div className={cn("flex items-center gap-2", dir === "rtl" && "flex-row-reverse")}>
                {clearable && value && !disabled && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className={cn(
                      "relative flex h-8 w-8 items-center justify-center rounded-lg",
                      "text-[var(--foreground-muted)]",
                      "hover:bg-[var(--background-interactive-hover)] hover:text-[var(--foreground-default)]",
                      "active:bg-[var(--background-error)] active:text-[var(--foreground-error)]",
                      "transition-all duration-200 ease-out",
                      "before:absolute before:inset-[-4px] before:content-['']"
                    )}
                    aria-label="Clear time"
                  >
                    <X className="h-4 w-4" weight="bold" />
                  </button>
                )}
                <Clock
                  className={cn(
                    "h-5 w-5 shrink-0 transition-all duration-200",
                    error
                      ? "text-[var(--foreground-error)]"
                      : success
                        ? "text-[var(--foreground-success)]"
                        : "text-[var(--foreground-muted)] group-hover:scale-110 group-hover:text-[var(--foreground-brand)]"
                  )}
                />
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent
            className={cn(
              "w-72 overflow-hidden p-0",
              "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1),0_8px_32px_-8px_rgba(0,0,0,0.1)]",
              "border border-[var(--border-muted)]",
              isClosing && "animate-out fade-out-0 zoom-out-95 duration-150"
            )}
            align="start"
            role="listbox"
            aria-label="Time options"
          >
            {/* Smart Suggestions */}
            {showSmartSuggestions && smartSuggestions.length > 0 && (
              <div className="border-b border-[var(--border-muted)] bg-[var(--background-subtle)] p-2">
                <div className="mb-2 px-2 text-xs font-medium text-[var(--foreground-muted)]">
                  Quick select
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {smartSuggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelect({ value: "", date: suggestion.date })}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-xs font-medium",
                        "border border-[var(--border-muted)] bg-[var(--background-default)]",
                        "hover:border-[var(--border-brand)] hover:text-[var(--foreground-brand)]",
                        "transition-all duration-200"
                      )}
                    >
                      {suggestion.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Now Button */}
            {showNowButton && (
              <div className="border-b border-[var(--border-muted)] p-2">
                <button
                  type="button"
                  onClick={handleNow}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-4 py-3",
                    "text-base font-medium",
                    "bg-[var(--background-brand-subtle)] text-[var(--foreground-brand)]",
                    "hover:bg-[var(--background-brand-muted)] hover:shadow-sm",
                    "active:scale-[0.98]",
                    "transition-all duration-200 ease-out"
                  )}
                >
                  <Lightning className="h-5 w-5" weight="fill" />
                  <span>Now</span>
                  <kbd className="ml-auto rounded bg-[var(--background-default)] px-2 py-0.5 font-mono text-xs text-[var(--foreground-muted)]">
                    N
                  </kbd>
                </button>
              </div>
            )}

            {/* Time slots with scroll container */}
            <ScrollContainer ref={listRef} className="max-h-72 p-1">
              {renderTimeSlots()}
            </ScrollContainer>

            {/* Timezone indicator */}
            {timezone && (
              <div className="flex items-center gap-2 border-t border-[var(--border-muted)] bg-[var(--background-subtle)] px-4 py-3 text-sm text-[var(--foreground-muted)]">
                <GlobeHemisphereWest className="h-4 w-4" />
                <span>{getTimezoneAbbr(timezone)}</span>
              </div>
            )}
          </PopoverContent>
        </Popover>
        {errorMessage && (
          <p id={errorId} className="mt-2 text-sm text-[var(--foreground-error)]" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);
TimePicker.displayName = "TimePicker";

/* ============================================
   Time Input (Manual input style)
   ============================================ */
const TimeInput = React.forwardRef<HTMLInputElement, TimeInputProps>(
  (
    {
      value: controlledValue,
      onChange,
      defaultValue,
      placeholder,
      disabled = false,
      className,
      format: timeFormat = "12h",
      showSeconds = false,
      error: errorProp = false,
      errorMessage,
      success = false,
      loading = false,
      timezone,
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedBy,
      dir = "ltr",
    },
    ref
  ) => {
    const is12Hour = timeFormat === "12h";
    const defaultPlaceholder = is12Hour
      ? showSeconds
        ? "h:mm:ss AM"
        : "h:mm AM"
      : showSeconds
        ? "HH:mm:ss"
        : "HH:mm";

    const [internalValue, setInternalValue] = React.useState<Date | undefined>(defaultValue);
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    const [inputValue, setInputValue] = React.useState(
      value ? formatTime(value, is12Hour, showSeconds, timezone) : ""
    );
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValidationError, setHasValidationError] = React.useState(false);

    const error = errorProp || hasValidationError;

    React.useEffect(() => {
      if (!isFocused) {
        setInputValue(value ? formatTime(value, is12Hour, showSeconds, timezone) : "");
        setHasValidationError(false);
      }
    }, [value, is12Hour, showSeconds, isFocused, timezone]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);

      if (newValue.length > 0) {
        const parsed = parseTimeSmart(newValue, is12Hour, showSeconds);
        if (parsed) {
          setHasValidationError(false);
          if (!is12Hour) {
            if (!isControlled) {
              setInternalValue(parsed);
            }
            onChange?.(parsed);
          }
        } else {
          const minLength = is12Hour ? 4 : 3;
          if (newValue.length >= minLength) {
            setHasValidationError(true);
          }
        }
      } else {
        setHasValidationError(false);
      }
    };

    const handleBlur = () => {
      setIsFocused(false);
      const parsed = parseTimeSmart(inputValue, is12Hour, showSeconds);
      if (parsed) {
        if (!isControlled) {
          setInternalValue(parsed);
        }
        onChange?.(parsed);
        setInputValue(formatTime(parsed, is12Hour, showSeconds, timezone));
        setHasValidationError(false);
      } else if (inputValue === "") {
        if (!isControlled) {
          setInternalValue(undefined);
        }
        onChange?.(undefined);
        setHasValidationError(false);
      } else {
        setInputValue(value ? formatTime(value, is12Hour, showSeconds, timezone) : "");
        setHasValidationError(false);
      }
    };

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        const currentDate = value || new Date();
        const delta = e.key === "ArrowUp" ? 1 : -1;

        const cursorPos = (e.target as HTMLInputElement).selectionStart || 0;
        const colonPos = inputValue.indexOf(":");

        let newDate = new Date(currentDate);
        if (cursorPos <= colonPos || colonPos === -1) {
          newDate.setHours(currentDate.getHours() + delta);
        } else {
          newDate.setMinutes(currentDate.getMinutes() + delta);
        }

        if (!isControlled) {
          setInternalValue(newDate);
        }
        onChange?.(newDate);
        setInputValue(formatTime(newDate, is12Hour, showSeconds, timezone));
        setHasValidationError(false);
      }
    };

    const errorId = errorMessage ? `${ariaDescribedBy || "time-input"}-error` : undefined;

    if (loading) {
      return <TimePickerSkeleton className={className} />;
    }

    return (
      <div className={cn("relative", className)} dir={dir}>
        <Input
          ref={ref}
          type="text"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || defaultPlaceholder}
          disabled={disabled}
          aria-label={ariaLabel || "Time input"}
          aria-describedby={[ariaDescribedBy, errorId].filter(Boolean).join(" ") || undefined}
          aria-invalid={error || undefined}
          error={error}
          success={success}
          rightAddon={
            <Clock
              className={cn(
                "h-5 w-5 transition-colors duration-200",
                error
                  ? "text-[var(--foreground-error)]"
                  : success
                    ? "text-[var(--foreground-success)]"
                    : "text-[var(--foreground-muted)]"
              )}
            />
          }
        />
        {errorMessage && (
          <p id={errorId} className="mt-2 text-sm text-[var(--foreground-error)]" role="alert">
            {errorMessage}
          </p>
        )}
        {hasValidationError && !errorMessage && (
          <p className="mt-2 text-sm text-[var(--foreground-error)]" role="alert">
            Invalid time format. Try &quot;9:30 AM&quot; or &quot;14:30&quot;
          </p>
        )}
      </div>
    );
  }
);
TimeInput.displayName = "TimeInput";

/* ============================================
   Time Picker Spinner (Hour/Minute spinners)
   ============================================ */
const TimeSpinner = React.forwardRef<HTMLDivElement, TimeSpinnerProps>(
  (
    {
      value: controlledValue,
      onChange,
      defaultValue,
      disabled = false,
      className,
      format: timeFormat = "12h",
      minuteStep = 1,
      showSeconds = false,
      error = false,
      success = false,
      animateColon = false,
      enableDrag = true,
      "aria-label": ariaLabel,
      dir = "ltr",
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState<Date | undefined>(
      defaultValue || new Date()
    );
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    const is12Hour = timeFormat === "12h";
    const currentDate = React.useMemo(() => value || new Date(), [value]);

    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
    const isPM = hours >= 12;
    const displayHours = is12Hour ? hours % 12 || 12 : hours;

    const updateTime = React.useCallback(
      (newHours: number, newMinutes: number, newSeconds: number = 0) => {
        const newDate = new Date(currentDate);
        newDate.setHours(newHours, newMinutes, newSeconds, 0);
        if (!isControlled) {
          setInternalValue(newDate);
        }
        onChange?.(newDate);
      },
      [currentDate, isControlled, onChange]
    );

    const incrementHours = React.useCallback(() => {
      let newHours = hours + 1;
      if (newHours > 23) newHours = 0;
      updateTime(newHours, minutes, seconds);
    }, [hours, minutes, seconds, updateTime]);

    const decrementHours = React.useCallback(() => {
      let newHours = hours - 1;
      if (newHours < 0) newHours = 23;
      updateTime(newHours, minutes, seconds);
    }, [hours, minutes, seconds, updateTime]);

    const incrementMinutes = React.useCallback(() => {
      let newMinutes = minutes + minuteStep;
      let newHours = hours;
      if (newMinutes >= 60) {
        newMinutes = newMinutes % 60;
        newHours = (hours + 1) % 24;
      }
      updateTime(newHours, newMinutes, seconds);
    }, [hours, minutes, seconds, minuteStep, updateTime]);

    const decrementMinutes = React.useCallback(() => {
      let newMinutes = minutes - minuteStep;
      let newHours = hours;
      if (newMinutes < 0) {
        newMinutes = 60 + newMinutes;
        newHours = hours - 1;
        if (newHours < 0) newHours = 23;
      }
      updateTime(newHours, newMinutes, seconds);
    }, [hours, minutes, seconds, minuteStep, updateTime]);

    const incrementSeconds = React.useCallback(() => {
      let newSeconds = seconds + 1;
      let newMinutes = minutes;
      let newHours = hours;
      if (newSeconds >= 60) {
        newSeconds = 0;
        newMinutes = minutes + 1;
        if (newMinutes >= 60) {
          newMinutes = 0;
          newHours = (hours + 1) % 24;
        }
      }
      updateTime(newHours, newMinutes, newSeconds);
    }, [hours, minutes, seconds, updateTime]);

    const decrementSeconds = React.useCallback(() => {
      let newSeconds = seconds - 1;
      let newMinutes = minutes;
      let newHours = hours;
      if (newSeconds < 0) {
        newSeconds = 59;
        newMinutes = minutes - 1;
        if (newMinutes < 0) {
          newMinutes = 59;
          newHours = hours - 1;
          if (newHours < 0) newHours = 23;
        }
      }
      updateTime(newHours, newMinutes, newSeconds);
    }, [hours, minutes, seconds, updateTime]);

    const togglePeriod = React.useCallback(() => {
      const newHours = isPM ? hours - 12 : hours + 12;
      updateTime(newHours, minutes, seconds);
    }, [isPM, hours, minutes, seconds, updateTime]);

    return (
      <div
        ref={ref}
        role="group"
        aria-label={ariaLabel || "Time spinner"}
        dir={dir}
        className={cn(
          "inline-flex items-center gap-4 p-5",
          "rounded-lg border-2 bg-[var(--background-default)]",
          "shadow-sm",
          "transition-all duration-200",
          error && "border-[var(--input-border-error)]",
          success && "border-[var(--input-border-success)]",
          !error && !success && "border-[var(--border-muted)]",
          className
        )}
      >
        <SpinnerColumn
          value={displayHours.toString().padStart(2, "0")}
          onIncrement={incrementHours}
          onDecrement={decrementHours}
          label="hours"
          min={is12Hour ? 1 : 0}
          max={is12Hour ? 12 : 23}
          disabled={disabled}
          enableDrag={enableDrag}
        />
        <AnimatedColon animate={animateColon} idle={true} />
        <SpinnerColumn
          value={minutes.toString().padStart(2, "0")}
          onIncrement={incrementMinutes}
          onDecrement={decrementMinutes}
          label="minutes"
          min={0}
          max={59}
          disabled={disabled}
          enableDrag={enableDrag}
        />
        {showSeconds && (
          <>
            <AnimatedColon animate={animateColon} idle={true} />
            <SpinnerColumn
              value={seconds.toString().padStart(2, "0")}
              onIncrement={incrementSeconds}
              onDecrement={decrementSeconds}
              label="seconds"
              min={0}
              max={59}
              disabled={disabled}
              enableDrag={enableDrag}
            />
          </>
        )}
        {is12Hour && (
          <Button
            variant="tertiary"
            onClick={togglePeriod}
            disabled={disabled}
            aria-label={`Switch to ${isPM ? "AM" : "PM"}`}
            aria-pressed={isPM}
            className={cn(
              "ml-2 h-16 min-w-[60px] rounded-lg text-lg font-semibold",
              "transition-all duration-200 ease-out",
              "hover:scale-105 hover:shadow-md",
              "active:scale-95"
            )}
          >
            {isPM ? "PM" : "AM"}
          </Button>
        )}
      </div>
    );
  }
);
TimeSpinner.displayName = "TimeSpinner";

/* ============================================
   Date Time Picker (Combined Date + Time)
   ============================================ */
const DateTimePicker = React.forwardRef<HTMLButtonElement, DateTimePickerProps>(
  (
    {
      value: controlledValue,
      onChange,
      defaultValue,
      placeholder = "Select date and time",
      disabled = false,
      className,
      dateFormat = "MMM d, yyyy",
      timeFormat = "12h",
      minuteStep = DEFAULT_MINUTE_STEP,
      minDate,
      maxDate,
      minTime,
      maxTime,
      error = false,
      errorMessage,
      success = false,
      loading = false,
      showNowButton = true,
      timezone,
      "aria-label": ariaLabel,
      dir = "ltr",
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState<Date | undefined>(defaultValue);
    const [step, setStep] = React.useState<"date" | "time">("date");

    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(value);
    const [justSelectedTime, setJustSelectedTime] = React.useState<string | null>(null);
    const is12Hour = timeFormat === "12h";
    const timeListRef = React.useRef<HTMLDivElement>(null);

    const timeSlots = React.useMemo(
      () => generateTimeSlots(minuteStep, is12Hour, false, minTime, maxTime),
      [minuteStep, is12Hour, minTime, maxTime]
    );

    const displayValue = value
      ? `${format(value, dateFormat)} at ${formatTime(value, is12Hour, false, timezone)}`
      : "";

    const handleDateSelect = React.useCallback(
      (date: Date | undefined) => {
        if (!date) return;
        const newDate = new Date(date);
        if (selectedDate) {
          newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);
        } else {
          newDate.setHours(DEFAULT_WORK_START_HOUR, 0, 0, 0);
        }
        setSelectedDate(newDate);
        setStep("time");

        setTimeout(() => {
          if (timeListRef.current) {
            const firstTimeButton = timeListRef.current.querySelector("button");
            firstTimeButton?.focus();
            timeListRef.current.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
            });
          }
        }, 100);
      },
      [selectedDate]
    );

    const handleTimeSelect = React.useCallback(
      (slot: { value: string; date: Date }) => {
        setJustSelectedTime(slot.value);

        setTimeout(() => {
          if (selectedDate) {
            const newDate = new Date(selectedDate);
            newDate.setHours(slot.date.getHours(), slot.date.getMinutes(), 0, 0);
            setSelectedDate(newDate);
          } else {
            const today = new Date();
            today.setHours(slot.date.getHours(), slot.date.getMinutes(), 0, 0);
            setSelectedDate(today);
          }
          setJustSelectedTime(null);
        }, SELECTION_ANIMATION_DELAY);
      },
      [selectedDate]
    );

    const handleNow = React.useCallback(() => {
      const now = new Date();
      const minutes = Math.round(now.getMinutes() / minuteStep) * minuteStep;
      now.setMinutes(minutes, 0, 0);
      setSelectedDate(now);
    }, [minuteStep]);

    const handleConfirm = React.useCallback(() => {
      if (!isControlled) {
        setInternalValue(selectedDate);
      }
      onChange?.(selectedDate);
      setOpen(false);
      setStep("date");
    }, [isControlled, selectedDate, onChange]);

    const handleCancel = React.useCallback(() => {
      setSelectedDate(value);
      setOpen(false);
      setStep("date");
    }, [value]);

    const handleClear = React.useCallback(() => {
      setSelectedDate(undefined);
      if (!isControlled) {
        setInternalValue(undefined);
      }
      onChange?.(undefined);
      setOpen(false);
      setStep("date");
    }, [isControlled, onChange]);

    React.useEffect(() => {
      if (open) {
        setSelectedDate(value);
        setStep("date");
      }
    }, [open, value]);

    React.useEffect(() => {
      if (open && timeListRef.current && step === "time") {
        setTimeout(() => {
          const scrollIndex = selectedDate
            ? findClosestTimeSlotIndex(timeSlots, selectedDate)
            : findClosestTimeSlotIndex(timeSlots);

          const items = timeListRef.current?.querySelectorAll('button[role="option"]');
          const targetEl = items?.[scrollIndex] as HTMLElement;
          if (targetEl) {
            targetEl.scrollIntoView({ block: "center" });
          }
        }, 50);
      }
    }, [open, selectedDate, timeSlots, step]);

    const currentTimeStr = selectedDate
      ? `${selectedDate.getHours().toString().padStart(2, "0")}:${selectedDate.getMinutes().toString().padStart(2, "0")}`
      : "";

    const errorId = errorMessage ? "datetime-picker-error" : undefined;

    if (loading) {
      return <TimePickerSkeleton className={className} />;
    }

    return (
      <div className="relative" dir={dir}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            {/* eslint-disable-next-line jsx-a11y/role-supports-aria-props -- aria-invalid is valid on form-associated triggers */}
            <button
              ref={ref}
              type="button"
              disabled={disabled}
              aria-label={ariaLabel || "Select date and time"}
              aria-describedby={errorId}
              aria-invalid={error || undefined}
              aria-expanded={open}
              aria-haspopup="dialog"
              className={cn(
                "group flex w-full items-center justify-between gap-3",
                "rounded-lg border p-4",
                "border-[var(--input-border)] bg-[var(--input-background)]",
                "hover:border-[var(--input-border-hover)]",
                "focus:border-[var(--input-border-focus)] focus:outline-none",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "transition-all duration-200 ease-out",
                error && "border-[var(--input-border-error)]",
                success && "border-[var(--input-border-success)]",
                className
              )}
            >
              <span
                className={cn(
                  "flex-1 text-left text-lg transition-colors duration-200",
                  !displayValue && "text-[var(--input-foreground-placeholder)]"
                )}
              >
                {displayValue || placeholder}
              </span>
              <div className="flex items-center gap-1">
                <Clock
                  className={cn(
                    "h-5 w-5 transition-all duration-200",
                    error
                      ? "text-[var(--foreground-error)]"
                      : success
                        ? "text-[var(--foreground-success)]"
                        : "text-[var(--foreground-muted)] group-hover:scale-110 group-hover:text-[var(--foreground-brand)]"
                  )}
                />
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent
            className={cn(
              "w-auto overflow-hidden p-0",
              "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1),0_8px_32px_-8px_rgba(0,0,0,0.1)]"
            )}
            align="start"
            role="dialog"
            aria-label="Date and time picker"
          >
            {/* Step indicator */}
            <div className="flex items-center gap-2 border-b border-[var(--border-muted)] bg-[var(--background-subtle)] px-4 py-3">
              <button
                type="button"
                onClick={() => setStep("date")}
                className={cn(
                  "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium",
                  "transition-all duration-200",
                  step === "date"
                    ? "bg-[var(--background-brand)] text-[var(--foreground-on-emphasis)]"
                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground-default)]"
                )}
              >
                <span className="bg-current/20 flex h-5 w-5 items-center justify-center rounded-full text-xs">
                  1
                </span>
                Date
              </button>
              <div className="h-px w-8 bg-[var(--border-muted)]" />
              <button
                type="button"
                onClick={() => selectedDate && setStep("time")}
                disabled={!selectedDate}
                className={cn(
                  "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium",
                  "transition-all duration-200",
                  step === "time"
                    ? "bg-[var(--background-brand)] text-[var(--foreground-on-emphasis)]"
                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground-default)]",
                  !selectedDate && "cursor-not-allowed opacity-50"
                )}
              >
                <span className="bg-current/20 flex h-5 w-5 items-center justify-center rounded-full text-xs">
                  2
                </span>
                Time
              </button>
            </div>

            <div className={cn("flex", dir === "rtl" && "flex-row-reverse")}>
              {/* Date Picker - Calendar */}
              <div
                className={cn(
                  "border-r border-[var(--border-muted)] p-3",
                  step !== "date" && "opacity-50"
                )}
              >
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => {
                    if (minDate && isBefore(date, minDate)) return true;
                    if (maxDate && isAfter(date, maxDate)) return true;
                    return false;
                  }}
                  initialFocus={step === "date"}
                />
              </div>
              {/* Time Picker */}
              <div className={cn("min-w-[180px] p-3", step !== "time" && "opacity-50")}>
                <div className="mb-3 flex items-center justify-between text-sm font-medium text-[var(--foreground-muted)]">
                  <span>Time</span>
                  {showNowButton && (
                    <button
                      type="button"
                      onClick={handleNow}
                      className="flex items-center gap-1 text-xs text-[var(--foreground-brand)] hover:underline"
                    >
                      <Lightning className="h-3.5 w-3.5" weight="fill" />
                      Now
                    </button>
                  )}
                </div>
                <ScrollContainer ref={timeListRef} className="max-h-[280px]">
                  <div role="listbox" aria-label="Time options">
                    {timeSlots.map((slot) => {
                      const isSelected = currentTimeStr === slot.value;
                      const isAnimating = slot.value === justSelectedTime;
                      return (
                        <button
                          key={slot.value}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => handleTimeSelect(slot)}
                          className={cn(
                            "flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-sm",
                            "transition-all duration-200",
                            "hover:bg-[var(--background-interactive-hover)]",
                            isSelected &&
                              "bg-[var(--background-brand-subtle)] text-[var(--foreground-brand)]",
                            isAnimating && "scale-[0.96] bg-[var(--background-brand-muted)]"
                          )}
                        >
                          <span>{slot.label}</span>
                          <div
                            className={cn(
                              "flex h-5 w-5 items-center justify-center",
                              "transition-all duration-200",
                              isSelected || isAnimating
                                ? "scale-100 opacity-100"
                                : "scale-50 opacity-0"
                            )}
                          >
                            <Check
                              className="h-5 w-5 text-[var(--foreground-brand)]"
                              weight="bold"
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </ScrollContainer>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-[var(--border-muted)] bg-[var(--background-subtle)] p-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="text-[var(--foreground-muted)] hover:text-[var(--foreground-error)]"
              >
                Clear
              </Button>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleConfirm} disabled={!selectedDate}>
                  Confirm
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        {errorMessage && (
          <p id={errorId} className="mt-2 text-sm text-[var(--foreground-error)]" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);
DateTimePicker.displayName = "DateTimePicker";

/* ============================================
   Duration Input (Improved layout)
   ============================================ */
const DurationInput = React.forwardRef<HTMLInputElement, DurationInputProps>(
  (
    {
      value: controlledValue,
      onChange,
      defaultValue,
      placeholder = "e.g., 1h 30m",
      disabled = false,
      className,
      min = 0,
      max = 480,
      presets = [15, 30, 45, 60, 90, 120],
      error: errorProp = false,
      errorMessage,
      success = false,
      "aria-label": ariaLabel,
      dir = "ltr",
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState<number | undefined>(defaultValue);
    const [inputValue, setInputValue] = React.useState(
      defaultValue ? formatDuration(defaultValue) : ""
    );
    const [hasValidationError, setHasValidationError] = React.useState(false);

    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;
    const error = errorProp || hasValidationError;

    React.useEffect(() => {
      setInputValue(value !== undefined ? formatDuration(value) : "");
      setHasValidationError(false);
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);

      if (newValue.length > 0) {
        const parsed = parseDuration(newValue);
        if (parsed !== undefined) {
          if (parsed >= min && parsed <= max) {
            setHasValidationError(false);
            if (!isControlled) {
              setInternalValue(parsed);
            }
            onChange?.(parsed);
          } else {
            setHasValidationError(true);
          }
        } else if (newValue.length >= 2) {
          setHasValidationError(true);
        }
      } else {
        setHasValidationError(false);
      }
    };

    const handleBlur = () => {
      const parsed = parseDuration(inputValue);
      if (parsed !== undefined && parsed >= min && parsed <= max) {
        setInputValue(formatDuration(parsed));
        setHasValidationError(false);
      } else if (inputValue === "") {
        if (!isControlled) {
          setInternalValue(undefined);
        }
        onChange?.(undefined);
        setHasValidationError(false);
      } else {
        setInputValue(value !== undefined ? formatDuration(value) : "");
        setHasValidationError(false);
      }
    };

    const handlePresetClick = (minutes: number) => {
      if (!isControlled) {
        setInternalValue(minutes);
      }
      onChange?.(minutes);
      setInputValue(formatDuration(minutes));
      setOpen(false);
    };

    const errorId = errorMessage ? "duration-input-error" : undefined;

    // Common preset durations with labels
    const commonPresets = [
      { minutes: 15, label: "15m", popular: false },
      { minutes: 30, label: "30m", popular: true },
      { minutes: 45, label: "45m", popular: false },
      { minutes: 60, label: "1h", popular: true },
      { minutes: 90, label: "1h 30m", popular: false },
      { minutes: 120, label: "2h", popular: true },
    ].filter((p) => p.minutes >= min && p.minutes <= max);

    return (
      <div className={cn("relative", className)} dir={dir}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="relative">
              <Input
                ref={ref}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleBlur}
                onFocus={() => setOpen(true)}
                placeholder={placeholder}
                disabled={disabled}
                aria-label={ariaLabel || "Duration input"}
                aria-describedby={errorId}
                aria-invalid={error || undefined}
                error={error}
                success={success}
                rightAddon={
                  <Timer
                    className={cn(
                      "h-5 w-5 transition-colors duration-200",
                      error
                        ? "text-[var(--foreground-error)]"
                        : success
                          ? "text-[var(--foreground-success)]"
                          : "text-[var(--foreground-muted)]"
                    )}
                  />
                }
              />
            </div>
          </PopoverTrigger>
          <PopoverContent
            className={cn(
              "w-64 p-3",
              "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1),0_8px_32px_-8px_rgba(0,0,0,0.1)]"
            )}
            align="start"
          >
            <div className="mb-3 text-xs font-medium text-[var(--foreground-muted)]">
              Quick select
            </div>
            <div className="grid grid-cols-2 gap-2">
              {commonPresets.map(({ minutes, label, popular }) => (
                <button
                  key={minutes}
                  type="button"
                  onClick={() => handlePresetClick(minutes)}
                  className={cn(
                    "rounded-lg px-4 py-3 text-sm font-medium",
                    "border transition-all duration-200",
                    "hover:border-[var(--border-brand)] hover:shadow-sm",
                    "active:scale-[0.98]",
                    value === minutes
                      ? "border-[var(--border-brand)] bg-[var(--background-brand-subtle)] text-[var(--foreground-brand)]"
                      : "border-[var(--border-muted)] bg-[var(--background-default)]",
                    popular && value !== minutes && "border-[var(--border-default)]"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        {errorMessage && (
          <p id={errorId} className="mt-2 text-sm text-[var(--foreground-error)]" role="alert">
            {errorMessage}
          </p>
        )}
        {hasValidationError && !errorMessage && (
          <p className="mt-2 text-sm text-[var(--foreground-error)]" role="alert">
            {`Duration must be between ${formatDuration(min)} and ${formatDuration(max)}`}
          </p>
        )}
      </div>
    );
  }
);
DurationInput.displayName = "DurationInput";

/* ============================================
   Exports
   ============================================ */
export {
  TimePicker,
  TimeInput,
  TimeSpinner,
  DateTimePicker,
  DurationInput,
  formatDuration,
  parseDuration,
  formatTime,
  parseTimeSmart,
  getTimezoneAbbr,
  getRelativeTimeString,
  getSmartSuggestions,
};
