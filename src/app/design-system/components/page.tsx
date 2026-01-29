"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { componentsNav } from "@/lib/design-system-nav";

export default function ComponentsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-heading-lg text-foreground mb-2">Components</h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          A comprehensive library of UI components for building the Canopy ATS interface.
          All components are accessible, responsive, and follow consistent patterns.
        </p>
      </div>

      {/* Component Categories */}
      <div className="space-y-8">
        {/* Core Components */}
        <section>
          <h2 className="text-heading-sm text-foreground mb-4">Core Components</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {componentsNav.slice(0, 6).map((item) => (
              <ComponentLink key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* ATS-Specific */}
        <section>
          <h2 className="text-heading-sm text-foreground mb-4">ATS Components</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {componentsNav.slice(6, 10).map((item) => (
              <ComponentLink key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Advanced Components */}
        <section>
          <h2 className="text-heading-sm text-foreground mb-4">Advanced Components</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {componentsNav.slice(10).map((item) => (
              <ComponentLink key={item.id} item={item} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function ComponentLink({ item }: { item: typeof componentsNav[number] }) {
  return (
    <Link
      href={item.href}
      className={cn(
        "group p-5 rounded-xl border border-border bg-surface",
        "hover:border-primary-300 hover:shadow-md transition-all duration-200"
      )}
    >
      <h3 className="text-body-strong font-medium text-foreground group-hover:text-primary-600 transition-colors">
        {item.label}
      </h3>
      {item.description && (
        <p className="text-caption text-foreground-muted mt-1">{item.description}</p>
      )}
      {item.children && (
        <div className="flex flex-wrap gap-1 mt-3">
          {item.children.slice(0, 4).map((child) => (
            <span
              key={child.id}
              className="px-2 py-0.5 text-caption-sm bg-background-muted rounded text-foreground-muted"
            >
              {child.label}
            </span>
          ))}
          {item.children.length > 4 && (
            <span className="px-2 py-0.5 text-caption-sm bg-background-muted rounded text-foreground-muted">
              +{item.children.length - 4}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
