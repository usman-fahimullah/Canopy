# Gradient Visual Reference Guide

**Quick lookup table for all gradient combinations**

---

## How to Read This Table

**Format**: `Family A + Family B → Gradient Used`

- **Same Family**: When both pathways belong to the same color family
- **Dual Family**: When pathways belong to different families (after alphabetical sorting)

---

## Same-Family Gradients

| Pathways | Gradient | Description |
|----------|----------|-------------|
| Green + Green | `gradient-green-100` | Blue → Green |
| Blue + Blue | `gradient-blue-100` | Green → Blue |
| Orange + Orange | `gradient-orange-200` | Blue → Orange |
| Red + Red | `gradient-red-100` | Green → Red |
| Yellow + Yellow | `gradient-yellow-100` | Green → Yellow |
| Purple + Purple | `gradient-purple-200` | Blue → Purple |

**Examples:**
```
Energy + Technology (both yellow)          → gradient-yellow-100
Conservation + Research (both blue)        → gradient-blue-100
Construction + Urban Planning (both orange) → gradient-orange-200
Education + Medical (both red)             → gradient-red-100
```

---

## Dual-Family Gradient Matrix

### Green + Other Families

| Combination | Gradient | Visual |
|-------------|----------|--------|
| Green + Blue | `gradient-blue-100` | Green → Blue |
| Green + Orange | `gradient-orange-100` | Green → Orange |
| Green + Red | `gradient-red-100` | Green → Red |
| Green + Yellow | `gradient-yellow-100` | Green → Yellow |
| Green + Purple | `gradient-purple-100` | Green → Purple |

**Example Pathways:**
- Agriculture + Conservation → `gradient-blue-100`
- Forestry + Construction → `gradient-orange-100`
- Agriculture + Education → `gradient-red-100`
- Finance + Energy → `gradient-yellow-100`
- Transportation + Media → `gradient-purple-100`

---

### Blue + Other Families

| Combination | Gradient | Visual |
|-------------|----------|--------|
| Blue + Green | `gradient-blue-100` | Green → Blue |
| Blue + Orange | `gradient-orange-200` | Blue → Orange |
| Blue + Red | `gradient-red-200` | Blue → Red |
| Blue + Yellow | `gradient-yellow-200` | Blue → Yellow |
| Blue + Purple | `gradient-purple-200` | Blue → Purple |

**Example Pathways:**
- Water + Agriculture → `gradient-blue-100`
- Conservation + Construction → `gradient-orange-200`
- Research + Education → `gradient-red-200`
- Sports + Technology → `gradient-yellow-200`
- Water + Arts & Culture → `gradient-purple-200`

---

### Orange + Other Families

| Combination | Gradient | Visual |
|-------------|----------|--------|
| Orange + Green | `gradient-orange-100` | Green → Orange |
| Orange + Blue | `gradient-orange-200` | Blue → Orange |
| Orange + Red | `gradient-orange-400` | Red → Orange |
| Orange + Yellow | `gradient-orange-500` | Yellow → Orange |
| Orange + Purple | `gradient-orange-300` | Purple → Orange |

**Example Pathways:**
- Construction + Forestry → `gradient-orange-100`
- Urban Planning + Water → `gradient-orange-200`
- Manufacturing + Tourism → `gradient-orange-400`
- Real Estate + Energy → `gradient-orange-500`
- Construction + Media → `gradient-orange-300`

---

### Red + Other Families

| Combination | Gradient | Visual |
|-------------|----------|--------|
| Red + Green | `gradient-red-100` | Green → Red |
| Red + Blue | `gradient-red-200` | Blue → Red |
| Red + Orange | `gradient-orange-400` | Red → Orange |
| Red + Yellow | `gradient-yellow-400` | Red → Yellow |
| Red + Purple | `gradient-purple-300` | Red → Purple |

**Example Pathways:**
- Education + Agriculture → `gradient-red-100`
- Medical + Research → `gradient-red-200`
- Tourism + Construction → `gradient-orange-400`
- Education + Technology → `gradient-yellow-400`
- Medical + Media → `gradient-purple-300`

---

### Yellow + Other Families

| Combination | Gradient | Visual |
|-------------|----------|--------|
| Yellow + Green | `gradient-yellow-100` | Green → Yellow |
| Yellow + Blue | `gradient-yellow-200` | Blue → Yellow |
| Yellow + Orange | `gradient-orange-500` | Yellow → Orange |
| Yellow + Red | `gradient-yellow-400` | Red → Yellow |
| Yellow + Purple | `gradient-purple-500` | Yellow → Purple |

**Example Pathways:**
- Energy + Agriculture → `gradient-yellow-100`
- Technology + Conservation → `gradient-yellow-200`
- Energy + Construction → `gradient-orange-500`
- Technology + Education → `gradient-yellow-400`
- Energy + Arts & Culture → `gradient-purple-500`

---

### Purple + Other Families

| Combination | Gradient | Visual |
|-------------|----------|--------|
| Purple + Green | `gradient-purple-100` | Green → Purple |
| Purple + Blue | `gradient-purple-200` | Blue → Purple |
| Purple + Orange | `gradient-orange-300` | Purple → Orange |
| Purple + Red | `gradient-purple-300` | Red → Purple |
| Purple + Yellow | `gradient-purple-500` | Yellow → Purple |

**Example Pathways:**
- Arts & Culture + Forestry → `gradient-purple-100`
- Media + Research → `gradient-purple-200`
- Policy + Construction → `gradient-orange-300`
- Media + Education → `gradient-purple-300`
- Arts & Culture + Energy → `gradient-purple-500`

---

## All 21 Pathways and Their Families

### Green Family (5 pathways)
- `agriculture` → Green
- `finance` → Green
- `forestry` → Green
- `transportation` → Green
- `waste-management` → Green

### Blue Family (4 pathways)
- `conservation` → Blue
- `research` → Blue
- `sports` → Blue
- `water` → Blue

### Orange Family (4 pathways)
- `construction` → Orange
- `manufacturing` → Orange
- `real-estate` → Orange
- `urban-planning` → Orange

### Red Family (3 pathways)
- `education` → Red
- `medical` → Red
- `tourism` → Red

### Yellow Family (2 pathways)
- `energy` → Yellow
- `technology` → Yellow

### Purple Family (3 pathways)
- `arts-culture` → Purple
- `media` → Purple
- `policy` → Purple

---

## Common Collection Examples

### Climate Tech & Energy
```
Pathways: ["energy", "technology"]
Families: Yellow + Yellow (same)
Gradient: gradient-yellow-100
Visual: Green → Yellow
```

### Sustainable Cities
```
Pathways: ["construction", "urban-planning"]
Families: Orange + Orange (same)
Gradient: gradient-orange-200
Visual: Blue → Orange
```

### Conservation Science
```
Pathways: ["conservation", "research"]
Families: Blue + Blue (same)
Gradient: gradient-blue-100
Visual: Green → Blue
```

### Green Agriculture & Energy
```
Pathways: ["agriculture", "energy"]
After sort: ["agriculture", "energy"]
Families: Green + Yellow (different)
Gradient: gradient-yellow-100
Visual: Green → Yellow
```

### Eco-Tourism
```
Pathways: ["tourism", "conservation"]
After sort: ["conservation", "tourism"]
Families: Blue + Red (different)
Gradient: gradient-red-200
Visual: Blue → Red
```

### Climate Education
```
Pathways: ["education", "research"]
After sort: ["education", "research"]
Families: Red + Blue (different)
Gradient: gradient-red-200
Visual: Blue → Red
```

### Green Finance & Policy
```
Pathways: ["finance", "policy"]
After sort: ["finance", "policy"]
Families: Green + Purple (different)
Gradient: gradient-purple-100
Visual: Green → Purple
```

### Sustainable Manufacturing
```
Pathways: ["manufacturing", "technology"]
After sort: ["manufacturing", "technology"]
Families: Orange + Yellow (different)
Gradient: gradient-orange-500
Visual: Yellow → Orange
```

### Climate Media
```
Pathways: ["media", "arts-culture"]
After sort: ["arts-culture", "media"]
Families: Purple + Purple (same)
Gradient: gradient-purple-200
Visual: Blue → Purple
```

### Healthcare & Environment
```
Pathways: ["medical", "conservation"]
After sort: ["conservation", "medical"]
Families: Blue + Red (different)
Gradient: gradient-red-200
Visual: Blue → Red
```

---

## Quick Lookup by Starting Color

### Gradients Starting with Green
- `gradient-green-100`: Blue → Green
- `gradient-blue-100`: Green → Blue
- `gradient-orange-100`: Green → Orange
- `gradient-red-100`: Green → Red
- `gradient-yellow-100`: Green → Yellow
- `gradient-purple-100`: Green → Purple

### Gradients Starting with Blue
- `gradient-green-200`: Purple → Green (N/A in current system)
- `gradient-blue-200`: Purple → Blue
- `gradient-orange-200`: Blue → Orange
- `gradient-red-200`: Blue → Red
- `gradient-yellow-200`: Blue → Yellow
- `gradient-purple-200`: Blue → Purple

### Gradients Starting with Purple
- `gradient-green-200`: Purple → Green
- `gradient-orange-300`: Purple → Orange
- `gradient-purple-300`: Red → Purple
- `gradient-yellow-300`: Purple → Yellow

### Gradients Starting with Red
- `gradient-green-300`: Red → Green
- `gradient-blue-300`: Red → Blue
- `gradient-orange-400`: Red → Orange
- `gradient-red-400`: Orange → Red (variant)
- `gradient-yellow-400`: Red → Yellow

### Gradients Starting with Orange
- `gradient-green-400`: Orange → Green
- `gradient-blue-400`: Orange → Blue
- `gradient-yellow-500`: Orange → Yellow

### Gradients Starting with Yellow
- `gradient-green-500`: Yellow → Green
- `gradient-blue-500`: Yellow → Blue
- `gradient-orange-500`: Yellow → Orange
- `gradient-purple-500`: Yellow → Purple

---

## Testing Checklist

When testing gradient system, verify:

- [ ] Same pathway order produces same gradient
- [ ] Different pathway order (reversed) produces same gradient
- [ ] All 6 color families have same-family gradients
- [ ] All 30 dual-family combinations work correctly
- [ ] Single pathway uses same-family gradient
- [ ] Invalid/unknown pathways fall back to default
- [ ] Gradients render correctly in all browsers
- [ ] Text contrast meets WCAG AA (4.5:1)
- [ ] Collection cards display gradient backgrounds
- [ ] Live preview shows correct gradient

---

## CSS Variable Reference

All gradients use CSS custom properties:

```css
/* Green family */
var(--gradient-green-100)  /* Blue → Green */
var(--gradient-green-200)  /* Purple → Green */
var(--gradient-green-300)  /* Red → Green */
var(--gradient-green-400)  /* Orange → Green */
var(--gradient-green-500)  /* Yellow → Green */

/* Blue family */
var(--gradient-blue-100)   /* Green → Blue */
var(--gradient-blue-200)   /* Purple → Blue */
var(--gradient-blue-300)   /* Red → Blue */
var(--gradient-blue-400)   /* Orange → Blue */
var(--gradient-blue-500)   /* Yellow → Blue */

/* Orange family */
var(--gradient-orange-100) /* Green → Orange */
var(--gradient-orange-200) /* Blue → Orange */
var(--gradient-orange-300) /* Purple → Orange */
var(--gradient-orange-400) /* Red → Orange */
var(--gradient-orange-500) /* Yellow → Orange */

/* Red family */
var(--gradient-red-100)    /* Green → Red */
var(--gradient-red-200)    /* Blue → Red */
var(--gradient-red-300)    /* Purple → Red */
var(--gradient-red-400)    /* Orange → Red */
var(--gradient-red-500)    /* Yellow → Red */

/* Yellow family */
var(--gradient-yellow-100) /* Green → Yellow */
var(--gradient-yellow-200) /* Blue → Yellow */
var(--gradient-yellow-300) /* Purple → Yellow */
var(--gradient-yellow-400) /* Red → Yellow */
var(--gradient-yellow-500) /* Orange → Yellow */

/* Purple family */
var(--gradient-purple-100) /* Green → Purple */
var(--gradient-purple-200) /* Blue → Purple */
var(--gradient-purple-300) /* Red → Purple */
var(--gradient-purple-400) /* Orange → Purple */
var(--gradient-purple-500) /* Yellow → Purple */

/* Rainbow (reserved for other UI) */
var(--gradient-rainbow-100)
var(--gradient-rainbow-200)
var(--gradient-rainbow-300)
var(--gradient-rainbow-400)
```

---

## TypeScript Usage

```typescript
import { getCollectionGradient, getPathwayFamily } from "@/lib/gradient-utils";

// Get gradient for collection
const gradient = getCollectionGradient({
  pathways: ["agriculture", "energy"]
});
// Returns: "var(--gradient-yellow-100)"

// Get color family for pathway
const family = getPathwayFamily("energy");
// Returns: "yellow"

// Get all pathways in a family
const yellowPathways = getPathwaysByFamily("yellow");
// Returns: ["energy", "technology"]
```

---

## Design Tokens Integration

All gradients reference primitive color tokens:

```css
/* Example: gradient-green-100 */
linear-gradient(
  135deg,
  var(--primitive-blue-100) 0%,     /* #E5F1FF */
  var(--primitive-blue-300) 30.5%,  /* #99C9FF */
  var(--primitive-green-600) 65.5%, /* #3BA36F */
  var(--primitive-green-700) 100%   /* #0E5249 */
);
```

This ensures:
- Consistency across design system
- Easy theme customization
- Color token reusability
- Centralized color management
