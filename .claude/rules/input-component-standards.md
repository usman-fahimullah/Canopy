# Input Component Standards

---

## trigger: input, form, checkbox, radio, switch, slider, select, dropdown, combobox, datepicker, timepicker, chip, search, textarea, file upload, currency, mention, rich text, form control

This rule defines the mandatory color and interaction standards for ALL input/form components in the Canopy design system. Every input component MUST follow these patterns to ensure visual consistency across the product.

---

## Core Decisions

These decisions are final and apply to every input component:

| Decision                   | Standard                                               | Rationale                                    |
| -------------------------- | ------------------------------------------------------ | -------------------------------------------- |
| **Focus color**            | `blue-500` via `--ring-color` / `--input-border-focus` | Unified focus indicator across all inputs    |
| **Focus mechanism**        | Ring (`focus-visible:ring-2`) for all components       | Consistent, accessible, works at all sizes   |
| **Selected/checked color** | `blue-500` via component tokens                        | Single "active/selected" color across inputs |
| **Token tier**             | Semantic/component tokens; never raw primitives        | Dark mode compatibility, maintainability     |
| **Hover (text fields)**    | Border color change via `--input-border-hover`         | Reinforces container shape                   |
| **Hover (controls)**       | Background tint change via component tokens            | Larger visible hit area                      |
| **Error color**            | `--input-border-error` / component `--*-border-error`  | Consistent red-500 border across all         |
| **Disabled**               | `opacity-50 + cursor-not-allowed`                      | Consistent disabled affordance               |

---

## Token Usage by Component Type

### Text Input Fields (Input, Textarea, SearchInput, CurrencyInput, MentionInput)

```
Background:   var(--input-background)
Border:       var(--input-border)
Hover border: var(--input-border-hover)
Focus:        focus-visible:ring-2 ring-[var(--ring-color)] ring-offset-2
Error border: var(--input-border-error)
Success border: var(--input-border-success)
Text:         var(--input-foreground)
Placeholder:  var(--input-foreground-placeholder)
Disabled bg:  var(--input-background-disabled)
```

### Selection Triggers (Dropdown, Combobox, DatePicker trigger)

```
Background:   var(--select-background)
Border:       var(--select-border)
Hover border: var(--select-border-hover)
Focus:        focus-visible:ring-2 ring-[var(--ring-color)] ring-offset-2
Error border: var(--select-border-error)
Text:         var(--select-foreground)
Placeholder:  var(--select-foreground-placeholder)
```

### Toggle Controls (Checkbox, Radio, Switch)

```
Use component-specific tokens (--checkbox-*, --radio-*, --switch-*)
Focus:        focus-visible:ring-2 ring-[var(--ring-color)] ring-offset-2
Error focus:  focus-visible:ring-2 ring-[var(--ring-color-error)] ring-offset-2
Checked:      blue-500 via component tokens (--*-background-checked)
```

### Interactive Items (Dropdown items, Combobox items)

```
Hover:        var(--select-item-background-hover)
Selected bg:  var(--select-item-background-selected)
Selected text: var(--select-item-foreground-selected) — blue-500
```

### Chip / Segmented Controller

```
Focus:        focus-visible:ring-2 ring-[var(--ring-color)] ring-offset-2
Selected:     blue-500 via --chip-selected-* or --primitive-blue-500
```

---

## Mandatory Focus Pattern

**Every interactive input component MUST use this exact focus pattern:**

```tsx
// Standard focus ring (all components)
"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2";

// Error state focus ring
"focus-visible:ring-[var(--ring-color-error)]";
```

**NEVER use these for focus:**

- `focus:border-[var(--primitive-green-600)]` (border-only focus — not visible enough)
- `focus:ring-0` (disabled focus — accessibility violation)
- `focus-visible:ring-[var(--primitive-green-500)]` (wrong color)
- `focus-visible:ring-[var(--checkbox-border-checked)]` (component token as ring — use `--ring-color`)

---

## Mandatory Hover Patterns

### Text Input Fields — Border Change

```tsx
// Input, Textarea, SearchInput, DatePicker trigger, Dropdown trigger
"hover:border-[var(--input-border-hover)]";
// or for select-based
"hover:border-[var(--select-border-hover)]";
```

### Toggle Controls — Background Change

```tsx
// Checkbox
"hover:border-[var(--checkbox-border-hover)]";
"hover:bg-[var(--checkbox-background-hover)]";

// Radio
"hover:border-[var(--radio-border-hover)]";
"hover:bg-[var(--radio-background-hover)]";

// Switch
"hover:bg-[var(--switch-background-hover)]";
```

### List Items — Background Change

```tsx
// Dropdown/Combobox items
"hover:bg-[var(--select-item-background-hover)]";
```

---

## Banned Patterns

| Pattern                                                 | Why                                 | Fix                                       |
| ------------------------------------------------------- | ----------------------------------- | ----------------------------------------- |
| `focus:border-[var(--primitive-green-600)]`             | Primitive token, inconsistent focus | Use `ring-[var(--ring-color)]`            |
| `focus:ring-0`                                          | Removes focus indicator             | Remove this class                         |
| `bg-[var(--primitive-neutral-100)]` in Input            | Primitive instead of semantic       | Use `var(--input-background)`             |
| `border-[var(--primitive-neutral-200)]` in Input        | Primitive instead of semantic       | Use `var(--input-border)`                 |
| `border-[var(--primitive-red-600)]` for error           | Primitive instead of semantic       | Use `var(--input-border-error)`           |
| `placeholder:text-[var(--primitive-neutral-600)]`       | Primitive placeholder               | Use `var(--input-foreground-placeholder)` |
| `hover:bg-[var(--background-error)]` on clear btn       | Error color for hover               | Use neutral hover token                   |
| `focus-visible:ring-[var(--switch-background-checked)]` | Component token as ring             | Use `var(--ring-color)`                   |
| `shadow-[1px_3px_16px_0px_rgba(...)]`                   | Inline shadow                       | Use `var(--shadow-*)` token               |

---

## Error State Standards

All components signal error the same way:

```
Text inputs:  border-[var(--input-border-error)]
Selects:      border-[var(--select-border-error)]
Checkboxes:   border-[var(--checkbox-border-error)] bg-[var(--checkbox-background-error)]
Radios:       border-[var(--radio-border-error)] bg-[var(--radio-background-error)]
Switches:     border-[var(--switch-border-error)] (NOT background)
Focus ring:   ring-[var(--ring-color-error)]
Error text:   text-[var(--foreground-error)]
```

---

## Checklist for New Input Components

When building any new input or form control component:

- [ ] Background uses `--input-background` or component-specific token
- [ ] Border uses `--input-border` or component-specific token
- [ ] Focus uses `focus-visible:ring-2 ring-[var(--ring-color)] ring-offset-2`
- [ ] Error uses `--input-border-error` or component-specific error token
- [ ] Error focus uses `ring-[var(--ring-color-error)]`
- [ ] Placeholder uses `--input-foreground-placeholder`
- [ ] Hover follows the correct pattern (border for fields, bg for controls)
- [ ] No primitive tokens used directly (use semantic/component tier)
- [ ] No hardcoded hex values
- [ ] Disabled uses `opacity-50 cursor-not-allowed`
- [ ] Dark mode works (verified via token auto-switching)
- [ ] Selected/checked state uses `blue-500` via component tokens

---

## Token Reference (Quick Lookup)

| Purpose             | Token                                        | Value                                            |
| ------------------- | -------------------------------------------- | ------------------------------------------------ |
| Focus ring color    | `--ring-color`                               | blue-500                                         |
| Focus ring error    | `--ring-color-error`                         | red-500                                          |
| Input bg            | `--input-background`                         | neutral-100 (light) / neutral-200 (dark)         |
| Input border        | `--input-border`                             | alpha-2 (9% warm neutral, composites on surface) |
| Input border hover  | `--input-border-hover`                       | alpha-3 (14% warm neutral)                       |
| Input border focus  | `--input-border-focus`                       | blue-500                                         |
| Input border error  | `--input-border-error`                       | red-500                                          |
| Input placeholder   | `--input-foreground-placeholder`             | neutral-500 (light) / neutral-600 (dark)         |
| Checked/selected    | `--checkbox/radio/switch-background-checked` | blue-500                                         |
| Selected item text  | `--select-item-foreground-selected`          | blue-500                                         |
| Checkbox border     | `--checkbox-border`                          | alpha-4 (20% warm neutral)                       |
| Radio border        | `--radio-border`                             | alpha-4 (20% warm neutral)                       |
| Switch thumb border | `--switch-thumb-border`                      | alpha-4 (20% warm neutral)                       |
