"use client";

import React from "react";
import { ComponentCard } from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PageNavigation } from "@/components/design-system/PageNavigation";

const surfaceLevels = [
  {
    level: 0,
    className: "surface-level-0",
    bg: "neutral-0 (#FFFFFF)",
    hover: "neutral-100 (#FAF9F7)",
    active: "neutral-200 (#F2EDE9)",
    usage: "Main page background, full-width sections",
  },
  {
    level: 1,
    className: "surface-level-1",
    bg: "neutral-100 (#FAF9F7)",
    hover: "neutral-200 (#F2EDE9)",
    active: "neutral-300 (#E5DFD8)",
    usage: "Cards, panels, sidebars on white background",
  },
  {
    level: 2,
    className: "surface-level-2",
    bg: "neutral-200 (#F2EDE9)",
    hover: "neutral-300 (#E5DFD8)",
    active: "neutral-400 (#CCC6C0)",
    usage: "Nested cards, inset panels, table headers",
  },
  {
    level: 3,
    className: "surface-level-3",
    bg: "neutral-300 (#E5DFD8)",
    hover: "neutral-400 (#CCC6C0)",
    active: "neutral-500 (#A39D96)",
    usage: "Deeply nested UI, tertiary containers",
  },
];

export default function SurfacesPage() {
  const [activeLevel, setActiveLevel] = React.useState(0);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="mb-2 text-heading-lg font-bold text-foreground">
          Surfaces
        </h1>
        <p className="mb-4 max-w-2xl text-body text-foreground-muted">
          Canopy has two surface systems. <strong>Neutral Surface Levels</strong> provide
          context-aware hover colors for nested containers. <strong>Emphasis Surfaces</strong>{" "}
          provide foreground tokens for children on dark or colored backgrounds — eliminating the
          need for hardcoded{" "}
          <code className="rounded bg-background-muted px-1.5 py-0.5 font-mono text-caption-sm">
            text-white
          </code>
          .
        </p>
      </div>

      {/* How It Works */}
      <ComponentCard
        id="how-it-works"
        title="How It Works"
        description="Surface levels set CSS variables that cascade to child elements"
      >
        <div className="space-y-4">
          <p className="text-body text-foreground-muted">
            When a container has a{" "}
            <code className="rounded bg-background-muted px-1.5 py-0.5 font-mono text-caption">
              surface-level-N
            </code>{" "}
            class, it sets three CSS custom properties that all children inherit:
          </p>
          <div className="overflow-hidden rounded-lg border border-[var(--border-muted)]">
            <table className="w-full text-caption">
              <thead>
                <tr className="border-b border-[var(--border-muted)] bg-[var(--background-subtle)]">
                  <th className="px-4 py-2.5 text-left font-medium text-foreground-muted">
                    Variable
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-foreground-muted">
                    Purpose
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-foreground-muted">
                    Used By
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--border-muted)]">
                  <td className="px-4 py-2.5 font-mono text-caption-sm">--surface-bg</td>
                  <td className="px-4 py-2.5 text-foreground-muted">Background of the surface</td>
                  <td className="px-4 py-2.5 text-foreground-muted">Container background</td>
                </tr>
                <tr className="border-b border-[var(--border-muted)]">
                  <td className="px-4 py-2.5 font-mono text-caption-sm">--surface-hover</td>
                  <td className="px-4 py-2.5 text-foreground-muted">
                    Hover color (one step darker)
                  </td>
                  <td className="px-4 py-2.5 text-foreground-muted">
                    <code className="rounded bg-background-muted px-1 py-0.5 font-mono text-caption-sm">
                      --background-interactive-hover
                    </code>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-caption-sm">--surface-active</td>
                  <td className="px-4 py-2.5 text-foreground-muted">
                    Active/pressed color (two steps darker)
                  </td>
                  <td className="px-4 py-2.5 text-foreground-muted">
                    <code className="rounded bg-background-muted px-1 py-0.5 font-mono text-caption-sm">
                      --background-interactive-active
                    </code>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-caption text-foreground-subtle">
            Because{" "}
            <code className="rounded bg-background-muted px-1 py-0.5 font-mono">
              --background-interactive-hover
            </code>{" "}
            is aliased to{" "}
            <code className="rounded bg-background-muted px-1 py-0.5 font-mono">
              var(--surface-hover)
            </code>
            , all existing components using the interactive hover token automatically become
            surface-aware.
          </p>
        </div>
      </ComponentCard>

      {/* Surface Scale */}
      <ComponentCard
        id="surface-scale"
        title="Surface Scale"
        description="Four levels of surface depth, each one step darker than the last"
      >
        <div className="space-y-6">
          {surfaceLevels.map((surface) => (
            <div key={surface.level} className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="rounded bg-background-muted px-2 py-1 font-mono text-caption-sm font-medium">
                  {surface.className}
                </span>
                <span className="text-caption text-foreground-muted">{surface.usage}</span>
              </div>
              <div className="flex gap-3">
                <div className="flex flex-1 flex-col items-center gap-2 rounded-lg border border-[var(--border-muted)] p-4">
                  <div
                    className={`h-12 w-full rounded-md ${surface.level === 0 ? "surface-level-0" : surface.level === 1 ? "surface-level-1" : surface.level === 2 ? "surface-level-2" : "surface-level-3"}`}
                  />
                  <span className="text-caption-sm text-foreground-muted">Background</span>
                  <span className="font-mono text-caption-sm">{surface.bg}</span>
                </div>
                <div className="flex flex-1 flex-col items-center gap-2 rounded-lg border border-[var(--border-muted)] p-4">
                  <div
                    className="h-12 w-full rounded-md"
                    style={{
                      backgroundColor:
                        surface.level === 0
                          ? "var(--primitive-neutral-100)"
                          : surface.level === 1
                            ? "var(--primitive-neutral-200)"
                            : surface.level === 2
                              ? "var(--primitive-neutral-300)"
                              : "var(--primitive-neutral-400)",
                    }}
                  />
                  <span className="text-caption-sm text-foreground-muted">Hover</span>
                  <span className="font-mono text-caption-sm">{surface.hover}</span>
                </div>
                <div className="flex flex-1 flex-col items-center gap-2 rounded-lg border border-[var(--border-muted)] p-4">
                  <div
                    className="h-12 w-full rounded-md"
                    style={{
                      backgroundColor:
                        surface.level === 0
                          ? "var(--primitive-neutral-200)"
                          : surface.level === 1
                            ? "var(--primitive-neutral-300)"
                            : surface.level === 2
                              ? "var(--primitive-neutral-400)"
                              : "var(--primitive-neutral-500)",
                    }}
                  />
                  <span className="text-caption-sm text-foreground-muted">Active</span>
                  <span className="font-mono text-caption-sm">{surface.active}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* Interactive Demo */}
      <ComponentCard
        id="interactive-demo"
        title="Interactive Demo"
        description="See how hover colors adapt to different surface levels"
      >
        <div className="space-y-4">
          <div className="flex gap-2">
            {[0, 1, 2, 3].map((level) => (
              <button
                key={level}
                onClick={() => setActiveLevel(level)}
                className={`rounded-lg px-4 py-2 text-caption font-medium transition-colors ${
                  activeLevel === level
                    ? "bg-[var(--button-primary-background)] text-[var(--button-primary-foreground)]"
                    : "bg-[var(--background-muted)] text-foreground-muted hover:bg-[var(--background-interactive-hover)]"
                }`}
              >
                Level {level}
              </button>
            ))}
          </div>

          <div
            className={`rounded-xl border border-[var(--border-muted)] p-6 surface-level-${activeLevel}`}
          >
            <p className="mb-4 text-caption font-medium text-foreground-muted">
              Container:{" "}
              <code className="rounded bg-background-muted px-1.5 py-0.5 font-mono">
                surface-level-{activeLevel}
              </code>
            </p>
            <div className="space-y-2">
              {["List item 1", "List item 2", "List item 3"].map((item) => (
                <div
                  key={item}
                  className="cursor-pointer rounded-lg px-4 py-3 text-body transition-colors hover:bg-[var(--background-interactive-hover)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <p className="text-caption text-foreground-subtle">
            Hover over the list items above. Change the surface level to see the hover color adapt
            automatically.
          </p>
        </div>
      </ComponentCard>

      {/* Nested Surfaces */}
      <ComponentCard
        id="nested-surfaces"
        title="Nested Surfaces"
        description="Surface levels can be nested to create depth hierarchy"
      >
        <div className="rounded-xl border border-[var(--border-muted)] p-6 surface-level-0">
          <p className="mb-3 text-caption font-medium text-foreground-muted">Level 0 (white)</p>
          <div className="cursor-pointer rounded-lg px-4 py-2 text-caption transition-colors hover:bg-[var(--background-interactive-hover)]">
            Hover me (neutral-100)
          </div>

          <div className="mt-4 rounded-lg border border-[var(--border-muted)] p-5 surface-level-1">
            <p className="mb-3 text-caption font-medium text-foreground-muted">
              Level 1 (neutral-100)
            </p>
            <div className="cursor-pointer rounded-lg px-4 py-2 text-caption transition-colors hover:bg-[var(--background-interactive-hover)]">
              Hover me (neutral-200)
            </div>

            <div className="mt-4 rounded-lg border border-[var(--border-muted)] p-4 surface-level-2">
              <p className="mb-3 text-caption font-medium text-foreground-muted">
                Level 2 (neutral-200)
              </p>
              <div className="cursor-pointer rounded-lg px-4 py-2 text-caption transition-colors hover:bg-[var(--background-interactive-hover)]">
                Hover me (neutral-300)
              </div>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Usage */}
      <ComponentCard
        id="usage"
        title="Usage"
        description="How to apply surface levels in your code"
      >
        <div className="space-y-6">
          {/* Tailwind Class */}
          <div>
            <h3 className="mb-2 text-body-strong font-semibold">Tailwind Utility Classes</h3>
            <CodePreview
              code={`{/* The surface-level-N class sets background + hover variables */}
<div className="surface-level-1">
  <button className="hover:bg-[var(--background-interactive-hover)]">
    Hover adapts to surface level
  </button>
</div>`}
            >
              <div className="rounded-lg p-4 surface-level-1">
                <button className="rounded-lg px-4 py-2 text-caption transition-colors hover:bg-[var(--background-interactive-hover)]">
                  Hover me on level 1
                </button>
              </div>
            </CodePreview>
          </div>

          {/* Data Attribute */}
          <div>
            <h3 className="mb-2 text-body-strong font-semibold">Data Attribute</h3>
            <CodePreview
              code={`{/* Alternative: use data-surface attribute */}
<Card data-surface="1">
  <ListItem className="hover:bg-[var(--background-interactive-hover)]">
    Also adapts
  </ListItem>
</Card>`}
            >
              <div data-surface="1" className="rounded-lg bg-[var(--primitive-neutral-100)] p-4">
                <div className="cursor-pointer rounded-lg px-4 py-2 text-caption transition-colors hover:bg-[var(--background-interactive-hover)]">
                  Hover me (data-surface=1)
                </div>
              </div>
            </CodePreview>
          </div>

          {/* Tailwind shorthand */}
          <div>
            <h3 className="mb-2 text-body-strong font-semibold">Shorthand Hover Class</h3>
            <CodePreview
              code={`{/* Equivalent shorthand using Tailwind token */}
<div className="surface-level-1">
  <button className="hover:bg-surface-hover">
    Same result, shorter class
  </button>
</div>`}
            >
              <div className="rounded-lg p-4 surface-level-1">
                <button className="rounded-lg px-4 py-2 text-caption transition-colors hover:bg-surface-hover">
                  Hover me (shorthand)
                </button>
              </div>
            </CodePreview>
          </div>
        </div>
      </ComponentCard>

      {/* Token Reference */}
      <ComponentCard
        id="tokens"
        title="Token Reference"
        description="CSS custom properties and Tailwind classes"
      >
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-body-strong font-semibold">CSS Custom Properties</h3>
            <div className="overflow-hidden rounded-lg border border-[var(--border-muted)]">
              <table className="w-full text-caption">
                <thead>
                  <tr className="border-b border-[var(--border-muted)] bg-[var(--background-subtle)]">
                    <th className="px-4 py-2.5 text-left font-medium text-foreground-muted">
                      Property
                    </th>
                    <th className="px-4 py-2.5 text-left font-medium text-foreground-muted">
                      Default (Level 0)
                    </th>
                    <th className="px-4 py-2.5 text-left font-medium text-foreground-muted">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[var(--border-muted)]">
                    <td className="px-4 py-2.5 font-mono text-caption-sm">--surface-bg</td>
                    <td className="px-4 py-2.5 font-mono text-caption-sm">neutral-0</td>
                    <td className="px-4 py-2.5 text-foreground-muted">Surface background color</td>
                  </tr>
                  <tr className="border-b border-[var(--border-muted)]">
                    <td className="px-4 py-2.5 font-mono text-caption-sm">--surface-hover</td>
                    <td className="px-4 py-2.5 font-mono text-caption-sm">neutral-100</td>
                    <td className="px-4 py-2.5 text-foreground-muted">
                      Hover color (aliases --background-interactive-hover)
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-mono text-caption-sm">--surface-active</td>
                    <td className="px-4 py-2.5 font-mono text-caption-sm">neutral-200</td>
                    <td className="px-4 py-2.5 text-foreground-muted">
                      Active/pressed color (aliases --background-interactive-active)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-body-strong font-semibold">Tailwind Classes</h3>
            <div className="overflow-hidden rounded-lg border border-[var(--border-muted)]">
              <table className="w-full text-caption">
                <thead>
                  <tr className="border-b border-[var(--border-muted)] bg-[var(--background-subtle)]">
                    <th className="px-4 py-2.5 text-left font-medium text-foreground-muted">
                      Class
                    </th>
                    <th className="px-4 py-2.5 text-left font-medium text-foreground-muted">
                      What It Does
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[var(--border-muted)]">
                    <td className="px-4 py-2.5 font-mono text-caption-sm">surface-level-0</td>
                    <td className="px-4 py-2.5 text-foreground-muted">
                      Sets bg to white, hover to neutral-100, active to neutral-200
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--border-muted)]">
                    <td className="px-4 py-2.5 font-mono text-caption-sm">surface-level-1</td>
                    <td className="px-4 py-2.5 text-foreground-muted">
                      Sets bg to neutral-100, hover to neutral-200, active to neutral-300
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--border-muted)]">
                    <td className="px-4 py-2.5 font-mono text-caption-sm">surface-level-2</td>
                    <td className="px-4 py-2.5 text-foreground-muted">
                      Sets bg to neutral-200, hover to neutral-300, active to neutral-400
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--border-muted)]">
                    <td className="px-4 py-2.5 font-mono text-caption-sm">surface-level-3</td>
                    <td className="px-4 py-2.5 text-foreground-muted">
                      Sets bg to neutral-300, hover to neutral-400, active to neutral-500
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--border-muted)]">
                    <td className="px-4 py-2.5 font-mono text-caption-sm">
                      hover:bg-surface-hover
                    </td>
                    <td className="px-4 py-2.5 text-foreground-muted">
                      Applies the surface-aware hover color
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-mono text-caption-sm">bg-surface-active</td>
                    <td className="px-4 py-2.5 text-foreground-muted">
                      Applies the surface-aware active color
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Backwards Compatibility */}
      <ComponentCard
        id="backwards-compatibility"
        title="Backwards Compatibility"
        description="Existing code is automatically surface-aware"
      >
        <div className="space-y-4">
          <p className="text-body text-foreground-muted">
            The surface system works via an alias chain. The semantic token{" "}
            <code className="rounded bg-background-muted px-1.5 py-0.5 font-mono text-caption-sm">
              --background-interactive-hover
            </code>{" "}
            is aliased to{" "}
            <code className="rounded bg-background-muted px-1.5 py-0.5 font-mono text-caption-sm">
              var(--surface-hover)
            </code>
            . This means:
          </p>
          <ul className="space-y-2 text-body text-foreground-muted">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--foreground-brand)]" />
              All existing{" "}
              <code className="rounded bg-background-muted px-1 py-0.5 font-mono text-caption-sm">
                hover:bg-[var(--background-interactive-hover)]
              </code>{" "}
              usages automatically adapt
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--foreground-brand)]" />
              No migration needed for existing components
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--foreground-brand)]" />
              Components opt in by adding{" "}
              <code className="rounded bg-background-muted px-1 py-0.5 font-mono text-caption-sm">
                surface-level-N
              </code>{" "}
              to their container
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--foreground-brand)]" />
              Dark mode works automatically (primitives already switch in{" "}
              <code className="rounded bg-background-muted px-1 py-0.5 font-mono text-caption-sm">
                .dark
              </code>
              )
            </li>
          </ul>
        </div>
      </ComponentCard>

      {/* ============================================
          EMPHASIS SURFACES
          ============================================ */}

      {/* Emphasis Surfaces Overview */}
      <div className="border-t border-[var(--border-default)] pt-12">
        <h2 id="emphasis-surfaces" className="mb-2 text-heading-md font-bold text-foreground">
          Emphasis Surfaces
        </h2>
        <p className="mb-4 max-w-2xl text-body text-foreground-muted">
          Emphasis surfaces solve a different problem than surface levels. When a container has a
          dark or colored background (brand green-800, inverse neutral-800, status colors), its
          children need <strong>inverted foreground colors</strong>. Add a{" "}
          <code className="rounded bg-background-muted px-1.5 py-0.5 font-mono text-caption-sm">
            surface-brand
          </code>{" "}
          class to the container, and all children using{" "}
          <code className="rounded bg-background-muted px-1.5 py-0.5 font-mono text-caption-sm">
            text-[var(--surface-fg)]
          </code>{" "}
          automatically get the correct light-on-dark text.
        </p>
      </div>

      {/* Available Emphasis Classes */}
      <ComponentCard
        id="emphasis-classes"
        title="Available Classes"
        description="Each class sets foreground tokens for a specific emphasis background"
      >
        <div className="overflow-hidden rounded-lg border border-[var(--border-muted)]">
          <table className="w-full text-caption">
            <thead>
              <tr className="border-b border-[var(--border-muted)] bg-[var(--background-subtle)]">
                <th className="px-4 py-2.5 text-left font-medium text-foreground-muted">Class</th>
                <th className="px-4 py-2.5 text-left font-medium text-foreground-muted">Used On</th>
                <th className="px-4 py-2.5 text-left font-medium text-foreground-muted">Example</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  cls: "surface-brand",
                  usedOn: "Brand green-800 containers",
                  example: "Card feature variant, hero sections",
                },
                {
                  cls: "surface-inverse",
                  usedOn: "Neutral-800 dark containers",
                  example: "Footer, dark panels",
                },
                {
                  cls: "surface-error",
                  usedOn: "Error emphasis backgrounds",
                  example: "Error banners, destructive alerts",
                },
                {
                  cls: "surface-success",
                  usedOn: "Success emphasis backgrounds",
                  example: "Success banners, confirmation panels",
                },
                {
                  cls: "surface-info",
                  usedOn: "Info emphasis backgrounds",
                  example: "Info banners, announcement panels",
                },
                {
                  cls: "surface-warning",
                  usedOn: "Warning emphasis backgrounds",
                  example: "Warning banners, caution panels",
                },
              ].map(({ cls, usedOn, example }, i, arr) => (
                <tr
                  key={cls}
                  className={i < arr.length - 1 ? "border-b border-[var(--border-muted)]" : ""}
                >
                  <td className="px-4 py-2.5 font-mono text-caption-sm">.{cls}</td>
                  <td className="px-4 py-2.5 text-foreground-muted">{usedOn}</td>
                  <td className="px-4 py-2.5 text-foreground-muted">{example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ComponentCard>

      {/* Emphasis Tokens */}
      <ComponentCard
        id="emphasis-tokens"
        title="Tokens Set by Emphasis Surfaces"
        description="Each emphasis class overrides these CSS variables for its children"
      >
        <div className="overflow-hidden rounded-lg border border-[var(--border-muted)]">
          <table className="w-full text-caption">
            <thead>
              <tr className="border-b border-[var(--border-muted)] bg-[var(--background-subtle)]">
                <th className="px-4 py-2.5 text-left font-medium text-foreground-muted">Token</th>
                <th className="px-4 py-2.5 text-left font-medium text-foreground-muted">Purpose</th>
                <th className="px-4 py-2.5 text-left font-medium text-foreground-muted">
                  Default (no emphasis)
                </th>
                <th className="px-4 py-2.5 text-left font-medium text-foreground-muted">
                  On .surface-brand
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  token: "--surface-fg",
                  purpose: "Primary text",
                  defaultVal: "foreground-default",
                  brandVal: "neutral-0 (white)",
                },
                {
                  token: "--surface-fg-muted",
                  purpose: "Secondary text",
                  defaultVal: "foreground-muted",
                  brandVal: "neutral-300",
                },
                {
                  token: "--surface-fg-subtle",
                  purpose: "Tertiary text",
                  defaultVal: "foreground-subtle",
                  brandVal: "neutral-400",
                },
                {
                  token: "--surface-border",
                  purpose: "Borders on surface",
                  defaultVal: "border-default",
                  brandVal: "white / 15%",
                },
                {
                  token: "--surface-icon",
                  purpose: "Icon color",
                  defaultVal: "foreground-muted",
                  brandVal: "neutral-200",
                },
              ].map(({ token, purpose, defaultVal, brandVal }, i, arr) => (
                <tr
                  key={token}
                  className={i < arr.length - 1 ? "border-b border-[var(--border-muted)]" : ""}
                >
                  <td className="px-4 py-2.5 font-mono text-caption-sm">{token}</td>
                  <td className="px-4 py-2.5 text-foreground-muted">{purpose}</td>
                  <td className="px-4 py-2.5 font-mono text-caption-sm">{defaultVal}</td>
                  <td className="px-4 py-2.5 font-mono text-caption-sm">{brandVal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ComponentCard>

      {/* Emphasis Surface Demo */}
      <ComponentCard
        id="emphasis-demo"
        title="Live Demo"
        description="See how text automatically adapts on emphasis surfaces"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              cls: "surface-brand",
              label: ".surface-brand",
              bg: "#0a3d2c",
              full: true,
            },
            {
              cls: "surface-inverse",
              label: ".surface-inverse",
              bg: "#1f1d1c",
              full: true,
            },
            {
              cls: "surface-error",
              label: ".surface-error",
              bg: "#e90000",
            },
            {
              cls: "surface-success",
              label: ".surface-success",
              bg: "#3ba36f",
            },
            {
              cls: "surface-info",
              label: ".surface-info",
              bg: "#0d3ec7",
            },
            {
              cls: "surface-warning",
              label: ".surface-warning",
              bg: "#f5580a",
            },
          ].map(({ cls, label, bg, full }) => (
            <div key={cls} className={`${cls} rounded-xl p-5`} style={{ backgroundColor: bg }}>
              <p className="text-caption font-medium text-[var(--surface-fg)]">{label}</p>
              <p className="mt-1 text-caption-sm text-[var(--surface-fg-muted)]">
                Secondary text adapts
              </p>
              {full && (
                <>
                  <p className="mt-1 text-caption-sm text-[var(--surface-fg-subtle)]">
                    Tertiary text too
                  </p>
                  <div className="mt-3 border-t border-[var(--surface-border)] pt-3">
                    <p className="text-caption-sm text-[var(--surface-fg-muted)]">
                      Border uses --surface-border
                    </p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* Emphasis Usage */}
      <ComponentCard
        id="emphasis-usage"
        title="Usage"
        description="How to use emphasis surfaces in your code"
      >
        <div className="space-y-6">
          <div>
            <h3 className="mb-2 text-body-strong font-semibold">Basic Pattern</h3>
            <CodePreview
              code={`{/* Add the surface class to the dark container */}
<div className="surface-brand bg-[var(--background-brand-emphasis)] p-6 rounded-xl">
  {/* Children use --surface-fg tokens instead of text-white */}
  <h3 className="text-[var(--surface-fg)]">Title</h3>
  <p className="text-[var(--surface-fg-muted)]">Description</p>
  <div className="border-t border-[var(--surface-border)] mt-4 pt-4">
    <p className="text-[var(--surface-fg-subtle)]">Footer</p>
  </div>
</div>`}
            >
              <div className="rounded-xl bg-[var(--background-brand-emphasis)] p-6 surface-brand">
                <h3 className="text-body-strong text-[var(--surface-fg)]">Title</h3>
                <p className="mt-1 text-body-sm text-[var(--surface-fg-muted)]">Description</p>
                <div className="mt-4 border-t border-[var(--surface-border)] pt-4">
                  <p className="text-caption text-[var(--surface-fg-subtle)]">Footer</p>
                </div>
              </div>
            </CodePreview>
          </div>

          <div>
            <h3 className="mb-2 text-body-strong font-semibold">Card Feature Variant</h3>
            <CodePreview
              code={`{/* Card feature variant already has a dark bg.
   Add surface-brand so children get light text. */}
<Card variant="feature" className="surface-brand">
  <CardContent>
    <h3 className="text-[var(--surface-fg)]">Feature title</h3>
    <p className="text-[var(--surface-fg-muted)]">Feature description</p>
  </CardContent>
</Card>`}
            >
              <div className="rounded-xl bg-[var(--card-background-feature)] p-6 shadow-card surface-brand">
                <h3 className="text-body-strong text-[var(--surface-fg)]">Feature title</h3>
                <p className="mt-1 text-body-sm text-[var(--surface-fg-muted)]">
                  Feature description with auto-adapting text
                </p>
              </div>
            </CodePreview>
          </div>
        </div>
      </ComponentCard>

      {/* Dark Mode Behavior */}
      <ComponentCard
        id="emphasis-dark-mode"
        title="Dark Mode Behavior"
        description="How emphasis surfaces adapt in dark mode"
      >
        <div className="space-y-4">
          <p className="text-body text-foreground-muted">
            Most emphasis surfaces stay the same in dark mode — white text on a dark background
            works in both themes. The exception is{" "}
            <code className="rounded bg-background-muted px-1.5 py-0.5 font-mono text-caption-sm">
              .surface-brand
            </code>
            :
          </p>
          <div className="overflow-hidden rounded-lg border border-[var(--border-muted)]">
            <table className="w-full text-caption">
              <thead>
                <tr className="border-b border-[var(--border-muted)] bg-[var(--background-subtle)]">
                  <th className="px-4 py-2.5 text-left font-medium text-foreground-muted">Mode</th>
                  <th className="px-4 py-2.5 text-left font-medium text-foreground-muted">
                    Card Feature Background
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-foreground-muted">
                    --surface-fg
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-foreground-muted">Why</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--border-muted)]">
                  <td className="px-4 py-2.5 font-medium">Light</td>
                  <td className="px-4 py-2.5 font-mono text-caption-sm">green-800 (dark)</td>
                  <td className="px-4 py-2.5 font-mono text-caption-sm">neutral-0 (white)</td>
                  <td className="px-4 py-2.5 text-foreground-muted">Light text on dark bg</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-medium">Dark</td>
                  <td className="px-4 py-2.5 font-mono text-caption-sm">green-200 (light)</td>
                  <td className="px-4 py-2.5 font-mono text-caption-sm">neutral-800 (dark)</td>
                  <td className="px-4 py-2.5 text-foreground-muted">
                    Dark text on light bg (inverts)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-caption text-foreground-subtle">
            This inversion is handled automatically. Children using{" "}
            <code className="rounded bg-background-muted px-1 py-0.5 font-mono">
              text-[var(--surface-fg)]
            </code>{" "}
            get the correct contrast in both modes without any conditional logic.
          </p>
        </div>
      </ComponentCard>

      {/* Best Practices */}
      <ComponentCard
        id="best-practices"
        title="Best Practices"
        description="Guidelines for using both surface systems"
      >
        <div className="space-y-8">
          {/* Neutral Surface Levels */}
          <div>
            <h3 className="mb-4 text-body-strong font-semibold">Neutral Surface Levels</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg border-2 border-[var(--border-success)] p-4">
                <h4 className="mb-3 font-semibold text-[var(--foreground-success)]">Do</h4>
                <ul className="space-y-2 text-caption text-foreground-muted">
                  <li>
                    Use{" "}
                    <code className="rounded bg-background-muted px-1 py-0.5 font-mono">
                      hover:bg-[var(--background-interactive-hover)]
                    </code>{" "}
                    for interactive hovers
                  </li>
                  <li>
                    Add{" "}
                    <code className="rounded bg-background-muted px-1 py-0.5 font-mono">
                      surface-level-1
                    </code>{" "}
                    to cards on white backgrounds
                  </li>
                  <li>Let the cascade handle nested hover colors</li>
                  <li>
                    Use{" "}
                    <code className="rounded bg-background-muted px-1 py-0.5 font-mono">
                      hover:bg-surface-hover
                    </code>{" "}
                    as shorthand
                  </li>
                </ul>
              </div>
              <div className="rounded-lg border-2 border-[var(--border-error)] p-4">
                <h4 className="mb-3 font-semibold text-[var(--foreground-error)]">Don&apos;t</h4>
                <ul className="space-y-2 text-caption text-foreground-muted">
                  <li>
                    Don&apos;t hardcode{" "}
                    <code className="rounded bg-background-muted px-1 py-0.5 font-mono">
                      hover:bg-[var(--primitive-neutral-200)]
                    </code>
                  </li>
                  <li>
                    Don&apos;t use{" "}
                    <code className="rounded bg-background-muted px-1 py-0.5 font-mono">
                      hover:bg-[var(--background-subtle)]
                    </code>{" "}
                    for interactive hover
                  </li>
                  <li>Don&apos;t nest more than 3 levels deep</li>
                  <li>Don&apos;t use surface levels for brand/status-colored hovers</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Emphasis Surfaces */}
          <div>
            <h3 className="mb-4 text-body-strong font-semibold">Emphasis Surfaces</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg border-2 border-[var(--border-success)] p-4">
                <h4 className="mb-3 font-semibold text-[var(--foreground-success)]">Do</h4>
                <ul className="space-y-2 text-caption text-foreground-muted">
                  <li>
                    Use{" "}
                    <code className="rounded bg-background-muted px-1 py-0.5 font-mono">
                      text-[var(--surface-fg)]
                    </code>{" "}
                    instead of{" "}
                    <code className="rounded bg-background-muted px-1 py-0.5 font-mono">
                      text-white
                    </code>
                  </li>
                  <li>Add the surface class to the container, not each child</li>
                  <li>
                    Use{" "}
                    <code className="rounded bg-background-muted px-1 py-0.5 font-mono">
                      --surface-border
                    </code>{" "}
                    for dividers inside emphasis surfaces
                  </li>
                  <li>Let CSS cascade handle child foreground colors</li>
                </ul>
              </div>
              <div className="rounded-lg border-2 border-[var(--border-error)] p-4">
                <h4 className="mb-3 font-semibold text-[var(--foreground-error)]">Don&apos;t</h4>
                <ul className="space-y-2 text-caption text-foreground-muted">
                  <li>
                    Don&apos;t use{" "}
                    <code className="rounded bg-background-muted px-1 py-0.5 font-mono">
                      text-white
                    </code>{" "}
                    — it breaks dark mode for .surface-brand
                  </li>
                  <li>
                    Don&apos;t use emphasis surfaces on neutral backgrounds — they&apos;re only for
                    dark/colored containers
                  </li>
                  <li>
                    Don&apos;t set background-color on the emphasis class — the container already
                    has its bg
                  </li>
                  <li>Don&apos;t mix surface-level-N with emphasis surface classes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Navigation */}
      <PageNavigation currentPath="/design-system/foundations/surfaces" />
    </div>
  );
}
