/**
 * Gradient Utility for Collection Cards
 *
 * Dynamically selects gradients based on pathway combinations.
 * Uses the complete gradient system from Figma (35 gradients across 6 families).
 *
 * Strategy:
 * 1. Normalize pathway order (alphabetical sort)
 * 2. Map pathways to color families
 * 3. If same family → use within-family gradient
 * 4. If different families → use dual-family gradient from lookup table
 * 5. Fallback to default gradient if no pathways
 */

import { PathwayType } from "@/components/ui/pathway-tag";

type ColorFamily = "green" | "blue" | "orange" | "red" | "yellow" | "purple";

/** Map pathway to its color family */
const pathwayToFamily: Record<PathwayType, ColorFamily> = {
  // Green family
  agriculture: "green",
  finance: "green",
  forestry: "green",
  transportation: "green",
  "waste-management": "green",

  // Blue family
  conservation: "blue",
  research: "blue",
  sports: "blue",
  water: "blue",

  // Orange family
  construction: "orange",
  manufacturing: "orange",
  "real-estate": "orange",
  "urban-planning": "orange",

  // Red family
  education: "red",
  medical: "red",
  tourism: "red",

  // Yellow family
  energy: "yellow",
  technology: "yellow",

  // Purple family
  "arts-culture": "purple",
  media: "purple",
  policy: "purple",
};

/**
 * Same-family gradient defaults
 * When both pathways belong to the same color family
 */
const sameFamilyGradients: Record<ColorFamily, string> = {
  green: "var(--gradient-green-100)",    // Blue → Green
  blue: "var(--gradient-blue-100)",      // Green → Blue
  orange: "var(--gradient-orange-200)",  // Blue → Orange
  red: "var(--gradient-red-100)",        // Green → Red
  yellow: "var(--gradient-yellow-100)",  // Green → Yellow
  purple: "var(--gradient-purple-200)",  // Blue → Purple
};

/**
 * Dual-family gradient mapping table
 *
 * How to read: Row = First family (after sorting), Column = Second family
 * Returns the CSS variable for the appropriate gradient
 *
 * Gradient naming: gradient-{ending-color}-{variant}
 * Variant indicates starting color family:
 * - 100: Opposite end of spectrum (blue/green)
 * - 200: Purple
 * - 300: Red
 * - 400: Orange
 * - 500: Yellow
 */
const dualFamilyGradients: Record<ColorFamily, Record<ColorFamily, string>> = {
  green: {
    green: "var(--gradient-green-100)",
    blue: "var(--gradient-blue-100)",      // Green → Blue
    orange: "var(--gradient-orange-100)",  // Green → Orange
    red: "var(--gradient-red-100)",        // Green → Red
    yellow: "var(--gradient-yellow-100)",  // Green → Yellow
    purple: "var(--gradient-purple-100)",  // Green → Purple
  },
  blue: {
    green: "var(--gradient-blue-100)",     // Green → Blue (normalized)
    blue: "var(--gradient-blue-100)",
    orange: "var(--gradient-orange-200)",  // Blue → Orange
    red: "var(--gradient-red-200)",        // Blue → Red
    yellow: "var(--gradient-yellow-200)",  // Blue → Yellow
    purple: "var(--gradient-purple-200)",  // Blue → Purple
  },
  orange: {
    green: "var(--gradient-orange-100)",   // Green → Orange (normalized)
    blue: "var(--gradient-orange-200)",    // Blue → Orange (normalized)
    orange: "var(--gradient-orange-200)",
    red: "var(--gradient-orange-400)",     // Red → Orange
    yellow: "var(--gradient-orange-500)",  // Yellow → Orange
    purple: "var(--gradient-orange-300)",  // Purple → Orange
  },
  red: {
    green: "var(--gradient-red-100)",      // Green → Red (normalized)
    blue: "var(--gradient-red-200)",       // Blue → Red (normalized)
    orange: "var(--gradient-orange-400)",  // Red → Orange (normalized)
    red: "var(--gradient-red-100)",
    yellow: "var(--gradient-yellow-400)",  // Red → Yellow
    purple: "var(--gradient-purple-300)",  // Red → Purple
  },
  yellow: {
    green: "var(--gradient-yellow-100)",   // Green → Yellow (normalized)
    blue: "var(--gradient-yellow-200)",    // Blue → Yellow (normalized)
    orange: "var(--gradient-orange-500)",  // Yellow → Orange (normalized)
    red: "var(--gradient-yellow-400)",     // Red → Yellow (normalized)
    yellow: "var(--gradient-yellow-100)",
    purple: "var(--gradient-purple-500)",  // Yellow → Purple
  },
  purple: {
    green: "var(--gradient-purple-100)",   // Green → Purple (normalized)
    blue: "var(--gradient-purple-200)",    // Blue → Purple (normalized)
    orange: "var(--gradient-orange-300)",  // Purple → Orange (normalized)
    red: "var(--gradient-purple-300)",     // Red → Purple (normalized)
    yellow: "var(--gradient-purple-500)",  // Yellow → Purple (normalized)
    purple: "var(--gradient-purple-200)",
  },
};

/** Fallback gradient if no pathways provided */
const FALLBACK_GRADIENT = "var(--gradient-green-100)";

export interface GradientConfig {
  /** Pathways in this collection */
  pathways: PathwayType[];
}

/**
 * Get the appropriate gradient for a collection card
 *
 * Algorithm:
 * 1. Normalize pathway order (alphabetical sort)
 * 2. Map pathways to color families
 * 3. If same family → use same-family gradient
 * 4. If different families → lookup in dual-family table
 * 5. If no valid pathways → use fallback
 *
 * @example
 * // Same family
 * getCollectionGradient({ pathways: ["energy", "technology"] })
 * // Returns: "var(--gradient-yellow-100)"
 *
 * @example
 * // Different families (order normalized)
 * getCollectionGradient({ pathways: ["agriculture", "energy"] })
 * getCollectionGradient({ pathways: ["energy", "agriculture"] })
 * // Both return: "var(--gradient-yellow-100)" (green → yellow)
 *
 * @example
 * // Different families
 * getCollectionGradient({ pathways: ["construction", "water"] })
 * // Returns: "var(--gradient-orange-200)" (blue → orange)
 */
export function getCollectionGradient(config: GradientConfig): string {
  if (!config.pathways || config.pathways.length === 0) {
    return FALLBACK_GRADIENT;
  }

  // Step 1: Normalize pathway order (alphabetical)
  const sortedPathways = [...config.pathways].sort();

  // Step 2: Map to color families
  const families = sortedPathways
    .map((pathway) => pathwayToFamily[pathway])
    .filter(Boolean); // Remove any undefined values

  if (families.length === 0) {
    return FALLBACK_GRADIENT;
  }

  // Get first two families (or first if only one pathway)
  const [family1, family2] = families;

  // Step 3: Same family case
  if (!family2 || family1 === family2) {
    return sameFamilyGradients[family1];
  }

  // Step 4: Dual family case - lookup in table
  return dualFamilyGradients[family1][family2] || FALLBACK_GRADIENT;
}

/**
 * Get gradient from pathway names (convenience helper)
 * Filters out invalid pathway names automatically
 *
 * @example
 * getGradientFromPathways(["agriculture", "invalid", "energy"])
 * // Returns: "var(--gradient-yellow-100)" (ignores "invalid")
 */
export function getGradientFromPathways(pathways: string[]): string {
  const validPathways = pathways.filter(
    (p): p is PathwayType => p in pathwayToFamily
  );
  return getCollectionGradient({ pathways: validPathways });
}

/**
 * Get color family for a pathway (utility for debugging/testing)
 */
export function getPathwayFamily(pathway: PathwayType): ColorFamily | undefined {
  return pathwayToFamily[pathway];
}

/**
 * Get all pathways for a given color family (utility)
 */
export function getPathwaysByFamily(family: ColorFamily): PathwayType[] {
  return (Object.entries(pathwayToFamily) as [PathwayType, ColorFamily][])
    .filter(([_, f]) => f === family)
    .map(([pathway]) => pathway);
}
