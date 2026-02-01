// Multi-role onboarding types
// Supports three shells: Talent (GJB), Coach (Candid), Employer (Canopy)

// ─── Shell & Role Types ────────────────────────────────────────────

/** The three product shells a user can access */
export type Shell = "talent" | "coach" | "employer";

/** What brought the user to signup — determines initial onboarding flow */
export type EntryIntent = "talent" | "coach" | "employer";

// ─── Onboarding Steps ──────────────────────────────────────────────

/** Steps in the talent (job seeker) onboarding */
export type TalentOnboardingStep =
  | "background"
  | "skills"
  | "preferences";

/** Steps in the coach onboarding */
export type CoachOnboardingStep =
  | "about"
  | "expertise"
  | "services"
  | "availability";

/** Steps in the employer onboarding */
export type EmployerOnboardingStep =
  | "company"
  | "your-role";

/** Union of all possible onboarding steps */
export type OnboardingStep =
  | TalentOnboardingStep
  | CoachOnboardingStep
  | EmployerOnboardingStep;

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
    id: "background",
    path: "background",
    title: "Your background",
    subtitle: "Help us understand where you are in your career",
  },
  {
    id: "skills",
    path: "skills",
    title: "Skills & sectors",
    subtitle: "What climate sectors interest you?",
  },
  {
    id: "preferences",
    path: "preferences",
    title: "What you're looking for",
    subtitle: "Help us match you with the right opportunities",
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
];

export const EMPLOYER_STEPS: StepConfig[] = [
  {
    id: "company",
    path: "company",
    title: "Your company",
    subtitle: "Tell us about your organization",
  },
  {
    id: "your-role",
    path: "your-role",
    title: "Your role",
    subtitle: "What are you hiring for?",
  },
];

export const STEPS_BY_SHELL: Record<Shell, StepConfig[]> = {
  talent: TALENT_STEPS,
  coach: COACH_STEPS,
  employer: EMPLOYER_STEPS,
};

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
    dashboardPath: "/talent/dashboard",
    sidebarDefault: "collapsed",
  },
  coach: {
    shell: "coach",
    label: "Coaching",
    description: "Manage your coaching practice",
    dashboardPath: "/coach/dashboard",
    sidebarDefault: "expanded",
  },
  employer: {
    shell: "employer",
    label: "Hiring",
    description: "Hire climate talent",
    dashboardPath: "/employer/dashboard",
    sidebarDefault: "expanded",
  },
};

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
export function createRoleOnboardingState(
  shell: Shell,
): RoleOnboardingState {
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
  shell: Shell,
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
  shell: Shell,
): OnboardingProgress {
  const roleState = progress.roles[shell];
  if (!roleState || roleState.complete) return progress;

  const steps = STEPS_BY_SHELL[shell];
  const currentIndex = steps.findIndex((s) => s.id === roleState.currentStep);
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
  entryIntent: EntryIntent | null,
): string | null {
  if (!progress) {
    // No progress at all — send to role selection on signup page
    return "/onboarding";
  }

  if (!progress.baseProfileComplete) {
    return "/onboarding/profile";
  }

  // Check if the entry intent's role needs onboarding
  if (entryIntent) {
    const roleState = progress.roles[entryIntent];
    if (roleState && !roleState.complete && roleState.currentStep) {
      return `/onboarding/${entryIntent}/${roleState.currentStep}`;
    }
  }

  // Check all activated roles for incomplete onboarding
  for (const shell of ["talent", "coach", "employer"] as Shell[]) {
    const roleState = progress.roles[shell];
    if (roleState && !roleState.complete && roleState.currentStep) {
      return `/onboarding/${shell}/${roleState.currentStep}`;
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
export function hasCompletedAnyOnboarding(
  progress: OnboardingProgress | null,
): boolean {
  if (!progress) return false;
  return Object.values(progress.roles).some(
    (state) => state?.complete === true,
  );
}

/** Get list of shells a user has activated (started or completed onboarding) */
export function getActiveShells(
  progress: OnboardingProgress | null,
): Shell[] {
  if (!progress) return [];
  return (["talent", "coach", "employer"] as Shell[]).filter(
    (shell) => progress.roles[shell] !== null,
  );
}
