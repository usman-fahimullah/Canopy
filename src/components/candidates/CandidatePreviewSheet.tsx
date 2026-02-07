"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Recommendation } from "@prisma/client";

// UI
import { Button } from "@/components/ui/button";
import { Banner } from "@/components/ui/banner";
import { Spinner } from "@/components/ui/spinner";
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
  ArrowSquareOut,
  ArrowCircleRight,
  Prohibit,
  UserCirclePlus,
  ChatCircleDots,
  CheckCircle,
  CaretUp,
  CaretDown,
} from "@phosphor-icons/react";

// Sub-components — reused from the full-page view
import { CandidateProfileHeader } from "./CandidateProfileHeader";
import { HiringStagesSection } from "./HiringStagesSection";
import { DocumentsSection } from "./DocumentsSection";
import { ContactInfoSection } from "./ContactInfoSection";
import { AboutSection } from "./AboutSection";
import { CommentsPanel } from "./CommentsPanel";

import { logger, formatError } from "@/lib/logger";

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
  const router = useRouter();
  const isOpen = seekerId !== null;

  // --- Data fetching ---
  const [seeker, setSeeker] = React.useState<SeekerData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // --- Action state ---
  const [isActionLoading, setIsActionLoading] = React.useState(false);
  const [optimisticStage, setOptimisticStage] = React.useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = React.useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);

  // --- Panels ---
  const [showComments, setShowComments] = React.useState(false);

  // Fetch candidate data when seekerId changes
  React.useEffect(() => {
    if (!seekerId) {
      setSeeker(null);
      setError(null);
      setShowComments(false);
      setOptimisticStage(null);
      setActionFeedback(null);
      return;
    }

    let cancelled = false;

    async function fetchCandidate() {
      setLoading(true);
      setError(null);
      setShowComments(false);
      setOptimisticStage(null);
      setActionFeedback(null);

      try {
        const res = await fetch(`/api/canopy/candidates/${seekerId}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "Failed to load candidate");
        }
        const { data } = await res.json();
        if (!cancelled) setSeeker(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load candidate");
          logger.error("Failed to fetch candidate for preview", {
            error: formatError(err),
            seekerId,
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchCandidate();
    return () => {
      cancelled = true;
    };
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
      return JSON.parse(activeApp.job.stages) as Array<{ id: string; name: string }>;
    } catch {
      return [{ id: "applied", name: "Applied" }];
    }
  }, [activeApp]);

  const displayStage = optimisticStage ?? activeApp?.stage ?? "applied";

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
          throw new Error(data.error ?? `Failed to move candidate to ${label}`);
        }

        setActionFeedback({
          type: newStage === "rejected" ? "warning" : "success",
          message: `Candidate moved to ${label}`,
        });

        onStageChanged?.();
      } catch (err) {
        setOptimisticStage(null);
        setActionFeedback({
          type: "error",
          message: err instanceof Error ? err.message : "Failed to move candidate",
        });
      } finally {
        setIsActionLoading(false);
      }
    },
    [activeApp, onStageChanged]
  );

  const handleReject = React.useCallback(() => moveToStage("rejected", "Rejected"), [moveToStage]);
  const handleSaveToTalentPool = React.useCallback(
    () => moveToStage("talent-pool", "Talent Pool"),
    [moveToStage]
  );

  // Open full page — pass current pathname as "from" so the back button returns here
  const currentPathname = usePathname();
  const handleOpenFullPage = () => {
    if (!seekerId) return;
    const params = new URLSearchParams();
    if (jobId) params.set("jobId", jobId);
    params.set("from", currentPathname);
    router.push(`/canopy/candidates/${seekerId}?${params.toString()}`);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        size="2xl"
        hideClose
        className="flex flex-col gap-0 overflow-hidden p-0"
      >
        {/* Accessible title (hidden visually) */}
        <SheetTitle className="sr-only">
          {loading ? "Loading candidate..." : `${candidateName} - Candidate Preview`}
        </SheetTitle>

        {/* ── Header bar ── */}
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--border-muted)] px-6 py-4">
          <div className="flex items-center gap-3">
            <SimpleTooltip content="Close">
              <Button variant="outline" size="icon-sm" onClick={onClose} aria-label="Close">
                <X size={20} weight="bold" />
              </Button>
            </SimpleTooltip>

            {/* Prev/Next navigation */}
            {navigation && (
              <>
                <div className="flex items-center gap-1">
                  <SimpleTooltip content="Previous candidate">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={navigation.onPrevious}
                      disabled={!navigation.hasPrevious}
                      aria-label="Previous candidate"
                    >
                      <CaretUp size={16} weight="bold" />
                    </Button>
                  </SimpleTooltip>
                  <SimpleTooltip content="Next candidate">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={navigation.onNext}
                      disabled={!navigation.hasNext}
                      aria-label="Next candidate"
                    >
                      <CaretDown size={16} weight="bold" />
                    </Button>
                  </SimpleTooltip>
                </div>
                {navigation.currentIndex !== undefined && navigation.totalCount !== undefined && (
                  <span className="text-caption text-[var(--foreground-subtle)]">
                    {navigation.currentIndex + 1} of {navigation.totalCount}
                  </span>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Comments toggle */}
            {seeker && (
              <SimpleTooltip content="Comments">
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => setShowComments((prev) => !prev)}
                  aria-label="Toggle comments"
                  data-selected={showComments ? "true" : undefined}
                >
                  <ChatCircleDots size={20} weight="bold" />
                </Button>
              </SimpleTooltip>
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
                        onClick={() => moveToStage(stage.id, stage.name)}
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

                {/* Reject */}
                <SimpleTooltip content="Reject">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={handleReject}
                    disabled={isActionLoading}
                    aria-label="Reject candidate"
                  >
                    <Prohibit size={20} weight="bold" />
                  </Button>
                </SimpleTooltip>
              </>
            )}

            {/* Open full page */}
            <SimpleTooltip content="Open full page">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={handleOpenFullPage}
                aria-label="Open full page"
              >
                <ArrowSquareOut size={20} weight="bold" />
              </Button>
            </SimpleTooltip>
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
            {/* Loading */}
            {loading && (
              <div className="flex h-full items-center justify-center py-24">
                <Spinner size="lg" />
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
                />

                {/* Hiring stages */}
                <HiringStagesSection
                  stages={jobStages}
                  currentStage={displayStage}
                  scores={activeApp.scores}
                  averageScore={averageScore}
                  appliedAt={activeApp.createdAt}
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

          {/* Comments panel (inline in sheet) */}
          {showComments && seeker && (
            <aside className="flex w-[320px] shrink-0 flex-col border-l border-[var(--border-muted)] bg-[var(--background-default)]">
              <CommentsPanel
                seekerId={seeker.id}
                notes={seeker.notes}
                onClose={() => setShowComments(false)}
              />
            </aside>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
