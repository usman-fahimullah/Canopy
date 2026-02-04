"use client";

import React from "react";
import { TimezoneSelector, Label } from "@/components/ui";
import {
  ComponentCard,
  UsageGuide,
  AccessibilityInfo,
} from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";

const timezoneSelectorProps = [
  {
    name: "value",
    type: "string",
    default: "required",
    description: 'The currently selected timezone identifier (e.g. "America/New_York")',
  },
  {
    name: "onChange",
    type: "(timezone: string) => void",
    default: "required",
    description: "Callback fired when the user selects a different timezone",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Additional CSS classes applied to the outer wrapper",
  },
];

export default function TimezoneSelectorPage() {
  const [timezone, setTimezone] = React.useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="mb-2 text-heading-lg text-foreground">
          Timezone Selector
        </h1>
        <p className="max-w-2xl text-body text-foreground-muted">
          A compact dropdown for selecting a timezone. It displays a globe icon alongside a
          borderless select populated with common worldwide timezones. Used inside scheduling
          components such as TimeSlotPicker and the interview Scheduler.
        </p>

        {/* When to Use / When Not to Use */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="bg-[var(--background-success)]/10 rounded-lg border border-[var(--border-success)] p-4">
            <h3 className="mb-2 font-semibold text-[var(--foreground-success)]">When to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>* Scheduling flows where users pick meeting times across timezones</li>
              <li>* Availability calendars that display hours in a chosen timezone</li>
              <li>* Settings pages where users configure their local timezone</li>
            </ul>
          </div>
          <div className="bg-[var(--background-error)]/10 rounded-lg border border-[var(--border-error)] p-4">
            <h3 className="mb-2 font-semibold text-[var(--foreground-error)]">When not to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>* When the timezone is inferred automatically and never changed by the user</li>
              <li>* For selecting a date or time (use DatePicker or TimePicker)</li>
              <li>* For displaying timezone info read-only (use plain text instead)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="A controlled component that requires value and onChange"
      >
        <CodePreview
          code={`import { TimezoneSelector } from "@/components/ui";
import React from "react";

const [timezone, setTimezone] = React.useState(
  Intl.DateTimeFormat().resolvedOptions().timeZone
);

<TimezoneSelector value={timezone} onChange={setTimezone} />`}
        >
          <div className="space-y-4">
            <TimezoneSelector value={timezone} onChange={setTimezone} />
            <p className="text-caption text-foreground-muted">
              Selected:{" "}
              <code className="rounded bg-[var(--background-muted)] px-1">{timezone}</code>
            </p>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* With Custom Class */}
      <ComponentCard
        id="custom-class"
        title="Custom Styling"
        description="Pass className to adjust the outer wrapper"
      >
        <CodePreview
          code={`<TimezoneSelector
  value={timezone}
  onChange={setTimezone}
  className="rounded-lg bg-[var(--background-subtle)] px-2 py-1"
/>`}
        >
          <TimezoneSelector
            value={timezone}
            onChange={setTimezone}
            className="rounded-lg bg-[var(--background-subtle)] px-2 py-1"
          />
        </CodePreview>
      </ComponentCard>

      {/* In a Form */}
      <ComponentCard
        id="form-example"
        title="In a Form"
        description="Pair with a Label for accessible form layouts"
      >
        <CodePreview
          code={`<div className="space-y-1">
  <Label>Your timezone</Label>
  <TimezoneSelector value={timezone} onChange={setTimezone} />
</div>`}
        >
          <div className="max-w-sm space-y-1">
            <Label>Your timezone</Label>
            <TimezoneSelector value={timezone} onChange={setTimezone} />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Props Table */}
      <ComponentCard id="props" title="Props">
        <PropsTable props={timezoneSelectorProps} />
      </ComponentCard>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Default to the user's detected timezone via Intl.DateTimeFormat()",
          "Place near date/time inputs so the timezone context is clear",
          "Use inside scheduling flows (interview booking, availability)",
          "Keep the component compact -- the borderless style is intentional",
        ]}
        donts={[
          "Don't use as a standalone form field without a label for accessibility",
          "Don't pre-select a timezone that differs from the user's locale without reason",
          "Don't show every IANA timezone -- the curated COMMON_TIMEZONES list is preferred",
          "Don't hide the globe icon -- it provides instant visual context",
        ]}
      />

      {/* Accessibility */}
      <AccessibilityInfo
        items={[
          "**Keyboard**: Tab to focus the select trigger, Space/Enter to open, Arrow keys to navigate options",
          "**Focus indicator**: Inherits focus ring from the underlying Select component",
          "**Screen readers**: The globe icon is decorative; the select announces its label and current value",
          "**ARIA**: Relies on the underlying Radix Select primitives for full ARIA support",
          "**Labels**: Pair with a visible Label component or aria-label when used outside a form",
        ]}
      />

      {/* Related Components */}
      <ComponentCard
        id="related"
        title="Related Components"
        description="Components commonly used with TimezoneSelector"
      >
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <a
            href="/design-system/components/time-slot-picker"
            className="rounded-lg border border-[var(--border-default)] p-4 transition-colors hover:border-[var(--border-brand)]"
          >
            <p className="font-medium">TimeSlotPicker</p>
            <p className="text-caption text-foreground-muted">Pick available time slots</p>
          </a>
          <a
            href="/design-system/components/scheduler"
            className="rounded-lg border border-[var(--border-default)] p-4 transition-colors hover:border-[var(--border-brand)]"
          >
            <p className="font-medium">Scheduler</p>
            <p className="text-caption text-foreground-muted">Full interview scheduler</p>
          </a>
          <a
            href="/design-system/components/dropdown"
            className="rounded-lg border border-[var(--border-default)] p-4 transition-colors hover:border-[var(--border-brand)]"
          >
            <p className="font-medium">Dropdown / Select</p>
            <p className="text-caption text-foreground-muted">Underlying select primitive</p>
          </a>
          <a
            href="/design-system/components/date-picker"
            className="rounded-lg border border-[var(--border-default)] p-4 transition-colors hover:border-[var(--border-brand)]"
          >
            <p className="font-medium">DatePicker</p>
            <p className="text-caption text-foreground-muted">For selecting dates</p>
          </a>
        </div>
      </ComponentCard>

      <PageNavigation currentPath="/design-system/components/timezone-selector" />
    </div>
  );
}
