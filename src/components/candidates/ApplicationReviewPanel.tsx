"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/scorecard";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Star, CheckCircle, XCircle } from "@phosphor-icons/react";
import { ReviewCard } from "./ReviewCard";
import type { Recommendation } from "@prisma/client";

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
  scores: ScoreData[];
  averageScore: number | null;
  orgMemberId: string;
}

export function ApplicationReviewPanel({
  applicationId,
  scores,
  averageScore,
  orgMemberId,
}: ApplicationReviewPanelProps) {
  const [rating, setRating] = React.useState(0);
  const [note, setNote] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const hasScores = scores.length > 0;

  const handleSubmit = async () => {
    if (rating === 0) return;
    setIsSubmitting(true);
    // TODO: Wire up API POST /api/canopy/candidates/[id]/scores
    setIsSubmitting(false);
  };

  const handleSkip = () => {
    setRating(0);
    setNote("");
  };

  return (
    <div className="p-6">
      {/* Score summary (if reviews exist) */}
      {hasScores && averageScore !== null && (
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <Star size={28} weight="fill" className="text-yellow-400" />
            <span className="text-4xl font-bold text-[var(--foreground-default)]">
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

      {/* Review input form (when no review submitted by current user) */}
      {!hasScores && (
        <div className="space-y-6">
          {/* Star rating input */}
          <div className="flex justify-center">
            <StarRating value={rating} onChange={setRating} size="lg" />
          </div>

          {/* Note textarea */}
          <Textarea
            placeholder="Add a note"
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
              Submit
            </Button>
            <Button variant="secondary" className="flex-1" onClick={handleSkip}>
              Skip
            </Button>
          </div>
        </div>
      )}

      {/* Qualified / Disqualify actions */}
      {hasScores && (
        <>
          <Separator className="my-6" />
          <div className="space-y-3">
            <Button
              variant="primary"
              className="w-full bg-[var(--primitive-green-500)] hover:bg-[var(--primitive-green-600)]"
              size="lg"
            >
              <CheckCircle size={20} weight="fill" className="mr-2" />
              Qualified
            </Button>
            <Button variant="destructive" className="w-full" size="lg">
              <XCircle size={20} weight="fill" className="mr-2" />
              Disqualify
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
