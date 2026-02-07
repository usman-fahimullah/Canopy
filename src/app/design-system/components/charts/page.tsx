"use client";

import React from "react";
import {
  // UI components
  Label,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
// Chart components imported directly to avoid pulling Recharts into barrel bundle
import {
  PipelineFunnel,
  StageDistribution,
  ScoreDistribution,
  TrendChart,
  SourceEffectiveness,
  ComparisonChart,
  MetricSparkline,
  chartColors,
  type PipelineStage,
  type StageData,
  type ScoreRange,
  type TrendDataPoint,
  type SourceData,
  type ComparisonSeries,
} from "@/components/ui/charts";
import { ChartCard } from "@/components/ui/chart";
import {
  ComponentCard,
  UsageGuide,
  AccessibilityInfo,
  ComponentAnatomy,
  RelatedComponents,
  RealWorldExample,
} from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";
import { ChartBar, TrendUp, TrendDown, Users, Briefcase } from "@phosphor-icons/react";

// ============================================
// SAMPLE DATA
// ============================================

// PipelineStage uses 'value' and 'fill' properties
const pipelineData: PipelineStage[] = [
  { name: "Applied", value: 248, fill: chartColors.pipeline[0] },
  { name: "Screening", value: 142, fill: chartColors.pipeline[1] },
  { name: "Interview", value: 68, fill: chartColors.pipeline[2] },
  { name: "Offer", value: 24, fill: chartColors.pipeline[3] },
  { name: "Hired", value: 12, fill: chartColors.pipeline[4] },
];

// StageData uses 'value' and 'color' properties
const stageDistributionData: StageData[] = [
  { name: "Applied", value: 45, color: chartColors.pipeline[0] },
  { name: "Screening", value: 25, color: chartColors.pipeline[1] },
  { name: "Interview", value: 18, color: chartColors.pipeline[2] },
  { name: "Offer", value: 8, color: chartColors.pipeline[3] },
  { name: "Hired", value: 4, color: chartColors.pipeline[4] },
];

// ScoreRange uses 'range', 'count', and 'color'
const scoreDistributionData: ScoreRange[] = [
  { range: "0-20", count: 12, color: chartColors.score.poor },
  { range: "21-40", count: 28, color: chartColors.score.poor },
  { range: "41-60", count: 45, color: chartColors.score.average },
  { range: "61-80", count: 38, color: chartColors.score.good },
  { range: "81-100", count: 19, color: chartColors.score.excellent },
];

// TrendDataPoint uses 'date' and 'value'
const trendData: TrendDataPoint[] = [
  { date: "Jan", value: 45 },
  { date: "Feb", value: 52 },
  { date: "Mar", value: 48 },
  { date: "Apr", value: 61 },
  { date: "May", value: 55 },
  { date: "Jun", value: 67 },
  { date: "Jul", value: 72 },
];

// SourceData uses 'source', 'applications', and optional 'hires'
const sourceData: SourceData[] = [
  { source: "Green Jobs Board", applications: 120, hires: 8 },
  { source: "LinkedIn", applications: 85, hires: 4 },
  { source: "Indeed", applications: 65, hires: 2 },
  { source: "Referrals", applications: 28, hires: 5 },
  { source: "Career Page", applications: 42, hires: 3 },
];

// ComparisonSeries uses 'dataKey', 'name', and 'color'
const comparisonSeries: ComparisonSeries[] = [
  { dataKey: "thisMonth", name: "This Month", color: chartColors.primary.main },
  { dataKey: "lastMonth", name: "Last Month", color: chartColors.neutral[400] },
];

// Comparison data needs to match TrendDataPoint structure with extra keys
const comparisonData: TrendDataPoint[] = [
  { date: "Applied", value: 120, thisMonth: 120, lastMonth: 98 },
  { date: "Screened", value: 85, thisMonth: 85, lastMonth: 72 },
  { date: "Interviewed", value: 42, thisMonth: 42, lastMonth: 38 },
  { date: "Offered", value: 15, thisMonth: 15, lastMonth: 12 },
  { date: "Hired", value: 8, thisMonth: 8, lastMonth: 6 },
];

const sparklineData = [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 45];

// ============================================
// PROPS DEFINITIONS
// ============================================

const chartCardProps = [
  {
    name: "children",
    type: "ReactNode",
    required: true,
    description: "Chart content to render inside the card.",
  },
  {
    name: "title",
    type: "string",
    description: "Optional chart title displayed above the chart.",
  },
  {
    name: "description",
    type: "string",
    description: "Optional description text below the title.",
  },
  {
    name: "actions",
    type: "ReactNode",
    description: "Optional action buttons displayed in the header.",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes.",
  },
];

const pipelineFunnelProps = [
  {
    name: "data",
    type: "PipelineStage[]",
    description: "Array of pipeline stages with name, value, and optional fill color.",
  },
  {
    name: "title",
    type: "string",
    default: '"Pipeline Funnel"',
    description: "Title displayed above the chart.",
  },
  {
    name: "description",
    type: "string",
    description: "Optional description text below the title.",
  },
  {
    name: "height",
    type: "number",
    default: "300",
    description: "Height of the chart in pixels.",
  },
  {
    name: "showLabels",
    type: "boolean",
    default: "true",
    description: "Show stage name labels.",
  },
  {
    name: "showPercentage",
    type: "boolean",
    default: "true",
    description: "Show percentage values in tooltips.",
  },
];

const stageDistributionProps = [
  {
    name: "data",
    type: "StageData[]",
    description: "Array of stages with name, value, and optional color.",
  },
  {
    name: "title",
    type: "string",
    default: '"Stage Distribution"',
    description: "Title displayed above the chart.",
  },
  {
    name: "description",
    type: "string",
    description: "Optional description text below the title.",
  },
  {
    name: "height",
    type: "number",
    default: "300",
    description: "Height of the chart in pixels.",
  },
  {
    name: "innerRadius",
    type: "number",
    default: "60",
    description: "Inner radius of the donut chart.",
  },
  {
    name: "outerRadius",
    type: "number",
    default: "100",
    description: "Outer radius of the donut chart.",
  },
  {
    name: "showLegend",
    type: "boolean",
    default: "true",
    description: "Display legend next to the chart.",
  },
  {
    name: "centerLabel",
    type: "string",
    description: "Label text displayed in the center of the donut.",
  },
  {
    name: "centerValue",
    type: "string | number",
    description: "Value displayed in the center of the donut.",
  },
];

const scoreDistributionProps = [
  {
    name: "data",
    type: "ScoreRange[]",
    description: "Array of score ranges with range label, count, and optional color.",
  },
  {
    name: "title",
    type: "string",
    default: '"Score Distribution"',
    description: "Title displayed above the chart.",
  },
  {
    name: "description",
    type: "string",
    description: "Optional description text below the title.",
  },
  {
    name: "height",
    type: "number",
    default: "300",
    description: "Height of the chart in pixels.",
  },
  {
    name: "barRadius",
    type: "number",
    default: "4",
    description: "Border radius for bar tops.",
  },
];

const trendChartProps = [
  {
    name: "data",
    type: "TrendDataPoint[]",
    description: "Array of data points with date and value.",
  },
  {
    name: "title",
    type: "string",
    default: '"Trend"',
    description: "Title displayed above the chart.",
  },
  {
    name: "description",
    type: "string",
    description: "Optional description text below the title.",
  },
  {
    name: "height",
    type: "number",
    default: "300",
    description: "Height of the chart in pixels.",
  },
  {
    name: "dataKey",
    type: "string",
    default: '"value"',
    description: "Key in data to use for Y-axis values.",
  },
  {
    name: "color",
    type: "string",
    default: "chartColors.primary.main",
    description: "Color for the line/area.",
  },
  {
    name: "showArea",
    type: "boolean",
    default: "true",
    description: "Fill area under the line.",
  },
  {
    name: "showGrid",
    type: "boolean",
    default: "true",
    description: "Display background grid lines.",
  },
  {
    name: "yAxisLabel",
    type: "string",
    description: "Label for the Y-axis.",
  },
  {
    name: "dateFormatter",
    type: "(date: string | number) => string",
    description: "Custom function to format date labels.",
  },
];

const sourceEffectivenessProps = [
  {
    name: "data",
    type: "SourceData[]",
    description: "Array of sources with source name, applications, and optional hires.",
  },
  {
    name: "title",
    type: "string",
    default: '"Source Effectiveness"',
    description: "Title displayed above the chart.",
  },
  {
    name: "description",
    type: "string",
    description: "Optional description text below the title.",
  },
  {
    name: "height",
    type: "number",
    default: "300",
    description: "Height of the chart in pixels.",
  },
  {
    name: "showHires",
    type: "boolean",
    default: "true",
    description: "Show hires bar alongside applications.",
  },
  {
    name: "layout",
    type: '"horizontal" | "vertical"',
    default: '"horizontal"',
    description: "Layout direction of the bars.",
  },
];

const comparisonChartProps = [
  {
    name: "data",
    type: "TrendDataPoint[]",
    description: "Array of data points with date/label and values for each series.",
  },
  {
    name: "series",
    type: "ComparisonSeries[]",
    description: "Array of series definitions with dataKey, name, and color.",
  },
  {
    name: "title",
    type: "string",
    default: '"Comparison"',
    description: "Title displayed above the chart.",
  },
  {
    name: "description",
    type: "string",
    description: "Optional description text below the title.",
  },
  {
    name: "height",
    type: "number",
    default: "300",
    description: "Height of the chart in pixels.",
  },
  {
    name: "showGrid",
    type: "boolean",
    default: "true",
    description: "Display background grid lines.",
  },
  {
    name: "dateFormatter",
    type: "(date: string | number) => string",
    description: "Custom function to format date/category labels.",
  },
];

const metricSparklineProps = [
  {
    name: "title",
    type: "string",
    required: true,
    description: "Metric label text.",
  },
  {
    name: "value",
    type: "string | number",
    required: true,
    description: "Current value to display.",
  },
  {
    name: "change",
    type: "number",
    description: "Percentage change value (positive/negative).",
  },
  {
    name: "changeLabel",
    type: "string",
    default: '"vs last period"',
    description: "Label for the change indicator.",
  },
  {
    name: "data",
    type: "number[]",
    required: true,
    description: "Array of numeric values to plot.",
  },
  {
    name: "color",
    type: "string",
    default: "chartColors.primary.main",
    description: "Color for the sparkline.",
  },
];

// ============================================
// PAGE COMPONENT
// ============================================

export default function ChartsPage() {
  const [selectedStage, setSelectedStage] = React.useState<string | null>(null);

  return (
    <div className="space-y-12">
      {/* ============================================ */}
      {/* 1. OVERVIEW */}
      {/* ============================================ */}
      <div id="overview">
        <h1 className="mb-2 text-heading-lg text-foreground">Charts</h1>
        <p className="max-w-3xl text-body text-foreground-muted">
          Charts provide visual representations of hiring analytics and metrics. Built specifically
          for ATS dashboards, these components help recruiters and hiring managers understand
          pipeline health, candidate flow, and source effectiveness at a glance.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-background-brand-subtle px-3 py-1 text-caption font-medium text-foreground-brand">
            Analytics
          </span>
          <span className="rounded-full bg-background-subtle px-3 py-1 text-caption text-foreground-muted">
            7 Chart Types
          </span>
          <span className="rounded-full bg-background-subtle px-3 py-1 text-caption text-foreground-muted">
            Responsive
          </span>
        </div>

        {/* When to Use / When Not to Use */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border-success bg-background-success p-4">
            <h3 className="mb-2 font-semibold text-foreground-success">When to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>* Pipeline funnel visualization</li>
              <li>* Hiring trends over time</li>
              <li>* Source effectiveness comparison</li>
              <li>* Candidate score distributions</li>
              <li>* Dashboard metric cards with sparklines</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border-error bg-background-error p-4">
            <h3 className="mb-2 font-semibold text-foreground-error">When not to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>* Simple counts (use StatCard instead)</li>
              <li>* Real-time data that changes rapidly</li>
              <li>* Data tables with precise values</li>
              <li>* Mobile-first interfaces (simplify to cards)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* 2. ANATOMY */}
      {/* ============================================ */}
      <ComponentAnatomy
        parts={[
          {
            name: "Chart Container",
            description: "Wrapper that provides consistent styling, title, loading/empty states.",
            required: true,
          },
          {
            name: "Chart Title",
            description: "Descriptive heading that explains what the chart shows.",
          },
          {
            name: "Legend",
            description: "Color-coded key explaining different data series or categories.",
          },
          {
            name: "Axis Labels",
            description: "Labels for X and Y axes providing context for values.",
          },
          {
            name: "Data Elements",
            description: "Bars, lines, areas, or segments representing the data.",
            required: true,
          },
          {
            name: "Tooltip",
            description: "Hover-activated popup showing precise values.",
          },
          {
            name: "Grid Lines",
            description: "Background lines that help read values accurately.",
          },
          {
            name: "Trend Indicator",
            description: "Arrow or badge showing direction of change.",
          },
        ]}
      />

      {/* ============================================ */}
      {/* 3. PIPELINE FUNNEL */}
      {/* ============================================ */}
      <ComponentCard
        id="pipeline-funnel"
        title="Pipeline Funnel"
        description="Visualize candidate flow through hiring stages"
      >
        <CodePreview
          code={`import { PipelineFunnel, chartColors } from "@/components/ui";

const data = [
  { name: "Applied", value: 248, fill: chartColors.pipeline[0] },
  { name: "Screening", value: 142, fill: chartColors.pipeline[1] },
  { name: "Interview", value: 68, fill: chartColors.pipeline[2] },
  { name: "Offer", value: 24, fill: chartColors.pipeline[3] },
  { name: "Hired", value: 12, fill: chartColors.pipeline[4] },
];

<PipelineFunnel
  data={data}
  title="Pipeline Overview"
  showPercentage
/>`}
        >
          <div className="max-w-3xl">
            <PipelineFunnel data={pipelineData} title="Pipeline Overview" showPercentage />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 4. STAGE DISTRIBUTION */}
      {/* ============================================ */}
      <ComponentCard
        id="stage-distribution"
        title="Stage Distribution"
        description="Show candidate distribution across pipeline stages as percentages"
      >
        <CodePreview
          code={`import { StageDistribution, chartColors } from "@/components/ui";

const data = [
  { name: "Applied", value: 45, color: chartColors.pipeline[0] },
  { name: "Screening", value: 25, color: chartColors.pipeline[1] },
  { name: "Interview", value: 18, color: chartColors.pipeline[2] },
  { name: "Offer", value: 8, color: chartColors.pipeline[3] },
  { name: "Hired", value: 4, color: chartColors.pipeline[4] },
];

<StageDistribution
  data={data}
  title="Current Distribution"
  showLegend
  centerLabel="Total"
  centerValue="482"
/>`}
        >
          <div className="max-w-md">
            <StageDistribution
              data={stageDistributionData}
              title="Current Distribution"
              showLegend
              centerLabel="Total"
              centerValue="482"
            />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 5. SCORE DISTRIBUTION */}
      {/* ============================================ */}
      <ComponentCard
        id="score-distribution"
        title="Score Distribution"
        description="Display AI match score distribution across candidates"
      >
        <CodePreview
          code={`import { ScoreDistribution, chartColors } from "@/components/ui";

const data = [
  { range: "0-20", count: 12, color: chartColors.score.poor },
  { range: "21-40", count: 28, color: chartColors.score.poor },
  { range: "41-60", count: 45, color: chartColors.score.average },
  { range: "61-80", count: 38, color: chartColors.score.good },
  { range: "81-100", count: 19, color: chartColors.score.excellent },
];

<ScoreDistribution
  data={data}
  title="AI Match Score Distribution"
/>`}
        >
          <div className="max-w-xl">
            <ScoreDistribution data={scoreDistributionData} title="AI Match Score Distribution" />
            <p className="mt-4 text-caption text-foreground-muted">
              Colors indicate score quality: red (poor), yellow (average), green (good/excellent).
            </p>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 6. TREND CHART */}
      {/* ============================================ */}
      <ComponentCard
        id="trend-chart"
        title="Trend Chart"
        description="Track metrics over time with area or line variants"
      >
        <CodePreview
          code={`import { TrendChart, chartColors } from "@/components/ui";

const data = [
  { date: "Jan", value: 45 },
  { date: "Feb", value: 52 },
  { date: "Mar", value: 48 },
  { date: "Apr", value: 61 },
  { date: "May", value: 55 },
  { date: "Jun", value: 67 },
  { date: "Jul", value: 72 },
];

<TrendChart
  data={data}
  title="Applications Over Time"
  color={chartColors.primary.main}
  showArea
  yAxisLabel="Applications"
/>`}
        >
          <div className="space-y-8">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-3">
                <Label>Area Chart (default)</Label>
                <TrendChart
                  data={trendData}
                  title="Applications Trend"
                  color={chartColors.primary.main}
                  showArea
                  yAxisLabel="Applications"
                />
              </div>
              <div className="space-y-3">
                <Label>Line Chart</Label>
                <TrendChart
                  data={trendData}
                  title="Hires Trend"
                  color={chartColors.secondary.blue}
                  showArea={false}
                  yAxisLabel="Hires"
                />
              </div>
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 7. SOURCE EFFECTIVENESS */}
      {/* ============================================ */}
      <ComponentCard
        id="source-effectiveness"
        title="Source Effectiveness"
        description="Compare hiring source performance"
      >
        <CodePreview
          code={`import { SourceEffectiveness } from "@/components/ui";

const data = [
  { source: "Green Jobs Board", applications: 120, hires: 8 },
  { source: "LinkedIn", applications: 85, hires: 4 },
  { source: "Referrals", applications: 28, hires: 5 },
];

<SourceEffectiveness
  data={data}
  title="Source Performance"
  showHires
/>`}
        >
          <div className="max-w-2xl">
            <SourceEffectiveness data={sourceData} title="Source Performance" showHires />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 8. COMPARISON CHART */}
      {/* ============================================ */}
      <ComponentCard
        id="comparison-chart"
        title="Comparison Chart"
        description="Compare multiple data series side by side"
      >
        <CodePreview
          code={`import { ComparisonChart, chartColors } from "@/components/ui";

// Define the series to compare
const series = [
  { dataKey: "thisMonth", name: "This Month", color: chartColors.primary.main },
  { dataKey: "lastMonth", name: "Last Month", color: chartColors.neutral[400] },
];

// Data points with values for each series
const data = [
  { date: "Applied", value: 120, thisMonth: 120, lastMonth: 98 },
  { date: "Screened", value: 85, thisMonth: 85, lastMonth: 72 },
  { date: "Interviewed", value: 42, thisMonth: 42, lastMonth: 38 },
  { date: "Offered", value: 15, thisMonth: 15, lastMonth: 12 },
  { date: "Hired", value: 8, thisMonth: 8, lastMonth: 6 },
];

<ComparisonChart
  data={data}
  series={series}
  title="Month-over-Month Comparison"
/>`}
        >
          <div className="max-w-2xl">
            <ComparisonChart
              data={comparisonData}
              series={comparisonSeries}
              title="Month-over-Month Comparison"
            />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 9. METRIC SPARKLINE */}
      {/* ============================================ */}
      <ComponentCard
        id="metric-sparkline"
        title="Metric Sparkline"
        description="Compact inline charts for dashboard metric cards"
      >
        <CodePreview
          code={`import { MetricSparkline, chartColors } from "@/components/ui";

<MetricSparkline
  title="Applications"
  value={248}
  change={12}
  changeLabel="vs last month"
  data={[12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 45]}
  color={chartColors.primary.main}
/>`}
        >
          <div className="grid gap-4 md:grid-cols-3">
            <MetricSparkline
              title="Applications"
              value={248}
              change={12}
              changeLabel="vs last month"
              data={sparklineData}
              color={chartColors.primary.main}
            />
            <MetricSparkline
              title="Time to Hire"
              value="18 days"
              change={-14}
              changeLabel="vs last month"
              data={[25, 22, 20, 23, 19, 21, 18, 17, 19, 18, 16, 18]}
              color={chartColors.secondary.blue}
            />
            <MetricSparkline
              title="Open Positions"
              value={12}
              change={20}
              changeLabel="vs last month"
              data={[8, 10, 9, 11, 12, 10, 13, 11, 14, 12, 11, 12]}
              color={chartColors.secondary.purple}
            />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 10. CHART CONTAINER */}
      {/* ============================================ */}
      <ComponentCard
        id="chart-container"
        title="Chart Card"
        description="Wrapper component for consistent chart presentation with title and description"
      >
        <CodePreview
          code={`import { ChartCard } from "@/components/ui";

<ChartCard
  title="Pipeline Overview"
  description="Current candidate distribution"
>
  {/* Your chart content here */}
</ChartCard>`}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <ChartCard title="Pipeline Overview" description="Current candidate distribution">
              <StageDistribution data={stageDistributionData} showLegend={false} />
            </ChartCard>
            <ChartCard title="Applications Trend" description="Last 7 months">
              <TrendChart data={trendData} color={chartColors.primary.main} showArea />
            </ChartCard>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 11. COLOR TOKENS */}
      {/* ============================================ */}
      <ComponentCard
        id="colors"
        title="Chart Color Tokens"
        description="Consistent colors for data visualization"
      >
        <div className="space-y-6">
          <div>
            <h4 className="mb-3 text-body-strong">Primary Colors</h4>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {Object.entries(chartColors.primary).map(([name, color]) => (
                <div key={name} className="flex items-center gap-3">
                  <div
                    className="h-8 w-8 rounded-md border border-border-muted"
                    style={{ backgroundColor: color }}
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">{name}</p>
                    <p className="text-caption text-foreground-muted">{color}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-body-strong">Secondary Colors</h4>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {Object.entries(chartColors.secondary).map(([name, color]) => (
                <div key={name} className="flex items-center gap-3">
                  <div
                    className="h-8 w-8 rounded-md border border-border-muted"
                    style={{ backgroundColor: color }}
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">{name}</p>
                    <p className="text-caption text-foreground-muted">{color}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-body-strong">Pipeline Stage Colors</h4>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              {chartColors.pipeline.map((color, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className="h-8 w-8 rounded-md border border-border-muted"
                    style={{ backgroundColor: color }}
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">Stage {index + 1}</p>
                    <p className="text-caption text-foreground-muted">{color}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-body-strong">Score Colors</h4>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {Object.entries(chartColors.score).map(([name, color]) => (
                <div key={name} className="flex items-center gap-3">
                  <div
                    className="h-8 w-8 rounded-md border border-border-muted"
                    style={{ backgroundColor: color }}
                  />
                  <div>
                    <p className="text-sm font-medium capitalize text-foreground">{name}</p>
                    <p className="text-caption text-foreground-muted">{color}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-4 text-caption text-foreground-muted">
          Import from <code className="rounded bg-background-muted px-1">chartColors</code> for
          consistent coloring across charts.
        </p>
      </ComponentCard>

      {/* ============================================ */}
      {/* 12. PROPS TABLE */}
      {/* ============================================ */}
      <ComponentCard id="props" title="Props Reference">
        <div className="space-y-8">
          <div>
            <h4 className="mb-4 text-body-strong">ChartCard Props</h4>
            <PropsTable props={chartCardProps} />
          </div>
          <div>
            <h4 className="mb-4 text-body-strong">PipelineFunnel Props</h4>
            <PropsTable props={pipelineFunnelProps} />
          </div>
          <div>
            <h4 className="mb-4 text-body-strong">StageDistribution Props</h4>
            <PropsTable props={stageDistributionProps} />
          </div>
          <div>
            <h4 className="mb-4 text-body-strong">ScoreDistribution Props</h4>
            <PropsTable props={scoreDistributionProps} />
          </div>
          <div>
            <h4 className="mb-4 text-body-strong">TrendChart Props</h4>
            <PropsTable props={trendChartProps} />
          </div>
          <div>
            <h4 className="mb-4 text-body-strong">SourceEffectiveness Props</h4>
            <PropsTable props={sourceEffectivenessProps} />
          </div>
          <div>
            <h4 className="mb-4 text-body-strong">ComparisonChart Props</h4>
            <PropsTable props={comparisonChartProps} />
          </div>
          <div>
            <h4 className="mb-4 text-body-strong">MetricSparkline Props</h4>
            <PropsTable props={metricSparklineProps} />
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 13. USAGE GUIDELINES */}
      {/* ============================================ */}
      <div id="guidelines">
        <h2 className="mb-4 text-heading-sm text-foreground">Usage Guidelines</h2>
        <UsageGuide
          dos={[
            "Use PipelineFunnel for recruiting pipeline visualization",
            "Use consistent colors from chartColors for brand coherence",
            "Use ChartCard for consistent chart presentation with title and description",
            "Use sparklines for compact dashboard metrics",
            "Show trends with TrendChart for time-series data",
            "Compare periods with ComparisonChart for month-over-month analysis",
            "Use tooltips for precise values on hover",
          ]}
          donts={[
            "Don't use 3D effects or excessive animations",
            "Don't show too many data points (simplify or aggregate)",
            "Don't use rainbow colors - stick to chartColors palette",
            "Don't omit axis labels or legends when needed",
            "Don't use pie charts for more than 5-6 categories",
            "Don't forget empty and loading states",
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 14. ACCESSIBILITY */}
      {/* ============================================ */}
      <div id="accessibility">
        <AccessibilityInfo
          items={[
            "**Color contrast**: Chart colors meet WCAG AA standards for visual distinction",
            "**Screen readers**: Charts include sr-only text summaries of data",
            "**Keyboard navigation**: Interactive elements are focusable with clear focus states",
            "**Tooltips**: Hover information is also accessible via keyboard focus",
            "**Reduced motion**: Animations respect prefers-reduced-motion setting",
            "**Data tables**: For complex data, provide accessible data table alternative",
            "**ARIA labels**: Charts have proper role and aria-label attributes",
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 15. RELATED COMPONENTS */}
      {/* ============================================ */}
      <div id="related">
        <RelatedComponents
          components={[
            {
              name: "Stat Card",
              href: "/design-system/components/stat-card",
              description: "For single metric display with trends",
            },
            {
              name: "Progress",
              href: "/design-system/components/progress",
              description: "For simple progress indicators",
            },
            {
              name: "Badge",
              href: "/design-system/components/badge",
              description: "For trend indicators and labels",
            },
            {
              name: "Data Table",
              href: "/design-system/components/data-table",
              description: "For detailed data with sorting",
            },
            {
              name: "Card",
              href: "/design-system/components/card",
              description: "For containing dashboard widgets",
            },
            {
              name: "Skeleton",
              href: "/design-system/components/skeleton",
              description: "For loading states",
            },
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 16. REAL-WORLD EXAMPLES */}
      {/* ============================================ */}
      <div id="examples" className="space-y-6">
        <h2 className="text-heading-sm text-foreground">Real-World Examples</h2>

        <RealWorldExample
          title="Hiring Dashboard Overview"
          description="Complete dashboard with multiple chart types"
        >
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <MetricSparkline
                title="Total Applications"
                value="1,284"
                data={sparklineData}
                color={chartColors.primary.main}
                change={12.5}
              />
              <MetricSparkline
                title="Open Positions"
                value={8}
                data={[5, 6, 7, 6, 8, 7, 9, 8]}
                color={chartColors.secondary.blue}
                change={14.3}
              />
              <MetricSparkline
                title="Avg. Match Score"
                value="72%"
                data={[65, 68, 70, 69, 71, 73, 72]}
                color={chartColors.primary.light}
                change={3.2}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <PipelineFunnel
                data={pipelineData}
                title="Pipeline Health"
                showPercentage
                height={250}
              />
              <TrendChart
                data={trendData}
                title="Applications Trend"
                color={chartColors.primary.main}
                showArea
                height={250}
              />
            </div>
          </div>
        </RealWorldExample>

        <RealWorldExample
          title="Source Analysis Dashboard"
          description="Detailed view of hiring source effectiveness"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <SourceEffectiveness
              data={sourceData}
              title="Source Effectiveness"
              showHires
              height={300}
            />
            <ComparisonChart
              data={comparisonData}
              series={comparisonSeries}
              title="Month-over-Month Comparison"
              height={300}
            />
          </div>
        </RealWorldExample>

        <RealWorldExample
          title="Candidate Score Analysis"
          description="Understanding AI match score distribution"
        >
          <div className="space-y-4">
            <ScoreDistribution data={scoreDistributionData} title="AI Match Score Distribution" />
            <div className="rounded-lg bg-background-subtle p-4">
              <p className="text-caption text-foreground-muted">
                <strong>Insight:</strong> 19 candidates (13%) have excellent match scores (81-100%).
                Consider prioritizing these for immediate screening.
              </p>
            </div>
          </div>
        </RealWorldExample>
      </div>

      {/* Page Navigation */}
      <PageNavigation currentPath="/design-system/components/charts" />
    </div>
  );
}
