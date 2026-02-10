"use client";

import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Handshake,
  MagnifyingGlass,
  ChatCircleDots,
  UserCirclePlus,
  Users,
} from "@phosphor-icons/react";
import { PageHeader } from "@/components/shell/page-header";
import {
  Button,
  Spinner,
  Badge,
  Avatar,
  Card,
  CardContent,
  SearchInput,
  SegmentedController,
  EmptyState,
  Chip,
  TruncateText,
} from "@/components/ui";
import { Tabs, TabsListUnderline, TabsTriggerUnderline, TabsContent } from "@/components/ui/tabs";
import { MentorListItem, MentorDetailPanel } from "@/components/coaching";
import type {
  Mentor,
  MentorFilterType,
  MyMentorData,
  MyMenteeData,
  MentorshipStatus,
} from "@/lib/coaching";
import { logger, formatError } from "@/lib/logger";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "recommended", label: "Recommended" },
  { value: "available", label: "Available" },
] as const;

const STATUS_BADGE_MAP: Record<
  MentorshipStatus,
  { label: string; variant: "success" | "warning" | "neutral" | "info" }
> = {
  ACTIVE: { label: "Active", variant: "success" },
  PENDING: { label: "Pending", variant: "warning" },
  PAUSED: { label: "Paused", variant: "info" },
  COMPLETED: { label: "Completed", variant: "neutral" },
};

// ---------------------------------------------------------------------------
// Inner Content (needs Suspense for useSearchParams)
// ---------------------------------------------------------------------------

function MentoringContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") ?? "find";

  // ---- State ----
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [mentorsLoading, setMentorsLoading] = useState(true);
  const [myMentors, setMyMentors] = useState<MyMentorData[]>([]);
  const [myMentees, setMyMentees] = useState<MyMenteeData[]>([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<MentorFilterType>("all");
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(
    searchParams.get("mentor")
  );

  // ---- Fetch mentors for browse ----
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (filter !== "all") params.set("filter", filter);

        const url = `/api/mentors${params.toString() ? `?${params.toString()}` : ""}`;
        const res = await fetch(url);

        if (res.ok) {
          const data = await res.json();
          setMentors(data.mentors ?? []);
        } else {
          setMentors([]);
        }
      } catch (err) {
        logger.error("Error fetching mentors", {
          error: formatError(err),
        });
        setMentors([]);
      } finally {
        setMentorsLoading(false);
      }
    };

    fetchMentors();
  }, [search, filter]);

  // ---- Fetch my mentors & mentees ----
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const [mentorsRes, menteesRes] = await Promise.all([
          fetch("/api/mentor-assignments/mine"),
          fetch("/api/mentor-assignments/mentees"),
        ]);

        if (mentorsRes.ok) {
          const data = await mentorsRes.json();
          setMyMentors(data.assignments ?? []);
        }

        if (menteesRes.ok) {
          const data = await menteesRes.json();
          setMyMentees(data.mentees ?? []);
        }
      } catch (err) {
        logger.error("Error fetching assignments", {
          error: formatError(err),
        });
      } finally {
        setAssignmentsLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  // ---- Client-side filtering ----
  const filteredMentors = useMemo(() => {
    let result = mentors;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.role.toLowerCase().includes(q) ||
          (m.company ?? "").toLowerCase().includes(q) ||
          (m.specialties ?? []).some((s) => s.toLowerCase().includes(q))
      );
    }

    if (filter === "recommended") {
      result = result.filter((m) => (m.matchScore ?? 0) >= 70);
    }

    return result;
  }, [mentors, search, filter]);

  // ---- Selected mentor for detail panel ----
  const selectedMentor = useMemo(
    () => filteredMentors.find((m) => m.id === selectedMentorId) ?? null,
    [filteredMentors, selectedMentorId]
  );

  const selectMentor = useCallback(
    (mentor: Mentor) => {
      setSelectedMentorId(mentor.id);
      const params = new URLSearchParams(searchParams.toString());
      params.set("mentor", mentor.id);
      router.push(`/jobs/mentoring?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const clearSelection = useCallback(() => {
    setSelectedMentorId(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("mentor");
    router.push(`/jobs/mentoring?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const handleConnect = useCallback((mentor: Mentor) => {
    // Navigate to messages or trigger intro request
    logger.info("Mentor connect requested", { mentorId: mentor.id });
  }, []);

  const handleMessage = useCallback(
    (mentorAccountId: string) => {
      router.push(`/jobs/messages?contact=${mentorAccountId}`);
    },
    [router]
  );

  // ---- Render ----
  return (
    <div>
      <PageHeader title="Mentoring" />

      <div className="px-8 py-8 lg:px-12">
        <Tabs defaultValue={initialTab}>
          <TabsListUnderline>
            <TabsTriggerUnderline value="find">Find Mentors</TabsTriggerUnderline>
            <TabsTriggerUnderline value="my-mentors">
              My Mentors
              {myMentors.length > 0 && (
                <Badge variant="neutral" size="sm" className="ml-2">
                  {myMentors.length}
                </Badge>
              )}
            </TabsTriggerUnderline>
            <TabsTriggerUnderline value="my-mentees">
              My Mentees
              {myMentees.length > 0 && (
                <Badge variant="neutral" size="sm" className="ml-2">
                  {myMentees.length}
                </Badge>
              )}
            </TabsTriggerUnderline>
          </TabsListUnderline>

          {/* ============================================================= */}
          {/* Find Mentors Tab                                               */}
          {/* ============================================================= */}
          <TabsContent value="find">
            <div className="mt-6 flex h-[calc(100vh-260px)] min-h-[400px]">
              {/* Left panel: search + list */}
              <div
                className={`flex w-full flex-col border-[var(--border-muted)] lg:w-[400px] lg:shrink-0 lg:border-r ${
                  selectedMentor ? "hidden lg:flex" : "flex"
                }`}
              >
                {/* Search */}
                <div className="px-2 pb-3">
                  <SearchInput
                    placeholder="Search mentors..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    size="compact"
                  />
                </div>

                {/* Filter pills */}
                <div className="px-2 pb-3">
                  <SegmentedController
                    options={FILTER_OPTIONS.map((f) => ({
                      value: f.value,
                      label: f.label,
                    }))}
                    value={filter}
                    onValueChange={(v) => setFilter(v as MentorFilterType)}
                    fullWidth
                  />
                </div>

                {/* Scrollable list */}
                <div className="flex-1 overflow-y-auto px-1 pb-4">
                  {mentorsLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <Spinner size="md" />
                    </div>
                  ) : filteredMentors.length > 0 ? (
                    <div className="space-y-1">
                      {filteredMentors.map((mentor) => (
                        <MentorListItem
                          key={mentor.id}
                          mentor={mentor}
                          selected={mentor.id === selectedMentorId}
                          onClick={selectMentor}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-12">
                      <EmptyState
                        icon={<MagnifyingGlass size={40} weight="light" />}
                        title="No mentors found"
                        description="Try adjusting your search or filters"
                        size="sm"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Right panel: detail */}
              <div className={`flex-1 ${selectedMentor ? "flex" : "hidden lg:flex"}`}>
                {selectedMentor ? (
                  <MentorDetailPanel
                    mentor={selectedMentor}
                    onConnect={handleConnect}
                    onBack={clearSelection}
                    showBack
                    className="w-full"
                  />
                ) : (
                  <div className="flex flex-1 items-center justify-center">
                    <EmptyState
                      icon={<UserCirclePlus size={48} weight="light" />}
                      title="Select a mentor"
                      description="Choose a mentor from the list to view their profile"
                      size="sm"
                    />
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* ============================================================= */}
          {/* My Mentors Tab                                                 */}
          {/* ============================================================= */}
          <TabsContent value="my-mentors">
            <div className="mt-6">
              {assignmentsLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Spinner size="lg" />
                </div>
              ) : myMentors.length > 0 ? (
                <div className="space-y-3">
                  {myMentors.map((assignment) => (
                    <MentorAssignmentCard
                      key={assignment.id}
                      assignment={assignment}
                      onMessage={() => handleMessage(assignment.accountId)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Handshake size={48} weight="light" />}
                  title="No mentors yet"
                  description="Find a mentor to guide your climate career journey."
                  action={{
                    label: "Find Mentors",
                    onClick: () => router.push("/jobs/mentoring?tab=find"),
                  }}
                />
              )}
            </div>
          </TabsContent>

          {/* ============================================================= */}
          {/* My Mentees Tab                                                 */}
          {/* ============================================================= */}
          <TabsContent value="my-mentees">
            <div className="mt-6">
              {assignmentsLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Spinner size="lg" />
                </div>
              ) : myMentees.length > 0 ? (
                <div className="space-y-3">
                  {myMentees.map((mentee) => (
                    <MenteeCard
                      key={mentee.id}
                      mentee={mentee}
                      onMessage={() => handleMessage(mentee.accountId)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Users size={48} weight="light" />}
                  title="No mentees yet"
                  description="When someone requests you as a mentor, they'll appear here."
                />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mentor Assignment Card (My Mentors tab)
// ---------------------------------------------------------------------------

function MentorAssignmentCard({
  assignment,
  onMessage,
}: {
  assignment: MyMentorData;
  onMessage: () => void;
}) {
  const status = STATUS_BADGE_MAP[assignment.status] ?? {
    label: assignment.status,
    variant: "neutral" as const,
  };

  const specialties = assignment.specialties ?? [];

  return (
    <Card>
      <CardContent className="flex items-start gap-4 p-4">
        <Avatar
          size="default"
          src={assignment.avatar ?? undefined}
          fallback={assignment.name.charAt(0)}
          className="shrink-0"
        />

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <TruncateText className="text-body-sm font-semibold text-[var(--foreground-default)]">
              {assignment.name}
            </TruncateText>
            <Badge variant={status.variant} size="sm">
              {status.label}
            </Badge>
          </div>

          {assignment.headline && (
            <TruncateText className="mb-2 text-caption text-[var(--foreground-muted)]">
              {assignment.headline}
            </TruncateText>
          )}

          {!assignment.headline && assignment.role && (
            <TruncateText className="mb-2 text-caption text-[var(--foreground-muted)]">
              {`${assignment.role}${assignment.specialty ? ` \u00B7 ${assignment.specialty}` : ""}`}
            </TruncateText>
          )}

          {specialties.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {specialties.map((s) => (
                <Chip key={s} variant="neutral" size="sm">
                  {s}
                </Chip>
              ))}
            </div>
          )}

          {assignment.status === "ACTIVE" && (
            <Button variant="tertiary" size="sm" onClick={onMessage}>
              <ChatCircleDots size={16} className="mr-1" />
              Message
            </Button>
          )}
        </div>

        <div className="flex flex-col items-end gap-1 text-caption text-[var(--foreground-subtle)]">
          <span>
            Since{" "}
            {new Date(assignment.startedAt).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </span>
          {assignment.lastSessionAt && (
            <span>
              Last session{" "}
              {new Date(assignment.lastSessionAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Mentee Card (My Mentees tab)
// ---------------------------------------------------------------------------

function MenteeCard({ mentee, onMessage }: { mentee: MyMenteeData; onMessage: () => void }) {
  const status = STATUS_BADGE_MAP[mentee.status] ?? {
    label: mentee.status,
    variant: "neutral" as const,
  };

  return (
    <Card>
      <CardContent className="flex items-start gap-4 p-4">
        <Avatar
          size="default"
          src={mentee.avatar ?? undefined}
          fallback={mentee.name.charAt(0)}
          className="shrink-0"
        />

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="truncate text-body-sm font-semibold text-[var(--foreground-default)]">
              {mentee.name}
            </span>
            <Badge variant={status.variant} size="sm">
              {status.label}
            </Badge>
          </div>

          {mentee.goal && (
            <p className="mb-2 text-caption text-[var(--foreground-muted)]">Goal: {mentee.goal}</p>
          )}

          {mentee.status === "ACTIVE" && (
            <Button variant="tertiary" size="sm" onClick={onMessage}>
              <ChatCircleDots size={16} className="mr-1" />
              Message
            </Button>
          )}
        </div>

        <div className="text-caption text-[var(--foreground-subtle)]">
          Since{" "}
          {new Date(mentee.startedAt).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Page (Suspense wrapper for useSearchParams)
// ---------------------------------------------------------------------------

export default function MentoringPage() {
  return (
    <Suspense
      fallback={
        <div>
          <PageHeader title="Mentoring" />
          <div className="flex min-h-[60vh] items-center justify-center">
            <Spinner size="lg" />
          </div>
        </div>
      }
    >
      <MentoringContent />
    </Suspense>
  );
}
