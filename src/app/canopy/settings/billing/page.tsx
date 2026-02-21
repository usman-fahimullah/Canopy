"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Toast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { FormCard } from "@/components/ui/form-section";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/ui/empty-state";
import { SimplePagination } from "@/components/ui/pagination";
import {
  CreditCard,
  Coin,
  ArrowSquareOut,
  ShoppingCart,
  Lightning,
  Check,
  Crown,
  Package,
  ArrowRight,
  WarningCircle,
} from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";

// =================================================================
// Types (mirroring API response shapes)
// =================================================================

interface PlanFeatures {
  hasApplyForm: boolean;
  hasApplicantList: boolean;
  hasATS: boolean;
  maxTemplates: number;
  jobDuration: number | null;
  unlimitedJobs: boolean;
}

interface SubscriptionInfo {
  id: string;
  status: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  amount: number;
  interval: string;
}

interface SubscriptionData {
  planTier: string;
  features: PlanFeatures;
  subscription: SubscriptionInfo | null;
}

interface CreditBalances {
  regular: number;
  boosted: number;
}

interface PointsBalance {
  balance: number;
  totalEarned: number;
  totalRedeemed: number;
}

interface UsageData {
  planTier: string;
  features: PlanFeatures;
  credits: CreditBalances;
  points: PointsBalance;
  activeJobCount: number;
}

interface Purchase {
  id: string;
  purchaseType: string;
  amount: number;
  status: string;
  creditsGranted: number;
  createdAt: string;
}

// =================================================================
// Constants
// =================================================================

const PLAN_DISPLAY: Record<string, { name: string; badge: string; color: string }> = {
  PAY_AS_YOU_GO: { name: "Pay As You Go", badge: "Tier 1", color: "neutral" },
  LISTINGS: { name: "Listings Plan", badge: "Tier 2", color: "info" },
  ATS: { name: "Full ATS", badge: "Tier 3", color: "success" },
};

const PURCHASE_TYPE_LABELS: Record<string, string> = {
  REGULAR_LISTING: "Regular Listing",
  BOOSTED_LISTING: "Boosted Listing",
  REGULAR_PACK_3: "Regular 3-Pack",
  REGULAR_PACK_5: "Regular 5-Pack",
  REGULAR_PACK_10: "Regular 10-Pack",
  BOOSTED_PACK_3: "Boosted 3-Pack",
  BOOSTED_PACK_5: "Boosted 5-Pack",
  BOOSTED_PACK_10: "Boosted 10-Pack",
  REGULAR_EXTENSION: "Regular Extension (2 wk)",
  BOOSTED_EXTENSION: "Boosted Extension (2 wk)",
};

const PACK_OPTIONS = [
  { type: "REGULAR_LISTING", label: "1 Regular Listing", price: "$125", pricePerUnit: "$125/ea" },
  { type: "REGULAR_PACK_3", label: "3-Pack Regular", price: "$325", pricePerUnit: "~$108/ea" },
  { type: "REGULAR_PACK_5", label: "5-Pack Regular", price: "$500", pricePerUnit: "$100/ea" },
  { type: "REGULAR_PACK_10", label: "10-Pack Regular", price: "$900", pricePerUnit: "$90/ea" },
  { type: "BOOSTED_LISTING", label: "1 Boosted Listing", price: "$175", pricePerUnit: "$175/ea" },
  { type: "BOOSTED_PACK_3", label: "3-Pack Boosted", price: "$450", pricePerUnit: "~$150/ea" },
  { type: "BOOSTED_PACK_5", label: "5-Pack Boosted", price: "$700", pricePerUnit: "$140/ea" },
  { type: "BOOSTED_PACK_10", label: "10-Pack Boosted", price: "$1,250", pricePerUnit: "$125/ea" },
];

const PLAN_TIERS = [
  {
    tier: "LISTINGS",
    name: "Listings Plan",
    price: "$199",
    interval: "/mo",
    features: [
      "Unlimited job postings",
      "Built-in apply form",
      "View applicant list",
      "Unlimited email templates",
      "Jobs active while subscribed",
    ],
  },
  {
    tier: "ATS",
    name: "Full ATS",
    price: "$399",
    interval: "/mo",
    annualPrice: "$3,990/yr",
    features: [
      "Everything in Listings, plus:",
      "Pipeline / kanban management",
      "Candidate messaging",
      "Scoring & reviews",
      "Interview scheduling",
      "Team collaboration",
    ],
  },
];

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// =================================================================
// Loading Skeleton
// =================================================================

function BillingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      {/* Plan card */}
      <div className="space-y-4 rounded-2xl border border-[var(--border-default)] p-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-9 w-40 rounded-lg" />
      </div>
      {/* Credits */}
      <div className="space-y-4 rounded-2xl border border-[var(--border-default)] p-6">
        <Skeleton className="h-6 w-36" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      </div>
      {/* Purchase history */}
      <div className="space-y-4 rounded-2xl border border-[var(--border-default)] p-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

// =================================================================
// Main Billing Page
// =================================================================

export default function BillingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [purchaseTotal, setPurchaseTotal] = useState(0);
  const [purchasePage, setPurchasePage] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "critical";
  } | null>(null);

  const showToast = useCallback((message: string, variant: "success" | "critical" = "success") => {
    setToast({ message, variant });
  }, []);

  // Check for checkout return
  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");
    if (success === "true") {
      showToast("Payment successful! Your plan has been updated.");
    } else if (canceled === "true") {
      showToast("Checkout was canceled.", "critical");
    }
  }, [searchParams, showToast]);

  // Fetch billing data
  const fetchData = useCallback(async () => {
    try {
      const [subRes, usageRes, purchaseRes] = await Promise.all([
        fetch("/api/canopy/billing/subscription"),
        fetch("/api/canopy/billing/usage"),
        fetch(`/api/canopy/billing/purchases?skip=${purchasePage * 10}&take=10`),
      ]);

      if (!subRes.ok || !usageRes.ok || !purchaseRes.ok) {
        throw new Error("Failed to load billing data");
      }

      const [subData, usageData, purchaseData] = await Promise.all([
        subRes.json(),
        usageRes.json(),
        purchaseRes.json(),
      ]);

      setSubscription(subData);
      setUsage(usageData);
      setPurchases(purchaseData.data || []);
      setPurchaseTotal(purchaseData.meta?.total || 0);
      setError(null);
    } catch (err) {
      logger.error("Failed to load billing data", { error: formatError(err) });
      setError("Failed to load billing data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [purchasePage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Actions
  const handleManageSubscription = async () => {
    setActionLoading("portal");
    try {
      const res = await fetch("/api/canopy/billing/subscription/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          returnUrl: `${window.location.origin}/canopy/settings/billing`,
        }),
      });
      if (!res.ok) throw new Error("Failed to open billing portal");
      const data = await res.json();
      window.location.href = data.url;
    } catch (err) {
      logger.error("Portal error", { error: formatError(err) });
      showToast("Failed to open billing portal", "critical");
      setActionLoading(null);
    }
  };

  const handleUpgrade = async (planTier: string, interval: "month" | "year" = "month") => {
    setActionLoading(`upgrade-${planTier}`);
    try {
      const res = await fetch("/api/canopy/billing/subscription/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planTier,
          interval,
          returnUrl: `${window.location.origin}/canopy/settings/billing`,
        }),
      });
      if (!res.ok) throw new Error("Failed to create checkout");
      const data = await res.json();
      window.location.href = data.url;
    } catch (err) {
      logger.error("Checkout error", { error: formatError(err) });
      showToast("Failed to start checkout", "critical");
      setActionLoading(null);
    }
  };

  const handleBuyPack = async (purchaseType: string) => {
    setActionLoading(`buy-${purchaseType}`);
    try {
      const res = await fetch("/api/canopy/billing/purchases/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purchaseType,
          returnUrl: `${window.location.origin}/canopy/settings/billing`,
        }),
      });
      if (!res.ok) throw new Error("Failed to create checkout");
      const data = await res.json();
      window.location.href = data.url;
    } catch (err) {
      logger.error("Pack purchase error", { error: formatError(err) });
      showToast("Failed to start checkout", "critical");
      setActionLoading(null);
    }
  };

  // Loading
  if (loading) return <BillingSkeleton />;

  // Error
  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-heading-sm font-medium text-[var(--foreground-default)]">
          Plan & Billing
        </h2>
        <EmptyState
          icon={<WarningCircle size={48} />}
          title="Failed to load billing"
          description={error}
          action={{ label: "Try again", onClick: fetchData }}
        />
      </div>
    );
  }

  const planTier = subscription?.planTier || "PAY_AS_YOU_GO";
  const planDisplay = PLAN_DISPLAY[planTier] || PLAN_DISPLAY.PAY_AS_YOU_GO;
  const sub = subscription?.subscription;
  const credits = usage?.credits;
  const points = usage?.points;
  const hasCredits = (credits?.regular || 0) > 0 || (credits?.boosted || 0) > 0;
  const isPayAsYouGo = planTier === "PAY_AS_YOU_GO";
  const purchasePageCount = Math.ceil(purchaseTotal / 10);

  return (
    <>
      <div className="space-y-8">
        {/* Page Title */}
        <h2 className="text-heading-sm font-medium text-[var(--foreground-default)]">
          Plan & Billing
        </h2>

        {/* ============================================================
            Current Plan Card
            ============================================================ */}
        <FormCard>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CreditCard size={24} weight="fill" className="text-[var(--foreground-brand)]" />
              <h3 className="text-body-strong font-semibold text-[var(--foreground-default)]">
                Current Plan
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-heading-sm font-bold text-[var(--foreground-default)]">
                {planDisplay.name}
              </span>
              <Badge variant={planDisplay.color as "neutral" | "info" | "success"}>
                {planDisplay.badge}
              </Badge>
              {sub?.cancelAtPeriodEnd && <Badge variant="warning">Cancels at period end</Badge>}
            </div>

            {sub && (
              <div className="text-body-sm text-[var(--foreground-muted)]">
                {formatCurrency(sub.amount)}/{sub.interval}
                {sub.currentPeriodEnd && <> &middot; Renews {formatDate(sub.currentPeriodEnd)}</>}
              </div>
            )}

            {isPayAsYouGo && (
              <p className="text-body-sm text-[var(--foreground-muted)]">
                Purchase individual listings or credit packs. No monthly commitment.
              </p>
            )}

            {sub && (
              <Button
                variant="tertiary"
                size="sm"
                onClick={handleManageSubscription}
                disabled={actionLoading === "portal"}
              >
                {actionLoading === "portal" ? (
                  <Spinner size="xs" variant="current" />
                ) : (
                  <ArrowSquareOut size={16} weight="bold" />
                )}
                Manage Subscription
              </Button>
            )}
          </div>
        </FormCard>

        {/* ============================================================
            Credits Section (show for Tier 1 or anyone with credits)
            ============================================================ */}
        {(isPayAsYouGo || hasCredits) && (
          <FormCard>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Package size={24} weight="fill" className="text-[var(--foreground-brand)]" />
                <h3 className="text-body-strong font-semibold text-[var(--foreground-default)]">
                  Listing Credits
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-[var(--background-subtle)] p-4">
                  <p className="text-caption font-medium text-[var(--foreground-muted)]">
                    Regular Credits
                  </p>
                  <p className="mt-1 text-heading-sm font-bold text-[var(--foreground-default)]">
                    {credits?.regular ?? 0}
                  </p>
                </div>
                <div className="rounded-xl bg-[var(--background-subtle)] p-4">
                  <p className="text-caption font-medium text-[var(--foreground-muted)]">
                    Boosted Credits
                  </p>
                  <p className="mt-1 text-heading-sm font-bold text-[var(--foreground-default)]">
                    {credits?.boosted ?? 0}
                  </p>
                </div>
              </div>

              {isPayAsYouGo && (
                <>
                  <Separator spacing="sm" />

                  <div className="space-y-3">
                    <h4 className="text-caption-strong font-semibold text-[var(--foreground-default)]">
                      Buy Credits
                    </h4>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {PACK_OPTIONS.map((pack) => (
                        <button
                          key={pack.type}
                          onClick={() => handleBuyPack(pack.type)}
                          disabled={actionLoading?.startsWith("buy-")}
                          className="flex items-center justify-between rounded-xl border border-[var(--border-default)] px-4 py-3 text-left transition-colors hover:border-[var(--border-brand)] hover:bg-[var(--background-brand-subtle)] disabled:opacity-50"
                        >
                          <div className="min-w-0">
                            <p className="text-body-sm font-medium text-[var(--foreground-default)]">
                              {pack.label}
                            </p>
                            <p className="text-caption text-[var(--foreground-subtle)]">
                              {pack.pricePerUnit}
                            </p>
                          </div>
                          <span className="ml-3 flex-shrink-0 text-body-sm font-semibold text-[var(--foreground-brand)]">
                            {actionLoading === `buy-${pack.type}` ? (
                              <Spinner size="xs" variant="current" />
                            ) : (
                              pack.price
                            )}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </FormCard>
        )}

        {/* ============================================================
            Loyalty Points Section (Tier 1 only)
            ============================================================ */}
        {isPayAsYouGo && points && points.totalEarned > 0 && (
          <FormCard>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Coin size={24} weight="fill" className="text-[var(--primitive-yellow-500)]" />
                <h3 className="text-body-strong font-semibold text-[var(--foreground-default)]">
                  Loyalty Points
                </h3>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-heading-sm font-bold text-[var(--foreground-default)]">
                  {points.balance.toLocaleString()}
                </span>
                <span className="text-body-sm text-[var(--foreground-muted)]">
                  points available
                </span>
              </div>

              <p className="text-caption text-[var(--foreground-subtle)]">
                Earn 1 point per $1 spent. Points are worth $0.10 each and apply automatically to
                future Tier 1 purchases. Current value:{" "}
                <span className="font-medium text-[var(--foreground-default)]">
                  {formatCurrency(points.balance * 10)}
                </span>
              </p>

              <div className="flex gap-6 text-caption text-[var(--foreground-muted)]">
                <span>Earned: {points.totalEarned.toLocaleString()}</span>
                <span>Redeemed: {points.totalRedeemed.toLocaleString()}</span>
              </div>
            </div>
          </FormCard>
        )}

        {/* ============================================================
            Upgrade Section (if not on ATS)
            ============================================================ */}
        {planTier !== "ATS" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Crown size={24} weight="fill" className="text-[var(--primitive-yellow-500)]" />
              <h3 className="text-body-strong font-semibold text-[var(--foreground-default)]">
                {isPayAsYouGo ? "Upgrade Your Plan" : "Upgrade to ATS"}
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {PLAN_TIERS.filter((p) => {
                // Only show tiers higher than current
                if (planTier === "LISTINGS") return p.tier === "ATS";
                return true; // PAY_AS_YOU_GO sees both
              }).map((plan) => (
                <FormCard key={plan.tier}>
                  <div className="flex h-full flex-col space-y-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-body-strong font-semibold text-[var(--foreground-default)]">
                          {plan.name}
                        </h4>
                        {plan.tier === "ATS" && <Badge variant="success">Most Popular</Badge>}
                      </div>
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-heading-sm font-bold text-[var(--foreground-default)]">
                          {plan.price}
                        </span>
                        <span className="text-body-sm text-[var(--foreground-muted)]">
                          {plan.interval}
                        </span>
                      </div>
                      {plan.annualPrice && (
                        <p className="mt-0.5 text-caption text-[var(--foreground-subtle)]">
                          or {plan.annualPrice} (save ~17%)
                        </p>
                      )}
                    </div>

                    <ul className="flex-1 space-y-2">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-body-sm text-[var(--foreground-muted)]"
                        >
                          <Check
                            size={16}
                            weight="bold"
                            className="mt-0.5 flex-shrink-0 text-[var(--foreground-success)]"
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleUpgrade(plan.tier, "month")}
                        disabled={actionLoading?.startsWith("upgrade-")}
                      >
                        {actionLoading === `upgrade-${plan.tier}` ? (
                          <Spinner size="xs" variant="inverse" />
                        ) : (
                          <Lightning size={16} weight="fill" />
                        )}
                        Upgrade
                      </Button>
                      {plan.annualPrice && (
                        <Button
                          variant="tertiary"
                          size="sm"
                          onClick={() => handleUpgrade(plan.tier, "year")}
                          disabled={actionLoading?.startsWith("upgrade-")}
                        >
                          Annual
                        </Button>
                      )}
                    </div>
                  </div>
                </FormCard>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================
            Purchase History
            ============================================================ */}
        <FormCard>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <ShoppingCart size={24} weight="fill" className="text-[var(--foreground-brand)]" />
              <h3 className="text-body-strong font-semibold text-[var(--foreground-default)]">
                Purchase History
              </h3>
            </div>

            {purchases.length === 0 ? (
              <p className="py-6 text-center text-body-sm text-[var(--foreground-muted)]">
                No purchases yet.
              </p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-[var(--border-default)]">
                        <th className="pb-2 pr-4 text-caption font-medium text-[var(--foreground-muted)]">
                          Date
                        </th>
                        <th className="pb-2 pr-4 text-caption font-medium text-[var(--foreground-muted)]">
                          Type
                        </th>
                        <th className="pb-2 pr-4 text-caption font-medium text-[var(--foreground-muted)]">
                          Amount
                        </th>
                        <th className="pb-2 text-caption font-medium text-[var(--foreground-muted)]">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-muted)]">
                      {purchases.map((purchase) => (
                        <tr key={purchase.id}>
                          <td className="py-3 pr-4 text-body-sm text-[var(--foreground-default)]">
                            {formatDate(purchase.createdAt)}
                          </td>
                          <td className="py-3 pr-4 text-body-sm text-[var(--foreground-default)]">
                            {PURCHASE_TYPE_LABELS[purchase.purchaseType] || purchase.purchaseType}
                          </td>
                          <td className="py-3 pr-4 text-body-sm font-medium text-[var(--foreground-default)]">
                            {formatCurrency(purchase.amount)}
                          </td>
                          <td className="py-3">
                            <Badge
                              variant={
                                purchase.status === "COMPLETED"
                                  ? "success"
                                  : purchase.status === "REFUNDED"
                                    ? "warning"
                                    : purchase.status === "FAILED"
                                      ? "error"
                                      : "neutral"
                              }
                            >
                              {purchase.status.charAt(0) + purchase.status.slice(1).toLowerCase()}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {purchasePageCount > 1 && (
                  <div className="flex justify-end pt-2">
                    <SimplePagination
                      currentPage={purchasePage + 1}
                      totalPages={purchasePageCount}
                      onPageChange={(page) => setPurchasePage(page - 1)}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </FormCard>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[var(--z-toast)]">
          <Toast
            variant={toast.variant}
            dismissible
            autoDismiss={4000}
            onDismiss={() => setToast(null)}
          >
            {toast.message}
          </Toast>
        </div>
      )}
    </>
  );
}
