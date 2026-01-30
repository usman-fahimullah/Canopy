"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { SECTOR_INFO, type Sector } from "@/lib/candid/types";
import {
  Users,
  MapPin,
  GraduationCap,
  HandHeart,
  ChatCircle,
  Funnel,
  X,
  Briefcase,
  ArrowLeft,
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

function MentorCard({
  mentor,
  onRequestMentor,
  requesting,
}: {
  mentor: Mentor;
  onRequestMentor: (mentorId: string) => void;
  requesting: string | null;
}) {
  return (
    <Card className="p-5 transition-all hover:shadow-card-hover">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Avatar
            size="lg"
            src={mentor.avatar || undefined}
            name={mentor.name}
            color="green"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-body font-semibold text-foreground-default">
                {mentor.name}
              </h3>
              {mentor.headline && (
                <p className="text-caption text-foreground-muted mt-0.5">
                  {mentor.headline}
                </p>
              )}
            </div>
            <Chip variant="primary" size="sm">
              <HandHeart size={12} className="mr-1" />
              Mentor
            </Chip>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-3 mt-2 text-caption text-foreground-muted">
            <span className="flex items-center gap-1">
              <Users size={14} />
              {mentor.menteeCount} mentees
            </span>
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
          </div>

          {/* Mentor Bio or general Bio */}
          {(mentor.mentorBio || mentor.bio) && (
            <p className="text-caption text-foreground-muted mt-3 line-clamp-2">
              {mentor.mentorBio || mentor.bio}
            </p>
          )}

          {/* Topics */}
          {mentor.mentorTopics.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {mentor.mentorTopics.slice(0, 4).map((topic) => {
                const sectorInfo = SECTOR_INFO[topic as Sector];
                return (
                  <Chip key={topic} variant="neutral" size="sm">
                    {sectorInfo?.label || topic}
                  </Chip>
                );
              })}
              {mentor.mentorTopics.length > 4 && (
                <Chip variant="neutral" size="sm">
                  +{mentor.mentorTopics.length - 4}
                </Chip>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onRequestMentor(mentor.id)}
              loading={requesting === mentor.id}
              disabled={requesting !== null}
            >
              <HandHeart size={14} className="mr-1.5" />
              Request Mentorship
            </Button>
            <Button variant="secondary" size="sm" asChild>
              <Link href={`/candid/messages?new=${mentor.accountId}`}>
                <ChatCircle size={14} className="mr-1.5" />
                Message
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function MentorsBrowsePage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [requesting, setRequesting] = useState<string | null>(null);
  const [requestedIds, setRequestedIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMentors = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set("search", searchQuery);
        if (selectedSector) params.set("sector", selectedSector);

        const res = await fetch(`/api/mentors?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setMentors(data.mentors || []);
        } else {
          setMentors([]);
        }
      } catch {
        setMentors([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchMentors, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, selectedSector]);

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
        setRequestedIds((prev) => { const next = new Set(Array.from(prev)); next.add(mentorProfileId); return next; });
      } else {
        const data = await res.json();
        if (res.status === 409) {
          // Already exists — mark as requested
          setRequestedIds((prev) => { const next = new Set(Array.from(prev)); next.add(mentorProfileId); return next; });
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

  const requestedMentors = useMemo(() => {
    return mentors.filter((m) => requestedIds.has(m.id));
  }, [mentors, requestedIds]);

  const activeFilters = [selectedSector].filter(Boolean).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/candid/browse"
          className="inline-flex items-center gap-2 text-caption text-foreground-muted hover:text-foreground-default mb-4"
        >
          <ArrowLeft size={16} />
          Back to browse
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primitive-green-100)]">
            <GraduationCap size={22} className="text-[var(--primitive-green-700)]" />
          </div>
          <h1 className="text-heading-md font-semibold text-foreground-default">
            Find a Mentor
          </h1>
        </div>
        <p className="text-body text-foreground-muted">
          Connect with experienced climate professionals who volunteer their time to help you navigate your career.
          Mentorship is free and informal — just reach out!
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <SearchInput
            placeholder="Search mentors by name, topic, or bio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          variant={showFilters ? "primary" : "secondary"}
          size="default"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Funnel size={16} className="mr-2" />
          Filters
          {activeFilters > 0 && (
            <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs">
              {activeFilters}
            </span>
          )}
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mb-6 rounded-xl bg-white p-4 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <p className="text-caption font-medium text-foreground-default">Sector</p>
            {selectedSector && (
              <button
                className="text-caption text-foreground-muted hover:text-foreground-default"
                onClick={() => setSelectedSector("")}
              >
                <X size={14} className="mr-1 inline" />
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {sectors.map((s) => (
              <Chip
                key={s.value}
                variant={selectedSector === s.value ? "primary" : "neutral"}
                size="sm"
                onClick={() =>
                  setSelectedSector(selectedSector === s.value ? "" : s.value)
                }
                className="cursor-pointer"
              >
                {s.label}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg bg-[var(--primitive-red-100)] p-3 text-caption text-[var(--primitive-red-700)]">
          {error}
        </div>
      )}

      {/* Requested mentors */}
      {requestedMentors.length > 0 && (
        <div className="mb-6">
          <p className="text-caption font-medium text-foreground-muted mb-3">
            Requests sent
          </p>
          <div className="space-y-3">
            {requestedMentors.map((m) => (
              <Card key={m.id} className="p-4 bg-[var(--primitive-green-100)]/30">
                <div className="flex items-center gap-3">
                  <Avatar size="default" src={m.avatar || undefined} name={m.name} color="green" />
                  <div className="flex-1">
                    <p className="text-body font-medium text-foreground-default">{m.name}</p>
                    <p className="text-caption text-foreground-muted">Request pending</p>
                  </div>
                  <Chip variant="yellow" size="sm">Pending</Chip>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : filteredMentors.length > 0 ? (
        <div className="space-y-4">
          <p className="text-caption text-foreground-muted">
            {filteredMentors.length} mentor{filteredMentors.length !== 1 ? "s" : ""} available
          </p>
          {filteredMentors.map((mentor) => (
            <MentorCard
              key={mentor.id}
              mentor={mentor}
              onRequestMentor={handleRequestMentor}
              requesting={requesting}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<GraduationCap size={48} className="text-foreground-muted" />}
          title="No mentors found"
          description={
            searchQuery || selectedSector
              ? "Try adjusting your filters or search terms."
              : "No mentors are available yet. Check back soon!"
          }
          action={
            (searchQuery || selectedSector)
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
      )}
    </div>
  );
}
