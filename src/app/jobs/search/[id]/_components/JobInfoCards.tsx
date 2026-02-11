"use client";

import { InfoTag } from "@/components/ui";
import type { JobCategoryType } from "@/components/ui";
import { CategoryTag } from "@/components/ui";
import { Briefcase, Clock, MapPin } from "@phosphor-icons/react";
import { formatSalary, getExperienceLevelLabel, getEducationLevelLabel } from "./helpers";
import { getLocationTypeLabel, getEmploymentTypeLabel } from "@/lib/jobs/helpers";
import type { JobDetail } from "./types";

interface JobInfoCardsProps {
  job: JobDetail;
}

export function JobInfoCards({ job }: JobInfoCardsProps) {
  const salary = formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod);

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-6 pt-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-12">
      {/* Role & Job Type */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[var(--border-muted)] bg-[var(--background-default)] p-5">
        <span className="text-caption font-medium text-[var(--foreground-subtle)]">
          Role &amp; Job Type
        </span>
        <div className="flex flex-wrap gap-2">
          {job.climateCategory && (
            <CategoryTag
              category={
                job.climateCategory
                  .toLowerCase()
                  .replace(/\s+&\s+/g, "-")
                  .replace(/\s+/g, "-") as JobCategoryType
              }
            />
          )}
          <InfoTag>
            <Briefcase size={14} weight="bold" className="mr-1 inline-block shrink-0" />
            {getEmploymentTypeLabel(job.employmentType)}
          </InfoTag>
          <InfoTag>
            <MapPin size={14} weight="bold" className="mr-1 inline-block shrink-0" />
            {getLocationTypeLabel(job.locationType)}
          </InfoTag>
        </div>
      </div>

      {/* Experience */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[var(--border-muted)] bg-[var(--background-default)] p-5">
        <span className="text-caption font-medium text-[var(--foreground-subtle)]">Experience</span>
        <div className="flex flex-col gap-1">
          <span className="text-heading-sm font-bold text-[var(--foreground-default)]">
            {getExperienceLevelLabel(job.experienceLevel)}
          </span>
          {job.educationLevel && job.educationLevel !== "NONE" && (
            <span className="text-caption text-[var(--foreground-muted)]">
              {getEducationLevelLabel(job.educationLevel)}
            </span>
          )}
        </div>
      </div>

      {/* Compensation */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[var(--border-muted)] bg-[var(--background-default)] p-5">
        <span className="text-caption font-medium text-[var(--foreground-subtle)]">
          Compensation
        </span>
        <div className="flex flex-col gap-1">
          <span className="text-heading-sm font-bold text-[var(--foreground-default)]">
            {salary}
          </span>
          {job.impactDescription && (
            <span className="line-clamp-2 text-caption text-[var(--foreground-muted)]">
              {job.impactDescription}
            </span>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[var(--border-brand)] bg-[var(--background-brand-subtle)] p-5">
        <span className="text-caption font-medium text-[var(--foreground-brand)]">Status</span>
        <div className="flex flex-col gap-2">
          <span className="text-heading-sm font-bold text-[var(--foreground-brand-emphasis)]">
            Accepting applications
          </span>
          {job.closesAt && (
            <span className="text-caption text-[var(--foreground-brand)]">
              <Clock size={14} weight="bold" className="mr-1 inline-block shrink-0" />
              Closes{" "}
              {new Date(job.closesAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
