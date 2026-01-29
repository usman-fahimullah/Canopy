"use client";

import * as React from "react";
import {
  AreaChart as RechartsAreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

// ============================================
// CHART CONFIGURATION SYSTEM
// Inspired by shadcn/ui charts with Trails Design System tokens
// ============================================

/**
 * Chart configuration type for declarative chart setup.
 * Maps data keys to labels, colors, and optional icons.
 */
export type ChartConfig = {
  [key: string]: {
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    color?: string;
    theme?: {
      light: string;
      dark: string;
    };
  };
};

// ============================================
// DESIGN SYSTEM CHART COLORS
// Based on Trails Design System primitives
// ============================================

/**
 * Pre-defined chart color palette using Trails Design System tokens.
 * Use these for consistent styling across all charts.
 */
export const CHART_COLORS = {
  // Primary palette (1-5 for main data series)
  chart1: "var(--primitive-green-500)",   // #5ECC70
  chart2: "var(--primitive-blue-500)",    // #3369FF
  chart3: "var(--primitive-purple-500)",  // #9C59FF
  chart4: "var(--primitive-orange-500)",  // #F5580A
  chart5: "var(--primitive-yellow-500)",  // #E5B225

  // Extended palette for additional series
  chart6: "var(--primitive-green-600)",   // #3BA36F
  chart7: "var(--primitive-blue-400)",    // #408CFF
  chart8: "var(--primitive-purple-400)",  // #C285FF
  chart9: "var(--primitive-red-500)",     // #FF5C5C
  chart10: "var(--primitive-green-300)",  // #BCEBB2

  // Semantic colors
  success: "var(--primitive-green-500)",
  warning: "var(--primitive-orange-500)",
  error: "var(--primitive-red-500)",
  info: "var(--primitive-blue-500)",

  // Neutral for backgrounds/grids
  muted: "var(--primitive-neutral-300)",
  subtle: "var(--primitive-neutral-200)",
} as const;

// Raw hex values for Recharts (CSS variables don't work directly in gradients)
export const CHART_COLORS_RAW = {
  chart1: "#5ECC70",
  chart2: "#3369FF",
  chart3: "#9C59FF",
  chart4: "#F5580A",
  chart5: "#E5B225",
  chart6: "#3BA36F",
  chart7: "#408CFF",
  chart8: "#C285FF",
  chart9: "#FF5C5C",
  chart10: "#BCEBB2",
  success: "#5ECC70",
  warning: "#F5580A",
  error: "#FF5C5C",
  info: "#3369FF",
  muted: "#E5DFD8",
  subtle: "#F2EDE9",
} as const;

// ============================================
// DARK MODE DETECTION
// ============================================

const useDarkMode = () => {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const checkDark = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return isDark;
};

/**
 * Get theme-aware colors for chart axes, grids, and labels.
 */
const getChartThemeColors = (isDark: boolean) => ({
  text: isDark ? "#A39D96" : "#7A7671",
  grid: isDark ? "#2D3532" : "#E5DFD8",
  label: isDark ? "#A39D96" : "#3D3A37",
  background: isDark ? "#1A1A1A" : "#FFFFFF",
  border: isDark ? "#3D3D3D" : "#E5DFD8",
});

// ============================================
// CHART CONTEXT
// Provides config to child components
// ============================================

interface ChartContextValue {
  config: ChartConfig;
  isDark: boolean;
}

const ChartContext = React.createContext<ChartContextValue | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a ChartContainer");
  }
  return context;
}

// Helper to get color from config or fallback
function getColorFromConfig(config: ChartConfig, key: string, isDark: boolean): string {
  const entry = config[key];
  if (!entry) return CHART_COLORS_RAW.chart1;

  if (entry.theme) {
    return isDark ? entry.theme.dark : entry.theme.light;
  }

  return entry.color || CHART_COLORS_RAW.chart1;
}

// ============================================
// CHART CONTAINER
// Main wrapper that provides context and styling
// ============================================

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig;
  children: React.ReactNode;
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ className, config, children, ...props }, ref) => {
    const isDark = useDarkMode();

    // Generate CSS variables for each config entry
    const style = React.useMemo(() => {
      const vars: Record<string, string> = {};
      Object.entries(config).forEach(([key]) => {
        const color = getColorFromConfig(config, key, isDark);
        vars[`--color-${key}`] = color;
      });
      return vars;
    }, [config, isDark]);

    return (
      <ChartContext.Provider value={{ config, isDark }}>
        <div
          ref={ref}
          className={cn(
            "flex aspect-video justify-center text-xs",
            "[&_.recharts-cartesian-axis-tick_text]:fill-[var(--foreground-muted)]",
            "[&_.recharts-cartesian-grid_line]:stroke-[var(--border-muted)]",
            "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-[var(--border-muted)]",
            "[&_.recharts-polar-grid_[stroke]]:stroke-[var(--border-muted)]",
            "[&_.recharts-radial-bar-background-sector]:fill-[var(--background-muted)]",
            "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-[var(--background-muted)]",
            "[&_.recharts-reference-line_[stroke]]:stroke-[var(--border-muted)]",
            "[&_.recharts-sector[stroke]]:stroke-transparent",
            "[&_.recharts-sector]:outline-none",
            "[&_.recharts-surface]:outline-none",
            className
          )}
          style={style as React.CSSProperties}
          {...props}
        >
          <ResponsiveContainer width="100%" height="100%">
            {children as React.ReactElement}
          </ResponsiveContainer>
        </div>
      </ChartContext.Provider>
    );
  }
);
ChartContainer.displayName = "ChartContainer";

// ============================================
// CHART TOOLTIP
// Custom tooltip with config-aware styling
// ============================================

interface TooltipPayloadItem {
  name?: string;
  value?: number;
  dataKey?: string | number;
  color?: string;
  payload?: Record<string, unknown>;
}

interface ChartTooltipContentProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: "line" | "dot" | "dashed";
  nameKey?: string;
  labelKey?: string;
  labelFormatter?: (value: string | number, payload: TooltipPayloadItem[]) => React.ReactNode;
  formatter?: (value: number, name: string, item: TooltipPayloadItem, index: number) => React.ReactNode;
}

const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipContentProps>(
  (
    {
      active,
      payload,
      label,
      hideLabel = false,
      hideIndicator = false,
      indicator = "dot",
      nameKey,
      labelKey,
      labelFormatter,
      formatter,
    },
    ref
  ) => {
    const { config, isDark } = useChart();
    const themeColors = getChartThemeColors(isDark);

    if (!active || !payload?.length) return null;

    const tooltipLabel = labelKey
      ? (payload[0]?.payload as Record<string, unknown>)?.[labelKey]
      : label;

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border px-3 py-2 text-sm shadow-lg",
          "bg-[var(--surface-default)] border-[var(--border-muted)]"
        )}
        style={{
          backgroundColor: themeColors.background,
          borderColor: themeColors.border,
        }}
      >
        {!hideLabel && tooltipLabel !== undefined && (
          <div className="mb-1.5 font-medium" style={{ color: themeColors.label }}>
            {labelFormatter
              ? labelFormatter(tooltipLabel as string | number, payload)
              : String(tooltipLabel)}
          </div>
        )}
        <div className="space-y-1">
          {payload.map((item: TooltipPayloadItem, index: number) => {
            const key = nameKey
              ? (item.payload as Record<string, unknown>)?.[nameKey] as string
              : String(item.dataKey);
            const configEntry = config[key];
            const name = configEntry?.label || item.name || key;
            const color = getColorFromConfig(config, key, isDark);
            const IconComponent = configEntry?.icon;

            return (
              <div
                key={`${item.dataKey}-${index}`}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2">
                  {!hideIndicator && (
                    <>
                      {indicator === "dot" && (
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      )}
                      {indicator === "line" && (
                        <span
                          className="h-0.5 w-3 shrink-0"
                          style={{ backgroundColor: color }}
                        />
                      )}
                      {indicator === "dashed" && (
                        <span
                          className="h-0.5 w-3 shrink-0"
                          style={{
                            backgroundImage: `repeating-linear-gradient(to right, ${color} 0, ${color} 2px, transparent 2px, transparent 4px)`,
                          }}
                        />
                      )}
                    </>
                  )}
                  {IconComponent && (
                    <IconComponent className="h-4 w-4 text-[var(--foreground-muted)]" />
                  )}
                  <span style={{ color: themeColors.text }}>{name}</span>
                </div>
                <span className="font-medium tabular-nums" style={{ color: themeColors.label }}>
                  {formatter
                    ? formatter(item.value as number, name, item, index)
                    : typeof item.value === "number"
                    ? item.value.toLocaleString()
                    : item.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
ChartTooltipContent.displayName = "ChartTooltipContent";

// Wrapper component for easier usage
interface ChartTooltipProps {
  cursor?: boolean | { stroke?: string; strokeWidth?: number };
  content?: React.ReactElement;
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: "line" | "dot" | "dashed";
  nameKey?: string;
  labelKey?: string;
  labelFormatter?: (value: string | number, payload: TooltipPayloadItem[]) => React.ReactNode;
  formatter?: (value: number, name: string, item: TooltipPayloadItem, index: number) => React.ReactNode;
}

const ChartTooltip: React.FC<ChartTooltipProps> = ({
  cursor = true,
  content,
  ...props
}) => (
  <Tooltip
    cursor={cursor ? { stroke: "var(--border-muted)", strokeWidth: 1 } : false}
    content={content || <ChartTooltipContent {...props} />}
  />
);

// ============================================
// CHART LEGEND
// Custom legend with config-aware styling
// ============================================

interface LegendPayloadItem {
  value?: string;
  dataKey?: string;
  color?: string;
  payload?: Record<string, unknown>;
}

interface ChartLegendContentProps {
  payload?: LegendPayloadItem[];
  nameKey?: string;
  hideIcon?: boolean;
}

const ChartLegendContent = React.forwardRef<HTMLDivElement, ChartLegendContentProps>(
  ({ payload, nameKey, hideIcon = false }, ref) => {
    const { config, isDark } = useChart();
    const themeColors = getChartThemeColors(isDark);

    if (!payload?.length) return null;

    return (
      <div
        ref={ref}
        className="flex flex-wrap items-center justify-center gap-4 pt-3"
      >
        {payload.map((entry: LegendPayloadItem, index: number) => {
          const key = nameKey
            ? (entry.payload as Record<string, unknown>)?.[nameKey] as string
            : entry.dataKey || entry.value || "";
          const configEntry = config[key];
          const label = configEntry?.label || entry.value;
          const color = getColorFromConfig(config, key, isDark);
          const IconComponent = configEntry?.icon;

          return (
            <div
              key={`legend-${index}`}
              className="flex items-center gap-1.5"
            >
              {!hideIcon && (
                <>
                  {IconComponent ? (
                    <IconComponent className="h-3 w-3" />
                  ) : (
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-sm"
                      style={{ backgroundColor: color }}
                    />
                  )}
                </>
              )}
              <span
                className="text-sm"
                style={{ color: themeColors.text }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
);
ChartLegendContent.displayName = "ChartLegendContent";

// Wrapper component for easier usage
interface ChartLegendProps {
  content?: React.ReactElement;
  verticalAlign?: "top" | "bottom" | "middle";
  align?: "left" | "center" | "right";
  layout?: "horizontal" | "vertical";
}

const ChartLegend: React.FC<ChartLegendProps> = ({ content, ...props }) => (
  <Legend
    content={content || <ChartLegendContent />}
    {...props}
  />
);

// ============================================
// DATA TYPES
// ============================================

export interface ChartDataPoint {
  [key: string]: string | number;
}

export type AreaChartVariant = "default" | "stacked" | "gradient" | "step" | "interactive";
export type CurveType = "monotone" | "linear" | "step" | "stepBefore" | "stepAfter" | "basis" | "natural";

// ============================================
// AREA CHART COMPONENT
// Versatile area chart with multiple variants
// ============================================

interface AreaChartProps {
  data: ChartDataPoint[];
  config: ChartConfig;
  dataKeys: string[];
  xAxisKey?: string;
  variant?: AreaChartVariant;
  curveType?: CurveType;
  showGrid?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  legendPosition?: "top" | "bottom" | "left" | "right";
  fillOpacity?: number;
  strokeWidth?: number;
  gradientOpacity?: { start: number; end: number };
  stacked?: boolean;
  interactive?: boolean;
  xAxisFormatter?: (value: string | number) => string;
  yAxisFormatter?: (value: number) => string;
  tooltipFormatter?: (value: number, name: string) => React.ReactNode;
  className?: string;
  height?: number | string;
}

const AreaChart = React.forwardRef<HTMLDivElement, AreaChartProps>(
  (
    {
      data,
      config,
      dataKeys,
      xAxisKey = "date",
      variant = "default",
      curveType = "monotone",
      showGrid = true,
      showXAxis = true,
      showYAxis = true,
      showTooltip = true,
      showLegend = false,
      legendPosition = "bottom",
      fillOpacity = 0.4,
      strokeWidth = 2,
      gradientOpacity = { start: 0.8, end: 0.1 },
      stacked = false,
      interactive = false,
      xAxisFormatter,
      yAxisFormatter,
      tooltipFormatter,
      className,
      height = 350,
    },
    ref
  ) => {
    const [activeKey, setActiveKey] = React.useState<string | null>(null);
    const isDark = useDarkMode();
    const themeColors = getChartThemeColors(isDark);

    // Determine stacking based on variant
    const isStacked = variant === "stacked" || stacked;

    // Determine curve type based on variant
    const effectiveCurveType: CurveType =
      variant === "step" ? "step" : curveType;

    // Handle legend click for interactive variant
    const handleLegendClick = (dataKey: string) => {
      if (variant === "interactive" || interactive) {
        setActiveKey(activeKey === dataKey ? null : dataKey);
      }
    };

    return (
      <div ref={ref} className={cn("w-full", className)} style={{ height }}>
        <ChartContainer config={config}>
          <RechartsAreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            {/* Gradient definitions for gradient variant */}
            {variant === "gradient" && (
              <defs>
                {dataKeys.map((key) => {
                  const color = getColorFromConfig(config, key, isDark);
                  return (
                    <linearGradient
                      key={`gradient-${key}`}
                      id={`gradient-${key}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={color}
                        stopOpacity={gradientOpacity.start}
                      />
                      <stop
                        offset="95%"
                        stopColor={color}
                        stopOpacity={gradientOpacity.end}
                      />
                    </linearGradient>
                  );
                })}
              </defs>
            )}

            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={themeColors.grid}
                vertical={false}
              />
            )}

            {showXAxis && (
              <XAxis
                dataKey={xAxisKey}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: themeColors.text }}
                tickFormatter={xAxisFormatter}
                tickMargin={8}
              />
            )}

            {showYAxis && (
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: themeColors.text }}
                tickFormatter={yAxisFormatter}
                tickMargin={8}
              />
            )}

            {showTooltip && (
              <ChartTooltip
                formatter={
                  tooltipFormatter
                    ? (value, name) => tooltipFormatter(value, name)
                    : undefined
                }
              />
            )}

            {showLegend && (
              <Legend
                verticalAlign={legendPosition === "top" ? "top" : "bottom"}
                align="center"
                content={
                  <ChartLegendContent
                    payload={dataKeys.map((key) => ({
                      value: config[key]?.label || key,
                      dataKey: key,
                      color: getColorFromConfig(config, key, isDark),
                    }))}
                  />
                }
                onClick={() => handleLegendClick}
                wrapperStyle={{ cursor: interactive ? "pointer" : "default" }}
              />
            )}

            {dataKeys.map((key) => {
              const color = getColorFromConfig(config, key, isDark);
              const isActive = !activeKey || activeKey === key;
              const opacity =
                interactive && activeKey && !isActive ? 0.2 : fillOpacity;

              return (
                <Area
                  key={key}
                  type={effectiveCurveType}
                  dataKey={key}
                  stackId={isStacked ? "stack" : undefined}
                  stroke={color}
                  strokeWidth={strokeWidth}
                  fill={
                    variant === "gradient"
                      ? `url(#gradient-${key})`
                      : color
                  }
                  fillOpacity={opacity}
                  dot={false}
                  activeDot={{
                    r: 4,
                    strokeWidth: 2,
                    stroke: themeColors.background,
                    fill: color,
                  }}
                />
              );
            })}
          </RechartsAreaChart>
        </ChartContainer>
      </div>
    );
  }
);
AreaChart.displayName = "AreaChart";

// ============================================
// BAR CHART COMPONENT
// ============================================

interface BarChartProps {
  data: ChartDataPoint[];
  config: ChartConfig;
  dataKeys: string[];
  xAxisKey?: string;
  layout?: "horizontal" | "vertical";
  stacked?: boolean;
  showGrid?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  barRadius?: number;
  barGap?: number;
  xAxisFormatter?: (value: string | number) => string;
  yAxisFormatter?: (value: number) => string;
  className?: string;
  height?: number | string;
}

const BarChart = React.forwardRef<HTMLDivElement, BarChartProps>(
  (
    {
      data,
      config,
      dataKeys,
      xAxisKey = "name",
      layout = "horizontal",
      stacked = false,
      showGrid = true,
      showXAxis = true,
      showYAxis = true,
      showTooltip = true,
      showLegend = false,
      barRadius = 4,
      barGap = 4,
      xAxisFormatter,
      yAxisFormatter,
      className,
      height = 350,
    },
    ref
  ) => {
    const isDark = useDarkMode();
    const themeColors = getChartThemeColors(isDark);
    const isVertical = layout === "vertical";

    return (
      <div ref={ref} className={cn("w-full", className)} style={{ height }}>
        <ChartContainer config={config}>
          <RechartsBarChart
            data={data}
            layout={isVertical ? "vertical" : "horizontal"}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            barGap={barGap}
          >
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={themeColors.grid}
                horizontal={isVertical}
                vertical={!isVertical}
              />
            )}

            {isVertical ? (
              <>
                {showXAxis && (
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: themeColors.text }}
                    tickFormatter={yAxisFormatter}
                  />
                )}
                {showYAxis && (
                  <YAxis
                    type="category"
                    dataKey={xAxisKey}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: themeColors.text }}
                    width={100}
                    tickFormatter={xAxisFormatter}
                  />
                )}
              </>
            ) : (
              <>
                {showXAxis && (
                  <XAxis
                    dataKey={xAxisKey}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: themeColors.text }}
                    tickFormatter={xAxisFormatter}
                    tickMargin={8}
                  />
                )}
                {showYAxis && (
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: themeColors.text }}
                    tickFormatter={yAxisFormatter}
                    tickMargin={8}
                  />
                )}
              </>
            )}

            {showTooltip && <ChartTooltip />}

            {showLegend && <ChartLegend />}

            {dataKeys.map((key) => {
              const color = getColorFromConfig(config, key, isDark);
              return (
                <Bar
                  key={key}
                  dataKey={key}
                  stackId={stacked ? "stack" : undefined}
                  fill={color}
                  radius={[barRadius, barRadius, 0, 0]}
                />
              );
            })}
          </RechartsBarChart>
        </ChartContainer>
      </div>
    );
  }
);
BarChart.displayName = "BarChart";

// ============================================
// LINE CHART COMPONENT
// ============================================

interface LineChartProps {
  data: ChartDataPoint[];
  config: ChartConfig;
  dataKeys: string[];
  xAxisKey?: string;
  curveType?: CurveType;
  showGrid?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  strokeWidth?: number;
  showDots?: boolean;
  xAxisFormatter?: (value: string | number) => string;
  yAxisFormatter?: (value: number) => string;
  className?: string;
  height?: number | string;
}

const LineChart = React.forwardRef<HTMLDivElement, LineChartProps>(
  (
    {
      data,
      config,
      dataKeys,
      xAxisKey = "date",
      curveType = "monotone",
      showGrid = true,
      showXAxis = true,
      showYAxis = true,
      showTooltip = true,
      showLegend = false,
      strokeWidth = 2,
      showDots = true,
      xAxisFormatter,
      yAxisFormatter,
      className,
      height = 350,
    },
    ref
  ) => {
    const isDark = useDarkMode();
    const themeColors = getChartThemeColors(isDark);

    return (
      <div ref={ref} className={cn("w-full", className)} style={{ height }}>
        <ChartContainer config={config}>
          <RechartsLineChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={themeColors.grid}
                vertical={false}
              />
            )}

            {showXAxis && (
              <XAxis
                dataKey={xAxisKey}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: themeColors.text }}
                tickFormatter={xAxisFormatter}
                tickMargin={8}
              />
            )}

            {showYAxis && (
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: themeColors.text }}
                tickFormatter={yAxisFormatter}
                tickMargin={8}
              />
            )}

            {showTooltip && <ChartTooltip />}

            {showLegend && <ChartLegend />}

            {dataKeys.map((key) => {
              const color = getColorFromConfig(config, key, isDark);
              return (
                <Line
                  key={key}
                  type={curveType}
                  dataKey={key}
                  stroke={color}
                  strokeWidth={strokeWidth}
                  dot={
                    showDots
                      ? {
                          fill: color,
                          strokeWidth: 0,
                          r: 4,
                        }
                      : false
                  }
                  activeDot={{
                    r: 6,
                    strokeWidth: 2,
                    stroke: themeColors.background,
                    fill: color,
                  }}
                />
              );
            })}
          </RechartsLineChart>
        </ChartContainer>
      </div>
    );
  }
);
LineChart.displayName = "LineChart";

// ============================================
// DONUT/PIE CHART COMPONENT
// ============================================

interface DonutChartProps {
  data: Array<{ name: string; value: number; color?: string }>;
  config: ChartConfig;
  innerRadius?: number;
  outerRadius?: number;
  paddingAngle?: number;
  showTooltip?: boolean;
  showLegend?: boolean;
  legendPosition?: "top" | "bottom" | "left" | "right";
  centerLabel?: string;
  centerValue?: string | number;
  className?: string;
  height?: number | string;
}

const DonutChart = React.forwardRef<HTMLDivElement, DonutChartProps>(
  (
    {
      data,
      config,
      innerRadius = 60,
      outerRadius = 100,
      paddingAngle = 2,
      showTooltip = true,
      showLegend = true,
      legendPosition = "right",
      centerLabel,
      centerValue,
      className,
      height = 350,
    },
    ref
  ) => {
    const isDark = useDarkMode();

    // Get colors for each data point
    const colorValues = Object.values(CHART_COLORS_RAW);
    const dataWithColors = data.map((item, index) => ({
      ...item,
      fill:
        item.color ||
        getColorFromConfig(config, item.name, isDark) ||
        colorValues[index % colorValues.length],
    }));

    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
      <div ref={ref} className={cn("w-full relative", className)} style={{ height }}>
        <ChartContainer config={config}>
          <RechartsPieChart>
            <Pie
              data={dataWithColors}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={paddingAngle}
              dataKey="value"
              nameKey="name"
            >
              {dataWithColors.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>

            {showTooltip && (
              <ChartTooltip
                formatter={(value) =>
                  `${value.toLocaleString()} (${Math.round(
                    (value / total) * 100
                  )}%)`
                }
              />
            )}

            {showLegend && (
              <Legend
                layout={
                  legendPosition === "left" || legendPosition === "right"
                    ? "vertical"
                    : "horizontal"
                }
                align={legendPosition === "left" ? "left" : legendPosition === "right" ? "right" : "center"}
                verticalAlign={
                  legendPosition === "top"
                    ? "top"
                    : legendPosition === "bottom"
                    ? "bottom"
                    : "middle"
                }
                content={<ChartLegendContent />}
              />
            )}
          </RechartsPieChart>
        </ChartContainer>

        {/* Center label for donut */}
        {(centerLabel || centerValue) && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              {centerValue && (
                <p className="text-2xl font-bold text-[var(--foreground-default)]">
                  {centerValue}
                </p>
              )}
              {centerLabel && (
                <p className="text-sm text-[var(--foreground-muted)]">
                  {centerLabel}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);
DonutChart.displayName = "DonutChart";

// ============================================
// CHART CARD WRAPPER
// Optional card wrapper with title and description
// ============================================

interface ChartCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

const ChartCard = React.forwardRef<HTMLDivElement, ChartCardProps>(
  ({ className, title, description, actions, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border bg-[var(--surface-default)] p-4",
          "border-[var(--border-muted)]",
          className
        )}
        {...props}
      >
        {(title || description || actions) && (
          <div className="flex items-start justify-between mb-4">
            <div>
              {title && (
                <h3 className="text-base font-semibold text-[var(--foreground-default)]">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-sm text-[var(--foreground-muted)] mt-0.5">
                  {description}
                </p>
              )}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        )}
        {children}
      </div>
    );
  }
);
ChartCard.displayName = "ChartCard";

// ============================================
// EXPORTS
// ============================================

export {
  // Core components
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartCard,

  // Chart types
  AreaChart,
  BarChart,
  LineChart,
  DonutChart,

  // Utilities & hooks
  useChart,
  useDarkMode,
  getChartThemeColors,
  getColorFromConfig,
};

export type {
  ChartContainerProps,
  ChartTooltipContentProps,
  ChartLegendContentProps,
  ChartCardProps,
  AreaChartProps,
  BarChartProps,
  LineChartProps,
  DonutChartProps,
  TooltipPayloadItem,
  LegendPayloadItem,
};
