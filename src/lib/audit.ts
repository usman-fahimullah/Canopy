import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";

interface AuditLogParams {
  /** Action type: "CREATE" | "UPDATE" | "DELETE" | "REFUND" | "APPROVE" | "REJECT" */
  action: string;
  /** Model name: "Booking" | "CoachProfile" | "Application" | "Session" */
  entityType: string;
  /** Primary key of the affected record */
  entityId: string;
  /** Account ID of the actor (omit for system/webhook actions) */
  userId?: string;
  /** Field-level changes: { field: { from, to } } */
  changes?: Record<string, { from: unknown; to: unknown }>;
  /** Extra context: IP address, rejection reason, webhook event ID, etc. */
  metadata?: Record<string, unknown>;
}

/**
 * Create an audit log entry for sensitive operations.
 *
 * This is fire-and-forget by design — audit logging should never
 * block or fail the primary operation. Errors are logged but not thrown.
 *
 * @example
 *   await createAuditLog({
 *     action: "REJECT",
 *     entityType: "CoachProfile",
 *     entityId: coach.id,
 *     userId: account.id,
 *     changes: { status: { from: "PENDING", to: "REJECTED" } },
 *     metadata: { reason: rejectionReason, ip },
 *   });
 */
export async function createAuditLog(params: AuditLogParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        userId: params.userId ?? null,
        changes: params.changes ? JSON.stringify(params.changes) : null,
        metadata: params.metadata ? JSON.stringify(params.metadata) : null,
      },
    });
  } catch (error) {
    // Never let audit logging break the primary operation
    logger.error("Failed to create audit log", {
      error: formatError(error),
      ...params,
    });
  }
}
