"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Avatar } from "./avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Calendar as CalendarIcon, DotsThree } from "@phosphor-icons/react";
import { format, parseISO } from "date-fns";
import type { SchedulerEvent } from "@/lib/scheduling";
import { getInterviewIcon } from "@/lib/scheduling";

/* ============================================
   Upcoming Interviews Component
   ============================================ */
export interface UpcomingInterviewsProps {
  interviews: SchedulerEvent[];
  maxItems?: number;
  onViewAll?: () => void;
  onInterviewClick?: (interview: SchedulerEvent) => void;
  className?: string;
}

export const UpcomingInterviews: React.FC<UpcomingInterviewsProps> = ({
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
      <div className={cn("animate-fade-in py-8 text-center", className)}>
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-background-muted">
          <CalendarIcon className="h-7 w-7 text-foreground-muted" />
        </div>
        <p className="text-foreground-default font-medium">No upcoming interviews</p>
        <p className="mt-1 text-sm text-foreground-muted">Schedule interviews to see them here</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {upcomingInterviews.map((interview) => {
        const start =
          typeof interview.start === "string" ? parseISO(interview.start) : interview.start;
        const end = typeof interview.end === "string" ? parseISO(interview.end) : interview.end;

        return (
          <div
            key={interview.id}
            onClick={() => onInterviewClick?.(interview)}
            className={cn(
              "flex items-start gap-3 rounded-lg border border-border-muted p-3",
              "hover:bg-card-background-hover hover:border-border-default hover:shadow-sm",
              "cursor-pointer active:shadow-none",
              "transition-all duration-fast"
            )}
          >
            {/* Date badge */}
            <div className="w-12 flex-shrink-0 text-center">
              <p className="text-xs uppercase text-foreground-muted">{format(start, "MMM")}</p>
              <p className="text-foreground-default text-2xl font-bold">{format(start, "d")}</p>
            </div>

            {/* Details */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {getInterviewIcon(interview.type)}
                <p className="truncate font-medium">{interview.title}</p>
              </div>
              <p className="text-sm text-foreground-muted">
                {format(start, "h:mm a")} - {format(end, "h:mm a")}
              </p>
              {interview.candidateName && (
                <div className="mt-2 flex items-center gap-2">
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
                <DropdownMenuItem className="text-foreground-error">Cancel</DropdownMenuItem>
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

UpcomingInterviews.displayName = "UpcomingInterviews";
