"use client";

import React from "react";
import { Label, Input, Textarea, Checkbox } from "@/components/ui";
import { ComponentCard, UsageGuide } from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";

const labelProps = [
  { name: "htmlFor", type: "string", default: "undefined", description: "Associates label with form control" },
  { name: "required", type: "boolean", default: "false", description: "Shows required indicator (*)" },
  { name: "description", type: "string", default: "undefined", description: "Optional helper text below label" },
  { name: "className", type: "string", default: "undefined", description: "Additional CSS classes" },
];

export default function LabelPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Label
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          Labels provide accessible names for form controls. They help users understand
          what information is expected and improve form usability.
        </p>
      </div>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Standard label with input"
      >
        <CodePreview
          code={`<div className="space-y-2">
  <Label htmlFor="email">Email address</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
</div>`}
        >
          <div className="space-y-2 max-w-sm">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Required Fields */}
      <ComponentCard
        id="required"
        title="Required Fields"
        description="Show required indicator with the required prop"
      >
        <div className="grid gap-6 md:grid-cols-2 max-w-2xl">
          <div className="space-y-2">
            <Label htmlFor="name" required>Full name</Label>
            <Input id="name" placeholder="Enter your name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
          </div>
        </div>
      </ComponentCard>

      {/* With Description */}
      <ComponentCard
        id="with-description"
        title="With Description"
        description="Add helper text using the description prop"
      >
        <div className="space-y-6 max-w-md">
          <div className="space-y-2">
            <Label
              htmlFor="password"
              required
              description="Must be at least 8 characters with a number"
            >
              Password
            </Label>
            <Input id="password" type="password" placeholder="Enter password" />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="bio"
              description="Brief description for your profile page"
            >
              Bio
            </Label>
            <Textarea id="bio" placeholder="Tell us about yourself..." />
          </div>
        </div>
      </ComponentCard>

      {/* With Different Controls */}
      <ComponentCard
        id="with-controls"
        title="With Different Controls"
        description="Labels work with all form elements"
      >
        <div className="space-y-6 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="job-title">Job title</Label>
            <Input id="job-title" placeholder="e.g., Solar Installer" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="job-description">Job description</Label>
            <Textarea id="job-description" placeholder="Describe the role..." />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms" className="cursor-pointer font-normal">
              I agree to the terms and conditions
            </Label>
          </div>
        </div>
      </ComponentCard>

      {/* Inline Labels */}
      <ComponentCard
        id="inline"
        title="Inline Labels"
        description="Labels alongside checkboxes and switches"
      >
        <div className="space-y-4 max-w-md">
          <div className="flex items-center gap-2">
            <Checkbox id="notifications" />
            <Label htmlFor="notifications" className="cursor-pointer font-normal">
              Enable email notifications
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="marketing" />
            <Label htmlFor="marketing" className="cursor-pointer font-normal">
              Subscribe to marketing emails
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="updates" defaultChecked />
            <Label htmlFor="updates" className="cursor-pointer font-normal">
              Receive product updates
            </Label>
          </div>
        </div>
      </ComponentCard>

      {/* Props */}
      <ComponentCard id="props" title="Props">
        <PropsTable props={labelProps} />
      </ComponentCard>

      {/* Accessibility */}
      <ComponentCard
        id="accessibility"
        title="Accessibility"
        description="Labels are essential for accessibility"
      >
        <div className="p-4 border border-border rounded-lg bg-background-subtle max-w-lg">
          <ul className="space-y-2 text-body-sm">
            <li className="flex gap-2">
              <span className="text-semantic-success">✓</span>
              Always use <code className="text-caption bg-background-muted px-1 rounded">htmlFor</code> to associate labels with inputs
            </li>
            <li className="flex gap-2">
              <span className="text-semantic-success">✓</span>
              Labels are clickable and focus the associated input
            </li>
            <li className="flex gap-2">
              <span className="text-semantic-success">✓</span>
              Screen readers announce the label when the input is focused
            </li>
            <li className="flex gap-2">
              <span className="text-semantic-success">✓</span>
              Required indicator is hidden from screen readers (use aria-required on input)
            </li>
          </ul>
        </div>
      </ComponentCard>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Always associate labels with their inputs using htmlFor",
          "Use clear, descriptive label text",
          "Mark required fields consistently",
          "Place labels above or to the left of inputs",
        ]}
        donts={[
          "Don't use placeholder text instead of labels",
          "Don't hide labels (except for obvious icon-only inputs)",
          "Don't use vague labels like 'Enter text here'",
          "Don't overuse required indicators",
        ]}
      />

      <PageNavigation currentPath="/design-system/components/label" />
    </div>
  );
}
