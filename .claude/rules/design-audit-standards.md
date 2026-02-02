# Design Audit Standards

---

## trigger: always

This rule establishes the design system compliance standards for the Canopy codebase. Every UI implementation must adhere to the Trails Design System to ensure consistency, maintainability, dark mode support, and accessibility.

Related rules: `design-first-implementation.md` for workflow, `figma-implementation.md` for token reference, `design-system-sync.md` for documentation sync.

---

## Philosophy

The Trails Design System exists to prevent visual drift and one-off implementations. When code bypasses the design system—even if it "looks right"—it creates:

1. **Unmaintainable code** — Scattered inline styles instead of centralized tokens
2. **Broken dark mode** — Hardcoded colors don't respond to theme changes
3. **Accessibility gaps** — Custom implementations miss keyboard/screen reader support
4. **Inconsistent UX** — Visual variations confuse users and dilute brand
5. **Technical debt** — Every one-off is a component waiting to be extracted

---

## Mandatory Standards

### 1. Component-First Architecture

Every UI element MUST use design system components when they exist.

| Pattern | Use This | Never Use |
| ------- | -------- | --------- |
| Buttons | `<Button variant="...">` | Raw `<button>` with classes |
| Inputs | `<Input>`, `<SearchInput>` | Raw `<input>` |
| Selects | `<Dropdown>`, `<Select>` | Raw `<select>` or custom div |
| Checkboxes | `<Checkbox>`, `<CheckboxWithLabel>` | Raw `<input type="checkbox">` |
| Switches | `<Switch>`, `<SwitchWithLabel>` | Custom toggle div |
| Cards | `<Card>`, `<CardContent>` | `<div className="rounded-... border-...">` |
| Badges | `<Badge>`, `<StageBadge>` | Colored span with inline styles |
| Tables | `<DataTable>`, `<EnhancedDataTable>` | Raw `<table>` or mapped divs |
| Modals | `<Modal>`, `<Dialog>` | Custom overlay div |
| Tooltips | `<SimpleTooltip>`, `<Tooltip>` | Title attribute or custom hover |
| Tabs | `<Tabs>`, `<SegmentedController>` | Row of styled buttons |
| Avatars | `<Avatar>`, `<AvatarGroup>` | Custom rounded image div |
| Tags | `<Chip>`, `<CategoryTag>`, `<PathwayTag>` | Custom styled span |
| Loading | `<Spinner>`, `<Skeleton>` | Custom animation |
| Empty states | `<EmptyState>` variants | Custom "no data" div |

```tsx
// ❌ WRONG - bypassing design system
<button className="rounded-lg bg-[#0A3D2C] px-4 py-2 text-white hover:bg-[#0E5249]">
  Submit
</button>

// ✅ CORRECT - using design system component
<Button variant="primary">Submit</Button>
```

---

### 2. Token Hierarchy Enforcement

All styling must use the 3-tier token system. Higher tiers are always preferred.

```
TIER 3: Component tokens  →  --button-primary-background (PREFERRED)
TIER 2: Semantic tokens    →  --background-brand
TIER 1: Primitive tokens   →  --primitive-green-600 (LAST RESORT)
```

**Token Selection Rules:**

| Context | Use This Tier | Example |
| ------- | ------------- | ------- |
| Button styling | Component | `--button-primary-background` |
| Card backgrounds | Component | `--card-background` |
| Input borders | Component | `--input-border-focus` |
| General text | Semantic | `--foreground-default` |
| Status colors | Semantic | `--foreground-error` |
| Backgrounds | Semantic | `--background-subtle` |
| One-offs (documented) | Primitive | `--primitive-green-600` |

```tsx
// ❌ WRONG - primitive when component token exists
className="bg-[var(--primitive-green-800)]"

// ✅ CORRECT - component token
className="bg-[var(--button-primary-background)]"

// ❌ WRONG - hardcoded hex
className="text-[#DC2626]"

// ✅ CORRECT - semantic token
className="text-[var(--foreground-error)]"
```

---

### 3. No Hardcoded Values

All colors, spacing, radius, and shadows must use tokens or Tailwind scale.

| Property | Banned Pattern | Correct Pattern |
| -------- | -------------- | --------------- |
| Colors | `#0A3D2C`, `rgb(...)` | `var(--token-name)` |
| Spacing | `p-[24px]`, `gap-[16px]` | `p-6`, `gap-4` (Tailwind scale) |
| Border radius | `rounded-[16px]` | `rounded-[var(--radius-card)]` |
| Shadows | `shadow-[0_4px_...]` | `shadow-[var(--shadow-card)]` |
| Font sizes | `text-[18px]` | `text-body`, `text-caption` |

```tsx
// ❌ WRONG - hardcoded values
<div className="rounded-[16px] p-[24px] shadow-[0_4px_6px_rgba(0,0,0,0.1)]">

// ✅ CORRECT - tokens and Tailwind scale
<div className="rounded-[var(--radius-card)] p-6 shadow-[var(--shadow-card)]">
```

---

### 4. Icon Library Compliance

Only Phosphor Icons are allowed. No other icon libraries.

```tsx
// ❌ WRONG - other icon libraries
import { Search } from "lucide-react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

// ✅ CORRECT - Phosphor only
import { MagnifyingGlass } from "@phosphor-icons/react";
```

**Import Pattern:**
```tsx
// Import from @phosphor-icons/react
import { IconName, AnotherIcon } from "@phosphor-icons/react";

// Use with weight prop
<IconName size={20} weight="regular" />
<IconName size={20} weight="bold" />
<IconName size={20} weight="fill" />
```

---

### 5. Typography Scale Compliance

All text must use the defined typography scale classes.

| Use Case | Class | Size |
| -------- | ----- | ---- |
| Hero headlines | `text-display` | 72px |
| Page titles | `text-heading-lg` | 48px |
| Section headers | `text-heading-md` | 36px |
| Card headers | `text-heading-sm` | 24px |
| Emphasized body | `text-body-strong` | 18px bold |
| Default body | `text-body` | 18px |
| Secondary body | `text-body-sm` | 16px |
| Labels | `text-caption-strong` | 14px bold |
| Captions | `text-caption` | 14px |
| Fine print | `text-caption-sm` | 12px |

```tsx
// ❌ WRONG - custom font sizes
<h2 className="text-[28px] font-semibold">Title</h2>
<p className="text-[15px]">Body text</p>

// ✅ CORRECT - typography scale
<h2 className="text-heading-sm font-semibold">Title</h2>
<p className="text-body">Body text</p>
```

---

### 6. Dark Mode Compatibility

All implementations must work in dark mode automatically via token usage.

**Verification Required:**
- [ ] No hardcoded colors (use tokens)
- [ ] No hardcoded backgrounds (use semantic tokens)
- [ ] Borders use token-based colors
- [ ] Shadows adjust appropriately
- [ ] Text remains readable on all backgrounds

```tsx
// ❌ WRONG - breaks in dark mode
<div className="bg-white text-black border-gray-300">

// ✅ CORRECT - dark mode compatible
<div className="bg-[var(--background-default)] text-[var(--foreground-default)] border-[var(--border-default)]">
```

---

### 7. Component State Coverage

All interactive components must handle all visual states:

| State | Required | Tokens Available |
| ----- | -------- | ---------------- |
| Default | ✅ | `--*-background`, `--*-foreground` |
| Hover | ✅ | `--*-background-hover` |
| Focus | ✅ | `--*-border-focus`, `--shadow-focus` |
| Active | ✅ | `--*-background-active` |
| Disabled | ✅ | `--*-disabled-*` |
| Loading | For async | `<Spinner>`, `<Skeleton>` |
| Error | For forms | `--*-error` tokens |

---

### 8. Responsive Design

All layouts must be responsive using Tailwind breakpoints:

```tsx
// ✅ CORRECT - responsive classes
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
<h1 className="text-heading-sm md:text-heading-md lg:text-heading-lg">
```

**Breakpoint Scale:**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

---

## Anti-Patterns (Hard Rules)

### Never Commit These

| Pattern | Why Blocked | Fix |
| ------- | ----------- | --- |
| Raw `<button>` with styling | Bypasses Button component | Use `<Button>` |
| Raw `<input>` with styling | Bypasses Input component | Use `<Input>` |
| `className` > 150 chars | Re-implementing component | Extract to component |
| Hardcoded hex `#XXXXXX` | Breaks dark mode | Use CSS variable token |
| `rounded-[16px]` | Inconsistent radius | Use `--radius-card` |
| `p-[24px]`, `gap-[16px]` | Inconsistent spacing | Use Tailwind scale |
| Lucide/Heroicons imports | Wrong icon library | Use Phosphor |
| Custom card div | Bypasses Card component | Use `<Card>` |
| `text-[15px]` | Off-scale typography | Use typography class |

---

## ClassName Length Rule

**If className exceeds ~100-150 characters, you're re-implementing a component.**

```tsx
// ❌ RED FLAG - 200+ character className
<input
  className="w-full rounded-[16px] border border-[var(--primitive-neutral-300)] bg-white py-3 pl-12 pr-4 text-body text-[var(--foreground-default)] placeholder:text-[var(--foreground-subtle)] outline-none transition-colors focus:border-[var(--primitive-green-500)] focus:ring-2 focus:ring-[var(--primitive-green-500)]/20"
/>

// ✅ CORRECT - use the component
<SearchInput placeholder="Search..." />
```

**Action when this happens:**
1. Stop and check `/src/components/ui/index.ts` for existing component
2. If exists, use it
3. If not, consider creating a new design system component

---

## One-Off Documentation

If a one-off is truly necessary (rare), document it:

```tsx
{/* One-off: Promotional gradient banner - no design system component exists
    TODO: Extract to <PromoBanner> if pattern is reused */}
<div className="bg-gradient-to-r from-[var(--primitive-green-700)] to-[var(--primitive-blue-600)]">
  {children}
</div>
```

---

## Design System File Locations

| File | Purpose |
| ---- | ------- |
| `/src/components/ui/index.ts` | Component exports (check before building) |
| `/src/app/globals.css` | CSS custom properties (token definitions) |
| `/src/lib/tokens.ts` | TypeScript token access |
| `/src/lib/design-system-nav.ts` | Design system documentation navigation |
| `/src/app/design-system/` | Component documentation pages |

---

## Pre-Completion Checklist

Before marking any UI task complete:

### Component Usage
- [ ] All buttons use `<Button>` component
- [ ] All inputs use design system input components
- [ ] All selects use `<Dropdown>` or `<Select>`
- [ ] All cards use `<Card>` component
- [ ] All tables use `<DataTable>` or `<Table>`
- [ ] All modals use `<Modal>` or `<Dialog>`

### Token Compliance
- [ ] No hardcoded hex colors
- [ ] Component tokens used when available
- [ ] Semantic tokens for general styling
- [ ] Primitives only with documentation comment

### Styling
- [ ] No className > 150 characters
- [ ] Tailwind spacing scale used (not custom px)
- [ ] Typography classes used (not custom sizes)
- [ ] Border radius uses tokens

### Icons
- [ ] Only Phosphor icons used
- [ ] No Lucide, Heroicons, or other libraries
- [ ] Icons properly sized with `size` prop

### States & Responsiveness
- [ ] All interactive states implemented
- [ ] Dark mode verified
- [ ] Responsive breakpoints applied
- [ ] Loading/empty/error states exist

### Documentation
- [ ] Design system docs updated if component modified
- [ ] One-offs documented with TODO comment
