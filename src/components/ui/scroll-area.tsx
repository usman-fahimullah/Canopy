"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "@/lib/utils";

/**
 * ScrollArea component for custom scrollable areas
 *
 * Uses semantic tokens:
 * - border-muted for scrollbar track
 * - foreground-subtle for scrollbar thumb
 */

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
    /** Orientation of the scrollbar */
    orientation?: "vertical" | "horizontal" | "both";
  }
>(({ className, children, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    {(orientation === "vertical" || orientation === "both") && (
      <ScrollBar orientation="vertical" />
    )}
    {(orientation === "horizontal" || orientation === "both") && (
      <ScrollBar orientation="horizontal" />
    )}
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));

ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb
      className={cn(
        "relative flex-1 rounded-full",
        "bg-foreground-subtle/40 hover:bg-foreground-subtle/60",
        "transition-colors"
      )}
    />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));

ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
