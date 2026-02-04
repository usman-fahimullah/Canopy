/**
 * Shared Coaching & Mentoring Types
 *
 * Single source of truth for types used across the Jobs shell (job seeker
 * coaching experience) and the Candid Coach shell (coach management).
 *
 * Consolidates types previously scattered across page-level components.
 */

// ---------------------------------------------------------------------------
// Enums & Literal Types
// ---------------------------------------------------------------------------

/** Climate sectors for coaching specialization */
export type Sector =
  | "climate-tech"
  | "clean-energy"
  | "policy"
  | "finance"
  | "nonprofit"
  | "corporate-sustainability"
  | "agriculture"
  | "transportation";

/** User roles within the coaching platform */
export type CoachingRole = "seeker" | "mentor" | "coach";

/** Session lifecycle status */
export type SessionStatus = "scheduled" | "completed" | "cancelled" | "no-show";

/** Types of coaching sessions offered */
export type SessionType =
  | "coaching"
  | "mock-interview"
  | "resume-review"
  | "career-planning"
  | "networking";

/** Mentor badge types for recognition */
export type MentorBadgeType = "top_mentor" | "quick_responder" | "featured";

/** Match quality indicators */
export type MatchQuality = "good_match" | "great_match";

/** Types of match reasons */
export type MatchReasonType = "shared_interest" | "common_skill" | "ask_about";

/** Filter options for mentor browse */
export type MentorFilterType = "all" | "recommended" | "available";

/** Mentoring tab options */
export type MentorshipTabType = "find" | "my_mentors" | "my_mentees";

/** Mentorship assignment status */
export type MentorshipStatus = "PENDING" | "ACTIVE" | "PAUSED" | "COMPLETED";

/** Session view mode */
export type SessionViewMode = "list" | "calendar";

/** Coach browse view mode */
export type BrowseViewMode = "grid" | "list";

/** Session filter status */
export type SessionFilterStatus = "all" | "SCHEDULED" | "COMPLETED" | "CANCELLED";

// ---------------------------------------------------------------------------
// Core Entities
// ---------------------------------------------------------------------------

/** Base user fields shared across all coaching platform users */
export interface CoachingUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
  bio?: string | null;
  linkedIn?: string | null;
  location?: string | null;
  timezone?: string | null;
  createdAt: string;
  isFoundingMember?: boolean;
}

/** Coach profile as returned by /api/coaches */
export interface Coach extends CoachingUser {
  headline?: string | null;
  sectors: Sector[];
  currentRole?: string;
  currentCompany?: string;
  expertise: string[];
  sessionTypes?: SessionType[];
  hourlyRate?: number;
  sessionRate?: number;
  sessionDuration?: number;
  availability?: WeeklyAvailability;
  menteeCount: number;
  rating: number;
  reviewCount: number;
  totalSessions?: number;
  successStories?: number;
  isFeatured?: boolean;
  yearsInClimate?: number;
}

/** Mentor profile for the mentoring browse experience */
export interface Mentor {
  id: string;
  accountId: string;
  name: string;
  avatar: string | null;
  role: string;
  company?: string;
  headline?: string;
  specialty: string | null;
  location: string | null;
  bio: string | null;
  rating: number;
  experienceYears: number | null;
  menteeCount: number;
  badge: MentorBadgeType | null;
  matchQuality: MatchQuality | null;
  matchScore?: number;
  mentorTopics: string[];
  skills: string[];
  greenSkills: string[];
  specialties?: string[];
  matchReasons: MatchReason[];
}

/** Reason a mentor/coach is a match for a seeker */
export interface MatchReason {
  type?: MatchReasonType;
  label?: string;
  description: string;
  highlight?: string;
}

// ---------------------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------------------

/** Core session entity */
export interface Session {
  id: string;
  menteeId?: string;
  mentorId?: string;
  mentorRole?: "coach" | "mentor";
  type?: SessionType;
  title?: string;
  status: SessionStatus;
  scheduledAt: string;
  duration: number;
  meetingLink?: string | null;
  notes?: string | null;
  feedback?: SessionFeedback | null;
  price?: number;
  hasReview?: boolean;
  coach?: SessionParticipant;
  mentee?: SessionParticipant;
  mentor?: SessionParticipant;
}

/** Participant info embedded in a session */
export interface SessionParticipant {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string | null;
  photoUrl?: string | null;
  headline?: string | null;
}

/** Feedback left after a session */
export interface SessionFeedback {
  rating: number;
  comment?: string;
  wouldRecommend?: boolean;
  submittedAt: string;
}

/** Action item from a coaching session */
export interface SessionActionItem {
  id: string;
  description: string;
  status: "PENDING" | "COMPLETED";
  dueDate?: string | null;
  completedAt?: string | null;
  createdAt: string;
}

/** Detailed session view (for session detail page) */
export interface SessionDetail extends Session {
  videoLink?: string | null;
  menteeMessage?: string | null;
  coachNotes?: string | null;
  cancellationReason?: string | null;
  cancelledAt?: string | null;
  completedAt?: string | null;
  sessionNumber?: number;
  booking?: {
    type: SessionType;
    notes?: string;
  };
  review?: {
    rating: number;
    comment: string;
    createdAt: string;
  } | null;
  actionItems?: SessionActionItem[];
}

// ---------------------------------------------------------------------------
// Availability & Scheduling
// ---------------------------------------------------------------------------

/** Weekly availability schedule for a coach or mentor */
export interface WeeklyAvailability {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

/** A single time slot */
export interface TimeSlot {
  start: string; // "09:00"
  end: string; // "10:00"
}

/** An available slot for booking */
export interface AvailableSlot {
  date: string;
  startTime: string;
  endTime: string;
}

// ---------------------------------------------------------------------------
// Mentoring Assignments
// ---------------------------------------------------------------------------

/** A seeker's active mentoring relationship */
export interface MyMentorData {
  id: string;
  assignmentId: string;
  mentorId?: string;
  name: string;
  avatar: string | null;
  role: string;
  specialty: string | null;
  headline?: string;
  specialties?: string[];
  status: MentorshipStatus;
  startedAt: string;
  lastSessionAt?: string | null;
  accountId: string;
}

/** A mentor's active mentee relationship */
export interface MyMenteeData {
  id: string;
  assignmentId: string;
  name: string;
  avatar: string | null;
  goal: string | null;
  status: MentorshipStatus;
  startedAt: string;
  accountId: string;
}

// ---------------------------------------------------------------------------
// Messaging
// ---------------------------------------------------------------------------

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  content: string;
  createdAt: string;
  readAt?: string | null;
  attachments?: Attachment[];
}

export interface MessageThread {
  id: string;
  participantIds: string[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

// ---------------------------------------------------------------------------
// Dashboard Stats
// ---------------------------------------------------------------------------

/** Stats for job seeker coaching dashboard */
export interface SeekerStats {
  sessionsCompleted: number;
  upcomingSessions: number;
  messagesUnread: number;
  resourcesViewed: number;
  daysInProgram: number;
}

/** Stats for coach dashboard */
export interface CoachStats {
  totalMentees: number;
  sessionsThisMonth: number;
  upcomingSessions: number;
  averageRating: number;
  earningsThisMonth: number;
}

/** Coach earnings data */
export interface EarningsData {
  totalEarnings: number;
  totalSessions: number;
  monthlyBreakdown: MonthlyBreakdown[];
  pendingPayouts: {
    amount: number;
    count: number;
  };
}

export interface MonthlyBreakdown {
  month: string;
  earnings: number;
  sessions: number;
}

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

export interface Review {
  id: string;
  rating: number;
  comment: string;
  coachResponse?: string | null;
  reviewerName: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

export interface CoachingNotification {
  id: string;
  userId: string;
  type:
    | "session-reminder"
    | "new-message"
    | "match-found"
    | "feedback-request"
    | "cohort-update"
    | "booking-request";
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

// ---------------------------------------------------------------------------
// Resources
// ---------------------------------------------------------------------------

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: "guide" | "template" | "video" | "article";
  sector?: Sector;
  url: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Sector Display Constants
// ---------------------------------------------------------------------------

export const SECTOR_INFO: Record<Sector, { label: string; color: string; icon: string }> = {
  "climate-tech": { label: "Climate Tech", color: "green", icon: "cpu" },
  "clean-energy": { label: "Clean Energy", color: "yellow", icon: "lightning" },
  policy: { label: "Policy & Government", color: "blue", icon: "bank" },
  finance: { label: "Climate Finance", color: "purple", icon: "chart-line" },
  nonprofit: { label: "Nonprofit & NGO", color: "orange", icon: "heart" },
  "corporate-sustainability": {
    label: "Corporate Sustainability",
    color: "teal",
    icon: "buildings",
  },
  agriculture: { label: "Sustainable Agriculture", color: "lime", icon: "plant" },
  transportation: { label: "Clean Transportation", color: "sky", icon: "car" },
};

// ---------------------------------------------------------------------------
// Booking
// ---------------------------------------------------------------------------

/** Data collected by the booking wizard for session creation */
export interface BookingData {
  coachId: string;
  scheduledAt: string; // ISO datetime
  duration: number; // minutes
  sessionType: SessionType;
  notes?: string;
  prepItems?: string[];
}

/** Session type display info */
export const SESSION_TYPE_INFO: Record<
  SessionType,
  { label: string; description: string; defaultDuration: number }
> = {
  coaching: {
    label: "Coaching Session",
    description: "One-on-one coaching with your matched coach",
    defaultDuration: 60,
  },
  "mock-interview": {
    label: "Mock Interview",
    description: "Practice interview with feedback",
    defaultDuration: 45,
  },
  "resume-review": {
    label: "Resume Review",
    description: "Get expert feedback on your resume",
    defaultDuration: 30,
  },
  "career-planning": {
    label: "Career Planning",
    description: "Map your climate career trajectory",
    defaultDuration: 60,
  },
  networking: {
    label: "Networking Call",
    description: "Build connections in the climate sector",
    defaultDuration: 30,
  },
};
