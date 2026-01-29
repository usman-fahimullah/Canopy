"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Checkbox component based on Trails Design System
 *
 * Specs:
 * - Sizes: sm (16px), default (20px), lg (24px)
 * - Border radius: 4px (sm), 5px (default), 6px (lg)
 * - Uses dedicated checkbox tokens for theming
 * - Supports indeterminate state for "select all" patterns
 * - Supports error state for form validation
 */

const checkboxVariants = cva(
  [
    "peer shrink-0",
    "border",
    "transition-all duration-150 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background-default",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "active:scale-95",
  ],
  {
    variants: {
      size: {
        sm: "h-4 w-4 rounded-[4px]",
        default: "h-5 w-5 rounded-[5px]",
        lg: "h-6 w-6 rounded-md",
      },
      error: {
        true: [
          "border-[var(--checkbox-border-error)]",
          "bg-[var(--checkbox-background-error)]",
          "focus-visible:ring-[var(--primitive-red-500)]",
          "hover:border-[var(--primitive-red-600)]",
        ],
        false: [
          "border-[var(--checkbox-border)]",
          "bg-[var(--checkbox-background)]",
          "focus-visible:ring-[var(--checkbox-border-checked)]",
          "hover:border-[var(--checkbox-border-hover)]",
          "hover:bg-[var(--checkbox-background-hover)]",
          "data-[state=checked]:border-[var(--checkbox-border-checked)]",
          "data-[state=checked]:bg-[var(--checkbox-background-checked)]",
          "data-[state=checked]:hover:bg-[var(--checkbox-background-checked-hover)]",
          "data-[state=indeterminate]:border-[var(--checkbox-border-checked)]",
          "data-[state=indeterminate]:bg-[var(--checkbox-background-checked)]",
          "data-[state=indeterminate]:hover:bg-[var(--checkbox-background-checked-hover)]",
        ],
      },
    },
    defaultVariants: {
      size: "default",
      error: false,
    },
  }
);

const iconSizes = {
  sm: 10,
  default: 12,
  lg: 16,
} as const;

// Animated check icon with stroke-dasharray animation
const AnimatedCheck = ({ size, className }: { size: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 12 12"
    fill="none"
    className={className}
  >
    <path
      d="M2.5 6L5 8.5L9.5 3.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-[check-stroke_200ms_ease-out_forwards]"
      style={{
        strokeDasharray: 12,
        strokeDashoffset: 12,
      }}
    />
  </svg>
);

// Animated minus icon
const AnimatedMinus = ({ size, className }: { size: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 12 12"
    fill="none"
    className={className}
  >
    <path
      d="M2.5 6H9.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="animate-[minus-stroke_150ms_ease-out_forwards]"
      style={{
        strokeDasharray: 7,
        strokeDashoffset: 7,
      }}
    />
  </svg>
);

export interface CheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, "checked">,
    VariantProps<typeof checkboxVariants> {
  /** Show indeterminate state (for "select all" patterns) */
  indeterminate?: boolean;
  /** Controlled checked state */
  checked?: boolean | "indeterminate";
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, indeterminate, size = "default", error, checked, ...props }, ref) => {
  // Handle indeterminate prop
  const checkedState = indeterminate ? "indeterminate" : checked;
  const iconSize = iconSizes[size || "default"];

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      checked={checkedState}
      className={cn(checkboxVariants({ size, error }), className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn(
          "flex items-center justify-center text-[var(--checkbox-foreground)]"
        )}
      >
        {indeterminate || checkedState === "indeterminate" ? (
          <AnimatedMinus size={iconSize} />
        ) : (
          <AnimatedCheck size={iconSize} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

/**
 * CheckboxWithLabel - Checkbox with adjacent label and optional helper text
 *
 * Features:
 * - 8px gap between checkbox and label
 * - Label: text-body, foreground-default
 * - Helper text: text-caption, foreground-muted
 * - Error message: text-caption, foreground-error
 * - Supports required indicator
 */
interface CheckboxWithLabelProps
  extends Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, "checked"> {
  /** Label text displayed next to the checkbox */
  label: string;
  /** Optional helper/description text below the label */
  helperText?: string;
  /** Position of the label relative to the checkbox */
  labelPosition?: "left" | "right";
  /** Custom class for the label */
  labelClassName?: string;
  /** Size variant */
  size?: "sm" | "default" | "lg";
  /** Show indeterminate state */
  indeterminate?: boolean;
  /** Show error state */
  error?: boolean;
  /** Error message to display */
  errorMessage?: string;
  /** Mark as required */
  required?: boolean;
  /** Controlled checked state */
  checked?: boolean | "indeterminate";
}

const CheckboxWithLabel = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxWithLabelProps
>(
  (
    {
      className,
      label,
      labelPosition = "right",
      helperText,
      labelClassName,
      id,
      size = "default",
      indeterminate,
      error,
      errorMessage,
      required,
      disabled,
      ...props
    },
    ref
  ) => {
    const checkboxId = id || React.useId();

    return (
      <div className={cn("flex gap-2", className)}>
        <div
          className={cn(
            "flex items-start gap-2",
            labelPosition === "left" && "flex-row-reverse"
          )}
        >
          <Checkbox
            ref={ref}
            id={checkboxId}
            size={size}
            indeterminate={indeterminate}
            error={error}
            disabled={disabled}
            className={size === "sm" ? "mt-0.5" : size === "lg" ? "mt-0" : "mt-0.5"}
            {...props}
          />
          <div className="flex flex-col justify-center min-w-0 flex-1">
            <label
              htmlFor={checkboxId}
              className={cn(
                "text-body leading-6 cursor-pointer select-none",
                disabled ? "text-[var(--foreground-disabled)]" : "text-[var(--foreground-default)]",
                error && !disabled && "text-[var(--foreground-error)]",
                labelClassName
              )}
            >
              {label}
              {required && (
                <span className="text-[var(--foreground-error)] ml-0.5">*</span>
              )}
            </label>
            {helperText && !errorMessage && (
              <span className={cn(
                "text-caption leading-5",
                disabled ? "text-[var(--foreground-disabled)]" : "text-[var(--foreground-muted)]"
              )}>
                {helperText}
              </span>
            )}
            {errorMessage && error && (
              <span className="text-caption leading-5 text-[var(--foreground-error)]">
                {errorMessage}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
);

CheckboxWithLabel.displayName = "CheckboxWithLabel";

/**
 * CheckboxGroup - Container for multiple related checkboxes
 *
 * Features:
 * - Group label with optional required indicator
 * - Helper text for group context
 * - Error state with message
 * - Consistent spacing (gap-3 between items)
 */
interface CheckboxGroupProps {
  /** Group label */
  label?: string;
  /** Helper text for the group */
  helperText?: string;
  /** Show error state */
  error?: boolean;
  /** Error message */
  errorMessage?: string;
  /** Mark group as required */
  required?: boolean;
  /** Children (CheckboxWithLabel items) */
  children: React.ReactNode;
  /** Additional className */
  className?: string;
  /** Orientation of the group */
  orientation?: "vertical" | "horizontal";
}

const CheckboxGroup = ({
  label,
  helperText,
  error,
  errorMessage,
  required,
  children,
  className,
  orientation = "vertical",
}: CheckboxGroupProps) => {
  return (
    <div className={cn("space-y-2", className)} role="group" aria-labelledby={label ? "checkbox-group-label" : undefined}>
      {label && (
        <div className="space-y-1">
          <label
            id="checkbox-group-label"
            className={cn(
              "text-body-strong font-medium",
              error ? "text-[var(--foreground-error)]" : "text-[var(--foreground-default)]"
            )}
          >
            {label}
            {required && (
              <span className="text-[var(--foreground-error)] ml-0.5">*</span>
            )}
          </label>
          {helperText && !errorMessage && (
            <p className="text-caption text-[var(--foreground-muted)]">{helperText}</p>
          )}
        </div>
      )}
      <div
        className={cn(
          orientation === "vertical" ? "flex flex-col gap-3" : "flex flex-wrap gap-4"
        )}
      >
        {children}
      </div>
      {errorMessage && error && (
        <p className="text-caption text-[var(--foreground-error)]">{errorMessage}</p>
      )}
    </div>
  );
};

CheckboxGroup.displayName = "CheckboxGroup";

export { Checkbox, CheckboxWithLabel, CheckboxGroup };
