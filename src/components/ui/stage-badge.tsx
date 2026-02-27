"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { getPhaseGroupConfig } from "@/lib/pipeline/stage-registry-ui";
import type { PhaseGroup } from "@/lib/pipeline/stage-registry";

/**
 * Stage Badge Components for ATS Pipeline Stages
 *
 * Visual indicators for candidate pipeline stages with semantic colors.
 */

type StageVariant =
  | "applied"
  | "qualified"
  | "screening" // Legacy alias for qualified
  | "interview"
  | "offer"
  | "hired"
  | "rejected"
  | "withdrawn"
  | "on_hold"
  | "custom";

interface StageBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Pre-defined stage variant */
  variant?: StageVariant;
  /** Stage ID — auto-resolves to correct phase colors via the pipeline registry.
   *  When provided, overrides `variant` for color resolution. */
  stage?: string;
  /** Custom color (hex) - used when variant is "custom" */
  color?: string;
  /** Stage label */
  children: React.ReactNode;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Show dot indicator */
  showDot?: boolean;
}

/**
 * Map StageVariant → PhaseGroup for registry color lookups.
 * "on_hold" maps to "talent-pool" (yellow color), "custom" is handled separately.
 */
const VARIANT_TO_PHASE: Record<Exclude<StageVariant, "custom">, PhaseGroup> = {
  applied: "applied",
  qualified: "review",
  screening: "review",
  interview: "interview",
  offer: "offer",
  hired: "hired",
  rejected: "rejected",
  withdrawn: "withdrawn",
  on_hold: "talent-pool",
};

/** Derive stage badge colors from the shared pipeline registry */
const stageConfig: Record<
  Exclude<StageVariant, "custom">,
  { bg: string; text: string; dot: string }
> = Object.fromEntries(
  (Object.keys(VARIANT_TO_PHASE) as Exclude<StageVariant, "custom">[]).map((variant) => {
    const phase = VARIANT_TO_PHASE[variant];
    const config = getPhaseGroupConfig(phase);
    return [
      variant,
      {
        bg: `${config.badgeBg} ${config.badgeBgDark}`,
        text: `${config.badgeText} ${config.badgeTextDark}`,
        dot: config.badgeDot,
      },
    ];
  })
) as Record<Exclude<StageVariant, "custom">, { bg: string; text: string; dot: string }>;

const StageBadge = React.forwardRef<HTMLSpanElement, StageBadgeProps>(
  (
    {
      className,
      variant = "applied",
      stage,
      color,
      children,
      size = "md",
      showDot = true,
      ...props
    },
    ref
  ) => {
    // If a stage ID is provided, resolve colors from the pipeline registry
    const resolvedConfig = React.useMemo(() => {
      if (stage) {
        const phaseConfig = getPhaseGroupConfig(
          (VARIANT_TO_PHASE as Record<string, PhaseGroup>)[stage] ??
            // Fall back to registry lookup for custom stage IDs
            (() => {
              // Import getPhaseGroup dynamically isn't ideal, so use a simple mapping
              // Custom stages will use "review" as fallback which gives blue colors
              return "review" as PhaseGroup;
            })()
        );
        return {
          bg: `${phaseConfig.badgeBg} ${phaseConfig.badgeBgDark}`,
          text: `${phaseConfig.badgeText} ${phaseConfig.badgeTextDark}`,
          dot: phaseConfig.badgeDot,
        };
      }
      return null;
    }, [stage]);

    const isCustom = variant === "custom" && color;
    const config = resolvedConfig ?? (variant !== "custom" ? stageConfig[variant] : null);

    const sizeClasses = {
      sm: "text-caption px-1.5 py-0.5",
      md: "text-caption px-2 py-1",
      lg: "text-body-sm px-3 py-1.5",
    };

    const dotSizeClasses = {
      sm: "w-1 h-1",
      md: "w-1.5 h-1.5",
      lg: "w-2 h-2",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full font-medium",
          sizeClasses[size],
          isCustom
            ? ""
            : config
              ? `${config.bg} ${config.text}`
              : "bg-background-muted text-foreground-muted",
          className
        )}
        style={
          isCustom
            ? {
                backgroundColor: `${color}20`,
                color: color,
              }
            : undefined
        }
        {...props}
      >
        {showDot && (
          <span
            className={cn(
              "flex-shrink-0 rounded-full",
              dotSizeClasses[size],
              isCustom ? "" : config?.dot || "bg-foreground-subtle"
            )}
            style={isCustom ? { backgroundColor: color } : undefined}
          />
        )}
        {children}
      </span>
    );
  }
);
StageBadge.displayName = "StageBadge";

/**
 * Stage indicator without text, just the dot
 */
interface StageIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: StageVariant;
  color?: string;
  size?: "sm" | "md" | "lg";
}

const StageIndicator = React.forwardRef<HTMLSpanElement, StageIndicatorProps>(
  ({ className, variant = "applied", color, size = "md", ...props }, ref) => {
    const isCustom = variant === "custom" && color;
    const config = variant !== "custom" ? stageConfig[variant] : null;

    const sizeClasses = {
      sm: "w-2 h-2",
      md: "w-3 h-3",
      lg: "w-4 h-4",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-block rounded-full",
          sizeClasses[size],
          isCustom ? "" : config?.dot || "bg-foreground-subtle",
          className
        )}
        style={isCustom ? { backgroundColor: color } : undefined}
        {...props}
      />
    );
  }
);
StageIndicator.displayName = "StageIndicator";

/**
 * Stage progress bar showing pipeline position
 */
interface StageProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  stages: { id: string; label: string; color?: string }[];
  currentStageId: string;
}

const StageProgress = React.forwardRef<HTMLDivElement, StageProgressProps>(
  ({ className, stages, currentStageId, ...props }, ref) => {
    const currentIndex = stages.findIndex((s) => s.id === currentStageId);

    return (
      <div ref={ref} className={cn("flex items-center gap-1", className)} {...props}>
        {stages.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <React.Fragment key={stage.id}>
              <div className={cn("flex items-center gap-2", index > 0 && "flex-1")}>
                {index > 0 && (
                  <div
                    className={cn(
                      "h-0.5 flex-1",
                      isCompleted || isCurrent
                        ? "bg-[var(--primitive-green-500)]"
                        : "bg-[var(--border-emphasis)]"
                    )}
                  />
                )}
                <div
                  className={cn(
                    "h-3 w-3 flex-shrink-0 rounded-full transition-colors",
                    isCompleted && "bg-[var(--primitive-green-500)]",
                    isCurrent &&
                      "bg-[var(--primitive-green-600)] ring-2 ring-[var(--primitive-blue-200)] dark:ring-[var(--primitive-blue-700)]",
                    !isCompleted && !isCurrent && "bg-[var(--border-emphasis)]"
                  )}
                  style={
                    stage.color && (isCompleted || isCurrent)
                      ? { backgroundColor: stage.color }
                      : undefined
                  }
                  title={stage.label}
                />
              </div>
            </React.Fragment>
          );
        })}
      </div>
    );
  }
);
StageProgress.displayName = "StageProgress";

/**
 * Compact stage list with labels
 */
interface StageListProps extends React.HTMLAttributes<HTMLDivElement> {
  stages: { id: string; label: string; color?: string }[];
  currentStageId: string;
  orientation?: "horizontal" | "vertical";
}

const StageList = React.forwardRef<HTMLDivElement, StageListProps>(
  ({ className, stages, currentStageId, orientation = "horizontal", ...props }, ref) => {
    const currentIndex = stages.findIndex((s) => s.id === currentStageId);

    return (
      <div
        ref={ref}
        className={cn("flex gap-3", orientation === "vertical" && "flex-col", className)}
        {...props}
      >
        {stages.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div
              key={stage.id}
              className={cn(
                "flex items-center gap-2 text-caption",
                isCurrent && "font-medium",
                isCompleted || isCurrent ? "text-foreground" : "text-foreground-subtle"
              )}
            >
              <div
                className={cn(
                  "h-2 w-2 flex-shrink-0 rounded-full",
                  isCompleted && "bg-[var(--primitive-green-500)]",
                  isCurrent && "bg-[var(--primitive-green-600)]",
                  !isCompleted && !isCurrent && "bg-[var(--border-default)]"
                )}
                style={stage.color && isCurrent ? { backgroundColor: stage.color } : undefined}
              />
              <span>{stage.label}</span>
            </div>
          );
        })}
      </div>
    );
  }
);
StageList.displayName = "StageList";

export { StageBadge, StageIndicator, StageProgress, StageList };

export type { StageVariant };
