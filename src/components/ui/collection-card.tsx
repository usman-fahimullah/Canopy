"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getCollectionGradient } from "@/lib/gradient-utils";
import { PathwayTag, PathwayType } from "@/components/ui/pathway-tag";
import { ArrowRight } from "@phosphor-icons/react";

/**
 * Collection Card Component - Trails Design System
 *
 * Feature card showcasing job collections with dynamic gradient backgrounds.
 * Gradients are automatically selected based on pathway combinations.
 *
 * Figma: Collection Card component
 * Height: 416px fixed
 * Border radius: 16px (rounded-2xl)
 * Padding: 24px (p-6)
 * Gradient: Dynamic based on pathways
 */

export interface CollectionCardProps {
  /** Collection title */
  title: string;

  /** Number of jobs in this collection */
  jobCount: number;

  /** Pathways included in this collection (determines gradient) */
  pathways: PathwayType[];

  /** Optional description */
  description?: string;

  /** Link destination */
  href: string;

  /** Optional sponsor info */
  sponsor?: {
    name: string;
    logo: string;
  };

  /** Optional badges (e.g., "New", "Featured") */
  badges?: Array<{
    label: string;
    variant?: "default" | "accent";
  }>;

  /** Additional class names */
  className?: string;
}

const CollectionCard = React.forwardRef<HTMLAnchorElement, CollectionCardProps>(
  (
    {
      title,
      jobCount,
      pathways,
      description,
      href,
      sponsor,
      badges,
      className,
      ...props
    },
    ref
  ) => {
    // Get gradient based on pathway combination
    const gradient = getCollectionGradient({ pathways });

    return (
      <Link
        ref={ref}
        href={href}
        className={cn(
          // Layout
          "group relative overflow-hidden flex flex-col",
          // Size
          "h-[416px]",
          // Styling
          "rounded-2xl p-6",
          // Transitions
          "transition-transform duration-[var(--duration-normal)] ease-[var(--ease-default)]",
          "hover:scale-[1.02]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primitive-green-500)] focus-visible:ring-offset-2",
          className
        )}
        style={{
          background: gradient,
        }}
        {...props}
      >
        {/* Top section: Badges */}
        {badges && badges.length > 0 && (
          <div className="flex gap-2 mb-4">
            {badges.map((badge, index) => (
              <div
                key={index}
                className={cn(
                  "px-3 py-1 rounded-full text-caption-strong",
                  badge.variant === "accent"
                    ? "bg-[var(--primitive-neutral-0)]/20 text-[var(--primitive-neutral-0)] backdrop-blur-sm"
                    : "bg-[var(--primitive-neutral-0)]/90 text-[var(--primitive-green-800)]"
                )}
              >
                {badge.label}
              </div>
            ))}
          </div>
        )}

        {/* Main content area - grows to push bottom content down */}
        <div className="flex-1 flex flex-col justify-center">
          {/* Title */}
          <h3 className="text-heading-md font-bold text-[var(--primitive-neutral-0)] mb-3">
            {title}
          </h3>

          {/* Description (optional) */}
          {description && (
            <p className="text-body text-[var(--primitive-neutral-0)]/90 line-clamp-3">
              {description}
            </p>
          )}

          {/* Job count */}
          <div className="mt-4 inline-flex items-center gap-2 text-body-strong text-[var(--primitive-neutral-0)]">
            <span>{jobCount} jobs</span>
            <ArrowRight
              size={20}
              weight="bold"
              className="transition-transform duration-[var(--duration-fast)] ease-[var(--ease-default)] group-hover:translate-x-1"
            />
          </div>
        </div>

        {/* Bottom section: Pathways and Sponsor */}
        <div className="mt-6 space-y-4">
          {/* Pathway tags */}
          {pathways.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {pathways.slice(0, 3).map((pathway) => (
                <PathwayTag
                  key={pathway}
                  pathway={pathway}
                  className="bg-[var(--primitive-neutral-0)]/20 backdrop-blur-sm border border-[var(--primitive-neutral-0)]/30"
                />
              ))}
              {pathways.length > 3 && (
                <div className="px-2 py-1 rounded-lg bg-[var(--primitive-neutral-0)]/20 backdrop-blur-sm border border-[var(--primitive-neutral-0)]/30 text-caption-strong text-[var(--primitive-neutral-0)]">
                  +{pathways.length - 3} more
                </div>
              )}
            </div>
          )}

          {/* Sponsor (if present) */}
          {sponsor && (
            <div className="flex items-center gap-2 pt-4 border-t border-[var(--primitive-neutral-0)]/20">
              <span className="text-caption text-[var(--primitive-neutral-0)]/80">
                Sponsored by
              </span>
              <div className="flex items-center gap-2">
                {sponsor.logo && (
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="h-5 w-auto object-contain"
                  />
                )}
                <span className="text-caption-strong text-[var(--primitive-neutral-0)]">
                  {sponsor.name}
                </span>
              </div>
            </div>
          )}
        </div>
      </Link>
    );
  }
);

CollectionCard.displayName = "CollectionCard";

export { CollectionCard };
