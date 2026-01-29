"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { BookmarkSimple, ArrowRight } from "@phosphor-icons/react";
import { Avatar } from "./avatar";
import { Badge } from "./badge";
import { InfoTag } from "./info-tag";
import { PathwayTag, type PathwayType } from "./pathway-tag";
import { Button } from "./button";

/**
 * JobPostCard component based on Trails Design System
 * Figma: Node 1451:11804
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
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof jobPostCardVariants> {
  /** Company name */
  companyName: string;
  /** Company logo URL */
  companyLogo?: string;
  /** Job title */
  jobTitle: string;
  /** Pathway/industry type */
  pathway?: PathwayType;
  /** Pathway icon (optional override) */
  pathwayIcon?: React.ReactNode;
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
  { label: string; variant: "feature" | "warning" | "info"; bgColor: string; textColor: string }
> = {
  featured: {
    label: "Featured",
    variant: "feature",
    bgColor: "bg-[var(--primitive-blue-100)]",
    textColor: "text-[var(--primitive-blue-500)]",
  },
  "bipoc-owned": {
    label: "BIPOC Owned",
    variant: "info",
    bgColor: "bg-[var(--primitive-purple-100)]",
    textColor: "text-[var(--primitive-purple-500)]",
  },
  "closing-soon": {
    label: "Closing Soon",
    variant: "warning",
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
      pathwayIcon,
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

    // Generate initials from company name for avatar fallback
    const getCompanyInitial = (name: string) => {
      return name.charAt(0).toUpperCase();
    };

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
        {/* Top Section: Company info + Pathway + Status */}
        <div className="flex flex-col gap-3">
          {/* Header Row: Company avatar, name, pathway tag, status badge */}
          <div className="flex items-center gap-2">
            {/* Company Info */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {/* Company Avatar */}
              <Avatar
                size="sm"
                src={companyLogo}
                name={companyName}
                alt={`${companyName} logo`}
                className="shrink-0"
              />
              {/* Company Name */}
              <span className="text-sm text-[var(--primitive-neutral-800)] truncate">
                {companyName}
              </span>
            </div>

            {/* Pathway Tag */}
            {pathway && (
              <PathwayTag
                pathway={pathway}
                icon={pathwayIcon}
                minimized
                className="shrink-0"
              />
            )}

            {/* Status Badge */}
            {statusData && (
              <div
                className={cn(
                  "shrink-0 flex items-center justify-center",
                  "px-2 py-1 rounded-full",
                  statusData.bgColor
                )}
              >
                <span className={cn("text-sm font-bold", statusData.textColor)}>
                  {statusData.label}
                </span>
              </div>
            )}
          </div>

          {/* Job Title */}
          <h3 className="text-2xl font-medium text-[var(--primitive-neutral-800)] leading-8 line-clamp-2">
            {jobTitle}
          </h3>
        </div>

        {/* Bottom Section: Tags or Action Buttons */}
        <div className="flex items-center justify-between">
          {isHovered ? (
            // Hover state: Save button + View Job button
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSave?.();
                }}
                className={cn(
                  "flex items-center justify-center",
                  "p-3 rounded-2xl",
                  "bg-[var(--primitive-blue-100)]",
                  "transition-colors duration-150",
                  "hover:bg-[var(--primitive-blue-200)]",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primitive-green-500)] focus-visible:ring-offset-2"
                )}
                aria-label={saved ? "Remove from saved" : "Save job"}
              >
                <BookmarkSimple
                  size={24}
                  weight={saved ? "fill" : "regular"}
                  className="text-[var(--primitive-neutral-800)]"
                />
              </button>

              <Button
                variant="inverse"
                size="default"
                rightIcon={<ArrowRight size={24} weight="bold" />}
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
            // Default state: Tags
            <div className="flex items-center gap-2 flex-wrap">
              {tags.slice(0, 2).map((tag, index) => (
                <InfoTag key={index}>{tag}</InfoTag>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

JobPostCard.displayName = "JobPostCard";

export { JobPostCard, jobPostCardVariants };
