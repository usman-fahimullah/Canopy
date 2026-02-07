"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/shell/page-header";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SimplePagination } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from "@/components/ui/dropdown";
import { Users, Star, CalendarBlank, BriefcaseMetal, Download, Trash } from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";

/* -------------------------------------------------------------------
   Types
   ------------------------------------------------------------------- */

interface Application {
  id: string;
  name?: string;
  email?: string;
  stage?: string;
  status?: string;
  jobId?: string;
  matchScore?: number | null;
  submittedAt?: string;
  createdAt?: string;
  source?: string;
  candidate?: {
    id: string;
    name: string;
    email: string;
  };
  job?: {
    id: string;
    title: string;
  };
}

/* -------------------------------------------------------------------
   Constants
   ------------------------------------------------------------------- */

const PIPELINE_STAGES = ["All", "Applied", "Screening", "Interview", "Offer", "Hired"] as const;

/* -------------------------------------------------------------------
   Helpers
   ------------------------------------------------------------------- */

function stageBadgeVariant(stage: string) {
  switch (stage.toLowerCase()) {
    case "applied":
      return "info" as const;
    case "screening":
      return "success" as const;
    case "interview":
      return "feature" as const;
    case "offer":
      return "warning" as const;
    case "hired":
      return "success" as const;
    default:
      return "neutral" as const;
  }
}

function formatDate(dateString: string | undefined | null) {
  if (!dateString) return "--";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getCandidateName(app: Application): string {
  return app.candidate?.name || app.name || "Unknown Candidate";
}

function getCandidateEmail(app: Application): string {
  return app.candidate?.email || app.email || "";
}

function getJobTitle(app: Application): string {
  return app.job?.title || "Untitled Role";
}

function getStage(app: Application): string {
  return app.stage || app.status || "applied";
}

function getAppliedDate(app: Application): string | undefined {
  return app.submittedAt || app.createdAt;
}

/* -------------------------------------------------------------------
   Page
   ------------------------------------------------------------------- */

export default function CandidatesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [total, setTotal] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  // Parse URL params
  const skip = parseInt(searchParams.get("skip") || "0");
  const take = parseInt(searchParams.get("take") || "20");
  const stage = searchParams.get("stage") || undefined;
  const matchScoreMin = searchParams.get("matchScoreMin") ? parseInt(searchParams.get("matchScoreMin")!) : undefined;
  const matchScoreMax = searchParams.get("matchScoreMax") ? parseInt(searchParams.get("matchScoreMax")!) : undefined;
  const source = searchParams.get("source") || undefined;
  const search = searchParams.get("search") || undefined;

  // Fetch applications with filters
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.set("skip", skip.toString());
        params.set("take", take.toString());
        if (stage) params.set("stage", stage);
        if (matchScoreMin !== undefined) params.set("matchScoreMin", matchScoreMin.toString());
        if (matchScoreMax !== undefined) params.set("matchScoreMax", matchScoreMax.toString());
        if (source) params.set("source", source);
        if (search) params.set("search", search);

        const res = await fetch(`/api/canopy/candidates?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setApplications(data.applications || []);
          setTotal(data.meta.total || 0);
        }
      } catch (error) {
        logger.error("Error fetching applications", { error: formatError(error) });
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
    setSelectedIds(new Set()); // Clear selections on filter change
  }, [skip, take, stage, matchScoreMin, matchScoreMax, source, search]);

  // Handle filter updates
  const updateParams = useCallback(
    (newParams: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(newParams).forEach(([key, value]) => {
        if (value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      params.set("skip", "0"); // Reset pagination
      router.push(`/canopy/candidates?${params.toString()}`);
    },
    [searchParams, router]
  );

  // Handle checkbox toggle
  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Handle select/deselect all
  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === applications.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(applications.map((app) => app.id)));
    }
  }, [applications, selectedIds.size]);

  // Handle bulk stage move
  const handleBulkStageMove = useCallback(
    async (newStage: string) => {
      if (selectedIds.size === 0) return;

      setBulkLoading(true);
      try {
        const res = await fetch("/api/canopy/applications/bulk", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ids: Array.from(selectedIds),
            action: "MOVE_STAGE",
            stage: newStage,
          }),
        });

        if (res.ok) {
          // Refetch to show updated data
          router.refresh();
          setSelectedIds(new Set());
        } else {
          const err = await res.json();
          logger.error("Bulk update failed", { error: err.error });
        }
      } catch (error) {
        logger.error("Error during bulk stage move", { error: formatError(error) });
      } finally {
        setBulkLoading(false);
      }
    },
    [selectedIds, router]
  );

  // Handle bulk reject
  const handleBulkReject = useCallback(async () => {
    if (selectedIds.size === 0) return;

    if (!window.confirm(`Reject ${selectedIds.size} candidates?`)) return;

    setBulkLoading(true);
    try {
      const res = await fetch("/api/canopy/applications/bulk", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: Array.from(selectedIds),
          action: "REJECT",
        }),
      });

      if (res.ok) {
        router.refresh();
        setSelectedIds(new Set());
      } else {
        const err = await res.json();
        logger.error("Bulk reject failed", { error: err.error });
      }
    } catch (error) {
      logger.error("Error during bulk reject", { error: formatError(error) });
    } finally {
      setBulkLoading(false);
    }
  }, [selectedIds, router]);

  // Handle CSV export
  const handleExportCsv = useCallback(() => {
    if (selectedIds.size === 0) return;

    const selected = applications.filter((app) => selectedIds.has(app.id));
    const csv = [
      ["Name", "Email", "Stage", "Match Score", "Source", "Applied Date", "Job Title"],
      ...selected.map((app) => [
        getCandidateName(app),
        getCandidateEmail(app),
        getStage(app),
        app.matchScore?.toString() || "",
        app.source || "",
        formatDate(getAppliedDate(app)),
        getJobTitle(app),
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "candidates.csv";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, [selectedIds, applications]);

  const currentPage = Math.floor(skip / take) + 1;
  const totalPages = Math.ceil(total / take);
  const hasActiveFilters = !!(stage || matchScoreMin !== undefined || matchScoreMax !== undefined || source || search);

  return (
    <div>
      <PageHeader title="Candidates" />

      <div className="px-8 py-6 lg:px-12">
        {/* Filter Section */}
        <div className="mb-6 space-y-4">
          {/* Search & Quick Filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <SearchInput
                placeholder="Search by name or email..."
                value={search || ""}
                onChange={(e) => updateParams({ search: e.target.value || undefined })}
              />
            </div>
            <Dropdown>
              <DropdownTrigger asChild>
                <Button variant="outline">Stage</Button>
              </DropdownTrigger>
              <DropdownContent>
                <DropdownItem value="all" onClick={() => updateParams({ stage: undefined })}>
                  All Stages
                </DropdownItem>
                {["Applied", "Screening", "Interview", "Offer", "Hired"].map((s) => (
                  <DropdownItem
                    key={s}
                    value={s}
                    onClick={() => updateParams({ stage: s })}
                  >
                    {s}
                  </DropdownItem>
                ))}
              </DropdownContent>
            </Dropdown>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={() =>
                  updateParams({
                    stage: undefined,
                    matchScoreMin: undefined,
                    matchScoreMax: undefined,
                    source: undefined,
                    search: undefined,
                  })
                }
              >
                Clear All
              </Button>
            )}
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {stage && (
                <Badge variant="neutral" size="sm">
                  Stage: {stage}
                </Badge>
              )}
              {matchScoreMin !== undefined && (
                <Badge variant="neutral" size="sm">
                  Score ≥ {matchScoreMin}%
                </Badge>
              )}
              {matchScoreMax !== undefined && (
                <Badge variant="neutral" size="sm">
                  Score ≤ {matchScoreMax}%
                </Badge>
              )}
              {source && (
                <Badge variant="neutral" size="sm">
                  Source: {source}
                </Badge>
              )}
              {search && (
                <Badge variant="neutral" size="sm">
                  Search: {search}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <Spinner size="lg" />
          </div>
        )}

        {/* Empty State */}
        {!loading && applications.length === 0 && (
          <div className="rounded-[16px] border border-[var(--border-default)] bg-[var(--card-background)] p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--background-subtle)]">
              <Users size={28} weight="fill" className="text-[var(--foreground-muted)]" />
            </div>
            <p className="text-foreground-default mb-1 text-body font-medium">
              {hasActiveFilters ? "No candidates match your filters" : "No candidates yet"}
            </p>
            <p className="text-caption text-foreground-muted">
              {hasActiveFilters ? "Try adjusting your search criteria." : "Post a role to start receiving applications."}
            </p>
          </div>
        )}

        {/* Candidate Cards */}
        {!loading && applications.length > 0 && (
          <>
            <div className="space-y-3">
              {applications.map((app) => {
                const candidateName = getCandidateName(app);
                const stage = getStage(app);
                const appliedDate = getAppliedDate(app);
                const isSelected = selectedIds.has(app.id);

                return (
                  <div
                    key={app.id}
                    className={cn(
                      "flex flex-col gap-3 rounded-[16px] border transition-shadow sm:flex-row sm:items-center sm:gap-4",
                      isSelected
                        ? "border-[var(--border-brand)] bg-[var(--background-brand-subtle)]"
                        : "border-[var(--border-default)] bg-[var(--card-background)] hover:shadow-card"
                    )}
                  >
                    {/* Checkbox */}
                    <div className="flex items-center gap-3 px-6 py-5">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => toggleSelection(app.id)}
                        aria-label={`Select ${candidateName}`}
                      />
                    </div>

                    {/* Avatar Initials */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primitive-blue-200)] text-caption font-bold text-[var(--primitive-blue-700)]">
                      {candidateName
                        .split(" ")
                        .map((n) => n.charAt(0))
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground-default truncate text-body font-medium">
                        {candidateName}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-foreground-muted">
                        <span className="flex items-center gap-1">
                          <BriefcaseMetal size={12} weight="bold" />
                          {getJobTitle(app)}
                        </span>
                        <span className="flex items-center gap-1">
                          <CalendarBlank size={12} weight="bold" />
                          {formatDate(appliedDate)}
                        </span>
                      </div>
                    </div>

                    {/* Match Score */}
                    {app.matchScore != null && (
                      <div className="flex shrink-0 items-center gap-1.5">
                        <Star
                          size={14}
                          weight="fill"
                          className={cn(
                            app.matchScore >= 80
                              ? "text-[var(--primitive-green-600)]"
                              : app.matchScore >= 50
                                ? "text-[var(--primitive-yellow-500)]"
                                : "text-[var(--primitive-orange-500)]"
                          )}
                        />
                        <span
                          className={cn(
                            "text-caption font-medium",
                            app.matchScore >= 80
                              ? "text-[var(--primitive-green-700)]"
                              : app.matchScore >= 50
                                ? "text-[var(--primitive-yellow-700)]"
                                : "text-[var(--primitive-orange-700)]"
                          )}
                        >
                          {app.matchScore}%
                        </span>
                      </div>
                    )}

                    {/* Stage Badge */}
                    <div className="px-6 py-5">
                      <Badge variant={stageBadgeVariant(stage)} size="sm">
                        {stage.charAt(0).toUpperCase() + stage.slice(1).toLowerCase()}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bulk Actions Bar */}
            {selectedIds.size > 0 && (
              <div className="fixed bottom-6 left-0 right-0 flex items-center justify-center px-4">
                <div className="flex w-full max-w-2xl items-center gap-4 rounded-[16px] border border-[var(--border-default)] bg-[var(--card-background)] p-4 shadow-lg">
                  <div className="flex-1">
                    <p className="text-body font-medium text-[var(--foreground-default)]">
                      {selectedIds.size} candidate{selectedIds.size !== 1 ? "s" : ""} selected
                    </p>
                  </div>

                  <Dropdown>
                    <DropdownTrigger asChild>
                      <Button variant="outline" disabled={bulkLoading}>
                        Move Stage
                      </Button>
                    </DropdownTrigger>
                    <DropdownContent>
                      {["Applied", "Screening", "Interview", "Offer", "Hired"].map((s) => (
                        <DropdownItem
                          key={s}
                          value={s}
                          onClick={() => handleBulkStageMove(s)}
                        >
                          {s}
                        </DropdownItem>
                      ))}
                    </DropdownContent>
                  </Dropdown>

                  <Button
                    variant="outline"
                    onClick={handleExportCsv}
                    disabled={bulkLoading}
                    size="sm"
                  >
                    <Download size={16} />
                    Export
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleBulkReject}
                    disabled={bulkLoading}
                    size="sm"
                    className="text-[var(--foreground-error)]"
                  >
                    <Trash size={16} />
                    Reject
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => setSelectedIds(new Set())}
                    disabled={bulkLoading}
                  >
                    Deselect All
                  </Button>
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                <SimplePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={total}
                  itemsPerPage={take}
                  onPageChange={(page) => updateParams({ skip: ((page - 1) * take).toString() })}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
