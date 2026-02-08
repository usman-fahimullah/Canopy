/**
 * Zod validation schemas for API routes.
 *
 * Each schema matches the exact field names used in the corresponding route handler.
 * Use `schema.safeParse(body)` at the top of each write handler, return 422 on failure.
 */

import { z } from "zod";

// --- Reviews ---

export const CreateReviewSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  rating: z
    .number()
    .int("Rating must be an integer")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  comment: z.string().max(2000, "Comment must be 2000 characters or fewer").optional(),
});

export const RespondToReviewSchema = z.object({
  response: z
    .string()
    .min(1, "Response is required")
    .transform((v) => v.trim()),
});

export const FlagReviewSchema = z.object({
  reason: z
    .string()
    .min(1, "Flag reason is required")
    .transform((v) => v.trim()),
});

export const AdminReviewActionSchema = z.object({
  reviewId: z.string().min(1, "Review ID is required"),
  action: z.enum(["hide", "unhide", "unflag"], {
    message: "Action must be hide, unhide, or unflag",
  }),
});

// --- Goals ---

export const GoalCategoryEnum = z.enum([
  "INTERVIEWING",
  "NETWORKING",
  "COMPENSATION",
  "ORGANIZATION",
]);

export const CreateGoalSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .transform((v) => v.trim()),
  description: z
    .string()
    .max(250, "Description must be 250 characters or fewer")
    .nullable()
    .optional(),
  icon: z.string().nullable().optional(),
  category: GoalCategoryEnum.nullable().optional(),
  targetDate: z.string().nullable().optional(),
  applicationId: z.string().nullable().optional(), // Link to job application
  milestones: z
    .array(z.object({ title: z.string().min(1) }))
    .max(20, "Maximum 20 milestones allowed")
    .optional(),
});

export const UpdateGoalSchema = z.object({
  title: z.string().optional(),
  description: z
    .string()
    .max(250, "Description must be 250 characters or fewer")
    .nullable()
    .optional(),
  notes: z.string().max(1000, "Notes must be 1000 characters or fewer").nullable().optional(),
  progress: z.number().min(0).max(100).optional(),
  status: z.string().optional(),
  icon: z.string().nullable().optional(),
  category: GoalCategoryEnum.nullable().optional(),
  targetDate: z.string().nullable().optional(),
  applicationId: z.string().nullable().optional(), // Link to job application
});

// Milestone resource schema (for task links)
export const MilestoneResourceSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or fewer"),
  url: z.string().url("Must be a valid URL"),
});

export const AddMilestoneSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .transform((v) => v.trim()),
  resources: z.array(MilestoneResourceSchema).max(3, "Maximum 3 resources allowed").optional(),
});

export const UpdateMilestoneSchema = z.object({
  title: z.string().min(1).optional(),
  completed: z.boolean().optional(),
  resources: z
    .array(MilestoneResourceSchema)
    .max(3, "Maximum 3 resources allowed")
    .nullable()
    .optional(),
});

// --- Experience ---

export const CreateExperienceSchema = z.object({
  companyName: z
    .string()
    .min(1, "Company name is required")
    .transform((v) => v.trim()),
  jobTitle: z
    .string()
    .min(1, "Job title is required")
    .transform((v) => v.trim()),
  employmentType: z.string().optional(),
  workType: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().nullable().optional(),
  isCurrent: z.boolean().optional().default(false),
  description: z.string().nullable().optional(),
  skills: z.array(z.string()).optional().default([]),
});

export const UpdateExperienceSchema = z.object({
  companyName: z.string().min(1).optional(),
  jobTitle: z.string().min(1).optional(),
  employmentType: z.string().optional(),
  workType: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().nullable().optional(),
  isCurrent: z.boolean().optional(),
  description: z.string().nullable().optional(),
  skills: z.array(z.string()).optional(),
});

// --- Conversations and Messages ---

export const CreateConversationSchema = z.object({
  recipientAccountId: z.string().min(1, "Recipient account ID is required"),
  initialMessage: z.string().optional(),
});

export const SendMessageSchema = z
  .object({
    content: z.string().optional(),
    attachmentUrls: z.array(z.string().url()).optional(),
  })
  .refine(
    (data) => (data.content?.trim()?.length ?? 0) > 0 || (data.attachmentUrls?.length ?? 0) > 0,
    { message: "Message content or attachments required" }
  );

// --- Sessions ---

export const UpdateSessionSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  status: z.string().optional(),
  coachNotes: z.string().optional(),
});

export const CancelSessionSchema = z.object({
  reason: z
    .string()
    .max(500, "Reason must be 500 characters or fewer")
    .optional()
    .default("No reason provided"),
});

export const RescheduleSessionSchema = z.object({
  newDate: z.string().min(1, "New date is required (ISO format)"),
});

// --- Action Items ---

export const CreateActionItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  dueDate: z.string().nullable().optional(),
});

export const UpdateActionItemSchema = z.object({
  description: z.string().optional(),
  status: z.string().optional(),
  dueDate: z.string().nullable().optional(),
});

// --- Mentor Assignments ---

export const CreateMentorAssignmentSchema = z.object({
  mentorProfileId: z.string().min(1, "Mentor profile ID is required"),
  notes: z.string().nullable().optional(),
});

export const UpdateMentorAssignmentSchema = z.object({
  assignmentId: z.string().min(1, "Assignment ID is required"),
  status: z.enum(["ACTIVE", "PAUSED", "COMPLETED"], {
    message: "Status must be ACTIVE, PAUSED, or COMPLETED",
  }),
  notes: z.string().nullable().optional(),
});

export const RateMentorSchema = z.object({
  rating: z
    .number()
    .int("Rating must be an integer")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  comment: z.string().nullable().optional(),
});

// --- Profile ---

export const UpdateProfileSchema = z.object({
  // Account fields
  name: z.string().max(100, "Name must be 100 characters or fewer").optional(),
  avatar: z.string().url("Avatar must be a valid URL").nullable().optional(),
  phone: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  timezone: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  pronouns: z.string().nullable().optional(),
  ethnicity: z.string().nullable().optional(),
  birthday: z.string().nullable().optional(),
  // Social URLs
  linkedinUrl: z.string().nullable().optional(),
  instagramUrl: z.string().nullable().optional(),
  threadsUrl: z.string().nullable().optional(),
  facebookUrl: z.string().nullable().optional(),
  blueskyUrl: z.string().nullable().optional(),
  xUrl: z.string().nullable().optional(),
  websiteUrl: z.string().nullable().optional(),
  // Seeker profile fields
  headline: z.string().nullable().optional(),
  skills: z.array(z.string()).optional(),
  greenSkills: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  yearsExperience: z.number().nullable().optional(),
  targetSectors: z.array(z.string()).optional(),
  resumeUrl: z.string().nullable().optional(),
  coverLetterUrl: z.string().nullable().optional(),
  portfolioUrl: z.string().nullable().optional(),
  summary: z.string().max(250, "Summary must be 250 characters or fewer").nullable().optional(),
  coverImage: z.string().nullable().optional(),
  badge: z.string().nullable().optional(),
  isMentor: z.boolean().optional(),
  mentorBio: z.string().nullable().optional(),
  mentorTopics: z.array(z.string()).optional(),
});

export const UpdateCoachProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  photoUrl: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  headline: z.string().nullable().optional(),
  expertise: z.array(z.string()).optional(),
  sectors: z.array(z.string()).optional(),
  sessionTypes: z.array(z.string()).optional(),
  yearsInClimate: z.number().nullable().optional(),
  sessionRate: z.number().nullable().optional(),
  sessionDuration: z.number().nullable().optional(),
  hourlyRate: z.number().nullable().optional(),
  monthlyRate: z.number().nullable().optional(),
  videoLink: z.string().nullable().optional(),
});

// --- Payments ---

export const CheckoutSchema = z.object({
  coachId: z.string().min(1, "Coach ID is required"),
  sessionDate: z.string().datetime({ message: "Session date must be a valid ISO datetime" }),
  sessionDuration: z
    .number()
    .int()
    .min(15, "Duration must be at least 15 minutes")
    .max(180, "Duration must be at most 180 minutes"),
  sessionType: z.string().optional(),
  notes: z.string().max(2000).optional(),
});

export const RefundSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  reason: z.string().optional(),
});

// --- Availability ---

export const UpdateAvailabilitySchema = z.object({
  availability: z.unknown().optional(),
  sessionDuration: z.number().optional(),
  bufferTime: z.number().optional(),
  maxSessionsPerWeek: z.number().optional(),
  videoLink: z.string().nullable().optional(),
});

// --- Coach Application ---

export const CoachApplySchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  linkedinUrl: z.string().min(1, "LinkedIn URL is required"),
  headline: z.string().min(1, "Headline is required"),
  bio: z.string().min(1, "Bio is required"),
  yearsInClimate: z.number().optional(),
  expertise: z.array(z.string()).min(1, "At least one area of expertise is required"),
  sectors: z.array(z.string()).min(1, "At least one sector is required"),
  sessionRate: z.number().optional(),
  availability: z.string().optional(),
  motivation: z.string().optional(),
});

// --- Saved Jobs ---

export const UpdateSavedJobNotesSchema = z.object({
  notes: z.string().max(10000, "Notes must be 10000 characters or fewer").optional(),
});

// --- Applications ---
// Schema moved to @/lib/validators/application.ts (includes file URL fields)
export { SubmitApplicationSchema } from "./application";

// --- Checklist ---

export const UpdateChecklistSchema = z.object({
  itemId: z.string().min(1, "Item ID is required"),
  completed: z.boolean().optional(),
});
