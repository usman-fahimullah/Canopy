"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "./textarea";
import { CaretDown, NotePencil } from "@phosphor-icons/react";

export interface InternalNotesSectionProps {
  value: string;
  onChange: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

const InternalNotesSection: React.FC<InternalNotesSectionProps> = ({
  value,
  onChange,
  isOpen,
  onToggle,
  className,
}) => {
  const hasContent = value.trim().length > 0;

  return (
    <div className={className}>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex items-center gap-1.5 text-[13px] transition-colors",
          hasContent && !isOpen
            ? "text-[var(--primitive-green-700)] hover:text-[var(--primitive-green-800)]"
            : "text-[var(--foreground-muted)] hover:text-[var(--foreground-default)]"
        )}
      >
        <CaretDown
          size={14}
          weight="bold"
          className={cn("transition-transform", !isOpen && "-rotate-90")}
        />
        {hasContent && !isOpen ? <NotePencil size={14} weight="fill" /> : null}
        <span>Internal notes</span>
        {hasContent && !isOpen && (
          <span className="ml-1 rounded-full bg-[var(--primitive-green-100)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--primitive-green-700)]">
            Has notes
          </span>
        )}
      </button>
      {isOpen && (
        <div className="mt-2">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Notes for your team (not shared with candidate)"
            className="min-h-[80px] resize-none border-[var(--primitive-neutral-300)] bg-transparent text-sm focus:border-[var(--primitive-neutral-400)]"
          />
        </div>
      )}
    </div>
  );
};

InternalNotesSection.displayName = "InternalNotesSection";

export { InternalNotesSection };
