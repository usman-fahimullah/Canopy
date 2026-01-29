"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight, Home } from "@/components/Icons";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  /** Show home icon as first item */
  showHome?: boolean;
  /** Home href - defaults to "/" */
  homeHref?: string;
  /** Separator between items */
  separator?: React.ReactNode;
  /** Maximum items to show before collapsing */
  maxItems?: number;
}

const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
  (
    {
      className,
      items,
      showHome = false,
      homeHref = "/",
      separator,
      maxItems,
      ...props
    },
    ref
  ) => {
    const renderSeparator = () =>
      separator || <ChevronRight className="h-4 w-4 text-foreground-subtle flex-shrink-0" />;

    // Collapse items if maxItems is set
    let displayItems = items;
    let collapsed = false;

    if (maxItems && items.length > maxItems) {
      const firstItems = items.slice(0, 1);
      const lastItems = items.slice(-Math.max(1, maxItems - 2));
      displayItems = [...firstItems, { label: "..." }, ...lastItems];
      collapsed = true;
    }

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={cn("flex items-center", className)}
        {...props}
      >
        <ol className="flex items-center gap-2 text-body-sm">
          {showHome && (
            <>
              <li>
                <Link
                  href={homeHref}
                  className="flex items-center text-foreground-muted hover:text-foreground transition-colors"
                >
                  <Home className="h-4 w-4" />
                  <span className="sr-only">Home</span>
                </Link>
              </li>
              {items.length > 0 && (
                <li aria-hidden="true" className="flex items-center">
                  {renderSeparator()}
                </li>
              )}
            </>
          )}

          {displayItems.map((item, index) => {
            const isLast = index === displayItems.length - 1;
            const isCollapsed = collapsed && item.label === "...";

            return (
              <React.Fragment key={index}>
                <li className="flex items-center">
                  {isCollapsed ? (
                    <span className="text-foreground-subtle px-1">...</span>
                  ) : isLast || !item.href ? (
                    <span
                      className={cn(
                        "font-medium",
                        isLast ? "text-foreground" : "text-foreground-muted"
                      )}
                      aria-current={isLast ? "page" : undefined}
                    >
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-foreground-muted hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
                {!isLast && (
                  <li aria-hidden="true" className="flex items-center">
                    {renderSeparator()}
                  </li>
                )}
              </React.Fragment>
            );
          })}
        </ol>
      </nav>
    );
  }
);

Breadcrumbs.displayName = "Breadcrumbs";

/**
 * Individual breadcrumb item for custom usage
 */
const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement> & {
    active?: boolean;
  }
>(({ className, active, ...props }, ref) => (
  <li
    ref={ref}
    className={cn(
      "flex items-center text-body-sm",
      active ? "text-foreground font-medium" : "text-foreground-muted",
      className
    )}
    aria-current={active ? "page" : undefined}
    {...props}
  />
));
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    asChild?: boolean;
  }
>(({ className, ...props }, ref) => (
  <a
    ref={ref}
    className={cn(
      "text-foreground-muted hover:text-foreground transition-colors",
      className
    )}
    {...props}
  />
));
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbSeparator = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, children, ...props }, ref) => (
  <li
    ref={ref}
    aria-hidden="true"
    className={cn("flex items-center", className)}
    {...props}
  >
    {children || <ChevronRight className="h-4 w-4 text-foreground-subtle" />}
  </li>
));
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

export {
  Breadcrumbs,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
};
