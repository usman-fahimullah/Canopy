/**
 * Career Page Fonts — Curated Google Font list with loading utilities.
 *
 * We provide a curated set of fonts rather than all 1500+ Google Fonts
 * to keep the UX simple and ensure reliable loading.
 */

export interface CareerPageFont {
  name: string;
  category: "sans-serif" | "serif" | "monospace" | "system";
  googleFont: boolean;
  /** Override value for CSS (e.g. "system-ui" instead of font name) */
  value?: string;
}

export const CAREER_PAGE_FONTS: CareerPageFont[] = [
  // Sans Serif
  { name: "DM Sans", category: "sans-serif", googleFont: true },
  { name: "Inter", category: "sans-serif", googleFont: true },
  { name: "Plus Jakarta Sans", category: "sans-serif", googleFont: true },
  { name: "Outfit", category: "sans-serif", googleFont: true },
  { name: "Space Grotesk", category: "sans-serif", googleFont: true },
  { name: "Montserrat", category: "sans-serif", googleFont: true },
  { name: "Poppins", category: "sans-serif", googleFont: true },
  { name: "Raleway", category: "sans-serif", googleFont: true },

  // Serif
  { name: "Playfair Display", category: "serif", googleFont: true },
  { name: "Merriweather", category: "serif", googleFont: true },
  { name: "Lora", category: "serif", googleFont: true },
  { name: "Source Serif 4", category: "serif", googleFont: true },

  // Monospace
  { name: "JetBrains Mono", category: "monospace", googleFont: true },

  // System
  {
    name: "System Default",
    category: "system",
    googleFont: false,
    value: "system-ui, -apple-system, sans-serif",
  },
];

/** Get the CSS font-family value for a font name */
export function getFontValue(fontName: string): string {
  const font = CAREER_PAGE_FONTS.find((f) => f.name === fontName);
  if (font?.value) return font.value;

  // Wrap in quotes if the name contains spaces
  const quoted = fontName.includes(" ") ? `"${fontName}"` : fontName;

  // Add generic fallback based on category
  const fallback =
    font?.category === "serif"
      ? "serif"
      : font?.category === "monospace"
        ? "monospace"
        : "sans-serif";

  return `${quoted}, ${fallback}`;
}

/**
 * Generate a Google Fonts API URL for the given font names.
 * Only includes fonts that are in our curated list and are Google Fonts.
 */
export function getGoogleFontsUrl(fontNames: string[]): string {
  const uniqueNames = Array.from(new Set(fontNames));
  const googleFonts = uniqueNames.filter((name) =>
    CAREER_PAGE_FONTS.find((f) => f.name === name && f.googleFont)
  );

  if (googleFonts.length === 0) return "";

  const families = googleFonts
    .map((name) => name.replace(/ /g, "+") + ":wght@400;500;600;700")
    .join("&family=");

  return `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
}

/**
 * Generate Google Fonts URL for ALL curated fonts.
 * Used in the editor settings panel so font dropdown previews render correctly.
 */
export function getAllFontsPreloadUrl(): string {
  const allGoogleFonts = CAREER_PAGE_FONTS.filter((f) => f.googleFont).map((f) => f.name);
  return getGoogleFontsUrl(allGoogleFonts);
}

/** Group fonts by category for dropdown rendering */
export function getFontsByCategory(): Array<{
  category: string;
  label: string;
  fonts: CareerPageFont[];
}> {
  return [
    {
      category: "sans-serif",
      label: "Sans Serif",
      fonts: CAREER_PAGE_FONTS.filter((f) => f.category === "sans-serif"),
    },
    {
      category: "serif",
      label: "Serif",
      fonts: CAREER_PAGE_FONTS.filter((f) => f.category === "serif"),
    },
    {
      category: "monospace",
      label: "Monospace",
      fonts: CAREER_PAGE_FONTS.filter((f) => f.category === "monospace"),
    },
    {
      category: "system",
      label: "System",
      fonts: CAREER_PAGE_FONTS.filter((f) => f.category === "system"),
    },
  ];
}
