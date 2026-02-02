"use client";

import { cn } from "@/lib/utils";
import { TrendUp, TrendDown } from "@phosphor-icons/react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  icon?: React.ReactNode;
  variant?: "default" | "highlight";
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  variant = "default",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-card p-5 transition-all",
        // White card = shadow, no border
        variant === "default" && "bg-[var(--card-background)] shadow-card hover:shadow-card-hover",
        // Colored card (Blue 200) = no shadow, no border
        variant === "highlight" && "bg-[var(--primitive-blue-200)]",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-caption-strong text-foreground-muted">{title}</p>
          <p className="mt-1 text-heading-md text-foreground-default">{value}</p>
          {subtitle && (
            <p className="mt-1 text-caption text-foreground-muted">{subtitle}</p>
          )}
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              {trend.isPositive !== false ? (
                <TrendUp size={14} className="text-[var(--primitive-green-600)]" weight="bold" />
              ) : (
                <TrendDown size={14} className="text-[var(--primitive-red-600)]" weight="bold" />
              )}
              <span
                className={cn(
                  "text-caption font-medium",
                  trend.isPositive !== false ? "text-[var(--primitive-green-600)]" : "text-[var(--primitive-red-600)]"
                )}
              >
                {trend.value > 0 && "+"}
                {trend.value}%
              </span>
              <span className="text-caption text-foreground-muted">{trend.label}</span>
            </div>
          )}
        </div>
        {icon && (
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              variant === "default" && "bg-[var(--primitive-blue-200)] text-[var(--primitive-green-800)]",
              variant === "highlight" && "bg-white/50 text-[var(--primitive-green-800)]"
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
