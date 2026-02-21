import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { LOYALTY_POINTS_PER_DOLLAR, LOYALTY_POINT_VALUE_CENTS } from "@/lib/stripe/constants";

// =================================================================
// Points Balance Query
// =================================================================

export interface PointsBalance {
  balance: number;
  totalEarned: number;
  totalRedeemed: number;
}

/** Get loyalty points balance for an organization. */
export async function getPoints(organizationId: string): Promise<PointsBalance> {
  const points = await prisma.loyaltyPoints.findUnique({
    where: { organizationId },
    select: { balance: true, totalEarned: true, totalRedeemed: true },
  });

  return {
    balance: points?.balance ?? 0,
    totalEarned: points?.totalEarned ?? 0,
    totalRedeemed: points?.totalRedeemed ?? 0,
  };
}

// =================================================================
// Points Mutations
// =================================================================

/**
 * Earn loyalty points from a purchase.
 * Awards 1 point per $1 spent (amountInCents / 100, floored).
 */
export async function earnPoints(organizationId: string, amountInCents: number): Promise<number> {
  const pointsToAward = Math.floor((amountInCents / 100) * LOYALTY_POINTS_PER_DOLLAR);

  if (pointsToAward <= 0) return 0;

  await prisma.loyaltyPoints.upsert({
    where: { organizationId },
    create: {
      organizationId,
      balance: pointsToAward,
      totalEarned: pointsToAward,
      totalRedeemed: 0,
    },
    update: {
      balance: { increment: pointsToAward },
      totalEarned: { increment: pointsToAward },
    },
  });

  logger.info("Loyalty points earned", {
    organizationId,
    pointsAwarded: pointsToAward,
    purchaseAmountCents: amountInCents,
  });

  return pointsToAward;
}

/**
 * Redeem loyalty points for a discount.
 * Throws if insufficient balance.
 */
export async function redeemPoints(organizationId: string, points: number): Promise<void> {
  if (points <= 0) {
    throw new Error("Points to redeem must be positive");
  }

  const current = await prisma.loyaltyPoints.findUnique({
    where: { organizationId },
    select: { balance: true },
  });

  if (!current || current.balance < points) {
    throw new Error(
      `Insufficient loyalty points. You have ${current?.balance ?? 0} points but tried to redeem ${points}.`
    );
  }

  await prisma.loyaltyPoints.update({
    where: { organizationId },
    data: {
      balance: { decrement: points },
      totalRedeemed: { increment: points },
    },
  });

  logger.info("Loyalty points redeemed", { organizationId, points });
}

/**
 * Convert points to their discount value in cents.
 * 1 point = $0.10 = 10 cents.
 */
export function getPointsValueCents(points: number): number {
  return points * LOYALTY_POINT_VALUE_CENTS;
}

/**
 * Grant points directly (admin action).
 * Positive amount adds, negative amount removes (clamped to 0).
 */
export async function adjustPoints(organizationId: string, amount: number): Promise<void> {
  if (amount === 0) return;

  if (amount > 0) {
    await prisma.loyaltyPoints.upsert({
      where: { organizationId },
      create: {
        organizationId,
        balance: amount,
        totalEarned: amount,
        totalRedeemed: 0,
      },
      update: {
        balance: { increment: amount },
        totalEarned: { increment: amount },
      },
    });
  } else {
    // Negative adjustment: clamp to available balance
    const current = await prisma.loyaltyPoints.findUnique({
      where: { organizationId },
      select: { balance: true },
    });

    const currentBalance = current?.balance ?? 0;
    const actualDeduct = Math.min(Math.abs(amount), currentBalance);

    if (actualDeduct > 0) {
      await prisma.loyaltyPoints.update({
        where: { organizationId },
        data: { balance: { decrement: actualDeduct } },
      });
    }
  }

  logger.info("Loyalty points adjusted (admin)", { organizationId, amount });
}
