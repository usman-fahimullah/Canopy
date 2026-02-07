"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { SpinnerGap } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/**
 * Button component based on Trails Design System
 *
 * Specs from Figma (updated 2024):
 * - Border radius: 16px (rounded-2xl)
 * - Default size: px-16px py-14px, 14px font (caption-strong), 4px icon gap
 * - Large size: p-16px, 18px font (body-strong), 8px icon gap
 * - Icon button default: 12px padding, 24px icon
 * - Icon button small: 10px padding, 20px icon
 *
 * Variants:
 * - Primary: bg green-800 (#0A3D2C), hover green-700 (#0e5249), text blue-100 (#e5f1ff)
 * - Secondary: bg blue-200 (#cce4ff), hover blue-300 (#99c9ff), text black (#000000)
 * - Tertiary: bg neutral-200 (#f2ede9), hover neutral-300 (#e5dfd8), text black (#000000)
 * - Inverse: bg white, hover neutral-100 (#faf9f7), text black (#000000)
 * - Destructive: bg red-500 (#ff5c5c), hover red-600 (#e90000), text white
 */
const buttonVariants = cva(
  // Base styles
  [
    "inline-flex items-center justify-center",
    "whitespace-nowrap font-bold",
    "rounded-2xl", // 16px border-radius per Figma
    "transition-all duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primitive-green-500)] focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:scale-[0.98]",
  ],
  {
    variants: {
      variant: {
        // Primary - Figma: bg #0A3D2C, hover #0e5249, text #e5f1ff
        primary:
          "bg-[var(--button-primary-background)] hover:bg-[var(--button-primary-background-hover)] text-[var(--button-primary-foreground)]",
        // Secondary - Figma: bg #cce4ff, hover #99c9ff, text #000000
        secondary:
          "bg-[var(--button-secondary-background)] hover:bg-[var(--button-secondary-background-hover)] text-[var(--button-secondary-foreground)]",
        // Tertiary - Figma: bg #f2ede9, hover #e5dfd8, text #000000
        tertiary:
          "bg-[var(--button-tertiary-background)] hover:bg-[var(--button-tertiary-background-hover)] text-[var(--button-tertiary-foreground)]",
        // Inverse - Figma: bg white, hover #faf9f7, text #000000
        inverse:
          "bg-[var(--button-inverse-background)] hover:bg-[var(--button-inverse-background-hover)] text-[var(--button-inverse-foreground)]",
        // Destructive - Figma: bg #ff5c5c, hover #e90000, text white
        destructive:
          "bg-[var(--button-destructive-background)] hover:bg-[var(--button-destructive-background-hover)] text-[var(--button-destructive-foreground)]",
        // Ghost - transparent background with subtle hover
        ghost:
          "bg-[var(--button-ghost-background)] hover:bg-[var(--button-ghost-background-hover)] text-[var(--button-ghost-foreground)]",
        // Outline - Border with transparent background; active keeps hover bg
        // Matches SplitButton outline: border-default, hover neutral-100
        outline: [
          "bg-[var(--button-outline-background)] text-[var(--button-outline-foreground)]",
          "border border-[var(--border-default)]",
          "hover:bg-[var(--primitive-neutral-100)]",
          "active:bg-[var(--primitive-neutral-100)]",
          "data-[selected=true]:bg-[var(--primitive-neutral-100)]",
        ],
        // Link style - transparent background with brand text
        link: "bg-transparent text-foreground-brand hover:bg-background-muted",
      },
      size: {
        // Default: Figma py-14px px-16px, 14px font (caption-strong), 4px icon gap
        default: "h-auto px-4 py-3.5 gap-1 text-sm leading-5",
        // Small: reduced padding for compact UI
        sm: "h-8 px-3 py-1.5 gap-1 text-sm",
        // Large: Figma p-16px, 18px font (body-strong), 8px icon gap
        lg: "h-auto p-4 gap-2 text-lg leading-6",
        // Icon button - default: 12px padding, 24px icon
        icon: "p-3",
        // Icon button - small: 10px padding, 20px icon, 12px radius per Figma
        "icon-sm": "p-2.5 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  /** Use the Slot component to render a custom element */
  asChild?: boolean;
  /** Show loading spinner and disable interactions */
  loading?: boolean;
  /** Icon to display on the left side */
  leftIcon?: React.ReactNode;
  /** Icon to display on the right side */
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <>
            <SpinnerGap className="h-4 w-4 animate-spin" weight="bold" aria-hidden="true" />
            <span className="sr-only">Loading...</span>
            {children}
          </>
        ) : (
          <>
            {leftIcon && (
              <span className="inline-flex shrink-0" aria-hidden="true">
                {leftIcon}
              </span>
            )}
            {children}
            {rightIcon && (
              <span className="inline-flex shrink-0" aria-hidden="true">
                {rightIcon}
              </span>
            )}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
