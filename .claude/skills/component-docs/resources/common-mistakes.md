# Common Documentation Mistakes

Avoid these common mistakes when documenting components.

---

## Prop Mismatches

### Wrong prop names

```tsx
// ❌ WRONG - Using incorrect prop names
<Input description="Help text" />  // Component uses `helpText`

// ✅ CORRECT
<Input helpText="Help text" />
```

### Wrong prop values

```tsx
// ❌ WRONG - Invalid size value
<Button size="md" />  // Valid: "sm" | "default" | "lg"

// ✅ CORRECT
<Button size="default" />
```

### Wrong variant names

```tsx
// ❌ WRONG - Invalid variant
<Badge variant="green" />  // Valid: "success" | "warning" | "error"

// ✅ CORRECT
<Badge variant="success" />
```

---

## Missing Type Imports

Always import types when needed:

```tsx
// ❌ WRONG - Missing import
const [dates, setDates] = useState<DateRange | undefined>();

// ✅ CORRECT
import { DateRange } from "react-day-picker";
const [dates, setDates] = useState<DateRange | undefined>();
```

---

## Assuming Props Exist

Never assume components have these common props without verifying:

| Prop               | Check For                             |
| ------------------ | ------------------------------------- |
| `asChild`          | Radix pattern - verify implementation |
| `onBlur`           | Might be `onEditEnd` or similar       |
| `value`/`onChange` | Component might be uncontrolled only  |
| `ref`              | Needs `forwardRef` wrapper            |

---

## Hardcoded Colors

```tsx
// ❌ WRONG - Hardcoded hex
className = "text-[#8EE07E]";
className = "bg-[rgba(94,204,112,0.15)]";

// ✅ CORRECT - Use tokens
className = "text-[var(--primitive-green-400)]";
className = "dark:bg-[var(--primitive-green-500)]/15";
```

---

## Incomplete Documentation

### Missing sections

Don't skip required sections. All 12 sections must be included.

### Incomplete variants

Show **ALL** variants, not just primary:

- primary, secondary, tertiary, destructive, ghost, outline

### Missing states

Show **ALL** states:

- default, hover, focus, active, disabled, loading, error

### Text-only Do's/Don'ts

Always include **visual examples** with Do's and Don'ts, not just bullet points.

---

## Copy-Paste Issues

### Missing imports in examples

```tsx
// ❌ WRONG - No imports shown
<Button variant="primary">Click</Button>;

// ✅ CORRECT - Include imports
import { Button } from "@/components/ui";

<Button variant="primary">Click</Button>;
```

### Non-functional examples

Test all code examples to ensure they work when copy-pasted.
