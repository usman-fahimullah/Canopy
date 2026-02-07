"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shell/page-header";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Clock, Users, ChartLineUp, Lightning, ArrowDown } from "@phosphor-icons/react";
import { CHART_COLORS_RAW } from "@/components/ui/chart";
import {
  ResponsiveContainer,
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

/* -------------------------------------------------------------------
   Types
   ------------------------------------------------------------------- */

interface StatItem {
  label: string;
  value: string;
  description: string;
  icon: React.ElementType;
}

interface PipelineStage {
  stage: string;
  count: number;
}

interface ApplicationsOverTimePoint {
  week: string;
  count: number;
}

interface SourceItem {
  name: string;
  count: number;
  percentage: number;
}

interface TopJob {
  id: string;
  title: string;
  applications: number;
  hired: number;
}

interface AnalyticsData {
  pipeline: { stage: string; count: number }[];
  stats: {
    timeToHire: number | null;
    appsPerRole: number | null;
    offerRate: number | null;
    pipelineVelocity: number | null;
  };
  applicationsOverTime: ApplicationsOverTimePoint[];
  topJobs: TopJob[];
  sourceBreakdown: { source: string; count: number }[];
}

/* -------------------------------------------------------------------
   Helpers
   ------------------------------------------------------------------- */

function getMaxFunnelCount(pipeline: PipelineStage[]): number {
  return Math.max(...pipeline.map((s) => s.count), 1);
}

function formatWeekLabel(isoDate: string): string {
  const date = new Date(isoDate);
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  return `${month} ${day}`;
}

function getConversionRate(pipeline: PipelineStage[]): number {
  if (pipeline.length === 0) return 0;
  const applied = pipeline[0]?.count ?? 0;
  const hired = pipeline[pipeline.length - 1]?.count ?? 0;
  if (applied === 0) return 0;
  return Math.round((hired / applied) * 100);
}

/* -------------------------------------------------------------------
   Page
   ------------------------------------------------------------------- */

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/canopy/analytics");
        if (!response.ok) {
          throw new Error("Failed to fetch analytics data");
        }
        const analyticsData: AnalyticsData = await response.json();
        setData(analyticsData);
      } catch (err) {
        const message = err instanceof Error ? err.message : "An error occurred";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div>
        <PageHeader title="Analytics" />
        <div className="flex items-center justify-center px-8 py-12 lg:px-12">
          <Spinner size="lg" label="Loading analytics data..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader title="Analytics" />
        <div className="space-y-4 px-8 py-12 lg:px-12">
          <div className="rounded-[16px] border border-[var(--primitive-red-200)] bg-[var(--background-error)] p-6">
            <p className="text-body font-medium text-[var(--foreground-error)]">
              {error}
            </p>
            <Button
              variant="secondary"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!data || (data.pipeline.every((s) => s.count === 0) && data.sourceBreakdown.length === 0)) {
    return (
      <div>
        <PageHeader title="Analytics" />
        <div className="space-y-4 px-8 py-12 lg:px-12">
          <div className="rounded-[16px] border border-[var(--primitive-neutral-200)] bg-[var(--card-background)] p-6 text-center">
            <p className="text-body text-foreground-muted">No applications yet</p>
            <p className="mt-2 text-caption text-foreground-muted">
              Analytics will appear once you receive your first application.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const maxFunnel = getMaxFunnelCount(data.pipeline);
  const conversionRate = getConversionRate(data.pipeline);

  const statCards: StatItem[] = [
    {
      label: "Time to Hire",
      value: `${data.stats.timeToHire?.toFixed(0) || "—"} days`,
      description: "Average across all roles",
      icon: Clock,
    },
    {
      label: "Apps / Role",
      value: `${data.stats.appsPerRole?.toFixed(1) || "—"} avg`,
      description: "Across published roles",
      icon: Users,
    },
    {
      label: "Offer Rate",
      value: `${data.stats.offerRate?.toFixed(0) || "—"}%`,
      description: "Offers vs interviews",
      icon: ChartLineUp,
    },
    {
      label: "Pipeline Velocity",
      value: `${data.stats.pipelineVelocity?.toFixed(0) || "—"} days avg`,
      description: "Applied to decision",
      icon: Lightning,
    },
  ];

  const sourceBreakdownWithPercentage: SourceItem[] =
    data.sourceBreakdown.length > 0
      ? (() => {
          const total = data.sourceBreakdown.reduce((sum, s) => sum + s.count, 0);
          return data.sourceBreakdown.map((source) => ({
            name: source.source,
            count: source.count,
            percentage: total > 0 ? Math.round((source.count / total) * 100) : 0,
          }));
        })()
      : [];

  return (
    <div>
      <PageHeader title="Analytics" />

      <div className="space-y-8 px-8 py-6 lg:px-12">
        {/* Stat Cards */}
        <section>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col gap-3 rounded-[16px] border border-[var(--primitive-neutral-200)] bg-[var(--card-background)] px-5 py-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-caption font-medium text-foreground-muted">{stat.label}</p>
                  <div className="rounded-lg bg-[var(--primitive-blue-100)] p-1.5">
                    <stat.icon
                      size={16}
                      weight="bold"
                      className="text-[var(--primitive-blue-600)]"
                    />
                  </div>
                </div>
                <p className="text-foreground-default text-heading-sm font-semibold">
                  {stat.value}
                </p>
                <p className="text-caption-sm text-foreground-muted">{stat.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pipeline Funnel */}
        <section>
          <h2 className="text-foreground-default mb-4 text-heading-sm font-medium">
            Pipeline Funnel
          </h2>
          <div className="rounded-[16px] border border-[var(--primitive-neutral-200)] bg-[var(--card-background)] p-6">
            <div className="space-y-4">
              {data.pipeline.map((stage, idx) => {
                const widthPercent = Math.max((stage.count / maxFunnel) * 100, 8);
                const colors = [
                  "var(--primitive-blue-300)",
                  "var(--primitive-blue-400)",
                  "var(--primitive-blue-500)",
                  "var(--primitive-blue-600)",
                  "var(--primitive-blue-700)",
                ];
                const color = colors[idx % colors.length];

                return (
                  <div key={stage.stage} className="flex items-center gap-4">
                    {/* Stage Label */}
                    <div className="w-24 shrink-0 text-right">
                      <span className="text-foreground-default text-caption font-medium">
                        {stage.stage}
                      </span>
                    </div>

                    {/* Bar */}
                    <div className="relative flex-1">
                      <div
                        className="h-8 rounded-lg transition-all duration-300"
                        style={{
                          width: `${widthPercent}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>

                    {/* Count */}
                    <div className="w-12 shrink-0 text-right">
                      <span className="text-foreground-default text-caption font-semibold">
                        {stage.count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Funnel conversion */}
            <div className="mt-6 flex items-center gap-2 border-t border-[var(--primitive-neutral-200)] pt-4">
              <ArrowDown
                size={14}
                weight="bold"
                className="text-[var(--primitive-blue-600)]"
              />
              <span className="text-caption text-foreground-muted">
                Overall conversion:{" "}
                <span className="text-foreground-default font-semibold">{conversionRate}%</span>{" "}
                (Applied to Hired)
              </span>
            </div>
          </div>
        </section>

        {/* Applications Over Time */}
        {data.applicationsOverTime.length > 0 && (
          <section>
            <h2 className="text-foreground-default mb-4 text-heading-sm font-medium">
              Applications Over Time
            </h2>
            <div className="rounded-[16px] border border-[var(--primitive-neutral-200)] bg-[var(--card-background)] p-6">
              <ResponsiveContainer width="100%" height={300}>
                <RechartsAreaChart data={data.applicationsOverTime}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--primitive-neutral-200)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="week"
                    tickFormatter={formatWeekLabel}
                    tick={{ fill: "var(--foreground-muted)", fontSize: 12 }}
                    stroke="var(--primitive-neutral-200)"
                  />
                  <YAxis
                    tick={{ fill: "var(--foreground-muted)", fontSize: 12 }}
                    stroke="var(--primitive-neutral-200)"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card-background)",
                      border: "1px solid var(--primitive-neutral-200)",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "var(--foreground-default)" }}
                    formatter={(value: any) => [value, "Applications"]}
                    labelFormatter={(label: any) => `Week: ${formatWeekLabel(label)}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke={CHART_COLORS_RAW.chart1}
                    fill={CHART_COLORS_RAW.chart1}
                    fillOpacity={0.2}
                  />
                </RechartsAreaChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {/* Source Breakdown */}
        <section>
          <h2 className="text-foreground-default mb-4 text-heading-sm font-medium">
            Source Breakdown
          </h2>
          <div className="rounded-[16px] border border-[var(--primitive-neutral-200)] bg-[var(--card-background)] p-6">
            {sourceBreakdownWithPercentage.length > 0 ? (
              <>
                <div className="space-y-4">
                  {sourceBreakdownWithPercentage.map((source) => (
                    <div key={source.name} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-foreground-default text-caption font-medium">
                          {source.name}
                        </span>
                        <span className="text-caption text-foreground-muted">
                          {source.count} candidates ({source.percentage}%)
                        </span>
                      </div>
                      <div className="h-3 w-full rounded-full bg-[var(--primitive-neutral-200)]">
                        <div
                          className="h-3 rounded-full transition-all duration-300"
                          style={{
                            width: `${source.percentage}%`,
                            backgroundColor: "var(--primitive-blue-500)",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="mt-6 flex items-center justify-between border-t border-[var(--primitive-neutral-200)] pt-4">
                  <span className="text-foreground-default text-caption font-medium">Total</span>
                  <span className="text-foreground-default text-caption font-semibold">
                    {sourceBreakdownWithPercentage.reduce((sum, s) => sum + s.count, 0)} candidates
                  </span>
                </div>
              </>
            ) : (
              <p className="text-caption text-foreground-muted">No source data tracked yet</p>
            )}
          </div>
        </section>

        {/* Top Jobs */}
        {data.topJobs.length > 0 && (
          <section>
            <h2 className="text-foreground-default mb-4 text-heading-sm font-medium">
              Top Jobs
            </h2>
            <div className="rounded-[16px] border border-[var(--primitive-neutral-200)] bg-[var(--card-background)] p-6">
              <div className="space-y-3">
                {data.topJobs.map((job) => {
                  const conversionRate =
                    job.applications > 0 ? Math.round((job.hired / job.applications) * 100) : 0;
                  return (
                    <div
                      key={job.id}
                      className="flex items-center justify-between border-b border-[var(--primitive-neutral-200)] py-3 last:border-b-0"
                    >
                      <div className="flex-1">
                        <p className="text-caption font-medium text-foreground-default">
                          {job.title}
                        </p>
                        <p className="text-caption-sm text-foreground-muted">
                          {job.applications} applications
                        </p>
                      </div>
                      <div className="ml-4 flex items-center gap-6 text-right">
                        <div>
                          <p className="text-caption font-semibold text-foreground-default">
                            {job.hired}
                          </p>
                          <p className="text-caption-sm text-foreground-muted">Hired</p>
                        </div>
                        <div className="w-16">
                          <p className="text-caption font-semibold text-foreground-default">
                            {conversionRate}%
                          </p>
                          <p className="text-caption-sm text-foreground-muted">Rate</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
