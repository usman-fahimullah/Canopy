"use client";

import React from "react";
import Link from "next/link";
import { PageNavigation } from "@/components/design-system/PageNavigation";
import { ArrowRight } from "@/components/Icons";

const formControlComponents = [
  {
    name: "Input",
    href: "/design-system/components/input",
    description: "Single-line text input for forms",
  },
  {
    name: "Textarea",
    href: "/design-system/components/textarea",
    description: "Multi-line text input for longer content",
  },
  {
    name: "Select",
    href: "/design-system/components/select",
    description: "Dropdown selection for choosing options",
  },
  {
    name: "Checkbox",
    href: "/design-system/components/checkbox",
    description: "Multiple selection toggle controls",
  },
  {
    name: "Radio Group",
    href: "/design-system/components/radio-group",
    description: "Single selection from a list of options",
  },
  {
    name: "Switch",
    href: "/design-system/components/switch",
    description: "Toggle between two states (on/off)",
  },
  {
    name: "Slider",
    href: "/design-system/components/slider",
    description: "Select a value from a continuous range",
  },
  {
    name: "Segmented Controller",
    href: "/design-system/components/segmented-controller",
    description: "Toggle selection for 2-5 mutually exclusive options",
  },
  {
    name: "Search Input",
    href: "/design-system/components/search-input",
    description: "Specialized input for search and location",
  },
  {
    name: "Chip",
    href: "/design-system/components/chip",
    description: "Tags for filters, categories, and selections",
  },
  {
    name: "Label",
    href: "/design-system/components/label",
    description: "Accessible labels for form controls",
  },
];

export default function FormControlsPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Form Controls
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          Form elements for collecting user input with consistent styling, validation
          states, and accessibility features.
        </p>
      </div>

      {/* Component Grid */}
      <div id="components" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {formControlComponents.map((component) => (
          <Link
            key={component.href}
            href={component.href}
            className="group p-4 border border-border rounded-lg hover:border-primary-300 hover:bg-background-subtle transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-body-strong text-foreground group-hover:text-primary-600 transition-colors">
                  {component.name}
                </h3>
                <p className="text-body-sm text-foreground-muted mt-1">
                  {component.description}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-foreground-muted group-hover:text-primary-600 transition-colors flex-shrink-0 mt-1" />
            </div>
          </Link>
        ))}
      </div>

      {/* Guidelines */}
      <div id="guidelines" className="space-y-6">
        <h2 className="text-heading-md text-foreground">Guidelines</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-4 border border-semantic-success/30 rounded-lg bg-semantic-success/5">
            <h3 className="text-body-strong text-semantic-success mb-3">Do</h3>
            <ul className="space-y-2 text-body-sm text-foreground-muted">
              <li className="flex gap-2">
                <span className="text-semantic-success">✓</span>
                Use clear, descriptive labels for all inputs
              </li>
              <li className="flex gap-2">
                <span className="text-semantic-success">✓</span>
                Provide helpful placeholder text as examples
              </li>
              <li className="flex gap-2">
                <span className="text-semantic-success">✓</span>
                Show error states with helpful messages
              </li>
              <li className="flex gap-2">
                <span className="text-semantic-success">✓</span>
                Group related form fields together
              </li>
            </ul>
          </div>
          <div className="p-4 border border-semantic-error/30 rounded-lg bg-semantic-error/5">
            <h3 className="text-body-strong text-semantic-error mb-3">Don&apos;t</h3>
            <ul className="space-y-2 text-body-sm text-foreground-muted">
              <li className="flex gap-2">
                <span className="text-semantic-error">✗</span>
                Use placeholder text as the only label
              </li>
              <li className="flex gap-2">
                <span className="text-semantic-error">✗</span>
                Disable form fields without explanation
              </li>
              <li className="flex gap-2">
                <span className="text-semantic-error">✗</span>
                Use red color for non-error states
              </li>
              <li className="flex gap-2">
                <span className="text-semantic-error">✗</span>
                Require fields unless truly necessary
              </li>
            </ul>
          </div>
        </div>
      </div>

      <PageNavigation currentPath="/design-system/components/form-controls" />
    </div>
  );
}
