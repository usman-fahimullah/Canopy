"use client";

import React from "react";
import Link from "next/link";
import { PageNavigation } from "@/components/design-system/PageNavigation";
import { ArrowRight } from "@/components/Icons";

const dataDisplayComponents = [
  {
    name: "Badge",
    href: "/design-system/components/badge",
    description: "Status indicators and labels",
  },
  {
    name: "Avatar",
    href: "/design-system/components/avatar",
    description: "User profile images and initials",
  },
  {
    name: "Card",
    href: "/design-system/components/card",
    description: "Container for grouped content",
  },
  {
    name: "Toast",
    href: "/design-system/components/toast",
    description: "Brief notification messages",
  },
];

export default function DataDisplayPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Data Display
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          Components for displaying information, status, and notifications in a clear
          and consistent manner.
        </p>
      </div>

      {/* Component Grid */}
      <div id="components" className="grid gap-4 sm:grid-cols-2">
        {dataDisplayComponents.map((component) => (
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
                Use badges consistently for status indication
              </li>
              <li className="flex gap-2">
                <span className="text-semantic-success">✓</span>
                Provide alt text for avatar images
              </li>
              <li className="flex gap-2">
                <span className="text-semantic-success">✓</span>
                Use cards to group related content
              </li>
              <li className="flex gap-2">
                <span className="text-semantic-success">✓</span>
                Show toasts for brief, non-blocking feedback
              </li>
            </ul>
          </div>
          <div className="p-4 border border-semantic-error/30 rounded-lg bg-semantic-error/5">
            <h3 className="text-body-strong text-semantic-error mb-3">Don&apos;t</h3>
            <ul className="space-y-2 text-body-sm text-foreground-muted">
              <li className="flex gap-2">
                <span className="text-semantic-error">✗</span>
                Use too many badge colors in one view
              </li>
              <li className="flex gap-2">
                <span className="text-semantic-error">✗</span>
                Use avatars without fallback initials
              </li>
              <li className="flex gap-2">
                <span className="text-semantic-error">✗</span>
                Overload cards with too much content
              </li>
              <li className="flex gap-2">
                <span className="text-semantic-error">✗</span>
                Show multiple toasts simultaneously
              </li>
            </ul>
          </div>
        </div>
      </div>

      <PageNavigation currentPath="/design-system/components/data-display" />
    </div>
  );
}
