"use client";

import { InfoTag } from "@/components/ui";
import { CalendarStar } from "@phosphor-icons/react";
import { formatSalary } from "./helpers";
import type { JobDetail } from "./types";

interface HighlightsCardProps {
  job: JobDetail;
}

export function HighlightsCard({ job }: HighlightsCardProps) {
  const salary = formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency);

  return (
    <div className="rounded-2xl border border-[var(--border-muted)] bg-[var(--background-default)]">
      <div className="flex items-center gap-2 px-6 py-4">
        <CalendarStar size={24} weight="duotone" className="text-[var(--foreground-brand)]" />
        <span className="text-body font-bold text-[var(--foreground-default)]">Highlights</span>
      </div>
      <div className="space-y-2 px-6 pb-4">
        {/* Compensation */}
        <div className="space-y-2 border-b border-[var(--border-muted)] pb-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--foreground-default)]">
              Compensation
            </span>
            <InfoTag>{salary}</InfoTag>
          </div>
          {job.impactDescription && (
            <p className="text-sm text-[var(--foreground-muted)]">
              {job.impactDescription.slice(0, 80)}
              {job.impactDescription.length > 80 ? "..." : ""}
            </p>
          )}
        </div>

        {/* Education */}
        {job.requiredCerts.length > 0 && (
          <div className="space-y-2 border-b border-[var(--border-muted)] pb-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--foreground-default)]">
                Education
              </span>
              <div className="flex flex-wrap justify-end gap-1">
                {job.requiredCerts.slice(0, 2).map((cert) => (
                  <InfoTag key={cert}>{cert}</InfoTag>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
