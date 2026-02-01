"use client";

import React from "react";
import {
  Label,
  Dropdown,
  DropdownContent,
  DropdownGroup,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownTrigger,
  DropdownValue,
  Button,
  Card,
  CardContent,
} from "@/components/ui";
import {
  ComponentCard,
  UsageGuide,
  AccessibilityInfo,
  ComponentAnatomy,
  RelatedComponents,
  RealWorldExample,
} from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";
import { ArrowRight } from "@/components/Icons";

// ============================================
// PROPS DEFINITIONS
// ============================================

const dropdownRootProps = [
  {
    name: "value",
    type: "string",
    description: "Controlled selected value",
  },
  {
    name: "defaultValue",
    type: "string",
    description: "Default selected value for uncontrolled mode",
  },
  {
    name: "onValueChange",
    type: "(value: string) => void",
    description: "Callback fired when selection changes",
  },
  {
    name: "open",
    type: "boolean",
    description: "Controlled open state of the dropdown",
  },
  {
    name: "defaultOpen",
    type: "boolean",
    description: "Default open state for uncontrolled mode",
  },
  {
    name: "onOpenChange",
    type: "(open: boolean) => void",
    description: "Callback fired when open state changes",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disables the entire dropdown",
  },
  {
    name: "required",
    type: "boolean",
    default: "false",
    description: "Marks the dropdown as required in forms",
  },
  {
    name: "name",
    type: "string",
    description: "Form field name for native form submission",
  },
];

const dropdownTriggerProps = [
  {
    name: "error",
    type: "boolean",
    default: "false",
    description: "Applies error styling with red border",
  },
  {
    name: "success",
    type: "boolean",
    default: "false",
    description: "Applies success styling with green border",
  },
  {
    name: "size",
    type: '"default" | "lg"',
    default: '"default"',
    description: "Size variant affecting font size",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes",
  },
];

const dropdownContentProps = [
  {
    name: "maxHeight",
    type: "string",
    default: '"300px"',
    description:
      "Maximum height before scrolling is enabled. Content becomes scrollable with gradient indicators when exceeded.",
  },
  {
    name: "position",
    type: '"popper" | "item-aligned"',
    default: '"popper"',
    description: "Positioning strategy for the dropdown content",
  },
  {
    name: "side",
    type: '"top" | "right" | "bottom" | "left"',
    default: '"bottom"',
    description: "Preferred side of the trigger to render against",
  },
  {
    name: "sideOffset",
    type: "number",
    default: "4",
    description: "Distance in pixels from the trigger",
  },
];

const dropdownItemProps = [
  {
    name: "value",
    type: "string",
    required: true,
    description: "Unique value for this option",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disables this specific option",
  },
  {
    name: "children",
    type: "ReactNode",
    required: true,
    description: "The option label content",
  },
];

// Generate many options for scrolling demo
const manyOptions = [
  "Solar Energy",
  "Wind Power",
  "Hydroelectric",
  "Geothermal",
  "Biomass",
  "Nuclear",
  "Electric Vehicles",
  "Energy Storage",
  "Smart Grid",
  "Carbon Capture",
  "Sustainable Agriculture",
  "Circular Economy",
  "ESG Finance",
  "Green Building",
  "Water Management",
];

// ============================================
// PAGE COMPONENT
// ============================================

export default function DropdownPage() {
  const [employmentType, setEmploymentType] = React.useState<string>();
  const [location, setLocation] = React.useState<string>();
  const [category, setCategory] = React.useState<string>();
  const [scrollDemo, setScrollDemo] = React.useState<string>();

  return (
    <div className="space-y-12">
      {/* ============================================ */}
      {/* 1. OVERVIEW */}
      {/* ============================================ */}
      <div id="overview">
        <h1 className="mb-2 text-heading-lg text-foreground">Dropdown</h1>
        <p className="max-w-3xl text-body text-foreground-muted">
          Dropdown components allow users to choose a single option from a dropdown list. Built on
          Radix UI primitives, they provide full keyboard navigation, screen reader support, and
          customizable styling. Features scrollable content with gradient fade indicators for long
          lists.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-background-brand-subtle px-3 py-1 text-caption font-medium text-foreground-brand">
            Form Control
          </span>
          <span className="rounded-full bg-background-subtle px-3 py-1 text-caption text-foreground-muted">
            Radix UI
          </span>
          <span className="rounded-full bg-background-subtle px-3 py-1 text-caption text-foreground-muted">
            Accessible
          </span>
          <span className="rounded-full bg-background-subtle px-3 py-1 text-caption text-foreground-muted">
            Scrollable
          </span>
        </div>

        {/* When to Use / When Not to Use */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border-success bg-background-success p-4">
            <h3 className="mb-2 font-semibold text-foreground-success">When to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>• Choosing from 5+ predefined options</li>
              <li>• Single selection from a long list</li>
              <li>• Form fields with standard options (country, state)</li>
              <li>• When space is limited for displaying all options</li>
              <li>• Options that don&apos;t require preview before selection</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border-error bg-background-error p-4">
            <h3 className="mb-2 font-semibold text-foreground-error">When not to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>• 2-4 options visible at once (use Radio Group)</li>
              <li>• Actions or commands (use Dropdown Menu)</li>
              <li>• Multiple selections (use Checkbox Group)</li>
              <li>• Searchable long lists (use Combobox)</li>
              <li>• Binary yes/no choices (use Switch or Checkbox)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* 2. ANATOMY */}
      {/* ============================================ */}
      <ComponentAnatomy
        parts={[
          {
            name: "Dropdown (Root)",
            description: "Wrapper component managing state and accessibility",
            required: true,
          },
          {
            name: "DropdownTrigger",
            description:
              "The button that opens the dropdown. Background neutral-100, 8px radius, 16px padding",
            required: true,
          },
          {
            name: "DropdownValue",
            description:
              "Displays the selected value or placeholder. Placeholder is neutral-600, selected is green-800",
            required: true,
          },
          {
            name: "Chevron Icon",
            description:
              "Dropdown indicator that rotates 180° when open. Green-800 color, 24px size",
          },
          {
            name: "DropdownContent",
            description:
              "The dropdown panel with white background, 8px radius, shadow, and scrollable content with gradient indicators",
            required: true,
          },
          {
            name: "Gradient Indicators",
            description:
              "Animated fade gradients at top/bottom that appear when content is scrollable, indicating more options",
          },
          {
            name: "DropdownItem",
            description:
              "Individual options. 14px font, green-800 text, blue-500 when selected with checkmark",
            required: true,
          },
          {
            name: "DropdownGroup / DropdownLabel",
            description: "Optional grouping for organizing related options",
          },
        ]}
      />

      {/* ============================================ */}
      {/* 3. BASIC USAGE */}
      {/* ============================================ */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="The simplest implementation with placeholder and options"
      >
        <CodePreview
          code={`import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  DropdownValue,
  Label,
} from "@/components/ui";

<div className="space-y-2">
  <Label>Job Category</Label>
  <Dropdown>
    <DropdownTrigger>
      <DropdownValue placeholder="Select a category" />
    </DropdownTrigger>
    <DropdownContent>
      <DropdownItem value="solar">Solar Energy</DropdownItem>
      <DropdownItem value="wind">Wind Power</DropdownItem>
      <DropdownItem value="ev">Electric Vehicles</DropdownItem>
    </DropdownContent>
  </Dropdown>
</div>`}
        >
          <div className="max-w-sm space-y-2">
            <Label>Job Category</Label>
            <Dropdown>
              <DropdownTrigger>
                <DropdownValue placeholder="Select a category" />
              </DropdownTrigger>
              <DropdownContent>
                <DropdownItem value="solar">Solar Energy</DropdownItem>
                <DropdownItem value="wind">Wind Power</DropdownItem>
                <DropdownItem value="ev">Electric Vehicles</DropdownItem>
                <DropdownItem value="esg">ESG & Sustainability</DropdownItem>
              </DropdownContent>
            </Dropdown>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 4. SCROLLABLE CONTENT */}
      {/* ============================================ */}
      <ComponentCard
        id="scrollable"
        title="Scrollable Content"
        description="Long lists automatically become scrollable with gradient fade indicators"
      >
        <CodePreview
          code={`// When content exceeds maxHeight (default 300px),
// gradient indicators appear at top/bottom to show more content

<Dropdown>
  <DropdownTrigger>
    <DropdownValue placeholder="Select a category" />
  </DropdownTrigger>
  <DropdownContent maxHeight="200px">
    {/* Many items... */}
    <DropdownItem value="solar">Solar Energy</DropdownItem>
    <DropdownItem value="wind">Wind Power</DropdownItem>
    {/* ... more items */}
  </DropdownContent>
</Dropdown>`}
        >
          <div className="space-y-4">
            <div className="max-w-sm space-y-2">
              <Label>Climate Category (Scrollable)</Label>
              <Dropdown value={scrollDemo} onValueChange={setScrollDemo}>
                <DropdownTrigger>
                  <DropdownValue placeholder="Select a category" />
                </DropdownTrigger>
                <DropdownContent maxHeight="200px">
                  {manyOptions.map((option) => (
                    <DropdownItem key={option} value={option.toLowerCase().replace(/\s+/g, "-")}>
                      {option}
                    </DropdownItem>
                  ))}
                </DropdownContent>
              </Dropdown>
            </div>
            <p className="max-w-md text-caption text-foreground-muted">
              Scroll the dropdown to see gradient indicators appear at top/bottom. The gradients use
              a multi-stop fade with animated transitions for a polished feel.
            </p>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 5. VARIANTS */}
      {/* ============================================ */}
      <ComponentCard
        id="variants"
        title="Variants & Sizes"
        description="Different visual variations and size options"
      >
        <div className="space-y-8">
          {/* Default Size */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-body-strong">Default Size</Label>
              <span className="text-caption text-foreground-muted">
                — 18px font, standard padding
              </span>
            </div>
            <div className="max-w-sm">
              <Dropdown>
                <DropdownTrigger size="default">
                  <DropdownValue placeholder="Default size dropdown" />
                </DropdownTrigger>
                <DropdownContent>
                  <DropdownItem value="option1">Option 1</DropdownItem>
                  <DropdownItem value="option2">Option 2</DropdownItem>
                </DropdownContent>
              </Dropdown>
            </div>
          </div>

          {/* Large Size */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-body-strong">Large Size</Label>
              <span className="text-caption text-foreground-muted">— 20px font for prominence</span>
            </div>
            <div className="max-w-sm">
              <Dropdown>
                <DropdownTrigger size="lg">
                  <DropdownValue placeholder="Large size dropdown" />
                </DropdownTrigger>
                <DropdownContent>
                  <DropdownItem value="option1">Option 1</DropdownItem>
                  <DropdownItem value="option2">Option 2</DropdownItem>
                </DropdownContent>
              </Dropdown>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 6. STATES */}
      {/* ============================================ */}
      <ComponentCard
        id="states"
        title="States"
        description="Visual states for different interaction scenarios"
      >
        <div className="grid max-w-4xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label>Default (Placeholder)</Label>
            <Dropdown>
              <DropdownTrigger>
                <DropdownValue placeholder="Select option..." />
              </DropdownTrigger>
              <DropdownContent>
                <DropdownItem value="opt1">Option 1</DropdownItem>
                <DropdownItem value="opt2">Option 2</DropdownItem>
              </DropdownContent>
            </Dropdown>
            <p className="text-caption text-foreground-muted">
              Neutral-200 border, neutral-600 placeholder
            </p>
          </div>

          <div className="space-y-2">
            <Label>With Selection</Label>
            <Dropdown defaultValue="wind">
              <DropdownTrigger>
                <DropdownValue />
              </DropdownTrigger>
              <DropdownContent>
                <DropdownItem value="solar">Solar Energy</DropdownItem>
                <DropdownItem value="wind">Wind Power</DropdownItem>
              </DropdownContent>
            </Dropdown>
            <p className="text-caption text-foreground-muted">Green-800 text for selected value</p>
          </div>

          <div className="space-y-2">
            <Label>Success</Label>
            <Dropdown defaultValue="valid">
              <DropdownTrigger success>
                <DropdownValue />
              </DropdownTrigger>
              <DropdownContent>
                <DropdownItem value="valid">Valid Selection</DropdownItem>
              </DropdownContent>
            </Dropdown>
            <p className="text-caption text-foreground-muted">Green-500 border indicates valid</p>
          </div>

          <div className="space-y-2">
            <Label>Error</Label>
            <Dropdown>
              <DropdownTrigger error>
                <DropdownValue placeholder="Required field" />
              </DropdownTrigger>
              <DropdownContent>
                <DropdownItem value="opt1">Option 1</DropdownItem>
              </DropdownContent>
            </Dropdown>
            <p className="text-caption text-foreground-error">Please select an option</p>
          </div>

          <div className="space-y-2">
            <Label>Disabled</Label>
            <Dropdown disabled>
              <DropdownTrigger>
                <DropdownValue placeholder="Cannot select" />
              </DropdownTrigger>
              <DropdownContent>
                <DropdownItem value="opt1">Option 1</DropdownItem>
              </DropdownContent>
            </Dropdown>
            <p className="text-caption text-foreground-muted">50% opacity, no interaction</p>
          </div>

          <div className="space-y-2">
            <Label>Disabled Option</Label>
            <Dropdown>
              <DropdownTrigger>
                <DropdownValue placeholder="Some disabled" />
              </DropdownTrigger>
              <DropdownContent>
                <DropdownItem value="available">Available</DropdownItem>
                <DropdownItem value="unavailable" disabled>
                  Unavailable
                </DropdownItem>
              </DropdownContent>
            </Dropdown>
            <p className="text-caption text-foreground-muted">Individual options can be disabled</p>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 7. CONTROLLED USAGE */}
      {/* ============================================ */}
      <ComponentCard
        id="controlled"
        title="Controlled Usage"
        description="Managing dropdown state with React hooks"
      >
        <CodePreview
          code={`const [value, setValue] = React.useState<string>();

<Dropdown value={value} onValueChange={setValue}>
  <DropdownTrigger>
    <DropdownValue placeholder="Select type" />
  </DropdownTrigger>
  <DropdownContent>
    <DropdownItem value="full-time">Full-time</DropdownItem>
    <DropdownItem value="part-time">Part-time</DropdownItem>
    <DropdownItem value="contract">Contract</DropdownItem>
  </DropdownContent>
</Dropdown>

<p>Selected: {value || "None"}</p>
<Button onClick={() => setValue(undefined)}>Clear</Button>`}
        >
          <div className="max-w-sm space-y-4">
            <Label>Employment Type</Label>
            <Dropdown value={employmentType} onValueChange={setEmploymentType}>
              <DropdownTrigger>
                <DropdownValue placeholder="Select type" />
              </DropdownTrigger>
              <DropdownContent>
                <DropdownItem value="full-time">Full-time</DropdownItem>
                <DropdownItem value="part-time">Part-time</DropdownItem>
                <DropdownItem value="contract">Contract</DropdownItem>
                <DropdownItem value="internship">Internship</DropdownItem>
              </DropdownContent>
            </Dropdown>
            <div className="flex items-center gap-4">
              <p className="text-caption text-foreground-muted">
                Selected:{" "}
                <code className="rounded bg-background-muted px-1">{employmentType || "None"}</code>
              </p>
              {employmentType && (
                <Button variant="ghost" size="sm" onClick={() => setEmploymentType(undefined)}>
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 8. WITH GROUPS */}
      {/* ============================================ */}
      <ComponentCard
        id="grouped"
        title="Grouped Options"
        description="Organize related options with labels and separators"
      >
        <CodePreview
          code={`<Dropdown>
  <DropdownTrigger>
    <DropdownValue placeholder="Select location type" />
  </DropdownTrigger>
  <DropdownContent>
    <DropdownGroup>
      <DropdownLabel>Work Arrangement</DropdownLabel>
      <DropdownItem value="remote">Remote</DropdownItem>
      <DropdownItem value="hybrid">Hybrid</DropdownItem>
      <DropdownItem value="onsite">On-site</DropdownItem>
    </DropdownGroup>
    <DropdownSeparator />
    <DropdownGroup>
      <DropdownLabel>Regions</DropdownLabel>
      <DropdownItem value="us">United States</DropdownItem>
      <DropdownItem value="eu">Europe</DropdownItem>
      <DropdownItem value="apac">Asia Pacific</DropdownItem>
    </DropdownGroup>
  </DropdownContent>
</Dropdown>`}
        >
          <div className="max-w-sm space-y-2">
            <Label>Location Type</Label>
            <Dropdown value={location} onValueChange={setLocation}>
              <DropdownTrigger>
                <DropdownValue placeholder="Select location type" />
              </DropdownTrigger>
              <DropdownContent>
                <DropdownGroup>
                  <DropdownLabel>Work Arrangement</DropdownLabel>
                  <DropdownItem value="remote">Remote</DropdownItem>
                  <DropdownItem value="hybrid">Hybrid</DropdownItem>
                  <DropdownItem value="onsite">On-site</DropdownItem>
                </DropdownGroup>
                <DropdownSeparator />
                <DropdownGroup>
                  <DropdownLabel>Regions</DropdownLabel>
                  <DropdownItem value="us">United States</DropdownItem>
                  <DropdownItem value="eu">Europe</DropdownItem>
                  <DropdownItem value="apac">Asia Pacific</DropdownItem>
                </DropdownGroup>
              </DropdownContent>
            </Dropdown>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 9. PROPS TABLES */}
      {/* ============================================ */}
      <div id="props" className="space-y-6">
        <h2 className="text-heading-sm text-foreground">Props Reference</h2>

        <ComponentCard title="Dropdown (Root) Props">
          <PropsTable props={dropdownRootProps} />
        </ComponentCard>

        <ComponentCard title="DropdownTrigger Props">
          <PropsTable props={dropdownTriggerProps} />
        </ComponentCard>

        <ComponentCard title="DropdownContent Props">
          <PropsTable props={dropdownContentProps} />
        </ComponentCard>

        <ComponentCard title="DropdownItem Props">
          <PropsTable props={dropdownItemProps} />
        </ComponentCard>
      </div>

      {/* ============================================ */}
      {/* 10. USAGE GUIDELINES */}
      {/* ============================================ */}
      <div id="guidelines">
        <h2 className="mb-4 text-heading-sm text-foreground">Usage Guidelines</h2>
        <UsageGuide
          dos={[
            "Use when there are 5 or more options to choose from",
            "Provide a clear, descriptive placeholder text",
            "Order options logically (alphabetically, by frequency, or by importance)",
            "Use descriptive labels that clearly indicate what each option means",
            "Group related options with DropdownGroup and DropdownLabel",
            "Show error states with clear messaging below the dropdown",
            "Pre-select a sensible default when appropriate",
            "Use maxHeight to control dropdown size for very long lists",
          ]}
          donts={[
            "Don't use for only 2-4 options (use Radio Group instead)",
            "Don't mix different types of options in one dropdown",
            "Don't use for triggering actions (use Dropdown Menu)",
            "Don't truncate option text - expand the width if needed",
            "Don't hide critical options at the bottom of long lists",
            "Don't use when users need to see and compare all options at once",
            "Don't allow multiple selections (use checkboxes or multi-select)",
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 11. ACCESSIBILITY */}
      {/* ============================================ */}
      <div id="accessibility">
        <AccessibilityInfo
          items={[
            "**Keyboard**: Arrow keys navigate options, Enter/Space selects, Escape closes",
            "**Type-ahead**: Start typing to jump to matching options",
            "**Screen readers**: Announces selected value, available options, and state changes",
            "**aria-invalid**: Set to 'true' on trigger when error prop is true",
            "**Focus management**: Focus moves into content when opened, returns to trigger when closed",
            "**ARIA expanded**: Trigger announces whether dropdown is open or closed",
            "**Role listbox**: Content uses listbox role with option children for proper semantics",
            "**Scroll indicators**: Gradient overlays are visual-only and don't affect accessibility",
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 12. MIGRATION FROM SELECT */}
      {/* ============================================ */}
      <ComponentCard
        id="migration"
        title="Migration from Select"
        description="The Select component has been renamed to Dropdown. Both names are supported for backward compatibility."
      >
        <div className="space-y-4">
          <div className="rounded-lg border border-border-warning bg-background-warning p-4">
            <p className="text-sm text-foreground-muted">
              <strong className="text-foreground-warning">Note:</strong> The old{" "}
              <code>Select*</code> component names are deprecated but still work. Update your
              imports to use <code>Dropdown*</code> names when possible.
            </p>
          </div>
          <CodePreview
            code={`// Old (deprecated but still works)
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui";

// New (preferred)
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem, DropdownValue } from "@/components/ui";

// The components work exactly the same way
<Dropdown>
  <DropdownTrigger>
    <DropdownValue placeholder="Select..." />
  </DropdownTrigger>
  <DropdownContent>
    <DropdownItem value="option">Option</DropdownItem>
  </DropdownContent>
</Dropdown>`}
          >
            <div className="text-sm text-foreground-muted">
              <p>
                Simply rename your imports from <code>Select*</code> to <code>Dropdown*</code>:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>
                  <code>Select</code> → <code>Dropdown</code>
                </li>
                <li>
                  <code>SelectTrigger</code> → <code>DropdownTrigger</code>
                </li>
                <li>
                  <code>SelectContent</code> → <code>DropdownContent</code>
                </li>
                <li>
                  <code>SelectItem</code> → <code>DropdownItem</code>
                </li>
                <li>
                  <code>SelectValue</code> → <code>DropdownValue</code>
                </li>
                <li>
                  <code>SelectGroup</code> → <code>DropdownGroup</code>
                </li>
                <li>
                  <code>SelectLabel</code> → <code>DropdownLabel</code>
                </li>
                <li>
                  <code>SelectSeparator</code> → <code>DropdownSeparator</code>
                </li>
              </ul>
            </div>
          </CodePreview>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 13. RELATED COMPONENTS */}
      {/* ============================================ */}
      <div id="related">
        <RelatedComponents
          components={[
            {
              name: "Radio Group",
              href: "/design-system/components/radio-group",
              description: "For 2-4 visible options",
            },
            {
              name: "Combobox",
              href: "/design-system/components/combobox",
              description: "Searchable dropdown with autocomplete",
            },
            {
              name: "Dropdown Menu",
              href: "/design-system/components/dropdown-menu",
              description: "For triggering actions, not selection",
            },
            {
              name: "Checkbox",
              href: "/design-system/components/checkbox",
              description: "For multiple selections",
            },
            {
              name: "Input",
              href: "/design-system/components/input",
              description: "For freeform text entry",
            },
            {
              name: "Segmented Controller",
              href: "/design-system/components/segmented-controller",
              description: "For 2-5 mutually exclusive options with visibility",
            },
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 14. REAL-WORLD EXAMPLES */}
      {/* ============================================ */}
      <div id="examples" className="space-y-6">
        <h2 className="text-heading-sm text-foreground">Real-World Examples</h2>

        <RealWorldExample
          title="Job Posting Form"
          description="Multiple dropdowns for job categorization"
        >
          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-4 text-body-strong text-foreground">Job Details</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="job-category">Category *</Label>
                  <Dropdown value={category} onValueChange={setCategory}>
                    <DropdownTrigger error={!category}>
                      <DropdownValue placeholder="Select category" />
                    </DropdownTrigger>
                    <DropdownContent>
                      <DropdownGroup>
                        <DropdownLabel>Energy</DropdownLabel>
                        <DropdownItem value="solar">Solar Energy</DropdownItem>
                        <DropdownItem value="wind">Wind Power</DropdownItem>
                        <DropdownItem value="hydro">Hydroelectric</DropdownItem>
                      </DropdownGroup>
                      <DropdownSeparator />
                      <DropdownGroup>
                        <DropdownLabel>Sustainability</DropdownLabel>
                        <DropdownItem value="esg">ESG & Finance</DropdownItem>
                        <DropdownItem value="circular">Circular Economy</DropdownItem>
                        <DropdownItem value="carbon">Carbon Management</DropdownItem>
                      </DropdownGroup>
                    </DropdownContent>
                  </Dropdown>
                  {!category && (
                    <p className="text-caption text-foreground-error">Please select a category</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Employment Type</Label>
                  <Dropdown defaultValue="full-time">
                    <DropdownTrigger success>
                      <DropdownValue />
                    </DropdownTrigger>
                    <DropdownContent>
                      <DropdownItem value="full-time">Full-time</DropdownItem>
                      <DropdownItem value="part-time">Part-time</DropdownItem>
                      <DropdownItem value="contract">Contract</DropdownItem>
                      <DropdownItem value="internship">Internship</DropdownItem>
                    </DropdownContent>
                  </Dropdown>
                </div>

                <div className="space-y-2">
                  <Label>Location Type</Label>
                  <Dropdown defaultValue="hybrid">
                    <DropdownTrigger success>
                      <DropdownValue />
                    </DropdownTrigger>
                    <DropdownContent>
                      <DropdownItem value="remote">Remote</DropdownItem>
                      <DropdownItem value="hybrid">Hybrid</DropdownItem>
                      <DropdownItem value="onsite">On-site</DropdownItem>
                    </DropdownContent>
                  </Dropdown>
                </div>

                <div className="space-y-2">
                  <Label>Experience Level</Label>
                  <Dropdown>
                    <DropdownTrigger>
                      <DropdownValue placeholder="Select level" />
                    </DropdownTrigger>
                    <DropdownContent>
                      <DropdownItem value="entry">Entry Level (0-2 years)</DropdownItem>
                      <DropdownItem value="mid">Mid Level (2-5 years)</DropdownItem>
                      <DropdownItem value="senior">Senior (5-8 years)</DropdownItem>
                      <DropdownItem value="lead">Lead / Principal (8+ years)</DropdownItem>
                      <DropdownItem value="executive">Executive</DropdownItem>
                    </DropdownContent>
                  </Dropdown>
                </div>
              </div>
            </CardContent>
          </Card>
        </RealWorldExample>

        <RealWorldExample
          title="Candidate Filtering"
          description="Dropdowns used in a filter panel for candidate search"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-end gap-4">
                <div className="min-w-[150px] flex-1 space-y-2">
                  <Label>Status</Label>
                  <Dropdown defaultValue="all">
                    <DropdownTrigger>
                      <DropdownValue />
                    </DropdownTrigger>
                    <DropdownContent>
                      <DropdownItem value="all">All Candidates</DropdownItem>
                      <DropdownItem value="new">New Applications</DropdownItem>
                      <DropdownItem value="screening">In Screening</DropdownItem>
                      <DropdownItem value="interview">Interview Stage</DropdownItem>
                      <DropdownItem value="offer">Offer Extended</DropdownItem>
                    </DropdownContent>
                  </Dropdown>
                </div>

                <div className="min-w-[150px] flex-1 space-y-2">
                  <Label>Source</Label>
                  <Dropdown>
                    <DropdownTrigger>
                      <DropdownValue placeholder="All sources" />
                    </DropdownTrigger>
                    <DropdownContent>
                      <DropdownItem value="green-jobs">Green Jobs Board</DropdownItem>
                      <DropdownItem value="linkedin">LinkedIn</DropdownItem>
                      <DropdownItem value="referral">Referral</DropdownItem>
                      <DropdownItem value="direct">Direct Application</DropdownItem>
                    </DropdownContent>
                  </Dropdown>
                </div>

                <div className="min-w-[150px] flex-1 space-y-2">
                  <Label>Sort By</Label>
                  <Dropdown defaultValue="recent">
                    <DropdownTrigger>
                      <DropdownValue />
                    </DropdownTrigger>
                    <DropdownContent>
                      <DropdownItem value="recent">Most Recent</DropdownItem>
                      <DropdownItem value="match">Match Score</DropdownItem>
                      <DropdownItem value="name">Name (A-Z)</DropdownItem>
                      <DropdownItem value="experience">Experience</DropdownItem>
                    </DropdownContent>
                  </Dropdown>
                </div>

                <Button variant="primary">Apply Filters</Button>
              </div>
            </CardContent>
          </Card>
        </RealWorldExample>

        <RealWorldExample
          title="Form Validation State"
          description="Dropdown showing validation feedback inline"
        >
          <div className="mx-auto max-w-md">
            <Card>
              <CardContent className="space-y-4 pt-6">
                <h3 className="text-body-strong text-foreground">Required Fields Demo</h3>

                <div className="space-y-2">
                  <Label>Department *</Label>
                  <Dropdown>
                    <DropdownTrigger error>
                      <DropdownValue placeholder="Select department" />
                    </DropdownTrigger>
                    <DropdownContent>
                      <DropdownItem value="engineering">Engineering</DropdownItem>
                      <DropdownItem value="operations">Operations</DropdownItem>
                      <DropdownItem value="sales">Sales</DropdownItem>
                    </DropdownContent>
                  </Dropdown>
                  <p className="text-caption text-foreground-error">Department is required</p>
                </div>

                <div className="space-y-2">
                  <Label>Team *</Label>
                  <Dropdown defaultValue="sustainability">
                    <DropdownTrigger success>
                      <DropdownValue />
                    </DropdownTrigger>
                    <DropdownContent>
                      <DropdownItem value="sustainability">Sustainability</DropdownItem>
                      <DropdownItem value="engineering">Engineering</DropdownItem>
                      <DropdownItem value="product">Product</DropdownItem>
                    </DropdownContent>
                  </Dropdown>
                  <p className="text-caption text-foreground-success">Great choice!</p>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="tertiary">Cancel</Button>
                  <Button variant="primary" rightIcon={<ArrowRight size={16} />}>
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </RealWorldExample>
      </div>

      {/* Page Navigation */}
      <PageNavigation currentPath="/design-system/components/dropdown" />
    </div>
  );
}
