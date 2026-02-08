"use client";

import { Separator } from "@/components/ui/separator";
import { PathwayTag } from "@/components/ui/pathway-tag";
import type { PathwayType } from "@/components/ui/pathway-tag";
import { getLocationTypeLabel, getEmploymentTypeLabel } from "@/lib/jobs/helpers";
import { getExperienceLevelLabel } from "@/app/jobs/search/[id]/_components/helpers";
import { formatSalary } from "@/app/jobs/search/[id]/_components/helpers";
import { ReactionSelector } from "./ReactionSelector";
import { MigrateToSection } from "./MigrateToSection";
import type { TrackedJobData, ApplicationSection, EmojiReaction } from "./types";

/**
 * PropertiesSidebar — Right sidebar for the tracked job detail page.
 *
 * Adapted from the candidate page aside pattern (CandidateDetailView).
 * Uses the 2-column dl/InfoRow pattern from ContactInfoSection and AboutSection.
 *
 * Sections:
 * 1. Reaction — Emoji circle buttons
 * 2. Migrate To — Vertical stage list
 * 3. Overview — Job metadata in dt/dd rows
 */

interface PropertiesSidebarProps {
  data: TrackedJobData;
  reaction: EmojiReaction;
  currentStage: ApplicationSection;
  onReactionChange: (reaction: EmojiReaction) => void;
  onStageChange: (stage: ApplicationSection) => void;
}

/** InfoRow — 2-column row for the Overview section (adapted from candidate page pattern) */
function InfoRow({
  label,
  children,
  isLast = false,
}: {
  label: string;
  children: React.ReactNode;
  isLast?: boolean;
}) {
  return (
    <div
      className={`flex items-baseline gap-4 py-2.5 ${
        !isLast ? "border-b border-[var(--border-muted)]" : ""
      }`}
    >
      <dt className="w-20 shrink-0 text-caption text-[var(--foreground-muted)]">{label}</dt>
      <dd className="flex-1 text-caption text-[var(--foreground-default)]">{children}</dd>
    </div>
  );
}

export function PropertiesSidebar({
  data,
  reaction,
  currentStage,
  onReactionChange,
  onStageChange,
}: PropertiesSidebarProps) {
  // Build overview rows
  const overviewRows: Array<{ label: string; content: React.ReactNode }> = [];

  if (data.pathway) {
    overviewRows.push({
      label: "Pathway",
      content: <PathwayTag pathway={data.pathway.slug as PathwayType} />,
    });
  }

  if (data.salaryMin || data.salaryMax) {
    overviewRows.push({
      label: "Salary",
      content: formatSalary(data.salaryMin, data.salaryMax, data.salaryCurrency),
    });
  }

  if (data.experienceLevel) {
    overviewRows.push({
      label: "Level",
      content: getExperienceLevelLabel(data.experienceLevel),
    });
  }

  if (data.location) {
    overviewRows.push({
      label: "Location",
      content: `${data.location} (${getLocationTypeLabel(data.locationType)})`,
    });
  } else {
    overviewRows.push({
      label: "Location",
      content: getLocationTypeLabel(data.locationType),
    });
  }

  overviewRows.push({
    label: "Type",
    content: getEmploymentTypeLabel(data.employmentType),
  });

  return (
    <div className="space-y-6 p-6">
      {/* Reaction selector */}
      <ReactionSelector value={reaction} onChange={onReactionChange} />

      <Separator />

      {/* Migrate to stage list */}
      <MigrateToSection currentStage={currentStage} onStageChange={onStageChange} />

      <Separator />

      {/* Overview section — adapted from candidate page InfoRow pattern */}
      <section>
        <h4 className="mb-3 text-caption-strong text-[var(--foreground-default)]">Overview</h4>
        <dl>
          {overviewRows.map((row, idx) => (
            <InfoRow key={row.label} label={row.label} isLast={idx === overviewRows.length - 1}>
              {row.content}
            </InfoRow>
          ))}
        </dl>
      </section>
    </div>
  );
}
