import type { PlanTier } from "@prisma/client";
import { PLAN_FEATURES, type PlanFeatures } from "@/lib/stripe/constants";

// =================================================================
// Feature Gate Results
// =================================================================

export interface GateResult {
  allowed: boolean;
  reason?: string;
  upgradeRequired?: PlanTier;
}

const ALLOWED: GateResult = { allowed: true };

function denied(reason: string, upgradeRequired: PlanTier): GateResult {
  return { allowed: false, reason, upgradeRequired };
}

// =================================================================
// Feature Gates — pure functions, no side effects
// =================================================================

/** Get full feature config for a plan tier */
export function getPlanFeatures(planTier: PlanTier): PlanFeatures {
  return PLAN_FEATURES[planTier];
}

/**
 * Can this org publish a job?
 * - Tier 1: requires available credits (pass hasCredits from caller)
 * - Tier 2/3: unlimited
 */
export function canPublishJob(planTier: PlanTier, hasCredits: boolean): GateResult {
  if (planTier === "PAY_AS_YOU_GO") {
    if (!hasCredits) {
      return denied(
        "You need listing credits to publish a job. Purchase a listing or credit pack to continue.",
        "PAY_AS_YOU_GO"
      );
    }
    return ALLOWED;
  }
  // LISTINGS and ATS have unlimited jobs
  return ALLOWED;
}

/** Can this org use the built-in apply form on job postings? */
export function canUseApplyForm(planTier: PlanTier): GateResult {
  if (planTier === "PAY_AS_YOU_GO") {
    return denied(
      "The built-in apply form requires the Listings plan or higher. Upgrade to enable in-platform applications.",
      "LISTINGS"
    );
  }
  return ALLOWED;
}

/** Can this org view the applicant list? */
export function canViewApplicants(planTier: PlanTier): GateResult {
  if (planTier === "PAY_AS_YOU_GO") {
    return denied("Viewing applicants requires the Listings plan or higher.", "LISTINGS");
  }
  return ALLOWED;
}

/** Can this org manage the pipeline (move candidates, kanban)? */
export function canManagePipeline(planTier: PlanTier): GateResult {
  if (planTier !== "ATS") {
    return denied(
      "Pipeline management requires the ATS plan. Upgrade to manage candidates through your hiring stages.",
      "ATS"
    );
  }
  return ALLOWED;
}

/** Can this org send messages to candidates? */
export function canMessageCandidates(planTier: PlanTier): GateResult {
  if (planTier !== "ATS") {
    return denied("Candidate messaging requires the ATS plan.", "ATS");
  }
  return ALLOWED;
}

/** Can this org score/review candidates? */
export function canScoreCandidates(planTier: PlanTier): GateResult {
  if (planTier !== "ATS") {
    return denied("Candidate scoring and reviews require the ATS plan.", "ATS");
  }
  return ALLOWED;
}

/** Can this org schedule interviews? */
export function canScheduleInterviews(planTier: PlanTier): GateResult {
  if (planTier !== "ATS") {
    return denied("Interview scheduling requires the ATS plan.", "ATS");
  }
  return ALLOWED;
}

/**
 * Can this org create another job template?
 * - Tier 1: max 3
 * - Tier 2/3: unlimited
 */
export function canCreateTemplate(planTier: PlanTier, currentCount: number): GateResult {
  const features = PLAN_FEATURES[planTier];
  if (currentCount >= features.maxTemplates) {
    return denied(
      `You've reached the maximum of ${features.maxTemplates} job templates on your current plan. Upgrade to create unlimited templates.`,
      "LISTINGS"
    );
  }
  return ALLOWED;
}

/** Can this org use team collaboration features? */
export function canUseTeamCollaboration(planTier: PlanTier): GateResult {
  if (planTier !== "ATS") {
    return denied("Team collaboration features require the ATS plan.", "ATS");
  }
  return ALLOWED;
}

// =================================================================
// Utility: Check if a plan tier has a specific capability
// =================================================================

export function hasCapability(planTier: PlanTier, capability: keyof PlanFeatures): boolean {
  const features = PLAN_FEATURES[planTier];
  const value = features[capability];
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value > 0;
  return value !== null;
}

/**
 * Get the minimum plan tier required for a capability.
 * Used for upgrade prompts.
 */
export function getRequiredTier(capability: keyof PlanFeatures): PlanTier {
  const tiers: PlanTier[] = ["PAY_AS_YOU_GO", "LISTINGS", "ATS"];
  for (const tier of tiers) {
    if (hasCapability(tier, capability)) return tier;
  }
  return "ATS";
}
