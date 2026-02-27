"use client";

import React from "react";
import { ComponentSection, ComponentCard } from "@/components/design-system/ComponentSection";
import { PageNavigation } from "@/components/design-system/PageNavigation";

export default function ColorsPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-heading-lg text-foreground">Colors</h1>
        <p className="max-w-2xl text-body text-foreground-muted">
          The color system extracted from Trails Design System. All colors are defined as CSS custom
          properties for consistent usage across the application.
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
            { shade: 100, hex: "#EAFFE0", usage: "Subtle backgrounds, success tint, brand tint" },
            { shade: 200, hex: "#DCFAC8", usage: "Light backgrounds, hover states" },
            { shade: 300, hex: "#BCEBB2", usage: "Borders, dividers" },
            { shade: 400, hex: "#8EE07E", usage: "Icons, decorative" },
            { shade: 500, hex: "#5ECC70", usage: "Success states, positive indicators" },
            { shade: 600, hex: "#3BA36F", usage: "Brand areas, success emphasis" },
            { shade: 700, hex: "#0E5249", usage: "Brand text, emphasis backgrounds" },
            { shade: 800, hex: "#0A3D2C", usage: "Primary buttons, CTAs, high contrast" },
          ].map(({ shade, hex, usage }) => (
            <div key={shade} className="flex items-center gap-4">
              <div
                className="h-10 w-16 shrink-0 rounded-md"
                style={{ backgroundColor: `var(--color-primary-${shade})` }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <code className="font-mono text-caption text-foreground-muted">
                    primary-{shade}
                  </code>
                  <code className="font-mono text-caption-sm text-foreground-muted">{hex}</code>
                </div>
                <p className="truncate text-caption-sm text-foreground-muted">{usage}</p>
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
                className={`h-10 w-16 shrink-0 rounded-md ${shade === "white" ? "border border-border" : ""}`}
                style={{ backgroundColor: `var(--color-neutral-${shade})` }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <code className="font-mono text-caption text-foreground-muted">
                    neutral-{shade}
                  </code>
                  <code className="font-mono text-caption-sm text-foreground-muted">{hex}</code>
                </div>
                <p className="truncate text-caption-sm text-foreground-muted">{usage}</p>
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
            <div key={name} className="flex items-center gap-3 rounded-lg bg-background-muted p-3">
              <div className="h-12 w-12 rounded-lg" style={{ backgroundColor: `var(${cssVar})` }} />
              <div>
                <code className="font-mono text-caption text-foreground-muted">{name}</code>
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
              <p className="mb-2 text-caption-strong text-foreground-muted">{name}</p>
              <div className="flex gap-1">
                {shades.map((shade) => (
                  <div
                    key={shade}
                    className="h-10 flex-1 rounded"
                    style={{ backgroundColor: `var(--color-${prefix}-${shade})` }}
                    title={`${prefix}-${shade}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* Color Role Framework */}
      <ComponentCard
        id="colors-roles"
        title="Color Roles"
        description="How each color family is used across the product. This framework prevents any single color from doing too many jobs."
      >
        <div className="space-y-4">
          {[
            {
              role: "GREEN (800/700)",
              label: '"Do this next"',
              usage: "Primary buttons, CTAs, brand mark",
              swatches: ["--primitive-green-800", "--primitive-green-700"],
              labelColor: "text-[var(--foreground-brand)]",
            },
            {
              role: "GREEN (100-400)",
              label: "Success semantic",
              usage: "Success badges, high match scores, validation, brand tint",
              swatches: ["--primitive-green-100", "--primitive-green-200", "--primitive-green-400"],
              labelColor: "text-[var(--foreground-success)]",
            },
            {
              role: "BLUE (500/600)",
              label: '"You\'re here"',
              usage: "Focus rings, selection states, active tabs, links, checked controls",
              swatches: ["--primitive-blue-500", "--primitive-blue-600"],
              labelColor: "text-[var(--foreground-link)]",
            },
            {
              role: "NEUTRAL",
              label: "UI chrome",
              usage: "Navigation, tabs (inactive), containers, text hierarchy, borders",
              swatches: [
                "--primitive-neutral-200",
                "--primitive-neutral-500",
                "--primitive-neutral-700",
              ],
              labelColor: "text-foreground-muted",
            },
            {
              role: "RED / ORANGE / YELLOW",
              label: "Status semantics",
              usage: "Error, warning, caution states (unchanged)",
              swatches: ["--primitive-red-500", "--primitive-orange-500", "--primitive-yellow-500"],
              labelColor: "text-[var(--foreground-error)]",
            },
          ].map(({ role, label, usage, swatches, labelColor }) => (
            <div
              key={role}
              className="flex items-start gap-4 rounded-lg border border-[var(--border-muted)] p-4"
            >
              <div className="flex shrink-0 gap-1">
                {swatches.map((swatch) => (
                  <div
                    key={swatch}
                    className="h-10 w-10 rounded-md"
                    style={{ backgroundColor: `var(${swatch})` }}
                  />
                ))}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-caption-sm font-medium text-foreground">
                    {role}
                  </span>
                  <span className={`text-caption-sm font-medium ${labelColor}`}>{label}</span>
                </div>
                <p className="mt-0.5 text-caption-sm text-foreground-muted">{usage}</p>
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* Interactive Selection Tokens */}
      <ComponentCard
        id="colors-selection"
        title="Selection & Active State Tokens"
        description="Blue is the selection color across all interactive elements. These tokens were shifted from green to blue to reduce green dominance in UI chrome."
      >
        <div className="space-y-6">
          <div className="overflow-hidden rounded-lg border border-[var(--border-muted)]">
            <table className="w-full text-caption">
              <thead>
                <tr className="border-b border-[var(--border-muted)] bg-[var(--background-subtle)]">
                  <th className="px-4 py-2.5 text-left font-medium text-foreground-muted">Token</th>
                  <th className="px-4 py-2.5 text-left font-medium text-foreground-muted">Light</th>
                  <th className="px-4 py-2.5 text-left font-medium text-foreground-muted">Dark</th>
                  <th className="px-4 py-2.5 text-left font-medium text-foreground-muted">Usage</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    token: "--background-interactive-selected",
                    light: "blue-100",
                    dark: "blue-200",
                    usage: "Selected item backgrounds",
                  },
                  {
                    token: "--foreground-interactive-selected",
                    light: "blue-700",
                    dark: "blue-400",
                    usage: "Text paired with selected backgrounds",
                  },
                  {
                    token: "--card-background-selected",
                    light: "blue-100",
                    dark: "blue-200",
                    usage: "Selected card backgrounds",
                  },
                  {
                    token: "--shell-nav-accent",
                    light: "blue-500",
                    dark: "blue-400",
                    usage: "Shell navigation active indicator",
                  },
                ].map(({ token, light, dark, usage }, i, arr) => (
                  <tr
                    key={token}
                    className={i < arr.length - 1 ? "border-b border-[var(--border-muted)]" : ""}
                  >
                    <td className="px-4 py-2.5 font-mono text-caption-sm">{token}</td>
                    <td className="px-4 py-2.5 font-mono text-caption-sm">{light}</td>
                    <td className="px-4 py-2.5 font-mono text-caption-sm">{dark}</td>
                    <td className="px-4 py-2.5 text-foreground-muted">{usage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Live demo */}
          <div>
            <h3 className="mb-3 text-caption-strong font-semibold">Live Preview</h3>
            <div className="flex flex-wrap gap-4">
              <div className="rounded-lg bg-[var(--background-interactive-selected)] px-4 py-3">
                <span className="text-caption font-medium text-[var(--foreground-interactive-selected)]">
                  Selected item
                </span>
              </div>
              <div className="rounded-lg bg-[var(--background-interactive-hover)] px-4 py-3">
                <span className="text-caption text-foreground-muted">Hover state (neutral)</span>
              </div>
              <div className="rounded-lg bg-[var(--background-brand-subtle)] px-4 py-3">
                <span className="text-caption font-medium text-[var(--foreground-brand)]">
                  Brand tint (green)
                </span>
              </div>
            </div>
            <p className="mt-3 text-caption-sm text-foreground-subtle">
              Notice how selected states use blue, brand tints use green, and neutral hover uses
              gray. Each color has one clear job.
            </p>
          </div>
        </div>
      </ComponentCard>

      <PageNavigation currentPath="/design-system/foundations/colors" />
    </div>
  );
}
