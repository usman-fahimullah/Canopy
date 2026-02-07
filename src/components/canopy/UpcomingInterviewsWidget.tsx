"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VideoCamera, Phone, MapPin, Calendar, ArrowCircleRight } from "@phosphor-icons/react";

interface InterviewerInfo {
  id: string;
  account: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

interface ApplicationInfo {
  id: string;
  job: {
    id: string;
    title: string;
  };
}

interface UpcomingInterview {
  id: string;
  candidateName: string;
  scheduledAt: string;
  duration: number;
  type: "PHONE" | "VIDEO" | "ONSITE";
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  interviewer: InterviewerInfo;
  application: ApplicationInfo;
  location?: string | null;
  meetingLink?: string | null;
}

interface InterviewsResponse {
  data: UpcomingInterview[];
  meta: {
    total: number;
    skip: number;
    take: number;
  };
}

const getInterviewTypeIcon = (type: "PHONE" | "VIDEO" | "ONSITE") => {
  switch (type) {
    case "PHONE":
      return <Phone size={14} weight="bold" />;
    case "VIDEO":
      return <VideoCamera size={14} weight="bold" />;
    case "ONSITE":
      return <MapPin size={14} weight="bold" />;
  }
};

const getInterviewTypeLabel = (type: "PHONE" | "VIDEO" | "ONSITE") => {
  switch (type) {
    case "PHONE":
      return "Phone";
    case "VIDEO":
      return "Video";
    case "ONSITE":
      return "On-site";
  }
};

const getInterviewTypeBadgeVariant = (type: "PHONE" | "VIDEO" | "ONSITE"): "info" | "outline-primary" | "warning" => {
  switch (type) {
    case "PHONE":
      return "info";
    case "VIDEO":
      return "outline-primary";
    case "ONSITE":
      return "warning";
  }
};

export function UpcomingInterviewsWidget() {
  const [interviews, setInterviews] = useState<UpcomingInterview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const now = new Date();
        const response = await fetch(
          `/api/canopy/interviews?status=SCHEDULED&from=${now.toISOString()}&take=5`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch interviews");
        }

        const result: InterviewsResponse = await response.json();
        // Sort by scheduledAt and take only next 5
        const sorted = result.data.sort(
          (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
        );
        setInterviews(sorted.slice(0, 5));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load interviews");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-heading-sm font-medium text-[var(--foreground-default)]">
            Upcoming Interviews
          </h3>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-heading-sm font-medium text-[var(--foreground-default)]">
            Upcoming Interviews
          </h3>
        </div>
        <div className="rounded-lg border border-[var(--border-error)] bg-[var(--background-error)] p-3">
          <p className="text-caption text-[var(--foreground-error)]">
            Failed to load interviews
          </p>
        </div>
      </Card>
    );
  }

  // Empty state
  if (interviews.length === 0) {
    return (
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-heading-sm font-medium text-[var(--foreground-default)]">
            Upcoming Interviews
          </h3>
        </div>
        <div className="text-center py-6">
          <Calendar size={32} className="mx-auto mb-2 text-[var(--foreground-muted)]" />
          <p className="text-caption text-[var(--foreground-muted)]">
            No upcoming interviews scheduled
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-heading-sm font-medium text-[var(--foreground-default)]">
          Upcoming Interviews
        </h3>
        <Link
          href="/canopy/calendar"
          className={cn(
            buttonVariants({ variant: "inverse" }),
            "rounded-[var(--radius-2xl)] px-3 py-2 text-caption font-bold"
          )}
        >
          View all
          <ArrowCircleRight size={16} />
        </Link>
      </div>

      <div className="space-y-3">
        {interviews.map((interview) => {
          const interviewTime = new Date(interview.scheduledAt);
          const timeStr = format(interviewTime, "MMM d, HH:mm");

          return (
            <div
              key={interview.id}
              className="flex items-start gap-3 rounded-lg border border-[var(--border-muted)] bg-[var(--background-subtle)] p-3 transition-colors hover:bg-[var(--background-emphasized)]"
            >
              {/* Interviewer Avatar */}
              {interview.interviewer.account.avatar && (
                <Avatar
                  src={interview.interviewer.account.avatar}
                  alt={interview.interviewer.account.name}
                  size="sm"
                />
              )}

              {/* Interview Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-caption-strong text-[var(--foreground-default)] truncate">
                    {interview.candidateName}
                  </p>
                  <Badge variant={getInterviewTypeBadgeVariant(interview.type)} size="sm">
                    {getInterviewTypeIcon(interview.type)}
                  </Badge>
                </div>

                <p className="text-caption text-[var(--foreground-muted)] mb-1">
                  {interview.application.job.title}
                </p>

                <div className="flex items-center gap-3">
                  <span className="text-caption text-[var(--foreground-muted)]">
                    {timeStr}
                  </span>
                  <span className="text-caption text-[var(--foreground-muted)]">
                    {interview.duration}m
                  </span>
                  {interview.meetingLink && interview.type === "VIDEO" && (
                    <a
                      href={interview.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-caption text-[var(--foreground-link)] hover:text-[var(--foreground-link-hover)] font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Join
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
