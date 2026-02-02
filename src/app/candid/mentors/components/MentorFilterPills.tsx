"use client";

import { cn } from "@/lib/utils";
import type { MentorFilterType } from "./types";

const filters: { value: MentorFilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "recommended", label: "Recommended" },
  { value: "available", label: "Available" },
];

export function MentorFilterPills({
  activeFilter,
  onFilterChange,
}: {
  activeFilter: MentorFilterType;
  onFilterChange: (filter: MentorFilterType) => void;
}) {
  return (
    <div className="flex items-center gap-2" role="radiogroup" aria-label="Filter mentors">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.value;
        return (
          <button
            key={filter.value}
            role="radio"
            aria-checked={isActive}
            onClick={() => onFilterChange(filter.value)}
            className={cn(
              "rounded-full px-4 py-1.5 text-caption font-medium transition-colors duration-150",
              isActive
                ? "bg-[var(--primitive-green-100)] text-[var(--primitive-green-700)]"
                : "bg-[var(--background-default)] border border-[var(--primitive-neutral-300)] text-[var(--primitive-neutral-600)] hover:bg-[var(--primitive-neutral-100)]"
            )}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
