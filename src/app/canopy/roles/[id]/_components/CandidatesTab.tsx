"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SegmentedController } from "@/components/ui/segmented-controller";
import { SearchInput } from "@/components/ui/search-input";
import { KanbanBoard, KanbanColumn, type KanbanStageType } from "@/components/ui/kanban";
import { DndKanbanBoard, type KanbanColumnData } from "@/components/ui/kanban-dnd";
import { useKanbanState, type KanbanItem } from "@/components/ui/kanban-state";
import {
  CandidateCard,
  CandidateKanbanHeader,
  CandidateTags,
  DaysInStage,
} from "@/components/ui/candidate-card";
import { AddCandidateModal } from "@/components/candidates/AddCandidateModal";
import { Plus, Funnel, GridFour, ListBullets } from "@phosphor-icons/react";
import type { JobData, ApplicationData } from "../_lib/types";
import { defaultStages } from "../_lib/constants";
import { mapStageToKanbanType } from "../_lib/helpers";

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
  const router = useRouter();

  // Local state
  const [candidatesViewMode, setCandidatesViewMode] = React.useState<"grid" | "list">("grid");
  const [candidateSearch, setCandidateSearch] = React.useState("");
  const [addCandidateModalOpen, setAddCandidateModalOpen] = React.useState(false);

  // Pipeline stages
  const pipelineStages = jobData?.stages?.length ? jobData.stages : defaultStages;

  // Build DndKanbanBoard column definitions
  const kanbanColumns: KanbanColumnData[] = pipelineStages.map((stage) => ({
    id: stage.id,
    title: stage.name,
    stage: mapStageToKanbanType(stage.id),
  }));

  // Filter applications by search
  const filteredApplications = candidateSearch
    ? applications.filter(
        (app) =>
          (app.seeker.account.name || "").toLowerCase().includes(candidateSearch.toLowerCase()) ||
          app.seeker.account.email.toLowerCase().includes(candidateSearch.toLowerCase())
      )
    : applications;

  // Stable navigation callback — router reference changes every render in Next.js,
  // so we must NOT include it in useMemo/useCallback dependency arrays.
  const navigateToCandidate = React.useCallback(
    (seekerId: string) => {
      router.push(`/canopy/candidates/${seekerId}`);
    },
    // router is stable for the lifetime of the component in practice
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Convert applications to KanbanItem[]
  const kanbanItems: KanbanItem[] = React.useMemo(
    () =>
      filteredApplications.map((app) => ({
        id: app.id,
        columnId: app.stage,
        content: (() => {
          // Build tags from skills, greenSkills, and certifications
          const tags = [
            ...app.seeker.greenSkills.map((s) => ({ label: s, variant: "green" as const })),
            ...app.seeker.certifications.map((c) => ({ label: c, variant: "blue" as const })),
            ...app.seeker.skills.map((s) => ({ label: s, variant: "default" as const })),
          ];

          // Calculate days in current stage
          const daysInStage = Math.floor(
            (Date.now() - new Date(app.updatedAt).getTime()) / 86400000
          );

          return (
            <CandidateCard
              variant="compact"
              showDragHandle
              onClick={() => navigateToCandidate(app.seeker.id)}
            >
              <CandidateKanbanHeader
                name={app.seeker.account.name || "Unknown"}
                avatarUrl={app.seeker.account.avatar || undefined}
                matchScore={app.matchScore ?? undefined}
                appliedDate={app.createdAt}
              />
              {tags.length > 0 && <CandidateTags tags={tags} maxVisible={2} className="mt-2" />}
              <DaysInStage days={daysInStage} compact className="mt-2" />
            </CandidateCard>
          );
        })(),
        data: app,
      })),
    [filteredApplications, navigateToCandidate]
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
        <div className="flex items-center justify-between border-b border-[var(--border-muted)] bg-[var(--background-default)] px-6 py-4">
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
      </div>

      {/* Add Candidate Modal */}
      <AddCandidateModal
        open={addCandidateModalOpen}
        onOpenChange={setAddCandidateModalOpen}
        roleId={roleId}
        onSuccess={onCandidateAdded}
      />
    </>
  );
}
