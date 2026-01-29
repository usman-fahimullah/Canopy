"use client";

import React from "react";
import { ComponentCard } from "@/components/design-system/ComponentSection";
import { PageNavigation } from "@/components/design-system/PageNavigation";

export default function SpacingPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-heading-lg text-foreground mb-2">Spacing</h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          Consistent spacing scale based on a 4px base unit. Use these values for margins,
          padding, and gaps.
        </p>
      </div>

      {/* Spacing Scale */}
      <ComponentCard>
        <div className="space-y-3">
          {[
            { name: "0", value: "0px", rem: "0" },
            { name: "1", value: "4px", rem: "0.25rem" },
            { name: "2", value: "8px", rem: "0.5rem" },
            { name: "3", value: "12px", rem: "0.75rem" },
            { name: "4", value: "16px", rem: "1rem" },
            { name: "5", value: "20px", rem: "1.25rem" },
            { name: "6", value: "24px", rem: "1.5rem" },
            { name: "8", value: "32px", rem: "2rem" },
            { name: "10", value: "40px", rem: "2.5rem" },
            { name: "12", value: "48px", rem: "3rem" },
            { name: "16", value: "64px", rem: "4rem" },
            { name: "20", value: "80px", rem: "5rem" },
            { name: "24", value: "96px", rem: "6rem" },
          ].map(({ name, value, rem }) => (
            <div key={name} className="flex items-center gap-4">
              <code className="text-caption font-mono bg-background-muted px-2 py-1 rounded w-16 text-center">
                p-{name}
              </code>
              <div className="w-20 text-caption text-foreground-muted">{value}</div>
              <div className="flex-1 h-6 bg-background-muted rounded overflow-hidden">
                <div className="h-full bg-primary-400" style={{ width: value }} />
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* Usage Examples */}
      <ComponentCard title="Usage Examples" description="Common spacing patterns in components.">
        <div className="space-y-6">
          <div>
            <h4 className="text-body-strong text-foreground mb-3">Component Padding</h4>
            <div className="flex flex-wrap gap-4">
              <div className="p-2 bg-primary-100 rounded border border-primary-300">
                <code className="text-caption">p-2 (8px)</code>
              </div>
              <div className="p-3 bg-primary-100 rounded border border-primary-300">
                <code className="text-caption">p-3 (12px)</code>
              </div>
              <div className="p-4 bg-primary-100 rounded border border-primary-300">
                <code className="text-caption">p-4 (16px)</code>
              </div>
              <div className="p-6 bg-primary-100 rounded border border-primary-300">
                <code className="text-caption">p-6 (24px)</code>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-body-strong text-foreground mb-3">Stack Spacing (gap)</h4>
            <div className="flex items-start gap-8">
              <div className="flex flex-col gap-2">
                <div className="h-8 w-24 bg-primary-400 rounded"></div>
                <div className="h-8 w-24 bg-primary-400 rounded"></div>
                <div className="h-8 w-24 bg-primary-400 rounded"></div>
                <code className="text-caption text-foreground-muted">gap-2 (8px)</code>
              </div>
              <div className="flex flex-col gap-4">
                <div className="h-8 w-24 bg-primary-400 rounded"></div>
                <div className="h-8 w-24 bg-primary-400 rounded"></div>
                <div className="h-8 w-24 bg-primary-400 rounded"></div>
                <code className="text-caption text-foreground-muted">gap-4 (16px)</code>
              </div>
              <div className="flex flex-col gap-6">
                <div className="h-8 w-24 bg-primary-400 rounded"></div>
                <div className="h-8 w-24 bg-primary-400 rounded"></div>
                <div className="h-8 w-24 bg-primary-400 rounded"></div>
                <code className="text-caption text-foreground-muted">gap-6 (24px)</code>
              </div>
            </div>
          </div>
        </div>
      </ComponentCard>

      <PageNavigation currentPath="/design-system/foundations/spacing" />
    </div>
  );
}
