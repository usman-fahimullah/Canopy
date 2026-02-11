"use client";

import { useRouter } from "next/navigation";
import { Avatar, Badge, Button, InfoTag } from "@/components/ui";
import { Heart, MapPin, Clock, Briefcase } from "@phosphor-icons/react";
import { SaveButton } from "./SaveButton";
import { formatSalary, getExperienceLevelLabel } from "./helpers";
import { getLocationTypeLabel, getEmploymentTypeLabel } from "@/lib/jobs/helpers";
import type { JobDetail } from "./types";

interface JobHeaderProps {
  job: JobDetail;
}

export function JobHeader({ job }: JobHeaderProps) {
  const router = useRouter();
  const showBipocBadge = job.organization.isBipocOwned;
  const salary = formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod);

  return (
    <div className="border-b border-[var(--border-muted)] bg-[var(--background-default)] px-6 py-6 lg:px-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Left: Title + Company + Metadata */}
        <div className="flex flex-col gap-3">
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

          {/* Quick-scan metadata chips */}
          <div className="flex flex-wrap items-center gap-2">
            {job.location && (
              <InfoTag>
                <MapPin size={14} weight="bold" className="mr-1 inline-block shrink-0" />
                {job.location.split(",")[0].trim()}
              </InfoTag>
            )}
            <InfoTag>
              <Briefcase size={14} weight="bold" className="mr-1 inline-block shrink-0" />
              {getEmploymentTypeLabel(job.employmentType)}
            </InfoTag>
            <InfoTag>
              <Clock size={14} weight="bold" className="mr-1 inline-block shrink-0" />
              {getLocationTypeLabel(job.locationType)}
            </InfoTag>
            {job.experienceLevel && (
              <InfoTag>{getExperienceLevelLabel(job.experienceLevel)}</InfoTag>
            )}
            {salary !== "Not specified" && <InfoTag>{salary}</InfoTag>}
          </div>
        </div>

        {/* Right: Action buttons — hidden on mobile (shown in sticky CTA) */}
        <div className="hidden items-center gap-3 sm:flex">
          <Button variant="primary" size="lg" onClick={() => router.push(`/apply/${job.id}`)}>
            Apply Now
          </Button>
          <SaveButton jobId={job.id} initialSaved={job.isSaved} />
        </div>
      </div>
    </div>
  );
}
