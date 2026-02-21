"use client";

import { usePathname } from "next/navigation";
import { getSettingsPageLabel } from "./settings-sidebar";

/**
 * Contextual breadcrumb title for the settings PageHeader.
 *
 * Renders "Settings / {Page Name}" so users always know which
 * settings page they're on. Extracted as a client component because
 * the layout is a server component and usePathname() requires "use client".
 */
export function SettingsPageTitle() {
  const pathname = usePathname();
  const pageLabel = getSettingsPageLabel(pathname);

  return (
    <div className="flex items-center gap-2">
      <h1 className="text-heading-md font-medium text-[var(--foreground-default)]">Settings</h1>
      {pageLabel && (
        <>
          <span className="text-heading-md font-medium text-[var(--foreground-subtle)]">/</span>
          <span className="text-heading-md font-medium text-[var(--foreground-muted)]">
            {pageLabel}
          </span>
        </>
      )}
    </div>
  );
}
