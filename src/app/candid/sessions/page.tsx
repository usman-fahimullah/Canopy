"use client";

import { useState } from "react";
import Link from "next/link";
import { SessionCard } from "../components";
import { currentUser, getSessionsForUser } from "@/lib/candid";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import {
  CalendarBlank,
  CalendarPlus,
  Clock,
  CheckCircle,
  Funnel,
} from "@phosphor-icons/react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns";

type ViewMode = "list" | "calendar";
type FilterStatus = "all" | "scheduled" | "completed" | "cancelled";

export default function SessionsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const allSessions = getSessionsForUser(currentUser.id);

  const filteredSessions = allSessions.filter((session) => {
    if (filterStatus === "all") return true;
    return session.status === filterStatus;
  });

  const upcomingSessions = filteredSessions
    .filter((s) => s.status === "scheduled" && s.scheduledAt > new Date())
    .sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime());

  const pastSessions = filteredSessions
    .filter((s) => s.status !== "scheduled" || s.scheduledAt <= new Date())
    .sort((a, b) => b.scheduledAt.getTime() - a.scheduledAt.getTime());

  // Calendar data
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const sessionsOnDay = (date: Date) =>
    filteredSessions.filter((s) => isSameDay(s.scheduledAt, date));

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
          <Link href="/candid/sessions/schedule">
            Schedule Session
          </Link>
        </Button>
      </div>

      {/* Filters & View Toggle */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Status Filters */}
        <div className="flex items-center gap-2">
          <Funnel size={16} className="text-foreground-muted" />
          {(["all", "scheduled", "completed", "cancelled"] as FilterStatus[]).map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? "secondary" : "tertiary"}
              size="sm"
              onClick={() => setFilterStatus(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1">
          <Button
            variant={viewMode === "list" ? "secondary" : "tertiary"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            List
          </Button>
          <Button
            variant={viewMode === "calendar" ? "secondary" : "tertiary"}
            size="sm"
            onClick={() => setViewMode("calendar")}
          >
            Calendar
          </Button>
        </div>
      </div>

      {viewMode === "list" ? (
        // List View - Container logic
        <div className="space-y-8">
          {/* Upcoming Sessions */}
          {upcomingSessions.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-2">
                <Clock size={18} className="text-[var(--primitive-green-800)]" />
                <h2 className="text-heading-sm font-semibold text-foreground-default">
                  Upcoming Sessions
                </h2>
                <Chip variant="blue" size="sm">
                  {upcomingSessions.length}
                </Chip>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {upcomingSessions.map((session) => (
                  <SessionCard key={session.id} session={session} userRole="mentee" />
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
                  <SessionCard key={session.id} session={session} userRole="mentee" />
                ))}
              </div>
            </section>
          )}

          {/* Empty State - white card with shadow */}
          {filteredSessions.length === 0 && (
            <div className="rounded-card bg-white p-12 shadow-card text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primitive-blue-200)]">
                <CalendarBlank size={32} className="text-[var(--primitive-green-800)]" />
              </div>
              <h3 className="text-body-strong font-semibold text-foreground-default">
                No sessions found
              </h3>
              <p className="mt-2 text-caption text-foreground-muted">
                {filterStatus === "all"
                  ? "Schedule your first session to get started"
                  : `No ${filterStatus} sessions`}
              </p>
              <Button variant="primary" className="mt-4" leftIcon={<CalendarPlus size={16} />} asChild>
                <Link href="/candid/sessions/schedule">
                  Schedule Session
                </Link>
              </Button>
            </div>
          )}
        </div>
      ) : (
        // Calendar View - white card with shadow
        <div className="rounded-card bg-white shadow-card">
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
                        ? "bg-[var(--primitive-blue-200)]"
                        : hasSession
                        ? "bg-[var(--background-subtle)]"
                        : "hover:bg-[var(--background-subtle)]"
                    }`}
                  >
                    <div
                      className={`text-center text-caption ${
                        isToday(day)
                          ? "font-semibold text-[var(--primitive-green-800)]"
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
                                session.status === "scheduled"
                                  ? "bg-[var(--primitive-green-800)]"
                                  : session.status === "completed"
                                  ? "bg-[var(--primitive-green-500)]"
                                  : "bg-[var(--primitive-red-500)]"
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
          <div className="flex items-center justify-center gap-4 border-t border-[var(--border-default)] p-3">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-[var(--primitive-green-800)]" />
              <span className="text-caption text-foreground-muted">Scheduled</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-[var(--primitive-green-500)]" />
              <span className="text-caption text-foreground-muted">Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-[var(--primitive-red-500)]" />
              <span className="text-caption text-foreground-muted">Cancelled</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
