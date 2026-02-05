"use client";

import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shell/page-header";
import {
  JobPostCard,
  PathwayTag,
  Button,
  Skeleton,
  SkeletonCard,
  EmptyStateNoResults,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui";
import { type PathwayType } from "@/components/ui/pathway-tag";
import { ArrowLeft, CaretDown, Faders } from "@phosphor-icons/react";
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

interface Job {
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
  isFeatured?: boolean;
  isBipocOwned?: boolean;
  isClosingSoon?: boolean;
  isSaved: boolean;
}

interface Collection {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  gradientColors: string[] | null;
  backgroundImage: string | null;
  isFeatured: boolean;
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

function getJobStatus(job: Job): "default" | "featured" | "bipoc-owned" | "closing-soon" {
  if (job.organization?.isBipocOwned || job.isBipocOwned) return "bipoc-owned";
  if (job.isFeatured) return "featured";
  if (job.isClosingSoon) return "closing-soon";
  return "default";
}

// Derive pathways from collection title
function getCollectionPathways(collection: Collection): PathwayType[] {
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

// Generate gradient CSS from colors array
function getGradientStyle(gradientColors: string[] | null): React.CSSProperties {
  if (!gradientColors || gradientColors.length === 0) {
    return { background: "var(--gradient-green-100)" };
  }

  if (gradientColors.length === 1) {
    return { backgroundColor: gradientColors[0] };
  }

  return {
    background: `linear-gradient(135deg, ${gradientColors.join(", ")})`,
  };
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
/*  Loading Skeleton                                                   */
/* ------------------------------------------------------------------ */

function CollectionDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Hero skeleton */}
      <Skeleton className="h-64 w-full rounded-2xl" />

      {/* Filter chips skeleton */}
      <div className="flex gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-10 w-28 rounded-xl" />
        ))}
      </div>

      {/* Jobs count skeleton */}
      <Skeleton className="h-6 w-48" />

      {/* Jobs grid skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <SkeletonCard key={i} className="h-[200px]" />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function CollectionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { slug } = resolvedParams;

  const [loading, setLoading] = useState(true);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [workplaceFilter, setWorkplaceFilter] = useState<WorkplaceFilter>("all");
  const [bipocFilter, setBipocFilter] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---- Fetch collection data ------------------------------------- */
  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const res = await fetch(`/api/collections/${slug}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("Collection not found");
          } else {
            throw new Error("Failed to fetch collection");
          }
          return;
        }
        const data = await res.json();
        setCollection(data.collection);
        setJobs(data.jobs ?? []);
        setSavedIds(new Set(data.jobs?.filter((j: Job) => j.isSaved).map((j: Job) => j.id) ?? []));
      } catch (err) {
        logger.error("Error fetching collection", { error: formatError(err), slug });
        setError("Failed to load collection");
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [slug]);

  /* ---- Toggle save job ------------------------------------------- */
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

  // Filter jobs based on active filters
  const filteredJobs = jobs.filter((job) => {
    if (workplaceFilter !== "all" && job.locationType !== workplaceFilter) {
      return false;
    }
    if (bipocFilter && !job.organization?.isBipocOwned && !job.isBipocOwned) {
      return false;
    }
    return true;
  });

  /* ---- Loading state --------------------------------------------- */
  if (loading) {
    return (
      <div>
        <PageHeader title="Collection" />
        <div className="px-8 py-6 lg:px-12">
          <CollectionDetailSkeleton />
        </div>
      </div>
    );
  }

  /* ---- Error state ----------------------------------------------- */
  if (error || !collection) {
    return (
      <div>
        <PageHeader title="Collection" />
        <div className="px-8 py-6 lg:px-12">
          <EmptyStateNoResults
            title={
              error === "Collection not found"
                ? "Collection not found"
                : "Unable to load collection"
            }
            description={
              error === "Collection not found"
                ? "This collection may have been removed or doesn't exist."
                : "Please try again later."
            }
            action={{
              label: "Back to Collections",
              onClick: () => router.push("/jobs/collections"),
            }}
          />
        </div>
      </div>
    );
  }

  const pathways = getCollectionPathways(collection);

  /* ---- Main content ---------------------------------------------- */
  return (
    <div>
      <PageHeader title={collection.title} />

      <div className="space-y-6 px-8 py-6 lg:px-12">
        {/* Back link */}
        <Link
          href="/jobs/collections"
          className="inline-flex items-center gap-2 text-body font-medium text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground-default)]"
        >
          <ArrowLeft size={20} weight="bold" />
          Back to Collections
        </Link>

        {/* Hero Section */}
        <div
          className="relative overflow-hidden rounded-2xl px-8 py-12 text-white"
          style={getGradientStyle(collection.gradientColors)}
        >
          {/* Background pattern overlay */}
          <div className="absolute inset-0 bg-black/10" />

          <div className="relative z-10 max-w-2xl">
            <h1 className="text-heading-lg font-bold">{collection.title}</h1>
            {collection.description && (
              <p className="mt-3 text-body text-white/90">{collection.description}</p>
            )}

            {/* Pathway tags + job count */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {pathways.slice(0, 3).map((pathway) => (
                <PathwayTag
                  key={pathway}
                  pathway={pathway}
                  className="bg-white/20 backdrop-blur-sm"
                />
              ))}
              <span className="text-body font-medium">• {collection.jobCount} Jobs</span>
            </div>

            {/* Sponsor */}
            {collection.sponsor && (
              <div className="mt-6 flex items-center gap-3 border-t border-white/20 pt-4">
                {collection.sponsor.logo && (
                  <img
                    src={collection.sponsor.logo}
                    alt={collection.sponsor.name}
                    className="h-8 w-8 rounded-lg bg-white object-contain p-1"
                  />
                )}
                <span className="text-caption text-white/80">
                  Sponsored by <span className="font-medium">{collection.sponsor.name}</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Filter Chips Row */}
        <div className="flex flex-wrap gap-3">
          <FilterChip
            label="BIPOC Owned"
            active={bipocFilter}
            onClick={() => setBipocFilter(!bipocFilter)}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-caption font-medium transition-colors ${
                  workplaceFilter !== "all"
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
          {filteredJobs.length} of {jobs.length} Jobs in this Collection
        </p>

        {/* Jobs Grid */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <JobPostCard
                key={job.id}
                companyName={job.organization.name}
                companyLogo={job.organization.logo || undefined}
                jobTitle={job.title}
                pathway={
                  job.climateCategory?.toLowerCase().replace(/\s+/g, "-") as PathwayType | undefined
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
            title="No jobs match your filters"
            description="Try adjusting your filter criteria."
            action={{
              label: "Clear Filters",
              onClick: () => {
                setWorkplaceFilter("all");
                setBipocFilter(false);
              },
            }}
          />
        )}
      </div>
    </div>
  );
}
