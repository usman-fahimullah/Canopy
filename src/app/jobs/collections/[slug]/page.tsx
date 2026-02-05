"use client";

import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shell/page-header";
import {
  JobPostCard,
  PathwayTag,
  Button,
  Chip,
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
import {
  getLocationTypeLabel,
  getEmploymentTypeLabel,
  getJobStatus,
  getCollectionPathways,
} from "@/lib/jobs/helpers";

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
          <Chip
            variant="neutral"
            size="lg"
            selected={bipocFilter}
            onClick={() => setBipocFilter(!bipocFilter)}
          >
            BIPOC Owned
          </Chip>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Chip variant="neutral" size="lg" selected={workplaceFilter !== "all"}>
                Workplace
                <CaretDown size={16} weight="bold" />
              </Chip>
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

          <Chip variant="neutral" size="lg">
            Experience
            <CaretDown size={16} weight="bold" />
          </Chip>
          <Chip variant="neutral" size="lg">
            Salary
            <CaretDown size={16} weight="bold" />
          </Chip>

          <Button variant="outline" size="sm">
            <Faders size={16} weight="bold" />
            All Filters
          </Button>
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
