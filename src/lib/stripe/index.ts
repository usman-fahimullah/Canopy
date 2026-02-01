import Stripe from "stripe";

// Server-side Stripe client (lazy-initialized to avoid build-time errors
// when STRIPE_SECRET_KEY is not set in the environment)
let _stripe: Stripe | null = null;

export function getStripeServer(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set. Add it to your environment variables.");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    });
  }
  return _stripe;
}

/**
 * @deprecated Use getStripeServer() for lazy initialization.
 * This getter is kept for backward compatibility with existing `stripe.xxx` calls.
 */
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop, receiver) {
    return Reflect.get(getStripeServer(), prop, receiver);
  },
});

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
