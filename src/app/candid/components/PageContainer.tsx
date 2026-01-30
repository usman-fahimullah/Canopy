"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  /** Whether to use the full-width layout (no max-width constraint) */
  fullWidth?: boolean;
  /** Add padding at the bottom for mobile nav */
  withBottomPadding?: boolean;
}

/**
 * PageContainer provides consistent page structure across Candid.
 * Use this component to wrap page content for consistent spacing,
 * max-width constraints, and optional page headers.
 */
export function PageContainer({
  children,
  title,
  subtitle,
  action,
  className,
  fullWidth = false,
  withBottomPadding = true,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-[var(--background-subtle)]",
        withBottomPadding && "pb-24 lg:pb-8",
        className
      )}
    >
      <div
        className={cn(
          "px-4 py-6 sm:px-6 lg:px-8",
          !fullWidth && "mx-auto max-w-7xl"
        )}
      >
        {/* Page Header */}
        {(title || action) && (
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {title && (
                <h1 className="text-heading-md font-semibold text-foreground-default">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="mt-1 text-body text-foreground-muted">
                  {subtitle}
                </p>
              )}
            </div>
            {action && <div className="flex-shrink-0">{action}</div>}
          </div>
        )}

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
}

/**
 * PageSection provides consistent section styling within a page.
 */
interface PageSectionProps {
  children: ReactNode;
  title?: string;
  action?: ReactNode;
  className?: string;
}

export function PageSection({
  children,
  title,
  action,
  className,
}: PageSectionProps) {
  return (
    <section className={cn("mb-8", className)}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between">
          {title && (
            <h2 className="text-heading-sm font-semibold text-foreground-default">
              {title}
            </h2>
          )}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
