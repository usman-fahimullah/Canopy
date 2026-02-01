"use client";

import type { MentorFilterType } from "./types";

interface MentorFilterPillsProps {
  active: MentorFilterType;
  onChange: (filter: MentorFilterType) => void;
}

const FILTERS: { value: MentorFilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "recommended", label: "Recommended" },
  { value: "available", label: "Available" },
];

export function MentorFilterPills({ active, onChange }: MentorFilterPillsProps) {
  return (
    <div className="flex flex-row gap-2">
      {FILTERS.map(({ value, label }) => {
        const isActive = active === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={`rounded-full px-4 py-2 text-caption font-medium transition-colors ${
              isActive
                ? "bg-[var(--primitive-green-800)] text-[var(--primitive-neutral-0)]"
                : "bg-[var(--primitive-neutral-200)] text-[var(--primitive-neutral-700)] hover:bg-[var(--primitive-neutral-300)]"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
