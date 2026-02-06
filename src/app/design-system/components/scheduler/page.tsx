"use client";

import React from "react";
import {
  RecruiterCalendarView,
  EventCard,
  UpcomingInterviews,
  TimeSlotPicker,
  TimezoneSelector,
  BookingLink,
} from "@/components/ui";
import type { CalendarEvent, RecruiterCalendarViewProps } from "@/lib/scheduling";
import type { SchedulerEvent, InterviewType } from "@/lib/scheduling";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ComponentCard,
  UsageGuide,
  AccessibilityInfo,
} from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";
import { VideoCamera, Phone, MapPin, CalendarPlus } from "@phosphor-icons/react";
import { addDays, setHours, setMinutes } from "date-fns";

// Sample events for RecruiterCalendarView demos
const today = new Date();
const sampleCalendarEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Interview - Sarah Chen",
    start: setMinutes(setHours(today, 10), 0),
    end: setMinutes(setHours(today, 11), 0),
    type: "interview-video",
    status: "confirmed",
    candidateId: "c1",
    candidateName: "Sarah Chen",
    jobTitle: "Senior Frontend Engineer",
    interviewers: [{ id: "u1", name: "James Wilson" }],
    meetingLink: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: "2",
    title: "Phone Screen - Michael Park",
    start: setMinutes(setHours(today, 14), 0),
    end: setMinutes(setHours(today, 14), 30),
    type: "interview-phone",
    status: "confirmed",
    candidateId: "c2",
    candidateName: "Michael Park",
    jobTitle: "Product Manager",
  },
  {
    id: "3",
    title: "Team Standup",
    start: setMinutes(setHours(today, 9), 0),
    end: setMinutes(setHours(today, 9), 30),
    type: "meeting",
    status: "confirmed",
  },
  {
    id: "4",
    title: "Onsite - Emily Davis",
    start: setMinutes(setHours(addDays(today, 1), 9), 0),
    end: setMinutes(setHours(addDays(today, 1), 12), 0),
    type: "interview-onsite",
    status: "confirmed",
    candidateId: "c3",
    candidateName: "Emily Davis",
    jobTitle: "Climate Data Scientist",
    location: "123 Green St, San Francisco",
    interviewers: [
      { id: "u1", name: "James Wilson" },
      { id: "u2", name: "Lisa Wang" },
    ],
  },
  {
    id: "5",
    title: "Focus Time",
    start: setMinutes(setHours(addDays(today, 2), 13), 0),
    end: setMinutes(setHours(addDays(today, 2), 15), 0),
    type: "block",
    status: "confirmed",
  },
  {
    id: "6",
    title: "Final Round - Jennifer Lee",
    start: setMinutes(setHours(addDays(today, 3), 15), 0),
    end: setMinutes(setHours(addDays(today, 3), 16), 0),
    type: "interview-video",
    status: "tentative",
    candidateId: "c5",
    candidateName: "Jennifer Lee",
    jobTitle: "Sustainability Lead",
  },
];

// Sample events for EventCard/UpcomingInterviews (uses SchedulerEvent type)
const sampleSchedulerEvents: SchedulerEvent[] = [
  {
    id: "1",
    title: "Interview - Sarah Chen",
    start: setMinutes(setHours(addDays(today, 1), 10), 0),
    end: setMinutes(setHours(addDays(today, 1), 11), 0),
    type: "video",
    candidateId: "c1",
    candidateName: "Sarah Chen",
    jobTitle: "Senior Frontend Engineer",
  },
  {
    id: "2",
    title: "Phone Screen - Michael Park",
    start: setMinutes(setHours(addDays(today, 2), 14), 0),
    end: setMinutes(setHours(addDays(today, 2), 14), 30),
    type: "phone",
    candidateId: "c2",
    candidateName: "Michael Park",
    jobTitle: "Product Manager",
  },
  {
    id: "3",
    title: "Onsite - Emily Davis",
    start: setMinutes(setHours(addDays(today, 3), 9), 0),
    end: setMinutes(setHours(addDays(today, 3), 12), 0),
    type: "onsite",
    candidateId: "c3",
    candidateName: "Emily Davis",
    jobTitle: "Climate Data Scientist",
  },
];

// Props documentation
const recruiterCalendarProps = [
  {
    name: "events",
    type: "CalendarEvent[]",
    description: "Array of calendar events to display",
  },
  {
    name: "calendars",
    type: "CalendarConfig[]",
    description: "Array of calendar sources with visibility toggles",
  },
  {
    name: "initialView",
    type: '"day" | "week" | "month"',
    default: '"week"',
    description: "Initial calendar view mode",
  },
  {
    name: "initialDate",
    type: "Date",
    default: "new Date()",
    description: "Initial focused date",
  },
  {
    name: "onEventClick",
    type: "(event: CalendarEvent) => void",
    description: "Callback when an event is clicked",
  },
  {
    name: "onSlotClick",
    type: "(start: Date, end: Date) => void",
    description: "Callback when an empty slot is clicked",
  },
  {
    name: "onCreateEvent",
    type: "() => void",
    description: "Callback when create event button is clicked",
  },
  {
    name: "timezone",
    type: "string",
    description: "Timezone for display (IANA format)",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes",
  },
];

const calendarEventProps = [
  {
    name: "id",
    type: "string",
    required: true,
    description: "Unique identifier for the event",
  },
  {
    name: "title",
    type: "string",
    required: true,
    description: "Event title/name",
  },
  {
    name: "start",
    type: "Date | string",
    required: true,
    description: "Event start time",
  },
  {
    name: "end",
    type: "Date | string",
    required: true,
    description: "Event end time",
  },
  {
    name: "type",
    type: '"interview" | "meeting" | "block" | "interview-video" | "interview-phone" | "interview-onsite"',
    description: "Event type for icon and color styling",
  },
  {
    name: "status",
    type: '"confirmed" | "tentative" | "cancelled"',
    description: "Event confirmation status",
  },
  {
    name: "candidateName",
    type: "string",
    description: "Name of the related candidate",
  },
  {
    name: "jobTitle",
    type: "string",
    description: "Title of the related job",
  },
  {
    name: "interviewers",
    type: "{ id: string; name: string; avatar?: string; role?: string }[]",
    description: "Array of interviewers",
  },
  {
    name: "location",
    type: "string",
    description: "Physical location for onsite interviews",
  },
  {
    name: "meetingLink",
    type: "string",
    description: "Video meeting link",
  },
  {
    name: "isAllDay",
    type: "boolean",
    description: "Whether the event spans the entire day",
  },
];

const timeSlotPickerProps = [
  {
    name: "selectedDate",
    type: "Date",
    required: true,
    description: "Currently selected date",
  },
  {
    name: "onDateChange",
    type: "(date: Date) => void",
    description: "Callback when date changes",
  },
  {
    name: "onSlotSelect",
    type: "(start: Date, end: Date) => void",
    description: "Callback when a time slot is selected",
  },
  {
    name: "availableSlots",
    type: "TimeSlot[]",
    description: "Array of available time slots",
  },
  {
    name: "events",
    type: "SchedulerEvent[]",
    default: "[]",
    description: "Existing events to block slots",
  },
  {
    name: "startHour",
    type: "number",
    default: "9",
    description: "Start hour for available slots",
  },
  {
    name: "endHour",
    type: "number",
    default: "17",
    description: "End hour for available slots",
  },
  {
    name: "slotDuration",
    type: "number",
    default: "30",
    description: "Duration of each slot in minutes",
  },
  {
    name: "timezone",
    type: "string",
    description: "Timezone for display",
  },
  {
    name: "onTimezoneChange",
    type: "(timezone: string) => void",
    description: "Callback when timezone changes",
  },
  {
    name: "title",
    type: "string",
    default: '"Select a Time"',
    description: "Title text",
  },
  {
    name: "subtitle",
    type: "string",
    description: "Subtitle text",
  },
];

const upcomingInterviewsProps = [
  {
    name: "interviews",
    type: "SchedulerEvent[]",
    required: true,
    description: "Array of interview events",
  },
  {
    name: "maxItems",
    type: "number",
    default: "5",
    description: "Maximum number of interviews to show",
  },
  {
    name: "onViewAll",
    type: "() => void",
    description: "Callback to view all interviews",
  },
  {
    name: "onInterviewClick",
    type: "(interview: SchedulerEvent) => void",
    description: "Callback when an interview is clicked",
  },
];

const bookingLinkProps = [
  {
    name: "link",
    type: "string",
    required: true,
    description: "The booking link URL",
  },
  {
    name: "title",
    type: "string",
    default: '"Schedule a Meeting"',
    description: "Title for the booking page",
  },
  {
    name: "duration",
    type: "number",
    default: "30",
    description: "Duration of the meeting in minutes",
  },
  {
    name: "isActive",
    type: "boolean",
    default: "true",
    description: "Whether the link is active",
  },
  {
    name: "onCopy",
    type: "() => void",
    description: "Callback when link is copied",
  },
  {
    name: "onToggleStatus",
    type: "(active: boolean) => void",
    description: "Callback to toggle link status",
  },
];

// Interview types for EventCard display
const interviewTypes: { type: InterviewType; label: string; icon: React.ReactNode }[] = [
  { type: "video", label: "Video", icon: <VideoCamera className="h-4 w-4" /> },
  { type: "phone", label: "Phone", icon: <Phone className="h-4 w-4" /> },
  { type: "onsite", label: "Onsite", icon: <MapPin className="h-4 w-4" /> },
];

export default function SchedulerPage() {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [selectedEvent, setSelectedEvent] = React.useState<SchedulerEvent | null>(null);
  const [selectedSlot, setSelectedSlot] = React.useState<{ start: Date; end: Date } | null>(null);
  const [timezone, setTimezone] = React.useState("America/New_York");

  return (
    <div className="space-y-12">
      {/* Overview */}
      <div>
        <h1 id="overview" className="mb-2 text-heading-lg text-foreground">
          Recruiter Calendar
        </h1>
        <p className="mb-4 max-w-2xl text-body text-foreground-muted">
          Full-featured calendar for managing interviews, meetings, and availability. Includes
          day/week/month views, sidebar with mini calendar and filters, keyboard shortcuts, and
          companion components for self-service booking and interview lists.
        </p>

        {/* When to Use / When Not to Use */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="bg-background-success/10 rounded-lg border border-border-success p-4">
            <h3 className="mb-2 font-semibold text-foreground-success">When to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>Full calendar view for recruiters and hiring managers</li>
              <li>Interview scheduling and management</li>
              <li>Viewing team availability across calendars</li>
              <li>Self-service booking pages (Calendly-style)</li>
            </ul>
          </div>
          <div className="bg-background-error/10 rounded-lg border border-border-error p-4">
            <h3 className="mb-2 font-semibold text-foreground-error">When not to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>Simple date picking (use DatePicker)</li>
              <li>Event lists without time slots (use Timeline)</li>
              <li>Non-calendar task management (use Kanban)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recruiter Calendar */}
      <ComponentCard
        id="basic-usage"
        title="Recruiter Calendar"
        description="Full calendar with sidebar, filters, and day/week/month views"
      >
        <CodePreview
          code={`import { RecruiterCalendarView } from "@/components/ui";
import type { CalendarEvent } from "@/lib/scheduling";

const events: CalendarEvent[] = [
  {
    id: "1",
    title: "Interview - Sarah Chen",
    start: new Date(),
    end: new Date(Date.now() + 60 * 60 * 1000),
    type: "interview-video",
    status: "confirmed",
    candidateName: "Sarah Chen",
  },
];

<RecruiterCalendarView
  events={events}
  initialView="week"
  onEventClick={(event) => console.log("Event clicked:", event)}
  onSlotClick={(start, end) => console.log("Slot clicked:", start, end)}
/>`}
        >
          <div className="h-[600px]">
            <RecruiterCalendarView events={sampleCalendarEvents} initialView="week" />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Interview Types (EventCard) */}
      <ComponentCard
        id="interview-types"
        title="Interview Types"
        description="EventCard styles based on interview type"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {interviewTypes.map(({ type, label, icon }) => (
            <div key={type} className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1.5">
                  {icon}
                  {label}
                </Badge>
              </div>
              <EventCard
                event={{
                  id: type,
                  title: `${label} Interview`,
                  start: setMinutes(setHours(new Date(), 10), 0),
                  end: setMinutes(setHours(new Date(), 11), 0),
                  type,
                  candidateName: "John Doe",
                }}
                onClick={() => {}}
              />
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* Time Slot Picker (Calendly-style) */}
      <ComponentCard
        id="time-slot-picker"
        title="Time Slot Picker"
        description="Calendly-style interface for candidate self-service booking"
      >
        <CodePreview
          code={`import { TimeSlotPicker } from "@/components/ui";

<TimeSlotPicker
  selectedDate={selectedDate}
  onDateChange={setSelectedDate}
  onSlotSelect={(start, end) => {
    console.log("Selected slot:", start, end);
  }}
  title="Schedule Interview"
  subtitle="30-minute Technical Screen"
  slotDuration={30}
  startHour={9}
  endHour={17}
/>`}
        >
          <TimeSlotPicker
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onSlotSelect={(start, end) => setSelectedSlot({ start, end })}
            title="Schedule Interview"
            subtitle="30-minute Technical Screen"
            slotDuration={30}
            startHour={9}
            endHour={17}
            timezone={timezone}
            onTimezoneChange={setTimezone}
          />
        </CodePreview>
      </ComponentCard>

      {/* Upcoming Interviews List */}
      <ComponentCard
        id="upcoming-interviews"
        title="Upcoming Interviews"
        description="Compact list view of upcoming scheduled interviews"
      >
        <CodePreview
          code={`import { UpcomingInterviews } from "@/components/ui";

<UpcomingInterviews
  interviews={interviews}
  maxItems={5}
  onInterviewClick={(interview) => console.log("Clicked:", interview)}
  onViewAll={() => console.log("View all")}
/>`}
        >
          <div className="max-w-md">
            <Card>
              <CardHeader>
                <CardTitle className="text-body-strong">Upcoming Interviews</CardTitle>
              </CardHeader>
              <CardContent>
                <UpcomingInterviews
                  interviews={sampleSchedulerEvents}
                  maxItems={3}
                  onInterviewClick={setSelectedEvent}
                />
              </CardContent>
            </Card>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Booking Link */}
      <ComponentCard
        id="booking-link"
        title="Booking Link"
        description="Shareable booking link component for self-service scheduling"
      >
        <CodePreview
          code={`import { BookingLink } from "@/components/ui";

<BookingLink
  link="https://canopy.app/book/sarah-chen-interview"
  title="Technical Interview"
  duration={45}
  isActive={true}
  onCopy={() => toast("Link copied!")}
  onToggleStatus={(active) => console.log("Status:", active)}
/>`}
        >
          <div className="max-w-lg">
            <BookingLink
              link="https://canopy.app/book/sarah-chen-interview"
              title="Technical Interview"
              duration={45}
              isActive={true}
            />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Timezone Selector */}
      <ComponentCard
        id="timezone"
        title="Timezone Support"
        description="Built-in timezone selector for global teams"
      >
        <CodePreview
          code={`import { TimezoneSelector } from "@/components/ui";

<TimezoneSelector
  value={timezone}
  onChange={setTimezone}
/>`}
        >
          <div className="flex items-center gap-4">
            <Label>Current Timezone:</Label>
            <TimezoneSelector value={timezone} onChange={setTimezone} />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Real-world Examples */}
      <ComponentCard
        id="examples"
        title="Real-World Examples"
        description="Common usage patterns in ATS workflows"
      >
        <div className="space-y-8">
          {/* Candidate Self-Booking Page */}
          <div>
            <h4 className="mb-4 text-body-strong">Candidate Self-Booking Page</h4>
            <div className="rounded-xl border border-border-muted bg-background-subtle p-6">
              <div className="mb-6 text-center">
                <h3 className="text-heading-sm">Schedule Your Interview</h3>
                <p className="text-foreground-muted">
                  Senior Frontend Engineer - Climate Tech Startup
                </p>
              </div>
              <TimeSlotPicker
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                onSlotSelect={(start, end) => setSelectedSlot({ start, end })}
                title="Select a Time"
                subtitle="45-minute interview"
                slotDuration={45}
              />
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Props Tables */}
      <div className="space-y-8">
        <ComponentCard id="props" title="Props">
          <div className="space-y-8">
            <div>
              <h4 className="mb-3 text-body-strong">RecruiterCalendarView</h4>
              <PropsTable props={recruiterCalendarProps} />
            </div>

            <div>
              <h4 className="mb-3 text-body-strong">CalendarEvent Object</h4>
              <PropsTable props={calendarEventProps} />
            </div>

            <div>
              <h4 className="mb-3 text-body-strong">TimeSlotPicker</h4>
              <PropsTable props={timeSlotPickerProps} />
            </div>

            <div>
              <h4 className="mb-3 text-body-strong">UpcomingInterviews</h4>
              <PropsTable props={upcomingInterviewsProps} />
            </div>

            <div>
              <h4 className="mb-3 text-body-strong">BookingLink</h4>
              <PropsTable props={bookingLinkProps} />
            </div>
          </div>
        </ComponentCard>
      </div>

      {/* Guidelines */}
      <UsageGuide
        dos={[
          "Show clear timezone information for remote teams",
          "Highlight conflicts and unavailable slots",
          "Provide quick navigation to today and view switching",
          "Show candidate/interviewer information on events",
          "Use appropriate interview type icons for visual clarity",
          "Allow timezone selection for global candidates",
        ]}
        donts={[
          "Don't allow booking in the past",
          "Don't show too many events overlapping (use agenda view)",
          "Don't hide important meeting details like links",
          "Don't auto-confirm bookings without user action",
          "Don't show personal calendar data to candidates",
          "Don't forget to handle timezone conversions correctly",
        ]}
      />

      {/* Accessibility */}
      <AccessibilityInfo
        items={[
          "**Keyboard Navigation**: Full keyboard support for date navigation and event selection",
          "**Focus Management**: Clear focus indicators on all interactive elements",
          "**Screen Readers**: Proper ARIA labels for dates, events, and time slots",
          "**Time Announcements**: Slot times are announced with full date context",
          "**Color Independence**: Event types use icons in addition to colors",
          "**Reduced Motion**: Animations respect prefers-reduced-motion",
        ]}
      />

      {/* Related Components */}
      <ComponentCard
        id="related"
        title="Related Components"
        description="Components commonly used with the Recruiter Calendar"
      >
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <a
            href="/design-system/components/calendar"
            className="rounded-lg border border-border-muted p-4 transition-colors hover:border-border-brand"
          >
            <p className="font-medium">Calendar</p>
            <p className="text-caption text-foreground-muted">Date selection</p>
          </a>
          <a
            href="/design-system/components/interview-scheduling-modal"
            className="rounded-lg border border-border-muted p-4 transition-colors hover:border-border-brand"
          >
            <p className="font-medium">Interview Scheduling Modal</p>
            <p className="text-caption text-foreground-muted">Full scheduling flow</p>
          </a>
          <a
            href="/design-system/components/modal"
            className="rounded-lg border border-border-muted p-4 transition-colors hover:border-border-brand"
          >
            <p className="font-medium">Modal</p>
            <p className="text-caption text-foreground-muted">Event details</p>
          </a>
          <a
            href="/design-system/components/candidate-card"
            className="rounded-lg border border-border-muted p-4 transition-colors hover:border-border-brand"
          >
            <p className="font-medium">Candidate Card</p>
            <p className="text-caption text-foreground-muted">Candidate info</p>
          </a>
        </div>
      </ComponentCard>

      <PageNavigation currentPath="/design-system/components/scheduler" />
    </div>
  );
}
