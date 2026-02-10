"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/shell/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SimplePagination } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from "@/components/ui/dropdown";
import {
  EmptyStateNoCandidates,
  EmptyStateNoResults,
  EmptyStateError,
} from "@/components/ui/empty-state";
import {
  Star,
  CalendarBlank,
  BriefcaseMetal,
  Download,
  Info,
  Trash,
  Plus,
} from "@phosphor-icons/react";
import { CandidatePreviewSheet } from "@/components/candidates/CandidatePreviewSheet";
import { AddCandidateModal } from "@/components/candidates/AddCandidateModal";
import { useCandidatesQuery, queryKeys } from "@/hooks/queries";
import type { CandidateApplication, CandidatesListResponse } from "@/hooks/queries";
import { logger, formatError } from "@/lib/logger";

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

function getCandidateName(app: CandidateApplication): string {
  return app.candidate?.name || app.name || "Unknown Candidate";
}

function getCandidateEmail(app: CandidateApplication): string {
  return app.candidate?.email || app.email || "";
}

function getJobTitle(app: CandidateApplication): string {
  return app.job?.title || "Untitled Role";
}

function getStage(app: CandidateApplication): string {
  return app.stage || app.status || "applied";
}

function getAppliedDate(app: CandidateApplication): string | undefined | null {
  return app.submittedAt || app.createdAt;
}

/* -------------------------------------------------------------------
   Main View
   ------------------------------------------------------------------- */

interface CandidatesViewProps {
  initialData: CandidatesListResponse;
}

export function CandidatesView({ initialData }: CandidatesViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // Parse URL params
  const skip = parseInt(searchParams.get("skip") || "0");
  const take = parseInt(searchParams.get("take") || "20");
  const stage = searchParams.get("stage") || undefined;
  const matchScoreMinParam = searchParams.get("matchScoreMin");
  const matchScoreMin = matchScoreMinParam ? parseInt(matchScoreMinParam) : undefined;
  const matchScoreMaxParam = searchParams.get("matchScoreMax");
  const matchScoreMax = matchScoreMaxParam ? parseInt(matchScoreMaxParam) : undefined;
  const source = searchParams.get("source") || undefined;
  const search = searchParams.get("search") || undefined;

  // React Query with initialData — renders instantly from SSR, refetches in background
  const filters = useMemo(
    () => ({ skip, take, stage, matchScoreMin, matchScoreMax, source, search }),
    [skip, take, stage, matchScoreMin, matchScoreMax, source, search]
  );
  const { data: candidatesData, isLoading, error, refetch } = useCandidatesQuery(filters, {
    initialData,
  });

  const applications = candidatesData?.applications ?? [];
  const total = candidatesData?.meta?.total ?? 0;
  const userRole = candidatesData?.userRole ?? null;

  // UI state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const previewParam = searchParams.get("preview");
  const [previewSeekerId, setPreviewSeekerIdRaw] = useState<string | null>(previewParam);
  const [addCandidateModalOpen, setAddCandidateModalOpen] = useState(false);

  // Sync preview param ↔ URL (shallow — no server re-render)
  const setPreviewSeekerId = useCallback(
    (id: string | null) => {
      setPreviewSeekerIdRaw(id);
      const params = new URLSearchParams(searchParams.toString());
      if (id) {
        params.set("preview", id);
      } else {
        params.delete("preview");
      }
      router.replace(`/canopy/candidates?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

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
          setSelectedIds(new Set());
          queryClient.invalidateQueries({ queryKey: queryKeys.canopy.candidates.all });
          queryClient.invalidateQueries({ queryKey: queryKeys.canopy.dashboard.all });
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
    [selectedIds, queryClient]
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
        setSelectedIds(new Set());
        queryClient.invalidateQueries({ queryKey: queryKeys.canopy.candidates.all });
        queryClient.invalidateQueries({ queryKey: queryKeys.canopy.dashboard.all });
      } else {
        const err = await res.json();
        logger.error("Bulk reject failed", { error: err.error });
      }
    } catch (error) {
      logger.error("Error during bulk reject", { error: formatError(error) });
    } finally {
      setBulkLoading(false);
    }
  }, [selectedIds, queryClient]);

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
  const hasActiveFilters = !!(
    stage ||
    matchScoreMin !== undefined ||
    matchScoreMax !== undefined ||
    source ||
    search
  );

  // Only show skeleton on first load (no cached data yet)
  const isFirstLoad = isLoading && applications.length === 0;

  return (
    <div>
      <PageHeader
        title="Candidates"
        actions={
          <Button onClick={() => setAddCandidateModalOpen(true)}>
            <Plus weight="bold" className="mr-2 h-4 w-4" />
            Add Candidate
          </Button>
        }
      />

      {/* Scoped-access banner for HIRING_MANAGER / MEMBER */}
      {(userRole === "HIRING_MANAGER" || userRole === "MEMBER") && (
        <div className="mx-8 mt-6 flex items-start gap-3 rounded-[var(--radius-lg)] border border-[var(--border-info)] bg-[var(--background-info)] px-4 py-3 lg:mx-12">
          <Info size={18} weight="fill" className="mt-0.5 shrink-0 text-[var(--foreground-info)]" />
          <p className="text-caption text-[var(--foreground-info)]">
            Showing candidates for your assigned roles only. Contact an admin to adjust your role
            assignments.
          </p>
        </div>
      )}

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
                  <DropdownItem key={s} value={s} onClick={() => updateParams({ stage: s })}>
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
                  Score &ge; {matchScoreMin}%
                </Badge>
              )}
              {matchScoreMax !== undefined && (
                <Badge variant="neutral" size="sm">
                  Score &le; {matchScoreMax}%
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

        {/* Loading Skeletons — only on first load (no cached data) */}
        {isFirstLoad && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--card-background)] px-6 py-5"
              >
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-64" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isFirstLoad && error && (
          <EmptyStateError
            size="lg"
            action={{
              label: "Retry",
              onClick: () => refetch(),
            }}
          />
        )}

        {/* Empty State */}
        {!isFirstLoad &&
          !error &&
          applications.length === 0 &&
          (hasActiveFilters ? (
            <EmptyStateNoResults
              size="lg"
              action={{
                label: "Clear Filters",
                onClick: () =>
                  updateParams({
                    stage: undefined,
                    matchScoreMin: undefined,
                    matchScoreMax: undefined,
                    source: undefined,
                    search: undefined,
                  }),
              }}
            />
          ) : (
            <EmptyStateNoCandidates
              size="lg"
              branded
              description="Add candidates manually or post a role to start receiving applications."
              action={{
                label: "Add Candidate",
                onClick: () => setAddCandidateModalOpen(true),
              }}
              secondaryAction={{
                label: "Post a Role",
                onClick: () => router.push("/canopy/roles"),
              }}
            />
          ))}

        {/* Candidate Cards */}
        {!isFirstLoad && !error && applications.length > 0 && (
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

                    {/* Clickable area — opens candidate preview sheet */}
                    <button
                      type="button"
                      className="flex min-w-0 flex-1 items-center gap-4 py-5 text-left transition-colors hover:opacity-80"
                      onClick={() => app.seekerId && setPreviewSeekerId(app.seekerId)}
                      aria-label={`Preview ${candidateName}`}
                    >
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
                    </button>

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
                        <DropdownItem key={s} value={s} onClick={() => handleBulkStageMove(s)}>
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

      {/* Candidate Preview Sheet */}
      <CandidatePreviewSheet
        seekerId={previewSeekerId}
        onClose={() => setPreviewSeekerId(null)}
        navigation={(() => {
          if (!previewSeekerId) return undefined;
          const seekerIds = applications
            .map((app) => app.seekerId)
            .filter((id): id is string => !!id);
          const currentIdx = seekerIds.indexOf(previewSeekerId);
          if (currentIdx === -1) return undefined;
          return {
            hasPrevious: currentIdx > 0,
            hasNext: currentIdx < seekerIds.length - 1,
            onPrevious: () => setPreviewSeekerId(seekerIds[currentIdx - 1]),
            onNext: () => setPreviewSeekerId(seekerIds[currentIdx + 1]),
            currentIndex: currentIdx,
            totalCount: seekerIds.length,
          };
        })()}
      />

      {/* Add Candidate Modal (global — no roleId pre-selected) */}
      <AddCandidateModal
        open={addCandidateModalOpen}
        onOpenChange={setAddCandidateModalOpen}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: queryKeys.canopy.candidates.all });
          queryClient.invalidateQueries({ queryKey: queryKeys.canopy.dashboard.all });
        }}
      />
    </div>
  );
}
