import { z } from "zod";

export const CreateInterviewSchema = z.object({
  applicationId: z.string().min(1, "Application ID is required"),
  interviewerId: z.string().min(1, "Interviewer ID is required"),
  scheduledAt: z.string().datetime({ message: "Scheduled time must be a valid ISO datetime" }),
  duration: z.number().int().min(15).max(480).default(60), // 15 minutes to 8 hours
  type: z.enum(["PHONE", "VIDEO", "ONSITE"]).default("VIDEO"),
  location: z.string().max(500).optional(), // Physical address for ONSITE
  meetingLink: z.string().url().optional(), // Video call URL
  notes: z.string().max(5000).optional(),
  /** Pipeline stage this interview is being scheduled at */
  stageId: z.string().optional(),
});

export const UpdateInterviewSchema = z.object({
  scheduledAt: z.string().datetime().optional(),
  duration: z.number().int().min(15).max(480).optional(),
  type: z.enum(["PHONE", "VIDEO", "ONSITE"]).optional(),
  location: z.string().max(500).nullable().optional(),
  meetingLink: z.string().url().nullable().optional(),
  notes: z.string().max(5000).nullable().optional(),
  status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED"]).optional(),
});

export type CreateInterviewInput = z.infer<typeof CreateInterviewSchema>;
export type UpdateInterviewInput = z.infer<typeof UpdateInterviewSchema>;
