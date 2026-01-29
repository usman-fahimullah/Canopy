# Gradient Token Mapping - Trails Design System

**Source:** Figma gradient definitions
**Objective:** Map all gradients to primitive color tokens

---

## Gradient Families (from Figma)

### Green Gradients (G100-G500)

| Name | Gradient Definition | Token Mapping |
|------|---------------------|---------------|
| **G100** | `linear-gradient(135deg, #E5F1FF 0%, #99C9FF 30.5%, #3BA36F 65.5%, #0E5249 100%)` | `blue-100 → blue-300 → green-600 → green-700` |
| **G200** | `linear-gradient(135deg, #F1E0FF 0%, #E2C2FF 33.5%, #3BA36F 66.5%, #0E5249 100%)` | `purple-200 → purple-300 → green-600 → green-700` |
| **G300** | `linear-gradient(135deg, #FFD6E9 0%, #FFADCE 33%, #3BA36F 65.5%, #0E5249 100%)` | `red-200 → red-300 → green-600 → green-700` |
| **G400** | `linear-gradient(135deg, #FFEDE0 0%, #FFAD85 33.5%, #3BA36F 68.5%, #0E5249 100%)` | `orange-100 → orange-300 → green-600 → green-700` |
| **G500** | `linear-gradient(135deg, #FFF7D6 0%, #FFDA75 33.5%, #3BA36F 67.5%, #0E5249 100%)` | `yellow-100 → yellow-300 → green-600 → green-700` |

**Pattern:** All green gradients end with `green-600 → green-700`, starting with different color families.

---

### Blue Gradients (B100-B500)

| Name | Gradient Definition | Token Mapping |
|------|---------------------|---------------|
| **B100** | `linear-gradient(135deg, #072924 0%, #0E5249 34%, #408CFF 74%, #CCE4FF 100%)` | `green-900* → green-700 → blue-400 → blue-200` |
| **B200** | `linear-gradient(135deg, #E2C2FF 0%, #9C59FF 31.5%, #3369FF 66.5%, #408CFF 100%)` | `purple-300 → purple-500 → blue-500 → blue-400` |
| **B300** | `linear-gradient(135deg, #FFD6E9 0%, #FF8599 31.5%, #3369FF 66.5%, #408CFF 100%)` | `red-200 → red-400 → blue-500 → blue-400` |
| **B400** | `linear-gradient(135deg, #FFDAC2 0%, #FF8547 31.5%, #408CFF 79%, #3369FF 100%)` | `orange-200 → orange-400 → blue-400 → blue-500` |
| **B500** | `linear-gradient(135deg, #FFDA75 0%, #FFF7D6 33%, #99C9FF 66.5%, #408CFF 100%)` | `yellow-300 → yellow-100 → blue-300 → blue-400` |

**Pattern:** All blue gradients end with blue shades, starting with different color families.

*Note: `#072924` is not in palette - need to add as `green-900` or use `green-800` (#0A3D2C).

---

### Purple Gradients (P100-P500)

| Name | Gradient Definition | Token Mapping |
|------|---------------------|---------------|
| **P100** | `linear-gradient(135deg, #8EE07E 0%, #3BA36F 31.5%, #C285FF 69.5%, #E2C2FF 100%)` | `green-400 → green-600 → purple-400 → purple-300` |
| **P200** | `linear-gradient(135deg, #3369FF 0%, #408CFF 36%, #C285FF 69.5%, #9C59FF 100%)` | `blue-500 → blue-400 → purple-400 → purple-500` |
| **P300** | `linear-gradient(135deg, #FFADCE 0%, #FF5C5C 36%, #9C59FF 69.5%, #C285FF 100%)` | `red-300 → red-500 → purple-500 → purple-400` |
| **P400** | `linear-gradient(135deg, #FFDAC2 0%, #FF8547 36%, #5B1DB8 69.5%, #31007A 100%)` | `orange-200 → orange-400 → purple-600 → purple-700` |
| **P500** | `linear-gradient(135deg, #FFEFAD 0%, #FFDA75 32.5%, #9C59FF 69.5%, #5B1DB8 100%)` | `yellow-200 → yellow-300 → purple-500 → purple-600` |

**Pattern:** All purple gradients end with purple shades, starting with different color families.

---

### Red Gradients (R100-R500)

| Name | Gradient Definition | Token Mapping |
|------|---------------------|---------------|
| **R100** | `linear-gradient(135deg, #BCEBB2 0%, #3BA36F 31.5%, #FF5C5C 68%, #FF8599 100%)` | `green-300 → green-600 → red-500 → red-400` |
| **R200** | `linear-gradient(135deg, #CCE4FF 0%, #99C9FF 30.5%, #FF8599 67.5%, #FF5C5C 100%)` | `blue-200 → blue-300 → red-400 → red-500` |
| **R300** | `linear-gradient(135deg, #F1E0FF 0%, #C285FF 35.35%, #AE0101 69.73%, #5C0000 100%)` | `purple-200 → purple-400 → red-700 → red-800` |
| **R400** | `linear-gradient(135deg, #FFAD85 0%, #FF8547 34.5%, #FF5C5C 69.73%, #E90000 100%)` | `orange-300 → orange-400 → red-500 → red-600` |
| **R500** | `linear-gradient(135deg, #FFF7D6 0%, #FFEFAD 32%, #FF8599 69%, #FF5C5C 100%)` | `yellow-100 → yellow-200 → red-400 → red-500` |

**Pattern:** All red gradients end with red shades, starting with different color families.

---

### Yellow Gradients (Y100-Y500)

| Name | Gradient Definition | Token Mapping |
|------|---------------------|---------------|
| **Y100** | `linear-gradient(135deg, #8EE07E 0%, #BCEBB2 25%, #FFEFAD 67.5%, #FFDA75 100%)` | `green-400 → green-300 → yellow-200 → yellow-300` |
| **Y200** | `linear-gradient(135deg, #408CFF 0%, #99C9FF 31.5%, #FFDA75 67.5%, #FFDA75 100%, #FFEFAD 100%)` | `blue-400 → blue-300 → yellow-300 → yellow-300 → yellow-200` |
| **Y300** | `linear-gradient(135deg, #C285FF 0%, #E2C2FF 37.5%, #FFDA75 67.5%, #FFCE47 100%)` | `purple-400 → purple-300 → yellow-300 → yellow-400` |
| **Y400** | `linear-gradient(135deg, #FF8599 0%, #FFADCE 36%, #FFDA75 67.5%, #FFCE47 100%)` | `red-400 → red-300 → yellow-300 → yellow-400` |
| **Y500** | `linear-gradient(135deg, #FF8547 0%, #F5580A 0.01%, #FFAD85 36%, #FFDA75 67.5%, #FFCE47 100%)` | `orange-400 → orange-500 → orange-300 → yellow-300 → yellow-400` |

**Pattern:** All yellow gradients end with yellow shades, starting with different color families.

---

### Rainbow Gradients (Rainbow 100-400)

| Name | Gradient Definition | Token Mapping |
|------|---------------------|---------------|
| **Rainbow 100** | `linear-gradient(98.15deg, #F0FFE5 0%, #E5F1FF 19.79%, #F7F2FF 38.54%, #FFEBF4 57.81%, #FFEDE0 78.65%, #FFF7D6 100%)` | `green-100* → blue-100 → purple-100 → red-100 → orange-100 → yellow-100` |
| **Rainbow 200** | `linear-gradient(98.15deg, #DCFAC8 0%, #CCE4FF 19.79%, #F1E0FF 38.54%, #FFD6E9 57.81%, #FFDAC2 78.65%, #FFF7D6 100%)` | `green-200 → blue-200 → purple-200 → red-200 → orange-200 → yellow-100` |
| **Rainbow 300** | `linear-gradient(98.15deg, #BCEBB2 0%, #99C9FF 19.79%, #E2C2FF 38.54%, #FFADCE 57.81%, #FFAD85 78.65%, #FFDA75 100%)` | `green-300 → blue-300 → purple-300 → red-300 → orange-300 → yellow-300` |
| **Rainbow 400** | `linear-gradient(98.15deg, #8EE07E 0%, #408CFF 19.79%, #C285FF 38.54%, #FF8599 57.81%, #FF8547 78.65%, #FFCE47 100%)` | `green-400 → blue-400 → purple-400 → red-400 → orange-400 → yellow-400` |

**Pattern:** Rainbow gradients use matching shade levels across all color families (100s, 200s, 300s, 400s).

*Note: `#F0FFE5` not in palette - closest is `green-100` (#EAFFE0).

---

## Missing Primitive Colors

These colors appear in gradients but don't exist in the current primitive palette:

| Hex | Used In | Suggested Token |
|-----|---------|-----------------|
| `#072924` | Blue/B100 | `--primitive-green-900: #072924` (darker than green-800) |
| `#F0FFE5` | Rainbow/100 | Use existing `green-100: #EAFFE0` (close enough) |

**Recommendation:** Add `green-900` for B100 gradient, or use `green-800` as approximation.

---

## Token Structure for globals.css

```css
/* ============================================
   GRADIENTS - Trails Design System
   Multi-color directional gradients
   ============================================ */

/* --- GREEN GRADIENTS --- */
/* Green family endings with different color starts */

--gradient-green-100: linear-gradient(135deg,
  var(--primitive-blue-100) 0%,
  var(--primitive-blue-300) 30.5%,
  var(--primitive-green-600) 65.5%,
  var(--primitive-green-700) 100%
);

--gradient-green-200: linear-gradient(135deg,
  var(--primitive-purple-200) 0%,
  var(--primitive-purple-300) 33.5%,
  var(--primitive-green-600) 66.5%,
  var(--primitive-green-700) 100%
);

--gradient-green-300: linear-gradient(135deg,
  var(--primitive-red-200) 0%,
  var(--primitive-red-300) 33%,
  var(--primitive-green-600) 65.5%,
  var(--primitive-green-700) 100%
);

--gradient-green-400: linear-gradient(135deg,
  var(--primitive-orange-100) 0%,
  var(--primitive-orange-300) 33.5%,
  var(--primitive-green-600) 68.5%,
  var(--primitive-green-700) 100%
);

--gradient-green-500: linear-gradient(135deg,
  var(--primitive-yellow-100) 0%,
  var(--primitive-yellow-300) 33.5%,
  var(--primitive-green-600) 67.5%,
  var(--primitive-green-700) 100%
);

/* --- BLUE GRADIENTS --- */
/* Blue family endings with different color starts */

--gradient-blue-100: linear-gradient(135deg,
  var(--primitive-green-800) 0%,
  var(--primitive-green-700) 34%,
  var(--primitive-blue-400) 74%,
  var(--primitive-blue-200) 100%
);

--gradient-blue-200: linear-gradient(135deg,
  var(--primitive-purple-300) 0%,
  var(--primitive-purple-500) 31.5%,
  var(--primitive-blue-500) 66.5%,
  var(--primitive-blue-400) 100%
);

--gradient-blue-300: linear-gradient(135deg,
  var(--primitive-red-200) 0%,
  var(--primitive-red-400) 31.5%,
  var(--primitive-blue-500) 66.5%,
  var(--primitive-blue-400) 100%
);

--gradient-blue-400: linear-gradient(135deg,
  var(--primitive-orange-200) 0%,
  var(--primitive-orange-400) 31.5%,
  var(--primitive-blue-400) 79%,
  var(--primitive-blue-500) 100%
);

--gradient-blue-500: linear-gradient(135deg,
  var(--primitive-yellow-300) 0%,
  var(--primitive-yellow-100) 33%,
  var(--primitive-blue-300) 66.5%,
  var(--primitive-blue-400) 100%
);

/* --- PURPLE GRADIENTS --- */
/* Purple family endings with different color starts */

--gradient-purple-100: linear-gradient(135deg,
  var(--primitive-green-400) 0%,
  var(--primitive-green-600) 31.5%,
  var(--primitive-purple-400) 69.5%,
  var(--primitive-purple-300) 100%
);

--gradient-purple-200: linear-gradient(135deg,
  var(--primitive-blue-500) 0%,
  var(--primitive-blue-400) 36%,
  var(--primitive-purple-400) 69.5%,
  var(--primitive-purple-500) 100%
);

--gradient-purple-300: linear-gradient(135deg,
  var(--primitive-red-300) 0%,
  var(--primitive-red-500) 36%,
  var(--primitive-purple-500) 69.5%,
  var(--primitive-purple-400) 100%
);

--gradient-purple-400: linear-gradient(135deg,
  var(--primitive-orange-200) 0%,
  var(--primitive-orange-400) 36%,
  var(--primitive-purple-600) 69.5%,
  var(--primitive-purple-700) 100%
);

--gradient-purple-500: linear-gradient(135deg,
  var(--primitive-yellow-200) 0%,
  var(--primitive-yellow-300) 32.5%,
  var(--primitive-purple-500) 69.5%,
  var(--primitive-purple-600) 100%
);

/* --- RED GRADIENTS --- */
/* Red family endings with different color starts */

--gradient-red-100: linear-gradient(135deg,
  var(--primitive-green-300) 0%,
  var(--primitive-green-600) 31.5%,
  var(--primitive-red-500) 68%,
  var(--primitive-red-400) 100%
);

--gradient-red-200: linear-gradient(135deg,
  var(--primitive-blue-200) 0%,
  var(--primitive-blue-300) 30.5%,
  var(--primitive-red-400) 67.5%,
  var(--primitive-red-500) 100%
);

--gradient-red-300: linear-gradient(135deg,
  var(--primitive-purple-200) 0%,
  var(--primitive-purple-400) 35.35%,
  var(--primitive-red-700) 69.73%,
  var(--primitive-red-800) 100%
);

--gradient-red-400: linear-gradient(135deg,
  var(--primitive-orange-300) 0%,
  var(--primitive-orange-400) 34.5%,
  var(--primitive-red-500) 69.73%,
  var(--primitive-red-600) 100%
);

--gradient-red-500: linear-gradient(135deg,
  var(--primitive-yellow-100) 0%,
  var(--primitive-yellow-200) 32%,
  var(--primitive-red-400) 69%,
  var(--primitive-red-500) 100%
);

/* --- YELLOW GRADIENTS --- */
/* Yellow family endings with different color starts */

--gradient-yellow-100: linear-gradient(135deg,
  var(--primitive-green-400) 0%,
  var(--primitive-green-300) 25%,
  var(--primitive-yellow-200) 67.5%,
  var(--primitive-yellow-300) 100%
);

--gradient-yellow-200: linear-gradient(135deg,
  var(--primitive-blue-400) 0%,
  var(--primitive-blue-300) 31.5%,
  var(--primitive-yellow-300) 67.5%,
  var(--primitive-yellow-300) 100%
);

--gradient-yellow-300: linear-gradient(135deg,
  var(--primitive-purple-400) 0%,
  var(--primitive-purple-300) 37.5%,
  var(--primitive-yellow-300) 67.5%,
  var(--primitive-yellow-400) 100%
);

--gradient-yellow-400: linear-gradient(135deg,
  var(--primitive-red-400) 0%,
  var(--primitive-red-300) 36%,
  var(--primitive-yellow-300) 67.5%,
  var(--primitive-yellow-400) 100%
);

--gradient-yellow-500: linear-gradient(135deg,
  var(--primitive-orange-400) 0%,
  var(--primitive-orange-500) 0.01%,
  var(--primitive-orange-300) 36%,
  var(--primitive-yellow-300) 67.5%,
  var(--primitive-yellow-400) 100%
);

/* --- RAINBOW GRADIENTS --- */
/* Multi-color horizontal gradients */

--gradient-rainbow-100: linear-gradient(98.15deg,
  var(--primitive-green-100) 0%,
  var(--primitive-blue-100) 19.79%,
  var(--primitive-purple-100) 38.54%,
  var(--primitive-red-100) 57.81%,
  var(--primitive-orange-100) 78.65%,
  var(--primitive-yellow-100) 100%
);

--gradient-rainbow-200: linear-gradient(98.15deg,
  var(--primitive-green-200) 0%,
  var(--primitive-blue-200) 19.79%,
  var(--primitive-purple-200) 38.54%,
  var(--primitive-red-200) 57.81%,
  var(--primitive-orange-200) 78.65%,
  var(--primitive-yellow-100) 100%
);

--gradient-rainbow-300: linear-gradient(98.15deg,
  var(--primitive-green-300) 0%,
  var(--primitive-blue-300) 19.79%,
  var(--primitive-purple-300) 38.54%,
  var(--primitive-red-300) 57.81%,
  var(--primitive-orange-300) 78.65%,
  var(--primitive-yellow-300) 100%
);

--gradient-rainbow-400: linear-gradient(98.15deg,
  var(--primitive-green-400) 0%,
  var(--primitive-blue-400) 19.79%,
  var(--primitive-purple-400) 38.54%,
  var(--primitive-red-400) 57.81%,
  var(--primitive-orange-400) 78.65%,
  var(--primitive-yellow-400) 100%
);
```

---

## Gradient Naming Convention

### Pattern Analysis

Each gradient family uses a **base color** (destination) with **different starting colors**:

- **Green 100-500:** All end green, different starts (blue, purple, red, orange, yellow)
- **Blue 100-500:** All end blue, different starts
- **Purple 100-500:** All end purple, different starts
- **Red 100-500:** All end red, different starts
- **Yellow 100-500:** All end yellow, different starts

### Alternative Naming (More Descriptive)

```css
/* Descriptive names based on color pairs */
--gradient-blue-to-green: var(--gradient-green-100);
--gradient-purple-to-green: var(--gradient-green-200);
--gradient-red-to-green: var(--gradient-green-300);
--gradient-orange-to-green: var(--gradient-green-400);
--gradient-yellow-to-green: var(--gradient-green-500);

--gradient-green-to-blue: var(--gradient-blue-100);
--gradient-purple-to-blue: var(--gradient-blue-200);
--gradient-red-to-blue: var(--gradient-blue-300);
/* ... etc */
```

**Recommendation:** Keep the Figma naming (green-100, blue-200, etc.) for consistency with design files.

---

## Usage Guidelines

### For Collection Cards

```typescript
// Map pathway combinations to gradients
const pathwayGradientMap = {
  // Green-ending gradients
  ["agriculture", "conservation"]: "--gradient-green-100",      // Blue → Green
  ["agriculture", "arts-culture"]: "--gradient-green-200",      // Purple → Green
  ["agriculture", "education"]: "--gradient-green-300",         // Red → Green
  ["agriculture", "construction"]: "--gradient-green-400",      // Orange → Green
  ["agriculture", "energy"]: "--gradient-green-500",            // Yellow → Green

  // Blue-ending gradients
  ["conservation", "agriculture"]: "--gradient-blue-100",       // Green → Blue
  ["conservation", "arts-culture"]: "--gradient-blue-200",      // Purple → Blue
  ["conservation", "education"]: "--gradient-blue-300",         // Red → Blue
  ["conservation", "construction"]: "--gradient-blue-400",      // Orange → Blue
  ["conservation", "energy"]: "--gradient-blue-500",            // Yellow → Blue

  // ... etc for all combinations
};
```

