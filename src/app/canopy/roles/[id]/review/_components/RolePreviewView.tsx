"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PreviewBanner } from "./PreviewBanner";
import { PreviewJobHeader } from "./PreviewJobHeader";
import { CheckoutModal } from "./CheckoutModal";
import { JobDescription } from "@/app/jobs/search/[id]/_components/JobDescription";
import { ApplyBeforeCard } from "@/app/jobs/search/[id]/_components/ApplyBeforeCard";
import { RecruiterCard } from "@/app/jobs/search/[id]/_components/RecruiterCard";
import { HighlightsCard } from "@/app/jobs/search/[id]/_components/HighlightsCard";
import { RoleOverviewCard } from "@/app/jobs/search/[id]/_components/RoleOverviewCard";
import { AboutCompanyCard } from "@/app/jobs/search/[id]/_components/AboutCompanyCard";
import type { JobDetail } from "@/app/jobs/search/[id]/_components/types";
import { logger, formatError } from "@/lib/logger";

interface RolePreviewViewProps {
  job: JobDetail;
  roleId: string;
  isPublished: boolean;
}

export function RolePreviewView({ job, roleId, isPublished }: RolePreviewViewProps) {
  const router = useRouter();
  const [showCheckout, setShowCheckout] = React.useState(false);
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [publishError, setPublishError] = React.useState<string | null>(null);

  const handleEdit = () => {
    router.push(`/canopy/roles/${roleId}`);
  };

  const handlePublishClick = () => {
    // Always show checkout modal for now (mock).
    // In the future, check org's billing plan — if subscribed, publish directly.
    setShowCheckout(true);
  };

  const handlePublishConfirm = async () => {
    setIsPublishing(true);
    setPublishError(null);

    try {
      const res = await fetch(`/api/canopy/roles/${roleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PUBLISHED" }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to publish role");
      }

      // Navigate to confirmation page
      router.push(`/canopy/roles/${roleId}/published`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to publish role";
      logger.error("Error publishing role", { error: formatError(err) });
      setPublishError(message);
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background-subtle)]">
      {/* Sticky Preview Banner */}
      <PreviewBanner
        isPublished={isPublished}
        onEdit={handleEdit}
        onPublish={handlePublishClick}
        isPublishing={isPublishing}
      />

      {/* Error message */}
      {publishError && (
        <div className="bg-[var(--background-error)] px-6 py-3 text-center text-caption text-[var(--foreground-error)] lg:px-12">
          {publishError}
        </div>
      )}

      {/* Job Header — title, company, badges (no seeker actions) */}
      <PreviewJobHeader job={job} />

      {/* Two-column Content — mirrors the seeker job detail layout */}
      <div className="flex flex-col gap-6 px-6 py-6 lg:flex-row lg:px-12">
        {/* Left Column: Job Description */}
        <JobDescription description={job.description} />

        {/* Right Column: Sidebar cards (no tabs, just cards stacked) */}
        <div className="w-full shrink-0 space-y-6 lg:w-[350px]">
          <ApplyBeforeCard closesAt={job.closesAt} />
          <RecruiterCard recruiter={job.recruiter} />
          <RecruiterCard recruiter={job.hiringManager} label="Hiring Manager" />
          <HighlightsCard job={job} />
          <RoleOverviewCard job={job} />
          <AboutCompanyCard organization={job.organization} />
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        open={showCheckout}
        onOpenChange={setShowCheckout}
        roleTitle={job.title}
        onConfirm={handlePublishConfirm}
        isProcessing={isPublishing}
      />
    </div>
  );
}
