import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { apiError, apiSuccess, apiValidationError } from "@/lib/api-response";
import { logger } from "@/lib/logger";
import { getServerUser } from "@/lib/supabase/get-server-user";
import { getCurrentOrganization } from "@/lib/auth-helpers";
import { RespondApprovalSchema } from "@/lib/validators/approvals";
import { createAuditLog } from "@/lib/audit";

/**
 * PATCH /api/canopy/approvals/[id]
 *
 * Respond to an approval request (approve or reject).
 * Must be the assigned approver.
 *
 * Body:
 * {
 *   status: "APPROVED" | "REJECTED";
 *   reason?: string;
 * }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authorization
    const user = await getServerUser();
    if (!user) {
      return apiError("Unauthorized", 401);
    }

    // Get Account from Supabase user ID
    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      select: { id: true },
    });

    if (!account) {
      return apiError("Account not found", 404);
    }

    // Get organization context
    const organization = await getCurrentOrganization(account.id);
    if (!organization) {
      return apiError("Organization not found", 404);
    }

    // Get current user's member record
    const member = await prisma.organizationMember.findFirst({
      where: {
        accountId: account.id,
        organizationId: organization.id,
      },
    });

    if (!member) {
      return apiError("Member not found in organization", 403);
    }

    // Fetch approval request
    const approval = await prisma.approvalRequest.findUnique({
      where: { id: params.id },
      include: {
        requester: {
          select: {
            account: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        approver: {
          select: {
            account: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!approval) {
      return apiError("Approval request not found", 404);
    }

    // Verify organization scoping
    if (approval.organizationId !== organization.id) {
      return apiError("Access denied", 403);
    }

    // Verify user is the approver
    if (approval.approverId !== member.id) {
      return apiError(
        "Only the assigned approver can respond to this request",
        403
      );
    }

    // Verify approval is still pending
    if (approval.status !== "PENDING") {
      return apiError("Approval request has already been responded to", 400);
    }

    // Parse and validate body
    const body = await request.json();
    const bodyResult = RespondApprovalSchema.safeParse(body);

    if (!bodyResult.success) {
      return apiValidationError(bodyResult.error);
    }

    const { status, reason } = bodyResult.data;

    // Update approval request
    const updated = await prisma.approvalRequest.update({
      where: { id: params.id },
      data: {
        status,
        reason: reason || null,
        respondedAt: new Date(),
      },
      select: {
        id: true,
        type: true,
        status: true,
        entityId: true,
        reason: true,
        requester: {
          select: {
            account: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        approver: {
          select: {
            account: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        respondedAt: true,
      },
    });

    // Create audit log
    await createAuditLog({
      userId: account.id,
      action: "UPDATE",
      entityType: "ApprovalRequest",
      entityId: approval.id,
      metadata: {
        organizationId: organization.id,
        previousStatus: approval.status,
        newStatus: status,
        reason: reason || undefined,
      },
    });

    // If approved, trigger the original action
    if (status === "APPROVED") {
      await handleApprovalAction(
        approval.type,
        approval.entityId,
        organization.id
      );
    }

    logger.info("Approval request responded", {
      organizationId: organization.id,
      accountId: account.id,
      approvalId: approval.id,
      status,
      reason,
    });

    return apiSuccess(updated);
  } catch (error) {
    logger.error("Failed to respond to approval request", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return apiError("Failed to respond to approval request", 500);
  }
}

/**
 * Handle the approval action
 *
 * This is a hook point where additional business logic can be applied.
 * Currently updates the entity status to reflect approval.
 */
async function handleApprovalAction(
  type: string,
  entityId: string,
  organizationId: string
): Promise<void> {
  try {
    if (type === "JOB_PUBLISH") {
      // Publish the job
      await prisma.job.update({
        where: { id: entityId },
        data: { status: "PUBLISHED" },
      });
      logger.info("Job published after approval", {
        organizationId,
        jobId: entityId,
      });
    } else if (type === "OFFER_SEND") {
      // Mark offer as sent (if applicable)
      // This depends on your OfferRecord schema
      logger.info("Offer approved and ready to send", {
        organizationId,
        offerId: entityId,
      });
    }
  } catch (error) {
    logger.error("Failed to handle approval action", {
      type,
      entityId,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    // Don't throw - approval response was successful, just log the error
  }
}

