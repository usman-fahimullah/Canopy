"use client";

import { Avatar } from "@/components/ui/avatar";

interface ExperienceListItemProps {
  companyName: string;
  jobTitle: string;
  employmentType?: string | null;
  startDate: string;
  endDate?: string | null;
  isCurrent?: boolean;
  companyLogo?: string | null;
}

function formatDateRange(start: string, end: string | null | undefined, isCurrent?: boolean) {
  const startYear = new Date(start).getFullYear();
  if (isCurrent) return `${startYear} - Present`;
  if (!end) return `${startYear}`;
  const endYear = new Date(end).getFullYear();
  return `${startYear} - ${endYear}`;
}

export function ExperienceListItem({
  companyName,
  jobTitle,
  employmentType,
  startDate,
  endDate,
  isCurrent,
  companyLogo,
}: ExperienceListItemProps) {
  return (
    <div className="flex items-center gap-4 border-b border-[var(--border-muted)] py-4 last:border-0">
      {/* Company logo */}
      <Avatar src={companyLogo ?? undefined} name={companyName} shape="square" size="default" />

      {/* Title + company */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-body font-medium text-[var(--foreground-default)]">
          {jobTitle}
        </p>
        <p className="text-caption text-[var(--foreground-muted)]">
          {companyName}
          {employmentType && ` · ${employmentType}`}
        </p>
      </div>

      {/* Date range */}
      <p className="shrink-0 text-caption text-[var(--foreground-muted)]">
        {formatDateRange(startDate, endDate, isCurrent)}
      </p>
    </div>
  );
}
