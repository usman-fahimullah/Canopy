"use client";

import { Avatar, Badge, Button } from "@/components/ui";
import { Heart } from "@phosphor-icons/react";
import { SaveButton } from "./SaveButton";
import type { JobDetail } from "./types";

interface JobHeaderProps {
  job: JobDetail;
}

export function JobHeader({ job }: JobHeaderProps) {
  const showBipocBadge = job.organization.isBipocOwned;

  return (
    <div className="border-b border-[var(--border-muted)] bg-[var(--background-default)] px-6 py-6 lg:px-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Left: Title + Company */}
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

        {/* Right: Action buttons — hidden on mobile (shown in sticky CTA) */}
        <div className="hidden items-center gap-3 sm:flex">
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              // Apply Now - in a real implementation, link to application
            }}
          >
            Apply Now
          </Button>
          <SaveButton jobId={job.id} initialSaved={job.isSaved} />
        </div>
      </div>
    </div>
  );
}
