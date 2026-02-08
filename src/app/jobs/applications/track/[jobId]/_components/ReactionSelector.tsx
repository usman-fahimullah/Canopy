"use client";

import { cn } from "@/lib/utils";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { emojiConfig, type EmojiReaction } from "@/components/ui/job-application-table";

/**
 * ReactionSelector — Horizontal row of emoji reaction circles.
 *
 * Matches the emoji reactions from the Your Jobs table.
 * Selected emoji gets a purple highlight ring. State is managed
 * via localStorage in the parent (TrackedJobView).
 */

interface ReactionSelectorProps {
  value: EmojiReaction;
  onChange: (reaction: EmojiReaction) => void;
}

const reactions = Object.entries(emojiConfig) as [
  Exclude<EmojiReaction, "none">,
  (typeof emojiConfig)[Exclude<EmojiReaction, "none">],
][];

export function ReactionSelector({ value, onChange }: ReactionSelectorProps) {
  return (
    <section>
      <h4 className="mb-3 text-caption-strong text-[var(--foreground-default)]">Reaction</h4>
      <div className="flex items-center gap-3">
        {reactions.map(([key, config]) => {
          const Icon = config.icon;
          const isSelected = key === value;

          return (
            <SimpleTooltip key={key} content={config.label}>
              <button
                onClick={() => onChange(isSelected ? "none" : key)}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                  isSelected
                    ? "border-[var(--primitive-purple-500)] bg-[var(--primitive-purple-100)]"
                    : "border-transparent bg-[var(--background-subtle)] hover:bg-[var(--background-interactive-hover)]"
                )}
                aria-label={`${isSelected ? "Remove" : "Set"} ${config.label} reaction`}
                aria-pressed={isSelected}
              >
                <Icon
                  size={20}
                  weight="fill"
                  className={cn(
                    isSelected
                      ? "text-[var(--primitive-purple-500)]"
                      : "text-[var(--foreground-muted)]"
                  )}
                />
              </button>
            </SimpleTooltip>
          );
        })}
      </div>
    </section>
  );
}
