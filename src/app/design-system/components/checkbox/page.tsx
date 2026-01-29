"use client";

import React from "react";
import {
  Checkbox,
  CheckboxWithLabel,
  CheckboxGroup,
  Label,
  Button,
} from "@/components/ui";
import {
  ComponentCard,
  UsageGuide,
  AccessibilityInfo,
} from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";
import { CheckCircle, XCircle } from "@phosphor-icons/react";

const checkboxProps = [
  {
    name: "checked",
    type: 'boolean | "indeterminate"',
    default: "undefined",
    description: "Controlled checked state",
  },
  {
    name: "defaultChecked",
    type: "boolean",
    default: "false",
    description: "Default checked state (uncontrolled)",
  },
  {
    name: "onCheckedChange",
    type: "(checked: boolean | 'indeterminate') => void",
    default: "undefined",
    description: "Callback when checked state changes",
  },
  {
    name: "size",
    type: '"sm" | "default" | "lg"',
    default: '"default"',
    description: "Size of the checkbox (16px, 20px, 24px)",
  },
  {
    name: "indeterminate",
    type: "boolean",
    default: "false",
    description: 'Show indeterminate state (minus icon) for "select all" patterns',
  },
  {
    name: "error",
    type: "boolean",
    default: "false",
    description: "Show error state with red styling",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disables the checkbox",
  },
  {
    name: "id",
    type: "string",
    default: "undefined",
    description: "ID for label association",
  },
  {
    name: "name",
    type: "string",
    default: "undefined",
    description: "Name for form submission",
  },
];

const checkboxWithLabelProps = [
  {
    name: "label",
    type: "string",
    default: "required",
    description: "Label text displayed next to the checkbox",
  },
  {
    name: "helperText",
    type: "string",
    default: "undefined",
    description: "Optional helper/description text below the label",
  },
  {
    name: "labelPosition",
    type: '"left" | "right"',
    default: '"right"',
    description: "Position of the label relative to the checkbox",
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
    description: "Error message to display when error is true",
  },
  {
    name: "required",
    type: "boolean",
    default: "false",
    description: "Show required indicator (*) after label",
  },
  {
    name: "size",
    type: '"sm" | "default" | "lg"',
    default: '"default"',
    description: "Size variant",
  },
];

const checkboxGroupProps = [
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
    description: "Show error state for the group",
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
    description: "Show required indicator",
  },
  {
    name: "orientation",
    type: '"vertical" | "horizontal"',
    default: '"vertical"',
    description: "Layout direction of checkboxes",
  },
];

export default function CheckboxPage() {
  const [isChecked, setIsChecked] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  const [allSelected, setAllSelected] = React.useState<boolean | "indeterminate">(false);

  const items = ["Full-time", "Part-time", "Contract", "Internship"];

  const toggleItem = (item: string) => {
    const newSelection = selectedItems.includes(item)
      ? selectedItems.filter((i) => i !== item)
      : [...selectedItems, item];
    setSelectedItems(newSelection);

    // Update "select all" state
    if (newSelection.length === 0) {
      setAllSelected(false);
    } else if (newSelection.length === items.length) {
      setAllSelected(true);
    } else {
      setAllSelected("indeterminate");
    }
  };

  const toggleAll = () => {
    if (allSelected === true) {
      setSelectedItems([]);
      setAllSelected(false);
    } else {
      setSelectedItems([...items]);
      setAllSelected(true);
    }
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Checkbox
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          Checkboxes allow users to select one or more items from a set, or to
          toggle a single option on or off. They support indeterminate state for
          partial selections.
        </p>

        {/* When to Use / When Not to Use */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-[var(--background-success)]/10 rounded-lg border border-[var(--border-success)]">
            <h3 className="font-semibold text-[var(--foreground-success)] mb-2">
              When to use
            </h3>
            <ul className="text-sm space-y-1 text-foreground-muted">
              <li>• Multiple options that can be selected simultaneously</li>
              <li>• Binary yes/no choices in forms</li>
              <li>• Terms and conditions acceptance</li>
              <li>• Filtering lists with multiple criteria</li>
            </ul>
          </div>
          <div className="p-4 bg-[var(--background-error)]/10 rounded-lg border border-[var(--border-error)]">
            <h3 className="font-semibold text-[var(--foreground-error)] mb-2">
              When not to use
            </h3>
            <ul className="text-sm space-y-1 text-foreground-muted">
              <li>• Mutually exclusive options (use Radio Group)</li>
              <li>• Toggling settings that apply immediately (use Switch)</li>
              <li>• Actions that trigger immediately (use Button)</li>
              <li>• More than 7 options (consider a different pattern)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Anatomy */}
      <ComponentCard
        id="anatomy"
        title="Anatomy"
        description="The checkbox is composed of these parts"
      >
        <div className="relative p-8 bg-[var(--background-subtle)] rounded-lg">
          <div className="flex items-start gap-4">
            <div className="relative">
              <Checkbox defaultChecked id="anatomy-checkbox" size="lg" />
              <div className="absolute -top-3 -left-3 w-5 h-5 bg-[var(--foreground-brand)] text-white rounded-full flex items-center justify-center text-xs font-medium">
                1
              </div>
            </div>
            <div className="relative">
              <Label htmlFor="anatomy-checkbox" className="cursor-pointer">
                Checkbox label
              </Label>
              <div className="absolute -top-3 -left-3 w-5 h-5 bg-[var(--foreground-brand)] text-white rounded-full flex items-center justify-center text-xs font-medium">
                2
              </div>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-mono bg-[var(--background-muted)] px-1 rounded">
                1
              </span>{" "}
              Checkbox (control)
            </div>
            <div>
              <span className="font-mono bg-[var(--background-muted)] px-1 rounded">
                2
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
        description="Single checkbox with label"
      >
        <CodePreview
          code={`import { Checkbox, Label } from "@/components/ui";

<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms and conditions</Label>
</div>`}
        >
          <div className="flex items-center gap-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms" className="cursor-pointer">
              Accept terms and conditions
            </Label>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Sizes */}
      <ComponentCard
        id="sizes"
        title="Sizes"
        description="Three size variants: small (16px), default (20px), and large (24px)"
      >
        <div className="flex flex-wrap items-end gap-8">
          <div className="space-y-2">
            <Label className="text-caption text-foreground-muted">Small</Label>
            <div className="flex items-center gap-2">
              <Checkbox id="size-sm" size="sm" defaultChecked />
              <Label htmlFor="size-sm" className="cursor-pointer text-sm">
                Small checkbox
              </Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-caption text-foreground-muted">
              Default
            </Label>
            <div className="flex items-center gap-2">
              <Checkbox id="size-default" size="default" defaultChecked />
              <Label htmlFor="size-default" className="cursor-pointer">
                Default checkbox
              </Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-caption text-foreground-muted">Large</Label>
            <div className="flex items-center gap-2">
              <Checkbox id="size-lg" size="lg" defaultChecked />
              <Label htmlFor="size-lg" className="cursor-pointer text-lg">
                Large checkbox
              </Label>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* States */}
      <ComponentCard
        id="states"
        title="States"
        description="All interactive and visual states"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <Label className="text-caption text-foreground-muted">
              Unchecked
            </Label>
            <div className="flex items-center gap-2">
              <Checkbox id="state-unchecked" />
              <Label htmlFor="state-unchecked" className="cursor-pointer">
                Default
              </Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-caption text-foreground-muted">
              Checked
            </Label>
            <div className="flex items-center gap-2">
              <Checkbox id="state-checked" defaultChecked />
              <Label htmlFor="state-checked" className="cursor-pointer">
                Checked
              </Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-caption text-foreground-muted">
              Indeterminate
            </Label>
            <div className="flex items-center gap-2">
              <Checkbox id="state-indeterminate" indeterminate />
              <Label htmlFor="state-indeterminate" className="cursor-pointer">
                Mixed
              </Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-caption text-foreground-muted">Error</Label>
            <div className="flex items-center gap-2">
              <Checkbox id="state-error" error />
              <Label
                htmlFor="state-error"
                className="cursor-pointer text-[var(--foreground-error)]"
              >
                Error
              </Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-caption text-foreground-muted">
              Disabled
            </Label>
            <div className="flex items-center gap-2">
              <Checkbox id="state-disabled" disabled />
              <Label
                htmlFor="state-disabled"
                className="cursor-pointer text-foreground-muted"
              >
                Disabled
              </Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-caption text-foreground-muted">
              Disabled Checked
            </Label>
            <div className="flex items-center gap-2">
              <Checkbox id="state-disabled-checked" disabled defaultChecked />
              <Label
                htmlFor="state-disabled-checked"
                className="cursor-pointer text-foreground-muted"
              >
                Disabled
              </Label>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Controlled */}
      <ComponentCard
        id="controlled"
        title="Controlled Checkbox"
        description="Manage checkbox state with React state"
      >
        <CodePreview
          code={`const [isChecked, setIsChecked] = React.useState(false);

<Checkbox
  checked={isChecked}
  onCheckedChange={(checked) => setIsChecked(checked === true)}
/>

<p>Status: {isChecked ? "Enabled" : "Disabled"}</p>`}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="controlled"
                checked={isChecked}
                onCheckedChange={(checked) => setIsChecked(checked === true)}
              />
              <Label htmlFor="controlled" className="cursor-pointer">
                Enable notifications
              </Label>
            </div>
            <p className="text-caption text-foreground-muted">
              Status:{" "}
              <span className="font-medium text-foreground">
                {isChecked ? "Enabled" : "Disabled"}
              </span>
            </p>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* CheckboxWithLabel */}
      <ComponentCard
        id="with-label"
        title="CheckboxWithLabel"
        description="Compound component with built-in label, helper text, and error handling"
      >
        <CodePreview
          code={`import { CheckboxWithLabel } from "@/components/ui";

<CheckboxWithLabel
  label="Marketing emails"
  helperText="Receive updates about new features and tips"
/>

<CheckboxWithLabel
  label="Accept terms"
  required
  error
  errorMessage="You must accept the terms to continue"
/>`}
        >
          <div className="space-y-4 max-w-md">
            <CheckboxWithLabel
              label="Marketing emails"
              helperText="Receive updates about new features and tips"
            />
            <CheckboxWithLabel
              label="Application notifications"
              helperText="Get notified when candidates apply"
              defaultChecked
            />
            <CheckboxWithLabel
              label="Accept terms"
              required
              error
              errorMessage="You must accept the terms to continue"
            />
            <CheckboxWithLabel
              label="Disabled option"
              helperText="This option is not available"
              disabled
            />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Indeterminate / Select All Pattern */}
      <ComponentCard
        id="indeterminate"
        title="Indeterminate State"
        description='Use for "select all" patterns where some items are selected'
      >
        <CodePreview
          code={`const [items] = ["Full-time", "Part-time", "Contract"];
const [selected, setSelected] = useState([]);
const [allSelected, setAllSelected] = useState(false);

// Calculate state based on selection
const checkboxState =
  selected.length === 0 ? false :
  selected.length === items.length ? true :
  "indeterminate";

<Checkbox
  checked={checkboxState}
  indeterminate={checkboxState === "indeterminate"}
  onCheckedChange={toggleAll}
/>
<Label>Select all</Label>`}
        >
          <div className="space-y-4 max-w-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-default)]">
              <Checkbox
                id="select-all"
                checked={allSelected === true}
                indeterminate={allSelected === "indeterminate"}
                onCheckedChange={toggleAll}
              />
              <Label htmlFor="select-all" className="cursor-pointer font-medium">
                Select all job types
              </Label>
            </div>
            <div className="space-y-3 pl-6">
              {items.map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <Checkbox
                    id={type.toLowerCase().replace(" ", "-")}
                    checked={selectedItems.includes(type)}
                    onCheckedChange={() => toggleItem(type)}
                  />
                  <Label
                    htmlFor={type.toLowerCase().replace(" ", "-")}
                    className="cursor-pointer"
                  >
                    {type}
                  </Label>
                </div>
              ))}
            </div>
            {selectedItems.length > 0 && (
              <p className="text-caption text-foreground-muted">
                Selected: {selectedItems.join(", ")}
              </p>
            )}
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Checkbox Group */}
      <ComponentCard
        id="group"
        title="CheckboxGroup"
        description="Container for organizing multiple checkboxes with shared label and error handling"
      >
        <CodePreview
          code={`import { CheckboxGroup, CheckboxWithLabel } from "@/components/ui";

<CheckboxGroup
  label="Job types"
  helperText="Select all that apply"
  required
>
  <CheckboxWithLabel label="Full-time" />
  <CheckboxWithLabel label="Part-time" />
  <CheckboxWithLabel label="Contract" />
</CheckboxGroup>`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <CheckboxGroup
              label="Job types"
              helperText="Select all that apply"
              required
            >
              <CheckboxWithLabel label="Full-time" defaultChecked />
              <CheckboxWithLabel label="Part-time" />
              <CheckboxWithLabel label="Contract" />
              <CheckboxWithLabel label="Internship" />
            </CheckboxGroup>

            <CheckboxGroup
              label="Required skills"
              error
              errorMessage="Please select at least one skill"
              required
            >
              <CheckboxWithLabel label="React" error />
              <CheckboxWithLabel label="TypeScript" error />
              <CheckboxWithLabel label="Node.js" error />
            </CheckboxGroup>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Horizontal Layout */}
      <ComponentCard
        id="horizontal"
        title="Horizontal Layout"
        description="Arrange checkboxes in a row"
      >
        <CheckboxGroup
          label="Experience level"
          orientation="horizontal"
        >
          <CheckboxWithLabel label="Junior" />
          <CheckboxWithLabel label="Mid-level" defaultChecked />
          <CheckboxWithLabel label="Senior" defaultChecked />
          <CheckboxWithLabel label="Lead" />
        </CheckboxGroup>
      </ComponentCard>

      {/* Props Tables */}
      <ComponentCard id="props-checkbox" title="Checkbox Props">
        <PropsTable props={checkboxProps} />
      </ComponentCard>

      <ComponentCard id="props-with-label" title="CheckboxWithLabel Props">
        <PropsTable props={checkboxWithLabelProps} />
      </ComponentCard>

      <ComponentCard id="props-group" title="CheckboxGroup Props">
        <PropsTable props={checkboxGroupProps} />
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
            <div className="p-4 border-2 border-[var(--border-success)] rounded-lg space-y-3">
              <CheckboxWithLabel
                label="I agree to the terms of service"
                helperText="Read the full terms before accepting"
              />
            </div>
            <p className="text-sm text-foreground-muted">
              Use positive, clear labels that describe what will happen.
            </p>
          </div>

          {/* DON'T */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[var(--foreground-error)]">
              <XCircle size={20} weight="fill" />
              <span className="font-semibold">Don&apos;t</span>
            </div>
            <div className="p-4 border-2 border-[var(--border-error)] rounded-lg space-y-3">
              <CheckboxWithLabel
                label="Don't send me marketing emails"
                helperText="Uncheck to receive emails"
              />
            </div>
            <p className="text-sm text-foreground-muted">
              Avoid negative labels that create confusing double-negatives.
            </p>
          </div>

          {/* DO */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[var(--foreground-success)]">
              <CheckCircle size={20} weight="fill" />
              <span className="font-semibold">Do</span>
            </div>
            <div className="p-4 border-2 border-[var(--border-success)] rounded-lg">
              <div className="flex items-center gap-2">
                <Checkbox id="do-label" />
                <Label htmlFor="do-label" className="cursor-pointer">
                  Clickable label
                </Label>
              </div>
            </div>
            <p className="text-sm text-foreground-muted">
              Always pair checkbox with a clickable label for better usability.
            </p>
          </div>

          {/* DON'T */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[var(--foreground-error)]">
              <XCircle size={20} weight="fill" />
              <span className="font-semibold">Don&apos;t</span>
            </div>
            <div className="p-4 border-2 border-[var(--border-error)] rounded-lg">
              <div className="flex items-center gap-2">
                <Checkbox />
                <span className="text-foreground">Non-clickable text</span>
              </div>
            </div>
            <p className="text-sm text-foreground-muted">
              Don&apos;t use plain text without label association.
            </p>
          </div>
        </div>
      </ComponentCard>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Use for multi-select options where users can choose multiple items",
          "Always pair with a clickable label using htmlFor/id",
          "Group related checkboxes together with a group label",
          "Use indeterminate state for 'select all' parent checkboxes",
          "Show clear validation errors with helpful messages",
        ]}
        donts={[
          "Don't use for mutually exclusive options (use Radio Group)",
          "Don't use for immediate toggles (use Switch instead)",
          "Don't pre-check promotional or marketing options",
          "Don't use negative labels ('Don't send emails')",
          "Don't use for more than 7 options without filtering",
        ]}
      />

      {/* Accessibility */}
      <AccessibilityInfo
        items={[
          "**Keyboard**: Tab to focus, Space to toggle checked state",
          "**Focus indicator**: Visible ring using blue-500 color",
          "**Screen readers**: Announces label, state (checked/unchecked/mixed), and role",
          "**ARIA**: Uses native checkbox semantics with aria-checked for indeterminate",
          "**Labels**: Always associate label with checkbox using htmlFor/id",
          "**Error messages**: Connected via aria-describedby for screen readers",
          "**Color contrast**: Meets WCAG AA standards (4.5:1 ratio)",
        ]}
      />

      {/* Related Components */}
      <ComponentCard
        id="related"
        title="Related Components"
        description="Components that work well with Checkbox"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/design-system/components/radio-group"
            className="p-4 border border-[var(--border-default)] rounded-lg hover:border-[var(--border-brand)] transition-colors"
          >
            <p className="font-medium">Radio Group</p>
            <p className="text-caption text-foreground-muted">
              For mutually exclusive options
            </p>
          </a>
          <a
            href="/design-system/components/switch"
            className="p-4 border border-[var(--border-default)] rounded-lg hover:border-[var(--border-brand)] transition-colors"
          >
            <p className="font-medium">Switch</p>
            <p className="text-caption text-foreground-muted">
              For immediate toggles
            </p>
          </a>
          <a
            href="/design-system/components/label"
            className="p-4 border border-[var(--border-default)] rounded-lg hover:border-[var(--border-brand)] transition-colors"
          >
            <p className="font-medium">Label</p>
            <p className="text-caption text-foreground-muted">
              For form field labels
            </p>
          </a>
          <a
            href="/design-system/components/form-section"
            className="p-4 border border-[var(--border-default)] rounded-lg hover:border-[var(--border-brand)] transition-colors"
          >
            <p className="font-medium">Form Section</p>
            <p className="text-caption text-foreground-muted">
              For organizing form fields
            </p>
          </a>
        </div>
      </ComponentCard>

      <PageNavigation currentPath="/design-system/components/checkbox" />
    </div>
  );
}
