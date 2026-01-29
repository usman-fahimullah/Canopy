"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Progress component for displaying completion status
 *
 * Uses semantic tokens:
 * - background-muted for track
 * - background-brand for indicator
 * - Status colors for variants
 */

const progressVariants = cva(
  "relative w-full overflow-hidden rounded-full bg-background-muted",
  {
    variants: {
      size: {
        sm: "h-1",
        md: "h-2",
        lg: "h-3",
        xl: "h-4",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const indicatorVariants = cva(
  "h-full w-full flex-1 transition-all duration-300 ease-out",
  {
    variants: {
      variant: {
        default: "bg-foreground-brand",
        success: "bg-background-success-emphasis",
        warning: "bg-background-warning-emphasis",
        error: "bg-background-error-emphasis",
        info: "bg-background-info-emphasis",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants>,
    VariantProps<typeof indicatorVariants> {
  /** Show percentage label */
  showLabel?: boolean;
  /** Custom label format */
  formatLabel?: (value: number) => string;
  /** Indeterminate loading state */
  indeterminate?: boolean;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    {
      className,
      value = 0,
      size,
      variant,
      showLabel = false,
      formatLabel = (v) => `${Math.round(v)}%`,
      indeterminate = false,
      ...props
    },
    ref
  ) => {
    const safeValue = Math.min(100, Math.max(0, value ?? 0));

    return (
      <div className="w-full">
        {showLabel && !indeterminate && (
          <div className="flex justify-between mb-1">
            <span className="text-caption text-foreground-muted">Progress</span>
            <span className="text-caption text-foreground-default">
              {formatLabel(safeValue)}
            </span>
          </div>
        )}
        <ProgressPrimitive.Root
          ref={ref}
          className={cn(progressVariants({ size }), className)}
          value={safeValue}
          {...props}
        >
          <ProgressPrimitive.Indicator
            className={cn(
              indicatorVariants({ variant }),
              indeterminate &&
                "animate-[indeterminate_1.5s_ease-in-out_infinite] w-1/3"
            )}
            style={{
              transform: indeterminate
                ? undefined
                : `translateX(-${100 - safeValue}%)`,
            }}
          />
        </ProgressPrimitive.Root>
      </div>
    );
  }
);

Progress.displayName = ProgressPrimitive.Root.displayName;

// Circular progress variant
interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  size?: "sm" | "md" | "lg";
  strokeWidth?: number;
  showLabel?: boolean;
  variant?: "default" | "success" | "warning" | "error" | "info";
}

const CircularProgress = React.forwardRef<HTMLDivElement, CircularProgressProps>(
  (
    {
      className,
      value = 0,
      size = "md",
      strokeWidth = 4,
      showLabel = false,
      variant = "default",
      ...props
    },
    ref
  ) => {
    const safeValue = Math.min(100, Math.max(0, value));
    const sizes = { sm: 32, md: 48, lg: 64 };
    const dimension = sizes[size];
    const radius = (dimension - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (safeValue / 100) * circumference;

    const strokeColors = {
      default: "stroke-foreground-brand",
      success: "stroke-foreground-success",
      warning: "stroke-foreground-warning",
      error: "stroke-foreground-error",
      info: "stroke-foreground-info",
    };

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
        <svg
          className="transform -rotate-90"
          width={dimension}
          height={dimension}
        >
          {/* Background circle */}
          <circle
            className="stroke-background-muted"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={dimension / 2}
            cy={dimension / 2}
          />
          {/* Progress circle */}
          <circle
            className={cn(
              strokeColors[variant],
              "transition-[stroke-dashoffset] duration-300 ease-out"
            )}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            r={radius}
            cx={dimension / 2}
            cy={dimension / 2}
          />
        </svg>
        {showLabel && (
          <span className="absolute inset-0 flex items-center justify-center text-caption-sm font-medium text-foreground-default">
            {Math.round(safeValue)}%
          </span>
        )}
      </div>
    );
  }
);

CircularProgress.displayName = "CircularProgress";

export { Progress, CircularProgress, progressVariants, indicatorVariants };
