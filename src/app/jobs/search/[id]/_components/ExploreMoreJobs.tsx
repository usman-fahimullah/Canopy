"use client";

import { JobPostCard } from "@/components/ui";
import type { PathwayType } from "@/components/ui/pathway-tag";
import { getLocationTypeLabel, getEmploymentTypeLabel, getJobStatus } from "@/lib/jobs/helpers";
import type { SimilarJob } from "./types";

interface ExploreMoreJobsProps {
  similarJobs: SimilarJob[];
}

export function ExploreMoreJobs({ similarJobs }: ExploreMoreJobsProps) {
  if (similarJobs.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-body font-bold text-[var(--foreground-default)]">Explore More Jobs</h3>
      {similarJobs.map((sj) => (
        <JobPostCard
          key={sj.id}
          companyName={sj.organization.name}
          companyLogo={sj.organization.logo ?? undefined}
          jobTitle={sj.title}
          pathway={
            sj.climateCategory?.toLowerCase().replace(/\s+/g, "-") as PathwayType | undefined
          }
          status={getJobStatus({
            organization: sj.organization,
            isBipocOwned: sj.organization.isBipocOwned,
          })}
          tags={[getLocationTypeLabel(sj.locationType), getEmploymentTypeLabel(sj.employmentType)]}
          size="full"
          onViewJob={() => {
            window.location.href = `/jobs/search/${sj.id}`;
          }}
        />
      ))}
    </div>
  );
}
