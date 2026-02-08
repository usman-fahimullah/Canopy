"use client";

import { Eye, EyeSlash, GearSix } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CareerPageConfig, CareerPageSection } from "@/lib/career-pages/types";
import { SECTION_LABELS } from "./constants";

interface PageOverviewPanelProps {
  config: CareerPageConfig;
  isPublished: boolean;
  onSelectSection: (index: number) => void;
  onOpenSettings: () => void;
}

export function PageOverviewPanel({
  config,
  isPublished,
  onSelectSection,
  onOpenSettings,
}: PageOverviewPanelProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-default)] px-4 py-3">
        <h2 className="text-sm font-semibold text-[var(--foreground-default)]">Page Overview</h2>
        <Badge variant={isPublished ? "success" : "neutral"} size="sm">
          {isPublished ? "Published" : "Draft"}
        </Badge>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Quick theme summary */}
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-[var(--border-muted)] p-3">
          <div
            className="h-6 w-6 shrink-0 rounded-md border border-[var(--border-muted)]"
            style={{ backgroundColor: config.theme.primaryColor }}
            title={`Primary: ${config.theme.primaryColor}`}
          />
          {config.theme.secondaryColor && (
            <div
              className="h-6 w-6 shrink-0 rounded-md border border-[var(--border-muted)]"
              style={{ backgroundColor: config.theme.secondaryColor }}
              title={`Secondary: ${config.theme.secondaryColor}`}
            />
          )}
          {config.theme.accentColor && (
            <div
              className="h-6 w-6 shrink-0 rounded-md border border-[var(--border-muted)]"
              style={{ backgroundColor: config.theme.accentColor }}
              title={`Accent: ${config.theme.accentColor}`}
            />
          )}
          <span className="ml-1 text-xs text-[var(--foreground-muted)]">
            {config.theme.fontFamily}
          </span>
          <div className="flex-1" />
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onOpenSettings}>
            <GearSix size={16} />
          </Button>
        </div>

        {/* Section list */}
        <div className="space-y-1">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--foreground-subtle)]">
            Sections ({config.sections.length})
          </p>

          {config.sections.map((section, index) => {
            const isHidden = section.visible === false;
            return (
              <button
                key={`${section.type}-${index}`}
                type="button"
                onClick={() => onSelectSection(index)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--background-interactive-hover)]"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[var(--background-brand-subtle)] text-[10px] font-bold text-[var(--foreground-brand)]">
                  {index + 1}
                </span>
                <span
                  className={`flex-1 truncate ${isHidden ? "text-[var(--foreground-disabled)]" : "text-[var(--foreground-default)]"}`}
                >
                  {SECTION_LABELS[section.type] || section.type}
                </span>
                {isHidden && (
                  <EyeSlash size={14} className="shrink-0 text-[var(--foreground-disabled)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[var(--border-default)] p-4">
        <Button variant="secondary" size="sm" className="w-full" onClick={onOpenSettings}>
          <GearSix size={16} className="mr-1.5" />
          Page Settings
        </Button>
      </div>
    </div>
  );
}
