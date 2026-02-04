// Multi-role onboarding types
// Supports three shells: Talent (GJB), Coach (Candid), Employer (Canopy)

// ─── Shell & Role Types ────────────────────────────────────────────

/** The three product shells a user can access */
export type Shell = "talent" | "coach" | "employer";

/** What brought the user to signup — determines initial onboarding flow */
export type EntryIntent = "talent" | "coach" | "employer";

// ─── Onboarding Steps ──────────────────────────────────────────────

/** Steps in the talent (job seeker) onboarding */
export type TalentOnboardingStep = "profile" | "career" | "skills";

/** Steps in the coach onboarding */
export type CoachOnboardingStep =
  | "about"
  | "expertise"
  | "services"
  | "availability"
  | "payout"
  | "preview";

/** Steps in the employer onboarding */
export type EmployerOnboardingStep =
  | "company"
  | "size-industry"
  | "your-role"
  | "hiring-goals"
  | "first-role"
  | "invite-team";

/** Union of all possible onboarding steps */
export type OnboardingStep = TalentOnboardingStep | CoachOnboardingStep | EmployerOnboardingStep;

// ─── Onboarding Progress (stored as JSON on Account) ───────────────

/** Per-role onboarding completion state */
export interface RoleOnboardingState {
  complete: boolean;
  completedAt: string | null; // ISO date string
  currentStep: string | null; // Which step they're on if incomplete
}

/** Full onboarding progress stored on Account.onboardingProgress */
export interface OnboardingProgress {
  baseProfileComplete: boolean;
  roles: {
    talent: RoleOnboardingState | null;
    coach: RoleOnboardingState | null;
    employer: RoleOnboardingState | null;
  };
}

// ─── Step Configuration ────────────────────────────────────────────

export interface StepConfig {
  id: string;
  path: string; // URL path segment
  title: string;
  subtitle: string;
}

/** Step definitions per shell */
export const TALENT_STEPS: StepConfig[] = [
  {
    id: "profile",
    path: "profile",
    title: "Build your profile",
    subtitle:
      "Hey \u{1F44B} {firstName}, lets build a profile that's tailored just for you, creating a more personalized pathways experience that will help you grow and succeed.",
  },
  {
    id: "career",
    path: "career",
    title: "Your Career Journey",
    subtitle:
      "Hey \u{1F44B} {firstName}, tell us about your career journey so we can match you with the right opportunities and help you grow.",
  },
  {
    id: "skills",
    path: "skills",
    title: "Add your skills",
    subtitle:
      "Hey \u{1F44B} {firstName}, lets build a profile that's tailored just for you, creating a more personalized pathways experience that will help you grow and succeed.",
  },
];

export const COACH_STEPS: StepConfig[] = [
  {
    id: "about",
    path: "about",
    title: "About you",
    subtitle: "Set up your public coaching profile",
  },
  {
    id: "expertise",
    path: "expertise",
    title: "Your expertise",
    subtitle: "What do you help people with?",
  },
  {
    id: "services",
    path: "services",
    title: "Your services",
    subtitle: "Define your session types and pricing",
  },
  {
    id: "availability",
    path: "availability",
    title: "Availability",
    subtitle: "When can clients book you?",
  },
  {
    id: "payout",
    path: "payout",
    title: "Get paid",
    subtitle: "Set up your payout method",
  },
  {
    id: "preview",
    path: "preview",
    title: "Preview & launch",
    subtitle: "Review your profile and go live",
  },
];

export const EMPLOYER_STEPS: StepConfig[] = [
  {
    id: "company",
    path: "company",
    title: "Your company",
    subtitle: "Tell us about your organization",
  },
  {
    id: "size-industry",
    path: "size-industry",
    title: "Size & industry",
    subtitle: "Help talent find your company",
  },
  {
    id: "your-role",
    path: "your-role",
    title: "Your role",
    subtitle: "What are you hiring for?",
  },
  {
    id: "hiring-goals",
    path: "hiring-goals",
    title: "Hiring goals",
    subtitle: "What brings you to Canopy?",
  },
  {
    id: "first-role",
    path: "first-role",
    title: "Post your first role",
    subtitle: "Get in front of climate talent right away",
  },
  {
    id: "invite-team",
    path: "invite-team",
    title: "Invite your team",
    subtitle: "Collaborate on hiring with your colleagues",
  },
];

export const STEPS_BY_SHELL: Record<Shell, StepConfig[]> = {
  talent: TALENT_STEPS,
  coach: COACH_STEPS,
  employer: EMPLOYER_STEPS,
};

// ─── Shell ↔ URL Mapping ──────────────────────────────────────────
//
// Internal Shell types ("talent", "coach", "employer") are stored in the
// database and must NOT change. URL paths use product-name slugs instead.

/** Maps internal Shell type → URL path segment */
export const SHELL_URL_SLUGS: Record<Shell, string> = {
  talent: "jobs",
  coach: "candid/coach",
  employer: "canopy",
};

/** Maps URL slug → internal Shell type */
export const URL_SLUG_TO_SHELL: Record<string, Shell> = {
  jobs: "talent",
  "candid/coach": "coach",
  canopy: "employer",
};

/** Maps internal Shell type → onboarding URL segment */
export const SHELL_ONBOARDING_SLUGS: Record<Shell, string> = {
  talent: "jobs",
  coach: "coach", // onboarding stays at /onboarding/coach
  employer: "canopy",
};

/** Get the URL-safe slug for a shell */
export function getShellSlug(shell: Shell): string {
  return SHELL_URL_SLUGS[shell];
}

/** Get the shell from a URL slug */
export function getShellFromSlug(slug: string): Shell | null {
  return URL_SLUG_TO_SHELL[slug] ?? null;
}

// ─── Shell Configuration ───────────────────────────────────────────

export interface ShellConfig {
  shell: Shell;
  label: string;
  description: string;
  dashboardPath: string;
  sidebarDefault: "collapsed" | "expanded";
}

export const SHELL_CONFIGS: Record<Shell, ShellConfig> = {
  talent: {
    shell: "talent",
    label: "Job Search",
    description: "Find your climate career",
    dashboardPath: "/jobs/dashboard",
    sidebarDefault: "collapsed",
  },
  coach: {
    shell: "coach",
    label: "Coaching",
    description: "Manage your coaching practice",
    dashboardPath: "/candid/coach/dashboard",
    sidebarDefault: "expanded",
  },
  employer: {
    shell: "employer",
    label: "Hiring",
    description: "Hire climate talent",
    dashboardPath: "/canopy/dashboard",
    sidebarDefault: "expanded",
  },
};

// ─── Legacy Step Migration ────────────────────────────────────────
// Maps old talent step names (stored in DB) to their new equivalents.
// Users who started onboarding before the 3-step redesign may have
// "background" or "preferences" as their currentStep.

const LEGACY_TALENT_STEP_MAP: Record<string, string> = {
  background: "profile",
  preferences: "skills",
};

/** Resolve a step ID, migrating legacy names to current ones */
function resolveStepId(shell: Shell, stepId: string): string {
  if (shell === "talent" && LEGACY_TALENT_STEP_MAP[stepId]) {
    return LEGACY_TALENT_STEP_MAP[stepId];
  }
  return stepId;
}

// ─── Helpers ───────────────────────────────────────────────────────

/** Create a fresh onboarding progress object */
export function createOnboardingProgress(): OnboardingProgress {
  return {
    baseProfileComplete: false,
    roles: {
      talent: null,
      coach: null,
      employer: null,
    },
  };
}

/** Initialize onboarding state for a newly activated role */
export function createRoleOnboardingState(shell: Shell): RoleOnboardingState {
  const steps = STEPS_BY_SHELL[shell];
  return {
    complete: false,
    completedAt: null,
    currentStep: steps[0]?.id ?? null,
  };
}

/** Mark a role's onboarding as complete */
export function completeRoleOnboarding(
  progress: OnboardingProgress,
  shell: Shell
): OnboardingProgress {
  return {
    ...progress,
    roles: {
      ...progress.roles,
      [shell]: {
        complete: true,
        completedAt: new Date().toISOString(),
        currentStep: null,
      },
    },
  };
}

/** Advance to the next onboarding step for a role */
export function advanceOnboardingStep(
  progress: OnboardingProgress,
  shell: Shell
): OnboardingProgress {
  const roleState = progress.roles[shell];
  if (!roleState || roleState.complete) return progress;

  const steps = STEPS_BY_SHELL[shell];
  const resolvedStep = roleState.currentStep ? resolveStepId(shell, roleState.currentStep) : null;
  const currentIndex = steps.findIndex((s) => s.id === resolvedStep);
  const nextStep = steps[currentIndex + 1];

  if (!nextStep) {
    // No more steps — mark complete
    return completeRoleOnboarding(progress, shell);
  }

  return {
    ...progress,
    roles: {
      ...progress.roles,
      [shell]: {
        ...roleState,
        currentStep: nextStep.id,
      },
    },
  };
}

/** Get the next incomplete onboarding URL for a user */
export function getOnboardingRedirect(
  progress: OnboardingProgress | null,
  entryIntent: EntryIntent | null
): string | null {
  if (!progress) {
    // No progress at all — send to role selection on signup page
    return "/onboarding";
  }

  if (!progress.baseProfileComplete) {
    // Profile fields are merged into each shell's first step.
    // Route to the shell's first step if an active role exists.
    if (entryIntent) {
      const roleState = progress.roles[entryIntent];
      if (roleState) {
        const rawStep = roleState.currentStep || STEPS_BY_SHELL[entryIntent][0]?.id;
        const step = rawStep ? resolveStepId(entryIntent, rawStep) : null;
        if (step) {
          return `/onboarding/${SHELL_ONBOARDING_SLUGS[entryIntent]}/${step}`;
        }
      }
    }
    // No active role — send to role selection
    return "/onboarding";
  }

  // Check if the entry intent's role needs onboarding
  if (entryIntent) {
    const roleState = progress.roles[entryIntent];
    if (roleState && !roleState.complete && roleState.currentStep) {
      const step = resolveStepId(entryIntent, roleState.currentStep);
      return `/onboarding/${SHELL_ONBOARDING_SLUGS[entryIntent]}/${step}`;
    }
  }

  // Check all activated roles for incomplete onboarding
  for (const shell of ["talent", "coach", "employer"] as Shell[]) {
    const roleState = progress.roles[shell];
    if (roleState && !roleState.complete && roleState.currentStep) {
      const step = resolveStepId(shell, roleState.currentStep);
      return `/onboarding/${SHELL_ONBOARDING_SLUGS[shell]}/${step}`;
    }
  }

  // All done
  return null;
}

/** Get the dashboard URL for a user's primary role */
export function getDashboardPath(primaryRole: Shell | null): string {
  if (!primaryRole) return "/onboarding";
  return SHELL_CONFIGS[primaryRole].dashboardPath;
}

/** Check if a user has completed onboarding for at least one role */
export function hasCompletedAnyOnboarding(progress: OnboardingProgress | null): boolean {
  if (!progress) return false;
  return Object.values(progress.roles).some((state) => state?.complete === true);
}

/** Get list of shells a user has activated (started or completed onboarding) */
export function getActiveShells(progress: OnboardingProgress | null): Shell[] {
  if (!progress) return [];
  return (["talent", "coach", "employer"] as Shell[]).filter(
    (shell) => progress.roles[shell] !== null
  );
}
