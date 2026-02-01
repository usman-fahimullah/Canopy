"use client";

import { format, isToday } from "date-fns";
import { CalendarBlank, Clock, VideoCamera } from "@phosphor-icons/react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SessionCardProps {
  session: {
    id: string;
    scheduledAt: string;
    duration: number;
    status: string;
    meetingLink?: string;
    coach: {
      id: string;
      name: string;
      avatar: string | null;
      headline?: string;
    };
  };
}

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case "scheduled":
      return "info";
    case "completed":
      return "success";
    case "cancelled":
      return "neutral";
    default:
      return "neutral";
  }
};

export function SessionCard({ session }: SessionCardProps) {
  const scheduledDate = new Date(session.scheduledAt);
  const formattedDate = format(scheduledDate, "EEE, MMM d 'at' h:mm a");
  const showJoinButton = session.status === "scheduled" && isToday(scheduledDate);

  return (
    <div className="flex items-start gap-4 rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white p-5">
      <Avatar src={session.coach.avatar ?? undefined} name={session.coach.name} size="default" />

      <div className="min-w-0 flex-1">
        {/* Coach info */}
        <p className="truncate text-body font-semibold text-[var(--primitive-green-800)]">
          {session.coach.name}
        </p>
        {session.coach.headline && (
          <p className="truncate text-caption text-[var(--primitive-neutral-600)]">
            {session.coach.headline}
          </p>
        )}

        {/* Date and duration */}
        <div className="mt-2 flex flex-wrap items-center gap-3 text-caption text-[var(--foreground-muted)]">
          <span className="inline-flex items-center gap-1">
            <CalendarBlank size={14} weight="bold" />
            {formattedDate}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock size={14} weight="bold" />
            {session.duration} min
          </span>
        </div>
      </div>

      {/* Right side: badge + action */}
      <div className="flex shrink-0 flex-col items-end gap-2">
        <Badge
          variant={statusBadgeVariant(session.status) as "info" | "success" | "neutral"}
          size="sm"
        >
          {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
        </Badge>

        {showJoinButton && session.meetingLink && (
          <Button
            variant="primary"
            size="sm"
            leftIcon={<VideoCamera size={16} weight="bold" />}
            asChild
          >
            <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
              Join Meeting
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
