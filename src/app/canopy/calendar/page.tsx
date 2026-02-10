"use client";

import { useState, useEffect } from "react";
import { format, addWeeks, subWeeks, startOfWeek, addDays, isToday } from "date-fns";
import { PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from "@/components/ui/dropdown";
import { Spinner } from "@/components/ui/spinner";
import { TruncateText } from "@/components/ui/truncate-text";
import { logger } from "@/lib/logger";
import {
  CaretLeft,
  CaretRight,
  VideoCamera,
  Phone,
  MapPin,
  FunnelSimple,
} from "@phosphor-icons/react";

interface Interview {
  id: string;
  candidateName: string;
  jobTitle: string;
  scheduledAt: string;
  duration: number;
  type: "PHONE" | "VIDEO" | "ONSITE";
  location: string | null;
  meetingLink: string | null;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  interviewer: {
    id: string;
    account: {
      id: string;
      name: string;
      avatar: string | null;
    };
  };
  application: {
    id: string;
    job: {
      id: string;
      title: string;
    };
  };
}

interface InterviewsResponse {
  data: Interview[];
  meta: {
    total: number;
    skip: number;
    take: number;
  };
}

interface InterviewerOption {
  id: string;
  name: string;
}

const getInterviewTypeIcon = (type: "PHONE" | "VIDEO" | "ONSITE") => {
  switch (type) {
    case "PHONE":
      return <Phone size={16} weight="bold" />;
    case "VIDEO":
      return <VideoCamera size={16} weight="bold" />;
    case "ONSITE":
      return <MapPin size={16} weight="bold" />;
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

const getInterviewTypeBadgeVariant = (type: "PHONE" | "VIDEO" | "ONSITE") => {
  switch (type) {
    case "PHONE":
      return "info";
    case "VIDEO":
      return "outline-primary";
    case "ONSITE":
      return "warning";
  }
};

export default function CalendarPage() {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => startOfWeek(new Date()));
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInterviewerId, setSelectedInterviewerId] = useState<string | null>(null);
  const [interviewers, setInterviewers] = useState<InterviewerOption[]>([]);

  const weekEnd = addDays(currentWeekStart, 6);

  // Fetch interviewers when component mounts
  useEffect(() => {
    const fetchInterviewers = async () => {
      try {
        const response = await fetch("/api/canopy/team");
        if (!response.ok) throw new Error("Failed to fetch team");
        const data = await response.json();
        // Extract unique interviewers from API response
        if (data.data && Array.isArray(data.data)) {
          const unique = data.data.reduce((acc: InterviewerOption[], member: any) => {
            if (!acc.find((m) => m.id === member.id)) {
              acc.push({ id: member.id, name: member.account?.name || member.email });
            }
            return acc;
          }, []);
          setInterviewers(unique);
        }
      } catch (err) {
        logger.error("Failed to fetch interviewers", { error: err });
      }
    };

    fetchInterviewers();
  }, []);

  // Fetch interviews for the current week
  useEffect(() => {
    const fetchInterviews = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          status: "SCHEDULED",
          from: currentWeekStart.toISOString(),
          to: weekEnd.toISOString(),
          take: "100",
        });

        if (selectedInterviewerId) {
          params.append("interviewerId", selectedInterviewerId);
        }

        const response = await fetch(`/api/canopy/interviews?${params}`);
        if (!response.ok) {
          throw new Error("Failed to fetch interviews");
        }

        const result: InterviewsResponse = await response.json();
        setInterviews(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load interviews");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterviews();
  }, [currentWeekStart, weekEnd, selectedInterviewerId]);

  // Group interviews by day
  const interviewsByDay: Record<string, Interview[]> = {};
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  weekDays.forEach((day) => {
    const dayKey = format(day, "yyyy-MM-dd");
    interviewsByDay[dayKey] = interviews.filter((interview) => {
      const interviewDate = format(new Date(interview.scheduledAt), "yyyy-MM-dd");
      return interviewDate === dayKey;
    });
  });

  const previousWeek = () => setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  const nextWeek = () => setCurrentWeekStart(addWeeks(currentWeekStart, 1));

  return (
    <div>
      <PageHeader title="Calendar" />

      <div className="flex flex-col gap-6 px-8 py-6 lg:px-12">
        {/* Week Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={previousWeek}
              className="inline-flex items-center justify-center rounded-lg border border-[var(--border-muted)] p-2 hover:bg-[var(--background-interactive-hover)]"
              aria-label="Previous week"
            >
              <CaretLeft size={20} />
            </button>

            <div className="min-w-[200px] text-center">
              <p className="text-body font-medium text-[var(--foreground-default)]">
                {format(currentWeekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
              </p>
            </div>

            <button
              onClick={nextWeek}
              className="inline-flex items-center justify-center rounded-lg border border-[var(--border-muted)] p-2 hover:bg-[var(--background-interactive-hover)]"
              aria-label="Next week"
            >
              <CaretRight size={20} />
            </button>
          </div>

          {/* Interviewer Filter */}
          <Dropdown>
            <DropdownTrigger asChild>
              <Button variant="tertiary" size="sm">
                <FunnelSimple size={16} weight="bold" />
                {selectedInterviewerId ? "Filtered" : "Filter"}
              </Button>
            </DropdownTrigger>
            <DropdownContent align="end">
              <DropdownItem value="all" onSelect={() => setSelectedInterviewerId(null)}>
                All Interviewers
              </DropdownItem>
              {interviewers.map((interviewer) => (
                <DropdownItem
                  key={interviewer.id}
                  value={interviewer.id}
                  onSelect={() => setSelectedInterviewerId(interviewer.id)}
                >
                  {interviewer.name}
                </DropdownItem>
              ))}
            </DropdownContent>
          </Dropdown>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex min-h-[400px] items-center justify-center">
            <Spinner size="lg" />
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="rounded-lg border border-[var(--border-error)] bg-[var(--background-error)] p-4">
            <p className="text-body text-[var(--foreground-error)]">{error}. Please try again.</p>
          </div>
        )}

        {/* Calendar View */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-7">
            {weekDays.map((day) => {
              const dayKey = format(day, "yyyy-MM-dd");
              const dayInterviews = interviewsByDay[dayKey] || [];
              const isDayToday = isToday(day);

              return (
                <div
                  key={dayKey}
                  className={`rounded-lg border ${
                    isDayToday
                      ? "border-[var(--border-brand)] bg-[var(--background-brand-subtle)]"
                      : "border-[var(--border-muted)] bg-[var(--card-background)]"
                  } p-3`}
                >
                  <div className="mb-3 flex items-baseline gap-2">
                    <p className="text-caption-strong text-[var(--foreground-default)]">
                      {format(day, "EEE")}
                    </p>
                    <p
                      className={`text-caption ${isDayToday ? "font-semibold text-[var(--foreground-brand-emphasis)]" : "text-[var(--foreground-muted)]"}`}
                    >
                      {format(day, "d")}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {dayInterviews.length > 0 ? (
                      dayInterviews.map((interview) => {
                        const interviewTime = new Date(interview.scheduledAt);
                        return (
                          <Card
                            key={interview.id}
                            className="cursor-pointer p-2 hover:shadow-card-hover"
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-start justify-between gap-2">
                                <p className="line-clamp-2 flex-1 text-caption-strong text-[var(--foreground-default)]">
                                  {interview.candidateName}
                                </p>
                                <Badge
                                  variant={getInterviewTypeBadgeVariant(interview.type)}
                                  className="flex-shrink-0"
                                >
                                  {getInterviewTypeIcon(interview.type)}
                                </Badge>
                              </div>

                              <p className="text-caption text-[var(--foreground-muted)]">
                                {format(interviewTime, "HH:mm")} • {interview.duration}m
                              </p>

                              <div className="flex items-center gap-1.5 pt-1">
                                {interview.interviewer.account.avatar && (
                                  <Avatar
                                    src={interview.interviewer.account.avatar}
                                    alt={interview.interviewer.account.name}
                                    size="xs"
                                  />
                                )}
                                <TruncateText className="text-caption text-[var(--foreground-muted)]">
                                  {interview.interviewer.account.name}
                                </TruncateText>
                              </div>

                              {interview.meetingLink && interview.type === "VIDEO" && (
                                <a
                                  href={interview.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block text-caption text-[var(--foreground-link)] hover:text-[var(--foreground-link-hover)]"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Join call →
                                </a>
                              )}
                            </div>
                          </Card>
                        );
                      })
                    ) : (
                      <p className="text-center text-caption text-[var(--foreground-muted)]">
                        No interviews
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && interviews.length === 0 && (
          <div className="rounded-lg border border-[var(--border-muted)] bg-[var(--card-background)] p-12 text-center">
            <p className="text-body text-[var(--foreground-muted)]">
              No interviews scheduled for this week.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
