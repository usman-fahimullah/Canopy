"use client";

import React from "react";
import { Calendar } from "@/components/ui";
import { ComponentCard, UsageGuide } from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";

const calendarProps = [
  { name: "mode", type: '"single" | "multiple" | "range"', default: '"single"', description: "Selection mode" },
  { name: "selected", type: "Date | Date[] | DateRange", default: "undefined", description: "Selected date(s)" },
  { name: "onSelect", type: "(date) => void", default: "undefined", description: "Selection callback" },
  { name: "disabled", type: "Matcher | Matcher[]", default: "undefined", description: "Dates to disable" },
  { name: "showOutsideDays", type: "boolean", default: "true", description: "Show days outside current month" },
  { name: "numberOfMonths", type: "number", default: "1", description: "Number of months to display" },
];

export default function CalendarPage() {
  const [singleDate, setSingleDate] = React.useState<Date | undefined>(new Date());
  const [multipleDates, setMultipleDates] = React.useState<Date[] | undefined>([new Date()]);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Calendar
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          Calendar provides date selection functionality. It supports single date,
          multiple dates, and date range selection modes.
        </p>
      </div>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Single date selection"
      >
        <CodePreview
          code={`<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
/>`}
        >
          <Calendar
            mode="single"
            selected={singleDate}
            onSelect={setSingleDate}
            className="border border-border rounded-lg"
          />
        </CodePreview>
      </ComponentCard>

      {/* Multiple Selection */}
      <ComponentCard
        id="multiple"
        title="Multiple Selection"
        description="Select multiple individual dates"
      >
        <div className="space-y-4">
          <Calendar
            mode="multiple"
            selected={multipleDates}
            onSelect={setMultipleDates}
            className="border border-border rounded-lg"
          />
          {multipleDates && multipleDates.length > 0 && (
            <p className="text-caption text-foreground-muted">
              Selected: {multipleDates.map(d => d.toLocaleDateString()).join(", ")}
            </p>
          )}
        </div>
      </ComponentCard>

      {/* Date Range */}
      <ComponentCard
        id="range"
        title="Date Range"
        description="Select a range of dates"
      >
        <div className="space-y-4">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
            className="border border-border rounded-lg"
          />
          {dateRange?.from && (
            <p className="text-caption text-foreground-muted">
              {dateRange.from.toLocaleDateString()}
              {dateRange.to && ` - ${dateRange.to.toLocaleDateString()}`}
            </p>
          )}
        </div>
      </ComponentCard>

      {/* Disabled Dates */}
      <ComponentCard
        id="disabled"
        title="Disabled Dates"
        description="Prevent selection of certain dates"
      >
        <Calendar
          mode="single"
          selected={singleDate}
          onSelect={setSingleDate}
          disabled={[
            { before: new Date() }, // Disable past dates
            { dayOfWeek: [0, 6] }, // Disable weekends
          ]}
          className="border border-border rounded-lg"
        />
        <p className="text-caption text-foreground-muted mt-2">
          Past dates and weekends are disabled
        </p>
      </ComponentCard>

      {/* Multiple Months */}
      <ComponentCard
        id="multiple-months"
        title="Multiple Months"
        description="Display multiple months at once"
      >
        <Calendar
          mode="single"
          selected={singleDate}
          onSelect={setSingleDate}
          numberOfMonths={2}
          className="border border-border rounded-lg"
        />
      </ComponentCard>

      {/* Props */}
      <ComponentCard id="props" title="Props">
        <PropsTable props={calendarProps} />
      </ComponentCard>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Use for date selection in forms",
          "Show disabled dates clearly",
          "Use range mode for booking/scheduling",
          "Consider using DatePicker for inline usage",
        ]}
        donts={[
          "Don't use for time-only selection",
          "Don't show too many months at once",
          "Don't hide important disabled date reasons",
          "Don't use for simple month/year selection",
        ]}
      />

      <PageNavigation currentPath="/design-system/components/calendar" />
    </div>
  );
}
