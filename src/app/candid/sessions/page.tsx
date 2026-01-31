"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SessionCard } from "../components";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { Alert } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  CalendarBlank,
  CalendarPlus,
  CalendarX,
  Clock,
  CheckCircle,
  Funnel,
  VideoCamera,
  X,
  ArrowClockwise,
} from "@phosphor-icons/react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns";

type ViewMode = "list" | "calendar";
type FilterStatus = "all" | "SCHEDULED" | "COMPLETED" | "CANCELLED";

interface Session {
  id: string;
  scheduledAt: string;
  duration: number;
  status: string;
  meetingLink: string | null;
  coach: {
    id: string;
    firstName: string;
    lastName: string;
    photoUrl: string | null;
    headline: string | null;
  };
  mentee: {
    id: string;
    name: string;
  };
  hasReview: boolean;
}

function SessionListCard({ session, userRole }: { session: Session; userRole: "seeker" | "coach" }) {
  const scheduledAt = new Date(session.scheduledAt);
  const isPast = scheduledAt < new Date();
  const isUpcoming = !isPast && session.status === "SCHEDULED";

  const statusVariants: Record<string, "info" | "success" | "critical" | "warning" | "neutral"> = {
    SCHEDULED: "info",
    COMPLETED: "success",
    CANCELLED: "critical",
    NO_SHOW: "warning",
  };

  return (
    <Card className="p-5">
      <div className="flex items-start gap-4">
        <Avatar
          size="lg"
          src={session.coach.photoUrl || undefined}
          name={`${session.coach.firstName} ${session.coach.lastName}`}
          color="green"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground-default">
              {session.coach.firstName} {session.coach.lastName}
            </h3>
            <Badge variant={statusVariants[session.status] || "neutral"} size="sm">
              {session.status.replace("_", " ")}
            </Badge>
          </div>
          <p className="text-caption text-foreground-muted mb-2">
            {session.coach.headline}
          </p>
          <div className="flex items-center gap-4 text-caption text-foreground-muted">
            <span className="flex items-center gap-1">
              <CalendarBlank size={14} />
              {format(scheduledAt, "MMM d, yyyy")}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {format(scheduledAt, "h:mm a")} ({session.duration} min)
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          {isUpcoming && session.meetingLink && (
            <Button variant="primary" size="sm" asChild>
              <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                <VideoCamera size={16} className="mr-1" />
                Join
              </a>
            </Button>
          )}
          {session.status === "COMPLETED" && !session.hasReview && userRole === "seeker" && (
            <Button variant="secondary" size="sm" asChild>
              <Link href={`/candid/sessions/${session.id}/review`}>
                Leave Review
              </Link>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function SessionsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (filterStatus !== "all") params.set("status", filterStatus);

      const response = await fetch(`/api/sessions?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch sessions");

      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setError("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const filteredSessions = sessions.filter((session) => {
    if (filterStatus === "all") return true;
    return session.status === filterStatus;
  });

  const upcomingSessions = filteredSessions
    .filter((s) => s.status === "SCHEDULED" && new Date(s.scheduledAt) > new Date())
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  const pastSessions = filteredSessions
    .filter((s) => s.status !== "SCHEDULED" || new Date(s.scheduledAt) <= new Date())
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());

  // Calendar data
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const sessionsOnDay = (date: Date) =>
    filteredSessions.filter((s) => isSameDay(new Date(s.scheduledAt), date));

  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-heading-md font-semibold text-foreground-default">Sessions</h1>
          <p className="mt-1 text-body text-foreground-muted">
            Manage your coaching and mentoring sessions
          </p>
        </div>
        <Button variant="primary" leftIcon={<CalendarPlus size={18} />} asChild>
          <Link href="/candid/browse">
            Book a Session
          </Link>
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <Alert
          variant="critical"
          title="Couldn't load sessions"
          actionLabel="Retry"
          onAction={fetchSessions}
          dismissible
          onDismiss={() => setError(null)}
          className="mb-6"
        >
          Check your connection and try again.
        </Alert>
      )}

      {/* Filters & View Toggle */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Status Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <Funnel size={16} className="text-foreground-muted" />
          {(["all", "SCHEDULED", "COMPLETED", "CANCELLED"] as FilterStatus[]).map((status) => (
            <Chip
              key={status}
              variant={filterStatus === status ? "primary" : "neutral"}
              size="sm"
              selected={filterStatus === status}
              onClick={() => setFilterStatus(status)}
            >
              {status === "all" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
            </Chip>
          ))}
        </div>

        {/* View Toggle */}
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
          <TabsList>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {viewMode === "list" ? (
        // List View - Container logic
        <div className="space-y-8">
          {/* Upcoming Sessions */}
          {upcomingSessions.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-2">
                <Clock size={18} className="text-foreground-brand" />
                <h2 className="text-heading-sm font-semibold text-foreground-default">
                  Upcoming Sessions
                </h2>
                <Chip variant="blue" size="sm">
                  {upcomingSessions.length}
                </Chip>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {upcomingSessions.map((session) => (
                  <SessionListCard key={session.id} session={session} userRole="seeker" />
                ))}
              </div>
            </section>
          )}

          {/* Past Sessions */}
          {pastSessions.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-2">
                <CheckCircle size={18} className="text-foreground-muted" />
                <h2 className="text-heading-sm font-semibold text-foreground-default">
                  Past Sessions
                </h2>
                <Chip variant="neutral" size="sm">
                  {pastSessions.length}
                </Chip>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {pastSessions.map((session) => (
                  <SessionListCard key={session.id} session={session} userRole="seeker" />
                ))}
              </div>
            </section>
          )}

          {/* Empty State - only show if no error */}
          {filteredSessions.length === 0 && !error && (
            <Card className="p-12">
              <EmptyState
                icon={
                  <CalendarX
                    size={32}
                    weight="duotone"
                    className="text-foreground-muted"
                  />
                }
                title="No sessions found"
                description={
                  filterStatus === "all"
                    ? "Book your first session with a coach to get started on your journey"
                    : `You don't have any ${filterStatus.toLowerCase()} sessions`
                }
                action={{
                  label: "Browse Coaches",
                  onClick: () => router.push("/candid/browse"),
                  icon: <CalendarPlus size={16} />,
                }}
                secondaryAction={
                  filterStatus !== "all"
                    ? {
                        label: "Clear filters",
                        onClick: () => setFilterStatus("all"),
                      }
                    : undefined
                }
              />
            </Card>
          )}
        </div>
      ) : (
        // Calendar View
        <Card>
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-4">
            <Button variant="ghost" size="sm" onClick={goToPreviousMonth}>
              ←
            </Button>
            <h2 className="text-body-strong font-semibold text-foreground-default">
              {format(currentMonth, "MMMM yyyy")}
            </h2>
            <Button variant="ghost" size="sm" onClick={goToNextMonth}>
              →
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="p-4">
            {/* Weekday Headers */}
            <div className="mb-2 grid grid-cols-7 gap-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="py-2 text-center text-caption font-medium text-foreground-muted"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before month start */}
              {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                <div key={`empty-start-${i}`} className="aspect-square" />
              ))}

              {/* Calendar Days */}
              {calendarDays.map((day) => {
                const daySessions = sessionsOnDay(day);
                const hasSession = daySessions.length > 0;

                return (
                  <div
                    key={day.toISOString()}
                    className={`relative aspect-square rounded-lg p-1 ${
                      isToday(day)
                        ? "bg-background-info"
                        : hasSession
                        ? "bg-background-subtle"
                        : "hover:bg-background-subtle"
                    }`}
                  >
                    <div
                      className={`text-center text-caption ${
                        isToday(day)
                          ? "font-semibold text-foreground-brand"
                          : "text-foreground-default"
                      }`}
                    >
                      {format(day, "d")}
                    </div>
                    {hasSession && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                        <div className="flex gap-0.5">
                          {daySessions.slice(0, 3).map((session) => (
                            <div
                              key={session.id}
                              className={`h-1.5 w-1.5 rounded-full ${
                                session.status === "SCHEDULED"
                                  ? "bg-background-brand-emphasis"
                                  : session.status === "COMPLETED"
                                  ? "bg-background-success-emphasis"
                                  : "bg-background-error-emphasis"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 border-t border-border-default p-3">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-background-brand-emphasis" />
              <span className="text-caption text-foreground-muted">Scheduled</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-background-success-emphasis" />
              <span className="text-caption text-foreground-muted">Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-background-error-emphasis" />
              <span className="text-caption text-foreground-muted">Cancelled</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
