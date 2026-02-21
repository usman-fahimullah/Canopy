/**
 * POST /api/canopy/billing/purchases/extend
 * Creates a Stripe Checkout session to extend a job listing.
 * Requires ADMIN or RECRUITER role. Job must belong to the org.
 */
import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, canManageBilling } from "@/lib/access-control";
import { paymentLimiter } from "@/lib/rate-limit";
import { logger, formatError } from "@/lib/logger";
import { prisma } from "@/lib/db";
import { ExtensionPurchaseSchema } from "@/lib/validators/billing";
import { createExtensionCheckout } from "@/lib/services/billing";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = await paymentLimiter.check(5, `extension-checkout:${ip}`);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429 }
      );
    }

    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canManageBilling(ctx)) {
      return NextResponse.json(
        { error: "Only admins and recruiters can extend listings" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const result = ExtensionPurchaseSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }

    const { jobId, purchaseType } = result.data;

    // Verify job belongs to the org
    const job = await prisma.job.findFirst({
      where: { id: jobId, organizationId: ctx.organizationId },
      select: { id: true },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const [org, account] = await Promise.all([
      prisma.organization.findUniqueOrThrow({
        where: { id: ctx.organizationId },
        select: { name: true },
      }),
      prisma.account.findUniqueOrThrow({
        where: { id: ctx.accountId },
        select: { email: true },
      }),
    ]);

    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/canopy/settings/billing`;

    const checkoutUrl = await createExtensionCheckout(
      ctx.organizationId,
      org.name,
      account.email,
      jobId,
      purchaseType,
      returnUrl
    );

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    logger.error("Error creating extension checkout", {
      error: formatError(error),
      endpoint: "/api/canopy/billing/purchases/extend",
    });
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
