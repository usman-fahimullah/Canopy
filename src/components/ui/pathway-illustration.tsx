"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { type PathwayType, pathwayLabels } from "./pathway-tag";

/**
 * PathwayIllustration Component - Trails Design System
 *
 * Displays spot illustrations for career pathways from the design system.
 * Illustrations are stored as static SVGs in /public/illustrations/pathways/
 *
 * @figma https://www.figma.com/design/q1985VWRuwMkSc1hIqu5X9/Trails-Design-System?node-id=1549-4081
 *
 * Usage:
 * ```tsx
 * // Using pathway type (convention-based path)
 * <PathwayIllustration pathway="energy" size="md" />
 *
 * // Using custom illustration path (from database)
 * <PathwayIllustration
 *   pathway="energy"
 *   illustrationSrc="/illustrations/pathways/energy.svg"
 *   size="lg"
 * />
 * ```
 *
 * File naming convention: /public/illustrations/pathways/{pathway-slug}.svg
 * - agriculture.svg
 * - arts-culture.svg
 * - conservation.svg
 * - etc.
 */

/** Size presets matching Figma specs (104px base) */
const sizeConfig = {
  xs: { width: 32, height: 32 },
  sm: { width: 48, height: 48 },
  md: { width: 64, height: 64 },
  lg: { width: 104, height: 104 }, // Figma default
  xl: { width: 128, height: 128 },
  "2xl": { width: 160, height: 160 },
} as const;

export type PathwayIllustrationSize = keyof typeof sizeConfig;

export interface PathwayIllustrationProps {
  /** Pathway type - used for alt text and fallback path */
  pathway: PathwayType;
  /** Custom illustration source path (overrides convention-based path) */
  illustrationSrc?: string;
  /** Size preset */
  size?: PathwayIllustrationSize;
  /** Custom width (overrides size preset) */
  width?: number;
  /** Custom height (overrides size preset) */
  height?: number;
  /** Additional class names */
  className?: string;
  /** Priority loading (for above-the-fold content) */
  priority?: boolean;
  /** Show placeholder while loading */
  showPlaceholder?: boolean;
}

/**
 * Generates the default illustration path based on pathway slug
 */
function getDefaultIllustrationPath(pathway: PathwayType): string {
  return `/illustrations/pathways/${pathway}.svg`;
}

/**
 * Simple placeholder shown while image loads or on error
 */
function IllustrationPlaceholder({
  size,
  className,
}: {
  size: { width: number; height: number };
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg bg-[var(--background-subtle)]",
        className
      )}
      style={{ width: size.width, height: size.height }}
      role="img"
      aria-label="Loading illustration"
    >
      <div
        className="animate-pulse rounded-md bg-[var(--background-muted)]"
        style={{
          width: size.width * 0.6,
          height: size.height * 0.6,
        }}
      />
    </div>
  );
}

export function PathwayIllustration({
  pathway,
  illustrationSrc,
  size = "lg",
  width,
  height,
  className,
  priority = false,
  showPlaceholder = true,
}: PathwayIllustrationProps) {
  const [hasError, setHasError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  // Determine dimensions
  const dimensions = {
    width: width ?? sizeConfig[size].width,
    height: height ?? sizeConfig[size].height,
  };

  // Determine image source
  const src = illustrationSrc ?? getDefaultIllustrationPath(pathway);

  // Get accessible label
  const altText = `${pathwayLabels[pathway]} pathway illustration`;

  // Reset error state when pathway changes
  React.useEffect(() => {
    setHasError(false);
    setIsLoading(true);
  }, [pathway, illustrationSrc]);

  // Show placeholder on error
  if (hasError) {
    return <IllustrationPlaceholder size={dimensions} className={className} />;
  }

  return (
    <div
      className={cn("relative inline-flex", className)}
      style={{ width: dimensions.width, height: dimensions.height }}
    >
      {/* Loading placeholder */}
      {isLoading && showPlaceholder && (
        <div className="absolute inset-0">
          <IllustrationPlaceholder size={dimensions} />
        </div>
      )}

      {/* Actual image */}
      <Image
        src={src}
        alt={altText}
        width={dimensions.width}
        height={dimensions.height}
        priority={priority}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        className={cn(
          "object-contain transition-opacity duration-200",
          isLoading ? "opacity-0" : "opacity-100"
        )}
      />
    </div>
  );
}

/**
 * Get all pathway illustration paths (useful for preloading)
 */
export function getAllPathwayIllustrationPaths(): Record<PathwayType, string> {
  return Object.keys(pathwayLabels).reduce(
    (acc, pathway) => {
      acc[pathway as PathwayType] = getDefaultIllustrationPath(pathway as PathwayType);
      return acc;
    },
    {} as Record<PathwayType, string>
  );
}

/**
 * Pathway illustration paths for database seeding
 */
export const PATHWAY_ILLUSTRATION_PATHS: Record<PathwayType, string> = {
  agriculture: "/illustrations/pathways/agriculture.svg",
  "arts-culture": "/illustrations/pathways/arts-culture.svg",
  conservation: "/illustrations/pathways/conservation.svg",
  construction: "/illustrations/pathways/construction.svg",
  education: "/illustrations/pathways/education.svg",
  energy: "/illustrations/pathways/energy.svg",
  finance: "/illustrations/pathways/finance.svg",
  forestry: "/illustrations/pathways/forestry.svg",
  manufacturing: "/illustrations/pathways/manufacturing.svg",
  media: "/illustrations/pathways/media.svg",
  medical: "/illustrations/pathways/medical.svg",
  policy: "/illustrations/pathways/policy.svg",
  "real-estate": "/illustrations/pathways/real-estate.svg",
  research: "/illustrations/pathways/research.svg",
  sports: "/illustrations/pathways/sports.svg",
  technology: "/illustrations/pathways/technology.svg",
  tourism: "/illustrations/pathways/tourism.svg",
  transportation: "/illustrations/pathways/transportation.svg",
  "urban-planning": "/illustrations/pathways/urban-planning.svg",
  "waste-management": "/illustrations/pathways/waste-management.svg",
  water: "/illustrations/pathways/water.svg",
};
