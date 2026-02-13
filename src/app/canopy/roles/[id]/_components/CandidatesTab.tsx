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
import { Toast } from "@/components/ui/toast";
import { BulkActionsToolbar, useSelection, atsBulkActions } from "@/components/ui/bulk-actions";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownValue,
} from "@/components/ui/dropdown";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AddCandidateModal } from "@/components/candidates/AddCandidateModal";
import { CandidatePreviewSheet } from "@/components/candidates/CandidatePreviewSheet";
import { OfferDetailsModal } from "@/components/offers/offer-details-modal";
import { TransitionPromptModal } from "@/components/candidates/TransitionPromptModal";
import { getDeterministicAvatarSrc } from "@/lib/profile/avatar-presets";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { NotificationBadge } from "@/components/ui/notification-badge";
import { usePipelineToast } from "@/hooks/use-pipeline-toast";
import {
  Plus,
  Funnel,
  GridFour,
  ListBullets,
  Prohibit,
  UserCirclePlus,
  GearSix,
  EnvelopeSimple,
  ArrowsDownUp,
  Eye,
  CaretDown,
  Clock,
} from "@phosphor-icons/react";
import Link from "next/link";
import { BulkEmailComposer } from "@/components/canopy/BulkEmailComposer";
import { ScheduledEmailQueue } from "@/components/canopy/ScheduledEmailQueue";
import type { JobData, ApplicationData, ApplicationScoreData } from "../_lib/types";
import { defaultStages } from "../_lib/constants";
import { mapStageToKanbanType } from "../_lib/helpers";
import { logger } from "@/lib/logger";

// ============================================
// CONSTANTS
// ============================================

const REJECTION_REASONS = [
  { value: "not_qualified", label: "Not Qualified" },
  { value: "culture_fit", label: "Culture Fit" },
  { value: "withdrew", label: "Candidate Withdrew" },
  { value: "position_filled", label: "Position Filled" },
  { value: "other", label: "Other" },
] as const;

type RejectionReasonValue = (typeof REJECTION_REASONS)[number]["value"];

const SPECIAL_ACTION_STAGES = ["rejected", "talent-pool"];

// ============================================
// HELPERS
// ============================================

/** Map DB Recommendation enum to CandidateCard DecisionType */
function mapRecommendation(rec: ApplicationScoreData["recommendation"]): DecisionType {
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
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", hour12: true }).toLowerCase();

  if (diffDays === 0) return `Today, ${time}`;
  if (diffDays === 1) return `Tomorrow, ${time}`;
  const day = d.toLocaleDateString("en-US", { weekday: "short" });
  return `${day}, ${time}`;
}

/** Calculate days in stage from updatedAt */
function getDaysInStage(updatedAt: string): number {
  return Math.floor((Date.now() - new Date(updatedAt).getTime()) / 86400000);
}

/** Check if an application has been scored */
function isScored(app: ApplicationData): boolean {
  return (app.scores?.length ?? 0) > 0;
}

// ============================================
// TYPES
// ============================================

type SortMode = "default" | "days-in-stage-asc" | "days-in-stage-desc";
type FilterMode = "all" | "needs-scoring" | "scored";

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
  // -- View state --
  const [candidatesViewMode, setCandidatesViewMode] = React.useState<"grid" | "list">("grid");
  const [candidateSearch, setCandidateSearch] = React.useState("");
  const [addCandidateModalOpen, setAddCandidateModalOpen] = React.useState(false);
  const [sortMode, setSortMode] = React.useState<SortMode>("default");
  const [filterMode, setFilterMode] = React.useState<FilterMode>("all");
  const [filterMenuOpen, setFilterMenuOpen] = React.useState(false);

  // -- Candidate preview sheet state --
  const [previewSeekerId, setPreviewSeekerId] = React.useState<string | null>(null);

  // -- Rejection modal state --
  const [rejectModalOpen, setRejectModalOpen] = React.useState(false);
  const [rejectTargetAppId, setRejectTargetAppId] = React.useState<string | null>(null);
  const [rejectTargetName, setRejectTargetName] = React.useState("");
  const [rejectionReason, setRejectionReason] = React.useState<RejectionReasonValue | "">("");
  const [rejectionNote, setRejectionNote] = React.useState("");
  const [sendRejectionEmail, setSendRejectionEmail] = React.useState(false);
  const [isRejecting, setIsRejecting] = React.useState(false);

  // -- Bulk selection --
  const [bulkMode, setBulkMode] = React.useState(false);
  const selection = useSelection(applications);

  // -- Bulk email modal --
  const [bulkEmailOpen, setBulkEmailOpen] = React.useState(false);

  // -- Scheduled email queue (Story 6.6) --
  const [scheduledQueueOpen, setScheduledQueueOpen] = React.useState(false);

  // -- Offer modal state (triggered by Kanban drag to "offer" stage) --
  const [offerModalOpen, setOfferModalOpen] = React.useState(false);
  const [offerTargetAppId, setOfferTargetAppId] = React.useState<string | null>(null);
  const [offerTargetName, setOfferTargetName] = React.useState("");

  // -- Transition prompt modal state (triggered by Kanban drag to stages with side effects) --
  const [transitionModalOpen, setTransitionModalOpen] = React.useState(false);
  const [transitionTarget, setTransitionTarget] = React.useState<{
    appId: string;
    toStage: string;
    toStageName: string;
    candidateName: string;
    fromStage: string;
  } | null>(null);

  // -- Toast --
  const { toast, showToast, dismissToast, handleUndo } = usePipelineToast();

  // -- Pipeline stages --
  const pipelineStages = jobData?.stages?.length ? jobData.stages : defaultStages;

  // Build DndKanbanBoard column definitions
  const kanbanColumns: KanbanColumnData[] = pipelineStages.map((stage) => ({
    id: stage.id,
    title: stage.name,
    stage: mapStageToKanbanType(stage.id),
  }));

  // ============================================
  // FILTERING & SORTING
  // ============================================

  // Step 1: Search filter
  const searchFilteredApplications = candidateSearch
    ? applications.filter(
        (app) =>
          (app.seeker.account.name || "").toLowerCase().includes(candidateSearch.toLowerCase()) ||
          app.seeker.account.email.toLowerCase().includes(candidateSearch.toLowerCase())
      )
    : applications;

  // Step 2: Scoring filter (Story 5.8)
  const scoringFilteredApplications = React.useMemo(() => {
    if (filterMode === "all") return searchFilteredApplications;
    if (filterMode === "needs-scoring")
      return searchFilteredApplications.filter((app) => !isScored(app));
    if (filterMode === "scored") return searchFilteredApplications.filter((app) => isScored(app));
    return searchFilteredApplications;
  }, [searchFilteredApplications, filterMode]);

  // Step 3: Sort by days-in-stage (Story 5.6)
  const sortedApplications = React.useMemo(() => {
    if (sortMode === "default") return scoringFilteredApplications;
    return [...scoringFilteredApplications].sort((a, b) => {
      const daysA = getDaysInStage(a.updatedAt);
      const daysB = getDaysInStage(b.updatedAt);
      return sortMode === "days-in-stage-desc" ? daysB - daysA : daysA - daysB;
    });
  }, [scoringFilteredApplications, sortMode]);

  // For the Kanban board, exclude candidates in special action stages
  const kanbanApplications = sortedApplications.filter(
    (app) => !SPECIAL_ACTION_STAGES.includes(app.stage)
  );

  // Counts for special stages
  const rejectedCount = applications.filter((a) => a.stage === "rejected").length;
  const talentPoolCount = applications.filter((a) => a.stage === "talent-pool").length;

  // ============================================
  // CANDIDATE PREVIEW
  // ============================================

  const openCandidatePreview = React.useCallback((seekerId: string) => {
    setPreviewSeekerId(seekerId);
  }, []);

  // ============================================
  // REJECTION FLOW (Story 5.5)
  // ============================================

  const openRejectModal = React.useCallback((appId: string, candidateName: string) => {
    setRejectTargetAppId(appId);
    setRejectTargetName(candidateName);
    setRejectionReason("");
    setRejectionNote("");
    setSendRejectionEmail(false);
    setRejectModalOpen(true);
  }, []);

  const handleConfirmReject = React.useCallback(async () => {
    if (!rejectTargetAppId || !rejectionReason) return;

    setIsRejecting(true);
    try {
      const res = await fetch(`/api/canopy/roles/${roleId}/applications/${rejectTargetAppId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: "rejected",
          stageOrder: 0,
          rejectionReason,
          rejectionNote: rejectionNote || undefined,
          sendRejectionEmail,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to reject candidate");
      }

      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          app.id === rejectTargetAppId
            ? { ...app, stage: "rejected", rejectedAt: new Date().toISOString() }
            : app
        )
      );

      setRejectModalOpen(false);
      showToast({
        message: `${rejectTargetName} has been rejected`,
        variant: "warning",
      });
    } catch (err) {
      logger.error("Failed to reject candidate", { error: String(err) });
      showToast({
        message: err instanceof Error ? err.message : "Failed to reject candidate",
        variant: "critical",
      });
    } finally {
      setIsRejecting(false);
    }
  }, [
    rejectTargetAppId,
    rejectionReason,
    rejectionNote,
    sendRejectionEmail,
    roleId,
    setApplications,
    rejectTargetName,
    showToast,
  ]);

  // ============================================
  // EMAIL ACTION (Story 5.4)
  // ============================================

  const openEmailComposer = React.useCallback(
    (email: string, name: string) => {
      const jobTitle = jobData?.title ?? "this role";
      // Open default mail client with pre-populated fields
      const subject = encodeURIComponent(`Re: Your application for ${jobTitle}`);
      const body = encodeURIComponent(
        `Hi ${name},\n\nThank you for your interest in the ${jobTitle} position.\n\n`
      );
      window.open(`mailto:${email}?subject=${subject}&body=${body}`, "_blank");
    },
    [jobData?.title]
  );

  // ============================================
  // BULK MOVE (Story 5.7)
  // ============================================

  const handleBulkAction = React.useCallback(
    async (actionId: string) => {
      const selectedIds = Array.from(selection.selectedIds);

      // Handle "move-to-{stageId}" pattern
      if (actionId.startsWith("move-to-")) {
        const targetStage = actionId.replace("move-to-", "");
        const targetStageName =
          pipelineStages.find((s) => s.id === targetStage)?.name ?? targetStage;

        try {
          const res = await fetch("/api/canopy/applications/bulk", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ids: selectedIds,
              action: "MOVE_STAGE",
              stage: targetStage,
            }),
          });

          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error ?? "Failed to move candidates");
          }

          const result = await res.json();

          // Update local state
          setApplications((prev) =>
            prev.map((app) => (selectedIds.includes(app.id) ? { ...app, stage: targetStage } : app))
          );

          selection.deselectAll();
          setBulkMode(false);
          showToast({
            message: `${result.updated} candidate${result.updated !== 1 ? "s" : ""} moved to ${targetStageName}`,
            variant: "success",
          });
        } catch (err) {
          showToast({
            message: err instanceof Error ? err.message : "Failed to move candidates",
            variant: "critical",
          });
        }
        return;
      }

      // Handle reject
      if (actionId === "reject") {
        try {
          const res = await fetch("/api/canopy/applications/bulk", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ids: selectedIds,
              action: "REJECT",
            }),
          });

          if (!res.ok) throw new Error("Failed to reject candidates");

          const result = await res.json();

          setApplications((prev) =>
            prev.map((app) =>
              selectedIds.includes(app.id)
                ? { ...app, stage: "rejected", rejectedAt: new Date().toISOString() }
                : app
            )
          );

          selection.deselectAll();
          setBulkMode(false);
          showToast({
            message: `${result.updated} candidate${result.updated !== 1 ? "s" : ""} rejected`,
            variant: "warning",
          });
        } catch (err) {
          showToast({
            message: err instanceof Error ? err.message : "Failed to reject candidates",
            variant: "critical",
          });
        }
        return;
      }

      // Handle email — open bulk email composer modal
      if (actionId === "email") {
        setBulkEmailOpen(true);
      }
    },
    [selection, pipelineStages, setApplications, showToast, applications, roleId]
  );

  // Build bulk action menu items
  const bulkActions = React.useMemo(
    () => [
      atsBulkActions.email(),
      atsBulkActions.moveToStage(pipelineStages.map((s) => ({ id: s.id, name: s.name }))),
      atsBulkActions.reject(),
    ],
    [pipelineStages]
  );

  // ============================================
  // TRANSITION PROMPT CONFIRM HANDLER
  // ============================================

  const handleTransitionConfirm = React.useCallback(
    async (selectedActions: string[]) => {
      if (!transitionTarget) return;
      const { appId, toStage, toStageName, candidateName, fromStage } = transitionTarget;
      const fromStageName = pipelineStages.find((s) => s.id === fromStage)?.name ?? fromStage;

      try {
        const res = await fetch(`/api/canopy/roles/${roleId}/applications/${appId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stage: toStage, stageOrder: 0 }),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          throw new Error(errorData?.error || "Failed to move candidate");
        }

        // Update local state
        setApplications((prev) => prev.map((a) => (a.id === appId ? { ...a, stage: toStage } : a)));

        showToast({
          message: `${candidateName} moved to ${toStageName}`,
          variant: "success",
          duration: 5000,
          onUndo: async () => {
            try {
              const undoRes = await fetch(`/api/canopy/roles/${roleId}/applications/${appId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ stage: fromStage, stageOrder: 0 }),
              });
              if (!undoRes.ok) throw new Error("Failed to undo");

              setApplications((prev) =>
                prev.map((a) => (a.id === appId ? { ...a, stage: fromStage } : a))
              );
              showToast({
                message: `${candidateName} moved back to ${fromStageName}`,
                variant: "info",
                duration: 3000,
              });
            } catch {
              showToast({
                message: "Failed to undo move",
                variant: "critical",
                duration: 3000,
              });
            }
          },
        });
      } catch (err) {
        showToast({
          message: err instanceof Error ? err.message : "Failed to move candidate",
          variant: "critical",
        });
      } finally {
        setTransitionTarget(null);
      }
    },
    [transitionTarget, pipelineStages, roleId, setApplications, showToast]
  );

  const handleTransitionCancel = React.useCallback(() => {
    setTransitionTarget(null);
  }, []);

  // ============================================
  // KANBAN ITEMS + DnD (Stories 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.8)
  // ============================================

  const kanbanItems: KanbanItem[] = React.useMemo(
    () =>
      kanbanApplications.map((app) => ({
        id: app.id,
        columnId: app.stage,
        content: (() => {
          const daysInStage = getDaysInStage(app.updatedAt);

          // Build reviewer data from scores
          const reviewers: ReviewerData[] = (app.scores ?? []).map((score) => ({
            name: score.scorer.account.name || "Unknown",
            avatarUrl: score.scorer.account.avatar || undefined,
            status: mapRecommendation(score.recommendation),
            rating: score.overallRating,
          }));

          // Last note / comment time
          const lastNote = app.seeker.notes?.[0];
          const lastComment = lastNote ? formatNoteTime(lastNote.createdAt) : undefined;

          // Next scheduled interview
          const nextInterview = app.interviews?.[0];
          const scheduledInterview = nextInterview
            ? formatInterviewDate(nextInterview.scheduledAt)
            : undefined;

          // Scoring status indicator (Story 5.8)
          const hasScores = isScored(app);

          return (
            <CandidateCard
              variant="compact"
              showDragHandle
              onClick={() => openCandidatePreview(app.seeker.id)}
            >
              <CandidateKanbanHeader
                name={app.seeker.account.name || "Unknown"}
                avatarUrl={
                  app.seeker.account.avatar ||
                  getDeterministicAvatarSrc(
                    app.seeker.account.email || app.seeker.account.name || ""
                  )
                }
                matchScore={app.matchScore ?? undefined}
                appliedDate={app.createdAt}
              />
              {/* Activity + Days in stage row */}
              <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                {(lastComment || scheduledInterview) && (
                  <CandidateActivity
                    lastComment={lastComment}
                    scheduledInterview={scheduledInterview}
                  />
                )}
                <DaysInStage days={daysInStage} compact />
              </div>
              {/* Scoring indicator (Story 5.8) */}
              {!hasScores && (
                <span className="mt-1.5 inline-flex items-center gap-1 text-caption text-[var(--foreground-warning)]">
                  <Eye size={12} weight="bold" />
                  Needs scoring
                </span>
              )}
              {/* Reviewers */}
              {reviewers.length > 0 && <CandidateReviewers reviewers={reviewers} />}
              {/* Quick actions on hover (Stories 5.4, 5.5) */}
              <div className="duration-[var(--duration-fast)] mt-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <SimpleTooltip content="Email candidate">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEmailComposer(
                        app.seeker.account.email,
                        app.seeker.account.name || "Candidate"
                      );
                    }}
                    aria-label="Email candidate"
                  >
                    <EnvelopeSimple size={14} />
                  </Button>
                </SimpleTooltip>
                <SimpleTooltip content="Reject candidate">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      openRejectModal(app.id, app.seeker.account.name || "Unknown");
                    }}
                    aria-label="Reject candidate"
                  >
                    <Prohibit size={14} />
                  </Button>
                </SimpleTooltip>
              </div>
            </CandidateCard>
          );
        })(),
        data: app,
      })),
    [kanbanApplications, openCandidatePreview, openEmailComposer, openRejectModal]
  );

  // useKanbanState manages optimistic updates + error rollback
  const {
    items: kanbanStateItems,
    handleItemsChange: handleKanbanItemsChange,
    handleDragEnd: handleKanbanDragEnd,
  } = useKanbanState({
    initialItems: kanbanItems,
    onMoveItem: async (itemId, fromColumnId, toColumnId) => {
      // Store previous state for undo
      const previousStage = String(fromColumnId);
      const fromStageName =
        pipelineStages.find((s) => s.id === previousStage)?.name ?? previousStage;
      const toStageName =
        pipelineStages.find((s) => s.id === String(toColumnId))?.name ?? String(toColumnId);
      const app = applications.find((a) => a.id === itemId);
      const candidateName = app?.seeker.account.name || "Candidate";

      // Stages that trigger the transition prompt modal (interview, hired)
      // Offer stage has its own dedicated modal, rejected has a dedicated flow too
      const PROMPT_STAGES = ["interview", "hired"];
      if (PROMPT_STAGES.includes(String(toColumnId))) {
        setTransitionTarget({
          appId: String(itemId),
          toStage: String(toColumnId),
          toStageName,
          candidateName,
          fromStage: previousStage,
        });
        setTransitionModalOpen(true);
        // Throw to trigger Kanban rollback — the modal will handle the actual move
        throw new Error("__transition_prompt__");
      }

      const res = await fetch(`/api/canopy/roles/${roleId}/applications/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: toColumnId, stageOrder: 0 }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to move candidate");
      }

      const data = await res.json();

      // Offer stage: API didn't update the DB — open the offer modal instead
      if (data.requiresOfferModal) {
        setOfferTargetAppId(String(itemId));
        setOfferTargetName(candidateName);
        setOfferModalOpen(true);
        // Throw to trigger Kanban rollback (card should stay in its original column)
        throw new Error("__offer_modal__");
      }

      // Update local applications state to stay in sync
      setApplications((prev) =>
        prev.map((a) => (a.id === itemId ? { ...a, stage: String(toColumnId) } : a))
      );

      // Show undo toast (Story 5.2)
      showToast({
        message: `${candidateName} moved to ${toStageName}`,
        variant: "success",
        duration: 5000,
        onUndo: async () => {
          // Revert the move
          try {
            const undoRes = await fetch(`/api/canopy/roles/${roleId}/applications/${itemId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ stage: previousStage, stageOrder: 0 }),
            });
            if (!undoRes.ok) throw new Error("Failed to undo");

            setApplications((prev) =>
              prev.map((a) => (a.id === itemId ? { ...a, stage: previousStage } : a))
            );

            showToast({
              message: `${candidateName} moved back to ${fromStageName}`,
              variant: "info",
              duration: 3000,
            });
          } catch {
            showToast({
              message: "Failed to undo move",
              variant: "critical",
              duration: 3000,
            });
          }
        },
      });
    },
  });

  return (
    <>
      <div className="flex flex-1 flex-col">
        {/* Toolbar — Search + Filter + Sort + Add + Bulk + View Toggle */}
        <div className="flex items-center justify-between border-b border-[var(--border-muted)] bg-[var(--background-default)] px-4 py-3">
          <div className="flex items-center gap-3">
            <SearchInput
              placeholder="Search candidates"
              value={candidateSearch}
              onValueChange={setCandidateSearch}
              className="w-64"
            />

            {/* Filter dropdown (Story 5.8) */}
            <DropdownMenu open={filterMenuOpen} onOpenChange={setFilterMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant={filterMode !== "all" ? "secondary" : "tertiary"} size="default">
                  <Funnel weight="bold" className="mr-2 h-4 w-4" />
                  {filterMode === "all"
                    ? "Filter"
                    : filterMode === "needs-scoring"
                      ? "Needs Scoring"
                      : "Scored"}
                  <CaretDown size={14} className="ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[180px]">
                <DropdownMenuItem
                  onClick={() => {
                    setFilterMode("all");
                    setFilterMenuOpen(false);
                  }}
                  className="flex items-center justify-between"
                >
                  All Candidates
                  {filterMode === "all" && (
                    <span className="text-[var(--foreground-success)]">✓</span>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setFilterMode("needs-scoring");
                    setFilterMenuOpen(false);
                  }}
                  className="flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Eye size={14} className="text-[var(--foreground-warning)]" />
                    Needs Scoring
                  </span>
                  {filterMode === "needs-scoring" && (
                    <span className="text-[var(--foreground-success)]">✓</span>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setFilterMode("scored");
                    setFilterMenuOpen(false);
                  }}
                  className="flex items-center justify-between"
                >
                  Scored
                  {filterMode === "scored" && (
                    <span className="text-[var(--foreground-success)]">✓</span>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort dropdown (Story 5.6) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={sortMode !== "default" ? "secondary" : "tertiary"} size="default">
                  <ArrowsDownUp weight="bold" className="mr-2 h-4 w-4" />
                  {sortMode === "default"
                    ? "Sort"
                    : sortMode === "days-in-stage-desc"
                      ? "Longest in stage"
                      : "Newest in stage"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[200px]">
                <DropdownMenuItem onClick={() => setSortMode("default")}>
                  Default order
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortMode("days-in-stage-desc")}>
                  Longest in stage first
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortMode("days-in-stage-asc")}>
                  Newest in stage first
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="tertiary"
              size="default"
              onClick={() => setAddCandidateModalOpen(true)}
            >
              <Plus weight="bold" className="mr-2 h-4 w-4" />
              Add Candidates
            </Button>

            {/* Bulk select toggle (Story 5.7) */}
            <Button
              variant={bulkMode ? "secondary" : "tertiary"}
              size="default"
              onClick={() => {
                setBulkMode((prev) => !prev);
                if (bulkMode) selection.deselectAll();
              }}
            >
              {bulkMode ? "Cancel Select" : "Select"}
            </Button>

            <SimpleTooltip content="Scheduled emails">
              <Button variant="ghost" size="icon" onClick={() => setScheduledQueueOpen(true)}>
                <Clock size={18} />
              </Button>
            </SimpleTooltip>

            <SimpleTooltip content="Pipeline settings">
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/canopy/roles/${roleId}/pipeline`}>
                  <GearSix size={18} />
                </Link>
              </Button>
            </SimpleTooltip>
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

        {/* Bulk Actions Toolbar (Story 5.7) */}
        {bulkMode && (
          <BulkActionsToolbar
            selectedCount={selection.selectedIds.size}
            totalCount={kanbanApplications.length}
            onSelectAll={selection.selectAll}
            onDeselectAll={selection.deselectAll}
            onAction={handleBulkAction}
            actions={bulkActions}
            selectedIds={Array.from(selection.selectedIds)}
            position="inline"
            showWhenEmpty
          />
        )}

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
                  className="min-h-0 min-w-[300px] [&>div:last-child]:hidden"
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
            className="h-[calc(100vh-180px)] flex-1 rounded-none"
            columnClassName="min-w-[300px]"
          />
        )}

        {/* Status bar for non-pipeline candidates */}
        {(rejectedCount > 0 || talentPoolCount > 0) && (
          <div className="flex items-center gap-4 border-t border-[var(--border-muted)] bg-[var(--background-subtle)] px-4 py-2">
            {rejectedCount > 0 && (
              <div className="flex items-center gap-1.5">
                <Prohibit size={14} className="text-[var(--foreground-error)]" />
                <NotificationBadge count={rejectedCount} variant="count" size="sm" />
                <span className="text-caption text-[var(--foreground-muted)]">rejected</span>
              </div>
            )}
            {talentPoolCount > 0 && (
              <div className="flex items-center gap-1.5">
                <UserCirclePlus size={14} className="text-[var(--primitive-yellow-600)]" />
                <NotificationBadge count={talentPoolCount} variant="count" size="sm" />
                <span className="text-caption text-[var(--foreground-muted)]">in talent pool</span>
              </div>
            )}
            <span className="text-caption text-[var(--foreground-disabled)]">
              · Visible in list view
            </span>
          </div>
        )}
      </div>

      {/* ============================================
          UNDO TOAST (Story 5.2)
          ============================================ */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
          <Toast
            variant={toast.variant}
            dismissible
            onDismiss={dismissToast}
            actionLabel={toast.onUndo ? "Undo" : undefined}
            onAction={toast.onUndo ? handleUndo : undefined}
          >
            {toast.message}
          </Toast>
        </div>
      )}

      {/* ============================================
          REJECTION MODAL (Story 5.5)
          ============================================ */}
      <Modal open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <ModalContent size="default">
          <ModalHeader>
            <ModalTitle>Reject Candidate</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p className="mb-4 text-body-sm text-[var(--foreground-muted)]">
              Are you sure you want to reject{" "}
              <strong className="text-[var(--foreground-default)]">{rejectTargetName}</strong>? This
              will move them to the rejected stage.
            </p>
            <div className="space-y-4">
              {/* Rejection reason dropdown (required) */}
              <div className="space-y-2">
                <Label className="text-caption-strong">
                  Reason <span className="text-[var(--foreground-error)]">*</span>
                </Label>
                <Dropdown
                  value={rejectionReason}
                  onValueChange={(v) => setRejectionReason(v as RejectionReasonValue)}
                >
                  <DropdownTrigger className="w-full">
                    <DropdownValue placeholder="Select a reason..." />
                  </DropdownTrigger>
                  <DropdownContent>
                    {REJECTION_REASONS.map((reason) => (
                      <DropdownItem key={reason.value} value={reason.value}>
                        {reason.label}
                      </DropdownItem>
                    ))}
                  </DropdownContent>
                </Dropdown>
              </div>

              {/* Optional note */}
              <div className="space-y-2">
                <Label className="text-caption-strong">Additional notes (optional)</Label>
                <Textarea
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                  placeholder="Add a note about why this candidate was rejected..."
                  rows={3}
                />
              </div>

              {/* Send rejection email toggle */}
              <div className="flex items-center gap-3">
                <Checkbox
                  id="send-rejection-email"
                  checked={sendRejectionEmail}
                  onCheckedChange={(checked) => setSendRejectionEmail(Boolean(checked))}
                />
                <Label htmlFor="send-rejection-email" className="cursor-pointer text-body-sm">
                  Send rejection email to candidate
                </Label>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="tertiary" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmReject}
              disabled={!rejectionReason || isRejecting}
              loading={isRejecting}
            >
              Reject Candidate
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add Candidate Modal */}
      <AddCandidateModal
        open={addCandidateModalOpen}
        onOpenChange={setAddCandidateModalOpen}
        roleId={roleId}
        onSuccess={onCandidateAdded}
      />

      {/* Bulk Email Composer (Story 6.4) */}
      <BulkEmailComposer
        open={bulkEmailOpen}
        onOpenChange={setBulkEmailOpen}
        applicationIds={Array.from(selection.selectedIds)}
        candidates={applications
          .filter((a) => selection.selectedIds.has(a.id))
          .map((a) => ({
            id: a.id,
            name: a.seeker.account.name || "Candidate",
            email: a.seeker.account.email,
          }))}
        jobTitle={jobData?.title || ""}
        companyName=""
        onSendComplete={() => {
          selection.deselectAll();
          setBulkMode(false);
          setBulkEmailOpen(false);
        }}
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

      {/* Scheduled Email Queue (Story 6.6) */}
      <ScheduledEmailQueue open={scheduledQueueOpen} onOpenChange={setScheduledQueueOpen} />

      {/* Offer Details Modal (triggered by Kanban drag to "offer" stage) */}
      {offerTargetAppId && (
        <OfferDetailsModal
          open={offerModalOpen}
          onOpenChange={(open) => {
            setOfferModalOpen(open);
            if (!open) {
              setOfferTargetAppId(null);
              setOfferTargetName("");
            }
          }}
          applicationId={offerTargetAppId}
          jobTitle={jobData?.title ?? ""}
          candidateName={offerTargetName}
          salaryMin={jobData?.salaryMin}
          salaryMax={jobData?.salaryMax}
          onOfferCreated={() => {
            setOfferModalOpen(false);
            // The offer was created — now move the candidate to the offer stage
            setApplications((prev) =>
              prev.map((a) => (a.id === offerTargetAppId ? { ...a, stage: "offer" } : a))
            );
            setOfferTargetAppId(null);
            setOfferTargetName("");
            showToast({
              message: `Offer created for ${offerTargetName}`,
              variant: "success",
              duration: 3000,
            });
          }}
        />
      )}

      {/* Transition Prompt Modal (triggered by Kanban drag to interview/hired stages) */}
      {transitionTarget && (
        <TransitionPromptModal
          open={transitionModalOpen}
          onOpenChange={(open) => {
            setTransitionModalOpen(open);
            if (!open) setTransitionTarget(null);
          }}
          roleId={roleId}
          applicationId={transitionTarget.appId}
          toStage={transitionTarget.toStage}
          toStageName={transitionTarget.toStageName}
          candidateName={transitionTarget.candidateName}
          onConfirm={handleTransitionConfirm}
          onCancel={handleTransitionCancel}
        />
      )}
    </>
  );
}
