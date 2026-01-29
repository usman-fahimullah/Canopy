import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Skeleton component for loading placeholders
 *
 * Uses semantic tokens:
 * - background-muted for the base color
 * - Animated shimmer effect
 */

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Shape variant */
  variant?: "default" | "circular" | "text";
  /** Animation style */
  animation?: "pulse" | "shimmer" | "none";
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "default", animation = "pulse", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-background-muted",
          // Shape variants
          variant === "default" && "rounded-md",
          variant === "circular" && "rounded-full",
          variant === "text" && "rounded h-4 w-full",
          // Animation variants
          animation === "pulse" && "animate-pulse",
          animation === "shimmer" &&
            "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-background-subtle/60 before:to-transparent",
          className
        )}
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";

// Preset skeleton components for common use cases
const SkeletonText = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { lines?: number }
>(({ className, lines = 3, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-2", className)} {...props}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        className={cn(
          "h-4",
          i === lines - 1 && "w-3/4" // Last line shorter
        )}
      />
    ))}
  </div>
));

SkeletonText.displayName = "SkeletonText";

const SkeletonAvatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { size?: "sm" | "md" | "lg" }
>(({ className, size = "md", ...props }, ref) => (
  <Skeleton
    ref={ref}
    variant="circular"
    className={cn(
      size === "sm" && "h-8 w-8",
      size === "md" && "h-10 w-10",
      size === "lg" && "h-12 w-12",
      className
    )}
    {...props}
  />
));

SkeletonAvatar.displayName = "SkeletonAvatar";

const SkeletonCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-card border border-border-default p-4 space-y-4",
      className
    )}
    {...props}
  >
    <div className="flex items-center gap-3">
      <SkeletonAvatar />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
    <SkeletonText lines={2} />
  </div>
));

SkeletonCard.displayName = "SkeletonCard";

const SkeletonTable = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { rows?: number; columns?: number }
>(({ className, rows = 5, columns = 4, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-2", className)} {...props}>
    {/* Header */}
    <div className="flex gap-4 pb-2 border-b border-border-default">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex gap-4 py-2">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={colIndex} className="h-4 flex-1" />
        ))}
      </div>
    ))}
  </div>
));

SkeletonTable.displayName = "SkeletonTable";

export { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard, SkeletonTable };
