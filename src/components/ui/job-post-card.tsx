"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { BookmarkSimple } from "@phosphor-icons/react";
import { Avatar } from "./avatar";
import { InfoTag } from "./info-tag";
import { PathwayTag, type PathwayType } from "./pathway-tag";
import { Button } from "./button";

/**
 * JobPostCard component based on Trails Design System
 *
 * @figma https://figma.com/design/q1985VWRuwMkSc1hIqu5X9/Trails-Design-System?node-id=1451-11805
 * @figma https://figma.com/design/q1985VWRuwMkSc1hIqu5X9/Trails-Design-System?node-id=1516-15166
 *
 * Displays a job posting with company info, job title, pathway tag,
 * status badges, and hover state with action buttons.
 *
 * Figma Specs:
 * - Size: 350x200px
 * - Background: white (#FFFFFF)
 * - Border radius: 12px
 * - Padding: 16px
 * - Shadow: 1px 2px 16px rgba(31, 29, 28, 0.08) - Level 1
 * - Shadow hover: 2px 4px 16px rgba(31, 29, 28, 0.12) - Level 2
 *
 * Layout:
 * - Default: Header (avatar + company name) → Job Title → Tags row (PathwayTag minimized + InfoTags)
 * - Hover: Header → Job Title → Action buttons ("Save It" + "View Job")
 */

const jobPostCardVariants = cva(
  [
    "relative flex flex-col justify-between",
    "bg-[var(--primitive-neutral-0)]",
    "rounded-[12px]",
    "p-4",
    "transition-all duration-200 ease-out",
  ],
  {
    variants: {
      size: {
        default: "w-[350px] h-[200px]",
        compact: "w-full h-auto min-h-[160px]",
        full: "w-full h-[200px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export type JobPostStatus = "default" | "featured" | "bipoc-owned" | "closing-soon";

export interface JobPostCardProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof jobPostCardVariants> {
  /** Company name */
  companyName: string;
  /** Company logo URL */
  companyLogo?: string;
  /** Job title */
  jobTitle: string;
  /** Pathway/industry type */
  pathway?: PathwayType;
  /** Status badge variant */
  status?: JobPostStatus;
  /** Tags to display (e.g., "Remote", "Full-time") */
  tags?: string[];
  /** Whether the job is bookmarked/saved */
  saved?: boolean;
  /** Callback when save button is clicked */
  onSave?: () => void;
  /** Callback when view job button is clicked */
  onViewJob?: () => void;
  /** Callback when card is clicked */
  onClick?: () => void;
  /** Button text for the action button */
  actionText?: string;
  /** Loading state */
  loading?: boolean;
}

/** Status badge configuration */
const statusConfig: Record<
  Exclude<JobPostStatus, "default">,
  { label: string; bgColor: string; textColor: string }
> = {
  featured: {
    label: "Featured",
    bgColor: "bg-[var(--primitive-blue-100)]",
    textColor: "text-[var(--primitive-blue-500)]",
  },
  "bipoc-owned": {
    label: "BIPOC Owned",
    bgColor: "bg-[var(--primitive-purple-100)]",
    textColor: "text-[var(--primitive-purple-500)]",
  },
  "closing-soon": {
    label: "Closing Soon",
    bgColor: "bg-[var(--primitive-orange-100)]",
    textColor: "text-[var(--primitive-orange-500)]",
  },
};

const JobPostCard = React.forwardRef<HTMLDivElement, JobPostCardProps>(
  (
    {
      className,
      size,
      companyName,
      companyLogo,
      jobTitle,
      pathway,
      status = "default",
      tags = [],
      saved = false,
      onSave,
      onViewJob,
      onClick,
      actionText = "View Job",
      loading = false,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const statusData = status !== "default" ? statusConfig[status] : null;

    return (
      <div
        ref={ref}
        className={cn(
          jobPostCardVariants({ size }),
          // Shadow - Figma Level 1 default, Level 2 on hover
          isHovered
            ? "shadow-[2px_4px_16px_rgba(31,29,28,0.12)]"
            : "shadow-[1px_2px_16px_rgba(31,29,28,0.08)]",
          // Cursor and hover state
          (onClick || onViewJob) && "cursor-pointer",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        {...props}
      >
        {/* Top Section: Company info + Job Title */}
        <div className="flex flex-col gap-3">
          {/* Header Row: Company avatar + name (+ optional status badge) */}
          <div className="flex items-center gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              {/* Figma: 32px avatar, rounded-lg, border neutral-300 */}
              <Avatar
                size="sm"
                src={companyLogo}
                name={companyName}
                alt={`${companyName} logo`}
                className="shrink-0"
              />
              {/* Figma: 14px regular, neutral-800, truncate */}
              <span className="truncate text-sm text-[var(--foreground-default)]">
                {companyName}
              </span>
            </div>

            {/* Status Badge (only for non-default status variants) */}
            {statusData && (
              <div
                className={cn(
                  "flex shrink-0 items-center justify-center",
                  "rounded-full px-2 py-1",
                  statusData.bgColor
                )}
              >
                <span className={cn("text-sm font-bold", statusData.textColor)}>
                  {statusData.label}
                </span>
              </div>
            )}
          </div>

          {/* Figma: 24px medium, neutral-800, 32px line-height */}
          <h3 className="line-clamp-2 text-2xl font-medium leading-8 text-[var(--foreground-default)]">
            {jobTitle}
          </h3>
        </div>

        {/* Bottom Section: Tags (default) or Action Buttons (hover) */}
        <div className="flex items-center gap-2">
          {isHovered ? (
            // Hover state: "Save It" button + "View Job" button
            <>
              {/* Figma: blue-100 bg, rounded-2xl, px-4 py-3.5, bookmark icon + "Save It" text */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSave?.();
                }}
                className={cn(
                  "inline-flex items-center justify-center gap-1",
                  "rounded-2xl px-4 py-3.5",
                  "bg-[var(--button-secondary-background)]",
                  "transition-colors duration-150",
                  "hover:bg-[var(--button-secondary-background-hover)]",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2"
                )}
                aria-label={saved ? "Remove from saved" : "Save job"}
              >
                <BookmarkSimple
                  size={20}
                  weight={saved ? "fill" : "regular"}
                  className="text-[var(--button-secondary-foreground)]"
                />
                <span className="text-sm font-bold text-[var(--button-secondary-foreground)]">
                  {saved ? "Saved" : "Save It"}
                </span>
              </button>

              {/* Figma: neutral-200 bg (tertiary), rounded-2xl, text only */}
              <Button
                variant="tertiary"
                size="default"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewJob?.();
                }}
                className="shrink-0"
              >
                {actionText}
              </Button>
            </>
          ) : (
            // Default state: PathwayTag (minimized) + InfoTags
            <>
              {pathway && <PathwayTag pathway={pathway} minimized className="shrink-0" />}
              {tags.slice(0, 2).map((tag, index) => (
                <InfoTag key={index}>{tag}</InfoTag>
              ))}
            </>
          )}
        </div>
      </div>
    );
  }
);

JobPostCard.displayName = "JobPostCard";

export { JobPostCard, jobPostCardVariants };
