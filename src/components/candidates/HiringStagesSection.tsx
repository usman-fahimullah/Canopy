"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/scorecard";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { CaretDown, Circle, CheckCircle, ArrowRight } from "@phosphor-icons/react";
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

interface Stage {
  id: string;
  name: string;
}

interface HiringStagesSectionProps {
  stages: Stage[];
  currentStage: string;
  scores: ScoreData[];
  averageScore: number | null;
}

export function HiringStagesSection({
  stages,
  currentStage,
  scores,
  averageScore,
}: HiringStagesSectionProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const currentStageIdx = stages.findIndex(
    (s) => s.id.toLowerCase() === currentStage.toLowerCase()
  );

  return (
    <section>
      <h3 className="mb-3 text-body font-semibold text-[var(--foreground-default)]">
        Hiring stages
      </h3>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        {/* Primary stage row */}
        <div className="rounded-lg border border-[var(--border-muted)] bg-[var(--background-subtle)]">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primitive-blue-500)]">
                <ArrowRight size={12} weight="bold" className="text-white" />
              </div>
              <span className="text-body-sm font-medium text-[var(--foreground-default)]">
                {stages.find((s) => s.id.toLowerCase() === currentStage.toLowerCase())?.name ??
                  currentStage}
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Rating summary */}
              {averageScore !== null ? (
                <div className="flex items-center gap-2">
                  <StarRating value={averageScore} readOnly size="sm" showValue />
                  <span className="text-caption text-[var(--foreground-muted)]">
                    ({scores.length} {scores.length === 1 ? "review" : "reviews"})
                  </span>
                </div>
              ) : (
                <span className="text-caption text-[var(--foreground-muted)]">No reviews</span>
              )}

              <Badge variant="info" size="sm">
                Review
              </Badge>
            </div>
          </div>

          {/* Expanded: all stages */}
          <CollapsibleContent>
            <div className="border-t border-[var(--border-muted)] px-4 py-2">
              {stages.map((stage, idx) => {
                const isCurrent = stage.id.toLowerCase() === currentStage.toLowerCase();
                const isPast = idx < currentStageIdx;

                return (
                  <div key={stage.id} className="flex items-center gap-3 py-2">
                    {isPast ? (
                      <CheckCircle
                        size={18}
                        weight="fill"
                        className="text-[var(--primitive-green-500)]"
                      />
                    ) : isCurrent ? (
                      <div className="flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-[var(--primitive-blue-500)]">
                        <div className="h-2 w-2 rounded-full bg-[var(--primitive-blue-500)]" />
                      </div>
                    ) : (
                      <Circle size={18} className="text-[var(--foreground-disabled)]" />
                    )}
                    <span
                      className={`text-body-sm ${
                        isCurrent
                          ? "font-medium text-[var(--foreground-default)]"
                          : isPast
                            ? "text-[var(--foreground-muted)]"
                            : "text-[var(--foreground-disabled)]"
                      }`}
                    >
                      {stage.name}
                    </span>
                  </div>
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
              {isOpen ? "Show less" : "Show more"}
            </button>
          </CollapsibleTrigger>
        </div>
      </Collapsible>
    </section>
  );
}
