import { z } from "zod";

export const NotificationPreferencesSchema = z.object({
  inAppPrefs: z.record(z.string(), z.boolean()).optional(),
  emailPrefs: z.record(z.string(), z.boolean()).optional(),
  emailFrequency: z.enum(["immediate", "daily", "weekly", "never"]).optional(),
});

export type NotificationPreferencesInput = z.infer<typeof NotificationPreferencesSchema>;

// Notification categories for UI grouping
export const NOTIFICATION_CATEGORIES = [
  {
    label: "Sessions & Coaching",
    types: [
      { type: "SESSION_BOOKED", label: "Session booked" },
      { type: "SESSION_REMINDER", label: "Session reminders" },
      { type: "SESSION_CANCELLED", label: "Session cancellations" },
      { type: "SESSION_COMPLETED", label: "Session completed" },
      { type: "REVIEW_REQUEST", label: "Review requests" },
    ],
  },
  {
    label: "Messages",
    types: [{ type: "NEW_MESSAGE", label: "New messages" }],
  },
  {
    label: "Jobs & Applications",
    types: [
      { type: "NEW_APPLICATION", label: "New applications" },
      { type: "OFFER_RECEIVED", label: "Offer received" },
      { type: "OFFER_VIEWED", label: "Offer viewed" },
    ],
  },
  {
    label: "Goals",
    types: [
      { type: "GOAL_DUE_SOON", label: "Goal due soon" },
      { type: "GOAL_INACTIVE", label: "Goal inactivity reminders" },
    ],
  },
  {
    label: "Account",
    types: [
      { type: "COACH_APPROVED", label: "Coach application updates" },
      { type: "PAYMENT_RECEIVED", label: "Payment received" },
    ],
  },
] as const;
