import { z } from "zod";

export const SubmitApplicationSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),

  // Personal info
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email address"),
  phone: z.string().max(30).optional(),
  dateOfBirth: z.string().optional(),
  pronouns: z.string().max(50).optional(),
  location: z.string().max(200).optional(),

  // Career details
  currentRole: z.string().max(200).optional(),
  currentCompany: z.string().max(200).optional(),
  yearsExperience: z.string().optional(),
  linkedIn: z.string().max(500).optional(),
  portfolio: z.string().max(500).optional(),

  // File URLs (uploaded separately via Supabase Storage)
  resumeUrl: z.string().url().optional(),
  resumeFileName: z.string().max(500).optional(),
  coverLetterUrl: z.string().url().optional(),
  coverLetterFileName: z.string().max(500).optional(),
  portfolioUrl: z.string().url().optional(),
  portfolioFileName: z.string().max(500).optional(),

  // Custom question responses
  questionAnswers: z.record(z.string(), z.string()).optional(),
});

export type SubmitApplicationInput = z.infer<typeof SubmitApplicationSchema>;
