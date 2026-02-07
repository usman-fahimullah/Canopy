"use client";

import React from "react";
import { ComponentCard } from "@/components/design-system/ComponentSection";
import { PageNavigation } from "@/components/design-system/PageNavigation";

/* ─── Alpha Primitive Data ─── */

const alphaScale = [
  {
    name: "--border-alpha-1",
    opacity: "5%",
    description: "Barely visible — muted separators, disabled borders",
  },
  {
    name: "--border-alpha-2",
    opacity: "9%",
    description: "Default — cards, inputs, dividers",
  },
  {
    name: "--border-alpha-3",
    opacity: "14%",
    description: "Emphasis — hover states, selected containers",
  },
  {
    name: "--border-alpha-4",
    opacity: "20%",
    description: "Strong — high-contrast outlines, active states",
  },
  {
    name: "--border-alpha-5",
    opacity: "28%",
    description: "Strongest — maximum definition borders",
  },
];

/* ─── Border Color Token Data ─── */

const defaultBorders = [
  {
    name: "--border-default",
    token: "border-default",
    value: "alpha-2 (9%)",
    description: "Standard element borders — cards, inputs, dividers",
  },
  {
    name: "--border-muted",
    token: "border-muted",
    value: "alpha-1 (5%)",
    description: "Subtle borders — table rows, secondary separators",
  },
  {
    name: "--border-emphasis",
    token: "border-emphasis",
    value: "alpha-3 (14%)",
    description: "Stronger borders — selected containers, emphasis",
  },
  {
    name: "--border-strong",
    token: "border-strong",
    value: "alpha-4 (20%)",
    description: "Strongest borders — high-contrast outlines",
  },
  {
    name: "--border-inverse",
    token: "border-inverse",
    value: "neutral-0 / neutral-800",
    description: "Borders on dark or inverse backgrounds",
  },
  {
    name: "--border-disabled",
    token: "border-disabled",
    value: "alpha-1 (5%)",
    description: "Disabled element borders — reduced visibility",
  },
];

const brandBorders = [
  {
    name: "--border-brand",
    token: "border-brand",
    value: "green-400",
    description: "Brand-colored borders — selected tabs, active sections",
  },
  {
    name: "--border-brand-emphasis",
    token: "border-brand-emphasis",
    value: "green-500",
    description: "Stronger brand borders — focused brand elements",
  },
];

const interactiveBorders = [
  {
    name: "--border-interactive-default",
    token: "border-interactive-default",
    value: "alpha-2 (9%)",
    description: "Resting state of interactive elements",
  },
  {
    name: "--border-interactive-hover",
    token: "border-interactive-hover",
    value: "alpha-3 (14%)",
    description: "Hover state — increases opacity to indicate interactivity",
  },
  {
    name: "--border-interactive-focus",
    token: "border-interactive-focus",
    value: "green-500",
    description: "Focus state — branded color for keyboard navigation",
  },
  {
    name: "--border-interactive-active",
    token: "border-interactive-active",
    value: "green-600",
    description: "Active/pressed state — deeper brand accent",
  },
];

const statusBorders = [
  {
    name: "--border-success",
    token: "border-success",
    value: "green-400",
    color: "var(--border-success)",
    description: "Success states — valid inputs, confirmed actions",
  },
  {
    name: "--border-warning",
    token: "border-warning",
    value: "orange-400",
    color: "var(--border-warning)",
    description: "Warning states — caution indicators",
  },
  {
    name: "--border-error",
    token: "border-error",
    value: "red-400",
    color: "var(--border-error)",
    description: "Error states — invalid inputs, failures",
  },
  {
    name: "--border-info",
    token: "border-info",
    value: "blue-400",
    color: "var(--border-info)",
    description: "Informational states — tips, notices",
  },
];

/* ─── Border Radius Data ─── */

const baseRadiusScale = [
  { name: "rounded-none", value: "0px", css: "--radius-none" },
  { name: "rounded-xs", value: "2px", css: "--radius-xs" },
  { name: "rounded-sm", value: "4px", css: "--radius-sm" },
  { name: "rounded-md", value: "6px", css: "--radius-md" },
  { name: "rounded-lg", value: "8px", css: "--radius-lg" },
  { name: "rounded-xl", value: "12px", css: "--radius-xl" },
  { name: "rounded-2xl", value: "16px", css: "--radius-2xl" },
  { name: "rounded-3xl", value: "24px", css: "--radius-3xl" },
  { name: "rounded-full", value: "9999px", css: "--radius-full" },
];

const semanticRadius = [
  {
    name: "rounded-card",
    value: "12px (xl)",
    css: "--radius-card",
    description: "Card containers",
  },
  {
    name: "rounded-button",
    value: "8px (lg)",
    css: "--radius-button",
    description: "Buttons, CTAs",
  },
  {
    name: "rounded-input",
    value: "6px (md)",
    css: "--radius-input",
    description: "Form inputs, textareas",
  },
  {
    name: "rounded-chip",
    value: "8px (lg)",
    css: "--radius-chip",
    description: "Chips, tags",
  },
  {
    name: "rounded-badge",
    value: "9999px (full)",
    css: "--radius-badge",
    description: "Pill badges, status indicators",
  },
  {
    name: "rounded-avatar",
    value: "9999px (full)",
    css: "--radius-avatar",
    description: "User avatars",
  },
  {
    name: "rounded-tooltip",
    value: "6px (md)",
    css: "--radius-tooltip",
    description: "Tooltips, coach tips",
  },
  {
    name: "rounded-popover",
    value: "8px (lg)",
    css: "--radius-popover",
    description: "Popovers, dropdowns",
  },
  {
    name: "rounded-modal",
    value: "12px (xl)",
    css: "--radius-modal",
    description: "Modals, dialogs",
  },
];

/* ─── Helpers ─── */

function BorderSwatch({ token }: { token: string }) {
  return (
    <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg bg-[var(--background-subtle)]">
      <div className="h-6 w-10 rounded-md" style={{ backgroundColor: `var(--${token})` }} />
    </div>
  );
}

/* ─── Page ─── */

export default function BordersPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-heading-lg text-foreground">Borders & Radius</h1>
        <p className="max-w-2xl text-body text-foreground-muted">
          Border tokens use a warm-neutral alpha system that composites naturally against any
          surface. Instead of fixed hex colors, neutral borders use opacity-based values that
          automatically adapt to light and dark backgrounds.
        </p>
      </div>

      {/* ═══════════════════════════════════════
          ALPHA SYSTEM
          ═══════════════════════════════════════ */}

      <ComponentCard
        id="alpha-system"
        title="Alpha Border System"
        description="The foundation of neutral borders — warm-tinted opacity values that composite against any surface."
      >
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-[var(--background-subtle)] p-4">
            <p className="mb-2 text-caption font-semibold text-foreground">Light mode base</p>
            <p className="text-caption-sm text-foreground-muted">
              <code className="font-mono text-foreground">rgb(31 29 28 / opacity)</code>
              <br />
              Warm neutral-800 at varying opacities — blends softly against light surfaces.
            </p>
          </div>
          <div className="rounded-xl bg-[var(--background-subtle)] p-4">
            <p className="mb-2 text-caption font-semibold text-foreground">Dark mode base</p>
            <p className="text-caption-sm text-foreground-muted">
              <code className="font-mono text-foreground">rgb(250 249 247 / opacity)</code>
              <br />
              Warm neutral-100 at varying opacities — blends softly against dark surfaces.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {alphaScale.map(({ name, opacity, description }) => (
            <div key={name} className="flex items-center gap-4">
              <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg bg-[var(--background-subtle)]">
                <div
                  className="h-6 w-10 rounded-md"
                  style={{ backgroundColor: `var(--${name.replace("--", "")})` }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-3">
                  <code className="font-mono text-caption font-semibold text-foreground">
                    {name}
                  </code>
                  <span className="font-mono text-caption-sm text-foreground-subtle">
                    {opacity}
                  </span>
                </div>
                <p className="mt-0.5 text-caption-sm text-foreground-muted">{description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Surface demo */}
        <div className="mt-6 border-t border-[var(--border-muted)] pt-6">
          <p className="mb-3 text-caption font-semibold text-foreground">Surface compositing</p>
          <p className="mb-4 text-caption-sm text-foreground-muted">
            The same alpha border looks different on each background because it composites naturally
            — no per-surface tokens needed.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Default surface", bg: "var(--background-default)" },
              { label: "Subtle surface", bg: "var(--background-subtle)" },
              { label: "Brand surface", bg: "var(--background-brand-subtle)" },
            ].map(({ label, bg }) => (
              <div key={label} className="rounded-xl p-4" style={{ backgroundColor: bg }}>
                <div className="rounded-lg border border-[var(--border-default)] p-3">
                  <p className="text-caption-sm text-foreground">{label}</p>
                  <p className="text-caption-sm text-foreground-muted">border-default</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ComponentCard>

      {/* ═══════════════════════════════════════
          BORDER COLORS
          ═══════════════════════════════════════ */}

      {/* Default Border Colors */}
      <ComponentCard
        id="border-colors-default"
        title="Default Border Colors"
        description="Core border tokens mapped to alpha primitives. These composite naturally against any surface and auto-switch in dark mode."
      >
        <div className="space-y-4">
          {defaultBorders.map(({ name, token, value, description }) => (
            <div key={name} className="flex items-center gap-4">
              <BorderSwatch token={token} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-3">
                  <code className="font-mono text-caption font-semibold text-foreground">
                    {name}
                  </code>
                  <span className="font-mono text-caption-sm text-foreground-subtle">{value}</span>
                </div>
                <p className="mt-0.5 text-caption-sm text-foreground-muted">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* Brand Border Colors */}
      <ComponentCard
        id="border-colors-brand"
        title="Brand Border Colors"
        description="Green-tinted borders for brand emphasis and active states."
      >
        <div className="space-y-4">
          {brandBorders.map(({ name, token, value, description }) => (
            <div key={name} className="flex items-center gap-4">
              <BorderSwatch token={token} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-3">
                  <code className="font-mono text-caption font-semibold text-foreground">
                    {name}
                  </code>
                  <span className="font-mono text-caption-sm text-foreground-subtle">{value}</span>
                </div>
                <p className="mt-0.5 text-caption-sm text-foreground-muted">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* Interactive Border Colors */}
      <ComponentCard
        id="border-colors-interactive"
        title="Interactive Border Colors"
        description="Border tokens that respond to user interaction. Default and hover use alpha primitives; focus and active use explicit brand colors."
      >
        <div className="space-y-4">
          {interactiveBorders.map(({ name, token, value, description }) => (
            <div key={name} className="flex items-center gap-4">
              <BorderSwatch token={token} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-3">
                  <code className="font-mono text-caption font-semibold text-foreground">
                    {name}
                  </code>
                  <span className="font-mono text-caption-sm text-foreground-subtle">{value}</span>
                </div>
                <p className="mt-0.5 text-caption-sm text-foreground-muted">{description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive demo */}
        <div className="mt-6 border-t border-[var(--border-muted)] pt-6">
          <p className="mb-3 text-caption font-semibold text-foreground">Interactive demo</p>
          <p className="mb-4 text-caption-sm text-foreground-muted">
            Hover and focus the input below to see border transitions.
          </p>
          <input
            type="text"
            placeholder="Hover or focus me..."
            className="w-full max-w-sm rounded-[var(--radius-input)] border border-[var(--border-interactive-default)] bg-[var(--input-background)] px-3 py-2 text-caption text-[var(--input-foreground)] transition-colors placeholder:text-[var(--input-foreground-placeholder)] hover:border-[var(--border-interactive-hover)] focus:border-[var(--border-interactive-focus)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2"
          />
        </div>
      </ComponentCard>

      {/* Status Border Colors */}
      <ComponentCard
        id="border-colors-status"
        title="Status Border Colors"
        description="Semantic borders for success, warning, error, and informational states."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {statusBorders.map(({ name, token, value, description }) => (
            <div
              key={name}
              className="flex items-center gap-4 rounded-lg border border-[var(--border-muted)] bg-[var(--background-default)] p-4"
            >
              <BorderSwatch token={token} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <code className="font-mono text-caption font-semibold text-foreground">
                    {name}
                  </code>
                  <span className="font-mono text-caption-sm text-foreground-subtle">{value}</span>
                </div>
                <p className="mt-0.5 text-caption-sm text-foreground-muted">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* ═══════════════════════════════════════
          BORDER WIDTH
          ═══════════════════════════════════════ */}

      <ComponentCard
        id="border-width"
        title="Border Width"
        description="Standard border widths using Tailwind's built-in scale."
      >
        <div className="space-y-5">
          {[
            {
              tw: "border",
              value: "1px",
              height: "h-px",
              description: "Default — inputs, cards, dividers, table cells",
            },
            {
              tw: "border-2",
              value: "2px",
              height: "h-0.5",
              description: "Emphasis — selected states, focus rings, status indicators",
            },
            {
              tw: "border-4",
              value: "4px",
              height: "h-1",
              description: "Heavy — decorative accents, section borders",
            },
          ].map(({ tw, value, height, description }) => (
            <div key={tw} className="flex items-center gap-4">
              <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg bg-[var(--background-subtle)]">
                <div className={`w-10 rounded-full bg-[var(--border-default)] ${height}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-3">
                  <code className="font-mono text-caption font-semibold text-foreground">{tw}</code>
                  <span className="font-mono text-caption-sm text-foreground-subtle">{value}</span>
                </div>
                <p className="mt-0.5 text-caption-sm text-foreground-muted">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* ═══════════════════════════════════════
          BORDER STYLE
          ═══════════════════════════════════════ */}

      <ComponentCard
        id="border-style"
        title="Border Style"
        description="Available border styles. Solid is the default; use others sparingly."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { style: "border-solid", label: "Solid", note: "Default" },
            { style: "border-dashed", label: "Dashed", note: "Drop zones, placeholders" },
            { style: "border-dotted", label: "Dotted", note: "Rarely used" },
            { style: "border-none", label: "None", note: "Remove borders" },
          ].map(({ style, label, note }) => (
            <div key={style} className="flex flex-col items-center gap-3">
              <div className="flex h-14 w-full items-center rounded-lg bg-[var(--background-subtle)] px-4">
                <div className={`w-full border-t border-[var(--border-default)] ${style}`} />
              </div>
              <div className="text-center">
                <code className="font-mono text-caption font-semibold text-foreground">
                  {style}
                </code>
                <p className="text-caption-sm text-foreground-muted">
                  {label} — {note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* ═══════════════════════════════════════
          BORDER RADIUS
          ═══════════════════════════════════════ */}

      {/* Base Radius Scale */}
      <ComponentCard
        id="radius-scale"
        title="Base Radius Scale"
        description="Core border radius values — from sharp corners to fully rounded."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {baseRadiusScale.map(({ name, value, css }) => (
            <div key={name} className="flex items-center gap-3">
              <div className="h-12 w-12 shrink-0 rounded-[var(${css})] bg-[var(--background-brand)]" />
              <div>
                <code className="font-mono text-caption font-semibold text-foreground">{name}</code>
                <p className="text-caption-sm text-foreground-muted">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* Side-by-side radius comparison */}
      <ComponentCard
        id="radius-comparison"
        title="Radius Comparison"
        description="All radius values compared at the same scale."
      >
        <div className="flex flex-wrap items-end gap-4 py-4">
          {baseRadiusScale.map(({ name, value, css }) => (
            <div key={name} className="flex flex-col items-center gap-3">
              <div
                className="h-16 w-16 bg-[var(--background-brand)]"
                style={{ borderRadius: `var(${css})` }}
              />
              <div className="text-center">
                <code className="block font-mono text-caption-sm text-foreground-muted">
                  {name.replace("rounded-", "")}
                </code>
                <span className="text-caption-sm text-foreground-subtle">{value}</span>
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* Semantic Radius */}
      <ComponentCard
        id="radius-semantic"
        title="Semantic Radius Aliases"
        description="Purpose-specific radius tokens mapped to component types. Use these instead of raw scale values."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {semanticRadius.map(({ name, value, css, description }) => (
            <div
              key={name}
              className="flex items-center gap-3 rounded-lg bg-[var(--background-subtle)] p-3"
            >
              <div
                className="h-10 w-10 shrink-0 bg-[var(--background-brand)]"
                style={{ borderRadius: `var(${css})` }}
              />
              <div>
                <code className="font-mono text-caption font-semibold text-foreground">{name}</code>
                <p className="text-caption-sm text-foreground-muted">{value}</p>
                <p className="text-caption-sm text-foreground-subtle">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* ═══════════════════════════════════════
          USAGE GUIDELINES
          ═══════════════════════════════════════ */}

      <ComponentCard
        id="usage-guidelines"
        title="Usage Guidelines"
        description="When and how to use each border token tier."
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--border-muted)]">
                <th className="pb-3 pr-4 text-caption font-semibold text-foreground">Context</th>
                <th className="pb-3 pr-4 text-caption font-semibold text-foreground">Token</th>
                <th className="pb-3 text-caption font-semibold text-foreground">Example</th>
              </tr>
            </thead>
            <tbody className="text-caption text-foreground-muted">
              <tr className="border-b border-[var(--border-muted)]">
                <td className="py-3 pr-4">Card or panel edge</td>
                <td className="py-3 pr-4">
                  <code className="font-mono text-foreground">border-default</code>
                </td>
                <td className="py-3">
                  <code className="font-mono text-foreground-subtle">
                    border border-[var(--border-default)]
                  </code>
                </td>
              </tr>
              <tr className="border-b border-[var(--border-muted)]">
                <td className="py-3 pr-4">Table row separator</td>
                <td className="py-3 pr-4">
                  <code className="font-mono text-foreground">border-muted</code>
                </td>
                <td className="py-3">
                  <code className="font-mono text-foreground-subtle">
                    border-b border-[var(--border-muted)]
                  </code>
                </td>
              </tr>
              <tr className="border-b border-[var(--border-muted)]">
                <td className="py-3 pr-4">Input hover</td>
                <td className="py-3 pr-4">
                  <code className="font-mono text-foreground">border-interactive-hover</code>
                </td>
                <td className="py-3">
                  <code className="font-mono text-foreground-subtle">
                    hover:border-[var(--border-interactive-hover)]
                  </code>
                </td>
              </tr>
              <tr className="border-b border-[var(--border-muted)]">
                <td className="py-3 pr-4">Input focus</td>
                <td className="py-3 pr-4">
                  <code className="font-mono text-foreground">border-interactive-focus</code>
                </td>
                <td className="py-3">
                  <code className="font-mono text-foreground-subtle">
                    focus:border-[var(--border-interactive-focus)]
                  </code>
                </td>
              </tr>
              <tr className="border-b border-[var(--border-muted)]">
                <td className="py-3 pr-4">Error input</td>
                <td className="py-3 pr-4">
                  <code className="font-mono text-foreground">border-error</code>
                </td>
                <td className="py-3">
                  <code className="font-mono text-foreground-subtle">
                    border-[var(--border-error)]
                  </code>
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Brand accent</td>
                <td className="py-3 pr-4">
                  <code className="font-mono text-foreground">border-brand</code>
                </td>
                <td className="py-3">
                  <code className="font-mono text-foreground-subtle">
                    border-[var(--border-brand)]
                  </code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ComponentCard>

      {/* ═══════════════════════════════════════
          DARK MODE
          ═══════════════════════════════════════ */}

      <ComponentCard
        id="dark-mode"
        title="Dark Mode"
        description="How the alpha border system adapts to dark mode."
      >
        <div className="space-y-3 text-caption text-foreground-muted">
          <p>
            The alpha border system automatically switches its base color in dark mode. Light mode
            uses warm <code className="font-mono text-foreground">neutral-800</code> (#1F1D1C) at
            low opacities, while dark mode uses warm{" "}
            <code className="font-mono text-foreground">neutral-100</code> (#FAF9F7). The semantic
            tokens (<code className="font-mono text-foreground">border-default</code>,{" "}
            <code className="font-mono text-foreground">border-muted</code>, etc.) stay the same —
            only the underlying alpha primitives change.
          </p>
          <p>
            No manual <code className="font-mono text-foreground">dark:</code> overrides are needed.
            Status borders (success, warning, error, info) and brand borders keep their explicit
            colors in both themes.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[var(--border-default)] bg-[var(--background-default)] p-4">
              <code className="font-mono text-caption-sm text-foreground">border-default</code>
              <p className="mt-1 text-caption-sm text-foreground-subtle">alpha-2 — current theme</p>
            </div>
            <div className="rounded-xl border-2 border-[var(--border-brand)] bg-[var(--background-default)] p-4">
              <code className="font-mono text-caption-sm text-foreground">border-brand</code>
              <p className="mt-1 text-caption-sm text-foreground-subtle">
                Explicit color — both themes
              </p>
            </div>
          </div>
        </div>
      </ComponentCard>

      <PageNavigation currentPath="/design-system/foundations/borders" />
    </div>
  );
}
