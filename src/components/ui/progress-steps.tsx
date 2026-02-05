"use client";

import * as React from "react";
import { Confetti } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/**
 * Progress Steps Component for Job Seeker Pipeline
 *
 * Displays a visual pipeline of job application stages:
 * Saved → Applied → Interviewing → Offers → Hired
 *
 * @figma https://figma.com/design/q1985VWRuwMkSc1hIqu5X9/Trails-Design-System?node-id=2472-8143
 * @figma https://figma.com/design/q1985VWRuwMkSc1hIqu5X9/Trails-Design-System?node-id=3144-13402
 */

// ============================================
// TYPES
// ============================================

export type ProgressStepType = "saved" | "applied" | "interviewing" | "offers" | "hired";
export type ProgressStepPosition = "start" | "middle" | "end";

export interface ProgressStepProps {
  /** The step type */
  step: ProgressStepType;
  /** Count to display (shows "-" when inactive/undefined) */
  count?: number;
  /** Whether the step is active (has data) */
  active?: boolean;
  /** Position in the bar determines shape */
  position?: ProgressStepPosition;
  /** Additional CSS classes */
  className?: string;
}

export interface ProgressStepsBarProps {
  /** Data for each step */
  data: {
    saved?: number;
    applied?: number;
    interviewing?: number;
    offers?: number;
    hired?: boolean;
  };
  /** Additional CSS classes */
  className?: string;
}

// ============================================
// COLOR CONFIGURATION
// ============================================

interface StepColorConfig {
  activeBg: string;
  activeText: string;
  inactiveBg: string;
  inactiveText: string;
}

const stepColors: Record<ProgressStepType, StepColorConfig> = {
  saved: {
    activeBg: "var(--primitive-blue-200)",
    activeText: "var(--primitive-blue-600)",
    inactiveBg: "var(--primitive-neutral-300)",
    inactiveText: "var(--primitive-neutral-600)",
  },
  applied: {
    activeBg: "var(--primitive-purple-200)",
    activeText: "var(--primitive-purple-600)",
    inactiveBg: "var(--primitive-neutral-300)",
    inactiveText: "var(--primitive-neutral-600)",
  },
  interviewing: {
    activeBg: "var(--primitive-orange-200)",
    activeText: "var(--primitive-orange-600)",
    inactiveBg: "var(--primitive-neutral-300)",
    inactiveText: "var(--primitive-neutral-600)",
  },
  offers: {
    activeBg: "var(--primitive-green-200)",
    activeText: "var(--primitive-green-600)",
    inactiveBg: "var(--primitive-neutral-300)",
    inactiveText: "var(--primitive-neutral-600)",
  },
  hired: {
    // Rainbow gradient handled separately
    activeBg: "url(#rainbow-gradient)",
    activeText: "var(--primitive-neutral-900)",
    inactiveBg: "var(--primitive-neutral-300)",
    inactiveText: "var(--primitive-neutral-600)",
  },
};

const stepLabels: Record<ProgressStepType, string> = {
  saved: "Saved",
  applied: "Applied",
  interviewing: "Interviewing",
  offers: "Offers",
  hired: "Hired",
};

// ============================================
// SVG SHAPE COMPONENTS
// ============================================

/**
 * Start shape - flat left edge, arrow point on right
 * viewBox based on Figma: ~203px wide × 125px tall
 */
function StartShape({ fill, className }: { fill: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 203 125"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-full w-full", className)}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="rainbow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--primitive-green-200)" />
          <stop offset="20%" stopColor="var(--primitive-blue-200)" />
          <stop offset="40%" stopColor="var(--primitive-purple-200)" />
          <stop offset="60%" stopColor="var(--primitive-red-200)" />
          <stop offset="80%" stopColor="var(--primitive-orange-200)" />
          <stop offset="100%" stopColor="var(--primitive-yellow-200)" />
        </linearGradient>
      </defs>
      <path
        d="M0 12C0 5.37258 5.37258 0 12 0H171.5C175.376 0 178.994 1.91344 181.162 5.1L201.662 59.6C202.78 61.2667 202.78 63.7333 201.662 65.4L181.162 119.9C178.994 123.087 175.376 125 171.5 125H12C5.37258 125 0 119.627 0 113V12Z"
        fill={fill}
      />
    </svg>
  );
}

/**
 * Middle shape - arrow notch on left, arrow point on right
 * viewBox based on Figma: ~235px wide × 125px tall
 */
function MiddleShape({ fill, className }: { fill: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 235 125"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-full w-full", className)}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="rainbow-gradient-middle" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--primitive-green-200)" />
          <stop offset="20%" stopColor="var(--primitive-blue-200)" />
          <stop offset="40%" stopColor="var(--primitive-purple-200)" />
          <stop offset="60%" stopColor="var(--primitive-red-200)" />
          <stop offset="80%" stopColor="var(--primitive-orange-200)" />
          <stop offset="100%" stopColor="var(--primitive-yellow-200)" />
        </linearGradient>
      </defs>
      <path
        d="M5.08 0H203.5C207.376 0 210.994 1.91344 213.162 5.1L233.662 59.6C234.78 61.2667 234.78 63.7333 233.662 65.4L213.162 119.9C210.994 123.087 207.376 125 203.5 125H5.08C1.204 125 -1.414 121.087 0.338 117.5L18.838 62.5L0.338 7.5C-1.414 3.913 1.204 0 5.08 0Z"
        fill={fill}
      />
    </svg>
  );
}

/**
 * End shape - arrow notch on left, flat right edge
 * viewBox based on Figma: ~203px wide × 125px tall
 */
function EndShape({ fill, className }: { fill: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 203 125"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-full w-full", className)}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="rainbow-gradient-end" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--primitive-green-200)" />
          <stop offset="20%" stopColor="var(--primitive-blue-200)" />
          <stop offset="40%" stopColor="var(--primitive-purple-200)" />
          <stop offset="60%" stopColor="var(--primitive-red-200)" />
          <stop offset="80%" stopColor="var(--primitive-orange-200)" />
          <stop offset="100%" stopColor="var(--primitive-yellow-200)" />
        </linearGradient>
      </defs>
      <path
        d="M5.08 0H191C197.627 0 203 5.37258 203 12V113C203 119.627 197.627 125 191 125H5.08C1.204 125 -1.414 121.087 0.338 117.5L18.838 62.5L0.338 7.5C-1.414 3.913 1.204 0 5.08 0Z"
        fill={fill}
      />
    </svg>
  );
}

// ============================================
// PROGRESS STEP COMPONENT
// ============================================

const ProgressStep = React.forwardRef<HTMLDivElement, ProgressStepProps>(
  ({ step, count, active = false, position = "middle", className }, ref) => {
    const colors = stepColors[step];
    const label = stepLabels[step];
    const isHired = step === "hired";

    // Determine fill color
    const fillColor = active
      ? isHired
        ? `url(#rainbow-gradient${position === "middle" ? "-middle" : position === "end" ? "-end" : ""})`
        : colors.activeBg
      : colors.inactiveBg;

    const textColor = active ? colors.activeText : colors.inactiveText;

    // Determine width based on position
    const widthClass = position === "start" || position === "end" ? "w-[203px]" : "w-[235px]";

    // Render appropriate shape
    const ShapeComponent =
      position === "start" ? StartShape : position === "end" ? EndShape : MiddleShape;

    return (
      <div ref={ref} className={cn("relative h-[125px] flex-shrink-0", widthClass, className)}>
        {/* SVG Background Shape */}
        <ShapeComponent fill={fillColor} className="absolute inset-0" />

        {/* Content Overlay */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center gap-2",
            position === "start" && "pr-8",
            position === "end" && "pl-8",
            position === "middle" && "px-8"
          )}
          style={{ color: textColor }}
        >
          {/* Count or Icon */}
          {isHired ? (
            <Confetti size={48} weight="fill" />
          ) : (
            <span className="text-[48px] font-medium leading-none tracking-tight">
              {active && count !== undefined ? String(count).padStart(2, "0") : "-"}
            </span>
          )}

          {/* Label */}
          <span className="text-body font-bold">{label}</span>
        </div>
      </div>
    );
  }
);
ProgressStep.displayName = "ProgressStep";

// ============================================
// PROGRESS STEPS BAR COMPONENT
// ============================================

const ProgressStepsBar = React.forwardRef<HTMLDivElement, ProgressStepsBarProps>(
  ({ data, className }, ref) => {
    const steps: {
      step: ProgressStepType;
      position: ProgressStepPosition;
      count?: number;
      active: boolean;
    }[] = [
      {
        step: "saved",
        position: "start",
        count: data.saved,
        active: data.saved !== undefined && data.saved > 0,
      },
      {
        step: "applied",
        position: "middle",
        count: data.applied,
        active: data.applied !== undefined && data.applied > 0,
      },
      {
        step: "interviewing",
        position: "middle",
        count: data.interviewing,
        active: data.interviewing !== undefined && data.interviewing > 0,
      },
      {
        step: "offers",
        position: "middle",
        count: data.offers,
        active: data.offers !== undefined && data.offers > 0,
      },
      {
        step: "hired",
        position: "end",
        active: data.hired === true,
      },
    ];

    return (
      <div ref={ref} className={cn("flex items-start", className)}>
        {steps.map((stepData, index) => (
          <ProgressStep
            key={stepData.step}
            step={stepData.step}
            position={stepData.position}
            count={stepData.count}
            active={stepData.active}
            className={index > 0 ? "-ml-2" : ""}
          />
        ))}
      </div>
    );
  }
);
ProgressStepsBar.displayName = "ProgressStepsBar";

export { ProgressStep, ProgressStepsBar, stepColors, stepLabels };
