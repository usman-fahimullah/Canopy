"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/scorecard";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { CaretDown, CaretRight, ArrowCircleRight, Star, Clock } from "@phosphor-icons/react";
import type { Recommendation } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";

/**
 * HiringStagesSection — Figma-aligned stage card with 3-column rows.
 *
 * @figma https://figma.com/design/niUFJMIpfrizs1Kjsu1O4S/Candid?node-id=890-1314
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

interface Stage {
  id: string;
  name: string;
}

interface HiringStagesSectionProps {
  stages: Stage[];
  currentStage: string;
  scores: ScoreData[];
  averageScore: number | null;
  /** Which stage's review panel is currently open */
  selectedStageId?: string | null;
  /** Called when user clicks CaretRight to open review panel for a stage */
  onOpenReview?: (stageId: string) => void;
  /** Application created date (for "Applied X ago") */
  appliedAt?: Date;
}

export function HiringStagesSection({
  stages,
  currentStage,
  scores,
  averageScore,
  selectedStageId,
  onOpenReview,
  appliedAt,
}: HiringStagesSectionProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const currentStageIdx = stages.findIndex(
    (s) => s.id.toLowerCase() === currentStage.toLowerCase()
  );

  const currentStageName =
    stages.find((s) => s.id.toLowerCase() === currentStage.toLowerCase())?.name ?? currentStage;

  const timeAgo = appliedAt ? formatDistanceToNow(new Date(appliedAt), { addSuffix: false }) : null;

  const hasReviews = scores.length > 0 && averageScore !== null;

  return (
    <section>
      <h3 className="mb-3 text-heading-sm font-medium text-[var(--foreground-default)]">
        Hiring Stages
      </h3>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div
          className="overflow-clip rounded-2xl border border-[var(--card-border)] bg-[var(--card-background)]"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          {/* Primary stage row */}
          <button
            type="button"
            onClick={() => onOpenReview?.(currentStage)}
            className={`flex w-full items-center px-4 py-2 pr-2 transition-colors hover:bg-[var(--background-interactive-hover)] ${
              selectedStageId?.toLowerCase() === currentStage.toLowerCase()
                ? "ring-2 ring-inset ring-[var(--border-brand)]"
                : ""
            }`}
          >
            {/* Col 1: Stage icon + name */}
            <div className="flex flex-1 items-center gap-3">
              <ArrowCircleRight
                size={24}
                weight="fill"
                className="text-[var(--primitive-blue-500)]"
              />
              <span className="text-body font-medium text-[var(--foreground-default)]">
                {currentStageName}
              </span>
            </div>

            {/* Col 2: Score */}
            <div className="flex flex-1 items-center gap-2">
              {hasReviews ? (
                <>
                  <Star size={24} weight="fill" className="text-[var(--primitive-yellow-500)]" />
                  <span className="text-body font-medium text-[var(--foreground-default)]">
                    {averageScore.toFixed(1)}
                  </span>
                  <span className="text-caption text-[var(--foreground-muted)]">
                    ({scores.length} {scores.length === 1 ? "Review" : "Reviews"})
                  </span>
                </>
              ) : (
                <span className="text-caption text-[var(--foreground-muted)]">In Review</span>
              )}
            </div>

            {/* Col 3: Time + CaretRight */}
            <div className="flex flex-1 items-center justify-end gap-2">
              {timeAgo && (
                <>
                  <Clock size={24} weight="regular" className="text-[var(--foreground-muted)]" />
                  <span className="text-caption text-[var(--foreground-muted)]">
                    Applied {timeAgo} ago
                  </span>
                </>
              )}
              <CaretRight size={20} weight="bold" className="text-[var(--foreground-muted)]" />
            </div>
          </button>

          {/* Expanded: all stages */}
          <CollapsibleContent>
            <div className="border-t border-[var(--border-muted)] px-4 py-2">
              {stages.map((stage, idx) => {
                const isCurrent = stage.id.toLowerCase() === currentStage.toLowerCase();
                const isPast = idx < currentStageIdx;
                const isSelected = selectedStageId?.toLowerCase() === stage.id.toLowerCase();

                if (isCurrent) return null; // Already shown above

                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => onOpenReview?.(stage.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-[var(--background-interactive-hover)] ${
                      isSelected ? "bg-[var(--background-interactive-selected)]" : ""
                    }`}
                  >
                    <ArrowCircleRight
                      size={24}
                      weight={isPast ? "fill" : "regular"}
                      className={
                        isPast
                          ? "text-[var(--primitive-green-500)]"
                          : "text-[var(--foreground-disabled)]"
                      }
                    />
                    <span
                      className={`text-body ${
                        isPast
                          ? "text-[var(--foreground-muted)]"
                          : "text-[var(--foreground-disabled)]"
                      }`}
                    >
                      {stage.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </CollapsibleContent>

          {/* Show more trigger */}
          <CollapsibleTrigger asChild>
            <button className="flex w-full items-center justify-center gap-1 border-t border-[var(--border-muted)] py-2 text-caption text-[var(--foreground-muted)] transition-colors hover:bg-[var(--background-interactive-hover)]">
              <CaretDown
                size={14}
                className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              />
              {isOpen ? "Show less" : "Show more stages"}
            </button>
          </CollapsibleTrigger>
        </div>
      </Collapsible>
    </section>
  );
}
