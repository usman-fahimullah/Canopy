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
      className={`w-full text-left px-6 py-4 transition-all duration-150 border-b border-[var(--primitive-neutral-200)] ${
        isSelected
          ? "bg-background-brand-subtle"
          : "bg-white hover:bg-background-subtle"
      }`}
    >
      <div className="flex items-start gap-3">
        <Avatar
          size="default"
          src={mentor.avatar || undefined}
          name={mentor.name}
          color="green"
          shape="square"
          className="shrink-0 border border-[var(--primitive-neutral-300)] !rounded-[16px]"
        />
        <div className="flex-1 min-w-0">
          {/* Name + Badge */}
          <div className="flex items-center gap-2">
            <p className="text-[18px] leading-6 text-[var(--primitive-neutral-800)] truncate">
              {mentor.name}
            </p>
            {mentor.badge && <MentorBadge type={mentor.badge} />}
          </div>

          {/* Role */}
          {mentor.role && (
            <p className="text-caption text-[var(--primitive-neutral-600)] truncate mt-1">
              {mentor.role}
            </p>
          )}

          {/* Specialty */}
          {mentor.specialty && (
            <p className="text-caption font-bold text-[var(--primitive-green-600)] truncate mt-1">
              {mentor.specialty}
            </p>
          )}

          {/* Location + Rating */}
          <div className="flex items-center gap-1 mt-1 text-caption text-[var(--primitive-neutral-600)]">
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
                <Star
                  size={16}
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
