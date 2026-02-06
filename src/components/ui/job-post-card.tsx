"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Avatar } from "./avatar";
import { InfoTag } from "./info-tag";
import { PathwayTag, type PathwayType } from "./pathway-tag";
import { Button } from "./button";
import { SaveButton } from "./save-button";

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
 * - Shadow: Level 1 default, Level 2 on hover
 *
 * Motion:
 * - Card: translateY(-2px) lift + shadow transition on hover
 * - Tags row: slide up/out on hover (200ms, ease-out)
 * - Buttons row: slide up/in on hover (200ms, ease-out)
 * - Both rows always in DOM for smooth CSS transitions
 */

const jobPostCardVariants = cva(
  [
    "relative flex flex-col justify-between",
    "bg-[var(--primitive-neutral-0)]",
    "rounded-[12px]",
    "p-4",
    // Use card motion tokens: transform + shadow
    "transition-[transform,box-shadow]",
    "duration-[var(--duration-moderate)]",
    "ease-[var(--ease-out)]",
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
          // Shadow + hover lift
          "shadow-card",
          isHovered && "-translate-y-0.5 shadow-card-hover",
          // Cursor
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
              <Avatar
                size="sm"
                src={companyLogo}
                name={companyName}
                alt={`${companyName} logo`}
                badge={saved ? "success" : undefined}
                className="shrink-0"
              />
              <span className="truncate text-sm text-[var(--foreground-default)]">
                {companyName}
              </span>
            </div>

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

          <h3 className="line-clamp-2 text-2xl font-medium leading-8 text-[var(--foreground-default)]">
            {jobTitle}
          </h3>
        </div>

        {/* Bottom Section: Stacked rows with slide transition
            Both rows are always in the DOM. We use a clipping container
            and translateY to slide them in/out. */}
        <div className="relative h-12 overflow-hidden">
          {/* Tags row — slides up and fades out on hover */}
          <div
            className={cn(
              "absolute inset-x-0 top-0 flex items-center gap-2",
              "transition-[transform,opacity] duration-[var(--duration-moderate)] ease-[var(--ease-out)]",
              isHovered
                ? "pointer-events-none -translate-y-3 opacity-0"
                : "translate-y-0 opacity-100"
            )}
            aria-hidden={isHovered}
          >
            {pathway && <PathwayTag pathway={pathway} minimized className="shrink-0" />}
            {tags.slice(0, 2).map((tag, index) => (
              <InfoTag key={index}>{tag}</InfoTag>
            ))}
          </div>

          {/* Action buttons row — slides up from below on hover */}
          <div
            className={cn(
              "absolute inset-x-0 top-0 flex items-center gap-2",
              "transition-[transform,opacity] duration-[var(--duration-moderate)] ease-[var(--ease-out)]",
              isHovered
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-3 opacity-0"
            )}
            aria-hidden={!isHovered}
          >
            <SaveButton
              saved={saved}
              onClick={(e) => {
                e.stopPropagation();
                onSave?.();
              }}
              aria-label={saved ? "Remove from saved" : "Save job"}
            />

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
          </div>
        </div>
      </div>
    );
  }
);

JobPostCard.displayName = "JobPostCard";

export { JobPostCard, jobPostCardVariants };
