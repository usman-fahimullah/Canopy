"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { isFuture, isPast } from "date-fns";
import { GraduationCap, MagnifyingGlass } from "@phosphor-icons/react";
import { PageHeader } from "@/components/shell/page-header";
import { Spinner } from "@/components/ui/spinner";
import {
  Tabs,
  TabsListUnderline,
  TabsTriggerUnderline,
  TabsContent,
} from "@/components/ui/tabs";
import { SearchInput } from "@/components/ui/search-input";
import { SessionCard } from "./components/session-card";
import { CoachBrowseCard } from "./components/coach-browse-card";

interface CoachInfo {
  id: string;
  name: string;
  avatar: string | null;
  headline?: string;
}

interface Session {
  id: string;
  coachId: string;
  seekerId: string;
  scheduledAt: string;
  duration: number;
  status: "scheduled" | "completed" | "cancelled";
  meetingLink?: string;
  coach: CoachInfo;
  notes?: string;
}

interface Coach {
  id: string;
  name: string;
  avatar: string | null;
  headline: string;
  bio: string;
  specialties: string[];
  hourlyRate: number;
  currency: string;
  rating: number;
  reviewCount: number;
  totalSessions: number;
}

export default function CoachingPage() {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionsRes, coachesRes] = await Promise.all([
          fetch("/api/sessions"),
          fetch("/api/coaches"),
        ]);

        const sessionsData = sessionsRes.ok
          ? await sessionsRes.json()
          : { sessions: [] };
        const coachesData = coachesRes.ok
          ? await coachesRes.json()
          : { coaches: [] };

        setSessions(sessionsData.sessions || []);
        setCoaches(coachesData.coaches || []);
      } catch (error) {
        console.error("Error fetching coaching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const upcomingSessions = useMemo(
    () =>
      sessions.filter(
        (s) =>
          s.status !== "cancelled" && isFuture(new Date(s.scheduledAt))
      ),
    [sessions]
  );

  const pastSessions = useMemo(
    () =>
      sessions.filter(
        (s) =>
          s.status === "completed" || isPast(new Date(s.scheduledAt))
      ),
    [sessions]
  );

  const filteredCoaches = useMemo(() => {
    if (!searchQuery.trim()) return coaches;
    const q = searchQuery.toLowerCase();
    return coaches.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.headline.toLowerCase().includes(q) ||
        c.specialties.some((s) => s.toLowerCase().includes(q))
    );
  }, [coaches, searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Coaching" />

      <div className="px-8 lg:px-12 py-8">
        <Tabs defaultValue="sessions">
          <TabsListUnderline>
            <TabsTriggerUnderline value="sessions">
              My Sessions
            </TabsTriggerUnderline>
            <TabsTriggerUnderline value="find">
              Find a Coach
            </TabsTriggerUnderline>
          </TabsListUnderline>

          {/* My Sessions Tab */}
          <TabsContent value="sessions">
            <div className="mt-6 space-y-8">
              {/* Upcoming sessions */}
              <section>
                <h2 className="text-heading-sm font-medium text-[var(--foreground-default)] mb-4">
                  Upcoming
                </h2>
                {upcomingSessions.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {upcomingSessions.map((session) => (
                      <SessionCard key={session.id} session={session} />
                    ))}
                  </div>
                ) : (
                  <EmptySessionsState />
                )}
              </section>

              {/* Past sessions */}
              {pastSessions.length > 0 && (
                <section>
                  <h2 className="text-heading-sm font-medium text-[var(--foreground-default)] mb-4">
                    Past
                  </h2>
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {pastSessions.map((session) => (
                      <SessionCard key={session.id} session={session} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          </TabsContent>

          {/* Find a Coach Tab */}
          <TabsContent value="find">
            <div className="mt-6 space-y-6">
              {/* Search */}
              <SearchInput
                placeholder="Search by name, specialty, or keyword..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                size="compact"
              />

              {/* Coach grid */}
              {filteredCoaches.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredCoaches.map((coach) => (
                    <CoachBrowseCard key={coach.id} coach={coach} />
                  ))}
                </div>
              ) : (
                <div className="rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white p-12 text-center">
                  <MagnifyingGlass
                    size={48}
                    weight="light"
                    className="mx-auto mb-3 text-[var(--primitive-neutral-400)]"
                  />
                  <p className="text-body font-medium text-[var(--foreground-default)]">
                    No coaches found
                  </p>
                  <p className="mt-1 text-caption text-[var(--foreground-muted)]">
                    Try adjusting your search terms
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function EmptySessionsState() {
  return (
    <div className="rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white p-12 text-center">
      <GraduationCap
        size={48}
        weight="light"
        className="mx-auto mb-3 text-[var(--primitive-neutral-400)]"
      />
      <p className="text-body font-medium text-[var(--foreground-default)]">
        No coaching sessions yet
      </p>
      <p className="mt-1 text-caption text-[var(--foreground-muted)]">
        <Link
          href="#"
          className="text-[var(--foreground-link)] hover:text-[var(--foreground-link-hover)] underline"
          onClick={(e) => {
            e.preventDefault();
            // Switch to the Find a Coach tab
            const trigger = document.querySelector(
              '[data-radix-collection-item][value="find"]'
            ) as HTMLButtonElement | null;
            trigger?.click();
          }}
        >
          Find a coach
        </Link>{" "}
        to get started
      </p>
    </div>
  );
}
