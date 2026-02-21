"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Toast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  CreditCard,
  Coin,
  ArrowSquareOut,
  ShoppingCart,
  Lightning,
  Check,
  Crown,
  Package,
  WarningCircle,
  CheckCircle,
  Infinity as InfinityIcon,
} from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";

// =================================================================
// Types
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

// =================================================================
// Constants
// =================================================================

const PLAN_DISPLAY: Record<
  string,
  { name: string; badge: string; color: string; tagline: string }
> = {
  PAY_AS_YOU_GO: {
    name: "Pay As You Go",
    badge: "Tier 1",
    color: "neutral",
    tagline: "Purchase listings individually",
  },
  LISTINGS: {
    name: "Listings Plan",
    badge: "Tier 2",
    color: "info",
    tagline: "For teams posting multiple jobs",
  },
  ATS: {
    name: "Full ATS",
    badge: "Tier 3",
    color: "success",
    tagline: "For teams hiring at scale",
  },
};

const REGULAR_PACKS = [
  {
    type: "REGULAR_LISTING",
    label: "1 Credit",
    price: "$125",
    pricePerUnit: "$125/ea",
    credits: 1,
  },
  { type: "REGULAR_PACK_3", label: "3-Pack", price: "$325", pricePerUnit: "~$108/ea", credits: 3 },
  { type: "REGULAR_PACK_5", label: "5-Pack", price: "$500", pricePerUnit: "$100/ea", credits: 5 },
  { type: "REGULAR_PACK_10", label: "10-Pack", price: "$900", pricePerUnit: "$90/ea", credits: 10 },
];

const BOOSTED_PACKS = [
  {
    type: "BOOSTED_LISTING",
    label: "1 Credit",
    price: "$175",
    pricePerUnit: "$175/ea",
    credits: 1,
  },
  { type: "BOOSTED_PACK_3", label: "3-Pack", price: "$450", pricePerUnit: "~$150/ea", credits: 3 },
  { type: "BOOSTED_PACK_5", label: "5-Pack", price: "$700", pricePerUnit: "$140/ea", credits: 5 },
  {
    type: "BOOSTED_PACK_10",
    label: "10-Pack",
    price: "$1,250",
    pricePerUnit: "$125/ea",
    credits: 10,
  },
];

const PLAN_TIERS = [
  {
    tier: "LISTINGS",
    name: "Listings Plan",
    tagline: "For teams posting multiple jobs",
    price: "$199",
    interval: "/mo",
    features: [
      "Unlimited job postings",
      "Built-in apply form",
      "View applicant list",
      "Unlimited email templates",
      "Jobs active while subscribed",
      "Basic analytics dashboard",
    ],
  },
  {
    tier: "ATS",
    name: "Full ATS",
    tagline: "For teams hiring at scale",
    price: "$399",
    interval: "/mo",
    annualPrice: "$3,990/yr",
    popular: true,
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
    <div className="space-y-8">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card variant="outlined">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-9 w-32 rounded-lg" />
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-4 w-36" />
            </div>
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-9 w-28 rounded-lg" />
          </CardContent>
        </Card>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card variant="outlined">
            <CardContent className="space-y-4 p-6">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-8 w-24" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="h-9 w-full rounded-lg" />
            </CardContent>
          </Card>
          <Card variant="outlined">
            <CardContent className="space-y-4 p-6">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-8 w-24" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="h-9 w-full rounded-lg" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// =================================================================
// BuyCreditsSheet
// =================================================================

function BuyCreditsSheet({
  open,
  onOpenChange,
  onBuyPack,
  actionLoading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBuyPack: (type: string) => void;
  actionLoading: string | null;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" size="lg" className="flex flex-col overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Buy Credits</SheetTitle>
          <SheetDescription>
            Purchase listing credits. You earn 1 loyalty point per $1 spent.
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="regular" className="flex-1">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="regular" className="flex-1">
              Regular
            </TabsTrigger>
            <TabsTrigger value="boosted" className="flex-1">
              Boosted
            </TabsTrigger>
          </TabsList>

          <TabsContent value="regular" className="space-y-3">
            <p className="text-caption text-[var(--foreground-muted)]">
              Standard listing visibility for 30 days.
            </p>
            {REGULAR_PACKS.map((pack) => (
              <CreditPackCard
                key={pack.type}
                pack={pack}
                onBuy={() => onBuyPack(pack.type)}
                loading={actionLoading === `buy-${pack.type}`}
                disabled={actionLoading?.startsWith("buy-") ?? false}
              />
            ))}
          </TabsContent>

          <TabsContent value="boosted" className="space-y-3">
            <p className="text-caption text-[var(--foreground-muted)]">
              Premium placement with highlighted listing for 30 days.
            </p>
            {BOOSTED_PACKS.map((pack) => (
              <CreditPackCard
                key={pack.type}
                pack={pack}
                onBuy={() => onBuyPack(pack.type)}
                loading={actionLoading === `buy-${pack.type}`}
                disabled={actionLoading?.startsWith("buy-") ?? false}
              />
            ))}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

function CreditPackCard({
  pack,
  onBuy,
  loading,
  disabled,
}: {
  pack: { type: string; label: string; price: string; pricePerUnit: string; credits: number };
  onBuy: () => void;
  loading: boolean;
  disabled: boolean;
}) {
  return (
    <Button
      variant="outline"
      onClick={onBuy}
      disabled={disabled}
      className="flex h-auto w-full items-center justify-between px-5 py-4 text-left transition-colors hover:border-[var(--border-brand)] hover:bg-[var(--background-brand-subtle)]"
    >
      <div className="min-w-0">
        <p className="text-body-sm font-medium text-[var(--foreground-default)]">{pack.label}</p>
        <p className="text-caption font-normal text-[var(--foreground-subtle)]">
          {pack.pricePerUnit}
        </p>
      </div>
      <span className="ml-3 flex-shrink-0 text-body-sm font-semibold text-[var(--foreground-brand)]">
        {loading ? <Spinner size="xs" variant="current" /> : pack.price}
      </span>
    </Button>
  );
}

// =================================================================
// Main Billing Page
// =================================================================

export default function BillingPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "critical";
  } | null>(null);

  // Overlay state
  const [buyCreditsOpen, setBuyCreditsOpen] = useState(false);

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
      const [subRes, usageRes] = await Promise.all([
        fetch("/api/canopy/billing/subscription"),
        fetch("/api/canopy/billing/usage"),
      ]);

      if (!subRes.ok || !usageRes.ok) {
        throw new Error("Failed to load billing data");
      }

      const [subData, usageData] = await Promise.all([subRes.json(), usageRes.json()]);

      setSubscription(subData);
      setUsage(usageData);
      setError(null);
    } catch (err) {
      logger.error("Failed to load billing data", { error: formatError(err) });
      setError("Failed to load billing data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

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
  const isPayAsYouGo = planTier === "PAY_AS_YOU_GO";
  const isATS = planTier === "ATS";
  const totalCredits = (credits?.regular || 0) + (credits?.boosted || 0);

  return (
    <>
      <div className="space-y-8">
        {/* Page Title */}
        <h2 className="text-heading-sm font-medium text-[var(--foreground-default)]">
          Plan & Billing
        </h2>

        {/* ============================================================
            ZONE 1: Plan & Credits Summary
            ============================================================ */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Left card — Current Plan */}
            <Card variant="outlined">
              <CardContent className="flex h-full flex-col p-6">
                <div className="flex items-center gap-2">
                  <CreditCard size={20} weight="fill" className="text-[var(--foreground-brand)]" />
                  <span className="text-caption font-medium text-[var(--foreground-muted)]">
                    Current Plan
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <span className="text-body-strong font-bold text-[var(--foreground-default)]">
                    {planDisplay.name}
                  </span>
                  <Badge variant={planDisplay.color as "neutral" | "info" | "success"}>
                    {planDisplay.badge}
                  </Badge>
                </div>

                <p className="mt-1 text-caption text-[var(--foreground-muted)]">
                  {sub
                    ? `${formatCurrency(sub.amount)}/${sub.interval} · ${sub.cancelAtPeriodEnd ? "Ends" : "Renews"} ${formatDate(sub.currentPeriodEnd)}`
                    : planDisplay.tagline}
                </p>

                {sub?.cancelAtPeriodEnd && (
                  <Badge variant="warning" className="mt-2 w-fit text-caption-sm">
                    Cancelling at period end
                  </Badge>
                )}

                <div className="mt-auto pt-4">
                  <Button
                    variant="secondary"
                    onClick={handleManageSubscription}
                    disabled={actionLoading === "portal"}
                  >
                    {actionLoading === "portal" ? (
                      <Spinner size="xs" variant="current" />
                    ) : (
                      <ArrowSquareOut size={16} />
                    )}
                    Billing Portal
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Right card — Credits or Unlimited */}
            <Card variant="outlined">
              <CardContent className="flex h-full flex-col p-6">
                {isPayAsYouGo ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Package size={20} weight="fill" className="text-[var(--foreground-brand)]" />
                      <span className="text-caption font-medium text-[var(--foreground-muted)]">
                        Credits Remaining
                      </span>
                    </div>

                    {totalCredits > 0 ? (
                      <>
                        <div className="mt-3">
                          <Progress
                            value={Math.min(100, (totalCredits / 10) * 100)}
                            size="lg"
                            variant="default"
                          />
                        </div>

                        <p className="mt-2 text-body-sm text-[var(--foreground-default)]">
                          <span className="font-semibold">{credits?.regular ?? 0}</span>
                          <span className="text-[var(--foreground-muted)]"> regular</span>
                          {(credits?.boosted ?? 0) > 0 && (
                            <>
                              <span className="text-[var(--foreground-subtle)]"> · </span>
                              <span className="font-semibold">{credits?.boosted ?? 0}</span>
                              <span className="text-[var(--foreground-muted)]"> boosted</span>
                            </>
                          )}
                        </p>
                      </>
                    ) : (
                      <p className="mt-3 text-body-sm text-[var(--foreground-muted)]">
                        No credits yet — purchase a pack to get started.
                      </p>
                    )}

                    <div className="mt-auto pt-4">
                      <Button variant="primary" onClick={() => setBuyCreditsOpen(true)}>
                        <ShoppingCart size={16} />
                        Buy Credits
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <CheckCircle
                        size={20}
                        weight="fill"
                        className="text-[var(--foreground-success)]"
                      />
                      <span className="text-caption font-medium text-[var(--foreground-muted)]">
                        Listings
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <InfinityIcon
                        size={24}
                        weight="bold"
                        className="text-[var(--foreground-success)]"
                      />
                      <span className="text-body-strong font-bold text-[var(--foreground-default)]">
                        Unlimited
                      </span>
                    </div>

                    <p className="mt-1 text-caption text-[var(--foreground-muted)]">
                      Post as many jobs as you need. Active while subscribed.
                    </p>

                    {totalCredits > 0 && (
                      <p className="mt-2 text-caption text-[var(--foreground-subtle)]">
                        {credits?.regular ?? 0} regular · {credits?.boosted ?? 0} boosted credits
                        remaining
                      </p>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Loyalty points inline callout (below cards) */}
          {points && points.totalEarned > 0 && (
            <div className="flex items-center gap-2 rounded-xl bg-[var(--background-subtle)] px-4 py-2.5">
              <Coin size={16} weight="fill" className="text-[var(--primitive-yellow-500)]" />
              <span className="text-caption text-[var(--foreground-muted)]">
                <span className="font-medium text-[var(--foreground-default)]">
                  {points.balance.toLocaleString()} points
                </span>
                {" · "}
                {formatCurrency(points.balance * 10)} value
              </span>
            </div>
          )}
        </div>

        {/* ============================================================
            ZONE 2: Upgrade Plans (not on ATS tier)
            ============================================================ */}
        {!isATS && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Crown size={20} weight="fill" className="text-[var(--primitive-yellow-500)]" />
              <h3 className="text-body-strong font-semibold text-[var(--foreground-default)]">
                {isPayAsYouGo ? "Upgrade Your Plan" : "Upgrade to Full ATS"}
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {PLAN_TIERS.filter((p) => {
                if (planTier === "LISTINGS") return p.tier === "ATS";
                return true;
              }).map((plan) => (
                <Card
                  key={plan.tier}
                  variant={plan.popular ? "default" : "outlined"}
                  className={plan.popular ? "border-l-[3px] border-l-[var(--border-brand)]" : ""}
                >
                  <CardContent className="flex h-full flex-col space-y-4 p-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-body-strong font-semibold text-[var(--foreground-default)]">
                          {plan.name}
                        </h4>
                        {plan.popular && <Badge variant="success">Most Popular</Badge>}
                      </div>
                      <p className="mt-0.5 text-caption text-[var(--foreground-muted)]">
                        {plan.tagline}
                      </p>
                      <div className="mt-3 flex items-baseline gap-1">
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
                          onClick={() => handleUpgrade(plan.tier, "year")}
                          disabled={actionLoading?.startsWith("upgrade-")}
                        >
                          Annual
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ============================================================
          Overlay — Buy Credits Sheet
          ============================================================ */}
      <BuyCreditsSheet
        open={buyCreditsOpen}
        onOpenChange={setBuyCreditsOpen}
        onBuyPack={handleBuyPack}
        actionLoading={actionLoading}
      />

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
