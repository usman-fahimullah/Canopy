/**
 * Scorecard Templates — Structured evaluation criteria for candidate reviews.
 *
 * Instead of a single star rating, evaluators score candidates across
 * multiple criteria. Each criterion gets a 1-5 rating, and the overall
 * score is computed as the average.
 *
 * Templates are stage-aware: different stages might emphasize different
 * criteria (e.g., "Technical Skills" for screening, "Culture Fit" for
 * interviews).
 *
 * Philosophy: "Human-first, AI-enabled" — criteria guide evaluation,
 * but the evaluator always has the final say with their recommendation.
 */

/* -------------------------------------------------------------------
   Types
   ------------------------------------------------------------------- */

export interface ScorecardCriterion {
  /** Unique key for this criterion */
  id: string;
  /** Display label */
  label: string;
  /** Help text shown below the label */
  description: string;
  /** Whether this criterion is required (must be rated) */
  required: boolean;
}

export interface ScorecardSection {
  /** Unique key for this section */
  id: string;
  /** Section heading */
  title: string;
  /** Criteria within this section */
  criteria: ScorecardCriterion[];
}

export interface ScorecardTemplate {
  /** Template key */
  id: string;
  /** Display name */
  name: string;
  /** When to use this template */
  description: string;
  /** Which pipeline stages this template applies to (empty = all) */
  stages: string[];
  /** Sections containing criteria */
  sections: ScorecardSection[];
}

/** The responses JSON stored in the Score model */
export interface ScorecardResponses {
  /** Criterion ID → rating (1-5) */
  ratings: Record<string, number>;
  /** Computed average of all ratings */
  averageRating: number;
}

/* -------------------------------------------------------------------
   Default Templates
   ------------------------------------------------------------------- */

/**
 * General screening template — used for Applied and Screening stages.
 */
const screeningTemplate: ScorecardTemplate = {
  id: "screening",
  name: "Screening Evaluation",
  description: "Quick assessment for resume screening and initial review",
  stages: ["applied", "screening"],
  sections: [
    {
      id: "qualifications",
      title: "Qualifications",
      criteria: [
        {
          id: "relevant_experience",
          label: "Relevant Experience",
          description: "Does the candidate have relevant experience for this role?",
          required: true,
        },
        {
          id: "education_certs",
          label: "Education & Certifications",
          description: "Does the candidate meet educational or certification requirements?",
          required: false,
        },
        {
          id: "green_skills",
          label: "Green & Climate Skills",
          description: "Alignment with sustainability/climate competencies relevant to the role",
          required: false,
        },
      ],
    },
    {
      id: "fit",
      title: "Role Fit",
      criteria: [
        {
          id: "role_alignment",
          label: "Role Alignment",
          description: "How well does their background match the job requirements?",
          required: true,
        },
        {
          id: "communication",
          label: "Communication Quality",
          description: "Quality of resume, cover letter, and application responses",
          required: false,
        },
      ],
    },
  ],
};

/**
 * Interview template — used for Interview stage.
 */
const interviewTemplate: ScorecardTemplate = {
  id: "interview",
  name: "Interview Evaluation",
  description: "Detailed assessment after interviewing the candidate",
  stages: ["interview"],
  sections: [
    {
      id: "technical",
      title: "Technical Competency",
      criteria: [
        {
          id: "technical_skills",
          label: "Technical Skills",
          description: "Demonstrated technical ability relevant to the role",
          required: true,
        },
        {
          id: "problem_solving",
          label: "Problem Solving",
          description: "Ability to analyze problems and propose effective solutions",
          required: true,
        },
        {
          id: "domain_knowledge",
          label: "Domain Knowledge",
          description: "Understanding of the industry and relevant climate/sustainability topics",
          required: false,
        },
      ],
    },
    {
      id: "interpersonal",
      title: "Interpersonal & Culture",
      criteria: [
        {
          id: "communication_skills",
          label: "Communication Skills",
          description: "Clarity of expression, active listening, and professionalism",
          required: true,
        },
        {
          id: "culture_fit",
          label: "Culture & Values Alignment",
          description: "Alignment with team values and mission-driven work",
          required: true,
        },
        {
          id: "leadership",
          label: "Leadership & Initiative",
          description: "Evidence of leadership, ownership, and self-direction",
          required: false,
        },
      ],
    },
    {
      id: "potential",
      title: "Growth Potential",
      criteria: [
        {
          id: "learning_ability",
          label: "Learning Ability",
          description: "Curiosity, adaptability, and willingness to grow",
          required: false,
        },
        {
          id: "motivation",
          label: "Motivation & Passion",
          description: "Genuine enthusiasm for the role and the company's mission",
          required: true,
        },
      ],
    },
  ],
};

/**
 * Final review template — used for Offer and Hired stages.
 */
const finalTemplate: ScorecardTemplate = {
  id: "final",
  name: "Final Review",
  description: "High-level assessment before making an offer",
  stages: ["offer", "hired"],
  sections: [
    {
      id: "overall",
      title: "Overall Assessment",
      criteria: [
        {
          id: "overall_fit",
          label: "Overall Fit for Role",
          description: "Holistic assessment of the candidate's suitability",
          required: true,
        },
        {
          id: "team_fit",
          label: "Team Compatibility",
          description: "How well will they integrate with the existing team?",
          required: true,
        },
        {
          id: "long_term_potential",
          label: "Long-term Potential",
          description: "Potential for growth and long-term contribution",
          required: false,
        },
      ],
    },
  ],
};

/* -------------------------------------------------------------------
   Template Registry
   ------------------------------------------------------------------- */

/** All default templates */
export const DEFAULT_SCORECARD_TEMPLATES: ScorecardTemplate[] = [
  screeningTemplate,
  interviewTemplate,
  finalTemplate,
];

/**
 * Get the appropriate scorecard template for a given pipeline stage.
 * Falls back to the screening template if no stage-specific template exists.
 */
export function getTemplateForStage(stage: string): ScorecardTemplate {
  const match = DEFAULT_SCORECARD_TEMPLATES.find((t) => t.stages.includes(stage));
  return match ?? screeningTemplate;
}

/**
 * Compute the overall rating from scorecard responses.
 * Returns a number 1-5 (rounded to nearest integer for the DB).
 */
export function computeOverallRating(responses: ScorecardResponses): number {
  const ratings = Object.values(responses.ratings);
  if (ratings.length === 0) return 3; // Neutral fallback
  const avg = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
  return Math.max(1, Math.min(5, Math.round(avg)));
}

/**
 * Map a numeric rating (1-5) to a recommendation.
 */
export function ratingToRecommendation(
  rating: number
): "STRONG_NO" | "NO" | "NEUTRAL" | "YES" | "STRONG_YES" {
  if (rating <= 1) return "STRONG_NO";
  if (rating <= 2) return "NO";
  if (rating <= 3) return "NEUTRAL";
  if (rating <= 4) return "YES";
  return "STRONG_YES";
}

/**
 * Get all required criterion IDs from a template.
 */
export function getRequiredCriterionIds(template: ScorecardTemplate): string[] {
  return template.sections.flatMap((s) => s.criteria.filter((c) => c.required).map((c) => c.id));
}

/**
 * Check if all required criteria have been rated.
 */
export function areRequiredCriteriaRated(
  template: ScorecardTemplate,
  ratings: Record<string, number>
): boolean {
  const required = getRequiredCriterionIds(template);
  return required.every((id) => typeof ratings[id] === "number" && ratings[id] >= 1);
}
