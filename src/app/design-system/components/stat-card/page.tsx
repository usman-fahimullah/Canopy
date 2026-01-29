"use client";

import React from "react";
import { StatCard, StatCardGroup, MiniStat } from "@/components/ui";
import { ComponentCard, UsageGuide } from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";
import { Users, Briefcase, Calendar, ChartLineUp } from "@/components/Icons";

const statCardProps = [
  { name: "label", type: "string", required: true, description: "Stat label" },
  { name: "value", type: "string | number", required: true, description: "Main value to display" },
  { name: "trend", type: "number", default: "undefined", description: "Trend percentage (positive or negative)" },
  { name: "trendPositive", type: "boolean", default: "true", description: "Whether up trend is considered positive" },
  { name: "trendLabel", type: "string", default: '"vs last period"', description: "Trend comparison label" },
  { name: "icon", type: "ReactNode", default: "undefined", description: "Optional icon" },
  { name: "action", type: "{ label: string; onClick: () => void }", default: "undefined", description: "Action link" },
  { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Card size" },
];

const statCardGroupProps = [
  { name: "columns", type: "2 | 3 | 4", default: "4", description: "Number of columns in the grid" },
];

export default function StatCardPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Stat Card
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          StatCard displays key metrics with optional trend indicators. Ideal for
          dashboards and overview pages.
        </p>
      </div>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Simple stat card"
      >
        <CodePreview
          code={`<StatCard
  label="Total Candidates"
  value="1,234"
  trend={12}
  trendLabel="vs last month"
/>`}
        >
          <div className="max-w-xs">
            <StatCard
              label="Total Candidates"
              value="1,234"
              trend={12}
              trendLabel="vs last month"
            />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* With Icons */}
      <ComponentCard
        id="with-icons"
        title="With Icons"
        description="Stat cards with visual indicators"
      >
        <StatCardGroup columns={2}>
          <StatCard
            label="Active Candidates"
            value="847"
            trend={8}
            icon={<Users className="w-5 h-5 text-primary-600" />}
          />
          <StatCard
            label="Open Positions"
            value="24"
            trend={-2}
            trendPositive={false}
            icon={<Briefcase className="w-5 h-5 text-primary-600" />}
          />
        </StatCardGroup>
      </ComponentCard>

      {/* Trend Directions */}
      <ComponentCard
        id="trends"
        title="Trend Indicators"
        description="Positive and negative trends"
      >
        <StatCardGroup columns={3}>
          <StatCard
            label="Applications"
            value="156"
            trend={24}
            trendLabel="vs last week"
          />
          <StatCard
            label="Time to Hire"
            value="18 days"
            trend={-12}
            trendPositive={false}
            trendLabel="vs last quarter"
          />
          <StatCard
            label="Offer Rate"
            value="42%"
            trend={0}
            trendLabel="vs last month"
          />
        </StatCardGroup>
      </ComponentCard>

      {/* With Action */}
      <ComponentCard
        id="with-action"
        title="With Action"
        description="Stat card with clickable action"
      >
        <div className="max-w-xs">
          <StatCard
            label="Pending Reviews"
            value="12"
            trend={4}
            icon={<Calendar className="w-5 h-5 text-warning-500" />}
            action={{
              label: "View all",
              onClick: () => console.log("View pending reviews"),
            }}
          />
        </div>
      </ComponentCard>

      {/* Sizes */}
      <ComponentCard
        id="sizes"
        title="Sizes"
        description="Available stat card sizes"
      >
        <div className="space-y-4 max-w-md">
          <StatCard
            label="Small Card"
            value="128"
            trend={5}
            size="sm"
          />
          <StatCard
            label="Medium Card (default)"
            value="1,234"
            trend={12}
            size="md"
          />
          <StatCard
            label="Large Card"
            value="$45,678"
            trend={8}
            size="lg"
            icon={<ChartLineUp className="w-6 h-6 text-primary-600" />}
          />
        </div>
      </ComponentCard>

      {/* Dashboard Example */}
      <ComponentCard
        id="dashboard"
        title="Dashboard Example"
        description="Real-world stat card layout"
      >
        <StatCardGroup columns={4}>
          <StatCard
            label="Active Jobs"
            value="12"
            trend={2}
            trendLabel="new this week"
            icon={<Briefcase className="w-5 h-5 text-primary-600" />}
          />
          <StatCard
            label="Total Candidates"
            value="2,847"
            trend={15}
            trendLabel="vs last month"
            icon={<Users className="w-5 h-5 text-primary-600" />}
          />
          <StatCard
            label="Interviews Scheduled"
            value="28"
            trend={-3}
            trendLabel="vs last week"
            icon={<Calendar className="w-5 h-5 text-primary-600" />}
          />
          <StatCard
            label="Offers Sent"
            value="8"
            trend={60}
            trendLabel="vs last month"
            icon={<ChartLineUp className="w-5 h-5 text-semantic-success" />}
          />
        </StatCardGroup>
      </ComponentCard>

      {/* Mini Stats */}
      <ComponentCard
        id="mini-stats"
        title="Mini Stats"
        description="Compact inline statistics"
      >
        <div className="flex flex-wrap gap-8 p-4 border border-border rounded-lg">
          <MiniStat label="Views" value="1.2K" trend={5} />
          <MiniStat label="Applications" value="47" trend={12} />
          <MiniStat label="Conversion" value="3.9%" trend={-2} />
        </div>
      </ComponentCard>

      {/* Props - StatCard */}
      <ComponentCard id="props-card" title="StatCard Props">
        <PropsTable props={statCardProps} />
      </ComponentCard>

      {/* Props - StatCardGroup */}
      <ComponentCard id="props-group" title="StatCardGroup Props">
        <PropsTable props={statCardGroupProps} />
      </ComponentCard>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Use for key metrics on dashboards",
          "Include trend indicators for context",
          "Group related stats together",
          "Use icons to aid quick recognition",
        ]}
        donts={[
          "Don't display too many stats at once",
          "Don't use for non-numeric data",
          "Don't hide critical metrics below the fold",
          "Don't use inconsistent trend periods",
        ]}
      />

      <PageNavigation currentPath="/design-system/components/stat-card" />
    </div>
  );
}
