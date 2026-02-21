"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CurrencyDollar,
  ChartLineUp,
  UsersThree,
  Receipt,
  Buildings,
  Briefcase,
  Kanban,
  WarningCircle,
} from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";

// =================================================================
// Types
// =================================================================

interface TierCounts {
  PAY_AS_YOU_GO: number;
  LISTINGS: number;
  ATS: number;
}

interface PurchaseStats {
  totalRevenue: number;
  totalPurchases: number;
}

interface RecentPurchase {
  id: string;
  purchaseType: string;
  amount: number;
  status: string;
  createdAt: string;
  organizationId: string;
  organizationName: string;
}

interface RecentSubscriptionChange {
  id: string;
  planTier: string;
  status: string;
  amount: number;
  interval: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
  organizationId: string;
  organizationName: string;
}

interface BillingOverview {
  mrr: number;
  arr: number;
  totalOrgs: number;
  tierCounts: TierCounts;
  activeSubscribers: number;
  subscribersByTier: Record<string, number>;
  purchaseStats: PurchaseStats;
  recentPurchases: RecentPurchase[];
  recentSubscriptionChanges: RecentSubscriptionChange[];
}

// =================================================================
// Helpers
// =================================================================

function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function formatPurchaseType(type: string): string {
  const MAP: Record<string, string> = {
    REGULAR_LISTING: "Regular Listing",
    BOOSTED_LISTING: "Boosted Listing",
    REGULAR_PACK_3: "Regular 3-Pack",
    REGULAR_PACK_5: "Regular 5-Pack",
    REGULAR_PACK_10: "Regular 10-Pack",
    BOOSTED_PACK_3: "Boosted 3-Pack",
    BOOSTED_PACK_5: "Boosted 5-Pack",
    BOOSTED_PACK_10: "Boosted 10-Pack",
    REGULAR_EXTENSION: "Regular Extension",
    BOOSTED_EXTENSION: "Boosted Extension",
  };
  return MAP[type] || type;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const STATUS_VARIANT: Record<string, "success" | "warning" | "error" | "default" | "info"> = {
  ACTIVE: "success",
  COMPLETED: "success",
  PAST_DUE: "warning",
  CANCELED: "error",
  INCOMPLETE: "warning",
  TRIALING: "info",
  UNPAID: "error",
  PAUSED: "default",
  PENDING: "warning",
  FAILED: "error",
  REFUNDED: "default",
};

const PLAN_TIER_CONFIG: Record<
  string,
  {
    label: string;
    variant: "default" | "info" | "success";
    icon: typeof CurrencyDollar;
    color: string;
  }
> = {
  PAY_AS_YOU_GO: {
    label: "Pay As You Go",
    variant: "default",
    icon: CurrencyDollar,
    color: "var(--primitive-neutral-600)",
  },
  LISTINGS: {
    label: "Listings",
    variant: "info",
    icon: Briefcase,
    color: "var(--primitive-blue-600)",
  },
  ATS: {
    label: "ATS",
    variant: "success",
    icon: Kanban,
    color: "var(--primitive-green-600)",
  },
};

// =================================================================
// Page Component
// =================================================================

export default function AdminBillingPage() {
  const [data, setData] = useState<BillingOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/canopy/billing/overview");
      if (!response.ok) {
        throw new Error(`Failed to fetch billing overview (${response.status})`);
      }
      const json = await response.json();
      setData(json.data);
    } catch (err) {
      const message = formatError(err);
      logger.error("Failed to fetch billing overview", { error: message });
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  // -----------------------------------------------------------------
  // Loading state
  // -----------------------------------------------------------------
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div>
          <div className="h-7 w-48 animate-pulse rounded-lg bg-[var(--background-muted)]" />
          <div className="mt-2 h-5 w-72 animate-pulse rounded-lg bg-[var(--background-muted)]" />
        </div>

        {/* Stat cards skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-[var(--background-muted)]" />
          ))}
        </div>

        {/* Distribution skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-[var(--background-muted)]" />
          ))}
        </div>

        {/* Table skeletons */}
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-[var(--background-muted)]" />
          ))}
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------
  // Error state
  // -----------------------------------------------------------------
  if (error || !data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-heading-sm font-bold text-[var(--foreground-default)]">
            Billing Overview
          </h1>
        </div>
        <div className="rounded-xl bg-[var(--card-background)] px-6 py-16 text-center shadow-[var(--shadow-card)]">
          <WarningCircle size={48} className="mx-auto mb-4 text-[var(--foreground-subtle)]" />
          <p className="text-body font-medium text-[var(--foreground-default)]">
            Failed to load billing data
          </p>
          <p className="mt-1 text-body-sm text-[var(--foreground-muted)]">
            {error || "An unexpected error occurred"}
          </p>
          <Button variant="secondary" size="sm" className="mt-4" onClick={fetchOverview}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------
  // Populated state
  // -----------------------------------------------------------------
  const revenueStats = [
    {
      label: "MRR",
      value: formatCents(data.mrr),
      icon: CurrencyDollar,
      color: "var(--primitive-green-600)",
    },
    {
      label: "ARR",
      value: formatCents(data.arr),
      icon: ChartLineUp,
      color: "var(--primitive-blue-600)",
    },
    {
      label: "Active Subscribers",
      value: String(data.activeSubscribers),
      icon: UsersThree,
      color: "var(--primitive-neutral-600)",
    },
    {
      label: "Purchase Revenue",
      value: formatCents(data.purchaseStats.totalRevenue),
      subLabel: `${data.purchaseStats.totalPurchases} purchases`,
      icon: Receipt,
      color: "var(--primitive-green-600)",
    },
  ];

  const tiers = ["PAY_AS_YOU_GO", "LISTINGS", "ATS"] as const;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-heading-sm font-bold text-[var(--foreground-default)]">
          Billing Overview
        </h1>
        <p className="mt-1 text-body-sm text-[var(--foreground-muted)]">
          Platform revenue, subscriptions, and purchase activity
        </p>
      </div>

      {/* Revenue Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {revenueStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-[var(--card-background)] p-5 shadow-[var(--shadow-card)]"
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{
                  backgroundColor: `color-mix(in srgb, ${stat.color} 15%, transparent)`,
                }}
              >
                <stat.icon size={20} style={{ color: stat.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-caption text-[var(--foreground-muted)]">{stat.label}</p>
                <p className="text-heading-sm font-bold text-[var(--foreground-default)]">
                  {stat.value}
                </p>
                {"subLabel" in stat && stat.subLabel && (
                  <p className="text-caption-sm text-[var(--foreground-subtle)]">{stat.subLabel}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Organization Distribution */}
      <div>
        <h2 className="mb-4 text-body-strong font-semibold text-[var(--foreground-default)]">
          Organization Distribution
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {tiers.map((tier) => {
            const config = PLAN_TIER_CONFIG[tier];
            const count = data.tierCounts[tier] || 0;
            const subscribers = data.subscribersByTier[tier] || 0;
            const percentage = data.totalOrgs > 0 ? Math.round((count / data.totalOrgs) * 100) : 0;

            return (
              <div
                key={tier}
                className="rounded-xl bg-[var(--card-background)] p-5 shadow-[var(--shadow-card)]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${config.color} 15%, transparent)`,
                    }}
                  >
                    <config.icon size={20} style={{ color: config.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-caption text-[var(--foreground-muted)]">{config.label}</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-heading-sm font-bold text-[var(--foreground-default)]">
                        {count}
                      </p>
                      <p className="text-caption-sm text-[var(--foreground-subtle)]">
                        ({percentage}%)
                      </p>
                    </div>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--background-muted)]">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: config.color,
                    }}
                  />
                </div>
                {subscribers > 0 && (
                  <p className="mt-2 text-caption-sm text-[var(--foreground-subtle)]">
                    {subscribers} active subscriber{subscribers !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Subscriptions */}
      <div>
        <h2 className="mb-4 text-body-strong font-semibold text-[var(--foreground-default)]">
          Recent Subscriptions
        </h2>
        {data.recentSubscriptionChanges.length === 0 ? (
          <div className="rounded-xl bg-[var(--card-background)] px-6 py-12 text-center shadow-[var(--shadow-card)]">
            <UsersThree size={40} className="mx-auto mb-3 text-[var(--foreground-subtle)]" />
            <p className="text-body-sm text-[var(--foreground-muted)]">
              No subscription activity yet
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl bg-[var(--card-background)] shadow-[var(--shadow-card)]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border-default)]">
                    <th className="px-4 py-3 text-left text-caption font-medium text-[var(--foreground-muted)]">
                      Organization
                    </th>
                    <th className="px-4 py-3 text-left text-caption font-medium text-[var(--foreground-muted)]">
                      Plan
                    </th>
                    <th className="px-4 py-3 text-left text-caption font-medium text-[var(--foreground-muted)]">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-caption font-medium text-[var(--foreground-muted)]">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-caption font-medium text-[var(--foreground-muted)]">
                      Interval
                    </th>
                    <th className="px-4 py-3 text-left text-caption font-medium text-[var(--foreground-muted)]">
                      Updated
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentSubscriptionChanges.map((sub) => {
                    const tierConfig =
                      PLAN_TIER_CONFIG[sub.planTier] || PLAN_TIER_CONFIG.PAY_AS_YOU_GO;
                    const statusVariant = STATUS_VARIANT[sub.status] || "default";

                    return (
                      <tr
                        key={sub.id}
                        className="border-b border-[var(--border-muted)] transition-colors hover:bg-[var(--background-interactive-hover)]"
                      >
                        <td className="px-4 py-3">
                          <Link
                            href={`/admin/organizations/${sub.organizationId}`}
                            className="flex items-center gap-2 text-body-sm font-medium text-[var(--foreground-default)] hover:text-[var(--foreground-brand)]"
                          >
                            <Buildings size={16} className="text-[var(--foreground-subtle)]" />
                            <span className="truncate">{sub.organizationName}</span>
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={tierConfig.variant}>{tierConfig.label}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Badge variant={statusVariant}>{sub.status}</Badge>
                            {sub.cancelAtPeriodEnd && (
                              <span className="text-caption-sm text-[var(--foreground-warning)]">
                                Canceling
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-caption text-[var(--foreground-default)]">
                            {formatCents(sub.amount)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-caption text-[var(--foreground-muted)]">
                            /{sub.interval}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-caption text-[var(--foreground-subtle)]">
                            {formatDate(sub.updatedAt)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Recent Purchases */}
      <div>
        <h2 className="mb-4 text-body-strong font-semibold text-[var(--foreground-default)]">
          Recent Purchases
        </h2>
        {data.recentPurchases.length === 0 ? (
          <div className="rounded-xl bg-[var(--card-background)] px-6 py-12 text-center shadow-[var(--shadow-card)]">
            <Receipt size={40} className="mx-auto mb-3 text-[var(--foreground-subtle)]" />
            <p className="text-body-sm text-[var(--foreground-muted)]">No purchase activity yet</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl bg-[var(--card-background)] shadow-[var(--shadow-card)]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border-default)]">
                    <th className="px-4 py-3 text-left text-caption font-medium text-[var(--foreground-muted)]">
                      Organization
                    </th>
                    <th className="px-4 py-3 text-left text-caption font-medium text-[var(--foreground-muted)]">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-caption font-medium text-[var(--foreground-muted)]">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-caption font-medium text-[var(--foreground-muted)]">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-caption font-medium text-[var(--foreground-muted)]">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentPurchases.map((purchase) => {
                    const statusVariant = STATUS_VARIANT[purchase.status] || "default";

                    return (
                      <tr
                        key={purchase.id}
                        className="border-b border-[var(--border-muted)] transition-colors hover:bg-[var(--background-interactive-hover)]"
                      >
                        <td className="px-4 py-3">
                          <Link
                            href={`/admin/organizations/${purchase.organizationId}`}
                            className="flex items-center gap-2 text-body-sm font-medium text-[var(--foreground-default)] hover:text-[var(--foreground-brand)]"
                          >
                            <Buildings size={16} className="text-[var(--foreground-subtle)]" />
                            <span className="truncate">{purchase.organizationName}</span>
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-caption text-[var(--foreground-default)]">
                            {formatPurchaseType(purchase.purchaseType)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-caption font-medium text-[var(--foreground-default)]">
                            {formatCents(purchase.amount)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={statusVariant}>{purchase.status}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-caption text-[var(--foreground-subtle)]">
                            {formatDate(purchase.createdAt)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
