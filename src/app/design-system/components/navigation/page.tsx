"use client";

import React from "react";
import Link from "next/link";
import { PageNavigation } from "@/components/design-system/PageNavigation";
import { ArrowRight } from "@/components/Icons";

const navigationComponents = [
  {
    name: "Tabs",
    href: "/design-system/components/tabs",
    description: "Switch between related content sections",
  },
  {
    name: "Breadcrumbs",
    href: "/design-system/components/breadcrumbs",
    description: "Show navigation hierarchy",
  },
  {
    name: "Pagination",
    href: "/design-system/components/pagination",
    description: "Navigate through paginated content",
  },
  {
    name: "Dropdown Menu",
    href: "/design-system/components/dropdown-menu",
    description: "Contextual actions menu",
  },
];

export default function NavigationPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Navigation
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          Components for navigating between pages, sections, and content within the
          application.
        </p>
      </div>

      {/* Component Grid */}
      <div id="components" className="grid gap-4 sm:grid-cols-2">
        {navigationComponents.map((component) => (
          <Link
            key={component.href}
            href={component.href}
            className="group p-4 border border-border rounded-lg hover:border-primary-300 hover:bg-background-subtle transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-body-strong text-foreground group-hover:text-primary-600 transition-colors">
                  {component.name}
                </h3>
                <p className="text-body-sm text-foreground-muted mt-1">
                  {component.description}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-foreground-muted group-hover:text-primary-600 transition-colors flex-shrink-0 mt-1" />
            </div>
          </Link>
        ))}
      </div>

      {/* Guidelines */}
      <div id="guidelines" className="space-y-6">
        <h2 className="text-heading-md text-foreground">Guidelines</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-4 border border-semantic-success/30 rounded-lg bg-semantic-success/5">
            <h3 className="text-body-strong text-semantic-success mb-3">Do</h3>
            <ul className="space-y-2 text-body-sm text-foreground-muted">
              <li className="flex gap-2">
                <span className="text-semantic-success">✓</span>
                Use tabs for related content at the same level
              </li>
              <li className="flex gap-2">
                <span className="text-semantic-success">✓</span>
                Show breadcrumbs for deep navigation hierarchies
              </li>
              <li className="flex gap-2">
                <span className="text-semantic-success">✓</span>
                Provide clear page indicators in pagination
              </li>
              <li className="flex gap-2">
                <span className="text-semantic-success">✓</span>
                Group related actions in dropdown menus
              </li>
            </ul>
          </div>
          <div className="p-4 border border-semantic-error/30 rounded-lg bg-semantic-error/5">
            <h3 className="text-body-strong text-semantic-error mb-3">Don&apos;t</h3>
            <ul className="space-y-2 text-body-sm text-foreground-muted">
              <li className="flex gap-2">
                <span className="text-semantic-error">✗</span>
                Use too many tabs (max 5-6)
              </li>
              <li className="flex gap-2">
                <span className="text-semantic-error">✗</span>
                Use breadcrumbs for flat navigation
              </li>
              <li className="flex gap-2">
                <span className="text-semantic-error">✗</span>
                Hide critical actions in dropdown menus
              </li>
              <li className="flex gap-2">
                <span className="text-semantic-error">✗</span>
                Mix navigation patterns inconsistently
              </li>
            </ul>
          </div>
        </div>
      </div>

      <PageNavigation currentPath="/design-system/components/navigation" />
    </div>
  );
}
