"use client";

import { SearchHeader } from "./SearchHeader";
import { JobHeader } from "./JobHeader";
import { JobDescription } from "./JobDescription";
import { SidebarTabs } from "./SidebarTabs";
import { ApplyBeforeCard } from "./ApplyBeforeCard";
import { RecruiterCard } from "./RecruiterCard";
import { HighlightsCard } from "./HighlightsCard";
import { RoleOverviewCard } from "./RoleOverviewCard";
import { AboutCompanyCard } from "./AboutCompanyCard";
import { ExploreMoreJobs } from "./ExploreMoreJobs";
import { MobileCTA } from "./MobileCTA";
import type { JobDetail, SimilarJob } from "./types";

interface JobDetailViewProps {
  job: JobDetail;
  similarJobs: SimilarJob[];
}

export function JobDetailView({ job, similarJobs }: JobDetailViewProps) {
  return (
    <div className="pb-20 lg:pb-0">
      {/* Search Bar Header */}
      <SearchHeader />

      {/* Job Header — title, company, action buttons */}
      <JobHeader job={job} />

      {/* Two-column Content */}
      <div className="flex flex-col gap-6 bg-[var(--background-subtle)] px-6 py-6 lg:flex-row lg:px-12">
        {/* Left Column: Job Description */}
        <JobDescription description={job.description} />

        {/* Right Column: Sidebar */}
        <div className="w-full shrink-0 lg:w-[350px]">
          <SidebarTabs job={job}>
            {/* Apply Before */}
            <ApplyBeforeCard closesAt={job.closesAt} />

            {/* Recruiter */}
            <RecruiterCard recruiter={job.recruiter} />

            {/* Highlights */}
            <HighlightsCard job={job} />

            {/* Role Overview */}
            <RoleOverviewCard job={job} />

            {/* About Company */}
            <AboutCompanyCard organization={job.organization} />

            {/* Explore More Jobs */}
            <ExploreMoreJobs similarJobs={similarJobs} />
          </SidebarTabs>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <MobileCTA jobId={job.id} isSaved={job.isSaved} />
    </div>
  );
}
