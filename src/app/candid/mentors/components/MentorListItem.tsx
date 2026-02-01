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
      aria-pressed={isSelected}
      className={`w-full border-b border-[var(--primitive-neutral-200)] px-6 py-4 text-left transition-all duration-150 ${
        isSelected ? "bg-background-brand-subtle" : "bg-white hover:bg-background-subtle"
      }`}
    >
      <div className="flex items-start gap-3">
        <Avatar
          size="default"
          src={mentor.avatar || undefined}
          name={mentor.name}
          color="green"
          shape="square"
          className="shrink-0 !rounded-[16px] border border-[var(--primitive-neutral-300)]"
        />
        <div className="min-w-0 flex-1">
          {/* Name + Badge */}
          <div className="flex items-center gap-2">
            <p className="truncate text-[18px] leading-6 text-[var(--primitive-neutral-800)]">
              {mentor.name}
            </p>
            {mentor.badge && <MentorBadge type={mentor.badge} />}
          </div>

          {/* Role */}
          {mentor.role && (
            <p className="mt-1 truncate text-caption text-[var(--primitive-neutral-600)]">
              {mentor.role}
            </p>
          )}

          {/* Specialty */}
          {mentor.specialty && (
            <p className="mt-1 truncate text-caption font-bold text-[var(--primitive-green-600)]">
              {mentor.specialty}
            </p>
          )}

          {/* Location + Rating */}
          <div className="mt-1 flex items-center gap-1 text-caption text-[var(--primitive-neutral-600)]">
            {mentor.location && (
              <span className="flex items-center gap-1">
                <MapPin size={16} />
                {mentor.location}
              </span>
            )}
            {mentor.location && mentor.rating > 0 && (
              <span className="text-[var(--primitive-neutral-500)]">&middot;</span>
            )}
            {mentor.rating > 0 && (
              <span className="flex items-center gap-1">
                <Star size={16} weight="fill" className="text-[var(--primitive-yellow-500)]" />
                {mentor.rating.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
