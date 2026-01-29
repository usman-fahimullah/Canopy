"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

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
  /** Custom color (hex) - used when variant is "custom" */
  color?: string;
  /** Stage label */
  children: React.ReactNode;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Show dot indicator */
  showDot?: boolean;
}

const stageConfig: Record<
  Exclude<StageVariant, "custom">,
  { bg: string; text: string; dot: string }
> = {
  applied: {
    bg: "bg-[var(--primitive-purple-100)] dark:bg-[var(--primitive-purple-500)]/15",
    text: "text-[var(--primitive-purple-700)] dark:text-[var(--primitive-purple-300)]",
    dot: "bg-[var(--primitive-purple-500)]",
  },
  qualified: {
    bg: "bg-[var(--primitive-blue-100)] dark:bg-[var(--primitive-blue-500)]/15",
    text: "text-[var(--primitive-blue-700)] dark:text-[var(--primitive-blue-300)]",
    dot: "bg-[var(--primitive-blue-500)]",
  },
  // Legacy alias - same as qualified
  screening: {
    bg: "bg-[var(--primitive-blue-100)] dark:bg-[var(--primitive-blue-500)]/15",
    text: "text-[var(--primitive-blue-700)] dark:text-[var(--primitive-blue-300)]",
    dot: "bg-[var(--primitive-blue-500)]",
  },
  interview: {
    bg: "bg-[var(--primitive-orange-100)] dark:bg-[var(--primitive-orange-500)]/15",
    text: "text-[var(--primitive-orange-700)] dark:text-[var(--primitive-orange-300)]",
    dot: "bg-[var(--primitive-orange-500)]",
  },
  offer: {
    bg: "bg-[var(--primitive-green-100)] dark:bg-[var(--primitive-green-500)]/15",
    text: "text-[var(--primitive-green-700)] dark:text-[var(--primitive-green-300)]",
    dot: "bg-[var(--primitive-green-500)]",
  },
  hired: {
    bg: "bg-[var(--primitive-green-100)] dark:bg-[var(--primitive-green-500)]/15",
    text: "text-[var(--primitive-green-700)] dark:text-[var(--primitive-green-300)]",
    dot: "bg-[var(--primitive-green-500)]",
  },
  rejected: {
    bg: "bg-[var(--primitive-red-100)] dark:bg-[var(--primitive-red-500)]/15",
    text: "text-[var(--primitive-red-700)] dark:text-[var(--primitive-red-300)]",
    dot: "bg-[var(--primitive-red-500)]",
  },
  withdrawn: {
    bg: "bg-background-muted",
    text: "text-foreground-muted",
    dot: "bg-border-emphasis",
  },
  on_hold: {
    bg: "bg-[var(--primitive-yellow-100)] dark:bg-[var(--primitive-yellow-500)]/15",
    text: "text-[var(--primitive-yellow-700)] dark:text-[var(--primitive-yellow-300)]",
    dot: "bg-[var(--primitive-yellow-500)]",
  },
};

const StageBadge = React.forwardRef<HTMLSpanElement, StageBadgeProps>(
  (
    {
      className,
      variant = "applied",
      color,
      children,
      size = "md",
      showDot = true,
      ...props
    },
    ref
  ) => {
    const isCustom = variant === "custom" && color;
    const config = variant !== "custom" ? stageConfig[variant] : null;

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
              "rounded-full flex-shrink-0",
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
      <div
        ref={ref}
        className={cn("flex items-center gap-1", className)}
        {...props}
      >
        {stages.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <React.Fragment key={stage.id}>
              <div
                className={cn(
                  "flex items-center gap-2",
                  index > 0 && "flex-1"
                )}
              >
                {index > 0 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5",
                      isCompleted || isCurrent
                        ? "bg-[var(--primitive-green-500)]"
                        : "bg-[var(--border-emphasis)]"
                    )}
                  />
                )}
                <div
                  className={cn(
                    "w-3 h-3 rounded-full flex-shrink-0 transition-colors",
                    isCompleted && "bg-[var(--primitive-green-500)]",
                    isCurrent && "bg-[var(--primitive-green-600)] ring-2 ring-[var(--primitive-green-200)] dark:ring-[var(--primitive-green-700)]",
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
  (
    { className, stages, currentStageId, orientation = "horizontal", ...props },
    ref
  ) => {
    const currentIndex = stages.findIndex((s) => s.id === currentStageId);

    return (
      <div
        ref={ref}
        className={cn(
          "flex gap-3",
          orientation === "vertical" && "flex-col",
          className
        )}
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
                isCompleted || isCurrent
                  ? "text-foreground"
                  : "text-foreground-subtle"
              )}
            >
              <div
                className={cn(
                  "w-2 h-2 rounded-full flex-shrink-0",
                  isCompleted && "bg-[var(--primitive-green-500)]",
                  isCurrent && "bg-[var(--primitive-green-600)]",
                  !isCompleted && !isCurrent && "bg-[var(--border-default)]"
                )}
                style={
                  stage.color && isCurrent
                    ? { backgroundColor: stage.color }
                    : undefined
                }
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

export {
  StageBadge,
  StageIndicator,
  StageProgress,
  StageList,
};

export type { StageVariant };
