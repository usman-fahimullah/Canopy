import { z } from "zod";

// =================================================================
// Subscription Checkout
// =================================================================

export const SubscriptionCheckoutSchema = z.object({
  planTier: z.enum(["LISTINGS", "ATS"]),
  interval: z.enum(["month", "year"]).optional().default("month"),
});

export type SubscriptionCheckoutInput = z.infer<typeof SubscriptionCheckoutSchema>;

// =================================================================
// Listing Purchase
// =================================================================

export const ListingPurchaseSchema = z.object({
  purchaseType: z.enum([
    "REGULAR_LISTING",
    "BOOSTED_LISTING",
    "REGULAR_PACK_3",
    "REGULAR_PACK_5",
    "REGULAR_PACK_10",
    "BOOSTED_PACK_3",
    "BOOSTED_PACK_5",
    "BOOSTED_PACK_10",
  ]),
});

export type ListingPurchaseInput = z.infer<typeof ListingPurchaseSchema>;

// =================================================================
// Extension Purchase
// =================================================================

export const ExtensionPurchaseSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  purchaseType: z.enum(["REGULAR_EXTENSION", "BOOSTED_EXTENSION"]),
});

export type ExtensionPurchaseInput = z.infer<typeof ExtensionPurchaseSchema>;

// =================================================================
// Redeem Loyalty Points
// =================================================================

export const RedeemPointsSchema = z.object({
  points: z.number().int().positive("Points must be a positive integer"),
  purchaseType: z.enum([
    "REGULAR_LISTING",
    "BOOSTED_LISTING",
    "REGULAR_PACK_3",
    "REGULAR_PACK_5",
    "REGULAR_PACK_10",
    "BOOSTED_PACK_3",
    "BOOSTED_PACK_5",
    "BOOSTED_PACK_10",
  ]),
});

export type RedeemPointsInput = z.infer<typeof RedeemPointsSchema>;

// =================================================================
// Admin — Plan Change
// =================================================================

export const AdminPlanChangeSchema = z.object({
  planTier: z.enum(["PAY_AS_YOU_GO", "LISTINGS", "ATS"]),
  reason: z.string().min(1, "Reason is required").max(500),
});

export type AdminPlanChangeInput = z.infer<typeof AdminPlanChangeSchema>;

// =================================================================
// Admin — Credit Grant/Revoke
// =================================================================

export const AdminCreditChangeSchema = z.object({
  creditType: z.enum(["REGULAR", "BOOSTED"]),
  amount: z.number().int().min(-1000).max(1000),
  reason: z.string().min(1, "Reason is required").max(500),
});

export type AdminCreditChangeInput = z.infer<typeof AdminCreditChangeSchema>;

// =================================================================
// Admin — Points Grant/Revoke
// =================================================================

export const AdminPointsChangeSchema = z.object({
  amount: z.number().int().min(-100000).max(100000),
  reason: z.string().min(1, "Reason is required").max(500),
});

export type AdminPointsChangeInput = z.infer<typeof AdminPointsChangeSchema>;
