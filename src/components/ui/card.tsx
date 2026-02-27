import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Card component based on Trails Design System
 *
 * A versatile container component with optional header, content, and footer sections.
 * Supports different visual variants and sizes for different use cases.
 *
 * The `size` prop controls internal padding via a CSS custom property `--card-padding`,
 * which is inherited by sub-components (CardHeader, CardContent, CardFooter).
 */

const cardVariants = cva("bg-[var(--card-background)] text-[var(--card-foreground)] rounded-xl", {
  variants: {
    variant: {
      // Default — subtle shadow, no border. Static content container.
      default: "shadow-card",
      // Outlined — border only, for inline sections and form containers.
      outlined: "border border-[var(--card-border)]",
      // Elevated — stronger shadow for floating or modal-like content.
      elevated: "shadow-elevated",
      // Flat — no shadow or border, for nested cards or subtle containers.
      flat: "",
      // Interactive — clickable card with hover shadow and pointer cursor.
      interactive: [
        "shadow-card cursor-pointer",
        "transition-shadow duration-200",
        "hover:shadow-card-hover",
        "active:shadow-card",
      ],
      // Feature — brand-colored card with dark background and light text.
      feature: [
        "bg-[var(--card-background-feature)] text-[var(--foreground-on-emphasis)] surface-brand",
        "shadow-card",
        "transition-shadow duration-200",
        "hover:shadow-card-hover",
      ],
    },
    size: {
      sm: "[--card-padding:1rem]",
      default: "[--card-padding:1.5rem]",
      lg: "[--card-padding:2rem]",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div ref={ref} className={cn(cardVariants({ variant, size }), className)} {...props} />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-[var(--card-padding,1.5rem)]", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-heading-sm font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-body-sm text-foreground-muted", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "px-[var(--card-padding,1.5rem)] pb-[var(--card-padding,1.5rem)] pt-0",
        className
      )}
      {...props}
    />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center px-[var(--card-padding,1.5rem)] pb-[var(--card-padding,1.5rem)] pt-0",
        className
      )}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants };
