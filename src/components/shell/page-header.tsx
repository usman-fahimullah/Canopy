"use client";

import { cn } from "@/lib/utils";

interface PageHeaderProps {
  /** Page title displayed in the header */
  title: string;
  /** Optional right-aligned actions (buttons, links, etc.) */
  actions?: React.ReactNode;
  /** Additional className for the header container */
  className?: string;
}

/**
 * Shared 108px white header bar for all shell pages.
 * Follows the Candid dashboard pattern.
 */
export function PageHeader({ title, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex h-[108px] items-center justify-between border-b border-[var(--primitive-neutral-200)] bg-white px-8 lg:px-12",
        className
      )}
    >
      <h1 className="text-heading-md font-medium text-[var(--primitive-green-800)]">
        {title}
      </h1>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
