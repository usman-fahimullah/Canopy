"use client";

import React from "react";
import Link from "next/link";
import { PageNavigation } from "@/components/design-system/PageNavigation";
import { ArrowRight } from "@/components/Icons";

const overlayComponents = [
  {
    name: "Dialog",
    href: "/design-system/components/dialog",
    description: "Confirmation dialogs for important actions",
  },
  {
    name: "Modal",
    href: "/design-system/components/modal",
    description: "Full-featured modal with customizable content",
  },
  {
    name: "Tooltip",
    href: "/design-system/components/tooltip",
    description: "Contextual information on hover",
  },
];

export default function OverlaysPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Overlays
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          Modal dialogs, tooltips, and other overlay components for focused interactions
          that appear above the main content.
        </p>
      </div>

      {/* Component Grid */}
      <div id="components" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {overlayComponents.map((component) => (
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
                Use dialogs for confirmations and critical actions
              </li>
              <li className="flex gap-2">
                <span className="text-semantic-success">✓</span>
                Provide clear titles and descriptions in modals
              </li>
              <li className="flex gap-2">
                <span className="text-semantic-success">✓</span>
                Use tooltips for brief, supplementary information
              </li>
              <li className="flex gap-2">
                <span className="text-semantic-success">✓</span>
                Allow users to close overlays easily
              </li>
            </ul>
          </div>
          <div className="p-4 border border-semantic-error/30 rounded-lg bg-semantic-error/5">
            <h3 className="text-body-strong text-semantic-error mb-3">Don&apos;t</h3>
            <ul className="space-y-2 text-body-sm text-foreground-muted">
              <li className="flex gap-2">
                <span className="text-semantic-error">✗</span>
                Use dialogs for complex forms (use full pages)
              </li>
              <li className="flex gap-2">
                <span className="text-semantic-error">✗</span>
                Nest modals within modals
              </li>
              <li className="flex gap-2">
                <span className="text-semantic-error">✗</span>
                Put essential information only in tooltips
              </li>
              <li className="flex gap-2">
                <span className="text-semantic-error">✗</span>
                Auto-close modals during user input
              </li>
            </ul>
          </div>
        </div>
      </div>

      <PageNavigation currentPath="/design-system/components/overlays" />
    </div>
  );
}
