"use client";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Mentor } from "./types";

interface MentorListItemProps {
  mentor: Mentor;
  isSelected: boolean;
  onClick: () => void;
}

function scoreVariant(score: number) {
  if (score >= 80) return "success" as const;
  if (score >= 50) return "warning" as const;
  return "error" as const;
}

export function MentorListItem({ mentor, isSelected, onClick }: MentorListItemProps) {
  const remaining = mentor.specialties.length - 2;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full cursor-pointer rounded-xl px-4 py-3 text-left transition-colors ${
        isSelected
          ? "border-l-2 border-[var(--primitive-green-600)] bg-[var(--primitive-green-100)]"
          : "hover:bg-[var(--primitive-neutral-100)]"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <Avatar
          src={mentor.avatar ?? undefined}
          name={mentor.name}
          size="sm"
          className="mt-0.5 h-10 w-10 shrink-0"
        />

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Name + match score */}
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-body-sm font-semibold text-[var(--primitive-green-800)]">
              {mentor.name}
            </p>
            <Badge variant={scoreVariant(mentor.matchScore)} size="sm">
              {mentor.matchScore}%
            </Badge>
          </div>

          {/* Role / Company */}
          <p className="truncate text-caption text-[var(--primitive-neutral-600)]">
            {mentor.role} at {mentor.company}
          </p>

          {/* Specialty tags */}
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {mentor.specialties.slice(0, 2).map((specialty) => (
              <Badge key={specialty} variant="neutral" size="sm">
                {specialty}
              </Badge>
            ))}
            {remaining > 0 && (
              <span className="text-caption-sm text-[var(--primitive-neutral-500)]">
                +{remaining} more
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
