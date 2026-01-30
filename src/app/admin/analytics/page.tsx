"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import {
  Users,
  CalendarCheck,
  CurrencyDollar,
  Star,
  TrendUp,
  UserCirclePlus,
  HandHeart,
  XCircle,
  WarningCircle,
} from "@phosphor-icons/react";

interface AnalyticsData {
  pendingApplications: number;
  activeCoaches: number;
  totalSessions: number;
  totalRevenue: number;
  avgRating: number;
  totalReviews: number;
  totalBookings: number;
  sessionsByMonth: Record<string, { total: number; completed: number; cancelled: number }>;
  revenueByMonth: Record<string, { amount: number; fees: number }>;
  ratingDistribution: number[];
  totalSeekers: number;
  totalMentors: number;
  cancelledSessions: number;
  noShowSessions: number;
  completionRate: number;
}

function StatCard({
  label,
  value,
  icon: Icon,
  color = "green",
  subtitle,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color?: string;
  subtitle?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-[var(--primitive-neutral-200)] p-5">
      <div className="flex items-center gap-3 mb-2">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center bg-[var(--primitive-${color}-100)]`}
        >
          <Icon size={20} className={`text-[var(--primitive-${color}-600)]`} />
        </div>
        <span className="text-sm text-[var(--primitive-neutral-600)]">{label}</span>
      </div>
      <div className="text-2xl font-bold text-[var(--primitive-green-800)]">{value}</div>
      {subtitle && (
        <p className="text-xs text-[var(--primitive-neutral-500)] mt-1">{subtitle}</p>
      )}
    </div>
  );
}

function BarChart({
  data,
  maxValue,
  label,
}: {
  data: { label: string; value: number; color?: string }[];
  maxValue: number;
  label: string;
}) {
  return (
    <div>
      <h3 className="text-sm font-medium text-[var(--primitive-green-800)] mb-4">{label}</h3>
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <span className="text-xs text-[var(--primitive-neutral-600)] w-16 text-right">
              {item.label}
            </span>
            <div className="flex-1 h-6 bg-[var(--primitive-neutral-100)] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${item.color || "bg-[var(--primitive-green-500)]"}`}
                style={{ width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%` }}
              />
            </div>
            <span className="text-xs font-medium text-[var(--primitive-green-800)] w-12">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/admin/metrics?extended=true");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  // Prepare monthly session data
  const sortedSessionMonths = Object.keys(data.sessionsByMonth || {}).sort();
  const sessionMonthData = sortedSessionMonths.map((key) => {
    const [year, month] = key.split("-");
    const monthLabel = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString(
      "en-US",
      { month: "short" }
    );
    return {
      label: monthLabel,
      value: data.sessionsByMonth[key].total,
    };
  });
  const maxSessions = Math.max(...sessionMonthData.map((d) => d.value), 1);

  // Prepare monthly revenue data
  const sortedRevenueMonths = Object.keys(data.revenueByMonth || {}).sort();
  const revenueMonthData = sortedRevenueMonths.map((key) => {
    const [year, month] = key.split("-");
    const monthLabel = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString(
      "en-US",
      { month: "short" }
    );
    return {
      label: monthLabel,
      value: Math.round(data.revenueByMonth[key].fees / 100),
      color: "bg-[var(--primitive-blue-500)]",
    };
  });
  const maxRevenue = Math.max(...revenueMonthData.map((d) => d.value), 1);

  // Rating distribution
  const ratingData = (data.ratingDistribution || []).map((count, i) => ({
    label: `${i + 1} star`,
    value: count,
    color:
      i >= 3
        ? "bg-[var(--primitive-green-500)]"
        : i >= 2
          ? "bg-[var(--primitive-yellow-500)]"
          : "bg-[var(--primitive-red-500)]",
  }));
  const maxRating = Math.max(...ratingData.map((d) => d.value), 1);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--primitive-green-800)]">
          Analytics
        </h1>
        <p className="text-sm text-[var(--primitive-neutral-600)]">
          Platform performance and growth metrics
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
        <StatCard
          label="Active Coaches"
          value={data.activeCoaches}
          icon={Users}
          color="green"
        />
        <StatCard
          label="Total Sessions"
          value={data.totalSessions}
          icon={CalendarCheck}
          color="blue"
        />
        <StatCard
          label="Platform Revenue"
          value={`$${(data.totalRevenue / 100).toLocaleString()}`}
          icon={CurrencyDollar}
          color="green"
        />
        <StatCard
          label="Avg Rating"
          value={data.avgRating.toFixed(1)}
          icon={Star}
          color="yellow"
          subtitle={`${data.totalReviews} reviews`}
        />
        <StatCard
          label="Completion Rate"
          value={`${data.completionRate}%`}
          icon={TrendUp}
          color="green"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Seekers"
          value={data.totalSeekers}
          icon={UserCirclePlus}
          color="blue"
        />
        <StatCard
          label="Active Mentors"
          value={data.totalMentors}
          icon={HandHeart}
          color="purple"
        />
        <StatCard
          label="Cancelled"
          value={data.cancelledSessions}
          icon={XCircle}
          color="red"
        />
        <StatCard
          label="No Shows"
          value={data.noShowSessions}
          icon={WarningCircle}
          color="orange"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sessions by Month */}
        <div className="bg-white rounded-xl border border-[var(--primitive-neutral-200)] p-6">
          <BarChart
            data={sessionMonthData}
            maxValue={maxSessions}
            label="Sessions per Month"
          />
        </div>

        {/* Revenue by Month */}
        <div className="bg-white rounded-xl border border-[var(--primitive-neutral-200)] p-6">
          <BarChart
            data={revenueMonthData}
            maxValue={maxRevenue}
            label="Platform Revenue per Month ($)"
          />
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white rounded-xl border border-[var(--primitive-neutral-200)] p-6">
        <BarChart
          data={ratingData.reverse()}
          maxValue={maxRating}
          label="Rating Distribution"
        />
      </div>
    </div>
  );
}
