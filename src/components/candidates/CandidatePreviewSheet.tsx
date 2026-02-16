"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Recommendation } from "@prisma/client";

// UI
import { Button } from "@/components/ui/button";
import { Banner } from "@/components/ui/banner";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { SimpleTooltip } from "@/components/ui/tooltip";

// Icons
import {
  X,
  ArrowCircleRight,
  ArrowsOut,
  ArrowsIn,
  Prohibit,
  UserCirclePlus,
  ChatCircleDots,
  CheckCircle,
  CaretUp,
  CaretDown,
  ClockCounterClockwise,
  ListChecks,
  CalendarPlus,
  EnvelopeSimple,
  DotsThreeVertical,
} from "@phosphor-icons/react";

// Sub-components
import { CandidateProfileHeader } from "./CandidateProfileHeader";
import { HiringStagesSection } from "./HiringStagesSection";
import { DocumentsSection } from "./DocumentsSection";
import { ContactInfoSection } from "./ContactInfoSection";
import { AboutSection } from "./AboutSection";
import { AISummarySection } from "./AISummarySection";
import { SkillsCertificationsSection } from "./SkillsCertificationsSection";
import { CommentsPanel } from "./CommentsPanel";
import { TodoPanel } from "./TodoPanel";
import { HistoryPanel } from "./HistoryPanel";
import { ApplicationReviewPanel } from "./ApplicationReviewPanel";
import { OfferManagementSection } from "./OfferManagementSection";
import { InterviewsSection } from "./InterviewsSection";
import { EmailThreadSection } from "./EmailThreadSection";
import { StageGateModal } from "./StageGateModal";
import { InterviewSchedulingModal } from "@/components/ui/interview-scheduling-modal";
import { OfferDetailsModal } from "@/components/offers/offer-details-modal";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownValue,
} from "@/components/ui/dropdown";

// Split button
import { SplitButton } from "@/components/ui/split-button";

// Email dialog
import { CandidateEmailDialog } from "@/app/canopy/roles/[id]/_components/CandidateEmailDialog";

// Shell
import { useSidebar } from "@/components/shell/sidebar-context";

// React Query
import { useCandidateDetailQuery, queryKeys } from "@/hooks/queries";
import { logger, formatError } from "@/lib/logger";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------
   Rejection Reasons
   ------------------------------------------------------------------- */

const REJECTION_REASONS = [
  { value: "not_qualified", label: "Not Qualified" },
  { value: "culture_fit", label: "Culture Fit" },
  { value: "withdrew", label: "Candidate Withdrew" },
  { value: "position_filled", label: "Position Filled" },
  { value: "other", label: "Other" },
] as const;

type RejectionReasonValue = (typeof REJECTION_REASONS)[number]["value"];

/* -------------------------------------------------------------------
   Types (mirrors the API response shape)
   ------------------------------------------------------------------- */

interface ScorerInfo {
  id: string;
  account: { name: string | null; avatar: string | null };
}

interface ScoreData {
  id: string;
  overallRating: number;
  recommendation: Recommendation;
  comments: string | null;
  createdAt: Date;
  scorer: ScorerInfo;
}

interface OfferData {
  id: string;
  status: string;
  salary: number | null;
  salaryCurrency: string;
  startDate: string | Date;
  department: string | null;
  signingMethod: string;
  sentAt: string | Date | null;
  viewedAt: string | Date | null;
  signedAt: string | Date | null;
  withdrawnAt: string | Date | null;
  createdAt: string | Date;
}

interface InterviewData {
  id: string;
  scheduledAt: string | Date;
  duration: number;
  type: string;
  location: string | null;
  meetingLink: string | null;
  status: string;
  notes: string | null;
  completedAt: string | Date | null;
  cancelledAt: string | Date | null;
  createdAt: string | Date;
  interviewer: {
    account: { name: string | null; avatar: string | null };
  };
}

interface ApplicationData {
  id: string;
  stage: string;
  stageOrder: number;
  matchScore: number | null;
  source: string | null;
  createdAt: Date;
  rejectedAt: Date | null;
  hiredAt: Date | null;
  job: {
    id: string;
    title: string;
    stages: string;
    climateCategory?: string | null;
  };
  scores: ScoreData[];
  offer?: OfferData | null;
  interviews?: InterviewData[];
}

interface NoteData {
  id: string;
  content: string;
  mentions: string[];
  createdAt: Date;
  orgMemberAuthor: {
    account: { name: string | null; avatar: string | null };
  } | null;
}

interface SeekerData {
  id: string;
  resumeUrl: string | null;
  skills: string[];
  greenSkills: string[];
  certifications: string[];
  yearsExperience: number | null;
  aiSummary: string | null;
  account: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
    phone: string | null;
    location: string | null;
    pronouns: string | null;
    linkedinUrl: string | null;
  };
  applications: ApplicationData[];
  notes: NoteData[];
}

/* -------------------------------------------------------------------
   Panel Types
   ------------------------------------------------------------------- */

type PanelType = "review" | "comments" | "todo" | "history" | null;

/* -------------------------------------------------------------------
   Props
   ------------------------------------------------------------------- */

interface CandidatePreviewSheetProps {
  /** The seeker ID to preview (null = closed) */
  seekerId: string | null;
  /** Specific job ID to focus the application on */
  jobId?: string;
  /** Close the sheet */
  onClose: () => void;
  /** Called after a stage change so parent can refresh its data */
  onStageChanged?: () => void;
  /** Navigation context for prev/next */
  navigation?: {
    hasPrevious: boolean;
    hasNext: boolean;
    onPrevious: () => void;
    onNext: () => void;
    currentIndex?: number;
    totalCount?: number;
  };
}

/* -------------------------------------------------------------------
   Component
   ------------------------------------------------------------------- */

export function CandidatePreviewSheet({
  seekerId,
  jobId,
  onClose,
  onStageChanged,
  navigation,
}: CandidatePreviewSheetProps) {
  const queryClient = useQueryClient();
  const { collapsed } = useSidebar();
  const isOpen = seekerId !== null;

  // --- React Query data fetching (cached, instant on re-open) ---
  const {
    data: queryResult,
    isLoading: loading,
    error: queryError,
  } = useCandidateDetailQuery(seekerId);
  const seeker = (queryResult?.data as unknown as SeekerData) ?? null;
  const orgMemberId = queryResult?.orgMemberId ?? null;
  const error = queryError ? (queryError as Error).message : null;

  // --- Action state ---
  const [isActionLoading, setIsActionLoading] = React.useState(false);
  const [optimisticStage, setOptimisticStage] = React.useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = React.useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);

  // --- Modals & menus ---
  const [overflowOpen, setOverflowOpen] = React.useState(false);
  const [interviewModalOpen, setInterviewModalOpen] = React.useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = React.useState(false);
  const [rejectModalOpen, setRejectModalOpen] = React.useState(false);
  const [rejectReason, setRejectReason] = React.useState<RejectionReasonValue | "">("");
  const [rejectNote, setRejectNote] = React.useState("");
  const [sendRejectEmail, setSendRejectEmail] = React.useState(false);
  const [offerModalOpen, setOfferModalOpen] = React.useState(false);

  // --- Stage gate modal ---
  const [gateModalOpen, setGateModalOpen] = React.useState(false);
  const [gateBlockers, setGateBlockers] = React.useState<
    Array<{ action: string; message: string; metadata?: Record<string, unknown> }>
  >([]);
  const [gateBlockedStageName, setGateBlockedStageName] = React.useState("");

  // --- Panels ---
  const [panelType, setPanelType] = React.useState<PanelType>(null);
  const [reviewStageId, setReviewStageId] = React.useState<string | null>(null);
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Reset state when seekerId changes
  React.useEffect(() => {
    setPanelType(null);
    setReviewStageId(null);
    setOptimisticStage(null);
    setActionFeedback(null);
    setIsExpanded(false);
    setInterviewModalOpen(false);
    setRejectModalOpen(false);
    setRejectReason("");
    setRejectNote("");
    setSendRejectEmail(false);
    setOfferModalOpen(false);
  }, [seekerId]);

  // Clear feedback after 4s
  React.useEffect(() => {
    if (!actionFeedback) return;
    const timer = setTimeout(() => setActionFeedback(null), 4000);
    return () => clearTimeout(timer);
  }, [actionFeedback]);

  // --- Derived data ---
  const activeApp = React.useMemo(() => {
    if (!seeker) return null;
    if (jobId) {
      return seeker.applications.find((a) => a.job.id === jobId) ?? seeker.applications[0];
    }
    return seeker.applications[0];
  }, [seeker, jobId]);

  const jobStages = React.useMemo(() => {
    if (!activeApp) return [];
    try {
      return JSON.parse(activeApp.job.stages) as Array<{
        id: string;
        name: string;
        config?: {
          requiredScorecards?: number;
          requiredInterviews?: number;
          scorecardTemplateId?: string;
          requiresEmail?: boolean;
        };
      }>;
    } catch {
      return [{ id: "applied", name: "Applied" }];
    }
  }, [activeApp]);

  const displayStage = optimisticStage ?? activeApp?.stage ?? "applied";

  // Derive scorecard template override from stage config (if configured)
  const currentStageScorecardTemplate = React.useMemo(() => {
    const stageDef = jobStages.find((s) => s.id === displayStage);
    return stageDef?.config?.scorecardTemplateId;
  }, [jobStages, displayStage]);

  const averageScore = React.useMemo(() => {
    if (!activeApp || activeApp.scores.length === 0) return null;
    const sum = activeApp.scores.reduce((acc, s) => acc + s.overallRating, 0);
    return sum / activeApp.scores.length;
  }, [activeApp]);

  const candidateName = seeker?.account.name ?? "Unknown";

  const documentFiles = React.useMemo(() => {
    if (!seeker?.resumeUrl) return [];
    try {
      const pathname = new URL(seeker.resumeUrl).pathname;
      const parts = pathname.split("/");
      const name = decodeURIComponent(parts[parts.length - 1] || "Resume");
      return [
        {
          name,
          url: seeker.resumeUrl,
          type: name.toLowerCase().endsWith(".pdf") ? ("pdf" as const) : ("doc" as const),
        },
      ];
    } catch {
      return [{ name: "Resume", url: seeker.resumeUrl, type: "doc" as const }];
    }
  }, [seeker?.resumeUrl]);

  const isTerminalStage =
    displayStage === "rejected" || displayStage === "talent-pool" || displayStage === "hired";

  // --- Panel toggle handlers ---
  const togglePanel = (type: Exclude<PanelType, null>) => {
    if (panelType === type) {
      setPanelType(null);
      if (type === "review") setReviewStageId(null);
    } else {
      setPanelType(type);
      if (type !== "review") setReviewStageId(null);
      setIsExpanded(true);
    }
  };

  const handleOpenReview = (stageId: string) => {
    setReviewStageId(stageId);
    setPanelType("review");
    setIsExpanded(true);
  };

  const handleClosePanel = () => {
    setPanelType(null);
    setReviewStageId(null);
  };

  // --- Actions ---
  const moveToStage = React.useCallback(
    async (newStage: string, label: string) => {
      if (!activeApp) return;
      setIsActionLoading(true);
      setOptimisticStage(newStage);
      setActionFeedback(null);

      try {
        const res = await fetch(
          `/api/canopy/roles/${activeApp.job.id}/applications/${activeApp.id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ stage: newStage, stageOrder: 0 }),
          }
        );

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));

          // Stage gate blocked — show the gate modal
          if (data?.blocked && data?.blockers) {
            setOptimisticStage(null);
            setGateBlockers(data.blockers);
            setGateBlockedStageName(displayStage);
            setGateModalOpen(true);
            return;
          }

          throw new Error(data.error ?? `Failed to move candidate to ${label}`);
        }

        setActionFeedback({
          type: newStage === "rejected" ? "warning" : "success",
          message: `Candidate moved to ${label}`,
        });

        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: queryKeys.canopy.candidates.all });
        queryClient.invalidateQueries({ queryKey: queryKeys.canopy.dashboard.all });
        onStageChanged?.();
      } catch (err) {
        setOptimisticStage(null);
        setActionFeedback({
          type: "error",
          message: err instanceof Error ? err.message : "Failed to move candidate",
        });
        logger.error("Failed to move candidate stage", { error: formatError(err) });
      } finally {
        setIsActionLoading(false);
      }
    },
    [activeApp, onStageChanged, queryClient, displayStage]
  );

  const handleReject = React.useCallback(() => {
    setRejectReason("");
    setRejectNote("");
    setSendRejectEmail(false);
    setRejectModalOpen(true);
  }, []);

  const handleConfirmReject = React.useCallback(async () => {
    if (!activeApp || !rejectReason) return;
    setRejectModalOpen(false);
    setIsActionLoading(true);
    setOptimisticStage("rejected");
    setActionFeedback(null);

    try {
      const res = await fetch(
        `/api/canopy/roles/${activeApp.job.id}/applications/${activeApp.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stage: "rejected",
            stageOrder: 0,
            rejectionReason: rejectReason,
            rejectionNote: rejectNote || undefined,
            sendRejectionEmail: sendRejectEmail,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to reject candidate");
      }

      setActionFeedback({ type: "warning", message: "Candidate rejected" });
      queryClient.invalidateQueries({ queryKey: queryKeys.canopy.candidates.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.canopy.dashboard.all });
      onStageChanged?.();
    } catch (err) {
      setOptimisticStage(null);
      setActionFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to reject candidate",
      });
      logger.error("Failed to reject candidate", { error: formatError(err) });
    } finally {
      setIsActionLoading(false);
    }
  }, [activeApp, rejectReason, rejectNote, sendRejectEmail, queryClient, onStageChanged]);
  const handleSaveToTalentPool = React.useCallback(
    () => moveToStage("talent-pool", "Talent Pool"),
    [moveToStage]
  );
  const handleQualify = React.useCallback(
    () => moveToStage("qualified", "Qualified"),
    [moveToStage]
  );

  // Determine dynamic sheet size
  const sheetSize = isExpanded ? "full" : "2xl";

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent
          side="right"
          size={sheetSize}
          hideClose
          className={cn(
            "flex flex-col gap-0 overflow-hidden p-0 transition-[max-width] duration-300 ease-in-out",
            isExpanded &&
              (collapsed ? "lg:max-w-[calc(100vw-72px)]" : "lg:max-w-[calc(100vw-280px)]")
          )}
        >
          {/* Accessible title (hidden visually) */}
          <SheetTitle className="sr-only">
            {loading ? "Loading candidate..." : `${candidateName} - Candidate Preview`}
          </SheetTitle>

          {/* ── Header bar ── */}
          <div className="flex shrink-0 items-center justify-between border-b border-[var(--border-muted)] px-6 py-4">
            <div className="flex items-center gap-3">
              {/* Close — no tooltip to avoid auto-show on focus when sheet opens */}
              <Button variant="outline" size="icon-sm" onClick={onClose} aria-label="Close">
                <X size={20} weight="bold" />
              </Button>

              {/* Prev/Next navigation — split button */}
              {navigation && (
                <>
                  <SplitButton
                    variant="outline"
                    leftIcon={<CaretUp size={16} weight="bold" />}
                    rightIcon={<CaretDown size={16} weight="bold" />}
                    onPrimaryClick={navigation.onPrevious}
                    onSecondaryClick={navigation.onNext}
                    disabled={!navigation.hasPrevious && !navigation.hasNext}
                    aria-label="Navigate candidates"
                    className="[&_button]:p-2"
                  />
                  {navigation.currentIndex !== undefined && navigation.totalCount !== undefined && (
                    <span className="text-caption text-[var(--foreground-subtle)]">
                      {navigation.currentIndex + 1} of {navigation.totalCount}
                    </span>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Expand / collapse */}
              <SimpleTooltip content={isExpanded ? "Collapse" : "Expand"}>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => setIsExpanded((prev) => !prev)}
                  aria-label={isExpanded ? "Collapse sheet" : "Expand sheet"}
                >
                  {isExpanded ? (
                    <ArrowsIn size={20} weight="bold" />
                  ) : (
                    <ArrowsOut size={20} weight="bold" />
                  )}
                </Button>
              </SimpleTooltip>

              {/* Panel toggles */}
              {seeker && (
                <>
                  <SimpleTooltip content="Comments">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => togglePanel("comments")}
                      aria-label="Toggle comments"
                      data-selected={panelType === "comments" ? "true" : undefined}
                    >
                      <ChatCircleDots size={20} weight="bold" />
                    </Button>
                  </SimpleTooltip>
                  <SimpleTooltip content="History">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => togglePanel("history")}
                      aria-label="Toggle history"
                      data-selected={panelType === "history" ? "true" : undefined}
                    >
                      <ClockCounterClockwise size={20} weight="bold" />
                    </Button>
                  </SimpleTooltip>
                  <SimpleTooltip content="Todo">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => togglePanel("todo")}
                      aria-label="Toggle todo"
                      data-selected={panelType === "todo" ? "true" : undefined}
                    >
                      <ListChecks size={20} weight="bold" />
                    </Button>
                  </SimpleTooltip>
                </>
              )}

              {/* Stage actions */}
              {activeApp && !isTerminalStage && (
                <>
                  {/* Move to stage */}
                  <DropdownMenu>
                    <SimpleTooltip content="Move to stage">
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon-sm"
                          aria-label="Move to stage"
                          disabled={isActionLoading}
                        >
                          <ArrowCircleRight size={20} weight="bold" />
                        </Button>
                      </DropdownMenuTrigger>
                    </SimpleTooltip>
                    <DropdownMenuContent align="end" className="min-w-[180px]">
                      {jobStages.map((stage) => (
                        <DropdownMenuItem
                          key={stage.id}
                          onClick={() => {
                            if (stage.id === "offer") {
                              setOfferModalOpen(true);
                            } else {
                              moveToStage(stage.id, stage.name);
                            }
                          }}
                          disabled={stage.id === displayStage}
                          className="flex items-center justify-between gap-2"
                        >
                          <span>{stage.name}</span>
                          {stage.id === displayStage && (
                            <CheckCircle
                              size={16}
                              weight="fill"
                              className="text-[var(--foreground-success)]"
                            />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Reject + Overflow SplitButton */}
                  <DropdownMenu open={overflowOpen} onOpenChange={setOverflowOpen}>
                    <DropdownMenuTrigger asChild>
                      <div className="inline-flex">
                        <SplitButton
                          variant="outline"
                          leftIcon={
                            <Prohibit
                              size={20}
                              weight="bold"
                              className="text-[var(--primitive-red-500)]"
                            />
                          }
                          rightIcon={<DotsThreeVertical size={20} weight="bold" />}
                          onPrimaryClick={(e) => {
                            e.stopPropagation();
                            handleReject();
                          }}
                          onSecondaryClick={(e) => {
                            e.stopPropagation();
                            setOverflowOpen((prev) => !prev);
                          }}
                          disabled={isActionLoading}
                          secondarySelected={overflowOpen}
                          className="[&_button]:p-2"
                        />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-[200px]">
                      {seeker && (
                        <DropdownMenuItem
                          onClick={() => {
                            setOverflowOpen(false);
                            setEmailDialogOpen(true);
                          }}
                          className="flex items-center gap-2"
                        >
                          <EnvelopeSimple size={16} />
                          <span>Email Candidate</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => {
                          setOverflowOpen(false);
                          setInterviewModalOpen(true);
                        }}
                        className="flex items-center gap-2"
                      >
                        <CalendarPlus size={16} />
                        <span>
                          {activeApp?.interviews?.some((i) => i.status === "SCHEDULED")
                            ? "Schedule Another Interview"
                            : "Schedule Interview"}
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleSaveToTalentPool}
                        className="flex items-center gap-2"
                      >
                        <UserCirclePlus size={16} />
                        <span>Save to Talent Pool</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}

              {/* Terminal stage: standalone overflow dropdown (no reject/move actions) */}
              {activeApp && isTerminalStage && (
                <DropdownMenu>
                  <SimpleTooltip content="More actions">
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        aria-label="More actions"
                        disabled={isActionLoading}
                      >
                        <DotsThreeVertical size={20} weight="bold" />
                      </Button>
                    </DropdownMenuTrigger>
                  </SimpleTooltip>
                  <DropdownMenuContent align="end" className="min-w-[200px]">
                    {seeker && (
                      <DropdownMenuItem
                        onClick={() => setEmailDialogOpen(true)}
                        className="flex items-center gap-2"
                      >
                        <EnvelopeSimple size={16} />
                        <span>Email Candidate</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => setInterviewModalOpen(true)}
                      className="flex items-center gap-2"
                    >
                      <CalendarPlus size={16} />
                      <span>Schedule Interview</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {/* Move to stage — allow moving out of terminal */}
                    {jobStages.map((stage) => (
                      <DropdownMenuItem
                        key={stage.id}
                        onClick={() => {
                          if (stage.id === "offer") {
                            setOfferModalOpen(true);
                          } else {
                            moveToStage(stage.id, stage.name);
                          }
                        }}
                        disabled={stage.id === displayStage}
                        className="flex items-center justify-between gap-2"
                      >
                        <span className="flex items-center gap-2">
                          <ArrowCircleRight size={16} className="text-[var(--foreground-subtle)]" />
                          <span>{stage.name}</span>
                        </span>
                        {stage.id === displayStage && (
                          <CheckCircle
                            size={16}
                            weight="fill"
                            className="text-[var(--foreground-success)]"
                          />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* ── Action feedback ── */}
          {actionFeedback && (
            <Banner
              type={
                actionFeedback.type === "error"
                  ? "critical"
                  : actionFeedback.type === "warning"
                    ? "warning"
                    : "success"
              }
              subtle
              title={actionFeedback.message}
              dismissible
              onDismiss={() => setActionFeedback(null)}
            />
          )}

          {/* ── Body ── */}
          <div className="flex flex-1 overflow-hidden">
            {/* Main scrollable content */}
            <main className="flex-1 overflow-y-auto">
              {/* Loading skeleton */}
              {loading && (
                <div className="flex flex-col gap-10 p-8">
                  <div className="flex items-center gap-4">
                    <Skeleton variant="circular" className="h-16 w-16" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-24" />
                    <div className="flex gap-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-24 rounded-full" />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-20 w-full rounded-[var(--radius-card)]" />
                  </div>
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-16 w-full rounded-[var(--radius-card)]" />
                  </div>
                </div>
              )}

              {/* Error */}
              {!loading && error && (
                <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
                  <p className="text-body text-[var(--foreground-error)]">{error}</p>
                  <Button variant="tertiary" onClick={onClose}>
                    Close
                  </Button>
                </div>
              )}

              {/* Content */}
              {!loading && !error && seeker && activeApp && (
                <div className="flex flex-col gap-10 p-8">
                  {/* Profile header */}
                  <CandidateProfileHeader
                    name={candidateName}
                    email={seeker.account.email}
                    avatar={seeker.account.avatar}
                    jobTitle={activeApp.job.title}
                    appliedAt={activeApp.createdAt}
                    pronouns={seeker.account.pronouns}
                    seekerId={seeker.id}
                    onAvatarChange={() => {
                      // Invalidate the cached candidate data so the avatar refreshes
                      queryClient.invalidateQueries({
                        queryKey: queryKeys.canopy.candidates.detail(seeker.id),
                      });
                    }}
                  />

                  {/* Hiring stages */}
                  <HiringStagesSection
                    stages={jobStages}
                    currentStage={displayStage}
                    scores={activeApp.scores}
                    averageScore={averageScore}
                    selectedStageId={reviewStageId}
                    onOpenReview={handleOpenReview}
                    appliedAt={activeApp.createdAt}
                  />

                  {/* Offer management (when offer exists) */}
                  {activeApp.offer && (
                    <OfferManagementSection
                      offer={
                        activeApp.offer as Parameters<typeof OfferManagementSection>[0]["offer"]
                      }
                      candidateName={candidateName}
                      onOfferSent={() => {
                        queryClient.invalidateQueries({
                          queryKey: queryKeys.canopy.candidates.all,
                        });
                        onStageChanged?.();
                      }}
                      onOfferWithdrawn={() => {
                        queryClient.invalidateQueries({
                          queryKey: queryKeys.canopy.candidates.all,
                        });
                        onStageChanged?.();
                      }}
                    />
                  )}

                  {/* Interviews */}
                  {activeApp.interviews && activeApp.interviews.length > 0 && (
                    <InterviewsSection
                      interviews={activeApp.interviews}
                      applicationId={activeApp.id}
                      onInterviewUpdated={() => {
                        queryClient.invalidateQueries({
                          queryKey: queryKeys.canopy.candidates.all,
                        });
                      }}
                    />
                  )}

                  {/* Email Thread */}
                  {activeApp && (
                    <EmailThreadSection
                      seekerId={seeker.id}
                      applicationId={activeApp.id}
                      jobStages={jobStages}
                      onCompose={() => setEmailDialogOpen(true)}
                    />
                  )}

                  {/* AI Summary */}
                  <AISummarySection summary={seeker.aiSummary} />

                  {/* Skills & Certifications */}
                  <SkillsCertificationsSection
                    skills={seeker.skills}
                    greenSkills={seeker.greenSkills}
                    certifications={seeker.certifications}
                    yearsExperience={seeker.yearsExperience}
                  />

                  {/* Documents */}
                  {documentFiles.length > 0 && <DocumentsSection files={documentFiles} />}

                  {/* Contact info */}
                  <ContactInfoSection
                    name={seeker.account.name}
                    email={seeker.account.email}
                    phone={seeker.account.phone}
                    pronouns={seeker.account.pronouns}
                    location={seeker.account.location}
                    linkedinUrl={seeker.account.linkedinUrl}
                  />

                  {/* About */}
                  <AboutSection
                    createdAt={activeApp.createdAt}
                    source={activeApp.source}
                    jobCategory={activeApp.job.climateCategory}
                  />
                </div>
              )}
            </main>

            {/* Side panel (conditional — widens the sheet) */}
            {panelType && seeker && (
              <aside
                className={cn(
                  "flex shrink-0 flex-col border-l border-[var(--border-muted)] bg-[var(--background-default)] transition-[width] duration-300 ease-in-out",
                  isExpanded ? "w-[480px]" : "w-[380px]"
                )}
              >
                {panelType === "review" && activeApp && orgMemberId && (
                  <ApplicationReviewPanel
                    applicationId={activeApp.id}
                    seekerId={seeker.id}
                    scores={activeApp.scores}
                    averageScore={averageScore}
                    orgMemberId={orgMemberId}
                    candidateName={candidateName}
                    currentStage={displayStage}
                    jobId={activeApp.job.id}
                    isActionLoading={isActionLoading}
                    onQualify={handleQualify}
                    onDisqualify={handleReject}
                    onClose={handleClosePanel}
                    scorecardTemplateId={currentStageScorecardTemplate}
                  />
                )}
                {panelType === "comments" && (
                  <CommentsPanel
                    seekerId={seeker.id}
                    notes={seeker.notes}
                    onClose={handleClosePanel}
                  />
                )}
                {panelType === "todo" && (
                  <TodoPanel
                    stages={jobStages}
                    applicationId={activeApp?.id}
                    onClose={handleClosePanel}
                  />
                )}
                {panelType === "history" && (
                  <HistoryPanel seekerId={seeker.id} onClose={handleClosePanel} />
                )}
              </aside>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Modals rendered outside Sheet to avoid Radix portal z-index / pointer-events blocking */}

      {/* Interview Scheduling Modal */}
      {seeker && activeApp && (
        <InterviewSchedulingModal
          open={interviewModalOpen}
          onOpenChange={setInterviewModalOpen}
          candidate={{
            id: seeker.id,
            name: candidateName,
            email: seeker.account.email,
            avatar: seeker.account.avatar ?? undefined,
          }}
          job={{
            id: activeApp.job.id,
            title: activeApp.job.title,
          }}
          onSchedule={async (data) => {
            try {
              const firstSlot = data.timeSlots[0];
              if (!firstSlot?.start) throw new Error("No time slot selected");
              const scheduledAt =
                firstSlot.start instanceof Date
                  ? firstSlot.start.toISOString()
                  : new Date(firstSlot.start).toISOString();

              const res = await fetch("/api/canopy/interviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  applicationId: activeApp.id,
                  interviewerId: orgMemberId,
                  scheduledAt,
                  duration: data.duration,
                  type: data.videoProvider === "none" ? "PHONE" : "VIDEO",
                  meetingLink: data.videoProvider !== "none" ? undefined : undefined,
                  notes: data.instructions || data.internalNotes || undefined,
                  stageId: displayStage || undefined,
                }),
              });
              if (!res.ok) throw new Error("Failed to schedule interview");
              setInterviewModalOpen(false);
              setActionFeedback({ type: "success", message: "Interview scheduled" });
              queryClient.invalidateQueries({ queryKey: queryKeys.canopy.candidates.all });
            } catch (err) {
              logger.error("Failed to schedule interview", { error: formatError(err) });
              setActionFeedback({ type: "error", message: "Failed to schedule interview" });
            }
          }}
        />
      )}

      {/* Rejection Reason Modal */}
      <Modal open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <ModalContent size="default">
          <ModalHeader>
            <ModalTitle>Reject Candidate</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p className="mb-4 text-body-sm text-[var(--foreground-muted)]">
              Are you sure you want to reject{" "}
              <strong className="text-[var(--foreground-default)]">{candidateName}</strong>? This
              will move them to the rejected stage.
            </p>
            <div className="space-y-4">
              {/* Rejection reason dropdown (required) */}
              <div className="space-y-2">
                <Label className="text-caption-strong">
                  Reason <span className="text-[var(--foreground-error)]">*</span>
                </Label>
                <Dropdown
                  value={rejectReason}
                  onValueChange={(v) => setRejectReason(v as RejectionReasonValue)}
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
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                  placeholder="Add a note about why this candidate was rejected..."
                  rows={3}
                />
              </div>

              {/* Send rejection email toggle */}
              <div className="flex items-center gap-3">
                <Checkbox
                  id="preview-send-rejection-email"
                  checked={sendRejectEmail}
                  onCheckedChange={(checked) => setSendRejectEmail(Boolean(checked))}
                />
                <Label
                  htmlFor="preview-send-rejection-email"
                  className="cursor-pointer text-body-sm"
                >
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
              disabled={!rejectReason || isActionLoading}
              loading={isActionLoading}
            >
              Reject Candidate
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Offer Details Modal */}
      {activeApp && (
        <OfferDetailsModal
          open={offerModalOpen}
          onOpenChange={setOfferModalOpen}
          applicationId={activeApp.id}
          jobTitle={activeApp.job.title}
          candidateName={candidateName}
          onOfferCreated={() => {
            setOfferModalOpen(false);
            moveToStage("offer", "Offer");
          }}
        />
      )}

      {/* Email Composer Dialog */}
      {seeker && (
        <CandidateEmailDialog
          open={emailDialogOpen}
          onOpenChange={setEmailDialogOpen}
          candidate={{
            name: candidateName,
            email: seeker.account.email,
            avatar: seeker.account.avatar ?? undefined,
          }}
          job={activeApp ? { id: activeApp.job.id, title: activeApp.job.title } : undefined}
          applicationId={activeApp?.id}
          stageId={displayStage || undefined}
        />
      )}

      {/* Stage Gate Modal */}
      <StageGateModal
        open={gateModalOpen}
        onOpenChange={setGateModalOpen}
        stageName={gateBlockedStageName}
        blockers={gateBlockers}
      />
    </>
  );
}
