"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { SegmentedController } from "@/components/ui/segmented-controller";
import { SearchInput } from "@/components/ui/search-input";
import { KanbanBoard, KanbanColumn, type KanbanStageType } from "@/components/ui/kanban";
import { DndKanbanBoard, type KanbanColumnData } from "@/components/ui/kanban-dnd";
import { useKanbanState, type KanbanItem } from "@/components/ui/kanban-state";
import {
  CandidateCard,
  CandidateKanbanHeader,
  CandidateActivity,
  CandidateReviewers,
  DaysInStage,
  type ReviewerData,
  type DecisionType,
} from "@/components/ui/candidate-card";
import { AddCandidateModal } from "@/components/candidates/AddCandidateModal";
import { CandidatePreviewSheet } from "@/components/candidates/CandidatePreviewSheet";
import {
  Plus,
  Funnel,
  GridFour,
  ListBullets,
  Prohibit,
  UserCirclePlus,
} from "@phosphor-icons/react";
import type { JobData, ApplicationData, ApplicationScoreData } from "../_lib/types";
import { defaultStages } from "../_lib/constants";
import { mapStageToKanbanType } from "../_lib/helpers";

// ============================================
// HELPERS
// ============================================

/** Map DB Recommendation enum to CandidateCard DecisionType */
function mapRecommendation(
  rec: ApplicationScoreData["recommendation"]
): DecisionType {
  switch (rec) {
    case "STRONG_YES":
      return "strong_yes";
    case "YES":
      return "yes";
    case "NO":
    case "STRONG_NO":
      return "no";
    case "NEUTRAL":
    default:
      return "maybe";
  }
}

/** Format a relative time for the last note (e.g., "2h ago", "3d ago") */
function formatNoteTime(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(diffMs / 3600000);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(diffMs / 86400000);
  return `${days}d ago`;
}

/** Format an upcoming interview date (e.g., "Tomorrow, 2pm", "Mon, 10am") */
function formatInterviewDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((d.getTime() - now.getTime()) / 86400000);
  const time = d
    .toLocaleTimeString("en-US", { hour: "numeric", hour12: true })
    .toLowerCase();

  if (diffDays === 0) return `Today, ${time}`;
  if (diffDays === 1) return `Tomorrow, ${time}`;
  const day = d.toLocaleDateString("en-US", { weekday: "short" });
  return `${day}, ${time}`;
}

// ============================================
// TYPES
// ============================================

interface CandidatesTabProps {
  roleId: string;
  jobData: JobData | null;
  applications: ApplicationData[];
  setApplications: React.Dispatch<React.SetStateAction<ApplicationData[]>>;
  onCandidateAdded: (app: ApplicationData) => void;
}

// ============================================
// COMPONENT
// ============================================

export function CandidatesTab({
  roleId,
  jobData,
  applications,
  setApplications,
  onCandidateAdded,
}: CandidatesTabProps) {
  // Local state
  const [candidatesViewMode, setCandidatesViewMode] = React.useState<"grid" | "list">("grid");
  const [candidateSearch, setCandidateSearch] = React.useState("");
  const [addCandidateModalOpen, setAddCandidateModalOpen] = React.useState(false);

  // Candidate preview sheet state
  const [previewSeekerId, setPreviewSeekerId] = React.useState<string | null>(null);

  // Pipeline stages
  const pipelineStages = jobData?.stages?.length ? jobData.stages : defaultStages;

  // Build DndKanbanBoard column definitions
  const kanbanColumns: KanbanColumnData[] = pipelineStages.map((stage) => ({
    id: stage.id,
    title: stage.name,
    stage: mapStageToKanbanType(stage.id),
  }));

  // Stages that are action-based (non-linear) — these candidates
  // don't appear on the Kanban board but are visible in list view
  const SPECIAL_ACTION_STAGES = ["rejected", "talent-pool"];

  // Filter applications by search
  const searchFilteredApplications = candidateSearch
    ? applications.filter(
        (app) =>
          (app.seeker.account.name || "").toLowerCase().includes(candidateSearch.toLowerCase()) ||
          app.seeker.account.email.toLowerCase().includes(candidateSearch.toLowerCase())
      )
    : applications;

  // For the Kanban board, exclude candidates in special action stages
  const kanbanApplications = searchFilteredApplications.filter(
    (app) => !SPECIAL_ACTION_STAGES.includes(app.stage)
  );

  // For list view, show all (including rejected & talent pool)
  const filteredApplications = searchFilteredApplications;

  // Counts for special stages
  const rejectedCount = applications.filter((a) => a.stage === "rejected").length;
  const talentPoolCount = applications.filter((a) => a.stage === "talent-pool").length;

  // Open the candidate preview sheet instead of navigating away
  const openCandidatePreview = React.useCallback((seekerId: string) => {
    setPreviewSeekerId(seekerId);
  }, []);

  // Convert pipeline applications to KanbanItem[] (excludes rejected/talent-pool)
  const kanbanItems: KanbanItem[] = React.useMemo(
    () =>
      kanbanApplications.map((app) => ({
        id: app.id,
        columnId: app.stage,
        content: (() => {
          // Calculate days in current stage
          const daysInStage = Math.floor(
            (Date.now() - new Date(app.updatedAt).getTime()) / 86400000
          );

          // Build reviewer data from scores
          const reviewers: ReviewerData[] = (app.scores ?? []).map(
            (score) => ({
              name: score.scorer.account.name || "Unknown",
              avatarUrl: score.scorer.account.avatar || undefined,
              status: mapRecommendation(score.recommendation),
              rating: score.overallRating,
            })
          );

          // Last note / comment time
          const lastNote = app.seeker.notes?.[0];
          const lastComment = lastNote
            ? formatNoteTime(lastNote.createdAt)
            : undefined;

          // Next scheduled interview
          const nextInterview = app.interviews?.[0];
          const scheduledInterview = nextInterview
            ? formatInterviewDate(nextInterview.scheduledAt)
            : undefined;

          return (
            <CandidateCard
              variant="compact"
              showDragHandle
              onClick={() => openCandidatePreview(app.seeker.id)}
            >
              <CandidateKanbanHeader
                name={app.seeker.account.name || "Unknown"}
                avatarUrl={app.seeker.account.avatar || undefined}
                matchScore={app.matchScore ?? undefined}
                appliedDate={app.createdAt}
              />
              {(lastComment || scheduledInterview) && (
                <CandidateActivity
                  lastComment={lastComment}
                  scheduledInterview={scheduledInterview}
                  className="mt-2"
                />
              )}
              <DaysInStage days={daysInStage} compact className="mt-2" />
              {reviewers.length > 0 && (
                <CandidateReviewers reviewers={reviewers} />
              )}
            </CandidateCard>
          );
        })(),
        data: app,
      })),
    [kanbanApplications, openCandidatePreview]
  );

  // useKanbanState manages optimistic updates + error rollback
  const {
    items: kanbanStateItems,
    handleItemsChange: handleKanbanItemsChange,
    handleDragEnd: handleKanbanDragEnd,
  } = useKanbanState({
    initialItems: kanbanItems,
    onMoveItem: async (itemId, _fromColumnId, toColumnId) => {
      const res = await fetch(`/api/canopy/roles/${roleId}/applications/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: toColumnId, stageOrder: 0 }),
      });
      if (!res.ok) {
        throw new Error("Failed to move candidate");
      }
      // Update local applications state to stay in sync
      setApplications((prev) =>
        prev.map((app) => (app.id === itemId ? { ...app, stage: String(toColumnId) } : app))
      );
    },
  });

  return (
    <>
      <div className="flex flex-1 flex-col">
        {/* Toolbar — Search + Filter + Add + View Toggle */}
        <div className="flex items-center justify-between border-b border-[var(--border-muted)] bg-[var(--background-default)] px-4 py-3">
          <div className="flex items-center gap-3">
            <SearchInput
              placeholder="Search candidates"
              value={candidateSearch}
              onValueChange={setCandidateSearch}
              className="w-64"
            />
            <Button variant="tertiary" size="default">
              <Funnel weight="bold" className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button
              variant="tertiary"
              size="default"
              onClick={() => setAddCandidateModalOpen(true)}
            >
              <Plus weight="bold" className="mr-2 h-4 w-4" />
              Add Candidates
            </Button>
          </div>
          <SegmentedController
            options={[
              { value: "grid", label: "Grid", icon: <GridFour size={16} /> },
              { value: "list", label: "List", icon: <ListBullets size={16} /> },
            ]}
            value={candidatesViewMode}
            onValueChange={(v) => setCandidatesViewMode(v as "grid" | "list")}
          />
        </div>

        {/* Pipeline Kanban Board */}
        {applications.length === 0 ? (
          /* Empty state — column headers + illustration */
          <>
            <KanbanBoard className="flex-none rounded-none border-b border-[var(--border-muted)] pb-0">
              {pipelineStages.map((stage) => (
                <KanbanColumn
                  key={stage.id}
                  title={stage.name}
                  count={0}
                  stage={mapStageToKanbanType(stage.id)}
                  className="min-h-0 w-auto flex-1 [&>div:last-child]:hidden"
                >
                  <></>
                </KanbanColumn>
              ))}
            </KanbanBoard>
            <div className="flex flex-1 items-stretch bg-[var(--background-subtle)]">
              <div className="flex flex-1 items-center px-12 py-6">
                <div className="max-w-md space-y-6">
                  <h2 className="text-heading-lg font-medium text-[var(--foreground-brand-emphasis)]">
                    No candidates Yet.{"\n"}Let&apos;s attract some!
                  </h2>
                  <p className="text-body text-[var(--foreground-brand-emphasis)]">
                    This is where candidates will be once they apply for the role! Sit back, and
                    relax while you wait.
                  </p>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setAddCandidateModalOpen(true)}
                  >
                    <Plus weight="bold" className="mr-2 h-6 w-6" />
                    Add Candidates
                  </Button>
                </div>
              </div>
              <div className="hidden flex-shrink-0 items-center justify-center lg:flex">
                <img
                  src="/illustrations/reading-a-book.svg"
                  alt="Reading a book illustration"
                  className="h-full w-auto object-contain"
                />
              </div>
            </div>
          </>
        ) : (
          /* Populated kanban view — drag-and-drop enabled */
          <DndKanbanBoard
            columns={kanbanColumns}
            items={kanbanStateItems}
            onItemsChange={handleKanbanItemsChange}
            onDragEnd={handleKanbanDragEnd}
            emptyMessage="No candidates"
            className="flex-1 rounded-none pb-0"
            columnClassName="w-auto flex-1"
          />
        )}

        {/* Status bar for non-pipeline candidates */}
        {(rejectedCount > 0 || talentPoolCount > 0) && (
          <div className="flex items-center gap-4 border-t border-[var(--border-muted)] bg-[var(--background-subtle)] px-4 py-2">
            {rejectedCount > 0 && (
              <div className="flex items-center gap-2">
                <Prohibit size={14} className="text-[var(--foreground-error)]" />
                <span className="text-caption text-[var(--foreground-muted)]">
                  {rejectedCount} rejected
                </span>
              </div>
            )}
            {talentPoolCount > 0 && (
              <div className="flex items-center gap-2">
                <UserCirclePlus size={14} className="text-[var(--primitive-yellow-600)]" />
                <span className="text-caption text-[var(--foreground-muted)]">
                  {talentPoolCount} in talent pool
                </span>
              </div>
            )}
            <span className="text-caption text-[var(--foreground-disabled)]">
              · Visible in list view
            </span>
          </div>
        )}
      </div>

      {/* Add Candidate Modal */}
      <AddCandidateModal
        open={addCandidateModalOpen}
        onOpenChange={setAddCandidateModalOpen}
        roleId={roleId}
        onSuccess={onCandidateAdded}
      />

      {/* Candidate Preview Sheet */}
      <CandidatePreviewSheet
        seekerId={previewSeekerId}
        jobId={roleId}
        onClose={() => setPreviewSeekerId(null)}
        onStageChanged={() => {
          // Refresh applications from API to keep kanban in sync
          // The parent component handles re-fetching
          setPreviewSeekerId(null);
        }}
        navigation={(() => {
          if (!previewSeekerId) return undefined;
          // Build ordered list of seekerIds from the kanban
          const seekerIds = kanbanApplications.map((app) => app.seeker.id);
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
    </>
  );
}
