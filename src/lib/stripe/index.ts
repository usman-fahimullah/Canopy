import Stripe from "stripe";

// Server-side Stripe client (lazy init to avoid build-time errors when env var is missing)
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    });
  }
  return _stripe;
}

// Platform fee percentage (18%)
export const PLATFORM_FEE_PERCENT = 18;

// Calculate platform fee and coach payout
export function calculateFees(sessionRateInCents: number) {
  const platformFee = Math.round(sessionRateInCents * (PLATFORM_FEE_PERCENT / 100));
  const coachPayout = sessionRateInCents - platformFee;

  return {
    total: sessionRateInCents,
    platformFee,
    coachPayout,
  };
}

// Format cents to dollars for display
export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}
