"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { CheckCircle } from "@phosphor-icons/react";
import { Avatar } from "./avatar";
import { Badge } from "./badge";
import { InfoTag } from "./info-tag";
import { PathwayTag, type PathwayType } from "./pathway-tag";

/**
 * CompanyCard component based on Trails Design System
 * Figma: Node 1451:17739
 *
 * Displays a company with pathway tag, job count, partner badge,
 * and optional BIPOC-owned indicator.
 *
 * Figma Specs:
 * - Size: 350x124px (Skinny card)
 * - Background: white (#FFFFFF)
 * - Border radius: 12px
 * - Padding: 16px
 * - Shadow: 1px 2px 16px rgba(31, 29, 28, 0.08) - Level 1
 * - Company name: 24px medium weight
 * - Pathway tag: minimized (icon only) when partner
 */

const companyCardVariants = cva(
  [
    "relative flex items-center",
    "bg-[var(--primitive-neutral-0)]",
    "rounded-[12px]",
    "p-4",
    "shadow-[1px_2px_16px_rgba(31,29,28,0.08)]",
    "transition-all duration-200 ease-out",
    "hover:shadow-[2px_4px_16px_rgba(31,29,28,0.12)]",
  ],
  {
    variants: {
      size: {
        default: "w-[350px] h-[124px]",
        compact: "w-full h-auto min-h-[100px]",
        full: "w-full h-[124px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface CompanyCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof companyCardVariants> {
  /** Company name */
  companyName: string;
  /** Company logo URL */
  companyLogo?: string;
  /** Pathway/industry type */
  pathway?: PathwayType;
  /** Pathway icon (optional override) */
  pathwayIcon?: React.ReactNode;
  /** Whether company is a partner */
  isPartner?: boolean;
  /** Whether company is BIPOC owned */
  isBipocOwned?: boolean;
  /** Number of open jobs (shows tag if provided) */
  jobCount?: number;
  /** Callback when card is clicked */
  onClick?: () => void;
}

const CompanyCard = React.forwardRef<HTMLDivElement, CompanyCardProps>(
  (
    {
      className,
      size,
      companyName,
      companyLogo,
      pathway,
      pathwayIcon,
      isPartner = false,
      isBipocOwned = false,
      jobCount,
      onClick,
      ...props
    },
    ref
  ) => {
    // Determine if we show minimized pathway tag
    // Figma: minimized when partner badge is shown
    const showMinimizedPathway = isPartner && !!pathway;

    return (
      <div
        ref={ref}
        className={cn(
          companyCardVariants({ size }),
          onClick && "cursor-pointer",
          className
        )}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        {...props}
      >
        {/* Content Container */}
        <div className="flex items-start gap-3 flex-1 h-full">
          {/* Left: Company Info */}
          <div className="flex flex-col justify-between flex-1 h-full min-w-0">
            {/* Company Name */}
            <h3 className="text-2xl font-medium text-[var(--primitive-neutral-800)] leading-8 line-clamp-2">
              {companyName}
            </h3>

            {/* Tags Row */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Pathway Tag */}
              {pathway && (
                <PathwayTag
                  pathway={pathway}
                  icon={pathwayIcon}
                  minimized={showMinimizedPathway}
                  className="shrink-0"
                />
              )}

              {/* Job Count Tag */}
              {jobCount !== undefined && jobCount > 0 && (
                <InfoTag>{jobCount} Jobs</InfoTag>
              )}

              {/* Partner Badge - only show when isPartner */}
              {isPartner && (
                <div
                  className={cn(
                    "flex items-center justify-center",
                    "px-2 py-1 rounded-full",
                    "bg-[var(--primitive-blue-100)]"
                  )}
                >
                  <span className="text-sm font-bold text-[var(--primitive-blue-500)]">
                    Partner
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Company Avatar */}
          <div className="relative shrink-0">
            <Avatar
              size="sm"
              src={companyLogo}
              name={companyName}
              alt={`${companyName} logo`}
              className="border-[var(--primitive-neutral-300)]"
            />

            {/* BIPOC Owned Badge - positioned on avatar */}
            {isBipocOwned && (
              <div
                className={cn(
                  "absolute -bottom-1 -right-1",
                  "flex items-center justify-center",
                  "w-5 h-5 rounded-full",
                  "bg-[var(--primitive-green-200)]",
                  "border-2 border-white"
                )}
                title="BIPOC Owned"
              >
                <CheckCircle
                  size={14}
                  weight="fill"
                  className="text-[var(--primitive-green-700)]"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

CompanyCard.displayName = "CompanyCard";

export { CompanyCard, companyCardVariants };
