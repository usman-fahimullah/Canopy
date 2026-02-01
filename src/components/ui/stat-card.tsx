import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { TrendUp, TrendDown, Minus, ArrowRight } from "@phosphor-icons/react";

/**
 * StatCard component for dashboard metrics
 *
 * Uses semantic tokens:
 * - card-background for surface
 * - foreground-muted for labels
 * - foreground-success/error for trends
 */

const statCardVariants = cva(
  "rounded-card border border-border-default bg-surface-default p-4 transition-shadow hover:shadow-card",
  {
    variants: {
      size: {
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

type TrendDirection = "up" | "down" | "neutral";

function getTrendColor(direction: TrendDirection, positive: boolean) {
  if (direction === "neutral") return "text-foreground-muted";
  if (direction === "up") {
    return positive ? "text-foreground-success" : "text-foreground-error";
  }
  return positive ? "text-foreground-error" : "text-foreground-success";
}

function getTrendIcon(direction: TrendDirection) {
  if (direction === "up") return TrendUp;
  if (direction === "down") return TrendDown;
  return Minus;
}

export interface StatCardProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof statCardVariants> {
  /** Stat label */
  label: string;
  /** Main value */
  value: string | number;
  /** Previous value for comparison */
  previousValue?: string | number;
  /** Trend percentage */
  trend?: number;
  /** Whether up trend is positive (default true) */
  trendPositive?: boolean;
  /** Trend period label */
  trendLabel?: string;
  /** Optional icon */
  icon?: React.ReactNode;
  /** Action link */
  action?: {
    label: string;
    onClick: () => void;
  };
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      className,
      size,
      label,
      value,
      previousValue,
      trend,
      trendPositive = true,
      trendLabel = "vs last period",
      icon,
      action,
      ...props
    },
    ref
  ) => {
    const trendDirection: TrendDirection =
      trend === undefined || trend === 0 ? "neutral" : trend > 0 ? "up" : "down";
    const TrendIcon = getTrendIcon(trendDirection);
    const trendColor = getTrendColor(trendDirection, trendPositive);

    return (
      <div ref={ref} className={cn(statCardVariants({ size }), className)} {...props}>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-caption text-foreground-muted">{label}</p>
            <p
              className={cn(
                "text-foreground-default font-semibold",
                size === "sm" && "text-heading-sm",
                size === "md" && "text-heading-md",
                size === "lg" && "text-heading-lg"
              )}
            >
              {value}
            </p>
          </div>
          {icon && <div className="rounded-lg bg-background-muted p-2">{icon}</div>}
        </div>

        {(trend !== undefined || previousValue !== undefined || action) && (
          <div className="mt-3 flex items-center justify-between">
            {(trend !== undefined || previousValue !== undefined) && (
              <div className="flex items-center gap-2">
                {trend !== undefined && (
                  <div className={cn("flex items-center gap-1", trendColor)}>
                    <TrendIcon className="h-4 w-4" />
                    <span className="text-caption font-medium">
                      {trend > 0 ? "+" : ""}
                      {trend}%
                    </span>
                  </div>
                )}
                <span className="text-caption-sm text-foreground-subtle">{trendLabel}</span>
              </div>
            )}
            {action && (
              <button
                type="button"
                onClick={action.onClick}
                className="inline-flex items-center gap-1 text-caption text-foreground-link transition-colors hover:text-foreground-link-hover"
              >
                {action.label}
                <ArrowRight className="h-3 w-3" />
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
);

StatCard.displayName = "StatCard";

// Stat card group for dashboard layouts
interface StatCardGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 3 | 4;
}

const StatCardGroup = React.forwardRef<HTMLDivElement, StatCardGroupProps>(
  ({ className, columns = 4, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "grid gap-4",
        columns === 2 && "grid-cols-1 sm:grid-cols-2",
        columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

StatCardGroup.displayName = "StatCardGroup";

// Mini stat for inline display
interface MiniStatProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  trend?: number;
  trendPositive?: boolean;
}

const MiniStat = React.forwardRef<HTMLDivElement, MiniStatProps>(
  ({ className, label, value, trend, trendPositive = true, ...props }, ref) => {
    const trendDirection: TrendDirection =
      trend === undefined || trend === 0 ? "neutral" : trend > 0 ? "up" : "down";
    const trendColor = getTrendColor(trendDirection, trendPositive);

    return (
      <div ref={ref} className={cn("inline-flex items-center gap-3", className)} {...props}>
        <div>
          <p className="text-caption-sm text-foreground-muted">{label}</p>
          <p className="text-foreground-default text-body-sm font-semibold">{value}</p>
        </div>
        {trend !== undefined && (
          <span className={cn("text-caption font-medium", trendColor)}>
            {trend > 0 ? "+" : ""}
            {trend}%
          </span>
        )}
      </div>
    );
  }
);

MiniStat.displayName = "MiniStat";

export { StatCard, StatCardGroup, MiniStat, statCardVariants };
