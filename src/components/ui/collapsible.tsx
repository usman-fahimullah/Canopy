"use client";

import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { CaretDown } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/**
 * Collapsible component for expandable sections
 *
 * Uses semantic tokens:
 * - foreground-muted for icons
 * - background-interactive-hover for hover states
 */

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger> & {
    /** Show chevron indicator */
    showChevron?: boolean;
  }
>(({ className, children, showChevron = false, asChild, ...props }, ref) => {
  // When asChild is true, pass through directly to the Radix primitive
  // without adding any wrapper content
  if (asChild) {
    return (
      <CollapsiblePrimitive.Trigger ref={ref} asChild {...props}>
        {children}
      </CollapsiblePrimitive.Trigger>
    );
  }

  return (
    <CollapsiblePrimitive.Trigger
      ref={ref}
      className={cn(
        "flex w-full items-center justify-between",
        "text-foreground-default text-body-sm font-medium",
        "transition-colors hover:bg-background-interactive-hover",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-interactive-focus",
        "[&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      {showChevron && (
        <CaretDown className="h-4 w-4 text-foreground-muted transition-transform duration-200" />
      )}
    </CollapsiblePrimitive.Trigger>
  );
});

CollapsibleTrigger.displayName = CollapsiblePrimitive.Trigger.displayName;

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <CollapsiblePrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden",
      "data-[state=closed]:animate-collapsible-up",
      "data-[state=open]:animate-collapsible-down",
      className
    )}
    {...props}
  >
    {children}
  </CollapsiblePrimitive.Content>
));

CollapsibleContent.displayName = CollapsiblePrimitive.Content.displayName;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
