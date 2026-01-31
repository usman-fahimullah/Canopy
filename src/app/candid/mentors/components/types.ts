export type MentorBadgeType = "top_mentor" | "quick_responder" | "featured";
export type MatchQuality = "good_match" | "great_match";
export type MatchReasonType = "shared_interest" | "common_skill" | "ask_about";
export type MentorFilterType = "all" | "recommended" | "available";
export type MentorshipTabType = "find" | "my_mentors" | "my_mentees";

export interface MatchReason {
  type: MatchReasonType;
  description: string;
  highlight: string;
}

export interface Mentor {
  id: string;
  accountId: string;
  name: string;
  avatar: string | null;
  role: string;
  specialty: string | null;
  location: string | null;
  rating: number;
  experienceYears: number | null;
  menteeCount: number;
  badge: MentorBadgeType | null;
  matchQuality: MatchQuality | null;
  bio: string | null;
  mentorTopics: string[];
  skills: string[];
  greenSkills: string[];
  matchReasons: MatchReason[];
}

export interface MyMentorData {
  id: string;
  assignmentId: string;
  name: string;
  avatar: string | null;
  role: string;
  specialty: string | null;
  status: "PENDING" | "ACTIVE" | "PAUSED" | "COMPLETED";
  startedAt: string;
  accountId: string;
}

export interface MyMenteeData {
  id: string;
  assignmentId: string;
  name: string;
  avatar: string | null;
  goal: string | null;
  status: "PENDING" | "ACTIVE" | "PAUSED" | "COMPLETED";
  startedAt: string;
  accountId: string;
}
