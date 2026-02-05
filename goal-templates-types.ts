/**
 * Goal Templates System - TypeScript Types & Data Structures
 *
 * This file defines the types needed to implement the enhanced goals system
 * with templates, contextual suggestions, and guided onboarding.
 */

// =============================================================================
// CATEGORY TYPES (Extended from existing)
// =============================================================================

export type GoalCategoryKey =
  | "NETWORKING"
  | "INTERVIEWING"
  | "SKILLS"
  | "PORTFOLIO"
  | "RESEARCH"
  | "COMPENSATION"
  | "WELLNESS"
  | "ORGANIZATION";

export interface GoalCategoryConfig {
  key: GoalCategoryKey;
  label: string;
  icon: string; // Phosphor icon name
  emoji: string; // For quick display
  description: string;
  bg: string;
  tint: string;
  progress: string;
  text: string;
}

export const EXTENDED_GOAL_CATEGORIES: Record<GoalCategoryKey, GoalCategoryConfig> = {
  NETWORKING: {
    key: "NETWORKING",
    label: "Networking",
    icon: "Handshake",
    emoji: "🤝",
    description: "Build connections and expand your professional network",
    bg: "bg-[var(--primitive-blue-100)]",
    tint: "bg-[var(--primitive-blue-200)]",
    progress: "bg-[var(--primitive-blue-500)]",
    text: "text-[var(--primitive-blue-700)]",
  },
  INTERVIEWING: {
    key: "INTERVIEWING",
    label: "Interviewing",
    icon: "ChatCircle",
    emoji: "💬",
    description: "Prepare for and ace your interviews",
    bg: "bg-[var(--primitive-orange-100)]",
    tint: "bg-[var(--primitive-orange-200)]",
    progress: "bg-[var(--primitive-orange-500)]",
    text: "text-[var(--primitive-orange-700)]",
  },
  SKILLS: {
    key: "SKILLS",
    label: "Skills Development",
    icon: "GraduationCap",
    emoji: "📚",
    description: "Learn new skills and earn certifications",
    bg: "bg-[var(--primitive-cyan-100)]",
    tint: "bg-[var(--primitive-cyan-200)]",
    progress: "bg-[var(--primitive-cyan-500)]",
    text: "text-[var(--primitive-cyan-700)]",
  },
  PORTFOLIO: {
    key: "PORTFOLIO",
    label: "Resume & Portfolio",
    icon: "FileText",
    emoji: "📄",
    description: "Update your resume and build your portfolio",
    bg: "bg-[var(--primitive-indigo-100)]",
    tint: "bg-[var(--primitive-indigo-200)]",
    progress: "bg-[var(--primitive-indigo-500)]",
    text: "text-[var(--primitive-indigo-700)]",
  },
  RESEARCH: {
    key: "RESEARCH",
    label: "Research",
    icon: "MagnifyingGlass",
    emoji: "🔍",
    description: "Research companies, roles, and industries",
    bg: "bg-[var(--primitive-teal-100)]",
    tint: "bg-[var(--primitive-teal-200)]",
    progress: "bg-[var(--primitive-teal-500)]",
    text: "text-[var(--primitive-teal-700)]",
  },
  COMPENSATION: {
    key: "COMPENSATION",
    label: "Compensation",
    icon: "CurrencyCircleDollar",
    emoji: "💰",
    description: "Research salaries and prepare for negotiations",
    bg: "bg-[var(--primitive-green-100)]",
    tint: "bg-[var(--primitive-green-200)]",
    progress: "bg-[var(--primitive-green-500)]",
    text: "text-[var(--primitive-green-700)]",
  },
  WELLNESS: {
    key: "WELLNESS",
    label: "Wellness",
    icon: "Heart",
    emoji: "🧘",
    description: "Maintain mental health during your job search",
    bg: "bg-[var(--primitive-pink-100)]",
    tint: "bg-[var(--primitive-pink-200)]",
    progress: "bg-[var(--primitive-pink-500)]",
    text: "text-[var(--primitive-pink-700)]",
  },
  ORGANIZATION: {
    key: "ORGANIZATION",
    label: "Organization",
    icon: "FolderSimple",
    emoji: "📁",
    description: "Organize and track your job search activities",
    bg: "bg-[var(--primitive-purple-100)]",
    tint: "bg-[var(--primitive-purple-200)]",
    progress: "bg-[var(--primitive-purple-500)]",
    text: "text-[var(--primitive-purple-700)]",
  },
};

// =============================================================================
// TEMPLATE TYPES
// =============================================================================

export type ExperienceLevel = "entry" | "mid" | "senior" | "executive" | "switcher";
export type Industry =
  | "tech"
  | "finance"
  | "healthcare"
  | "marketing"
  | "sales"
  | "operations"
  | "design"
  | "general";
export type Difficulty = "easy" | "medium" | "hard";

export interface GoalTemplateTask {
  title: string;
  description?: string;
  estimatedMinutes?: number;
  resources?: Array<{
    title: string;
    url: string;
    type: "article" | "video" | "tool" | "course";
  }>;
}

export interface GoalTemplate {
  id: string;
  title: string;
  description: string;
  category: GoalCategoryKey;
  experienceLevels: ExperienceLevel[];
  industries: Industry[];
  difficulty: Difficulty;
  estimatedDays: number;
  tasks: GoalTemplateTask[];
  tags: string[];
  popularity: number; // 0-100, percentage of users who found this helpful
  successRate?: number; // Optional: % of users who completed this goal
  createdBy: "system" | "coach" | "community";
  isVerified: boolean;
}

// =============================================================================
// USER CONTEXT TYPES (for contextual suggestions)
// =============================================================================

export type JobSearchStage =
  | "just_started"
  | "building_profile"
  | "active_search"
  | "interviewing"
  | "negotiating"
  | "employed"; // For those looking while employed

export interface UserActivity {
  type:
    | "profile_update"
    | "application_sent"
    | "application_viewed"
    | "interview_scheduled"
    | "interview_completed"
    | "offer_received"
    | "offer_accepted"
    | "offer_declined"
    | "goal_created"
    | "goal_completed"
    | "milestone_completed";
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface UserJobSearchContext {
  userId: string;
  stage: JobSearchStage;
  daysInCurrentStage: number;
  totalDaysSearching: number;
  profileCompleteness: number; // 0-100
  hasResume: boolean;
  targetRoles: string[];
  targetIndustries: Industry[];
  experienceLevel: ExperienceLevel;
  applicationCount: number;
  interviewCount: number;
  offerCount: number;
  activeGoalIds: string[];
  completedGoalIds: string[];
  recentActivity: UserActivity[];
  preferences: {
    reminderFrequency: "daily" | "weekly" | "none";
    preferredGoalDifficulty: Difficulty;
  };
}

// =============================================================================
// SUGGESTION TYPES
// =============================================================================

export type SuggestionType =
  | "urgent" // Time-sensitive (interview tomorrow)
  | "quick_win" // Easy wins to build momentum
  | "essential" // Core actions needed
  | "recommended" // Based on successful patterns
  | "insight" // Data-driven suggestions
  | "timely" // Contextual based on recent activity
  | "opportunity" // New opportunities detected
  | "wellness"; // Mental health / self-care

export type SuggestionPriority = "critical" | "high" | "medium" | "low";

export type SuggestionActionType =
  | "goal_template" // Open a specific template
  | "goal_create" // Create with prefilled data
  | "navigate" // Go to a page
  | "external_link" // Open external resource
  | "dismiss"; // Just informational

export interface GoalSuggestion {
  id: string;
  type: SuggestionType;
  priority: SuggestionPriority;
  title: string;
  description: string;
  icon: string;
  action: {
    label: string;
    type: SuggestionActionType;
    payload?: {
      templateId?: string;
      prefillData?: Partial<GoalTemplate>;
      navigateTo?: string;
      externalUrl?: string;
    };
  };
  reason: string; // Why this is being suggested
  estimatedTime: string;
  expiresAt?: Date; // For time-sensitive suggestions
  dismissedAt?: Date;
}

// =============================================================================
// ONBOARDING TYPES
// =============================================================================

export interface JobSearchChallenge {
  id: string;
  label: string;
  icon: string;
  description: string;
  suggestedTemplateIds: string[];
}

export const JOB_SEARCH_CHALLENGES: JobSearchChallenge[] = [
  {
    id: "getting-started",
    label: "I don't know where to start",
    icon: "🤔",
    description: "New to job searching or feeling overwhelmed",
    suggestedTemplateIds: ["job-search-organize", "resume-refresh"],
  },
  {
    id: "not-getting-responses",
    label: "Not getting responses",
    icon: "📭",
    description: "Applying but not hearing back",
    suggestedTemplateIds: ["resume-refresh", "networking"],
  },
  {
    id: "interview-anxiety",
    label: "Interview anxiety",
    icon: "😰",
    description: "Getting interviews but struggling to convert",
    suggestedTemplateIds: ["interview-prep", "wellness"],
  },
  {
    id: "career-change",
    label: "Switching careers",
    icon: "🔄",
    description: "Transitioning to a new field or role",
    suggestedTemplateIds: ["career-transition", "portfolio-project"],
  },
  {
    id: "negotiation",
    label: "Salary negotiation",
    icon: "💰",
    description: "Have offers but unsure how to negotiate",
    suggestedTemplateIds: ["salary-negotiation"],
  },
  {
    id: "motivation",
    label: "Staying motivated",
    icon: "🔋",
    description: "Job search fatigue is real",
    suggestedTemplateIds: ["wellness", "networking"],
  },
];

export interface OnboardingData {
  name: string;
  experienceLevel: ExperienceLevel;
  targetRoles: string[];
  targetIndustries: Industry[];
  challenges: string[];
  completedAt: Date;
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface GoalTemplatesResponse {
  templates: GoalTemplate[];
  categories: GoalCategoryConfig[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SuggestionsResponse {
  suggestions: GoalSuggestion[];
  userContext: Pick<
    UserJobSearchContext,
    "stage" | "daysInCurrentStage" | "applicationCount" | "interviewCount"
  >;
  generatedAt: Date;
}

// =============================================================================
// FILTER TYPES
// =============================================================================

export interface GoalTemplateFilters {
  category?: GoalCategoryKey;
  experienceLevel?: ExperienceLevel;
  industry?: Industry;
  difficulty?: Difficulty;
  search?: string;
  tags?: string[];
  sortBy?: "popularity" | "newest" | "difficulty" | "duration";
  sortOrder?: "asc" | "desc";
}

// =============================================================================
// ANALYTICS EVENTS (for tracking template usage)
// =============================================================================

export type GoalAnalyticsEvent =
  | { type: "template_viewed"; templateId: string }
  | { type: "template_previewed"; templateId: string }
  | { type: "template_used"; templateId: string; customized: boolean }
  | { type: "suggestion_shown"; suggestionId: string; suggestionType: SuggestionType }
  | { type: "suggestion_clicked"; suggestionId: string }
  | { type: "suggestion_dismissed"; suggestionId: string }
  | { type: "onboarding_started" }
  | { type: "onboarding_step_completed"; step: number }
  | { type: "onboarding_completed"; data: OnboardingData };
