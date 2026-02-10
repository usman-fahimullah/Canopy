"use client";

import * as React from "react";
import { SyndicationPanel } from "@/components/canopy/roles/SyndicationPanel";
import { logger, formatError } from "@/lib/logger";
import type { JobData } from "../../_lib/types";

// ============================================
// TYPES
// ============================================

interface JobBoardsSectionProps {
  jobData: JobData;
  onJobDataChange: (updater: (prev: JobData) => JobData) => void;
}

// ============================================
// COMPONENT
// ============================================

export function JobBoardsSection({ jobData, onJobDataChange }: JobBoardsSectionProps) {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h3 className="text-body-strong font-medium text-[var(--foreground-default)]">
          Job Boards
        </h3>
        <p className="mt-1 text-caption text-[var(--foreground-muted)]">
          Syndicate this role to external job boards and track posting status.
        </p>
      </div>

      <SyndicationPanel
        jobId={jobData.id}
        syndicationEnabled={jobData.syndicationEnabled}
        jobStatus={jobData.status}
        onToggleSyndication={async (enabled) => {
          try {
            const res = await fetch(`/api/canopy/roles/${jobData.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ syndicationEnabled: enabled }),
            });
            if (res.ok) {
              onJobDataChange((prev) => ({ ...prev, syndicationEnabled: enabled }));
            }
          } catch (error) {
            logger.error("Failed to toggle syndication", { error: formatError(error) });
          }
        }}
      />
    </div>
  );
}
