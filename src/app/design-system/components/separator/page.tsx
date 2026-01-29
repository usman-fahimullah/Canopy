"use client";

import React from "react";
import { Separator } from "@/components/ui";
import { ComponentCard, UsageGuide } from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";

const separatorProps = [
  { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Direction of the separator" },
  { name: "variant", type: '"default" | "muted" | "emphasis"', default: '"default"', description: "Visual style variant" },
  { name: "spacing", type: '"none" | "sm" | "md" | "lg"', default: '"none"', description: "Add spacing around the separator" },
  { name: "label", type: "string", default: "undefined", description: "Optional label to display in the middle (horizontal only)" },
  { name: "decorative", type: "boolean", default: "true", description: "Whether the separator is purely decorative" },
];

export default function SeparatorPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Separator
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          Separators visually divide content into sections. They can be horizontal
          or vertical, and optionally include a label.
        </p>
      </div>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Simple horizontal separator"
      >
        <CodePreview
          code={`<div className="space-y-4">
  <p>Content above the separator</p>
  <Separator />
  <p>Content below the separator</p>
</div>`}
        >
          <div className="space-y-4 max-w-md">
            <p className="text-body-sm">Content above the separator</p>
            <Separator />
            <p className="text-body-sm">Content below the separator</p>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Variants */}
      <ComponentCard
        id="variants"
        title="Variants"
        description="Different visual styles"
      >
        <div className="space-y-6 max-w-md">
          <div className="space-y-2">
            <p className="text-caption-strong text-foreground-muted">Default</p>
            <Separator variant="default" />
          </div>
          <div className="space-y-2">
            <p className="text-caption-strong text-foreground-muted">Muted</p>
            <Separator variant="muted" />
          </div>
          <div className="space-y-2">
            <p className="text-caption-strong text-foreground-muted">Emphasis</p>
            <Separator variant="emphasis" />
          </div>
        </div>
      </ComponentCard>

      {/* With Spacing */}
      <ComponentCard
        id="spacing"
        title="With Spacing"
        description="Built-in spacing options"
      >
        <div className="max-w-md border border-border rounded-lg p-4">
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
        <div className="space-y-6 max-w-md">
          <Separator label="OR" spacing="md" />
          <Separator label="Continue with" spacing="md" />
          <Separator label="More options" spacing="md" />
        </div>
      </ComponentCard>

      {/* Vertical Orientation */}
      <ComponentCard
        id="vertical"
        title="Vertical Orientation"
        description="Vertical separator for inline layouts"
      >
        <div className="flex items-center gap-4 h-16">
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
      <ComponentCard
        id="use-cases"
        title="Use Cases"
        description="Common separator patterns"
      >
        <div className="space-y-8 max-w-md">
          {/* Form section divider */}
          <div className="space-y-4">
            <p className="text-caption-strong text-foreground-muted">Form Section Divider</p>
            <div className="p-4 border border-border rounded-lg space-y-4">
              <div>
                <p className="text-body-strong">Personal Information</p>
                <p className="text-caption text-foreground-muted">Name, email, phone</p>
              </div>
              <Separator spacing="sm" />
              <div>
                <p className="text-body-strong">Work Experience</p>
                <p className="text-caption text-foreground-muted">Previous jobs and roles</p>
              </div>
            </div>
          </div>

          {/* Auth alternative */}
          <div className="space-y-4">
            <p className="text-caption-strong text-foreground-muted">Auth Alternative</p>
            <div className="p-4 border border-border rounded-lg">
              <button className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg text-body-sm">
                Sign in with Email
              </button>
              <Separator label="or continue with" spacing="md" />
              <div className="flex gap-2">
                <button className="flex-1 py-2 px-4 border border-border rounded-lg text-body-sm">
                  Google
                </button>
                <button className="flex-1 py-2 px-4 border border-border rounded-lg text-body-sm">
                  LinkedIn
                </button>
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
          "Use to visually separate distinct content sections",
          "Use labels for alternative actions (e.g., 'or')",
          "Use vertical separators in inline layouts",
          "Choose appropriate spacing for your layout",
        ]}
        donts={[
          "Don't overuse separators - whitespace often works better",
          "Don't use for purely decorative purposes without meaning",
          "Don't mix variants within the same context",
          "Don't use labels on vertical separators",
        ]}
      />

      <PageNavigation currentPath="/design-system/components/separator" />
    </div>
  );
}
