"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shell/page-header";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Table, CalendarBlank, Briefcase } from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Application {
  id: string;
  jobId: string;
  name: string;
  email: string;
  location: string;
  yearsExperience: string;
  resumeUrl: string;
  status: string;
  submittedAt: string;
  matchScore: number;
  /** Added from context — may come from a richer API response in the future */
  jobTitle?: string;
  company?: string;
}

type StageFilter = "All" | "Applied" | "Screening" | "Interview" | "Offer";

const STAGE_FILTERS: StageFilter[] = ["All", "Applied", "Screening", "Interview", "Offer"];

/**
 * Map an application status/stage to a Badge variant.
 * Uses the same convention as the talent dashboard.
 */
function stageBadgeVariant(stage: string) {
  switch (stage.toLowerCase()) {
    case "applied":
    case "new":
      return "info" as const;
    case "screening":
    case "reviewing":
      return "default" as const;
    case "interview":
      return "feature" as const;
    case "offer":
      return "warning" as const;
    case "hired":
      return "success" as const;
    case "rejected":
      return "error" as const;
    default:
      return "neutral" as const;
  }
}

/** Normalise raw status strings into a display label */
function stageLabel(stage: string): string {
  switch (stage.toLowerCase()) {
    case "new":
      return "Applied";
    case "reviewing":
      return "Screening";
    default:
      return stage.charAt(0).toUpperCase() + stage.slice(1);
  }
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function ApplicationsPage() {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [stageFilter, setStageFilter] = useState<StageFilter>("All");

  /* ---- data fetch ------------------------------------------------ */
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // The /api/applications endpoint currently requires a jobId param.
        // For the talent view (seeker's own applications) we call it without
        // jobId and gracefully handle the expected 400 by falling back to [].
        const res = await fetch("/api/applications");

        if (res.ok) {
          const data = await res.json();
          setApplications(data.applications ?? []);
        } else {
          // Graceful fallback — API returned 400 (missing jobId) or other error
          setApplications([]);
        }
      } catch (err) {
        logger.error("Error fetching applications", { error: formatError(err) });
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  /* ---- filtering ------------------------------------------------- */
  const filteredApplications = applications.filter((app) => {
    if (stageFilter === "All") return true;

    const normalised = stageLabel(app.status).toLowerCase();
    return normalised === stageFilter.toLowerCase();
  });

  /* ---- loading state --------------------------------------------- */
  if (loading) {
    return (
      <div>
        <PageHeader title="Applications" />
        <div className="flex items-center justify-center py-32">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  /* ---- render ---------------------------------------------------- */
  return (
    <div>
      <PageHeader title="Applications" />

      <div className="px-8 py-6 lg:px-12">
        {/* Stage filter tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {STAGE_FILTERS.map((filter) => {
            const isActive = stageFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setStageFilter(filter)}
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

        {/* Application rows */}
        {filteredApplications.length > 0 ? (
          <div className="space-y-3">
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                className="flex items-center gap-4 rounded-[16px] border border-[var(--primitive-neutral-200)] bg-[var(--card-background)] px-6 py-5 transition-shadow hover:shadow-card"
              >
                {/* Icon */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primitive-blue-100)]">
                  <Briefcase size={20} weight="fill" className="text-[var(--primitive-blue-600)]" />
                </div>

                {/* Role + Company */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body font-medium text-[var(--foreground-default)]">
                    {app.jobTitle ?? app.name}
                  </p>
                  <p className="truncate text-caption text-[var(--foreground-muted)]">
                    {app.company ?? app.location}
                  </p>
                </div>

                {/* Applied date */}
                <div className="hidden items-center gap-1 text-caption text-[var(--foreground-muted)] sm:flex">
                  <CalendarBlank size={14} />
                  <span>
                    {new Date(app.submittedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Stage badge */}
                <Badge variant={stageBadgeVariant(app.status)}>{stageLabel(app.status)}</Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[16px] border border-[var(--primitive-neutral-200)] bg-[var(--card-background)] p-8 text-center">
            <Table
              size={32}
              weight="light"
              className="mx-auto mb-3 text-[var(--foreground-subtle)]"
            />
            <p className="text-body text-[var(--foreground-muted)]">No applications yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
