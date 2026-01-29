"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { foundationsNav } from "@/lib/design-system-nav";

export default function FoundationsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-heading-lg text-foreground mb-2">Foundations</h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          Design tokens and primitives that form the foundation of the Trails Design System.
          These values ensure consistency across all components and interfaces.
        </p>
      </div>

      {/* Grid of Foundation Items */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {foundationsNav.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              "group p-6 rounded-xl border border-border bg-surface",
              "hover:border-primary-300 hover:shadow-md transition-all duration-200"
            )}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                <FoundationIcon id={item.id} />
              </div>
              <div>
                <h2 className="text-body-strong font-medium text-foreground group-hover:text-primary-600 transition-colors">
                  {item.label}
                </h2>
                {item.description && (
                  <p className="text-caption text-foreground-muted mt-1">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function FoundationIcon({ id }: { id: string }) {
  const iconClass = "w-6 h-6 text-primary-600";

  switch (id) {
    case "colors":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
      );
    case "typography":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h8m-8 6h16"
          />
        </svg>
      );
    case "spacing":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
          />
        </svg>
      );
    case "shadows":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      );
    case "borders":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z"
          />
        </svg>
      );
    case "motion":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      );
    default:
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      );
  }
}
