import { z } from "zod";

/**
 * Approval Request Validators
 *
 * Schemas for creating and responding to approval requests
 */

export const CreateApprovalSchema = z.object({
  approverId: z.string().min(1, "Approver ID is required"),
  type: z.enum(["JOB_PUBLISH", "OFFER_SEND"]),
  entityId: z.string().min(1, "Entity ID is required"),
});

export type CreateApprovalInput = z.infer<typeof CreateApprovalSchema>;

export const RespondApprovalSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  reason: z.string().max(1000, "Reason must be under 1000 characters").optional(),
});

export type RespondApprovalInput = z.infer<typeof RespondApprovalSchema>;

export const ApprovalQuerySchema = z.object({
  status: z
    .enum(["PENDING", "APPROVED", "REJECTED"])
    .optional(),
  type: z
    .enum(["JOB_PUBLISH", "OFFER_SEND"])
    .optional(),
  skip: z.coerce.number().min(0).default(0),
  take: z.coerce.number().min(1).max(100).default(25),
});

export type ApprovalQueryInput = z.infer<typeof ApprovalQuerySchema>;
