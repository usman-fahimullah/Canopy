"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * CategoryTag Component - Trails Design System
 *
 * Job category tag with optional icon, used in job listings and filters.
 * Based on Figma "Job Category" component (1451:13463)
 *
 * Figma Specs:
 * - Background: neutral-200 (#F2EDE9)
 * - Border radius: 8px (rounded-lg)
 * - Icon: 18px, neutral-800 color, Fill weight
 * - Text: 14px (sm), neutral-800, 20px line-height
 * - Padding: 8px horizontal, 4px vertical (px-2 py-1)
 * - Variants: Mini (icon only), Full Size (icon + text), Truncate
 *
 * Job Categories (15 total from Figma):
 * - software-engineering, supply-chain, administration, advocacy-policy
 * - climate-sustainability, investment, sales, content
 * - marketing-design, product, data, education
 * - finance-compliance, operations, science
 */

/** Job category type mapping to Figma design */
export type JobCategoryType =
  | "software-engineering"
  | "supply-chain"
  | "administration"
  | "advocacy-policy"
  | "climate-sustainability"
  | "investment"
  | "sales"
  | "content"
  | "marketing-design"
  | "product"
  | "data"
  | "education"
  | "finance-compliance"
  | "operations"
  | "science";

/** Display labels for job categories (from Figma Full Size variants) */
export const jobCategoryLabels: Record<JobCategoryType, string> = {
  "software-engineering": "Software Engineering",
  "supply-chain": "Supply Chain",
  administration: "People, Administration, HR, & Recruitment",
  "advocacy-policy": "Advocacy & Policy",
  "climate-sustainability": "Climate & Sustainability",
  investment: "Investment",
  sales: "Sales & Account Management",
  content: "Content",
  "marketing-design": "Marketing & Design",
  product: "Product",
  data: "Data",
  education: "Education",
  "finance-compliance": "Finance, Legal, & Compliance",
  operations: "Operations, Program/Project Management & Strategy",
  science: "Science",
};

export interface CategoryTagProps {
  /** Job category type - determines the default label */
  category?: JobCategoryType;
  /** Category icon - Phosphor icon element */
  icon?: React.ReactNode;
  /** Category name (not shown in mini variant) - overrides the default label */
  children?: React.ReactNode;
  /** Display variant: mini (icon only), full (icon + text), truncate (text with ellipsis) */
  variant?: "mini" | "full" | "truncate";
  /** Max width when truncated (default: 100px) */
  maxWidth?: number;
  /** Additional class names */
  className?: string;
}

const CategoryTag = React.forwardRef<HTMLDivElement, CategoryTagProps>(
  (
    {
      category,
      icon,
      children,
      variant = "full",
      maxWidth = 100,
      className,
      ...props
    },
    ref
  ) => {
    // Get default label from category if children not provided
    const label = children ?? (category ? jobCategoryLabels[category] : undefined);

    // Helper to clone icon with size and fill weight
    const renderIcon = (iconElement: React.ReactNode) => {
      if (!iconElement) return null;
      return (
        <span className="shrink-0 flex items-center justify-center text-[var(--tag-category-foreground)]">
          {React.isValidElement(iconElement)
            ? React.cloneElement(
                iconElement as React.ReactElement<{
                  size?: number;
                  weight?: string;
                  className?: string;
                }>,
                {
                  size: 18,
                  weight: "fill",
                  className: cn(
                    "shrink-0",
                    (iconElement.props as { className?: string })?.className
                  ),
                }
              )
            : iconElement}
        </span>
      );
    };

    // Mini variant: icon only, 26px height
    if (variant === "mini") {
      return (
        <div
          ref={ref}
          className={cn(
            "inline-flex items-center justify-center",
            // Figma: 8px radius, cream background
            "rounded-lg bg-[var(--tag-category-background)]",
            // Figma: 26px height for mini, 8px padding
            "h-[26px] px-2",
            "select-none",
            className
          )}
          {...props}
        >
          {renderIcon(icon)}
        </div>
      );
    }

    // Full Size and Truncate variants
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1",
          // Figma: 8px radius, cream background
          "rounded-lg bg-[var(--tag-category-background)]",
          // Figma: 28px height, px-2 py-1 (8px/4px)
          "h-7 px-2 py-1",
          "select-none",
          className
        )}
        {...props}
      >
        {renderIcon(icon)}
        {label && (
          <span
            className={cn(
              // Figma: 14px font, 20px line-height, neutral-800 color
              "text-sm leading-5 text-[var(--tag-category-foreground)]",
              // Truncate variant: text ellipsis with max-width
              variant === "truncate" && "truncate overflow-hidden"
            )}
            style={variant === "truncate" ? { maxWidth } : undefined}
          >
            {label}
          </span>
        )}
      </div>
    );
  }
);

CategoryTag.displayName = "CategoryTag";

export { CategoryTag };
