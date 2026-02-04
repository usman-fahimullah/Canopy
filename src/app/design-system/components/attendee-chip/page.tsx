"use client";

import React from "react";
import { AttendeeChip, Label } from "@/components/ui";
import {
  ComponentCard,
  UsageGuide,
  AccessibilityInfo,
} from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";
import type { Attendee } from "@/lib/scheduling";

/* ============================================
   SAMPLE DATA
   ============================================ */

const sampleAttendees: Attendee[] = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah@greenjobsboard.us",
    role: "recruiter",
    avatar: undefined,
  },
  {
    id: "2",
    name: "Marcus Johnson",
    email: "marcus@greenjobsboard.us",
    role: "interviewer",
    avatar: undefined,
  },
  {
    id: "3",
    name: "Emily Rivera",
    email: "emily@greenjobsboard.us",
    role: "hiring-manager",
    avatar: undefined,
  },
  {
    id: "4",
    name: "Alex Kim",
    email: "alex@greenjobsboard.us",
    role: "candidate",
    avatar: undefined,
  },
];

/* ============================================
   PROPS DOCUMENTATION
   ============================================ */

const attendeeChipProps = [
  {
    name: "attendee",
    type: "Attendee",
    required: true,
    description:
      "Object with id, name, email, role, avatar?, timezone?, calendarStatus?, and availability?. The role field determines the role badge color and label.",
  },
  {
    name: "onRemove",
    type: "() => void",
    default: "undefined",
    description:
      "Callback fired when the remove button is clicked. Only shown when removable is true and the attendee is not a candidate.",
  },
  {
    name: "removable",
    type: "boolean",
    default: "true",
    description:
      "Whether the chip shows a remove (X) button. The remove button is never shown for candidates regardless of this prop.",
  },
  {
    name: "showRole",
    type: "boolean",
    default: "true",
    description:
      "Whether to display the role badge (e.g., Recruiter, Interviewer) next to the name.",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Additional CSS classes to apply to the chip container.",
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
    description: "Full name of the attendee. Only the first name is displayed in the chip.",
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
    description:
      "The attendee role. Determines the role badge color and label. Candidates cannot be removed from the chip.",
  },
  {
    name: "avatar",
    type: "string",
    default: "undefined",
    description: "URL for the attendee avatar image. Falls back to initials if not provided.",
  },
  {
    name: "timezone",
    type: "string",
    default: "undefined",
    description: "IANA timezone string (e.g., America/New_York).",
  },
  {
    name: "calendarStatus",
    type: '"loading" | "loaded" | "error"',
    default: "undefined",
    description:
      'Calendar availability fetch status. When set to "loading", the chip shows a pulse animation.',
  },
];

/* ============================================
   PAGE COMPONENT
   ============================================ */

export default function AttendeeChipPage() {
  const [attendees, setAttendees] = React.useState<Attendee[]>([...sampleAttendees]);

  const removeAttendee = (id: string) => {
    setAttendees((prev) => prev.filter((a) => a.id !== id));
  };

  const resetAttendees = () => {
    setAttendees([...sampleAttendees]);
  };

  return (
    <div className="space-y-12">
      {/* ============================================
          OVERVIEW
          ============================================ */}
      <div>
        <h1 id="overview" className="mb-2 text-heading-lg text-foreground">
          Attendee Chip
        </h1>
        <p className="mb-6 max-w-2xl text-body text-foreground-muted">
          AttendeeChip displays an interview participant as a compact, removable chip. It shows the
          attendee avatar, first name, and a color-coded role badge. Used in the interview
          scheduling flow to manage the list of participants.
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-[var(--background-subtle)] p-4">
            <h3 className="mb-2 font-semibold text-foreground">When to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>- Displaying interview attendees in a scheduling modal</li>
              <li>- Showing a list of participants that can be managed</li>
              <li>- Compact attendee display in calendar event details</li>
            </ul>
          </div>
          <div className="rounded-lg bg-[var(--background-subtle)] p-4">
            <h3 className="mb-2 font-semibold text-foreground">When not to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>
                - For generic tags or filters (use <code>Chip</code> instead)
              </li>
              <li>
                - For simple name display without role context (use <code>Avatar</code> + text)
              </li>
              <li>
                - For non-scheduling contexts (use <code>Badge</code> or <code>Chip</code>)
              </li>
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
        description="Display an attendee with avatar, name, and role badge"
      >
        <CodePreview
          code={`import { AttendeeChip } from "@/components/ui";
import type { Attendee } from "@/lib/scheduling";

const attendee: Attendee = {
  id: "1",
  name: "Sarah Chen",
  email: "sarah@greenjobsboard.us",
  role: "recruiter",
};

<AttendeeChip attendee={attendee} onRemove={() => {}} />`}
        >
          <div className="flex flex-wrap gap-2">
            <AttendeeChip attendee={sampleAttendees[0]} onRemove={() => {}} />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          ROLES
          ============================================ */}
      <ComponentCard
        id="roles"
        title="Roles"
        description="Each role has a distinct color-coded label"
      >
        <div className="space-y-4">
          {(
            [
              {
                role: "recruiter" as const,
                description: "Green label. Can be removed.",
              },
              {
                role: "interviewer" as const,
                description: "Muted label. Can be removed.",
              },
              {
                role: "hiring-manager" as const,
                description: "Purple label. Can be removed.",
              },
              {
                role: "candidate" as const,
                description: "Blue label. Cannot be removed (remove button hidden).",
              },
            ] as const
          ).map(({ role, description }) => (
            <div key={role} className="flex items-center gap-4">
              <div className="w-48">
                <AttendeeChip
                  attendee={sampleAttendees.find((a) => a.role === role)!}
                  onRemove={() => {}}
                />
              </div>
              <span className="text-caption text-foreground-muted">{description}</span>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* ============================================
          VARIANTS: WITH / WITHOUT REMOVE BUTTON
          ============================================ */}
      <ComponentCard
        id="removable"
        title="Removable vs Non-removable"
        description="Control whether the remove button appears"
      >
        <CodePreview
          code={`{/* Removable (default) */}
<AttendeeChip attendee={interviewer} onRemove={() => {}} />

{/* Non-removable */}
<AttendeeChip attendee={interviewer} removable={false} />

{/* Candidate — remove button never shown */}
<AttendeeChip attendee={candidate} onRemove={() => {}} />`}
        >
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-48">
                <AttendeeChip attendee={sampleAttendees[1]} onRemove={() => {}} />
              </div>
              <Label className="text-caption text-foreground-muted">Removable (default)</Label>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-48">
                <AttendeeChip attendee={sampleAttendees[1]} removable={false} />
              </div>
              <Label className="text-caption text-foreground-muted">Non-removable</Label>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-48">
                <AttendeeChip attendee={sampleAttendees[3]} onRemove={() => {}} />
              </div>
              <Label className="text-caption text-foreground-muted">
                Candidate (remove always hidden)
              </Label>
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          VARIANTS: WITH / WITHOUT ROLE BADGE
          ============================================ */}
      <ComponentCard
        id="show-role"
        title="With & Without Role Badge"
        description="Toggle the role badge visibility"
      >
        <CodePreview
          code={`{/* With role badge (default) */}
<AttendeeChip attendee={attendee} />

{/* Without role badge */}
<AttendeeChip attendee={attendee} showRole={false} />`}
        >
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-48">
                <AttendeeChip attendee={sampleAttendees[0]} removable={false} />
              </div>
              <Label className="text-caption text-foreground-muted">
                With role badge (default)
              </Label>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-48">
                <AttendeeChip attendee={sampleAttendees[0]} showRole={false} removable={false} />
              </div>
              <Label className="text-caption text-foreground-muted">Without role badge</Label>
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          LOADING STATE
          ============================================ */}
      <ComponentCard
        id="loading"
        title="Loading State"
        description="Shows a pulse animation when the attendee calendar is loading"
      >
        <CodePreview
          code={`const loadingAttendee: Attendee = {
  ...attendee,
  calendarStatus: "loading",
};

<AttendeeChip attendee={loadingAttendee} />`}
        >
          <div className="flex flex-wrap gap-3">
            <div className="space-y-1">
              <Label className="block text-caption">Loading</Label>
              <AttendeeChip
                attendee={{
                  ...sampleAttendees[1],
                  calendarStatus: "loading",
                }}
                removable={false}
              />
            </div>
            <div className="space-y-1">
              <Label className="block text-caption">Loaded</Label>
              <AttendeeChip
                attendee={{
                  ...sampleAttendees[1],
                  calendarStatus: "loaded",
                }}
                removable={false}
              />
            </div>
            <div className="space-y-1">
              <Label className="block text-caption">Error</Label>
              <AttendeeChip
                attendee={{
                  ...sampleAttendees[1],
                  calendarStatus: "error",
                }}
                removable={false}
              />
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          INTERACTIVE EXAMPLE
          ============================================ */}
      <ComponentCard
        id="interactive"
        title="Interactive Example"
        description="Remove attendees from a list"
      >
        <CodePreview
          code={`const [attendees, setAttendees] = React.useState(initialAttendees);

const removeAttendee = (id: string) => {
  setAttendees(prev => prev.filter(a => a.id !== id));
};

<div className="flex flex-wrap gap-2">
  {attendees.map((attendee) => (
    <AttendeeChip
      key={attendee.id}
      attendee={attendee}
      onRemove={() => removeAttendee(attendee.id)}
    />
  ))}
</div>`}
        >
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {attendees.map((attendee) => (
                <AttendeeChip
                  key={attendee.id}
                  attendee={attendee}
                  onRemove={() => removeAttendee(attendee.id)}
                />
              ))}
              {attendees.length === 0 && (
                <span className="text-caption text-foreground-muted">All attendees removed.</span>
              )}
            </div>
            {attendees.length < sampleAttendees.length && (
              <button
                onClick={resetAttendees}
                className="text-caption font-medium text-[var(--foreground-link)] hover:underline"
              >
                Reset attendees
              </button>
            )}
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          PROPS TABLE — AttendeeChip
          ============================================ */}
      <ComponentCard id="props" title="AttendeeChip Props">
        <PropsTable props={attendeeChipProps} />
      </ComponentCard>

      {/* ============================================
          PROPS TABLE — Attendee type
          ============================================ */}
      <ComponentCard
        id="attendee-type"
        title="Attendee Type"
        description="The Attendee interface from @/lib/scheduling"
      >
        <PropsTable props={attendeeTypeProps} />
      </ComponentCard>

      {/* ============================================
          USAGE GUIDELINES
          ============================================ */}
      <UsageGuide
        dos={[
          "Use AttendeeChip inside interview scheduling flows to display participants",
          "Allow removal of non-candidate attendees to let recruiters manage the panel",
          "Show the role badge to clarify each person's function in the interview",
          "Group multiple AttendeeChips with flex-wrap for compact layouts",
          "Pair with AddAttendeePopover to let users add new attendees to the list",
        ]}
        donts={[
          "Don't use AttendeeChip for generic tag or filter display (use Chip instead)",
          "Don't override the candidate removal protection — candidates should always be non-removable",
          "Don't hide role badges in contexts where attendees from different roles are mixed",
          "Don't use outside of scheduling or interview contexts where role context is meaningful",
        ]}
      />

      {/* ============================================
          ACCESSIBILITY
          ============================================ */}
      <AccessibilityInfo
        items={[
          "**Keyboard**: The remove button is focusable with Tab and activated with Enter or Space.",
          '**ARIA**: Remove button has `aria-label` with the attendee name (e.g., "Remove Sarah Chen") for clear screen reader context.',
          "**Focus indicator**: Remove button shows a visible background change on hover and focus.",
          "**Touch target**: Remove button has a minimum 24x24px touch target for mobile accessibility.",
          "**Loading state**: Uses `animate-pulse` to indicate loading, which respects `prefers-reduced-motion`.",
        ]}
      />

      {/* ============================================
          RELATED COMPONENTS
          ============================================ */}
      <ComponentCard
        id="related"
        title="Related Components"
        description="Components commonly used alongside AttendeeChip"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="/design-system/components/add-attendee-popover"
            className="rounded-lg border border-[var(--border-muted)] p-4 transition-colors hover:border-[var(--border-brand)]"
          >
            <p className="font-medium text-foreground">AddAttendeePopover</p>
            <p className="text-caption text-foreground-muted">
              Popover for searching and adding attendees
            </p>
          </a>
          <a
            href="/design-system/components/interview-scheduling-modal"
            className="rounded-lg border border-[var(--border-muted)] p-4 transition-colors hover:border-[var(--border-brand)]"
          >
            <p className="font-medium text-foreground">InterviewSchedulingModal</p>
            <p className="text-caption text-foreground-muted">
              Full scheduling modal that uses AttendeeChip
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
          <a
            href="/design-system/components/avatar"
            className="rounded-lg border border-[var(--border-muted)] p-4 transition-colors hover:border-[var(--border-brand)]"
          >
            <p className="font-medium text-foreground">Avatar</p>
            <p className="text-caption text-foreground-muted">
              Avatar component used internally by AttendeeChip
            </p>
          </a>
          <a
            href="/design-system/components/time-slot-chip"
            className="rounded-lg border border-[var(--border-muted)] p-4 transition-colors hover:border-[var(--border-brand)]"
          >
            <p className="font-medium text-foreground">TimeSlotChip</p>
            <p className="text-caption text-foreground-muted">
              Time slot display chip for scheduling
            </p>
          </a>
        </div>
      </ComponentCard>

      <PageNavigation currentPath="/design-system/components/attendee-chip" />
    </div>
  );
}
