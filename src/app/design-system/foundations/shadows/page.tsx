"use client";

import React from "react";
import { ComponentCard } from "@/components/design-system/ComponentSection";
import { PageNavigation } from "@/components/design-system/PageNavigation";

const elevationScale = [
  {
    name: "shadow-xs",
    tailwind: "shadow-xs",
    css: "0 1px 3px 0 rgb(0 0 0 / 0.08)",
    description: "Subtle depth for flat elements",
  },
  {
    name: "shadow-sm",
    tailwind: "shadow-sm",
    css: "0 1px 4px 0 rgb(0 0 0 / 0.10), 0 1px 2px -1px rgb(0 0 0 / 0.08)",
    description: "Resting cards, inputs, list items",
  },
  {
    name: "shadow-md",
    tailwind: "shadow-md",
    css: "0 4px 8px -1px rgb(0 0 0 / 0.14), 0 2px 4px -2px rgb(0 0 0 / 0.10)",
    description: "Dropdowns, popovers, raised panels",
  },
  {
    name: "shadow-lg",
    tailwind: "shadow-lg",
    css: "0 10px 20px -3px rgb(0 0 0 / 0.16), 0 4px 8px -4px rgb(0 0 0 / 0.10)",
    description: "Modals, dialogs, floating toolbars",
  },
  {
    name: "shadow-xl",
    tailwind: "shadow-xl",
    css: "0 20px 32px -5px rgb(0 0 0 / 0.18), 0 8px 14px -6px rgb(0 0 0 / 0.12)",
    description: "Full-screen overlays, notifications",
  },
  {
    name: "shadow-2xl",
    tailwind: "shadow-2xl",
    css: "0 25px 56px -12px rgb(0 0 0 / 0.28)",
    description: "Maximum elevation, hero images",
  },
];

const componentShadows = [
  {
    name: "shadow-card",
    tailwind: "shadow-card",
    css: "0 1px 3px 0 rgb(0 0 0 / 0.07), 0 2px 6px -1px rgb(0 0 0 / 0.08)",
    description: "Default card resting state",
    structure: "key + ambient",
  },
  {
    name: "shadow-card-hover",
    tailwind: "shadow-card-hover",
    css: "0 2px 4px 0 rgb(0 0 0 / 0.08), 0 6px 16px -2px rgb(0 0 0 / 0.14)",
    description: "Card on hover / focus",
    structure: "key + ambient",
  },
  {
    name: "shadow-elevated",
    tailwind: "shadow-elevated",
    css: "0 2px 4px 0 rgb(0 0 0 / 0.08), 0 6px 20px -2px rgb(0 0 0 / 0.16)",
    description: "Floating elements, sticky toolbars",
    structure: "key + ambient",
  },
  {
    name: "shadow-dropdown",
    tailwind: "shadow-dropdown",
    css: "0 2px 6px 0 rgb(0 0 0 / 0.08), 0 10px 24px -4px rgb(0 0 0 / 0.18)",
    description: "Dropdown menus, select popovers",
    structure: "key + ambient",
  },
  {
    name: "shadow-tooltip",
    tailwind: "shadow-tooltip",
    css: "0 2px 4px 0 rgb(0 0 0 / 0.10), 0 6px 20px -2px rgb(0 0 0 / 0.18)",
    description: "Tooltip popups",
    structure: "key + ambient",
  },
  {
    name: "shadow-modal",
    tailwind: "shadow-modal",
    css: "0 4px 10px 0 rgb(0 0 0 / 0.10), 0 28px 64px -12px rgb(0 0 0 / 0.28)",
    description: "Modal dialogs, full overlays",
    structure: "key + ambient",
  },
  {
    name: "shadow-button",
    tailwind: "shadow-button",
    css: "0 1px 3px 0 rgb(0 0 0 / 0.10)",
    description: "Default button depth",
    structure: "key only",
  },
  {
    name: "shadow-button-active",
    tailwind: "shadow-button-active",
    css: "inset 0 2px 4px 0 rgb(0 0 0 / 0.16)",
    description: "Pressed / active button state",
    structure: "inset",
  },
  {
    name: "shadow-focus",
    tailwind: "shadow-focus",
    css: "0 0 0 2px white, 0 0 0 4px green-500",
    description: "Accessible focus ring for keyboard navigation",
    structure: "double ring",
  },
];

const specialShadows = [
  {
    name: "shadow-inner",
    tailwind: "shadow-inner",
    css: "inset 0 2px 4px 0 rgb(0 0 0 / 0.10)",
    description: "Inset shadow for pressed states, wells, or input fields",
  },
  {
    name: "shadow-none",
    tailwind: "shadow-none",
    css: "none",
    description: "Removes shadow entirely — use for flat, borderless UI",
  },
];

export default function ShadowsPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-heading-lg text-foreground mb-2">Shadows</h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          Elevation system using warm neutral shadows. Shadows create visual
          hierarchy, indicate interactivity, and separate layers of UI. The scale
          progresses from subtle (xs) to dramatic (2xl), with component-specific
          aliases for consistent usage.
        </p>
      </div>

      {/* Construction Note */}
      <ComponentCard
        id="construction"
        title="Shadow Construction"
        description="How shadows are built in this system."
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="p-4 rounded-xl bg-[var(--background-subtle)]">
            <p className="text-caption font-semibold text-foreground mb-2">
              Base scale (xs&ndash;2xl)
            </p>
            <p className="text-caption-sm text-foreground-muted">
              Two-layer shadows with a primary diffused layer for depth and a
              secondary tighter layer for edge definition. Opacity increases
              progressively from 8% to 28%.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--background-subtle)]">
            <p className="text-caption font-semibold text-foreground mb-2">
              Component tokens
            </p>
            <p className="text-caption-sm text-foreground-muted">
              Use a key + ambient approach — a tight directional shadow defines
              the element edge, while a larger diffused shadow conveys distance
              from the surface.
            </p>
          </div>
        </div>
      </ComponentCard>

      {/* Elevation Ladder */}
      <ComponentCard
        id="elevation-scale"
        title="Elevation Scale"
        description="The base shadow scale — six levels of progressive depth from flat to fully elevated."
      >
        <div className="space-y-6">
          {elevationScale.map(({ name, tailwind, css, description }) => (
            <div key={name} className="flex items-start gap-6">
              {/* Shadow preview */}
              <div
                className={`w-24 h-16 shrink-0 rounded-xl bg-[var(--card-background)] ${tailwind}`}
              />

              {/* Info */}
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <code className="text-caption font-mono font-semibold text-foreground">
                    {name}
                  </code>
                  <span className="text-caption text-foreground-muted">
                    {description}
                  </span>
                </div>
                <code className="text-caption-sm font-mono text-foreground-subtle mt-1 block break-all">
                  {css}
                </code>
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* Side-by-side comparison */}
      <ComponentCard
        id="comparison"
        title="Side-by-Side Comparison"
        description="All elevation levels compared at the same scale."
      >
        <div className="flex items-end gap-4 flex-wrap py-4">
          {elevationScale.map(({ name, tailwind }) => (
            <div key={name} className="flex flex-col items-center gap-3">
              <div
                className={`w-20 h-20 rounded-xl bg-[var(--card-background)] ${tailwind}`}
              />
              <code className="text-caption-sm font-mono text-foreground-muted">
                {name.replace("shadow-", "")}
              </code>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* Component Shadows */}
      <ComponentCard
        id="component-shadows"
        title="Component Shadows"
        description="Purpose-specific shadow tokens mapped to UI components. Each uses a key + ambient two-layer approach for realistic depth."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {componentShadows.map(
            ({ name, tailwind, css, description, structure }) => (
              <div
                key={name}
                className="flex items-start gap-4 p-4 rounded-xl bg-[var(--background-subtle)]"
              >
                {/* Shadow preview */}
                <div
                  className={`w-14 h-14 shrink-0 rounded-lg bg-[var(--card-background)] ${tailwind}`}
                />

                {/* Info */}
                <div className="min-w-0">
                  <code className="text-caption font-mono font-semibold text-foreground">
                    {name}
                  </code>
                  <p className="text-caption-sm text-foreground-muted mt-0.5">
                    {description}
                  </p>
                  <p className="text-caption-sm font-mono text-foreground-subtle mt-1">
                    {structure}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </ComponentCard>

      {/* Special Shadows */}
      <ComponentCard
        id="special-shadows"
        title="Special Shadows"
        description="Inset and removal utilities for specific use cases."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {specialShadows.map(({ name, tailwind, css, description }) => (
            <div
              key={name}
              className="flex items-start gap-4 p-4 rounded-xl bg-[var(--background-subtle)]"
            >
              <div
                className={`w-14 h-14 shrink-0 rounded-lg bg-[var(--card-background)] border border-[var(--border-muted)] ${tailwind}`}
              />
              <div className="min-w-0">
                <code className="text-caption font-mono font-semibold text-foreground">
                  {name}
                </code>
                <p className="text-caption-sm text-foreground-muted mt-0.5">
                  {description}
                </p>
                <code className="text-caption-sm font-mono text-foreground-subtle mt-1 block break-all">
                  {css}
                </code>
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* Interactive Demo */}
      <ComponentCard
        id="interactive"
        title="Hover Transitions"
        description="Shadows should transition smoothly on interaction. Hover over these cards to see elevation changes."
      >
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="group cursor-pointer">
            <div className="rounded-xl bg-[var(--card-background)] p-6 shadow-card transition-shadow duration-200 ease-out group-hover:shadow-card-hover">
              <p className="text-caption font-semibold text-foreground mb-1">
                Card
              </p>
              <p className="text-caption-sm text-foreground-muted">
                shadow-card &rarr; shadow-card-hover
              </p>
            </div>
          </div>

          <div className="group cursor-pointer">
            <div className="rounded-xl bg-[var(--card-background)] p-6 shadow-sm transition-shadow duration-200 ease-out group-hover:shadow-elevated">
              <p className="text-caption font-semibold text-foreground mb-1">
                Panel
              </p>
              <p className="text-caption-sm text-foreground-muted">
                shadow-sm &rarr; shadow-elevated
              </p>
            </div>
          </div>

          <div className="group cursor-pointer">
            <div className="rounded-xl bg-[var(--card-background)] p-6 shadow-xs transition-shadow duration-200 ease-out group-hover:shadow-lg">
              <p className="text-caption font-semibold text-foreground mb-1">
                Lift
              </p>
              <p className="text-caption-sm text-foreground-muted">
                shadow-xs &rarr; shadow-lg
              </p>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Usage Guidelines */}
      <ComponentCard
        id="usage-guidelines"
        title="Usage Guidelines"
        description="When to use which shadow level."
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--border-muted)]">
                <th className="text-caption font-semibold text-foreground pb-3 pr-4">
                  Level
                </th>
                <th className="text-caption font-semibold text-foreground pb-3 pr-4">
                  Use for
                </th>
                <th className="text-caption font-semibold text-foreground pb-3">
                  Examples
                </th>
              </tr>
            </thead>
            <tbody className="text-caption text-foreground-muted">
              <tr className="border-b border-[var(--border-muted)]">
                <td className="py-3 pr-4">
                  <code className="font-mono text-foreground">xs</code>
                </td>
                <td className="py-3 pr-4">Minimal separation</td>
                <td className="py-3">Buttons, badges, dividers</td>
              </tr>
              <tr className="border-b border-[var(--border-muted)]">
                <td className="py-3 pr-4">
                  <code className="font-mono text-foreground">sm</code>
                </td>
                <td className="py-3 pr-4">Resting content containers</td>
                <td className="py-3">Cards, list items, form groups</td>
              </tr>
              <tr className="border-b border-[var(--border-muted)]">
                <td className="py-3 pr-4">
                  <code className="font-mono text-foreground">md</code>
                </td>
                <td className="py-3 pr-4">Raised interactive surfaces</td>
                <td className="py-3">Dropdowns, popovers, menus</td>
              </tr>
              <tr className="border-b border-[var(--border-muted)]">
                <td className="py-3 pr-4">
                  <code className="font-mono text-foreground">lg</code>
                </td>
                <td className="py-3 pr-4">Prominent floating elements</td>
                <td className="py-3">Modals, dialogs, sticky headers</td>
              </tr>
              <tr className="border-b border-[var(--border-muted)]">
                <td className="py-3 pr-4">
                  <code className="font-mono text-foreground">xl</code>
                </td>
                <td className="py-3 pr-4">High-emphasis overlays</td>
                <td className="py-3">
                  Full-page overlays, toasts, notifications
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4">
                  <code className="font-mono text-foreground">2xl</code>
                </td>
                <td className="py-3 pr-4">Maximum elevation</td>
                <td className="py-3">Hero images, dramatic emphasis</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ComponentCard>

      {/* Dark Mode Note */}
      <ComponentCard
        id="dark-mode"
        title="Dark Mode"
        description="Shadow behavior in dark mode."
      >
        <div className="space-y-3 text-caption text-foreground-muted">
          <p>
            All shadow tokens automatically increase opacity in dark mode
            (roughly 3&times; the light-mode value) since shadows need to be
            stronger against dark backgrounds to remain visible. No manual
            overrides are needed — toggling the theme will update all shadows
            globally.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex gap-3 p-4 rounded-xl bg-[var(--background-default)]">
              <div className="w-16 h-12 rounded-lg bg-[var(--card-background)] shadow-md" />
              <div className="flex flex-col justify-center">
                <code className="text-caption-sm font-mono text-foreground">
                  shadow-md
                </code>
                <span className="text-caption-sm text-foreground-subtle">
                  Current theme
                </span>
              </div>
            </div>
          </div>
        </div>
      </ComponentCard>

      <PageNavigation currentPath="/design-system/foundations/shadows" />
    </div>
  );
}
