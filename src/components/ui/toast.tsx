"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { CheckCircle, Warning, Info, X } from "@phosphor-icons/react";

/**
 * Toast component - Refreshed UI
 *
 * A compact notification pill for brief feedback messages.
 * Appears temporarily to communicate status or results of actions.
 *
 * Design improvements:
 * - Uses component-level design tokens for consistent theming
 * - Improved spacing and proportions
 * - Optional dismiss button
 * - Better shadow and visual depth
 * - Smooth animations with motion tokens
 * - Enhanced accessibility with proper ARIA
 * - Max-width constraint for readability
 *
 * Variants:
 * - success: Confirmations, completions (green)
 * - informational: Neutral information (dark gray)
 * - warning: Caution, attention needed (orange)
 * - critical: Errors, failures (red)
 */

export type ToastVariant = "success" | "info" | "warning" | "critical";

// Configuration for each toast variant
const toastConfig: Record<
  ToastVariant,
  {
    icon: React.ElementType | null;
    ariaLive: "polite" | "assertive";
  }
> = {
  success: {
    icon: CheckCircle,
    ariaLive: "polite",
  },
  info: {
    icon: Info,
    ariaLive: "polite",
  },
  warning: {
    icon: Warning,
    ariaLive: "polite",
  },
  critical: {
    icon: Warning,
    ariaLive: "assertive",
  },
};

const toastVariants = cva(
  [
    // Layout
    "inline-flex items-center gap-2",
    "px-4 py-3",
    "max-w-sm",
    // Shape
    "rounded-lg",
    // Shadow
    "shadow-[var(--toast-shadow)]",
    // Typography
    "text-sm font-medium leading-5",
    // Animation
    "transition-all duration-[var(--duration-normal)] ease-[var(--ease-out)]",
    // Animation on mount
    "animate-in fade-in slide-in-from-bottom-2 duration-200",
  ],
  {
    variants: {
      variant: {
        success: [
          "bg-[var(--toast-success-background)]",
          "text-[var(--toast-success-foreground)]",
        ],
        info: [
          "bg-[var(--toast-info-background)]",
          "text-[var(--toast-info-foreground)]",
        ],
        warning: [
          "bg-[var(--toast-warning-background)]",
          "text-[var(--toast-warning-foreground)]",
        ],
        critical: [
          "bg-[var(--toast-critical-background)]",
          "text-[var(--toast-critical-foreground)]",
        ],
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

// Icon color classes mapped to variants
const iconColorClasses: Record<ToastVariant, string> = {
  success: "text-[var(--toast-success-icon)]",
  info: "text-[var(--toast-info-icon)]",
  warning: "text-[var(--toast-warning-icon)]",
  critical: "text-[var(--toast-critical-icon)]",
};

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  /** Toast message content */
  children: React.ReactNode;
  /** Override the default icon for the variant */
  icon?: React.ReactNode;
  /** Hide the icon completely */
  hideIcon?: boolean;
  /** Whether the toast can be dismissed */
  dismissible?: boolean;
  /** Called when the toast is dismissed */
  onDismiss?: () => void;
  /** Action button text */
  actionLabel?: string;
  /** Action button click handler */
  onAction?: () => void;
  /** Auto-dismiss after duration (in ms). Default: undefined (no auto-dismiss) */
  autoDismiss?: number;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      className,
      variant = "info",
      children,
      icon,
      hideIcon = false,
      dismissible = false,
      onDismiss,
      actionLabel,
      onAction,
      autoDismiss,
      ...props
    },
    ref
  ) => {
    const variantKey = variant || "info";
    const config = toastConfig[variantKey];
    const IconComponent = config.icon;
    const [isVisible, setIsVisible] = React.useState(true);
    const [isExiting, setIsExiting] = React.useState(false);

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

      const timer = setTimeout(() => {
        handleDismiss();
      }, autoDismiss);

      return () => clearTimeout(timer);
    }, [autoDismiss, handleDismiss]);

    // Determine which icon to show based on variant
    const getDisplayIcon = () => {
      if (hideIcon) return null;
      if (icon !== undefined) return icon;
      if (!IconComponent) return null;

      return (
        <IconComponent
          weight="fill"
          size={18}
          className={iconColorClasses[variantKey]}
          aria-hidden="true"
        />
      );
    };

    const displayIcon = getDisplayIcon();

    if (!isVisible) return null;

    return (
      <div
        ref={ref}
        role="alert"
        aria-live={config.ariaLive}
        data-status={variant}
        className={cn(
          toastVariants({ variant }),
          isExiting && "animate-out fade-out slide-out-to-bottom-2 duration-200",
          className
        )}
        {...props}
      >
        {/* Icon */}
        {displayIcon && (
          <span className="flex items-center justify-center shrink-0">
            {displayIcon}
          </span>
        )}

        {/* Content */}
        <span className="flex-1 min-w-0 leading-5">{children}</span>

        {/* Action */}
        {actionLabel && (
          <button
            type="button"
            onClick={onAction}
            className={cn(
              "shrink-0 text-sm font-semibold",
              "hover:underline underline-offset-2",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded",
              "transition-colors duration-[var(--duration-fast)]"
            )}
          >
            {actionLabel}
          </button>
        )}

        {/* Dismiss button */}
        {dismissible && (
          <button
            type="button"
            onClick={handleDismiss}
            className={cn(
              "shrink-0 p-1 rounded",
              "bg-[var(--toast-dismiss-background)]",
              "hover:bg-[var(--toast-dismiss-background-hover)]",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
              "transition-colors duration-[var(--duration-fast)]",
              "opacity-80 hover:opacity-100"
            )}
            aria-label="Dismiss toast"
          >
            <X size={14} weight="bold" aria-hidden="true" />
          </button>
        )}
      </div>
    );
  }
);

Toast.displayName = "Toast";

export { Toast, toastVariants, toastConfig };
