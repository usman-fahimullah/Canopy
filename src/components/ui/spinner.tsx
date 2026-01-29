import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Spinner component for loading indicators
 *
 * Uses semantic tokens:
 * - foreground-brand for the spinner color
 * - foreground-muted for the track
 */

const spinnerVariants = cva(
  "inline-block animate-spin rounded-full border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]",
  {
    variants: {
      size: {
        xs: "h-3 w-3 border",
        sm: "h-4 w-4 border-2",
        md: "h-6 w-6 border-2",
        lg: "h-8 w-8 border-[3px]",
        xl: "h-12 w-12 border-4",
      },
      variant: {
        default: "text-foreground-brand",
        muted: "text-foreground-muted",
        inverse: "text-foreground-inverse",
        current: "text-current",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
);

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  /** Accessible label for screen readers */
  label?: string;
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, variant, label = "Loading", ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label={label}
        className={cn(spinnerVariants({ size, variant }), className)}
        {...props}
      >
        <span className="sr-only">{label}</span>
      </div>
    );
  }
);

Spinner.displayName = "Spinner";

// Full-page loading overlay
const LoadingOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    label?: string;
    spinnerSize?: VariantProps<typeof spinnerVariants>["size"];
  }
>(({ className, label = "Loading...", spinnerSize = "lg", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "fixed inset-0 z-modal flex flex-col items-center justify-center gap-4",
      "bg-background-default/80",
      className
    )}
    {...props}
  >
    <Spinner size={spinnerSize} />
    {label && (
      <p className="text-caption text-foreground-muted animate-pulse">
        {label}
      </p>
    )}
  </div>
));

LoadingOverlay.displayName = "LoadingOverlay";

// Inline loading indicator with text
const LoadingInline = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    label?: string;
    spinnerSize?: VariantProps<typeof spinnerVariants>["size"];
  }
>(({ className, label, spinnerSize = "sm", ...props }, ref) => (
  <div
    ref={ref}
    className={cn("inline-flex items-center gap-2", className)}
    {...props}
  >
    <Spinner size={spinnerSize} variant="current" />
    {label && <span>{label}</span>}
  </div>
));

LoadingInline.displayName = "LoadingInline";

export { Spinner, LoadingOverlay, LoadingInline, spinnerVariants };
