import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { apiError, apiSuccess, apiValidationError } from "@/lib/api-response";
import { logger } from "@/lib/logger";
import { getServerUser } from "@/lib/supabase/get-server-user";
import { getCurrentOrganization } from "@/lib/auth-helpers";
import { CreateApprovalSchema, ApprovalQuerySchema } from "@/lib/validators/approvals";
import { createAuditLog } from "@/lib/audit";

/**
 * GET /api/canopy/approvals
 *
 * List approval requests for the current user.
 * Returns approvals where user is either requester or approver.
 *
 * Query params:
 * - status: PENDING | APPROVED | REJECTED
 * - type: JOB_PUBLISH | OFFER_SEND
 * - skip: pagination offset (default: 0)
 * - take: pagination limit (default: 25, max: 100)
 */
export async function GET(request: NextRequest) {
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

    // Validate query params
    const queryResult = ApprovalQuerySchema.safeParse(
      Object.fromEntries(request.nextUrl.searchParams)
    );

    if (!queryResult.success) {
      return apiValidationError(queryResult.error);
    }

    const { status, type, skip, take } = queryResult.data;

    // Build where clause
    const where: any = {
      organizationId: organization.id,
      OR: [
        { requesterId: member.id }, // User requested approval
        { approverId: member.id }, // User is the approver
      ],
    };

    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = type;
    }

    // Fetch approvals
    const [approvals, total] = await Promise.all([
      prisma.approvalRequest.findMany({
        where,
        select: {
          id: true,
          type: true,
          status: true,
          entityId: true,
          reason: true,
          requester: {
            select: {
              id: true,
              account: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          approver: {
            select: {
              id: true,
              account: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          createdAt: true,
          respondedAt: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.approvalRequest.count({ where }),
    ]);

    logger.info("Approvals listed", {
      organizationId: organization.id,
      accountId: account.id,
      memberId: member.id,
      count: approvals.length,
      total,
    });

    return apiSuccess({
      data: approvals,
      meta: { total, skip, take },
    });
  } catch (error) {
    logger.error("Failed to list approvals", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return apiError("Failed to list approvals", 500);
  }
}

/**
 * POST /api/canopy/approvals
 *
 * Create a new approval request.
 * Requires RECRUITER, ADMIN, or OWNER role.
 *
 * Body:
 * {
 *   approverId: string;
 *   type: "JOB_PUBLISH" | "OFFER_SEND";
 *   entityId: string;
 * }
 */
export async function POST(request: NextRequest) {
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
    const requester = await prisma.organizationMember.findFirst({
      where: {
        accountId: account.id,
        organizationId: organization.id,
      },
    });

    if (!requester) {
      return apiError("Member not found in organization", 403);
    }

    // Check authorization: must be RECRUITER, ADMIN, or OWNER
    if (!["RECRUITER", "ADMIN", "OWNER"].includes(requester.role)) {
      return apiError("Insufficient permissions to create approvals", 403);
    }

    // Parse and validate body
    const body = await request.json();
    const bodyResult = CreateApprovalSchema.safeParse(body);

    if (!bodyResult.success) {
      return apiValidationError(bodyResult.error);
    }

    const { approverId, type, entityId } = bodyResult.data;

    // Verify approver exists and is in same organization
    const approver = await prisma.organizationMember.findFirst({
      where: {
        id: approverId,
        organizationId: organization.id,
      },
    });

    if (!approver) {
      return apiError("Approver not found", 404);
    }

    // Create approval request
    const approval = await prisma.approvalRequest.create({
      data: {
        organizationId: organization.id,
        requesterId: requester.id,
        approverId: approver.id,
        type,
        entityId,
        status: "PENDING",
      },
      select: {
        id: true,
        type: true,
        status: true,
        entityId: true,
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
        createdAt: true,
      },
    });

    // Create audit log
    await createAuditLog({
      userId: account.id,
      action: "CREATE",
      entityType: "ApprovalRequest",
      entityId: approval.id,
      metadata: {
        organizationId: organization.id,
        type,
        approverId: approver.id,
        entityId,
      },
    });

    logger.info("Approval request created", {
      organizationId: organization.id,
      accountId: account.id,
      approvalId: approval.id,
      type,
      approverId: approver.id,
    });

    return apiSuccess(approval, 201);
  } catch (error) {
    logger.error("Failed to create approval request", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return apiError("Failed to create approval request", 500);
  }
}
