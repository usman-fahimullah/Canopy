"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shell/page-header";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Table,
  CalendarBlank,
  Briefcase,
  Clock,
  FileText,
  VideoCamera,
  ArrowRight,
} from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";
import { stageBadgeVariant, stageLabel } from "@/lib/jobs/helpers";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Application {
  id: string;
  appliedAt: string;
  updatedAt: string;
  status: string;
  rejectedAt: string | null;
  hiredAt: string | null;
  offeredAt: string | null;
  job: {
    id: string;
    title: string;
    company: string | null;
    logo: string | null;
  };
  hasOffer: boolean;
  offerStatus: string | null;
  nextInterview: {
    id: string;
    scheduledAt: string;
    type: string;
  } | null;
}

type StageFilter = "All" | "Applied" | "Screening" | "Interview" | "Offer" | "Hired" | "Rejected";

const STAGE_FILTERS: StageFilter[] = [
  "All",
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Hired",
  "Rejected",
];

const POLL_INTERVAL_MS = 30_000; // 30 seconds

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHrs = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function offerStatusLabel(status: string): string {
  switch (status) {
    case "SENT":
      return "Offer Sent";
    case "VIEWED":
      return "Offer Viewed";
    case "AWAITING_SIGNATURE":
      return "Awaiting Signature";
    case "SIGNED":
      return "Offer Signed";
    case "WITHDRAWN":
      return "Offer Withdrawn";
    default:
      return "Offer";
  }
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function ApplicationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [stageFilter, setStageFilter] = useState<StageFilter>("All");
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  /* ---- data fetch ------------------------------------------------ */
  const fetchApplications = useCallback(async (isPolling = false) => {
    try {
      const res = await fetch("/api/jobs/applications?limit=50&days=365");

      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications ?? []);
      } else {
        if (!isPolling) setApplications([]);
      }
    } catch (err) {
      logger.error("Error fetching applications", { error: formatError(err) });
      if (!isPolling) setApplications([]);
    } finally {
      if (!isPolling) setLoading(false);
    }
  }, []);

  /* ---- initial fetch + polling ----------------------------------- */
  useEffect(() => {
    fetchApplications(false);

    // Poll every 30 seconds so candidates see stage updates
    pollRef.current = setInterval(() => {
      fetchApplications(true);
    }, POLL_INTERVAL_MS);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchApplications]);

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
            const count =
              filter === "All"
                ? applications.length
                : applications.filter(
                    (app) => stageLabel(app.status).toLowerCase() === filter.toLowerCase()
                  ).length;
            return (
              <Chip
                key={filter}
                variant="neutral"
                size="lg"
                selected={isActive}
                onClick={() => setStageFilter(filter)}
              >
                {filter}
                {count > 0 && <span className="ml-1.5 text-caption opacity-60">{count}</span>}
              </Chip>
            );
          })}
        </div>

        {/* Application rows */}
        {filteredApplications.length > 0 ? (
          <div className="space-y-3">
            {filteredApplications.map((app) => {
              const wasRecentlyUpdated =
                new Date(app.updatedAt).getTime() > new Date(app.appliedAt).getTime() + 60_000; // Updated at least 1min after applying

              return (
                <div
                  key={app.id}
                  onClick={() => {
                    if (app.hasOffer) {
                      router.push(`/jobs/applications/${app.id}/offer`);
                    } else {
                      router.push(`/jobs/applications/track/${app.job.id}`);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      if (app.hasOffer) {
                        router.push(`/jobs/applications/${app.id}/offer`);
                      } else {
                        router.push(`/jobs/applications/track/${app.job.id}`);
                      }
                    }
                  }}
                  className="flex cursor-pointer items-center gap-4 rounded-[var(--radius-2xl)] border border-[var(--border-muted)] bg-[var(--card-background)] px-6 py-5 transition-shadow hover:shadow-card"
                >
                  {/* Company logo or icon */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--background-info)]">
                    {app.job.logo ? (
                      <img
                        src={app.job.logo}
                        alt=""
                        className="h-10 w-10 rounded-xl object-cover"
                      />
                    ) : (
                      <Briefcase
                        size={20}
                        weight="fill"
                        className="text-[var(--foreground-info)]"
                      />
                    )}
                  </div>

                  {/* Role + Company */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-body font-medium text-[var(--foreground-default)]">
                      {app.job.title}
                    </p>
                    <p className="truncate text-caption text-[var(--foreground-muted)]">
                      {app.job.company ?? "Company"}
                    </p>
                  </div>

                  {/* Status indicators: offer or interview */}
                  <div className="hidden items-center gap-2 md:flex">
                    {/* Next interview indicator */}
                    {app.nextInterview && (
                      <div className="flex items-center gap-1 rounded-full bg-[var(--background-feature)] px-2.5 py-1">
                        <VideoCamera
                          size={14}
                          weight="fill"
                          className="text-[var(--foreground-feature)]"
                        />
                        <span className="text-xs font-medium text-[var(--foreground-feature)]">
                          {new Date(app.nextInterview.scheduledAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    )}

                    {/* Offer indicator */}
                    {app.hasOffer && app.offerStatus && (
                      <div className="flex items-center gap-1 rounded-full bg-[var(--background-warning)] px-2.5 py-1">
                        <FileText
                          size={14}
                          weight="fill"
                          className="text-[var(--foreground-warning)]"
                        />
                        <span className="text-xs font-medium text-[var(--foreground-warning)]">
                          {offerStatusLabel(app.offerStatus)}
                        </span>
                        <ArrowRight size={12} className="text-[var(--foreground-warning)]" />
                      </div>
                    )}
                  </div>

                  {/* Timestamps */}
                  <div className="hidden flex-col items-end gap-0.5 sm:flex">
                    <div className="flex items-center gap-1 text-caption text-[var(--foreground-muted)]">
                      <CalendarBlank size={14} />
                      <span>
                        {new Date(app.appliedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    {wasRecentlyUpdated && (
                      <div className="flex items-center gap-1 text-xs text-[var(--foreground-brand-emphasis)]">
                        <Clock size={12} />
                        <span>Updated {timeAgo(app.updatedAt)}</span>
                      </div>
                    )}
                  </div>

                  {/* Stage badge */}
                  <Badge variant={stageBadgeVariant(app.status)}>{stageLabel(app.status)}</Badge>
                </div>
              );
            })}
          </div>
        ) : (
          <Card variant="outlined" className="p-8 text-center">
            <Table
              size={32}
              weight="light"
              className="mx-auto mb-3 text-[var(--foreground-subtle)]"
            />
            <p className="text-body text-[var(--foreground-muted)]">
              {stageFilter === "All"
                ? "No applications yet"
                : `No applications in ${stageFilter} stage`}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
