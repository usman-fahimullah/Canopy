import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Container component — Trails Design System
 *
 * Generic wrapper for consistent padding, max-width, and background.
 * No visual border or shadow — that's Card's job.
 *
 * Use Container for:
 * - Page-level content constraints (padding + max-width)
 * - Background zones (subtle, muted, emphasized)
 * - Responsive padding that matches the shell layout
 *
 * Compose with Card when you need visual boundaries:
 * ```tsx
 * <Container padding="page" maxWidth="xl">
 *   <Card variant="outlined">
 *     <CardContent>...</CardContent>
 *   </Card>
 * </Container>
 * ```
 */

const containerVariants = cva("", {
  variants: {
    padding: {
      none: "",
      compact: "px-4 py-3",
      default: "px-6 py-4",
      spacious: "px-8 py-6",
      page: "px-8 py-6 lg:px-12",
    },
    background: {
      transparent: "",
      default: "bg-[var(--background-default)]",
      subtle: "bg-[var(--background-subtle)]",
      muted: "bg-[var(--background-muted)]",
      emphasized: "bg-[var(--background-emphasized)]",
      brand: "bg-[var(--background-brand-subtle)]",
    },
    maxWidth: {
      none: "",
      sm: "mx-auto max-w-screen-sm",
      md: "mx-auto max-w-screen-md",
      lg: "mx-auto max-w-screen-lg",
      xl: "mx-auto max-w-screen-xl",
    },
    rounded: {
      none: "",
      default: "rounded-[var(--radius-card)]",
      lg: "rounded-2xl",
    },
  },
  defaultVariants: {
    padding: "default",
    background: "transparent",
    maxWidth: "none",
    rounded: "none",
  },
});

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof containerVariants> {
  /** HTML element to render as */
  as?: "div" | "section" | "main" | "article" | "aside";
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, padding, background, maxWidth, rounded, as: Tag = "div", ...props }, ref) => (
    <Tag
      ref={ref}
      className={cn(containerVariants({ padding, background, maxWidth, rounded }), className)}
      {...props}
    />
  )
);
Container.displayName = "Container";

export { Container, containerVariants };
