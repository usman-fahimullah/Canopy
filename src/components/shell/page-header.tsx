"use client";

import { cn } from "@/lib/utils";
import { useShell } from "@/lib/shell/shell-context";
import { ShellNotificationBell } from "./notification-bell";

interface PageHeaderProps {
  /** Page title (renders as h1). Ignored if children are provided. */
  title?: string;
  /** Optional right-aligned actions (buttons, links, etc.) */
  actions?: React.ReactNode;
  /** Custom content replacing the title. When provided, title is ignored. */
  children?: React.ReactNode;
  /** Make header sticky on scroll. Coordinates with mobile header offset. */
  sticky?: boolean;
  /** Show notification bell (default true). Set false to avoid duplication with mobile header bell. */
  showNotificationBell?: boolean;
  /** Additional className for the header container */
  className?: string;
}

/**
 * Shared header bar for all shell pages.
 *
 * Standard usage: pass `title` (and optional `actions`) for the default layout.
 * Custom usage: pass `children` to render arbitrary content (search bars, filters, etc.).
 * Sticky: set `sticky` to pin the header below the mobile nav on scroll.
 */
export function PageHeader({
  title,
  actions,
  children,
  sticky = false,
  showNotificationBell = true,
  className,
}: PageHeaderProps) {
  const { currentShell } = useShell();

  return (
    <div
      className={cn(
        "flex min-h-[108px] items-center justify-between border-b border-[var(--shell-header-border)] bg-[var(--shell-header-bg)] px-8 lg:px-12",
        sticky && "sticky top-14 z-30 lg:top-0",
        className
      )}
    >
      {children ?? (
        <h1 className="text-heading-md font-medium text-[var(--foreground-default)]">{title}</h1>
      )}
      <div className="flex items-center gap-3">
        {actions}
        {showNotificationBell && <ShellNotificationBell shell={currentShell} />}
      </div>
    </div>
  );
}
