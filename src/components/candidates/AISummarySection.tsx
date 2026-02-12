"use client";

import { Sparkle } from "@phosphor-icons/react";

interface AISummarySectionProps {
  summary: string | null;
}

export function AISummarySection({ summary }: AISummarySectionProps) {
  if (!summary) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkle size={16} weight="fill" className="text-[var(--foreground-brand)]" />
        <h3 className="text-caption-strong font-semibold text-[var(--foreground-default)]">
          AI Summary
        </h3>
      </div>
      <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--background-subtle)] p-4">
        <p className="text-body-sm leading-relaxed text-[var(--foreground-muted)]">{summary}</p>
      </div>
    </div>
  );
}
