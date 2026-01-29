"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * NotificationBadge component based on Figma Design System (1375:20015)
 *
 * A small badge displaying a count number, used for notifications.
 * Has two variants: "alert" (red) for urgent notifications and "count" (neutral) for general counts.
 *
 * Figma Specs:
 * - Size: 20px width minimum, auto-expand for larger numbers
 * - Height: 20px (derived from line-height + padding)
 * - Border radius: 4px
 * - Font: DM Sans Bold, 14px, line-height 20px
 * - Padding: 2px horizontal
 *
 * Alert variant:
 * - Background: red-500 (#FF5C5C)
 * - Text: white
 *
 * Count variant:
 * - Background: neutral-200 (#F2EDE9)
 * - Text: neutral-800 (#1F1D1C)
 */

const notificationBadgeVariants = cva(
  [
    "inline-flex items-center justify-center",
    "min-w-[20px] px-0.5",
    "rounded",
    "text-sm font-bold leading-5",
    "text-center",
    // Font feature settings from Figma
    "[font-feature-settings:'salt','ss03']",
  ],
  {
    variants: {
      variant: {
        alert: [
          "bg-[var(--primitive-red-500)]",
          "text-white",
        ],
        count: [
          "bg-[var(--primitive-neutral-200)]",
          "text-[var(--primitive-neutral-800)]",
        ],
      },
      size: {
        default: "h-5 text-sm", // 20px height, 14px font
        sm: "h-4 min-w-[16px] text-xs", // 16px height, 12px font
        lg: "h-6 min-w-[24px] text-base", // 24px height, 16px font
      },
    },
    defaultVariants: {
      variant: "alert",
      size: "default",
    },
  }
);

export interface NotificationBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof notificationBadgeVariants> {
  /** The count to display */
  count: number;
  /** Maximum count to display before showing "99+" format */
  max?: number;
  /** Whether to show zero count (defaults to false - hides when count is 0) */
  showZero?: boolean;
}

const NotificationBadge = React.forwardRef<HTMLSpanElement, NotificationBadgeProps>(
  (
    {
      className,
      variant = "alert",
      size = "default",
      count,
      max = 99,
      showZero = false,
      ...props
    },
    ref
  ) => {
    // Hide badge when count is 0 and showZero is false
    if (count === 0 && !showZero) {
      return null;
    }

    // Format count display
    const displayCount = count > max ? `${max}+` : count.toString();

    return (
      <span
        ref={ref}
        className={cn(notificationBadgeVariants({ variant, size }), className)}
        role="status"
        aria-label={`${count} notifications`}
        {...props}
      >
        {displayCount}
      </span>
    );
  }
);

NotificationBadge.displayName = "NotificationBadge";

export { NotificationBadge, notificationBadgeVariants };
