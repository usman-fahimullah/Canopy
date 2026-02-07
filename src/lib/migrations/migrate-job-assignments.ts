/**
 * One-time migration: Move recruiterId and hiringManagerId from
 * Job.formConfig JSON blob to proper FK columns on the Job model.
 *
 * Run via: POST /api/canopy/admin/migrate-assignments (temporary route)
 * or: npx tsx src/lib/migrations/migrate-job-assignments.ts
 */
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";

export async function migrateJobAssignments(): Promise<{
  processed: number;
  migrated: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let migrated = 0;

  const jobs = await prisma.job.findMany({
    where: { formConfig: { not: Prisma.JsonNullValueFilter.JsonNull } },
    select: { id: true, formConfig: true, organizationId: true },
  });

  for (const job of jobs) {
    const fc = job.formConfig as Record<string, unknown> | null;
    if (!fc) continue;

    const updates: Record<string, unknown> = {};

    // Migrate recruiterId
    if (typeof fc.recruiterId === "string" && fc.recruiterId) {
      const member = await prisma.organizationMember.findFirst({
        where: { id: fc.recruiterId, organizationId: job.organizationId },
        select: { id: true },
      });
      if (member) {
        updates.recruiterId = fc.recruiterId;
      } else {
        errors.push(
          `Job ${job.id}: recruiterId ${fc.recruiterId} not found in org ${job.organizationId}`
        );
      }
    }

    // Migrate hiringManagerId
    if (typeof fc.hiringManagerId === "string" && fc.hiringManagerId) {
      const member = await prisma.organizationMember.findFirst({
        where: { id: fc.hiringManagerId, organizationId: job.organizationId },
        select: { id: true },
      });
      if (member) {
        updates.hiringManagerId = fc.hiringManagerId;
      } else {
        errors.push(
          `Job ${job.id}: hiringManagerId ${fc.hiringManagerId} not found in org ${job.organizationId}`
        );
      }
    }

    if (Object.keys(updates).length > 0) {
      try {
        await prisma.job.update({
          where: { id: job.id },
          data: updates,
        });
        migrated++;
      } catch (err) {
        errors.push(`Job ${job.id}: update failed — ${formatError(err)}`);
      }
    }
  }

  logger.info("Job assignment migration complete", {
    processed: jobs.length,
    migrated,
    errorCount: errors.length,
  });

  return { processed: jobs.length, migrated, errors };
}
