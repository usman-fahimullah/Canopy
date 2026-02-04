"use client";

import { Star, Users } from "@phosphor-icons/react";
import { Avatar, Badge } from "@/components/ui";
import type { Mentor, MatchQuality } from "@/lib/coaching";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface MentorListItemProps {
  mentor: Mentor;
  /** Whether this item is selected in the browse list */
  selected?: boolean;
  onClick?: (mentor: Mentor) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MATCH_QUALITY_CONFIG: Record<MatchQuality, { label: string; variant: "success" | "info" }> = {
  great_match: { label: "Great Match", variant: "success" },
  good_match: { label: "Good Match", variant: "info" },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MentorListItem({
  mentor,
  selected = false,
  onClick,
  className,
}: MentorListItemProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(mentor)}
      className={cn(
        "flex w-full items-start gap-3 rounded-[var(--radius-card)] px-4 py-3 text-left transition-colors",
        "hover:bg-[var(--background-interactive-hover)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-interactive-focus)] focus-visible:ring-offset-2",
        selected &&
          "border-l-2 border-l-[var(--border-brand-emphasis)] bg-[var(--background-interactive-selected)]",
        !selected && "border-l-2 border-l-transparent",
        className
      )}
    >
      <Avatar size="default" src={mentor.avatar ?? undefined} fallback={mentor.name.charAt(0)} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-body-sm font-semibold text-[var(--foreground-default)]">
            {mentor.name}
          </span>
          {mentor.matchQuality && (
            <Badge variant={MATCH_QUALITY_CONFIG[mentor.matchQuality].variant} size="sm">
              {MATCH_QUALITY_CONFIG[mentor.matchQuality].label}
            </Badge>
          )}
        </div>

        {mentor.role && (
          <p className="mt-0.5 truncate text-caption text-[var(--foreground-muted)]">
            {mentor.role}
            {mentor.company ? ` at ${mentor.company}` : ""}
          </p>
        )}

        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-caption text-[var(--foreground-subtle)]">
          {mentor.rating > 0 && (
            <span className="flex items-center gap-1">
              <Star size={12} weight="fill" className="text-[var(--foreground-warning)]" />
              {mentor.rating.toFixed(1)}
            </span>
          )}
          {mentor.menteeCount > 0 && (
            <span className="flex items-center gap-1">
              <Users size={12} />
              {mentor.menteeCount}
            </span>
          )}
          {mentor.specialties?.slice(0, 2).map((s) => (
            <span
              key={s}
              className="rounded-[var(--radius-badge)] bg-[var(--background-subtle)] px-1.5 py-0.5 text-caption-sm"
            >
              {s}
            </span>
          ))}
          {(mentor.specialties?.length ?? 0) > 2 && (
            <span className="text-caption-sm">+{(mentor.specialties?.length ?? 0) - 2}</span>
          )}
        </div>
      </div>

      {mentor.matchScore != null && mentor.matchScore > 0 && (
        <Badge
          variant={
            mentor.matchScore >= 80 ? "success" : mentor.matchScore >= 50 ? "warning" : "neutral"
          }
          size="sm"
        >
          {mentor.matchScore}%
        </Badge>
      )}
    </button>
  );
}
