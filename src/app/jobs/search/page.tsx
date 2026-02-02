"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/shell/page-header";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MagnifyingGlass, MapPin, Heart, Briefcase } from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";

/* ------------------------------------------------------------------ */
/*  Types — based on the /api/jobs/matches response shape              */
/* ------------------------------------------------------------------ */

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
}

interface JobMatch {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string | null;
  locationType: string;
  employmentType: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  climateCategory: string | null;
  greenSkills: string[];
  organization: Organization;
  matchScore: number;
  matchReasons: string[];
  isSaved: boolean;
}

type LocationFilter = "All" | "Remote" | "Hybrid" | "On-site";

const LOCATION_FILTERS: LocationFilter[] = ["All", "Remote", "Hybrid", "On-site"];

/** Map filter label to the locationType value stored on the job */
function filterToLocationType(filter: LocationFilter): string | null {
  switch (filter) {
    case "Remote":
      return "REMOTE";
    case "Hybrid":
      return "HYBRID";
    case "On-site":
      return "ONSITE";
    default:
      return null;
  }
}

/** Choose a Badge variant based on the match score */
function matchBadgeVariant(score: number) {
  if (score >= 80) return "success" as const;
  if (score >= 50) return "warning" as const;
  return "neutral" as const;
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function JobsPage() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<JobMatch[]>([]);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState<LocationFilter>("All");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  /* ---- data fetch ------------------------------------------------ */
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/jobs/matches?limit=50");
        if (res.ok) {
          const data = await res.json();
          const fetched: JobMatch[] = data.jobs ?? [];
          setJobs(fetched);
          setSavedIds(new Set(fetched.filter((j) => j.isSaved).map((j) => j.id)));
        }
      } catch (err) {
        logger.error("Error fetching job matches", { error: formatError(err) });
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  /* ---- toggle save ----------------------------------------------- */
  const toggleSave = useCallback(
    async (jobId: string) => {
      const isSaved = savedIds.has(jobId);
      const method = isSaved ? "DELETE" : "POST";

      // Optimistic update
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (isSaved) next.delete(jobId);
        else next.add(jobId);
        return next;
      });

      try {
        await fetch(`/api/jobs/${jobId}/save`, { method });
      } catch {
        // Revert on failure
        setSavedIds((prev) => {
          const next = new Set(prev);
          if (isSaved) next.add(jobId);
          else next.delete(jobId);
          return next;
        });
      }
    },
    [savedIds]
  );

  /* ---- filtering ------------------------------------------------- */
  const filteredJobs = jobs.filter((job) => {
    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchesSearch =
        job.title.toLowerCase().includes(q) ||
        job.organization.name.toLowerCase().includes(q) ||
        (job.location?.toLowerCase().includes(q) ?? false) ||
        (job.climateCategory?.toLowerCase().includes(q) ?? false);
      if (!matchesSearch) return false;
    }

    // Location type filter
    const locType = filterToLocationType(locationFilter);
    if (locType && job.locationType !== locType) return false;

    return true;
  });

  /* ---- loading state --------------------------------------------- */
  if (loading) {
    return (
      <div>
        <PageHeader title="Jobs" />
        <div className="flex items-center justify-center py-32">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  /* ---- render ---------------------------------------------------- */
  return (
    <div>
      <PageHeader title="Jobs" />

      <div className="px-8 py-6 lg:px-12">
        {/* Search input */}
        <div className="relative mb-4">
          <MagnifyingGlass
            size={20}
            weight="bold"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground-subtle)]"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs by title, company, or location..."
            className="focus:ring-[var(--primitive-green-500)]/20 w-full rounded-[16px] border border-[var(--primitive-neutral-300)] bg-[var(--input-background)] py-3 pl-12 pr-4 text-body text-[var(--foreground-default)] outline-none transition-colors placeholder:text-[var(--foreground-subtle)] focus:border-[var(--primitive-green-500)] focus:ring-2"
          />
        </div>

        {/* Location filter chips */}
        <div className="mb-6 flex flex-wrap gap-2">
          {LOCATION_FILTERS.map((filter) => {
            const isActive = locationFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setLocationFilter(filter)}
                className={`rounded-[16px] px-4 py-2 text-caption font-bold transition-colors ${
                  isActive
                    ? "bg-[var(--primitive-green-800)] text-[var(--primitive-blue-100)]"
                    : "bg-[var(--primitive-neutral-200)] text-[var(--primitive-green-800)] hover:bg-[var(--primitive-neutral-300)]"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Job cards */}
        {filteredJobs.length > 0 ? (
          <div className="space-y-3">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center gap-4 rounded-[16px] border border-[var(--primitive-neutral-200)] bg-[var(--card-background)] px-6 py-5 transition-shadow hover:shadow-card"
              >
                {/* Icon */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primitive-green-100)]">
                  <Briefcase
                    size={20}
                    weight="fill"
                    className="text-[var(--primitive-green-700)]"
                  />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body font-medium text-[var(--foreground-default)]">
                    {job.title}
                  </p>
                  <p className="truncate text-caption text-[var(--foreground-muted)]">
                    {job.organization.name}
                  </p>
                </div>

                {/* Location */}
                {job.location && (
                  <div className="hidden items-center gap-1 text-caption text-[var(--foreground-muted)] sm:flex">
                    <MapPin size={14} />
                    <span className="max-w-[140px] truncate">{job.location}</span>
                  </div>
                )}

                {/* Location type badge */}
                <Badge variant="neutral" size="sm">
                  {job.locationType === "REMOTE"
                    ? "Remote"
                    : job.locationType === "HYBRID"
                      ? "Hybrid"
                      : "On-site"}
                </Badge>

                {/* Match score */}
                {job.matchScore > 0 && (
                  <Badge variant={matchBadgeVariant(job.matchScore)} size="sm">
                    {Math.round(job.matchScore)}% match
                  </Badge>
                )}

                {/* Save button */}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => toggleSave(job.id)}
                  aria-label={savedIds.has(job.id) ? "Unsave job" : "Save job"}
                >
                  <Heart
                    size={20}
                    weight={savedIds.has(job.id) ? "fill" : "regular"}
                    className={
                      savedIds.has(job.id)
                        ? "text-[var(--primitive-red-500)]"
                        : "text-[var(--foreground-muted)]"
                    }
                  />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[16px] border border-[var(--primitive-neutral-200)] bg-[var(--card-background)] p-8 text-center">
            <MagnifyingGlass
              size={32}
              weight="light"
              className="mx-auto mb-3 text-[var(--foreground-subtle)]"
            />
            <p className="text-body text-[var(--foreground-muted)]">
              No jobs found matching your criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
