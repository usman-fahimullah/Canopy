import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { CircularProgress } from "@/components/ui/progress";

/**
 * MatchScore component for AI match visualization
 *
 * Uses semantic tokens:
 * - match-high/medium/low for score colors
 * - foreground-muted for labels
 */

const matchScoreVariants = cva("inline-flex items-center gap-2", {
  variants: {
    size: {
      sm: "",
      md: "",
      lg: "",
    },
    layout: {
      inline: "flex-row",
      stacked: "flex-col",
    },
  },
  defaultVariants: {
    size: "md",
    layout: "inline",
  },
});

type ScoreLevel = "high" | "medium" | "low";

function getScoreLevel(score: number): ScoreLevel {
  if (score >= 75) return "high";
  if (score >= 50) return "medium";
  return "low";
}

const scoreColors: Record<ScoreLevel, { bg: string; fg: string; stroke: string }> = {
  high: {
    bg: "bg-[var(--match-high-background)]",
    fg: "text-[var(--match-high-foreground)]",
    stroke: "stroke-[var(--match-high-accent)]",
  },
  medium: {
    bg: "bg-[var(--match-medium-background)]",
    fg: "text-[var(--match-medium-foreground)]",
    stroke: "stroke-[var(--match-medium-accent)]",
  },
  low: {
    bg: "bg-[var(--match-low-background)]",
    fg: "text-[var(--match-low-foreground)]",
    stroke: "stroke-[var(--match-low-accent)]",
  },
};

export interface MatchScoreProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof matchScoreVariants> {
  /** Score value (0-100) */
  score: number;
  /** Show percentage label */
  showLabel?: boolean;
  /** Custom label text */
  label?: string;
  /** Show match level text (High, Medium, Low) */
  showLevel?: boolean;
}

const MatchScore = React.forwardRef<HTMLDivElement, MatchScoreProps>(
  (
    {
      className,
      size,
      layout,
      score,
      showLabel = true,
      label,
      showLevel = false,
      ...props
    },
    ref
  ) => {
    const safeScore = Math.min(100, Math.max(0, score));
    const level = getScoreLevel(safeScore);
    const colors = scoreColors[level];
    const [displayedScore, setDisplayedScore] = React.useState(0);
    const [isHovered, setIsHovered] = React.useState(false);

    // Animated counter effect
    React.useEffect(() => {
      const duration = 800;
      const steps = 30;
      const increment = safeScore / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= safeScore) {
          setDisplayedScore(safeScore);
          clearInterval(timer);
        } else {
          setDisplayedScore(Math.round(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }, [safeScore]);

    const sizeMap = {
      sm: 32,
      md: 48,
      lg: 64,
    };

    const strokeWidthMap = {
      sm: 3,
      md: 4,
      lg: 5,
    };

    const dimension = sizeMap[size || "md"];
    const strokeWidth = strokeWidthMap[size || "md"];
    const radius = (dimension - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (safeScore / 100) * circumference;

    return (
      <div
        ref={ref}
        className={cn(
          matchScoreVariants({ size, layout }),
          "transition-transform duration-fast",
          "hover:scale-105",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        <div
          className="relative inline-flex transition-all duration-fast"
          style={{ width: dimension, height: dimension }}
        >
          <svg
            className={cn(
              "transform -rotate-90 transition-transform duration-fast",
              isHovered && "scale-105"
            )}
            width={dimension}
            height={dimension}
          >
            {/* Background circle */}
            <circle
              className="stroke-background-muted transition-colors duration-fast"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={radius}
              cx={dimension / 2}
              cy={dimension / 2}
            />
            {/* Progress circle with animation */}
            <circle
              className={cn(
                colors.stroke,
                "transition-all duration-700 ease-out",
                isHovered && "filter drop-shadow-sm"
              )}
              fill="transparent"
              strokeWidth={isHovered ? strokeWidth + 1 : strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              r={radius}
              cx={dimension / 2}
              cy={dimension / 2}
            />
          </svg>
          {showLabel && (
            <span
              className={cn(
                "absolute inset-0 flex items-center justify-center font-medium tabular-nums",
                "transition-all duration-fast",
                colors.fg,
                size === "sm" && "text-caption-sm",
                size === "md" && "text-caption",
                size === "lg" && "text-body-sm",
                isHovered && "scale-110"
              )}
            >
              {Math.round(displayedScore)}%
            </span>
          )}
        </div>

        {(label || showLevel) && (
          <div className="flex flex-col transition-opacity duration-fast">
            {showLevel && (
              <span
                className={cn(
                  "text-caption font-medium capitalize transition-colors duration-fast",
                  colors.fg
                )}
              >
                {level} Match
              </span>
            )}
            {label && (
              <span className="text-caption-sm text-foreground-muted transition-colors duration-fast">
                {label}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

MatchScore.displayName = "MatchScore";

// Compact match score badge
export interface MatchScoreBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  score: number;
}

const MatchScoreBadge = React.forwardRef<HTMLSpanElement, MatchScoreBadgeProps>(
  ({ className, score, ...props }, ref) => {
    const safeScore = Math.min(100, Math.max(0, score));
    const level = getScoreLevel(safeScore);
    const colors = scoreColors[level];

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full",
          "text-caption-sm font-medium tabular-nums",
          "transition-all duration-fast",
          "hover:scale-105 hover:shadow-sm",
          "animate-scale-in",
          colors.bg,
          colors.fg,
          className
        )}
        {...props}
      >
        {Math.round(safeScore)}% match
      </span>
    );
  }
);

MatchScoreBadge.displayName = "MatchScoreBadge";

// Match score breakdown
export interface MatchScoreBreakdownProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Overall score */
  score: number;
  /** Breakdown items */
  breakdown: Array<{
    label: string;
    score: number;
    weight?: number;
  }>;
}

const MatchScoreBreakdown = React.forwardRef<
  HTMLDivElement,
  MatchScoreBreakdownProps
>(({ className, score, breakdown, ...props }, ref) => {
  const [animatedWidths, setAnimatedWidths] = React.useState<number[]>(
    breakdown.map(() => 0)
  );

  // Staggered animation for progress bars
  React.useEffect(() => {
    breakdown.forEach((item, index) => {
      setTimeout(() => {
        setAnimatedWidths((prev) => {
          const newWidths = [...prev];
          newWidths[index] = item.score;
          return newWidths;
        });
      }, 300 + index * 150);
    });
  }, [breakdown]);

  return (
    <div
      ref={ref}
      className={cn("space-y-4 animate-fade-in", className)}
      {...props}
    >
      <div className="flex items-center gap-4">
        <MatchScore score={score} size="lg" />
        <div>
          <p className="text-heading-sm font-medium text-foreground-default">
            {Math.round(score)}% Match
          </p>
          <p className="text-caption text-foreground-muted">
            Based on {breakdown.length} criteria
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {breakdown.map((item, index) => {
          const level = getScoreLevel(item.score);
          const colors = scoreColors[level];

          return (
            <div
              key={index}
              className="group space-y-1 animate-fade-in cursor-default"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-between text-caption">
                <span className="text-foreground-default transition-colors duration-fast group-hover:text-foreground-brand">
                  {item.label}
                </span>
                <span className={cn(colors.fg, "tabular-nums transition-all duration-fast group-hover:scale-110")}>
                  {Math.round(item.score)}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-background-muted overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700 ease-out",
                    "group-hover:brightness-110",
                    colors.bg.replace("background", "accent")
                  )}
                  style={{ width: `${animatedWidths[index]}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

MatchScoreBreakdown.displayName = "MatchScoreBreakdown";

export { MatchScore, MatchScoreBadge, MatchScoreBreakdown, matchScoreVariants };
