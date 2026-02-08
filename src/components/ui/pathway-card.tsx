"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PathwayIllustration } from "./pathway-illustration";
import { type PathwayType, pathwayLabels } from "./pathway-tag";

/**
 * PathwayCard - Browse card for career pathways
 *
 * Displays a pathway illustration with name and job count.
 * Used in job search and collections pages for pathway navigation.
 *
 * @figma https://www.figma.com/design/q1985VWRuwMkSc1hIqu5X9/Trails-Design-System?node-id=3520-9696
 */

export interface PathwayCardProps {
  /** Pathway type — determines illustration and label */
  pathway: PathwayType;
  /** Number of jobs in this pathway */
  jobCount?: number;
  /** Navigation link (wraps card in Link when provided) */
  href?: string;
  /** Additional class names */
  className?: string;
}

export function PathwayCard({ pathway, jobCount, href, className }: PathwayCardProps) {
  const content = (
    <div
      className={cn(
        "flex flex-col items-center rounded-xl bg-[var(--card-background)] px-4 pb-4 pt-5 shadow-[var(--shadow-card)] transition-all",
        href &&
          "cursor-pointer hover:bg-[var(--card-background-hover)] hover:shadow-[var(--shadow-card-hover)]",
        className
      )}
    >
      <PathwayIllustration pathway={pathway} size="lg" />

      <div className="mt-2 flex w-full flex-col items-center">
        <span className="text-center text-body-strong text-[var(--foreground-default)]">
          {pathwayLabels[pathway]}
        </span>
        {jobCount !== undefined && (
          <span className="text-center text-caption-strong text-[var(--foreground-default)]">
            {jobCount} Jobs
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2"
      >
        {content}
      </Link>
    );
  }

  return content;
}
