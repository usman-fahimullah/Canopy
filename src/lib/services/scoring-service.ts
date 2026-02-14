/**
 * Scoring Service — Blind review enforcement and score aggregation.
 *
 * Handles:
 * - Blind review: hide other reviewers' scores until all assigned reviewers submit
 * - Score aggregation: weighted averages per criterion, recommendation breakdown
 * - Reviewer assignment tracking via JobAssignment model
 */

import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { safeJsonParse } from "@/lib/safe-json";

/* -------------------------------------------------------------------
   Types
   ------------------------------------------------------------------- */

export interface ScoreResponse {
  criterionId: string;
  criterionLabel: string;
  rating: number;
  weight?: number;
}

export interface ScorecardResult {
  id: string;
  scorerId: string;
  scorerName: string | null;
  scorerAvatar: string | null;
  overallRating: number;
  recommendation: string;
  comments: string | null;
  responses: ScoreResponse[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BlindReviewStatus {
  /** Total assigned reviewers for this job */
  totalAssigned: number;
  /** Number who have submitted scorecards for this application */
  submitted: number;
  /** Whether blind review period is over (all assigned have submitted) */
  isBlindLifted: boolean;
  /** Whether blind review is enabled for this job (has assigned reviewers) */
  isBlindEnabled: boolean;
}

export interface AggregateScores {
  /** Average overall rating across all scorecards */
  averageRating: number;
  /** Number of scorecards submitted */
  totalScores: number;
  /** Recommendation breakdown */
  recommendations: {
    STRONG_YES: number;
    YES: number;
    NEUTRAL: number;
    NO: number;
    STRONG_NO: number;
  };
  /** Per-criterion averages (weighted if weights provided) */
  criterionAverages: {
    criterionId: string;
    criterionLabel: string;
    averageRating: number;
    weight: number;
  }[];
  /** Weighted overall score (0-100 scale) */
  weightedScore: number;
}

/* -------------------------------------------------------------------
   Blind Review Status
   ------------------------------------------------------------------- */

/**
 * Check the blind review status for an application.
 * Blind review means reviewers can't see each other's scores until
 * all assigned reviewers have submitted.
 */
export async function getBlindReviewStatus(params: {
  applicationId: string;
  jobId: string;
}): Promise<BlindReviewStatus> {
  const { applicationId, jobId } = params;

  try {
    const [assignedCount, submittedCount] = await Promise.all([
      prisma.jobAssignment.count({ where: { jobId } }),
      prisma.score.count({ where: { applicationId } }),
    ]);

    // If no one is assigned, blind review is not applicable
    if (assignedCount === 0) {
      return {
        totalAssigned: 0,
        submitted: submittedCount,
        isBlindLifted: true,
        isBlindEnabled: false,
      };
    }

    return {
      totalAssigned: assignedCount,
      submitted: submittedCount,
      isBlindLifted: submittedCount >= assignedCount,
      isBlindEnabled: true,
    };
  } catch (error) {
    logger.error("Failed to get blind review status", {
      error: formatError(error),
      applicationId,
      jobId,
    });
    // Default to lifted so we don't block access on error
    return {
      totalAssigned: 0,
      submitted: 0,
      isBlindLifted: true,
      isBlindEnabled: false,
    };
  }
}

/* -------------------------------------------------------------------
   Get Scores (with blind review enforcement)
   ------------------------------------------------------------------- */

/**
 * Get scores for an application with blind review enforcement.
 *
 * During blind review (not all assigned reviewers submitted):
 * - Regular reviewers can only see their own score
 * - ADMIN/OWNER/RECRUITER can see all scores (bypass blind)
 *
 * After blind review (all assigned reviewers submitted):
 * - Everyone sees all scores
 */
export async function getScoresForApplication(params: {
  applicationId: string;
  jobId: string;
  requesterId: string; // The org member requesting scores
  requesterRole: string;
}): Promise<{
  scores: ScorecardResult[];
  blindReview: BlindReviewStatus;
  aggregate: AggregateScores | null;
}> {
  const { applicationId, jobId, requesterId, requesterRole } = params;

  try {
    const blindReview = await getBlindReviewStatus({ applicationId, jobId });

    // Determine if requester can bypass blind review
    const BYPASS_ROLES = ["OWNER", "ADMIN", "RECRUITER"];
    const canBypassBlind = BYPASS_ROLES.includes(requesterRole);
    const showAllScores = blindReview.isBlindLifted || canBypassBlind;

    // Fetch scores with scorer info
    const scoreWhere = showAllScores ? { applicationId } : { applicationId, scorerId: requesterId };

    const rawScores = await prisma.score.findMany({
      where: scoreWhere,
      include: {
        scorer: {
          include: {
            account: {
              select: { name: true, avatar: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const scores: ScorecardResult[] = rawScores.map((s) => ({
      id: s.id,
      scorerId: s.scorerId,
      scorerName: s.scorer.account.name,
      scorerAvatar: s.scorer.account.avatar,
      overallRating: s.overallRating,
      recommendation: s.recommendation,
      comments: s.comments,
      responses: safeJsonParse<ScoreResponse[]>(s.responses, []),
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }));

    // Only compute aggregates if blind review is lifted or requester can bypass
    let aggregate: AggregateScores | null = null;
    if (showAllScores && rawScores.length > 0) {
      aggregate = computeAggregateScores(scores);
    }

    return { scores, blindReview, aggregate };
  } catch (error) {
    logger.error("Failed to get scores for application", {
      error: formatError(error),
      applicationId,
    });
    return {
      scores: [],
      blindReview: {
        totalAssigned: 0,
        submitted: 0,
        isBlindLifted: true,
        isBlindEnabled: false,
      },
      aggregate: null,
    };
  }
}

/* -------------------------------------------------------------------
   Score Aggregation
   ------------------------------------------------------------------- */

/**
 * Compute aggregate scores across all submitted scorecards.
 * Returns weighted averages per criterion and overall.
 */
function computeAggregateScores(scores: ScorecardResult[]): AggregateScores {
  if (scores.length === 0) {
    return {
      averageRating: 0,
      totalScores: 0,
      recommendations: { STRONG_YES: 0, YES: 0, NEUTRAL: 0, NO: 0, STRONG_NO: 0 },
      criterionAverages: [],
      weightedScore: 0,
    };
  }

  // Average overall rating
  const averageRating = scores.reduce((sum, s) => sum + s.overallRating, 0) / scores.length;

  // Recommendation breakdown
  const recommendations = {
    STRONG_YES: 0,
    YES: 0,
    NEUTRAL: 0,
    NO: 0,
    STRONG_NO: 0,
  };
  for (const s of scores) {
    const rec = s.recommendation as keyof typeof recommendations;
    if (rec in recommendations) {
      recommendations[rec]++;
    }
  }

  // Per-criterion aggregation
  const criterionMap = new Map<string, { label: string; ratings: number[]; weight: number }>();

  for (const s of scores) {
    for (const r of s.responses) {
      const existing = criterionMap.get(r.criterionId);
      if (existing) {
        existing.ratings.push(r.rating);
      } else {
        criterionMap.set(r.criterionId, {
          label: r.criterionLabel,
          ratings: [r.rating],
          weight: r.weight ?? 1,
        });
      }
    }
  }

  const criterionAverages = Array.from(criterionMap.entries()).map(([criterionId, data]) => ({
    criterionId,
    criterionLabel: data.label,
    averageRating: data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length,
    weight: data.weight,
  }));

  // Weighted overall score (0-100 scale, where 5-star = 100)
  let weightedScore = 0;
  if (criterionAverages.length > 0) {
    const totalWeight = criterionAverages.reduce((sum, c) => sum + c.weight, 0);
    const weightedSum = criterionAverages.reduce((sum, c) => sum + c.averageRating * c.weight, 0);
    weightedScore = totalWeight > 0 ? (weightedSum / totalWeight / 5) * 100 : 0;
  } else {
    // Fallback to simple average if no criteria
    weightedScore = (averageRating / 5) * 100;
  }

  return {
    averageRating: Math.round(averageRating * 100) / 100,
    totalScores: scores.length,
    recommendations,
    criterionAverages,
    weightedScore: Math.round(weightedScore * 100) / 100,
  };
}
