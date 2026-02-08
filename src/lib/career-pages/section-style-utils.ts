/**
 * Section Style Utilities — resolves per-section style overrides into CSS values.
 *
 * Each career page section can have optional `style` overrides. This utility
 * merges those overrides with theme defaults and returns concrete CSS values
 * ready for inline styles and className usage.
 */

import type { SectionStyle, CareerPageTheme } from "./types";

export interface ResolvedSectionStyle {
  /** Background color (hex) */
  backgroundColor: string;
  /** Primary text color (hex) */
  textColor: string;
  /** Heading text color (hex) — slightly stronger than body */
  headingColor: string;
  /** Muted/secondary text color (hex) */
  mutedTextColor: string;
  /** Whether text color was auto-detected from background luminance */
  textColorIsAuto: boolean;
  /** Tailwind padding classes */
  paddingClass: string;
  /** Tailwind text-align class */
  textAlignClass: string;
  /** Tailwind max-width class for inner container */
  maxWidthClass: string;
}

/* ------------------------------------------------------------------ */
/* Color luminance helpers                                             */
/* ------------------------------------------------------------------ */

/** Parse hex color to RGB tuple */
function hexToRgb(hex: string): [number, number, number] {
  const cleaned = hex.replace("#", "");
  const full =
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((c) => c + c)
          .join("")
      : cleaned;
  const num = parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/** Calculate relative luminance (WCAG 2.0 formula) */
function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Determine if a background color is "dark" (needs white text) */
function isDarkBackground(hex: string): boolean {
  return relativeLuminance(hex) < 0.35;
}

/** Lighten or darken a hex color by a factor */
function adjustColor(hex: string, factor: number): string {
  const [r, g, b] = hexToRgb(hex);
  const adjust = (c: number) => Math.min(255, Math.max(0, Math.round(c + factor * 255)));
  const toHex = (c: number) => c.toString(16).padStart(2, "0");
  return `#${toHex(adjust(r))}${toHex(adjust(g))}${toHex(adjust(b))}`;
}

/* ------------------------------------------------------------------ */
/* Padding presets                                                     */
/* ------------------------------------------------------------------ */

const PADDING_MAP: Record<NonNullable<SectionStyle["padding"]>, string> = {
  compact: "px-6 py-8 md:py-10",
  default: "px-6 py-12 md:py-16",
  spacious: "px-6 py-16 md:py-24",
};

/* ------------------------------------------------------------------ */
/* Max-width presets                                                   */
/* ------------------------------------------------------------------ */

const MAX_WIDTH_MAP: Record<NonNullable<SectionStyle["maxWidth"]>, string> = {
  narrow: "max-w-3xl",
  default: "max-w-5xl",
  wide: "max-w-7xl",
  full: "max-w-none",
};

/* ------------------------------------------------------------------ */
/* Text-align presets                                                  */
/* ------------------------------------------------------------------ */

const TEXT_ALIGN_MAP: Record<NonNullable<SectionStyle["textAlign"]>, string> = {
  left: "text-left",
  center: "text-center",
};

/* ------------------------------------------------------------------ */
/* Main resolver                                                       */
/* ------------------------------------------------------------------ */

/**
 * Resolve a section's style overrides + theme into concrete CSS values.
 *
 * @param style - Per-section style overrides (may be undefined)
 * @param theme - The career page theme (brand palette)
 * @param defaultBg - Default background for this section type (e.g. theme.primaryColor for hero)
 */
export function resolveSectionStyle(
  style: SectionStyle | undefined,
  theme: CareerPageTheme,
  defaultBg: string = "#FFFFFF"
): ResolvedSectionStyle {
  // Background
  const backgroundColor = style?.backgroundColor || defaultBg;

  // Auto-detect text color from background luminance
  const dark = isDarkBackground(backgroundColor);
  const autoTextColor = dark ? "#FFFFFF" : "#1F1D1C";
  const autoHeadingColor = dark ? "#FFFFFF" : "#1F1D1C";
  const autoMutedColor = dark ? "rgba(255, 255, 255, 0.7)" : "rgba(31, 29, 28, 0.6)";

  // Use explicit text color if set, otherwise auto-detect
  const textColorIsAuto = !style?.textColor;
  const textColor = style?.textColor || autoTextColor;
  const headingColor = style?.textColor || autoHeadingColor;
  const mutedTextColor = style?.textColor
    ? adjustColor(style.textColor, dark ? -0.3 : 0.3)
    : autoMutedColor;

  // Padding
  const padding = style?.padding || theme.defaultSectionPadding || "default";
  const paddingClass = PADDING_MAP[padding];

  // Text alignment
  const textAlignClass = TEXT_ALIGN_MAP[style?.textAlign || "center"];

  // Max width
  const maxWidthClass = MAX_WIDTH_MAP[style?.maxWidth || "default"];

  return {
    backgroundColor,
    textColor,
    headingColor,
    mutedTextColor,
    textColorIsAuto,
    paddingClass,
    textAlignClass,
    maxWidthClass,
  };
}

/**
 * Style presets — one-click section style templates.
 * These reference the brand theme so they stay consistent.
 */
export function getStylePresets(
  theme: CareerPageTheme
): Array<{ id: string; label: string; style: SectionStyle; dotColor: string }> {
  return [
    {
      id: "light",
      label: "Light",
      style: { backgroundColor: "#FFFFFF" },
      dotColor: "#FFFFFF",
    },
    {
      id: "dark",
      label: "Dark",
      style: { backgroundColor: "#1F1D1C", textColor: "#FFFFFF" },
      dotColor: "#1F1D1C",
    },
    {
      id: "brand",
      label: "Brand",
      style: { backgroundColor: theme.primaryColor, textColor: "#FFFFFF" },
      dotColor: theme.primaryColor,
    },
    {
      id: "subtle",
      label: "Subtle",
      style: { backgroundColor: "#FAF9F7" },
      dotColor: "#FAF9F7",
    },
  ];
}
