"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ProgressMeterCircular,
  ProgressMeterLinear,
  goalConfig,
  type GoalType,
} from "@/components/ui/progress-meter";

/**
 * GoalCard - Displays a coaching goal with progress tracking
 *
 * @figma https://figma.com/design/q1985VWRuwMkSc1hIqu5X9/Trails-Design-System?node-id=2920-16434
 *
 * Three sizes:
 * - small: Compact card with circular progress meter, title, and "View Goal" button
 * - medium: Horizontal card with colored header, raw icon, title, and linear progress
 * - large: Tall card with colored header, large icon, title, linear progress, and button
 *
 * Four goal types: interviewing (orange), networking (blue), compensation (green), organization (purple)
 */

/** Goal-type to card-level background color mapping (100-level tints) */
const goalCardBg: Record<string, string> = {
  interviewing: "bg-[var(--primitive-orange-100)]",
  networking: "bg-[var(--primitive-blue-100)]",
  compensation: "bg-[var(--primitive-green-100)]",
  organization: "bg-[var(--primitive-purple-100)]",
  sessions: "bg-[var(--primitive-blue-100)]",
  actions: "bg-[var(--primitive-blue-100)]",
  skills: "bg-[var(--primitive-blue-100)]",
  milestones: "bg-[var(--primitive-blue-100)]",
};

export interface GoalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Goal title text */
  title: string;
  /** Goal category type — determines colors and icon */
  goal?: GoalType;
  /** Progress value (0-100) */
  progress?: number;
  /** Card size variant */
  size?: "small" | "medium" | "large";
  /** Callback when "View Goal" button is clicked */
  onViewGoal?: () => void;
  /** Custom button label */
  buttonLabel?: string;
}

const GoalCard = React.forwardRef<HTMLDivElement, GoalCardProps>(
  (
    {
      className,
      title,
      goal = "interviewing",
      progress = 25,
      size = "small",
      onViewGoal,
      buttonLabel = "View Goal",
      ...props
    },
    ref
  ) => {
    if (size === "small") {
      return (
        <GoalCardSmall
          ref={ref}
          className={className}
          title={title}
          goal={goal}
          progress={progress}
          onViewGoal={onViewGoal}
          buttonLabel={buttonLabel}
          {...props}
        />
      );
    }

    if (size === "medium") {
      return (
        <GoalCardMedium
          ref={ref}
          className={className}
          title={title}
          goal={goal}
          progress={progress}
          {...props}
        />
      );
    }

    return (
      <GoalCardLarge
        ref={ref}
        className={className}
        title={title}
        goal={goal}
        progress={progress}
        onViewGoal={onViewGoal}
        buttonLabel={buttonLabel}
        {...props}
      />
    );
  }
);

GoalCard.displayName = "GoalCard";

// ============================================================================
// Internal shared props
// ============================================================================

interface GoalCardInternalProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: string;
  goal: GoalType;
  progress: number;
  onViewGoal?: () => void;
  buttonLabel?: string;
}

// ============================================================================
// Small Variant
// Compact card: circular progress icon + title + "View Goal" button
// Figma: 2920:16434, 2920:16442, 2920:16450, 2920:16458
// ============================================================================

const GoalCardSmall = React.forwardRef<HTMLDivElement, GoalCardInternalProps>(
  ({ className, title, goal, progress, onViewGoal, buttonLabel, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-start justify-between overflow-hidden",
          "rounded-[var(--radius-card)] bg-[var(--card-background)] p-4",
          "h-full",
          className
        )}
        {...props}
      >
        {/* Top section: circular progress + title */}
        <div className="flex w-full flex-1 flex-col gap-2">
          <ProgressMeterCircular goal={goal} size="sm" value={progress} />
          <p className="w-full text-body leading-6 text-[var(--foreground-default)]">{title}</p>
        </div>

        {/* Bottom action */}
        <Button variant="tertiary" size="default" className="mt-3 shrink-0" onClick={onViewGoal}>
          {buttonLabel}
        </Button>
      </div>
    );
  }
);

GoalCardSmall.displayName = "GoalCardSmall";

// ============================================================================
// Medium Variant
// Card with colored top strip + icon → white content area with title + progress
// Figma: 2920:16466, 2920:16476, 2920:16486, 2920:16496
// ============================================================================

const GoalCardMedium = React.forwardRef<HTMLDivElement, GoalCardInternalProps>(
  ({ className, title, goal, progress, onViewGoal, buttonLabel, ...props }, ref) => {
    const config = goalConfig[goal];
    const IconComponent = config.icon;

    return (
      <div
        ref={ref}
        className={cn(
          "group flex h-full overflow-hidden rounded-[var(--radius-card)]",
          goalCardBg[goal],
          className
        )}
        {...props}
      >
        <div className="flex w-full flex-col items-end justify-between rounded-[var(--radius-card)]">
          {/* Colored header with raw icon */}
          <div className="flex w-full items-start px-4 pb-2 pt-4">
            <IconComponent
              size={24}
              weight="fill"
              style={{ color: config.colorVar }}
              aria-hidden="true"
            />
          </div>

          {/* White content area */}
          <div
            className={cn(
              "flex w-full flex-1 flex-col items-start justify-between overflow-hidden",
              "rounded-[var(--radius-card)] bg-[var(--card-background)] p-4"
            )}
          >
            {/* Title */}
            <p className="w-full flex-1 text-heading-sm font-medium leading-8 text-[var(--foreground-default)]">
              {title}
            </p>

            {/* Default: linear progress — Hover: view goal button */}
            <div className="relative w-full">
              <div
                className="opacity-100 group-hover:opacity-0"
                style={{ transition: "opacity var(--duration-fast) var(--ease-default)" }}
              >
                <ProgressMeterLinear goal={goal} value={progress} showLabel />
              </div>
              <div
                className="absolute inset-0 flex items-center opacity-0 group-hover:opacity-100"
                style={{ transition: "opacity var(--duration-fast) var(--ease-default)" }}
              >
                <Button variant="tertiary" size="default" className="w-full" onClick={onViewGoal}>
                  {buttonLabel}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

GoalCardMedium.displayName = "GoalCardMedium";

// ============================================================================
// Large Variant
// Tall card: colored header with large icon → white content with large title,
// linear progress, and "View Goal" button
// Figma: 2920:16506, 2920:16515, 2920:16524, 2920:16532
// ============================================================================

const GoalCardLarge = React.forwardRef<HTMLDivElement, GoalCardInternalProps>(
  ({ className, title, goal, progress, onViewGoal, buttonLabel, ...props }, ref) => {
    const config = goalConfig[goal];
    const IconComponent = config.icon;

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-start justify-between overflow-hidden",
          "h-full rounded-[var(--radius-card)] shadow-card",
          goalCardBg[goal],
          className
        )}
        {...props}
      >
        {/* Colored header section with large icon */}
        <div className="flex w-full flex-col items-start px-6 pb-4 pt-6">
          <IconComponent
            size={48}
            weight="fill"
            style={{ color: config.colorVar }}
            aria-hidden="true"
          />
        </div>

        {/* White content section */}
        <div
          className={cn(
            "flex w-full flex-1 flex-col items-start justify-between",
            "rounded-[var(--radius-card)] bg-[var(--card-background)]",
            "px-6 pb-6 pt-4"
          )}
        >
          {/* Title + progress */}
          <div className="flex w-full flex-col gap-4">
            <p className="w-full text-heading-md font-medium leading-[48px] text-[var(--foreground-default)]">
              {title}
            </p>
            <ProgressMeterLinear goal={goal} value={progress} showLabel />
          </div>

          {/* View Goal button */}
          <Button
            variant="tertiary"
            size="default"
            className="mt-4 w-full shrink-0"
            onClick={onViewGoal}
          >
            {buttonLabel}
          </Button>
        </div>
      </div>
    );
  }
);

GoalCardLarge.displayName = "GoalCardLarge";

export { GoalCard, goalCardBg };
