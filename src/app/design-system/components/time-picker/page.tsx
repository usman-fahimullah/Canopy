"use client";

import React from "react";
import {
  TimePicker,
  TimeInput,
  TimeSpinner,
  DateTimePicker,
  Label,
  Card,
  CardContent,
  Button,
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
import { Clock, Calendar, VideoCamera, Phone, Warning, CheckCircle } from "@phosphor-icons/react";

// ============================================
// PROPS DEFINITIONS - Matching actual implementation
// ============================================

const timePickerProps = [
  {
    name: "value",
    type: "Date | undefined",
    description: "The currently selected time as a Date object.",
  },
  {
    name: "onChange",
    type: "(date: Date | undefined) => void",
    description: "Callback when time changes.",
  },
  {
    name: "defaultValue",
    type: "Date",
    description: "Default value for uncontrolled mode.",
  },
  {
    name: "placeholder",
    type: "string",
    default: '"Select time"',
    description: "Placeholder text shown when no time is selected.",
  },
  {
    name: "format",
    type: '"12h" | "24h"',
    default: '"12h"',
    description: "Time display format. 12-hour includes AM/PM toggle.",
  },
  {
    name: "minuteStep",
    type: "1 | 5 | 10 | 15 | 30",
    default: "15",
    description: "Minute increment step for time slot generation.",
  },
  {
    name: "minTime",
    type: "Date",
    description: "Minimum selectable time.",
  },
  {
    name: "maxTime",
    type: "Date",
    description: "Maximum selectable time.",
  },
  {
    name: "showSeconds",
    type: "boolean",
    default: "false",
    description: "Whether to display seconds in the time format.",
  },
  {
    name: "clearable",
    type: "boolean",
    default: "true",
    description: "Shows a clear button when a value is selected.",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disables the time picker.",
  },
  {
    name: "error",
    type: "boolean",
    default: "false",
    description: "Shows error state with red border.",
  },
  {
    name: "errorMessage",
    type: "string",
    description: "Error message displayed below the input.",
  },
  {
    name: "success",
    type: "boolean",
    default: "false",
    description: "Shows success state with green border.",
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    description: "Shows loading spinner and disables interaction.",
  },
  {
    name: "aria-label",
    type: "string",
    description: "Accessible name for the time picker.",
  },
  {
    name: "aria-describedby",
    type: "string",
    description: "ID of element that describes the time picker.",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes.",
  },
];

const timeInputProps = [
  {
    name: "value",
    type: "Date | undefined",
    description: "Time value as a Date object.",
  },
  {
    name: "onChange",
    type: "(date: Date | undefined) => void",
    description: "Callback when input value changes.",
  },
  {
    name: "defaultValue",
    type: "Date",
    description: "Default value for uncontrolled mode.",
  },
  {
    name: "placeholder",
    type: "string",
    default: '"hh:mm AM" or "HH:mm"',
    description: "Placeholder text based on format.",
  },
  {
    name: "format",
    type: '"12h" | "24h"',
    default: '"12h"',
    description: "Time display format.",
  },
  {
    name: "showSeconds",
    type: "boolean",
    default: "false",
    description: "Whether to include seconds in the format.",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disables the input.",
  },
  {
    name: "error",
    type: "boolean",
    default: "false",
    description: "Shows error state with red border.",
  },
  {
    name: "errorMessage",
    type: "string",
    description: "Error message displayed below the input.",
  },
  {
    name: "success",
    type: "boolean",
    default: "false",
    description: "Shows success state with green border.",
  },
  {
    name: "aria-label",
    type: "string",
    description: "Accessible name for the input.",
  },
  {
    name: "aria-describedby",
    type: "string",
    description: "ID of element that describes the input.",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes.",
  },
];

const timeSpinnerProps = [
  {
    name: "value",
    type: "Date | undefined",
    description: "Currently selected time.",
  },
  {
    name: "onChange",
    type: "(date: Date) => void",
    description: "Callback when time changes.",
  },
  {
    name: "defaultValue",
    type: "Date",
    description: "Default value for uncontrolled mode.",
  },
  {
    name: "format",
    type: '"12h" | "24h"',
    default: '"12h"',
    description: "Time display format.",
  },
  {
    name: "minuteStep",
    type: "1 | 5 | 10 | 15 | 30",
    default: "1",
    description: "Minute increment step.",
  },
  {
    name: "showSeconds",
    type: "boolean",
    default: "false",
    description: "Whether to show seconds spinner column.",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disables all spinner controls.",
  },
  {
    name: "aria-label",
    type: "string",
    description: "Accessible label for the spinner group.",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes.",
  },
];

const dateTimePickerProps = [
  {
    name: "value",
    type: "Date | undefined",
    description: "The currently selected date and time.",
  },
  {
    name: "onChange",
    type: "(date: Date | undefined) => void",
    description: "Callback when date or time changes.",
  },
  {
    name: "defaultValue",
    type: "Date",
    description: "Default value for uncontrolled mode.",
  },
  {
    name: "placeholder",
    type: "string",
    default: '"Select date and time"',
    description: "Placeholder text when no value is selected.",
  },
  {
    name: "dateFormat",
    type: "string",
    default: '"MMM d, yyyy"',
    description: "Date display format string (date-fns format).",
  },
  {
    name: "timeFormat",
    type: '"12h" | "24h"',
    default: '"12h"',
    description: "Time display format.",
  },
  {
    name: "minuteStep",
    type: "1 | 5 | 10 | 15 | 30",
    default: "15",
    description: "Minute increment step.",
  },
  {
    name: "minDate",
    type: "Date",
    description: "Minimum selectable date.",
  },
  {
    name: "maxDate",
    type: "Date",
    description: "Maximum selectable date.",
  },
  {
    name: "minTime",
    type: "Date",
    description: "Minimum selectable time.",
  },
  {
    name: "maxTime",
    type: "Date",
    description: "Maximum selectable time.",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disables the picker.",
  },
  {
    name: "error",
    type: "boolean",
    default: "false",
    description: "Shows error state with red border.",
  },
  {
    name: "errorMessage",
    type: "string",
    description: "Error message displayed below the picker.",
  },
  {
    name: "success",
    type: "boolean",
    default: "false",
    description: "Shows success state with green border.",
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    description: "Shows loading spinner and disables interaction.",
  },
  {
    name: "aria-label",
    type: "string",
    description: "Accessible name for the picker.",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes.",
  },
];

// ============================================
// PAGE COMPONENT
// ============================================

export default function TimePickerPage() {
  const [time, setTime] = React.useState<Date | undefined>(undefined);
  const [time24, setTime24] = React.useState<Date | undefined>(undefined);
  const [timeInputValue, setTimeInputValue] = React.useState<Date | undefined>(undefined);
  const [spinnerTime, setSpinnerTime] = React.useState<Date | undefined>(new Date());
  const [spinnerTimeWithSeconds, setSpinnerTimeWithSeconds] = React.useState<Date | undefined>(new Date());
  const [dateTime, setDateTime] = React.useState<Date | undefined>(undefined);
  const [interviewTime, setInterviewTime] = React.useState<Date | undefined>(undefined);

  // Create time constraints for business hours
  const businessStart = new Date();
  businessStart.setHours(9, 0, 0, 0);
  const businessEnd = new Date();
  businessEnd.setHours(17, 0, 0, 0);

  return (
    <div className="space-y-12">
      {/* ============================================ */}
      {/* 1. OVERVIEW */}
      {/* ============================================ */}
      <div id="overview">
        <h1 className="text-heading-lg text-foreground mb-2">
          Time Picker
        </h1>
        <p className="text-body text-foreground-muted max-w-3xl">
          Time Picker allows users to select a specific time. It supports both
          12-hour (AM/PM) and 24-hour formats, with options for minute stepping,
          time constraints, and combined date-time selection. Ideal for scheduling
          interviews, setting deadlines, and calendar events.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-background-brand-subtle text-foreground-brand rounded-full text-caption font-medium">
            Interactive
          </span>
          <span className="px-3 py-1 bg-background-subtle text-foreground-muted rounded-full text-caption">
            4 Variants
          </span>
          <span className="px-3 py-1 bg-background-subtle text-foreground-muted rounded-full text-caption">
            12h/24h Formats
          </span>
          <span className="px-3 py-1 bg-background-subtle text-foreground-muted rounded-full text-caption">
            Keyboard Accessible
          </span>
        </div>

        {/* When to Use / When Not to Use */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-background-success rounded-lg border border-border-success">
            <h3 className="font-semibold text-foreground-success mb-2">
              When to use
            </h3>
            <ul className="text-sm space-y-1 text-foreground-muted">
              <li>* Scheduling interviews or meetings</li>
              <li>* Setting application deadlines</li>
              <li>* Calendar event creation</li>
              <li>* Business hours configuration</li>
              <li>* Reminder or notification settings</li>
            </ul>
          </div>
          <div className="p-4 bg-background-error rounded-lg border border-border-error">
            <h3 className="font-semibold text-foreground-error mb-2">
              When not to use
            </h3>
            <ul className="text-sm space-y-1 text-foreground-muted">
              <li>* Duration selection (use Duration Input)</li>
              <li>* Date-only selection (use Date Picker)</li>
              <li>* Timezone selection (use Timezone Selector)</li>
              <li>* Approximate time (use time slots instead)</li>
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
            name: "Trigger Button",
            description: "Clickable area that opens the time selector dropdown. Shows selected time or placeholder.",
            required: true,
          },
          {
            name: "Clock Icon",
            description: "Visual indicator that this is a time-related input.",
            required: true,
          },
          {
            name: "Time Display",
            description: "Formatted time string (e.g., '2:30 PM' or '14:30').",
            required: true,
          },
          {
            name: "Clear Button",
            description: "Optional button to clear the selected time.",
          },
          {
            name: "Loading Spinner",
            description: "Animated spinner shown during async operations.",
          },
          {
            name: "Hour Spinner",
            description: "Scrollable list or input for selecting hours.",
            required: true,
          },
          {
            name: "Minute Spinner",
            description: "Scrollable list or input for selecting minutes, respecting minuteStep.",
            required: true,
          },
          {
            name: "AM/PM Toggle (12h)",
            description: "Toggle buttons for meridiem selection in 12-hour format.",
          },
          {
            name: "Seconds Spinner (optional)",
            description: "Additional spinner for second-precision time selection.",
          },
          {
            name: "Error Message",
            description: "Validation feedback displayed below the input.",
          },
        ]}
      />

      {/* ============================================ */}
      {/* 3. BASIC USAGE */}
      {/* ============================================ */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="A simple time picker with 12-hour format and AM/PM toggle"
      >
        <CodePreview
          code={`import { TimePicker } from "@/components/ui";

const [time, setTime] = React.useState<Date | undefined>(undefined);

<TimePicker
  value={time}
  onChange={setTime}
  placeholder="Select time"
/>`}
        >
          <div className="max-w-xs">
            <TimePicker
              value={time}
              onChange={setTime}
              placeholder="Select time"
            />
            <p className="text-caption text-foreground-muted mt-2">
              Selected: <code className="bg-background-muted px-1 rounded">
                {time ? time.toLocaleTimeString() : "(none)"}
              </code>
            </p>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 4. VARIANTS */}
      {/* ============================================ */}
      <ComponentCard
        id="variants"
        title="Time Picker Variants"
        description="Different time picker components for various use cases"
      >
        <div className="space-y-8">
          {/* TimePicker */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-body-strong">TimePicker</Label>
              <span className="text-caption text-foreground-muted">
                - Dropdown-based time selection
              </span>
            </div>
            <p className="text-caption text-foreground-muted">
              Opens a scrollable dropdown with time slots. Best for quick selection with keyboard navigation.
            </p>
            <div className="max-w-xs">
              <TimePicker
                value={time}
                onChange={setTime}
                placeholder="Select time"
              />
            </div>
          </div>

          {/* TimeInput */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-body-strong">TimeInput</Label>
              <span className="text-caption text-foreground-muted">
                - Direct text input for time
              </span>
            </div>
            <p className="text-caption text-foreground-muted">
              Text input with flexible parsing. Use arrow keys to increment/decrement hours or minutes based on cursor position.
            </p>
            <div className="max-w-xs">
              <TimeInput
                value={timeInputValue}
                onChange={setTimeInputValue}
                placeholder="hh:mm AM"
              />
            </div>
          </div>

          {/* TimeSpinner */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-body-strong">TimeSpinner</Label>
              <span className="text-caption text-foreground-muted">
                - Inline scrollable time wheels
              </span>
            </div>
            <p className="text-caption text-foreground-muted">
              Visible spinner wheels for hour, minute, and optionally seconds. Good for mobile UIs and precise selection.
            </p>
            <div className="max-w-xs">
              <TimeSpinner
                value={spinnerTime}
                onChange={setSpinnerTime}
                format="12h"
              />
            </div>
          </div>

          {/* DateTimePicker */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-body-strong">DateTimePicker</Label>
              <span className="text-caption text-foreground-muted">
                - Combined date and time selection
              </span>
            </div>
            <p className="text-caption text-foreground-muted">
              Full calendar with time slot selection. Use for scheduling when both date and time are needed.
            </p>
            <div className="max-w-md">
              <DateTimePicker
                value={dateTime}
                onChange={setDateTime}
                placeholder="Select date and time"
              />
              {dateTime && (
                <p className="text-caption text-foreground-muted mt-2">
                  Selected: {dateTime.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 5. TIME FORMATS */}
      {/* ============================================ */}
      <ComponentCard
        id="formats"
        title="Time Formats"
        description="12-hour (AM/PM) and 24-hour time formats"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <Label>12-Hour Format (AM/PM)</Label>
            <TimePicker
              value={time}
              onChange={setTime}
              format="12h"
              placeholder="Select time"
            />
            <p className="text-caption text-foreground-muted">
              Shows hours 1-12 with AM/PM toggle. Common in US.
            </p>
          </div>
          <div className="space-y-3">
            <Label>24-Hour Format</Label>
            <TimePicker
              value={time24}
              onChange={setTime24}
              format="24h"
              placeholder="Select time"
            />
            <p className="text-caption text-foreground-muted">
              Shows hours 0-23 without AM/PM. Common internationally.
            </p>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 6. MINUTE STEPPING */}
      {/* ============================================ */}
      <ComponentCard
        id="minute-step"
        title="Minute Stepping"
        description="Control the granularity of minute selection"
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-3">
            <Label>5-Minute Steps</Label>
            <TimePicker
              minuteStep={5}
              placeholder="Select time"
            />
            <p className="text-caption text-foreground-muted">
              Minutes: 0, 5, 10, 15...
            </p>
          </div>
          <div className="space-y-3">
            <Label>15-Minute Steps</Label>
            <TimePicker
              minuteStep={15}
              placeholder="Select time"
            />
            <p className="text-caption text-foreground-muted">
              Minutes: 0, 15, 30, 45
            </p>
          </div>
          <div className="space-y-3">
            <Label>30-Minute Steps</Label>
            <TimePicker
              minuteStep={30}
              placeholder="Select time"
            />
            <p className="text-caption text-foreground-muted">
              Minutes: 0, 30
            </p>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 7. TIME CONSTRAINTS */}
      {/* ============================================ */}
      <ComponentCard
        id="constraints"
        title="Time Constraints"
        description="Limit selectable times with minTime and maxTime"
      >
        <CodePreview
          code={`const businessStart = new Date();
businessStart.setHours(9, 0, 0, 0);

const businessEnd = new Date();
businessEnd.setHours(17, 0, 0, 0);

<TimePicker
  minTime={businessStart}
  maxTime={businessEnd}
  minuteStep={15}
  placeholder="Select business hours"
/>`}
        >
          <div className="max-w-xs">
            <TimePicker
              minTime={businessStart}
              maxTime={businessEnd}
              minuteStep={15}
              placeholder="Select business hours (9 AM - 5 PM)"
            />
            <p className="text-caption text-foreground-muted mt-2">
              Only times between 9:00 AM and 5:00 PM are selectable.
            </p>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 8. STATES */}
      {/* ============================================ */}
      <ComponentCard
        id="states"
        title="States"
        description="Visual states for different scenarios"
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label>Default</Label>
            <TimePicker placeholder="Select time" />
            <p className="text-caption text-foreground-muted">Ready for input</p>
          </div>
          <div className="space-y-2">
            <Label>With Value</Label>
            <TimePicker
              value={new Date(2024, 0, 1, 14, 30)}
              placeholder="Select time"
            />
            <p className="text-caption text-foreground-muted">Time selected</p>
          </div>
          <div className="space-y-2">
            <Label>Disabled</Label>
            <TimePicker
              placeholder="Select time"
              disabled
            />
            <p className="text-caption text-foreground-muted">Cannot interact</p>
          </div>
          <div className="space-y-2">
            <Label>Loading</Label>
            <TimePicker
              placeholder="Loading times..."
              loading
            />
            <p className="text-caption text-foreground-muted">Fetching available slots</p>
          </div>
          <div className="space-y-2">
            <Label>Error State</Label>
            <TimePicker
              placeholder="Select time"
              error
              errorMessage="Time is required"
            />
            <p className="text-caption text-foreground-muted">Validation failed</p>
          </div>
          <div className="space-y-2">
            <Label>Success State</Label>
            <TimePicker
              value={new Date(2024, 0, 1, 10, 0)}
              placeholder="Select time"
              success
            />
            <p className="text-caption text-foreground-muted">Valid selection</p>
          </div>
          <div className="space-y-2">
            <Label>Not Clearable</Label>
            <TimePicker
              value={new Date(2024, 0, 1, 9, 0)}
              placeholder="Select time"
              clearable={false}
            />
            <p className="text-caption text-foreground-muted">No clear button</p>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 9. WITH SECONDS */}
      {/* ============================================ */}
      <ComponentCard
        id="with-seconds"
        title="With Seconds"
        description="TimeSpinner can include seconds for precise time selection"
      >
        <CodePreview
          code={`<TimeSpinner
  value={time}
  onChange={setTime}
  format="24h"
  showSeconds
/>`}
        >
          <div className="space-y-4">
            <TimeSpinner
              value={spinnerTimeWithSeconds}
              onChange={setSpinnerTimeWithSeconds}
              format="24h"
              showSeconds
            />
            <p className="text-caption text-foreground-muted">
              Selected: {spinnerTimeWithSeconds?.toLocaleTimeString() || "(none)"}
            </p>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 10. KEYBOARD NAVIGATION */}
      {/* ============================================ */}
      <ComponentCard
        id="keyboard"
        title="Keyboard Navigation"
        description="Full keyboard support for accessibility"
      >
        <div className="space-y-4">
          <div className="p-4 bg-background-subtle rounded-lg">
            <h4 className="font-medium mb-3">TimePicker Dropdown</h4>
            <ul className="text-sm space-y-1 text-foreground-muted">
              <li><kbd className="px-1.5 py-0.5 bg-background-muted rounded text-xs">Enter</kbd> / <kbd className="px-1.5 py-0.5 bg-background-muted rounded text-xs">Space</kbd> / <kbd className="px-1.5 py-0.5 bg-background-muted rounded text-xs">Down</kbd> - Open dropdown</li>
              <li><kbd className="px-1.5 py-0.5 bg-background-muted rounded text-xs">Up</kbd> / <kbd className="px-1.5 py-0.5 bg-background-muted rounded text-xs">Down</kbd> - Navigate time slots</li>
              <li><kbd className="px-1.5 py-0.5 bg-background-muted rounded text-xs">Home</kbd> / <kbd className="px-1.5 py-0.5 bg-background-muted rounded text-xs">End</kbd> - Jump to first/last slot</li>
              <li><kbd className="px-1.5 py-0.5 bg-background-muted rounded text-xs">Enter</kbd> - Select highlighted time</li>
              <li><kbd className="px-1.5 py-0.5 bg-background-muted rounded text-xs">Escape</kbd> - Close dropdown</li>
            </ul>
          </div>
          <div className="p-4 bg-background-subtle rounded-lg">
            <h4 className="font-medium mb-3">TimeInput</h4>
            <ul className="text-sm space-y-1 text-foreground-muted">
              <li><kbd className="px-1.5 py-0.5 bg-background-muted rounded text-xs">Up</kbd> / <kbd className="px-1.5 py-0.5 bg-background-muted rounded text-xs">Down</kbd> - Increment/decrement hours (cursor in hours) or minutes (cursor in minutes)</li>
            </ul>
          </div>
          <div className="p-4 bg-background-subtle rounded-lg">
            <h4 className="font-medium mb-3">TimeSpinner</h4>
            <ul className="text-sm space-y-1 text-foreground-muted">
              <li><kbd className="px-1.5 py-0.5 bg-background-muted rounded text-xs">Tab</kbd> - Move focus between spinners</li>
              <li><kbd className="px-1.5 py-0.5 bg-background-muted rounded text-xs">Up</kbd> / <kbd className="px-1.5 py-0.5 bg-background-muted rounded text-xs">Down</kbd> - Increment/decrement focused value</li>
            </ul>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 11. ERROR & VALIDATION STATES */}
      {/* ============================================ */}
      <ComponentCard
        id="validation"
        title="Error & Validation States"
        description="Visual feedback for form validation"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Warning className="text-foreground-error" weight="fill" />
              Error with Message
            </Label>
            <TimePicker
              error
              errorMessage="Please select a valid time within business hours"
              placeholder="Select time"
            />
          </div>
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <CheckCircle className="text-foreground-success" weight="fill" />
              Success State
            </Label>
            <TimePicker
              value={new Date(2024, 0, 1, 10, 30)}
              success
              placeholder="Select time"
            />
          </div>
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Warning className="text-foreground-error" weight="fill" />
              TimeInput Error
            </Label>
            <TimeInput
              error
              errorMessage="Invalid time format"
              placeholder="hh:mm AM"
            />
          </div>
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <CheckCircle className="text-foreground-success" weight="fill" />
              TimeInput Success
            </Label>
            <TimeInput
              value={new Date(2024, 0, 1, 14, 0)}
              success
              placeholder="hh:mm AM"
            />
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 12. PROPS TABLE */}
      {/* ============================================ */}
      <ComponentCard id="props" title="Props Reference">
        <div className="space-y-8">
          <div>
            <h4 className="text-body-strong mb-4">TimePicker Props</h4>
            <PropsTable props={timePickerProps} />
          </div>
          <div>
            <h4 className="text-body-strong mb-4">TimeInput Props</h4>
            <PropsTable props={timeInputProps} />
          </div>
          <div>
            <h4 className="text-body-strong mb-4">TimeSpinner Props</h4>
            <PropsTable props={timeSpinnerProps} />
          </div>
          <div>
            <h4 className="text-body-strong mb-4">DateTimePicker Props</h4>
            <PropsTable props={dateTimePickerProps} />
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 13. USAGE GUIDELINES */}
      {/* ============================================ */}
      <div id="guidelines">
        <h2 className="text-heading-sm text-foreground mb-4">
          Usage Guidelines
        </h2>
        <UsageGuide
          dos={[
            "Use 15 or 30-minute steps for scheduling to reduce cognitive load",
            "Match time format (12h/24h) to user's locale preferences",
            "Set minTime/maxTime to prevent invalid selections (e.g., past times)",
            "Use DateTimePicker when both date and time are needed together",
            "Provide clear labels like 'Interview Start Time' not just 'Time'",
            "Show timezone context when scheduling across regions",
            "Use TimeInput for power users who prefer typing",
            "Use error/success states to provide validation feedback",
          ]}
          donts={[
            "Don't allow past times for future events",
            "Don't use 1-minute steps unless second-level precision is needed",
            "Don't forget timezone considerations for remote interviews",
            "Don't use separate Date and Time pickers when both are required",
            "Don't hide the AM/PM indicator in 12-hour format",
            "Don't allow times outside business hours for interview scheduling",
            "Don't show loading state indefinitely - provide timeout feedback",
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 14. ACCESSIBILITY */}
      {/* ============================================ */}
      <div id="accessibility">
        <AccessibilityInfo
          items={[
            "**Keyboard navigation**: Full keyboard support - Tab to focus, Arrow keys to navigate/adjust, Enter to confirm, Escape to close",
            "**ARIA labels**: Uses aria-label for trigger button, aria-expanded for open state, aria-haspopup for dropdown indication",
            "**aria-invalid**: Set to 'true' when error prop is true, linked to error message via aria-describedby",
            "**role='listbox'**: Time dropdown uses listbox pattern with role='option' for each time slot",
            "**role='spinbutton'**: TimeSpinner values use spinbutton pattern with aria-valuemin, aria-valuemax, aria-valuenow",
            "**Focus management**: Focus moves logically between hour, minute, seconds, and AM/PM controls",
            "**Error announcements**: Error messages use role='alert' for immediate screen reader announcement",
            "**Color contrast**: All states meet WCAG AA standards (4.5:1 ratio)",
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 15. RELATED COMPONENTS */}
      {/* ============================================ */}
      <div id="related">
        <RelatedComponents
          components={[
            {
              name: "Date Picker",
              href: "/design-system/components/date-picker",
              description: "For date-only selection",
            },
            {
              name: "Calendar",
              href: "/design-system/components/calendar",
              description: "For visual date navigation",
            },
            {
              name: "Scheduler",
              href: "/design-system/components/scheduler",
              description: "For full calendar scheduling",
            },
            {
              name: "Input",
              href: "/design-system/components/input",
              description: "For general text input",
            },
            {
              name: "Select",
              href: "/design-system/components/select",
              description: "For predefined time slot selection",
            },
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 16. REAL-WORLD EXAMPLES */}
      {/* ============================================ */}
      <div id="examples" className="space-y-6">
        <h2 className="text-heading-sm text-foreground">
          Real-World Examples
        </h2>

        <RealWorldExample
          title="Interview Scheduling"
          description="Scheduling a candidate interview within business hours"
        >
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <VideoCamera size={20} className="text-foreground-brand" />
                <span className="font-medium text-foreground">Schedule Video Interview</span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Interview Date & Time</Label>
                  <DateTimePicker
                    value={dateTime}
                    onChange={setDateTime}
                    placeholder="Select date and time"
                    minuteStep={30}
                    minDate={new Date()}
                    minTime={businessStart}
                    maxTime={businessEnd}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <div className="flex items-center gap-2">
                    <TimePicker
                      value={interviewTime}
                      onChange={setInterviewTime}
                      minuteStep={15}
                      format="12h"
                      placeholder="End time"
                    />
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <Button variant="primary">
                  Send Interview Invite
                </Button>
              </div>
            </CardContent>
          </Card>
        </RealWorldExample>

        <RealWorldExample
          title="Office Hours Configuration"
          description="Setting business hours for a company profile"
        >
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={20} className="text-foreground-brand" />
                <span className="font-medium text-foreground">Business Hours</span>
              </div>
              <div className="space-y-4">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                  <div key={day} className="flex items-center gap-4">
                    <span className="w-24 text-sm text-foreground">{day}</span>
                    <TimeInput
                      defaultValue={new Date(2024, 0, 1, 9, 0)}
                      format="12h"
                      placeholder="Start"
                    />
                    <span className="text-foreground-muted">to</span>
                    <TimeInput
                      defaultValue={new Date(2024, 0, 1, 17, 0)}
                      format="12h"
                      placeholder="End"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </RealWorldExample>

        <RealWorldExample
          title="Phone Screen Quick Schedule"
          description="Rapid time selection for phone interviews"
        >
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-background-brand-subtle rounded-full flex items-center justify-center">
                  <Phone size={20} className="text-foreground-brand" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Phone Screen with Jane Doe</p>
                  <p className="text-caption text-foreground-muted">Solar Installation Lead</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Select Time Slot (30-minute increments)</Label>
                <TimePicker
                  minuteStep={30}
                  minTime={businessStart}
                  maxTime={businessEnd}
                  format="12h"
                  placeholder="Select available time"
                />
              </div>
              <p className="text-caption text-foreground-muted">
                Available times are within business hours (9 AM - 5 PM)
              </p>
            </CardContent>
          </Card>
        </RealWorldExample>

        <RealWorldExample
          title="Application Deadline"
          description="Setting a specific deadline for job applications"
        >
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Calendar size={20} className="text-foreground-brand" />
                <span className="font-medium text-foreground">Application Deadline</span>
              </div>
              <div className="space-y-2">
                <Label>Applications close on</Label>
                <DateTimePicker
                  value={dateTime}
                  onChange={setDateTime}
                  placeholder="Select deadline"
                  minuteStep={15}
                  minDate={new Date()}
                />
              </div>
              <p className="text-caption text-foreground-muted">
                Candidates will not be able to apply after this date and time.
              </p>
            </CardContent>
          </Card>
        </RealWorldExample>
      </div>

      {/* Page Navigation */}
      <PageNavigation currentPath="/design-system/components/time-picker" />
    </div>
  );
}
