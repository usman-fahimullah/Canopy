"use client";

import { Avatar, Badge } from "@/components/ui";
import { Heart } from "@phosphor-icons/react";
import type { JobDetail } from "@/app/jobs/search/[id]/_components/types";

interface PreviewJobHeaderProps {
  job: JobDetail;
}

/**
 * Employer-facing job header for the preview page.
 * Same layout as the seeker JobHeader but without Apply Now + Save buttons.
 */
export function PreviewJobHeader({ job }: PreviewJobHeaderProps) {
  const showBipocBadge = job.organization.isBipocOwned;

  return (
    <div className="border-b border-[var(--border-muted)] bg-[var(--background-default)] px-6 py-6 lg:px-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-heading-sm font-medium text-[var(--foreground-default)]">
          {job.title}
        </h1>
        <div className="flex items-center gap-2">
          <Avatar
            size="xs"
            src={job.organization.logo ?? undefined}
            name={job.organization.name}
            className="shrink-0"
          />
          <span className="text-body text-[var(--foreground-default)]">
            {job.organization.name}
          </span>
          {showBipocBadge && (
            <Badge
              variant="default"
              icon={
                <Heart size={14} weight="fill" className="text-[var(--primitive-purple-500)]" />
              }
              className="bg-[var(--primitive-purple-100)] text-[var(--primitive-purple-600)]"
            >
              BIPOC Owned
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
