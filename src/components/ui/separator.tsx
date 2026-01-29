"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "@/lib/utils";

/**
 * Separator component for visual dividers
 *
 * Uses semantic tokens:
 * - border-default for the separator color
 * - border-muted for subtle variant
 */

export interface SeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  /** Visual style variant */
  variant?: "default" | "muted" | "emphasis";
  /** Add spacing around the separator */
  spacing?: "none" | "sm" | "md" | "lg";
  /** Optional label to display in the middle */
  label?: string;
}

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
    const variantClasses = {
      default: "bg-border-default",
      muted: "bg-border-muted",
      emphasis: "bg-border-emphasis",
    };

    const spacingClasses = {
      none: "",
      sm: orientation === "horizontal" ? "my-2" : "mx-2",
      md: orientation === "horizontal" ? "my-4" : "mx-4",
      lg: orientation === "horizontal" ? "my-6" : "mx-6",
    };

    if (label && orientation === "horizontal") {
      return (
        <div
          className={cn(
            "flex items-center gap-3",
            spacingClasses[spacing],
            className
          )}
        >
          <SeparatorPrimitive.Root
            ref={ref}
            decorative={decorative}
            orientation={orientation}
            className={cn("flex-1 h-px", variantClasses[variant])}
            {...props}
          />
          <span className="text-caption text-foreground-muted flex-shrink-0">
            {label}
          </span>
          <SeparatorPrimitive.Root
            decorative={decorative}
            orientation={orientation}
            className={cn("flex-1 h-px", variantClasses[variant])}
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
