---
name: design-system
description: Canopy design system standards. Use when working with UI components, icons, colors, spacing, tokens, or component library. Covers Phosphor icons, design tokens, component usage, and migration patterns.
---

# Design System Skill

## Purpose

Ensure consistent use of the Canopy design system across all UI code, including proper component usage, token compliance, and icon library standards.

## When to Use This Skill

Automatically activates when:

- Creating or modifying UI components
- Working with icons
- Using colors or spacing
- Implementing component library patterns
- Migrating from non-standard patterns

---

## Core Standards

### 1. Icons - Phosphor Only

```tsx
// ✅ CORRECT - Phosphor icons
import { MagnifyingGlass, User, CaretDown } from "@phosphor-icons/react";

<MagnifyingGlass size={20} weight="regular" />
<User size={24} weight="fill" />

// ❌ WRONG - Lucide icons
import { Search, User } from "lucide-react";

// ❌ WRONG - Heroicons
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
```

### 2. Colors - Design Tokens Only

```tsx
// ✅ CORRECT - CSS variables
className = "bg-[var(--background-brand)] text-[var(--foreground-default)]";
className = "border-[var(--border-muted)]";
className = "text-[var(--primitive-green-600)]";

// ❌ WRONG - Hardcoded hex values
className = "bg-[#0A3D2C] text-[#1F1D1C]";
className = "border-[#E5DFD8]";

// ❌ WRONG - RGB/HSL values
className = "bg-[rgb(10,61,44)]";
```

### 3. Spacing - Tailwind Scale

```tsx
// ✅ CORRECT - Tailwind spacing scale
className = "p-4 mt-6 gap-2";
className = "px-3 py-2";

// ❌ WRONG - Arbitrary pixel values
className = "p-[17px] mt-[23px]";
className = "px-[13px]";
```

### 4. Components - Design System Components

```tsx
// ✅ CORRECT - Design system components
import { Button, Input, Card, Badge } from "@/components/ui";

<Button variant="primary">Save</Button>
<Input placeholder="Search..." />
<Card>Content</Card>

// ❌ WRONG - Raw HTML elements
<button className="...">Save</button>
<input className="..." />
<div className="rounded border p-4">Content</div>
```

### 5. Typography - Scale Classes

```tsx
// ✅ CORRECT - Typography scale
className = "text-heading-lg font-bold";
className = "text-body text-foreground-muted";
className = "text-caption";

// ❌ WRONG - Custom font sizes
className = "text-[19px] font-[450]";
```

---

## Icon Migration Guide

| Old (Lucide/Heroicons) | New (Phosphor)    |
| ---------------------- | ----------------- |
| `Search`               | `MagnifyingGlass` |
| `User`                 | `User`            |
| `Plus`                 | `Plus`            |
| `X`                    | `X`               |
| `ChevronDown`          | `CaretDown`       |
| `ChevronRight`         | `CaretRight`      |
| `Check`                | `Check`           |
| `Trash`                | `Trash`           |
| `Edit` / `Pencil`      | `PencilSimple`    |
| `Settings` / `Cog`     | `Gear`            |
| `Home`                 | `House`           |
| `Mail`                 | `Envelope`        |
| `Calendar`             | `Calendar`        |
| `Clock`                | `Clock`           |
| `Download`             | `DownloadSimple`  |
| `Upload`               | `UploadSimple`    |

---

## Component Variants

### Button

| Variant       | Use Case              |
| ------------- | --------------------- |
| `primary`     | Main action on page   |
| `secondary`   | Secondary actions     |
| `tertiary`    | Subtle actions        |
| `destructive` | Delete/remove actions |
| `outline`     | Bordered buttons      |
| `ghost`       | Minimal buttons       |

### Badge

| Variant   | Use Case         |
| --------- | ---------------- |
| `neutral` | Default status   |
| `primary` | Highlighted info |
| `success` | Positive status  |
| `warning` | Caution needed   |
| `error`   | Negative status  |
| `info`    | Informational    |

---

## Quick Checklist

Before committing UI code:

- [ ] All icons are Phosphor (not Lucide/Heroicons)
- [ ] All colors use CSS variables
- [ ] All spacing uses Tailwind scale
- [ ] Using `<Button>` not `<button>`
- [ ] Using `<Input>` not `<input>`
- [ ] Using `<Card>` not custom card divs
- [ ] Typography uses scale classes
- [ ] Dark mode works correctly

---

## Resource Files

### [tokens.md](resources/tokens.md)

Complete token reference: all color, spacing, typography, shadow tokens.

### [components.md](resources/components.md)

Component usage guide with all variants and props.

### [icons.md](resources/icons.md)

Full icon migration guide and Phosphor usage patterns.

---

## Related Commands

- `/design-review` - Review UI changes
- `/design-scan` - Full design system audit
- `/fix-design all` - Auto-fix design issues

---

**Skill Status**: COMPLETE ✅
**Line Count**: < 150 lines ✅
**Progressive Disclosure**: 3 resource files ✅
