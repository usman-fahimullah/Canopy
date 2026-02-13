"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { Avatar } from "@/components/ui/avatar";
import {
  CalendarCheck,
  VideoCamera,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Warning,
  ArrowsClockwise,
} from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";

/* -------------------------------------------------------------------
   Types
   ------------------------------------------------------------------- */

interface InterviewData {
  id: string;
  scheduledAt: string | Date;
  duration: number;
  type: string;
  location: string | null;
  meetingLink: string | null;
  status: string;
  notes: string | null;
  completedAt: string | Date | null;
  cancelledAt: string | Date | null;
  createdAt: string | Date;
  interviewer: {
    account: { name: string | null; avatar: string | null };
  };
}

interface InterviewsSectionProps {
  interviews: InterviewData[];
  applicationId: string;
  onInterviewUpdated?: () => void;
}

/* -------------------------------------------------------------------
   Helpers
   ------------------------------------------------------------------- */

function formatDateTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getStatusBadge(status: string) {
  switch (status) {
    case "SCHEDULED":
      return { variant: "info" as const, label: "Scheduled" };
    case "IN_PROGRESS":
      return { variant: "warning" as const, label: "In Progress" };
    case "COMPLETED":
      return { variant: "success" as const, label: "Completed" };
    case "CANCELLED":
      return { variant: "error" as const, label: "Cancelled" };
    case "NO_SHOW":
      return { variant: "error" as const, label: "No Show" };
    default:
      return { variant: "neutral" as const, label: status };
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case "VIDEO":
      return <VideoCamera size={14} weight="bold" />;
    case "PHONE":
      return <Phone size={14} weight="bold" />;
    case "ONSITE":
      return <MapPin size={14} weight="bold" />;
    default:
      return <CalendarCheck size={14} weight="bold" />;
  }
}

/* -------------------------------------------------------------------
   Component
   ------------------------------------------------------------------- */

export function InterviewsSection({
  interviews,
  applicationId,
  onInterviewUpdated,
}: InterviewsSectionProps) {
  const [loadingAction, setLoadingAction] = React.useState<string | null>(null);
  const [actionError, setActionError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!actionError) return;
    const timer = setTimeout(() => setActionError(null), 4000);
    return () => clearTimeout(timer);
  }, [actionError]);

  const handleComplete = async (interviewId: string) => {
    setLoadingAction(interviewId);
    setActionError(null);

    try {
      const res = await fetch(`/api/canopy/interviews/${interviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "COMPLETED" }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to complete interview");
      }

      onInterviewUpdated?.();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to complete interview");
      logger.error("Failed to complete interview", { error: formatError(err) });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleCancel = async (interviewId: string) => {
    setLoadingAction(interviewId);
    setActionError(null);

    try {
      const res = await fetch(`/api/canopy/interviews/${interviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to cancel interview");
      }

      onInterviewUpdated?.();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to cancel interview");
      logger.error("Failed to cancel interview", { error: formatError(err) });
    } finally {
      setLoadingAction(null);
    }
  };

  if (interviews.length === 0) return null;

  return (
    <section className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <CalendarCheck size={20} weight="bold" className="text-[var(--foreground-brand)]" />
        <h3 className="text-body-strong font-semibold text-[var(--foreground-default)]">
          Interviews
        </h3>
        <Badge variant="neutral" size="sm">
          {interviews.length}
        </Badge>
      </div>

      {/* Error feedback */}
      {actionError && (
        <div className="flex items-center gap-2 rounded-lg bg-[var(--background-error)] px-3 py-2 text-caption text-[var(--foreground-error)]">
          <Warning size={16} weight="bold" />
          {actionError}
        </div>
      )}

      {/* Interview cards */}
      <div className="space-y-3">
        {interviews.map((interview) => {
          const status = getStatusBadge(interview.status);
          const isScheduled = interview.status === "SCHEDULED";
          const isLoading = loadingAction === interview.id;

          return (
            <div
              key={interview.id}
              className="space-y-3 rounded-[var(--radius-card)] bg-[var(--background-subtle)] p-4"
            >
              {/* Top row: type + date + status */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 text-body-sm font-medium text-[var(--foreground-default)]">
                  <span className="text-[var(--foreground-subtle)]">
                    {getTypeIcon(interview.type)}
                  </span>
                  {formatDateTime(interview.scheduledAt)}
                </div>
                <Badge variant={status.variant} size="sm">
                  {status.label}
                </Badge>
              </div>

              {/* Duration + interviewer */}
              <div className="flex items-center gap-4 text-caption text-[var(--foreground-muted)]">
                <span className="flex items-center gap-1">
                  <Clock size={12} weight="bold" />
                  {interview.duration} min
                </span>
                {interview.interviewer?.account?.name && (
                  <span className="flex items-center gap-1.5">
                    <Avatar
                      src={interview.interviewer.account.avatar ?? undefined}
                      name={interview.interviewer.account.name ?? undefined}
                      size="xs"
                    />
                    {interview.interviewer.account.name}
                  </span>
                )}
              </div>

              {/* Meeting link */}
              {interview.meetingLink && isScheduled && (
                <a
                  href={interview.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-caption font-medium text-[var(--foreground-link)] hover:underline"
                >
                  <VideoCamera size={12} weight="bold" />
                  Join meeting
                </a>
              )}

              {/* Notes */}
              {interview.notes && (
                <p className="line-clamp-2 text-caption text-[var(--foreground-subtle)]">
                  {interview.notes}
                </p>
              )}

              {/* Actions for scheduled interviews */}
              {isScheduled && (
                <div className="flex gap-2 pt-1">
                  <SimpleTooltip content="Mark as completed">
                    <Button
                      variant="tertiary"
                      size="sm"
                      onClick={() => handleComplete(interview.id)}
                      loading={isLoading}
                      disabled={!!loadingAction}
                    >
                      <CheckCircle size={14} weight="bold" className="mr-1" />
                      Complete
                    </Button>
                  </SimpleTooltip>
                  <SimpleTooltip content="Cancel this interview">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancel(interview.id)}
                      loading={isLoading}
                      disabled={!!loadingAction}
                    >
                      <XCircle size={14} weight="bold" className="mr-1" />
                      Cancel
                    </Button>
                  </SimpleTooltip>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
