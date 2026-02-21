/**
 * Stripe webhook endpoint — unified dispatcher.
 *
 * Routes events by type + `metadata.product_type` to the appropriate handler:
 *   - "candid"             → Candid coaching handlers
 *   - "canopy_subscription" → Canopy ATS subscription lifecycle
 *   - "listing_purchase"   → Canopy listing / pack / extension purchases
 *
 * Idempotency is handled per-event via BillingEvent table.
 */
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";
import { logger, formatError } from "@/lib/logger";
import {
  logBillingEvent,
  updateBillingEventStatus,
  resolveProductType,
} from "@/lib/stripe/handlers/shared";
import {
  handleCandidCheckout,
  handlePaymentSucceeded,
  handlePaymentFailed,
  handleCandidRefund,
  handleAccountUpdated,
} from "@/lib/stripe/handlers/candid";
import {
  handleSubscriptionCheckout,
  handleSubscriptionChange,
  handleSubscriptionDeleted,
  handleSubscriptionInvoicePaid,
  handleSubscriptionInvoiceFailed,
} from "@/lib/stripe/handlers/canopy-subscription";
import {
  handleListingPurchaseCheckout,
  handleListingRefund,
} from "@/lib/stripe/handlers/listing-purchase";

// =================================================================
// Webhook Handler
// =================================================================

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    logger.error("Webhook signature verification failed", {
      error: formatError(err),
      endpoint: "/api/stripe/webhook",
    });
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Idempotency: skip if already processed
  const productType = resolveProductType(event) ?? undefined;
  const isNew = await logBillingEvent(event.id, event.type, productType, {
    objectId: (event.data.object as { id?: string }).id,
  });
  if (!isNew) {
    return NextResponse.json({ received: true, deduplicated: true });
  }

  try {
    await dispatchEvent(event, productType);

    await updateBillingEventStatus(event.id, "COMPLETED");
    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error("Webhook handler error", {
      error: formatError(error),
      endpoint: "/api/stripe/webhook",
      eventType: event.type,
      productType,
    });
    await updateBillingEventStatus(event.id, "FAILED").catch(() => {});
    // Return 200 to prevent Stripe retries for handler errors
    // (signature was valid, we just failed internally)
    return NextResponse.json({ received: true, error: "Handler failed" });
  }
}

// =================================================================
// Event Dispatcher
// =================================================================

async function dispatchEvent(event: Stripe.Event, productType?: string): Promise<void> {
  switch (event.type) {
    // ----- Checkout completed -----
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const pt = productType ?? session.metadata?.product_type;

      if (pt === "canopy_subscription") {
        await handleSubscriptionCheckout(session);
      } else if (pt === "listing_purchase") {
        await handleListingPurchaseCheckout(session);
      } else {
        // Default: Candid coaching checkout (legacy events may lack product_type)
        await handleCandidCheckout(session);
      }
      break;
    }

    // ----- Subscription lifecycle -----
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionChange(subscription);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionDeleted(subscription);
      break;
    }

    // ----- Invoice events -----
    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const pt = productType ?? (invoice.metadata as Record<string, string>)?.product_type;

      if (pt === "canopy_subscription" || invoice.subscription) {
        await handleSubscriptionInvoicePaid(invoice);
      }
      // Candid doesn't use invoices — no else needed
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const pt = productType ?? (invoice.metadata as Record<string, string>)?.product_type;

      if (pt === "canopy_subscription" || invoice.subscription) {
        await handleSubscriptionInvoiceFailed(invoice);
      }
      break;
    }

    // ----- Payment intent events (Candid) -----
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentSucceeded(paymentIntent);
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentFailed(paymentIntent);
      break;
    }

    // ----- Refunds -----
    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      const pt = productType ?? (charge.metadata as Record<string, string>)?.product_type;

      if (pt === "listing_purchase") {
        await handleListingRefund(charge);
      } else {
        // Default: Candid refund
        await handleCandidRefund(charge);
      }
      break;
    }

    // ----- Connect account updates -----
    case "account.updated": {
      const account = event.data.object as Stripe.Account;
      await handleAccountUpdated(account);
      break;
    }

    default:
      logger.info("Unhandled Stripe event type", {
        endpoint: "/api/stripe/webhook",
        eventType: event.type,
        productType,
      });
  }
}
