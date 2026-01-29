"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

/**
 * Popover component for floating content
 *
 * Uses semantic tokens:
 * - surface-overlay for background
 * - border-default for border
 * - shadow-dropdown for elevation
 */

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverClose = PopoverPrimitive.Close;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
    /** Hide the arrow pointer */
    hideArrow?: boolean;
  }
>(
  (
    {
      className,
      align = "center",
      sideOffset = 4,
      hideArrow = false,
      children,
      ...props
    },
    ref
  ) => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-popover w-72 rounded-lg border border-border-default",
          "bg-surface-overlay p-4 shadow-dropdown",
          "outline-none",
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
      >
        {children}
        {!hideArrow && (
          <PopoverPrimitive.Arrow className="fill-surface-overlay" />
        )}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
);

PopoverContent.displayName = PopoverPrimitive.Content.displayName;

// Popover Header
const PopoverHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mb-3 space-y-1", className)}
    {...props}
  />
));

PopoverHeader.displayName = "PopoverHeader";

// Popover Title
const PopoverTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h4
    ref={ref}
    className={cn(
      "font-medium text-body-sm text-foreground-default",
      className
    )}
    {...props}
  />
));

PopoverTitle.displayName = "PopoverTitle";

// Popover Description
const PopoverDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-caption text-foreground-muted", className)}
    {...props}
  />
));

PopoverDescription.displayName = "PopoverDescription";

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
  PopoverClose,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
};
