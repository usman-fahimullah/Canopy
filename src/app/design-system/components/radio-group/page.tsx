"use client";

import React from "react";
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemWithLabel,
  RadioGroupCard,
  RadioGroupWithLabel,
  Label,
} from "@/components/ui";
import {
  ComponentCard,
  UsageGuide,
  AccessibilityInfo,
} from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";
import {
  CheckCircle,
  XCircle,
  Bell,
  Clock,
  CalendarBlank,
  MapPin,
  House,
  Buildings,
} from "@phosphor-icons/react";

const radioGroupProps = [
  {
    name: "value",
    type: "string",
    default: "undefined",
    description: "Controlled selected value",
  },
  {
    name: "defaultValue",
    type: "string",
    default: "undefined",
    description: "Default selected value (uncontrolled)",
  },
  {
    name: "onValueChange",
    type: "(value: string) => void",
    default: "undefined",
    description: "Callback when selection changes",
  },
  {
    name: "size",
    type: '"sm" | "default" | "lg"',
    default: '"default"',
    description: "Size of all radio items (16px, 20px, 24px)",
  },
  {
    name: "error",
    type: "boolean",
    default: "false",
    description: "Show error state for all items",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disables all radio buttons",
  },
  {
    name: "orientation",
    type: '"horizontal" | "vertical"',
    default: '"vertical"',
    description: "Layout direction",
  },
  {
    name: "name",
    type: "string",
    default: "undefined",
    description: "Name for form submission",
  },
];

const radioGroupItemProps = [
  {
    name: "value",
    type: "string",
    default: "required",
    description: "Unique value for this option",
  },
  {
    name: "size",
    type: '"sm" | "default" | "lg"',
    default: "from context",
    description: "Size override for this item",
  },
  {
    name: "error",
    type: "boolean",
    default: "from context",
    description: "Error state override for this item",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disables this radio button",
  },
  {
    name: "id",
    type: "string",
    default: "undefined",
    description: "ID for label association",
  },
];

const radioGroupItemWithLabelProps = [
  {
    name: "value",
    type: "string",
    default: "required",
    description: "Unique value for this option",
  },
  {
    name: "label",
    type: "string",
    default: "required",
    description: "Label text displayed next to the radio",
  },
  {
    name: "description",
    type: "string",
    default: "undefined",
    description: "Optional description text below the label",
  },
  {
    name: "size",
    type: '"sm" | "default" | "lg"',
    default: "from context",
    description: "Size variant",
  },
  {
    name: "error",
    type: "boolean",
    default: "from context",
    description: "Show error state",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disables this option",
  },
];

const radioGroupCardProps = [
  {
    name: "value",
    type: "string",
    default: "required",
    description: "Unique value for this option",
  },
  {
    name: "label",
    type: "string",
    default: "required",
    description: "Label text",
  },
  {
    name: "description",
    type: "string",
    default: "undefined",
    description: "Description text",
  },
  {
    name: "icon",
    type: "React.ReactNode",
    default: "undefined",
    description: "Optional icon element",
  },
  {
    name: "size",
    type: '"sm" | "default" | "lg"',
    default: "from context",
    description: "Size variant",
  },
  {
    name: "error",
    type: "boolean",
    default: "from context",
    description: "Show error state",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disables this option",
  },
];

const radioGroupWithLabelProps = [
  {
    name: "label",
    type: "string",
    default: "undefined",
    description: "Group label",
  },
  {
    name: "helperText",
    type: "string",
    default: "undefined",
    description: "Helper text for the group",
  },
  {
    name: "error",
    type: "boolean",
    default: "false",
    description: "Show error state",
  },
  {
    name: "errorMessage",
    type: "string",
    default: "undefined",
    description: "Error message displayed below the group",
  },
  {
    name: "required",
    type: "boolean",
    default: "false",
    description: "Show required indicator (*)",
  },
  {
    name: "size",
    type: '"sm" | "default" | "lg"',
    default: '"default"',
    description: "Size variant for all items",
  },
];

export default function RadioGroupPage() {
  const [selected, setSelected] = React.useState<string>();
  const [locationType, setLocationType] = React.useState("remote");

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Radio Group
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          Radio groups allow users to select a single option from a list of
          mutually exclusive choices. Only one option can be selected at a time.
        </p>

        {/* When to Use / When Not to Use */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-[var(--background-success)]/10 rounded-lg border border-[var(--border-success)]">
            <h3 className="font-semibold text-[var(--foreground-success)] mb-2">
              When to use
            </h3>
            <ul className="text-sm space-y-1 text-foreground-muted">
              <li>• 2-5 mutually exclusive options</li>
              <li>• All options should be visible at once</li>
              <li>• Options need descriptions or context</li>
              <li>• Selection determines subsequent form behavior</li>
            </ul>
          </div>
          <div className="p-4 bg-[var(--background-error)]/10 rounded-lg border border-[var(--border-error)]">
            <h3 className="font-semibold text-[var(--foreground-error)] mb-2">
              When not to use
            </h3>
            <ul className="text-sm space-y-1 text-foreground-muted">
              <li>• Multiple selections needed (use Checkbox)</li>
              <li>• More than 5 options (use Select/Dropdown)</li>
              <li>• Toggling a single setting (use Switch)</li>
              <li>• Binary yes/no without context (use Checkbox)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Anatomy */}
      <ComponentCard
        id="anatomy"
        title="Anatomy"
        description="The radio group is composed of these parts"
      >
        <div className="relative p-8 bg-[var(--background-subtle)] rounded-lg">
          <div className="flex items-start gap-4">
            <div className="relative">
              <RadioGroup defaultValue="option-1">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="option-1" id="anatomy-radio" size="lg" />
                  <Label htmlFor="anatomy-radio" className="cursor-pointer">
                    Option label
                  </Label>
                </div>
              </RadioGroup>
              <div className="absolute -top-3 -left-3 w-5 h-5 bg-[var(--foreground-brand)] text-white rounded-full flex items-center justify-center text-xs font-medium">
                1
              </div>
              <div className="absolute -top-3 left-8 w-5 h-5 bg-[var(--foreground-brand)] text-white rounded-full flex items-center justify-center text-xs font-medium">
                2
              </div>
              <div className="absolute -top-3 left-20 w-5 h-5 bg-[var(--foreground-brand)] text-white rounded-full flex items-center justify-center text-xs font-medium">
                3
              </div>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-2 text-sm">
            <div>
              <span className="font-mono bg-[var(--background-muted)] px-1 rounded">
                1
              </span>{" "}
              Radio circle
            </div>
            <div>
              <span className="font-mono bg-[var(--background-muted)] px-1 rounded">
                2
              </span>{" "}
              Selection dot
            </div>
            <div>
              <span className="font-mono bg-[var(--background-muted)] px-1 rounded">
                3
              </span>{" "}
              Label (clickable)
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Standard radio group with options"
      >
        <CodePreview
          code={`import { RadioGroup, RadioGroupItem, Label } from "@/components/ui";

<RadioGroup defaultValue="full-time">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="full-time" id="full-time" />
    <Label htmlFor="full-time">Full-time</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="part-time" id="part-time" />
    <Label htmlFor="part-time">Part-time</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="contract" id="contract" />
    <Label htmlFor="contract">Contract</Label>
  </div>
</RadioGroup>`}
        >
          <RadioGroup defaultValue="full-time">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="full-time" id="full-time" />
              <Label htmlFor="full-time" className="cursor-pointer">
                Full-time
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="part-time" id="part-time" />
              <Label htmlFor="part-time" className="cursor-pointer">
                Part-time
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="contract" id="contract" />
              <Label htmlFor="contract" className="cursor-pointer">
                Contract
              </Label>
            </div>
          </RadioGroup>
        </CodePreview>
      </ComponentCard>

      {/* Sizes */}
      <ComponentCard
        id="sizes"
        title="Sizes"
        description="Three size variants: small (16px), default (20px), and large (24px)"
      >
        <div className="flex flex-wrap items-start gap-12">
          <div className="space-y-2">
            <Label className="text-caption text-foreground-muted">Small</Label>
            <RadioGroup defaultValue="sm-1" size="sm">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="sm-1" id="sm-1" />
                <Label htmlFor="sm-1" className="cursor-pointer text-sm">
                  Option 1
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="sm-2" id="sm-2" />
                <Label htmlFor="sm-2" className="cursor-pointer text-sm">
                  Option 2
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label className="text-caption text-foreground-muted">Default</Label>
            <RadioGroup defaultValue="default-1" size="default">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="default-1" id="default-1" />
                <Label htmlFor="default-1" className="cursor-pointer">
                  Option 1
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="default-2" id="default-2" />
                <Label htmlFor="default-2" className="cursor-pointer">
                  Option 2
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label className="text-caption text-foreground-muted">Large</Label>
            <RadioGroup defaultValue="lg-1" size="lg">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="lg-1" id="lg-1" />
                <Label htmlFor="lg-1" className="cursor-pointer text-lg">
                  Option 1
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="lg-2" id="lg-2" />
                <Label htmlFor="lg-2" className="cursor-pointer text-lg">
                  Option 2
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </ComponentCard>

      {/* States */}
      <ComponentCard
        id="states"
        title="States"
        description="Interactive and visual states"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <Label className="text-caption text-foreground-muted">
              Unselected
            </Label>
            <RadioGroup>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="unselected" id="state-unselected" />
                <Label htmlFor="state-unselected" className="cursor-pointer">
                  Unselected
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label className="text-caption text-foreground-muted">
              Selected
            </Label>
            <RadioGroup defaultValue="selected">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="selected" id="state-selected" />
                <Label htmlFor="state-selected" className="cursor-pointer">
                  Selected
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label className="text-caption text-foreground-muted">Error</Label>
            <RadioGroup error>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="error" id="state-error" />
                <Label
                  htmlFor="state-error"
                  className="cursor-pointer text-[var(--foreground-error)]"
                >
                  Error
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label className="text-caption text-foreground-muted">Disabled</Label>
            <RadioGroup defaultValue="disabled">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="disabled" id="state-disabled" disabled />
                <Label
                  htmlFor="state-disabled"
                  className="cursor-pointer text-foreground-muted"
                >
                  Disabled
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </ComponentCard>

      {/* Controlled */}
      <ComponentCard
        id="controlled"
        title="Controlled Radio Group"
        description="Manage selection state with React state"
      >
        <CodePreview
          code={`const [selected, setSelected] = React.useState<string>();

<RadioGroup value={selected} onValueChange={setSelected}>
  <RadioGroupItemWithLabel value="remote" label="Remote" />
  <RadioGroupItemWithLabel value="hybrid" label="Hybrid" />
  <RadioGroupItemWithLabel value="onsite" label="On-site" />
</RadioGroup>

<p>Selected: {selected}</p>`}
        >
          <div className="space-y-4">
            <RadioGroup value={selected} onValueChange={setSelected}>
              <RadioGroupItemWithLabel value="remote" label="Remote" />
              <RadioGroupItemWithLabel value="hybrid" label="Hybrid" />
              <RadioGroupItemWithLabel value="onsite" label="On-site" />
            </RadioGroup>
            {selected && (
              <p className="text-caption text-foreground-muted">
                Selected:{" "}
                <span className="font-medium text-foreground">{selected}</span>
              </p>
            )}
          </div>
        </CodePreview>
      </ComponentCard>

      {/* RadioGroupItemWithLabel */}
      <ComponentCard
        id="with-label"
        title="RadioGroupItemWithLabel"
        description="Compound component with built-in label and optional description"
      >
        <CodePreview
          code={`import { RadioGroup, RadioGroupItemWithLabel } from "@/components/ui";

<RadioGroup defaultValue="instant">
  <RadioGroupItemWithLabel
    value="instant"
    label="Instant"
    description="Get notified immediately"
  />
  <RadioGroupItemWithLabel
    value="daily"
    label="Daily digest"
    description="Receive a summary once per day"
  />
</RadioGroup>`}
        >
          <RadioGroup defaultValue="instant">
            <RadioGroupItemWithLabel
              value="instant"
              label="Instant"
              description="Get notified immediately when candidates apply"
            />
            <RadioGroupItemWithLabel
              value="daily"
              label="Daily digest"
              description="Receive a summary once per day"
            />
            <RadioGroupItemWithLabel
              value="weekly"
              label="Weekly digest"
              description="Receive a summary once per week"
            />
          </RadioGroup>
        </CodePreview>
      </ComponentCard>

      {/* RadioGroupCard */}
      <ComponentCard
        id="card"
        title="RadioGroupCard"
        description="Radio options styled as selectable cards with visual highlight"
      >
        <CodePreview
          code={`import { RadioGroup, RadioGroupCard } from "@/components/ui";
import { House, Buildings, MapPin } from "@phosphor-icons/react";

<RadioGroup defaultValue="remote">
  <RadioGroupCard
    value="remote"
    label="Remote"
    description="Work from anywhere"
    icon={<House size={20} weight="fill" />}
  />
  <RadioGroupCard
    value="hybrid"
    label="Hybrid"
    description="Mix of office and remote"
    icon={<MapPin size={20} weight="fill" />}
  />
  <RadioGroupCard
    value="onsite"
    label="On-site"
    description="Work from our office"
    icon={<Buildings size={20} weight="fill" />}
  />
</RadioGroup>`}
        >
          <div className="max-w-md">
            <RadioGroup
              value={locationType}
              onValueChange={setLocationType}
            >
              <RadioGroupCard
                value="remote"
                label="Remote"
                description="Work from anywhere in the world"
                icon={<House size={20} weight="fill" />}
              />
              <RadioGroupCard
                value="hybrid"
                label="Hybrid"
                description="Mix of office and remote work"
                icon={<MapPin size={20} weight="fill" />}
              />
              <RadioGroupCard
                value="onsite"
                label="On-site"
                description="Work from our office location"
                icon={<Buildings size={20} weight="fill" />}
              />
            </RadioGroup>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* RadioGroupWithLabel */}
      <ComponentCard
        id="group-with-label"
        title="RadioGroupWithLabel"
        description="Complete radio group with label, helper text, and error handling"
      >
        <CodePreview
          code={`import { RadioGroupWithLabel, RadioGroupItemWithLabel } from "@/components/ui";

<RadioGroupWithLabel
  label="Employment type"
  helperText="Select your preferred work arrangement"
  required
>
  <RadioGroupItemWithLabel value="full-time" label="Full-time" />
  <RadioGroupItemWithLabel value="part-time" label="Part-time" />
  <RadioGroupItemWithLabel value="contract" label="Contract" />
</RadioGroupWithLabel>`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <RadioGroupWithLabel
              label="Employment type"
              helperText="Select your preferred work arrangement"
              required
              defaultValue="full-time"
            >
              <RadioGroupItemWithLabel value="full-time" label="Full-time" />
              <RadioGroupItemWithLabel value="part-time" label="Part-time" />
              <RadioGroupItemWithLabel value="contract" label="Contract" />
            </RadioGroupWithLabel>

            <RadioGroupWithLabel
              label="Experience level"
              error
              errorMessage="Please select an experience level"
              required
            >
              <RadioGroupItemWithLabel value="junior" label="Junior" />
              <RadioGroupItemWithLabel value="mid" label="Mid-level" />
              <RadioGroupItemWithLabel value="senior" label="Senior" />
            </RadioGroupWithLabel>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Horizontal Layout */}
      <ComponentCard
        id="horizontal"
        title="Horizontal Layout"
        description="Arrange options in a row using flex"
      >
        <div className="space-y-4">
          <Label className="block">Experience level</Label>
          <RadioGroup defaultValue="mid" className="flex gap-6">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="junior" id="h-junior" />
              <Label htmlFor="h-junior" className="cursor-pointer">
                Junior
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="mid" id="h-mid" />
              <Label htmlFor="h-mid" className="cursor-pointer">
                Mid-level
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="senior" id="h-senior" />
              <Label htmlFor="h-senior" className="cursor-pointer">
                Senior
              </Label>
            </div>
          </RadioGroup>
        </div>
      </ComponentCard>

      {/* Props Tables */}
      <ComponentCard id="props-group" title="RadioGroup Props">
        <PropsTable props={radioGroupProps} />
      </ComponentCard>

      <ComponentCard id="props-item" title="RadioGroupItem Props">
        <PropsTable props={radioGroupItemProps} />
      </ComponentCard>

      <ComponentCard id="props-item-with-label" title="RadioGroupItemWithLabel Props">
        <PropsTable props={radioGroupItemWithLabelProps} />
      </ComponentCard>

      <ComponentCard id="props-card" title="RadioGroupCard Props">
        <PropsTable props={radioGroupCardProps} />
      </ComponentCard>

      <ComponentCard id="props-with-label" title="RadioGroupWithLabel Props">
        <PropsTable props={radioGroupWithLabelProps} />
      </ComponentCard>

      {/* Do's and Don'ts */}
      <ComponentCard id="dos-donts" title="Do's and Don'ts">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* DO */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[var(--foreground-success)]">
              <CheckCircle size={20} weight="fill" />
              <span className="font-semibold">Do</span>
            </div>
            <div className="p-4 border-2 border-[var(--border-success)] rounded-lg">
              <RadioGroupWithLabel label="Notification frequency" defaultValue="daily">
                <RadioGroupItemWithLabel
                  value="instant"
                  label="Instant"
                  description="Real-time notifications"
                />
                <RadioGroupItemWithLabel
                  value="daily"
                  label="Daily"
                  description="Once per day digest"
                />
              </RadioGroupWithLabel>
            </div>
            <p className="text-sm text-foreground-muted">
              Pre-select a sensible default option when possible.
            </p>
          </div>

          {/* DON'T */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[var(--foreground-error)]">
              <XCircle size={20} weight="fill" />
              <span className="font-semibold">Don&apos;t</span>
            </div>
            <div className="p-4 border-2 border-[var(--border-error)] rounded-lg">
              <RadioGroupWithLabel label="Select all that apply" required>
                <RadioGroupItemWithLabel value="react" label="React" />
                <RadioGroupItemWithLabel value="vue" label="Vue" />
                <RadioGroupItemWithLabel value="angular" label="Angular" />
              </RadioGroupWithLabel>
            </div>
            <p className="text-sm text-foreground-muted">
              Don&apos;t use radio groups for multi-select. Use Checkbox instead.
            </p>
          </div>

          {/* DO */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[var(--foreground-success)]">
              <CheckCircle size={20} weight="fill" />
              <span className="font-semibold">Do</span>
            </div>
            <div className="p-4 border-2 border-[var(--border-success)] rounded-lg">
              <RadioGroupWithLabel label="Employment type">
                <RadioGroupItemWithLabel value="full" label="Full-time" />
                <RadioGroupItemWithLabel value="part" label="Part-time" />
                <RadioGroupItemWithLabel value="contract" label="Contract" />
              </RadioGroupWithLabel>
            </div>
            <p className="text-sm text-foreground-muted">
              Use for 2-5 mutually exclusive options that are all visible.
            </p>
          </div>

          {/* DON'T */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[var(--foreground-error)]">
              <XCircle size={20} weight="fill" />
              <span className="font-semibold">Don&apos;t</span>
            </div>
            <div className="p-4 border-2 border-[var(--border-error)] rounded-lg max-h-32 overflow-y-auto">
              <RadioGroupWithLabel label="Country">
                {["USA", "Canada", "UK", "Germany", "France", "Spain", "Italy", "Japan"].map((country) => (
                  <RadioGroupItemWithLabel key={country} value={country.toLowerCase()} label={country} />
                ))}
              </RadioGroupWithLabel>
            </div>
            <p className="text-sm text-foreground-muted">
              Don&apos;t use for many options. Use a Select/Dropdown instead.
            </p>
          </div>
        </div>
      </ComponentCard>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Use for 2-5 mutually exclusive options",
          "Pre-select a reasonable default when possible",
          "Use vertical layout for 3+ options for better readability",
          "Always pair with clickable labels",
          "Use RadioGroupCard when options need more context",
        ]}
        donts={[
          "Don't use for multi-select (use Checkbox)",
          "Don't use for more than 5 options (use Select)",
          "Don't leave without a default if the field is required",
          "Don't use for toggling a single option (use Switch)",
          "Don't mix different RadioGroup components in same group",
        ]}
      />

      {/* Accessibility */}
      <AccessibilityInfo
        items={[
          "**Keyboard**: Tab to focus group, Arrow keys to navigate options, Space to select",
          "**Focus indicator**: Visible ring using blue-500 color",
          "**Screen readers**: Announces group label, option labels, and selection state",
          "**ARIA**: Uses native radiogroup role with aria-checked",
          "**Labels**: Always associate labels with radio items using htmlFor/id",
          "**Error messages**: Connected via aria-describedby for screen readers",
          "**Roving tabindex**: Only selected (or first) item is tabbable",
        ]}
      />

      {/* Real-World Examples */}
      <ComponentCard
        id="examples"
        title="Real-World Examples"
        description="Common use cases for radio groups"
      >
        <div className="space-y-8">
          {/* Example: Job Filters */}
          <div>
            <h4 className="text-body-strong mb-3">Job Filters</h4>
            <div className="border border-[var(--border-default)] rounded-lg p-4 max-w-sm">
              <RadioGroupWithLabel
                label="Location type"
                defaultValue="any"
              >
                <RadioGroupItemWithLabel value="any" label="Any location" />
                <RadioGroupItemWithLabel value="remote" label="Remote only" />
                <RadioGroupItemWithLabel value="hybrid" label="Hybrid" />
                <RadioGroupItemWithLabel value="onsite" label="On-site only" />
              </RadioGroupWithLabel>
            </div>
          </div>

          {/* Example: Notification Settings */}
          <div>
            <h4 className="text-body-strong mb-3">Notification Settings</h4>
            <div className="border border-[var(--border-default)] rounded-lg p-4 max-w-md">
              <RadioGroup defaultValue="instant">
                <RadioGroupCard
                  value="instant"
                  label="Instant notifications"
                  description="Get notified immediately when candidates apply"
                  icon={<Bell size={20} weight="fill" />}
                />
                <RadioGroupCard
                  value="daily"
                  label="Daily digest"
                  description="Receive one email per day with all updates"
                  icon={<Clock size={20} weight="fill" />}
                />
                <RadioGroupCard
                  value="weekly"
                  label="Weekly summary"
                  description="Get a weekly report every Monday"
                  icon={<CalendarBlank size={20} weight="fill" />}
                />
              </RadioGroup>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Related Components */}
      <ComponentCard
        id="related"
        title="Related Components"
        description="Components that work well with Radio Group"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/design-system/components/checkbox"
            className="p-4 border border-[var(--border-default)] rounded-lg hover:border-[var(--border-brand)] transition-colors"
          >
            <p className="font-medium">Checkbox</p>
            <p className="text-caption text-foreground-muted">
              For multi-select options
            </p>
          </a>
          <a
            href="/design-system/components/switch"
            className="p-4 border border-[var(--border-default)] rounded-lg hover:border-[var(--border-brand)] transition-colors"
          >
            <p className="font-medium">Switch</p>
            <p className="text-caption text-foreground-muted">
              For binary toggles
            </p>
          </a>
          <a
            href="/design-system/components/dropdown"
            className="p-4 border border-[var(--border-default)] rounded-lg hover:border-[var(--border-brand)] transition-colors"
          >
            <p className="font-medium">Dropdown</p>
            <p className="text-caption text-foreground-muted">
              For many options
            </p>
          </a>
          <a
            href="/design-system/components/segmented-controller"
            className="p-4 border border-[var(--border-default)] rounded-lg hover:border-[var(--border-brand)] transition-colors"
          >
            <p className="font-medium">Segmented Controller</p>
            <p className="text-caption text-foreground-muted">
              For compact selection
            </p>
          </a>
        </div>
      </ComponentCard>

      <PageNavigation currentPath="/design-system/components/radio-group" />
    </div>
  );
}
