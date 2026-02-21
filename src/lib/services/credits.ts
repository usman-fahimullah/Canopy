import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import type { CreditType } from "@prisma/client";

// =================================================================
// Credit Balance Queries
// =================================================================

export interface CreditBalances {
  regular: number;
  boosted: number;
}

/** Get credit balances for an organization. */
export async function getCredits(organizationId: string): Promise<CreditBalances> {
  const credits = await prisma.listingCredit.findMany({
    where: { organizationId },
    select: { creditType: true, balance: true },
  });

  const result: CreditBalances = { regular: 0, boosted: 0 };
  for (const c of credits) {
    if (c.creditType === "REGULAR") result.regular = c.balance;
    if (c.creditType === "BOOSTED") result.boosted = c.balance;
  }
  return result;
}

/** Check if org has at least one credit of a given type. */
export async function hasCredits(organizationId: string, creditType: CreditType): Promise<boolean> {
  const credit = await prisma.listingCredit.findUnique({
    where: { organizationId_creditType: { organizationId, creditType } },
    select: { balance: true },
  });
  return (credit?.balance ?? 0) > 0;
}

// =================================================================
// Credit Mutations
// =================================================================

/**
 * Grant credits to an organization (e.g., after a pack purchase).
 * Upserts the ListingCredit record — creates if first time.
 */
export async function grantCredits(
  organizationId: string,
  creditType: CreditType,
  count: number
): Promise<void> {
  if (count <= 0) {
    throw new Error("Credit grant count must be positive");
  }

  await prisma.listingCredit.upsert({
    where: { organizationId_creditType: { organizationId, creditType } },
    create: {
      organizationId,
      creditType,
      balance: count,
      totalEarned: count,
      totalSpent: 0,
    },
    update: {
      balance: { increment: count },
      totalEarned: { increment: count },
    },
  });

  logger.info("Credits granted", { organizationId, creditType, count });
}

/**
 * Consume one credit from the org's balance.
 * Throws if insufficient balance.
 */
export async function consumeCredit(organizationId: string, creditType: CreditType): Promise<void> {
  const credit = await prisma.listingCredit.findUnique({
    where: { organizationId_creditType: { organizationId, creditType } },
    select: { balance: true },
  });

  if (!credit || credit.balance <= 0) {
    throw new Error(
      `Insufficient ${creditType.toLowerCase()} credits. Purchase a listing or credit pack to continue.`
    );
  }

  await prisma.listingCredit.update({
    where: { organizationId_creditType: { organizationId, creditType } },
    data: {
      balance: { decrement: 1 },
      totalSpent: { increment: 1 },
    },
  });

  logger.info("Credit consumed", { organizationId, creditType });
}

/**
 * Revoke credits from an org (admin action or refund).
 * Will not go below 0; clamps to available balance.
 */
export async function revokeCredits(
  organizationId: string,
  creditType: CreditType,
  count: number
): Promise<number> {
  if (count <= 0) {
    throw new Error("Credit revoke count must be positive");
  }

  const credit = await prisma.listingCredit.findUnique({
    where: { organizationId_creditType: { organizationId, creditType } },
    select: { balance: true },
  });

  const currentBalance = credit?.balance ?? 0;
  const actualRevoke = Math.min(count, currentBalance);

  if (actualRevoke > 0) {
    await prisma.listingCredit.update({
      where: { organizationId_creditType: { organizationId, creditType } },
      data: {
        balance: { decrement: actualRevoke },
      },
    });
  }

  logger.info("Credits revoked", {
    organizationId,
    creditType,
    requested: count,
    actual: actualRevoke,
  });

  return actualRevoke;
}
