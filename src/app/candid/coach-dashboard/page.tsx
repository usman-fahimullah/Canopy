"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Chip } from "@/components/ui/chip";
import {
  CalendarBlank,
  CaretRight,
  CurrencyDollar,
  Users,
  Star,
  Clock,
  VideoCamera,
  TrendUp,
  Spinner,
  Gear,
} from "@phosphor-icons/react";
import { format, isToday, isTomorrow, isSameDay } from "date-fns";

interface Session {
  id: string;
  scheduledAt: string;
  duration: number;
  status: string;
  meetingLink: string | null;
  mentee: {
    id: string;
    name: string;
  };
}

interface CoachDashboardData {
  profile: {
    id: string;
    firstName: string;
    lastName: string;
    photoUrl: string | null;
    status: string;
    rating: number | null;
    reviewCount: number;
    totalSessions: number;
    totalEarnings: number;
    sessionRate: number;
  } | null;
  upcomingSessions: Session[];
  recentReviews: {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    mentee?: { name: string };
  }[];
  monthlyStats: {
    sessions: number;
    earnings: number;
    newMentees: number;
  };
}

export default function CoachDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CoachDashboardData>({
    profile: null,
    upcomingSessions: [],
    recentReviews: [],
    monthlyStats: {
      sessions: 0,
      earnings: 0,
      newMentees: 0,
    },
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch coach sessions, earnings, profile, and reviews in parallel
        const [sessionsRes, earningsRes, profileRes] = await Promise.all([
          fetch("/api/sessions?role=coach"),
          fetch("/api/candid/coach/earnings"),
          fetch("/api/profile"),
        ]);

        const sessionsData = sessionsRes.ok ? await sessionsRes.json() : { sessions: [] };
        const earningsData = earningsRes.ok ? await earningsRes.json() : {};
        const profileData = profileRes.ok ? await profileRes.json() : {};

        const allSessions = sessionsData.sessions || [];
        const upcomingSessions = allSessions
          .filter((s: Session) => s.status === "SCHEDULED" && new Date(s.scheduledAt) > new Date())
          .sort(
            (a: Session, b: Session) =>
              new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
          );

        // Get this month's earnings from breakdown
        const currentMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
        const monthBreakdown = (earningsData.monthlyBreakdown || []).find(
          (m: { month: string }) => m.month === currentMonth
        );

        // Get recent reviews if coach profile exists
        let recentReviews: CoachDashboardData["recentReviews"] = [];
        if (profileData.account?.coachProfile?.id) {
          const reviewsRes = await fetch(
            `/api/reviews?coachId=${profileData.account.coachProfile.id}`
          );
          if (reviewsRes.ok) {
            const reviewsData = await reviewsRes.json();
            recentReviews = (reviewsData.reviews || []).slice(0, 5);
          }
        }

        setData({
          profile: profileData.account?.coachProfile || null,
          upcomingSessions,
          recentReviews,
          monthlyStats: {
            sessions: monthBreakdown?.sessions || 0,
            earnings: monthBreakdown?.earnings || 0,
            newMentees: 0,
          },
        });
      } catch (error) {
        console.error("Error fetching coach dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

  // Group sessions by date
  const groupSessionsByDate = () => {
    const groups: { label: string; date: Date; sessions: Session[] }[] = [];

    data.upcomingSessions.forEach((session) => {
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size={32} className="animate-spin text-[var(--primitive-green-600)]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 pb-24 sm:px-6 md:pb-8 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground-default text-heading-md">{getGreeting()}, Coach!</h1>
          <p className="mt-1 text-body text-foreground-muted">
            Here&apos;s an overview of your coaching activity
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/candid/settings/payments"
            className={buttonVariants({ variant: "secondary" })}
          >
            <Gear size={16} />
            Settings
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-card bg-white p-5 shadow-card">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primitive-green-100)]">
              <CalendarBlank size={20} className="text-[var(--primitive-green-700)]" />
            </div>
          </div>
          <p className="text-foreground-default text-heading-sm font-bold">
            {data.profile?.totalSessions || 0}
          </p>
          <p className="text-caption text-foreground-muted">Total Sessions</p>
        </div>

        <div className="rounded-card bg-white p-5 shadow-card">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primitive-yellow-100)]">
              <Star size={20} className="text-[var(--primitive-yellow-600)]" />
            </div>
          </div>
          <p className="text-foreground-default text-heading-sm font-bold">
            {data.profile?.rating?.toFixed(1) || "N/A"}
          </p>
          <p className="text-caption text-foreground-muted">
            Rating ({data.profile?.reviewCount || 0} reviews)
          </p>
        </div>

        <div className="rounded-card bg-white p-5 shadow-card">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primitive-blue-100)]">
              <TrendUp size={20} className="text-[var(--primitive-blue-600)]" />
            </div>
          </div>
          <p className="text-foreground-default text-heading-sm font-bold">
            {data.monthlyStats.sessions}
          </p>
          <p className="text-caption text-foreground-muted">Sessions This Month</p>
        </div>

        <div className="rounded-card bg-white p-5 shadow-card">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primitive-green-100)]">
              <CurrencyDollar size={20} className="text-[var(--primitive-green-700)]" />
            </div>
          </div>
          <p className="text-foreground-default text-heading-sm font-bold">
            ${((data.profile?.totalEarnings || 0) / 100).toLocaleString()}
          </p>
          <p className="text-caption text-foreground-muted">Total Earnings</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Upcoming Sessions */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-foreground-default text-heading-sm font-semibold">
              Upcoming Sessions
            </h2>
            <Link
              href="/candid/sessions"
              className={buttonVariants({ variant: "link", size: "sm" })}
            >
              View all
              <CaretRight size={14} />
            </Link>
          </div>

          {sessionGroups.length > 0 ? (
            <div className="space-y-6">
              {sessionGroups.map((group) => {
                const isGroupToday = group.label === "Today";

                return (
                  <div key={group.label}>
                    {/* Date Header */}
                    <div className="mb-3 flex items-center gap-2">
                      <span
                        className={cn(
                          "text-body-strong font-semibold",
                          isGroupToday
                            ? "text-[var(--primitive-green-700)]"
                            : "text-foreground-default"
                        )}
                      >
                        {group.label}
                      </span>
                      {isGroupToday && (
                        <Chip variant="primary" size="sm">
                          Today
                        </Chip>
                      )}
                    </div>

                    {/* Sessions */}
                    <div className="space-y-3">
                      {group.sessions.map((session) => {
                        const sessionDate = new Date(session.scheduledAt);
                        const endTime = new Date(sessionDate.getTime() + session.duration * 60000);

                        return (
                          <div
                            key={session.id}
                            className={cn(
                              "rounded-card bg-white p-5 shadow-card",
                              isGroupToday && "ring-2 ring-[var(--primitive-green-200)]"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div>
                                  <p className="mb-1 text-caption text-foreground-muted">
                                    {format(sessionDate, "h:mm a")} - {format(endTime, "h:mm a")}
                                  </p>
                                  <p className="text-foreground-default text-body-strong font-medium">
                                    Session with {session.mentee.name}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {isGroupToday && session.meetingLink && (
                                  <Button variant="primary" size="sm" asChild>
                                    <a
                                      href={session.meetingLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <VideoCamera size={16} className="mr-1" />
                                      Join
                                    </a>
                                  </Button>
                                )}
                                {!isGroupToday && (
                                  <Chip variant="blue" size="sm">
                                    {format(sessionDate, "MMM d")}
                                  </Chip>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-card bg-white p-8 text-center shadow-card">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primitive-blue-100)]">
                <CalendarBlank size={32} className="text-[var(--primitive-green-700)]" />
              </div>
              <h3 className="text-foreground-default mb-1 text-body-strong font-semibold">
                No upcoming sessions
              </h3>
              <p className="text-caption text-foreground-muted">
                Your schedule is clear. New bookings will appear here.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Status */}
          {data.profile && (
            <div className="rounded-card bg-white p-5 shadow-card">
              <h3 className="text-foreground-default mb-4 text-body-strong font-semibold">
                Profile Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-caption text-foreground-muted">Status</span>
                  <Chip variant={data.profile.status === "ACTIVE" ? "primary" : "yellow"} size="sm">
                    {data.profile.status}
                  </Chip>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-caption text-foreground-muted">Session Rate</span>
                  <span className="text-foreground-default text-body font-medium">
                    ${(data.profile.sessionRate / 100).toFixed(0)}/session
                  </span>
                </div>
                <Link
                  href={`/candid/coach/${data.profile.id}`}
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "sm" }),
                    "mt-2 w-full"
                  )}
                >
                  View Public Profile
                </Link>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="rounded-card bg-white p-5 shadow-card">
            <h3 className="text-foreground-default mb-4 text-body-strong font-semibold">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Link
                href="/candid/settings/availability"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "w-full justify-start"
                )}
              >
                <Clock size={16} className="mr-2" />
                Update Availability
              </Link>
              <Link
                href="/candid/settings/payments"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "w-full justify-start"
                )}
              >
                <CurrencyDollar size={16} className="mr-2" />
                Payment Settings
              </Link>
            </div>
          </div>

          {/* Recent Reviews Preview */}
          <div className="rounded-card bg-white p-5 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-foreground-default text-body-strong font-semibold">
                Recent Reviews
              </h3>
              <Link
                href="/candid/reviews"
                className={buttonVariants({ variant: "link", size: "sm" })}
              >
                View all
              </Link>
            </div>
            {data.recentReviews.length > 0 ? (
              <div className="space-y-3">
                {data.recentReviews.slice(0, 3).map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-[var(--border-default)] pb-3 last:border-0 last:pb-0"
                  >
                    <div className="mb-1 flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={12}
                          weight={star <= review.rating ? "fill" : "regular"}
                          className={
                            star <= review.rating
                              ? "text-[#F59E0B]"
                              : "text-[var(--primitive-neutral-300)]"
                          }
                        />
                      ))}
                    </div>
                    <p className="text-foreground-default line-clamp-2 text-caption">
                      {review.comment || "No comment"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-caption text-foreground-muted">No reviews yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
