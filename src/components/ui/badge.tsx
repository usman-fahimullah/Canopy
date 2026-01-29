import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Badge component based on Trails Design System
 *
 * Figma Specs:
 * - Critical: bg #FFEBF4 (red-100), text #E90000 (red-600), icon: AlertTriangle
 * - Warning: bg #FFEDE0 (orange-100), text #F5580A (orange-500), icon: Diamond
 * - Success: bg #DCFAC8 (primary-200), text #3BA36F (primary-600), icon: CheckCircle
 * - Neutral: bg #F2EDE9 (neutral-200), text #1F1D1C (neutral-800), icon: Info
 * - Feature: bg #E5F1FF (blue-100), text #3369FF (blue-500), icon: Flag
 *
 * All badges: rounded-full, px-3, py-1.5, gap-1, text-caption (14px)
 */

const badgeVariants = cva(
  [
    "inline-flex items-center justify-center gap-1",
    "rounded-full font-medium",
    "transition-colors duration-150",
  ],
  {
    variants: {
      variant: {
        // Critical - Red (uses semantic badge tokens)
        critical: "bg-[var(--badge-error-background)] text-[var(--badge-error-foreground)]",
        // Warning - Orange (uses semantic badge tokens)
        warning: "bg-[var(--badge-warning-background)] text-[var(--badge-warning-foreground)]",
        // Success - Green (uses semantic badge tokens)
        success: "bg-[var(--badge-success-background)] text-[var(--badge-success-foreground)]",
        // Neutral - Gray (uses semantic tokens)
        neutral: "bg-[var(--badge-neutral-background)] text-[var(--badge-neutral-foreground)]",
        // Feature - Blue (Figma: bg #e5f1ff, text #3369ff, 14px bold font, 14px rounded)
        feature: "bg-[var(--badge-info-background)] text-[var(--badge-info-foreground)] font-bold",
        // Legacy variants for backwards compatibility
        default: "bg-[var(--badge-primary-background)] text-[var(--badge-primary-foreground)]",
        secondary: "bg-background-subtle text-foreground-muted",
        error: "bg-[var(--badge-error-background)] text-[var(--badge-error-foreground)]",
        info: "bg-[var(--badge-info-background)] text-[var(--badge-info-foreground)]",
        outline: "border border-border bg-surface text-foreground-muted",
        "outline-primary": "border border-[var(--border-brand)] bg-surface text-[var(--foreground-brand)]",
        "outline-error": "border border-[var(--border-error)] bg-surface text-[var(--foreground-error)]",
        "outline-info": "border border-[var(--badge-info-border)] bg-surface text-[var(--badge-info-foreground)]",
      },
      size: {
        sm: "h-6 px-2 text-caption-sm",
        default: "h-7 px-3 text-caption",
        lg: "h-8 px-4 text-body-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Optional icon to display before text */
  icon?: React.ReactNode;
  /** Optional dot indicator before text (legacy) */
  dot?: boolean;
  /** Dot color - only shown if dot is true (legacy) */
  dotColor?: string;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, icon, dot, dotColor, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      >
        {icon && (
          <span className="flex items-center justify-center w-4 h-4" aria-hidden="true">
            {icon}
          </span>
        )}
        {dot && !icon && (
          <span
            className="mr-1 h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor:
                dotColor || (variant === "error" || variant === "critical" ? "var(--primitive-red-600)" : "var(--primitive-green-600)"),
            }}
            aria-hidden="true"
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
