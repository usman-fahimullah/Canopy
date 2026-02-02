"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Users,
  UserCirclePlus,
  CalendarCheck,
  CurrencyDollar,
  Star,
  ArrowRight,
  TrendUp,
} from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";

interface DashboardMetrics {
  pendingApplications: number;
  activeCoaches: number;
  totalSessions: number;
  totalRevenue: number;
  avgRating: number;
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    pendingApplications: 0,
    activeCoaches: 0,
    totalSessions: 0,
    totalRevenue: 0,
    avgRating: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch("/api/admin/metrics");
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      logger.error("Failed to fetch metrics", { error: formatError(error) });
    } finally {
      setLoading(false);
    }
  };

  const metricCards = [
    {
      title: "Pending Applications",
      value: metrics.pendingApplications,
      icon: UserCirclePlus,
      color: "orange",
      link: "/admin/coaches?status=PENDING",
    },
    {
      title: "Active Coaches",
      value: metrics.activeCoaches,
      icon: Users,
      color: "green",
      link: "/admin/coaches?status=ACTIVE",
    },
    {
      title: "Total Sessions",
      value: metrics.totalSessions,
      icon: CalendarCheck,
      color: "blue",
      link: "/admin/sessions",
    },
    {
      title: "Platform Revenue",
      value: `$${(metrics.totalRevenue / 100).toLocaleString()}`,
      icon: CurrencyDollar,
      color: "green",
      link: "/admin/revenue",
    },
    {
      title: "Avg. Rating",
      value: metrics.avgRating.toFixed(1),
      icon: Star,
      color: "yellow",
      link: "/admin/reviews",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--primitive-green-800)]">
          Admin Dashboard
        </h1>
        <p className="text-[var(--primitive-neutral-600)]">
          Manage coaches, review applications, and monitor platform health.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {metricCards.map((card) => (
          <Link key={card.title} href={card.link}>
            <div className="bg-[var(--card-background)] rounded-xl border border-[var(--primitive-neutral-200)] p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <card.icon
                  size={24}
                  className={`text-[var(--primitive-${card.color}-600)]`}
                  weight="duotone"
                />
                <ArrowRight size={16} className="text-[var(--primitive-neutral-400)]" />
              </div>
              <div className="text-2xl font-bold text-[var(--primitive-green-800)]">
                {loading ? "..." : card.value}
              </div>
              <div className="text-sm text-[var(--primitive-neutral-600)]">
                {card.title}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Applications */}
        <div className="bg-[var(--card-background)] rounded-xl border border-[var(--primitive-neutral-200)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--primitive-green-800)]">
              Pending Applications
            </h2>
            <Link href="/admin/coaches?status=PENDING">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight size={16} className="ml-1" />
              </Button>
            </Link>
          </div>

          {metrics.pendingApplications > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-[var(--primitive-orange-50)] rounded-lg">
                <div className="w-10 h-10 bg-[var(--primitive-orange-100)] rounded-full flex items-center justify-center">
                  <UserCirclePlus size={20} className="text-[var(--primitive-orange-600)]" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[var(--primitive-green-800)]">
                    {metrics.pendingApplications} applications waiting
                  </p>
                  <p className="text-sm text-[var(--primitive-neutral-600)]">
                    Review and approve new coaches
                  </p>
                </div>
                <Link href="/admin/coaches?status=PENDING">
                  <Button size="sm">Review</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-[var(--primitive-neutral-500)]">
              No pending applications
            </div>
          )}
        </div>

        {/* Platform Health */}
        <div className="bg-[var(--card-background)] rounded-xl border border-[var(--primitive-neutral-200)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--primitive-green-800)]">
              Platform Health
            </h2>
            <TrendUp size={24} className="text-[var(--primitive-green-600)]" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[var(--primitive-neutral-600)]">Coach Approval Rate</span>
              <span className="font-medium text-[var(--primitive-green-700)]">85%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--primitive-neutral-600)]">Session Completion Rate</span>
              <span className="font-medium text-[var(--primitive-green-700)]">94%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--primitive-neutral-600)]">Average Response Time</span>
              <span className="font-medium text-[var(--primitive-green-700)]">2.3 days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--primitive-neutral-600)]">Mentor Satisfaction</span>
              <span className="font-medium text-[var(--primitive-green-700)]">4.7/5.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
