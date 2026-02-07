"use client";

import * as React from "react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { CaretDown, CaretRight, ArrowCircleRight, Star, Clock } from "@phosphor-icons/react";
import type { Recommendation } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";

/**
 * HiringStagesSection — Figma-aligned stage card with 3-column rows.
 *
 * @figma https://figma.com/design/niUFJMIpfrizs1Kjsu1O4S/Candid?node-id=889-1742
 *
 * Structure (per Figma):
 * - Section title: heading-sm/medium, color primary/g800
 * - Outer card: bg neutral-100, border neutral-200, p-24, gap-24, rounded-16
 *   - White stage row: bg white, shadow level-1, rounded-16, pl-16 pr-8 py-8
 *     - 3 equal flex columns + CaretRight icon-button
 *   - "Show more stages" trigger: px-16, left-aligned, text-body, neutral-600
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
      {/* Section title — Figma: heading-sm/medium, primary/g800, mb-16px */}
      <h3 className="mb-4 text-heading-sm font-medium text-[var(--foreground-brand-emphasis)]">
        Hiring Stages
      </h3>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        {/* Outer card — Figma: bg neutral-100, border neutral-200, p-24, gap-24, rounded-16 */}
        <div className="flex flex-col gap-6 rounded-2xl border border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-100)] p-6">
          {/* Primary stage row — Figma: bg white, shadow level-1, rounded-16, pl-16 pr-8 py-8 */}
          <button
            type="button"
            onClick={() => onOpenReview?.(currentStage)}
            className={`flex w-full items-center gap-1 rounded-2xl bg-[var(--background-default)] py-2 pl-4 pr-2 transition-colors hover:bg-[var(--background-interactive-hover)] ${
              selectedStageId?.toLowerCase() === currentStage.toLowerCase()
                ? "ring-2 ring-inset ring-[var(--border-brand)]"
                : ""
            }`}
            style={{ boxShadow: "1px 2px 16px 0px rgba(31, 29, 28, 0.08)" }}
          >
            {/* Col 1: Stage icon + name */}
            <div className="flex flex-1 items-center gap-2">
              <ArrowCircleRight
                size={24}
                weight="fill"
                className="text-[var(--primitive-blue-500)]"
              />
              <span className="text-body text-[var(--foreground-default)]">{currentStageName}</span>
            </div>

            {/* Col 2: Score — Figma: text-body, color neutral/n600 */}
            <div className="flex flex-1 items-center gap-2">
              {hasReviews ? (
                <>
                  <Star size={24} weight="fill" className="text-[var(--primitive-yellow-500)]" />
                  <span className="text-body text-[var(--foreground-subtle)]">
                    {averageScore.toFixed(1)}
                  </span>
                  <span className="text-body text-[var(--foreground-subtle)]">
                    ({scores.length} {scores.length === 1 ? "Review" : "Reviews"})
                  </span>
                </>
              ) : (
                <span className="text-body text-[var(--foreground-subtle)]">In Review</span>
              )}
            </div>

            {/* Col 3: Time — Figma: text-body, color neutral/n600, gap-4px */}
            <div className="flex flex-1 items-center gap-1">
              {timeAgo && (
                <>
                  <Clock size={24} weight="regular" className="text-[var(--foreground-subtle)]" />
                  <span className="text-body text-[var(--foreground-subtle)]">
                    Applied {timeAgo} ago
                  </span>
                </>
              )}
            </div>

            {/* CaretRight icon button — Figma: p-12, rounded-16 */}
            <div className="shrink-0 rounded-2xl p-3">
              <CaretRight size={24} weight="bold" className="text-[var(--foreground-subtle)]" />
            </div>
          </button>

          {/* Expanded: all stages */}
          <CollapsibleContent>
            <div className="flex flex-col gap-2 px-4">
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
                    className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-[var(--background-interactive-hover)] ${
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

          {/* Show more trigger — Figma: px-16, gap-4, left-aligned, text-body, neutral/n600 */}
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-1 px-4 text-body text-[var(--foreground-subtle)] transition-colors hover:text-[var(--foreground-muted)]">
              <CaretDown
                size={24}
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
