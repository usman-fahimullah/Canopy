# Dynamic Gradient System for Collection Cards

**Design Goal:** Generate gradients dynamically based on pathway combinations in collection cards.

---

## Current State

### Pathway Color Families (from `pathway-tag.tsx`)

| Color Family | Pathways                                                         |
| ------------ | ---------------------------------------------------------------- |
| **GREEN**    | Agriculture, Finance, Forestry, Transportation, Waste Management |
| **BLUE**     | Conservation, Research, Sports, Water                            |
| **ORANGE**   | Construction, Manufacturing, Real Estate, Urban Planning         |
| **RED/PINK** | Education, Medical, Tourism                                      |
| **YELLOW**   | Energy, Technology                                               |
| **PURPLE**   | Arts & Culture, Media, Policy                                    |

### Current Gradient Tokens (Static)

```css
/* Fixed gradients */
--gradient-urban-dwellers: linear-gradient(135deg, #ffb3ba 0%, #ffdfba 100%);
--gradient-planet-solutions: linear-gradient(135deg, #0a3d2c 0%, #408cff 100%);
--gradient-game-time: linear-gradient(135deg, #5ecc70 0%, #3369ff 100%);
--gradient-knowledge-builders: linear-gradient(135deg, #ff85c2 0%, #8e5ecc 100%);
```

**Problem:** These are hardcoded and don't scale with arbitrary pathway combinations.

---

## Proposed Solution: Dynamic Gradient Generation

### Approach 1: Pathway-Based Gradient Mapping

Map pathway color families to gradient color pairs dynamically.

#### Implementation

```typescript
// src/lib/gradient-utils.ts

import { PathwayType } from "@/components/ui/pathway-tag";

/** Map pathway to its primary color value */
const pathwayColorMap: Record<PathwayType, string> = {
  // GREEN family → Green shades
  agriculture: "#5ECC70", // green-500
  finance: "#3BA36F", // green-600
  forestry: "#0E5249", // green-700
  transportation: "#8EE07E", // green-400
  "waste-management": "#BCEBB2", // green-300

  // BLUE family → Blue shades
  conservation: "#3369FF", // blue-500
  research: "#408CFF", // blue-400
  sports: "#99C9FF", // blue-300
  water: "#CCE4FF", // blue-200

  // ORANGE family → Orange shades
  construction: "#F5580A", // orange-500
  manufacturing: "#FF8547", // orange-400
  "real-estate": "#FFAD85", // orange-300
  "urban-planning": "#B83D00", // orange-600

  // RED family → Red/Pink shades
  education: "#FF8599", // red-400
  medical: "#FF5C5C", // red-500
  tourism: "#FFADCE", // red-300

  // YELLOW family → Yellow shades
  energy: "#FFCE47", // yellow-400
  technology: "#E5B225", // yellow-500

  // PURPLE family → Purple shades
  "arts-culture": "#9C59FF", // purple-500
  media: "#C285FF", // purple-400
  policy: "#5B1DB8", // purple-600
};

/**
 * Generate a gradient from an array of pathways
 * Uses the first 2 pathways to create a diagonal gradient
 */
export function generateCollectionGradient(pathways: PathwayType[]): string {
  if (pathways.length === 0) {
    // Fallback: default brand gradient
    return "linear-gradient(135deg, #0A3D2C 0%, #3369FF 100%)";
  }

  if (pathways.length === 1) {
    // Single pathway: create subtle gradient from base to lighter shade
    const baseColor = pathwayColorMap[pathways[0]];
    return `linear-gradient(135deg, ${baseColor} 0%, ${baseColor}CC 100%)`; // CC = 80% opacity
  }

  // Two or more pathways: create gradient from first to second
  const startColor = pathwayColorMap[pathways[0]];
  const endColor = pathwayColorMap[pathways[1]];

  return `linear-gradient(135deg, ${startColor} 0%, ${endColor} 100%)`;
}

/**
 * Generate gradient from pathway names (more flexible)
 */
export function generateGradientFromNames(pathwayNames: string[]): string {
  const validPathways = pathwayNames.filter((name): name is PathwayType => name in pathwayColorMap);

  return generateCollectionGradient(validPathways);
}

/**
 * Preset collection gradients (for known collections)
 * These can override the auto-generated gradients
 */
export const collectionGradients = {
  "urban-dwellers": "linear-gradient(135deg, #FFB3BA 0%, #FFDFBA 100%)",
  "planet-solutions": "linear-gradient(135deg, #0A3D2C 0%, #408CFF 100%)",
  "game-time": "linear-gradient(135deg, #5ECC70 0%, #3369FF 100%)",
  "knowledge-builders": "linear-gradient(135deg, #FF85C2 0%, #8E5ECC 100%)",
} as const;
```

#### Usage in Collection Card Component

```tsx
// src/components/ui/collection-card.tsx

import { generateCollectionGradient, collectionGradients } from "@/lib/gradient-utils";
import { PathwayType } from "@/components/ui/pathway-tag";

interface CollectionCardProps {
  title: string;
  jobCount: number;
  pathways: PathwayType[]; // Array of pathways in this collection
  sponsor?: {
    name: string;
    logo: string;
  };
  // Option 1: Use preset gradient by collection slug
  gradientPreset?: keyof typeof collectionGradients;
  // Option 2: Custom gradient string
  customGradient?: string;
  href: string;
}

export function CollectionCard({
  title,
  jobCount,
  pathways,
  gradientPreset,
  customGradient,
  ...props
}: CollectionCardProps) {
  // Priority: custom > preset > auto-generated from pathways
  const gradient =
    customGradient ||
    (gradientPreset && collectionGradients[gradientPreset]) ||
    generateCollectionGradient(pathways);

  return (
    <div
      className="relative h-[416px] overflow-hidden rounded-2xl p-6"
      style={{ background: gradient }}
    >
      {/* Card content */}
    </div>
  );
}
```

---

### Approach 2: Color Family Blending

Generate gradients by blending entire color families (not just individual pathways).

#### Implementation

```typescript
// src/lib/gradient-utils.ts (Alternative approach)

type ColorFamily = "green" | "blue" | "orange" | "red" | "yellow" | "purple";

/** Map pathway to its color family */
const pathwayFamilyMap: Record<PathwayType, ColorFamily> = {
  agriculture: "green",
  finance: "green",
  forestry: "green",
  transportation: "green",
  "waste-management": "green",
  conservation: "blue",
  research: "blue",
  sports: "blue",
  water: "blue",
  construction: "orange",
  manufacturing: "orange",
  "real-estate": "orange",
  "urban-planning": "orange",
  education: "red",
  medical: "red",
  tourism: "red",
  energy: "yellow",
  technology: "yellow",
  "arts-culture": "purple",
  media: "purple",
  policy: "purple",
};

/** Representative gradient colors for each family */
const familyGradientColors: Record<ColorFamily, [string, string]> = {
  green: ["#5ECC70", "#0E5249"], // green-500 → green-700
  blue: ["#3369FF", "#00217A"], // blue-500 → blue-700
  orange: ["#F5580A", "#7A2900"], // orange-500 → orange-700
  red: ["#FF5C5C", "#AE0101"], // red-500 → red-700
  yellow: ["#FFCE47", "#665510"], // yellow-400 → yellow-700
  purple: ["#9C59FF", "#31007A"], // purple-500 → purple-700
};

/**
 * Generate gradient from pathway families
 * Automatically determines color family and creates harmonious gradients
 */
export function generateFamilyGradient(pathways: PathwayType[]): string {
  if (pathways.length === 0) {
    return "linear-gradient(135deg, #0A3D2C 0%, #3369FF 100%)";
  }

  // Get unique color families from pathways
  const families = [...new Set(pathways.map((p) => pathwayFamilyMap[p]))];

  if (families.length === 1) {
    // Single family: gradient within that family
    const [start, end] = familyGradientColors[families[0]];
    return `linear-gradient(135deg, ${start} 0%, ${end} 100%)`;
  }

  // Multiple families: blend first two families
  const [startColor] = familyGradientColors[families[0]];
  const [, endColor] = familyGradientColors[families[1]];

  return `linear-gradient(135deg, ${startColor} 0%, ${endColor} 100%)`;
}
```

---

## Recommended Approach: Hybrid System

Combine both approaches for maximum flexibility:

```typescript
// src/lib/gradient-utils.ts (Final version)

export interface GradientConfig {
  /** Static preset gradient (highest priority) */
  preset?: keyof typeof collectionGradients;
  /** Custom gradient string */
  custom?: string;
  /** Pathways to generate gradient from */
  pathways?: PathwayType[];
  /** Force use of color families instead of individual colors */
  useColorFamily?: boolean;
}

export function getCollectionGradient(config: GradientConfig): string {
  // Priority 1: Custom gradient
  if (config.custom) return config.custom;

  // Priority 2: Preset gradient
  if (config.preset) return collectionGradients[config.preset];

  // Priority 3: Generate from pathways
  if (config.pathways && config.pathways.length > 0) {
    return config.useColorFamily
      ? generateFamilyGradient(config.pathways)
      : generateCollectionGradient(config.pathways);
  }

  // Fallback: default brand gradient
  return "linear-gradient(135deg, #0A3D2C 0%, #3369FF 100%)";
}
```

### Usage Examples

```tsx
// Example 1: Preset gradient (curated collections)
<CollectionCard
  title="Urban Dwellers"
  gradientPreset="urban-dwellers"
  pathways={["urban-planning", "construction"]}
/>

// Example 2: Auto-generated from pathways
<CollectionCard
  title="Clean Energy Jobs"
  pathways={["energy", "technology"]} // → yellow-to-yellow gradient
/>

// Example 3: Multi-family gradient
<CollectionCard
  title="Conservation & Research"
  pathways={["conservation", "research"]} // → blue family gradient
/>

// Example 4: Cross-family gradient
<CollectionCard
  title="Green Tech"
  pathways={["forestry", "technology"]} // → green-to-yellow gradient
/>

// Example 5: Custom gradient (one-off)
<CollectionCard
  title="Special Collection"
  customGradient="linear-gradient(135deg, #FF6B9D 0%, #C371E3 100%)"
/>
```

---

## Data Structure for Collections

### Backend Data Model

```typescript
interface Collection {
  id: string;
  slug: string;
  title: string;
  description?: string;
  jobCount: number;

  // Pathway configuration
  pathways: PathwayType[];

  // Gradient configuration (optional overrides)
  gradient?: {
    preset?: string; // e.g., "urban-dwellers"
    custom?: string; // e.g., "linear-gradient(...)"
    useColorFamily?: boolean;
  };

  // Sponsor info (optional)
  sponsor?: {
    name: string;
    logo: string;
  };

  // Other metadata
  badges?: Array<{
    label: string;
    icon?: string;
  }>;

  createdAt: Date;
  updatedAt: Date;
}
```

### Example Collection Data

```json
[
  {
    "id": "1",
    "slug": "urban-dwellers",
    "title": "Urban Dwellers",
    "jobCount": 187,
    "pathways": ["urban-planning", "construction"],
    "gradient": {
      "preset": "urban-dwellers"
    }
  },
  {
    "id": "2",
    "slug": "planet-solutions",
    "title": "Planet-wide Solutions",
    "jobCount": 145,
    "pathways": ["conservation", "forestry"],
    "gradient": {
      "preset": "planet-solutions"
    },
    "sponsor": {
      "name": "3x5 World",
      "logo": "/sponsors/3x5-world.png"
    }
  },
  {
    "id": "3",
    "slug": "renewable-energy",
    "title": "Renewable Energy",
    "jobCount": 234,
    "pathways": ["energy", "technology"],
    "gradient": null // Auto-generate from pathways
  }
]
```

---

## Token System Integration

### Update `globals.css`

Replace static gradients with this comment:

```css
/* ============================================
   GRADIENTS
   Note: Collection gradients are dynamically generated
   See: src/lib/gradient-utils.ts
   ============================================ */

/* Preset gradients for curated collections */
--gradient-urban-dwellers: linear-gradient(135deg, #ffb3ba 0%, #ffdfba 100%);
--gradient-planet-solutions: linear-gradient(135deg, #0a3d2c 0%, #408cff 100%);
--gradient-game-time: linear-gradient(135deg, #5ecc70 0%, #3369ff 100%);
--gradient-knowledge-builders: linear-gradient(135deg, #ff85c2 0%, #8e5ecc 100%);

/* Helper gradients (for other UI patterns) */
--gradient-hero: linear-gradient(135deg, #0a3d2c 0%, #3ba36f 50%, #0d3ec7 100%);
--gradient-cover-overlay: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%);
--gradient-subtle-green: linear-gradient(180deg, #eaffe0 0%, #ffffff 100%);
--gradient-subtle-blue: linear-gradient(180deg, #e5f1ff 0%, #ffffff 100%);
```

---

## Benefits of This Approach

### 1. **Scalability**

- New collections automatically get gradients
- No need to define CSS tokens for every combination
- Pathways can be added/removed without code changes

### 2. **Consistency**

- Gradients always match pathway color families
- Predictable color relationships
- Design system integrity maintained

### 3. **Flexibility**

- Preset gradients for curated collections
- Auto-generated gradients for dynamic collections
- Custom gradients for special cases

### 4. **Performance**

- Gradients generated at render time (fast)
- No large CSS files with hundreds of gradient tokens
- Tree-shakeable utility functions

### 5. **Developer Experience**

- Simple API: just pass pathways array
- Fallbacks at every level
- TypeScript safety for pathway names

---

## Implementation Plan

### Phase 1: Gradient Utility (1 hour)

1. Create `src/lib/gradient-utils.ts`
2. Implement `generateCollectionGradient()`
3. Add preset gradients map
4. Export helper functions

### Phase 2: Collection Card Component (2 hours)

1. Create `CollectionCard` component
2. Integrate gradient system
3. Add pathway badges
4. Implement sponsor logo display

### Phase 3: Testing & Refinement (1 hour)

1. Test with various pathway combinations
2. Verify color contrast on gradients
3. Adjust color mappings if needed
4. Document usage patterns

---

## Questions to Resolve

1. **Gradient Direction:**
   - Always 135deg (diagonal)?
   - Or vary based on card size/position?

2. **Color Selection for Pathways:**
   - Use specific shades (green-500 for agriculture)?
   - Or randomize within family (any green)?

3. **Multi-Pathway Gradients:**
   - Blend only first 2 pathways?
   - Or create multi-stop gradients (3+ colors)?

4. **Dark Mode:**
   - Invert gradients?
   - Use darker color variants?
   - Keep same gradients with overlay?

5. **Accessibility:**
   - Ensure text contrast on all gradients?
   - Add text shadow/background for readability?

---

## Next Steps

1. **Review this design** - Confirm approach
2. **Choose between Approach 1 (individual colors) vs Approach 2 (color families)**
3. **Implement `gradient-utils.ts`**
4. **Update Collection Card component**
5. **Test with real collection data**
