"use client";

import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { cn } from "@/lib/utils";

/**
 * HoverCard component for rich preview on hover
 *
 * Uses semantic tokens:
 * - surface-overlay for background
 * - border-default for border
 * - shadow-dropdown for elevation
 */

const HoverCard = HoverCardPrimitive.Root;

const HoverCardTrigger = HoverCardPrimitive.Trigger;

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      "z-popover w-64 rounded-lg border border-border-default",
      "bg-surface-overlay p-4 shadow-dropdown outline-none",
      // Animations
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      "data-[side=bottom]:slide-in-from-top-2",
      "data-[side=left]:slide-in-from-right-2",
      "data-[side=right]:slide-in-from-left-2",
      "data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));

HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

// Helper components for common hover card patterns
const HoverCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-3", className)}
    {...props}
  />
));

HoverCardHeader.displayName = "HoverCardHeader";

const HoverCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h4
    ref={ref}
    className={cn("text-body-sm font-medium text-foreground-default", className)}
    {...props}
  />
));

HoverCardTitle.displayName = "HoverCardTitle";

const HoverCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-caption text-foreground-muted mt-2", className)}
    {...props}
  />
));

HoverCardDescription.displayName = "HoverCardDescription";

export {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardHeader,
  HoverCardTitle,
  HoverCardDescription,
};
