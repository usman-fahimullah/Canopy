"use client";

import React from "react";
import {
  Switch,
  SwitchWithLabel,
  SwitchGroup,
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
import { CheckCircle, XCircle, Bell, EnvelopeSimple, ChartBar } from "@phosphor-icons/react";

const switchProps = [
  {
    name: "checked",
    type: "boolean",
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
    type: "(checked: boolean) => void",
    default: "undefined",
    description: "Callback when checked state changes",
  },
  {
    name: "size",
    type: '"sm" | "default" | "lg"',
    default: '"default"',
    description: "Size of the switch (36×18, 48×24, 60×30)",
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    description: "Show loading spinner in thumb (disables interaction)",
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
    description: "Disables the switch",
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

const switchWithLabelProps = [
  {
    name: "label",
    type: "string",
    default: "required",
    description: "Label text displayed next to the switch",
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
    description: "Position of the label relative to the switch",
  },
  {
    name: "size",
    type: '"sm" | "default" | "lg"',
    default: '"default"',
    description: "Size variant",
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    description: "Show loading state",
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
];

const switchGroupProps = [
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
    name: "divided",
    type: "boolean",
    default: "false",
    description: "Show dividers between items",
  },
];

export default function SwitchPage() {
  const [notifications, setNotifications] = React.useState(true);
  const [marketing, setMarketing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [asyncValue, setAsyncValue] = React.useState(false);

  const handleAsyncToggle = async (checked: boolean) => {
    setIsLoading(true);
    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setAsyncValue(checked);
    setIsLoading(false);
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Switch
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          Switches toggle the state of a single setting on or off. Use them for
          binary options that take effect immediately without requiring form
          submission.
        </p>

        {/* When to Use / When Not to Use */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-[var(--background-success)]/10 rounded-lg border border-[var(--border-success)]">
            <h3 className="font-semibold text-[var(--foreground-success)] mb-2">
              When to use
            </h3>
            <ul className="text-sm space-y-1 text-foreground-muted">
              <li>• Settings that apply immediately (no save button)</li>
              <li>• Feature toggles in preferences</li>
              <li>• Enabling/disabling notifications</li>
              <li>• Dark mode or theme switching</li>
            </ul>
          </div>
          <div className="p-4 bg-[var(--background-error)]/10 rounded-lg border border-[var(--border-error)]">
            <h3 className="font-semibold text-[var(--foreground-error)] mb-2">
              When not to use
            </h3>
            <ul className="text-sm space-y-1 text-foreground-muted">
              <li>• Options requiring form submission (use Checkbox)</li>
              <li>• Mutually exclusive choices (use Radio Group)</li>
              <li>• Multiple selections (use Checkbox)</li>
              <li>• Actions that need confirmation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Anatomy */}
      <ComponentCard
        id="anatomy"
        title="Anatomy"
        description="The switch is composed of these parts"
      >
        <div className="relative p-8 bg-[var(--background-subtle)] rounded-lg">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Switch defaultChecked id="anatomy-switch" size="lg" />
              <div className="absolute -top-3 -left-3 w-5 h-5 bg-[var(--foreground-brand)] text-white rounded-full flex items-center justify-center text-xs font-medium">
                1
              </div>
              <div className="absolute -top-3 left-8 w-5 h-5 bg-[var(--foreground-brand)] text-white rounded-full flex items-center justify-center text-xs font-medium">
                2
              </div>
            </div>
            <div className="relative">
              <Label htmlFor="anatomy-switch" className="cursor-pointer">
                Switch label
              </Label>
              <div className="absolute -top-3 -left-3 w-5 h-5 bg-[var(--foreground-brand)] text-white rounded-full flex items-center justify-center text-xs font-medium">
                3
              </div>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-2 text-sm">
            <div>
              <span className="font-mono bg-[var(--background-muted)] px-1 rounded">
                1
              </span>{" "}
              Track
            </div>
            <div>
              <span className="font-mono bg-[var(--background-muted)] px-1 rounded">
                2
              </span>{" "}
              Thumb
            </div>
            <div>
              <span className="font-mono bg-[var(--background-muted)] px-1 rounded">
                3
              </span>{" "}
              Label (optional)
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Simple on/off toggle"
      >
        <CodePreview
          code={`import { Switch, Label } from "@/components/ui";

<div className="flex items-center gap-2">
  <Switch id="airplane" />
  <Label htmlFor="airplane">Airplane mode</Label>
</div>`}
        >
          <div className="flex items-center gap-2">
            <Switch id="airplane" />
            <Label htmlFor="airplane" className="cursor-pointer">
              Airplane mode
            </Label>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Sizes */}
      <ComponentCard
        id="sizes"
        title="Sizes"
        description="Three size variants: small (36×18), default (48×24), and large (60×30)"
      >
        <div className="flex flex-wrap items-end gap-8">
          <div className="space-y-2">
            <Label className="text-caption text-foreground-muted">Small</Label>
            <div className="flex items-center gap-2">
              <Switch id="size-sm" size="sm" defaultChecked />
              <Label htmlFor="size-sm" className="cursor-pointer text-sm">
                Small
              </Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-caption text-foreground-muted">Default</Label>
            <div className="flex items-center gap-2">
              <Switch id="size-default" size="default" defaultChecked />
              <Label htmlFor="size-default" className="cursor-pointer">
                Default
              </Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-caption text-foreground-muted">Large</Label>
            <div className="flex items-center gap-2">
              <Switch id="size-lg" size="lg" defaultChecked />
              <Label htmlFor="size-lg" className="cursor-pointer text-lg">
                Large
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
            <Label className="text-caption text-foreground-muted">Off</Label>
            <div className="flex items-center gap-2">
              <Switch id="state-off" />
              <Label htmlFor="state-off" className="cursor-pointer">
                Off
              </Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-caption text-foreground-muted">On</Label>
            <div className="flex items-center gap-2">
              <Switch id="state-on" defaultChecked />
              <Label htmlFor="state-on" className="cursor-pointer">
                On
              </Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-caption text-foreground-muted">Loading</Label>
            <div className="flex items-center gap-2">
              <Switch id="state-loading" loading />
              <Label htmlFor="state-loading" className="cursor-pointer">
                Loading
              </Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-caption text-foreground-muted">Error</Label>
            <div className="flex items-center gap-2">
              <Switch id="state-error" error />
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
              Disabled (off)
            </Label>
            <div className="flex items-center gap-2">
              <Switch id="state-disabled-off" disabled />
              <Label
                htmlFor="state-disabled-off"
                className="cursor-pointer text-foreground-muted"
              >
                Disabled
              </Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-caption text-foreground-muted">
              Disabled (on)
            </Label>
            <div className="flex items-center gap-2">
              <Switch id="state-disabled-on" disabled defaultChecked />
              <Label
                htmlFor="state-disabled-on"
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
        title="Controlled Switch"
        description="Manage switch state with React state"
      >
        <CodePreview
          code={`const [notifications, setNotifications] = React.useState(true);

<Switch
  checked={notifications}
  onCheckedChange={setNotifications}
/>

<p>Notifications are {notifications ? "enabled" : "disabled"}</p>`}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Switch
                id="controlled"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
              <Label htmlFor="controlled" className="cursor-pointer">
                Enable notifications
              </Label>
            </div>
            <p className="text-caption text-foreground-muted">
              Notifications are{" "}
              <span className="font-medium text-foreground">
                {notifications ? "enabled" : "disabled"}
              </span>
            </p>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Loading State */}
      <ComponentCard
        id="loading"
        title="Loading State"
        description="Show loading spinner for async operations"
      >
        <CodePreview
          code={`const [isLoading, setIsLoading] = useState(false);
const [value, setValue] = useState(false);

const handleToggle = async (checked) => {
  setIsLoading(true);
  await saveToServer(checked);
  setValue(checked);
  setIsLoading(false);
};

<Switch
  checked={value}
  onCheckedChange={handleToggle}
  loading={isLoading}
/>`}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Switch
                id="async-toggle"
                checked={asyncValue}
                onCheckedChange={handleAsyncToggle}
                loading={isLoading}
              />
              <Label htmlFor="async-toggle" className="cursor-pointer">
                Save preference (async)
              </Label>
            </div>
            <p className="text-caption text-foreground-muted">
              {isLoading
                ? "Saving..."
                : `Preference is ${asyncValue ? "enabled" : "disabled"}`}
            </p>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* SwitchWithLabel */}
      <ComponentCard
        id="with-label"
        title="SwitchWithLabel"
        description="Compound component with built-in label, helper text, and error handling"
      >
        <CodePreview
          code={`import { SwitchWithLabel } from "@/components/ui";

<SwitchWithLabel
  label="Push notifications"
  helperText="Receive notifications on your device"
/>

<SwitchWithLabel
  label="Required setting"
  required
  error
  errorMessage="This setting must be enabled"
/>`}
        >
          <div className="space-y-4 max-w-md">
            <SwitchWithLabel
              label="Push notifications"
              helperText="Receive push notifications on your device"
              defaultChecked
            />
            <SwitchWithLabel
              label="Marketing emails"
              helperText="Receive tips and product updates"
            />
            <SwitchWithLabel
              label="Required setting"
              required
              error
              errorMessage="This setting must be enabled to continue"
            />
            <SwitchWithLabel
              label="Disabled setting"
              helperText="This option is not available"
              disabled
            />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Settings List Pattern */}
      <ComponentCard
        id="settings-list"
        title="Settings List Pattern"
        description="Common pattern for preference toggles with dividers"
      >
        <CodePreview
          code={`import { SwitchGroup, SwitchWithLabel } from "@/components/ui";

<SwitchGroup
  label="Notification Preferences"
  helperText="Choose how you want to be notified"
  divided
>
  <SwitchWithLabel
    label="Push notifications"
    helperText="Receive notifications on your device"
    defaultChecked
  />
  <SwitchWithLabel
    label="Email notifications"
    helperText="Receive daily digest emails"
  />
</SwitchGroup>`}
        >
          <div className="max-w-md">
            <SwitchGroup
              label="Notification Preferences"
              helperText="Choose how you want to be notified"
              divided
            >
              <SwitchWithLabel
                label="Push notifications"
                helperText="Receive push notifications on your device"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
              <SwitchWithLabel
                label="Email notifications"
                helperText="Receive daily digest emails"
                checked={marketing}
                onCheckedChange={setMarketing}
              />
              <SwitchWithLabel
                label="Usage analytics"
                helperText="Help us improve by sharing anonymous usage data"
                disabled
                defaultChecked
              />
            </SwitchGroup>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Label Position */}
      <ComponentCard
        id="label-position"
        title="Label Position"
        description="Place the label on either side of the switch"
      >
        <div className="space-y-4 max-w-md">
          <SwitchWithLabel
            label="Label on the right (default)"
            helperText="Most common for settings"
            labelPosition="right"
            defaultChecked
          />
          <SwitchWithLabel
            label="Label on the left"
            helperText="Use when aligning with other form controls"
            labelPosition="left"
            defaultChecked
          />
        </div>
      </ComponentCard>

      {/* Props Tables */}
      <ComponentCard id="props-switch" title="Switch Props">
        <PropsTable props={switchProps} />
      </ComponentCard>

      <ComponentCard id="props-with-label" title="SwitchWithLabel Props">
        <PropsTable props={switchWithLabelProps} />
      </ComponentCard>

      <ComponentCard id="props-group" title="SwitchGroup Props">
        <PropsTable props={switchGroupProps} />
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
              <SwitchWithLabel
                label="Enable notifications"
                helperText="Get notified about new messages"
              />
            </div>
            <p className="text-sm text-foreground-muted">
              Use positive language that describes the &quot;on&quot; state.
            </p>
          </div>

          {/* DON'T */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[var(--foreground-error)]">
              <XCircle size={20} weight="fill" />
              <span className="font-semibold">Don&apos;t</span>
            </div>
            <div className="p-4 border-2 border-[var(--border-error)] rounded-lg">
              <SwitchWithLabel
                label="Disable notifications"
                helperText="Turn off to stop receiving messages"
              />
            </div>
            <p className="text-sm text-foreground-muted">
              Avoid negative language that makes the on/off state confusing.
            </p>
          </div>

          {/* DO */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[var(--foreground-success)]">
              <CheckCircle size={20} weight="fill" />
              <span className="font-semibold">Do</span>
            </div>
            <div className="p-4 border-2 border-[var(--border-success)] rounded-lg">
              <SwitchWithLabel
                label="Dark mode"
                helperText="Takes effect immediately"
                defaultChecked
              />
            </div>
            <p className="text-sm text-foreground-muted">
              Use for settings that apply immediately without saving.
            </p>
          </div>

          {/* DON'T */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[var(--foreground-error)]">
              <XCircle size={20} weight="fill" />
              <span className="font-semibold">Don&apos;t</span>
            </div>
            <div className="p-4 border-2 border-[var(--border-error)] rounded-lg space-y-2">
              <SwitchWithLabel label="Subscribe to newsletter" />
              <Button size="sm">Save</Button>
            </div>
            <p className="text-sm text-foreground-muted">
              Don&apos;t use switch for options that require form submission. Use
              Checkbox instead.
            </p>
          </div>
        </div>
      </ComponentCard>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Use for binary settings that apply immediately",
          "Place label on the same line as the switch",
          "Use positive language ('Enable X' not 'Disable X')",
          "Provide helper text to explain what the setting does",
          "Show loading state for async operations",
        ]}
        donts={[
          "Don't use for options requiring form submission (use Checkbox)",
          "Don't use for non-binary choices (use Radio Group)",
          "Don't use negative labels that confuse the on/off state",
          "Don't change page layout dramatically based on switch state",
          "Don't use for actions that can't be undone immediately",
        ]}
      />

      {/* Accessibility */}
      <AccessibilityInfo
        items={[
          "**Keyboard**: Tab to focus, Space to toggle state",
          "**Focus indicator**: Visible ring using blue-500 color",
          "**Screen readers**: Announces label, role (switch), and state (on/off)",
          "**ARIA**: Uses native switch role with aria-checked",
          "**Labels**: Always associate label with switch using htmlFor/id",
          "**Motion**: Respects prefers-reduced-motion for thumb animation",
          "**Loading**: Announces loading state to screen readers",
        ]}
      />

      {/* Real-World Examples */}
      <ComponentCard
        id="examples"
        title="Real-World Examples"
        description="Common use cases for switches"
      >
        <div className="space-y-8">
          {/* Example: App Settings */}
          <div>
            <h4 className="text-body-strong mb-3">App Settings Panel</h4>
            <div className="border border-[var(--border-default)] rounded-lg p-4 max-w-md">
              <SwitchGroup
                label="Application Settings"
                divided
              >
                <SwitchWithLabel
                  label="Push notifications"
                  helperText="Get notified about new applications"
                  defaultChecked
                />
                <SwitchWithLabel
                  label="Email digest"
                  helperText="Receive weekly summary of activity"
                />
                <SwitchWithLabel
                  label="Sound effects"
                  helperText="Play sounds for notifications"
                  defaultChecked
                />
              </SwitchGroup>
            </div>
          </div>

          {/* Example: Feature Toggle */}
          <div>
            <h4 className="text-body-strong mb-3">Feature Toggle</h4>
            <div className="border border-[var(--border-default)] rounded-lg p-4 max-w-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[var(--background-brand-subtle)] rounded-lg">
                    <ChartBar size={24} weight="fill" className="text-[var(--foreground-brand)]" />
                  </div>
                  <div>
                    <p className="font-medium">Analytics Dashboard</p>
                    <p className="text-caption text-foreground-muted">
                      View detailed application metrics
                    </p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Related Components */}
      <ComponentCard
        id="related"
        title="Related Components"
        description="Components that work well with Switch"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/design-system/components/checkbox"
            className="p-4 border border-[var(--border-default)] rounded-lg hover:border-[var(--border-brand)] transition-colors"
          >
            <p className="font-medium">Checkbox</p>
            <p className="text-caption text-foreground-muted">
              For form submissions
            </p>
          </a>
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
              For organizing settings
            </p>
          </a>
        </div>
      </ComponentCard>

      <PageNavigation currentPath="/design-system/components/switch" />
    </div>
  );
}
