"use client";

import React from "react";
import {
  ComponentCard,
  ComponentAnatomy,
  UsageGuide,
  AccessibilityInfo,
  RelatedComponents,
} from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  Clock,
  VideoCamera,
  Sparkle,
  ArrowRight,
  Note,
} from "@phosphor-icons/react";

/* ============================================
   Props Documentation
   ============================================ */
const modalProps = [
  {
    name: "open",
    type: "boolean",
    required: true,
    description: "Controls whether the modal is visible. The modal renders nothing when false.",
  },
  {
    name: "onOpenChange",
    type: "(open: boolean) => void",
    required: true,
    description:
      "Callback fired when the modal should open or close (backdrop click, close button, Escape key).",
  },
  {
    name: "candidate",
    type: "{ id: string; name: string; email: string; avatar?: string; timezone?: string }",
    required: true,
    description:
      "The candidate being scheduled. Automatically added as a non-removable attendee with the 'candidate' role.",
  },
  {
    name: "job",
    type: "{ id: string; title: string }",
    description:
      "The job the interview is for. Used to auto-populate the event title (e.g. 'Product Manager Interview').",
  },
  {
    name: "initialAttendees",
    type: "Attendee[]",
    default: "[]",
    description:
      "Pre-populated attendees beyond the candidate (e.g. the hiring manager). Each attendee's calendar availability is loaded automatically.",
  },
  {
    name: "defaults",
    type: '{ duration?: number; videoProvider?: "google-meet" | "zoom" | "microsoft-teams" | "none"; workingHoursStart?: number; workingHoursEnd?: number }',
    default: "{}",
    description:
      "Default form values. Duration is in minutes (defaults to 60). Video provider defaults to 'google-meet'.",
  },
  {
    name: "onSchedule",
    type: "(data: SchedulePayload) => void",
    description:
      "Callback fired when the recruiter confirms scheduling. Receives the full payload: title, attendees, timeSlots, duration, videoProvider, instructions, internalNotes, and calendarId.",
  },
  {
    name: "onPreview",
    type: "(data: unknown) => void",
    description:
      "Callback for the 'Preview & Send' action. Allows displaying a preview of the email before sending.",
  },
  {
    name: "onSuggestTimes",
    type: "() => Promise<InterviewTimeSlot[]>",
    description:
      "Async callback for AI-powered time suggestions. When provided, shows a 'Suggest available times' button. Must return an array of time slots.",
  },
  {
    name: "teamMembers",
    type: "Attendee[]",
    default: "[]",
    description: "List of team members available to add as attendees via the AddAttendeePopover.",
  },
  {
    name: "calendars",
    type: "{ id: string; name: string; email: string }[]",
    default: "[]",
    description:
      "Available calendars for the recruiter to add the event to. When provided, shows a calendar selector row in the form.",
  },
  {
    name: "myCalendarEvents",
    type: "RecruiterEvent[]",
    default: "[]",
    description:
      "The recruiter's own calendar events for overlay display in the 'Find a Time' view and for the 'Your Calendar' tab.",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes applied to the modal container.",
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
    description: "Display name.",
  },
  {
    name: "email",
    type: "string",
    required: true,
    description: "Email address.",
  },
  {
    name: "avatar",
    type: "string",
    description: "URL to the attendee's avatar image.",
  },
  {
    name: "role",
    type: '"candidate" | "interviewer" | "hiring-manager" | "recruiter"',
    required: true,
    description: "The attendee's role. Candidates cannot be removed from the attendee list.",
  },
  {
    name: "timezone",
    type: "string",
    description: "IANA timezone identifier (e.g. 'America/New_York').",
  },
  {
    name: "calendarStatus",
    type: '"loading" | "loaded" | "error"',
    description:
      "Calendar data loading state. Shown as a spinner or error indicator on the AttendeeChip.",
  },
  {
    name: "availability",
    type: "AttendeeAvailability[]",
    description:
      "Array of free/busy time blocks used to display availability in the calendar grid.",
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
    description: "Start time of the proposed slot.",
  },
  {
    name: "end",
    type: "Date",
    required: true,
    description: "End time of the proposed slot.",
  },
];

const recruiterEventTypeProps = [
  {
    name: "id",
    type: "string",
    required: true,
    description: "Unique identifier for the event.",
  },
  {
    name: "title",
    type: "string",
    required: true,
    description: "Event title displayed in the calendar overlay.",
  },
  {
    name: "start",
    type: "Date",
    required: true,
    description: "Event start time.",
  },
  {
    name: "end",
    type: "Date",
    required: true,
    description: "Event end time.",
  },
  {
    name: "type",
    type: '"meeting" | "focus" | "interview" | "other"',
    description: "Event category used for color coding.",
  },
  {
    name: "color",
    type: "string",
    description: "Custom color override for the event block.",
  },
];

export default function InterviewSchedulingModalPage() {
  return (
    <div className="space-y-12">
      {/* ============================================
          SECTION 1: OVERVIEW
          ============================================ */}
      <div>
        <h1 id="overview" className="mb-2 text-heading-lg text-foreground">
          InterviewSchedulingModal
        </h1>
        <p className="mb-4 max-w-2xl text-body text-foreground-muted">
          A full-screen orchestrator modal for scheduling interviews with candidates. It composes
          many smaller design system components into a two-panel layout: a form sidebar on the left
          and a calendar view on the right.
        </p>

        <div className="mb-6 flex flex-wrap gap-2">
          <Badge variant="info">Orchestrator</Badge>
          <Badge variant="neutral">Two-Panel Layout</Badge>
          <Badge variant="warning">AI-Assisted</Badge>
        </div>

        {/* When to Use / When Not to Use */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="bg-background-success/10 rounded-lg border border-border-success p-4">
            <h3 className="mb-2 font-semibold text-foreground-success">When to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>Scheduling interviews from a candidate profile or pipeline</li>
              <li>Coordinating availability across multiple interviewers and the candidate</li>
              <li>Proposing multiple time options for a candidate to choose from</li>
              <li>Using AI suggestions to find optimal meeting times across calendars</li>
            </ul>
          </div>
          <div className="bg-background-error/10 rounded-lg border border-border-error p-4">
            <h3 className="mb-2 font-semibold text-foreground-error">When not to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>Simple date/time picking without attendees (use DateTimePicker)</li>
              <li>Read-only calendar views (use Scheduler or RecruiterCalendar)</li>
              <li>Self-service booking pages for candidates (use TimeSlotPicker)</li>
              <li>Quick one-click scheduling without availability checking</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ============================================
          SECTION 2: ARCHITECTURE
          ============================================ */}
      <ComponentAnatomy
        parts={[
          {
            name: "Modal Shell",
            description:
              "Full-screen overlay with backdrop. Fixed positioning with responsive margins. Contains the two-panel layout.",
            required: true,
          },
          {
            name: "Left Panel (Form Sidebar)",
            description:
              "340px fixed-width scrollable sidebar containing interview details, attendees, proposed times, candidate preview, instructions, and internal notes.",
            required: true,
          },
          {
            name: "Interview Details Section",
            description:
              "Editable title, duration selector (Select), video provider selector, and optional calendar picker.",
            required: true,
          },
          {
            name: "Attendees Section",
            description:
              "Renders AttendeeChip components for each participant. The candidate chip is always first and non-removable. Includes AddAttendeePopover for adding team members.",
            required: true,
          },
          {
            name: "Proposed Times Section",
            description:
              "Displays selected TimeSlotChip components (up to 5). Shows an empty state with a prompt to click slots in the calendar, plus an optional AI 'Suggest available times' button.",
            required: true,
          },
          {
            name: "CandidatePreviewCard",
            description:
              "Shows a preview of the scheduling email the candidate will receive, including proposed time slots and duration.",
          },
          {
            name: "Instructions & Internal Notes",
            description:
              "Optional textarea for candidate-visible instructions and a collapsible InternalNotesSection for recruiter-only notes.",
          },
          {
            name: "Footer Actions",
            description:
              "Fixed at the bottom of the left panel. Contains Cancel and 'Preview & Send' buttons. Submit is disabled until at least one time slot and one interviewer are selected.",
            required: true,
          },
          {
            name: "Right Panel (Calendar)",
            description:
              "Flexible-width area with a SegmentedController for switching between 'Find a Time' and 'Your Calendar' tabs.",
            required: true,
          },
          {
            name: "AvailabilityCalendar (Find a Time tab)",
            description:
              "Multi-attendee availability grid. Shows overlaid busy/free blocks for all attendees. Clicking free slots proposes times. Supports calendar overlay toggle and drag-to-update.",
          },
          {
            name: "YourCalendarView (Your Calendar tab)",
            description:
              "Displays the recruiter's own calendar events. Allows clicking free slots to propose times without attendee overlay.",
          },
          {
            name: "SuggestTimesButton",
            description:
              "AI-powered button in the calendar header. Calls onSuggestTimes and adds returned slots to the proposed times list.",
          },
          {
            name: "CalendarOverlayToggle",
            description:
              "Toggle in the Find a Time tab header to show/hide the recruiter's own calendar events overlaid on the availability grid.",
          },
        ]}
      />

      {/* ============================================
          SECTION 3: SUB-COMPONENTS
          ============================================ */}
      <ComponentCard
        id="sub-components"
        title="Sub-Components"
        description="The InterviewSchedulingModal is composed from these design system components. Each is independently importable and documented."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: "AvailabilityCalendar",
              icon: <Calendar size={18} />,
              desc: "Multi-attendee weekly availability grid with slot selection",
              href: "/design-system/components/availability-calendar",
            },
            {
              name: "AttendeeChip",
              icon: <Users size={18} />,
              desc: "Compact attendee display with role badge and remove action",
              href: "/design-system/components/attendee-chip",
            },
            {
              name: "TimeSlotChip",
              icon: <Clock size={18} />,
              desc: "Proposed time display with date, time range, and remove",
              href: "/design-system/components/time-slot-chip",
            },
            {
              name: "AddAttendeePopover",
              icon: <Users size={18} />,
              desc: "Searchable popover for adding team members as attendees",
              href: "/design-system/components/add-attendee-popover",
            },
            {
              name: "CandidatePreviewCard",
              icon: <ArrowRight size={18} />,
              desc: "Email preview showing what the candidate will receive",
              href: "/design-system/components/candidate-preview-card",
            },
            {
              name: "InternalNotesSection",
              icon: <Note size={18} />,
              desc: "Collapsible recruiter-only notes area",
              href: "/design-system/components/internal-notes-section",
            },
            {
              name: "SuggestTimesButton",
              icon: <Sparkle size={18} />,
              desc: "AI-powered button for suggesting available times",
              href: "/design-system/components/suggest-times-button",
            },
            {
              name: "CalendarOverlayToggle",
              icon: <VideoCamera size={18} />,
              desc: "Toggle to show/hide your calendar overlay in Find a Time",
              href: "/design-system/components/calendar-overlay-toggle",
            },
            {
              name: "SegmentedController",
              icon: <Calendar size={18} />,
              desc: "Tab switcher for Find a Time vs Your Calendar views",
              href: "/design-system/components/segmented-controller",
            },
          ].map((comp) => (
            <a
              key={comp.name}
              href={comp.href}
              className="group flex items-start gap-3 rounded-lg border border-border-muted p-4 transition-colors hover:border-border-brand"
            >
              <span className="mt-0.5 flex-shrink-0 text-foreground-muted transition-colors group-hover:text-foreground-brand">
                {comp.icon}
              </span>
              <div>
                <p className="font-medium text-foreground transition-colors group-hover:text-foreground-brand">
                  {comp.name}
                </p>
                <p className="mt-0.5 text-caption text-foreground-muted">{comp.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </ComponentCard>

      {/* ============================================
          SECTION 4: BASIC USAGE
          ============================================ */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Minimal controlled example. The modal is controlled via open / onOpenChange."
      >
        <CodePreview
          code={`import { useState } from "react";
import { InterviewSchedulingModal } from "@/components/ui";
import { Button } from "@/components/ui";

function ScheduleButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Schedule Interview
      </Button>

      <InterviewSchedulingModal
        open={open}
        onOpenChange={setOpen}
        candidate={{
          id: "c1",
          name: "Sarah Chen",
          email: "sarah@example.com",
          timezone: "America/Los_Angeles",
        }}
        job={{ id: "j1", title: "Senior Frontend Engineer" }}
        onSchedule={(data) => {
          console.log("Scheduled:", data);
          setOpen(false);
        }}
      />
    </>
  );
}`}
        >
          <div className="flex items-center justify-center rounded-lg bg-background-subtle p-12">
            <div className="text-center">
              <p className="mb-3 text-body text-foreground">
                The InterviewSchedulingModal renders as a full-screen overlay.
              </p>
              <p className="text-caption text-foreground-muted">
                Control it with{" "}
                <code className="rounded bg-background-muted px-1.5 py-0.5 font-mono text-caption-sm">
                  open
                </code>{" "}
                and{" "}
                <code className="rounded bg-background-muted px-1.5 py-0.5 font-mono text-caption-sm">
                  onOpenChange
                </code>{" "}
                props.
              </p>
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SECTION 5: WITH AI SUGGESTIONS
          ============================================ */}
      <ComponentCard
        id="ai-suggestions"
        title="With AI Time Suggestions"
        description="Pass onSuggestTimes to enable the AI-powered 'Suggest available times' button."
      >
        <CodePreview
          code={`import { InterviewSchedulingModal } from "@/components/ui";
import type { InterviewTimeSlot } from "@/components/ui/interview-scheduling-modal";

async function suggestTimes(): Promise<InterviewTimeSlot[]> {
  // Call your AI backend to find optimal meeting times
  const response = await fetch("/api/ai/suggest-times", {
    method: "POST",
    body: JSON.stringify({ attendeeIds: ["u1", "u2"] }),
  });
  return response.json();
}

<InterviewSchedulingModal
  open={open}
  onOpenChange={setOpen}
  candidate={candidate}
  job={job}
  onSuggestTimes={suggestTimes}
  onSchedule={handleSchedule}
  teamMembers={teamMembers}
  myCalendarEvents={myEvents}
/>`}
        >
          <div className="flex items-center justify-center rounded-lg bg-background-subtle p-12">
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primitive-yellow-100)]">
                <Sparkle size={20} weight="fill" className="text-[var(--primitive-yellow-700)]" />
              </div>
              <div>
                <p className="text-body text-foreground">
                  AI suggestions require the{" "}
                  <code className="rounded bg-background-muted px-1.5 py-0.5 font-mono text-caption-sm">
                    onSuggestTimes
                  </code>{" "}
                  callback.
                </p>
                <p className="mt-1 text-caption text-foreground-muted">
                  The button appears in both the Proposed Times empty state and the calendar header.
                </p>
              </div>
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SECTION 6: FULL EXAMPLE
          ============================================ */}
      <ComponentCard
        id="full-example"
        title="Full Configuration"
        description="Using all available props including team members, calendars, and recruiter events."
      >
        <CodePreview
          code={`import { InterviewSchedulingModal } from "@/components/ui";
import type {
  Attendee,
  RecruiterEvent,
} from "@/components/ui/interview-scheduling-modal";

const teamMembers: Attendee[] = [
  {
    id: "u1",
    name: "James Wilson",
    email: "james@company.com",
    role: "hiring-manager",
    timezone: "America/New_York",
  },
  {
    id: "u2",
    name: "Lisa Wang",
    email: "lisa@company.com",
    role: "interviewer",
    timezone: "America/Chicago",
  },
];

const myCalendarEvents: RecruiterEvent[] = [
  {
    id: "e1",
    title: "Team Standup",
    start: new Date("2026-02-03T09:00:00"),
    end: new Date("2026-02-03T09:30:00"),
    type: "meeting",
  },
];

const calendars = [
  { id: "cal1", name: "Work Calendar", email: "me@company.com" },
  { id: "cal2", name: "Interview Calendar", email: "interviews@company.com" },
];

<InterviewSchedulingModal
  open={open}
  onOpenChange={setOpen}
  candidate={{
    id: "c1",
    name: "Sarah Chen",
    email: "sarah@example.com",
    avatar: "/avatars/sarah.jpg",
    timezone: "America/Los_Angeles",
  }}
  job={{ id: "j1", title: "Senior Frontend Engineer" }}
  initialAttendees={[teamMembers[0]]}
  defaults={{
    duration: 45,
    videoProvider: "zoom",
  }}
  teamMembers={teamMembers}
  calendars={calendars}
  myCalendarEvents={myCalendarEvents}
  onSuggestTimes={suggestTimes}
  onSchedule={(data) => {
    // data includes: title, attendees, timeSlots, duration,
    // videoProvider, instructions, internalNotes, calendarId
    createInterview(data);
    setOpen(false);
  }}
  onPreview={(data) => {
    // Show email preview before sending
    openPreviewModal(data);
  }}
/>`}
        >
          <div className="rounded-lg bg-background-subtle p-8">
            <div className="mx-auto max-w-lg space-y-4">
              <h4 className="text-body-strong text-foreground">Full configuration includes:</h4>
              <ul className="space-y-2 text-caption text-foreground-muted">
                <li className="flex items-start gap-2">
                  <Users size={16} className="mt-0.5 flex-shrink-0 text-foreground-brand" />
                  <span>
                    <strong className="text-foreground">teamMembers</strong> -- populates the
                    AddAttendeePopover search list
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Calendar size={16} className="mt-0.5 flex-shrink-0 text-foreground-brand" />
                  <span>
                    <strong className="text-foreground">calendars</strong> -- shows a calendar
                    selector in interview details
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock size={16} className="mt-0.5 flex-shrink-0 text-foreground-brand" />
                  <span>
                    <strong className="text-foreground">myCalendarEvents</strong> -- overlay your
                    events on the availability grid
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkle size={16} className="mt-0.5 flex-shrink-0 text-foreground-brand" />
                  <span>
                    <strong className="text-foreground">onSuggestTimes</strong> -- enables
                    AI-powered time slot suggestions
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight size={16} className="mt-0.5 flex-shrink-0 text-foreground-brand" />
                  <span>
                    <strong className="text-foreground">onPreview</strong> -- enables the Preview &
                    Send workflow
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SECTION 7: DATA FLOW
          ============================================ */}
      <ComponentCard
        id="data-flow"
        title="Data Flow"
        description="How data moves through the modal during the scheduling workflow."
      >
        <div className="space-y-6 rounded-lg bg-background-subtle p-6">
          <div className="space-y-4">
            {[
              {
                step: "1",
                title: "Modal Opens",
                desc: "Candidate is added as a non-removable attendee. Form is initialized with defaults (duration, video provider, title from job).",
              },
              {
                step: "2",
                title: "Add Attendees",
                desc: "Recruiter adds interviewers via AddAttendeePopover. Each attendee's calendar availability loads asynchronously (calendarStatus transitions: loading -> loaded).",
              },
              {
                step: "3",
                title: "Find Available Times",
                desc: "The AvailabilityCalendar shows overlaid busy/free blocks. Recruiter clicks free slots to propose times, or uses AI suggestions.",
              },
              {
                step: "4",
                title: "Review Proposed Times",
                desc: "Selected TimeSlotChips appear in the left panel (max 5). CandidatePreviewCard shows what the candidate will see.",
              },
              {
                step: "5",
                title: "Preview & Send",
                desc: "Submit is enabled when >= 1 time slot + >= 2 attendees. onPreview fires for email preview, onSchedule fires for final confirmation.",
              },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-background-brand-subtle text-sm font-semibold text-foreground-brand">
                  {item.step}
                </div>
                <div>
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="mt-0.5 text-caption text-foreground-muted">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ComponentCard>

      {/* ============================================
          SECTION 8: PROPS TABLES
          ============================================ */}
      <div className="space-y-8">
        <ComponentCard id="props" title="Props">
          <div className="space-y-8">
            <div>
              <h4 className="mb-3 text-body-strong">InterviewSchedulingModal</h4>
              <PropsTable props={modalProps} />
            </div>

            <div>
              <h4 className="mb-3 text-body-strong">Attendee Object</h4>
              <p className="mb-3 text-caption text-foreground-muted">
                Used for{" "}
                <code className="rounded bg-background-muted px-1 font-mono text-caption-sm">
                  initialAttendees
                </code>
                ,{" "}
                <code className="rounded bg-background-muted px-1 font-mono text-caption-sm">
                  teamMembers
                </code>
                , and the{" "}
                <code className="rounded bg-background-muted px-1 font-mono text-caption-sm">
                  attendees
                </code>{" "}
                array in the schedule payload.
              </p>
              <PropsTable props={attendeeTypeProps} />
            </div>

            <div>
              <h4 className="mb-3 text-body-strong">InterviewTimeSlot Object</h4>
              <p className="mb-3 text-caption text-foreground-muted">
                Returned by{" "}
                <code className="rounded bg-background-muted px-1 font-mono text-caption-sm">
                  onSuggestTimes
                </code>{" "}
                and included in the{" "}
                <code className="rounded bg-background-muted px-1 font-mono text-caption-sm">
                  onSchedule
                </code>{" "}
                payload as{" "}
                <code className="rounded bg-background-muted px-1 font-mono text-caption-sm">
                  timeSlots
                </code>
                .
              </p>
              <PropsTable props={timeSlotTypeProps} />
            </div>

            <div>
              <h4 className="mb-3 text-body-strong">RecruiterEvent Object</h4>
              <p className="mb-3 text-caption text-foreground-muted">
                Used for{" "}
                <code className="rounded bg-background-muted px-1 font-mono text-caption-sm">
                  myCalendarEvents
                </code>{" "}
                to overlay the recruiter&apos;s own calendar in the availability view.
              </p>
              <PropsTable props={recruiterEventTypeProps} />
            </div>
          </div>
        </ComponentCard>
      </div>

      {/* ============================================
          SECTION 9: VALIDATION RULES
          ============================================ */}
      <ComponentCard
        id="validation"
        title="Validation Rules"
        description="Built-in validation ensures the recruiter provides sufficient information before scheduling."
      >
        <div className="space-y-3">
          {[
            {
              rule: "Minimum 1 time slot",
              desc: "At least one proposed time must be selected before the 'Preview & Send' button becomes active.",
            },
            {
              rule: "Minimum 2 attendees",
              desc: "The candidate (auto-added) plus at least one interviewer must be present.",
            },
            {
              rule: "Maximum 5 time slots",
              desc: "The proposed times list caps at 5 slots. The counter shows current/max with a 'max' indicator.",
            },
            {
              rule: "Candidate is non-removable",
              desc: "The candidate's AttendeeChip cannot be removed. The remove button is hidden for attendees with role 'candidate'.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg border border-border-muted p-3"
            >
              <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-background-brand-subtle text-caption-sm font-semibold text-foreground-brand">
                {i + 1}
              </div>
              <div>
                <p className="font-medium text-foreground">{item.rule}</p>
                <p className="mt-0.5 text-caption text-foreground-muted">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* ============================================
          SECTION 10: USAGE GUIDELINES
          ============================================ */}
      <UsageGuide
        dos={[
          "Pre-populate initialAttendees with the hiring manager when known",
          "Provide myCalendarEvents so recruiters can see their own schedule while finding times",
          "Implement onSuggestTimes for AI-assisted scheduling when calendar APIs are connected",
          "Use the onPreview callback to let recruiters review the email before sending",
          "Pass teamMembers so the AddAttendeePopover has a searchable list",
          "Set appropriate defaults for duration and video provider based on organization preferences",
          "Always include candidate timezone for accurate cross-timezone scheduling",
        ]}
        donts={[
          "Don't open the modal without a valid candidate object (name and email are required)",
          "Don't skip the Preview & Send step for first-time scheduling workflows",
          "Don't auto-schedule without user confirmation (human-first, AI-enabled)",
          "Don't use this modal for non-interview calendar events (use the Scheduler component)",
          "Don't hide the 'Your Calendar' tab -- recruiters need to cross-reference their own schedule",
          "Don't forget to handle the onSchedule callback to persist the interview data",
        ]}
      />

      {/* ============================================
          SECTION 11: ACCESSIBILITY
          ============================================ */}
      <AccessibilityInfo
        items={[
          "**Focus Management**: Focus is trapped within the modal when open. Pressing Escape or clicking the backdrop closes the modal via onOpenChange.",
          "**Keyboard Navigation**: All form controls (inputs, selects, buttons) are fully keyboard accessible. Tab order follows the visual layout: left panel top-to-bottom, then right panel.",
          "**Screen Readers**: The modal header announces the candidate name ('Schedule interview with [name]'). Section headers use uppercase labels for visual hierarchy but maintain semantic heading structure.",
          "**ARIA Labels**: The close button has an aria-label of 'Close modal'. The 'Preview & Send' button shows a tooltip explaining why it is disabled when validation fails.",
          "**Color Independence**: Attendee roles use both color badges and text labels. Calendar availability uses patterns in addition to colors for free/busy states.",
          "**Reduced Motion**: Calendar transitions and chip animations respect the prefers-reduced-motion media query.",
        ]}
      />

      {/* ============================================
          SECTION 12: RELATED COMPONENTS
          ============================================ */}
      <RelatedComponents
        components={[
          {
            name: "Scheduler",
            href: "/design-system/components/scheduler",
            description:
              "Full calendar component with week/day/month views for viewing and managing all interviews.",
          },
          {
            name: "RecruiterCalendar",
            href: "/design-system/components/recruiter-calendar",
            description:
              "Recruiter's personal calendar view with filters, event types, and calendar configuration.",
          },
          {
            name: "AvailabilityCalendar",
            href: "/design-system/components/availability-calendar",
            description: "The multi-attendee availability grid used in the 'Find a Time' tab.",
          },
          {
            name: "AttendeeChip",
            href: "/design-system/components/attendee-chip",
            description: "Compact attendee display with role badge, avatar, and remove action.",
          },
          {
            name: "TimeSlotChip",
            href: "/design-system/components/time-slot-chip",
            description: "Proposed time slot display with formatted date/time and remove action.",
          },
          {
            name: "SuggestTimesButton",
            href: "/design-system/components/suggest-times-button",
            description:
              "AI-powered button for suggesting available times across attendee calendars.",
          },
        ]}
      />

      <PageNavigation currentPath="/design-system/components/interview-scheduling-modal" />
    </div>
  );
}
