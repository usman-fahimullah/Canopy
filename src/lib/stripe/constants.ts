import type { PlanTier, PurchaseType, CreditType } from "@prisma/client";

// =================================================================
// Plan Feature Configuration
// =================================================================

export interface PlanFeatures {
  hasApplyForm: boolean;
  hasApplicantList: boolean; // view-only for LISTINGS, full for ATS
  hasATS: boolean;
  maxTemplates: number;
  jobDuration: number | null; // days, null = active while subscribed
  unlimitedJobs: boolean;
}

export const PLAN_FEATURES: Record<PlanTier, PlanFeatures> = {
  PAY_AS_YOU_GO: {
    hasApplyForm: false,
    hasApplicantList: false,
    hasATS: false,
    maxTemplates: 3,
    jobDuration: 30,
    unlimitedJobs: false,
  },
  LISTINGS: {
    hasApplyForm: true,
    hasApplicantList: true,
    hasATS: false,
    maxTemplates: Infinity,
    jobDuration: null,
    unlimitedJobs: true,
  },
  ATS: {
    hasApplyForm: true,
    hasApplicantList: true,
    hasATS: true,
    maxTemplates: Infinity,
    jobDuration: null,
    unlimitedJobs: true,
  },
};

// =================================================================
// Stripe Price ID Mappings (from env vars)
// =================================================================

/** Subscription prices (recurring) */
export const CANOPY_PRICES = {
  LISTINGS_MONTHLY: process.env.STRIPE_PRICE_LISTINGS_MONTHLY ?? "",
  ATS_MONTHLY: process.env.STRIPE_PRICE_ATS_MONTHLY ?? "",
  ATS_ANNUAL: process.env.STRIPE_PRICE_ATS_ANNUAL ?? "",
} as const;

/** One-time listing purchase prices */
export const LISTING_PRICES = {
  REGULAR_LISTING: process.env.STRIPE_PRICE_REGULAR_LISTING ?? "",
  BOOSTED_LISTING: process.env.STRIPE_PRICE_BOOSTED_LISTING ?? "",
  REGULAR_PACK_3: process.env.STRIPE_PRICE_REGULAR_PACK_3 ?? "",
  REGULAR_PACK_5: process.env.STRIPE_PRICE_REGULAR_PACK_5 ?? "",
  REGULAR_PACK_10: process.env.STRIPE_PRICE_REGULAR_PACK_10 ?? "",
  BOOSTED_PACK_3: process.env.STRIPE_PRICE_BOOSTED_PACK_3 ?? "",
  BOOSTED_PACK_5: process.env.STRIPE_PRICE_BOOSTED_PACK_5 ?? "",
  BOOSTED_PACK_10: process.env.STRIPE_PRICE_BOOSTED_PACK_10 ?? "",
  REGULAR_EXTENSION: process.env.STRIPE_PRICE_REGULAR_EXTENSION ?? "",
  BOOSTED_EXTENSION: process.env.STRIPE_PRICE_BOOSTED_EXTENSION ?? "",
} as const;

// =================================================================
// Credits granted per purchase type
// =================================================================

export const CREDITS_PER_PURCHASE: Record<
  Exclude<PurchaseType, "REGULAR_EXTENSION" | "BOOSTED_EXTENSION">,
  { type: CreditType; count: number }
> = {
  REGULAR_LISTING: { type: "REGULAR", count: 1 },
  BOOSTED_LISTING: { type: "BOOSTED", count: 1 },
  REGULAR_PACK_3: { type: "REGULAR", count: 3 },
  REGULAR_PACK_5: { type: "REGULAR", count: 5 },
  REGULAR_PACK_10: { type: "REGULAR", count: 10 },
  BOOSTED_PACK_3: { type: "BOOSTED", count: 3 },
  BOOSTED_PACK_5: { type: "BOOSTED", count: 5 },
  BOOSTED_PACK_10: { type: "BOOSTED", count: 10 },
};

// =================================================================
// Pricing in cents (for display and validation — actual prices in Stripe)
// =================================================================

export const PLAN_PRICING = {
  LISTINGS: { monthly: 19900 }, // $199/mo
  ATS: { monthly: 39900, annual: 399000 }, // $399/mo or $3,990/yr
} as const;

export const LISTING_PRICING: Record<PurchaseType, number> = {
  REGULAR_LISTING: 12500,
  BOOSTED_LISTING: 17500,
  REGULAR_PACK_3: 32500,
  REGULAR_PACK_5: 50000,
  REGULAR_PACK_10: 90000,
  BOOSTED_PACK_3: 45000,
  BOOSTED_PACK_5: 70000,
  BOOSTED_PACK_10: 125000,
  REGULAR_EXTENSION: 5000,
  BOOSTED_EXTENSION: 7500,
};

// =================================================================
// Loyalty Points
// =================================================================

/** 1 point per $1 spent */
export const LOYALTY_POINTS_PER_DOLLAR = 1;

/** 1 point = $0.10 = 10 cents */
export const LOYALTY_POINT_VALUE_CENTS = 10;

// =================================================================
// Job Duration
// =================================================================

/** Tier 1 job listings last 30 days */
export const TIER_1_JOB_DURATION_DAYS = 30;

/** Extensions add 14 days */
export const EXTENSION_DURATION_DAYS = 14;

/** Email warning X days before expiry */
export const EXPIRY_WARNING_DAYS = 5;

// =================================================================
// Stripe Price → PlanTier mapping
// =================================================================

export function getPlanTierFromPriceId(priceId: string): PlanTier | null {
  if (priceId === CANOPY_PRICES.LISTINGS_MONTHLY) return "LISTINGS";
  if (priceId === CANOPY_PRICES.ATS_MONTHLY) return "ATS";
  if (priceId === CANOPY_PRICES.ATS_ANNUAL) return "ATS";
  return null;
}

/** Get the Stripe price ID for a given plan tier and interval */
export function getStripePriceId(planTier: "LISTINGS" | "ATS", interval: "month" | "year"): string {
  if (planTier === "LISTINGS") return CANOPY_PRICES.LISTINGS_MONTHLY;
  if (interval === "year") return CANOPY_PRICES.ATS_ANNUAL;
  return CANOPY_PRICES.ATS_MONTHLY;
}

/** Check if a purchase type is an extension */
export function isExtensionPurchase(type: PurchaseType): boolean {
  return type === "REGULAR_EXTENSION" || type === "BOOSTED_EXTENSION";
}

/** Check if a purchase type grants credits */
export function grantsCreditsPurchase(
  type: PurchaseType
): type is Exclude<PurchaseType, "REGULAR_EXTENSION" | "BOOSTED_EXTENSION"> {
  return !isExtensionPurchase(type);
}
