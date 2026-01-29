"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  ChatCircle,
  Handshake,
  PiggyBank,
  Folder,
  VideoCamera,
  ListChecks,
  Certificate,
  Flag,
} from "@phosphor-icons/react";

/**
 * Progress Meter components based on Figma Design System
 *
 * Three types:
 * 1. ProgressMeterCircular (1281:1760) - Circular progress with icon
 * 2. ProgressMeterLinear (1281:1854) - Simple linear progress bar
 * 3. ProgressMeterSteps (3143:12273) - Step-based progress bar
 *
 * Goal Types (Default):
 * - Interviewing: orange (#F5580A), ChatCircle icon
 * - Networking: blue (#3369FF), Handshake icon
 * - Compensation: green (#5ECC70), PiggyBank icon
 * - Organization: purple (#9C59FF), Folder icon
 *
 * Goal Types (Candid Platform):
 * - Sessions: blue (#3369FF), VideoCamera icon - Coaching sessions completed
 * - Actions: blue (#3369FF), ListChecks icon - Action items completed
 * - Skills: blue (#3369FF), Certificate icon - Skills development progress
 * - Milestones: blue (#3369FF), Flag icon - Career goals achieved
 */

export type GoalType =
  | "interviewing"
  | "networking"
  | "compensation"
  | "organization"
  | "sessions"
  | "actions"
  | "skills"
  | "milestones";

const goalConfig: Record<
  GoalType,
  {
    bg: string;
    fill: string;
    colorVar: string;
    icon: React.ElementType;
  }
> = {
  interviewing: {
    bg: "bg-[var(--primitive-orange-200)]",
    fill: "bg-[var(--primitive-orange-500)]",
    colorVar: "var(--primitive-orange-500)",
    icon: ChatCircle,
  },
  networking: {
    bg: "bg-[var(--primitive-blue-200)]",
    fill: "bg-[var(--primitive-blue-500)]",
    colorVar: "var(--primitive-blue-500)",
    icon: Handshake,
  },
  compensation: {
    bg: "bg-[var(--primitive-green-200)]",
    fill: "bg-[var(--primitive-green-500)]",
    colorVar: "var(--primitive-green-500)",
    icon: PiggyBank,
  },
  organization: {
    bg: "bg-[var(--primitive-purple-200)]",
    fill: "bg-[var(--primitive-purple-500)]",
    colorVar: "var(--primitive-purple-500)",
    icon: Folder,
  },
  // Candid Platform Goals - All use blue color palette
  sessions: {
    bg: "bg-[var(--primitive-blue-200)]",
    fill: "bg-[var(--primitive-blue-500)]",
    colorVar: "var(--primitive-blue-500)",
    icon: VideoCamera,
  },
  actions: {
    bg: "bg-[var(--primitive-blue-200)]",
    fill: "bg-[var(--primitive-blue-500)]",
    colorVar: "var(--primitive-blue-500)",
    icon: ListChecks,
  },
  skills: {
    bg: "bg-[var(--primitive-blue-200)]",
    fill: "bg-[var(--primitive-blue-500)]",
    colorVar: "var(--primitive-blue-500)",
    icon: Certificate,
  },
  milestones: {
    bg: "bg-[var(--primitive-blue-200)]",
    fill: "bg-[var(--primitive-blue-500)]",
    colorVar: "var(--primitive-blue-500)",
    icon: Flag,
  },
};

// ============================================================================
// Progress Meter Circular
// ============================================================================

export interface ProgressMeterCircularProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** The goal type determines colors and icon */
  goal?: GoalType;
  /** Size of the circular progress */
  size?: "sm" | "lg";
  /** Progress value (0-100) */
  value?: number;
  /** Show image background instead of solid color */
  image?: string;
  /** Custom icon to override default */
  icon?: React.ReactNode;
}

const ProgressMeterCircular = React.forwardRef<
  HTMLDivElement,
  ProgressMeterCircularProps
>(
  (
    {
      className,
      goal = "interviewing",
      size = "lg",
      value = 25,
      image,
      icon,
      ...props
    },
    ref
  ) => {
    const config = goalConfig[goal];
    const IconComponent = config.icon;

    // Outer container size
    const dimension = size === "sm" ? 48 : 96;
    // SVG ring stroke thickness (Figma: 3px sm, 4px lg)
    const strokeWidth = size === "sm" ? 3 : 4;
    // Transparent gap between ring and inner circle (Figma: 6px sm, 8px lg)
    const gapWidth = size === "sm" ? 6 : 8;
    // Inset for the inner colored circle = ring stroke + gap
    const innerInset = strokeWidth + gapWidth;
    const iconSize = size === "sm" ? 16 : 48;

    const radius = (dimension - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const safeValue = Math.min(100, Math.max(0, value));
    const offset = circumference - (safeValue / 100) * circumference;

    return (
      <div
        ref={ref}
        className={cn("relative inline-flex", className)}
        style={{ width: dimension, height: dimension }}
        role="progressbar"
        aria-valuenow={safeValue}
        aria-valuemin={0}
        aria-valuemax={100}
        {...props}
      >
        {/* Inner colored circle with icon or image */}
        <div
          className={cn(
            "absolute rounded-full flex items-center justify-center",
            !image && config.bg
          )}
          style={{
            inset: innerInset,
            ...(image && {
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }),
          }}
        >
          {!image && (icon || (
            <IconComponent
              weight="fill"
              size={iconSize}
              style={{ color: config.colorVar }}
              aria-hidden="true"
            />
          ))}
        </div>

        {/* SVG Progress Ring */}
        <svg
          className="absolute inset-0 transform -rotate-90"
          width={dimension}
          height={dimension}
        >
          {/* Background track */}
          <circle
            fill="transparent"
            strokeWidth={strokeWidth}
            style={{ stroke: "var(--primitive-neutral-200)" }}
            r={radius}
            cx={dimension / 2}
            cy={dimension / 2}
          />
          {/* Progress indicator */}
          <circle
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ stroke: config.colorVar }}
            r={radius}
            cx={dimension / 2}
            cy={dimension / 2}
            className="transition-[stroke-dashoffset] duration-300 ease-out"
          />
        </svg>
      </div>
    );
  }
);

ProgressMeterCircular.displayName = "ProgressMeterCircular";

// ============================================================================
// Progress Meter Linear
// ============================================================================

export interface ProgressMeterLinearProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** The goal type determines the fill color */
  goal?: GoalType;
  /** Progress value (0-100) */
  value?: number;
  /** Show the percentage label */
  showLabel?: boolean;
  /** Custom label text */
  labelText?: string;
}

const ProgressMeterLinear = React.forwardRef<
  HTMLDivElement,
  ProgressMeterLinearProps
>(
  (
    {
      className,
      goal = "interviewing",
      value = 25,
      showLabel = true,
      labelText = "Complete",
      ...props
    },
    ref
  ) => {
    const config = goalConfig[goal];
    const safeValue = Math.min(100, Math.max(0, value));

    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-1 w-full py-2", className)}
        role="progressbar"
        aria-valuenow={safeValue}
        aria-valuemin={0}
        aria-valuemax={100}
        {...props}
      >
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-[var(--primitive-neutral-200)] rounded-xl overflow-hidden">
          <div
            className={cn("h-full rounded-[4px] transition-all duration-300", config.fill)}
            style={{ width: `${safeValue}%` }}
          />
        </div>

        {/* Label */}
        {showLabel && (
          <div className="flex gap-1 text-sm leading-5">
            <span className="text-[var(--primitive-neutral-black)] font-normal">
              {Math.round(safeValue)}%
            </span>
            <span className="text-[var(--primitive-neutral-600)] font-normal">
              {labelText}
            </span>
          </div>
        )}
      </div>
    );
  }
);

ProgressMeterLinear.displayName = "ProgressMeterLinear";

// ============================================================================
// Progress Meter Steps
// ============================================================================

export interface ProgressMeterStepsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** The goal type determines the fill color */
  goal?: GoalType;
  /** Total number of steps */
  totalSteps?: number;
  /** Current step (1-indexed) */
  currentStep?: number;
  /** Show the percentage label */
  showLabel?: boolean;
  /** Custom label text */
  labelText?: string;
}

const ProgressMeterSteps = React.forwardRef<
  HTMLDivElement,
  ProgressMeterStepsProps
>(
  (
    {
      className,
      goal = "interviewing",
      totalSteps = 4,
      currentStep = 1,
      showLabel = true,
      labelText = "Complete",
      ...props
    },
    ref
  ) => {
    const config = goalConfig[goal];
    const safeCurrentStep = Math.min(totalSteps, Math.max(0, currentStep));
    const percentage = Math.round((safeCurrentStep / totalSteps) * 100);

    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-1 w-full py-2", className)}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`Step ${safeCurrentStep} of ${totalSteps}`}
        {...props}
      >
        {/* Step indicators */}
        <div className="flex gap-2 w-full">
          {Array.from({ length: totalSteps }, (_, index) => (
            <div
              key={index}
              className={cn(
                "flex-1 h-1.5 rounded-[4px] min-h-px min-w-px",
                index < safeCurrentStep
                  ? config.fill
                  : "bg-[var(--primitive-neutral-200)]"
              )}
            />
          ))}
        </div>

        {/* Label */}
        {showLabel && (
          <div className="flex gap-1 text-sm leading-5">
            <span className="text-[var(--primitive-neutral-black)] font-normal">
              {percentage}%
            </span>
            <span className="text-[var(--primitive-neutral-600)] font-normal">
              {labelText}
            </span>
          </div>
        )}
      </div>
    );
  }
);

ProgressMeterSteps.displayName = "ProgressMeterSteps";

export {
  ProgressMeterCircular,
  ProgressMeterLinear,
  ProgressMeterSteps,
  goalConfig,
};
