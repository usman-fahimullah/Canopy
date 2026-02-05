"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getCollectionGradient } from "@/lib/gradient-utils";
import { PathwayTag, PathwayType, pathwayLabels } from "@/components/ui/pathway-tag";

/**
 * Collection Card Component - Trails Design System
 *
 * Feature card showcasing job collections with dynamic gradient backgrounds.
 * Gradients are automatically selected based on pathway combinations.
 *
 * @figma Collection-Card component (node 2234:8519)
 *
 * Figma Specs:
 * - Layout: flex column, justify-between, size-full (fills parent)
 * - Border radius: 12px (var(--small) / --radius-card)
 * - Padding: 24px (var(--large) / p-6)
 * - Title: 48px, DM Sans Medium, tracking -0.96px
 * - Title color: dark (neutral-800) on light gradients, white on dark gradients
 * - Sponsor avatars: 32px, rounded-lg, overlapping -16px margin
 * - Avatar overflow: "3+" count badge when >2 sponsors
 * - Single sponsor: larger logo + "Sponsored by [Name]" text
 * - Multiple sponsors: avatar stack + "[N] Companies" text
 * - Job count: frosted glass pill, backdrop-blur-[12px], white/50 bg
 * - Pathway tags: minimized (icon-only), colored backgrounds
 * - Gradient: Dynamic based on pathways via gradient-utils
 */

export interface CollectionCardProps {
  /** Collection title */
  title: string;

  /** Number of jobs in this collection */
  jobCount: number;

  /** Pathways included in this collection (determines gradient) */
  pathways: PathwayType[];

  /** Link destination */
  href: string;

  /** Number of companies hiring in this collection */
  companyCount?: number;

  /** Optional sponsor info with logos */
  sponsors?: Array<{
    name: string;
    logo: string;
  }>;

  /** @deprecated Use `sponsors` array instead */
  sponsor?: {
    name: string;
    logo: string;
  };

  /** Use dark text on light gradients. Default: false (white text) */
  darkText?: boolean;

  /** Optional description for screen readers (not displayed visually) */
  description?: string;

  /** Additional class names */
  className?: string;
}

const CollectionCard = React.forwardRef<HTMLAnchorElement, CollectionCardProps>(
  (
    {
      title,
      jobCount,
      pathways,
      href,
      companyCount,
      sponsors,
      sponsor,
      darkText = false,
      description,
      className,
      ...props
    },
    ref
  ) => {
    // Get gradient based on pathway combination
    const gradient = getCollectionGradient({ pathways });

    // Normalize sponsors: support both new `sponsors` array and legacy `sponsor` prop
    const sponsorList = sponsors ?? (sponsor ? [sponsor] : []);
    const isSingleSponsor = sponsorList.length === 1;

    // Text color based on gradient contrast
    const textColor = darkText
      ? "text-[var(--primitive-neutral-800)]"
      : "text-[var(--primitive-neutral-0)]";

    // Build accessible label
    const pathwayNames = pathways
      .slice(0, 4)
      .map((p) => pathwayLabels[p])
      .join(", ");
    const ariaLabel = [
      `${title} collection`,
      `${jobCount} ${jobCount === 1 ? "job" : "jobs"}`,
      pathwayNames && `Pathways: ${pathwayNames}`,
      sponsorList.length > 0 &&
        (isSingleSponsor
          ? `Sponsored by ${sponsorList[0].name}`
          : `${sponsorList.length} companies`),
    ]
      .filter(Boolean)
      .join(". ");

    // Max avatars to show before overflow badge
    const MAX_VISIBLE_AVATARS = 2;
    const visibleSponsors = sponsorList.slice(0, MAX_VISIBLE_AVATARS);
    const overflowCount = sponsorList.length - MAX_VISIBLE_AVATARS;

    return (
      <Link
        ref={ref}
        href={href}
        aria-label={ariaLabel}
        className={cn(
          // Layout — Figma: flex column, justify-between, size-full
          "group relative flex flex-col justify-between overflow-hidden",
          // Size — Figma: size-full, fills parent container
          "size-full",
          // Styling — Figma: rounded-[var(--small,12px)], p-[var(--large,24px)]
          "rounded-[var(--radius-card)] p-6",
          // Transitions
          "transition-all duration-[var(--duration-moderate)] ease-[var(--ease-default)]",
          "hover:scale-[1.02] hover:shadow-[var(--shadow-card-hover)]",
          // Focus — visible ring for keyboard navigation
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2",
          className
        )}
        style={{
          background: gradient,
        }}
        {...props}
      >
        {/* ------------------------------------------------------------ */}
        {/* Top section: Title + Sponsor/company info                     */}
        {/* ------------------------------------------------------------ */}
        <div className="flex flex-col gap-2">
          {/* Title — Figma: 48px, DM Sans Medium, tracking -0.96px */}
          <h3
            className={cn(
              "font-medium",
              textColor,
              "text-[clamp(2rem,5vw,3rem)] leading-[1] tracking-[-0.02em]"
            )}
            style={{ fontFeatureSettings: "'ss02', 'ss03', 'ss04'" }}
          >
            {title}
          </h3>

          {/* Single sponsor — Figma: larger logo + "Sponsored by [Name]" */}
          {isSingleSponsor && (
            <div className="mt-1 flex items-center gap-2">
              <div
                className={cn(
                  "relative size-10 shrink-0 overflow-hidden rounded-xl",
                  "border border-[var(--primitive-neutral-300)]",
                  "bg-[var(--primitive-neutral-0)]"
                )}
              >
                {sponsorList[0].logo ? (
                  <Image
                    src={sponsorList[0].logo}
                    alt={sponsorList[0].name}
                    width={40}
                    height={40}
                    className="size-full object-contain"
                  />
                ) : (
                  <span className="flex size-full items-center justify-center text-body-strong text-[var(--foreground-default)]">
                    {sponsorList[0].name.charAt(0)}
                  </span>
                )}
              </div>
              <span className={cn("text-body font-medium", textColor)}>
                Sponsored by {sponsorList[0].name}
              </span>
            </div>
          )}

          {/* Multiple sponsors — Figma: overlapping 32px avatar stack + count */}
          {sponsorList.length > 1 && (
            <div className="mt-1 flex items-center gap-2">
              {/* Overlapping avatars with overflow badge */}
              <div className="flex items-start pr-4">
                {visibleSponsors.map((s, index) => (
                  <div
                    key={s.name}
                    className={cn(
                      "relative size-8 shrink-0 overflow-hidden rounded-lg",
                      "border border-[var(--primitive-neutral-300)]",
                      "bg-[var(--primitive-neutral-0)]",
                      index > 0 && "-ml-4"
                    )}
                  >
                    {s.logo ? (
                      <Image
                        src={s.logo}
                        alt={s.name}
                        width={32}
                        height={32}
                        className="size-full object-contain"
                      />
                    ) : (
                      <span className="flex size-full items-center justify-center text-caption-strong text-[var(--foreground-default)]">
                        {s.name.charAt(0)}
                      </span>
                    )}
                  </div>
                ))}

                {/* Overflow count badge — Figma: "3+" style rounded-lg avatar */}
                {overflowCount > 0 && (
                  <div
                    className={cn(
                      "relative -ml-4 size-8 shrink-0 overflow-hidden rounded-lg",
                      "border border-[var(--primitive-neutral-300)]",
                      "bg-[var(--primitive-neutral-0)]",
                      "flex items-center justify-center",
                      "text-caption-strong text-[var(--foreground-default)]"
                    )}
                    aria-label={`${overflowCount} more companies`}
                  >
                    {overflowCount}+
                  </div>
                )}
              </div>

              {/* Company count text — Figma: "[N] Companies" */}
              <span className={cn("text-sm font-medium leading-5", textColor)}>
                {companyCount ?? sponsorList.length}{" "}
                {(companyCount ?? sponsorList.length) === 1 ? "Company" : "Companies"}
              </span>
            </div>
          )}

          {/* No sponsors but companyCount provided */}
          {sponsorList.length === 0 && companyCount != null && companyCount > 0 && (
            <div className="mt-1">
              <span className={cn("text-sm font-medium leading-5", textColor)}>
                {companyCount} {companyCount === 1 ? "Company" : "Companies"}
              </span>
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Bottom section: Job count pill + Pathway tags                  */}
        {/* ------------------------------------------------------------ */}
        <div
          className="flex flex-wrap items-start gap-2"
          role="list"
          aria-label="Collection details"
        >
          {/* Job count pill — Figma: frosted glass, backdrop-blur-[12px], white/50 */}
          <div
            className={cn(
              "inline-flex items-center rounded-lg px-2 py-1",
              "bg-[var(--primitive-neutral-0)]/50 backdrop-blur-[12px]",
              "text-sm font-medium leading-5 text-[var(--primitive-neutral-900)]"
            )}
            role="listitem"
            aria-label={`${jobCount} ${jobCount === 1 ? "job" : "jobs"}`}
          >
            {jobCount} {jobCount === 1 ? "Job" : "Jobs"}
          </div>

          {/* Pathway tags — Figma: minimized (icon-only), colored backgrounds */}
          {pathways.slice(0, 4).map((pathway) => (
            <div key={pathway} role="listitem" aria-label={`${pathwayLabels[pathway]} pathway`}>
              <PathwayTag pathway={pathway} minimized />
            </div>
          ))}
        </div>
      </Link>
    );
  }
);

CollectionCard.displayName = "CollectionCard";

export { CollectionCard };
