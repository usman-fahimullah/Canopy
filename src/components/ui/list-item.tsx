import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * ListItem Component System
 *
 * A composable list item primitive following the 3-slot pattern:
 * Leading (optional) | Content (required) | Trailing (optional)
 *
 * @figma https://www.figma.com/design/q1985VWRuwMkSc1hIqu5X9/Trails-Design-System
 * @figma-nodes 2096:14084, 5344:11043, 5345:1403
 *
 * Uses semantic tokens:
 * - background-interactive-hover for hover states
 * - background-interactive-selected for selected state
 * - foreground-default for primary text
 * - foreground-muted for secondary text
 * - foreground-subtle for meta text
 * - border-muted for dividers
 */

// ============================================
// LIST CONTAINER
// ============================================

const listVariants = cva("flex flex-col", {
  variants: {
    divided: {
      true: "divide-y divide-[var(--border-muted)]",
      false: "",
    },
    spacing: {
      none: "gap-0",
      sm: "gap-1",
      md: "gap-2",
      lg: "gap-4",
    },
  },
  defaultVariants: {
    divided: false,
    spacing: "none",
  },
});

export interface ListProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof listVariants> {}

const List = React.forwardRef<HTMLDivElement, ListProps>(
  ({ className, divided, spacing, ...props }, ref) => (
    <div
      ref={ref}
      role="list"
      className={cn(listVariants({ divided, spacing }), className)}
      {...props}
    />
  )
);

List.displayName = "List";

// ============================================
// LIST ITEM
// ============================================

const listItemVariants = cva("relative flex items-center gap-3 transition-colors", {
  variants: {
    size: {
      sm: "px-4 py-2",
      md: "px-6 py-3",
      lg: "px-6 py-4",
    },
    interactive: {
      true: "cursor-pointer hover:bg-[var(--background-interactive-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-inset",
      false: "",
    },
    selected: {
      true: "bg-[var(--background-interactive-selected)]",
      false: "",
    },
    disabled: {
      true: "opacity-50 cursor-not-allowed pointer-events-none",
      false: "",
    },
  },
  defaultVariants: {
    size: "md",
    interactive: false,
    selected: false,
    disabled: false,
  },
});

export interface ListItemProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof listItemVariants> {
  /** Render as child element (for links) */
  asChild?: boolean;
}

const ListItem = React.forwardRef<HTMLDivElement, ListItemProps>(
  ({ className, size, interactive, selected, disabled, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        role="listitem"
        data-selected={selected || undefined}
        data-disabled={disabled || undefined}
        tabIndex={interactive ? 0 : undefined}
        className={cn(listItemVariants({ size, interactive, selected, disabled }), className)}
        {...props}
      />
    );
  }
);

ListItem.displayName = "ListItem";

// ============================================
// LIST ITEM LEADING (Left Slot)
// ============================================

export interface ListItemLeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Size of the leading content area */
  size?: "sm" | "md" | "lg";
}

const ListItemLeading = React.forwardRef<HTMLDivElement, ListItemLeadingProps>(
  ({ className, size = "md", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-shrink-0 items-center justify-center",
        {
          "size-6": size === "sm",
          "size-10": size === "md",
          "size-12": size === "lg",
        },
        className
      )}
      {...props}
    />
  )
);

ListItemLeading.displayName = "ListItemLeading";

// ============================================
// LIST ITEM CONTENT (Center Slot)
// ============================================

const ListItemContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("min-w-0 flex-1 space-y-0.5", className)} {...props} />
  )
);

ListItemContent.displayName = "ListItemContent";

// ============================================
// LIST ITEM DATE BADGE
// ============================================

const ListItemDateBadge = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full bg-[var(--background-subtle)] px-2 py-1 text-caption-strong text-[var(--foreground-muted)]",
        className
      )}
      {...props}
    />
  )
);

ListItemDateBadge.displayName = "ListItemDateBadge";

// ============================================
// LIST ITEM TITLE
// ============================================

const ListItemTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("truncate text-body font-bold text-[var(--foreground-default)]", className)}
      {...props}
    />
  )
);

ListItemTitle.displayName = "ListItemTitle";

// ============================================
// LIST ITEM DESCRIPTION (Subtitle)
// ============================================

const ListItemDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("truncate text-caption text-[var(--foreground-muted)]", className)}
      {...props}
    />
  )
);

ListItemDescription.displayName = "ListItemDescription";

// ============================================
// LIST ITEM META (Dot-separated metadata)
// ============================================

export interface ListItemMetaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Separator character between items */
  separator?: string;
}

const ListItemMeta = React.forwardRef<HTMLDivElement, ListItemMetaProps>(
  ({ className, separator, children, ...props }, ref) => {
    // If separator is provided, interleave children with separator dots
    const childArray = React.Children.toArray(children);
    const separatedChildren = separator
      ? childArray.flatMap((child, index) =>
          index < childArray.length - 1
            ? [
                child,
                <span key={`sep-${index}`} className="text-[var(--foreground-subtle)]" aria-hidden>
                  {separator}
                </span>,
              ]
            : [child]
        )
      : children;

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-wrap items-center gap-1 text-caption text-[var(--foreground-muted)]",
          className
        )}
        {...props}
      >
        {separatedChildren}
      </div>
    );
  }
);

ListItemMeta.displayName = "ListItemMeta";

// ============================================
// LIST ITEM TRAILING (Right Slot)
// ============================================

const ListItemTrailing = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("ml-auto flex flex-shrink-0 items-center gap-2", className)}
      {...props}
    />
  )
);

ListItemTrailing.displayName = "ListItemTrailing";

// ============================================
// LIST ITEM TRAILING TEXT
// ============================================

const ListItemTrailingText = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-right text-caption text-[var(--foreground-default)]", className)}
      {...props}
    />
  )
);

ListItemTrailingText.displayName = "ListItemTrailingText";

// ============================================
// LIST GROUP (For grouped lists with headers)
// ============================================

const ListGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col", className)} {...props} />
  )
);

ListGroup.displayName = "ListGroup";

// ============================================
// LIST GROUP HEADER
// ============================================

const ListGroupHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-[var(--background-subtle)] px-6 py-2 text-caption-strong text-[var(--foreground-muted)]",
        className
      )}
      {...props}
    />
  )
);

ListGroupHeader.displayName = "ListGroupHeader";

// ============================================
// EXPORTS
// ============================================

export {
  List,
  listVariants,
  ListItem,
  listItemVariants,
  ListItemLeading,
  ListItemContent,
  ListItemDateBadge,
  ListItemTitle,
  ListItemDescription,
  ListItemMeta,
  ListItemTrailing,
  ListItemTrailingText,
  ListGroup,
  ListGroupHeader,
};
