"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  Flag,
  Warning,
  WarningDiamond,
  CheckCircle,
  Info,
  X,
  ArrowRight,
} from "@phosphor-icons/react";
import { Button, type ButtonProps } from "./button";

/**
 * Banner component - Refreshed UI
 *
 * A full-width notification banner for displaying important messages,
 * alerts, or promotional content. More prominent than Alert.
 *
 * Design improvements:
 * - Uses component-level design tokens for consistent theming
 * - Improved visual hierarchy with title/description
 * - Better spacing and alignment
 * - Smooth animations with motion tokens
 * - Enhanced accessibility
 * - Optional link style action
 * - Subtle variant for less visual intensity
 *
 * Types:
 * - feature: Promotional/new features (blue)
 * - critical: Errors, failures (red)
 * - warning: Caution, attention needed (orange)
 * - success: Confirmations, completions (green)
 * - info: Neutral information (gray)
 *
 * Styles:
 * - default (bold): Solid backgrounds with white text - high visibility
 * - subtle: Tinted backgrounds with dark text - less intense
 */

export type BannerType = "critical" | "warning" | "success" | "info" | "feature";

// Configuration for each banner variant
const bannerConfig: Record<
  BannerType,
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

// Bold banner variants (default) - solid backgrounds with white text
const bannerVariants = cva(
  [
    // Layout - centered alignment for better single-line appearance
    "relative flex items-center gap-3",
    "w-full px-4 py-2.5",
    // Shape
    "rounded-lg",
    // Animation
    "transition-all duration-[var(--duration-normal)] ease-[var(--ease-out)]",
    // Animation on mount
    "animate-in fade-in slide-in-from-top-2 duration-200",
  ],
  {
    variants: {
      type: {
        feature: [
          "bg-[var(--banner-feature-background)]",
          "text-[var(--banner-feature-foreground)]",
        ],
        critical: [
          "bg-[var(--banner-critical-background)]",
          "text-[var(--banner-critical-foreground)]",
        ],
        warning: [
          "bg-[var(--banner-warning-background)]",
          "text-[var(--banner-warning-foreground)]",
        ],
        success: [
          "bg-[var(--banner-success-background)]",
          "text-[var(--banner-success-foreground)]",
        ],
        info: [
          "bg-[var(--banner-info-background)]",
          "text-[var(--banner-info-foreground)]",
        ],
      },
    },
    defaultVariants: {
      type: "info",
    },
  }
);

// Subtle banner variants - tinted backgrounds with dark text
const bannerSubtleVariants = cva(
  [
    // Layout - centered alignment for better single-line appearance
    "relative flex items-center gap-3",
    "w-full px-4 py-2.5",
    // Shape
    "rounded-lg",
    // Animation
    "transition-all duration-[var(--duration-normal)] ease-[var(--ease-out)]",
    // Animation on mount
    "animate-in fade-in slide-in-from-top-2 duration-200",
  ],
  {
    variants: {
      type: {
        feature: [
          "bg-[var(--banner-subtle-feature-background)]",
          "text-[var(--banner-subtle-feature-foreground)]",
        ],
        critical: [
          "bg-[var(--banner-subtle-critical-background)]",
          "text-[var(--banner-subtle-critical-foreground)]",
        ],
        warning: [
          "bg-[var(--banner-subtle-warning-background)]",
          "text-[var(--banner-subtle-warning-foreground)]",
        ],
        success: [
          "bg-[var(--banner-subtle-success-background)]",
          "text-[var(--banner-subtle-success-foreground)]",
        ],
        info: [
          "bg-[var(--banner-subtle-info-background)]",
          "text-[var(--banner-subtle-info-foreground)]",
        ],
      },
    },
    defaultVariants: {
      type: "info",
    },
  }
);

// Icon color classes mapped to variants (bold style)
const iconColorClasses: Record<BannerType, string> = {
  feature: "text-[var(--banner-feature-icon)]",
  critical: "text-[var(--banner-critical-icon)]",
  warning: "text-[var(--banner-warning-icon)]",
  success: "text-[var(--banner-success-icon)]",
  info: "text-[var(--banner-info-icon)]",
};

// Icon color classes mapped to variants (subtle style)
const iconColorClassesSubtle: Record<BannerType, string> = {
  feature: "text-[var(--banner-subtle-feature-icon)]",
  critical: "text-[var(--banner-subtle-critical-icon)]",
  warning: "text-[var(--banner-subtle-warning-icon)]",
  success: "text-[var(--banner-subtle-success-icon)]",
  info: "text-[var(--banner-subtle-info-icon)]",
};

// Themed action button classes (bold style)
const themedActionButtonClasses: Record<BannerType, string> = {
  feature: "bg-[var(--banner-feature-action-background)] hover:bg-[var(--banner-feature-action-background-hover)] text-[var(--banner-feature-action-foreground)]",
  critical: "bg-[var(--banner-critical-action-background)] hover:bg-[var(--banner-critical-action-background-hover)] text-[var(--banner-critical-action-foreground)]",
  warning: "bg-[var(--banner-warning-action-background)] hover:bg-[var(--banner-warning-action-background-hover)] text-[var(--banner-warning-action-foreground)]",
  success: "bg-[var(--banner-success-action-background)] hover:bg-[var(--banner-success-action-background-hover)] text-[var(--banner-success-action-foreground)]",
  info: "bg-[var(--banner-info-action-background)] hover:bg-[var(--banner-info-action-background-hover)] text-[var(--banner-info-action-foreground)]",
};

// Themed action button classes (subtle style)
const themedActionButtonClassesSubtle: Record<BannerType, string> = {
  feature: "bg-[var(--banner-subtle-feature-action-background)] hover:bg-[var(--banner-subtle-feature-action-background-hover)] text-[var(--banner-subtle-feature-action-foreground)]",
  critical: "bg-[var(--banner-subtle-critical-action-background)] hover:bg-[var(--banner-subtle-critical-action-background-hover)] text-[var(--banner-subtle-critical-action-foreground)]",
  warning: "bg-[var(--banner-subtle-warning-action-background)] hover:bg-[var(--banner-subtle-warning-action-background-hover)] text-[var(--banner-subtle-warning-action-foreground)]",
  success: "bg-[var(--banner-subtle-success-action-background)] hover:bg-[var(--banner-subtle-success-action-background-hover)] text-[var(--banner-subtle-success-action-foreground)]",
  info: "bg-[var(--banner-subtle-info-action-background)] hover:bg-[var(--banner-subtle-info-action-background-hover)] text-[var(--banner-subtle-info-action-foreground)]",
};

/** Props for the action button, excluding onClick which is handled by onAction */
export type BannerActionButtonProps = Omit<ButtonProps, "onClick" | "children">;

export interface BannerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof bannerVariants> {
  /** The type/severity of the banner */
  type?: BannerType;
  /** Main title text (required) */
  title: React.ReactNode;
  /** Optional description text below title */
  description?: React.ReactNode;
  /** Custom icon to override the default */
  icon?: React.ReactNode;
  /** Hide the icon */
  hideIcon?: boolean;
  /** Action button text */
  actionLabel?: string;
  /** Action button click handler */
  onAction?: () => void;
  /** Additional props to pass to the action button (variant, size, leftIcon, rightIcon, etc.) */
  actionButtonProps?: BannerActionButtonProps;
  /** Whether the banner can be dismissed */
  dismissible?: boolean;
  /** Called when the banner is dismissed */
  onDismiss?: () => void;
  /** Custom action element (overrides actionLabel and actionButtonProps) */
  action?: React.ReactNode;
  /** Show action as a link with arrow instead of button */
  linkStyle?: boolean;
  /** Full-width mode (no border radius, for page-top banners) */
  fullWidth?: boolean;
  /** Use subtle styling (tinted background with dark text) instead of bold solid colors */
  subtle?: boolean;
}

const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  (
    {
      className,
      type = "info",
      title,
      description,
      icon,
      hideIcon = false,
      actionLabel,
      onAction,
      actionButtonProps,
      dismissible = true,
      onDismiss,
      action,
      linkStyle = false,
      fullWidth = false,
      subtle = false,
      ...props
    },
    ref
  ) => {
    const config = bannerConfig[type];
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

    if (!isVisible) return null;

    // Choose the appropriate variant classes based on subtle prop
    const variantClasses = subtle
      ? bannerSubtleVariants({ type })
      : bannerVariants({ type });

    // Choose the appropriate icon color classes based on subtle prop
    const currentIconColorClasses = subtle
      ? iconColorClassesSubtle[type]
      : iconColorClasses[type];

    // Dismiss button classes differ based on subtle prop
    const dismissButtonClasses = subtle
      ? cn(
          "shrink-0 p-1.5 rounded-md",
          "bg-[var(--banner-subtle-dismiss-background)]",
          "hover:bg-[var(--banner-subtle-dismiss-background-hover)]",
          "active:bg-[var(--banner-subtle-dismiss-background-active)]",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-current/50 focus-visible:ring-offset-1",
          "transition-colors duration-[var(--duration-fast)]",
          "opacity-70 hover:opacity-100"
        )
      : cn(
          "shrink-0 p-1.5 rounded-md",
          "bg-[var(--banner-dismiss-background)]",
          "hover:bg-[var(--banner-dismiss-background-hover)]",
          "active:bg-[var(--banner-dismiss-background-active)]",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-1",
          "transition-colors duration-[var(--duration-fast)]",
          "opacity-80 hover:opacity-100"
        );

    // Themed action button classes based on type and subtle prop
    const themedButtonClasses = subtle
      ? themedActionButtonClassesSubtle[type]
      : themedActionButtonClasses[type];

    // Base action button styling
    const actionButtonBaseClasses = cn(
      "font-semibold",
      "rounded-lg",
      "px-4 py-2",
      "transition-all duration-[var(--duration-fast)]",
      "shadow-sm hover:shadow",
      themedButtonClasses
    );

    // Link style focus ring differs based on subtle prop
    const linkFocusRingClass = subtle
      ? "focus-visible:ring-current/50"
      : "focus-visible:ring-white/50";

    return (
      <div
        ref={ref}
        role="alert"
        aria-live={config.ariaLive}
        className={cn(
          variantClasses,
          fullWidth && "rounded-none",
          isExiting && "animate-out fade-out slide-out-to-top-2 duration-200",
          className
        )}
        {...props}
      >
        {/* Icon */}
        {!hideIcon && (
          <div className={cn(
            "shrink-0 flex items-center justify-center",
            currentIconColorClasses
          )}>
            {icon ? (
              <span className="[&>svg]:w-5 [&>svg]:h-5" aria-hidden="true">
                {icon}
              </span>
            ) : (
              <IconComponent
                weight="fill"
                size={20}
                aria-hidden="true"
              />
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm leading-5">
            {title}
          </div>
          {description && (
            <div className={cn(
              "text-sm leading-5 mt-0.5",
              subtle ? "opacity-80" : "opacity-90"
            )}>
              {description}
            </div>
          )}
        </div>

        {/* Action */}
        {(action || actionLabel) && (
          <div className="shrink-0 flex items-center">
            {action || (
              linkStyle ? (
                <button
                  type="button"
                  onClick={onAction}
                  className={cn(
                    "inline-flex items-center gap-1",
                    "text-sm font-medium",
                    "hover:underline underline-offset-2",
                    "focus:outline-none focus-visible:ring-2 rounded",
                    linkFocusRingClass,
                    "transition-colors duration-[var(--duration-fast)]"
                  )}
                >
                  {actionLabel}
                  <ArrowRight size={14} weight="bold" aria-hidden="true" />
                </button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  {...actionButtonProps}
                  onClick={onAction}
                  className={cn(actionButtonBaseClasses, actionButtonProps?.className)}
                >
                  {actionLabel}
                </Button>
              )
            )}
          </div>
        )}

        {/* Dismiss button */}
        {dismissible && (
          <button
            type="button"
            onClick={handleDismiss}
            className={dismissButtonClasses}
            aria-label="Dismiss banner"
          >
            <X size={16} weight="bold" aria-hidden="true" />
          </button>
        )}
      </div>
    );
  }
);

Banner.displayName = "Banner";

export { Banner, bannerVariants, bannerSubtleVariants, bannerConfig };
