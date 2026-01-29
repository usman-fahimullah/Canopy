"use client";

import React from "react";
import { ComponentSection, ComponentCard } from "@/components/design-system/ComponentSection";
import { PageNavigation } from "@/components/design-system/PageNavigation";

export default function ColorsPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-heading-lg text-foreground mb-2">Colors</h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          The color system extracted from Trails Design System. All colors are defined as CSS
          custom properties for consistent usage across the application.
        </p>
      </div>

      {/* Primary Colors */}
      <ComponentCard
        id="colors-primary"
        title="Primary (Green)"
        description="Core brand color used for primary actions, links, and key UI elements."
      >
        <div className="space-y-2">
          {[
            { shade: 100, hex: "#EAFFE0", usage: "Subtle backgrounds, selected states" },
            { shade: 200, hex: "#DCFAC8", usage: "Light backgrounds, hover states" },
            { shade: 300, hex: "#BCEBB2", usage: "Borders, dividers" },
            { shade: 400, hex: "#8EE07E", usage: "Icons, decorative" },
            { shade: 500, hex: "#5ECC70", usage: "Success states, positive indicators" },
            { shade: 600, hex: "#3BA36F", usage: "Primary buttons, links" },
            { shade: 700, hex: "#0E5249", usage: "Active states, emphasis" },
            { shade: 800, hex: "#0A3D2C", usage: "Navigation, high contrast text" },
          ].map(({ shade, hex, usage }) => (
            <div key={shade} className="flex items-center gap-4">
              <div
                className="w-16 h-10 rounded-md shrink-0"
                style={{ backgroundColor: `var(--color-primary-${shade})` }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <code className="text-caption font-mono text-foreground-muted">
                    primary-{shade}
                  </code>
                  <code className="text-caption-sm font-mono text-foreground-muted">{hex}</code>
                </div>
                <p className="text-caption-sm text-foreground-muted truncate">{usage}</p>
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* Neutral Colors */}
      <ComponentCard
        id="colors-neutral"
        title="Neutral"
        description="Foundation colors for backgrounds, text, and borders."
      >
        <div className="space-y-2">
          {[
            { shade: "white", hex: "#FFFFFF", usage: "Card backgrounds, modals" },
            { shade: 100, hex: "#FAF9F7", usage: "Page backgrounds, subtle fills" },
            { shade: 200, hex: "#F2EDE9", usage: "Borders, dividers, hover" },
            { shade: 300, hex: "#E5DFD8", usage: "Disabled backgrounds" },
            { shade: 400, hex: "#CCC6C0", usage: "Placeholder text" },
            { shade: 500, hex: "#A39D96", usage: "Secondary text, icons" },
            { shade: 600, hex: "#7A7671", usage: "Body text, labels" },
            { shade: 700, hex: "#3D3A37", usage: "Headings, emphasis" },
            { shade: 800, hex: "#1F1D1C", usage: "Primary text" },
            { shade: "black", hex: "#000000", usage: "High contrast" },
          ].map(({ shade, hex, usage }) => (
            <div key={shade} className="flex items-center gap-4">
              <div
                className={`w-16 h-10 rounded-md shrink-0 ${shade === "white" ? "border border-border" : ""}`}
                style={{ backgroundColor: `var(--color-neutral-${shade})` }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <code className="text-caption font-mono text-foreground-muted">
                    neutral-{shade}
                  </code>
                  <code className="text-caption-sm font-mono text-foreground-muted">{hex}</code>
                </div>
                <p className="text-caption-sm text-foreground-muted truncate">{usage}</p>
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* Semantic Colors */}
      <ComponentCard
        id="colors-semantic"
        title="Semantic"
        description="Colors with specific meaning for feedback and status."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              name: "success",
              cssVar: "--color-success",
              hex: "#5ECC70",
              usage: "Success messages, positive actions",
            },
            {
              name: "warning",
              cssVar: "--color-warning",
              hex: "#F5580A",
              usage: "Warnings, caution states",
            },
            {
              name: "error",
              cssVar: "--color-error",
              hex: "#FF5C5C",
              usage: "Errors, destructive actions",
            },
            {
              name: "info",
              cssVar: "--color-info",
              hex: "#3369FF",
              usage: "Information, neutral alerts",
            },
          ].map(({ name, cssVar, hex, usage }) => (
            <div key={name} className="flex items-center gap-3 p-3 rounded-lg bg-background-muted">
              <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: `var(${cssVar})` }} />
              <div>
                <code className="text-caption font-mono text-foreground-muted">{name}</code>
                <p className="text-caption-sm text-foreground-muted">{hex}</p>
                <p className="text-caption-sm text-foreground-muted">{usage}</p>
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* Secondary Colors */}
      <ComponentCard
        id="colors-secondary"
        title="Secondary Palettes"
        description="Additional color palettes for variety and categorization."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Blue", prefix: "blue", shades: ["100", "300", "500", "700"] },
            { name: "Red", prefix: "red", shades: ["100", "300", "500", "700"] },
            { name: "Orange", prefix: "orange", shades: ["100", "300", "500", "700"] },
            { name: "Yellow", prefix: "yellow", shades: ["100", "300", "500", "700"] },
            { name: "Purple", prefix: "purple", shades: ["100", "300", "500", "700"] },
          ].map(({ name, prefix, shades }) => (
            <div key={name}>
              <p className="text-caption-strong text-foreground-muted mb-2">{name}</p>
              <div className="flex gap-1">
                {shades.map((shade) => (
                  <div
                    key={shade}
                    className="flex-1 h-10 rounded"
                    style={{ backgroundColor: `var(--color-${prefix}-${shade})` }}
                    title={`${prefix}-${shade}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      <PageNavigation currentPath="/design-system/foundations/colors" />
    </div>
  );
}
