/**
 * Shared types for interview scheduling components.
 *
 * These types are used across:
 * - InterviewSchedulingModal (attendee management, time slots)
 * - Scheduler (calendar events, views)
 * - RecruiterCalendar (calendar events, filters)
 */

/* ============================================
   Interview Scheduling Types
   ============================================ */

export interface Attendee {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "candidate" | "interviewer" | "hiring-manager" | "recruiter";
  timezone?: string;
  calendarStatus?: "loading" | "loaded" | "error";
  availability?: AttendeeAvailability[];
}

export interface AttendeeAvailability {
  start: Date;
  end: Date;
  status: "free" | "busy" | "tentative";
  /** Event title (e.g., "Team Standup", "1:1 with Manager") */
  title?: string;
  /** Response status - indicates how important the event is to the person */
  responseStatus?: "accepted" | "tentative" | "needsAction" | "declined";
}

export interface InterviewTimeSlot {
  id: string;
  start: Date;
  end: Date;
}

/** Your own calendar event (for overlay) */
export interface RecruiterEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type?: "meeting" | "focus" | "interview" | "other";
  color?: string;
}

export interface InterviewSchedulingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    timezone?: string;
  };
  job?: {
    id: string;
    title: string;
  };
  initialAttendees?: Attendee[];
  defaults?: {
    duration?: number;
    videoProvider?: "google-meet" | "zoom" | "microsoft-teams" | "none";
    workingHoursStart?: number;
    workingHoursEnd?: number;
  };
  onSchedule?: (data: {
    title: string;
    attendees: Attendee[];
    timeSlots: InterviewTimeSlot[];
    duration: number;
    videoProvider: string;
    instructions?: string;
    internalNotes?: string;
    calendarId?: string;
  }) => void;
  onPreview?: (data: unknown) => void;
  onSuggestTimes?: () => Promise<InterviewTimeSlot[]>;
  teamMembers?: Attendee[];
  calendars?: { id: string; name: string; email: string }[];
  /** Your calendar events (recruiter's events for overlay display) */
  myCalendarEvents?: RecruiterEvent[];
  className?: string;
}

/* ============================================
   Scheduler Types
   ============================================ */

export type InterviewType = "video" | "phone" | "onsite";

export interface SchedulerEvent {
  id: string;
  title: string;
  start: Date | string;
  end: Date | string;
  type?: InterviewType;
  candidateId?: string;
  candidateName?: string;
  candidateAvatar?: string;
  jobId?: string;
  jobTitle?: string;
  interviewers?: { id: string; name: string; avatar?: string }[];
  location?: string;
  meetingLink?: string;
  notes?: string;
  color?: string;
}

export interface SchedulerProps {
  events: SchedulerEvent[];
  view?: "week" | "day" | "month";
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
  onEventClick?: (event: SchedulerEvent) => void;
  onSlotClick?: (start: Date, end: Date) => void;
  onEventCreate?: (event: Partial<SchedulerEvent>) => void;
  onEventUpdate?: (event: SchedulerEvent) => void;
  className?: string;
  /** Start hour of day (0-23) */
  startHour?: number;
  /** End hour of day (0-23) */
  endHour?: number;
  /** Slot duration in minutes */
  slotDuration?: number;
  /** Timezone for display (IANA format) */
  timezone?: string;
  /** Show timezone selector */
  showTimezoneSelector?: boolean;
}

export interface WeekViewProps extends SchedulerProps {}
export interface DayViewProps extends SchedulerProps {}
export interface MonthViewProps extends SchedulerProps {}

/** Available time slot for booking (Calendly-style picker) */
export interface BookingTimeSlot {
  start: Date;
  end: Date;
  available: boolean;
}

/* ============================================
   Recruiter Calendar Types
   ============================================ */

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date | string;
  end: Date | string;
  type?:
    | "interview"
    | "meeting"
    | "block"
    | "interview-video"
    | "interview-phone"
    | "interview-onsite";
  status?: "confirmed" | "tentative" | "cancelled";
  candidateId?: string;
  candidateName?: string;
  candidateAvatar?: string;
  jobId?: string;
  jobTitle?: string;
  interviewers?: {
    id: string;
    name: string;
    avatar?: string;
    role?: string;
  }[];
  location?: string;
  meetingLink?: string;
  notes?: string;
  color?: string;
  isAllDay?: boolean;
}

export interface CalendarFilter {
  id: string;
  label: string;
  color: string;
  enabled: boolean;
}

export interface CalendarConfig {
  id: string;
  name: string;
  email: string;
  color: string;
  visible: boolean;
}

export interface RecruiterCalendarViewProps {
  events?: CalendarEvent[];
  calendars?: CalendarConfig[];
  initialView?: "day" | "week" | "month";
  initialDate?: Date;
  onEventClick?: (event: CalendarEvent) => void;
  onSlotClick?: (start: Date, end: Date) => void;
  onCreateEvent?: () => void;
  timezone?: string;
  className?: string;
}
