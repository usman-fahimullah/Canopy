"use client";

import { useEffect, useRef } from "react";
import {
  Image,
  Info,
  Leaf,
  ChartBar,
  Heart,
  Users,
  Briefcase,
  Megaphone,
  Quotes,
  Question,
} from "@phosphor-icons/react";
import type { CareerPageSection } from "@/lib/career-pages/types";

const SECTION_OPTIONS: {
  type: CareerPageSection["type"];
  label: string;
  icon: typeof Image;
  description: string;
}[] = [
  {
    type: "hero",
    label: "Hero Banner",
    icon: Image,
    description: "Full-width header with headline",
  },
  { type: "about", label: "About Us", icon: Info, description: "Company story and mission" },
  { type: "values", label: "Our Values", icon: Leaf, description: "Core values with icons" },
  { type: "impact", label: "Impact Metrics", icon: ChartBar, description: "Key numbers and stats" },
  { type: "benefits", label: "Benefits", icon: Heart, description: "Perks and benefits list" },
  { type: "team", label: "Team Members", icon: Users, description: "Meet the team grid" },
  {
    type: "openRoles",
    label: "Open Positions",
    icon: Briefcase,
    description: "Auto-populated job listings",
  },
  {
    type: "cta",
    label: "Call to Action",
    icon: Megaphone,
    description: "Prompt visitors to apply",
  },
  {
    type: "testimonials",
    label: "Testimonials",
    icon: Quotes,
    description: "Employee quotes and stories",
  },
  { type: "faq", label: "FAQ", icon: Question, description: "Common questions and answers" },
];

interface AddSectionPickerProps {
  onSelect: (type: CareerPageSection["type"]) => void;
  onClose: () => void;
}

export function AddSectionPicker({ onSelect, onClose }: AddSectionPickerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute top-full z-20 mt-2 w-72 rounded-xl border border-[var(--border-default)] bg-[var(--background-default)] p-2 shadow-[var(--shadow-dropdown)]"
    >
      <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-[var(--foreground-subtle)]">
        Add Section
      </p>
      {/* One-off: Menu-item style buttons with two-line layout (label + description) —
          no <Button> variant supports this pattern, similar to DropdownMenu items */}
      <div className="max-h-80 space-y-0.5 overflow-y-auto">
        {SECTION_OPTIONS.map(({ type, label, icon: Icon, description }) => (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-[var(--background-interactive-hover)]"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--background-brand-subtle)]">
              <Icon size={16} weight="bold" className="text-[var(--foreground-brand)]" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--foreground-default)]">{label}</p>
              <p className="truncate text-xs text-[var(--foreground-subtle)]">{description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
