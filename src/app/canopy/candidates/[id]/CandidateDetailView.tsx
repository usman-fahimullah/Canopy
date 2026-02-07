"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Recommendation } from "@prisma/client";

// UI Components
import { Banner } from "@/components/ui/banner";

// Sub-components
import { CandidateDetailNavBar } from "@/components/candidates/CandidateDetailNavBar";
import { CandidateProfileHeader } from "@/components/candidates/CandidateProfileHeader";
import { HiringStagesSection } from "@/components/candidates/HiringStagesSection";
import { DocumentsSection } from "@/components/candidates/DocumentsSection";
import { ContactInfoSection } from "@/components/candidates/ContactInfoSection";
import { AboutSection } from "@/components/candidates/AboutSection";
import { ApplicationReviewPanel } from "@/components/candidates/ApplicationReviewPanel";
import { CommentsPanel } from "@/components/candidates/CommentsPanel";
import { TodoPanel } from "@/components/candidates/TodoPanel";
import { HistoryPanel } from "@/components/candidates/HistoryPanel";

/* -------------------------------------------------------------------
   Types
   ------------------------------------------------------------------- */

interface ScorerInfo {
  id: string;
  account: {
    name: string | null;
    avatar: string | null;
  };
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
    climateCategory: string | null;
  };
  scores: ScoreData[];
}

interface NoteData {
  id: string;
  content: string;
  mentions: string[];
  createdAt: Date;
  orgMemberAuthor: {
    account: {
      name: string | null;
      avatar: string | null;
    };
  } | null;
}

export interface SeekerData {
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

interface NavContext {
  currentIndex?: number;
  totalCount?: number;
  prevId?: string;
  nextId?: string;
}

interface CandidateDetailViewProps {
  seeker: SeekerData;
  activeApplicationId: string;
  orgMemberId: string;
  navContext: NavContext;
}

/* -------------------------------------------------------------------
   Panel Types
   ------------------------------------------------------------------- */

type PanelType = "review" | "comments" | "todo" | "history" | null;

/* -------------------------------------------------------------------
   Main Component
   ------------------------------------------------------------------- */

export function CandidateDetailView({
  seeker,
  activeApplicationId,
  orgMemberId,
  navContext,
}: CandidateDetailViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Panel state: null = panel closed, full-width content
  const [panelType, setPanelType] = React.useState<PanelType>(null);
  // Track which stage's review is open
  const [reviewStageId, setReviewStageId] = React.useState<string | null>(null);

  // Find the active application
  const activeApp = React.useMemo(
    () => seeker.applications.find((a) => a.id === activeApplicationId) ?? seeker.applications[0],
    [seeker.applications, activeApplicationId]
  );

  // Parse job stages
  const jobStages = React.useMemo(() => {
    try {
      return JSON.parse(activeApp.job.stages) as Array<{
        id: string;
        name: string;
      }>;
    } catch {
      return [{ id: "applied", name: "Applied" }];
    }
  }, [activeApp.job.stages]);

  // Compute average score
  const averageScore = React.useMemo(() => {
    if (activeApp.scores.length === 0) return null;
    const sum = activeApp.scores.reduce((acc, s) => acc + s.overallRating, 0);
    return sum / activeApp.scores.length;
  }, [activeApp.scores]);

  // Candidate name for display
  const candidateName = seeker.account.name ?? "Unknown";

  // ── Navigation handlers ──
  const handleClose = () => {
    router.back();
  };

  const handlePrevious = () => {
    if (navContext.prevId) {
      const params = new URLSearchParams(searchParams.toString());
      const currentIdx = navContext.currentIndex ?? 0;
      params.set("index", String(currentIdx - 1));
      router.push(`/canopy/candidates/${navContext.prevId}?${params.toString()}`);
    }
  };

  const handleNext = () => {
    if (navContext.nextId) {
      const params = new URLSearchParams(searchParams.toString());
      const currentIdx = navContext.currentIndex ?? 0;
      params.set("index", String(currentIdx + 1));
      router.push(`/canopy/candidates/${navContext.nextId}?${params.toString()}`);
    }
  };

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (panelType) {
          setPanelType(null);
          setReviewStageId(null);
        } else {
          handleClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [panelType]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Stage action handlers ──
  const [isActionLoading, setIsActionLoading] = React.useState(false);
  const [optimisticStage, setOptimisticStage] = React.useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = React.useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);

  const displayStage = optimisticStage ?? activeApp.stage;

  // Clear feedback after 4 seconds
  React.useEffect(() => {
    if (!actionFeedback) return;
    const timer = setTimeout(() => setActionFeedback(null), 4000);
    return () => clearTimeout(timer);
  }, [actionFeedback]);

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

        router.refresh();
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
    [activeApp, router]
  );

  const handleReject = React.useCallback(() => moveToStage("rejected", "Rejected"), [moveToStage]);
  const handleSaveToTalentPool = React.useCallback(
    () => moveToStage("talent-pool", "Talent Pool"),
    [moveToStage]
  );
  const handleQualify = React.useCallback(
    () => moveToStage("qualified", "Qualified"),
    [moveToStage]
  );
  const handleAdvanceStage = React.useCallback(
    (stageId: string) => {
      const stage = jobStages.find((s) => s.id === stageId);
      moveToStage(stageId, stage?.name ?? stageId);
    },
    [moveToStage, jobStages]
  );

  // ── Panel toggle handlers ──
  const togglePanel = (type: Exclude<PanelType, null>) => {
    if (panelType === type) {
      setPanelType(null);
      if (type === "review") setReviewStageId(null);
    } else {
      setPanelType(type);
      if (type !== "review") setReviewStageId(null);
    }
  };

  const handleOpenReview = (stageId: string) => {
    setReviewStageId(stageId);
    setPanelType("review");
  };

  const handleClosePanel = () => {
    setPanelType(null);
    setReviewStageId(null);
  };

  // Build documents list from resume URL
  const documentFiles = React.useMemo(() => {
    const files: Array<{
      name: string;
      url: string;
      type: "pdf" | "doc" | "other";
    }> = [];
    if (seeker.resumeUrl) {
      try {
        const pathname = new URL(seeker.resumeUrl).pathname;
        const parts = pathname.split("/");
        const name = decodeURIComponent(parts[parts.length - 1] || "Resume");
        files.push({
          name,
          url: seeker.resumeUrl,
          type: name.toLowerCase().endsWith(".pdf") ? "pdf" : "doc",
        });
      } catch {
        files.push({
          name: "Resume",
          url: seeker.resumeUrl,
          type: "doc",
        });
      }
    }
    return files;
  }, [seeker.resumeUrl]);

  return (
    <div className="flex h-screen flex-col bg-[var(--background-default)]">
      {/* ── Top Navigation Bar ── */}
      <CandidateDetailNavBar
        currentIndex={navContext.currentIndex}
        totalCount={navContext.totalCount}
        hasPrevious={!!navContext.prevId}
        hasNext={!!navContext.nextId}
        currentStage={displayStage}
        isActionLoading={isActionLoading}
        activePanel={panelType}
        stages={jobStages}
        onClose={handleClose}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToggleComments={() => togglePanel("comments")}
        onToggleTodo={() => togglePanel("todo")}
        onToggleHistory={() => togglePanel("history")}
        onAdvanceStage={handleAdvanceStage}
        onReject={handleReject}
        onSaveToTalentPool={handleSaveToTalentPool}
      />

      {/* ── Action feedback banner ── */}
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

      {/* ── Content area ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Left: Main scrollable content ── */}
        <main className="flex-1 overflow-y-auto bg-[var(--background-default)]">
          <div className="flex flex-col gap-12 p-12">
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
              selectedStageId={reviewStageId}
              onOpenReview={handleOpenReview}
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
              onEditContactInfo={() => {
                /* TODO: Open contact info edit modal */
              }}
            />

            {/* About */}
            <AboutSection
              createdAt={activeApp.createdAt}
              source={activeApp.source}
              jobCategory={activeApp.job.climateCategory}
            />
          </div>
        </main>

        {/* ── Right: Side panel (conditional — only shows when panelType is set) ── */}
        {panelType && (
          <aside className="flex w-[380px] shrink-0 flex-col border-l border-[var(--border-muted)] bg-[var(--background-default)]">
            {panelType === "review" && (
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
              />
            )}
            {panelType === "comments" && (
              <CommentsPanel seekerId={seeker.id} notes={seeker.notes} onClose={handleClosePanel} />
            )}
            {panelType === "todo" && <TodoPanel onClose={handleClosePanel} />}
            {panelType === "history" && (
              <HistoryPanel seekerId={seeker.id} onClose={handleClosePanel} />
            )}
          </aside>
        )}
      </div>
    </div>
  );
}
