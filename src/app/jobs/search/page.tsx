"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/shell/page-header";
import {
  SearchBar,
  JobPostCard,
  CollectionCard,
  PathwayIllustration,
  EmptyStateNoResults,
  Button,
  Skeleton,
  SkeletonCard,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui";
import { type PathwayType, pathwayLabels } from "@/components/ui/pathway-tag";
import { ArrowCircleRight, PencilSimple, CaretDown, Faders } from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  isBipocOwned?: boolean;
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
  isFeatured?: boolean;
  isBipocOwned?: boolean;
  isClosingSoon?: boolean;
}

interface CollectionFromAPI {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  gradientColors: string[] | null;
  isFeatured: boolean;
  displayOrder: number;
  sponsor: {
    id: string;
    name: string;
    logo: string | null;
  } | null;
  jobCount: number;
}

/* ------------------------------------------------------------------ */
/*  Filter Types                                                       */
/* ------------------------------------------------------------------ */

type WorkplaceFilter = "all" | "REMOTE" | "HYBRID" | "ONSITE";
type ExperienceFilter = "all" | "entry" | "mid" | "senior" | "executive";
type DatePostedFilter = "all" | "24h" | "week" | "month";

interface ActiveFilters {
  bipocOwned: boolean;
  datePosted: DatePostedFilter;
  workplace: WorkplaceFilter;
  experience: ExperienceFilter;
  pathway: string;
  salary: string;
}

const DEFAULT_FILTERS: ActiveFilters = {
  bipocOwned: false,
  datePosted: "all",
  workplace: "all",
  experience: "all",
  pathway: "",
  salary: "",
};

/* ------------------------------------------------------------------ */
/*  Featured Pathways for discovery section                            */
/* ------------------------------------------------------------------ */

const FEATURED_PATHWAYS: PathwayType[] = [
  "agriculture",
  "conservation",
  "construction",
  "education",
  "energy",
];

/* ------------------------------------------------------------------ */
/*  Helper functions                                                   */
/* ------------------------------------------------------------------ */

function getLocationTypeLabel(locationType: string): string {
  switch (locationType) {
    case "REMOTE":
      return "Remote";
    case "HYBRID":
      return "Hybrid";
    case "ONSITE":
      return "Onsite";
    default:
      return locationType;
  }
}

function getEmploymentTypeLabel(employmentType: string): string {
  switch (employmentType) {
    case "FULL_TIME":
      return "Full-Time";
    case "PART_TIME":
      return "Part-Time";
    case "CONTRACT":
      return "Contract";
    case "INTERNSHIP":
      return "Internship";
    default:
      return employmentType;
  }
}

function getJobStatus(job: JobMatch): "default" | "featured" | "bipoc-owned" | "closing-soon" {
  if (job.organization?.isBipocOwned || job.isBipocOwned) return "bipoc-owned";
  if (job.isFeatured) return "featured";
  if (job.isClosingSoon) return "closing-soon";
  return "default";
}

// Derive pathways from collection title (since API doesn't include pathways field yet)
function getCollectionPathways(collection: CollectionFromAPI): PathwayType[] {
  const title = collection.title.toLowerCase();

  if (title.includes("urban") || title.includes("city")) {
    return ["urban-planning", "construction", "transportation"];
  }
  if (title.includes("planet") || title.includes("global") || title.includes("conservation")) {
    return ["conservation", "research", "policy"];
  }
  if (title.includes("game") || title.includes("sport")) {
    return ["sports"];
  }
  if (title.includes("knowledge") || title.includes("education") || title.includes("research")) {
    return ["education", "research", "media"];
  }
  if (title.includes("energy") || title.includes("clean") || title.includes("renewable")) {
    return ["energy", "technology"];
  }
  if (title.includes("finance") || title.includes("green finance") || title.includes("esg")) {
    return ["finance"];
  }

  return ["conservation", "energy"];
}

/* ------------------------------------------------------------------ */
/*  Loading Skeletons                                                  */
/* ------------------------------------------------------------------ */

function DiscoveryPageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Search bar skeleton */}
      <div className="flex gap-4">
        <Skeleton className="h-14 flex-1 rounded-2xl" />
        <Skeleton className="h-14 w-48 rounded-2xl" />
        <Skeleton className="h-14 w-24 rounded-2xl" />
      </div>

      {/* Collections skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-6 w-36" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[416px] w-[280px] shrink-0 rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Pathways skeleton */}
      <div className="flex items-center gap-8">
        <Skeleton className="h-20 w-48" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <Skeleton className="h-[104px] w-[104px] rounded-xl" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>

      {/* Jobs skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} className="h-[200px]" />
          ))}
        </div>
      </div>
    </div>
  );
}

function SearchResultsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Search bar skeleton */}
      <div className="flex gap-4">
        <Skeleton className="h-14 flex-1 rounded-2xl" />
        <Skeleton className="h-14 w-48 rounded-2xl" />
        <Skeleton className="h-14 w-24 rounded-2xl" />
      </div>

      {/* Filter chips skeleton */}
      <div className="flex gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Skeleton key={i} className="h-10 w-28 rounded-xl" />
        ))}
      </div>

      {/* Results count skeleton */}
      <Skeleton className="h-6 w-36" />

      {/* Jobs grid skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <SkeletonCard key={i} className="h-[200px]" />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Filter Chip Component                                              */
/* ------------------------------------------------------------------ */

function FilterChip({
  label,
  active,
  hasDropdown,
  onClick,
}: {
  label: string;
  active?: boolean;
  hasDropdown?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-caption font-medium transition-colors ${
        active
          ? "bg-[var(--primitive-green-800)] text-[var(--primitive-neutral-0)]"
          : "bg-[var(--primitive-neutral-200)] text-[var(--primitive-green-800)] hover:bg-[var(--primitive-neutral-300)]"
      }`}
    >
      {label}
      {hasDropdown && <CaretDown size={16} weight="bold" />}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Section Header Component                                           */
/* ------------------------------------------------------------------ */

function SectionHeader({
  title,
  linkText,
  linkHref,
  onLinkClick,
}: {
  title: string;
  linkText?: string;
  linkHref?: string;
  onLinkClick?: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-heading-sm font-medium text-[var(--foreground-default)]">{title}</h2>
      {linkText &&
        (linkHref || onLinkClick) &&
        (linkHref ? (
          <Link
            href={linkHref}
            className="inline-flex items-center gap-1 text-body font-medium text-[var(--foreground-default)] transition-colors hover:text-[var(--foreground-brand)]"
          >
            {linkText}
            <ArrowCircleRight size={20} weight="fill" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={onLinkClick}
            className="inline-flex items-center gap-1 text-body font-medium text-[var(--foreground-default)] transition-colors hover:text-[var(--foreground-brand)]"
          >
            {linkText}
            <ArrowCircleRight size={20} weight="fill" />
          </button>
        ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function JobsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize from URL params
  const initialSearch = searchParams.get("search") || "";
  const initialLocation = searchParams.get("location") || "";
  const initialBipoc = searchParams.get("bipocOwned") === "true";
  const initialWorkplace = (searchParams.get("workplace") || "all") as WorkplaceFilter;

  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [jobs, setJobs] = useState<JobMatch[]>([]);
  const [savedJobs, setSavedJobs] = useState<JobMatch[]>([]);
  const [collections, setCollections] = useState<CollectionFromAPI[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [locationQuery, setLocationQuery] = useState(initialLocation);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [pathwayCounts, setPathwayCounts] = useState<Record<PathwayType, number>>(
    {} as Record<PathwayType, number>
  );
  const [hasSearched, setHasSearched] = useState(
    !!initialSearch || !!initialLocation || initialBipoc || initialWorkplace !== "all"
  );
  const [filters, setFilters] = useState<ActiveFilters>({
    ...DEFAULT_FILTERS,
    bipocOwned: initialBipoc,
    workplace: initialWorkplace,
  });

  // Track if this is the initial load
  const isInitialLoad = useRef(true);

  /* ---- fetch jobs with optional search params -------------------- */
  const fetchJobs = useCallback(
    async (search?: string, location?: string, activeFilters?: ActiveFilters) => {
      try {
        // Build API URL with search params
        const params = new URLSearchParams();
        params.set("limit", "100"); // Fetch more results for search mode

        if (search?.trim()) params.set("search", search.trim());
        if (location?.trim()) params.set("location", location.trim());

        // Apply filters
        const filtersToUse = activeFilters || filters;
        if (filtersToUse.workplace !== "all") {
          params.set("locationType", filtersToUse.workplace);
        }

        const res = await fetch(`/api/jobs/matches?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          let fetched: JobMatch[] = data.jobs ?? [];

          // Client-side filter for BIPOC owned (until API supports it)
          if (filtersToUse.bipocOwned) {
            fetched = fetched.filter((job) => job.organization?.isBipocOwned || job.isBipocOwned);
          }

          setJobs(fetched);
          setSavedIds(new Set(fetched.filter((j) => j.isSaved).map((j) => j.id)));

          // Calculate pathway counts
          const counts: Record<string, number> = {};
          fetched.forEach((job) => {
            if (job.climateCategory) {
              const pathway = job.climateCategory.toLowerCase().replace(/\s+/g, "-");
              counts[pathway] = (counts[pathway] || 0) + 1;
            }
          });
          setPathwayCounts(counts as Record<PathwayType, number>);
        }
      } catch (err) {
        logger.error("Error fetching jobs", { error: formatError(err) });
      }
    },
    [filters]
  );

  /* ---- initial data fetch ---------------------------------------- */
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.all([
          fetchJobs(initialSearch, initialLocation, {
            ...DEFAULT_FILTERS,
            bipocOwned: initialBipoc,
            workplace: initialWorkplace,
          }),
          fetch("/api/jobs/saved").then(async (res) => {
            if (res.ok) {
              const savedData = await res.json();
              setSavedJobs(savedData.jobs ?? []);
            }
          }),
          // Fetch featured collections from API
          fetch("/api/collections?featured=true").then(async (res) => {
            if (res.ok) {
              const collectionsData = await res.json();
              setCollections(collectionsData.collections ?? []);
            }
          }),
        ]);
      } catch (err) {
        logger.error("Error fetching initial data", { error: formatError(err) });
      } finally {
        setLoading(false);
        isInitialLoad.current = false;
      }
    };

    fetchInitialData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  /* ---- update URL with current filters --------------------------- */
  const updateUrl = useCallback(
    (search: string, location: string, activeFilters: ActiveFilters) => {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (location.trim()) params.set("location", location.trim());
      if (activeFilters.bipocOwned) params.set("bipocOwned", "true");
      if (activeFilters.workplace !== "all") params.set("workplace", activeFilters.workplace);

      const newUrl = params.toString() ? `/jobs/search?${params.toString()}` : "/jobs/search";
      router.push(newUrl, { scroll: false });
    },
    [router]
  );

  /* ---- search handler -------------------------------------------- */
  const handleSearch = useCallback(
    async (search: string, location?: string) => {
      setSearchQuery(search);
      setLocationQuery(location || "");
      setHasSearched(true);

      updateUrl(search, location || "", filters);

      setSearching(true);
      await fetchJobs(search, location, filters);
      setSearching(false);
    },
    [fetchJobs, filters, updateUrl]
  );

  /* ---- filter handlers ------------------------------------------- */
  const toggleBipocFilter = useCallback(async () => {
    const newFilters = { ...filters, bipocOwned: !filters.bipocOwned };
    setFilters(newFilters);
    setHasSearched(true);

    updateUrl(searchQuery, locationQuery, newFilters);

    setSearching(true);
    await fetchJobs(searchQuery, locationQuery, newFilters);
    setSearching(false);
  }, [filters, searchQuery, locationQuery, fetchJobs, updateUrl]);

  const setWorkplaceFilter = useCallback(
    async (workplace: WorkplaceFilter) => {
      const newFilters = { ...filters, workplace };
      setFilters(newFilters);
      setHasSearched(true);

      updateUrl(searchQuery, locationQuery, newFilters);

      setSearching(true);
      await fetchJobs(searchQuery, locationQuery, newFilters);
      setSearching(false);
    },
    [filters, searchQuery, locationQuery, fetchJobs, updateUrl]
  );

  /* ---- clear search ---------------------------------------------- */
  const clearSearch = useCallback(async () => {
    setSearchQuery("");
    setLocationQuery("");
    setHasSearched(false);
    setFilters(DEFAULT_FILTERS);
    router.push("/jobs/search", { scroll: false });

    setSearching(true);
    await fetchJobs("", "", DEFAULT_FILTERS);
    setSearching(false);
  }, [fetchJobs, router]);

  // Jobs to display
  const featuredJobs = jobs.filter((j) => j.isFeatured || j.matchScore >= 80).slice(0, 6);
  const displayJobs = hasSearched
    ? jobs
    : featuredJobs.length > 0
      ? featuredJobs
      : jobs.slice(0, 6);

  /* ---- loading state --------------------------------------------- */
  if (loading) {
    return (
      <div>
        <PageHeader title="Jobs" />
        <div className="px-8 py-6 lg:px-12">
          {hasSearched ? <SearchResultsSkeleton /> : <DiscoveryPageSkeleton />}
        </div>
      </div>
    );
  }

  /* ---- Search Results View --------------------------------------- */
  if (hasSearched) {
    return (
      <div>
        <PageHeader title="Jobs" />

        <div className="space-y-6 px-8 py-6 lg:px-12">
          {/* Search Bar */}
          <SearchBar
            searchPlaceholder="Search by title, company name, etc."
            locationPlaceholder="City, state, or zip..."
            showLocation={true}
            buttonText="Search"
            onSearch={handleSearch}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            locationValue={locationQuery}
            onLocationChange={setLocationQuery}
          />

          {/* Filter Chips Row */}
          <div className="flex flex-wrap gap-3">
            <FilterChip
              label="BIPOC Owned"
              active={filters.bipocOwned}
              onClick={toggleBipocFilter}
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-caption font-medium transition-colors ${
                    filters.datePosted !== "all"
                      ? "bg-[var(--primitive-green-800)] text-[var(--primitive-neutral-0)]"
                      : "bg-[var(--primitive-neutral-200)] text-[var(--primitive-green-800)] hover:bg-[var(--primitive-neutral-300)]"
                  }`}
                >
                  Date Posted
                  <CaretDown size={16} weight="bold" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onSelect={() => {}}>Any time</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => {}}>Past 24 hours</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => {}}>Past week</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => {}}>Past month</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-caption font-medium transition-colors ${
                    filters.workplace !== "all"
                      ? "bg-[var(--primitive-green-800)] text-[var(--primitive-neutral-0)]"
                      : "bg-[var(--primitive-neutral-200)] text-[var(--primitive-green-800)] hover:bg-[var(--primitive-neutral-300)]"
                  }`}
                >
                  Workplace
                  <CaretDown size={16} weight="bold" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onSelect={() => setWorkplaceFilter("all")}>All</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setWorkplaceFilter("REMOTE")}>
                  Remote
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setWorkplaceFilter("HYBRID")}>
                  Hybrid
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setWorkplaceFilter("ONSITE")}>
                  On-site
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <FilterChip label="Experience" hasDropdown />
            <FilterChip label="Pathways" hasDropdown />
            <FilterChip label="Job Role" hasDropdown />
            <FilterChip label="Salary" hasDropdown />

            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--primitive-neutral-300)] bg-[var(--primitive-neutral-0)] px-4 py-2.5 text-caption font-medium text-[var(--primitive-green-800)] transition-colors hover:bg-[var(--primitive-neutral-100)]"
            >
              <Faders size={16} weight="bold" />
              All Filters
            </button>
          </div>

          {/* Results Count */}
          <p className="text-body text-[var(--foreground-muted)]">
            Showing{" "}
            <span className="font-semibold text-[var(--primitive-green-700)]">{jobs.length}</span>{" "}
            Results
          </p>

          {/* Job Cards Grid */}
          {searching ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <SkeletonCard key={i} className="h-[200px]" />
              ))}
            </div>
          ) : displayJobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {displayJobs.map((job) => (
                <JobPostCard
                  key={job.id}
                  companyName={job.organization.name}
                  companyLogo={job.organization.logo || undefined}
                  jobTitle={job.title}
                  pathway={
                    job.climateCategory?.toLowerCase().replace(/\s+/g, "-") as
                      | PathwayType
                      | undefined
                  }
                  status={getJobStatus(job)}
                  tags={[
                    getLocationTypeLabel(job.locationType),
                    getEmploymentTypeLabel(job.employmentType),
                  ]}
                  saved={savedIds.has(job.id)}
                  onSave={() => toggleSave(job.id)}
                  onViewJob={() => router.push(`/jobs/search/${job.id}`)}
                  size="full"
                />
              ))}
            </div>
          ) : (
            <EmptyStateNoResults
              title="No jobs found"
              description="Try adjusting your search criteria or filters."
              action={{
                label: "Clear Search",
                onClick: clearSearch,
              }}
            />
          )}
        </div>
      </div>
    );
  }

  /* ---- Discovery View (Home) ------------------------------------- */
  return (
    <div>
      <PageHeader title="Jobs" />

      <div className="space-y-10 px-8 py-6 lg:px-12">
        {/* Search Bar */}
        <SearchBar
          searchPlaceholder="Search by title, skill, or keywords"
          locationPlaceholder="City, state, or zip code"
          showLocation={true}
          buttonText="Search"
          onSearch={handleSearch}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          locationValue={locationQuery}
          onLocationChange={setLocationQuery}
        />

        {/* Featured Collections */}
        {collections.length > 0 && (
          <section>
            <SectionHeader
              title="Featured Collections"
              linkText="Explore Collections"
              linkHref="/jobs/collections"
            />
            <div className="scrollbar-hide mt-4 flex gap-4 overflow-x-auto pb-4">
              {collections.map((collection) => (
                <CollectionCard
                  key={collection.id}
                  title={collection.title}
                  jobCount={collection.jobCount}
                  pathways={getCollectionPathways(collection)}
                  description={collection.description ?? undefined}
                  href={`/jobs/collections/${collection.slug}`}
                  sponsor={
                    collection.sponsor
                      ? { name: collection.sponsor.name, logo: collection.sponsor.logo ?? "" }
                      : undefined
                  }
                  className="w-[280px] shrink-0"
                />
              ))}
            </div>
          </section>
        )}

        {/* Discover Pathways */}
        <section>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-12">
            {/* Left side: Title and CTA */}
            <div className="shrink-0">
              <h2 className="text-heading-sm font-medium text-[var(--foreground-default)]">
                Discover various paths
              </h2>
              <p className="mt-1 text-body text-[var(--foreground-muted)]">
                to help you find your climate space.
              </p>
              <Button
                variant="outline"
                size="sm"
                rightIcon={<ArrowCircleRight size={16} weight="fill" />}
                className="mt-4"
                onClick={() => router.push("/jobs/pathways")}
              >
                Explore More
              </Button>
            </div>

            {/* Right side: Pathway cards */}
            <div className="scrollbar-hide flex flex-1 gap-6 overflow-x-auto pb-2">
              {FEATURED_PATHWAYS.map((pathway) => (
                <Link
                  key={pathway}
                  href={`/jobs/search?pathway=${pathway}`}
                  className="flex shrink-0 flex-col items-center gap-2 rounded-xl p-3 transition-colors hover:bg-[var(--background-subtle)]"
                >
                  <div className="rounded-xl bg-[var(--background-subtle)] p-3">
                    <PathwayIllustration pathway={pathway} size="lg" />
                  </div>
                  <span className="text-body font-medium text-[var(--foreground-default)]">
                    {pathwayLabels[pathway]}
                  </span>
                  <span className="text-caption text-[var(--foreground-muted)]">
                    {pathwayCounts[pathway] || 20} Jobs
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Jobs */}
        <section>
          <SectionHeader
            title="Featured Jobs"
            linkText="View all jobs"
            linkHref="/jobs/search/all"
          />
          {displayJobs.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {displayJobs.map((job) => (
                <JobPostCard
                  key={job.id}
                  companyName={job.organization.name}
                  companyLogo={job.organization.logo || undefined}
                  jobTitle={job.title}
                  pathway={
                    job.climateCategory?.toLowerCase().replace(/\s+/g, "-") as
                      | PathwayType
                      | undefined
                  }
                  status={getJobStatus(job)}
                  tags={[
                    getLocationTypeLabel(job.locationType),
                    getEmploymentTypeLabel(job.employmentType),
                  ]}
                  saved={savedIds.has(job.id)}
                  onSave={() => toggleSave(job.id)}
                  onViewJob={() => router.push(`/jobs/search/${job.id}`)}
                  size="full"
                />
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <EmptyStateNoResults
                title="No featured jobs"
                description="Check back soon for new opportunities."
              />
            </div>
          )}
        </section>

        {/* Your Saved Jobs */}
        {(savedJobs.length > 0 || savedIds.size > 0) && (
          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-heading-sm font-medium text-[var(--foreground-default)]">
                Your Saved Jobs
              </h2>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<PencilSimple size={16} weight="bold" />}
                onClick={() => router.push("/jobs/saved")}
              >
                Edit
              </Button>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {(savedJobs.length > 0 ? savedJobs : jobs.filter((j) => savedIds.has(j.id)))
                .slice(0, 6)
                .map((job) => (
                  <JobPostCard
                    key={job.id}
                    companyName={job.organization.name}
                    companyLogo={job.organization.logo || undefined}
                    jobTitle={job.title}
                    pathway={
                      job.climateCategory?.toLowerCase().replace(/\s+/g, "-") as
                        | PathwayType
                        | undefined
                    }
                    status={getJobStatus(job)}
                    tags={[
                      getLocationTypeLabel(job.locationType),
                      getEmploymentTypeLabel(job.employmentType),
                    ]}
                    saved={true}
                    onSave={() => toggleSave(job.id)}
                    onViewJob={() => router.push(`/jobs/search/${job.id}`)}
                    size="full"
                  />
                ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
