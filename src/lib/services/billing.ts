/**
 * Billing service — business logic for Canopy ATS billing operations.
 * Used by API route handlers. Does NOT contain auth checks (routes handle that).
 */
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { logger } from "@/lib/logger";
import { getCredits, type CreditBalances } from "@/lib/services/credits";
import { getPoints, type PointsBalance } from "@/lib/services/loyalty-points";
import { getPlanFeatures, type GateResult } from "@/lib/billing/feature-gates";
import {
  PLAN_FEATURES,
  getStripePriceId,
  LISTING_PRICES,
  type PlanFeatures,
} from "@/lib/stripe/constants";
import { ensureStripeCustomer } from "@/lib/stripe/handlers/shared";
import type { PlanTier, PurchaseType, Prisma } from "@prisma/client";

// =================================================================
// Subscription Status
// =================================================================

export interface SubscriptionStatus {
  planTier: PlanTier;
  features: PlanFeatures;
  subscription: {
    id: string;
    status: string;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
    amount: number;
    interval: string;
  } | null;
}

export async function getSubscriptionStatus(organizationId: string): Promise<SubscriptionStatus> {
  const org = await prisma.organization.findUniqueOrThrow({
    where: { id: organizationId },
    select: { planTier: true },
  });

  const subscription = await prisma.subscription.findFirst({
    where: {
      organizationId,
      status: { in: ["ACTIVE", "PAST_DUE", "TRIALING"] },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      currentPeriodEnd: true,
      cancelAtPeriodEnd: true,
      amount: true,
      interval: true,
    },
  });

  return {
    planTier: org.planTier,
    features: getPlanFeatures(org.planTier),
    subscription: subscription
      ? {
          id: subscription.id,
          status: subscription.status,
          currentPeriodEnd: subscription.currentPeriodEnd,
          cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
          amount: subscription.amount,
          interval: subscription.interval,
        }
      : null,
  };
}

// =================================================================
// Usage Data
// =================================================================

export interface UsageData {
  planTier: PlanTier;
  features: PlanFeatures;
  credits: CreditBalances;
  points: PointsBalance;
  activeJobCount: number;
}

export async function getUsageData(organizationId: string): Promise<UsageData> {
  const [org, credits, points, activeJobCount] = await Promise.all([
    prisma.organization.findUniqueOrThrow({
      where: { id: organizationId },
      select: { planTier: true },
    }),
    getCredits(organizationId),
    getPoints(organizationId),
    prisma.job.count({
      where: { organizationId, status: "PUBLISHED" },
    }),
  ]);

  return {
    planTier: org.planTier,
    features: getPlanFeatures(org.planTier),
    credits,
    points,
    activeJobCount,
  };
}

// =================================================================
// Purchase History
// =================================================================

export async function getPurchaseHistory(organizationId: string, skip: number, take: number) {
  const [purchases, total] = await Promise.all([
    prisma.purchase.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      skip,
      take,
      select: {
        id: true,
        purchaseType: true,
        amount: true,
        status: true,
        creditsGranted: true,
        createdAt: true,
      },
    }),
    prisma.purchase.count({ where: { organizationId } }),
  ]);

  return { purchases, total };
}

// =================================================================
// Checkout Session Creators
// =================================================================

export async function createSubscriptionCheckout(
  organizationId: string,
  organizationName: string,
  email: string,
  planTier: "LISTINGS" | "ATS",
  interval: "month" | "year",
  returnUrl: string
): Promise<string> {
  const customerId = await ensureStripeCustomer(organizationId, organizationName, email);

  const priceId = getStripePriceId(planTier, interval);
  if (!priceId) {
    throw new Error(`No Stripe price configured for ${planTier} / ${interval}`);
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${returnUrl}?success=true&plan=${planTier}`,
    cancel_url: `${returnUrl}?canceled=true`,
    metadata: {
      product_type: "canopy_subscription",
      organizationId,
      planTier,
    },
    subscription_data: {
      metadata: {
        product_type: "canopy_subscription",
        organizationId,
        planTier,
      },
    },
  });

  logger.info("Subscription checkout created", {
    organizationId,
    planTier,
    interval,
    checkoutSessionId: session.id,
  });

  return session.url!;
}

export async function createListingPurchaseCheckout(
  organizationId: string,
  organizationName: string,
  email: string,
  purchaseType: PurchaseType,
  returnUrl: string
): Promise<string> {
  const customerId = await ensureStripeCustomer(organizationId, organizationName, email);

  const priceId = LISTING_PRICES[purchaseType];
  if (!priceId) {
    throw new Error(`No Stripe price configured for ${purchaseType}`);
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${returnUrl}?success=true&type=${purchaseType}`,
    cancel_url: `${returnUrl}?canceled=true`,
    metadata: {
      product_type: "listing_purchase",
      organizationId,
      purchaseType,
    },
  });

  logger.info("Listing purchase checkout created", {
    organizationId,
    purchaseType,
    checkoutSessionId: session.id,
  });

  return session.url!;
}

export async function createExtensionCheckout(
  organizationId: string,
  organizationName: string,
  email: string,
  jobId: string,
  purchaseType: "REGULAR_EXTENSION" | "BOOSTED_EXTENSION",
  returnUrl: string
): Promise<string> {
  const customerId = await ensureStripeCustomer(organizationId, organizationName, email);

  const priceId = LISTING_PRICES[purchaseType];
  if (!priceId) {
    throw new Error(`No Stripe price configured for ${purchaseType}`);
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${returnUrl}?success=true&type=${purchaseType}`,
    cancel_url: `${returnUrl}?canceled=true`,
    metadata: {
      product_type: "listing_purchase",
      organizationId,
      purchaseType,
      jobId,
    },
  });

  logger.info("Extension checkout created", {
    organizationId,
    purchaseType,
    jobId,
    checkoutSessionId: session.id,
  });

  return session.url!;
}

// =================================================================
// Stripe Customer Portal
// =================================================================

export async function createPortalSession(
  organizationId: string,
  returnUrl: string
): Promise<string> {
  const org = await prisma.organization.findUniqueOrThrow({
    where: { id: organizationId },
    select: { stripeCustomerId: true },
  });

  if (!org.stripeCustomerId) {
    throw new Error("No Stripe customer found for this organization");
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: org.stripeCustomerId,
    return_url: returnUrl,
  });

  return portalSession.url;
}
