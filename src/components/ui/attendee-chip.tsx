"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "./avatar";
import { X } from "@phosphor-icons/react";
import { type Attendee, ROLE_LABELS, ROLE_COLORS } from "@/lib/scheduling";

export interface AttendeeChipProps {
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

AttendeeChip.displayName = "AttendeeChip";

export { AttendeeChip };
