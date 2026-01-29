"use client";

import * as React from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  FunnelChart,
  Funnel,
  LabelList,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { cn } from "@/lib/utils";

// Hook to detect dark mode for chart theming
const useDarkMode = () => {
  const [isDark, setIsDark] = React.useState(false);
  React.useEffect(() => {
    const checkDark = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return isDark;
};

// Get theme-aware colors for axes, grids, and labels
const getThemeColors = (isDark: boolean) => ({
  text: isDark ? "#A39D96" : "#7A7671",
  grid: isDark ? "#2D3532" : "#E5DFD8",
  label: isDark ? "#A39D96" : "#3D3A37",
});

/**
 * Chart Components for ATS Analytics
 *
 * Built on Recharts with Trails Design System styling.
 * Includes pipeline funnels, stage distributions, score histograms, and trend charts.
 */

// ============================================
// Chart Color Palette (from Trails Design System)
// Uses CSS variables for dark mode support
// ============================================

// Helper to get CSS variable value (for use in charts that don't support CSS vars directly)
const getCSSVar = (varName: string, fallback: string): string => {
  if (typeof window !== 'undefined') {
    const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    return value || fallback;
  }
  return fallback;
};

export const chartColors = {
  primary: {
    main: "#3BA36F",     // --primitive-green-600
    light: "#5ECC70",    // --primitive-green-500
    lighter: "#8EE07E",  // --primitive-green-400
    lightest: "#BCEBB2", // --primitive-green-300
  },
  secondary: {
    blue: "#3369FF",     // --primitive-blue-500
    purple: "#9C59FF",   // --primitive-purple-500
    orange: "#F5580A",   // --primitive-orange-500
    yellow: "#E5B225",   // --primitive-yellow-500
  },
  semantic: {
    success: "#5ECC70",  // --primitive-green-500
    warning: "#E5B225",  // --primitive-yellow-500
    error: "#FF5C5C",    // --primitive-red-500
    info: "#3369FF",     // --primitive-blue-500
  },
  neutral: {
    100: "#F2EDE9",      // --primitive-neutral-100
    200: "#E5DFD8",      // --primitive-neutral-200
    300: "#CCC6C0",      // --primitive-neutral-300
    400: "#A39D96",      // --primitive-neutral-400
    500: "#7A7671",      // --primitive-neutral-500
    600: "#3D3A37",      // --primitive-neutral-600
  },
  // Pipeline stage colors (consistent across light/dark)
  pipeline: [
    "#3BA36F", // Applied - green
    "#3369FF", // Screening - blue
    "#9C59FF", // Interview - purple
    "#E5B225", // Offer - yellow
    "#5ECC70", // Hired - light green
  ],
  // Score distribution colors
  score: {
    excellent: "#3BA36F",
    good: "#5ECC70",
    average: "#E5B225",
    poor: "#FF5C5C",
  },
  // Dark mode aware neutral colors for axis/grid
  // These should be used dynamically based on theme
  getDarkModeAware: () => ({
    text: typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
      ? "#A39D96" // dark mode text
      : "#7A7671", // light mode text
    grid: typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
      ? "#2D3532" // dark mode grid
      : "#E5DFD8", // light mode grid
  }),
};

// ============================================
// Custom Tooltip Component
// ============================================

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color?: string;
    payload?: Record<string, unknown>;
  }>;
  label?: string | number;
  formatter?: (value: number, name: string) => string;
  labelFormatter?: (label: string | number) => string;
}

const ChartTooltip: React.FC<ChartTooltipProps> = ({
  active,
  payload,
  label,
  formatter,
  labelFormatter,
}) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-surface border border-border rounded-lg shadow-lg p-3 min-w-[120px]">
      {label !== undefined && label !== null && (
        <p className="text-caption font-medium text-foreground-muted mb-2">
          {labelFormatter ? labelFormatter(label) : String(label)}
        </p>
      )}
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-body-sm text-foreground-subtle">
                {entry.name}
              </span>
            </div>
            <span className="text-body-sm font-medium text-foreground">
              {formatter
                ? formatter(entry.value, entry.name)
                : entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// Chart Container
// ============================================

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  children: React.ReactNode;
  height?: number | string;
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ className, title, description, children, height = 300, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("bg-surface rounded-xl border border-border p-4", className)}
      {...props}
    >
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-body font-semibold text-foreground">{title}</h3>
          )}
          {description && (
            <p className="text-caption text-foreground-muted mt-0.5">
              {description}
            </p>
          )}
        </div>
      )}
      <div style={{ height }}>{children}</div>
    </div>
  )
);
ChartContainer.displayName = "ChartContainer";

// ============================================
// Pipeline Funnel Chart
// ============================================

export interface PipelineStage {
  name: string;
  value: number;
  fill?: string;
}

interface PipelineFunnelProps extends React.HTMLAttributes<HTMLDivElement> {
  data: PipelineStage[];
  title?: string;
  description?: string;
  height?: number;
  showLabels?: boolean;
  showPercentage?: boolean;
}

const PipelineFunnel = React.forwardRef<HTMLDivElement, PipelineFunnelProps>(
  (
    {
      className,
      data,
      title = "Pipeline Funnel",
      description,
      height = 300,
      showLabels = true,
      showPercentage = true,
      ...props
    },
    ref
  ) => {
    const isDark = useDarkMode();
    const themeColors = getThemeColors(isDark);

    // Add colors if not provided
    const dataWithColors = data.map((item, index) => ({
      ...item,
      fill: item.fill || chartColors.pipeline[index % chartColors.pipeline.length],
    }));

    // Calculate percentages
    const maxValue = Math.max(...data.map((d) => d.value));
    const dataWithPercentage = dataWithColors.map((item) => ({
      ...item,
      percentage: maxValue > 0 ? Math.round((item.value / maxValue) * 100) : 0,
    }));

    return (
      <ChartContainer
        ref={ref}
        className={className}
        title={title}
        description={description}
        height={height}
        {...props}
      >
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart>
            <Tooltip
              content={({ active, payload }) => (
                <ChartTooltip
                  active={active}
                  payload={payload?.map((p) => ({
                    name: p.name || "",
                    value: p.value as number,
                    color: p.payload?.fill,
                  }))}
                  formatter={(value, name) => {
                    const item = dataWithPercentage.find((d) => d.name === name);
                    return showPercentage && item
                      ? `${value.toLocaleString()} (${item.percentage}%)`
                      : value.toLocaleString();
                  }}
                />
              )}
            />
            <Funnel dataKey="value" data={dataWithPercentage} isAnimationActive>
              {showLabels && (
                <LabelList
                  position="right"
                  fill={themeColors.label}
                  stroke="none"
                  dataKey="name"
                  className="text-caption"
                />
              )}
              {dataWithPercentage.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  }
);
PipelineFunnel.displayName = "PipelineFunnel";

// ============================================
// Stage Distribution (Donut Chart)
// ============================================

export interface StageData {
  name: string;
  value: number;
  color?: string;
}

interface StageDistributionProps extends React.HTMLAttributes<HTMLDivElement> {
  data: StageData[];
  title?: string;
  description?: string;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
  centerLabel?: string;
  centerValue?: string | number;
}

const StageDistribution = React.forwardRef<HTMLDivElement, StageDistributionProps>(
  (
    {
      className,
      data,
      title = "Stage Distribution",
      description,
      height = 300,
      innerRadius = 60,
      outerRadius = 100,
      showLegend = true,
      centerLabel,
      centerValue,
      ...props
    },
    ref
  ) => {
    const dataWithColors = data.map((item, index) => ({
      ...item,
      color: item.color || chartColors.pipeline[index % chartColors.pipeline.length],
    }));

    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
      <ChartContainer
        ref={ref}
        className={className}
        title={title}
        description={description}
        height={height}
        {...props}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dataWithColors}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={2}
              dataKey="value"
            >
              {dataWithColors.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => (
                <ChartTooltip
                  active={active}
                  payload={payload?.map((p) => ({
                    name: p.name || "",
                    value: p.value as number,
                    color: (p.payload as StageData)?.color,
                  }))}
                  formatter={(value) =>
                    `${value.toLocaleString()} (${Math.round((value / total) * 100)}%)`
                  }
                />
              )}
            />
            {showLegend && (
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                formatter={(value: string) => (
                  <span className="text-body-sm text-foreground-subtle">{value}</span>
                )}
              />
            )}
          </PieChart>
        </ResponsiveContainer>
        {(centerLabel || centerValue) && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              {centerValue && (
                <p className="text-heading-sm font-bold text-foreground">
                  {centerValue}
                </p>
              )}
              {centerLabel && (
                <p className="text-caption text-foreground-muted">{centerLabel}</p>
              )}
            </div>
          </div>
        )}
      </ChartContainer>
    );
  }
);
StageDistribution.displayName = "StageDistribution";

// ============================================
// Score Distribution (Histogram)
// ============================================

export interface ScoreRange {
  range: string;
  count: number;
  color?: string;
}

interface ScoreDistributionProps extends React.HTMLAttributes<HTMLDivElement> {
  data: ScoreRange[];
  title?: string;
  description?: string;
  height?: number;
  barRadius?: number;
}

const ScoreDistribution = React.forwardRef<HTMLDivElement, ScoreDistributionProps>(
  (
    {
      className,
      data,
      title = "Score Distribution",
      description,
      height = 300,
      barRadius = 4,
      ...props
    },
    ref
  ) => {
    const isDark = useDarkMode();
    const themeColors = getThemeColors(isDark);

    // Default score colors based on range position
    const defaultColors = [
      chartColors.score.poor,
      chartColors.score.poor,
      chartColors.score.average,
      chartColors.score.good,
      chartColors.score.excellent,
    ];

    const dataWithColors = data.map((item, index) => ({
      ...item,
      color: item.color || defaultColors[index % defaultColors.length],
    }));

    return (
      <ChartContainer
        ref={ref}
        className={className}
        title={title}
        description={description}
        height={height}
        {...props}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dataWithColors} barCategoryGap="15%">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={themeColors.grid}
              vertical={false}
            />
            <XAxis
              dataKey="range"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: themeColors.text }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: themeColors.text }}
            />
            <Tooltip
              content={({ active, payload, label }) => (
                <ChartTooltip
                  active={active}
                  label={label}
                  payload={payload?.map((p) => ({
                    name: "Candidates",
                    value: p.value as number,
                    color: (p.payload as ScoreRange)?.color,
                  }))}
                />
              )}
            />
            <Bar dataKey="count" radius={[barRadius, barRadius, 0, 0]}>
              {dataWithColors.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  }
);
ScoreDistribution.displayName = "ScoreDistribution";

// ============================================
// Time-to-Hire Trend Chart
// ============================================

export interface TrendDataPoint {
  date: string;
  value: number;
  [key: string]: string | number;
}

interface TrendChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: TrendDataPoint[];
  title?: string;
  description?: string;
  height?: number;
  dataKey?: string;
  color?: string;
  showArea?: boolean;
  showGrid?: boolean;
  yAxisLabel?: string;
  dateFormatter?: (date: string | number) => string;
}

const TrendChart = React.forwardRef<HTMLDivElement, TrendChartProps>(
  (
    {
      className,
      data,
      title = "Trend",
      description,
      height = 300,
      dataKey = "value",
      color = chartColors.primary.main,
      showArea = true,
      showGrid = true,
      yAxisLabel,
      dateFormatter = (date) => String(date),
      ...props
    },
    ref
  ) => {
    const isDark = useDarkMode();
    const themeColors = getThemeColors(isDark);
    const ChartComponent = showArea ? AreaChart : LineChart;
    const DataComponent = showArea ? Area : Line;

    return (
      <ChartContainer
        ref={ref}
        className={className}
        title={title}
        description={description}
        height={height}
        {...props}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent data={data}>
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={themeColors.grid}
                vertical={false}
              />
            )}
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: themeColors.text }}
              tickFormatter={dateFormatter}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: themeColors.text }}
              label={
                yAxisLabel
                  ? {
                      value: yAxisLabel,
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: 12, fill: themeColors.text },
                    }
                  : undefined
              }
            />
            <Tooltip
              content={({ active, payload, label }) => (
                <ChartTooltip
                  active={active}
                  label={label}
                  labelFormatter={dateFormatter}
                  payload={payload?.map((p) => ({
                    name: yAxisLabel || "Value",
                    value: p.value as number,
                    color,
                  }))}
                />
              )}
            />
            {showArea ? (
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                fill={color}
                fillOpacity={0.1}
              />
            ) : (
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                dot={{ fill: color, strokeWidth: 0, r: 4 }}
                activeDot={{ fill: color, strokeWidth: 0, r: 6 }}
              />
            )}
          </ChartComponent>
        </ResponsiveContainer>
      </ChartContainer>
    );
  }
);
TrendChart.displayName = "TrendChart";

// ============================================
// Source Effectiveness Bar Chart
// ============================================

export interface SourceData {
  source: string;
  applications: number;
  hires?: number;
  color?: string;
}

interface SourceEffectivenessProps extends React.HTMLAttributes<HTMLDivElement> {
  data: SourceData[];
  title?: string;
  description?: string;
  height?: number;
  showHires?: boolean;
  layout?: "horizontal" | "vertical";
}

const SourceEffectiveness = React.forwardRef<HTMLDivElement, SourceEffectivenessProps>(
  (
    {
      className,
      data,
      title = "Source Effectiveness",
      description,
      height = 300,
      showHires = true,
      layout = "horizontal",
      ...props
    },
    ref
  ) => {
    const isDark = useDarkMode();
    const themeColors = getThemeColors(isDark);

    const dataWithColors = data.map((item, index) => ({
      ...item,
      color: item.color || chartColors.pipeline[index % chartColors.pipeline.length],
    }));

    const isVertical = layout === "vertical";

    return (
      <ChartContainer
        ref={ref}
        className={className}
        title={title}
        description={description}
        height={height}
        {...props}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={dataWithColors}
            layout={isVertical ? "vertical" : "horizontal"}
            barCategoryGap="20%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={themeColors.grid}
              horizontal={isVertical}
              vertical={!isVertical}
            />
            {isVertical ? (
              <>
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: themeColors.text }}
                />
                <YAxis
                  type="category"
                  dataKey="source"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: themeColors.text }}
                  width={100}
                />
              </>
            ) : (
              <>
                <XAxis
                  dataKey="source"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: themeColors.text }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: themeColors.text }}
                />
              </>
            )}
            <Tooltip
              content={({ active, payload, label }) => (
                <ChartTooltip
                  active={active}
                  label={label}
                  payload={payload?.map((p) => ({
                    name: p.dataKey as string,
                    value: p.value as number,
                    color: p.fill as string,
                  }))}
                />
              )}
            />
            <Legend
              formatter={(value: string) => (
                <span className="text-body-sm text-foreground-subtle capitalize">
                  {value}
                </span>
              )}
            />
            <Bar
              dataKey="applications"
              name="Applications"
              fill={chartColors.primary.light}
              radius={[4, 4, 0, 0]}
            />
            {showHires && (
              <Bar
                dataKey="hires"
                name="Hires"
                fill={chartColors.primary.main}
                radius={[4, 4, 0, 0]}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  }
);
SourceEffectiveness.displayName = "SourceEffectiveness";

// ============================================
// Multi-Line Comparison Chart
// ============================================

export interface ComparisonSeries {
  dataKey: string;
  name: string;
  color?: string;
}

interface ComparisonChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: TrendDataPoint[];
  series: ComparisonSeries[];
  title?: string;
  description?: string;
  height?: number;
  showGrid?: boolean;
  dateFormatter?: (date: string | number) => string;
}

const ComparisonChart = React.forwardRef<HTMLDivElement, ComparisonChartProps>(
  (
    {
      className,
      data,
      series,
      title = "Comparison",
      description,
      height = 300,
      showGrid = true,
      dateFormatter = (date) => String(date),
      ...props
    },
    ref
  ) => {
    const isDark = useDarkMode();
    const themeColors = getThemeColors(isDark);

    const seriesWithColors = series.map((s, index) => ({
      ...s,
      color:
        s.color ||
        [
          chartColors.primary.main,
          chartColors.secondary.blue,
          chartColors.secondary.purple,
          chartColors.secondary.orange,
        ][index % 4],
    }));

    return (
      <ChartContainer
        ref={ref}
        className={className}
        title={title}
        description={description}
        height={height}
        {...props}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={themeColors.grid}
                vertical={false}
              />
            )}
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: themeColors.text }}
              tickFormatter={dateFormatter}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: themeColors.text }}
            />
            <Tooltip
              content={({ active, payload, label }) => (
                <ChartTooltip
                  active={active}
                  label={label}
                  labelFormatter={dateFormatter}
                  payload={payload?.map((p) => {
                    const seriesConfig = seriesWithColors.find(
                      (s) => s.dataKey === p.dataKey
                    );
                    return {
                      name: seriesConfig?.name || (p.dataKey as string),
                      value: p.value as number,
                      color: seriesConfig?.color,
                    };
                  })}
                />
              )}
            />
            <Legend
              formatter={(value: string) => {
                const seriesConfig = seriesWithColors.find((s) => s.dataKey === value);
                return (
                  <span className="text-body-sm text-foreground-subtle">
                    {seriesConfig?.name || value}
                  </span>
                );
              }}
            />
            {seriesWithColors.map((s) => (
              <Line
                key={s.dataKey}
                type="monotone"
                dataKey={s.dataKey}
                name={s.dataKey}
                stroke={s.color}
                strokeWidth={2}
                dot={{ fill: s.color, strokeWidth: 0, r: 3 }}
                activeDot={{ fill: s.color, strokeWidth: 0, r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  }
);
ComparisonChart.displayName = "ComparisonChart";

// ============================================
// Metric Card with Sparkline
// ============================================

interface MetricSparklineProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  data: number[];
  color?: string;
}

const MetricSparkline = React.forwardRef<HTMLDivElement, MetricSparklineProps>(
  (
    {
      className,
      title,
      value,
      change,
      changeLabel = "vs last period",
      data,
      color = chartColors.primary.main,
      ...props
    },
    ref
  ) => {
    const sparklineData = data.map((v, i) => ({ value: v, index: i }));
    const isPositive = change && change > 0;
    const isNegative = change && change < 0;

    return (
      <div
        ref={ref}
        className={cn(
          "bg-surface rounded-xl border border-border p-4",
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-caption text-foreground-muted">{title}</p>
            <p className="text-heading-sm font-bold text-foreground mt-1">{value}</p>
            {change !== undefined && (
              <p
                className={cn(
                  "text-caption mt-1",
                  isPositive && "text-green-600",
                  isNegative && "text-red-600",
                  !isPositive && !isNegative && "text-foreground-muted"
                )}
              >
                {isPositive && "+"}
                {change}% {changeLabel}
              </p>
            )}
          </div>
          <div className="w-24 h-12">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={1.5}
                  fill={color}
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }
);
MetricSparkline.displayName = "MetricSparkline";

// ============================================
// Exports
// ============================================

export {
  ChartContainer,
  ChartTooltip,
  PipelineFunnel,
  StageDistribution,
  ScoreDistribution,
  TrendChart,
  SourceEffectiveness,
  ComparisonChart,
  MetricSparkline,
};
