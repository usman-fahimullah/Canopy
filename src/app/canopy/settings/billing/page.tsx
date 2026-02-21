"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Toast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/empty-state";
import { SimplePagination } from "@/components/ui/pagination";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
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
  ArrowRight,
  WarningCircle,
  Receipt,
  Gear,
  CheckCircle,
  Infinity as InfinityIcon,
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
// Loading Skeleton — matches simplified 2-card layout
// =================================================================

function BillingSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-8 w-48" />
      {/* Summary row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-[var(--border-default)] p-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded" />
            <Skeleton className="h-5 w-28" />
          </div>
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
        <div className="space-y-4 rounded-2xl border border-[var(--border-default)] p-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded" />
            <Skeleton className="h-5 w-36" />
          </div>
          <Skeleton className="h-3 w-full rounded-full" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </div>
      {/* Upgrade section */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

// =================================================================
// ManagePlanModal — plan details, loyalty points, billing links
// =================================================================

function ManagePlanModal({
  open,
  onOpenChange,
  planTier,
  subscription,
  points,
  onPortal,
  portalLoading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planTier: string;
  subscription: SubscriptionInfo | null;
  points: PointsBalance | null;
  onPortal: () => void;
  portalLoading: boolean;
}) {
  const planDisplay = PLAN_DISPLAY[planTier] || PLAN_DISPLAY.PAY_AS_YOU_GO;

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="default">
        <ModalHeader
          icon={<CreditCard weight="regular" className="h-6 w-6 text-[var(--foreground-brand)]" />}
          iconBg="bg-[var(--background-brand-subtle)]"
        >
          <ModalTitle>Manage Plan</ModalTitle>
        </ModalHeader>

        <ModalBody>
          <div className="w-full space-y-5">
            {/* Plan details row */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-caption font-medium text-[var(--foreground-muted)]">
                  Plan
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-body-sm font-semibold text-[var(--foreground-default)]">
                    {planDisplay.name}
                  </span>
                  <Badge
                    variant={planDisplay.color as "neutral" | "info" | "success"}
                    className="text-caption-sm"
                  >
                    {planDisplay.badge}
                  </Badge>
                </div>
              </div>

              {subscription && (
                <>
                  <Separator spacing="none" />
                  <div className="flex items-center justify-between">
                    <span className="text-caption font-medium text-[var(--foreground-muted)]">
                      Amount
                    </span>
                    <span className="text-body-sm text-[var(--foreground-default)]">
                      {formatCurrency(subscription.amount)}/{subscription.interval}
                    </span>
                  </div>
                  <Separator spacing="none" />
                  <div className="flex items-center justify-between">
                    <span className="text-caption font-medium text-[var(--foreground-muted)]">
                      {subscription.cancelAtPeriodEnd ? "Ends" : "Renews"}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-body-sm text-[var(--foreground-default)]">
                        {formatDate(subscription.currentPeriodEnd)}
                      </span>
                      {subscription.cancelAtPeriodEnd && (
                        <Badge variant="warning" className="text-caption-sm">
                          Cancelling
                        </Badge>
                      )}
                    </div>
                  </div>
                </>
              )}

              {!subscription && planTier === "PAY_AS_YOU_GO" && (
                <>
                  <Separator spacing="none" />
                  <div className="flex items-center justify-between">
                    <span className="text-caption font-medium text-[var(--foreground-muted)]">
                      Billing
                    </span>
                    <span className="text-body-sm text-[var(--foreground-muted)]">
                      No active subscription
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Loyalty points row */}
            {points && points.totalEarned > 0 && (
              <>
                <Separator spacing="none" />
                <div className="rounded-xl bg-[var(--background-subtle)] p-4">
                  <div className="flex items-center gap-3">
                    <Coin size={20} weight="fill" className="text-[var(--primitive-yellow-500)]" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-body-sm font-semibold text-[var(--foreground-default)]">
                          {points.balance.toLocaleString()} points
                        </span>
                        <span className="text-caption text-[var(--foreground-muted)]">
                          ({formatCurrency(points.balance * 10)} value)
                        </span>
                      </div>
                      <p className="mt-0.5 text-caption text-[var(--foreground-subtle)]">
                        Earned: {points.totalEarned.toLocaleString()} · Redeemed:{" "}
                        {points.totalRedeemed.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </ModalBody>

        <ModalFooter>
          {subscription && (
            <Button variant="tertiary" onClick={onPortal} disabled={portalLoading}>
              {portalLoading ? (
                <Spinner size="xs" variant="current" />
              ) : (
                <ArrowSquareOut size={16} weight="bold" />
              )}
              Billing Portal
            </Button>
          )}
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// =================================================================
// BuyCreditsSheet — tabbed credit pack options
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
            Purchase listing credits. Earn 1 loyalty point per $1 spent.
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

        <div className="mt-6 rounded-xl bg-[var(--background-subtle)] p-4">
          <div className="flex items-center gap-2">
            <Coin size={16} weight="fill" className="text-[var(--primitive-yellow-500)]" />
            <span className="text-caption text-[var(--foreground-muted)]">
              Earn 1 point per $1 spent. Points apply automatically to future purchases.
            </span>
          </div>
        </div>
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
    <button
      onClick={onBuy}
      disabled={disabled}
      className="flex w-full items-center justify-between rounded-xl border border-[var(--border-default)] px-5 py-4 text-left transition-colors hover:border-[var(--border-brand)] hover:bg-[var(--background-brand-subtle)] disabled:opacity-50"
    >
      <div className="min-w-0">
        <p className="text-body-sm font-medium text-[var(--foreground-default)]">{pack.label}</p>
        <p className="text-caption text-[var(--foreground-subtle)]">{pack.pricePerUnit}</p>
      </div>
      <span className="ml-3 flex-shrink-0 text-body-sm font-semibold text-[var(--foreground-brand)]">
        {loading ? <Spinner size="xs" variant="current" /> : pack.price}
      </span>
    </button>
  );
}

// =================================================================
// PurchaseHistorySheet — full paginated purchase table
// =================================================================

function PurchaseHistorySheet({
  open,
  onOpenChange,
  purchases,
  purchaseTotal,
  purchasePage,
  onPageChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchases: Purchase[];
  purchaseTotal: number;
  purchasePage: number;
  onPageChange: (page: number) => void;
}) {
  const pageCount = Math.ceil(purchaseTotal / 10);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" size="2xl" className="flex flex-col overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Purchase History</SheetTitle>
          <SheetDescription>All credit and subscription purchases.</SheetDescription>
        </SheetHeader>

        {purchases.length === 0 ? (
          <div className="flex-1">
            <EmptyState
              icon={<Receipt size={48} />}
              title="No purchases yet"
              description="Your purchase history will appear here."
            />
          </div>
        ) : (
          <div className="flex-1 space-y-4">
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

            {pageCount > 1 && (
              <div className="flex justify-end pt-2">
                <SimplePagination
                  currentPage={purchasePage + 1}
                  totalPages={pageCount}
                  onPageChange={(page) => onPageChange(page - 1)}
                />
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// =================================================================
// Main Billing Page — Simplified 3-zone layout
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

  // Overlay states
  const [manageModalOpen, setManageModalOpen] = useState(false);
  const [buyCreditsOpen, setBuyCreditsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

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
  const isPayAsYouGo = planTier === "PAY_AS_YOU_GO";
  const isATS = planTier === "ATS";
  const totalCredits = (credits?.regular || 0) + (credits?.boosted || 0);
  const recentPurchases = purchases.slice(0, 3);

  return (
    <>
      <div className="space-y-8">
        {/* Page Title */}
        <h2 className="text-heading-sm font-medium text-[var(--foreground-default)]">
          Plan & Billing
        </h2>

        {/* ============================================================
            ZONE 1: Plan & Credits Summary (two-card grid)
            ============================================================ */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Left card — Current Plan */}
          <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--card-background)] p-6">
            <div className="flex h-full flex-col">
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

              <div className="mt-auto pt-4">
                <Button variant="tertiary" size="sm" onClick={() => setManageModalOpen(true)}>
                  <Gear size={16} />
                  Manage
                </Button>
              </div>
            </div>
          </div>

          {/* Right card — Credits or Unlimited indicator */}
          <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--card-background)] p-6">
            <div className="flex h-full flex-col">
              {isPayAsYouGo ? (
                <>
                  {/* Tier 1: credit usage display */}
                  <div className="flex items-center gap-2">
                    <Package size={20} weight="fill" className="text-[var(--foreground-brand)]" />
                    <span className="text-caption font-medium text-[var(--foreground-muted)]">
                      Credits Remaining
                    </span>
                  </div>

                  <div className="mt-3">
                    <Progress
                      value={totalCredits > 0 ? Math.min(100, (totalCredits / 10) * 100) : 0}
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

                  <div className="mt-auto pt-4">
                    <Button variant="primary" size="sm" onClick={() => setBuyCreditsOpen(true)}>
                      <ShoppingCart size={16} />
                      Buy Credits
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* Tier 2/3: unlimited listings display */}
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

                  {/* Show remaining credits if any exist from previous tier */}
                  {totalCredits > 0 && (
                    <p className="mt-2 text-caption text-[var(--foreground-subtle)]">
                      {credits?.regular ?? 0} regular · {credits?.boosted ?? 0} boosted credits
                      remaining
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
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
                <div
                  key={plan.tier}
                  className={
                    "relative rounded-2xl border bg-[var(--card-background)] p-6 " +
                    (plan.popular
                      ? "border-[var(--border-brand)] shadow-[var(--shadow-card)]"
                      : "border-[var(--border-default)]")
                  }
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-6">
                      <Badge variant="success">Most Popular</Badge>
                    </div>
                  )}

                  <div className="flex h-full flex-col space-y-4">
                    <div>
                      <h4 className="text-body-strong font-semibold text-[var(--foreground-default)]">
                        {plan.name}
                      </h4>
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
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================
            ZONE 3: Recent Purchases (compact, last 3 inline)
            ============================================================ */}
        {purchaseTotal > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt size={20} weight="fill" className="text-[var(--foreground-brand)]" />
                <h3 className="text-body-strong font-semibold text-[var(--foreground-default)]">
                  Recent Purchases
                </h3>
              </div>
              {purchaseTotal > 3 && (
                <Button variant="ghost" size="sm" onClick={() => setHistoryOpen(true)}>
                  View all
                  <ArrowRight size={14} />
                </Button>
              )}
            </div>

            <div className="divide-y divide-[var(--border-muted)] rounded-xl border border-[var(--border-default)] bg-[var(--card-background)]">
              {recentPurchases.map((purchase) => (
                <div key={purchase.id} className="flex items-center justify-between px-5 py-3">
                  <div className="min-w-0">
                    <p className="text-body-sm text-[var(--foreground-default)]">
                      {PURCHASE_TYPE_LABELS[purchase.purchaseType] || purchase.purchaseType}
                    </p>
                    <p className="text-caption text-[var(--foreground-subtle)]">
                      {formatDate(purchase.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-body-sm font-medium text-[var(--foreground-default)]">
                      {formatCurrency(purchase.amount)}
                    </span>
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ============================================================
          Overlays — Modal & Sheets
          ============================================================ */}
      <ManagePlanModal
        open={manageModalOpen}
        onOpenChange={setManageModalOpen}
        planTier={planTier}
        subscription={sub ?? null}
        points={points ?? null}
        onPortal={handleManageSubscription}
        portalLoading={actionLoading === "portal"}
      />

      <BuyCreditsSheet
        open={buyCreditsOpen}
        onOpenChange={setBuyCreditsOpen}
        onBuyPack={handleBuyPack}
        actionLoading={actionLoading}
      />

      <PurchaseHistorySheet
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        purchases={purchases}
        purchaseTotal={purchaseTotal}
        purchasePage={purchasePage}
        onPageChange={setPurchasePage}
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
