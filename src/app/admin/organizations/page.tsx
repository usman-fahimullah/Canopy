"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { Spinner } from "@/components/ui/spinner";
import {
  Buildings,
  MagnifyingGlass,
  CurrencyDollar,
  Users,
  Briefcase,
  ArrowRight,
  UserSwitch,
  CaretDown,
  Funnel,
} from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";

// =================================================================
// Types
// =================================================================

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  planTier: "PAY_AS_YOU_GO" | "LISTINGS" | "ATS";
  hasStripeCustomer: boolean;
  teamSize: number;
  activeJobs: number;
  credits: { regular: number; boosted: number };
  createdAt: string;
}

interface OrgListResponse {
  data: Organization[];
  meta: { total: number; page: number; totalPages: number };
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

// =================================================================
// Page Component
// =================================================================

export default function AdminOrganizationsPage() {
  const router = useRouter();
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [page, setPage] = useState(1);

  const fetchOrgs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (planFilter) params.set("planTier", planFilter);
      params.set("page", String(page));
      params.set("limit", "20");

      const response = await fetch(`/api/admin/canopy/organizations?${params.toString()}`);
      if (response.ok) {
        const json: OrgListResponse = await response.json();
        setOrgs(json.data);
        setMeta(json.meta);
      }
    } catch (error) {
      logger.error("Failed to fetch organizations", {
        error: formatError(error),
      });
    } finally {
      setLoading(false);
    }
  }, [search, planFilter, page]);

  useEffect(() => {
    const timeout = setTimeout(fetchOrgs, 300);
    return () => clearTimeout(timeout);
  }, [fetchOrgs]);

  const handleImpersonate = async (orgId: string) => {
    try {
      const res = await fetch(`/api/admin/canopy/organizations/${orgId}/impersonate`, {
        method: "POST",
      });
      if (res.ok) {
        router.push("/canopy");
      }
    } catch (error) {
      logger.error("Failed to impersonate", { error: formatError(error) });
    }
  };

  // Summary stats
  const totalOrgs = meta.total;
  const payAsYouGo = orgs.filter((o) => o.planTier === "PAY_AS_YOU_GO").length;
  const listings = orgs.filter((o) => o.planTier === "LISTINGS").length;
  const ats = orgs.filter((o) => o.planTier === "ATS").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading-sm font-bold text-[var(--foreground-default)]">
            Organizations
          </h1>
          <p className="mt-1 text-body-sm text-[var(--foreground-muted)]">
            {totalOrgs} total organizations across all plan tiers
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {[
          {
            label: "Total",
            value: totalOrgs,
            icon: Buildings,
            color: "var(--primitive-neutral-600)",
          },
          {
            label: "Pay As You Go",
            value: payAsYouGo,
            icon: CurrencyDollar,
            color: "var(--primitive-neutral-600)",
          },
          {
            label: "Listings",
            value: listings,
            icon: Briefcase,
            color: "var(--primitive-blue-600)",
          },
          {
            label: "ATS",
            value: ats,
            icon: Users,
            color: "var(--primitive-green-600)",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-[var(--card-background)] p-4 shadow-[var(--shadow-card)]"
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: `color-mix(in srgb, ${stat.color} 15%, transparent)` }}
              >
                <stat.icon size={20} style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-caption text-[var(--foreground-muted)]">{stat.label}</p>
                <p className="text-heading-sm font-bold text-[var(--foreground-default)]">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <SearchInput
          placeholder="Search by name or slug..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-64"
        />
        <div className="relative">
          <select
            value={planFilter}
            onChange={(e) => {
              setPlanFilter(e.target.value);
              setPage(1);
            }}
            className="h-10 appearance-none rounded-lg border border-[var(--border-default)] bg-[var(--input-background)] px-3 pr-8 text-caption text-[var(--foreground-default)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2"
          >
            <option value="">All Plans</option>
            <option value="PAY_AS_YOU_GO">Pay As You Go</option>
            <option value="LISTINGS">Listings</option>
            <option value="ATS">ATS</option>
          </select>
          <CaretDown
            size={14}
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]"
          />
        </div>
        {(search || planFilter) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch("");
              setPlanFilter("");
              setPage(1);
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-[var(--background-muted)]" />
          ))}
        </div>
      ) : orgs.length === 0 ? (
        <div className="rounded-xl bg-[var(--card-background)] px-6 py-16 text-center shadow-[var(--shadow-card)]">
          <MagnifyingGlass size={48} className="mx-auto mb-4 text-[var(--foreground-subtle)]" />
          <p className="text-body font-medium text-[var(--foreground-default)]">
            No organizations found
          </p>
          <p className="mt-1 text-body-sm text-[var(--foreground-muted)]">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-[var(--card-background)] shadow-[var(--shadow-card)]">
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
                  Credits
                </th>
                <th className="px-4 py-3 text-left text-caption font-medium text-[var(--foreground-muted)]">
                  Jobs
                </th>
                <th className="px-4 py-3 text-left text-caption font-medium text-[var(--foreground-muted)]">
                  Team
                </th>
                <th className="px-4 py-3 text-left text-caption font-medium text-[var(--foreground-muted)]">
                  Created
                </th>
                <th className="px-4 py-3 text-right text-caption font-medium text-[var(--foreground-muted)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orgs.map((org) => {
                const tierConfig = PLAN_TIER_CONFIG[org.planTier] || PLAN_TIER_CONFIG.PAY_AS_YOU_GO;
                return (
                  <tr
                    key={org.id}
                    className="border-b border-[var(--border-muted)] transition-colors hover:bg-[var(--background-interactive-hover)]"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/organizations/${org.id}`}
                        className="group flex items-center gap-3"
                      >
                        {org.logo ? (
                          <img
                            src={org.logo}
                            alt={org.name}
                            className="h-8 w-8 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--background-brand-subtle)]">
                            <Buildings size={16} className="text-[var(--foreground-brand)]" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-body-sm font-medium text-[var(--foreground-default)] group-hover:text-[var(--foreground-brand)]">
                            {org.name}
                          </p>
                          <p className="truncate text-caption-sm text-[var(--foreground-subtle)]">
                            {org.slug}
                          </p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={tierConfig.variant}>{tierConfig.label}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-caption text-[var(--foreground-default)]">
                        <span>{org.credits.regular} reg</span>
                        {org.credits.boosted > 0 && (
                          <span className="ml-1 text-[var(--foreground-muted)]">
                            / {org.credits.boosted} boost
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-caption text-[var(--foreground-default)]">
                        {org.activeJobs}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-caption text-[var(--foreground-default)]">
                        {org.teamSize}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-caption text-[var(--foreground-subtle)]">
                        {formatDate(org.createdAt)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleImpersonate(org.id)}
                          title="Impersonate this organization"
                        >
                          <UserSwitch size={16} className="mr-1" />
                          Impersonate
                        </Button>
                        <Link href={`/admin/organizations/${org.id}`}>
                          <Button variant="ghost" size="sm">
                            <ArrowRight size={16} />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-caption text-[var(--foreground-muted)]">
            Page {meta.page} of {meta.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
