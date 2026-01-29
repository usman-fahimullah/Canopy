/**
 * Trails Design System Tokens
 *
 * JavaScript/TypeScript access to design tokens for use in:
 * - Runtime calculations
 * - Framer Motion animations
 * - Chart libraries
 * - Dynamic styling
 *
 * Note: For CSS, use the custom properties directly (e.g., var(--background-default))
 * This file is for JS contexts where CSS variables aren't available.
 */

/* ============================================
   COLOR TOKENS
   ============================================ */

export const colors = {
  // Primary (Green) Scale
  primary: {
    100: "#EAFFE0",
    200: "#DCFAC8",
    300: "#BCEBB2",
    400: "#8EE07E",
    500: "#5ECC70",
    600: "#3BA36F",
    700: "#0E5249",
    800: "#0A3D2C",
  },

  // Neutral Scale
  neutral: {
    0: "#FFFFFF",
    50: "#FAF9F7",
    100: "#F2EDE9",
    200: "#E5DFD8",
    300: "#CCC6C0",
    400: "#A39D96",
    500: "#7A7671",
    600: "#3D3A37",
    700: "#1F1D1C",
    900: "#000000",
  },

  // Blue Scale
  blue: {
    100: "#E5F1FF",
    200: "#CCE4FF",
    300: "#99C9FF",
    400: "#408CFF",
    500: "#3369FF",
    600: "#0D3EC7",
    700: "#00217A",
    800: "#001652",
  },

  // Red Scale
  red: {
    100: "#FFEBF4",
    200: "#FFD6E9",
    300: "#FFADCE",
    400: "#FF8599",
    500: "#FF5C5C",
    600: "#E90000",
    700: "#AE0101",
    800: "#5C0000",
  },

  // Orange Scale
  orange: {
    100: "#FFEDE0",
    200: "#FFDAC2",
    300: "#FFAD85",
    400: "#FF8547",
    500: "#F5580A",
    600: "#B83D00",
    700: "#7A2900",
    800: "#521B00",
  },

  // Yellow Scale
  yellow: {
    100: "#FFF7D6",
    200: "#FFEFAD",
    300: "#FFDA75",
    400: "#FFCE47",
    500: "#E5B225",
    600: "#B88A1D",
    700: "#665510",
    800: "#3D330A",
  },

  // Purple Scale
  purple: {
    100: "#F7F2FF",
    200: "#F1E0FF",
    300: "#E2C2FF",
    400: "#C285FF",
    500: "#9C59FF",
    600: "#5B1DB8",
    700: "#31007A",
    800: "#1B0043",
  },
} as const;

/* ============================================
   GRADIENT TOKENS
   Multi-color directional gradients matching Figma design system
   ============================================ */

export const gradients = {
  // Green family gradients (end with green)
  green: {
    100: "linear-gradient(135deg, #E5F1FF 0%, #99C9FF 30.5%, #3BA36F 65.5%, #0E5249 100%)",  // Blue → Green
    200: "linear-gradient(135deg, #F1E0FF 0%, #E2C2FF 33.5%, #3BA36F 66.5%, #0E5249 100%)",  // Purple → Green
    300: "linear-gradient(135deg, #FFD6E9 0%, #FFADCE 33%, #3BA36F 65.5%, #0E5249 100%)",    // Red → Green
    400: "linear-gradient(135deg, #FFEDE0 0%, #FFAD85 33.5%, #3BA36F 68.5%, #0E5249 100%)",  // Orange → Green
    500: "linear-gradient(135deg, #FFF7D6 0%, #FFDA75 33.5%, #3BA36F 67.5%, #0E5249 100%)",  // Yellow → Green
  },

  // Blue family gradients (end with blue)
  blue: {
    100: "linear-gradient(135deg, #0A3D2C 0%, #0E5249 34%, #408CFF 74%, #CCE4FF 100%)",       // Green → Blue
    200: "linear-gradient(135deg, #E2C2FF 0%, #9C59FF 31.5%, #3369FF 66.5%, #408CFF 100%)",   // Purple → Blue
    300: "linear-gradient(135deg, #FFD6E9 0%, #FF8599 31.5%, #3369FF 66.5%, #408CFF 100%)",   // Red → Blue
    400: "linear-gradient(135deg, #FFDAC2 0%, #FF8547 31.5%, #408CFF 79%, #3369FF 100%)",     // Orange → Blue
    500: "linear-gradient(135deg, #FFDA75 0%, #FFF7D6 33%, #99C9FF 66.5%, #408CFF 100%)",     // Yellow → Blue
  },

  // Purple family gradients (end with purple)
  purple: {
    100: "linear-gradient(135deg, #8EE07E 0%, #3BA36F 31.5%, #C285FF 69.5%, #E2C2FF 100%)",   // Green → Purple
    200: "linear-gradient(135deg, #3369FF 0%, #408CFF 36%, #C285FF 69.5%, #9C59FF 100%)",     // Blue → Purple
    300: "linear-gradient(135deg, #FFADCE 0%, #FF5C5C 36%, #9C59FF 69.5%, #C285FF 100%)",     // Red → Purple
    400: "linear-gradient(135deg, #FFDAC2 0%, #FF8547 36%, #5B1DB8 69.5%, #31007A 100%)",     // Orange → Purple
    500: "linear-gradient(135deg, #FFEFAD 0%, #FFDA75 32.5%, #9C59FF 69.5%, #5B1DB8 100%)",   // Yellow → Purple
  },

  // Red family gradients (end with red)
  red: {
    100: "linear-gradient(135deg, #BCEBB2 0%, #3BA36F 31.5%, #FF5C5C 68%, #FF8599 100%)",     // Green → Red
    200: "linear-gradient(135deg, #CCE4FF 0%, #99C9FF 30.5%, #FF8599 67.5%, #FF5C5C 100%)",   // Blue → Red
    300: "linear-gradient(135deg, #F1E0FF 0%, #C285FF 35.35%, #AE0101 69.73%, #5C0000 100%)", // Purple → Red
    400: "linear-gradient(135deg, #FFAD85 0%, #FF8547 34.5%, #FF5C5C 69.73%, #E90000 100%)",  // Orange → Red
    500: "linear-gradient(135deg, #FFF7D6 0%, #FFEFAD 32%, #FF8599 69%, #FF5C5C 100%)",       // Yellow → Red
  },

  // Yellow family gradients (end with yellow)
  yellow: {
    100: "linear-gradient(135deg, #8EE07E 0%, #BCEBB2 25%, #FFEFAD 67.5%, #FFDA75 100%)",     // Green → Yellow
    200: "linear-gradient(135deg, #408CFF 0%, #99C9FF 31.5%, #FFDA75 67.5%, #FFDA75 100%)",   // Blue → Yellow
    300: "linear-gradient(135deg, #C285FF 0%, #E2C2FF 37.5%, #FFDA75 67.5%, #FFCE47 100%)",   // Purple → Yellow
    400: "linear-gradient(135deg, #FF8599 0%, #FFADCE 36%, #FFDA75 67.5%, #FFCE47 100%)",     // Red → Yellow
    500: "linear-gradient(135deg, #FF8547 0%, #F5580A 0.01%, #FFAD85 36%, #FFDA75 67.5%, #FFCE47 100%)", // Orange → Yellow
  },

  // Orange family gradients (end with orange)
  orange: {
    100: "linear-gradient(135deg, #0E5249 0%, #0A3D2C 33.5%, #F5580A 68.5%, #FFAD85 100%)",   // Green → Orange
    200: "linear-gradient(134.94deg, #99C9FF 15.25%, #408CFF 42.97%, #B83D00 70.69%, #F5580A 84.54%)", // Blue → Orange
    300: "linear-gradient(135deg, #E2C2FF 0%, #C285FF 40%, #F5580A 80%, #B83D00 100%)",       // Purple → Orange
    400: "linear-gradient(134.94deg, #FFADCE 16.07%, #FF5C5C 43.75%, #F5580A 71.42%, #F5580A 85.26%)", // Red → Orange
    500: "linear-gradient(134.94deg, #FFDA75 16.07%, #FFCE47 43.75%, #FF8547 71.42%, #F5580A 85.26%)", // Yellow → Orange
  },

  // Rainbow gradients (multi-color horizontal - 98.15deg angle)
  rainbow: {
    100: "linear-gradient(98.15deg, #EAFFE0 0%, #E5F1FF 19.79%, #F7F2FF 38.54%, #FFEBF4 57.81%, #FFEDE0 78.65%, #FFF7D6 100%)",
    200: "linear-gradient(98.15deg, #DCFAC8 0%, #CCE4FF 19.79%, #F1E0FF 38.54%, #FFD6E9 57.81%, #FFDAC2 78.65%, #FFF7D6 100%)",
    300: "linear-gradient(98.15deg, #BCEBB2 0%, #99C9FF 19.79%, #E2C2FF 38.54%, #FFADCE 57.81%, #FFAD85 78.65%, #FFDA75 100%)",
    400: "linear-gradient(98.15deg, #8EE07E 0%, #408CFF 19.79%, #C285FF 38.54%, #FF8599 57.81%, #FF8547 78.65%, #FFCE47 100%)",
  },

  // Helper gradients (overlays, subtle backgrounds)
  helper: {
    coverOverlay: "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%)",
    subtleGreen: "linear-gradient(180deg, #EAFFE0 0%, #FFFFFF 100%)",
    subtleBlue: "linear-gradient(180deg, #E5F1FF 0%, #FFFFFF 100%)",
    subtlePurple: "linear-gradient(180deg, #F7F2FF 0%, #FFFFFF 100%)",
  },
} as const;

/* ============================================
   SPACING TOKENS
   ============================================ */

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
} as const;

/* ============================================
   TYPOGRAPHY TOKENS
   ============================================ */

export const typography = {
  fontFamily: {
    sans: "'DM Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
  },

  fontSize: {
    display: { size: 72, lineHeight: 72 },
    "heading-lg": { size: 48, lineHeight: 48 },
    "heading-md": { size: 36, lineHeight: 48 },
    "heading-sm": { size: 24, lineHeight: 32 },
    "body-strong": { size: 18, lineHeight: 24 },
    body: { size: 18, lineHeight: 24 },
    "body-sm": { size: 16, lineHeight: 24 },
    "caption-strong": { size: 14, lineHeight: 20 },
    caption: { size: 14, lineHeight: 20 },
    "caption-sm": { size: 12, lineHeight: 16 },
  },

  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

/* ============================================
   BORDER RADIUS TOKENS
   ============================================ */

export const radius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 24,
  full: 9999,
} as const;

/* ============================================
   SHADOW TOKENS
   ============================================ */

export const shadows = {
  none: "none",
  xs: "0 1px 3px 0 rgb(0 0 0 / 0.08)",
  sm: "0 1px 4px 0 rgb(0 0 0 / 0.10), 0 1px 2px -1px rgb(0 0 0 / 0.08)",
  md: "0 4px 8px -1px rgb(0 0 0 / 0.14), 0 2px 4px -2px rgb(0 0 0 / 0.10)",
  lg: "0 10px 20px -3px rgb(0 0 0 / 0.16), 0 4px 8px -4px rgb(0 0 0 / 0.10)",
  xl: "0 20px 32px -5px rgb(0 0 0 / 0.18), 0 8px 14px -6px rgb(0 0 0 / 0.12)",
  "2xl": "0 25px 56px -12px rgb(0 0 0 / 0.28)",
  inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.10)",
  card: "0 1px 3px 0 rgb(0 0 0 / 0.07), 0 2px 6px -1px rgb(0 0 0 / 0.08)",
  "card-hover": "0 2px 4px 0 rgb(0 0 0 / 0.08), 0 6px 16px -2px rgb(0 0 0 / 0.14)",
  elevated: "0 2px 4px 0 rgb(0 0 0 / 0.08), 0 6px 20px -2px rgb(0 0 0 / 0.16)",
  dropdown: "0 2px 6px 0 rgb(0 0 0 / 0.08), 0 10px 24px -4px rgb(0 0 0 / 0.18)",
  tooltip: "0 2px 4px 0 rgb(0 0 0 / 0.10), 0 6px 20px -2px rgb(0 0 0 / 0.18)",
  modal: "0 4px 10px 0 rgb(0 0 0 / 0.10), 0 28px 64px -12px rgb(0 0 0 / 0.28)",
  button: "0 1px 3px 0 rgb(0 0 0 / 0.10)",
  "button-active": "inset 0 2px 4px 0 rgb(0 0 0 / 0.16)",
} as const;

/* ============================================
   MOTION TOKENS
   ============================================ */

export const motion = {
  duration: {
    instant: 0,
    fastest: 50,
    fast: 100,
    normal: 200,
    slow: 300,
    slower: 400,
    slowest: 500,
  },

  easing: {
    linear: "linear",
    default: "cubic-bezier(0.4, 0, 0.2, 1)",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    emphasized: "cubic-bezier(0.2, 0, 0, 1)",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  },

  // For Framer Motion
  framerSpring: {
    stiff: { type: "spring", stiffness: 400, damping: 30 },
    gentle: { type: "spring", stiffness: 120, damping: 14 },
    bouncy: { type: "spring", stiffness: 500, damping: 20, mass: 1 },
  },

  distance: {
    xs: 2,
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
  },
} as const;

/* ============================================
   Z-INDEX TOKENS
   ============================================ */

export const zIndex = {
  behind: -1,
  base: 0,
  raised: 1,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
  max: 9999,
} as const;

/* ============================================
   BREAKPOINTS
   ============================================ */

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

/* ============================================
   ATS-SPECIFIC TOKENS
   ============================================ */

export const pipeline = {
  stages: {
    applied: {
      background: colors.neutral[100],
      foreground: colors.neutral[600],
    },
    screening: {
      background: colors.blue[100],
      foreground: colors.blue[600],
    },
    interview: {
      background: colors.purple[100],
      foreground: colors.purple[600],
    },
    offer: {
      background: colors.yellow[100],
      foreground: colors.yellow[700],
    },
    hired: {
      background: colors.primary[100],
      foreground: colors.primary[700],
    },
    rejected: {
      background: colors.red[100],
      foreground: colors.red[600],
    },
  },
} as const;

export const matchScore = {
  thresholds: {
    high: { min: 80, max: 100 },
    medium: { min: 50, max: 79 },
    low: { min: 0, max: 49 },
  },
  colors: {
    high: {
      background: colors.primary[100],
      foreground: colors.primary[700],
    },
    medium: {
      background: colors.yellow[100],
      foreground: colors.yellow[700],
    },
    low: {
      background: colors.orange[100],
      foreground: colors.orange[600],
    },
  },
} as const;

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

/**
 * Get match score level from numeric score
 */
export function getMatchLevel(score: number): "high" | "medium" | "low" {
  if (score >= matchScore.thresholds.high.min) return "high";
  if (score >= matchScore.thresholds.medium.min) return "medium";
  return "low";
}

/**
 * Get match score colors from numeric score
 */
export function getMatchColors(score: number) {
  const level = getMatchLevel(score);
  return matchScore.colors[level];
}

/**
 * Check if viewport matches breakpoint
 */
export function matchesBreakpoint(
  breakpoint: keyof typeof breakpoints,
  direction: "up" | "down" = "up"
): boolean {
  if (typeof window === "undefined") return false;
  const width = window.innerWidth;
  return direction === "up"
    ? width >= breakpoints[breakpoint]
    : width < breakpoints[breakpoint];
}

/**
 * Get CSS variable value at runtime
 */
export function getCSSVariable(name: string): string {
  if (typeof window === "undefined") return "";
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

/**
 * Set CSS variable at runtime (for theming)
 */
export function setCSSVariable(name: string, value: string): void {
  if (typeof document === "undefined") return;
  document.documentElement.style.setProperty(name, value);
}
