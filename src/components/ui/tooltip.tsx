"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

/**
 * Tooltip component based on Trails Design System
 *
 * A small popup that displays additional information on hover.
 * Built on Radix UI Tooltip for accessibility.
 *
 * Features:
 * - White background with shadow-md
 * - Visual caret/arrow pointing to trigger
 * - 12px border radius
 * - Two variants: light (default) and dark (inverse)
 */

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipArrow = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow>
>(({ className, ...props }, ref) => (
  <TooltipPrimitive.Arrow
    ref={ref}
    className={cn("fill-[var(--background-default)]", className)}
    width={14}
    height={7}
    {...props}
  />
));
TooltipArrow.displayName = "TooltipArrow";

export interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  /** Tooltip variant - light (white bg) or dark (inverse) */
  variant?: "light" | "dark";
  /** Whether to show the arrow/caret pointing to trigger */
  showArrow?: boolean;
}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(
  (
    {
      className,
      sideOffset = 8,
      variant = "light",
      showArrow = true,
      children,
      ...props
    },
    ref
  ) => (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-tooltip overflow-hidden",
        "rounded-xl px-4 py-3",
        "shadow-md",
        "text-caption",
        // Animations
        "animate-in fade-in-0 zoom-in-95",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        "data-[side=bottom]:slide-in-from-top-2",
        "data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2",
        "data-[side=top]:slide-in-from-bottom-2",
        // Variant styles
        variant === "light" && [
          "bg-[var(--background-default)] text-[var(--foreground-default)]",
          "border border-[var(--border-muted)]",
        ],
        variant === "dark" && [
          "bg-[var(--background-inverse)] text-[var(--foreground-inverse)]",
        ],
        className
      )}
      {...props}
    >
      {children}
      {showArrow && (
        <TooltipArrow
          className={cn(
            variant === "light" && "fill-[var(--background-default)]",
            variant === "dark" && "fill-[var(--background-inverse)]"
          )}
        />
      )}
    </TooltipPrimitive.Content>
  )
);
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

/**
 * Simple Tooltip wrapper for common use cases
 */
export interface SimpleTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  delayDuration?: number;
  /** Tooltip variant - light (white bg) or dark (inverse) */
  variant?: "light" | "dark";
  /** Whether to show the arrow/caret pointing to trigger */
  showArrow?: boolean;
}

const SimpleTooltip = ({
  children,
  content,
  side = "top",
  align = "center",
  delayDuration = 200,
  variant = "light",
  showArrow = true,
}: SimpleTooltipProps) => (
  <TooltipProvider delayDuration={delayDuration}>
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side={side}
        align={align}
        variant={variant}
        showArrow={showArrow}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
  TooltipProvider,
  SimpleTooltip,
};
