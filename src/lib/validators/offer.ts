import { z } from "zod";

export const CreateOfferSchema = z.object({
  applicationId: z.string().min(1, "Application ID is required"),
  salary: z.number().int().min(0).optional(),
  salaryCurrency: z.string().default("USD"),
  startDate: z.string().datetime({ message: "Start date must be a valid ISO datetime" }),
  department: z.string().optional(),
  managerId: z.string().optional(),
  notes: z.string().max(5000).optional(),
  signingMethod: z.enum(["SIGNING_LINK", "DOCUMENT_UPLOAD", "OFFLINE"]),
  signingLink: z.string().url().optional(),
  signingDocumentUrl: z.string().url().optional(),
  signingInstructions: z.string().max(2000).optional(),
  letterContent: z.string().min(1, "Letter content is required"),
});

export const UpdateOfferSchema = z.object({
  salary: z.number().int().min(0).optional(),
  salaryCurrency: z.string().optional(),
  startDate: z.string().datetime().optional(),
  department: z.string().optional(),
  managerId: z.string().optional(),
  notes: z.string().max(5000).optional(),
  signingMethod: z.enum(["SIGNING_LINK", "DOCUMENT_UPLOAD", "OFFLINE"]).optional(),
  signingLink: z.string().url().nullable().optional(),
  signingDocumentUrl: z.string().url().nullable().optional(),
  signingInstructions: z.string().max(2000).nullable().optional(),
  letterContent: z.string().optional(),
});

export const OfferPreviewSchema = z.object({
  applicationId: z.string().min(1),
  salary: z.number().int().min(0).optional(),
  startDate: z.string().datetime().optional(),
  department: z.string().optional(),
  managerId: z.string().optional(),
  notes: z.string().optional(),
});
