"use client";

import { CalendarDots, Clock, VideoCamera } from "@phosphor-icons/react";
import { Avatar, Badge, Button } from "@/components/ui";
import type { Session, SessionStatus } from "@/lib/coaching";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface SessionCardProps {
  session: Session;
  /** Perspective of the viewer */
  userRole?: "seeker" | "coach";
  /** Show join button for upcoming sessions */
  showJoinButton?: boolean;
  /** Show review button for completed sessions */
  showReviewButton?: boolean;
  onJoin?: (session: Session) => void;
  onReview?: (session: Session) => void;
  onClick?: (session: Session) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STATUS_BADGE_VARIANT: Record<SessionStatus, "info" | "success" | "error" | "neutral"> = {
  scheduled: "info",
  completed: "success",
  cancelled: "error",
  "no-show": "neutral",
};

const STATUS_LABEL: Record<SessionStatus, string> = {
  scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
  "no-show": "No Show",
};

function getParticipantName(session: Session, userRole: "seeker" | "coach"): string {
  if (userRole === "seeker") {
    const coach = session.coach ?? session.mentor;
    if (!coach) return "Coach";
    return coach.name ?? ([coach.firstName, coach.lastName].filter(Boolean).join(" ") || "Coach");
  }
  const mentee = session.mentee;
  if (!mentee) return "Client";
  return mentee.name ?? ([mentee.firstName, mentee.lastName].filter(Boolean).join(" ") || "Client");
}

function getParticipantAvatar(session: Session, userRole: "seeker" | "coach"): string | undefined {
  if (userRole === "seeker") {
    const coach = session.coach ?? session.mentor;
    return coach?.avatar ?? coach?.photoUrl ?? undefined;
  }
  const mentee = session.mentee;
  return mentee?.avatar ?? mentee?.photoUrl ?? undefined;
}

function formatSessionDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatSessionTime(dateStr: string, duration: number): string {
  const start = new Date(dateStr);
  const end = new Date(start.getTime() + duration * 60 * 1000);
  const startTime = start.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  const endTime = end.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${startTime} – ${endTime}`;
}

function isToday(dateStr: string): boolean {
  const date = new Date(dateStr);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SessionCard({
  session,
  userRole = "seeker",
  showJoinButton = true,
  showReviewButton = true,
  onJoin,
  onReview,
  onClick,
  className,
}: SessionCardProps) {
  const participantName = getParticipantName(session, userRole);
  const participantAvatar = getParticipantAvatar(session, userRole);
  const canJoin =
    showJoinButton &&
    session.status === "scheduled" &&
    isToday(session.scheduledAt) &&
    session.meetingLink;
  const canReview = showReviewButton && session.status === "completed" && !session.hasReview;

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-[var(--radius-card)] border border-[var(--border-muted)] bg-[var(--card-background)] p-4 transition-colors",
        isToday(session.scheduledAt) &&
          session.status === "scheduled" &&
          "border-[var(--border-brand)] bg-[var(--background-brand-subtle)]",
        onClick && "cursor-pointer hover:bg-[var(--card-background-hover)]",
        className
      )}
      onClick={() => onClick?.(session)}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick(session);
              }
            }
          : undefined
      }
    >
      <Avatar size="default" src={participantAvatar} fallback={participantName.charAt(0)} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-body-sm font-semibold text-[var(--foreground-default)]">
            {participantName}
          </span>
          <Badge variant={STATUS_BADGE_VARIANT[session.status]}>
            {STATUS_LABEL[session.status]}
          </Badge>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-3 text-caption text-[var(--foreground-subtle)]">
          <span className="flex items-center gap-1">
            <CalendarDots size={14} />
            {formatSessionDate(session.scheduledAt)}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {formatSessionTime(session.scheduledAt, session.duration)}
          </span>
          {session.duration && <span>{session.duration} min</span>}
        </div>

        {session.title && (
          <p className="mt-1 truncate text-caption text-[var(--foreground-muted)]">
            {session.title}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {canJoin && (
          <Button
            variant="primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              if (session.meetingLink) {
                window.open(session.meetingLink, "_blank");
              }
              onJoin?.(session);
            }}
          >
            <VideoCamera size={16} className="mr-1" />
            Join
          </Button>
        )}

        {canReview && (
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onReview?.(session);
            }}
          >
            Leave Review
          </Button>
        )}
      </div>
    </div>
  );
}
