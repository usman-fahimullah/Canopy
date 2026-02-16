import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Section component family — Trails Design System
 *
 * Semantic grouping of content with a standardized header structure.
 * Always transparent — compose with Card for visual containers.
 *
 * Replaces the manual pattern found across settings and dashboard pages:
 * ```tsx
 * // BEFORE
 * <div className="space-y-6">
 *   <div className="flex items-center justify-between">
 *     <h2 className="text-heading-sm font-medium">Title</h2>
 *     <Button>Action</Button>
 *   </div>
 *   <Card>...</Card>
 * </div>
 *
 * // AFTER
 * <Section>
 *   <SectionHeader>
 *     <SectionTitle>Title</SectionTitle>
 *     <SectionActions><Button>Action</Button></SectionActions>
 *   </SectionHeader>
 *   <SectionContent>
 *     <Card>...</Card>
 *   </SectionContent>
 * </Section>
 * ```
 */

// ---------------------------------------------------------------------------
// Section — wrapper with consistent vertical spacing
// ---------------------------------------------------------------------------

const sectionVariants = cva("flex flex-col", {
  variants: {
    spacing: {
      compact: "gap-3",
      default: "gap-4",
      spacious: "gap-6",
    },
  },
  defaultVariants: {
    spacing: "default",
  },
});

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof sectionVariants> {
  /** HTML element to render as */
  as?: "section" | "div" | "aside" | "article";
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, spacing, as: Tag = "section", ...props }, ref) => (
    <Tag
      ref={ref as React.RefCallback<HTMLElement>}
      className={cn(sectionVariants({ spacing }), className)}
      {...props}
    />
  )
);
Section.displayName = "Section";

// ---------------------------------------------------------------------------
// SectionHeader — flex row: title on left, actions on right
// ---------------------------------------------------------------------------

const SectionHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center justify-between gap-4", className)}
      {...props}
    />
  )
);
SectionHeader.displayName = "SectionHeader";

// ---------------------------------------------------------------------------
// SectionTitle — heading with optional description
// ---------------------------------------------------------------------------

export interface SectionTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Heading level */
  as?: "h1" | "h2" | "h3" | "h4";
  /** Optional description text below the title */
  description?: string;
}

const SectionTitle = React.forwardRef<HTMLHeadingElement, SectionTitleProps>(
  ({ className, as: Tag = "h2", description, children, ...props }, ref) => {
    if (description) {
      return (
        <div className="min-w-0 flex-1">
          <Tag
            ref={ref}
            className={cn(
              "text-heading-sm font-medium text-[var(--foreground-default)]",
              className
            )}
            {...props}
          >
            {children}
          </Tag>
          <p className="mt-1 text-body-sm text-[var(--foreground-muted)]">{description}</p>
        </div>
      );
    }

    return (
      <Tag
        ref={ref}
        className={cn(
          "min-w-0 text-heading-sm font-medium text-[var(--foreground-default)]",
          className
        )}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);
SectionTitle.displayName = "SectionTitle";

// ---------------------------------------------------------------------------
// SectionActions — right-aligned action container
// ---------------------------------------------------------------------------

const SectionActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex shrink-0 items-center gap-2", className)} {...props} />
  )
);
SectionActions.displayName = "SectionActions";

// ---------------------------------------------------------------------------
// SectionContent — content area wrapper
// ---------------------------------------------------------------------------

const SectionContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn(className)} {...props} />
);
SectionContent.displayName = "SectionContent";

// ---------------------------------------------------------------------------
// SectionFooter — footer with top border separator
// ---------------------------------------------------------------------------

const SectionFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("border-t border-[var(--border-default)] pt-4", className)}
      {...props}
    />
  )
);
SectionFooter.displayName = "SectionFooter";

export {
  Section,
  SectionHeader,
  SectionTitle,
  SectionActions,
  SectionContent,
  SectionFooter,
  sectionVariants,
};
