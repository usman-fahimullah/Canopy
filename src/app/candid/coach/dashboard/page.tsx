"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/shell/page-header";
import { DashboardChecklist } from "@/components/shell/dashboard-checklist";
import { Spinner } from "@/components/ui/spinner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  Users,
  CalendarDots,
  ChartLine,
  Clock,
  VideoCamera,
  ArrowCircleRight,
} from "@phosphor-icons/react";
import { format, isToday, isTomorrow, isSameDay } from "date-fns";
import { logger, formatError } from "@/lib/logger";

interface Session {
  id: string;
  title: string | null;
  scheduledAt: string;
  duration: number;
  status: string;
  meetingLink: string | null;
  client?: {
    id: string;
    firstName: string;
    lastName: string;
    photoUrl: string | null;
  };
  seeker?: {
    id: string;
    firstName: string;
    lastName: string;
    photoUrl: string | null;
  };
}

interface Earnings {
  totalEarnings: number;
  monthlyEarnings: number;
  pendingEarnings: number;
}

interface DashboardData {
  upcomingSessions: Session[];
  completedSessionsCount: number;
  uniqueClientCount: number;
  totalHoursCoached: number;
  earnings: Earnings;
}

const initialData: DashboardData = {
  upcomingSessions: [],
  completedSessionsCount: 0,
  uniqueClientCount: 0,
  totalHoursCoached: 0,
  earnings: { totalEarnings: 0, monthlyEarnings: 0, pendingEarnings: 0 },
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatScheduleDate(date: Date) {
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  return format(date, "EEE, MMM d");
}

export default function CoachDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData>(initialData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionsRes, earningsRes] = await Promise.all([
          fetch("/api/sessions"),
          fetch("/api/candid/coach/earnings"),
        ]);

        const sessionsData = sessionsRes.ok ? await sessionsRes.json() : { sessions: [] };
        const earningsData = earningsRes.ok ? await earningsRes.json() : {};

        const allSessions: Session[] = sessionsData.sessions || [];
        const upcoming = allSessions
          .filter((s) => s.status === "SCHEDULED" && new Date(s.scheduledAt) > new Date())
          .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

        const completed = allSessions.filter((s) => s.status === "COMPLETED");
        const clientIds = new Set(
          allSessions.map((s) => s.client?.id || s.seeker?.id).filter(Boolean)
        );
        const totalMinutes = completed.reduce((sum, s) => sum + (s.duration || 0), 0);

        setData({
          upcomingSessions: upcoming,
          completedSessionsCount: completed.length,
          uniqueClientCount: clientIds.size,
          totalHoursCoached: Math.round((totalMinutes / 60) * 10) / 10,
          earnings: {
            totalEarnings: earningsData.totalEarnings || 0,
            monthlyEarnings: earningsData.monthlyEarnings || 0,
            pendingEarnings: earningsData.pendingEarnings || 0,
          },
        });
      } catch (error) {
        logger.error("Error fetching dashboard data", { error: formatError(error) });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Group sessions by date for schedule sidebar
  const groupSessionsByDate = () => {
    const groups: { label: string; date: Date; sessions: Session[]; isToday: boolean }[] = [];

    if (data.upcomingSessions.length === 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return [{ label: "Today", date: today, sessions: [], isToday: true }];
    }

    const sessionMap = new Map<string, Session[]>();
    data.upcomingSessions.forEach((session) => {
      const d = new Date(session.scheduledAt);
      const key = format(d, "yyyy-MM-dd");
      const existing = sessionMap.get(key) || [];
      existing.push(session);
      sessionMap.set(key, existing);
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastSessionDate = new Date(
      data.upcomingSessions[data.upcomingSessions.length - 1].scheduledAt
    );
    lastSessionDate.setHours(0, 0, 0, 0);

    const cursor = new Date(today);
    while (cursor <= lastSessionDate) {
      const key = format(cursor, "yyyy-MM-dd");
      const daySessions = sessionMap.get(key) || [];
      const dayIsToday = isSameDay(cursor, today);

      groups.push({
        label: formatScheduleDate(cursor),
        date: new Date(cursor),
        sessions: daySessions,
        isToday: dayIsToday,
      });

      cursor.setDate(cursor.getDate() + 1);
    }

    return groups;
  };

  const sessionGroups = groupSessionsByDate();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Main Content */}
      <div className="min-w-0 flex-1">
        <PageHeader title="Home" />

        {/* Greeting + Quick Actions */}
        <div className="flex flex-col gap-6 px-8 py-6 lg:px-12">
          <h2 className="text-heading-md font-medium text-[var(--primitive-green-800)]">
            {getGreeting()}
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/candid/coach/sessions"
              className={cn(
                buttonVariants({ variant: "primary" }),
                "rounded-[16px] px-4 py-4 text-body font-bold"
              )}
            >
              <CalendarDots size={20} weight="fill" />
              Sessions
            </Link>
            <Link
              href="/candid/coach/clients"
              className={cn(
                buttonVariants({ variant: "tertiary" }),
                "rounded-[16px] px-4 py-4 text-body font-bold"
              )}
            >
              <Users size={20} weight="bold" />
              View Clients
            </Link>
            <Link
              href="/candid/coach/schedule"
              className={cn(
                buttonVariants({ variant: "tertiary" }),
                "rounded-[16px] px-4 py-4 text-body font-bold"
              )}
            >
              <Clock size={20} weight="fill" />
              Availability
            </Link>
          </div>
        </div>

        {/* Getting Started Checklist */}
        <section className="px-8 py-4 lg:px-12">
          <DashboardChecklist shell="coach" />
        </section>

        {/* Stats */}
        <section className="px-8 py-6 lg:px-12">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { label: "Active Clients", value: data.uniqueClientCount, icon: Users },
              { label: "This Month", value: data.completedSessionsCount, icon: CalendarDots },
              {
                label: "Earnings",
                value: `$${data.earnings.monthlyEarnings.toLocaleString()}`,
                icon: ChartLine,
              },
              { label: "Hours Coached", value: data.totalHoursCoached, icon: Clock },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col gap-3 rounded-[16px] border border-[var(--primitive-neutral-200)] bg-[var(--card-background)] px-4 py-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-caption text-foreground-muted">{stat.label}</p>
                  <div className="rounded-lg bg-[var(--primitive-yellow-100)] p-1.5">
                    <stat.icon
                      size={16}
                      weight="bold"
                      className="text-[var(--primitive-yellow-600)]"
                    />
                  </div>
                </div>
                <p className="text-foreground-default text-heading-sm font-semibold">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Today's Sessions */}
        <section className="px-8 py-6 lg:px-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-foreground-default text-heading-sm font-medium">
              Upcoming Sessions
            </h2>
            <Link
              href="/candid/coach/sessions"
              className={cn(
                buttonVariants({ variant: "inverse" }),
                "rounded-[16px] px-4 py-3.5 text-caption font-bold"
              )}
            >
              View All
              <ArrowCircleRight size={20} />
            </Link>
          </div>

          {data.upcomingSessions.length > 0 ? (
            <div className="space-y-3">
              {data.upcomingSessions.slice(0, 5).map((session) => {
                const sessionDate = new Date(session.scheduledAt);
                const endTime = new Date(sessionDate.getTime() + session.duration * 60000);
                const client = session.client || session.seeker;

                return (
                  <div
                    key={session.id}
                    className="flex items-center gap-4 rounded-[16px] border border-[var(--primitive-neutral-200)] bg-[var(--card-background)] px-6 py-4"
                  >
                    {client && (
                      <Avatar
                        size="sm"
                        src={client.photoUrl || undefined}
                        name={`${client.firstName} ${client.lastName}`}
                        color="green"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground-default text-body font-medium">
                        {session.title || "1:1 Session"}
                      </p>
                      <p className="text-caption text-foreground-muted">
                        {client ? `${client.firstName} ${client.lastName}` : "Client"} ·{" "}
                        {format(sessionDate, "MMM d, h:mma")} - {format(endTime, "h:mma")}
                      </p>
                    </div>
                    {isToday(sessionDate) && session.meetingLink && (
                      <Button variant="primary" size="sm" asChild>
                        <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                          <VideoCamera size={16} weight="fill" />
                          Join
                        </a>
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[16px] border border-[var(--primitive-neutral-200)] bg-[var(--card-background)] p-8 text-center">
              <p className="text-body text-foreground-muted">
                No upcoming sessions. Your schedule is clear.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Right Sidebar - Schedule (Large Desktop only) */}
      <aside className="hidden w-[375px] flex-shrink-0 border-l border-[var(--primitive-neutral-200)] bg-[var(--background-default)] xl:block">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <div className="flex h-[108px] items-center justify-between border-b border-[var(--primitive-neutral-200)] p-6">
            <h2 className="text-foreground-default text-heading-sm font-medium">Your Schedule</h2>
            <Link
              href="/candid/coach/schedule"
              className="flex items-center justify-center rounded-[16px] bg-[var(--primitive-neutral-200)] p-2.5 transition-colors hover:bg-[var(--primitive-neutral-300)]"
            >
              <CalendarDots size={20} weight="regular" />
            </Link>
          </div>

          <div>
            {sessionGroups.map((group) => (
              <div
                key={group.label}
                className="border-b border-[var(--primitive-neutral-200)] px-6 py-3"
              >
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-foreground-default text-body font-normal">
                    {group.isToday ? format(group.date, "EEEE") : group.label}
                  </span>
                  {group.isToday && (
                    <span className="rounded-lg bg-[var(--primitive-neutral-200)] px-2 py-1 text-caption font-medium">
                      Today
                    </span>
                  )}
                </div>

                {group.sessions.length > 0 ? (
                  <div className="space-y-4">
                    {group.sessions.map((session) => {
                      const sessionDate = new Date(session.scheduledAt);
                      const endTime = new Date(sessionDate.getTime() + session.duration * 60000);
                      const client = session.client || session.seeker;

                      if (group.isToday) {
                        return (
                          <div
                            key={session.id}
                            className="space-y-4 rounded-lg bg-[var(--primitive-green-800)] p-3"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-caption-strong text-[var(--primitive-green-100)]">
                                  {format(sessionDate, "h:mma")} - {format(endTime, "h:mma")}
                                </span>
                                {client && (
                                  <span className="text-caption text-[var(--primitive-green-200)]">
                                    {client.firstName}
                                  </span>
                                )}
                              </div>
                              <p className="text-body text-[var(--primitive-green-100)]">
                                {session.title || "1:1 Session"}
                              </p>
                            </div>
                            {session.meetingLink && (
                              <Button variant="inverse" className="w-full" asChild>
                                <a
                                  href={session.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <VideoCamera size={20} weight="fill" />
                                  Join Meeting
                                </a>
                              </Button>
                            )}
                          </div>
                        );
                      }

                      return (
                        <div
                          key={session.id}
                          className="space-y-4 rounded-lg bg-[var(--primitive-blue-100)] p-3"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-caption-strong text-[var(--primitive-blue-700)]">
                                {format(sessionDate, "h:mma")} - {format(endTime, "h:mma")}
                              </span>
                              {client && (
                                <span className="text-caption text-[var(--primitive-blue-600)]">
                                  {client.firstName}
                                </span>
                              )}
                            </div>
                            <p className="text-body text-[var(--primitive-blue-700)]">
                              {session.title || "1:1 Session"}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex h-[160px] items-center justify-center rounded-lg bg-[var(--primitive-neutral-100)]">
                    <p className="text-body font-medium text-foreground-muted">No sessions</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
