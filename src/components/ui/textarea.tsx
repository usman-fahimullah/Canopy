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
    "flex w-full rounded-lg border",
    "bg-[var(--input-background)]",
    "border-[var(--input-border)]",
    "p-4",
    "text-lg text-[var(--input-foreground)] leading-6",
    "placeholder:text-[var(--input-foreground-placeholder)]",
    "transition-all duration-normal ease-default",
    "focus-visible:outline-none focus-visible:border-[var(--input-border-focus)] focus-visible:hover:border-[var(--input-border-focus)]",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "resize-y min-h-[120px]",
  ],
  {
    variants: {
      variant: {
        default: ["hover:border-[var(--input-border-hover)]"],
        error: [
          "border-[var(--input-border-error)]",
          "hover:border-[var(--input-border-error)]",
          "focus-visible:border-[var(--input-border-error)]",
        ],
        success: [
          "border-[var(--input-border-success)]",
          "hover:border-[var(--input-border-success)]",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, VariantProps<typeof textareaVariants> {
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
