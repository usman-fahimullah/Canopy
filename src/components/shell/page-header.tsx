"use client";

import { cn } from "@/lib/utils";
import { useShell } from "@/lib/shell/shell-context";
import { ShellNotificationBell } from "./notification-bell";

interface PageHeaderProps {
  /** Page title displayed in the header */
  title: string;
  /** Optional right-aligned actions (buttons, links, etc.) */
  actions?: React.ReactNode;
  /** Additional className for the header container */
  className?: string;
}

/**
 * Shared 108px header bar for all shell pages.
 * Includes notification bell on the right side.
 */
export function PageHeader({ title, actions, className }: PageHeaderProps) {
  const { currentShell } = useShell();

  return (
    <div
      className={cn(
        "flex h-[108px] items-center justify-between border-b border-[var(--shell-header-border)] bg-[var(--shell-header-bg)] px-8 lg:px-12",
        className
      )}
    >
      <h1 className="text-heading-md font-medium text-[var(--foreground-default)]">{title}</h1>
      <div className="flex items-center gap-3">
        {actions}
        <ShellNotificationBell shell={currentShell} />
      </div>
    </div>
  );
}
