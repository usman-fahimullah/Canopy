"use client";

import { useState, useEffect, useMemo } from "react";
import { PageHeader } from "@/components/shell/page-header";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { CalendarDots, VideoCamera, Clock } from "@phosphor-icons/react";
import { format, isToday, isPast } from "date-fns";
import { logger, formatError } from "@/lib/logger";

type FilterTab = "upcoming" | "past" | "cancelled";

interface Session {
  id: string;
  title: string | null;
  scheduledAt: string;
  duration: number;
  status: string;
  meetingLink: string | null;
  mentee?: {
    id: string;
    name?: string;
    avatar?: string | null;
    email?: string;
  };
}

function getClientInfo(session: Session) {
  const mentee = session.mentee;
  if (!mentee) return { name: "Unknown Client", avatar: null };
  return { name: mentee.name ?? "Unknown Client", avatar: mentee.avatar ?? null };
}

function getStatusBadge(status: string) {
  switch (status) {
    case "SCHEDULED":
      return <Badge variant="info">Scheduled</Badge>;
    case "COMPLETED":
      return <Badge variant="success">Completed</Badge>;
    case "CANCELLED":
      return <Badge variant="critical">Cancelled</Badge>;
    case "NO_SHOW":
      return <Badge variant="warning">No Show</Badge>;
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
}

export default function CoachSessionsPage() {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeTab, setActiveTab] = useState<FilterTab>("upcoming");

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch("/api/sessions?role=coach");
        if (!res.ok) throw new Error("Failed to fetch sessions");

        const data = await res.json();
        setSessions(data.sessions || []);
      } catch (error) {
        logger.error("Error fetching sessions", { error: formatError(error) });
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const filteredSessions = useMemo(() => {
    const now = new Date();

    switch (activeTab) {
      case "upcoming":
        return sessions
          .filter((s) => s.status === "SCHEDULED" && new Date(s.scheduledAt) >= now)
          .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
      case "past":
        return sessions
          .filter(
            (s) =>
              s.status === "COMPLETED" ||
              (s.status === "SCHEDULED" && isPast(new Date(s.scheduledAt)))
          )
          .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
      case "cancelled":
        return sessions
          .filter((s) => s.status === "CANCELLED" || s.status === "NO_SHOW")
          .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
      default:
        return sessions;
    }
  }, [sessions, activeTab]);

  const tabCounts = useMemo(() => {
    const now = new Date();
    return {
      upcoming: sessions.filter((s) => s.status === "SCHEDULED" && new Date(s.scheduledAt) >= now)
        .length,
      past: sessions.filter(
        (s) =>
          s.status === "COMPLETED" || (s.status === "SCHEDULED" && isPast(new Date(s.scheduledAt)))
      ).length,
      cancelled: sessions.filter((s) => s.status === "CANCELLED" || s.status === "NO_SHOW").length,
    };
  }, [sessions]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Sessions" />

      <div className="px-8 py-6 lg:px-12">
        {/* Tab-like filter */}
        <div className="mb-6 flex gap-2">
          {(
            [
              { key: "upcoming", label: "Upcoming" },
              { key: "past", label: "Past" },
              { key: "cancelled", label: "Cancelled" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-[12px] px-4 py-2.5 text-caption font-bold transition-colors ${
                activeTab === tab.key
                  ? "bg-[var(--primitive-green-800)] text-[var(--primitive-blue-100)]"
                  : "bg-[var(--primitive-neutral-200)] text-[var(--primitive-neutral-700)] hover:bg-[var(--background-interactive-hover)]"
              }`}
            >
              {tab.label}
              {tabCounts[tab.key] > 0 && (
                <span className="ml-1.5 opacity-70">({tabCounts[tab.key]})</span>
              )}
            </button>
          ))}
        </div>

        {/* Session list */}
        {filteredSessions.length > 0 ? (
          <div className="space-y-3">
            {filteredSessions.map((session) => {
              const sessionDate = new Date(session.scheduledAt);
              const endTime = new Date(sessionDate.getTime() + session.duration * 60000);
              const client = getClientInfo(session);
              const todaySession = isToday(sessionDate);

              return (
                <div
                  key={session.id}
                  className={`flex items-center gap-4 rounded-[16px] border px-6 py-4 shadow-card transition-shadow hover:shadow-card-hover ${
                    todaySession && session.status === "SCHEDULED"
                      ? "border-[var(--primitive-green-300)] bg-[var(--primitive-green-800)]"
                      : activeTab === "upcoming"
                        ? "border-[var(--primitive-blue-200)] bg-[var(--primitive-blue-100)]"
                        : "border-[var(--primitive-neutral-200)] bg-[var(--card-background)]"
                  }`}
                >
                  <Avatar
                    size="default"
                    src={client.avatar || undefined}
                    name={client.name}
                    color="green"
                  />

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-body font-medium ${
                        todaySession && session.status === "SCHEDULED"
                          ? "text-[var(--primitive-green-100)]"
                          : "text-[var(--primitive-neutral-800)]"
                      }`}
                    >
                      {client.name}
                    </p>
                    <div
                      className={`flex items-center gap-2 text-caption ${
                        todaySession && session.status === "SCHEDULED"
                          ? "text-[var(--primitive-green-200)]"
                          : "text-[var(--primitive-neutral-600)]"
                      }`}
                    >
                      <CalendarDots size={14} weight="regular" />
                      <span>{format(sessionDate, "MMM d, yyyy")}</span>
                      <span>
                        {format(sessionDate, "h:mma")} - {format(endTime, "h:mma")}
                      </span>
                    </div>
                    <div
                      className={`mt-1 flex items-center gap-2 text-caption ${
                        todaySession && session.status === "SCHEDULED"
                          ? "text-[var(--primitive-green-200)]"
                          : "text-[var(--primitive-neutral-500)]"
                      }`}
                    >
                      <Clock size={14} weight="regular" />
                      <span>{session.duration} min</span>
                      {session.title && (
                        <>
                          <span>-</span>
                          <span>{session.title}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {!(todaySession && session.status === "SCHEDULED") &&
                      getStatusBadge(session.status)}

                    {activeTab === "upcoming" && session.meetingLink && (
                      <Button variant={todaySession ? "inverse" : "primary"} size="sm" asChild>
                        <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                          <VideoCamera size={16} weight="fill" />
                          Join
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[16px] border border-[var(--primitive-neutral-200)] bg-[var(--card-background)] px-8 py-16 text-center">
            <div className="mb-4 rounded-xl bg-[var(--primitive-yellow-100)] p-3">
              <CalendarDots
                size={28}
                weight="bold"
                className="text-[var(--primitive-yellow-600)]"
              />
            </div>
            <p className="text-body font-medium text-[var(--primitive-neutral-800)]">
              No {activeTab} sessions
            </p>
            <p className="mt-1 text-caption text-[var(--primitive-neutral-500)]">
              {activeTab === "upcoming"
                ? "No sessions scheduled. New bookings will appear here."
                : activeTab === "past"
                  ? "No past sessions to show yet."
                  : "No cancelled sessions."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
