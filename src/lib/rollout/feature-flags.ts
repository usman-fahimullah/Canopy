/**
 * Canopy Rollout Feature Flag System
 *
 * Controls which features are enabled during the phased rollout.
 * Works alongside existing systems:
 *   - billing/feature-gates.ts → plan-tier gating (PAY_AS_YOU_GO, LISTINGS, ATS)
 *   - shell/feature-flags.ts   → user-level progressive features (coaching, mentoring)
 *
 * This system gates features by rollout phase. Features advance from
 * DISABLED → BETA → GA as the product stabilizes.
 *
 * Usage:
 *   import { isFeatureEnabled, ROLLOUT_FEATURES } from "@/lib/rollout/feature-flags";
 *
 *   // Server-side check
 *   if (isFeatureEnabled("career_page_builder")) { ... }
 *
 *   // Client-side hook (see useRolloutFlag)
 *   const canUseCareerBuilder = useRolloutFlag("career_page_builder");
 */

// =================================================================
// Rollout Phases — the product advances through these in order
// =================================================================

export type RolloutPhase =
  | "foundation" // Phase 1: Core ATS features, soft launch
  | "growth" // Phase 2: Polish + advanced features
  | "expansion" // Phase 3: AI, career builder, integrations
  | "scale"; // Phase 4: Full platform, public marketing

// =================================================================
// Feature Status — each feature has a lifecycle
// =================================================================

export type FeatureStatus =
  | "disabled" // Not available to anyone
  | "internal" // Available to internal/admin users only
  | "beta" // Available to beta opt-in orgs
  | "ga"; // Generally available to all orgs

// =================================================================
// Feature Definition
// =================================================================

export interface RolloutFeature {
  /** Unique feature key */
  key: string;
  /** Human-readable name */
  name: string;
  /** Which rollout phase this feature targets */
  targetPhase: RolloutPhase;
  /** Current status */
  status: FeatureStatus;
  /** Feature description for internal dashboards */
  description: string;
  /** Features this depends on (must be GA before this can be GA) */
  dependencies?: string[];
}

// =================================================================
// Feature Registry — single source of truth
// =================================================================

export const ROLLOUT_FEATURES: Record<string, RolloutFeature> = {
  // ---------------------------------------------------------------
  // PHASE 1: Foundation (Soft Launch)
  // Core ATS that's already built and production-ready
  // ---------------------------------------------------------------
  core_dashboard: {
    key: "core_dashboard",
    name: "Dashboard",
    targetPhase: "foundation",
    status: "ga",
    description: "Main dashboard with pipeline stats, activity feed, and action items",
  },
  roles_management: {
    key: "roles_management",
    name: "Roles/Jobs Management",
    targetPhase: "foundation",
    status: "ga",
    description: "Create, edit, publish, and manage job postings",
  },
  candidate_management: {
    key: "candidate_management",
    name: "Candidate Management",
    targetPhase: "foundation",
    status: "ga",
    description: "Candidate profiles, search, filtering, and bulk actions",
  },
  application_pipeline: {
    key: "application_pipeline",
    name: "Application Pipeline",
    targetPhase: "foundation",
    status: "ga",
    description: "Application tracking, stage management, and status updates",
  },
  team_management: {
    key: "team_management",
    name: "Team Management",
    targetPhase: "foundation",
    status: "ga",
    description: "Invite team members, manage roles and permissions",
  },
  onboarding_flow: {
    key: "onboarding_flow",
    name: "Employer Onboarding",
    targetPhase: "foundation",
    status: "ga",
    description: "6-step onboarding flow for new employer accounts",
  },
  public_career_pages: {
    key: "public_career_pages",
    name: "Public Career Pages",
    targetPhase: "foundation",
    status: "ga",
    description: "Public org career pages with job listings and application forms",
  },
  core_settings: {
    key: "core_settings",
    name: "Core Settings",
    targetPhase: "foundation",
    status: "ga",
    description: "Company info, branding, departments, notifications, email templates",
  },
  billing_subscriptions: {
    key: "billing_subscriptions",
    name: "Billing & Subscriptions",
    targetPhase: "foundation",
    status: "ga",
    description: "Plan management, credits, purchases via Stripe",
  },

  // ---------------------------------------------------------------
  // PHASE 2: Growth (Polish + Advanced Features)
  // Features that need minor polish before enabling
  // ---------------------------------------------------------------
  analytics_dashboard: {
    key: "analytics_dashboard",
    name: "Analytics Dashboard",
    targetPhase: "growth",
    status: "ga",
    description: "Pipeline funnel, trends, source breakdown, and export",
  },
  email_messaging: {
    key: "email_messaging",
    name: "Email & Messaging",
    targetPhase: "growth",
    status: "ga",
    description: "Send emails, bulk email, templates, and scheduling",
  },
  interview_scheduling: {
    key: "interview_scheduling",
    name: "Interview Scheduling",
    targetPhase: "growth",
    status: "beta",
    description: "Schedule and manage interviews with calendar integration",
  },
  offer_management: {
    key: "offer_management",
    name: "Offer Management",
    targetPhase: "growth",
    status: "beta",
    description: "Create, send, and manage job offers",
  },
  kanban_pipeline: {
    key: "kanban_pipeline",
    name: "Kanban Pipeline Board",
    targetPhase: "growth",
    status: "beta",
    description: "Visual drag-and-drop pipeline management (dnd-kit)",
    dependencies: ["application_pipeline"],
  },
  approval_workflows: {
    key: "approval_workflows",
    name: "Approval Workflows",
    targetPhase: "growth",
    status: "beta",
    description: "Multi-step approval flows for offers and hires",
  },
  settings_team_invites: {
    key: "settings_team_invites",
    name: "Settings Team Invites",
    targetPhase: "growth",
    status: "disabled",
    description: "Invite team members from settings page (currently 'coming soon')",
  },
  settings_privacy_actions: {
    key: "settings_privacy_actions",
    name: "Data Export & Account Deletion",
    targetPhase: "growth",
    status: "disabled",
    description: "Export org data and delete account from privacy settings",
  },

  // ---------------------------------------------------------------
  // PHASE 3: Expansion (New Capabilities)
  // Major features that aren't built yet or need significant work
  // ---------------------------------------------------------------
  career_page_builder: {
    key: "career_page_builder",
    name: "Career Page Builder",
    targetPhase: "expansion",
    status: "disabled",
    description: "No-code drag-and-drop career page builder (Craft.js). NOT YET BUILT.",
  },
  ai_candidate_matching: {
    key: "ai_candidate_matching",
    name: "AI Candidate Matching",
    targetPhase: "expansion",
    status: "disabled",
    description: "AI-powered candidate scoring and match reasoning. NOT YET BUILT.",
    dependencies: ["candidate_management"],
  },
  ai_sourcing: {
    key: "ai_sourcing",
    name: "AI Candidate Sourcing",
    targetPhase: "expansion",
    status: "disabled",
    description: "AI agent for discovering and recommending candidates. NOT YET BUILT.",
    dependencies: ["ai_candidate_matching"],
  },
  ai_job_descriptions: {
    key: "ai_job_descriptions",
    name: "AI Job Description Generator",
    targetPhase: "expansion",
    status: "disabled",
    description: "AI-powered job description writing and optimization. NOT YET BUILT.",
    dependencies: ["roles_management"],
  },
  calendar_integrations: {
    key: "calendar_integrations",
    name: "Calendar Integrations",
    targetPhase: "expansion",
    status: "beta",
    description: "Google Calendar and Outlook sync for interviews",
    dependencies: ["interview_scheduling"],
  },
  slack_integration: {
    key: "slack_integration",
    name: "Slack Integration",
    targetPhase: "expansion",
    status: "disabled",
    description: "Pipeline notifications and actions in Slack",
  },

  // ---------------------------------------------------------------
  // PHASE 4: Scale (Full Platform)
  // Features for mature, high-volume usage
  // ---------------------------------------------------------------
  green_skills_taxonomy: {
    key: "green_skills_taxonomy",
    name: "Green Skills Taxonomy",
    targetPhase: "scale",
    status: "disabled",
    description: "Integration with GJB Pathways for climate skill matching",
    dependencies: ["ai_candidate_matching"],
  },
  advanced_analytics: {
    key: "advanced_analytics",
    name: "Advanced Analytics",
    targetPhase: "scale",
    status: "disabled",
    description: "DEI metrics, time-to-hire benchmarks, team performance",
    dependencies: ["analytics_dashboard"],
  },
  api_access: {
    key: "api_access",
    name: "Public API Access",
    targetPhase: "scale",
    status: "disabled",
    description: "REST API for third-party integrations",
  },
  gjb_native_integration: {
    key: "gjb_native_integration",
    name: "Green Jobs Board Integration",
    targetPhase: "scale",
    status: "disabled",
    description: "Native job syndication to Green Jobs Board platform",
    dependencies: ["roles_management", "public_career_pages"],
  },
};

// =================================================================
// Current Phase — update this as rollout progresses
// =================================================================

/**
 * The current active rollout phase.
 * Update this value (or set via NEXT_PUBLIC_ROLLOUT_PHASE env var)
 * to advance the rollout.
 */
export const CURRENT_PHASE: RolloutPhase =
  (process.env.NEXT_PUBLIC_ROLLOUT_PHASE as RolloutPhase) || "foundation";

// =================================================================
// Phase ordering for comparison
// =================================================================

const PHASE_ORDER: Record<RolloutPhase, number> = {
  foundation: 1,
  growth: 2,
  expansion: 3,
  scale: 4,
};

// =================================================================
// Core API — checking feature availability
// =================================================================

/**
 * Check if a feature is enabled for general use.
 *
 * A feature is "enabled" when its status is "ga" (generally available).
 * Beta features require the org to be opted in (see isBetaFeatureEnabled).
 */
export function isFeatureEnabled(featureKey: string): boolean {
  const feature = ROLLOUT_FEATURES[featureKey];
  if (!feature) return false;
  return feature.status === "ga";
}

/**
 * Check if a feature is available (either GA or beta).
 * For beta features, the caller should additionally check org opt-in.
 */
export function isFeatureAvailable(featureKey: string): boolean {
  const feature = ROLLOUT_FEATURES[featureKey];
  if (!feature) return false;
  return feature.status === "ga" || feature.status === "beta";
}

/**
 * Check if a feature is accessible for internal/admin users.
 * Returns true for internal, beta, and GA features.
 */
export function isFeatureVisibleInternal(featureKey: string): boolean {
  const feature = ROLLOUT_FEATURES[featureKey];
  if (!feature) return false;
  return feature.status !== "disabled";
}

/**
 * Get all features for a specific rollout phase.
 */
export function getFeaturesForPhase(phase: RolloutPhase): RolloutFeature[] {
  return Object.values(ROLLOUT_FEATURES).filter((f) => f.targetPhase === phase);
}

/**
 * Get features grouped by status.
 */
export function getFeaturesByStatus(): Record<FeatureStatus, RolloutFeature[]> {
  const result: Record<FeatureStatus, RolloutFeature[]> = {
    disabled: [],
    internal: [],
    beta: [],
    ga: [],
  };
  for (const feature of Object.values(ROLLOUT_FEATURES)) {
    result[feature.status].push(feature);
  }
  return result;
}

/**
 * Check rollout readiness for a phase.
 * Returns which features are ready and which are blocking.
 */
export function getPhaseReadiness(phase: RolloutPhase): {
  ready: RolloutFeature[];
  blocking: RolloutFeature[];
  total: number;
  readyPercent: number;
} {
  const features = getFeaturesForPhase(phase);
  const ready = features.filter((f) => f.status === "ga");
  const blocking = features.filter((f) => f.status !== "ga");

  return {
    ready,
    blocking,
    total: features.length,
    readyPercent: features.length > 0 ? Math.round((ready.length / features.length) * 100) : 0,
  };
}

/**
 * Get a summary of the entire rollout status.
 */
export function getRolloutSummary(): {
  currentPhase: RolloutPhase;
  phases: Array<{
    phase: RolloutPhase;
    label: string;
    readyPercent: number;
    total: number;
    gaCount: number;
    betaCount: number;
    disabledCount: number;
  }>;
  totalFeatures: number;
  gaFeatures: number;
  betaFeatures: number;
  disabledFeatures: number;
} {
  const phaseLabels: Record<RolloutPhase, string> = {
    foundation: "Phase 1: Foundation (Soft Launch)",
    growth: "Phase 2: Growth (Polish + Advanced)",
    expansion: "Phase 3: Expansion (New Capabilities)",
    scale: "Phase 4: Scale (Full Platform)",
  };

  const allFeatures = Object.values(ROLLOUT_FEATURES);
  const phases = (["foundation", "growth", "expansion", "scale"] as RolloutPhase[]).map((phase) => {
    const features = allFeatures.filter((f) => f.targetPhase === phase);
    const ga = features.filter((f) => f.status === "ga");
    const beta = features.filter((f) => f.status === "beta");
    const disabled = features.filter((f) => f.status === "disabled");

    return {
      phase,
      label: phaseLabels[phase],
      readyPercent: features.length > 0 ? Math.round((ga.length / features.length) * 100) : 0,
      total: features.length,
      gaCount: ga.length,
      betaCount: beta.length,
      disabledCount: disabled.length,
    };
  });

  return {
    currentPhase: CURRENT_PHASE,
    phases,
    totalFeatures: allFeatures.length,
    gaFeatures: allFeatures.filter((f) => f.status === "ga").length,
    betaFeatures: allFeatures.filter((f) => f.status === "beta").length,
    disabledFeatures: allFeatures.filter((f) => f.status === "disabled").length,
  };
}

// =================================================================
// Phase transition helpers
// =================================================================

/**
 * Check if a phase is at or before the current phase.
 */
export function isPhaseActive(phase: RolloutPhase): boolean {
  return PHASE_ORDER[phase] <= PHASE_ORDER[CURRENT_PHASE];
}

/**
 * Check if all dependencies for a feature are met (all deps are GA).
 */
export function areDependenciesMet(featureKey: string): boolean {
  const feature = ROLLOUT_FEATURES[featureKey];
  if (!feature?.dependencies?.length) return true;

  return feature.dependencies.every((depKey) => {
    const dep = ROLLOUT_FEATURES[depKey];
    return dep?.status === "ga";
  });
}

/**
 * Get features that are blocking a specific feature.
 */
export function getBlockingDependencies(featureKey: string): RolloutFeature[] {
  const feature = ROLLOUT_FEATURES[featureKey];
  if (!feature?.dependencies?.length) return [];

  return feature.dependencies
    .map((depKey) => ROLLOUT_FEATURES[depKey])
    .filter((dep): dep is RolloutFeature => dep !== undefined && dep.status !== "ga");
}
