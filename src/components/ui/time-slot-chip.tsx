"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "@phosphor-icons/react";
import { format } from "date-fns";
import { type InterviewTimeSlot as TimeSlot } from "@/lib/scheduling";

export interface TimeSlotChipProps {
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
        "text-[12px] font-medium text-[var(--foreground-on-emphasis)]",
        "shadow-sm",
        className
      )}
    >
      <div className="flex flex-col">
        <span className="text-[11px] font-semibold">{format(slot.start, "EEE, MMM d")}</span>
        <span className="text-[10px] text-[var(--foreground-on-emphasis)]">
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

TimeSlotChip.displayName = "TimeSlotChip";

export { TimeSlotChip };
