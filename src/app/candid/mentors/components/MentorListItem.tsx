"use client";

import { Avatar } from "@/components/ui/avatar";
import { MapPin, Star } from "@phosphor-icons/react";
import { MentorBadge } from "./MentorBadge";
import type { Mentor } from "./types";

export function MentorListItem({
  mentor,
  isSelected,
  onClick,
}: {
  mentor: Mentor;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-selected={isSelected}
      className={`w-full text-left px-5 py-4 transition-all duration-150 border-l-2 ${
        isSelected
          ? "bg-background-brand-subtle border-l-foreground-brand"
          : "border-l-transparent hover:bg-background-subtle"
      }`}
    >
      <div className="flex items-start gap-3">
        <Avatar
          size="default"
          src={mentor.avatar || undefined}
          name={mentor.name}
          color="green"
          className="mt-0.5 shrink-0"
        />
        <div className="flex-1 min-w-0">
          {/* Name + Badge */}
          <div className="flex items-center gap-2">
            <p
              className={`text-body-sm font-semibold truncate ${
                isSelected
                  ? "text-foreground-brand"
                  : "text-foreground-default"
              }`}
            >
              {mentor.name}
            </p>
            {mentor.badge && <MentorBadge type={mentor.badge} />}
          </div>

          {/* Role */}
          {mentor.role && (
            <p className="text-caption text-foreground-muted truncate mt-0.5">
              {mentor.role}
            </p>
          )}

          {/* Specialty */}
          {mentor.specialty && (
            <p className="text-caption font-medium text-[var(--primitive-green-600)] truncate mt-0.5">
              {mentor.specialty}
            </p>
          )}

          {/* Location + Rating */}
          <div className="flex items-center gap-2 mt-1 text-caption text-foreground-subtle">
            {mentor.location && (
              <span className="flex items-center gap-0.5">
                <MapPin size={12} />
                {mentor.location}
              </span>
            )}
            {mentor.rating > 0 && (
              <span className="flex items-center gap-0.5">
                <Star
                  size={12}
                  weight="fill"
                  className="text-[var(--primitive-yellow-500)]"
                />
                {mentor.rating.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
