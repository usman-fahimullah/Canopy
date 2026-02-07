"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shell/page-header";
import {
  CollectionCard,
  PathwayIllustration,
  Button,
  Skeleton,
  EmptyStateNoResults,
} from "@/components/ui";
import { type PathwayType, pathwayLabels } from "@/components/ui/pathway-tag";
import { ArrowCircleRight } from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";
import { getCollectionPathways } from "@/lib/jobs/helpers";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Collection {
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
/*  Featured Pathways (for quick navigation)                           */
/* ------------------------------------------------------------------ */

const FEATURED_PATHWAYS: PathwayType[] = [
  "agriculture",
  "conservation",
  "construction",
  "education",
  "energy",
  "finance",
  "research",
  "technology",
];

/* ------------------------------------------------------------------ */
/*  Loading Skeleton                                                   */
/* ------------------------------------------------------------------ */

function CollectionsPageSkeleton() {
  return (
    <div className="space-y-10">
      {/* Featured Collections skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-48" />
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
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <Skeleton className="h-[104px] w-[104px] rounded-xl" />
            <Skeleton className="h-5 w-24" />
          </div>
        ))}
      </div>

      {/* All Collections skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-7 w-36" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[416px] rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section Header Component                                           */
/* ------------------------------------------------------------------ */

function SectionHeader({
  title,
  linkText,
  linkHref,
}: {
  title: string;
  linkText?: string;
  linkHref?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-heading-sm font-medium text-[var(--foreground-default)]">{title}</h2>
      {linkText && linkHref && (
        <Link
          href={linkHref}
          className="inline-flex items-center gap-1 text-body font-medium text-[var(--foreground-default)] transition-colors hover:text-[var(--foreground-brand)]"
        >
          {linkText}
          <ArrowCircleRight size={20} weight="fill" />
        </Link>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function CollectionsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [error, setError] = useState<string | null>(null);

  /* ---- Fetch collections ----------------------------------------- */
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch("/api/collections");
        if (!res.ok) {
          throw new Error("Failed to fetch collections");
        }
        const data = await res.json();
        setCollections(data.collections ?? []);
      } catch (err) {
        logger.error("Error fetching collections", { error: formatError(err) });
        setError("Failed to load collections");
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  // Separate featured and non-featured collections
  const featuredCollections = collections.filter((c) => c.isFeatured);
  const allCollections = collections;

  /* ---- Loading state --------------------------------------------- */
  if (loading) {
    return (
      <div>
        <PageHeader title="Collections" />
        <div className="px-8 py-6 lg:px-12">
          <CollectionsPageSkeleton />
        </div>
      </div>
    );
  }

  /* ---- Error state ----------------------------------------------- */
  if (error) {
    return (
      <div>
        <PageHeader title="Collections" />
        <div className="px-8 py-6 lg:px-12">
          <EmptyStateNoResults
            title="Unable to load collections"
            description={error}
            action={{
              label: "Try Again",
              onClick: () => window.location.reload(),
            }}
          />
        </div>
      </div>
    );
  }

  /* ---- Empty state ----------------------------------------------- */
  if (collections.length === 0) {
    return (
      <div>
        <PageHeader title="Collections" />
        <div className="px-8 py-6 lg:px-12">
          <EmptyStateNoResults
            title="No collections yet"
            description="Check back soon for curated job collections."
          />
        </div>
      </div>
    );
  }

  /* ---- Main content ---------------------------------------------- */
  return (
    <div>
      <PageHeader title="Collections" />

      <div className="space-y-10 px-8 py-6 lg:px-12">
        {/* Featured Collections */}
        {featuredCollections.length > 0 && (
          <section>
            <SectionHeader title="Featured Collections" />
            <div className="scrollbar-hide mt-4 flex gap-4 overflow-x-auto pb-4">
              {featuredCollections.map((collection) => (
                <div key={collection.id} className="h-[416px] w-[280px] shrink-0">
                  <CollectionCard
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
                  />
                </div>
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
                Explore by Pathway
              </h2>
              <p className="mt-1 text-body text-[var(--foreground-muted)]">
                Find jobs in your climate space.
              </p>
              <Button
                variant="outline"
                size="sm"
                rightIcon={<ArrowCircleRight size={16} weight="fill" />}
                className="mt-4"
                onClick={() => router.push("/jobs/pathways")}
              >
                All Pathways
              </Button>
            </div>

            {/* Right side: Pathway cards */}
            <div className="scrollbar-hide flex flex-1 gap-6 overflow-x-auto pb-2">
              {FEATURED_PATHWAYS.map((pathway) => (
                <Link
                  key={pathway}
                  href={`/jobs/search?pathway=${pathway}`}
                  className="flex shrink-0 flex-col items-center gap-2 rounded-xl p-3 transition-colors hover:bg-[var(--background-interactive-hover)]"
                >
                  <div className="rounded-xl bg-[var(--background-subtle)] p-3">
                    <PathwayIllustration pathway={pathway} size="lg" />
                  </div>
                  <span className="text-body font-medium text-[var(--foreground-default)]">
                    {pathwayLabels[pathway]}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* All Collections */}
        <section>
          <SectionHeader title="All Collections" />
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allCollections.map((collection) => (
              <div key={collection.id} className="h-[416px]">
                <CollectionCard
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
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
