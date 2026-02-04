"use client";

import React from "react";
import { AvailabilityCalendar } from "@/components/ui";
import {
  ComponentCard,
  UsageGuide,
  AccessibilityInfo,
} from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";
import { setHours, setMinutes, startOfDay } from "date-fns";
import type { Attendee, InterviewTimeSlot } from "@/lib/scheduling";

/* ============================================
   Mock Data
   ============================================ */

const today = startOfDay(new Date());

const mockAttendees: Attendee[] = [
  {
    id: "att-1",
    name: "Sarah Chen",
    email: "sarah@greenjobsboard.us",
    role: "interviewer",
    calendarStatus: "loaded",
    availability: [
      {
        start: setMinutes(setHours(today, 10), 0),
        end: setMinutes(setHours(today, 11), 0),
        status: "busy",
        title: "Team Standup",
        responseStatus: "accepted",
      },
      {
        start: setMinutes(setHours(today, 14), 0),
        end: setMinutes(setHours(today, 15), 30),
        status: "busy",
        title: "Design Review",
        responseStatus: "accepted",
      },
    ],
  },
  {
    id: "att-2",
    name: "Marcus Rivera",
    email: "marcus@greenjobsboard.us",
    role: "hiring-manager",
    calendarStatus: "loaded",
    availability: [
      {
        start: setMinutes(setHours(today, 9), 30),
        end: setMinutes(setHours(today, 10), 30),
        status: "busy",
        title: "1:1 with Director",
        responseStatus: "accepted",
      },
      {
        start: setMinutes(setHours(today, 13), 0),
        end: setMinutes(setHours(today, 14), 0),
        status: "tentative",
        title: "Optional Sync",
        responseStatus: "tentative",
      },
    ],
  },
];

/* ============================================
   Props Documentation
   ============================================ */

const availabilityCalendarProps = [
  {
    name: "selectedDate",
    type: "Date",
    required: true,
    description:
      "The currently selected date. Controls which week is displayed in the calendar view.",
  },
  {
    name: "onDateChange",
    type: "(date: Date) => void",
    required: true,
    description:
      "Callback fired when the selected date changes, e.g. via week navigation or the Today button.",
  },
  {
    name: "attendees",
    type: "Attendee[]",
    required: true,
    description:
      "Array of attendees whose availability is overlaid on the calendar. Each attendee has a unique color and their busy blocks are rendered as event cards.",
  },
  {
    name: "selectedSlots",
    type: "InterviewTimeSlot[]",
    required: true,
    description:
      "Currently selected interview time slots. Rendered as draggable blue cards on the calendar grid.",
  },
  {
    name: "onSlotSelect",
    type: "(slot: InterviewTimeSlot) => void",
    required: true,
    description:
      "Callback fired when the user clicks an available time on the grid to add a new slot.",
  },
  {
    name: "onSlotRemove",
    type: "(slotId: string) => void",
    required: true,
    description: "Callback fired when the user removes a selected slot via the remove button.",
  },
  {
    name: "onSlotUpdate",
    type: "(slotId: string, newStart: Date, newEnd: Date) => void",
    default: "undefined",
    description:
      "Callback fired when a slot is drag-and-dropped to a new position. Required for drag-and-drop to function.",
  },
  {
    name: "maxSlots",
    type: "number",
    default: "5",
    description:
      'Maximum number of slots that can be selected. A hover preview shows "Max slots reached" when the limit is hit.',
  },
  {
    name: "duration",
    type: "number",
    required: true,
    description:
      "Duration of each interview slot in minutes. Controls the height of slot cards and hover previews.",
  },
  {
    name: "startHour",
    type: "number",
    default: "9",
    description: "First hour displayed on the time axis (0-23). Defaults to 9 AM.",
  },
  {
    name: "endHour",
    type: "number",
    default: "18",
    description: "Last hour displayed on the time axis (0-23). Defaults to 6 PM.",
  },
  {
    name: "showAttendeeCalendars",
    type: "boolean",
    default: "false",
    description:
      "Whether attendee calendar overlays are visible. Controls the visibility of busy-block event cards.",
  },
  {
    name: "onToggleAttendeeCalendars",
    type: "(show: boolean) => void",
    default: "undefined",
    description: "Callback fired when the attendee calendar overlay toggle changes.",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Additional CSS classes applied to the root container.",
  },
];

const attendeeTypeProps = [
  {
    name: "id",
    type: "string",
    required: true,
    description: "Unique identifier for the attendee.",
  },
  {
    name: "name",
    type: "string",
    required: true,
    description: "Display name shown in legend chips and event cards.",
  },
  {
    name: "email",
    type: "string",
    required: true,
    description: "Email address of the attendee.",
  },
  {
    name: "role",
    type: '"candidate" | "interviewer" | "hiring-manager" | "recruiter"',
    required: true,
    description: "Role of the attendee in the interview process.",
  },
  {
    name: "availability",
    type: "AttendeeAvailability[]",
    default: "undefined",
    description: "Array of busy/tentative blocks from the attendee's calendar.",
  },
  {
    name: "calendarStatus",
    type: '"loading" | "loaded" | "error"',
    default: "undefined",
    description: "Status of the calendar data fetch for this attendee.",
  },
];

const timeSlotTypeProps = [
  {
    name: "id",
    type: "string",
    required: true,
    description: "Unique identifier for the time slot.",
  },
  {
    name: "start",
    type: "Date",
    required: true,
    description: "Start time of the interview slot.",
  },
  {
    name: "end",
    type: "Date",
    required: true,
    description: "End time of the interview slot.",
  },
];

/* ============================================
   Feature List Item
   ============================================ */

function FeatureItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-[var(--border-muted)] p-4">
      <h4 className="text-caption-strong text-[var(--foreground-default)]">{title}</h4>
      <p className="mt-1 text-caption text-[var(--foreground-muted)]">{description}</p>
    </div>
  );
}

/* ============================================
   Page Component
   ============================================ */

export default function AvailabilityCalendarPage() {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [selectedSlots, setSelectedSlots] = React.useState<InterviewTimeSlot[]>([]);

  const handleSlotSelect = (slot: InterviewTimeSlot) => {
    setSelectedSlots((prev) => [...prev, slot]);
  };

  const handleSlotRemove = (slotId: string) => {
    setSelectedSlots((prev) => prev.filter((s) => s.id !== slotId));
  };

  const handleSlotUpdate = (slotId: string, newStart: Date, newEnd: Date) => {
    setSelectedSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, start: newStart, end: newEnd } : s))
    );
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="mb-2 text-heading-lg text-foreground">
          Availability Calendar
        </h1>
        <p className="max-w-2xl text-body text-foreground-muted">
          A weekly calendar view for coordinating interview times across multiple attendees.
          Displays attendee availability as color-coded overlays and lets users click to propose
          time slots, which can then be dragged to reposition. Used in the &quot;Find a Time&quot;
          tab of the interview scheduling modal.
        </p>
      </div>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Interactive calendar with mock attendee data. Click an open slot to add an interview time, drag to reposition, and click the remove button to delete."
      >
        <CodePreview
          code={`import { AvailabilityCalendar } from "@/components/ui";
import type { Attendee, InterviewTimeSlot } from "@/lib/scheduling";

const [selectedDate, setSelectedDate] = useState(new Date());
const [selectedSlots, setSelectedSlots] = useState<InterviewTimeSlot[]>([]);

<AvailabilityCalendar
  selectedDate={selectedDate}
  onDateChange={setSelectedDate}
  attendees={attendees}
  selectedSlots={selectedSlots}
  onSlotSelect={(slot) => setSelectedSlots((prev) => [...prev, slot])}
  onSlotRemove={(id) => setSelectedSlots((prev) => prev.filter((s) => s.id !== id))}
  onSlotUpdate={(id, start, end) =>
    setSelectedSlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, start, end } : s))
    )
  }
  duration={45}
  maxSlots={3}
/>`}
        >
          <div className="h-[500px] overflow-hidden rounded-lg border border-[var(--border-muted)]">
            <AvailabilityCalendar
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              attendees={mockAttendees}
              selectedSlots={selectedSlots}
              onSlotSelect={handleSlotSelect}
              onSlotRemove={handleSlotRemove}
              onSlotUpdate={handleSlotUpdate}
              duration={45}
              maxSlots={3}
            />
          </div>
          {selectedSlots.length > 0 && (
            <p className="mt-3 text-caption text-foreground-muted">
              {selectedSlots.length} slot{selectedSlots.length !== 1 ? "s" : ""} selected
            </p>
          )}
        </CodePreview>
      </ComponentCard>

      {/* Features */}
      <ComponentCard
        id="features"
        title="Features"
        description="Key capabilities of the AvailabilityCalendar"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FeatureItem
            title="Attendee Availability Overlays"
            description="Each attendee's busy and tentative blocks are shown as color-coded event cards with per-attendee legend chips."
          />
          <FeatureItem
            title="Drag-and-Drop Slot Repositioning"
            description="Selected interview slots can be dragged to a new time or day. Uses dnd-kit with 15-minute snap intervals."
          />
          <FeatureItem
            title="Click-to-Add Slots"
            description="Click any open area on the grid to propose an interview slot. Past times and fully-busy ranges are blocked automatically."
          />
          <FeatureItem
            title="5-Day / 7-Day Toggle"
            description="Switch between a weekday-only view (Mon-Fri) and a full-week view (Sun-Sat) via a toggle in the header."
          />
          <FeatureItem
            title="Hover Previews"
            description="Moving the cursor over the grid shows a live preview of where the slot would land, with conflict warnings for partial availability."
          />
          <FeatureItem
            title="Week Navigation"
            description="Navigate between weeks with previous/next arrows and jump to today with the calendar button. Timezone label is shown automatically."
          />
        </div>
      </ComponentCard>

      {/* Props Table - AvailabilityCalendarProps */}
      <ComponentCard id="props" title="Props" description="AvailabilityCalendarProps">
        <PropsTable props={availabilityCalendarProps} />
      </ComponentCard>

      {/* Attendee Type */}
      <ComponentCard
        id="attendee-type"
        title="Attendee Type"
        description="Shape of each item in the attendees array"
      >
        <PropsTable props={attendeeTypeProps} />
      </ComponentCard>

      {/* InterviewTimeSlot Type */}
      <ComponentCard
        id="timeslot-type"
        title="InterviewTimeSlot Type"
        description="Shape of each item in the selectedSlots array"
      >
        <PropsTable props={timeSlotTypeProps} />
      </ComponentCard>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Use inside a scheduling modal or dedicated scheduling page",
          "Provide onSlotUpdate if you want drag-and-drop repositioning",
          "Set maxSlots to limit how many time options a recruiter can propose",
          "Pass attendee availability data from calendar API integrations",
          "Show a loading skeleton while attendee calendar data is being fetched",
        ]}
        donts={[
          "Don't use for general-purpose calendar display - use Scheduler or RecruiterCalendar instead",
          "Don't omit the duration prop - slot height depends on it",
          "Don't set startHour and endHour to the same value",
          "Don't use without at least one attendee - the calendar is designed for multi-party coordination",
        ]}
      />

      {/* Accessibility */}
      <AccessibilityInfo
        items={[
          "**Keyboard**: Week navigation arrows and the Today button are keyboard-focusable and can be activated with Enter or Space.",
          '**ARIA labels**: Navigation buttons include aria-label attributes ("Previous week", "Next week", "Go to today").',
          "**Drag-and-drop**: Uses dnd-kit which provides built-in keyboard support for drag operations via the PointerSensor.",
          "**Color coding**: Attendee legend chips include both a color dot and the attendee name, so color is not the only differentiator.",
          "**Timezone**: The local timezone is displayed in the header so users always know which timezone the times refer to.",
        ]}
      />

      {/* Related Components */}
      <ComponentCard
        id="related"
        title="Related Components"
        description="Components commonly used alongside the AvailabilityCalendar"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="/design-system/components/scheduler"
            className="rounded-lg border border-[var(--border-muted)] p-4 transition-colors hover:border-[var(--border-brand)]"
          >
            <p className="font-medium text-[var(--foreground-default)]">Scheduler</p>
            <p className="text-caption text-[var(--foreground-muted)]">
              Full calendar for managing interview events
            </p>
          </a>
          <a
            href="/design-system/components/calendar"
            className="rounded-lg border border-[var(--border-muted)] p-4 transition-colors hover:border-[var(--border-brand)]"
          >
            <p className="font-medium text-[var(--foreground-default)]">Calendar</p>
            <p className="text-caption text-[var(--foreground-muted)]">
              Date picker for single, multiple, or range selection
            </p>
          </a>
          <a
            href="/design-system/components/time-picker"
            className="rounded-lg border border-[var(--border-muted)] p-4 transition-colors hover:border-[var(--border-brand)]"
          >
            <p className="font-medium text-[var(--foreground-default)]">TimePicker</p>
            <p className="text-caption text-[var(--foreground-muted)]">
              Time selection for standalone time input
            </p>
          </a>
        </div>
      </ComponentCard>

      <PageNavigation currentPath="/design-system/components/availability-calendar" />
    </div>
  );
}
