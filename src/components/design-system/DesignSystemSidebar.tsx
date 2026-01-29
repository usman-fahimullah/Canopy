"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronRight } from "@/components/Icons";
import { designSystemNav, isPathActive, type NavItem } from "@/lib/design-system-nav";

export function DesignSystemSidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([
    "colors",
    "typography",
    "buttons",
    "form-controls",
    "data-display",
    "overlays",
    "navigation",
  ]);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const renderNavItem = (item: NavItem) => {
    const isActive = isPathActive(item.href, pathname);
    const hasActiveChild = item.children?.some((child) =>
      isPathActive(child.href, pathname)
    );

    return (
      <li key={item.id}>
        {item.children ? (
          <>
            <div className="flex items-center">
              <Link
                href={item.href}
                className={cn(
                  "flex-1 px-3 py-2 rounded-lg text-body-sm transition-colors",
                  "hover:bg-background-interactive-hover",
                  isActive || hasActiveChild
                    ? "text-foreground-brand font-medium"
                    : "text-foreground"
                )}
              >
                {item.label}
              </Link>
              <button
                onClick={() => toggleExpand(item.id)}
                className="p-2 rounded-lg hover:bg-background-interactive-hover transition-colors"
                aria-label={expandedItems.includes(item.id) ? "Collapse" : "Expand"}
              >
                <ChevronRight
                  className={cn(
                    "w-4 h-4 transition-transform text-foreground-muted",
                    expandedItems.includes(item.id) && "rotate-90"
                  )}
                />
              </button>
            </div>
            {expandedItems.includes(item.id) && (
              <ul className="ml-3 mt-1 space-y-1 border-l border-border pl-3">
                {item.children.map((child) => {
                  const childActive = isPathActive(child.href, pathname);
                  return (
                    <li key={child.id}>
                      <Link
                        href={child.href}
                        className={cn(
                          "block px-3 py-1.5 rounded-lg text-caption transition-colors",
                          "hover:bg-background-interactive-hover",
                          childActive
                            ? "text-foreground-brand font-medium bg-background-interactive-selected"
                            : "text-foreground-muted"
                        )}
                      >
                        {child.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        ) : (
          <Link
            href={item.href}
            className={cn(
              "block px-3 py-2 rounded-lg text-body-sm transition-colors",
              "hover:bg-background-interactive-hover",
              isActive
                ? "text-foreground-brand font-medium bg-background-interactive-selected"
                : "text-foreground"
            )}
          >
            {item.label}
          </Link>
        )}
      </li>
    );
  };

  return (
    <nav className="sticky top-24 h-fit max-h-[calc(100vh-6rem)] overflow-y-auto pr-4">
      {designSystemNav.map((section) => (
        <div key={section.title} className="mb-6">
          <h2 className="text-caption-strong text-foreground-muted uppercase tracking-wide mb-3 px-3">
            {section.title}
          </h2>
          <ul className="space-y-1">{section.items.map(renderNavItem)}</ul>
        </div>
      ))}
    </nav>
  );
}
