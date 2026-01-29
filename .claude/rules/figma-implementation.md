# Figma Design Implementation

---
trigger: figma, design, implement design, from figma, figma link
---

When implementing any design from Figma, follow this workflow:

## 1. Extract Design Specs

Use the Figma MCP tool to get exact values from the provided Figma link. Extract:
- Colors (hex values)
- Spacing (padding, margin, gap)
- Typography (font-size, line-height, font-weight)
- Border-radius
- Shadows
- Opacity
- Layout properties (flex, grid)
- Component variants or states

## 2. Token Reconciliation

Before writing any component code, reconcile Figma values with existing tokens.

### Token Files

| File | Purpose |
|------|---------|
| `src/app/globals.css` | CSS custom properties (primary source of truth) |
| `src/lib/tokens.ts` | TypeScript access for runtime/animations |

### Token Hierarchy (3 Tiers)

```
TIER 1: PRIMITIVE    → Raw color values (--primitive-green-600)
TIER 2: SEMANTIC     → Intent-based (--background-brand, --foreground-error)
TIER 3: COMPONENT    → Component-specific (--button-primary-background)
```

**Always prefer higher tiers.** Use component tokens when available, then semantic, then primitive.

---

## 3. Token Quick Reference

### Color Primitives

| Scale | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 |
|-------|-----|-----|-----|-----|-----|-----|-----|-----|
| **Green** | #EAFFE0 | #DCFAC8 | #BCEBB2 | #8EE07E | #5ECC70 | #3BA36F | #0E5249 | #0A3D2C |
| **Neutral** | #FAF9F7 | #F2EDE9 | #E5DFD8 | #CCC6C0 | #A39D96 | #7A7671 | #3D3A37 | #1F1D1C |
| **Blue** | #E5F1FF | #CCE4FF | #99C9FF | #408CFF | #3369FF | #0D3EC7 | #00217A | #001652 |
| **Red** | #FFEBF4 | #FFD6E9 | #FFADCE | #FF8599 | #FF5C5C | #E90000 | #AE0101 | #5C0000 |
| **Orange** | #FFEDE0 | #FFDAC2 | #FFAD85 | #FF8547 | #F5580A | #B83D00 | #7A2900 | #521B00 |
| **Yellow** | #FFF7D6 | #FFEFAD | #FFDA75 | #FFCE47 | #E5B225 | #B88A1D | #665510 | #3D330A |
| **Purple** | #F7F2FF | #F1E0FF | #E2C2FF | #C285FF | #9C59FF | #5B1DB8 | #31007A | #1B0043 |

**Special:** `--primitive-neutral-0: #FFFFFF` and `--primitive-neutral-900: #000000`

### Semantic Background Tokens

```css
/* App Backgrounds */
--background-default          /* #FFFFFF - Main page background */
--background-subtle           /* neutral-100 - Cards, panels */
--background-muted            /* neutral-200 - Disabled areas */
--background-emphasized       /* neutral-300 - Emphasized sections */
--background-inverse          /* neutral-800 - Inverted UI */

/* Brand Backgrounds */
--background-brand            /* green-600 - Primary brand areas */
--background-brand-subtle     /* green-100 - Light brand tint */
--background-brand-muted      /* green-200 - Medium brand tint */
--background-brand-emphasis   /* green-700 - Dark brand areas */

/* Interactive States */
--background-interactive-default   /* neutral-0 */
--background-interactive-hover     /* neutral-200 */
--background-interactive-active    /* neutral-300 */
--background-interactive-selected  /* green-100 */
--background-interactive-disabled  /* neutral-200 */

/* Status Backgrounds */
--background-success          /* green-100 */
--background-success-emphasis /* green-600 */
--background-warning          /* orange-100 */
--background-warning-emphasis /* orange-500 */
--background-error            /* red-100 */
--background-error-emphasis   /* red-600 */
--background-info             /* blue-100 */
--background-info-emphasis    /* blue-500 */
```

### Semantic Foreground Tokens

```css
/* Text Hierarchy */
--foreground-default      /* neutral-800 - Primary text */
--foreground-muted        /* neutral-700 - Secondary text */
--foreground-subtle       /* neutral-600 - Tertiary text */
--foreground-disabled     /* neutral-500 - Disabled text */
--foreground-inverse      /* neutral-0 - Text on dark bg */
--foreground-on-emphasis  /* #FFFFFF - Text on emphasis bg */

/* Brand Text */
--foreground-brand          /* green-700 */
--foreground-brand-emphasis /* green-800 */

/* Status Text */
--foreground-success  /* green-700 */
--foreground-warning  /* orange-700 */
--foreground-error    /* red-700 */
--foreground-info     /* blue-700 */

/* Links */
--foreground-link         /* blue-600 */
--foreground-link-hover   /* blue-700 */
--foreground-link-visited /* purple-600 */
```

### Semantic Border Tokens

```css
/* Default Borders */
--border-default   /* neutral-400 */
--border-muted     /* neutral-300 */
--border-emphasis  /* neutral-500 */
--border-strong    /* neutral-600 */
--border-inverse   /* neutral-0 */
--border-disabled  /* neutral-300 */

/* Brand Borders */
--border-brand          /* green-400 */
--border-brand-emphasis /* green-500 */

/* Interactive Borders */
--border-interactive-default /* neutral-400 */
--border-interactive-hover   /* neutral-500 */
--border-interactive-focus   /* green-500 */
--border-interactive-active  /* green-600 */

/* Status Borders */
--border-success /* green-400 */
--border-warning /* orange-400 */
--border-error   /* red-400 */
--border-info    /* blue-400 */
```

### Component Tokens (Tier 3)

#### Button Tokens

```css
/* Primary Button - Figma: bg #0A3D2C, hover #0e5249, text #e5f1ff */
--button-primary-background        /* green-800 */
--button-primary-background-hover  /* green-700 */
--button-primary-background-active /* green-900 */
--button-primary-foreground        /* blue-100 */

/* Secondary Button - Figma: bg #cce4ff, hover #99c9ff, text #0A3D2C */
--button-secondary-background        /* blue-200 */
--button-secondary-background-hover  /* blue-300 */
--button-secondary-background-active /* blue-400 */
--button-secondary-foreground        /* green-800 */

/* Tertiary Button - Figma: bg #f2ede9, hover #e5dfd8, text #0A3D2C */
--button-tertiary-background        /* neutral-200 */
--button-tertiary-background-hover  /* neutral-300 */
--button-tertiary-background-active /* neutral-400 */
--button-tertiary-foreground        /* green-800 */

/* Inverse Button - Figma: bg white, hover #eaffe0, text #0A3D2C */
--button-inverse-background        /* neutral-0 */
--button-inverse-background-hover  /* green-100 */
--button-inverse-background-active /* green-200 */
--button-inverse-foreground        /* green-800 */

/* Destructive Button - Figma: bg #ff5c5c, hover #e90000, text white */
--button-destructive-background        /* red-500 */
--button-destructive-background-hover  /* red-600 */
--button-destructive-background-active /* red-700 */
--button-destructive-foreground        /* #FFFFFF */

/* Ghost & Outline */
--button-ghost-background        /* transparent */
--button-ghost-background-hover  /* neutral-200 */
--button-ghost-foreground        /* neutral-700 */

--button-outline-background /* transparent */
--button-outline-border     /* neutral-400 */
--button-outline-foreground /* neutral-800 */

/* Disabled */
--button-disabled-background /* neutral-200 */
--button-disabled-foreground /* neutral-500 */
```

#### Input/Form Tokens

```css
--input-background             /* neutral-100 */
--input-background-hover       /* neutral-200 */
--input-background-focus       /* neutral-0 */
--input-background-disabled    /* neutral-200 */
--input-foreground             /* neutral-800 */
--input-foreground-placeholder /* neutral-500 */
--input-border                 /* neutral-200 */
--input-border-hover           /* neutral-300 */
--input-border-focus           /* green-500 */
--input-border-error           /* red-500 */
--input-border-success         /* green-500 */
```

#### Select/Dropdown Tokens

```css
--select-background              /* neutral-100 */
--select-background-open         /* neutral-0 */
--select-border                  /* neutral-200 */
--select-border-focus            /* green-500 */
--select-foreground              /* green-800 */
--select-foreground-placeholder  /* neutral-600 */
--select-content-background      /* neutral-0 */
--select-item-background-hover   /* neutral-100 */
--select-item-foreground-selected /* blue-500 */
--select-item-checkmark          /* blue-500 */
```

#### Card Tokens

```css
--card-background          /* neutral-0 */
--card-background-hover    /* neutral-100 */
--card-background-selected /* green-100 */
--card-background-feature  /* green-800 */
--card-foreground          /* neutral-800 */
--card-foreground-muted    /* neutral-700 */
--card-border              /* neutral-300 */
--card-border-hover        /* neutral-400 */
```

#### Badge Tokens

```css
/* Each variant has: background, foreground, border */
--badge-neutral-*   /* neutral-200, neutral-700, neutral-400 */
--badge-primary-*   /* green-100, green-700, green-300 */
--badge-success-*   /* green-100, green-700, green-300 */
--badge-warning-*   /* orange-100, orange-700, orange-300 */
--badge-error-*     /* red-100, red-700, red-300 */
--badge-info-*      /* blue-100, blue-700, blue-300 */
--badge-accent-*    /* purple-100, purple-700, purple-300 */
```

#### Switch Tokens

```css
--switch-background              /* neutral-400 */
--switch-background-hover        /* neutral-500 */
--switch-background-checked      /* blue-500 */
--switch-background-checked-hover /* blue-600 */
--switch-thumb                   /* neutral-0 */
```

#### ATS Pipeline Stage Tokens

```css
/* Each stage has: background, foreground, border */
--stage-new-*        /* neutral-200, neutral-700, neutral-400 */
--stage-applied-*    /* blue-100, blue-700, blue-300 */
--stage-screening-*  /* green-100, green-700, green-300 */
--stage-interview-*  /* purple-100, purple-700, purple-300 */
--stage-offer-*      /* yellow-100, yellow-700, yellow-300 */
--stage-hired-*      /* green-200, green-800, green-400 */
--stage-rejected-*   /* red-100, red-700, red-300 */
--stage-withdrawn-*  /* neutral-200, neutral-600, neutral-400 */
```

#### Match Score Tokens

```css
--match-high-*   /* green-100, green-700, green-600 (80-100) */
--match-medium-* /* yellow-100, yellow-700, yellow-500 (50-79) */
--match-low-*    /* orange-100, orange-700, orange-500 (0-49) */
```

### Typography Tokens

```css
/* Font Family */
--font-sans: 'DM Sans', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* Type Scale (use text-* utility classes) */
--text-display: 4.5rem;       /* 72px - Hero headlines */
--text-heading-lg: 3rem;      /* 48px - Page titles */
--text-heading-md: 2.25rem;   /* 36px - Section headers */
--text-heading-sm: 1.5rem;    /* 24px - Card headers */
--text-body-strong: 1.125rem; /* 18px bold - Emphasized body */
--text-body: 1.125rem;        /* 18px - Default body */
--text-body-sm: 1rem;         /* 16px - Secondary body */
--text-caption-strong: 0.875rem; /* 14px bold - Labels */
--text-caption: 0.875rem;     /* 14px - Captions */
--text-caption-sm: 0.75rem;   /* 12px - Fine print */

/* Font Weights */
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing Tokens

```css
--space-0: 0;
--space-0-5: 0.125rem;  /* 2px */
--space-1: 0.25rem;     /* 4px */
--space-1-5: 0.375rem;  /* 6px */
--space-2: 0.5rem;      /* 8px */
--space-2-5: 0.625rem;  /* 10px */
--space-3: 0.75rem;     /* 12px */
--space-4: 1rem;        /* 16px */
--space-5: 1.25rem;     /* 20px */
--space-6: 1.5rem;      /* 24px */
--space-8: 2rem;        /* 32px */
--space-10: 2.5rem;     /* 40px */
--space-12: 3rem;       /* 48px */
--space-16: 4rem;       /* 64px */
--space-20: 5rem;       /* 80px */
--space-24: 6rem;       /* 96px */
```

### Border Radius Tokens

```css
--radius-none: 0;
--radius-xs: 0.125rem;   /* 2px */
--radius-sm: 0.25rem;    /* 4px */
--radius-md: 0.375rem;   /* 6px */
--radius-lg: 0.5rem;     /* 8px */
--radius-xl: 0.75rem;    /* 12px */
--radius-2xl: 1rem;      /* 16px */
--radius-3xl: 1.5rem;    /* 24px */
--radius-full: 9999px;

/* Semantic Radius */
--radius-card: var(--radius-xl);     /* 12px */
--radius-button: var(--radius-lg);   /* 8px */
--radius-input: var(--radius-md);    /* 6px */
--radius-badge: var(--radius-full);
--radius-chip: var(--radius-lg);     /* 8px */
--radius-avatar: var(--radius-full);
--radius-tooltip: var(--radius-md);
--radius-popover: var(--radius-lg);
--radius-modal: var(--radius-xl);
```

### Shadow Tokens

```css
--shadow-none: none;
--shadow-xs: 0 1px 3px 0 rgb(0 0 0 / 0.08);
--shadow-sm: 0 1px 4px 0 rgb(0 0 0 / 0.10), 0 1px 2px -1px rgb(0 0 0 / 0.08);
--shadow-md: 0 4px 8px -1px rgb(0 0 0 / 0.14), 0 2px 4px -2px rgb(0 0 0 / 0.10);
--shadow-lg: 0 10px 20px -3px rgb(0 0 0 / 0.16), 0 4px 8px -4px rgb(0 0 0 / 0.10);
--shadow-xl: 0 20px 32px -5px rgb(0 0 0 / 0.18), 0 8px 14px -6px rgb(0 0 0 / 0.12);
--shadow-2xl: 0 25px 56px -12px rgb(0 0 0 / 0.28);
--shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.10);

/* Component Shadows — key (tight/directional) + ambient (soft/diffused) */
--shadow-card: 0 1px 3px 0 rgb(0 0 0 / 0.07), 0 2px 6px -1px rgb(0 0 0 / 0.08);
--shadow-card-hover: 0 2px 4px 0 rgb(0 0 0 / 0.08), 0 6px 16px -2px rgb(0 0 0 / 0.14);
--shadow-elevated: 0 2px 4px 0 rgb(0 0 0 / 0.08), 0 6px 20px -2px rgb(0 0 0 / 0.16);
--shadow-dropdown: 0 2px 6px 0 rgb(0 0 0 / 0.08), 0 10px 24px -4px rgb(0 0 0 / 0.18);
--shadow-modal: 0 4px 10px 0 rgb(0 0 0 / 0.10), 0 28px 64px -12px rgb(0 0 0 / 0.28);
--shadow-tooltip: 0 2px 4px 0 rgb(0 0 0 / 0.10), 0 6px 20px -2px rgb(0 0 0 / 0.18);
--shadow-button: 0 1px 3px 0 rgb(0 0 0 / 0.10);
--shadow-button-active: inset 0 2px 4px 0 rgb(0 0 0 / 0.16);
--shadow-focus: 0 0 0 2px var(--primitive-neutral-0), 0 0 0 4px var(--primitive-green-500);
```

### Motion Tokens

```css
/* Durations */
--duration-instant: 0ms;
--duration-fastest: 50ms;   /* Micro-interactions */
--duration-fast: 100ms;     /* Hover states */
--duration-normal: 150ms;   /* Standard transitions */
--duration-moderate: 200ms; /* Card interactions */
--duration-slow: 300ms;     /* Modals entering */
--duration-slower: 400ms;   /* Complex animations */
--duration-slowest: 500ms;  /* Full-screen transitions */

/* Easings */
--ease-default: cubic-bezier(0.25, 0.1, 0.25, 1);
--ease-in: cubic-bezier(0.42, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.58, 1);
--ease-in-out: cubic-bezier(0.42, 0, 0.58, 1);
--ease-emphasized: cubic-bezier(0.2, 0, 0, 1);
--ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* Semantic Transitions */
--transition-colors   /* Color changes - fast */
--transition-opacity  /* Fade effects */
--transition-transform /* Movement */
--transition-shadow   /* Shadow changes */
--transition-button   /* Button interactions */
--transition-input    /* Form focus states */
--transition-card     /* Card hover effects */
--transition-modal-enter /* Modal open */
--transition-modal-exit  /* Modal close */
```

### Z-Index Tokens

```css
--z-behind: -1;
--z-base: 0;
--z-raised: 1;
--z-dropdown: 1000;
--z-sticky: 1020;
--z-fixed: 1030;
--z-modal-backdrop: 1040;
--z-modal: 1050;
--z-popover: 1060;
--z-tooltip: 1070;
--z-toast: 1080;
--z-max: 9999;
```

---

## 4. Implementation Rules

1. **Never hardcode values** — Always reference tokens via CSS variables
2. **Match Figma specs exactly** — Pixel-perfect implementation
3. **Use existing components** — Check `/src/components/ui/` first
4. **Prefer semantic tokens** — Use `--foreground-error` not `--primitive-red-700`
5. **Check dark mode** — Tokens automatically adapt; verify appearance

### Correct Usage Examples

```tsx
// ✅ CORRECT - Using semantic token
<div className="bg-[var(--background-brand)] text-[var(--foreground-on-emphasis)]">

// ✅ CORRECT - Using component token
<button className="bg-[var(--button-primary-background)] hover:bg-[var(--button-primary-background-hover)]">

// ✅ CORRECT - Using Tailwind with token
<div className="rounded-[var(--radius-card)] shadow-[var(--shadow-card)]">

// ❌ WRONG - Hardcoded value
<div className="bg-[#0A3D2C]">

// ❌ WRONG - Using primitive when semantic exists
<div className="bg-[var(--primitive-green-800)]"> // Use --button-primary-background instead
```

---

## 5. Flag Inconsistencies

If Figma contains values that don't align with the token system, pause and ask:

1. **Add as new token?** — If it's a reusable pattern
2. **Use closest existing token?** — If difference is negligible
3. **One-off override with comment?** — If truly unique

```tsx
// Document exceptions clearly
<div
  className="bg-[#123456]" // One-off: Figma spec uses non-standard brand blue for promo banner
>
```

---

## 6. Dark Mode Considerations

All semantic and component tokens automatically switch in dark mode. However:

- Verify visual appearance in both modes
- Green-tinted dark backgrounds are intentional (not pure grays)
- Some tokens change more dramatically (e.g., card-background-feature inverts)

---

## 7. Using TypeScript Tokens

For runtime calculations, animations, or chart libraries:

```tsx
import { colors, spacing, motion, shadows } from '@/lib/tokens';

// Framer Motion example
<motion.div
  animate={{ y: motion.distance.md }}
  transition={{
    duration: motion.duration.normal / 1000,
    ease: motion.easing.spring
  }}
/>

// Chart library example
const chartConfig = {
  colors: [colors.primary[500], colors.blue[500], colors.purple[500]]
};
```

---

## Checklist

Before submitting Figma implementation:

- [ ] All colors mapped to tokens (no hardcoded hex values)
- [ ] Spacing uses `--space-*` tokens
- [ ] Typography uses `--text-*` and `--font-*` tokens
- [ ] Border radius uses `--radius-*` tokens
- [ ] Shadows use `--shadow-*` tokens
- [ ] Interactive states use appropriate hover/active/focus tokens
- [ ] Dark mode verified
- [ ] Component tokens used where available (button, input, card, etc.)
- [ ] Any exceptions documented with comments
