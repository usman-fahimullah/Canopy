"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/scorecard";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle, XCircle, X, ClipboardText } from "@phosphor-icons/react";
import { ReviewCard } from "./ReviewCard";
import { StructuredScorecardForm } from "./StructuredScorecardForm";
import type { Recommendation } from "@prisma/client";

/**
 * ApplicationReviewPanel — Right panel for reviewing applications.
 * Now supports structured scorecards with criteria-based evaluation.
 *
 * Flow:
 * 1. If no reviews exist → show the structured scorecard form
 * 2. If reviews exist → show the review cards with "Add Review" button
 * 3. Editing a review → show the structured scorecard form pre-filled
 *
 * @figma https://figma.com/design/niUFJMIpfrizs1Kjsu1O4S/Candid?node-id=890-1245
 */

interface ScoreData {
  id: string;
  overallRating: number;
  recommendation: Recommendation;
  comments: string | null;
  responses?: string;
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
  /** Optional scorecard template override from stage config */
  scorecardTemplateId?: string;
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
  scorecardTemplateId,
}: ApplicationReviewPanelProps) {
  const router = useRouter();
  const [showForm, setShowForm] = React.useState(false);
  const [editingScore, setEditingScore] = React.useState<ScoreData | null>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [deletingScoreId, setDeletingScoreId] = React.useState<string | null>(null);

  const hasScores = scores.length > 0;
  const isTerminalStage =
    currentStage === "rejected" || currentStage === "talent-pool" || currentStage === "hired";

  // Check if current user already submitted a review
  const myScore = scores.find((s) => s.scorer.id === orgMemberId);

  const handleEditScore = (scoreId: string) => {
    const score = scores.find((s) => s.id === scoreId);
    if (!score) return;
    setEditingScore(score);
    setShowForm(true);
  };

  const handleDeleteScore = async (scoreId: string) => {
    setSubmitError(null);
    setDeletingScoreId(scoreId);
    try {
      const res = await fetch(`/api/canopy/candidates/${seekerId}/scores/${scoreId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to delete review");
      }
      router.refresh();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to delete review");
    } finally {
      setDeletingScoreId(null);
    }
  };

  const handleFormSubmitted = () => {
    setShowForm(false);
    setEditingScore(null);
    router.refresh();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingScore(null);
  };

  // Determine recommendation distribution
  const recCounts = React.useMemo(() => {
    const counts = { yes: 0, no: 0, neutral: 0 };
    for (const score of scores) {
      if (score.recommendation === "STRONG_YES" || score.recommendation === "YES") {
        counts.yes++;
      } else if (score.recommendation === "STRONG_NO" || score.recommendation === "NO") {
        counts.no++;
      } else {
        counts.neutral++;
      }
    }
    return counts;
  }, [scores]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-muted)] px-4 py-3">
        <div className="flex items-center gap-2">
          <ClipboardText size={20} weight="bold" className="text-[var(--foreground-brand)]" />
          <h2 className="text-body-strong font-semibold text-[var(--foreground-default)]">
            Application Review
          </h2>
        </div>
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
          <div className="mb-6 space-y-3">
            <div className="flex items-center gap-3">
              <Star size={28} weight="fill" className="text-[var(--primitive-yellow-500)]" />
              <span className="text-heading-md font-bold text-[var(--foreground-default)]">
                {averageScore.toFixed(1)}
              </span>
              <span className="text-caption text-[var(--foreground-muted)]">
                ({scores.length} {scores.length === 1 ? "review" : "reviews"})
              </span>
            </div>

            {/* Recommendation distribution */}
            <div className="flex items-center gap-2">
              {recCounts.yes > 0 && (
                <Badge variant="success" size="sm">
                  {recCounts.yes} Yes
                </Badge>
              )}
              {recCounts.neutral > 0 && (
                <Badge variant="neutral" size="sm">
                  {recCounts.neutral} Neutral
                </Badge>
              )}
              {recCounts.no > 0 && (
                <Badge variant="error" size="sm">
                  {recCounts.no} No
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Existing reviews */}
        {hasScores && !showForm && (
          <div className="space-y-4">
            {scores.map((score) => (
              <ReviewCard
                key={score.id}
                scorerName={score.scorer.account.name ?? "Team member"}
                scorerAvatar={score.scorer.account.avatar}
                rating={score.overallRating}
                comments={score.comments}
                createdAt={score.createdAt}
                onEdit={() => handleEditScore(score.id)}
                onDelete={() => handleDeleteScore(score.id)}
                isDeleting={deletingScoreId === score.id}
              />
            ))}

            {/* Add Review button (if current user hasn't reviewed yet) */}
            {!myScore && (
              <Button variant="secondary" className="w-full" onClick={() => setShowForm(true)}>
                <ClipboardText size={16} weight="bold" className="mr-2" />
                Add Your Review
              </Button>
            )}
          </div>
        )}

        {/* Structured scorecard form (new review or editing) */}
        {(showForm || !hasScores) && (
          <StructuredScorecardForm
            applicationId={applicationId}
            seekerId={seekerId}
            currentStage={currentStage ?? "applied"}
            candidateName={candidateName}
            editingScore={
              editingScore
                ? {
                    id: editingScore.id,
                    responses: editingScore.responses ?? "{}",
                    overallRating: editingScore.overallRating,
                    recommendation: editingScore.recommendation,
                    comments: editingScore.comments,
                  }
                : null
            }
            onSubmitted={handleFormSubmitted}
            onCancel={hasScores ? handleFormCancel : onClose}
            scorecardTemplateId={scorecardTemplateId}
          />
        )}

        {/* Decision actions — only show when reviews exist and not in terminal stage */}
        {hasScores && !showForm && !isTerminalStage && (
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
