"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MyCoachCard, GettingStartedChecklist } from "../components";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { ProgressMeterCircular } from "@/components/ui/progress-meter";
import { Spinner } from "@/components/ui/spinner";
import {
  CalendarDots,
  VideoCamera,
  Note,
  Binoculars,
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
  coach: {
    id: string;
    firstName: string;
    lastName: string;
    photoUrl: string | null;
    headline: string | null;
  };
}

interface DashboardData {
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  upcomingSessions: Session[];
  completedSessionsCount: number;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [progressFromApi, setProgressFromApi] = useState<{
    actions: { current: number; total: number };
    goals: { current: number; total: number };
    milestones: { current: number; total: number };
  } | null>(null);
  const [data, setData] = useState<DashboardData>({
    user: null,
    upcomingSessions: [],
    completedSessionsCount: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch sessions, coaches, and goals in parallel
        const [sessionsRes, goalsRes] = await Promise.all([
          fetch("/api/sessions"),
          fetch("/api/goals"),
        ]);

        const sessionsData = sessionsRes.ok ? await sessionsRes.json() : { sessions: [] };
        const goalsData = goalsRes.ok ? await goalsRes.json() : { goals: [] };

        const allSessions = sessionsData.sessions || [];
        const upcomingSessions = allSessions
          .filter((s: Session) => s.status === "SCHEDULED" && new Date(s.scheduledAt) > new Date())
          .sort(
            (a: Session, b: Session) =>
              new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
          );

        const completedSessionsCount = allSessions.filter(
          (s: Session) => s.status === "COMPLETED"
        ).length;

        // Calculate action items completed from session action items
        const actionItemsCompleted = allSessions.reduce(
          (count: number, s: Session & { actionItems?: { status: string }[] }) => {
            return count + (s.actionItems?.filter((ai) => ai.status === "COMPLETED").length || 0);
          },
          0
        );
        const actionItemsTotal = allSessions.reduce(
          (count: number, s: Session & { actionItems?: unknown[] }) => {
            return count + (s.actionItems?.length || 0);
          },
          0
        );

        // Calculate goals/milestones progress
        const allGoals = goalsData.goals || [];
        const completedGoals = allGoals.filter(
          (g: { status: string }) => g.status === "COMPLETED"
        ).length;
        const allMilestones = allGoals.flatMap(
          (g: { milestones?: { completed: boolean }[] }) => g.milestones || []
        );
        const completedMilestones = allMilestones.filter(
          (m: { completed: boolean }) => m.completed
        ).length;

        setData({
          user: null,
          upcomingSessions,
          completedSessionsCount,
        });

        setProgressFromApi({
          actions: { current: actionItemsCompleted, total: Math.max(actionItemsTotal, 1) },
          goals: { current: completedGoals, total: Math.max(allGoals.length, 1) },
          milestones: { current: completedMilestones, total: Math.max(allMilestones.length, 1) },
        });
      } catch (error) {
        logger.error("Error fetching dashboard data", { error: formatError(error) });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const progressData = {
    sessions: {
      current: data.completedSessionsCount,
      total: Math.max(data.completedSessionsCount + data.upcomingSessions.length, 1),
    },
    actions: progressFromApi?.actions || { current: 0, total: 1 },
    skills: progressFromApi?.goals || { current: 0, total: 1 },
    milestones: progressFromApi?.milestones || { current: 0, total: 1 },
  };

  // Get time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Format date for schedule
  const formatScheduleDate = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "EEE, MMM d");
  };

  // Group sessions by date for schedule — fills gaps between days
  const groupSessionsByDate = () => {
    const groups: { label: string; date: Date; sessions: Session[]; isToday: boolean }[] = [];

    if (data.upcomingSessions.length === 0) {
      // No sessions — show today as empty
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return [{ label: "Today", date: today, sessions: [], isToday: true }];
    }

    // Build a map of date → sessions
    const sessionMap = new Map<string, Session[]>();
    data.upcomingSessions.forEach((session) => {
      const d = new Date(session.scheduledAt);
      const key = format(d, "yyyy-MM-dd");
      const existing = sessionMap.get(key) || [];
      existing.push(session);
      sessionMap.set(key, existing);
    });

    // Determine date range: today → last session day
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastSessionDate = new Date(
      data.upcomingSessions[data.upcomingSessions.length - 1].scheduledAt
    );
    lastSessionDate.setHours(0, 0, 0, 0);

    // Fill each day from today to the last session date
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
        {/* Page Header — 108px white bar */}
        <div className="flex h-[108px] items-center border-b border-[var(--primitive-neutral-200)] bg-[var(--background-default)] px-8 lg:px-12">
          <h1 className="text-heading-md font-medium text-[var(--primitive-green-800)]">Home</h1>
        </div>

        {/* Greeting + Quick Actions */}
        <div className="flex flex-col gap-6 px-8 py-6 lg:px-12">
          <h2 className="text-heading-md font-medium text-[var(--primitive-green-800)]">
            {getGreeting()}
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/candid/sessions/schedule"
              className={cn(
                buttonVariants({ variant: "primary" }),
                "rounded-[16px] px-4 py-4 text-body font-bold"
              )}
            >
              <CalendarDots size={20} />
              Book a session
            </Link>
            <Link
              href="/candid/notes"
              className={cn(
                buttonVariants({ variant: "tertiary" }),
                "rounded-[16px] px-4 py-4 text-body font-bold"
              )}
            >
              <Note size={20} />
              View Notes
            </Link>
            <Link
              href="/candid/mentors"
              className={cn(
                buttonVariants({ variant: "tertiary" }),
                "rounded-[16px] px-4 py-4 text-body font-bold"
              )}
            >
              <Binoculars size={20} />
              Find a mentor
            </Link>
          </div>
        </div>

        {/* Getting Started Checklist */}
        <section className="px-8 py-6 lg:px-12">
          <GettingStartedChecklist />
        </section>

        {/* My Progress */}
        <section className="px-8 py-6 lg:px-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-foreground-default text-heading-sm font-medium">My Progress</h2>
            <Link
              href="/candid/profile"
              className={cn(
                buttonVariants({ variant: "inverse" }),
                "rounded-[16px] px-4 py-3.5 text-caption font-bold"
              )}
            >
              View Profile
              <ArrowCircleRight size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { goal: "sessions" as const, label: "Sessions", data: progressData.sessions },
              { goal: "actions" as const, label: "Actions", data: progressData.actions },
              { goal: "skills" as const, label: "Skills", data: progressData.skills },
              { goal: "milestones" as const, label: "Milestones", data: progressData.milestones },
            ].map((item) => (
              <div
                key={item.goal}
                className="flex flex-col items-center gap-4 rounded-[16px] border border-[var(--primitive-neutral-200)] bg-[var(--card-background)] px-4 py-6"
              >
                <ProgressMeterCircular
                  goal={item.goal}
                  size="lg"
                  value={(item.data.current / item.data.total) * 100}
                />
                <div className="flex flex-col items-center gap-1">
                  <p className="text-body font-normal text-[var(--primitive-green-800)]">
                    {item.label}
                  </p>
                  <p className="text-caption font-bold text-[var(--primitive-green-800)]">
                    {item.data.current}/{item.data.total}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Today's Action Items */}
        <section className="px-8 py-6 lg:px-12">
          <h2 className="text-foreground-default mb-3 text-heading-sm font-medium">
            Today&apos;s Action Items
          </h2>

          {/* Action items grouped by session */}
          {data.upcomingSessions.length > 0 ? (
            <div className="space-y-3">
              {data.upcomingSessions.slice(0, 3).map((session) => {
                const sessionDate = new Date(session.scheduledAt);
                const endTime = new Date(sessionDate.getTime() + session.duration * 60000);

                return (
                  <div
                    key={session.id}
                    className="overflow-hidden rounded-[16px] border border-[var(--primitive-neutral-200)] bg-[var(--card-background)]"
                  >
                    {/* Session header */}
                    <div className="flex items-center gap-3 px-6 pb-2 pt-4">
                      <div className="flex flex-1 items-center gap-1 text-body font-medium">
                        <span className="text-foreground-default">
                          {session.title || "1:1 Session"}
                        </span>
                        <span className="text-foreground-muted">
                          {format(sessionDate, "MMM d, h:mma")}
                        </span>
                      </div>
                    </div>

                    {/* Session meta row */}
                    <div className="flex items-center gap-2 px-6 pb-2">
                      <div className="flex items-center gap-1 rounded-lg bg-[var(--primitive-neutral-100)] py-1 pl-1 pr-2">
                        <Avatar
                          size="xs"
                          src={session.coach.photoUrl || undefined}
                          name={`${session.coach.firstName} ${session.coach.lastName}`}
                          color="green"
                        />
                        <span className="text-foreground-default text-caption font-medium">
                          {session.coach.firstName} {session.coach.lastName}
                        </span>
                      </div>
                      <span className="text-foreground-default text-caption font-medium">
                        {format(sessionDate, "h:mma")}
                      </span>
                      <span className="text-caption font-medium text-foreground-muted">
                        {session.duration}mins
                      </span>
                    </div>

                    {/* Action item — placeholder */}
                    <div className="flex items-center gap-3 border-t border-[var(--primitive-neutral-200)] px-6 py-6">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-[var(--primitive-neutral-300)] bg-[var(--background-interactive-default)]"></div>
                      <span className="text-foreground-default text-body font-medium">
                        Send meeting notes to{" "}
                        <span className="text-[var(--primitive-blue-500)]">
                          {session.coach.firstName}
                        </span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[16px] border border-[var(--primitive-neutral-200)] bg-[var(--card-background)] p-8 text-center">
              <p className="text-body text-foreground-muted">No action items for today</p>
            </div>
          )}
        </section>

        {/* My Coach */}
        <section className="px-8 py-6 lg:px-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-foreground-default text-heading-sm font-medium">My Coach</h2>
          </div>
          <MyCoachCard />
        </section>
      </div>

      {/* Right Sidebar - Schedule (Large Desktop only) */}
      <aside className="hidden w-[375px] flex-shrink-0 border-l border-[var(--candid-schedule-border)] bg-[var(--background-default)] xl:block">
        <div className="sticky top-0 h-screen overflow-y-auto">
          {/* Schedule Header */}
          <div className="flex h-[108px] items-center justify-between border-b border-[var(--primitive-neutral-200)] p-6">
            <h2 className="text-foreground-default text-heading-sm font-medium">Your Schedule</h2>
            <button className="flex items-center justify-center rounded-[16px] bg-[var(--primitive-neutral-200)] p-2.5 transition-colors hover:bg-[var(--primitive-neutral-300)]">
              <CalendarDots size={20} weight="regular" />
            </button>
          </div>

          {/* Schedule Content */}
          <div>
            {sessionGroups.map((group) => (
              <div
                key={group.label}
                className="border-b border-[var(--primitive-neutral-200)] px-6 py-3"
              >
                {/* Date Header */}
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

                {/* Sessions or Empty Card */}
                {group.sessions.length > 0 ? (
                  <div className="space-y-4">
                    {group.sessions.map((session) => {
                      const sessionDate = new Date(session.scheduledAt);
                      const endTime = new Date(sessionDate.getTime() + session.duration * 60000);
                      const roleLabel = session.coach.headline?.toLowerCase().includes("mentor")
                        ? "Mentor"
                        : "Coach";

                      if (group.isToday) {
                        /* Today's session card — DARK GREEN */
                        return (
                          <div
                            key={session.id}
                            className="space-y-4 rounded-lg bg-[var(--candid-schedule-card-today-bg)] p-3"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-caption-strong text-[var(--candid-schedule-card-today-text)]">
                                  {format(sessionDate, "h:mma")} - {format(endTime, "h:mma")}
                                </span>
                                <div className="flex items-center gap-1">
                                  <span className="h-2 w-2 rounded-full bg-[var(--primitive-green-400)]" />
                                  <span className="text-caption text-[var(--candid-schedule-card-today-text)]">
                                    Your {roleLabel}
                                  </span>
                                </div>
                              </div>
                              <p className="text-body text-[var(--candid-schedule-card-today-text)]">
                                {session.title || "1:1 Session"}
                              </p>
                            </div>
                            <Button variant="inverse" className="w-full" asChild>
                              <a
                                href={session.meetingLink || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <VideoCamera size={20} weight="fill" />
                                Join Meeting
                              </a>
                            </Button>
                          </div>
                        );
                      }

                      /* Future session card — BLUE */
                      return (
                        <div
                          key={session.id}
                          className="space-y-4 rounded-lg bg-[var(--candid-schedule-card-future-bg)] p-3"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-caption-strong text-[var(--candid-schedule-card-future-text)]">
                                {format(sessionDate, "h:mma")} - {format(endTime, "h:mma")}
                              </span>
                              <span className="text-caption text-[var(--candid-schedule-card-future-text)]">
                                {roleLabel}
                              </span>
                            </div>
                            <p className="text-body text-[var(--candid-schedule-card-future-text)]">
                              {session.title || "1:1 Session"}
                            </p>
                          </div>
                          <Button variant="inverse" className="w-full" asChild>
                            <a
                              href={session.meetingLink || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <VideoCamera size={20} weight="fill" />
                              Join Meeting
                            </a>
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Empty day card */
                  <div className="flex h-[240px] items-center justify-center rounded-lg bg-[var(--candid-schedule-card-empty-bg)]">
                    <p className="text-foreground-default text-heading-sm font-medium">
                      No sessions today
                    </p>
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
