"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Radio Group component based on Trails Design System
 *
 * Specs:
 * - Sizes: sm (16px), default (20px), lg (24px)
 * - Border radius: full (circle)
 * - Uses dedicated radio tokens for theming
 * - Selected state: blue-500 background with white inner dot
 * - Supports error state for form validation
 */

const radioItemVariants = cva(
  [
    "peer shrink-0",
    "rounded-full border",
    "transition-[border-color,background-color,transform] duration-100 ease-out",
    "focus-visible:outline-none focus-visible:border-[var(--input-border-focus)]",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "active:scale-95",
  ],
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        default: "h-5 w-5",
        lg: "h-6 w-6",
      },
      error: {
        true: [
          "border-[var(--radio-border-error)]",
          "bg-[var(--radio-background-error)]",
          "focus-visible:border-[var(--radio-border-error)]",
          "hover:border-[var(--radio-border-error)]",
          "data-[state=checked]:border-[var(--radio-border-error)]",
          "data-[state=checked]:bg-[var(--radio-border-error)]",
        ],
        false: [
          "border-[var(--radio-border)]",
          "bg-[var(--radio-background)]",
          "focus-visible:border-[var(--radio-border-checked)]",
          "hover:border-[var(--radio-border-hover)]",
          "hover:bg-[var(--radio-background-hover)]",
          "data-[state=checked]:border-[var(--radio-border-checked)]",
          "data-[state=checked]:bg-[var(--radio-background-checked)]",
          "data-[state=checked]:hover:bg-[var(--radio-background-checked-hover)]",
        ],
      },
    },
    defaultVariants: {
      size: "default",
      error: false,
    },
  }
);

const dotSizes = {
  sm: "h-1.5 w-1.5",
  default: "h-2 w-2",
  lg: "h-2.5 w-2.5",
} as const;

interface RadioGroupContextValue {
  size?: "sm" | "default" | "lg";
  error?: boolean;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue>({});

export interface RadioGroupProps extends React.ComponentPropsWithoutRef<
  typeof RadioGroupPrimitive.Root
> {
  /** Size variant for all radio items */
  size?: "sm" | "default" | "lg";
  /** Show error state for all items */
  error?: boolean;
}

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, size = "default", error, ...props }, ref) => {
  return (
    <RadioGroupContext.Provider value={{ size, error }}>
      <RadioGroupPrimitive.Root className={cn("grid gap-3", className)} {...props} ref={ref} />
    </RadioGroupContext.Provider>
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

export interface RadioGroupItemProps
  extends
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    VariantProps<typeof radioItemVariants> {}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, size: sizeProp, error: errorProp, ...props }, ref) => {
  const context = React.useContext(RadioGroupContext);
  const size = sizeProp ?? context.size ?? "default";
  const error = errorProp ?? context.error ?? false;
  const dotSize = dotSizes[size];

  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(radioItemVariants({ size, error }), className)}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <div
          className={cn(
            "rounded-full bg-[var(--radio-dot)]",
            "animate-[radio-dot-in_200ms_cubic-bezier(0.25,0.1,0.25,1)_forwards]",
            dotSize
          )}
        />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

/**
 * RadioGroupItemWithLabel - Radio item with adjacent label and optional description
 *
 * Features:
 * - 8px gap between radio and label
 * - Label: text-body, foreground-default
 * - Description: text-caption, foreground-muted
 * - Supports disabled state
 */
interface RadioGroupItemWithLabelProps extends Omit<
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
  "children"
> {
  /** Label text displayed next to the radio */
  label: string;
  /** Optional description text below the label */
  description?: string;
  /** Custom class for the label */
  labelClassName?: string;
  /** Size variant */
  size?: "sm" | "default" | "lg";
  /** Show error state */
  error?: boolean;
}

const RadioGroupItemWithLabel = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemWithLabelProps
>(
  (
    {
      className,
      label,
      description,
      labelClassName,
      id,
      size: sizeProp,
      error: errorProp,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const radioId = id || generatedId;
    const context = React.useContext(RadioGroupContext);
    const size = sizeProp ?? context.size ?? "default";
    const error = errorProp ?? context.error ?? false;

    return (
      <div className={cn("flex items-start gap-2", className)}>
        <RadioGroupItem
          ref={ref}
          id={radioId}
          size={size}
          error={error}
          disabled={disabled}
          className={size === "sm" ? "mt-0.5" : size === "lg" ? "mt-0" : "mt-0.5"}
          {...props}
        />
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <label
            htmlFor={radioId}
            className={cn(
              "cursor-pointer select-none text-body leading-6",
              disabled ? "text-[var(--foreground-disabled)]" : "text-[var(--foreground-default)]",
              error && !disabled && "text-[var(--foreground-error)]",
              labelClassName
            )}
          >
            {label}
          </label>
          {description && (
            <span
              className={cn(
                "text-caption leading-5",
                disabled ? "text-[var(--foreground-disabled)]" : "text-[var(--foreground-muted)]"
              )}
            >
              {description}
            </span>
          )}
        </div>
      </div>
    );
  }
);

RadioGroupItemWithLabel.displayName = "RadioGroupItemWithLabel";

/**
 * RadioGroupCard - Radio item styled as a selectable card
 *
 * Features:
 * - Full card is clickable
 * - Visual highlight when selected
 * - Supports description and icons
 * - Useful for option selection with more context
 */
interface RadioGroupCardProps extends Omit<
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
  "children"
> {
  /** Label text */
  label: string;
  /** Description text */
  description?: string;
  /** Optional icon/element to display */
  icon?: React.ReactNode;
  /** Size variant */
  size?: "sm" | "default" | "lg";
  /** Show error state */
  error?: boolean;
}

const RadioGroupCard = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupCardProps
>(
  (
    {
      className,
      label,
      description,
      icon,
      id,
      size: sizeProp,
      error: errorProp,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const radioId = id || generatedId;
    const context = React.useContext(RadioGroupContext);
    const size = sizeProp ?? context.size ?? "default";
    const error = errorProp ?? context.error ?? false;

    return (
      <div
        className={cn(
          "relative flex cursor-pointer gap-3 rounded-lg border p-3",
          "ease-default transition-all duration-normal",
          "hover:bg-[var(--background-interactive-hover)]",
          error
            ? "border-[var(--radio-border-error)] hover:border-[var(--primitive-red-600)]"
            : "border-[var(--border-default)] hover:border-[var(--border-interactive-hover)]",
          "has-[[data-state=checked]]:border-[var(--radio-border-checked)]",
          disabled && "cursor-not-allowed opacity-50 hover:bg-transparent",
          className
        )}
      >
        <RadioGroupItem
          ref={ref}
          id={radioId}
          size={size}
          error={error}
          disabled={disabled}
          className="mt-0.5"
          {...props}
        />
        <label
          htmlFor={radioId}
          className={cn("flex-1 cursor-pointer select-none", disabled && "cursor-not-allowed")}
        >
          <div className="flex items-center gap-2">
            {icon && (
              <span
                className={cn(
                  "shrink-0",
                  disabled
                    ? "text-[var(--foreground-disabled)]"
                    : "text-[var(--foreground-default)]"
                )}
              >
                {icon}
              </span>
            )}
            <span
              className={cn(
                "text-body font-medium",
                disabled ? "text-[var(--foreground-disabled)]" : "text-[var(--foreground-default)]",
                error && !disabled && "text-[var(--foreground-error)]"
              )}
            >
              {label}
            </span>
          </div>
          {description && (
            <p
              className={cn(
                "mt-1 text-caption",
                disabled ? "text-[var(--foreground-disabled)]" : "text-[var(--foreground-muted)]"
              )}
            >
              {description}
            </p>
          )}
        </label>
      </div>
    );
  }
);

RadioGroupCard.displayName = "RadioGroupCard";

/**
 * RadioGroupWithLabel - Complete radio group with label, helper text, and error handling
 *
 * Features:
 * - Group label with optional required indicator
 * - Helper text for context
 * - Error state with message
 * - Consistent spacing
 */
interface RadioGroupWithLabelProps extends React.ComponentPropsWithoutRef<
  typeof RadioGroupPrimitive.Root
> {
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
  /** Size variant for all items */
  size?: "sm" | "default" | "lg";
}

const RadioGroupWithLabel = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupWithLabelProps
>(
  (
    {
      className,
      label,
      helperText,
      error,
      errorMessage,
      required,
      size = "default",
      children,
      ...props
    },
    ref
  ) => {
    const groupId = React.useId();

    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <div className="space-y-1">
            <label
              id={`${groupId}-label`}
              className={cn(
                "text-body-strong font-medium",
                error ? "text-[var(--foreground-error)]" : "text-[var(--foreground-default)]"
              )}
            >
              {label}
              {required && <span className="ml-0.5 text-[var(--foreground-error)]">*</span>}
            </label>
            {helperText && !errorMessage && (
              <p className="text-caption text-[var(--foreground-muted)]">{helperText}</p>
            )}
          </div>
        )}
        <RadioGroup
          ref={ref}
          size={size}
          error={error}
          aria-labelledby={label ? `${groupId}-label` : undefined}
          aria-describedby={
            errorMessage ? `${groupId}-error` : helperText ? `${groupId}-description` : undefined
          }
          {...props}
        >
          {children}
        </RadioGroup>
        {errorMessage && error && (
          <p id={`${groupId}-error`} className="text-caption text-[var(--foreground-error)]">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

RadioGroupWithLabel.displayName = "RadioGroupWithLabel";

export { RadioGroup, RadioGroupItem, RadioGroupItemWithLabel, RadioGroupCard, RadioGroupWithLabel };
