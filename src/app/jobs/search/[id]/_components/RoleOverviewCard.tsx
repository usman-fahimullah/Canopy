"use client";

import { InfoTag, CategoryTag } from "@/components/ui";
import type { JobCategoryType } from "@/components/ui";
import { Briefcase } from "@phosphor-icons/react";
import { getExperienceLevelLabel } from "./helpers";
import { getLocationTypeLabel } from "@/lib/jobs/helpers";
import type { JobDetail } from "./types";

interface RoleOverviewCardProps {
  job: JobDetail;
}

export function RoleOverviewCard({ job }: RoleOverviewCardProps) {
  return (
    <div className="rounded-2xl border border-[var(--border-muted)] bg-[var(--background-default)]">
      <div className="flex items-center gap-2 px-6 py-4">
        <Briefcase size={24} weight="duotone" className="text-[var(--foreground-brand)]" />
        <span className="text-body font-bold text-[var(--foreground-default)]">Role Overview</span>
      </div>
      <div className="space-y-2 px-6 pb-4">
        {/* Job Type */}
        {job.climateCategory && (
          <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-3">
            <span className="text-sm text-[var(--foreground-default)]">Job Type</span>
            <CategoryTag
              category={
                job.climateCategory
                  .toLowerCase()
                  .replace(/\s+&\s+/g, "-")
                  .replace(/\s+/g, "-") as JobCategoryType
              }
              variant="truncate"
            />
          </div>
        )}

        {/* Level */}
        <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-3">
          <span className="text-sm text-[var(--foreground-default)]">Level</span>
          <InfoTag>{getExperienceLevelLabel(job.experienceLevel)}</InfoTag>
        </div>

        {/* Location */}
        {job.location && (
          <div className="flex items-center justify-between gap-2 border-b border-[var(--border-muted)] pb-3">
            <span className="shrink-0 text-sm text-[var(--foreground-default)]">Location</span>
            <div className="flex flex-wrap justify-end gap-1">
              {job.location.split(",").map((loc) => (
                <InfoTag key={loc.trim()}>{loc.trim()}</InfoTag>
              ))}
            </div>
          </div>
        )}

        {/* Workplace */}
        <div className="flex items-center justify-between pb-1">
          <span className="text-sm text-[var(--foreground-default)]">Workplace</span>
          <InfoTag>{getLocationTypeLabel(job.locationType)}</InfoTag>
        </div>
      </div>
    </div>
  );
}
