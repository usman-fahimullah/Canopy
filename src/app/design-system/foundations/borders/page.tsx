"use client";

import React from "react";
import { ComponentCard } from "@/components/design-system/ComponentSection";
import { PageNavigation } from "@/components/design-system/PageNavigation";

export default function BordersPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-heading-lg text-foreground mb-2">Borders & Radius</h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          Border radius tokens for consistent corner rounding across components.
        </p>
      </div>

      {/* Base Radius */}
      <ComponentCard title="Base Radius Scale" description="Core border radius values.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-500 rounded-none" />
            <div>
              <code className="text-caption font-mono text-foreground-muted">rounded-none</code>
              <p className="text-caption-sm text-foreground-muted">0px</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-500 rounded-sm" />
            <div>
              <code className="text-caption font-mono text-foreground-muted">rounded-sm</code>
              <p className="text-caption-sm text-foreground-muted">4px</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-500 rounded-md" />
            <div>
              <code className="text-caption font-mono text-foreground-muted">rounded-md</code>
              <p className="text-caption-sm text-foreground-muted">8px</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-500 rounded-lg" />
            <div>
              <code className="text-caption font-mono text-foreground-muted">rounded-lg</code>
              <p className="text-caption-sm text-foreground-muted">12px</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-500 rounded-xl" />
            <div>
              <code className="text-caption font-mono text-foreground-muted">rounded-xl</code>
              <p className="text-caption-sm text-foreground-muted">16px</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-500 rounded-2xl" />
            <div>
              <code className="text-caption font-mono text-foreground-muted">rounded-2xl</code>
              <p className="text-caption-sm text-foreground-muted">24px</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-500 rounded-full" />
            <div>
              <code className="text-caption font-mono text-foreground-muted">rounded-full</code>
              <p className="text-caption-sm text-foreground-muted">9999px</p>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Semantic Radius */}
      <ComponentCard
        title="Semantic Radius Aliases"
        description="Purpose-specific border radius tokens."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-3 p-3 bg-background-muted rounded-lg">
            <div className="w-10 h-10 bg-primary-500 rounded-card" />
            <div>
              <code className="text-caption font-mono text-foreground-muted">rounded-card</code>
              <p className="text-caption-sm text-foreground-muted">16px (xl)</p>
              <p className="text-caption-sm text-foreground-subtle">Card containers</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-background-muted rounded-lg">
            <div className="w-10 h-10 bg-primary-500 rounded-button" />
            <div>
              <code className="text-caption font-mono text-foreground-muted">rounded-button</code>
              <p className="text-caption-sm text-foreground-muted">12px (lg)</p>
              <p className="text-caption-sm text-foreground-subtle">Buttons, CTAs</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-background-muted rounded-lg">
            <div className="w-10 h-10 bg-primary-500 rounded-input" />
            <div>
              <code className="text-caption font-mono text-foreground-muted">rounded-input</code>
              <p className="text-caption-sm text-foreground-muted">8px (md)</p>
              <p className="text-caption-sm text-foreground-subtle">Form inputs</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-background-muted rounded-lg">
            <div className="w-10 h-10 bg-primary-500 rounded-chip" />
            <div>
              <code className="text-caption font-mono text-foreground-muted">rounded-chip</code>
              <p className="text-caption-sm text-foreground-muted">12px (lg)</p>
              <p className="text-caption-sm text-foreground-subtle">Chips, tags</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-background-muted rounded-lg">
            <div className="w-10 h-10 bg-primary-500 rounded-badge" />
            <div>
              <code className="text-caption font-mono text-foreground-muted">rounded-badge</code>
              <p className="text-caption-sm text-foreground-muted">9999px (full)</p>
              <p className="text-caption-sm text-foreground-subtle">Pill badges</p>
            </div>
          </div>
        </div>
      </ComponentCard>

      <PageNavigation currentPath="/design-system/foundations/borders" />
    </div>
  );
}
