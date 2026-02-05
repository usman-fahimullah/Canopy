"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Info, CheckCircle, Warning, XCircle } from "@phosphor-icons/react";

/**
 * Input component based on Figma Design (5909:10500)
 *
 * Figma Specs:
 * - Container: bg neutral-100 (#faf9f7), border neutral-200 (#f2ede9), 8px radius, 16px padding
 * - Text: 18px font, black text
 * - Placeholder: neutral-600 (#7a7671)
 * - Focus: green-600 (#3ba36f) border, neutral-100 background
 * - With left icon: icon 24px, gap 8px, icon color neutral-600
 * - With right icon: icon 16px, gap 8px, icon color green-800
 *
 * States: Default, Focused, Filled, Error, Success, Disabled
 * Sizes: Default, Large (for prominent form fields)
 *
 * Validation Messages (ContextualAlerts):
 * - Error/Critical: red-500 (#ff5c5c) icon + text
 * - Success: green-600 (#3ba36f) icon + text
 * - Info: neutral-700 (#3d3a37) icon + text
 * - Warning: orange-400 (#ff8547) icon + text
 */
const inputVariants = cva(
  [
    "flex w-full rounded-lg border",
    "bg-[var(--input-background)]",
    "border-[var(--input-border)]",
    "text-lg text-[var(--input-foreground)]",
    "placeholder:text-[var(--input-foreground-placeholder)]",
    "transition-all duration-normal ease-default",
    "focus-visible:outline-none focus-visible:border-[var(--input-border-focus)] focus-visible:hover:border-[var(--input-border-focus)]",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "file:border-0 file:bg-transparent file:text-body-sm file:font-medium",
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
        // Dashed border — for inline task inputs in goal modals
        dashed: [
          "border-dashed",
          "border-[var(--border-muted)]",
          "bg-transparent",
          "hover:border-[var(--border-emphasis)]",
          "focus-visible:border-solid",
          "focus-visible:bg-[var(--input-background)]",
        ],
        // Large text with only a dashed bottom border — for goal title inputs
        "dashed-title": [
          "border-0 border-b-2 border-dashed",
          "border-[var(--border-muted)]",
          "bg-transparent",
          "rounded-none",
          "text-heading-sm font-bold",
          "hover:border-[var(--border-emphasis)]",
          "focus-visible:border-solid",
        ],
      },
      inputSize: {
        default: "p-4",
        lg: "p-4 text-lg",
        sm: "p-3 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
);

export interface InputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  /** Error state - shows red border and styling */
  error?: boolean;
  /** Success state - shows green border */
  success?: boolean;
  /** Left addon element (icon or text) - rendered at 24px */
  leftAddon?: React.ReactNode;
  /** Right addon element (icon or text) - rendered at 16px */
  rightAddon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, variant, inputSize, error, success, leftAddon, rightAddon, ...props },
    ref
  ) => {
    // Determine effective variant based on state props
    const effectiveVariant = error ? "error" : success ? "success" : variant;

    // If we have addons, wrap the input in a styled container
    // Figma: left icon 24px, right icon 16px, gap 8px
    if (leftAddon || rightAddon) {
      return (
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg border",
            "bg-[var(--input-background)]",
            "border-[var(--input-border)]",
            "p-4",
            "ease-default transition-all duration-normal",
            "hover:border-[var(--input-border-hover)]",
            "focus-within:border-[var(--input-border-focus)] focus-within:hover:border-[var(--input-border-focus)]",
            error &&
              "border-[var(--input-border-error)] focus-within:border-[var(--input-border-error)] hover:border-[var(--input-border-error)]",
            success &&
              "border-[var(--input-border-success)] hover:border-[var(--input-border-success)]",
            className
          )}
        >
          {leftAddon && (
            <div className="flex items-center text-[var(--foreground-subtle)] [&>svg]:h-6 [&>svg]:w-6">
              {leftAddon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex-1 bg-transparent text-lg leading-6 text-[var(--input-foreground)]",
              "placeholder:text-[var(--input-foreground-placeholder)]",
              "outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
            ref={ref}
            aria-invalid={error ? "true" : undefined}
            {...props}
          />
          {rightAddon && (
            <div className="flex items-center text-[var(--foreground-brand-emphasis)] [&>svg]:h-4 [&>svg]:w-4">
              {rightAddon}
            </div>
          )}
        </div>
      );
    }

    return (
      <input
        type={type}
        className={cn(
          inputVariants({ variant: effectiveVariant, inputSize }),
          "leading-6",
          className
        )}
        ref={ref}
        aria-invalid={error ? "true" : undefined}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

/**
 * InputMessage - Contextual alert message for form fields
 * Based on Figma Design (5909:10500 - ContextualAlerts)
 *
 * Figma Specs:
 * - Container: flex, gap 8px, py-1 (4px)
 * - Icon: 16px (rendered at 18px in Figma but appears as 16px)
 * - Text: 14px font, 20px line-height
 *
 * Status colors:
 * - Critical/Error: red-500 (#ff5c5c)
 * - Success: green-600 (#3ba36f)
 * - Info: neutral-700 (#3d3a37)
 * - Warning: orange-400 (#ff8547)
 */
export type InputMessageStatus = "error" | "success" | "info" | "warning";

export interface InputMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The status/type of the message */
  status?: InputMessageStatus;
  /** The message content */
  children: React.ReactNode;
}

const statusConfig: Record<InputMessageStatus, { icon: React.ElementType; className: string }> = {
  error: {
    icon: XCircle,
    className: "text-[var(--foreground-error)]",
  },
  success: {
    icon: CheckCircle,
    className: "text-[var(--foreground-success)]",
  },
  info: {
    icon: Info,
    className: "text-[var(--foreground-muted)]",
  },
  warning: {
    icon: Warning,
    className: "text-[var(--foreground-warning)]",
  },
};

const InputMessage = React.forwardRef<HTMLDivElement, InputMessageProps>(
  ({ className, status = "info", children, ...props }, ref) => {
    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <div
        ref={ref}
        className={cn(
          // Figma: flex, gap 8px, py-1 (4px), rounded-sm
          "flex items-start gap-2 rounded-sm px-0 py-1",
          className
        )}
        role={status === "error" ? "alert" : "status"}
        {...props}
      >
        {/* Figma: 16px icon container */}
        <div className={cn("flex size-4 shrink-0 items-center justify-center", config.className)}>
          <Icon weight="fill" className="h-[18px] w-[18px]" />
        </div>
        {/* Figma: 14px font, 20px line-height */}
        <p className={cn("flex-1 text-sm leading-5", config.className)}>{children}</p>
      </div>
    );
  }
);

InputMessage.displayName = "InputMessage";

/**
 * InputWithMessage - Convenience wrapper combining Input with InputMessage
 *
 * Use this when you want an input with a validation/helper message below it.
 */
export interface InputWithMessageProps extends InputProps {
  /** Message to display below the input */
  message?: string;
  /** Status of the message (affects styling and icon) */
  messageStatus?: InputMessageStatus;
}

const InputWithMessage = React.forwardRef<HTMLInputElement, InputWithMessageProps>(
  ({ message, messageStatus = "info", error, success, ...inputProps }, ref) => {
    // Determine message status from input state if not explicitly set
    const effectiveStatus = error ? "error" : success ? "success" : messageStatus;

    return (
      <div className="flex flex-col gap-0">
        <Input ref={ref} error={error} success={success} {...inputProps} />
        {message && <InputMessage status={effectiveStatus}>{message}</InputMessage>}
      </div>
    );
  }
);

InputWithMessage.displayName = "InputWithMessage";

export { Input, InputMessage, InputWithMessage, inputVariants };
