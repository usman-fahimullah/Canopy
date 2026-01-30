"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CoachCard } from "../components";
import { coaches, mentors, currentUser } from "@/lib/candid";
import { SECTOR_INFO, type Sector, type CandidCoach, type CandidMentor } from "@/lib/candid/types";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Avatar } from "@/components/ui/avatar";
import {
  MagnifyingGlass,
  X,
  Star,
  Users,
  CaretRight,
  GridFour,
  ListDashes,
  MapPin,
  GraduationCap,
  Handshake,
  Funnel,
} from "@phosphor-icons/react";

type MentorType = "all" | "coach" | "mentor";
type ViewMode = "grid" | "list";

const sectors = Object.entries(SECTOR_INFO).map(([key, value]) => ({
  value: key as Sector,
  label: value.label,
}));

// List view card - white card with shadow (no border)
function MentorListItem({ mentor }: { mentor: CandidCoach | CandidMentor }) {
  const isCoach = mentor.role === "coach";
  const isTopRated = mentor.rating && mentor.rating >= 4.8;

  return (
    <div className="relative flex items-center gap-4 rounded-card bg-white p-4 shadow-card transition-all hover:shadow-card-hover">
      {/* Avatar */}
      <div className="relative">
        <Avatar
          size="default"
          src={mentor.avatar}
          name={`${mentor.firstName} ${mentor.lastName}`}
          color="green"
        />
        {/* Online indicator */}
        <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white bg-[var(--primitive-green-500)]" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Link
            href={`/candid/profile/${mentor.id}`}
            className="text-body-strong font-semibold text-foreground-default hover:text-[var(--primitive-green-800)]"
          >
            {mentor.firstName} {mentor.lastName}
          </Link>
          {isTopRated && (
            <Chip variant="yellow" size="sm">
              <Star size={10} weight="fill" className="mr-1" />
              Top Rated
            </Chip>
          )}
        </div>
        <p className="text-caption text-foreground-muted">
          {mentor.currentRole} at {mentor.currentCompany}
        </p>
        <div className="mt-1.5 flex items-center gap-3 text-caption">
          {mentor.rating && (
            <span className="flex items-center gap-1">
              <Star size={12} weight="fill" className="text-[#F59E0B]" />
              <span className="font-semibold text-foreground-default">{mentor.rating.toFixed(1)}</span>
            </span>
          )}
          <span className="flex items-center gap-1 text-foreground-muted">
            <Users size={14} />
            {mentor.menteeCount} mentees
          </span>
          {mentor.location && (
            <span className="flex items-center gap-1 text-foreground-muted">
              <MapPin size={14} />
              {mentor.location.split(",")[0]}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <Button variant="secondary" size="sm" rightIcon={<CaretRight size={14} />} asChild>
        <Link href={`/candid/profile/${mentor.id}`}>
          View Profile
        </Link>
      </Button>
    </div>
  );
}

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mentorType, setMentorType] = useState<MentorType>("all");
  const [selectedSectors, setSelectedSectors] = useState<Sector[]>([]);
  const [sortBy, setSortBy] = useState<"rating" | "mentees">("rating");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Combine all mentors
  const allMentors = useMemo(() => [...coaches, ...mentors], []);

  // Filter mentors
  const filteredMentors = useMemo(() => {
    return allMentors.filter((mentor) => {
      if (mentorType !== "all" && mentor.role !== mentorType) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const fullName = `${mentor.firstName} ${mentor.lastName}`.toLowerCase();
        const company = mentor.currentCompany.toLowerCase();
        const role = mentor.currentRole.toLowerCase();
        if (!fullName.includes(query) && !company.includes(query) && !role.includes(query)) {
          return false;
        }
      }
      if (selectedSectors.length > 0) {
        if (!mentor.sectors.some((s) => selectedSectors.includes(s))) {
          return false;
        }
      }
      return true;
    });
  }, [allMentors, mentorType, searchQuery, selectedSectors]);

  // Sort mentors
  const sortedMentors = useMemo(() => {
    return [...filteredMentors].sort((a, b) => {
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "mentees") return b.menteeCount - a.menteeCount;
      return 0;
    });
  }, [filteredMentors, sortBy]);

  const toggleSector = (sector: Sector) => {
    setSelectedSectors((prev) =>
      prev.includes(sector) ? prev.filter((s) => s !== sector) : [...prev, sector]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setMentorType("all");
    setSelectedSectors([]);
  };

  const hasActiveFilters = searchQuery || mentorType !== "all" || selectedSectors.length > 0;

  // Featured coaches (top rated)
  const featuredCoaches = useMemo(() => {
    return [...coaches]
      .filter((c) => c.rating && c.rating >= 4.8)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 3);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-24 md:pb-8">
      {/* Header - Clean, no gradient */}
      <div className="mb-8">
        <h1 className="text-heading-md font-semibold text-foreground-default">Find a Coach</h1>
        <p className="mt-2 text-body text-foreground-muted">
          Connect with experienced climate professionals who can guide your career transition
        </p>

        {/* Quick stats */}
        <div className="mt-4 flex flex-wrap gap-4 text-caption text-foreground-muted">
          <span className="flex items-center gap-1.5">
            <Users size={16} />
            {coaches.length + mentors.length} mentors
          </span>
          <span className="flex items-center gap-1.5">
            <GraduationCap size={16} />
            {coaches.length} certified coaches
          </span>
          <span className="flex items-center gap-1.5">
            <Star size={16} weight="fill" className="text-[#F59E0B]" />
            4.9 avg. rating
          </span>
        </div>
      </div>

      {/* Featured Coaches Section */}
      {featuredCoaches.length > 0 && !hasActiveFilters && (
        <section className="mb-10">
          <h2 className="text-heading-sm font-semibold text-foreground-default mb-4">Featured Coaches</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCoaches.map((coach) => (
              <CoachCard key={coach.id} mentor={coach} variant="featured" />
            ))}
          </div>
        </section>
      )}

      {/* Search & Controls */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlass
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted"
          />
          <input
            type="text"
            placeholder="Search by name, company, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[var(--border-default)] bg-white py-2.5 pl-10 pr-4 text-body text-foreground-default placeholder:text-foreground-muted focus:border-[var(--primitive-green-800)] focus:outline-none focus:ring-2 focus:ring-[var(--primitive-green-800)]/10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground-default"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Type Toggle */}
          <div className="flex items-center gap-1">
            <Button
              variant={mentorType === "all" ? "secondary" : "tertiary"}
              size="sm"
              onClick={() => setMentorType("all")}
            >
              <Users size={16} className="mr-1.5" />
              All
            </Button>
            <Button
              variant={mentorType === "coach" ? "secondary" : "tertiary"}
              size="sm"
              onClick={() => setMentorType("coach")}
            >
              <GraduationCap size={16} className="mr-1.5" />
              Coaches
            </Button>
            <Button
              variant={mentorType === "mentor" ? "secondary" : "tertiary"}
              size="sm"
              onClick={() => setMentorType("mentor")}
            >
              <Handshake size={16} className="mr-1.5" />
              Mentors
            </Button>
          </div>

          {/* Filter Toggle */}
          <Button
            variant={showFilters || selectedSectors.length > 0 ? "secondary" : "tertiary"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Funnel size={16} className="mr-1.5" />
            Filters
            {selectedSectors.length > 0 && (
              <span className="ml-1.5 rounded-full bg-[var(--primitive-green-800)] px-1.5 text-caption text-white">
                {selectedSectors.length}
              </span>
            )}
          </Button>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-lg border border-[var(--border-default)] bg-white px-3 py-2 text-caption text-foreground-default focus:border-[var(--primitive-green-800)] focus:outline-none"
          >
            <option value="rating">Highest Rated</option>
            <option value="mentees">Most Mentees</option>
          </select>

          {/* View Toggle */}
          <div className="hidden sm:flex items-center gap-1">
            <Button
              variant={viewMode === "grid" ? "secondary" : "tertiary"}
              size="icon-sm"
              onClick={() => setViewMode("grid")}
            >
              <GridFour size={18} />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "tertiary"}
              size="icon-sm"
              onClick={() => setViewMode("list")}
            >
              <ListDashes size={18} />
            </Button>
          </div>
        </div>
      </div>

      {/* Sector Filters - white card with shadow */}
      {showFilters && (
        <div className="mb-6 rounded-card bg-white p-4 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-body-strong font-medium text-foreground-default">Sectors</span>
            {selectedSectors.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setSelectedSectors([])}>
                Clear
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {sectors.map((sector) => (
              <Chip
                key={sector.value}
                variant={selectedSectors.includes(sector.value) ? "primary" : "neutral"}
                size="sm"
                clickable
                onClick={() => toggleSector(sector.value)}
              >
                {sector.label}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mb-6 flex items-center gap-2 flex-wrap">
          <span className="text-caption text-foreground-muted">Showing:</span>
          {searchQuery && (
            <Chip variant="neutral" size="sm" removable onRemove={() => setSearchQuery("")}>
              "{searchQuery}"
            </Chip>
          )}
          {selectedSectors.map((sector) => (
            <Chip
              key={sector}
              variant="neutral"
              size="sm"
              removable
              onRemove={() => toggleSector(sector)}
            >
              {SECTOR_INFO[sector].label}
            </Chip>
          ))}
          <Button variant="link" size="sm" onClick={clearFilters}>
            Clear all
          </Button>
        </div>
      )}

      {/* Results Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-heading-sm font-semibold text-foreground-default">
            {hasActiveFilters ? "Search Results" : "All Mentors"}
          </h2>
          <Chip variant="neutral" size="sm">
            {sortedMentors.length}
          </Chip>
        </div>
      </div>

      {/* Mentor Grid/List */}
      {sortedMentors.length > 0 ? (
        <div
          className={cn(
            viewMode === "grid"
              ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              : "flex flex-col gap-4"
          )}
        >
          {sortedMentors.map((mentor) =>
            viewMode === "grid" ? (
              <CoachCard key={mentor.id} mentor={mentor} />
            ) : (
              <MentorListItem key={mentor.id} mentor={mentor} />
            )
          )}
        </div>
      ) : (
        <div className="rounded-card bg-white p-12 shadow-card text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primitive-blue-200)]">
            <Users size={32} className="text-[var(--primitive-green-800)]" />
          </div>
          <h3 className="text-body-strong font-semibold text-foreground-default">No mentors found</h3>
          <p className="mt-1 text-caption text-foreground-muted">
            Try adjusting your filters or search query
          </p>
          <Button variant="primary" className="mt-4" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
