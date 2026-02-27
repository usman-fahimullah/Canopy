"use client";

import React from "react";
import { Separator } from "@/components/ui";
import {
  ComponentCard,
  UsageGuide,
  AccessibilityInfo,
} from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";

const separatorProps = [
  {
    name: "orientation",
    type: '"horizontal" | "vertical"',
    default: '"horizontal"',
    description: "Direction of the separator",
  },
  {
    name: "variant",
    type: '"default" | "muted" | "emphasis" | "strong" | "inverse" | "on-brand" | "adaptive" | "auto"',
    default: '"default"',
    description:
      'Visual style. "auto" reads from --surface-separator and adapts to .surface-brand/.surface-inverse contexts automatically. Use inverse/on-brand for manual control on dark surfaces. Adaptive uses currentColor.',
  },
  {
    name: "spacing",
    type: '"none" | "sm" | "md" | "lg"',
    default: '"none"',
    description: "Add spacing around the separator",
  },
  {
    name: "label",
    type: "string",
    default: "undefined",
    description: "Optional label to display in the middle (horizontal only)",
  },
  {
    name: "decorative",
    type: "boolean",
    default: "true",
    description: "Whether the separator is purely decorative",
  },
];

export default function SeparatorPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="mb-2 text-heading-lg text-[var(--foreground-default)]">
          Separator
        </h1>
        <p className="max-w-2xl text-body text-[var(--foreground-muted)]">
          Separators visually divide content into sections. They use alpha-based tokens that
          composite naturally on any surface — light, dark, or branded backgrounds.
        </p>
      </div>

      {/* Basic Usage */}
      <ComponentCard id="basic-usage" title="Basic Usage" description="Simple horizontal separator">
        <CodePreview
          code={`<div className="space-y-4">
  <p>Content above the separator</p>
  <Separator />
  <p>Content below the separator</p>
</div>`}
        >
          <div className="max-w-md space-y-4">
            <p className="text-body-sm">Content above the separator</p>
            <Separator />
            <p className="text-body-sm">Content below the separator</p>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Variants on Default Surface */}
      <ComponentCard
        id="variants"
        title="Variants"
        description="Different visual strengths for default (light) surfaces"
      >
        <div className="max-w-md space-y-6">
          {(
            [
              ["muted", "Subtle divider — tight spacing, secondary areas"],
              ["default", "Standard divider — most common usage"],
              ["emphasis", "Stronger — major section breaks"],
              ["strong", "Strongest — clear visual separation"],
            ] as const
          ).map(([v, desc]) => (
            <div key={v} className="space-y-2">
              <div className="flex items-baseline gap-2">
                <p className="text-caption-strong text-[var(--foreground-default)]">{v}</p>
                <p className="text-caption text-[var(--foreground-subtle)]">{desc}</p>
              </div>
              <Separator variant={v} />
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* Surface Adaptability */}
      <ComponentCard
        id="surfaces"
        title="Surface Adaptability"
        description="Separators adapt to any background they're placed on"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Default surface */}
          <div className="space-y-3 rounded-xl bg-[var(--background-default)] p-5 shadow-[var(--shadow-card)]">
            <p className="text-caption-strong text-[var(--foreground-default)]">Default surface</p>
            <Separator />
            <p className="text-caption text-[var(--foreground-muted)]">
              variant=&quot;default&quot;
            </p>
          </div>

          {/* Subtle surface */}
          <div className="space-y-3 rounded-xl bg-[var(--background-subtle)] p-5 shadow-[var(--shadow-card)]">
            <p className="text-caption-strong text-[var(--foreground-default)]">Subtle surface</p>
            <Separator />
            <p className="text-caption text-[var(--foreground-muted)]">
              variant=&quot;default&quot;
            </p>
          </div>

          {/* Dark / inverse surface */}
          <div className="space-y-3 rounded-xl bg-[var(--background-inverse)] p-5">
            <p className="text-caption-strong text-[var(--foreground-inverse)]">Inverse surface</p>
            <Separator variant="inverse" />
            <p className="text-caption text-[var(--foreground-inverse)]">
              variant=&quot;inverse&quot;
            </p>
          </div>

          {/* Brand surface */}
          <div className="space-y-3 rounded-xl bg-[var(--primitive-green-800)] p-5">
            <p className="text-caption-strong text-[var(--primitive-green-100)]">Brand surface</p>
            <Separator variant="on-brand" />
            <p className="text-caption text-[var(--primitive-green-200)]">
              variant=&quot;on-brand&quot;
            </p>
          </div>

          {/* Blue accent surface */}
          <div className="space-y-3 rounded-xl bg-[var(--primitive-blue-700)] p-5">
            <p className="text-caption-strong text-[var(--primitive-blue-100)]">
              Blue accent surface
            </p>
            <Separator variant="on-brand" />
            <p className="text-caption text-[var(--primitive-blue-200)]">
              variant=&quot;on-brand&quot;
            </p>
          </div>

          {/* Adaptive — any surface */}
          <div className="space-y-3 rounded-xl bg-[var(--primitive-purple-600)] p-5 text-[var(--primitive-purple-100)]">
            <p className="text-caption-strong">Any colored surface</p>
            <Separator variant="adaptive" />
            <p className="text-caption opacity-80">
              variant=&quot;adaptive&quot; — uses currentColor
            </p>
          </div>
        </div>
      </ComponentCard>

      {/* Auto Variant — Surface-Context-Aware */}
      <ComponentCard
        id="auto-variant"
        title="Auto Variant — Surface-Context-Aware"
        description="Uses var(--surface-separator) which is automatically overridden by .surface-brand, .surface-inverse, and status surface classes. No variant guessing needed."
      >
        <CodePreview
          code={`{/* Auto variant adapts to the surface context */}
<div className="surface-brand bg-[var(--primitive-green-800)] p-5">
  <Separator variant="auto" />
</div>

<div className="surface-inverse bg-[var(--background-inverse)] p-5">
  <Separator variant="auto" />
</div>

{/* On default surfaces, auto = default */}
<Separator variant="auto" />`}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Default surface — auto = default */}
            <div className="space-y-3 rounded-xl bg-[var(--background-default)] p-5 shadow-[var(--shadow-card)]">
              <p className="text-caption-strong text-[var(--foreground-default)]">
                Default surface
              </p>
              <Separator variant="auto" />
              <p className="text-caption text-[var(--foreground-muted)]">auto = same as default</p>
            </div>

            {/* Brand surface — auto = on-brand */}
            <div className="space-y-3 rounded-xl bg-[var(--primitive-green-800)] p-5 surface-brand">
              <p className="text-caption-strong text-[var(--surface-fg)]">.surface-brand</p>
              <Separator variant="auto" />
              <p className="text-caption text-[var(--surface-fg-muted)]">
                auto = on-brand (white-alpha)
              </p>
            </div>

            {/* Inverse surface — auto = inverse */}
            <div className="space-y-3 rounded-xl bg-[var(--background-inverse)] p-5 surface-inverse">
              <p className="text-caption-strong text-[var(--surface-fg)]">.surface-inverse</p>
              <Separator variant="auto" />
              <p className="text-caption text-[var(--surface-fg-muted)]">
                auto = inverse (light-alpha)
              </p>
            </div>

            {/* Error surface — auto = on-brand */}
            <div className="space-y-3 rounded-xl bg-[var(--background-error-emphasis)] p-5 surface-error">
              <p className="text-caption-strong text-[var(--surface-fg)]">.surface-error</p>
              <Separator variant="auto" />
              <p className="text-caption text-[var(--surface-fg-muted)]">
                auto = on-brand (white-alpha)
              </p>
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Adaptive Variant Deep Dive */}
      <ComponentCard
        id="adaptive"
        title="Adaptive Variant"
        description="Uses currentColor so it automatically matches whatever text context it's in"
      >
        <CodePreview
          code={`{/* Separator inherits the parent's text color */}
<div className="text-foreground-error">
  <Separator variant="adaptive" />
</div>

<div className="bg-green-800 text-green-100">
  <Separator variant="adaptive" />
</div>`}
        >
          <div className="max-w-md space-y-6">
            <div className="space-y-2">
              <p className="text-caption text-[var(--foreground-muted)]">
                Inherits default text color
              </p>
              <Separator variant="adaptive" />
            </div>
            <div className="space-y-2 text-[var(--foreground-error)]">
              <p className="text-caption">Inherits error text color</p>
              <Separator variant="adaptive" />
            </div>
            <div className="space-y-2 text-[var(--foreground-brand)]">
              <p className="text-caption">Inherits brand text color</p>
              <Separator variant="adaptive" />
            </div>
            <div className="space-y-3 rounded-lg bg-[var(--primitive-green-800)] p-4 text-[var(--primitive-green-100)]">
              <p className="text-caption">On brand surface — adapts automatically</p>
              <Separator variant="adaptive" />
              <p className="text-caption opacity-80">No variant guessing needed</p>
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* With Spacing */}
      <ComponentCard id="spacing" title="With Spacing" description="Built-in spacing options">
        <div className="max-w-md rounded-lg border border-[var(--border-default)] p-4">
          <p className="text-body-sm">First section content</p>
          <Separator spacing="sm" />
          <p className="text-body-sm">Small spacing (8px)</p>
          <Separator spacing="md" />
          <p className="text-body-sm">Medium spacing (16px)</p>
          <Separator spacing="lg" />
          <p className="text-body-sm">Large spacing (24px)</p>
        </div>
      </ComponentCard>

      {/* With Label */}
      <ComponentCard
        id="with-label"
        title="With Label"
        description="Separator with centered text label"
      >
        <div className="max-w-md space-y-6">
          <Separator label="OR" spacing="md" />
          <Separator label="Continue with" spacing="md" />
          <Separator label="More options" spacing="md" variant="emphasis" />
        </div>
      </ComponentCard>

      {/* Vertical Orientation */}
      <ComponentCard
        id="vertical"
        title="Vertical Orientation"
        description="Vertical separator for inline layouts"
      >
        <div className="flex h-16 items-center gap-4">
          <span className="text-body-sm">Home</span>
          <Separator orientation="vertical" />
          <span className="text-body-sm">Products</span>
          <Separator orientation="vertical" />
          <span className="text-body-sm">About</span>
          <Separator orientation="vertical" />
          <span className="text-body-sm">Contact</span>
        </div>
      </ComponentCard>

      {/* Use Cases */}
      <ComponentCard id="use-cases" title="Use Cases" description="Common separator patterns">
        <div className="max-w-md space-y-8">
          {/* Form section divider */}
          <div className="space-y-4">
            <p className="text-caption-strong text-[var(--foreground-muted)]">
              Form Section Divider
            </p>
            <div className="space-y-4 rounded-lg border border-[var(--border-default)] p-4">
              <div>
                <p className="text-body-strong">Personal Information</p>
                <p className="text-caption text-[var(--foreground-muted)]">Name, email, phone</p>
              </div>
              <Separator spacing="sm" />
              <div>
                <p className="text-body-strong">Work Experience</p>
                <p className="text-caption text-[var(--foreground-muted)]">
                  Previous jobs and roles
                </p>
              </div>
            </div>
          </div>

          {/* Dark card with inverse separator */}
          <div className="space-y-4">
            <p className="text-caption-strong text-[var(--foreground-muted)]">
              Dark Card with Inverse Separator
            </p>
            <div className="space-y-4 rounded-xl bg-[var(--primitive-green-800)] p-5">
              <div>
                <p className="text-body-strong text-[var(--primitive-green-100)]">Climate Impact</p>
                <p className="text-caption text-[var(--primitive-green-300)]">
                  50K tons CO2 reduced
                </p>
              </div>
              <Separator variant="inverse" />
              <div>
                <p className="text-body-strong text-[var(--primitive-green-100)]">Team Growth</p>
                <p className="text-caption text-[var(--primitive-green-300)]">
                  120 new hires this quarter
                </p>
              </div>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Props */}
      <ComponentCard id="props" title="Props">
        <PropsTable props={separatorProps} />
      </ComponentCard>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          'Use variant="auto" inside .surface-brand/.surface-inverse containers — it adapts automatically',
          "Use default/muted/emphasis/strong on light surfaces without a surface context class",
          "Use inverse or on-brand for manual control on dark backgrounds",
          "Use adaptive when the parent sets color and you want to inherit from currentColor",
          "Use labels for alternative actions (e.g., 'or')",
          "Use vertical separators in inline layouts",
        ]}
        donts={[
          "Don't use default variant on dark backgrounds — it won't be visible",
          "Don't use inverse on light backgrounds — it won't be visible",
          "Don't overuse separators — whitespace often works better",
          "Don't use labels on vertical separators",
          "Don't mix multiple variant strengths in the same visual group",
        ]}
      />

      {/* Accessibility */}
      <AccessibilityInfo
        items={[
          '**Decorative separators** use `role="none"` by default — they are invisible to screen readers',
          '**Semantic separators** set `decorative={false}` to use `role="separator"` for screen reader announcement',
          "**Labels** are visible text — screen readers read the label naturally within the content flow",
          "Separators do not receive focus and are not interactive",
        ]}
      />

      <PageNavigation currentPath="/design-system/components/separator" />
    </div>
  );
}
