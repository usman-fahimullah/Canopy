import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";

// =================================================================
// Stripe Customer Management
// =================================================================

/**
 * Find-or-create a Stripe Customer for a Canopy organization.
 * Upserts stripeCustomerId on Organization.
 */
export async function ensureStripeCustomer(
  organizationId: string,
  organizationName: string,
  email: string
): Promise<string> {
  // Check if org already has a Stripe customer
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { stripeCustomerId: true },
  });

  if (org?.stripeCustomerId) {
    return org.stripeCustomerId;
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    name: organizationName,
    email,
    metadata: {
      organizationId,
      product_type: "canopy",
    },
  });

  // Store customer ID on organization
  await prisma.organization.update({
    where: { id: organizationId },
    data: { stripeCustomerId: customer.id },
  });

  logger.info("Stripe customer created", {
    organizationId,
    stripeCustomerId: customer.id,
  });

  return customer.id;
}

// =================================================================
// Billing Event Idempotency
// =================================================================

/**
 * Log a billing event for idempotency. Returns false if already processed.
 * Call this at the top of every webhook handler to prevent duplicate processing.
 */
export async function logBillingEvent(
  stripeEventId: string,
  eventType: string,
  productType?: string,
  payload?: Record<string, unknown>
): Promise<boolean> {
  try {
    await prisma.billingEvent.create({
      data: {
        stripeEventId,
        eventType,
        productType,
        status: "PROCESSING",
        payload: payload ?? undefined,
      },
    });
    return true; // New event, proceed
  } catch (error) {
    // Unique constraint violation — already processed
    if (error instanceof Error && "code" in error && (error as { code: string }).code === "P2002") {
      logger.info("Duplicate billing event skipped", {
        stripeEventId,
        eventType,
      });
      return false;
    }
    throw error; // Unexpected error
  }
}

/**
 * Mark a billing event as completed or failed.
 */
export async function updateBillingEventStatus(
  stripeEventId: string,
  status: "COMPLETED" | "FAILED"
): Promise<void> {
  await prisma.billingEvent.update({
    where: { stripeEventId },
    data: { status },
  });
}

// =================================================================
// Product Type Resolution
// =================================================================

/**
 * Extract product_type from Stripe event metadata.
 * Returns null if no product_type is set (legacy events).
 */
export function resolveProductType(event: Stripe.Event): string | null {
  const obj = event.data.object as unknown as Record<string, unknown>;

  // Check metadata on the object itself
  if (obj.metadata && typeof obj.metadata === "object") {
    const metadata = obj.metadata as Record<string, string>;
    if (metadata.product_type) return metadata.product_type;
  }

  return null;
}
