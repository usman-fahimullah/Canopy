export interface Mentor {
  id: string;
  name: string;
  avatar: string | null;
  role: string;
  company: string;
  headline: string;
  bio: string;
  specialties: string[];
  yearsExperience: number;
  matchScore: number;
  matchReasons: MatchReason[];
}

export interface MatchReason {
  label: string;
  description: string;
}

export type MentorFilterType = "all" | "recommended" | "available";

export interface MyMentorData {
  id: string;
  mentorId: string;
  status: "active" | "pending" | "completed";
  mentor: {
    id: string;
    name: string;
    avatar: string | null;
    headline: string;
    specialties: string[];
  };
  startedAt: string;
  lastSessionAt: string | null;
}
