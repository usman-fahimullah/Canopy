"use client";

import { useState, useRef } from "react";
import { Plus } from "@phosphor-icons/react";
import { AddSectionPicker } from "./AddSectionPicker";
import type { CareerPageSection } from "@/lib/career-pages/types";

interface SectionInsertButtonProps {
  onInsert: (type: CareerPageSection["type"]) => void;
}

export function SectionInsertButton({ onInsert }: SectionInsertButtonProps) {
  const [showPicker, setShowPicker] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} className="group relative flex h-6 items-center justify-center">
      {/* Hover line */}
      <div className="absolute inset-x-4 h-px bg-transparent transition-colors group-hover:bg-[var(--border-brand)]" />

      {/* One-off: Raw button required — starts fully transparent and only appears on
          group-hover; <Button> default styles conflict with this invisible→visible pattern */}
      <button
        onClick={() => setShowPicker(true)}
        className="relative z-[1] flex h-6 w-6 items-center justify-center rounded-full border border-transparent bg-transparent text-transparent transition-all group-hover:border-[var(--border-brand)] group-hover:bg-[var(--background-default)] group-hover:text-[var(--foreground-brand)] group-hover:shadow-[var(--shadow-xs)]"
        title="Add section"
        aria-label="Add section"
      >
        <Plus size={14} weight="bold" />
      </button>

      {showPicker && (
        <AddSectionPicker
          onSelect={(type) => {
            onInsert(type);
            setShowPicker(false);
          }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}
