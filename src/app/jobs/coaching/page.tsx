"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { isFuture, isPast } from "date-fns";
import {
  GraduationCap,
  MagnifyingGlass,
  CalendarDots,
  ListBullets,
  SquaresFour,
} from "@phosphor-icons/react";
import { PageHeader } from "@/components/shell/page-header";
import {
  Button,
  EmptyState,
  SearchInput,
  SegmentedController,
  Spinner,
  Tabs,
  TabsListUnderline,
  TabsTriggerUnderline,
  TabsContent,
  Chip,
} from "@/components/ui";
import { CoachCard, SessionCard } from "@/components/coaching";
import type { Coach, Session, Sector, SessionFilterStatus } from "@/lib/coaching";
import { SECTOR_INFO } from "@/lib/coaching";
import { logger, formatError } from "@/lib/logger";

// ---------------------------------------------------------------------------
// Sector filter options
// ---------------------------------------------------------------------------

const SECTOR_OPTIONS = Object.entries(SECTOR_INFO).map(([value, info]) => ({
  value,
  label: info.label,
}));

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function CoachingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);

  // ---- Sessions tab state ----
  const [sessionView, setSessionView] = useState<"list" | "calendar">("list");
  const [sessionFilter, setSessionFilter] = useState<SessionFilterStatus>("all");

  // ---- Browse tab state ----
  const [searchQuery, setSearchQuery] = useState("");
  const [browseView, setBrowseView] = useState<"grid" | "list">("grid");
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [sortBy, setSortBy] = useState<"rating" | "sessions">("rating");

  // ---- Fetch data ----
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionsRes, coachesRes] = await Promise.all([
          fetch("/api/sessions"),
          fetch("/api/coaches"),
        ]);

        const sessionsData = sessionsRes.ok ? await sessionsRes.json() : { sessions: [] };
        const coachesData = coachesRes.ok ? await coachesRes.json() : { coaches: [] };

        setSessions(sessionsData.sessions || []);
        setCoaches(coachesData.coaches || []);
      } catch (error) {
        logger.error("Error fetching coaching data", {
          error: formatError(error),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ---- Session filtering ----
  const upcomingSessions = useMemo(
    () => sessions.filter((s) => s.status !== "cancelled" && isFuture(new Date(s.scheduledAt))),
    [sessions]
  );

  const pastSessions = useMemo(
    () => sessions.filter((s) => s.status === "completed" || isPast(new Date(s.scheduledAt))),
    [sessions]
  );

  const filteredSessions = useMemo(() => {
    const allSessions = [...upcomingSessions, ...pastSessions];
    if (sessionFilter === "all") return allSessions;
    return allSessions.filter((s) => s.status === sessionFilter.toLowerCase());
  }, [upcomingSessions, pastSessions, sessionFilter]);

  // ---- Coach filtering ----
  const filteredCoaches = useMemo(() => {
    let result = coaches;

    // Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((c) => {
        const name = [c.firstName, c.lastName].filter(Boolean).join(" ").toLowerCase();
        const headline = (c.headline ?? "").toLowerCase();
        const expertise = c.expertise?.join(" ").toLowerCase() ?? "";
        return name.includes(q) || headline.includes(q) || expertise.includes(q);
      });
    }

    // Sector filter
    if (selectedSector) {
      result = result.filter((c) => c.sectors?.includes(selectedSector));
    }

    // Sort
    if (sortBy === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else {
      result = [...result].sort((a, b) => (b.totalSessions ?? 0) - (a.totalSessions ?? 0));
    }

    return result;
  }, [coaches, searchQuery, selectedSector, sortBy]);

  // ---- Handlers ----
  const handleViewProfile = useCallback(
    (coach: Coach) => {
      router.push(`/jobs/coaching/book?coach=${coach.id}`);
    },
    [router]
  );

  const handleBookSession = useCallback(() => {
    router.push("/jobs/coaching/book");
  }, [router]);

  const handleJoinSession = useCallback((session: Session) => {
    if (session.meetingLink) {
      window.open(session.meetingLink, "_blank");
    }
  }, []);

  // ---- Loading state ----
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Coaching"
        actions={
          <Button variant="primary" onClick={handleBookSession}>
            Book a Session
          </Button>
        }
      />

      <div className="px-4 py-8 sm:px-6 lg:px-12">
        <Tabs defaultValue="sessions">
          <TabsListUnderline>
            <TabsTriggerUnderline value="sessions">My Sessions</TabsTriggerUnderline>
            <TabsTriggerUnderline value="browse">Browse Coaches</TabsTriggerUnderline>
          </TabsListUnderline>

          {/* ================================================================
              TAB: My Sessions
              ================================================================ */}
          <TabsContent value="sessions">
            <div className="mt-6 space-y-6">
              {/* Controls: View toggle + Status filter */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <SegmentedController
                  options={[
                    { value: "all", label: "All" },
                    { value: "SCHEDULED", label: "Scheduled" },
                    { value: "COMPLETED", label: "Completed" },
                    { value: "CANCELLED", label: "Cancelled" },
                  ]}
                  value={sessionFilter}
                  onValueChange={(val) => setSessionFilter(val as SessionFilterStatus)}
                />

                <SegmentedController
                  options={[
                    {
                      value: "list",
                      label: "List",
                      icon: <ListBullets size={16} />,
                    },
                    {
                      value: "calendar",
                      label: "Calendar",
                      icon: <CalendarDots size={16} />,
                    },
                  ]}
                  value={sessionView}
                  onValueChange={(val) => setSessionView(val as "list" | "calendar")}
                />
              </div>

              {/* Session list view */}
              {sessionView === "list" && (
                <div className="space-y-8">
                  {/* Upcoming */}
                  {sessionFilter === "all" && upcomingSessions.length > 0 && (
                    <section>
                      <h2 className="mb-4 text-body-strong font-semibold text-[var(--foreground-default)]">
                        Upcoming
                      </h2>
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {upcomingSessions.map((session) => (
                          <SessionCard
                            key={session.id}
                            session={session}
                            userRole="seeker"
                            onJoin={handleJoinSession}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Past */}
                  {sessionFilter === "all" && pastSessions.length > 0 && (
                    <section>
                      <h2 className="mb-4 text-body-strong font-semibold text-[var(--foreground-default)]">
                        Past
                      </h2>
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {pastSessions.map((session) => (
                          <SessionCard key={session.id} session={session} userRole="seeker" />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Filtered view */}
                  {sessionFilter !== "all" && (
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      {filteredSessions.length > 0 ? (
                        filteredSessions.map((session) => (
                          <SessionCard
                            key={session.id}
                            session={session}
                            userRole="seeker"
                            onJoin={handleJoinSession}
                          />
                        ))
                      ) : (
                        <div className="col-span-full">
                          <EmptyState
                            icon={
                              <CalendarDots
                                size={48}
                                weight="light"
                                className="text-[var(--foreground-disabled)]"
                              />
                            }
                            title="No sessions found"
                            description="No sessions match the selected filter."
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Overall empty state */}
                  {sessions.length === 0 && (
                    <EmptyState
                      icon={
                        <GraduationCap
                          size={48}
                          weight="light"
                          className="text-[var(--foreground-disabled)]"
                        />
                      }
                      title="No coaching sessions yet"
                      description="Book your first session with a career coach to get started."
                      action={{
                        label: "Find a Coach",
                        onClick: handleBookSession,
                      }}
                    />
                  )}
                </div>
              )}

              {/* Calendar view placeholder */}
              {sessionView === "calendar" && (
                <EmptyState
                  icon={
                    <CalendarDots
                      size={48}
                      weight="light"
                      className="text-[var(--foreground-disabled)]"
                    />
                  }
                  title="Calendar view coming soon"
                  description="View your sessions in a calendar format. This feature is under development."
                />
              )}
            </div>
          </TabsContent>

          {/* ================================================================
              TAB: Browse Coaches
              ================================================================ */}
          <TabsContent value="browse">
            <div className="mt-6 space-y-6">
              {/* Controls Row */}
              <div className="flex flex-wrap items-center gap-4">
                <SearchInput
                  placeholder="Search by name, expertise, or company…"
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  size="compact"
                  className="min-w-[250px] flex-1"
                />

                <SegmentedController
                  options={[
                    {
                      value: "grid",
                      label: "Grid",
                      icon: <SquaresFour size={16} />,
                    },
                    {
                      value: "list",
                      label: "List",
                      icon: <ListBullets size={16} />,
                    },
                  ]}
                  value={browseView}
                  onValueChange={(val) => setBrowseView(val as "grid" | "list")}
                />

                <SegmentedController
                  options={[
                    { value: "rating", label: "Highest Rated" },
                    { value: "sessions", label: "Most Sessions" },
                  ]}
                  value={sortBy}
                  onValueChange={(val) => setSortBy(val as "rating" | "sessions")}
                />
              </div>

              {/* Sector Filters */}
              <div className="flex flex-wrap gap-2">
                <Chip
                  variant="neutral"
                  size="sm"
                  selected={selectedSector === null}
                  clickable
                  onClick={() => setSelectedSector(null)}
                >
                  All Sectors
                </Chip>
                {SECTOR_OPTIONS.map((sector) => (
                  <Chip
                    key={sector.value}
                    variant="neutral"
                    size="sm"
                    selected={selectedSector === sector.value}
                    clickable
                    onClick={() =>
                      setSelectedSector(
                        selectedSector === sector.value ? null : (sector.value as Sector)
                      )
                    }
                  >
                    {sector.label}
                  </Chip>
                ))}
              </div>

              {/* Coach Cards */}
              {filteredCoaches.length > 0 ? (
                <div
                  className={
                    browseView === "grid"
                      ? "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                      : "space-y-4"
                  }
                >
                  {filteredCoaches.map((coach) => (
                    <CoachCard
                      key={coach.id}
                      coach={coach}
                      variant={browseView}
                      onViewProfile={handleViewProfile}
                      onClick={handleViewProfile}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={
                    <MagnifyingGlass
                      size={48}
                      weight="light"
                      className="text-[var(--foreground-disabled)]"
                    />
                  }
                  title="No coaches found"
                  description={
                    searchQuery
                      ? "Try adjusting your search terms or sector filter."
                      : "No coaches are available at the moment."
                  }
                />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
