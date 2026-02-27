"use client";

import { cn } from "@/lib/utils";
import { Check } from "@phosphor-icons/react";
import {
  stageOrder,
  sectionConfig,
  stageColors,
  getStageItemState,
  type ApplicationSection,
} from "@/components/ui/job-application-table";

/**
 * MigrateToSection — Vertical stage progression list for the sidebar.
 *
 * Reuses the same stage order, colors, and state logic from the
 * StagePill dropdown in job-application-table.tsx, but in a vertical
 * always-visible format.
 */

interface MigrateToSectionProps {
  currentStage: ApplicationSection;
  onStageChange: (stage: ApplicationSection) => void;
}

export function MigrateToSection({ currentStage, onStageChange }: MigrateToSectionProps) {
  return (
    <section>
      <h4 className="mb-3 text-caption-strong text-[var(--foreground-default)]">Migrate to</h4>
      <div className="flex flex-col gap-2">
        {stageOrder.map((stage) => {
          const config = sectionConfig[stage];
          const colors = stageColors[stage];
          const itemState = getStageItemState(stage, currentStage);

          return (
            <button
              key={stage}
              onClick={() => onStageChange(stage)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg p-2.5 text-left transition-colors",
                itemState === "selected" && colors.selectedBg,
                itemState === "past" && "bg-[var(--primitive-neutral-100)]",
                itemState === "default" &&
                  "bg-[var(--primitive-neutral-0)] hover:bg-[var(--background-interactive-hover)]"
              )}
            >
              {/* Icon box */}
              <div
                className={cn(
                  "flex size-6 items-center justify-center rounded",
                  itemState === "selected" && colors.iconBg,
                  itemState === "past" &&
                    "border border-[var(--primitive-neutral-300)] bg-[var(--primitive-neutral-0)]",
                  itemState === "default" &&
                    "border border-[var(--primitive-neutral-300)] bg-[var(--primitive-neutral-0)]"
                )}
              >
                {itemState === "selected" ? (
                  <Check size={16} weight="bold" className="text-[var(--foreground-on-emphasis)]" />
                ) : itemState === "past" ? (
                  <Check size={16} weight="bold" className="text-[var(--primitive-neutral-300)]" />
                ) : null}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "text-caption-strong",
                  itemState === "selected" && colors.selectedText,
                  itemState === "past" && "text-[var(--primitive-neutral-500)]",
                  itemState === "default" && "text-[var(--primitive-green-800)]"
                )}
              >
                {config.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
