import * as React from "react";

// ============================================
// SHARED TYPES — Role Edit Page
// ============================================

export interface FieldConfig {
  visible: boolean;
  required: boolean;
}

export interface PersonalDetailsConfig {
  name: FieldConfig;
  email: FieldConfig;
  dateOfBirth: FieldConfig;
  pronouns: FieldConfig;
  location: FieldConfig;
}

export interface CareerDetailsConfig {
  currentRole: FieldConfig;
  currentCompany: FieldConfig;
  yearsExperience: FieldConfig;
  linkedIn: FieldConfig;
  portfolio: FieldConfig;
}

export interface FormQuestion {
  id: string;
  type: "text" | "yes-no" | "multiple-choice" | "file-upload";
  title: string;
  required: boolean;
  description?: string;
  options?: string[];
}

export interface ApplicationScoreData {
  id: string;
  overallRating: number;
  recommendation: "STRONG_YES" | "YES" | "NEUTRAL" | "NO" | "STRONG_NO";
  scorer: {
    id: string;
    account: { name: string | null; avatar: string | null };
  };
}

export interface ApplicationInterviewData {
  id: string;
  scheduledAt: string;
  status: string;
}

export interface ApplicationData {
  id: string;
  stage: string;
  stageOrder: number;
  matchScore: number | null;
  matchReasons: string | null;
  source: string | null;
  coverLetter: string | null;
  formResponses: string | null;
  knockoutPassed: boolean;
  rejectedAt: string | null;
  hiredAt: string | null;
  createdAt: string;
  updatedAt: string;
  seeker: {
    id: string;
    headline: string | null;
    resumeUrl: string | null;
    skills: string[];
    greenSkills: string[];
    certifications: string[];
    yearsExperience: number | null;
    account: {
      id: string;
      name: string | null;
      email: string;
      avatar: string | null;
    };
    notes?: Array<{
      id: string;
      content: string;
      createdAt: string;
    }>;
  };
  scores?: ApplicationScoreData[];
  interviews?: ApplicationInterviewData[];
}

export interface JobData {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string | null;
  locationType: string;
  employmentType: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  climateCategory: string | null;
  impactDescription: string | null;
  requiredCerts: string[];
  greenSkills: string[];
  experienceLevel: string | null;
  status: string;
  publishedAt: string | null;
  closesAt: string | null;
  stages: { id: string; name: string; phaseGroup?: string }[];
  formConfig: Record<string, unknown> | null;
  formQuestions: FormQuestion[] | null;
  syndicationEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  // Assignment fields (from proper FK columns)
  recruiterId?: string | null;
  hiringManagerId?: string | null;
  recruiter?: { id: string; account: { name: string | null; avatar: string | null } } | null;
  hiringManager?: { id: string; account: { name: string | null; avatar: string | null } } | null;
  reviewerAssignments?: Array<{
    id: string;
    member: { id: string; account: { name: string | null; avatar: string | null } };
  }>;
}

export interface SortableQuestionItemProps {
  question: FormQuestion;
  onEdit: (id: string, type: string) => void;
  onDelete: (id: string) => void;
  getIconWithBg: (type: string) => React.ReactNode;
}
