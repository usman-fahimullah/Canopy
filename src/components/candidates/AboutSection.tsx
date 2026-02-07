"use client";

import * as React from "react";
import { StageBadge } from "@/components/ui/stage-badge";
import { InfoTag } from "@/components/ui/info-tag";
import { CategoryTag } from "@/components/ui/category-tag";
import { format } from "date-fns";
import type { JobCategoryType } from "@/components/ui/category-tag";

/**
 * AboutSection — Figma-aligned 2-column about info display.
 *
 * @figma https://figma.com/design/niUFJMIpfrizs1Kjsu1O4S/Candid?node-id=890-1346
 */

interface AboutSectionProps {
  createdAt: Date;
  source: string | null;
  /** Job category for the CategoryTag (e.g., "advocacy-policy") */
  jobCategory?: string | null;
  /** Data retention period text */
  dataRetention?: string | null;
  /** Called when removing the source tag */
  onRemoveSource?: () => void;
}

interface InfoRowProps {
  label: string;
  children: React.ReactNode;
  isLast?: boolean;
}

function InfoRow({ label, children, isLast = false }: InfoRowProps) {
  return (
    <div
      className={`flex items-center gap-32 py-3 ${
        !isLast ? "border-b border-[var(--border-emphasis)]" : ""
      }`}
    >
      <dt className="flex-[1_0_0] text-body text-[var(--foreground-muted)]">{label}</dt>
      <dd className="flex-[1_0_0] text-body text-[var(--foreground-default)]">{children}</dd>
    </div>
  );
}

export function AboutSection({
  createdAt,
  source,
  jobCategory,
  dataRetention,
  onRemoveSource,
}: AboutSectionProps) {
  const rows: Array<{ label: string; content: React.ReactNode }> = [
    {
      label: "Created",
      content: format(new Date(createdAt), "MMM dd, yyyy"),
    },
    {
      label: "Origin",
      content: <StageBadge variant="applied">Applied</StageBadge>,
    },
  ];

  if (source) {
    rows.push({
      label: "Source",
      content: (
        <InfoTag removable={!!onRemoveSource} onRemove={onRemoveSource}>
          {source}
        </InfoTag>
      ),
    });
  }

  if (jobCategory) {
    rows.push({
      label: "Tags",
      content: <CategoryTag category={jobCategory as JobCategoryType} />,
    });
  }

  rows.push({
    label: "Data Retention Period",
    content: (
      <span className="text-[var(--foreground-muted)]">
        {dataRetention ?? "Pending request for extension"}
      </span>
    ),
  });

  return (
    <section>
      <h3 className="mb-3 text-heading-sm font-medium text-[var(--foreground-default)]">About</h3>
      <dl>
        {rows.map((row, idx) => (
          <InfoRow key={row.label} label={row.label} isLast={idx === rows.length - 1}>
            {row.content}
          </InfoRow>
        ))}
      </dl>
    </section>
  );
}
