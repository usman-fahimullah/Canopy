"use client";

import * as React from "react";
import {
  InterviewSchedulingModal,
  Button,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Badge,
  Banner,
  type Attendee,
  type RecruiterEvent,
  type TimeSlot,
} from "@/components/ui";
import {
  CalendarPlus,
  ArrowSquareOut,
  CheckCircle,
  Warning,
  XCircle,
  Eye,
  Clock,
  Lightning,
  CalendarBlank,
} from "@phosphor-icons/react";
import { addDays, setHours, setMinutes, startOfWeek, addWeeks, addMinutes } from "date-fns";

/**
 * Demo page for the Interview Scheduling Modal
 * Showcases the improved scheduling experience with all UX fixes
 */

// Helper to create availability blocks with week offset support
const createAvailabilityBlock = (
  dayOffset: number,
  startHour: number,
  endHour: number,
  options: {
    status?: "busy" | "tentative";
    weekOffset?: number;
    title?: string;
    responseStatus?: "accepted" | "tentative" | "needsAction" | "declined";
  } = {}
) => {
  const { status = "busy", weekOffset = 0, title, responseStatus = "accepted" } = options;
  const today = new Date();
  const weekStart = addWeeks(startOfWeek(today, { weekStartsOn: 1 }), weekOffset);
  const day = addDays(weekStart, dayOffset);
  return {
    start: setMinutes(setHours(day, startHour), 0),
    end: setMinutes(setHours(day, endHour), 0),
    status,
    title,
    responseStatus,
  };
};

// Sample team members data with availability spanning multiple weeks
// Shows realistic calendar events with titles and response statuses
const sampleTeamMembers: Attendee[] = [
  {
    id: "tm-1",
    name: "Diego Navarro",
    email: "diego@canopy.co",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    role: "interviewer",
    timezone: "Europe/Amsterdam",
    availability: [
      // This week
      createAvailabilityBlock(0, 6, 7, { title: "Gym / Personal Time" }),
      createAvailabilityBlock(0, 7, 8, { title: "Early Stand-up (EU)" }),
      createAvailabilityBlock(0, 9, 10, { title: "Team Standup" }),
      createAvailabilityBlock(0, 14, 15, { title: "1:1 with Manager" }),
      createAvailabilityBlock(0, 18, 19, { title: "APAC Sync", responseStatus: "needsAction" }),
      createAvailabilityBlock(0, 21, 22, {
        title: "Late Night Deploy",
        status: "tentative",
        responseStatus: "tentative",
      }),
      createAvailabilityBlock(1, 10, 11, { title: "Code Review" }),
      createAvailabilityBlock(1, 14, 16, { title: "Sprint Planning" }),
      createAvailabilityBlock(1, 20, 21, { title: "US West Coast Sync" }),
      createAvailabilityBlock(2, 8, 9, {
        title: "Morning Coffee Chat",
        status: "tentative",
        responseStatus: "tentative",
      }),
      createAvailabilityBlock(2, 11, 12, { title: "Tech Sync", responseStatus: "needsAction" }),
      createAvailabilityBlock(3, 5, 6, { title: "Early Bird Standup (Asia)" }),
      createAvailabilityBlock(3, 9, 10, { title: "Daily Standup" }),
      createAvailabilityBlock(3, 15, 16, {
        title: "Optional: AMA Session",
        status: "tentative",
        responseStatus: "tentative",
      }),
      createAvailabilityBlock(3, 18, 19, { title: "Client Call (PST)" }),
      createAvailabilityBlock(4, 10, 11, { title: "Architecture Review" }),
      createAvailabilityBlock(4, 17, 18, { title: "Week Wrap-up" }),
      createAvailabilityBlock(4, 22, 23, { title: "Production Deployment Window" }),
      // Next week
      createAvailabilityBlock(0, 9, 11, { weekOffset: 1, title: "Workshop: New Framework" }),
      createAvailabilityBlock(0, 15, 17, {
        weekOffset: 1,
        title: "Training Session",
        responseStatus: "needsAction",
      }),
      createAvailabilityBlock(1, 7, 8, { weekOffset: 1, title: "Early Morning Sync" }),
      createAvailabilityBlock(1, 9, 10, { weekOffset: 1, title: "Team Standup" }),
      createAvailabilityBlock(1, 13, 14, {
        weekOffset: 1,
        title: "Lunch & Learn",
        responseStatus: "tentative",
      }),
      createAvailabilityBlock(2, 10, 12, { weekOffset: 1, title: "Deep Work Block" }),
      createAvailabilityBlock(3, 14, 16, {
        weekOffset: 1,
        title: "Optional: Demo Day",
        status: "tentative",
        responseStatus: "tentative",
      }),
      createAvailabilityBlock(4, 9, 10, { weekOffset: 1, title: "Sprint Retro" }),
      createAvailabilityBlock(4, 15, 17, { weekOffset: 1, title: "Hackathon Kickoff" }),
      createAvailabilityBlock(4, 18, 20, { weekOffset: 1, title: "Hackathon Evening" }),
      // Week after next
      createAvailabilityBlock(0, 10, 11, { weekOffset: 2, title: "Product Sync" }),
      createAvailabilityBlock(1, 11, 13, { weekOffset: 2, title: "Interview: Sr. Engineer" }),
      createAvailabilityBlock(2, 9, 10, { weekOffset: 2, title: "Daily Standup" }),
      createAvailabilityBlock(3, 10, 11, { weekOffset: 2, title: "1:1 with Tech Lead" }),
      createAvailabilityBlock(4, 14, 16, { weekOffset: 2, title: "Team Building" }),
    ],
  },
  {
    id: "tm-2",
    name: "Giulia Bianchi",
    email: "giulia@canopy.co",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    role: "interviewer",
    timezone: "Europe/Rome",
    availability: [
      // This week
      createAvailabilityBlock(0, 9, 12, { title: "Quarterly Planning" }),
      createAvailabilityBlock(1, 9, 10, { title: "Design Review" }),
      createAvailabilityBlock(1, 14, 15, { title: "Client Call", responseStatus: "needsAction" }),
      createAvailabilityBlock(2, 10, 11, { title: "UX Workshop" }),
      createAvailabilityBlock(2, 15, 17, { title: "Focus Time" }),
      createAvailabilityBlock(3, 11, 13, { title: "Stakeholder Meeting" }),
      createAvailabilityBlock(4, 9, 10, { title: "Weekly Sync" }),
      createAvailabilityBlock(4, 14, 15, {
        title: "Optional: Coffee Chat",
        status: "tentative",
        responseStatus: "tentative",
      }),
      // Next week
      createAvailabilityBlock(0, 10, 12, { weekOffset: 1, title: "Product Roadmap" }),
      createAvailabilityBlock(0, 14, 16, { weekOffset: 1, title: "Design Sprint" }),
      createAvailabilityBlock(1, 9, 11, { weekOffset: 1, title: "User Research Debrief" }),
      createAvailabilityBlock(2, 13, 15, {
        weekOffset: 1,
        title: "Team Offsite Prep",
        responseStatus: "needsAction",
      }),
      createAvailabilityBlock(3, 9, 10, { weekOffset: 1, title: "Daily Standup" }),
      createAvailabilityBlock(3, 15, 17, {
        weekOffset: 1,
        title: "Optional: Tech Talk",
        status: "tentative",
        responseStatus: "tentative",
      }),
      createAvailabilityBlock(4, 10, 12, { weekOffset: 1, title: "Design Critique" }),
      // Week after next
      createAvailabilityBlock(0, 9, 10, { weekOffset: 2, title: "Morning Standup" }),
      createAvailabilityBlock(1, 14, 16, { weekOffset: 2, title: "Interview Panel" }),
      createAvailabilityBlock(2, 11, 12, { weekOffset: 2, title: "Mentor Session" }),
      createAvailabilityBlock(3, 9, 11, { weekOffset: 2, title: "Strategy Review" }),
      createAvailabilityBlock(4, 13, 15, { weekOffset: 2, title: "All Hands" }),
    ],
  },
  {
    id: "tm-3",
    name: "Oliver Bennett",
    email: "oliver@canopy.co",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    role: "hiring-manager",
    timezone: "Europe/London",
    availability: [
      // This week
      createAvailabilityBlock(0, 10, 11, { title: "Leadership Sync" }),
      createAvailabilityBlock(0, 15, 16, { title: "Hiring Review" }),
      createAvailabilityBlock(1, 10, 12, { title: "Budget Planning" }),
      createAvailabilityBlock(2, 9, 11, { title: "Board Prep" }),
      createAvailabilityBlock(2, 14, 15, {
        title: "Optional: Webinar",
        status: "tentative",
        responseStatus: "needsAction",
      }),
      createAvailabilityBlock(3, 9, 10, { title: "Exec Standup" }),
      createAvailabilityBlock(3, 14, 16, { title: "Candidate Review" }),
      createAvailabilityBlock(4, 11, 12, { title: "Weekly Report" }),
      createAvailabilityBlock(4, 14, 17, { title: "Quarter Close" }),
      // Next week
      createAvailabilityBlock(0, 9, 10, { weekOffset: 1, title: "Morning Briefing" }),
      createAvailabilityBlock(0, 13, 15, { weekOffset: 1, title: "Investor Call" }),
      createAvailabilityBlock(1, 11, 12, { weekOffset: 1, title: "1:1 with CEO" }),
      createAvailabilityBlock(1, 15, 17, { weekOffset: 1, title: "Team Performance Review" }),
      createAvailabilityBlock(2, 9, 10, { weekOffset: 1, title: "Daily Sync" }),
      createAvailabilityBlock(2, 14, 16, {
        weekOffset: 1,
        title: "Optional: Industry Event",
        status: "tentative",
        responseStatus: "tentative",
      }),
      createAvailabilityBlock(3, 10, 12, { weekOffset: 1, title: "Pipeline Review" }),
      createAvailabilityBlock(4, 9, 11, { weekOffset: 1, title: "Offsite Planning" }),
      // Week after next
      createAvailabilityBlock(0, 14, 16, { weekOffset: 2, title: "Strategy Session" }),
      createAvailabilityBlock(1, 9, 10, { weekOffset: 2, title: "Morning Standup" }),
      createAvailabilityBlock(1, 13, 14, {
        weekOffset: 2,
        title: "Quick Sync",
        responseStatus: "needsAction",
      }),
      createAvailabilityBlock(2, 15, 17, { weekOffset: 2, title: "Quarterly Review Prep" }),
      createAvailabilityBlock(3, 11, 13, { weekOffset: 2, title: "Town Hall" }),
      createAvailabilityBlock(4, 10, 11, { weekOffset: 2, title: "Feedback Session" }),
    ],
  },
  {
    id: "tm-4",
    name: "Sarah Kim",
    email: "sarah@canopy.co",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    role: "interviewer",
    timezone: "America/New_York",
    availability: [
      // This week - Sarah is in EST, so early morning EU calls are late night for her
      createAvailabilityBlock(0, 6, 7, { title: "Morning Run" }),
      createAvailabilityBlock(0, 13, 14, { title: "Cross-team Sync" }),
      createAvailabilityBlock(0, 19, 20, { title: "Dinner with Team" }),
      createAvailabilityBlock(1, 11, 12, {
        title: "Optional: Yoga Class",
        status: "tentative",
        responseStatus: "tentative",
      }),
      createAvailabilityBlock(2, 14, 16, { title: "Product Demo" }),
      createAvailabilityBlock(2, 22, 23, {
        title: "Late EU Handoff Call",
        responseStatus: "needsAction",
      }),
      createAvailabilityBlock(4, 9, 11, { title: "Sprint Review" }),
      // Next week
      createAvailabilityBlock(0, 7, 8, { weekOffset: 1, title: "Early AM Standup" }),
      createAvailabilityBlock(0, 10, 12, { weekOffset: 1, title: "Feature Planning" }),
      createAvailabilityBlock(1, 14, 15, {
        weekOffset: 1,
        title: "Stakeholder Check-in",
        responseStatus: "needsAction",
      }),
      createAvailabilityBlock(2, 9, 10, { weekOffset: 1, title: "Team Standup" }),
      createAvailabilityBlock(3, 13, 15, { weekOffset: 1, title: "User Testing" }),
      createAvailabilityBlock(3, 20, 21, { weekOffset: 1, title: "APAC Engineering Sync" }),
      createAvailabilityBlock(4, 11, 12, {
        weekOffset: 1,
        title: "Optional: Book Club",
        status: "tentative",
        responseStatus: "tentative",
      }),
      // Week after next
      createAvailabilityBlock(0, 9, 10, { weekOffset: 2, title: "Morning Sync" }),
      createAvailabilityBlock(1, 10, 11, { weekOffset: 2, title: "Design Handoff" }),
      createAvailabilityBlock(2, 14, 16, { weekOffset: 2, title: "Workshop" }),
      createAvailabilityBlock(3, 9, 11, { weekOffset: 2, title: "Interview: Designer" }),
    ],
  },
  {
    id: "tm-5",
    name: "Marcus Johnson",
    email: "marcus@canopy.co",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    role: "recruiter",
    timezone: "America/Los_Angeles",
    availability: [
      // This week
      createAvailabilityBlock(0, 11, 12, { title: "Candidate Sourcing" }),
      createAvailabilityBlock(1, 15, 17, { title: "Interview Training" }),
      createAvailabilityBlock(3, 10, 11, {
        title: "Optional: HR Social",
        status: "tentative",
        responseStatus: "needsAction",
      }),
      // Next week
      createAvailabilityBlock(0, 9, 10, { weekOffset: 1, title: "Recruiting Standup" }),
      createAvailabilityBlock(1, 13, 14, { weekOffset: 1, title: "Agency Call" }),
      createAvailabilityBlock(2, 15, 17, { weekOffset: 1, title: "Career Fair Prep" }),
      createAvailabilityBlock(4, 10, 12, { weekOffset: 1, title: "Job Fair" }),
      // Week after next
      createAvailabilityBlock(1, 9, 10, { weekOffset: 2, title: "Pipeline Review" }),
      createAvailabilityBlock(2, 11, 12, { weekOffset: 2, title: "Hiring Manager Sync" }),
      createAvailabilityBlock(3, 14, 16, { weekOffset: 2, title: "Onboarding Training" }),
    ],
  },
];

// Sample candidate
const sampleCandidate = {
  id: "candidate-1",
  name: "Randy Phillips",
  email: "randy.phillips@email.com",
  avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop",
  timezone: "America/Chicago",
};

// Sample job
const sampleJob = {
  id: "job-1",
  title: "Senior Product Designer",
};

// Sample calendars
const sampleCalendars = [
  { id: "cal-1", name: "Work Calendar", email: "diego@canopy.co" },
  { id: "cal-2", name: "Interviews", email: "hiring@canopy.co" },
];

// Generate recruiter's own calendar events spanning multiple weeks (for "Your Calendar" tab)
const generateRecruiterEvents = (): RecruiterEvent[] => {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const nextWeek = addWeeks(weekStart, 1);
  const weekAfterNext = addWeeks(weekStart, 2);

  return [
    // ========== THIS WEEK ==========
    // Monday
    {
      id: "rec-0",
      title: "Early Sync (EMEA)",
      start: setMinutes(setHours(addDays(weekStart, 0), 7), 30),
      end: setMinutes(setHours(addDays(weekStart, 0), 8), 0),
      type: "meeting",
    },
    {
      id: "rec-1",
      title: "Team Standup",
      start: setMinutes(setHours(addDays(weekStart, 0), 9), 0),
      end: setMinutes(setHours(addDays(weekStart, 0), 9), 30),
      type: "meeting",
    },
    {
      id: "rec-2",
      title: "1:1 with Manager",
      start: setMinutes(setHours(addDays(weekStart, 0), 14), 0),
      end: setMinutes(setHours(addDays(weekStart, 0), 14), 30),
      type: "meeting",
    },
    {
      id: "rec-2b",
      title: "PST Team Call",
      start: setMinutes(setHours(addDays(weekStart, 0), 18), 0),
      end: setMinutes(setHours(addDays(weekStart, 0), 19), 0),
      type: "meeting",
    },
    // Tuesday
    {
      id: "rec-3",
      title: "Sarah Chen - Interview",
      start: setMinutes(setHours(addDays(weekStart, 1), 10), 0),
      end: setMinutes(setHours(addDays(weekStart, 1), 11), 0),
      type: "interview",
      color: "var(--primitive-green-500)",
    },
    {
      id: "rec-4",
      title: "Hiring Pipeline Review",
      start: setMinutes(setHours(addDays(weekStart, 1), 15), 0),
      end: setMinutes(setHours(addDays(weekStart, 1), 16), 0),
      type: "meeting",
    },
    // Wednesday
    {
      id: "rec-5",
      title: "Focus Time",
      start: setMinutes(setHours(addDays(weekStart, 2), 9), 0),
      end: setMinutes(setHours(addDays(weekStart, 2), 12), 0),
      type: "focus",
      color: "var(--primitive-neutral-500)",
    },
    {
      id: "rec-6",
      title: "Candidate Sourcing",
      start: setMinutes(setHours(addDays(weekStart, 2), 14), 0),
      end: setMinutes(setHours(addDays(weekStart, 2), 15), 30),
      type: "other",
    },
    // Thursday
    {
      id: "rec-7",
      title: "Marcus Johnson - Phone Screen",
      start: setMinutes(setHours(addDays(weekStart, 3), 11), 0),
      end: setMinutes(setHours(addDays(weekStart, 3), 11), 30),
      type: "interview",
      color: "var(--primitive-green-500)",
    },
    {
      id: "rec-8",
      title: "All-Hands Meeting",
      start: setMinutes(setHours(addDays(weekStart, 3), 16), 0),
      end: setMinutes(setHours(addDays(weekStart, 3), 17), 0),
      type: "meeting",
    },
    // Friday
    {
      id: "rec-9",
      title: "Offer Review",
      start: setMinutes(setHours(addDays(weekStart, 4), 10), 0),
      end: setMinutes(setHours(addDays(weekStart, 4), 10), 30),
      type: "meeting",
    },

    // ========== NEXT WEEK ==========
    // Monday
    {
      id: "rec-10",
      title: "Team Standup",
      start: setMinutes(setHours(addDays(nextWeek, 0), 9), 0),
      end: setMinutes(setHours(addDays(nextWeek, 0), 9), 30),
      type: "meeting",
    },
    {
      id: "rec-11",
      title: "Engineering Sync",
      start: setMinutes(setHours(addDays(nextWeek, 0), 11), 0),
      end: setMinutes(setHours(addDays(nextWeek, 0), 12), 0),
      type: "meeting",
    },
    {
      id: "rec-12",
      title: "Lunch with Candidate",
      start: setMinutes(setHours(addDays(nextWeek, 0), 12), 30),
      end: setMinutes(setHours(addDays(nextWeek, 0), 13), 30),
      type: "interview",
      color: "var(--primitive-green-500)",
    },
    // Tuesday
    {
      id: "rec-13",
      title: "Emily Wong - Final Round",
      start: setMinutes(setHours(addDays(nextWeek, 1), 10), 0),
      end: setMinutes(setHours(addDays(nextWeek, 1), 11), 30),
      type: "interview",
      color: "var(--primitive-green-500)",
    },
    {
      id: "rec-14",
      title: "Design Review",
      start: setMinutes(setHours(addDays(nextWeek, 1), 14), 0),
      end: setMinutes(setHours(addDays(nextWeek, 1), 15), 0),
      type: "meeting",
    },
    // Wednesday
    {
      id: "rec-15",
      title: "Sprint Planning",
      start: setMinutes(setHours(addDays(nextWeek, 2), 9), 0),
      end: setMinutes(setHours(addDays(nextWeek, 2), 10), 30),
      type: "meeting",
    },
    {
      id: "rec-16",
      title: "James Park - Technical",
      start: setMinutes(setHours(addDays(nextWeek, 2), 13), 0),
      end: setMinutes(setHours(addDays(nextWeek, 2), 14), 0),
      type: "interview",
      color: "var(--primitive-green-500)",
    },
    {
      id: "rec-17",
      title: "Focus Time",
      start: setMinutes(setHours(addDays(nextWeek, 2), 15), 0),
      end: setMinutes(setHours(addDays(nextWeek, 2), 17), 0),
      type: "focus",
      color: "var(--primitive-neutral-500)",
    },
    // Thursday
    {
      id: "rec-18",
      title: "Recruiter Training",
      start: setMinutes(setHours(addDays(nextWeek, 3), 9), 0),
      end: setMinutes(setHours(addDays(nextWeek, 3), 10), 0),
      type: "meeting",
    },
    {
      id: "rec-19",
      title: "1:1 with Manager",
      start: setMinutes(setHours(addDays(nextWeek, 3), 14), 0),
      end: setMinutes(setHours(addDays(nextWeek, 3), 14), 30),
      type: "meeting",
    },
    // Friday
    {
      id: "rec-20",
      title: "Rachel Kim - Portfolio Review",
      start: setMinutes(setHours(addDays(nextWeek, 4), 10), 0),
      end: setMinutes(setHours(addDays(nextWeek, 4), 11), 0),
      type: "interview",
      color: "var(--primitive-green-500)",
    },
    {
      id: "rec-21",
      title: "Weekly Wrap-up",
      start: setMinutes(setHours(addDays(nextWeek, 4), 16), 0),
      end: setMinutes(setHours(addDays(nextWeek, 4), 17), 0),
      type: "meeting",
    },

    // ========== WEEK AFTER NEXT ==========
    // Monday
    {
      id: "rec-22",
      title: "Team Standup",
      start: setMinutes(setHours(addDays(weekAfterNext, 0), 9), 0),
      end: setMinutes(setHours(addDays(weekAfterNext, 0), 9), 30),
      type: "meeting",
    },
    {
      id: "rec-23",
      title: "Alex Thompson - Onsite",
      start: setMinutes(setHours(addDays(weekAfterNext, 0), 10), 0),
      end: setMinutes(setHours(addDays(weekAfterNext, 0), 16), 0),
      type: "interview",
      color: "var(--primitive-green-500)",
    },
    // Tuesday
    {
      id: "rec-24",
      title: "Debrief Meeting",
      start: setMinutes(setHours(addDays(weekAfterNext, 1), 9), 0),
      end: setMinutes(setHours(addDays(weekAfterNext, 1), 10), 0),
      type: "meeting",
    },
    {
      id: "rec-25",
      title: "Candidate Pipeline Review",
      start: setMinutes(setHours(addDays(weekAfterNext, 1), 14), 0),
      end: setMinutes(setHours(addDays(weekAfterNext, 1), 15), 0),
      type: "meeting",
    },
    // Wednesday
    {
      id: "rec-26",
      title: "Focus Time",
      start: setMinutes(setHours(addDays(weekAfterNext, 2), 9), 0),
      end: setMinutes(setHours(addDays(weekAfterNext, 2), 12), 0),
      type: "focus",
      color: "var(--primitive-neutral-500)",
    },
    {
      id: "rec-27",
      title: "New Hire Orientation",
      start: setMinutes(setHours(addDays(weekAfterNext, 2), 13), 0),
      end: setMinutes(setHours(addDays(weekAfterNext, 2), 14), 0),
      type: "meeting",
    },
    // Thursday
    {
      id: "rec-28",
      title: "Phone Screen - Lisa Park",
      start: setMinutes(setHours(addDays(weekAfterNext, 3), 11), 0),
      end: setMinutes(setHours(addDays(weekAfterNext, 3), 11), 30),
      type: "interview",
      color: "var(--primitive-green-500)",
    },
    {
      id: "rec-29",
      title: "Quarterly Planning",
      start: setMinutes(setHours(addDays(weekAfterNext, 3), 14), 0),
      end: setMinutes(setHours(addDays(weekAfterNext, 3), 16), 0),
      type: "meeting",
    },
    // Friday
    {
      id: "rec-30",
      title: "Team Retrospective",
      start: setMinutes(setHours(addDays(weekAfterNext, 4), 10), 0),
      end: setMinutes(setHours(addDays(weekAfterNext, 4), 11), 0),
      type: "meeting",
    },
    {
      id: "rec-31",
      title: "Offer Negotiation Call",
      start: setMinutes(setHours(addDays(weekAfterNext, 4), 15), 0),
      end: setMinutes(setHours(addDays(weekAfterNext, 4), 15), 30),
      type: "meeting",
    },
  ];
};

// Simulate AI suggesting times based on availability
const simulateSuggestTimes = async (): Promise<TimeSlot[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });

  // Return 3 suggested optimal times where everyone is available
  return [
    {
      id: `suggest-${Date.now()}-1`,
      start: setMinutes(setHours(addDays(weekStart, 1), 13), 0), // Tuesday 1pm
      end: setMinutes(setHours(addDays(weekStart, 1), 14), 0),
    },
    {
      id: `suggest-${Date.now()}-2`,
      start: setMinutes(setHours(addDays(weekStart, 2), 13), 0), // Wednesday 1pm
      end: setMinutes(setHours(addDays(weekStart, 2), 14), 0),
    },
    {
      id: `suggest-${Date.now()}-3`,
      start: setMinutes(setHours(addDays(weekStart, 4), 14), 0), // Friday 2pm
      end: setMinutes(setHours(addDays(weekStart, 4), 15), 0),
    },
  ];
};

// Pre-selected interviewers (with availability data)
const initialAttendees: Attendee[] = [
  sampleTeamMembers[0], // Diego Navarro
  sampleTeamMembers[2], // Oliver Bennett
];

// Pipeline stage configuration using semantic tokens
const pipelineStages = [
  { name: "Applied", status: "completed" },
  { name: "Phone Screen", status: "completed" },
  { name: "Interview", status: "current" },
  { name: "Offer", status: "pending" },
  { name: "Hired", status: "pending" },
] as const;

const getStageClasses = (status: "completed" | "current" | "pending") => {
  switch (status) {
    case "current":
      return "bg-[var(--background-brand)] text-[var(--foreground-on-emphasis)]";
    case "completed":
      return "bg-[var(--background-brand-subtle)] text-[var(--foreground-brand)]";
    case "pending":
      return "bg-[var(--background-muted)] text-[var(--foreground-muted)]";
  }
};

export default function InterviewSchedulingDemoPage() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [lastScheduledData, setLastScheduledData] = React.useState<Record<string, unknown> | null>(
    null
  );

  const handleSchedule = (data: unknown) => {
    // eslint-disable-next-line no-console
    console.log("Interview scheduled:", data);
    setLastScheduledData(data as Record<string, unknown>);
    setIsOpen(false);
  };

  const handlePreview = (data: unknown) => {
    // eslint-disable-next-line no-console
    console.log("Preview requested:", data);
    // In production, this would navigate to a preview step
    handleSchedule(data);
  };

  return (
    <div className="min-h-screen bg-[var(--background-subtle)]">
      {/* Header */}
      <header className="border-b border-[var(--border-muted)] bg-[var(--background-default)]">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-[var(--foreground-default)]">
                Interview Scheduling
              </h1>
              <p className="text-sm text-[var(--foreground-muted)]">
                Enhanced with UX improvements
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-6 py-8">
        {/* Demo Card */}
        <Card className="overflow-hidden">
          <CardHeader className="flex-row items-center gap-4 border-b border-[var(--border-muted)] p-5">
            <Avatar src={sampleCandidate.avatar} name={sampleCandidate.name} size="lg" />
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-semibold text-[var(--foreground-default)]">
                {sampleCandidate.name}
              </h3>
              <p className="text-sm text-[var(--foreground-muted)]">{sampleCandidate.email}</p>
              <p className="mt-0.5 text-sm text-[var(--foreground-muted)]">
                Applied for{" "}
                <span className="font-medium text-[var(--foreground-default)]">
                  {sampleJob.title}
                </span>
              </p>
            </div>
            <Button
              onClick={() => setIsOpen(true)}
              leftIcon={<CalendarPlus size={18} weight="bold" />}
            >
              Schedule Interview
            </Button>
          </CardHeader>

          {/* Pipeline stages visualization */}
          <CardContent className="bg-[var(--background-subtle)] px-5 py-4">
            <div className="flex items-center gap-2">
              {pipelineStages.map((stage, i) => (
                <React.Fragment key={stage.name}>
                  <div
                    className={`rounded-full px-3 py-1.5 text-xs font-medium ${getStageClasses(stage.status)}`}
                  >
                    {stage.name}
                  </div>
                  {i < pipelineStages.length - 1 && (
                    <div className="h-[2px] w-8 bg-[var(--background-emphasized)]" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* UX Improvements Summary */}
        <Banner
          type="success"
          subtle
          dismissible={false}
          title="UX Improvements Implemented"
          description={
            <div className="mt-3 grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle
                    size={14}
                    weight="fill"
                    className="mt-0.5 flex-shrink-0 text-[var(--foreground-success)]"
                  />
                  <span>
                    <strong>Visual selection feedback</strong> — Selected slots highlighted on
                    calendar with checkmark and duration block
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle
                    size={14}
                    weight="fill"
                    className="mt-0.5 flex-shrink-0 text-[var(--foreground-success)]"
                  />
                  <span>
                    <strong>Duration preview on hover</strong> — See full time block before clicking
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle
                    size={14}
                    weight="fill"
                    className="mt-0.5 flex-shrink-0 text-[var(--foreground-success)]"
                  />
                  <span>
                    <strong>30-min granularity indicators</strong> — Dashed lines separate half-hour
                    slots
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle
                    size={14}
                    weight="fill"
                    className="mt-0.5 flex-shrink-0 text-[var(--foreground-success)]"
                  />
                  <span>
                    <strong>Role labels for all attendees</strong> — Candidate, Interviewer, Hiring
                    Manager, Recruiter
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle
                    size={14}
                    weight="fill"
                    className="mt-0.5 flex-shrink-0 text-[var(--foreground-success)]"
                  />
                  <span>
                    <strong>Prominent &quot;Add interviewer&quot; button</strong> — Dashed border,
                    clearer affordance
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle
                    size={14}
                    weight="fill"
                    className="mt-0.5 flex-shrink-0 text-[var(--foreground-success)]"
                  />
                  <span>
                    <strong>Internal notes indicator</strong> — Badge shows when notes exist
                    (collapsed)
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle
                    size={14}
                    weight="fill"
                    className="mt-0.5 flex-shrink-0 text-[var(--foreground-success)]"
                  />
                  <span>
                    <strong>Calendar selector moved up</strong> — More visible in form hierarchy
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle
                    size={14}
                    weight="fill"
                    className="mt-0.5 flex-shrink-0 text-[var(--foreground-success)]"
                  />
                  <span>
                    <strong>Today button highlights</strong> — Emphasized when outside current view
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle
                    size={14}
                    weight="fill"
                    className="mt-0.5 flex-shrink-0 text-[var(--foreground-success)]"
                  />
                  <span>
                    <strong>Scroll fade indicators</strong> — Know when more content exists
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle
                    size={14}
                    weight="fill"
                    className="mt-0.5 flex-shrink-0 text-[var(--foreground-success)]"
                  />
                  <span>
                    <strong>&quot;Preview &amp; Send&quot; button</strong> — Clear next action with
                    icon
                  </span>
                </div>
              </div>
            </div>
          }
        />

        {/* New Calendar Features */}
        <Banner
          type="feature"
          subtle
          dismissible={false}
          icon={<CalendarBlank weight="fill" />}
          title="New Calendar Features"
          actionLabel="View full Recruiter Calendar demo"
          onAction={() => (window.location.href = "/demo/recruiter-calendar")}
          description={
            <div className="mt-3 grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Lightning
                    size={14}
                    weight="fill"
                    className="mt-0.5 flex-shrink-0 text-[var(--primitive-purple-600)]"
                  />
                  <span>
                    <strong>&quot;Suggest times&quot; AI button</strong> — Automatically finds
                    optimal times when everyone is free
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Eye size={14} className="mt-0.5 flex-shrink-0 text-[var(--foreground-info)]" />
                  <span>
                    <strong>&quot;Your Calendar&quot; tab</strong> — See your own schedule while
                    picking interview times
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle
                    size={14}
                    weight="fill"
                    className="mt-0.5 flex-shrink-0 text-[var(--foreground-info)]"
                  />
                  <span>
                    <strong>Calendar overlay toggle</strong> — Transpose your calendar over team
                    availability
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle
                    size={14}
                    weight="fill"
                    className="mt-0.5 flex-shrink-0 text-[var(--foreground-info)]"
                  />
                  <span>
                    <strong>Tab-based interface</strong> — Switch between &quot;Find a Time&quot;
                    and &quot;Your Calendar&quot; views
                  </span>
                </div>
              </div>
            </div>
          }
        />

        {/* Accessibility Features */}
        <Card className="p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[var(--foreground-default)]">
            <Eye size={18} />
            Accessibility Improvements
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-[var(--border-muted)] bg-[var(--background-subtle)] p-4">
              <div className="mb-2 flex items-center gap-2">
                <div className="relative h-4 w-4 rounded border border-[var(--border-brand)] bg-[var(--background-brand-subtle)]">
                  <CheckCircle
                    size={10}
                    weight="fill"
                    className="absolute -right-0.5 -top-0.5 text-[var(--foreground-success)]"
                  />
                </div>
                <span className="text-sm font-medium">Available</span>
              </div>
              <p className="text-xs text-[var(--foreground-muted)]">
                Solid green with checkmark icon in legend. Everyone is free.
              </p>
            </div>
            <div className="rounded-lg border border-[var(--border-muted)] bg-[var(--background-subtle)] p-4">
              <div className="mb-2 flex items-center gap-2">
                <div className="relative h-4 w-4 rounded border border-[var(--border-warning)] bg-[var(--background-warning)]">
                  <Warning
                    size={10}
                    weight="fill"
                    className="absolute -right-0.5 -top-0.5 text-[var(--foreground-warning)]"
                  />
                </div>
                <span className="text-sm font-medium">Partial</span>
              </div>
              <p className="text-xs text-[var(--foreground-muted)]">
                Yellow with warning icon + diagonal stripe pattern for color-blind users.
              </p>
            </div>
            <div className="rounded-lg border border-[var(--border-muted)] bg-[var(--background-subtle)] p-4">
              <div className="mb-2 flex items-center gap-2">
                <div className="relative h-4 w-4 rounded border border-[var(--border-default)] bg-[var(--background-muted)]">
                  <XCircle
                    size={10}
                    weight="fill"
                    className="absolute -right-0.5 -top-0.5 text-[var(--foreground-muted)]"
                  />
                </div>
                <span className="text-sm font-medium">Busy</span>
              </div>
              <p className="text-xs text-[var(--foreground-muted)]">
                Gray with X icon + horizontal lines pattern for color-blind users.
              </p>
            </div>
          </div>
          <Banner
            type="info"
            subtle
            dismissible={false}
            hideIcon
            title="Touch targets"
            description="All removal buttons (×) have minimum 24×24px touch area. Modal close button is 36×36px."
            className="mt-4"
          />
        </Card>

        {/* Candidate Preview Card */}
        <Card className="p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[var(--foreground-default)]">
            <Clock size={18} />
            Candidate Experience Preview
          </h3>
          <Banner
            type="info"
            subtle
            dismissible={false}
            icon={<Eye />}
            title="New: Candidate will see"
            description="When you select time slots, a preview card appears showing what the candidate will receive: '3 time options to choose from (60 min each). They'll pick their preferred slot and confirm.'"
          />
        </Card>

        {/* Last scheduled data */}
        {lastScheduledData && (
          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold text-[var(--foreground-default)]">
              Last Scheduled Data
            </h3>
            <pre className="overflow-auto rounded-lg bg-[var(--background-subtle)] p-4 text-xs text-[var(--foreground-muted)]">
              {JSON.stringify(lastScheduledData, null, 2)}
            </pre>
          </Card>
        )}

        {/* Implementation notes */}
        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold text-[var(--foreground-default)]">
            Technical Implementation
          </h3>
          <ul className="space-y-2 text-sm text-[var(--foreground-muted)]">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-[var(--foreground-success)]">•</span>
              <span>
                Attendees have simulated availability data with overlapping schedules—add team
                members to see conflicts
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-[var(--foreground-success)]">•</span>
              <span>
                Click the <strong>&quot;Calendars&quot;</strong> toggle to see each attendee&apos;s
                busy blocks as colored overlays
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-[var(--foreground-success)]">•</span>
              <span>Hover over partial (orange) slots to see who&apos;s busy in the tooltip</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-[var(--foreground-success)]">•</span>
              <span>Duration block preview appears on hover before clicking (blue highlight)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-[var(--foreground-success)]">•</span>
              <span>Candidate cannot be removed from attendees list (protected)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-[var(--foreground-success)]">•</span>
              <span>
                Available slots now use neutral white/gray instead of green for less visual noise
              </span>
            </li>
          </ul>
        </Card>
      </main>

      {/* The modal */}
      <InterviewSchedulingModal
        open={isOpen}
        onOpenChange={setIsOpen}
        candidate={sampleCandidate}
        job={sampleJob}
        initialAttendees={initialAttendees}
        teamMembers={sampleTeamMembers}
        calendars={sampleCalendars}
        myCalendarEvents={generateRecruiterEvents()}
        defaults={{
          duration: 60,
          videoProvider: "google-meet",
          workingHoursStart: 0,
          workingHoursEnd: 24,
        }}
        onSchedule={handleSchedule}
        onPreview={handlePreview}
        onSuggestTimes={simulateSuggestTimes}
      />
    </div>
  );
}
