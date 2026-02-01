"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { CaretDown } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/**
 * Accordion component for collapsible content sections
 *
 * Uses semantic tokens:
 * - border-default for dividers
 * - foreground-default for text
 * - background-interactive-hover for hover states
 */

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-border-default border-b", className)}
    {...props}
  />
));

AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    /** Hide the chevron icon */
    hideIcon?: boolean;
  }
>(({ className, children, hideIcon = false, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 text-body-sm font-medium",
        "text-foreground-default",
        "transition-all hover:bg-background-interactive-hover",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-interactive-focus focus-visible:ring-offset-2",
        "[&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      {!hideIcon && (
        <CaretDown className="h-4 w-4 shrink-0 text-foreground-muted transition-transform duration-200" />
      )}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));

AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden text-caption text-foreground-muted",
      "data-[state=closed]:animate-accordion-up",
      "data-[state=open]:animate-accordion-down"
    )}
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

// Card-style accordion variant
const AccordionCard = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      "border-border-default bg-surface-default rounded-lg border",
      "data-[state=open]:border-border-brand",
      "transition-colors",
      className
    )}
    {...props}
  />
));

AccordionCard.displayName = "AccordionCard";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent, AccordionCard };
