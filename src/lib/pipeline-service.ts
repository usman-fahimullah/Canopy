/**
 * Pipeline Service — Stage transition orchestration.
 *
 * When a candidate moves to a new stage, this service determines
 * what side effects should happen (prompts, automatic actions,
 * validations). Used by the frontend to show contextual prompts
 * before/after stage transitions.
 *
 * Philosophy: "Human-first, AI-enabled" — suggest actions,
 * never force them. The employer always has the final say.
 */

import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { createAuditLog } from "@/lib/audit";
import { resolveJobStages } from "@/lib/pipeline/stage-registry";

/* -------------------------------------------------------------------
   Types
   ------------------------------------------------------------------- */

export type TransitionAction =
  | "prompt_schedule_interview"
  | "prompt_create_offer"
  | "prompt_send_rejection_email"
  | "auto_log_milestone"
  | "suggest_reject_others"
  | "gate_scorecards_required"
  | "gate_interviews_required"
  | "none";

export interface TransitionSideEffect {
  /** The action type */
  action: TransitionAction;
  /** Human-readable prompt for the employer */
  message: string;
  /** Whether the action is required (blocks transition) or optional */
  required: boolean;
  /** Additional data needed for the action */
  metadata?: Record<string, unknown>;
}

export interface TransitionPlan {
  /** Whether the transition is allowed */
  allowed: boolean;
  /** Reason if not allowed */
  blockedReason?: string;
  /** Side effects to handle (in order) */
  sideEffects: TransitionSideEffect[];
}

/* -------------------------------------------------------------------
   Main Function
   ------------------------------------------------------------------- */

/**
 * Determine what should happen when moving a candidate from one stage to another.
 *
 * Call this BEFORE executing the stage transition to get prompts for the user.
 * The frontend uses this to show contextual modals/confirmations.
 */
export async function getTransitionPlan(params: {
  applicationId: string;
  jobId: string;
  fromStage: string;
  toStage: string;
  organizationId: string;
}): Promise<TransitionPlan> {
  const { applicationId, jobId, fromStage, toStage, organizationId } = params;
  const sideEffects: TransitionSideEffect[] = [];

  try {
    // --- Stage Gate Checking ---
    // Read the fromStage's StageConfig and enforce any requirements
    // before allowing the candidate to advance.
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { stages: true },
    });

    if (job) {
      const resolvedStages = resolveJobStages(job.stages);
      const fromStageDef = resolvedStages.find((s) => s.id === fromStage);
      const gateConfig = fromStageDef?.config;

      if (gateConfig) {
        // Gate checks: run independent queries in parallel
        const [scoreCount, interviewCount] = await Promise.all([
          gateConfig.requiredScorecards && gateConfig.requiredScorecards > 0
            ? prisma.score.count({ where: { applicationId, stageId: fromStage } })
            : Promise.resolve(0),
          gateConfig.requiredInterviews && gateConfig.requiredInterviews > 0
            ? prisma.interview.count({
                where: { applicationId, stageId: fromStage, status: "COMPLETED" },
              })
            : Promise.resolve(0),
        ]);

        // Gate: required scorecards
        if (gateConfig.requiredScorecards && gateConfig.requiredScorecards > 0) {
          if (scoreCount < gateConfig.requiredScorecards) {
            sideEffects.push({
              action: "gate_scorecards_required",
              message: `${scoreCount} of ${gateConfig.requiredScorecards} required scorecards submitted for ${fromStageDef?.name ?? fromStage}.`,
              required: true,
              metadata: {
                current: scoreCount,
                required: gateConfig.requiredScorecards,
                stageId: fromStage,
                stageName: fromStageDef?.name ?? fromStage,
              },
            });
          }
        }

        // Gate: required interviews
        if (gateConfig.requiredInterviews && gateConfig.requiredInterviews > 0) {
          if (interviewCount < gateConfig.requiredInterviews) {
            sideEffects.push({
              action: "gate_interviews_required",
              message: `${interviewCount} of ${gateConfig.requiredInterviews} required interviews completed for ${fromStageDef?.name ?? fromStage}.`,
              required: true,
              metadata: {
                current: interviewCount,
                required: gateConfig.requiredInterviews,
                stageId: fromStage,
                stageName: fromStageDef?.name ?? fromStage,
              },
            });
          }
        }
      }
    }

    // --- Moving to Interview stage ---
    if (toStage === "interview") {
      // Check if any interviews are already scheduled
      const existingInterviews = await prisma.interview.count({
        where: {
          applicationId,
          status: { in: ["SCHEDULED", "IN_PROGRESS"] },
        },
      });

      if (existingInterviews === 0) {
        sideEffects.push({
          action: "prompt_schedule_interview",
          message: "Would you like to schedule an interview with this candidate?",
          required: false,
          metadata: { applicationId, jobId },
        });
      }
    }

    // --- Moving to Offer stage ---
    if (toStage === "offer") {
      // Check if an offer already exists
      const existingOffer = await prisma.offerRecord.findUnique({
        where: { applicationId },
        select: { id: true, status: true },
      });

      if (!existingOffer) {
        sideEffects.push({
          action: "prompt_create_offer",
          message: "Create an offer for this candidate to continue.",
          required: true,
          metadata: { applicationId, jobId },
        });
      }
    }

    // --- Moving to Hired stage ---
    if (toStage === "hired") {
      // Count other active candidates for this job
      const otherActiveCandidates = await prisma.application.count({
        where: {
          jobId,
          id: { not: applicationId },
          stage: { notIn: ["rejected", "talent-pool", "hired"] },
        },
      });

      if (otherActiveCandidates > 0) {
        sideEffects.push({
          action: "suggest_reject_others",
          message: `${otherActiveCandidates} other candidate${otherActiveCandidates === 1 ? " is" : "s are"} still active for this role. Would you like to reject them?`,
          required: false,
          metadata: {
            jobId,
            otherCount: otherActiveCandidates,
          },
        });
      }

      sideEffects.push({
        action: "auto_log_milestone",
        message: "Hired milestone will be recorded.",
        required: false,
      });
    }

    // --- Moving to Rejected stage ---
    if (toStage === "rejected") {
      sideEffects.push({
        action: "prompt_send_rejection_email",
        message: "Would you like to send a rejection email to the candidate?",
        required: false,
        metadata: { applicationId },
      });
    }

    return { allowed: true, sideEffects };
  } catch (error) {
    logger.error("Failed to compute transition plan", {
      error: formatError(error),
      applicationId,
      fromStage,
      toStage,
    });

    // Don't block the transition if side effect computation fails
    return { allowed: true, sideEffects: [] };
  }
}

/**
 * Bulk reject all other active candidates for a job.
 * Used after hiring a candidate ("suggest_reject_others" action).
 */
export async function bulkRejectOtherCandidates(params: {
  jobId: string;
  exceptApplicationId: string;
  rejectionReason?: string;
  sendEmails?: boolean;
}): Promise<{ rejectedCount: number }> {
  const { jobId, exceptApplicationId, rejectionReason } = params;

  try {
    const result = await prisma.application.updateMany({
      where: {
        jobId,
        id: { not: exceptApplicationId },
        stage: { notIn: ["rejected", "talent-pool", "hired"] },
      },
      data: {
        stage: "rejected",
        rejectedAt: new Date(),
        rejectionReason: rejectionReason ?? "position_filled",
      },
    });

    logger.info("Bulk rejected candidates", {
      jobId,
      exceptApplicationId,
      rejectedCount: result.count,
    });

    return { rejectedCount: result.count };
  } catch (error) {
    logger.error("Failed to bulk reject candidates", {
      error: formatError(error),
      jobId,
    });
    throw error;
  }
}

/* -------------------------------------------------------------------
   Terminal Outcome Functions
   ------------------------------------------------------------------- */

/**
 * Withdraw an application (candidate-initiated or employer-initiated).
 * Sets a terminal timestamp but preserves the last active stage for potential reopening.
 */
export async function withdrawApplication(params: {
  applicationId: string;
  jobId: string;
  reason?: string;
  actorId: string;
}): Promise<{ success: boolean }> {
  const { applicationId, jobId, reason, actorId } = params;

  try {
    // Get current stage before updating (for audit)
    const current = await prisma.application.findFirst({
      where: { id: applicationId, jobId },
      select: { stage: true },
    });

    if (!current) {
      throw new Error("Application not found");
    }

    await prisma.application.updateMany({
      where: { id: applicationId, jobId },
      data: {
        stage: "withdrawn",
        deletedAt: new Date(), // Using deletedAt as withdrawnAt
      },
    });

    // Fire-and-forget audit log
    createAuditLog({
      action: "UPDATE",
      entityType: "Application",
      entityId: applicationId,
      userId: actorId,
      changes: { stage: { from: current.stage, to: "withdrawn" } },
      metadata: { jobId, reason: reason ?? "voluntary_withdrawal" },
    }).catch((err) => logger.warn("Audit log failed (non-blocking)", { error: formatError(err) }));

    logger.info("Application withdrawn", { applicationId, jobId, reason });
    return { success: true };
  } catch (error) {
    logger.error("Failed to withdraw application", {
      error: formatError(error),
      applicationId,
      jobId,
    });
    throw error;
  }
}

/**
 * Reopen a terminal application (rejected, withdrawn, or talent-pool).
 * Restores the candidate to a specified stage (defaults to "applied").
 */
export async function reopenApplication(params: {
  applicationId: string;
  jobId: string;
  restoreToStage?: string;
  actorId: string;
}): Promise<{ success: boolean; stage: string }> {
  const { applicationId, jobId, restoreToStage = "applied", actorId } = params;

  try {
    const current = await prisma.application.findFirst({
      where: { id: applicationId, jobId },
      select: { stage: true },
    });

    if (!current) {
      throw new Error("Application not found");
    }

    const TERMINAL_STAGES = ["rejected", "withdrawn", "talent-pool"];
    if (!TERMINAL_STAGES.includes(current.stage)) {
      throw new Error(`Application is not in a terminal stage (current: ${current.stage})`);
    }

    await prisma.application.updateMany({
      where: { id: applicationId, jobId },
      data: {
        stage: restoreToStage,
        stageOrder: 0,
        rejectedAt: null,
        rejectionReason: null,
        rejectionNote: null,
        hiredAt: null,
        deletedAt: null,
      },
    });

    createAuditLog({
      action: "UPDATE",
      entityType: "Application",
      entityId: applicationId,
      userId: actorId,
      changes: { stage: { from: current.stage, to: restoreToStage } },
      metadata: { jobId, action: "reopen" },
    }).catch((err) => logger.warn("Audit log failed (non-blocking)", { error: formatError(err) }));

    logger.info("Application reopened", {
      applicationId,
      jobId,
      fromStage: current.stage,
      toStage: restoreToStage,
    });

    return { success: true, stage: restoreToStage };
  } catch (error) {
    logger.error("Failed to reopen application", {
      error: formatError(error),
      applicationId,
      jobId,
    });
    throw error;
  }
}

/**
 * Mark a candidate as hired with optional bulk rejection of remaining candidates.
 * This is an orchestration function that combines the stage update with side effects.
 */
export async function markHired(params: {
  applicationId: string;
  jobId: string;
  actorId: string;
  rejectRemaining?: boolean;
  rejectionReason?: string;
}): Promise<{ success: boolean; rejectedCount?: number }> {
  const { applicationId, jobId, actorId, rejectRemaining, rejectionReason } = params;

  try {
    // Update the application to hired
    await prisma.application.updateMany({
      where: { id: applicationId, jobId },
      data: {
        stage: "hired",
        hiredAt: new Date(),
      },
    });

    createAuditLog({
      action: "UPDATE",
      entityType: "Application",
      entityId: applicationId,
      userId: actorId,
      changes: { stage: { from: "offer", to: "hired" } },
      metadata: { jobId, milestone: "hired" },
    }).catch((err) => logger.warn("Audit log failed (non-blocking)", { error: formatError(err) }));

    logger.info("Candidate marked as hired", { applicationId, jobId });

    let rejectedCount: number | undefined;

    // Optionally reject all other active candidates
    if (rejectRemaining) {
      const result = await bulkRejectOtherCandidates({
        jobId,
        exceptApplicationId: applicationId,
        rejectionReason: rejectionReason ?? "position_filled",
      });
      rejectedCount = result.rejectedCount;
    }

    return { success: true, rejectedCount };
  } catch (error) {
    logger.error("Failed to mark hired", {
      error: formatError(error),
      applicationId,
      jobId,
    });
    throw error;
  }
}
