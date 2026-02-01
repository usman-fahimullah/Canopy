"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Flag, Warning, WarningDiamond, CheckCircle, Info, X } from "@phosphor-icons/react";
import { Button } from "./button";

/**
 * Alert component - Refreshed UI
 *
 * A horizontal alert bar with a left border accent for displaying
 * important messages, notifications, or status updates.
 *
 * Design improvements:
 * - Uses component-level design tokens for consistent theming
 * - Improved spacing and proportions
 * - Better visual hierarchy
 * - Smooth animations with motion tokens
 * - Enhanced accessibility
 * - Optional auto-dismiss with progress indicator
 *
 * Variants:
 * - feature: Promotional/new features (blue)
 * - critical: Errors, failures (red)
 * - warning: Caution, attention needed (orange)
 * - success: Confirmations, completions (green)
 * - info: Neutral information (gray)
 */

export type AlertType = "critical" | "warning" | "success" | "info" | "feature";

// Configuration for each alert variant
const alertConfig: Record<
  AlertType,
  {
    icon: React.ElementType;
    ariaLive: "polite" | "assertive";
  }
> = {
  feature: {
    icon: Flag,
    ariaLive: "polite",
  },
  critical: {
    icon: Warning,
    ariaLive: "assertive",
  },
  warning: {
    icon: WarningDiamond,
    ariaLive: "polite",
  },
  success: {
    icon: CheckCircle,
    ariaLive: "polite",
  },
  info: {
    icon: Info,
    ariaLive: "polite",
  },
};

const alertVariants = cva(
  [
    // Layout
    "relative flex items-center gap-3",
    "w-full px-4 py-3",
    // Shape
    "rounded-lg",
    "border-l-[3px]",
    // Animation
    "transition-all duration-[var(--duration-normal)] ease-[var(--ease-out)]",
    // Animation on mount
    "animate-in fade-in slide-in-from-top-1 duration-200",
  ],
  {
    variants: {
      variant: {
        feature: [
          "bg-[var(--alert-feature-background)]",
          "border-l-[var(--alert-feature-border)]",
          "text-[var(--alert-feature-foreground)]",
        ],
        critical: [
          "bg-[var(--alert-critical-background)]",
          "border-l-[var(--alert-critical-border)]",
          "text-[var(--alert-critical-foreground)]",
        ],
        warning: [
          "bg-[var(--alert-warning-background)]",
          "border-l-[var(--alert-warning-border)]",
          "text-[var(--alert-warning-foreground)]",
        ],
        success: [
          "bg-[var(--alert-success-background)]",
          "border-l-[var(--alert-success-border)]",
          "text-[var(--alert-success-foreground)]",
        ],
        info: [
          "bg-[var(--alert-info-background)]",
          "border-l-[var(--alert-info-border)]",
          "text-[var(--alert-info-foreground)]",
        ],
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

// Icon color classes mapped to variants
const iconColorClasses: Record<AlertType, string> = {
  feature: "text-[var(--alert-feature-icon)]",
  critical: "text-[var(--alert-critical-icon)]",
  warning: "text-[var(--alert-warning-icon)]",
  success: "text-[var(--alert-success-icon)]",
  info: "text-[var(--alert-info-icon)]",
};

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">, VariantProps<typeof alertVariants> {
  /** The type/severity of the alert */
  variant?: AlertType;
  /** Message text (required) */
  children: React.ReactNode;
  /** Optional title for the alert */
  title?: React.ReactNode;
  /** Custom icon to override the default */
  icon?: React.ReactNode;
  /** Hide the icon */
  hideIcon?: boolean;
  /** Action button text */
  actionLabel?: string;
  /** Action button click handler */
  onAction?: () => void;
  /** Whether the alert can be dismissed */
  dismissible?: boolean;
  /** Called when the alert is dismissed */
  onDismiss?: () => void;
  /** Custom action element (overrides actionLabel) */
  action?: React.ReactNode;
  /** Auto-dismiss after duration (in ms) */
  autoDismiss?: number;
  /** Show progress bar for auto-dismiss */
  showProgress?: boolean;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = "info",
      children,
      title,
      icon,
      hideIcon = false,
      actionLabel,
      onAction,
      dismissible = true,
      onDismiss,
      action,
      autoDismiss,
      showProgress = false,
      ...props
    },
    ref
  ) => {
    const config = alertConfig[variant];
    const IconComponent = config.icon;
    const [isVisible, setIsVisible] = React.useState(true);
    const [isExiting, setIsExiting] = React.useState(false);
    const [progress, setProgress] = React.useState(100);

    const handleDismiss = React.useCallback(() => {
      setIsExiting(true);
      // Wait for exit animation to complete before removing from DOM
      setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, 200); // Match animation duration
    }, [onDismiss]);

    // Auto-dismiss timer
    React.useEffect(() => {
      if (!autoDismiss) return;

      const startTime = Date.now();
      const endTime = startTime + autoDismiss;

      const updateProgress = () => {
        const now = Date.now();
        const remaining = Math.max(0, endTime - now);
        const percent = (remaining / autoDismiss) * 100;
        setProgress(percent);

        if (remaining > 0) {
          requestAnimationFrame(updateProgress);
        }
      };

      if (showProgress) {
        requestAnimationFrame(updateProgress);
      }

      const timer = setTimeout(() => {
        handleDismiss();
      }, autoDismiss);

      return () => clearTimeout(timer);
    }, [autoDismiss, showProgress, handleDismiss]);

    if (!isVisible) return null;

    return (
      <div
        ref={ref}
        role="alert"
        aria-live={config.ariaLive}
        className={cn(
          alertVariants({ variant }),
          isExiting && "animate-out fade-out slide-out-to-top-1 duration-200",
          className
        )}
        {...props}
      >
        {/* Progress bar for auto-dismiss */}
        {autoDismiss && showProgress && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden rounded-b-lg">
            <div
              className="h-full bg-current opacity-30 transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Icon */}
        {!hideIcon && (
          <div className="flex shrink-0 items-center justify-center">
            {icon || (
              <IconComponent
                weight="fill"
                size={20}
                className={iconColorClasses[variant]}
                aria-hidden="true"
              />
            )}
          </div>
        )}

        {/* Content */}
        <div className="min-w-0 flex-1">
          {title && <div className="mb-0.5 text-[0.9375rem] font-semibold leading-5">{title}</div>}
          <div className="text-[0.9375rem] leading-5">{children}</div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2">
          {/* Action Button */}
          {(action || actionLabel) && (
            <>
              {action || (
                <Button variant="ghost" size="sm" onClick={onAction} className="font-medium">
                  {actionLabel}
                </Button>
              )}
            </>
          )}

          {/* Dismiss button */}
          {dismissible && (
            <button
              type="button"
              onClick={handleDismiss}
              className={cn(
                "shrink-0 rounded-md p-1.5",
                "bg-[var(--alert-dismiss-background)]",
                "hover:bg-[var(--alert-dismiss-background-hover)]",
                "active:bg-[var(--alert-dismiss-background-active)]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-1",
                "transition-colors duration-[var(--duration-fast)]",
                "opacity-70 hover:opacity-100"
              )}
              aria-label="Dismiss alert"
            >
              <X size={16} weight="bold" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

Alert.displayName = "Alert";

// Sub-components for compound usage pattern
const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn("text-[0.9375rem] font-semibold leading-5", className)}
      {...props}
    />
  )
);

AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("mt-1 text-[0.9375rem] leading-5", className)} {...props} />
));

AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription, alertVariants, alertConfig };
