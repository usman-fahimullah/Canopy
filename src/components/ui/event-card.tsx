"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { User } from "@phosphor-icons/react";
import { format, parseISO } from "date-fns";
import type { SchedulerEvent, InterviewType } from "@/lib/scheduling";
import { getInterviewIcon, defaultEventColors } from "@/lib/scheduling";

/* ============================================
   Event Card Component
   ============================================ */
export interface EventCardProps {
  event: SchedulerEvent;
  onClick?: (event: SchedulerEvent) => void;
  compact?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onClick, compact = false }) => {
  const start = typeof event.start === "string" ? parseISO(event.start) : event.start;
  const end = typeof event.end === "string" ? parseISO(event.end) : event.end;

  return (
    <div
      onClick={() => onClick?.(event)}
      className={cn(
        "cursor-pointer overflow-hidden rounded-md border px-2 py-1",
        "shadow-sm hover:shadow-md active:shadow-sm",
        "transition-all duration-fast hover:-translate-y-0.5 active:translate-y-0",
        event.type
          ? defaultEventColors[event.type]
          : "bg-badge-primary-background border-badge-primary-border"
      )}
    >
      <div className="flex items-start gap-1.5">
        <span className="mt-0.5 flex-shrink-0">{getInterviewIcon(event.type)}</span>
        <div className="min-w-0 flex-1">
          <p className={cn("truncate font-medium", compact ? "text-xs" : "text-sm")}>
            {event.title}
          </p>
          {!compact && (
            <>
              <p className="text-xs text-foreground-muted">
                {format(start, "h:mm a")} - {format(end, "h:mm a")}
              </p>
              {event.candidateName && (
                <div className="mt-1 flex items-center gap-1">
                  <User className="h-3 w-3 text-foreground-muted" />
                  <span className="truncate text-xs">{event.candidateName}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

EventCard.displayName = "EventCard";
