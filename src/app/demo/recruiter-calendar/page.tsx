"use client";

import * as React from "react";
import Image from "next/image";
import {
  RecruiterCalendarView,
  Button,
  Card,
  type CalendarEvent,
  type CalendarConfig,
} from "@/components/ui";
import {
  CalendarPlus,
  ArrowSquareOut,
  Keyboard,
  Lightning,
  Calendar,
  Users,
  Funnel,
  Eye,
} from "@phosphor-icons/react";
import { addDays, setHours, setMinutes, subDays, addWeeks, format } from "date-fns";

/**
 * Demo page for the Recruiter Calendar View
 * Full-featured calendar for recruiters to manage their interview schedule
 */

// Generate sample events
const generateSampleEvents = (): CalendarEvent[] => {
  const today = new Date();
  const events: CalendarEvent[] = [];

  // Today's events
  events.push({
    id: "event-1",
    title: "Sarah Chen - Technical Interview",
    start: setMinutes(setHours(today, 9), 0),
    end: setMinutes(setHours(today, 10), 0),
    type: "interview-video",
    status: "confirmed",
    candidateName: "Sarah Chen",
    candidateAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    jobTitle: "Senior Engineer",
    meetingLink: "https://meet.google.com/abc-def-ghi",
    interviewers: [
      { id: "int-1", name: "Diego Navarro", role: "Interviewer" },
      { id: "int-2", name: "Oliver Bennett", role: "Hiring Manager" },
    ],
  });

  events.push({
    id: "event-2",
    title: "Team Standup",
    start: setMinutes(setHours(today, 10), 30),
    end: setMinutes(setHours(today, 11), 0),
    type: "meeting",
    status: "confirmed",
  });

  events.push({
    id: "event-3",
    title: "Marcus Johnson - Phone Screen",
    start: setMinutes(setHours(today, 14), 0),
    end: setMinutes(setHours(today, 14), 30),
    type: "interview-phone",
    status: "confirmed",
    candidateName: "Marcus Johnson",
    candidateAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    jobTitle: "Product Designer",
  });

  events.push({
    id: "event-4",
    title: "Focus Time - No Meetings",
    start: setMinutes(setHours(today, 15), 0),
    end: setMinutes(setHours(today, 17), 0),
    type: "block",
  });

  // Tomorrow's events
  const tomorrow = addDays(today, 1);
  events.push({
    id: "event-5",
    title: "Emily Wong - Final Round",
    start: setMinutes(setHours(tomorrow, 10), 0),
    end: setMinutes(setHours(tomorrow, 11), 30),
    type: "interview-onsite",
    status: "confirmed",
    candidateName: "Emily Wong",
    candidateAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    jobTitle: "Engineering Manager",
    location: "Conference Room A",
    interviewers: [
      { id: "int-1", name: "Diego Navarro", role: "Interviewer" },
      { id: "int-3", name: "Giulia Bianchi", role: "Interviewer" },
      { id: "int-2", name: "Oliver Bennett", role: "Hiring Manager" },
    ],
  });

  events.push({
    id: "event-6",
    title: "Hiring Meeting",
    start: setMinutes(setHours(tomorrow, 14), 0),
    end: setMinutes(setHours(tomorrow, 15), 0),
    type: "meeting",
    status: "confirmed",
  });

  // Day after tomorrow
  const dayAfter = addDays(today, 2);
  events.push({
    id: "event-7",
    title: "James Park - Portfolio Review",
    start: setMinutes(setHours(dayAfter, 11), 0),
    end: setMinutes(setHours(dayAfter, 12), 0),
    type: "interview-video",
    status: "tentative",
    candidateName: "James Park",
    candidateAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    jobTitle: "UX Designer",
  });

  // Later this week
  const laterThisWeek = addDays(today, 3);
  events.push({
    id: "event-8",
    title: "Rachel Kim - Technical Challenge",
    start: setMinutes(setHours(laterThisWeek, 9), 30),
    end: setMinutes(setHours(laterThisWeek, 11), 0),
    type: "interview-video",
    status: "confirmed",
    candidateName: "Rachel Kim",
    candidateAvatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
    jobTitle: "Frontend Engineer",
    interviewers: [{ id: "int-1", name: "Diego Navarro", role: "Interviewer" }],
  });

  events.push({
    id: "event-9",
    title: "Candidate Pipeline Review",
    start: setMinutes(setHours(laterThisWeek, 15), 0),
    end: setMinutes(setHours(laterThisWeek, 16), 0),
    type: "meeting",
  });

  // Next week
  const nextWeek = addWeeks(today, 1);
  events.push({
    id: "event-10",
    title: "Alex Thompson - Onsite Day",
    start: setMinutes(setHours(nextWeek, 10), 0),
    end: setMinutes(setHours(nextWeek, 16), 0),
    type: "interview-onsite",
    status: "confirmed",
    candidateName: "Alex Thompson",
    candidateAvatar:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop",
    jobTitle: "Senior Product Manager",
    location: "HQ Office",
  });

  return events;
};

// Sample calendars
const sampleCalendars: CalendarConfig[] = [
  {
    id: "cal-1",
    name: "Work Calendar",
    email: "recruiter@canopy.co",
    color: "var(--primitive-blue-500)",
    visible: true,
  },
  {
    id: "cal-2",
    name: "Interviews",
    email: "interviews@canopy.co",
    color: "var(--primitive-green-500)",
    visible: true,
  },
  {
    id: "cal-3",
    name: "Personal",
    email: "personal@gmail.com",
    color: "var(--primitive-purple-500)",
    visible: false,
  },
];

export default function RecruiterCalendarDemoPage() {
  const [events] = React.useState<CalendarEvent[]>(generateSampleEvents);
  const [selectedEvent, setSelectedEvent] = React.useState<CalendarEvent | null>(null);
  const [showEventModal, setShowEventModal] = React.useState(false);

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleSlotClick = (start: Date, end: Date) => {
    // eslint-disable-next-line no-console
    console.log("Create new event:", { start, end });
    // In production, this would open a create event modal
  };

  const handleCreateEvent = () => {
    // eslint-disable-next-line no-console
    console.log("Create new event clicked");
    // In production, this would open a create event modal
  };

  return (
    <div className="flex h-screen flex-col bg-[var(--primitive-neutral-100)]">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-[var(--primitive-neutral-200)] bg-white">
        <div className="mx-auto max-w-[1600px] px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar size={24} weight="fill" className="text-[var(--primitive-green-600)]" />
                <h1 className="text-lg font-semibold text-[var(--foreground-default)]">
                  Recruiter Calendar
                </h1>
              </div>
              <span className="text-sm text-[var(--foreground-muted)]">
                Full-featured interview scheduling
              </span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/demo/interview-scheduling"
                className="flex items-center gap-1.5 text-sm text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground-default)]"
              >
                <span>Interview Modal</span>
                <ArrowSquareOut size={14} />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Feature Highlights Bar */}
      <div className="flex-shrink-0 border-b border-[var(--primitive-green-200)] bg-[var(--primitive-green-50)]">
        <div className="mx-auto max-w-[1600px] px-6 py-2">
          <div className="flex items-center justify-center gap-8 text-[12px]">
            <div className="flex items-center gap-1.5 text-[var(--primitive-green-700)]">
              <Keyboard size={14} />
              <span>
                Keyboard shortcuts (press{" "}
                <kbd className="rounded border bg-white px-1 text-[10px]">?</kbd>)
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[var(--primitive-green-700)]">
              <Eye size={14} />
              <span>Day / Week / Month views</span>
            </div>
            <div className="flex items-center gap-1.5 text-[var(--primitive-green-700)]">
              <Funnel size={14} />
              <span>Filter by event type</span>
            </div>
            <div className="flex items-center gap-1.5 text-[var(--primitive-green-700)]">
              <Users size={14} />
              <span>Interview-focused cards</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Calendar */}
      <div className="flex-1 overflow-hidden">
        <RecruiterCalendarView
          events={events}
          calendars={sampleCalendars}
          initialView="week"
          onEventClick={handleEventClick}
          onSlotClick={handleSlotClick}
          onCreateEvent={handleCreateEvent}
          timezone="America/New_York"
        />
      </div>

      {/* Event Detail Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowEventModal(false)} />
          <Card className="relative mx-4 w-full max-w-md overflow-hidden p-0 shadow-2xl">
            {/* Header */}
            <div className="border-b border-[var(--primitive-neutral-200)] p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--foreground-default)]">
                    {selectedEvent.title}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                    {format(
                      typeof selectedEvent.start === "string"
                        ? new Date(selectedEvent.start)
                        : selectedEvent.start,
                      "EEEE, MMMM d, yyyy"
                    )}
                  </p>
                  <p className="text-sm text-[var(--foreground-muted)]">
                    {format(
                      typeof selectedEvent.start === "string"
                        ? new Date(selectedEvent.start)
                        : selectedEvent.start,
                      "h:mm a"
                    )}{" "}
                    –{" "}
                    {format(
                      typeof selectedEvent.end === "string"
                        ? new Date(selectedEvent.end)
                        : selectedEvent.end,
                      "h:mm a"
                    )}
                  </p>
                </div>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="rounded p-1 transition-colors hover:bg-[var(--primitive-neutral-200)]"
                >
                  <span className="sr-only">Close</span>×
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4 p-5">
              {/* Candidate info */}
              {selectedEvent.candidateName && (
                <div className="flex items-center gap-3 rounded-lg bg-[var(--primitive-neutral-50)] p-3">
                  <Image
                    src={selectedEvent.candidateAvatar || ""}
                    alt={selectedEvent.candidateName}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-[var(--foreground-default)]">
                      {selectedEvent.candidateName}
                    </p>
                    <p className="text-sm text-[var(--foreground-muted)]">
                      {selectedEvent.jobTitle}
                    </p>
                  </div>
                </div>
              )}

              {/* Interviewers */}
              {selectedEvent.interviewers && selectedEvent.interviewers.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-medium text-[var(--foreground-default)]">
                    Interviewers
                  </p>
                  <div className="space-y-2">
                    {selectedEvent.interviewers.map((interviewer) => (
                      <div key={interviewer.id} className="flex items-center gap-2 text-sm">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primitive-neutral-200)] text-xs font-medium">
                          {interviewer.name.charAt(0)}
                        </div>
                        <span>{interviewer.name}</span>
                        <span className="text-[var(--foreground-muted)]">· {interviewer.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Location / Meeting Link */}
              {(selectedEvent.location || selectedEvent.meetingLink) && (
                <div>
                  <p className="mb-1 text-sm font-medium text-[var(--foreground-default)]">
                    {selectedEvent.location ? "Location" : "Meeting Link"}
                  </p>
                  <p className="text-sm text-[var(--foreground-muted)]">
                    {selectedEvent.location || selectedEvent.meetingLink}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-50)] p-5">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Reschedule
                </Button>
                <Button size="sm" className="flex-1">
                  Join Meeting
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
