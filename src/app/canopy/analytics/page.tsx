"use client";

import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/shell/page-header";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ChartLineUp, Lightning, ArrowDown } from "@phosphor-icons/react";

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
  name: string;
  count: number;
  color: string;
}

interface SourceItem {
  name: string;
  count: number;
  percentage: number;
}

/* -------------------------------------------------------------------
   Mock Data
   ------------------------------------------------------------------- */

const STAT_CARDS: StatItem[] = [
  {
    label: "Time to Fill",
    value: "14 days",
    description: "Average across all roles",
    icon: Clock,
  },
  {
    label: "Applications / Role",
    value: "8.5 avg",
    description: "Last 30 days",
    icon: Users,
  },
  {
    label: "Offer Rate",
    value: "25%",
    description: "Offers made vs. interviews",
    icon: ChartLineUp,
  },
  {
    label: "Pipeline Velocity",
    value: "12 days avg",
    description: "Applied to decision",
    icon: Lightning,
  },
];

const PIPELINE_FUNNEL: PipelineStage[] = [
  {
    name: "Applied",
    count: 48,
    color: "var(--primitive-blue-300)",
  },
  {
    name: "Screening",
    count: 32,
    color: "var(--primitive-blue-400)",
  },
  {
    name: "Interview",
    count: 18,
    color: "var(--primitive-blue-500)",
  },
  {
    name: "Offer",
    count: 8,
    color: "var(--primitive-blue-600)",
  },
  {
    name: "Hired",
    count: 5,
    color: "var(--primitive-blue-700)",
  },
];

const SOURCE_BREAKDOWN: SourceItem[] = [
  { name: "Green Jobs Board", count: 22, percentage: 46 },
  { name: "LinkedIn", count: 12, percentage: 25 },
  { name: "Referral", count: 9, percentage: 19 },
  { name: "Direct", count: 5, percentage: 10 },
];

/* -------------------------------------------------------------------
   Helpers
   ------------------------------------------------------------------- */

function getMaxFunnelCount() {
  return Math.max(...PIPELINE_FUNNEL.map((s) => s.count), 1);
}

/* -------------------------------------------------------------------
   Page
   ------------------------------------------------------------------- */

export default function AnalyticsPage() {
  const maxFunnel = getMaxFunnelCount();

  return (
    <div>
      <PageHeader title="Analytics" />

      <div className="space-y-8 px-8 py-6 lg:px-12">
        {/* Stat Cards */}
        <section>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {STAT_CARDS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col gap-3 rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white px-5 py-5"
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
          <div className="rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white p-6">
            <div className="space-y-4">
              {PIPELINE_FUNNEL.map((stage, idx) => {
                const widthPercent = Math.max((stage.count / maxFunnel) * 100, 8);

                return (
                  <div key={stage.name} className="flex items-center gap-4">
                    {/* Stage Label */}
                    <div className="w-24 shrink-0 text-right">
                      <span className="text-foreground-default text-caption font-medium">
                        {stage.name}
                      </span>
                    </div>

                    {/* Bar */}
                    <div className="relative flex-1">
                      <div
                        className="h-8 rounded-lg transition-all duration-300"
                        style={{
                          width: `${widthPercent}%`,
                          backgroundColor: stage.color,
                        }}
                      />
                    </div>

                    {/* Count */}
                    <div className="w-12 shrink-0 text-right">
                      <span className="text-foreground-default text-caption font-semibold">
                        {stage.count}
                      </span>
                    </div>

                    {/* Arrow between stages */}
                    {idx < PIPELINE_FUNNEL.length - 1 && (
                      <div className="absolute right-0">
                        {/* Arrow rendered between items via spacing */}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Funnel conversion */}
            <div className="mt-6 flex items-center gap-2 border-t border-[var(--primitive-neutral-200)] pt-4">
              <ArrowDown size={14} weight="bold" className="text-[var(--primitive-blue-600)]" />
              <span className="text-caption text-foreground-muted">
                Overall conversion:{" "}
                <span className="text-foreground-default font-semibold">
                  {PIPELINE_FUNNEL.length > 0
                    ? Math.round(
                        (PIPELINE_FUNNEL[PIPELINE_FUNNEL.length - 1].count /
                          PIPELINE_FUNNEL[0].count) *
                          100
                      )
                    : 0}
                  %
                </span>{" "}
                (Applied to Hired)
              </span>
            </div>
          </div>
        </section>

        {/* Source Breakdown */}
        <section>
          <h2 className="text-foreground-default mb-4 text-heading-sm font-medium">
            Source Breakdown
          </h2>
          <div className="rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white p-6">
            <div className="space-y-4">
              {SOURCE_BREAKDOWN.map((source) => (
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
                {SOURCE_BREAKDOWN.reduce((sum, s) => sum + s.count, 0)} candidates
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
