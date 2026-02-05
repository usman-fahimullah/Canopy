"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { CircleNotch } from "@phosphor-icons/react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Switch component based on Figma Design System
 *
 * Figma Specs (2778:6790):
 * - Sizes: sm (36×18), default (48×24), lg (60×30)
 * - Off state: Track is neutral-400, thumb is white with neutral-400 border
 * - On state: Track is blue-500, thumb is white with blue-500 border
 * - Loading state: Shows spinner in thumb
 * - Error state: Red border for validation errors
 * - Border radius: full pill shape
 */

const switchVariants = cva(
  [
    "peer relative inline-flex shrink-0 cursor-pointer items-center",
    "rounded-full",
    "transition-all duration-150 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "active:scale-[0.97]",
  ],
  {
    variants: {
      size: {
        sm: "h-[18px] w-9",
        default: "h-6 w-12",
        lg: "h-[30px] w-[60px]",
      },
      error: {
        true: [
          "bg-[var(--primitive-red-200)]",
          "focus-visible:ring-[var(--ring-color-error)]",
          "data-[state=checked]:bg-[var(--primitive-red-500)]",
        ],
        false: [
          "bg-[var(--switch-background)]",
          "hover:bg-[var(--switch-background-hover)]",
          "focus-visible:ring-[var(--ring-color)]",
          "disabled:bg-[var(--switch-background-disabled)]",
          "data-[state=checked]:bg-[var(--switch-background-checked)]",
          "data-[state=checked]:hover:bg-[var(--switch-background-checked-hover)]",
        ],
      },
    },
    defaultVariants: {
      size: "default",
      error: false,
    },
  }
);

const thumbVariants = cva(
  [
    "pointer-events-none absolute rounded-full",
    "bg-[var(--switch-thumb)]",
    "shadow-sm",
    "transition-[left,border-color] duration-200 ease-[cubic-bezier(0.34,1.2,0.64,1)]",
    "flex items-center justify-center",
  ],
  {
    variants: {
      size: {
        sm: "h-[18px] w-[18px] border data-[state=checked]:left-[calc(100%-18px)]",
        default: "h-6 w-6 border-2 data-[state=checked]:left-[calc(100%-24px)]",
        lg: "h-[30px] w-[30px] border-2 data-[state=checked]:left-[calc(100%-30px)]",
      },
      error: {
        true: [
          "border-[var(--primitive-red-400)]",
          "data-[state=checked]:border-[var(--primitive-red-500)]",
        ],
        false: [
          "border-[var(--switch-thumb-border)]",
          "data-[state=checked]:border-[var(--switch-thumb-border-checked)]",
        ],
      },
    },
    defaultVariants: {
      size: "default",
      error: false,
    },
  }
);

const spinnerSizes = {
  sm: 10,
  default: 14,
  lg: 18,
} as const;

export interface SwitchProps
  extends
    React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
    VariantProps<typeof switchVariants> {
  /** Show loading spinner in thumb */
  loading?: boolean;
}

const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(
  ({ className, size = "default", error, loading, disabled, ...props }, ref) => {
    const spinnerSize = spinnerSizes[size || "default"];

    return (
      <SwitchPrimitive.Root
        className={cn(switchVariants({ size, error }), className)}
        disabled={disabled || loading}
        {...props}
        ref={ref}
      >
        <SwitchPrimitive.Thumb className={cn(thumbVariants({ size, error }), "left-0")}>
          {loading && (
            <CircleNotch
              size={spinnerSize}
              weight="bold"
              className="animate-spin text-[var(--foreground-muted)]"
            />
          )}
        </SwitchPrimitive.Thumb>
      </SwitchPrimitive.Root>
    );
  }
);

Switch.displayName = SwitchPrimitive.Root.displayName;

/**
 * SwitchWithLabel - Switch with adjacent label text
 *
 * Figma Specs (2780:7005):
 * - 12px gap between switch and label (gap-3 / --space-3)
 * - Label: 18px font (Font/Size/md), neutral-800 (#1F1D1C), 24px line-height
 * - Helper text: 14px font (Font/Size/sm), neutral-600 (#7A7671), 20px line-height
 * - Error message: 14px font, red-600 color
 * - Label position can be left or right of switch
 * - Supports required indicator
 */
interface SwitchWithLabelProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  /** Label text displayed next to the switch */
  label: string;
  /** Position of the label relative to the switch */
  labelPosition?: "left" | "right";
  /** Optional helper/description text below the label */
  helperText?: string;
  /** Custom class for the label */
  labelClassName?: string;
  /** Size variant */
  size?: "sm" | "default" | "lg";
  /** Show loading state */
  loading?: boolean;
  /** Show error state */
  error?: boolean;
  /** Error message to display */
  errorMessage?: string;
  /** Mark as required */
  required?: boolean;
}

const SwitchWithLabel = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchWithLabelProps
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
      loading,
      error,
      errorMessage,
      required,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const switchId = id || generatedId;

    return (
      <div
        className={cn(
          "flex items-center gap-3",
          labelPosition === "left" && "flex-row-reverse",
          className
        )}
      >
        <Switch
          ref={ref}
          id={switchId}
          size={size}
          loading={loading}
          error={error}
          disabled={disabled}
          {...props}
        />
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <label
            htmlFor={switchId}
            className={cn(
              "cursor-pointer select-none text-body leading-6",
              disabled ? "text-[var(--foreground-disabled)]" : "text-[var(--foreground-default)]",
              error && !disabled && "text-[var(--foreground-error)]",
              labelClassName
            )}
          >
            {label}
            {required && <span className="ml-0.5 text-[var(--foreground-error)]">*</span>}
          </label>
          {helperText && !errorMessage && (
            <span
              className={cn(
                "text-caption leading-5",
                disabled ? "text-[var(--foreground-disabled)]" : "text-[var(--foreground-muted)]"
              )}
            >
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
    );
  }
);

SwitchWithLabel.displayName = "SwitchWithLabel";

/**
 * SwitchGroup - Container for multiple related switches
 *
 * Features:
 * - Group label with optional required indicator
 * - Helper text for group context
 * - Consistent spacing between items
 * - Often used for settings/preferences panels
 */
interface SwitchGroupProps {
  /** Group label */
  label?: string;
  /** Helper text for the group */
  helperText?: string;
  /** Children (SwitchWithLabel items) */
  children: React.ReactNode;
  /** Additional className */
  className?: string;
  /** Show dividers between items */
  divided?: boolean;
}

const SwitchGroup = ({
  label,
  helperText,
  children,
  className,
  divided = false,
}: SwitchGroupProps) => {
  return (
    <div
      className={cn("space-y-2", className)}
      role="group"
      aria-labelledby={label ? "switch-group-label" : undefined}
    >
      {label && (
        <div className="space-y-1">
          <label
            id="switch-group-label"
            className="text-body-strong font-medium text-[var(--foreground-default)]"
          >
            {label}
          </label>
          {helperText && (
            <p className="text-caption text-[var(--foreground-muted)]">{helperText}</p>
          )}
        </div>
      )}
      <div
        className={cn(
          "flex flex-col",
          divided ? "divide-y divide-[var(--border-default)]" : "gap-3"
        )}
      >
        {React.Children.map(children, (child, index) => (
          <div key={index} className={divided ? "py-3 first:pt-0 last:pb-0" : ""}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};

SwitchGroup.displayName = "SwitchGroup";

export { Switch, SwitchWithLabel, SwitchGroup };
