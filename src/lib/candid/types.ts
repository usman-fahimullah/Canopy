// Candid Platform Types

export type CandidRole = "seeker" | "mentor" | "coach";

export type Sector =
  | "climate-tech"
  | "clean-energy"
  | "policy"
  | "finance"
  | "nonprofit"
  | "corporate-sustainability"
  | "agriculture"
  | "transportation";

export type SessionStatus = "scheduled" | "completed" | "cancelled" | "no-show";

export type SessionType = "coaching" | "mock-interview" | "resume-review" | "career-planning" | "networking";

export interface CandidUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: CandidRole;
  avatar?: string;
  bio?: string;
  linkedIn?: string;
  location?: string;
  timezone?: string;
  createdAt: Date;
  isFoundingMember?: boolean;
}

export interface CandidSeeker extends CandidUser {
  role: "seeker";
  targetSectors: Sector[];
  currentRole?: string;
  currentCompany?: string;
  yearsExperience: number;
  goals: string[];
  skills: string[];
  greenSkills?: string[];
  certifications?: string[];
  cohort?: string;
  matchedCoachId?: string;
  matchedMentorIds?: string[];
}

export interface CandidMentor extends CandidUser {
  role: "mentor";
  sectors: Sector[];
  currentRole: string;
  currentCompany: string;
  expertise: string[];
  availableFor: ("resume-review" | "mock-interview" | "q-and-a" | "peer-support")[];
  menteeCount: number;
  rating?: number;
  reviewCount?: number;
}

export interface CandidCoach extends CandidUser {
  role: "coach";
  sectors: Sector[];
  currentRole: string;
  currentCompany: string;
  previousRoles: { title: string; company: string; years: number }[];
  expertise: string[];
  sessionTypes: SessionType[];
  hourlyRate?: number;
  monthlyRate?: number;
  availability: WeeklyAvailability;
  menteeCount: number;
  rating: number;
  reviewCount: number;
  successStories?: number;
  isFeatured?: boolean;
}

export interface WeeklyAvailability {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

export interface TimeSlot {
  start: string; // "09:00"
  end: string; // "10:00"
}

export interface Session {
  id: string;
  menteeId: string;
  mentorId: string;
  mentorRole: "coach" | "mentor";
  type: SessionType;
  status: SessionStatus;
  scheduledAt: Date;
  duration: number; // minutes
  meetingLink?: string;
  notes?: string;
  feedback?: SessionFeedback;
  price?: number;
}

export interface SessionFeedback {
  rating: number;
  comment?: string;
  wouldRecommend: boolean;
  submittedAt: Date;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  readAt?: Date;
  attachments?: Attachment[];
}

export interface MessageThread {
  id: string;
  participantIds: string[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: "guide" | "template" | "video" | "article";
  sector?: Sector;
  url: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: "session-reminder" | "new-message" | "match-found" | "feedback-request" | "cohort-update";
  title: string;
  body: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

// Dashboard Stats
export interface MenteeStats {
  sessionsCompleted: number;
  upcomingSessions: number;
  messagesUnread: number;
  resourcesViewed: number;
  daysInProgram: number;
}

export interface CoachStats {
  totalMentees: number;
  sessionsThisMonth: number;
  upcomingSessions: number;
  averageRating: number;
  earningsThisMonth: number;
}

export interface LightMentorStats {
  menteesHelped: number;
  activitiesThisMonth: number;
  upcomingSessions: number;
  averageRating: number;
}

// Sector display info
export const SECTOR_INFO: Record<Sector, { label: string; color: string; icon: string }> = {
  "climate-tech": { label: "Climate Tech", color: "green", icon: "cpu" },
  "clean-energy": { label: "Clean Energy", color: "yellow", icon: "lightning" },
  "policy": { label: "Policy & Government", color: "blue", icon: "bank" },
  "finance": { label: "Climate Finance", color: "purple", icon: "chart-line" },
  "nonprofit": { label: "Nonprofit & NGO", color: "orange", icon: "heart" },
  "corporate-sustainability": { label: "Corporate Sustainability", color: "teal", icon: "buildings" },
  "agriculture": { label: "Sustainable Agriculture", color: "lime", icon: "plant" },
  "transportation": { label: "Clean Transportation", color: "sky", icon: "car" },
};
