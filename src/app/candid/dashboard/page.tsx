"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { CoachCard } from "../components";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { ProgressMeterCircular } from "@/components/ui/progress-meter";
import {
  currentUser,
  coaches,
  getSessionsForUser,
  getUserById,
} from "@/lib/candid";
import {
  CalendarBlank,
  ChatCircle,
  CaretRight,
  MagnifyingGlass,
  VideoCamera,
  Clock,
} from "@phosphor-icons/react";
import { format, isToday, isTomorrow, isSameDay } from "date-fns";

export default function DashboardPage() {
  const sessions = getSessionsForUser(currentUser.id);
  const upcomingSessions = sessions
    .filter((s) => s.status === "scheduled" && s.scheduledAt > new Date())
    .sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime());
  const completedSessions = sessions.filter((s) => s.status === "completed");

  const matchedCoach = currentUser.matchedCoachId
    ? getUserById(currentUser.matchedCoachId)
    : null;

  // Suggested coaches - get more for horizontal scroll
  const suggestedCoaches = coaches
    .filter((c) => c.id !== currentUser.matchedCoachId)
    .filter((c) => c.sectors.some((s) => currentUser.targetSectors.includes(s)))
    .slice(0, 6);

  // Mock progress data
  const progressData = {
    sessions: { current: completedSessions.length, total: 8 },
    actions: { current: 2, total: 5 },
    skills: { current: 1, total: 4 },
    milestones: { current: 0, total: 3 },
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

  // Group sessions by date for schedule
  const groupSessionsByDate = () => {
    const groups: { label: string; date: Date; sessions: typeof upcomingSessions }[] = [];

    upcomingSessions.forEach((session) => {
      const sessionDate = new Date(session.scheduledAt);
      sessionDate.setHours(0, 0, 0, 0);

      const label = formatScheduleDate(sessionDate);

      const existingGroup = groups.find((g) => isSameDay(g.date, sessionDate));
      if (existingGroup) {
        existingGroup.sessions.push(session);
      } else {
        groups.push({ label, date: sessionDate, sessions: [session] });
      }
    });

    return groups;
  };

  const sessionGroups = groupSessionsByDate();
  const nextSession = upcomingSessions[0];
  const nextSessionCoach = nextSession ? getUserById(nextSession.mentorId) : null;

  return (
    <div className="flex min-h-screen">
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="px-4 py-6 sm:px-6 lg:px-8 xl:px-10 lg:py-8 max-w-5xl mx-auto xl:mx-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-heading-md text-foreground-default">
              {getGreeting()}, {currentUser.firstName}
            </h1>
            <p className="mt-1 text-body text-foreground-muted">
              Here's what's happening with your climate career journey
            </p>

            {/* Quick Actions */}
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/candid/browse" className={buttonVariants({ variant: "primary" })}>
                <MagnifyingGlass size={16} weight="fill" />
                Find a Coach
              </Link>
              <Link href="/candid/sessions" className={buttonVariants({ variant: "secondary" })}>
                <CalendarBlank size={16} weight="fill" />
                My Sessions
              </Link>
            </div>
          </div>

          {/* Mobile/Tablet/Small Desktop: Upcoming Sessions Horizontal Scroll */}
          <section className="mb-8 xl:hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-heading-sm text-foreground-default">Upcoming Sessions</h2>
              <Link href="/candid/sessions" className={buttonVariants({ variant: "link", size: "sm" })}>
                View all
                <CaretRight size={14} />
              </Link>
            </div>

            {upcomingSessions.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide">
                {upcomingSessions.slice(0, 5).map((session) => {
                  const coach = getUserById(session.mentorId);
                  if (!coach) return null;
                  const isSessionToday = isToday(session.scheduledAt);

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
                          {formatScheduleDate(session.scheduledAt)}
                        </span>
                        {isSessionToday && (
                          <span className="text-caption-sm text-[var(--primitive-green-600)] bg-[var(--primitive-green-100)] px-1.5 py-0.5 rounded">
                            Today
                          </span>
                        )}
                      </div>
                      <p className="text-caption text-foreground-muted mb-2">
                        {format(session.scheduledAt, "h:mm a")} · {session.duration} min
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                        <Avatar
                          size="sm"
                          src={coach.avatar}
                          name={`${coach.firstName} ${coach.lastName}`}
                          color="green"
                        />
                        <span className="text-body-sm font-medium text-foreground-default">
                          {coach.firstName} {coach.lastName}
                        </span>
                      </div>
                      <Button variant={isSessionToday ? "primary" : "outline"} size="sm" className="w-full">
                        {isSessionToday ? "Join Session" : "View Details"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-card border border-[var(--border-default)] bg-white p-6 text-center">
                <CalendarBlank size={32} className="mx-auto mb-2 text-foreground-muted" />
                <p className="text-body-sm text-foreground-muted">No upcoming sessions</p>
                <Button variant="primary" size="sm" className="mt-3">
                  Schedule Session
                </Button>
              </div>
            )}
          </section>

          {/* My Coach Card */}
          {matchedCoach && (
            <section className="mb-8">
              <h2 className="text-heading-sm text-foreground-default mb-4">My Coach</h2>
              <div className="rounded-card bg-[var(--primitive-blue-200)] p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <Avatar
                    size="lg"
                    src={matchedCoach.avatar}
                    name={`${matchedCoach.firstName} ${matchedCoach.lastName}`}
                    color="green"
                    className="ring-2 ring-white"
                  />
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/candid/profile/${matchedCoach.id}`}
                      className="text-body-strong text-foreground-default hover:text-[var(--primitive-green-800)] transition-colors"
                    >
                      {matchedCoach.firstName} {matchedCoach.lastName}
                    </Link>
                    <p className="text-caption text-foreground-muted mt-0.5">
                      {(matchedCoach as any).currentRole}
                    </p>
                    <p className="text-caption text-[var(--primitive-green-800)] mt-1">
                      {completedSessions.length} sessions together
                      {(matchedCoach as any).rating && ` · ⭐ ${(matchedCoach as any).rating?.toFixed(1)}`}
                    </p>
                  </div>
                  <div className="flex gap-2 sm:flex-col">
                    <Link
                      href={`/candid/messages?user=${matchedCoach.id}`}
                      className={buttonVariants({ variant: "secondary", size: "sm" })}
                    >
                      <ChatCircle size={16} />
                      <span className="sm:hidden">Message</span>
                    </Link>
                    <Link
                      href={`/candid/sessions/schedule?mentor=${matchedCoach.id}`}
                      className={buttonVariants({ variant: "primary", size: "sm" })}
                    >
                      <CalendarBlank size={16} />
                      <span className="sm:hidden">Schedule</span>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* My Progress - Compact, no card */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-heading-sm text-foreground-default">My Progress</h2>
              <Link
                href="/candid/progress"
                className={buttonVariants({ variant: "link", size: "sm" })}
              >
                View all
                <CaretRight size={14} />
              </Link>
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

          {/* Recommended Coaches - Horizontal scroll on mobile, grid on larger */}
          {suggestedCoaches.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-heading-sm text-foreground-default">Recommended Coaches</h2>
                <Link href="/candid/browse" className={buttonVariants({ variant: "link" })}>
                  Browse all
                  <CaretRight size={14} />
                </Link>
              </div>

              {/* Mobile: Horizontal scroll */}
              <div className="sm:hidden flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide">
                {suggestedCoaches.map((coach) => (
                  <div key={coach.id} className="flex-shrink-0 w-[280px] snap-start">
                    <CoachCard mentor={coach} variant="compact" />
                  </div>
                ))}
              </div>

              {/* Tablet+: Grid */}
              <div className="hidden sm:grid gap-4 grid-cols-2">
                {suggestedCoaches.slice(0, 4).map((coach) => (
                  <CoachCard key={coach.id} mentor={coach} variant="compact" />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Right Sidebar - Schedule (Large Desktop only) */}
      <aside className="hidden xl:block w-[320px] flex-shrink-0 border-l border-[var(--border-default)] bg-white">
        <div className="sticky top-0 h-screen overflow-y-auto">
          {/* Schedule Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-default)]">
            <h2 className="text-heading-sm text-foreground-default">Your Schedule</h2>
            <Button variant="outline" size="sm">Today</Button>
          </div>

          {/* Schedule Content */}
          <div className="p-5">
            {sessionGroups.length > 0 ? (
              <div className="space-y-6">
                {sessionGroups.map((group) => {
                  const isGroupToday = group.label === "Today";

                  return (
                    <div key={group.label}>
                      {/* Date Header */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className={cn(
                          "text-body-strong",
                          isGroupToday ? "text-[var(--primitive-green-700)]" : "text-foreground-default"
                        )}>
                          {group.label}
                        </span>
                        {isGroupToday && (
                          <span className="text-caption text-foreground-muted">
                            {format(new Date(), "MMM d")}
                          </span>
                        )}
                      </div>

                      {/* Sessions for this date */}
                      <div className="space-y-3">
                        {group.sessions.map((session) => {
                          const coach = getUserById(session.mentorId);
                          if (!coach) return null;

                          return (
                            <div
                              key={session.id}
                              className={cn(
                                "rounded-lg border p-4",
                                isGroupToday
                                  ? "border-[var(--primitive-green-300)] bg-[var(--primitive-green-50)]"
                                  : "border-[var(--border-default)] bg-white"
                              )}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-caption text-foreground-muted">
                                  {format(session.scheduledAt, "h:mm a")} - {format(
                                    new Date(session.scheduledAt.getTime() + session.duration * 60000),
                                    "h:mm a"
                                  )}
                                </span>
                              </div>
                              <p className="text-body-strong text-foreground-default mb-3">
                                {coach.firstName} {coach.lastName}
                              </p>
                              <Button
                                variant={isGroupToday ? "primary" : "outline"}
                                size="sm"
                                className="w-full"
                              >
                                {isGroupToday ? "Join Session" : "View Details"}
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-8">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primitive-blue-100)]">
                  <CalendarBlank size={32} className="text-[var(--primitive-green-700)]" />
                </div>
                <h3 className="text-body-strong text-foreground-default mb-1">
                  No upcoming sessions
                </h3>
                <p className="text-caption text-foreground-muted mb-4">
                  Schedule time with your coach to continue your journey
                </p>
                <Button variant="primary" size="sm">
                  Schedule Session
                </Button>
              </div>
            )}

            {/* View All Sessions Link */}
            {upcomingSessions.length > 0 && (
              <Link
                href="/candid/sessions"
                className={cn(buttonVariants({ variant: "link" }), "w-full justify-center mt-6")}
              >
                View All Sessions
                <CaretRight size={14} />
              </Link>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
