"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Textarea component based on Figma Design (matches Input component)
 *
 * Figma Specs (matching Input):
 * - Container: bg neutral-100 (#faf9f7), border neutral-200 (#f2ede9), 8px radius, 16px padding
 * - Text: 18px font, black text
 * - Placeholder: neutral-600 (#7a7671)
 * - Focus: green-600 (#3ba36f) border, neutral-100 background
 * - Error: red-600 (#e90000) border
 * - Success: green-600 (#3ba36f) border
 *
 * States: Default, Focused, Filled, Error, Success, Disabled
 */
const textareaVariants = cva(
  [
    // Figma: bg #faf9f7 (neutral-100), border #f2ede9 (neutral-200), 8px radius, 16px padding
    "flex w-full rounded-lg border",
    "bg-[var(--primitive-neutral-100)]",
    "border-[var(--primitive-neutral-200)]",
    "p-4",
    "text-lg text-[var(--foreground-default)] leading-6",  // Figma: 18px font, black text
    "placeholder:text-[var(--primitive-neutral-600)]",  // Figma: #7a7671
    "transition-all duration-normal ease-default",
    "focus:outline-none focus:ring-0",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "resize-y min-h-[120px]",  // allow vertical resize, minimum height
  ],
  {
    variants: {
      variant: {
        default: [
          "hover:border-[var(--primitive-neutral-300)]",
          // Figma: focus state uses green-600 (#3ba36f) border
          "focus:border-[var(--primitive-green-600)]",
          "focus:bg-[var(--primitive-neutral-100)]",
        ],
        // Figma: error state uses red-600 (#e90000) border
        error: [
          "border-[var(--primitive-red-600)]",
          "hover:border-[var(--primitive-red-700)]",
          "focus:border-[var(--primitive-red-600)]",
        ],
        // Figma: success state uses green-600 (#3ba36f) border (same as focus)
        success: [
          "border-[var(--primitive-green-600)]",
          "hover:border-[var(--primitive-green-700)]",
          "focus:border-[var(--primitive-green-600)]",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  /** Error state - shows red border and styling */
  error?: boolean;
  /** Success state - shows green border */
  success?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, error, success, ...props }, ref) => {
    // Determine effective variant based on state props
    const effectiveVariant = error ? "error" : success ? "success" : variant;

    return (
      <textarea
        className={cn(textareaVariants({ variant: effectiveVariant }), className)}
        ref={ref}
        aria-invalid={error ? "true" : undefined}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
