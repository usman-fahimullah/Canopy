import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  getAuthenticatedAccount,
  isAdminAccount,
  unauthorizedResponse,
  forbiddenResponse,
} from "@/lib/auth-helpers";
import { logger, formatError } from "@/lib/logger";

/**
 * GET /api/admin/canopy/organizations
 *
 * List all organizations with plan tier, credits, active job count, and team size.
 * Supports pagination, search, and plan-tier filtering.
 */
export async function GET(request: NextRequest) {
  try {
    const account = await getAuthenticatedAccount();
    if (!account) return unauthorizedResponse();
    if (!isAdminAccount(account)) return forbiddenResponse();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const planTier = searchParams.get("planTier") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100);
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }
    if (planTier && ["PAY_AS_YOU_GO", "LISTINGS", "ATS"].includes(planTier)) {
      where.planTier = planTier;
    }

    const [organizations, total] = await Promise.all([
      prisma.organization.findMany({
        where,
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
          planTier: true,
          stripeCustomerId: true,
          createdAt: true,
          _count: {
            select: {
              members: true,
              jobs: { where: { status: "PUBLISHED" } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.organization.count({ where }),
    ]);

    // Batch-fetch credit balances for all orgs on this page
    const orgIds = organizations.map((o) => o.id);
    const credits = await prisma.listingCredit.findMany({
      where: { organizationId: { in: orgIds } },
      select: { organizationId: true, creditType: true, balance: true },
    });

    const creditsByOrg = new Map<string, { regular: number; boosted: number }>();
    for (const c of credits) {
      const existing = creditsByOrg.get(c.organizationId) || { regular: 0, boosted: 0 };
      if (c.creditType === "REGULAR") existing.regular = c.balance;
      if (c.creditType === "BOOSTED") existing.boosted = c.balance;
      creditsByOrg.set(c.organizationId, existing);
    }

    const data = organizations.map((org) => ({
      id: org.id,
      name: org.name,
      slug: org.slug,
      logo: org.logo,
      planTier: org.planTier,
      hasStripeCustomer: !!org.stripeCustomerId,
      teamSize: org._count.members,
      activeJobs: org._count.jobs,
      credits: creditsByOrg.get(org.id) || { regular: 0, boosted: 0 },
      createdAt: org.createdAt.toISOString(),
    }));

    return NextResponse.json({
      data,
      meta: { total, page, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    logger.error("Admin org list error", {
      error: formatError(error),
      endpoint: "/api/admin/canopy/organizations",
    });
    return NextResponse.json({ error: "Failed to fetch organizations" }, { status: 500 });
  }
}
