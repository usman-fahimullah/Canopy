"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "@/lib/utils";

/**
 * Separator component for visual dividers
 *
 * Uses dedicated --separator-* component tokens (Tier 3) that are
 * alpha-based and composite naturally on any surface.
 *
 * Variants:
 * - default:  Standard divider on light/default surfaces
 * - muted:    Subtle divider for tight spacing or secondary areas
 * - emphasis: Stronger divider for major section breaks
 * - strong:   Highest contrast, for clear visual separation
 * - inverse:  Light separator for dark backgrounds (background-inverse, green-800)
 * - on-brand: White-alpha separator for brand-colored surfaces
 * - adaptive: Uses currentColor — inherits the text color of its context
 *             and reduces opacity. The most universally adaptable option.
 * - auto:     Surface-context-aware — reads --surface-separator which is
 *             automatically overridden by .surface-brand, .surface-inverse,
 *             .surface-error, etc. The recommended choice when the separator
 *             lives inside a surface context container.
 */

export interface SeparatorProps extends React.ComponentPropsWithoutRef<
  typeof SeparatorPrimitive.Root
> {
  /** Visual style variant */
  variant?:
    | "default"
    | "muted"
    | "emphasis"
    | "strong"
    | "inverse"
    | "on-brand"
    | "adaptive"
    | "auto";
  /** Add spacing around the separator */
  spacing?: "none" | "sm" | "md" | "lg";
  /** Optional label to display in the middle */
  label?: string;
}

const variantClasses: Record<NonNullable<SeparatorProps["variant"]>, string> = {
  default: "bg-[var(--separator-default)]",
  muted: "bg-[var(--separator-muted)]",
  emphasis: "bg-[var(--separator-emphasis)]",
  strong: "bg-[var(--separator-strong)]",
  inverse: "bg-[var(--separator-inverse)]",
  "on-brand": "bg-[var(--separator-on-brand)]",
  adaptive: "bg-current opacity-[0.12]",
  auto: "bg-[var(--surface-separator)]",
};

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(
  (
    {
      className,
      orientation = "horizontal",
      decorative = true,
      variant = "default",
      spacing = "none",
      label,
      ...props
    },
    ref
  ) => {
    const spacingClasses = {
      none: "",
      sm: orientation === "horizontal" ? "my-2" : "mx-2",
      md: orientation === "horizontal" ? "my-4" : "mx-4",
      lg: orientation === "horizontal" ? "my-6" : "mx-6",
    };

    if (label && orientation === "horizontal") {
      return (
        <div className={cn("flex items-center gap-3", spacingClasses[spacing], className)}>
          <SeparatorPrimitive.Root
            ref={ref}
            decorative={decorative}
            orientation={orientation}
            className={cn("h-px flex-1", variantClasses[variant])}
            {...props}
          />
          <span className="flex-shrink-0 text-caption text-[var(--foreground-muted)]">{label}</span>
          <SeparatorPrimitive.Root
            decorative={decorative}
            orientation={orientation}
            className={cn("h-px flex-1", variantClasses[variant])}
          />
        </div>
      );
    }

    return (
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn(
          "shrink-0",
          variantClasses[variant],
          spacingClasses[spacing],
          orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
          className
        )}
        {...props}
      />
    );
  }
);

Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
