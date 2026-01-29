"use client";

import React from "react";
import {
  DatePicker,
  DateRangePicker,
  Label,
} from "@/components/ui";
import {
  ComponentCard,
  UsageGuide,
} from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";
import { addDays, addMonths } from "date-fns";
import { DateRange } from "react-day-picker";

const datePickerProps = [
  {
    name: "value",
    type: "Date",
    default: "undefined",
    description: "Selected date",
  },
  {
    name: "onChange",
    type: "(date: Date | undefined) => void",
    default: "undefined",
    description: "Callback when date changes",
  },
  {
    name: "placeholder",
    type: "string",
    default: '"Select date"',
    description: "Placeholder text",
  },
  {
    name: "dateFormat",
    type: "string",
    default: '"EEE, MMM d, yyyy"',
    description: "Date format string (date-fns)",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disable the picker",
  },
  {
    name: "clearable",
    type: "boolean",
    default: "true",
    description: "Allow clearing the selection",
  },
  {
    name: "minDate",
    type: "Date",
    default: "undefined",
    description: "Minimum selectable date",
  },
  {
    name: "maxDate",
    type: "Date",
    default: "undefined",
    description: "Maximum selectable date",
  },
  {
    name: "showPresets",
    type: "boolean",
    default: "true",
    description: "Show quick preset options",
  },
  {
    name: "presets",
    type: "DatePreset[]",
    default: "defaultSinglePresets",
    description: "Custom preset options",
  },
  {
    name: "availableDates",
    type: "Date[]",
    default: "undefined",
    description: "Dates with availability indicators",
  },
  {
    name: "blockedDates",
    type: "Date[]",
    default: "undefined",
    description: "Dates that are blocked (shown with strikethrough)",
  },
  {
    name: "error",
    type: "boolean",
    default: "false",
    description: "Error state styling",
  },
  {
    name: "success",
    type: "boolean",
    default: "false",
    description: "Success state styling",
  },
];

const dateRangePickerProps = [
  {
    name: "value",
    type: "DateRange",
    default: "undefined",
    description: "Selected date range ({ from: Date, to: Date })",
  },
  {
    name: "onChange",
    type: "(range: DateRange | undefined) => void",
    default: "undefined",
    description: "Callback when range changes",
  },
  {
    name: "placeholder",
    type: "string",
    default: '"Select dates"',
    description: "Placeholder text",
  },
  {
    name: "dateFormat",
    type: "string",
    default: '"MMM d, yyyy"',
    description: "Date format string",
  },
  {
    name: "numberOfMonths",
    type: "1 | 2",
    default: "2",
    description: "Number of months to show side-by-side",
  },
  {
    name: "showPresets",
    type: "boolean",
    default: "true",
    description: "Show quick preset options",
  },
  {
    name: "presets",
    type: "DatePreset[]",
    default: "defaultRangePresets",
    description: "Custom preset options",
  },
];

export default function DatePickerPage() {
  // Single date states
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  // Range states
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  // Blocked dates example
  const blockedDates = [
    addDays(new Date(), 2),
    addDays(new Date(), 5),
    addDays(new Date(), 8),
  ];

  // Availability dates example
  const availableDates = [
    addDays(new Date(), 1),
    addDays(new Date(), 3),
    addDays(new Date(), 4),
    addDays(new Date(), 6),
    addDays(new Date(), 7),
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Date Picker
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          A modern date picker with month/year dropdowns, quick presets with
          radio selection, today indicator, disabled dates with strikethrough,
          and smooth range selection with solid fill.
        </p>
      </div>

      {/* Key Features */}
      <ComponentCard
        id="features"
        title="Key Features"
        description="What makes this date picker different"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-[var(--primitive-neutral-100)] rounded-xl">
            <h4 className="font-semibold text-[var(--foreground-default)] mb-1">
              Month/Year Dropdowns
            </h4>
            <p className="text-sm text-[var(--foreground-muted)]">
              Quick navigation with clickable dropdowns instead of just arrows
            </p>
          </div>
          <div className="p-4 bg-[var(--primitive-neutral-100)] rounded-xl">
            <h4 className="font-semibold text-[var(--foreground-default)] mb-1">
              Preset Sidebar
            </h4>
            <p className="text-sm text-[var(--foreground-muted)]">
              Radio-style quick selections: Today, Yesterday, Last 7 days, etc.
            </p>
          </div>
          <div className="p-4 bg-[var(--primitive-neutral-100)] rounded-xl">
            <h4 className="font-semibold text-[var(--foreground-default)] mb-1">
              Today Indicator
            </h4>
            <p className="text-sm text-[var(--foreground-muted)]">
              Outline ring style to distinguish today from selection
            </p>
          </div>
          <div className="p-4 bg-[var(--primitive-neutral-100)] rounded-xl">
            <h4 className="font-semibold text-[var(--foreground-default)] mb-1">
              Strikethrough Disabled
            </h4>
            <p className="text-sm text-[var(--foreground-muted)]">
              Clear visual for unavailable dates with strikethrough text
            </p>
          </div>
          <div className="p-4 bg-[var(--primitive-neutral-100)] rounded-xl">
            <h4 className="font-semibold text-[var(--foreground-default)] mb-1">
              Range Fill
            </h4>
            <p className="text-sm text-[var(--foreground-muted)]">
              Solid blue fill between range start and end dates
            </p>
          </div>
          <div className="p-4 bg-[var(--primitive-neutral-100)] rounded-xl">
            <h4 className="font-semibold text-[var(--foreground-default)] mb-1">
              Availability Dots
            </h4>
            <p className="text-sm text-[var(--foreground-muted)]">
              Small green dots to indicate available dates
            </p>
          </div>
        </div>
      </ComponentCard>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Single date picker with presets sidebar"
      >
        <CodePreview
          code={`import { DatePicker } from "@/components/ui";

<DatePicker
  value={date}
  onChange={setDate}
  placeholder="Select date"
  showPresets
/>`}
        >
          <div className="max-w-sm">
            <DatePicker
              value={date}
              onChange={setDate}
              placeholder="Select date"
              showPresets
            />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* With Blocked Dates */}
      <ComponentCard
        id="blocked-dates"
        title="With Blocked Dates"
        description="Disabled dates shown with strikethrough"
      >
        <CodePreview
          code={`<DatePicker
  placeholder="Select interview date"
  blockedDates={[
    addDays(new Date(), 2),
    addDays(new Date(), 5),
    addDays(new Date(), 8),
  ]}
  minDate={new Date()}
/>`}
        >
          <div className="max-w-sm space-y-2">
            <Label>Interview Date</Label>
            <DatePicker
              placeholder="Select interview date"
              blockedDates={blockedDates}
              minDate={new Date()}
            />
            <p className="text-sm text-[var(--foreground-muted)]">
              Some dates are blocked (shown with strikethrough)
            </p>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* With Availability Indicators */}
      <ComponentCard
        id="availability"
        title="With Availability Indicators"
        description="Green dots show available slots"
      >
        <CodePreview
          code={`<DatePicker
  placeholder="Select available date"
  availableDates={availableDates}
  minDate={new Date()}
/>`}
        >
          <div className="max-w-sm space-y-2">
            <Label>Available Interview Slots</Label>
            <DatePicker
              placeholder="Select available date"
              availableDates={availableDates}
              minDate={new Date()}
            />
            <p className="text-sm text-[var(--foreground-muted)]">
              Dates with green dots have available slots
            </p>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Date Range Picker */}
      <ComponentCard
        id="date-range"
        title="Date Range Picker"
        description="Side-by-side month view with presets"
      >
        <CodePreview
          code={`import { DateRangePicker } from "@/components/ui";

<DateRangePicker
  value={dateRange}
  onChange={setDateRange}
  placeholder="Select date range"
  numberOfMonths={2}
  showPresets
/>`}
        >
          <div className="max-w-md space-y-2">
            <Label>Filter by date range</Label>
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              placeholder="Select date range"
              numberOfMonths={2}
              showPresets
            />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Single Month Range */}
      <ComponentCard
        id="single-month-range"
        title="Single Month Range Picker"
        description="Compact range picker with single month view"
      >
        <div className="max-w-sm space-y-2">
          <Label>Quick date filter</Label>
          <DateRangePicker
            placeholder="Select dates"
            numberOfMonths={1}
            showPresets
          />
        </div>
      </ComponentCard>

      {/* Without Presets */}
      <ComponentCard
        id="no-presets"
        title="Without Presets"
        description="Calendar only, no sidebar"
      >
        <div className="grid gap-6 max-w-xl md:grid-cols-2">
          <div className="space-y-2">
            <Label>Single date</Label>
            <DatePicker
              placeholder="Select date"
              showPresets={false}
            />
          </div>
          <div className="space-y-2">
            <Label>Date range</Label>
            <DateRangePicker
              placeholder="Select dates"
              showPresets={false}
              numberOfMonths={1}
            />
          </div>
        </div>
      </ComponentCard>

      {/* States */}
      <ComponentCard
        id="states"
        title="States"
        description="Error, success, and disabled states"
      >
        <div className="grid gap-6 max-w-xl md:grid-cols-3">
          <div className="space-y-2">
            <Label>Default</Label>
            <DatePicker placeholder="Select date" />
          </div>
          <div className="space-y-2">
            <Label className="text-[var(--foreground-error)]">Error</Label>
            <DatePicker placeholder="Select date" error />
          </div>
          <div className="space-y-2">
            <Label className="text-[var(--foreground-success)]">Success</Label>
            <DatePicker
              value={new Date()}
              success
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[var(--foreground-muted)]">Disabled</Label>
            <DatePicker value={new Date()} disabled />
          </div>
        </div>
      </ComponentCard>

      {/* Form Example */}
      <ComponentCard
        id="form-example"
        title="Form Example"
        description="Date pickers in a real form context"
      >
        <div className="max-w-lg space-y-6 p-6 border border-[var(--primitive-neutral-200)] rounded-2xl bg-[var(--primitive-neutral-0)]">
          <div className="space-y-2">
            <Label htmlFor="start-date">Job Posting Start Date</Label>
            <DatePicker
              value={date}
              onChange={setDate}
              placeholder="When should the job go live?"
              minDate={new Date()}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-date">Application Deadline</Label>
            <DatePicker
              placeholder="When should applications close?"
              minDate={date || new Date()}
              maxDate={addMonths(date || new Date(), 3)}
            />
          </div>
          <div className="space-y-2">
            <Label>Interview Availability Window</Label>
            <DateRangePicker
              placeholder="When are you available to interview?"
              numberOfMonths={2}
            />
          </div>
        </div>
      </ComponentCard>

      {/* Props - DatePicker */}
      <ComponentCard id="props-single" title="DatePicker Props">
        <PropsTable props={datePickerProps} />
      </ComponentCard>

      {/* Props - DateRangePicker */}
      <ComponentCard id="props-range" title="DateRangePicker Props">
        <PropsTable props={dateRangePickerProps} />
      </ComponentCard>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Use showPresets for quick date selection workflows",
          "Use blockedDates to show unavailable dates with strikethrough",
          "Use availableDates to highlight dates with available slots",
          "Use numberOfMonths={2} for range pickers when space allows",
          "Use minDate/maxDate to constrain valid date ranges",
        ]}
        donts={[
          "Don't hide presets if users commonly select relative dates",
          "Don't use this for date-time selection (combine with TimePicker)",
          "Don't make date format too complex for users to read",
        ]}
      />

      <PageNavigation currentPath="/design-system/components/date-picker" />
    </div>
  );
}
