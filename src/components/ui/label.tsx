"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-body-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  /** Mark the field as required */
  required?: boolean;
  /** Optional description text */
  description?: string;
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, children, required, description, ...props }, ref) => (
  <div className="flex flex-col gap-1">
    <LabelPrimitive.Root
      ref={ref}
      className={cn(labelVariants(), className)}
      {...props}
    >
      {children}
      {required && (
        <span className="ml-1 text-[var(--foreground-error)]" aria-hidden="true">
          *
        </span>
      )}
    </LabelPrimitive.Root>
    {description && (
      <span className="text-caption text-foreground-muted">{description}</span>
    )}
  </div>
));

Label.displayName = LabelPrimitive.Root.displayName;

export { Label, labelVariants };
