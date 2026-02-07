import { basePrisma } from "@/lib/db";
import { createAuditLog } from "@/lib/audit";
import { logger, formatError } from "@/lib/logger";

type SoftDeleteModel = "application" | "review" | "session";

/**
 * Soft-delete a record by setting deletedAt = now().
 * Uses basePrisma to bypass the soft-delete extension filter.
 * Also handles cascade soft-deletes for related records.
 */
export async function softDelete(
  model: SoftDeleteModel,
  id: string,
  userId?: string
): Promise<void> {
  const now = new Date();

  // Perform the soft delete
  await (basePrisma[model] as any).update({
    where: { id },
    data: { deletedAt: now },
  });

  // Cascade soft-deletes for related records
  if (model === "session") {
    // Soft-delete associated review if exists
    await (basePrisma.review as any).updateMany({
      where: { sessionId: id, deletedAt: null },
      data: { deletedAt: now },
    });
  }

  if (model === "application") {
    // Soft-delete associated offer record if exists
    try {
      await (basePrisma as any).offerRecord?.updateMany?.({
        where: { applicationId: id },
        data: { deletedAt: now },
      });
    } catch {
      // OfferRecord may not have deletedAt field, skip gracefully
    }
  }

  // Audit log
  await createAuditLog({
    action: "DELETE",
    entityType: model.charAt(0).toUpperCase() + model.slice(1),
    entityId: id,
    userId,
    changes: { deletedAt: { from: null, to: now.toISOString() } },
  }).catch((err) => {
    logger.error("Failed to create audit log for soft delete", {
      error: formatError(err),
      model,
      entityId: id,
    });
  });
}

/**
 * Restore a soft-deleted record by setting deletedAt = null.
 * Admin-only operation.
 */
export async function restoreRecord(
  model: SoftDeleteModel,
  id: string,
  userId?: string
): Promise<void> {
  await (basePrisma[model] as any).update({
    where: { id },
    data: { deletedAt: null },
  });

  // Restore cascaded records
  if (model === "session") {
    await (basePrisma.review as any).updateMany({
      where: { sessionId: id, deletedAt: { not: null } },
      data: { deletedAt: null },
    });
  }

  // Audit log
  await createAuditLog({
    action: "UPDATE",
    entityType: model.charAt(0).toUpperCase() + model.slice(1),
    entityId: id,
    userId,
    changes: { deletedAt: { from: new Date(), to: null } },
  }).catch((err) => {
    logger.error("Failed to create audit log for restore", {
      error: formatError(err),
      model,
      entityId: id,
    });
  });
}
