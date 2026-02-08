"use client";

import type {
  CareerPageConfig,
  CareerPageSection,
  CareerPageTheme,
} from "@/lib/career-pages/types";
import { PageOverviewPanel } from "./PageOverviewPanel";
import { SectionEditPanel } from "./SectionEditPanel";

interface EditorRightPanelProps {
  config: CareerPageConfig;
  selectedIndex: number | null;
  isPublished: boolean;
  onSelectSection: (index: number) => void;
  onDeselectSection: () => void;
  onUpdateSection: (updates: Partial<CareerPageSection>) => void;
  onOpenSettings: () => void;
  theme: CareerPageTheme;
}

/**
 * Always-visible right panel — like Figma's properties panel.
 *
 * When no section is selected: shows PageOverviewPanel (section list, theme summary).
 * When a section is selected: shows SectionEditPanel (content + design tabs).
 */
export function EditorRightPanel({
  config,
  selectedIndex,
  isPublished,
  onSelectSection,
  onDeselectSection,
  onUpdateSection,
  onOpenSettings,
  theme,
}: EditorRightPanelProps) {
  const selectedSection = selectedIndex !== null ? (config.sections[selectedIndex] ?? null) : null;

  return (
    <div className="flex h-full w-[380px] shrink-0 flex-col border-l border-[var(--border-default)] bg-[var(--background-default)]">
      {selectedSection && selectedIndex !== null ? (
        <SectionEditPanel
          section={selectedSection}
          onUpdate={onUpdateSection}
          onClose={onDeselectSection}
          theme={theme}
        />
      ) : (
        <PageOverviewPanel
          config={config}
          isPublished={isPublished}
          onSelectSection={onSelectSection}
          onOpenSettings={onOpenSettings}
        />
      )}
    </div>
  );
}
