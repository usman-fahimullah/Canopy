"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  Buildings,
  ArrowLeft,
  UserSwitch,
  CurrencyDollar,
  Star,
  Briefcase,
  Users,
  CreditCard,
  Crown,
  Package,
  CaretDown,
} from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";

// =================================================================
// Types
// =================================================================

interface OrgDetail {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  planTier: "PAY_AS_YOU_GO" | "LISTINGS" | "ATS";
  planPeriodEnd: string | null;
  stripeCustomerId: string | null;
  createdAt: string;
  teamSize: number;
  members: Array<{
    id: string;
    role: string;
    departmentId: string | null;
    name: string | null;
    email: string;
    avatar: string | null;
  }>;
  credits: { regular: number; boosted: number };
  points: { balance: number; totalEarned: number; totalRedeemed: number };
  subscription: {
    id: string;
    stripeSubscriptionId: string;
    planTier: string;
    status: string;
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
    amount: number;
    interval: string;
  } | null;
  jobs: Record<string, number>;
  recentPurchases: Array<{
    id: string;
    purchaseType: string;
    amount: number;
    status: string;
    creditsGranted: number;
    createdAt: string;
  }>;
}

// =================================================================
// Helpers
// =================================================================

const PLAN_TIER_CONFIG: Record<string, { label: string; variant: "default" | "info" | "success" }> =
  {
    PAY_AS_YOU_GO: { label: "Pay As You Go", variant: "default" },
    LISTINGS: { label: "Listings", variant: "info" },
    ATS: { label: "ATS", variant: "success" },
  };

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatPurchaseType(type: string): string {
  return type
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// =================================================================
// Sub-Components
// =================================================================

function SectionCard({
  title,
  icon: Icon,
  children,
  actions,
}: {
  title: string;
  icon: React.ComponentType<{ size?: string | number; className?: string }>;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-[var(--card-background)] shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between border-b border-[var(--border-default)] px-5 py-4">
        <div className="flex items-center gap-2">
          <Icon size={18} className="text-[var(--foreground-muted)]" />
          <h3 className="text-body-strong font-semibold text-[var(--foreground-default)]">
            {title}
          </h3>
        </div>
        {actions}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-caption text-[var(--foreground-muted)]">{label}</span>
      <span className="text-caption font-medium text-[var(--foreground-default)]">{value}</span>
    </div>
  );
}

// =================================================================
// Modals (inline)
// =================================================================

function AdminActionModal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-xl bg-[var(--card-background)] p-6 shadow-[var(--shadow-modal)]">
        <h2 className="mb-4 text-body-strong font-semibold text-[var(--foreground-default)]">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}

// =================================================================
// Page Component
// =================================================================

export default function AdminOrgDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orgId = params.orgId as string;

  const [org, setOrg] = useState<OrgDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [creditModalOpen, setCreditModalOpen] = useState(false);
  const [pointsModalOpen, setPointsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Form states
  const [newPlanTier, setNewPlanTier] = useState("");
  const [planReason, setPlanReason] = useState("");
  const [creditType, setCreditType] = useState<"REGULAR" | "BOOSTED">("REGULAR");
  const [creditAmount, setCreditAmount] = useState("");
  const [creditReason, setCreditReason] = useState("");
  const [pointsAmount, setPointsAmount] = useState("");
  const [pointsReason, setPointsReason] = useState("");

  const fetchOrg = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/canopy/organizations/${orgId}`);
      if (!response.ok) {
        throw new Error("Failed to load organization");
      }
      const json = await response.json();
      setOrg(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
      logger.error("Failed to fetch org detail", { error: formatError(err) });
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    fetchOrg();
  }, [fetchOrg]);

  const handleImpersonate = async () => {
    try {
      const res = await fetch(`/api/admin/canopy/organizations/${orgId}/impersonate`, {
        method: "POST",
      });
      if (res.ok) {
        router.push("/canopy");
      }
    } catch (err) {
      logger.error("Failed to impersonate", { error: formatError(err) });
    }
  };

  const handlePlanChange = async () => {
    if (!newPlanTier || !planReason) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/canopy/organizations/${orgId}/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planTier: newPlanTier, reason: planReason }),
      });
      if (res.ok) {
        setPlanModalOpen(false);
        setNewPlanTier("");
        setPlanReason("");
        fetchOrg();
      }
    } catch (err) {
      logger.error("Plan change failed", { error: formatError(err) });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreditChange = async () => {
    const amount = parseInt(creditAmount, 10);
    if (isNaN(amount) || amount === 0 || !creditReason) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/canopy/organizations/${orgId}/credits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creditType,
          amount,
          reason: creditReason,
        }),
      });
      if (res.ok) {
        setCreditModalOpen(false);
        setCreditAmount("");
        setCreditReason("");
        fetchOrg();
      }
    } catch (err) {
      logger.error("Credit change failed", { error: formatError(err) });
    } finally {
      setActionLoading(false);
    }
  };

  const handlePointsChange = async () => {
    const amount = parseInt(pointsAmount, 10);
    if (isNaN(amount) || amount === 0 || !pointsReason) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/canopy/organizations/${orgId}/points`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, reason: pointsReason }),
      });
      if (res.ok) {
        setPointsModalOpen(false);
        setPointsAmount("");
        setPointsReason("");
        fetchOrg();
      }
    } catch (err) {
      logger.error("Points change failed", { error: formatError(err) });
    } finally {
      setActionLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-[var(--background-muted)]" />
        <div className="h-24 animate-pulse rounded-xl bg-[var(--background-muted)]" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="h-48 animate-pulse rounded-xl bg-[var(--background-muted)]" />
          <div className="h-48 animate-pulse rounded-xl bg-[var(--background-muted)]" />
        </div>
      </div>
    );
  }

  // Error state
  if (error || !org) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/organizations"
          className="inline-flex items-center gap-1 text-caption text-[var(--foreground-muted)] hover:text-[var(--foreground-default)]"
        >
          <ArrowLeft size={16} />
          Back to Organizations
        </Link>
        <div className="rounded-xl bg-[var(--card-background)] px-6 py-16 text-center shadow-[var(--shadow-card)]">
          <p className="text-body font-medium text-[var(--foreground-error)]">
            {error || "Organization not found"}
          </p>
          <Button variant="secondary" className="mt-4" onClick={fetchOrg}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const tierConfig = PLAN_TIER_CONFIG[org.planTier] || PLAN_TIER_CONFIG.PAY_AS_YOU_GO;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        href="/admin/organizations"
        className="inline-flex items-center gap-1 text-caption text-[var(--foreground-muted)] hover:text-[var(--foreground-default)]"
      >
        <ArrowLeft size={16} />
        Back to Organizations
      </Link>

      {/* Org Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {org.logo ? (
            <img src={org.logo} alt={org.name} className="h-14 w-14 rounded-xl object-cover" />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--background-brand-subtle)]">
              <Buildings size={28} className="text-[var(--foreground-brand)]" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-heading-sm font-bold text-[var(--foreground-default)]">
                {org.name}
              </h1>
              <Badge variant={tierConfig.variant}>{tierConfig.label}</Badge>
            </div>
            <p className="mt-0.5 text-body-sm text-[var(--foreground-muted)]">
              {org.slug} · Created {formatDate(org.createdAt)}
            </p>
          </div>
        </div>
        <Button variant="secondary" onClick={handleImpersonate}>
          <UserSwitch size={18} className="mr-2" />
          Impersonate
        </Button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Billing Card */}
        <SectionCard
          title="Billing"
          icon={CreditCard}
          actions={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setNewPlanTier(org.planTier);
                setPlanModalOpen(true);
              }}
            >
              Change Plan
            </Button>
          }
        >
          <div className="divide-y divide-[var(--border-muted)]">
            <InfoRow label="Plan Tier" value={tierConfig.label} />
            <InfoRow
              label="Stripe Customer"
              value={
                org.stripeCustomerId ? (
                  <span className="font-mono text-caption-sm">{org.stripeCustomerId}</span>
                ) : (
                  <span className="text-[var(--foreground-subtle)]">—</span>
                )
              }
            />
            {org.subscription && (
              <>
                <InfoRow
                  label="Subscription Status"
                  value={
                    <Badge
                      variant={
                        org.subscription.status === "ACTIVE"
                          ? "success"
                          : org.subscription.status === "PAST_DUE"
                            ? "warning"
                            : "default"
                      }
                    >
                      {org.subscription.status}
                    </Badge>
                  }
                />
                <InfoRow
                  label="Amount"
                  value={`${formatCurrency(org.subscription.amount)}/${org.subscription.interval}`}
                />
                {org.subscription.currentPeriodEnd && (
                  <InfoRow
                    label="Period End"
                    value={formatDate(org.subscription.currentPeriodEnd)}
                  />
                )}
                {org.subscription.cancelAtPeriodEnd && (
                  <InfoRow
                    label="Cancels At Period End"
                    value={<Badge variant="warning">Yes</Badge>}
                  />
                )}
              </>
            )}
          </div>
        </SectionCard>

        {/* Credits Card */}
        <SectionCard
          title="Credits"
          icon={CurrencyDollar}
          actions={
            <Button variant="ghost" size="sm" onClick={() => setCreditModalOpen(true)}>
              Grant / Revoke
            </Button>
          }
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-[var(--background-subtle)] p-4 text-center">
              <p className="text-heading-sm font-bold text-[var(--foreground-default)]">
                {org.credits.regular}
              </p>
              <p className="text-caption text-[var(--foreground-muted)]">Regular Credits</p>
            </div>
            <div className="rounded-lg bg-[var(--background-subtle)] p-4 text-center">
              <p className="text-heading-sm font-bold text-[var(--foreground-default)]">
                {org.credits.boosted}
              </p>
              <p className="text-caption text-[var(--foreground-muted)]">Boosted Credits</p>
            </div>
          </div>
        </SectionCard>

        {/* Points Card */}
        <SectionCard
          title="Loyalty Points"
          icon={Star}
          actions={
            <Button variant="ghost" size="sm" onClick={() => setPointsModalOpen(true)}>
              Adjust Points
            </Button>
          }
        >
          <div className="divide-y divide-[var(--border-muted)]">
            <InfoRow label="Current Balance" value={org.points.balance.toLocaleString()} />
            <InfoRow label="Total Earned" value={org.points.totalEarned.toLocaleString()} />
            <InfoRow label="Total Redeemed" value={org.points.totalRedeemed.toLocaleString()} />
          </div>
        </SectionCard>

        {/* Jobs Card */}
        <SectionCard title="Jobs" icon={Briefcase}>
          <div className="divide-y divide-[var(--border-muted)]">
            <InfoRow
              label="Total"
              value={<span className="font-semibold">{org.jobs.total || 0}</span>}
            />
            {Object.entries(org.jobs)
              .filter(([key]) => key !== "total")
              .map(([status, count]) => (
                <InfoRow key={status} label={status} value={count} />
              ))}
          </div>
        </SectionCard>
      </div>

      {/* Team Card */}
      <SectionCard title="Team" icon={Users}>
        <p className="mb-3 text-caption text-[var(--foreground-muted)]">
          {org.teamSize} member{org.teamSize !== 1 ? "s" : ""}
        </p>
        {org.members.length === 0 ? (
          <p className="text-body-sm text-[var(--foreground-subtle)]">No team members</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-[var(--border-default)]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-default)] bg-[var(--background-subtle)]">
                  <th className="px-3 py-2 text-left text-caption-sm font-medium text-[var(--foreground-muted)]">
                    Name
                  </th>
                  <th className="px-3 py-2 text-left text-caption-sm font-medium text-[var(--foreground-muted)]">
                    Email
                  </th>
                  <th className="px-3 py-2 text-left text-caption-sm font-medium text-[var(--foreground-muted)]">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody>
                {org.members.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b border-[var(--border-muted)] last:border-b-0"
                  >
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name || ""}
                            className="h-6 w-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--background-brand-subtle)] text-caption-sm font-medium text-[var(--foreground-brand)]">
                            {(member.name || member.email)[0]?.toUpperCase()}
                          </div>
                        )}
                        <span className="text-caption text-[var(--foreground-default)]">
                          {member.name || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-caption text-[var(--foreground-muted)]">
                      {member.email}
                    </td>
                    <td className="px-3 py-2">
                      <Badge variant={member.role === "OWNER" ? "success" : "default"}>
                        {member.role}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      {/* Purchase History */}
      <SectionCard title="Recent Purchases" icon={Package}>
        {org.recentPurchases.length === 0 ? (
          <p className="text-body-sm text-[var(--foreground-subtle)]">No purchases yet</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-[var(--border-default)]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-default)] bg-[var(--background-subtle)]">
                  <th className="px-3 py-2 text-left text-caption-sm font-medium text-[var(--foreground-muted)]">
                    Type
                  </th>
                  <th className="px-3 py-2 text-left text-caption-sm font-medium text-[var(--foreground-muted)]">
                    Amount
                  </th>
                  <th className="px-3 py-2 text-left text-caption-sm font-medium text-[var(--foreground-muted)]">
                    Credits
                  </th>
                  <th className="px-3 py-2 text-left text-caption-sm font-medium text-[var(--foreground-muted)]">
                    Status
                  </th>
                  <th className="px-3 py-2 text-left text-caption-sm font-medium text-[var(--foreground-muted)]">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {org.recentPurchases.map((purchase) => (
                  <tr
                    key={purchase.id}
                    className="border-b border-[var(--border-muted)] last:border-b-0"
                  >
                    <td className="px-3 py-2 text-caption text-[var(--foreground-default)]">
                      {formatPurchaseType(purchase.purchaseType)}
                    </td>
                    <td className="px-3 py-2 text-caption text-[var(--foreground-default)]">
                      {formatCurrency(purchase.amount)}
                    </td>
                    <td className="px-3 py-2 text-caption text-[var(--foreground-muted)]">
                      {purchase.creditsGranted > 0 ? `+${purchase.creditsGranted}` : "—"}
                    </td>
                    <td className="px-3 py-2">
                      <Badge
                        variant={
                          purchase.status === "COMPLETED"
                            ? "success"
                            : purchase.status === "REFUNDED"
                              ? "warning"
                              : "default"
                        }
                      >
                        {purchase.status}
                      </Badge>
                    </td>
                    <td className="px-3 py-2 text-caption text-[var(--foreground-subtle)]">
                      {formatDate(purchase.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      {/* Plan Change Modal */}
      <AdminActionModal
        open={planModalOpen}
        onClose={() => setPlanModalOpen(false)}
        title="Change Plan Tier"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-caption font-medium text-[var(--foreground-default)]">
              New Plan Tier
            </label>
            <div className="relative">
              <select
                value={newPlanTier}
                onChange={(e) => setNewPlanTier(e.target.value)}
                className="h-10 w-full appearance-none rounded-lg border border-[var(--border-default)] bg-[var(--input-background)] px-3 pr-8 text-caption text-[var(--foreground-default)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2"
              >
                <option value="PAY_AS_YOU_GO">Pay As You Go</option>
                <option value="LISTINGS">Listings ($199/mo)</option>
                <option value="ATS">ATS ($399/mo)</option>
              </select>
              <CaretDown
                size={14}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-caption font-medium text-[var(--foreground-default)]">
              Reason
            </label>
            <textarea
              value={planReason}
              onChange={(e) => setPlanReason(e.target.value)}
              placeholder="Why is this plan change being made?"
              rows={3}
              className="w-full resize-none rounded-lg border border-[var(--border-default)] bg-[var(--input-background)] px-3 py-2 text-caption text-[var(--foreground-default)] placeholder:text-[var(--input-foreground-placeholder)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setPlanModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handlePlanChange}
              loading={actionLoading}
              disabled={!newPlanTier || !planReason || newPlanTier === org.planTier}
            >
              Change Plan
            </Button>
          </div>
        </div>
      </AdminActionModal>

      {/* Credit Change Modal */}
      <AdminActionModal
        open={creditModalOpen}
        onClose={() => setCreditModalOpen(false)}
        title="Grant / Revoke Credits"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-caption font-medium text-[var(--foreground-default)]">
              Credit Type
            </label>
            <div className="relative">
              <select
                value={creditType}
                onChange={(e) => setCreditType(e.target.value as "REGULAR" | "BOOSTED")}
                className="h-10 w-full appearance-none rounded-lg border border-[var(--border-default)] bg-[var(--input-background)] px-3 pr-8 text-caption text-[var(--foreground-default)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2"
              >
                <option value="REGULAR">Regular</option>
                <option value="BOOSTED">Boosted</option>
              </select>
              <CaretDown
                size={14}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-caption font-medium text-[var(--foreground-default)]">
              Amount (positive to grant, negative to revoke)
            </label>
            <input
              type="number"
              value={creditAmount}
              onChange={(e) => setCreditAmount(e.target.value)}
              placeholder="e.g. 5 or -3"
              className="h-10 w-full rounded-lg border border-[var(--border-default)] bg-[var(--input-background)] px-3 text-caption text-[var(--foreground-default)] placeholder:text-[var(--input-foreground-placeholder)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-caption font-medium text-[var(--foreground-default)]">
              Reason
            </label>
            <textarea
              value={creditReason}
              onChange={(e) => setCreditReason(e.target.value)}
              placeholder="Why are credits being adjusted?"
              rows={3}
              className="w-full resize-none rounded-lg border border-[var(--border-default)] bg-[var(--input-background)] px-3 py-2 text-caption text-[var(--foreground-default)] placeholder:text-[var(--input-foreground-placeholder)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setCreditModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreditChange}
              loading={actionLoading}
              disabled={
                !creditAmount ||
                parseInt(creditAmount, 10) === 0 ||
                isNaN(parseInt(creditAmount, 10)) ||
                !creditReason
              }
            >
              Adjust Credits
            </Button>
          </div>
        </div>
      </AdminActionModal>

      {/* Points Change Modal */}
      <AdminActionModal
        open={pointsModalOpen}
        onClose={() => setPointsModalOpen(false)}
        title="Adjust Loyalty Points"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-caption font-medium text-[var(--foreground-default)]">
              Amount (positive to grant, negative to revoke)
            </label>
            <input
              type="number"
              value={pointsAmount}
              onChange={(e) => setPointsAmount(e.target.value)}
              placeholder="e.g. 100 or -50"
              className="h-10 w-full rounded-lg border border-[var(--border-default)] bg-[var(--input-background)] px-3 text-caption text-[var(--foreground-default)] placeholder:text-[var(--input-foreground-placeholder)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-caption font-medium text-[var(--foreground-default)]">
              Reason
            </label>
            <textarea
              value={pointsReason}
              onChange={(e) => setPointsReason(e.target.value)}
              placeholder="Why are points being adjusted?"
              rows={3}
              className="w-full resize-none rounded-lg border border-[var(--border-default)] bg-[var(--input-background)] px-3 py-2 text-caption text-[var(--foreground-default)] placeholder:text-[var(--input-foreground-placeholder)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setPointsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handlePointsChange}
              loading={actionLoading}
              disabled={
                !pointsAmount ||
                parseInt(pointsAmount, 10) === 0 ||
                isNaN(parseInt(pointsAmount, 10)) ||
                !pointsReason
              }
            >
              Adjust Points
            </Button>
          </div>
        </div>
      </AdminActionModal>
    </div>
  );
}
