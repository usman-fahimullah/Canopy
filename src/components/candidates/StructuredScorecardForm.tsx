"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { StarRating, RecommendationSelect } from "@/components/ui/scorecard";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { Info, Star } from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";
import type { Recommendation } from "@prisma/client";
import {
  getTemplateForStage,
  computeOverallRating,
  ratingToRecommendation,
  areRequiredCriteriaRated,
  DEFAULT_SCORECARD_TEMPLATES,
  type ScorecardTemplate,
  type ScorecardResponses,
} from "@/lib/scorecard-templates";

/* -------------------------------------------------------------------
   Types
   ------------------------------------------------------------------- */

interface StructuredScorecardFormProps {
  /** Application ID to score */
  applicationId: string;
  /** Seeker ID for API path */
  seekerId: string;
  /** Current pipeline stage (determines which template to use) */
  currentStage: string;
  /** Candidate name for display */
  candidateName: string;
  /** Whether the form is in edit mode (pre-fill from existing score) */
  editingScore?: {
    id: string;
    responses: string;
    overallRating: number;
    recommendation: Recommendation;
    comments: string | null;
  } | null;
  /** Called after successful submission */
  onSubmitted: () => void;
  /** Called when form is cancelled */
  onCancel: () => void;
  /** Optional scorecard template override from stage config */
  scorecardTemplateId?: string;
}

/* -------------------------------------------------------------------
   Helpers
   ------------------------------------------------------------------- */

type RecType = "strong_yes" | "yes" | "neutral" | "no" | "strong_no";

function recToEnum(rec: RecType): Recommendation {
  switch (rec) {
    case "strong_yes":
      return "STRONG_YES";
    case "yes":
      return "YES";
    case "neutral":
      return "NEUTRAL";
    case "no":
      return "NO";
    case "strong_no":
      return "STRONG_NO";
  }
}

function enumToRec(rec: Recommendation): RecType {
  switch (rec) {
    case "STRONG_YES":
      return "strong_yes";
    case "YES":
      return "yes";
    case "NEUTRAL":
      return "neutral";
    case "NO":
      return "no";
    case "STRONG_NO":
      return "strong_no";
  }
}

function parseExistingResponses(responsesJson: string): Record<string, number> {
  try {
    const parsed = JSON.parse(responsesJson);
    return parsed?.ratings ?? {};
  } catch {
    return {};
  }
}

/* -------------------------------------------------------------------
   Component
   ------------------------------------------------------------------- */

export function StructuredScorecardForm({
  applicationId,
  seekerId,
  currentStage,
  candidateName,
  editingScore,
  onSubmitted,
  onCancel,
  scorecardTemplateId,
}: StructuredScorecardFormProps) {
  // Use stage config template override if provided, else auto-detect by stage
  const template = scorecardTemplateId
    ? (DEFAULT_SCORECARD_TEMPLATES.find((t) => t.id === scorecardTemplateId) ??
      getTemplateForStage(currentStage))
    : getTemplateForStage(currentStage);

  // Initialize from existing score if editing
  const [ratings, setRatings] = React.useState<Record<string, number>>(() =>
    editingScore ? parseExistingResponses(editingScore.responses) : {}
  );
  const [recommendation, setRecommendation] = React.useState<RecType | undefined>(() =>
    editingScore ? enumToRec(editingScore.recommendation) : undefined
  );
  const [comments, setComments] = React.useState(() => editingScore?.comments ?? "");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  // Computed values
  const ratedCriteria = Object.keys(ratings).filter((k) => ratings[k] >= 1);
  const totalCriteria = template.sections.reduce((sum, s) => sum + s.criteria.length, 0);
  const requiredMet = areRequiredCriteriaRated(template, ratings);
  const averageRating =
    ratedCriteria.length > 0
      ? ratedCriteria.reduce((sum, k) => sum + ratings[k], 0) / ratedCriteria.length
      : 0;

  // Auto-suggest recommendation based on ratings
  React.useEffect(() => {
    if (ratedCriteria.length > 0 && !recommendation) {
      const overallRating = computeOverallRating({
        ratings,
        averageRating,
      });
      const suggested = ratingToRecommendation(overallRating);
      setRecommendation(enumToRec(suggested));
    }
  }, [ratings, ratedCriteria.length, averageRating, recommendation]);

  const handleRatingChange = (criterionId: string, value: number) => {
    setRatings((prev) => ({ ...prev, [criterionId]: value }));
  };

  const canSubmit = requiredMet && recommendation !== undefined && ratedCriteria.length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setSubmitError(null);

    const overallRating = computeOverallRating({ ratings, averageRating });
    const responses: ScorecardResponses = { ratings, averageRating };

    try {
      const isEditing = !!editingScore;
      const url = isEditing
        ? `/api/canopy/candidates/${seekerId}/scores/${editingScore.id}`
        : `/api/canopy/candidates/${seekerId}/scores`;

      const res = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId,
          overallRating,
          recommendation: recToEnum(recommendation!),
          comments: comments || null,
          responses: JSON.stringify(responses),
          stageId: currentStage || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to submit scorecard");
      }

      onSubmitted();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to submit scorecard");
      logger.error("Failed to submit structured scorecard", { error: formatError(err) });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Template header */}
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-body-strong font-semibold text-[var(--foreground-default)]">
            {template.name}
          </h3>
          <Badge variant="neutral" size="sm">
            {ratedCriteria.length}/{totalCriteria} rated
          </Badge>
        </div>
        <p className="mt-1 text-caption text-[var(--foreground-muted)]">{template.description}</p>
      </div>

      {/* Error banner */}
      {submitError && (
        <div className="rounded-lg bg-[var(--background-error)] px-4 py-3 text-caption text-[var(--foreground-error)]">
          {submitError}
        </div>
      )}

      {/* Criteria sections */}
      {template.sections.map((section) => (
        <div key={section.id} className="space-y-3">
          <h4 className="text-caption-strong font-bold text-[var(--foreground-brand)]">
            {section.title}
          </h4>

          <div className="space-y-2">
            {section.criteria.map((criterion) => (
              <div
                key={criterion.id}
                className="flex items-start justify-between gap-4 rounded-lg bg-[var(--background-subtle)] p-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-body-sm font-medium text-[var(--foreground-default)]">
                      {criterion.label}
                    </span>
                    {criterion.required && (
                      <span className="text-caption text-[var(--foreground-error)]">*</span>
                    )}
                    <SimpleTooltip content={criterion.description}>
                      <Info
                        size={14}
                        weight="regular"
                        className="shrink-0 text-[var(--foreground-subtle)]"
                      />
                    </SimpleTooltip>
                  </div>
                </div>
                <div className="shrink-0">
                  <StarRating
                    value={ratings[criterion.id] ?? 0}
                    onChange={(v) => handleRatingChange(criterion.id, v)}
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <Separator />

      {/* Overall score summary */}
      {ratedCriteria.length > 0 && (
        <div className="flex items-center gap-4 rounded-lg bg-[var(--background-brand-subtle)] p-4">
          <Star size={24} weight="fill" className="text-[var(--primitive-yellow-500)]" />
          <div>
            <span className="text-heading-sm font-bold text-[var(--foreground-default)]">
              {averageRating.toFixed(1)}
            </span>
            <span className="ml-1 text-caption text-[var(--foreground-muted)]">
              average across {ratedCriteria.length} criteria
            </span>
          </div>
        </div>
      )}

      {/* Recommendation selector */}
      <div className="space-y-2">
        <label className="text-caption-strong font-bold text-[var(--foreground-default)]">
          Your Recommendation <span className="text-[var(--foreground-error)]">*</span>
        </label>
        <RecommendationSelect value={recommendation} onChange={setRecommendation} />
      </div>

      {/* Comments */}
      <div className="space-y-2">
        <label className="text-caption-strong font-bold text-[var(--foreground-default)]">
          Additional Notes
        </label>
        <Textarea
          placeholder={`Leave a note about ${candidateName}...`}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={3}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="primary"
          className="flex-1"
          onClick={handleSubmit}
          disabled={!canSubmit}
          loading={isSubmitting}
        >
          {editingScore ? "Update Scorecard" : "Submit Scorecard"}
        </Button>
        <Button variant="tertiary" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      {/* Validation hint */}
      {!requiredMet && ratedCriteria.length > 0 && (
        <p className="text-caption text-[var(--foreground-warning)]">
          Please rate all required criteria (marked with *) before submitting.
        </p>
      )}
    </div>
  );
}
