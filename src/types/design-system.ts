/**
 * Trails Design System Type Definitions
 *
 * Centralized types for design tokens and component patterns
 */

/* ============================================
   COLOR SCALES
   ============================================ */

/** Primary (Green) color scale steps */
export type PrimaryColorScale = "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800";

/** Neutral color scale steps */
export type NeutralColorScale = "0" | "50" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "900";

/** Secondary color scale steps (blue, red, orange, yellow, purple) */
export type SecondaryColorScale = "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800";

/** Semantic color intents */
export type SemanticColor = "success" | "warning" | "error" | "info";

/** Status colors for badges and indicators */
export type StatusColor = "neutral" | "primary" | "success" | "warning" | "error" | "info";

/* ============================================
   SPACING & SIZING
   ============================================ */

/** Spacing scale values */
export type SpacingScale =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "8"
  | "10"
  | "12"
  | "16"
  | "20"
  | "24";

/** Border radius scale */
export type RadiusScale = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";

/** Semantic border radius aliases */
export type RadiusSemantic = "card" | "button" | "input" | "badge" | "chip";

/** Shadow scale */
export type ShadowScale = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

/** Semantic shadow aliases */
export type ShadowSemantic = "card" | "elevated" | "dropdown" | "button";

/* ============================================
   TYPOGRAPHY
   ============================================ */

/** Typography scale names */
export type TypographyScale =
  | "display"
  | "heading-lg"
  | "heading-md"
  | "heading-sm"
  | "body-strong"
  | "body"
  | "body-sm"
  | "caption-strong"
  | "caption"
  | "caption-sm";

/** Font weight values */
export type FontWeight = "regular" | "medium" | "semibold" | "bold";

/** Font family */
export type FontFamily = "sans" | "mono";

/* ============================================
   MOTION
   ============================================ */

/** Duration scale */
export type DurationScale =
  | "instant"
  | "fastest"
  | "fast"
  | "normal"
  | "slow"
  | "slower"
  | "slowest";

/** Easing function names */
export type EasingFunction =
  | "linear"
  | "default"
  | "in"
  | "out"
  | "in-out"
  | "emphasized"
  | "spring"
  | "bounce";

/** Motion distance scale */
export type MotionDistanceScale = "xs" | "sm" | "md" | "lg" | "xl";

/* ============================================
   LAYOUT
   ============================================ */

/** Breakpoint names */
export type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl";

/** Breakpoint values in pixels */
export const BREAKPOINT_VALUES: Record<Breakpoint, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

/** Z-index layer names */
export type ZIndexLayer =
  | "behind"
  | "base"
  | "raised"
  | "dropdown"
  | "sticky"
  | "fixed"
  | "modal-backdrop"
  | "modal"
  | "popover"
  | "tooltip"
  | "toast"
  | "max";

/** Density mode */
export type DensityMode = "comfortable" | "compact";

/* ============================================
   THEMING
   ============================================ */

/** Theme mode */
export type ThemeMode = "light" | "dark" | "system";

/** Color scheme preference */
export type ColorScheme = "light" | "dark";

/* ============================================
   ATS-SPECIFIC TOKENS
   ============================================ */

/** Pipeline stage variants */
export type PipelineStage =
  | "applied"
  | "screening"
  | "interview"
  | "offer"
  | "hired"
  | "rejected";

/** AI match score levels */
export type MatchScoreLevel = "high" | "medium" | "low";

/** Match score numeric ranges */
export const MATCH_SCORE_THRESHOLDS = {
  high: { min: 80, max: 100 },
  medium: { min: 50, max: 79 },
  low: { min: 0, max: 49 },
} as const;

/** Get match level from numeric score */
export function getMatchLevel(score: number): MatchScoreLevel {
  if (score >= MATCH_SCORE_THRESHOLDS.high.min) return "high";
  if (score >= MATCH_SCORE_THRESHOLDS.medium.min) return "medium";
  return "low";
}

/* ============================================
   COMPONENT TYPES
   ============================================ */

/** Common component size variants */
export type ComponentSize = "xs" | "sm" | "md" | "lg" | "xl";

/** Button variants */
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "ghost"
  | "destructive"
  | "link"
  | "inverse";

/** Badge variants */
export type BadgeVariant =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "stage"
  | "count";

/** Input states */
export type InputState = "default" | "hover" | "focus" | "error" | "disabled";

/** Interactive element states */
export type InteractiveState =
  | "default"
  | "hover"
  | "active"
  | "focus"
  | "disabled"
  | "selected";

/* ============================================
   UTILITY TYPES
   ============================================ */

/** Extract variant props from CVA */
export type VariantKeys<T> = T extends { variants: infer V } ? keyof V : never;

/** Make certain keys required */
export type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

/** Make certain keys optional */
export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** CSS custom property name */
export type CSSCustomProperty = `--${string}`;

/** Token reference function */
export type TokenRef<T extends string> = `var(--${T})`;

/* ============================================
   TOKEN VALUE MAPS
   ============================================ */

/** Map of spacing tokens to their CSS values */
export const SPACING_VALUES: Record<SpacingScale, string> = {
  "0": "0",
  "1": "0.25rem",
  "2": "0.5rem",
  "3": "0.75rem",
  "4": "1rem",
  "5": "1.25rem",
  "6": "1.5rem",
  "8": "2rem",
  "10": "2.5rem",
  "12": "3rem",
  "16": "4rem",
  "20": "5rem",
  "24": "6rem",
};

/** Map of radius tokens to their CSS values */
export const RADIUS_VALUES: Record<RadiusScale, string> = {
  none: "0",
  sm: "0.25rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  "2xl": "1.5rem",
  full: "9999px",
};

/** Map of duration tokens to their CSS values */
export const DURATION_VALUES: Record<DurationScale, string> = {
  instant: "0ms",
  fastest: "50ms",
  fast: "100ms",
  normal: "200ms",
  slow: "300ms",
  slower: "400ms",
  slowest: "500ms",
};

/** Map of z-index tokens to their values */
export const Z_INDEX_VALUES: Record<ZIndexLayer, number> = {
  behind: -1,
  base: 0,
  raised: 1,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  "modal-backdrop": 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
  max: 9999,
};
