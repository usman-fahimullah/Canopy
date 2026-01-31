"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  CoachCard,
  MyCoachCard,
  GettingStartedChecklist,
  JobMatchesWidget,
} from "../components";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ProgressMeterCircular } from "@/components/ui/progress-meter";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { SECTOR_INFO, type Sector, type CandidCoach } from "@/lib/candid/types";
import {
  CalendarBlank,
  CalendarDots,
  ChatCircle,
  CaretRight,
  MagnifyingGlass,
  VideoCamera,
  Clock,
  Users,
} from "@phosphor-icons/react";
import { format, isToday, isTomorrow, isSameDay } from "date-fns";

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
  recommendedCoaches: any[];
}

// Transform API coach to component format
function transformCoach(apiCoach: any): CandidCoach {
  return {
    id: apiCoach.id,
    email: "",
    firstName: apiCoach.firstName,
    lastName: apiCoach.lastName,
    role: "coach",
    avatar: apiCoach.photoUrl || undefined,
    bio: apiCoach.bio || undefined,
    location: apiCoach.location || undefined,
    timezone: apiCoach.timezone || undefined,
    createdAt: new Date(),
    sectors: (apiCoach.sectors || []) as Sector[],
    currentRole: apiCoach.headline || "Climate Coach",
    currentCompany: "",
    previousRoles: [],
    expertise: apiCoach.expertise || [],
    sessionTypes: ["coaching", "career-planning"],
    hourlyRate: apiCoach.sessionRate / 100,
    monthlyRate: undefined,
    availability: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
    menteeCount: apiCoach.totalSessions || 0,
    rating: apiCoach.rating || 0,
    reviewCount: apiCoach.reviewCount || 0,
    isFeatured: apiCoach.isFeatured,
  };
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
    recommendedCoaches: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch sessions, coaches, and goals in parallel
        const [sessionsRes, coachesRes, goalsRes] = await Promise.all([
          fetch("/api/sessions"),
          fetch("/api/coaches?limit=6"),
          fetch("/api/goals"),
        ]);

        const sessionsData = sessionsRes.ok ? await sessionsRes.json() : { sessions: [] };
        const coachesData = coachesRes.ok ? await coachesRes.json() : { coaches: [] };
        const goalsData = goalsRes.ok ? await goalsRes.json() : { goals: [] };

        const allSessions = sessionsData.sessions || [];
        const upcomingSessions = allSessions
          .filter((s: Session) => s.status === "SCHEDULED" && new Date(s.scheduledAt) > new Date())
          .sort((a: Session, b: Session) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

        const completedSessionsCount = allSessions.filter(
          (s: Session) => s.status === "COMPLETED"
        ).length;

        // Calculate action items completed from session action items
        const actionItemsCompleted = allSessions.reduce((count: number, s: any) => {
          return count + (s.actionItems?.filter((ai: any) => ai.status === "COMPLETED").length || 0);
        }, 0);
        const actionItemsTotal = allSessions.reduce((count: number, s: any) => {
          return count + (s.actionItems?.length || 0);
        }, 0);

        // Calculate goals/milestones progress
        const allGoals = goalsData.goals || [];
        const completedGoals = allGoals.filter((g: any) => g.status === "COMPLETED").length;
        const allMilestones = allGoals.flatMap((g: any) => g.milestones || []);
        const completedMilestones = allMilestones.filter((m: any) => m.completed).length;

        setData({
          user: null,
          upcomingSessions,
          completedSessionsCount,
          recommendedCoaches: coachesData.coaches || [],
        });

        setProgressFromApi({
          actions: { current: actionItemsCompleted, total: Math.max(actionItemsTotal, 1) },
          goals: { current: completedGoals, total: Math.max(allGoals.length, 1) },
          milestones: { current: completedMilestones, total: Math.max(allMilestones.length, 1) },
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const progressData = {
    sessions: { current: data.completedSessionsCount, total: Math.max(data.completedSessionsCount + data.upcomingSessions.length, 1) },
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
  const suggestedCoaches = data.recommendedCoaches.map(transformCoach);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="px-4 py-6 sm:px-6 lg:px-8 xl:px-10 lg:py-8 max-w-5xl mx-auto xl:mx-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-heading-md text-foreground-default">
              {getGreeting()}!
            </h1>
            <p className="mt-1 text-body text-foreground-muted">
              Here's what's happening with your climate career journey
            </p>

            {/* Quick Actions */}
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/candid/sessions/schedule" className={buttonVariants({ variant: "primary" })}>
                <CalendarBlank size={16} weight="fill" />
                Book Session
              </Link>
              <Link href="/candid/mentors" className={buttonVariants({ variant: "secondary" })}>
                <Users size={16} weight="fill" />
                Find Mentors
              </Link>
            </div>
          </div>

          {/* Getting Started Checklist - for new users */}
          <section className="mb-8">
            <GettingStartedChecklist />
          </section>

          {/* Mobile/Tablet/Small Desktop: Upcoming Sessions Horizontal Scroll */}
          <section className="mb-8 xl:hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-heading-sm text-foreground-default">Upcoming Sessions</h2>
              <Link href="/candid/sessions" className={buttonVariants({ variant: "link", size: "sm" })}>
                View all
                <CaretRight size={14} />
              </Link>
            </div>

            {data.upcomingSessions.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide">
                {data.upcomingSessions.slice(0, 5).map((session) => {
                  const sessionDate = new Date(session.scheduledAt);
                  const isSessionToday = isToday(sessionDate);

                  return (
                    <div
                      key={session.id}
                      className={cn(
                        "flex-shrink-0 w-[260px] snap-start rounded-card border p-4",
                        isSessionToday
                          ? "border-[var(--primitive-green-300)] bg-[var(--primitive-green-50)]"
                          : "border-[var(--border-default)] bg-white"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className={cn(
                          "text-caption font-medium",
                          isSessionToday ? "text-[var(--primitive-green-700)]" : "text-foreground-muted"
                        )}>
                          {formatScheduleDate(sessionDate)}
                        </span>
                        {isSessionToday && (
                          <span className="text-caption-sm text-[var(--primitive-green-600)] bg-[var(--primitive-green-100)] px-1.5 py-0.5 rounded">
                            Today
                          </span>
                        )}
                      </div>
                      <p className="text-caption text-foreground-muted mb-2">
                        {format(sessionDate, "h:mm a")} · {session.duration} min
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                        <Avatar
                          size="sm"
                          src={session.coach.photoUrl || undefined}
                          name={`${session.coach.firstName} ${session.coach.lastName}`}
                          color="green"
                        />
                        <span className="text-body-sm font-medium text-foreground-default">
                          {session.coach.firstName} {session.coach.lastName}
                        </span>
                      </div>
                      {isSessionToday && session.meetingLink ? (
                        <Button variant="primary" size="sm" className="w-full" asChild>
                          <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                            Join Session
                          </a>
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <Link href={`/candid/sessions`}>
                            View Details
                          </Link>
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <Card className="p-6">
                <EmptyState
                  preset="inbox"
                  size="sm"
                  title="No upcoming sessions"
                  description="Book your first session to get started"
                  action={{
                    label: "Book Session",
                    onClick: () => {},
                  }}
                />
              </Card>
            )}
          </section>

          {/* My Progress - Compact, no card */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-heading-sm text-foreground-default">My Progress</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:flex sm:items-center sm:gap-8">
              <div className="text-center">
                <ProgressMeterCircular
                  goal="sessions"
                  size="sm"
                  value={(progressData.sessions.current / progressData.sessions.total) * 100}
                  className="mx-auto"
                />
                <p className="mt-2 text-caption font-medium text-foreground-default">Sessions</p>
                <p className="text-caption-sm text-foreground-muted">{progressData.sessions.current}/{progressData.sessions.total}</p>
              </div>
              <div className="text-center">
                <ProgressMeterCircular
                  goal="actions"
                  size="sm"
                  value={(progressData.actions.current / progressData.actions.total) * 100}
                  className="mx-auto"
                />
                <p className="mt-2 text-caption font-medium text-foreground-default">Actions</p>
                <p className="text-caption-sm text-foreground-muted">{progressData.actions.current}/{progressData.actions.total}</p>
              </div>
              <div className="text-center">
                <ProgressMeterCircular
                  goal="skills"
                  size="sm"
                  value={(progressData.skills.current / progressData.skills.total) * 100}
                  className="mx-auto"
                />
                <p className="mt-2 text-caption font-medium text-foreground-default">Skills</p>
                <p className="text-caption-sm text-foreground-muted">{progressData.skills.current}/{progressData.skills.total}</p>
              </div>
              <div className="text-center">
                <ProgressMeterCircular
                  goal="milestones"
                  size="sm"
                  value={(progressData.milestones.current / progressData.milestones.total) * 100}
                  className="mx-auto"
                />
                <p className="mt-2 text-caption font-medium text-foreground-default">Milestones</p>
                <p className="text-caption-sm text-foreground-muted">{progressData.milestones.current}/{progressData.milestones.total}</p>
              </div>
            </div>
          </section>

          {/* My Coach */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-heading-sm text-foreground-default">My Coach</h2>
            </div>
            <MyCoachCard />
          </section>

          {/* Jobs for You - Green Jobs Board Integration */}
          <section className="mb-8">
            <JobMatchesWidget title="Jobs for You" limit={3} />
          </section>
        </div>
      </div>

      {/* Right Sidebar - Schedule (Large Desktop only) */}
      <aside className="hidden xl:block w-[375px] flex-shrink-0 border-l border-[var(--candid-schedule-border)] bg-white">
        <div className="sticky top-0 h-screen overflow-y-auto">
          {/* Schedule Header */}
          <div className="flex h-[108px] items-center justify-between border-b border-[var(--primitive-neutral-200)] p-6">
            <h2 className="text-heading-sm font-medium text-foreground-default">Your Schedule</h2>
            <button className="flex items-center justify-center rounded-[16px] bg-[var(--primitive-neutral-200)] p-2.5 transition-colors hover:bg-[var(--primitive-neutral-300)]">
              <CalendarDots size={20} weight="regular" />
            </button>
          </div>

          {/* Schedule Content */}
          <div>
            {sessionGroups.map((group) => (
              <div key={group.label} className="border-b border-[var(--primitive-neutral-200)] px-6 py-3">
                {/* Date Header */}
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-body font-normal text-foreground-default">
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
                      const roleLabel = session.coach.headline?.toLowerCase().includes("mentor") ? "Mentor" : "Coach";

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
                              <a href={session.meetingLink || "#"} target="_blank" rel="noopener noreferrer">
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
                            <a href={session.meetingLink || "#"} target="_blank" rel="noopener noreferrer">
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
                    <p className="text-heading-sm font-medium text-foreground-default">
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
