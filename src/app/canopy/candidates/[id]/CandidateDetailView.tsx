"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Recommendation } from "@prisma/client";

// UI Components
import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";

// Icons
import { X, File } from "@phosphor-icons/react";

// Sub-components
import { CandidateDetailNavBar } from "@/components/candidates/CandidateDetailNavBar";
import { CandidateProfileHeader } from "@/components/candidates/CandidateProfileHeader";
import { HiringStagesSection } from "@/components/candidates/HiringStagesSection";
import { ApplicationReviewPanel } from "@/components/candidates/ApplicationReviewPanel";
import { ActivityPanel } from "@/components/candidates/ActivityPanel";
import { ContactInfoSection } from "@/components/candidates/ContactInfoSection";
import { AboutSection } from "@/components/candidates/AboutSection";

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
   Right Panel Views
   ------------------------------------------------------------------- */

type RightPanelView = "review" | "activity";

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

  const [activePanelView, setActivePanelView] = React.useState<RightPanelView>("review");

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

  // Navigation handlers
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
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Stage action handlers ──
  const [isActionLoading, setIsActionLoading] = React.useState(false);
  const [optimisticStage, setOptimisticStage] = React.useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = React.useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);

  // The displayed stage: optimistic override or actual
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

        // Refresh the page data to get updated state from server
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

  // Panel tab buttons
  const panelTabs: { key: RightPanelView; label: string }[] = [
    { key: "review", label: "Application review" },
    { key: "activity", label: "Activity" },
  ];

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
        onClose={handleClose}
        onPrevious={handlePrevious}
        onNext={handleNext}
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

      {/* ── Two-panel content ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Left: Main scrollable content ── */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-8 py-8">
            {/* Profile header */}
            <CandidateProfileHeader
              name={seeker.account.name ?? "Unknown"}
              email={seeker.account.email}
              avatar={seeker.account.avatar}
              jobTitle={activeApp.job.title}
              appliedAt={activeApp.createdAt}
              pronouns={seeker.account.pronouns}
            />

            {/* Warning banner (placeholder for data retention) */}
            <div className="mt-6">
              <Banner
                type="warning"
                subtle
                title="No data retention period set"
                actionLabel="Edit"
                onAction={() => {}}
                dismissible={false}
              />
            </div>

            {/* Hiring stages */}
            <div className="mt-8">
              <HiringStagesSection
                stages={jobStages}
                currentStage={displayStage}
                scores={activeApp.scores}
                averageScore={averageScore}
              />
            </div>

            {/* Resume */}
            {seeker.resumeUrl && (
              <section className="mt-8">
                <h3 className="mb-3 text-body font-semibold text-[var(--foreground-default)]">
                  Resume
                </h3>
                <a
                  href={seeker.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-lg border border-[var(--border-muted)] px-4 py-3 transition-colors hover:bg-[var(--background-interactive-hover)]"
                >
                  <File size={20} weight="regular" className="text-[var(--foreground-muted)]" />
                  <span className="text-body-sm text-[var(--foreground-default)]">Resume</span>
                </a>
              </section>
            )}

            {/* Contact info */}
            <div className="mt-8">
              <ContactInfoSection
                name={seeker.account.name}
                email={seeker.account.email}
                phone={seeker.account.phone}
                pronouns={seeker.account.pronouns}
                location={seeker.account.location}
                linkedinUrl={seeker.account.linkedinUrl}
              />
            </div>

            {/* About */}
            <div className="mt-8">
              <AboutSection
                createdAt={activeApp.createdAt}
                source={activeApp.source}
                skills={seeker.skills}
                certifications={seeker.certifications}
              />
            </div>
          </div>
        </main>

        {/* ── Right: Side panel ── */}
        <aside className="flex w-[380px] shrink-0 flex-col border-l border-[var(--border-muted)]">
          {/* Panel tab header */}
          <div className="flex items-center justify-between border-b border-[var(--border-muted)] px-4">
            <div className="flex">
              {panelTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActivePanelView(tab.key)}
                  className={`relative px-4 py-3 text-caption font-medium transition-colors ${
                    activePanelView === tab.key
                      ? "text-[var(--foreground-default)]"
                      : "text-[var(--foreground-muted)] hover:text-[var(--foreground-default)]"
                  }`}
                >
                  {tab.label}
                  {activePanelView === tab.key && (
                    <span className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-[var(--foreground-brand)]" />
                  )}
                </button>
              ))}
            </div>
            <Button variant="ghost" size="icon-sm" onClick={() => {}} aria-label="Close panel">
              <X size={16} />
            </Button>
          </div>

          {/* Panel content */}
          <div className="flex-1 overflow-y-auto">
            {activePanelView === "review" && (
              <ApplicationReviewPanel
                applicationId={activeApp.id}
                scores={activeApp.scores}
                averageScore={averageScore}
                orgMemberId={orgMemberId}
                currentStage={displayStage}
                isActionLoading={isActionLoading}
                onQualify={handleQualify}
                onDisqualify={handleReject}
                onSaveToTalentPool={handleSaveToTalentPool}
              />
            )}
            {activePanelView === "activity" && (
              <ActivityPanel seekerId={seeker.id} applicationId={activeApp.id} />
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
