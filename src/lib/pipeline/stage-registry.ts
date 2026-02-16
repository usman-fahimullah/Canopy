/**
 * Unified Pipeline Stage Registry
 *
 * Single source of truth for all stage definitions, phase groups,
 * and data logic. Both the employer Kanban board and job seeker
 * application tracker derive their configuration from this registry.
 *
 * NOTE: This file is server-safe (no React component imports).
 * For visual config (icons, colors), see `stage-registry-ui.ts`.
 *
 * Architecture:
 *   PhaseGroup → bridges employer stages to seeker sections
 *   StageDefinition → metadata for each individual pipeline stage
 */

// ============================================
// CORE TYPES
// ============================================

/**
 * Canonical phase groups that bridge employer stages to seeker sections.
 * Every pipeline stage (built-in or custom) belongs to exactly one phase group.
 */
export type PhaseGroup =
  | "applied"
  | "review"
  | "interview"
  | "offer"
  | "hired"
  | "rejected"
  | "withdrawn"
  | "talent-pool";

/**
 * Seeker-facing application sections (used in the "Your Jobs" page).
 * Multiple phase groups collapse into fewer seeker sections.
 */
export type SeekerSection = "saved" | "applied" | "interview" | "offer" | "hired" | "ineligible";

/**
 * Configuration for stage-gating rules.
 * Defines requirements that must be met before a candidate can advance past a stage.
 */
export interface StageConfig {
  /** Minimum scorecards required before advancing. 0 or undefined = no gate. */
  requiredScorecards?: number;
  /** Minimum completed interviews required before advancing. 0 or undefined = no gate. */
  requiredInterviews?: number;
  /** Override scorecard template ID for this stage */
  scorecardTemplateId?: string;
  /** Whether an email must be sent before advancing */
  requiresEmail?: boolean;
}

/**
 * Full definition for a single pipeline stage.
 */
export interface StageDefinition {
  /** Unique stage identifier, e.g., "screening", "phone-screen" */
  id: string;
  /** Human-readable name, e.g., "Screening", "Phone Screen" */
  name: string;
  /** Which phase group this stage belongs to */
  phaseGroup: PhaseGroup;
  /** Whether this is a built-in (non-deletable) stage */
  isBuiltIn: boolean;
  /** Optional gating configuration for this stage */
  config?: StageConfig;
}

export type PhaseGroupColorKey =
  | "purple"
  | "blue"
  | "orange"
  | "green"
  | "red"
  | "yellow"
  | "neutral";

// ============================================
// PHASE GROUP → SEEKER SECTION MAPPING
// ============================================

const PHASE_TO_SEEKER_SECTION: Record<PhaseGroup, SeekerSection> = {
  applied: "applied",
  review: "interview",
  interview: "interview",
  offer: "offer",
  hired: "hired",
  rejected: "ineligible",
  withdrawn: "ineligible",
  "talent-pool": "applied", // hidden from seeker; fallback
};

// ============================================
// BUILT-IN STAGE DEFINITIONS
// ============================================

const BUILT_IN_STAGES: StageDefinition[] = [
  { id: "applied", name: "Applied", phaseGroup: "applied", isBuiltIn: true },
  { id: "screening", name: "Screening", phaseGroup: "review", isBuiltIn: true },
  { id: "qualified", name: "Qualified", phaseGroup: "review", isBuiltIn: true },
  { id: "interview", name: "Interview", phaseGroup: "interview", isBuiltIn: true },
  { id: "offer", name: "Offer", phaseGroup: "offer", isBuiltIn: true },
  { id: "hired", name: "Hired", phaseGroup: "hired", isBuiltIn: true },
  // Special action stages (non-linear, not shown as Kanban columns)
  { id: "rejected", name: "Rejected", phaseGroup: "rejected", isBuiltIn: true },
  { id: "talent-pool", name: "Talent Pool", phaseGroup: "talent-pool", isBuiltIn: true },
];

/** Stage lookup map for O(1) access */
const STAGE_MAP = new Map<string, StageDefinition>(BUILT_IN_STAGES.map((s) => [s.id, s]));

// ============================================
// KEYWORD → PHASE GROUP INFERENCE
// ============================================

/**
 * Keywords used to infer phase group from custom stage names/IDs
 * when phaseGroup is not explicitly set.
 */
const PHASE_GROUP_KEYWORDS: { group: PhaseGroup; keywords: string[] }[] = [
  {
    group: "applied",
    keywords: ["applied", "new", "received", "submission"],
  },
  {
    group: "review",
    keywords: [
      "screen",
      "screening",
      "review",
      "reviewing",
      "qualified",
      "assessment",
      "evaluate",
      "background",
      "check",
      "shortlist",
    ],
  },
  {
    group: "interview",
    keywords: [
      "interview",
      "phone",
      "technical",
      "culture",
      "onsite",
      "on-site",
      "panel",
      "final",
      "behavioral",
      "case-study",
    ],
  },
  {
    group: "offer",
    keywords: ["offer", "negotiation", "compensation", "package"],
  },
  {
    group: "hired",
    keywords: ["hired", "accepted", "onboarding", "start"],
  },
  {
    group: "rejected",
    keywords: ["rejected", "declined", "denied", "disqualified"],
  },
  {
    group: "withdrawn",
    keywords: ["withdrawn", "withdrew", "cancelled"],
  },
];

/**
 * Infer a phase group from a stage ID or name by keyword matching.
 * Returns "review" as the default fallback.
 */
function inferPhaseGroup(stageIdOrName: string): PhaseGroup {
  const normalized = stageIdOrName.toLowerCase().replace(/[-_]/g, " ");

  for (const { group, keywords } of PHASE_GROUP_KEYWORDS) {
    if (keywords.some((kw) => normalized.includes(kw))) {
      return group;
    }
  }

  return "review"; // safe default for unknown custom stages
}

// ============================================
// PUBLIC API
// ============================================

/**
 * Get the phase group for a given stage ID.
 * Checks built-in stages first, then infers from keywords.
 */
export function getPhaseGroup(stageId: string): PhaseGroup {
  const builtIn = STAGE_MAP.get(stageId);
  if (builtIn) return builtIn.phaseGroup;
  return inferPhaseGroup(stageId);
}

/**
 * Get the seeker-facing section for a given stage ID.
 * Replaces the fragile mapStatusToSection() switch statement.
 */
export function getSeekerSection(stageId: string): SeekerSection {
  const group = getPhaseGroup(stageId);
  return PHASE_TO_SEEKER_SECTION[group];
}

/**
 * Get the full stage definition for a built-in stage.
 * Returns undefined for unknown/custom stages (use resolveStage instead).
 */
export function getBuiltInStage(stageId: string): StageDefinition | undefined {
  return STAGE_MAP.get(stageId);
}

/**
 * Resolve a stage entry (from Job.stages JSON) into a full StageDefinition.
 * Handles both built-in stages and custom stages with or without phaseGroup.
 */
export function resolveStage(stage: {
  id: string;
  name: string;
  phaseGroup?: string;
  config?: StageConfig;
}): StageDefinition {
  // Check if it's a built-in stage
  const builtIn = STAGE_MAP.get(stage.id);
  if (builtIn) {
    return {
      ...builtIn,
      name: stage.name, // allow name override for built-in stages
      ...(stage.config ? { config: stage.config } : {}),
    };
  }

  // Custom stage — use explicit phaseGroup or infer
  const phaseGroup = isValidPhaseGroup(stage.phaseGroup)
    ? stage.phaseGroup
    : inferPhaseGroup(stage.id || stage.name);

  return {
    id: stage.id,
    name: stage.name,
    phaseGroup,
    isBuiltIn: false,
    ...(stage.config ? { config: stage.config } : {}),
  };
}

/**
 * Parse a Job's stages JSON string and return enriched StageDefinitions.
 * Handles missing/malformed JSON gracefully.
 */
export function resolveJobStages(stagesJson: string | null | undefined): StageDefinition[] {
  if (!stagesJson) return getDefaultStages();

  try {
    const parsed = JSON.parse(stagesJson) as Array<{
      id: string;
      name: string;
      phaseGroup?: string;
      config?: StageConfig;
    }>;

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return getDefaultStages();
    }

    return parsed.map(resolveStage);
  } catch {
    return getDefaultStages();
  }
}

/**
 * Compute phase progress for a seeker — where they are within a
 * phase group's stages for a specific job.
 */
export function getPhaseProgress(
  currentStageId: string,
  jobStages: StageDefinition[]
): {
  current: number;
  total: number;
  stageNames: string[];
} {
  const currentGroup = getPhaseGroup(currentStageId);
  const groupStages = jobStages.filter((s) => s.phaseGroup === currentGroup);
  const currentIdx = groupStages.findIndex((s) => s.id === currentStageId);

  return {
    current: currentIdx + 1, // 1-based
    total: groupStages.length,
    stageNames: groupStages.map((s) => s.name),
  };
}

/**
 * Get the default pipeline stages (used when a job has no custom stages).
 * Only returns the linear pipeline stages (not rejected/talent-pool).
 */
export function getDefaultStages(): StageDefinition[] {
  return BUILT_IN_STAGES.filter(
    (s) => s.phaseGroup !== "rejected" && s.phaseGroup !== "talent-pool"
  );
}

/**
 * Get all built-in stage definitions including special action stages.
 */
export function getAllBuiltInStages(): StageDefinition[] {
  return [...BUILT_IN_STAGES];
}

/**
 * The list of phase groups available for employers to assign to custom stages.
 * Excludes "rejected", "withdrawn", and "talent-pool" which are system-managed.
 */
export const ASSIGNABLE_PHASE_GROUPS: {
  value: PhaseGroup;
  label: string;
  description: string;
}[] = [
  { value: "applied", label: "Applied", description: "Initial application stage" },
  { value: "review", label: "Review", description: "Screening, assessments, background checks" },
  { value: "interview", label: "Interview", description: "Phone screens, technical, culture fit" },
  { value: "offer", label: "Offer", description: "Offer negotiation and preparation" },
  { value: "hired", label: "Hired", description: "Accepted and onboarding" },
];

/**
 * Special action stages that exist outside the linear pipeline.
 */
export const SPECIAL_ACTION_STAGES = ["rejected", "talent-pool"] as const;

// ============================================
// HELPERS
// ============================================

function isValidPhaseGroup(value: string | undefined): value is PhaseGroup {
  if (!value) return false;
  return [
    "applied",
    "review",
    "interview",
    "offer",
    "hired",
    "rejected",
    "withdrawn",
    "talent-pool",
  ].includes(value);
}
