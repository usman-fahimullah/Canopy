"use client";

import React, { useEffect, useState } from "react";
import { logger } from "@/lib/logger";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PaperPlaneTilt,
  Note,
  Star,
  CalendarCheck,
  Gift,
  ArrowRight,
  EnvelopeSimple,
} from "@phosphor-icons/react";

type ActivityEventType =
  | "applied"
  | "note"
  | "score"
  | "stage_change"
  | "interview"
  | "offer"
  | "email_sent";

interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

interface ActivityResponse {
  data: {
    events: ActivityEvent[];
    pagination: {
      skip: number;
      take: number;
      total: number;
      hasMore: boolean;
    };
  };
}

interface CandidateActivityTimelineProps {
  candidateId: string;
}

export function CandidateActivityTimeline({ candidateId }: CandidateActivityTimelineProps) {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    skip: 0,
    take: 50,
    total: 0,
    hasMore: false,
  });

  const fetchActivity = async (skip = 0) => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        skip: skip.toString(),
        take: pagination.take.toString(),
      });

      const response = await fetch(`/api/canopy/candidates/${candidateId}/activity?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch activity");
      }

      const data: ActivityResponse = await response.json();
      setEvents(data.data.events);
      setPagination(data.data.pagination);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      logger.error("Failed to fetch activity feed", {
        error: message,
        candidateId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidateId]);

  const getEventIcon = (type: ActivityEventType) => {
    const iconProps = { size: 16, weight: "bold" as const };
    switch (type) {
      case "applied":
        return <PaperPlaneTilt {...iconProps} />;
      case "note":
        return <Note {...iconProps} />;
      case "score":
        return <Star {...iconProps} />;
      case "stage_change":
        return <ArrowRight {...iconProps} />;
      case "interview":
        return <CalendarCheck {...iconProps} />;
      case "offer":
        return <Gift {...iconProps} />;
      case "email_sent":
        return <EnvelopeSimple {...iconProps} />;
      default:
        return null;
    }
  };

  const getEventBorderColor = (type: ActivityEventType) => {
    switch (type) {
      case "applied":
        return "border-l-[var(--primitive-blue-500)]";
      case "note":
        return "border-l-[var(--primitive-purple-500)]";
      case "score":
        return "border-l-[var(--primitive-yellow-500)]";
      case "stage_change":
        return "border-l-[var(--primitive-green-500)]";
      case "interview":
        return "border-l-[var(--primitive-orange-500)]";
      case "offer":
        return "border-l-[var(--primitive-red-500)]";
      case "email_sent":
        return "border-l-[var(--primitive-blue-400)]";
      default:
        return "border-l-[var(--primitive-neutral-400)]";
    }
  };

  const getEventBadgeVariant = (
    type: ActivityEventType
  ): "neutral" | "success" | "warning" | "error" | "info" | "feature" => {
    switch (type) {
      case "applied":
        return "info";
      case "note":
        return "feature";
      case "score":
        return "warning";
      case "stage_change":
        return "success";
      case "interview":
        return "feature";
      case "offer":
        return "error";
      case "email_sent":
        return "info";
      default:
        return "neutral";
    }
  };

  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
      </div>
    );
  }

  // Empty state
  if (!isLoading && events.length === 0 && !error) {
    return (
      <div className="py-12 text-center">
        <p className="mb-4 text-body text-foreground-muted">No activity yet</p>
        <p className="text-caption text-foreground-subtle">
          Activity will appear here as the candidate progresses through the pipeline
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-background-error/5 rounded-lg border border-border-error p-6 py-12 text-center">
        <p className="mb-4 text-body text-foreground-error">Failed to load activity</p>
        <p className="mb-6 text-caption text-foreground-muted">{error}</p>
        <Button variant="secondary" size="sm" onClick={() => fetchActivity()}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute bottom-0 left-6 top-0 w-0.5 bg-border-muted" />

        {/* Events */}
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={event.id} className="relative pl-16">
              {/* Icon circle */}
              <div
                className={`border-background-default absolute left-0 top-1 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-background-subtle`}
              >
                <span className="text-foreground-brand">{getEventIcon(event.type)}</span>
              </div>

              {/* Card with content */}
              <div
                className={`rounded-lg border-l-4 border-background-subtle bg-background-subtle p-4 transition-colors hover:bg-background-emphasized ${getEventBorderColor(event.type)}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="text-foreground-default text-caption-strong font-semibold">
                        {event.title}
                      </h3>
                      <Badge variant={getEventBadgeVariant(event.type)} className="text-xs">
                        {event.type.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="line-clamp-2 text-caption text-foreground-muted">
                      {event.description}
                    </p>
                  </div>
                  <div className="ml-2 whitespace-nowrap text-caption text-foreground-subtle">
                    {formatRelativeTime(event.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Load more button */}
      {pagination.hasMore && (
        <div className="mt-6 text-center">
          <Button
            variant="tertiary"
            size="sm"
            onClick={() => fetchActivity(pagination.skip + pagination.take)}
          >
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}
