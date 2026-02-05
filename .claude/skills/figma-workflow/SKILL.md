---
name: figma-workflow
description: Figma to code implementation workflow for Canopy. Use when implementing designs from Figma, mapping design tokens, verifying implementations, or working with Figma links/URLs. Covers token reconciliation, component mapping, and verification checklists.
---

# Figma Workflow Skill

## Purpose

Guide the implementation of designs from Figma to production code, ensuring pixel-perfect results with proper token usage and design system compliance.

## When to Use This Skill

Automatically activates when:

- Implementing designs from Figma
- Working with Figma links or URLs
- Mapping Figma values to design tokens
- Verifying implementation matches design
- Discussing design handoff

---

## Implementation Workflow

### Phase 1: Design Analysis

1. **Open Figma file** using MCP tools
2. **Identify components** - What existing components can be reused?
3. **Note custom elements** - What needs to be built new?
4. **List all states** - Default, hover, focus, active, disabled, etc.

### Phase 2: Component Mapping

Map Figma elements to Canopy components:

| Figma Element    | Canopy Component             |
| ---------------- | ---------------------------- |
| Button (filled)  | `<Button variant="primary">` |
| Button (outline) | `<Button variant="outline">` |
| Text field       | `<Input>`                    |
| Dropdown         | `<Select>`                   |
| Checkbox         | `<Checkbox>`                 |
| Card             | `<Card>`                     |
| Badge            | `<Badge variant="...">`      |

### Phase 3: Token Reconciliation

**Always use the 3-tier token hierarchy:**

```
TIER 3: COMPONENT    → --button-primary-background (preferred)
TIER 2: SEMANTIC     → --background-brand, --foreground-error
TIER 1: PRIMITIVE    → --primitive-green-600 (last resort)
```

**Token files:**

- `src/app/globals.css` - CSS custom properties (source of truth)
- `src/lib/tokens.ts` - TypeScript access for runtime

### Phase 4: Implementation

1. Build component structure
2. Apply design tokens
3. Implement all states
4. Add responsive behavior
5. Test dark mode

### Phase 5: Verification

Run `/figma-verify <url> <path>` to compare implementation with design.

---

## Quick Token Reference

### Colors

| Scale   | 100     | 400     | 600     | 800     |
| ------- | ------- | ------- | ------- | ------- |
| Green   | #EAFFE0 | #8EE07E | #3BA36F | #0A3D2C |
| Blue    | #E5F1FF | #408CFF | #0D3EC7 | #001652 |
| Red     | #FFEBF4 | #FF8599 | #E90000 | #5C0000 |
| Neutral | #FAF9F7 | #CCC6C0 | #7A7671 | #1F1D1C |

### Button Tokens

```css
/* Primary */
--button-primary-background: green-800 --button-primary-foreground: blue-100 /* Secondary */
  --button-secondary-background: blue-200 --button-secondary-foreground: green-800 /* Tertiary */
  --button-tertiary-background: neutral-200 --button-tertiary-foreground: green-800;
```

### Typography

```css
--text-display: 4.5rem /* 72px - Hero */ --text-heading-lg: 3rem /* 48px - Page titles */
  --text-heading-md: 2.25rem /* 36px - Sections */ --text-heading-sm: 1.5rem /* 24px - Cards */
  --text-body: 1.125rem /* 18px - Default */ --text-caption: 0.875rem /* 14px - Captions */;
```

---

## Verification Checklist

Before marking implementation complete:

- [ ] All components use design system components
- [ ] All colors use CSS variables (no hex values)
- [ ] All spacing uses Tailwind scale
- [ ] All typography uses text scale classes
- [ ] All states implemented (hover, focus, etc.)
- [ ] Dark mode verified
- [ ] Responsive behavior verified
- [ ] `/figma-verify` passes

---

## Handling Inconsistencies

If Figma values don't match token system:

1. **Add as new token?** - If it's a reusable pattern
2. **Use closest token?** - If difference is negligible
3. **One-off override?** - If truly unique (add comment)

**Always flag inconsistencies** to the user before proceeding.

---

## Resource Files

### [tokens.md](resources/tokens.md)

Complete token reference: colors, typography, spacing, shadows, motion, z-index.

### [component-mapping.md](resources/component-mapping.md)

Detailed mapping from Figma elements to Canopy components.

---

## Related Commands

- `/figma-implement <url>` - Guided implementation workflow
- `/figma-verify <url> <path>` - Verify implementation matches design

---

**Skill Status**: COMPLETE ✅
**Line Count**: < 150 lines ✅
**Progressive Disclosure**: 2 resource files ✅
