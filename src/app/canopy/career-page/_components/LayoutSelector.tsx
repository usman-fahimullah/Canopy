"use client";

import { cn } from "@/lib/utils";
import type { CareerPageSection } from "@/lib/career-pages/types";

/* ------------------------------------------------------------------ */
/* Layout options per section type                                     */
/* ------------------------------------------------------------------ */

interface LayoutOption {
  value: string;
  label: string;
  /** Small SVG line-art preview */
  preview: React.ReactNode;
}

const HERO_LAYOUTS: LayoutOption[] = [
  {
    value: "centered",
    label: "Centered",
    preview: (
      <svg viewBox="0 0 48 32" className="h-full w-full">
        <rect x="14" y="8" width="20" height="3" rx="1" fill="currentColor" opacity={0.7} />
        <rect x="17" y="14" width="14" height="2" rx="1" fill="currentColor" opacity={0.4} />
        <rect x="19" y="19" width="10" height="3" rx="1.5" fill="currentColor" opacity={0.6} />
      </svg>
    ),
  },
  {
    value: "left-aligned",
    label: "Left",
    preview: (
      <svg viewBox="0 0 48 32" className="h-full w-full">
        <rect x="4" y="8" width="20" height="3" rx="1" fill="currentColor" opacity={0.7} />
        <rect x="4" y="14" width="14" height="2" rx="1" fill="currentColor" opacity={0.4} />
        <rect x="4" y="19" width="10" height="3" rx="1.5" fill="currentColor" opacity={0.6} />
      </svg>
    ),
  },
  {
    value: "split",
    label: "Split",
    preview: (
      <svg viewBox="0 0 48 32" className="h-full w-full">
        <rect x="3" y="8" width="18" height="3" rx="1" fill="currentColor" opacity={0.7} />
        <rect x="3" y="14" width="14" height="2" rx="1" fill="currentColor" opacity={0.4} />
        <rect x="3" y="19" width="10" height="3" rx="1.5" fill="currentColor" opacity={0.6} />
        <rect x="27" y="6" width="18" height="20" rx="2" fill="currentColor" opacity={0.15} />
      </svg>
    ),
  },
];

const VALUES_LAYOUTS: LayoutOption[] = [
  {
    value: "3-col",
    label: "3 Column",
    preview: (
      <svg viewBox="0 0 48 32" className="h-full w-full">
        <rect x="3" y="8" width="12" height="16" rx="2" fill="currentColor" opacity={0.15} />
        <rect x="18" y="8" width="12" height="16" rx="2" fill="currentColor" opacity={0.15} />
        <rect x="33" y="8" width="12" height="16" rx="2" fill="currentColor" opacity={0.15} />
      </svg>
    ),
  },
  {
    value: "2-col",
    label: "2 Column",
    preview: (
      <svg viewBox="0 0 48 32" className="h-full w-full">
        <rect x="3" y="8" width="20" height="16" rx="2" fill="currentColor" opacity={0.15} />
        <rect x="25" y="8" width="20" height="16" rx="2" fill="currentColor" opacity={0.15} />
      </svg>
    ),
  },
  {
    value: "4-col",
    label: "4 Column",
    preview: (
      <svg viewBox="0 0 48 32" className="h-full w-full">
        <rect x="2" y="8" width="9" height="16" rx="1.5" fill="currentColor" opacity={0.15} />
        <rect x="13" y="8" width="9" height="16" rx="1.5" fill="currentColor" opacity={0.15} />
        <rect x="24" y="8" width="9" height="16" rx="1.5" fill="currentColor" opacity={0.15} />
        <rect x="35" y="8" width="9" height="16" rx="1.5" fill="currentColor" opacity={0.15} />
      </svg>
    ),
  },
];

const BENEFITS_LAYOUTS: LayoutOption[] = [
  {
    value: "2-col",
    label: "2 Column",
    preview: (
      <svg viewBox="0 0 48 32" className="h-full w-full">
        <rect x="3" y="6" width="20" height="8" rx="2" fill="currentColor" opacity={0.15} />
        <rect x="25" y="6" width="20" height="8" rx="2" fill="currentColor" opacity={0.15} />
        <rect x="3" y="18" width="20" height="8" rx="2" fill="currentColor" opacity={0.15} />
        <rect x="25" y="18" width="20" height="8" rx="2" fill="currentColor" opacity={0.15} />
      </svg>
    ),
  },
  {
    value: "3-col",
    label: "3 Column",
    preview: (
      <svg viewBox="0 0 48 32" className="h-full w-full">
        <rect x="3" y="8" width="12" height="16" rx="2" fill="currentColor" opacity={0.15} />
        <rect x="18" y="8" width="12" height="16" rx="2" fill="currentColor" opacity={0.15} />
        <rect x="33" y="8" width="12" height="16" rx="2" fill="currentColor" opacity={0.15} />
      </svg>
    ),
  },
  {
    value: "list",
    label: "List",
    preview: (
      <svg viewBox="0 0 48 32" className="h-full w-full">
        <rect x="3" y="5" width="42" height="6" rx="2" fill="currentColor" opacity={0.15} />
        <rect x="3" y="13" width="42" height="6" rx="2" fill="currentColor" opacity={0.15} />
        <rect x="3" y="21" width="42" height="6" rx="2" fill="currentColor" opacity={0.15} />
      </svg>
    ),
  },
];

const TEAM_LAYOUTS: LayoutOption[] = [
  {
    value: "grid",
    label: "Grid",
    preview: (
      <svg viewBox="0 0 48 32" className="h-full w-full">
        <circle cx="10" cy="12" r="4" fill="currentColor" opacity={0.15} />
        <circle cx="24" cy="12" r="4" fill="currentColor" opacity={0.15} />
        <circle cx="38" cy="12" r="4" fill="currentColor" opacity={0.15} />
        <rect x="6" y="18" width="8" height="2" rx="1" fill="currentColor" opacity={0.3} />
        <rect x="20" y="18" width="8" height="2" rx="1" fill="currentColor" opacity={0.3} />
        <rect x="34" y="18" width="8" height="2" rx="1" fill="currentColor" opacity={0.3} />
      </svg>
    ),
  },
  {
    value: "list",
    label: "List",
    preview: (
      <svg viewBox="0 0 48 32" className="h-full w-full">
        <circle cx="8" cy="10" r="3" fill="currentColor" opacity={0.15} />
        <rect x="14" y="8" width="20" height="2" rx="1" fill="currentColor" opacity={0.3} />
        <rect x="14" y="12" width="14" height="1.5" rx="0.75" fill="currentColor" opacity={0.15} />
        <circle cx="8" cy="22" r="3" fill="currentColor" opacity={0.15} />
        <rect x="14" y="20" width="20" height="2" rx="1" fill="currentColor" opacity={0.3} />
        <rect x="14" y="24" width="14" height="1.5" rx="0.75" fill="currentColor" opacity={0.15} />
      </svg>
    ),
  },
  {
    value: "cards",
    label: "Cards",
    preview: (
      <svg viewBox="0 0 48 32" className="h-full w-full">
        <rect x="2" y="4" width="13" height="24" rx="2" fill="currentColor" opacity={0.1} />
        <rect x="17" y="4" width="13" height="24" rx="2" fill="currentColor" opacity={0.1} />
        <rect x="32" y="4" width="13" height="24" rx="2" fill="currentColor" opacity={0.1} />
        <circle cx="8.5" cy="12" r="3" fill="currentColor" opacity={0.2} />
        <circle cx="23.5" cy="12" r="3" fill="currentColor" opacity={0.2} />
        <circle cx="38.5" cy="12" r="3" fill="currentColor" opacity={0.2} />
      </svg>
    ),
  },
];

const IMPACT_LAYOUTS: LayoutOption[] = [
  {
    value: "horizontal",
    label: "Horizontal",
    preview: (
      <svg viewBox="0 0 48 32" className="h-full w-full">
        <rect x="3" y="10" width="12" height="12" rx="2" fill="currentColor" opacity={0.15} />
        <rect x="18" y="10" width="12" height="12" rx="2" fill="currentColor" opacity={0.15} />
        <rect x="33" y="10" width="12" height="12" rx="2" fill="currentColor" opacity={0.15} />
      </svg>
    ),
  },
  {
    value: "stacked",
    label: "Stacked",
    preview: (
      <svg viewBox="0 0 48 32" className="h-full w-full">
        <rect x="10" y="3" width="28" height="7" rx="2" fill="currentColor" opacity={0.15} />
        <rect x="10" y="12.5" width="28" height="7" rx="2" fill="currentColor" opacity={0.15} />
        <rect x="10" y="22" width="28" height="7" rx="2" fill="currentColor" opacity={0.15} />
      </svg>
    ),
  },
  {
    value: "large-single",
    label: "Featured",
    preview: (
      <svg viewBox="0 0 48 32" className="h-full w-full">
        <rect x="3" y="4" width="22" height="24" rx="2" fill="currentColor" opacity={0.2} />
        <rect x="28" y="4" width="17" height="11" rx="2" fill="currentColor" opacity={0.1} />
        <rect x="28" y="17" width="17" height="11" rx="2" fill="currentColor" opacity={0.1} />
      </svg>
    ),
  },
];

const TESTIMONIALS_LAYOUTS: LayoutOption[] = [
  {
    value: "cards",
    label: "Cards",
    preview: (
      <svg viewBox="0 0 48 32" className="h-full w-full">
        <rect x="2" y="6" width="13" height="20" rx="2" fill="currentColor" opacity={0.12} />
        <rect x="17" y="6" width="13" height="20" rx="2" fill="currentColor" opacity={0.12} />
        <rect x="32" y="6" width="13" height="20" rx="2" fill="currentColor" opacity={0.12} />
      </svg>
    ),
  },
  {
    value: "single-featured",
    label: "Featured",
    preview: (
      <svg viewBox="0 0 48 32" className="h-full w-full">
        <rect x="8" y="6" width="32" height="20" rx="2" fill="currentColor" opacity={0.12} />
        <rect x="14" y="10" width="20" height="2" rx="1" fill="currentColor" opacity={0.3} />
        <rect x="16" y="14" width="16" height="1.5" rx="0.75" fill="currentColor" opacity={0.2} />
        <circle cx="24" cy="21" r="2.5" fill="currentColor" opacity={0.2} />
      </svg>
    ),
  },
  {
    value: "minimal",
    label: "Minimal",
    preview: (
      <svg viewBox="0 0 48 32" className="h-full w-full">
        <rect x="6" y="6" width="36" height="1.5" rx="0.75" fill="currentColor" opacity={0.3} />
        <rect x="10" y="10" width="28" height="1" rx="0.5" fill="currentColor" opacity={0.15} />
        <rect x="16" y="13" width="16" height="1" rx="0.5" fill="currentColor" opacity={0.15} />
        <line x1="12" y1="18" x2="36" y2="18" stroke="currentColor" strokeOpacity={0.1} />
        <rect x="6" y="21" width="36" height="1.5" rx="0.75" fill="currentColor" opacity={0.3} />
        <rect x="10" y="25" width="28" height="1" rx="0.5" fill="currentColor" opacity={0.15} />
      </svg>
    ),
  },
];

/* ------------------------------------------------------------------ */
/* Layout map per section type                                         */
/* ------------------------------------------------------------------ */

const LAYOUT_OPTIONS: Partial<Record<CareerPageSection["type"], LayoutOption[]>> = {
  hero: HERO_LAYOUTS,
  values: VALUES_LAYOUTS,
  benefits: BENEFITS_LAYOUTS,
  team: TEAM_LAYOUTS,
  impact: IMPACT_LAYOUTS,
  testimonials: TESTIMONIALS_LAYOUTS,
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

interface LayoutSelectorProps {
  sectionType: CareerPageSection["type"];
  value: string | undefined;
  onChange: (layout: string) => void;
}

export function LayoutSelector({ sectionType, value, onChange }: LayoutSelectorProps) {
  const options = LAYOUT_OPTIONS[sectionType];
  if (!options) return null;

  const currentValue = value || options[0].value;

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-lg border p-2 transition-all",
              currentValue === option.value
                ? "border-[var(--border-brand)] bg-[var(--background-brand-subtle)] ring-1 ring-[var(--border-brand)]"
                : "border-[var(--border-muted)] bg-[var(--background-default)] hover:border-[var(--border-emphasis)]"
            )}
            onClick={() => onChange(option.value)}
          >
            <div className="h-8 w-full text-[var(--foreground-muted)]">{option.preview}</div>
            <span
              className={cn(
                "text-[10px] font-medium",
                currentValue === option.value
                  ? "text-[var(--foreground-brand)]"
                  : "text-[var(--foreground-subtle)]"
              )}
            >
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Check if a section type supports layout variants.
 */
export function hasLayoutOptions(sectionType: CareerPageSection["type"]): boolean {
  return sectionType in LAYOUT_OPTIONS;
}
