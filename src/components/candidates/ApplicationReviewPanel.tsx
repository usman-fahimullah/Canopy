"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/scorecard";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Star, CheckCircle, XCircle, X } from "@phosphor-icons/react";
import { ReviewCard } from "./ReviewCard";
import type { Recommendation } from "@prisma/client";

/**
 * ApplicationReviewPanel — Figma-aligned right panel for reviewing applications.
 * Triggered by clicking CaretRight on a stage row.
 *
 * @figma https://figma.com/design/niUFJMIpfrizs1Kjsu1O4S/Candid?node-id=890-1245
 */

interface ScoreData {
  id: string;
  overallRating: number;
  recommendation: Recommendation;
  comments: string | null;
  createdAt: Date;
  scorer: {
    id: string;
    account: { name: string | null; avatar: string | null };
  };
}

interface ApplicationReviewPanelProps {
  applicationId: string;
  seekerId: string;
  scores: ScoreData[];
  averageScore: number | null;
  orgMemberId: string;
  candidateName: string;
  /** Current stage of the application */
  currentStage?: string;
  /** Job ID for stage change API */
  jobId: string;
  /** Whether an action is in progress */
  isActionLoading?: boolean;
  /** Move candidate to "qualified" stage */
  onQualify?: () => void;
  /** Move candidate to "rejected" stage (Disqualify) */
  onDisqualify?: () => void;
  /** Close panel */
  onClose: () => void;
}

/** Map star rating to recommendation enum */
function ratingToRecommendation(rating: number): Recommendation {
  switch (rating) {
    case 1:
      return "STRONG_NO";
    case 2:
      return "NO";
    case 3:
      return "NEUTRAL";
    case 4:
      return "YES";
    case 5:
      return "STRONG_YES";
    default:
      return "NEUTRAL";
  }
}

export function ApplicationReviewPanel({
  applicationId,
  seekerId,
  scores,
  averageScore,
  orgMemberId,
  candidateName,
  currentStage,
  jobId,
  isActionLoading,
  onQualify,
  onDisqualify,
  onClose,
}: ApplicationReviewPanelProps) {
  const router = useRouter();
  const [rating, setRating] = React.useState(0);
  const [note, setNote] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const hasScores = scores.length > 0;
  const isTerminalStage =
    currentStage === "rejected" || currentStage === "talent-pool" || currentStage === "hired";

  const handleSubmit = async () => {
    if (rating === 0) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`/api/canopy/candidates/${seekerId}/scores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId,
          overallRating: rating,
          recommendation: ratingToRecommendation(rating),
          comments: note || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to submit review");
      }

      // Clear form and refresh data
      setRating(0);
      setNote("");
      router.refresh();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    setRating(0);
    setNote("");
    onClose();
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-muted)] px-4 py-3">
        <h2 className="text-heading-sm font-medium text-[var(--foreground-default)]">
          Application Review
        </h2>
        <Button variant="outline" size="icon-sm" onClick={onClose} aria-label="Close panel">
          <X size={18} />
        </Button>
      </div>

      {/* Panel content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Error banner */}
        {submitError && (
          <div className="mb-4 rounded-lg bg-[var(--background-error)] px-4 py-3 text-caption text-[var(--foreground-error)]">
            {submitError}
          </div>
        )}

        {/* Score summary (if reviews exist) */}
        {hasScores && averageScore !== null && (
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <Star size={28} weight="fill" className="text-[var(--primitive-yellow-500)]" />
              <span className="text-heading-md font-bold text-[var(--foreground-default)]">
                {averageScore.toFixed(1)}
              </span>
              <span className="text-caption text-[var(--foreground-muted)]">
                ({scores.length} {scores.length === 1 ? "review" : "reviews"})
              </span>
            </div>
          </div>
        )}

        {/* Existing reviews */}
        {hasScores && (
          <div className="space-y-4">
            {scores.map((score) => (
              <ReviewCard
                key={score.id}
                scorerName={score.scorer.account.name ?? "Team member"}
                scorerAvatar={score.scorer.account.avatar}
                rating={score.overallRating}
                comments={score.comments}
                createdAt={score.createdAt}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            ))}
          </div>
        )}

        {/* Review input form (when no review submitted yet) */}
        {!hasScores && (
          <div className="space-y-6">
            {/* Star rating input */}
            <div className="flex justify-center">
              <StarRating value={rating} onChange={setRating} size="lg" />
            </div>

            {/* Note textarea */}
            <Textarea
              placeholder={`Leave a review for ${candidateName}`}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
            />

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleSubmit}
                disabled={rating === 0}
                loading={isSubmitting}
              >
                Submit Review
              </Button>
              <Button variant="tertiary" className="flex-1" onClick={handleSkip}>
                Skip
              </Button>
            </div>
          </div>
        )}

        {/* Decision actions — only show when reviews exist and not in terminal stage */}
        {hasScores && !isTerminalStage && (
          <>
            <Separator className="my-6" />
            <div className="space-y-3">
              <Button
                variant="primary"
                className="w-full"
                size="lg"
                onClick={onQualify}
                disabled={isActionLoading}
              >
                <CheckCircle size={20} weight="fill" className="mr-2" />
                Qualified
              </Button>

              <Button
                variant="destructive"
                className="w-full"
                size="lg"
                onClick={onDisqualify}
                disabled={isActionLoading}
              >
                <XCircle size={20} weight="fill" className="mr-2" />
                Disqualify
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
