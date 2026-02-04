"use client";

import React from "react";
import { TimeSlotChip, Label } from "@/components/ui";
import {
  ComponentCard,
  UsageGuide,
  AccessibilityInfo,
} from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";

/* ============================================
   SAMPLE DATA
   ============================================ */

function createSlot(
  id: string,
  startHour: number,
  startMinute: number,
  endHour: number,
  endMinute: number,
  dayOffset = 0
) {
  const start = new Date(2026, 1, 10 + dayOffset, startHour, startMinute);
  const end = new Date(2026, 1, 10 + dayOffset, endHour, endMinute);
  return { id, start, end };
}

const sampleSlots = [
  createSlot("slot-1", 9, 0, 9, 30),
  createSlot("slot-2", 10, 0, 10, 45),
  createSlot("slot-3", 14, 0, 15, 0),
  createSlot("slot-4", 11, 0, 11, 30, 1),
  createSlot("slot-5", 16, 0, 17, 0, 2),
];

/* ============================================
   PROPS DOCUMENTATION
   ============================================ */

const timeSlotChipProps = [
  {
    name: "slot",
    type: "TimeSlot",
    required: true,
    description: "The time slot object containing id (string), start (Date), and end (Date)",
  },
  {
    name: "onRemove",
    type: "() => void",
    default: "undefined",
    description:
      "Called when the remove button is clicked. When provided, an X button is rendered.",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Additional CSS classes to merge onto the root element",
  },
];

const timeSlotTypeProps = [
  {
    name: "id",
    type: "string",
    required: true,
    description: "Unique identifier for the time slot",
  },
  {
    name: "start",
    type: "Date",
    required: true,
    description: "Start time of the slot",
  },
  {
    name: "end",
    type: "Date",
    required: true,
    description: "End time of the slot",
  },
];

/* ============================================
   PAGE COMPONENT
   ============================================ */

export default function TimeSlotChipPage() {
  const [slots, setSlots] = React.useState(sampleSlots.slice(0, 3));

  const removeSlot = (id: string) => {
    setSlots((prev) => prev.filter((s) => s.id !== id));
  };

  const resetSlots = () => {
    setSlots(sampleSlots.slice(0, 3));
  };

  return (
    <div className="space-y-12">
      {/* ============================================
          OVERVIEW
          ============================================ */}
      <div>
        <h1 id="overview" className="mb-2 text-heading-lg text-foreground">
          Time Slot Chip
        </h1>
        <p className="mb-6 max-w-2xl text-body text-foreground-muted">
          A compact chip that displays a date and time range for an interview or meeting slot. Used
          within the scheduling workflow to show selected availability windows. Each chip renders
          the day, date, and time span with an optional remove button.
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-[var(--background-subtle)] p-4">
            <h3 className="mb-2 font-semibold text-foreground">When to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>Displaying selected interview time slots in a scheduling modal</li>
              <li>Showing proposed times in a calendar-based booking flow</li>
              <li>Listing confirmed or pending meeting windows</li>
            </ul>
          </div>
          <div className="rounded-lg bg-[var(--background-subtle)] p-4">
            <h3 className="mb-2 font-semibold text-foreground">When not to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>For generic tags or labels (use Chip or InfoTag instead)</li>
              <li>For full calendar event display (use a calendar component)</li>
              <li>For date-only display without time ranges</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ============================================
          BASIC USAGE
          ============================================ */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Display a single time slot chip with a date and time range"
      >
        <CodePreview
          code={`import { TimeSlotChip } from "@/components/ui";

const slot = {
  id: "slot-1",
  start: new Date(2026, 1, 10, 9, 0),
  end: new Date(2026, 1, 10, 9, 30),
};

<TimeSlotChip slot={slot} />`}
        >
          <TimeSlotChip slot={sampleSlots[0]} />
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          VARIANTS
          ============================================ */}
      <ComponentCard
        id="variants"
        title="Variants"
        description="With and without the remove button, and with different time ranges"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="block text-caption">Without remove button (read-only)</Label>
            <div className="flex flex-wrap gap-2">
              <TimeSlotChip slot={sampleSlots[0]} />
              <TimeSlotChip slot={sampleSlots[1]} />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="block text-caption">With remove button</Label>
            <div className="flex flex-wrap gap-2">
              <TimeSlotChip slot={sampleSlots[0]} onRemove={() => {}} />
              <TimeSlotChip slot={sampleSlots[1]} onRemove={() => {}} />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="block text-caption">Different durations</Label>
            <div className="flex flex-wrap gap-2">
              <TimeSlotChip slot={createSlot("d-1", 9, 0, 9, 30)} />
              <TimeSlotChip slot={createSlot("d-2", 10, 0, 10, 45)} />
              <TimeSlotChip slot={createSlot("d-3", 14, 0, 15, 0)} />
              <TimeSlotChip slot={createSlot("d-4", 16, 0, 17, 30)} />
            </div>
            <p className="text-caption text-foreground-muted">
              30 min, 45 min, 1 hour, and 1.5 hour slots
            </p>
          </div>

          <div className="space-y-2">
            <Label className="block text-caption">Multiple days</Label>
            <div className="flex flex-wrap gap-2">
              {sampleSlots.map((slot) => (
                <TimeSlotChip key={slot.id} slot={slot} />
              ))}
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================
          INTERACTIVE EXAMPLE
          ============================================ */}
      <ComponentCard
        id="interactive"
        title="Interactive Example"
        description="Removable time slots that respond to user interaction"
      >
        <CodePreview
          code={`const [slots, setSlots] = React.useState(initialSlots);

const removeSlot = (id: string) => {
  setSlots(prev => prev.filter(s => s.id !== id));
};

<div className="flex flex-wrap gap-2">
  {slots.map((slot) => (
    <TimeSlotChip
      key={slot.id}
      slot={slot}
      onRemove={() => removeSlot(slot.id)}
    />
  ))}
</div>`}
        >
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {slots.map((slot) => (
                <TimeSlotChip key={slot.id} slot={slot} onRemove={() => removeSlot(slot.id)} />
              ))}
              {slots.length === 0 && (
                <p className="text-caption text-foreground-muted">All slots removed.</p>
              )}
            </div>
            {slots.length < 3 && (
              <button
                type="button"
                onClick={resetSlots}
                className="text-caption text-[var(--foreground-link)] hover:underline"
              >
                Reset slots
              </button>
            )}
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          PROPS TABLE
          ============================================ */}
      <ComponentCard id="props" title="TimeSlotChip Props">
        <PropsTable props={timeSlotChipProps} />
      </ComponentCard>

      <ComponentCard
        id="timeslot-type"
        title="TimeSlot Type (InterviewTimeSlot)"
        description="The shape of the slot object passed to the component"
      >
        <PropsTable props={timeSlotTypeProps} />
      </ComponentCard>

      {/* ============================================
          USAGE GUIDELINES
          ============================================ */}
      <UsageGuide
        dos={[
          "Use within scheduling flows to display selected time windows",
          "Provide the onRemove callback when users should be able to deselect a slot",
          "Display multiple chips in a flex-wrap container so they reflow gracefully",
          "Pair with an AvailabilityCalendar or date picker for selecting slots",
        ]}
        donts={[
          "Don't use for generic tags or labels -- use Chip or InfoTag instead",
          "Don't manually format the time string -- the component handles formatting via date-fns",
          "Don't render an excessive number of chips without scrolling or pagination",
          "Don't use without a valid Date object in start/end fields",
        ]}
      />

      {/* ============================================
          ACCESSIBILITY
          ============================================ */}
      <AccessibilityInfo
        items={[
          "**Keyboard**: The remove button is focusable via Tab and activates with Enter or Space",
          '**ARIA label**: The remove button uses `aria-label="Remove time slot"` for screen reader context',
          "**Touch target**: The remove button has a minimum 24x24px hit area for touch accessibility",
          "**Color contrast**: White text on the blue background meets WCAG AA contrast requirements",
          "**Screen readers**: The date and time text is readable as plain content without requiring visual interpretation",
        ]}
      />

      {/* ============================================
          RELATED COMPONENTS
          ============================================ */}
      <ComponentCard
        id="related"
        title="Related Components"
        description="Components commonly used alongside TimeSlotChip"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <a
            href="/design-system/components/availability-calendar"
            className="rounded-lg border border-[var(--border-muted)] p-4 transition-colors hover:border-[var(--border-brand)]"
          >
            <p className="font-medium text-foreground">AvailabilityCalendar</p>
            <p className="text-caption text-foreground-muted">
              Calendar view for selecting available time slots
            </p>
          </a>
          <a
            href="/design-system/components/interview-scheduling-modal"
            className="rounded-lg border border-[var(--border-muted)] p-4 transition-colors hover:border-[var(--border-brand)]"
          >
            <p className="font-medium text-foreground">InterviewSchedulingModal</p>
            <p className="text-caption text-foreground-muted">
              Full scheduling modal that uses TimeSlotChip for selected times
            </p>
          </a>
          <a
            href="/design-system/components/chip"
            className="rounded-lg border border-[var(--border-muted)] p-4 transition-colors hover:border-[var(--border-brand)]"
          >
            <p className="font-medium text-foreground">Chip</p>
            <p className="text-caption text-foreground-muted">
              Generic chip for tags, filters, and selections
            </p>
          </a>
        </div>
      </ComponentCard>

      <PageNavigation currentPath="/design-system/components/time-slot-chip" />
    </div>
  );
}
