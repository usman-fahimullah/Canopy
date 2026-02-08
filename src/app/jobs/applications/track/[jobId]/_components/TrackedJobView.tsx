"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { Banner } from "@/components/ui/banner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { RichTextRenderer } from "@/components/ui/rich-text-editor";
import { TrackedJobNavBar } from "./TrackedJobNavBar";
import { TrackedJobNotes } from "./TrackedJobNotes";
import { PropertiesSidebar } from "./PropertiesSidebar";
import type { TrackedJobData, ApplicationSection, EmojiReaction } from "./types";

/**
 * TrackedJobView — Client wrapper for the tracked job detail page.
 *
 * Layout adapted from CandidateDetailView.tsx:
 * - Full-height flex → nav bar → banner → flex flex-1 overflow-hidden
 * - Scrollable main + 320px aside sidebar
 * - Escape key to navigate back
 * - Banner feedback with auto-dismiss 4s
 */

// ============================================
// LOCAL STORAGE HELPERS
// ============================================

const REACTIONS_KEY = "your-jobs-reactions";
const STAGES_KEY = "your-jobs-stage-overrides";

function getStoredReactions(): Record<string, EmojiReaction> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(REACTIONS_KEY) || "{}");
  } catch {
    return {};
  }
}

function setStoredReaction(jobId: string, reaction: EmojiReaction) {
  const stored = getStoredReactions();
  if (reaction === "none") {
    delete stored[jobId];
  } else {
    stored[jobId] = reaction;
  }
  localStorage.setItem(REACTIONS_KEY, JSON.stringify(stored));
}

function getStoredStages(): Record<string, ApplicationSection> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STAGES_KEY) || "{}");
  } catch {
    return {};
  }
}

function setStoredStage(jobId: string, stage: ApplicationSection) {
  const stored = getStoredStages();
  stored[jobId] = stage;
  localStorage.setItem(STAGES_KEY, JSON.stringify(stored));
}

// ============================================
// COMPONENT
// ============================================

interface TrackedJobViewProps {
  data: TrackedJobData;
}

interface Feedback {
  type: "success" | "error";
  message: string;
}

export function TrackedJobView({ data }: TrackedJobViewProps) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(data.isSaved);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  // Local state backed by localStorage (same keys as the table)
  const [reaction, setReaction] = useState<EmojiReaction>(() => {
    const stored = getStoredReactions();
    return stored[data.id] ?? "none";
  });

  const [currentStage, setCurrentStage] = useState<ApplicationSection>(() => {
    const stored = getStoredStages();
    if (stored[data.id]) return stored[data.id];
    // Derive initial stage from application status if available
    if (data.applicationStatus) {
      const statusMap: Record<string, ApplicationSection> = {
        applied: "applied",
        screening: "applied",
        interview: "interview",
        offer: "offer",
        hired: "hired",
        rejected: "ineligible",
      };
      return statusMap[data.applicationStatus.toLowerCase()] ?? "saved";
    }
    return data.isSaved ? "saved" : "applied";
  });

  // Auto-dismiss banner after 4s
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Escape key to navigate back (matches candidate page pattern)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.push("/jobs/applications");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  const handleBack = useCallback(() => {
    router.push("/jobs/applications");
  }, [router]);

  const handleFavoriteToggle = useCallback(async () => {
    setIsActionLoading(true);
    const wasSaved = isSaved;

    // Optimistic update
    setIsSaved(!wasSaved);

    try {
      const res = await fetch(`/api/jobs/${data.id}/save`, {
        method: wasSaved ? "DELETE" : "POST",
      });
      if (!res.ok) {
        // Rollback
        setIsSaved(wasSaved);
        setFeedback({ type: "error", message: "Failed to update saved status" });
      } else {
        setFeedback({
          type: "success",
          message: wasSaved ? "Removed from saved" : "Saved to your jobs",
        });
      }
    } catch {
      setIsSaved(wasSaved);
      setFeedback({ type: "error", message: "Failed to update saved status" });
    } finally {
      setIsActionLoading(false);
    }
  }, [isSaved, data.id]);

  const handleApply = useCallback(() => {
    router.push(`/jobs/search/${data.id}`);
  }, [router, data.id]);

  const handleViewJobPosting = useCallback(() => {
    router.push(`/jobs/search/${data.id}`);
  }, [router, data.id]);

  const handleReactionChange = useCallback(
    (newReaction: EmojiReaction) => {
      setReaction(newReaction);
      setStoredReaction(data.id, newReaction);
    },
    [data.id]
  );

  const handleStageChange = useCallback(
    (stage: ApplicationSection) => {
      setCurrentStage(stage);
      setStoredStage(data.id, stage);
    },
    [data.id]
  );

  const handleRemove = useCallback(async () => {
    setIsActionLoading(true);
    try {
      const res = await fetch(`/api/jobs/${data.id}/save`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/jobs/applications");
      } else {
        setFeedback({ type: "error", message: "Failed to remove job" });
      }
    } catch {
      setFeedback({ type: "error", message: "Failed to remove job" });
    } finally {
      setIsActionLoading(false);
    }
  }, [data.id, router]);

  return (
    <div className="flex h-full flex-col bg-[var(--background-default)]">
      {/* Nav bar (adapted from CandidateDetailNavBar) */}
      <TrackedJobNavBar
        title={data.title}
        isSaved={isSaved}
        hasApplication={!!data.applicationId}
        isActionLoading={isActionLoading}
        onBack={handleBack}
        onFavoriteToggle={handleFavoriteToggle}
        onApply={handleApply}
        onViewJobPosting={handleViewJobPosting}
        onRemove={handleRemove}
      />

      {/* Action feedback banner (adapted from candidate page) */}
      {feedback && (
        <Banner
          type={feedback.type === "success" ? "success" : "critical"}
          subtle
          title={feedback.message}
          dismissible
          onDismiss={() => setFeedback(null)}
        />
      )}

      {/* Content area (flex flex-1 overflow-hidden, like candidate page) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            {/* Profile header (adapted from CandidateProfileHeader) */}
            <div className="mb-8 flex items-start gap-[22px]">
              <Avatar
                size="xl"
                shape="square"
                name={data.company}
                src={data.companyLogo ?? undefined}
              />
              <div>
                <h1 className="text-heading-sm font-medium text-[var(--foreground-default)]">
                  {data.title}
                </h1>
                <p className="text-body text-[var(--foreground-muted)]">{data.company}</p>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="notes">
              <TabsList className="mb-6">
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
              </TabsList>

              <TabsContent value="notes">
                <TrackedJobNotes jobId={data.id} initialNotes={data.notes} isSaved={isSaved} />
              </TabsContent>

              <TabsContent value="cover-letter">
                <CoverLetterTab
                  coverLetter={data.coverLetter}
                  hasApplication={!!data.applicationId}
                />
              </TabsContent>
            </Tabs>
          </div>
        </main>

        {/* Sidebar (adapted from candidate's conditional aside) */}
        <aside className="hidden w-[320px] shrink-0 overflow-y-auto border-l border-[var(--border-muted)] lg:flex lg:flex-col">
          <PropertiesSidebar
            data={data}
            reaction={reaction}
            currentStage={currentStage}
            onReactionChange={handleReactionChange}
            onStageChange={handleStageChange}
          />
        </aside>
      </div>
    </div>
  );
}

// ============================================
// COVER LETTER TAB
// ============================================

function CoverLetterTab({
  coverLetter,
  hasApplication,
}: {
  coverLetter: string | null;
  hasApplication: boolean;
}) {
  if (hasApplication && coverLetter) {
    return (
      <Card className="rounded-2xl border-[var(--border-muted)]">
        <CardContent className="p-6">
          <RichTextRenderer content={coverLetter} />
        </CardContent>
      </Card>
    );
  }

  if (hasApplication && !coverLetter) {
    return (
      <Card className="rounded-2xl border-[var(--border-muted)]">
        <CardContent className="p-6">
          <p className="text-body text-[var(--foreground-muted)]">
            No cover letter was submitted with this application.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-[var(--border-muted)]">
      <CardContent className="p-6">
        <p className="text-body text-[var(--foreground-muted)]">
          You haven&apos;t applied to this job yet. Apply to include a cover letter.
        </p>
      </CardContent>
    </Card>
  );
}
