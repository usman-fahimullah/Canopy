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
          The surface level system provides context-aware hover colors. Containers declare their
          surface level, and children automatically get the correct &ldquo;one step darker&rdquo;
          hover color via CSS custom property cascade.
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

      {/* Best Practices */}
      <ComponentCard
        id="best-practices"
        title="Best Practices"
        description="Guidelines for using the surface level system"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-lg border-2 border-[var(--border-success)] p-4">
            <h3 className="mb-3 font-semibold text-[var(--foreground-success)]">Do</h3>
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
            <h3 className="mb-3 font-semibold text-[var(--foreground-error)]">Don&apos;t</h3>
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
      </ComponentCard>

      {/* Navigation */}
      <PageNavigation currentPath="/design-system/foundations/surfaces" />
    </div>
  );
}
