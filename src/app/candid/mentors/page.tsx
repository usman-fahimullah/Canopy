"use client";

import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Avatar } from "@/components/ui/avatar";
import { SearchInput } from "@/components/ui/search-input";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { Alert } from "@/components/ui/alert";
import { Skeleton, SkeletonAvatar, SkeletonText } from "@/components/ui/skeleton";
import { SECTOR_INFO, type Sector } from "@/lib/candid/types";
import {
  Users,
  MapPin,
  GraduationCap,
  HandHeart,
  ChatCircle,
  Funnel,
  Briefcase,
  ArrowLeft,
  CaretDown,
  CaretUp,
} from "@phosphor-icons/react";

interface Mentor {
  id: string;
  accountId: string;
  name: string;
  avatar: string | null;
  location: string | null;
  headline: string | null;
  bio: string | null;
  mentorBio: string | null;
  mentorTopics: string[];
  skills: string[];
  greenSkills: string[];
  yearsExperience: number | null;
  menteeCount: number;
}

const sectors = Object.entries(SECTOR_INFO).map(([key, value]) => ({
  value: key as Sector,
  label: value.label,
}));

// Skeleton for Mentor List Item
function MentorListItemSkeleton() {
  return (
    <div className="px-4 py-3 border-l-2 border-l-transparent">
      <div className="flex items-start gap-3">
        <SkeletonAvatar size="md" animation="shimmer" />
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-4 w-3/4" animation="shimmer" />
          <Skeleton className="h-3 w-full" animation="shimmer" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-3 w-16" animation="shimmer" />
            <Skeleton className="h-3 w-12" animation="shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton for Mentor Detail Panel
function MentorDetailPanelSkeleton() {
  return (
    <div className="h-full flex flex-col animate-fade-in">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8">
          {/* Profile Header Skeleton */}
          <div className="text-center mb-8">
            <Skeleton
              variant="circular"
              className="h-24 w-24 mx-auto mb-4"
              animation="shimmer"
            />
            <Skeleton className="h-7 w-48 mx-auto mb-2" animation="shimmer" />
            <Skeleton className="h-5 w-64 mx-auto" animation="shimmer" />

            {/* Stats Skeleton */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <Skeleton className="h-4 w-20" animation="shimmer" />
              <Skeleton className="h-4 w-20" animation="shimmer" />
              <Skeleton className="h-4 w-20" animation="shimmer" />
            </div>
          </div>

          {/* About Section Skeleton */}
          <section className="mb-8">
            <Skeleton className="h-4 w-16 mb-3" animation="shimmer" />
            <SkeletonText lines={4} />
          </section>

          {/* Topics Section Skeleton */}
          <section className="mb-8">
            <Skeleton className="h-4 w-40 mb-3" animation="shimmer" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-7 w-24 rounded-full" animation="shimmer" />
              ))}
            </div>
          </section>

          {/* Skills Section Skeleton */}
          <section className="mb-8">
            <Skeleton className="h-4 w-28 mb-3" animation="shimmer" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-6 w-20 rounded-full" animation="shimmer" />
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Sticky Action Bar Skeleton */}
      <div className="border-t border-border-default bg-background-default px-6 py-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          <Skeleton className="h-12 flex-1 rounded-lg" animation="shimmer" />
          <Skeleton className="h-12 w-32 rounded-lg" animation="shimmer" />
        </div>
      </div>
    </div>
  );
}

// Mentor List Item Component
function MentorListItem({
  mentor,
  isSelected,
  onClick,
}: {
  mentor: Mentor;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 transition-all duration-150 border-l-2 ${
        isSelected
          ? "bg-background-brand-subtle border-l-foreground-brand"
          : "border-l-transparent hover:bg-background-subtle"
      }`}
    >
      <div className="flex items-start gap-3">
        <Avatar
          size="default"
          src={mentor.avatar || undefined}
          name={mentor.name}
          color="green"
        />
        <div className="flex-1 min-w-0">
          <p className={`text-body-sm font-medium truncate ${
            isSelected ? "text-foreground-brand" : "text-foreground-default"
          }`}>
            {mentor.name}
          </p>
          {mentor.headline && (
            <p className="text-caption text-foreground-muted truncate mt-0.5">
              {mentor.headline}
            </p>
          )}
          <div className="flex items-center gap-2 mt-1 text-caption text-foreground-subtle">
            {mentor.location && (
              <span className="flex items-center gap-0.5">
                <MapPin size={12} />
                {mentor.location.split(",")[0]}
              </span>
            )}
            {mentor.yearsExperience && (
              <span>{mentor.yearsExperience}+ yrs</span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

// Mentor Detail Panel Component
function MentorDetailPanel({
  mentor,
  onRequestMentor,
  requesting,
  onBack,
}: {
  mentor: Mentor;
  onRequestMentor: (mentorId: string) => void;
  requesting: boolean;
  onBack: () => void;
}) {
  return (
    <div className="h-full flex flex-col animate-fade-in" key={mentor.id}>
      {/* Mobile Back Button */}
      <div className="lg:hidden px-4 py-3 border-b border-border-default">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft size={18} className="mr-2" />
          Back to mentors
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8">
          {/* Profile Header */}
          <div className="text-center mb-8">
            <Avatar
              size="2xl"
              src={mentor.avatar || undefined}
              name={mentor.name}
              color="green"
              className="mx-auto mb-4 ring-4 ring-background-brand-subtle"
            />
            <h1 className="text-heading-md font-semibold text-foreground-default">
              {mentor.name}
            </h1>
            {mentor.headline && (
              <p className="text-body text-foreground-muted mt-1">
                {mentor.headline}
              </p>
            )}

            {/* Stats */}
            <div className="flex items-center justify-center gap-4 mt-4 text-caption text-foreground-muted">
              {mentor.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {mentor.location.split(",")[0]}
                </span>
              )}
              {mentor.yearsExperience && (
                <span className="flex items-center gap-1">
                  <Briefcase size={14} />
                  {mentor.yearsExperience}+ years
                </span>
              )}
              <span className="flex items-center gap-1">
                <Users size={14} />
                {mentor.menteeCount} {mentor.menteeCount === 1 ? "mentee" : "mentees"}
              </span>
            </div>
          </div>

          {/* About Section */}
          {(mentor.mentorBio || mentor.bio) && (
            <section className="mb-8">
              <h2 className="text-body-sm font-semibold text-foreground-muted uppercase tracking-wide mb-3">
                About
              </h2>
              <p className="text-body text-foreground-default leading-relaxed whitespace-pre-wrap">
                {mentor.mentorBio || mentor.bio}
              </p>
            </section>
          )}

          {/* Topics Section */}
          {mentor.mentorTopics.length > 0 && (
            <section className="mb-8">
              <h2 className="text-body-sm font-semibold text-foreground-muted uppercase tracking-wide mb-3">
                Topics I Can Help With
              </h2>
              <div className="flex flex-wrap gap-2">
                {mentor.mentorTopics.map((topic) => {
                  const sectorInfo = SECTOR_INFO[topic as Sector];
                  return (
                    <Chip key={topic} variant="neutral" size="default">
                      {sectorInfo?.label || topic}
                    </Chip>
                  );
                })}
              </div>
            </section>
          )}

          {/* Skills Section */}
          {mentor.greenSkills.length > 0 && (
            <section className="mb-8">
              <h2 className="text-body-sm font-semibold text-foreground-muted uppercase tracking-wide mb-3">
                Green Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {mentor.greenSkills.map((skill) => (
                  <Chip key={skill} variant="primary" size="sm">
                    {skill}
                  </Chip>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div className="border-t border-border-default bg-background-default px-6 py-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            onClick={() => onRequestMentor(mentor.id)}
            loading={requesting}
          >
            <HandHeart size={18} className="mr-2" />
            Request Mentorship
          </Button>
          <Button variant="secondary" size="lg" asChild>
            <Link href={`/candid/messages?new=${mentor.accountId}`}>
              <ChatCircle size={18} className="mr-2" />
              Message
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// Empty Selection State
function EmptySelectionState() {
  return (
    <div className="h-full flex items-center justify-center p-8 animate-fade-in">
      <div className="text-center max-w-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background-muted">
          <Users size={28} className="text-foreground-muted" />
        </div>
        <h2 className="text-heading-sm font-semibold text-foreground-default mb-2">
          Select a mentor
        </h2>
        <p className="text-body text-foreground-muted">
          Choose a mentor from the list to view their profile and request mentorship.
        </p>
      </div>
    </div>
  );
}

export default function MentorsBrowsePage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    }>
      <MentorsContent />
    </Suspense>
  );
}

function MentorsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedMentorId = searchParams.get("mentor");

  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [requesting, setRequesting] = useState<string | null>(null);
  const [requestedIds, setRequestedIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  // Fetch mentors
  const fetchMentors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (selectedSector) params.set("sector", selectedSector);

      const res = await fetch(`/api/mentors?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setMentors(data.mentors || []);
      } else {
        throw new Error("Failed to fetch mentors");
      }
    } catch {
      setError("Failed to load mentors");
      setMentors([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedSector]);

  useEffect(() => {
    const debounce = setTimeout(fetchMentors, 300);
    return () => clearTimeout(debounce);
  }, [fetchMentors]);

  const handleSelectMentor = (mentorId: string) => {
    router.push(`/candid/mentors?mentor=${mentorId}`, { scroll: false });
  };

  const handleBackToList = () => {
    router.push("/candid/mentors", { scroll: false });
  };

  const handleRequestMentor = async (mentorProfileId: string) => {
    setRequesting(mentorProfileId);
    setError(null);
    try {
      const res = await fetch("/api/mentor-assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mentorProfileId }),
      });

      if (res.ok) {
        setRequestedIds((prev) => {
          const next = new Set(Array.from(prev));
          next.add(mentorProfileId);
          return next;
        });
      } else {
        const data = await res.json();
        if (res.status === 409) {
          setRequestedIds((prev) => {
            const next = new Set(Array.from(prev));
            next.add(mentorProfileId);
            return next;
          });
        } else {
          setError(data.error || "Failed to request mentorship");
        }
      }
    } catch {
      setError("Failed to request mentorship");
    } finally {
      setRequesting(null);
    }
  };

  const filteredMentors = useMemo(() => {
    return mentors.filter((m) => !requestedIds.has(m.id));
  }, [mentors, requestedIds]);

  const selectedMentor = useMemo(() => {
    return mentors.find((m) => m.id === selectedMentorId) || null;
  }, [mentors, selectedMentorId]);

  const activeFilters = [selectedSector].filter(Boolean).length;

  return (
    <div className="h-[calc(100vh-5rem)] lg:h-screen flex">
      {/* Left Panel - Mentor List */}
      <div
        className={`w-full lg:w-[320px] xl:w-[360px] flex-shrink-0 bg-background-default border-r border-border-default flex flex-col ${
          selectedMentorId ? "hidden lg:flex" : "flex"
        }`}
      >
        {/* Header */}
        <div className="px-4 py-5 border-b border-border-default">
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap size={22} weight="duotone" className="text-foreground-brand" />
            <h1 className="text-heading-sm font-semibold text-foreground-default">
              Climate Mentors
            </h1>
          </div>
          <p className="text-caption text-foreground-muted">
            Connect with experienced professionals
          </p>
        </div>

        {/* Search & Filter Toggle */}
        <div className="px-4 py-3 border-b border-border-default space-y-3">
          <SearchInput
            placeholder="Search mentors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="compact"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-caption text-foreground-muted hover:text-foreground-default transition-colors"
          >
            <Funnel size={14} />
            <span>Filters</span>
            {activeFilters > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-background-brand text-[10px] font-bold text-foreground-on-emphasis">
                {activeFilters}
              </span>
            )}
            {showFilters ? <CaretUp size={14} /> : <CaretDown size={14} />}
          </button>

          {/* Filter Panel */}
          {showFilters && (
            <div className="pt-2 space-y-2 animate-fade-in">
              <div className="flex items-center justify-between">
                <p className="text-caption font-medium text-foreground-muted">Sector</p>
                {selectedSector && (
                  <button
                    className="text-caption text-foreground-muted hover:text-foreground-default"
                    onClick={() => setSelectedSector("")}
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {sectors.slice(0, 8).map((s) => (
                  <Chip
                    key={s.value}
                    variant={selectedSector === s.value ? "primary" : "neutral"}
                    size="sm"
                    onClick={() =>
                      setSelectedSector(selectedSector === s.value ? "" : s.value)
                    }
                  >
                    {s.label}
                  </Chip>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="px-4 py-3">
            <Alert
              variant="critical"
              dismissible
              onDismiss={() => setError(null)}
            >
              {error}
            </Alert>
          </div>
        )}

        {/* Mentor List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="divide-y divide-border-muted">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <MentorListItemSkeleton key={i} />
              ))}
            </div>
          ) : filteredMentors.length > 0 ? (
            <div className="divide-y divide-border-muted">
              {filteredMentors.map((mentor, index) => (
                <div
                  key={mentor.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <MentorListItem
                    mentor={mentor}
                    isSelected={mentor.id === selectedMentorId}
                    onClick={() => handleSelectMentor(mentor.id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4">
              <EmptyState
                icon={<GraduationCap size={32} className="text-foreground-muted" />}
                title="No mentors found"
                description={
                  searchQuery || selectedSector
                    ? "Try adjusting your filters"
                    : "Check back soon!"
                }
                size="sm"
                action={
                  searchQuery || selectedSector
                    ? {
                        label: "Clear filters",
                        onClick: () => {
                          setSearchQuery("");
                          setSelectedSector("");
                        },
                      }
                    : undefined
                }
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border-default">
          <p className="text-caption text-foreground-muted">
            {filteredMentors.length} mentor{filteredMentors.length !== 1 ? "s" : ""} available
          </p>
        </div>
      </div>

      {/* Right Panel - Mentor Detail */}
      <div
        className={`flex-1 bg-background-subtle ${
          selectedMentorId ? "flex" : "hidden lg:flex"
        }`}
      >
        {selectedMentorId && loading ? (
          <MentorDetailPanelSkeleton />
        ) : selectedMentor ? (
          <MentorDetailPanel
            key={selectedMentor.id}
            mentor={selectedMentor}
            onRequestMentor={handleRequestMentor}
            requesting={requesting === selectedMentor.id}
            onBack={handleBackToList}
          />
        ) : (
          <EmptySelectionState />
        )}
      </div>
    </div>
  );
}
