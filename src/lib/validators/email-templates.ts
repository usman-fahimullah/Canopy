import { z } from "zod";

export const CreateEmailTemplateSchema = z.object({
  type: z.enum(["REJECTION", "INTERVIEW_INVITE", "STAGE_ADVANCE", "WELCOME", "CUSTOM"]),
  name: z.string().min(1, "Template name is required").max(100),
  subject: z.string().min(1, "Subject is required").max(200),
  content: z.string().min(1, "Email content is required").max(10000),
  variables: z.array(z.string()).optional().default([]),
});

export type CreateEmailTemplateInput = z.infer<typeof CreateEmailTemplateSchema>;

export const UpdateEmailTemplateSchema = z.object({
  name: z.string().min(1, "Template name is required").max(100).optional(),
  subject: z.string().min(1, "Subject is required").max(200).optional(),
  content: z.string().min(1, "Email content is required").max(10000).optional(),
  variables: z.array(z.string()).optional(),
});

export type UpdateEmailTemplateInput = z.infer<typeof UpdateEmailTemplateSchema>;

export const EmailTemplateQuerySchema = z.object({
  type: z.enum(["REJECTION", "INTERVIEW_INVITE", "STAGE_ADVANCE", "WELCOME", "CUSTOM"]).optional(),
  skip: z.coerce.number().int().min(0).default(0),
  take: z.coerce.number().int().min(1).max(100).default(20),
});

export type EmailTemplateQueryInput = z.infer<typeof EmailTemplateQuerySchema>;
