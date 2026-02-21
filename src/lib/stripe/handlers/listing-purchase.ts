/**
 * Canopy ATS listing purchase Stripe webhook handlers.
 * Handles one-time purchases: singles, packs, extensions.
 */
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { createAuditLog } from "@/lib/audit";
import {
  CREDITS_PER_PURCHASE,
  EXTENSION_DURATION_DAYS,
  isExtensionPurchase,
  grantsCreditsPurchase,
} from "@/lib/stripe/constants";
import { grantCredits } from "@/lib/services/credits";
import { earnPoints } from "@/lib/services/loyalty-points";
import type { PurchaseType } from "@prisma/client";
import type Stripe from "stripe";

// =================================================================
// Checkout Completed — Listing / Pack / Extension Purchase
// =================================================================

/**
 * Called when a one-time listing purchase checkout completes.
 * Creates Purchase record, grants credits, awards loyalty points.
 */
export async function handleListingPurchaseCheckout(session: Stripe.Checkout.Session) {
  const metadata = session.metadata;
  const organizationId = metadata?.organizationId;
  const purchaseType = metadata?.purchaseType as PurchaseType | undefined;

  if (!organizationId || !purchaseType) {
    logger.error("Missing metadata in listing purchase checkout", {
      checkoutSessionId: session.id,
      organizationId,
      purchaseType,
    });
    return;
  }

  const amount = session.amount_total ?? 0;
  const jobId = metadata?.jobId || null; // For extension purchases

  // Determine credits to grant
  let creditsGranted = 0;
  if (grantsCreditsPurchase(purchaseType)) {
    const creditConfig = CREDITS_PER_PURCHASE[purchaseType];
    creditsGranted = creditConfig.count;
  }

  await prisma.$transaction(async (tx) => {
    // Create Purchase record
    await tx.purchase.create({
      data: {
        organizationId,
        purchaseType,
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId: session.payment_intent as string | null,
        amount,
        status: "COMPLETED",
        creditsGranted,
        jobId,
      },
    });

    // Update org's stripeCustomerId if not set
    if (session.customer) {
      await tx.organization.updateMany({
        where: {
          id: organizationId,
          stripeCustomerId: null,
        },
        data: { stripeCustomerId: session.customer as string },
      });
    }
  });

  // Grant credits (outside transaction — uses its own upsert)
  if (grantsCreditsPurchase(purchaseType)) {
    const creditConfig = CREDITS_PER_PURCHASE[purchaseType];
    await grantCredits(organizationId, creditConfig.type, creditConfig.count);
  }

  // Handle extension: extend job's expiresAt
  if (isExtensionPurchase(purchaseType) && jobId) {
    await extendJobListing(jobId, organizationId);
  }

  // Award loyalty points (1 point per $1 spent)
  if (amount > 0) {
    await earnPoints(organizationId, amount);
  }

  await createAuditLog({
    action: "CREATE",
    entityType: "Purchase",
    entityId: session.id,
    changes: {
      purchaseType: { from: null, to: purchaseType },
      creditsGranted: { from: 0, to: creditsGranted },
    },
    metadata: {
      stripeCheckoutSessionId: session.id,
      organizationId,
      amount,
      webhookEvent: "checkout.session.completed",
    },
  });

  logger.info("Listing purchase completed", {
    organizationId,
    purchaseType,
    amount,
    creditsGranted,
    jobId,
  });
}

// =================================================================
// Refund — Listing purchase
// =================================================================

/**
 * Handle refund for a listing purchase.
 * Updates Purchase to REFUNDED and revokes credits if unused.
 */
export async function handleListingRefund(charge: Stripe.Charge) {
  if (!charge.payment_intent) return;

  const purchase = await prisma.purchase.findFirst({
    where: { stripePaymentIntentId: charge.payment_intent as string },
    select: {
      id: true,
      organizationId: true,
      purchaseType: true,
      creditsGranted: true,
      status: true,
    },
  });

  if (!purchase) return;

  // Mark as refunded
  await prisma.purchase.update({
    where: { id: purchase.id },
    data: { status: "REFUNDED" },
  });

  // Attempt to revoke credits (best-effort — may have been spent)
  if (purchase.creditsGranted > 0 && grantsCreditsPurchase(purchase.purchaseType)) {
    const { revokeCredits } = await import("@/lib/services/credits");
    const creditConfig = CREDITS_PER_PURCHASE[purchase.purchaseType];
    await revokeCredits(purchase.organizationId, creditConfig.type, purchase.creditsGranted);
  }

  await createAuditLog({
    action: "REFUND",
    entityType: "Purchase",
    entityId: purchase.id,
    changes: { status: { from: purchase.status, to: "REFUNDED" } },
    metadata: {
      stripeChargeId: charge.id,
      organizationId: purchase.organizationId,
      webhookEvent: "charge.refunded",
    },
  });

  logger.info("Listing purchase refunded", {
    purchaseId: purchase.id,
    organizationId: purchase.organizationId,
    purchaseType: purchase.purchaseType,
  });
}

// =================================================================
// Helpers
// =================================================================

/**
 * Extend a job listing's expiresAt by EXTENSION_DURATION_DAYS.
 */
async function extendJobListing(jobId: string, organizationId: string): Promise<void> {
  const job = await prisma.job.findFirst({
    where: { id: jobId, organizationId },
    select: { id: true, expiresAt: true },
  });

  if (!job) {
    logger.error("Job not found for extension", { jobId, organizationId });
    return;
  }

  // Extend from current expiresAt (or now if null/past)
  const baseDate = job.expiresAt && job.expiresAt > new Date() ? job.expiresAt : new Date();
  const newExpiresAt = new Date(baseDate);
  newExpiresAt.setDate(newExpiresAt.getDate() + EXTENSION_DURATION_DAYS);

  await prisma.job.update({
    where: { id: jobId },
    data: { expiresAt: newExpiresAt },
  });

  logger.info("Job listing extended", {
    jobId,
    organizationId,
    previousExpiresAt: job.expiresAt,
    newExpiresAt,
    extensionDays: EXTENSION_DURATION_DAYS,
  });
}
