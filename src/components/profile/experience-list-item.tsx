"use client";

import {
  Avatar,
  ListItem,
  ListItemLeading,
  ListItemContent,
  ListItemTitle,
  ListItemDescription,
  ListItemTrailing,
  ListItemTrailingText,
} from "@/components/ui";

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
    <ListItem size="md" className="border-b border-[var(--border-muted)] last:border-0">
      {/* Company logo */}
      <ListItemLeading size="md">
        <Avatar src={companyLogo ?? undefined} name={companyName} shape="square" size="default" />
      </ListItemLeading>

      {/* Title + company */}
      <ListItemContent>
        <ListItemTitle>{jobTitle}</ListItemTitle>
        <ListItemDescription>
          {companyName}
          {employmentType && ` · ${employmentType}`}
        </ListItemDescription>
      </ListItemContent>

      {/* Date range */}
      <ListItemTrailing>
        <ListItemTrailingText>
          {formatDateRange(startDate, endDate, isCurrent)}
        </ListItemTrailingText>
      </ListItemTrailing>
    </ListItem>
  );
}
