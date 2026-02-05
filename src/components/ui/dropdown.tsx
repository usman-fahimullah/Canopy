"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, CaretDown } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/**
 * Dropdown component based on Figma Design (33:15667)
 *
 * Figma Specs:
 * - Trigger: bg neutral-100 (#FAF9F7), border neutral-200 (#F2EDE9), 8px radius, 16px padding
 * - Hover: border neutral-300 (#E5DFD8)
 * - Placeholder: neutral-600 (#7A7671), 18px font
 * - Selected value: green-800 (#0A3D2C), 18px font
 * - Success state (has value): green-500 border
 * - Error state: red-500 border, red text for placeholder
 * - Dropdown icon: green-800 (#0A3D2C), 24px, rotates on open
 * - Content: white bg, 8px radius, shadow on open, 4px padding, scrollable
 * - Selected item: neutral-100 bg, blue-500 text (#3369FF), checkmark icon
 * - Unselected items: green-800 text (#0A3D2C), px-3 py-2 (12px/8px), 14px font
 */

const Dropdown = SelectPrimitive.Root;

const DropdownGroup = SelectPrimitive.Group;

const DropdownValue = SelectPrimitive.Value;

const DropdownTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    /** Shows error state with red border */
    error?: boolean;
    /** Shows success state with green border (typically when has valid value) */
    success?: boolean;
    size?: "default" | "lg";
  }
>(({ className, children, error, success, size = "default", ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex w-full items-center justify-between gap-2",
      // Figma: 8px radius, 16px padding
      "rounded-lg border p-4",
      // Default: neutral-100 bg, neutral-200 border
      "bg-[var(--select-background)]",
      "border-[var(--select-border)]",
      // Figma: 18px font, green-800 for selected value
      "text-lg leading-6 text-[var(--select-foreground)]",
      // Transitions
      "ease-default transition-all duration-normal",
      // Hover: border neutral-300
      "hover:border-[var(--select-border-hover)]",
      // Focus: ring indicator
      "focus-visible:border-[var(--select-border-focus)] focus-visible:outline-none",
      // Disabled state
      "disabled:cursor-not-allowed disabled:opacity-50",
      // Figma: placeholder color neutral-600
      "data-[placeholder]:text-[var(--select-foreground-placeholder)]",
      // Size variants
      size === "lg" && "text-xl",
      // Success state: green border (when has valid selection)
      success && [
        "border-[var(--select-border-success)]",
        "hover:border-[var(--primitive-green-600)]",
        "bg-[var(--select-background-open)]",
      ],
      // Error state: red border + error focus ring
      error && [
        "border-[var(--select-border-error)]",
        "hover:border-[var(--select-border-error)]",
        "data-[placeholder]:text-[var(--select-foreground-error)]",
        "focus-visible:border-[var(--select-border-error)]",
      ],
      className
    )}
    aria-invalid={error ? "true" : undefined}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      {/* Figma: 24px icon, green-800 color, rotates 180deg when open */}
      <CaretDown className="h-6 w-6 shrink-0 text-[var(--select-icon)] transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
DropdownTrigger.displayName = SelectPrimitive.Trigger.displayName;

// Gradient scroll indicators (replaces chevron buttons)
// - Taller (40px) multi-stop gradient for smoother, more visible fade
// - Animated fade-in/out transition when appearing/disappearing
const DropdownScrollUpIndicator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "pointer-events-none absolute left-0 right-0 top-0 z-10 h-10",
      "via-[var(--select-content-background)]/60 bg-gradient-to-b from-[var(--select-content-background)] to-transparent",
      // Animated fade-in/out
      "animate-in fade-in-0 duration-150",
      "data-[state=hidden]:animate-out data-[state=hidden]:fade-out-0",
      className
    )}
    {...props}
  />
));
DropdownScrollUpIndicator.displayName = "DropdownScrollUpIndicator";

const DropdownScrollDownIndicator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-10",
      "via-[var(--select-content-background)]/60 bg-gradient-to-t from-[var(--select-content-background)] to-transparent",
      // Animated fade-in/out
      "animate-in fade-in-0 duration-150",
      "data-[state=hidden]:animate-out data-[state=hidden]:fade-out-0",
      className
    )}
    {...props}
  />
));
DropdownScrollDownIndicator.displayName = "DropdownScrollDownIndicator";

// Legacy chevron scroll buttons (kept for backward compatibility)
const DropdownScrollUpButton = DropdownScrollUpIndicator;
const DropdownScrollDownButton = DropdownScrollDownIndicator;

const DropdownContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & {
    /** Maximum height for scrollable content. Defaults to 300px */
    maxHeight?: string;
  }
>(({ className, children, position = "popper", maxHeight = "300px", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-dropdown min-w-[8rem] overflow-hidden",
        // Figma: white bg, 8px radius
        "rounded-lg bg-[var(--select-content-background)]",
        // Shadow on open - elevated shadow for visibility
        "shadow-lg",
        // Border for better definition
        "border border-[var(--border-muted)]",
        // Animations
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      {/* Top gradient indicator - shows when scrolled down */}
      <DropdownScrollUpIndicator />
      <SelectPrimitive.Viewport
        className={cn(
          // Figma: 4px padding, 4px gap between items
          "flex flex-col gap-1 p-1",
          // Scrollable with max-height
          "overflow-y-auto",
          position === "popper" && "w-full min-w-[var(--radix-select-trigger-width)]"
        )}
        style={{ maxHeight }}
      >
        {children}
      </SelectPrimitive.Viewport>
      {/* Bottom gradient indicator - shows when more content below */}
      <DropdownScrollDownIndicator />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
DropdownContent.displayName = SelectPrimitive.Content.displayName;

const DropdownLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("px-3 py-2 text-caption font-medium text-foreground-muted", className)}
    {...props}
  />
));
DropdownLabel.displayName = SelectPrimitive.Label.displayName;

const DropdownItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center justify-between",
      // Figma: 8px radius, px-3 (12px), py-2 (8px)
      "rounded-lg px-3 py-2",
      // Figma: 14px font, green-800 text, 20px line-height
      "text-sm leading-5 text-[var(--select-item-foreground)] outline-none",
      // Transition for smooth hover
      "transition-colors duration-fast",
      // Figma: hover state - neutral-100 background
      "hover:bg-[var(--select-item-background-hover)]",
      // Figma: selected/checked state - neutral-100 bg, blue-500 text
      "data-[state=checked]:bg-[var(--select-item-background-selected)]",
      "data-[state=checked]:text-[var(--select-item-foreground-selected)]",
      // Disabled state
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText className="flex-1">{children}</SelectPrimitive.ItemText>
    <SelectPrimitive.ItemIndicator className="ml-2 shrink-0">
      {/* Figma: 24px blue checkmark icon for selected state */}
      <Check className="h-6 w-6 text-[var(--select-item-checkmark)]" weight="bold" />
    </SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>
));
DropdownItem.displayName = SelectPrimitive.Item.displayName;

const DropdownSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
));
DropdownSeparator.displayName = SelectPrimitive.Separator.displayName;

// Backward compatibility aliases (deprecated - use Dropdown* instead)
const Select = Dropdown;
const SelectGroup = DropdownGroup;
const SelectValue = DropdownValue;
const SelectTrigger = DropdownTrigger;
const SelectContent = DropdownContent;
const SelectLabel = DropdownLabel;
const SelectItem = DropdownItem;
const SelectSeparator = DropdownSeparator;
const SelectScrollUpButton = DropdownScrollUpButton;
const SelectScrollDownButton = DropdownScrollDownButton;

export {
  // New Dropdown names (preferred)
  Dropdown,
  DropdownGroup,
  DropdownValue,
  DropdownTrigger,
  DropdownContent,
  DropdownLabel,
  DropdownItem,
  DropdownSeparator,
  DropdownScrollUpButton,
  DropdownScrollDownButton,
  // Backward compatibility (deprecated)
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
