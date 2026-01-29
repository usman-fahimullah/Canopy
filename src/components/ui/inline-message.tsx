"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  Info,
  CheckCircle,
  WarningDiamond,
  Warning,
} from "@phosphor-icons/react";

/**
 * InlineMessage component - Refreshed UI
 *
 * A compact inline message for contextual feedback, form validation,
 * and helper text. No background - just icon + text.
 *
 * Design improvements:
 * - Uses component-level design tokens for consistent theming
 * - Proper icon alignment with text baseline
 * - Consistent sizing with other notification components
 * - Enhanced accessibility
 *
 * Use cases:
 * - Form field validation messages
 * - Helper text with status
 * - Inline status indicators
 *
 * Variants:
 * - info: Neutral information (gray)
 * - success: Confirmations, valid input (green)
 * - warning: Caution, attention needed (orange)
 * - critical: Errors, invalid input (red)
 */

export type InlineMessageVariant = "info" | "success" | "warning" | "critical";

// Configuration for each variant
const inlineMessageConfig: Record<
  InlineMessageVariant,
  {
    icon: React.ElementType;
  }
> = {
  info: {
    icon: Info,
  },
  success: {
    icon: CheckCircle,
  },
  warning: {
    icon: WarningDiamond,
  },
  critical: {
    icon: Warning,
  },
};

const inlineMessageVariants = cva(
  [
    // Layout
    "flex items-start gap-1.5",
    "py-0.5",
    // Typography
    "text-sm leading-5",
    // Animation
    "transition-colors duration-[var(--duration-fast)]",
  ],
  {
    variants: {
      variant: {
        info: "text-[var(--inline-message-info-foreground)]",
        success: "text-[var(--inline-message-success-foreground)]",
        warning: "text-[var(--inline-message-warning-foreground)]",
        critical: "text-[var(--inline-message-critical-foreground)]",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

// Icon color classes mapped to variants
const iconColorClasses: Record<InlineMessageVariant, string> = {
  info: "text-[var(--inline-message-info-icon)]",
  success: "text-[var(--inline-message-success-icon)]",
  warning: "text-[var(--inline-message-warning-icon)]",
  critical: "text-[var(--inline-message-critical-icon)]",
};

export interface InlineMessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof inlineMessageVariants> {
  /** The message content */
  children: React.ReactNode;
  /** Override the default icon for the variant */
  icon?: React.ReactNode;
  /** Hide the icon completely */
  hideIcon?: boolean;
}

const InlineMessage = React.forwardRef<HTMLDivElement, InlineMessageProps>(
  (
    {
      className,
      variant = "info",
      children,
      icon,
      hideIcon = false,
      ...props
    },
    ref
  ) => {
    const config = inlineMessageConfig[variant || "info"];
    const IconComponent = config.icon;

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        className={cn(inlineMessageVariants({ variant }), className)}
        {...props}
      >
        {!hideIcon && (
          <span className="flex items-center justify-center shrink-0 mt-0.5">
            {icon || (
              <IconComponent
                weight="fill"
                size={16}
                className={iconColorClasses[variant || "info"]}
                aria-hidden="true"
              />
            )}
          </span>
        )}
        <span className="flex-1 min-w-0">{children}</span>
      </div>
    );
  }
);

InlineMessage.displayName = "InlineMessage";

export { InlineMessage, inlineMessageVariants, inlineMessageConfig };
