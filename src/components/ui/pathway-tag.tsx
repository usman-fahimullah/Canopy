"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { Icon } from "@phosphor-icons/react";
import {
  Lightning,
  Desktop,
  Car,
  Plant,
  Leaf,
  Drop,
  Tree,
  Factory,
  HardHat,
  Buildings,
  Bank,
  Coins,
  Scales,
  Flask,
  GraduationCap,
  Recycle,
  PaintBrush,
  Broadcast,
  FirstAidKit,
  Airplane,
  Basketball,
} from "@phosphor-icons/react";

/**
 * PathwayTag Component - Trails Design System
 *
 * Colorful pathway/industry tag for the Green Jobs Board taxonomy.
 * Based on Figma "Pathways Tag" component (12:276)
 *
 * Figma Specs:
 * - Border radius: 8px (rounded-lg)
 * - Padding: px-2 py-1 (8px/4px)
 * - Icon: 20px size, Fill weight
 * - Text: 14px font (sm), 20px line-height, bold weight
 * - Gap: 4px (gap-1) between icon and text
 * - Variants: normal (icon + text), minimized (icon only), selected (with border)
 *
 * Color families (verified from Figma design context):
 * - GREEN: Agriculture, Finance, Forestry, Transportation, Waste Management
 * - BLUE: Conservation, Research, Sports, Water
 * - ORANGE: Construction, Manufacturing, Real Estate, Urban Planning
 * - RED/PINK: Education, Medical, Tourism
 * - YELLOW: Energy, Technology
 * - PURPLE: Arts & Culture, Media, Policy
 */

/** Pathway color configuration using design tokens */
const pathwayColors = {
  // GREEN family
  agriculture: {
    bg: "bg-[var(--primitive-green-200)]",
    text: "text-[var(--primitive-green-700)]",
    selectedBg: "bg-[var(--primitive-green-100)]",
    selectedBorder: "border-[var(--primitive-green-200)]",
  },
  finance: {
    bg: "bg-[var(--primitive-green-200)]",
    text: "text-[var(--primitive-green-700)]",
    selectedBg: "bg-[var(--primitive-green-100)]",
    selectedBorder: "border-[var(--primitive-green-200)]",
  },
  forestry: {
    bg: "bg-[var(--primitive-green-200)]",
    text: "text-[var(--primitive-green-700)]",
    selectedBg: "bg-[var(--primitive-green-100)]",
    selectedBorder: "border-[var(--primitive-green-200)]",
  },
  transportation: {
    bg: "bg-[var(--primitive-green-200)]",
    text: "text-[var(--primitive-green-700)]",
    selectedBg: "bg-[var(--primitive-green-100)]",
    selectedBorder: "border-[var(--primitive-green-200)]",
  },
  "waste-management": {
    bg: "bg-[var(--primitive-green-200)]",
    text: "text-[var(--primitive-green-700)]",
    selectedBg: "bg-[var(--primitive-green-100)]",
    selectedBorder: "border-[var(--primitive-green-200)]",
  },

  // BLUE family
  conservation: {
    bg: "bg-[var(--primitive-blue-200)]",
    text: "text-[var(--primitive-blue-700)]",
    selectedBg: "bg-[var(--primitive-blue-100)]",
    selectedBorder: "border-[var(--primitive-blue-200)]",
  },
  research: {
    bg: "bg-[var(--primitive-blue-200)]",
    text: "text-[var(--primitive-blue-700)]",
    selectedBg: "bg-[var(--primitive-blue-100)]",
    selectedBorder: "border-[var(--primitive-blue-200)]",
  },
  sports: {
    bg: "bg-[var(--primitive-blue-200)]",
    text: "text-[var(--primitive-blue-700)]",
    selectedBg: "bg-[var(--primitive-blue-100)]",
    selectedBorder: "border-[var(--primitive-blue-200)]",
  },
  water: {
    bg: "bg-[var(--primitive-blue-200)]",
    text: "text-[var(--primitive-blue-700)]",
    selectedBg: "bg-[var(--primitive-blue-100)]",
    selectedBorder: "border-[var(--primitive-blue-200)]",
  },

  // ORANGE family
  construction: {
    bg: "bg-[var(--primitive-orange-200)]",
    text: "text-[var(--primitive-orange-700)]",
    selectedBg: "bg-[var(--primitive-orange-100)]",
    selectedBorder: "border-[var(--primitive-orange-200)]",
  },
  manufacturing: {
    bg: "bg-[var(--primitive-orange-200)]",
    text: "text-[var(--primitive-orange-700)]",
    selectedBg: "bg-[var(--primitive-orange-100)]",
    selectedBorder: "border-[var(--primitive-orange-200)]",
  },
  "real-estate": {
    bg: "bg-[var(--primitive-orange-200)]",
    text: "text-[var(--primitive-orange-700)]",
    selectedBg: "bg-[var(--primitive-orange-100)]",
    selectedBorder: "border-[var(--primitive-orange-200)]",
  },
  "urban-planning": {
    bg: "bg-[var(--primitive-orange-200)]",
    text: "text-[var(--primitive-orange-700)]",
    selectedBg: "bg-[var(--primitive-orange-100)]",
    selectedBorder: "border-[var(--primitive-orange-200)]",
  },

  // RED/PINK family
  education: {
    bg: "bg-[var(--primitive-red-200)]",
    text: "text-[var(--primitive-red-700)]",
    selectedBg: "bg-[var(--primitive-red-100)]",
    selectedBorder: "border-[var(--primitive-red-200)]",
  },
  medical: {
    bg: "bg-[var(--primitive-red-200)]",
    text: "text-[var(--primitive-red-700)]",
    selectedBg: "bg-[var(--primitive-red-100)]",
    selectedBorder: "border-[var(--primitive-red-200)]",
  },
  tourism: {
    bg: "bg-[var(--primitive-red-200)]",
    text: "text-[var(--primitive-red-700)]",
    selectedBg: "bg-[var(--primitive-red-100)]",
    selectedBorder: "border-[var(--primitive-red-200)]",
  },

  // YELLOW family
  energy: {
    bg: "bg-[var(--primitive-yellow-200)]",
    text: "text-[var(--primitive-yellow-700)]",
    selectedBg: "bg-[var(--primitive-yellow-100)]",
    selectedBorder: "border-[var(--primitive-yellow-200)]",
  },
  technology: {
    bg: "bg-[var(--primitive-yellow-200)]",
    text: "text-[var(--primitive-yellow-700)]",
    selectedBg: "bg-[var(--primitive-yellow-100)]",
    selectedBorder: "border-[var(--primitive-yellow-200)]",
  },

  // PURPLE family
  "arts-culture": {
    bg: "bg-[var(--primitive-purple-200)]",
    text: "text-[var(--primitive-purple-700)]",
    selectedBg: "bg-[var(--primitive-purple-100)]",
    selectedBorder: "border-[var(--primitive-purple-200)]",
  },
  media: {
    bg: "bg-[var(--primitive-purple-200)]",
    text: "text-[var(--primitive-purple-700)]",
    selectedBg: "bg-[var(--primitive-purple-100)]",
    selectedBorder: "border-[var(--primitive-purple-200)]",
  },
  policy: {
    bg: "bg-[var(--primitive-purple-200)]",
    text: "text-[var(--primitive-purple-700)]",
    selectedBg: "bg-[var(--primitive-purple-100)]",
    selectedBorder: "border-[var(--primitive-purple-200)]",
  },
} as const;

export type PathwayType = keyof typeof pathwayColors;

/** Display labels for pathway types */
export const pathwayLabels: Record<PathwayType, string> = {
  // GREEN family
  agriculture: "Agriculture",
  finance: "Finance",
  forestry: "Forestry",
  transportation: "Transportation",
  "waste-management": "Waste Management",
  // BLUE family
  conservation: "Conservation",
  research: "Research",
  sports: "Sports",
  water: "Water",
  // ORANGE family
  construction: "Construction",
  manufacturing: "Manufacturing",
  "real-estate": "Real Estate",
  "urban-planning": "Urban Planning",
  // RED family
  education: "Education",
  medical: "Medical",
  tourism: "Tourism",
  // YELLOW family
  energy: "Energy",
  technology: "Technology",
  // PURPLE family
  "arts-culture": "Arts & Culture",
  media: "Media",
  policy: "Policy",
};

/** Default Phosphor icon for each pathway type */
const pathwayDefaultIcons: Record<PathwayType, Icon> = {
  // GREEN family
  agriculture: Plant,
  finance: Coins,
  forestry: Tree,
  transportation: Car,
  "waste-management": Recycle,
  // BLUE family
  conservation: Leaf,
  research: Flask,
  sports: Basketball,
  water: Drop,
  // ORANGE family
  construction: HardHat,
  manufacturing: Factory,
  "real-estate": Buildings,
  "urban-planning": Bank,
  // RED family
  education: GraduationCap,
  medical: FirstAidKit,
  tourism: Airplane,
  // YELLOW family
  energy: Lightning,
  technology: Desktop,
  // PURPLE family
  "arts-culture": PaintBrush,
  media: Broadcast,
  policy: Scales,
};

export interface PathwayTagProps {
  /** Pathway type determines the color */
  pathway: PathwayType;
  /** Optional icon - Phosphor icon element */
  icon?: React.ReactNode;
  /** Pathway name (hidden if minimized) - defaults to pathway label */
  children?: React.ReactNode;
  /** Show only the icon (minimized variant) */
  minimized?: boolean;
  /** Selected state - adds border and lighter background */
  selected?: boolean;
  /** Click handler (makes the tag interactive) */
  onClick?: () => void;
  /** Additional class names */
  className?: string;
}

const PathwayTag = React.forwardRef<HTMLDivElement, PathwayTagProps>(
  (
    { pathway, icon, children, minimized = false, selected = false, onClick, className, ...props },
    ref
  ) => {
    const colors = pathwayColors[pathway] || pathwayColors.agriculture;
    const label = children ?? pathwayLabels[pathway];
    const isClickable = !!onClick;

    // Resolve the icon: use provided icon prop, or fall back to built-in default
    const DefaultIcon = pathwayDefaultIcons[pathway];
    const resolvedIcon = icon ?? (DefaultIcon ? <DefaultIcon /> : null);

    // Figma specs: 20px icon, 14px text, 8px radius, px-2 py-1 padding
    return (
      <div
        ref={ref}
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onClick={onClick}
        onKeyDown={
          isClickable
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick?.();
                }
              }
            : undefined
        }
        className={cn(
          "inline-flex items-center",
          // Figma: 8px border radius
          "rounded-lg",
          // Figma: px-2 py-1 (8px horizontal, 4px vertical)
          "px-2 py-1",
          // Gap between icon and text (only when not minimized)
          !minimized && "gap-1",
          // Background and text colors
          selected ? colors.selectedBg : colors.bg,
          colors.text,
          // Selected state: add border
          selected && ["border", colors.selectedBorder],
          // Font: 14px bold, 20px line-height
          "text-sm font-bold leading-5",
          "select-none",
          // Interactive styles
          isClickable && "cursor-pointer",
          isClickable && "transition-opacity duration-150 hover:opacity-80",
          isClickable &&
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primitive-green-500)] focus-visible:ring-offset-2",
          className
        )}
        {...props}
      >
        {/* Icon: 20px size, Fill weight (per Figma specs) */}
        {resolvedIcon && (
          <span className="flex h-5 w-5 shrink-0 items-center justify-center">
            {React.isValidElement(resolvedIcon)
              ? React.cloneElement(
                  resolvedIcon as React.ReactElement<{
                    size?: number;
                    weight?: string;
                    className?: string;
                  }>,
                  {
                    size: 20,
                    weight: "fill",
                    className: cn(
                      "w-5 h-5",
                      (resolvedIcon.props as { className?: string })?.className
                    ),
                  }
                )
              : resolvedIcon}
          </span>
        )}
        {/* Text label (hidden when minimized) */}
        {!minimized && label && <span className="truncate">{label}</span>}
      </div>
    );
  }
);

PathwayTag.displayName = "PathwayTag";

export { PathwayTag, pathwayColors, pathwayDefaultIcons };
