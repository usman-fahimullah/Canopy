/**
 * Canopy ATS subscription Stripe webhook handlers.
 * Handles subscription lifecycle: checkout, changes, invoice events.
 */
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { createAuditLog } from "@/lib/audit";
import { getPlanTierFromPriceId } from "@/lib/stripe/constants";
import type Stripe from "stripe";

// =================================================================
// Checkout Completed — Canopy subscription
// =================================================================

/**
 * Called when a subscription checkout completes.
 * Creates the Subscription record and updates org planTier + stripeCustomerId.
 */
export async function handleSubscriptionCheckout(session: Stripe.Checkout.Session) {
  const metadata = session.metadata;
  const organizationId = metadata?.organizationId;

  if (!organizationId) {
    logger.error("Missing organizationId in subscription checkout metadata", {
      checkoutSessionId: session.id,
    });
    return;
  }

  const subscriptionId = session.subscription as string;
  if (!subscriptionId) {
    logger.error("No subscription ID in checkout session", {
      checkoutSessionId: session.id,
    });
    return;
  }

  // Fetch the full subscription from Stripe for details
  const { stripe } = await import("@/lib/stripe");
  const sub = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = sub.items.data[0]?.price.id;
  const planTier = getPlanTierFromPriceId(priceId ?? "");

  if (!planTier) {
    logger.error("Unknown price ID in subscription", {
      priceId,
      subscriptionId,
    });
    return;
  }

  await prisma.$transaction(async (tx) => {
    // Create Subscription record
    await tx.subscription.create({
      data: {
        organizationId,
        stripeSubscriptionId: sub.id,
        stripePriceId: priceId ?? "",
        planTier,
        status: "ACTIVE",
        currentPeriodStart: new Date(sub.current_period_start * 1000),
        currentPeriodEnd: new Date(sub.current_period_end * 1000),
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        amount: sub.items.data[0]?.price.unit_amount ?? 0,
        interval: sub.items.data[0]?.price.recurring?.interval ?? "month",
      },
    });

    // Update org planTier + stripeCustomerId
    await tx.organization.update({
      where: { id: organizationId },
      data: {
        planTier,
        stripeCustomerId: session.customer as string,
        planPeriodEnd: new Date(sub.current_period_end * 1000),
      },
    });
  });

  await createAuditLog({
    action: "CREATE",
    entityType: "Subscription",
    entityId: sub.id,
    changes: { planTier: { from: null, to: planTier } },
    metadata: {
      stripeSubscriptionId: sub.id,
      organizationId,
      webhookEvent: "checkout.session.completed",
    },
  });

  logger.info("Subscription created via checkout", {
    organizationId,
    planTier,
    stripeSubscriptionId: sub.id,
  });
}

// =================================================================
// Subscription Updated/Created
// =================================================================

/**
 * Called on customer.subscription.created/updated.
 * Upserts the Subscription record and syncs org planTier.
 */
export async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const organizationId = subscription.metadata?.organizationId;

  if (!organizationId) {
    // Try to find org by Stripe customer ID
    const org = await prisma.organization.findFirst({
      where: { stripeCustomerId: subscription.customer as string },
      select: { id: true },
    });

    if (!org) {
      logger.warn("Cannot resolve organization for subscription event", {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer,
      });
      return;
    }
    // Continue with resolved org
    return processSubscriptionChange(subscription, org.id);
  }

  return processSubscriptionChange(subscription, organizationId);
}

async function processSubscriptionChange(sub: Stripe.Subscription, organizationId: string) {
  const priceId = sub.items.data[0]?.price.id;
  const planTier = getPlanTierFromPriceId(priceId ?? "");
  const status = mapStripeStatus(sub.status);

  if (!planTier) {
    logger.error("Unknown price ID in subscription change", {
      priceId,
      stripeSubscriptionId: sub.id,
    });
    return;
  }

  await prisma.$transaction(async (tx) => {
    // Upsert Subscription record
    await tx.subscription.upsert({
      where: { stripeSubscriptionId: sub.id },
      create: {
        organizationId,
        stripeSubscriptionId: sub.id,
        stripePriceId: priceId ?? "",
        planTier,
        status,
        currentPeriodStart: new Date(sub.current_period_start * 1000),
        currentPeriodEnd: new Date(sub.current_period_end * 1000),
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        amount: sub.items.data[0]?.price.unit_amount ?? 0,
        interval: sub.items.data[0]?.price.recurring?.interval ?? "month",
      },
      update: {
        stripePriceId: priceId ?? "",
        planTier,
        status,
        currentPeriodStart: new Date(sub.current_period_start * 1000),
        currentPeriodEnd: new Date(sub.current_period_end * 1000),
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        amount: sub.items.data[0]?.price.unit_amount ?? 0,
        interval: sub.items.data[0]?.price.recurring?.interval ?? "month",
      },
    });

    // Sync org planTier
    await tx.organization.update({
      where: { id: organizationId },
      data: {
        planTier,
        planPeriodEnd: new Date(sub.current_period_end * 1000),
      },
    });
  });

  logger.info("Subscription updated", {
    organizationId,
    planTier,
    status,
    stripeSubscriptionId: sub.id,
  });
}

// =================================================================
// Subscription Deleted (canceled)
// =================================================================

/**
 * Called on customer.subscription.deleted.
 * Reverts org to PAY_AS_YOU_GO and pauses all active jobs.
 */
export async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // Find the org via existing Subscription record
  const existingSub = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
    select: { organizationId: true, planTier: true },
  });

  if (!existingSub) {
    logger.warn("Subscription deleted but no record found", {
      stripeSubscriptionId: subscription.id,
    });
    return;
  }

  const { organizationId } = existingSub;

  await prisma.$transaction(async (tx) => {
    // Mark subscription as canceled
    await tx.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: { status: "CANCELED" },
    });

    // Revert org to PAY_AS_YOU_GO
    await tx.organization.update({
      where: { id: organizationId },
      data: {
        planTier: "PAY_AS_YOU_GO",
        planPeriodEnd: null,
      },
    });

    // Pause all published jobs for this org
    await tx.job.updateMany({
      where: {
        organizationId,
        status: "PUBLISHED",
      },
      data: { status: "PAUSED" },
    });
  });

  await createAuditLog({
    action: "UPDATE",
    entityType: "Subscription",
    entityId: subscription.id,
    changes: {
      planTier: { from: existingSub.planTier, to: "PAY_AS_YOU_GO" },
      status: { from: "ACTIVE", to: "CANCELED" },
    },
    metadata: {
      stripeSubscriptionId: subscription.id,
      organizationId,
      webhookEvent: "customer.subscription.deleted",
      jobsPaused: true,
    },
  });

  logger.info("Subscription canceled — org reverted to PAY_AS_YOU_GO, jobs paused", {
    organizationId,
    stripeSubscriptionId: subscription.id,
  });
}

// =================================================================
// Invoice Events
// =================================================================

/**
 * Called on invoice.paid for subscription invoices.
 * Updates period end dates.
 */
export async function handleSubscriptionInvoicePaid(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string | null;
  if (!subscriptionId) return;

  const sub = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
    select: { id: true, organizationId: true },
  });

  if (!sub) return;

  // Fetch updated subscription from Stripe
  const { stripe } = await import("@/lib/stripe");
  const stripeSub = await stripe.subscriptions.retrieve(subscriptionId);

  await prisma.$transaction(async (tx) => {
    await tx.subscription.update({
      where: { stripeSubscriptionId: subscriptionId },
      data: {
        status: "ACTIVE",
        currentPeriodStart: new Date(stripeSub.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
      },
    });

    await tx.organization.update({
      where: { id: sub.organizationId },
      data: {
        planPeriodEnd: new Date(stripeSub.current_period_end * 1000),
      },
    });
  });

  logger.info("Subscription invoice paid — period updated", {
    organizationId: sub.organizationId,
    stripeSubscriptionId: subscriptionId,
  });
}

/**
 * Called on invoice.payment_failed for subscription invoices.
 * Sets subscription status to PAST_DUE.
 */
export async function handleSubscriptionInvoiceFailed(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string | null;
  if (!subscriptionId) return;

  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscriptionId },
    data: { status: "PAST_DUE" },
  });

  logger.warn("Subscription invoice payment failed", {
    stripeSubscriptionId: subscriptionId,
    invoiceId: invoice.id,
  });
}

// =================================================================
// Helpers
// =================================================================

type SubscriptionStatus =
  | "ACTIVE"
  | "PAST_DUE"
  | "CANCELED"
  | "INCOMPLETE"
  | "TRIALING"
  | "UNPAID"
  | "PAUSED";

function mapStripeStatus(stripeStatus: Stripe.Subscription.Status): SubscriptionStatus {
  const map: Record<string, SubscriptionStatus> = {
    active: "ACTIVE",
    past_due: "PAST_DUE",
    canceled: "CANCELED",
    incomplete: "INCOMPLETE",
    trialing: "TRIALING",
    unpaid: "UNPAID",
    paused: "PAUSED",
    incomplete_expired: "CANCELED",
  };
  return map[stripeStatus] ?? "ACTIVE";
}
