# Gradient Mapping Strategy for Collection Cards

**Status:** Proposal for Review
**Date:** 2025-01-28

---

## Overview

This document outlines the recommended strategy for dynamically selecting gradients for collection cards based on pathway combinations. All 35 gradients from Figma have been implemented in the design system.

---

## Gradient Inventory

### Available Gradients by Family

| Family | Variants | Pattern |
|--------|----------|---------|
| Green | 100-500 | Blue/Purple/Red/Orange/Yellow → Green |
| Blue | 100-500 | Green/Purple/Red/Orange/Yellow → Blue |
| Purple | 100-500 | Green/Blue/Red/Orange/Yellow → Purple |
| Red | 100-500 | Green/Blue/Purple/Orange/Yellow → Red |
| Yellow | 100-500 | Green/Blue/Purple/Red/Orange → Yellow |
| Orange | 100-500 | Green/Blue/Purple/Red/Yellow → Orange |
| Rainbow | 100-400 | Multi-color horizontal (reserved for other UI) |

**Total:** 30 collection-eligible gradients (6 families × 5 variants)

---

## Pathway Color Family Mapping

From `pathway-tag.tsx`:

| Color Family | Pathways |
|--------------|----------|
| **Green** (6) | Agriculture, Finance, Forestry, Transportation, Waste Management |
| **Blue** (4) | Conservation, Research, Sports, Water |
| **Orange** (4) | Construction, Manufacturing, Real Estate, Urban Planning |
| **Red** (3) | Education, Medical, Tourism |
| **Yellow** (2) | Energy, Technology |
| **Purple** (3) | Arts & Culture, Media, Policy |

**Total:** 21 pathways across 6 families

---

## Recommendations

### 1. Order Normalization

**Recommendation: Option B — Normalize pathway order (order doesn't matter)**

**Rationale:**
- Collections are conceptual groupings, not directional relationships
- "Energy + Agriculture" and "Agriculture + Energy" should feel identical
- Eliminates confusion about which pathway to list first
- Reduces cognitive load for content creators
- Creates consistency: same pathways always produce same gradient

**Implementation:**
```typescript
// Always sort alphabetically before mapping
const normalizedPathways = pathways.sort();
```

**Example:**
```typescript
["energy", "agriculture"] → normalized to ["agriculture", "energy"]
["agriculture", "energy"] → normalized to ["agriculture", "energy"]
// Both produce: gradient-yellow-100 (green → yellow)
```

---

### 2. Same-Family Handling

**Recommendation: Option B — Within-family variation (use complementary end color)**

**Rationale:**
- Creates visual cohesion when pathways are closely related
- Avoids jarring color jumps (e.g., green job collection with orange gradient)
- Feels more semantically aligned with the pathway family
- Still provides subtle visual distinction through gradient transition

**Implementation:**
For same-family collections, use the "default" within-family gradient that starts and ends with shades of that family's color.

**Mapping:**

| Family | Same-Family Gradient | CSS Variable |
|--------|---------------------|--------------|
| Green | Green 100 (Blue → Green) | `--gradient-green-100` |
| Blue | Blue 100 (Green → Blue) | `--gradient-blue-100` |
| Orange | Orange 200 (Blue → Orange) | `--gradient-orange-200` |
| Red | Red 100 (Green → Red) | `--gradient-red-100` |
| Yellow | Yellow 100 (Green → Yellow) | `--gradient-yellow-100` |
| Purple | Purple 200 (Blue → Purple) | `--gradient-purple-200` |

**Rationale for specific choices:**
- Green/Blue: Use variant 100 (most common starting points)
- Orange: Use variant 200 (blue → orange feels more natural than green → orange for construction/real estate)
- Red: Use variant 100 (green → red creates nice contrast for education/medical)
- Yellow: Use variant 100 (green → yellow works well for energy/tech)
- Purple: Use variant 200 (blue → purple better than green → purple for arts/media/policy)

**Example:**
```typescript
// Collection: "Renewable Energy Jobs"
pathways: ["energy", "technology"] // Both yellow family

// Result: gradient-yellow-100 (green → yellow)
// Creates visual unity while still being vibrant
```

---

### 3. Curated Collections

**Recommendation: Start with 4 curated presets, then expand based on usage**

**Initial Curated List:**

| Collection Slug | Display Name | Pathways | Custom Gradient | Rationale |
|-----------------|--------------|----------|-----------------|-----------|
| `urban-dwellers` | Urban Dwellers | Urban Planning, Construction | Custom peach gradient | Existing brand gradient |
| `planet-solutions` | Planet-wide Solutions | Conservation, Forestry | `--gradient-green-100` | Sponsored by 3x5 World |
| `game-time` | It's Game Time | Sports, Research | `--gradient-blue-200` | Distinctive purple-blue |
| `knowledge-builders` | Knowledge Builders | Education, Research | `--gradient-purple-300` | Pink-purple academic feel |

**Custom Gradient Definition:**
```css
/* Urban Dwellers - Keep existing custom gradient */
--gradient-urban-dwellers: linear-gradient(135deg, #FFB3BA 0%, #FFDFBA 100%);
```

**Future Expansion:**
- Monitor which collection pathways are most common
- Add curated presets for top 10 most-viewed collections
- Allow admin override in CMS for special campaigns

---

### 4. Dual-Family Gradient Selection Algorithm

**Recommendation: Hybrid system with priority hierarchy**

**Priority Order:**
1. **Curated preset** (if collection slug matches)
2. **Same-family** (if both pathways from same color family)
3. **Dual-family** (if pathways from different families)
4. **Fallback** (if no pathways provided)

**Dual-Family Mapping Table:**

This table shows which gradient to use when combining pathways from two different color families.

**How to read:** Find Family A (first pathway after sorting) in the left column, Family B (second pathway) in the top row. The cell shows the gradient to use.

|   | Green | Blue | Orange | Red | Yellow | Purple |
|---|-------|------|--------|-----|--------|--------|
| **Green** | green-100 | blue-100 | orange-100 | red-100 | yellow-100 | purple-100 |
| **Blue** | blue-100 | blue-100 | orange-200 | red-200 | yellow-200 | purple-200 |
| **Orange** | orange-100 | orange-200 | orange-200 | orange-400 | orange-500 | orange-300 |
| **Red** | red-100 | red-200 | orange-400 | red-100 | yellow-400 | purple-300 |
| **Yellow** | yellow-100 | yellow-200 | orange-500 | yellow-400 | yellow-100 | purple-500 |
| **Purple** | purple-100 | purple-200 | orange-300 | purple-300 | purple-500 | purple-200 |

**Gradient Variant Selection Logic:**

The variant number (100-500) indicates which color family the gradient **starts** from:
- **100**: Starts with opposite end of spectrum (e.g., green-100 starts with blue)
- **200**: Starts with purple
- **300**: Starts with red
- **400**: Starts with orange
- **500**: Starts with yellow

**Example Mappings:**

```typescript
// Example 1: Agriculture (green) + Energy (yellow)
// Alphabetical order: ["agriculture", "energy"]
// Families: green + yellow
// Lookup: green row, yellow column → yellow-100
// Result: gradient-yellow-100 (green → yellow)

// Example 2: Construction (orange) + Conservation (blue)
// Alphabetical order: ["conservation", "construction"]
// Families: blue + orange
// Lookup: blue row, orange column → orange-200
// Result: gradient-orange-200 (blue → orange)

// Example 3: Education (red) + Technology (yellow)
// Alphabetical order: ["education", "technology"]
// Families: red + yellow
// Lookup: red row, yellow column → yellow-400
// Result: gradient-yellow-400 (red → yellow)

// Example 4: Sports (blue) + Sports (blue) — Same family
// Both blue family
// Uses same-family rule → blue-100
// Result: gradient-blue-100 (green → blue)
```

---

## Implementation Plan

### Phase 1: Utility Function

Create `/src/lib/gradient-utils.ts`:

```typescript
import { PathwayType } from "@/components/ui/pathway-tag";

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

type ColorFamily = "green" | "blue" | "orange" | "red" | "yellow" | "purple";

/** Curated preset gradients for specific collections */
const curatedGradients: Record<string, string> = {
  "urban-dwellers": "var(--gradient-urban-dwellers)",
  "planet-solutions": "var(--gradient-green-100)",
  "game-time": "var(--gradient-blue-200)",
  "knowledge-builders": "var(--gradient-purple-300)",
};

/** Same-family gradient defaults */
const sameFamilyGradients: Record<ColorFamily, string> = {
  green: "var(--gradient-green-100)",
  blue: "var(--gradient-blue-100)",
  orange: "var(--gradient-orange-200)",
  red: "var(--gradient-red-100)",
  yellow: "var(--gradient-yellow-100)",
  purple: "var(--gradient-purple-200)",
};

/** Dual-family gradient mapping table */
const dualFamilyGradients: Record<ColorFamily, Record<ColorFamily, string>> = {
  green: {
    green: "var(--gradient-green-100)",
    blue: "var(--gradient-blue-100)",
    orange: "var(--gradient-orange-100)",
    red: "var(--gradient-red-100)",
    yellow: "var(--gradient-yellow-100)",
    purple: "var(--gradient-purple-100)",
  },
  blue: {
    green: "var(--gradient-blue-100)",
    blue: "var(--gradient-blue-100)",
    orange: "var(--gradient-orange-200)",
    red: "var(--gradient-red-200)",
    yellow: "var(--gradient-yellow-200)",
    purple: "var(--gradient-purple-200)",
  },
  orange: {
    green: "var(--gradient-orange-100)",
    blue: "var(--gradient-orange-200)",
    orange: "var(--gradient-orange-200)",
    red: "var(--gradient-orange-400)",
    yellow: "var(--gradient-orange-500)",
    purple: "var(--gradient-orange-300)",
  },
  red: {
    green: "var(--gradient-red-100)",
    blue: "var(--gradient-red-200)",
    orange: "var(--gradient-orange-400)",
    red: "var(--gradient-red-100)",
    yellow: "var(--gradient-yellow-400)",
    purple: "var(--gradient-purple-300)",
  },
  yellow: {
    green: "var(--gradient-yellow-100)",
    blue: "var(--gradient-yellow-200)",
    orange: "var(--gradient-orange-500)",
    red: "var(--gradient-yellow-400)",
    yellow: "var(--gradient-yellow-100)",
    purple: "var(--gradient-purple-500)",
  },
  purple: {
    green: "var(--gradient-purple-100)",
    blue: "var(--gradient-purple-200)",
    orange: "var(--gradient-orange-300)",
    red: "var(--gradient-purple-300)",
    yellow: "var(--gradient-purple-500)",
    purple: "var(--gradient-purple-200)",
  },
};

/** Fallback gradient if no pathways provided */
const FALLBACK_GRADIENT = "var(--gradient-green-100)";

export interface GradientConfig {
  /** Pathways in this collection */
  pathways?: PathwayType[];
  /** Collection slug (for curated presets) */
  slug?: string;
  /** Custom gradient override */
  customGradient?: string;
}

/**
 * Get the appropriate gradient for a collection card
 *
 * Priority:
 * 1. Custom gradient override
 * 2. Curated preset (by slug)
 * 3. Same-family gradient (if both pathways from same family)
 * 4. Dual-family gradient (lookup table)
 * 5. Fallback gradient
 */
export function getCollectionGradient(config: GradientConfig): string {
  // Priority 1: Custom override
  if (config.customGradient) {
    return config.customGradient;
  }

  // Priority 2: Curated preset
  if (config.slug && curatedGradients[config.slug]) {
    return curatedGradients[config.slug];
  }

  // Priority 3-4: Pathway-based selection
  if (config.pathways && config.pathways.length > 0) {
    // Normalize pathway order (alphabetical)
    const sortedPathways = [...config.pathways].sort();
    const families = sortedPathways
      .map((p) => pathwayToFamily[p])
      .filter(Boolean);

    if (families.length === 0) {
      return FALLBACK_GRADIENT;
    }

    // Get first two families (or first if only one pathway)
    const [family1, family2] = families;

    // Same family
    if (!family2 || family1 === family2) {
      return sameFamilyGradients[family1];
    }

    // Dual family
    return dualFamilyGradients[family1][family2] || FALLBACK_GRADIENT;
  }

  // Priority 5: Fallback
  return FALLBACK_GRADIENT;
}

/**
 * Get gradient from pathway names (helper)
 */
export function getGradientFromPathways(pathways: string[]): string {
  const validPathways = pathways.filter(
    (p): p is PathwayType => p in pathwayToFamily
  );
  return getCollectionGradient({ pathways: validPathways });
}
```

### Phase 2: Collection Card Component

Update `/src/components/ui/collection-card.tsx` to use the gradient utility:

```typescript
import { getCollectionGradient } from "@/lib/gradient-utils";
import { PathwayType } from "@/components/ui/pathway-tag";

interface CollectionCardProps {
  title: string;
  jobCount: number;
  pathways: PathwayType[];
  slug?: string;
  customGradient?: string;
  // ... other props
}

export function CollectionCard({
  title,
  jobCount,
  pathways,
  slug,
  customGradient,
}: CollectionCardProps) {
  const gradient = getCollectionGradient({
    pathways,
    slug,
    customGradient,
  });

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6"
      style={{ background: gradient }}
    >
      {/* Card content */}
    </div>
  );
}
```

---

## Testing Matrix

| Test Case | Pathways | Expected Gradient | Reason |
|-----------|----------|-------------------|--------|
| Curated: Urban Dwellers | Urban Planning, Construction | `gradient-urban-dwellers` | Preset override |
| Curated: Planet Solutions | Conservation, Forestry | `gradient-green-100` | Preset (green family) |
| Same family | Energy, Technology | `gradient-yellow-100` | Both yellow |
| Dual family | Agriculture, Energy | `yellow-100` | green + yellow |
| Dual family | Construction, Water | `orange-200` | blue + orange |
| Dual family | Education, Media | `purple-300` | purple + red |
| Single pathway | Conservation | `blue-100` | Single blue pathway |
| Order test | Energy, Agriculture | `yellow-100` | Normalized to [agriculture, energy] |
| Order test | Agriculture, Energy | `yellow-100` | Same as above |
| Empty pathways | [] | `green-100` | Fallback |

---

## Benefits of This Strategy

### 1. Predictability
- Same pathways always produce same gradient
- Order doesn't matter
- Clear rules for all scenarios

### 2. Consistency
- Gradients match pathway semantic meaning
- Same-family collections feel cohesive
- Cross-family combinations create visual interest

### 3. Flexibility
- Curated overrides for special collections
- Custom gradients for one-offs
- Easy to add new curated presets

### 4. Scalability
- Works with any pathway combination
- No manual gradient assignment needed
- Algorithm handles edge cases

### 5. Maintainability
- Single source of truth in `gradient-utils.ts`
- Lookup table makes logic transparent
- Easy to test and validate

---

## Open Questions

1. **Additional curated presets**: Should we add more than 4 initially?
   - Recommendation: Start with 4, add more based on analytics

2. **Admin override UI**: Should CMS allow gradient customization per collection?
   - Recommendation: Yes, for special campaigns/sponsors

3. **Seasonal variations**: Different gradients for same collection in different seasons?
   - Recommendation: Not initially, revisit in Phase 2

4. **A/B testing**: Test different gradient mappings for engagement?
   - Recommendation: Yes, after initial launch

---

## Next Steps

1. **Review this proposal** with design team
2. **Finalize dual-family mapping table** (verify all combinations look good)
3. **Implement `gradient-utils.ts`**
4. **Update Collection Card component**
5. **Create Storybook stories** for all test cases
6. **Document in design system**

---

## Appendix: Gradient Visual Reference

### Green Family
- **100**: Blue → Green (Conservation + Forestry vibes)
- **200**: Purple → Green (Arts + Nature)
- **300**: Red → Green (Education + Environment)
- **400**: Orange → Green (Construction + Sustainability)
- **500**: Yellow → Green (Energy + Nature)

### Blue Family
- **100**: Green → Blue (Nature + Research)
- **200**: Purple → Blue (Arts + Science)
- **300**: Red → Blue (Healthcare + Research)
- **400**: Orange → Blue (Construction + Water)
- **500**: Yellow → Blue (Energy + Innovation)

### Orange Family
- **100**: Green → Orange (Sustainability + Built Environment)
- **200**: Blue → Orange (Research + Construction)
- **300**: Purple → Orange (Arts + Urban Planning)
- **400**: Red → Orange (Education + Construction)
- **500**: Yellow → Orange (Energy + Construction)

### Red Family
- **100**: Green → Red (Agriculture + Education)
- **200**: Blue → Red (Research + Healthcare)
- **300**: Purple → Red (Arts + Education)
- **400**: Orange → Red (Construction + Healthcare)
- **500**: Yellow → Red (Energy + Education)

### Yellow Family
- **100**: Green → Yellow (Agriculture + Energy)
- **200**: Blue → Yellow (Research + Technology)
- **300**: Purple → Yellow (Arts + Technology)
- **400**: Red → Yellow (Education + Technology)
- **500**: Orange → Yellow (Construction + Energy)

### Purple Family
- **100**: Green → Purple (Nature + Arts)
- **200**: Blue → Purple (Research + Media)
- **300**: Red → Purple (Education + Arts)
- **400**: Orange → Purple (Urban Planning + Arts)
- **500**: Yellow → Purple (Technology + Arts)
