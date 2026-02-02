# Design Review

Perform a comprehensive design system compliance review on UI changes.

## Usage

```
/design-review                      # Review all uncommitted UI changes
/design-review src/app/canopy/      # Review specific directory
/design-review --staged             # Review only staged changes
/design-review --component Button   # Focus on specific component usage
```

## Instructions

When this command is invoked, perform a systematic design compliance review:

### Step 1: Identify UI Files Changed

```bash
# Find changed TSX files (UI files)
git diff --name-only | grep "\.tsx$"

# Or for staged
git diff --cached --name-only | grep "\.tsx$"
```

### Step 2: Check for Raw HTML Elements

Search for banned patterns that bypass design system components:

```bash
# Raw buttons (should use <Button>)
grep -n "<button" --include="*.tsx" [files]

# Raw inputs (should use <Input>, <SearchInput>, etc.)
grep -n "<input" --include="*.tsx" [files]

# Raw selects (should use <Dropdown>, <Select>)
grep -n "<select" --include="*.tsx" [files]

# Raw tables (should use <DataTable>)
grep -n "<table" --include="*.tsx" [files]

# Raw checkboxes
grep -n 'type="checkbox"' --include="*.tsx" [files]
```

**Report findings as:**
```markdown
### Raw HTML Elements (Must Fix)

| File | Line | Element | Should Use |
| ---- | ---- | ------- | ---------- |
| src/app/jobs/page.tsx | 45 | `<button>` | `<Button>` |
| src/components/Filter.tsx | 23 | `<input>` | `<Input>` or `<SearchInput>` |
```

### Step 3: Check for Hardcoded Values

```bash
# Hardcoded hex colors
grep -nE '#[0-9A-Fa-f]{3,8}' --include="*.tsx" [files]

# Hardcoded pixel values in brackets
grep -nE '\[[\d]+px\]' --include="*.tsx" [files]

# Hardcoded rgba/rgb
grep -nE 'rgb\(|rgba\(' --include="*.tsx" [files]
```

**Report findings as:**
```markdown
### Hardcoded Values (Must Fix)

| File | Line | Value | Should Use |
| ---- | ---- | ----- | ---------- |
| src/app/page.tsx | 67 | `#0A3D2C` | `var(--button-primary-background)` |
| src/components/Card.tsx | 12 | `p-[24px]` | `p-6` |
```

### Step 4: Check Token Tier Violations

```bash
# Primitive tokens when component/semantic might exist
grep -nE '--primitive-' --include="*.tsx" [files]
```

For each primitive usage, check if a higher-tier token exists:
- `--primitive-green-800` for buttons → should be `--button-primary-background`
- `--primitive-red-700` for errors → should be `--foreground-error`
- `--primitive-neutral-200` for backgrounds → should be `--background-subtle`

### Step 5: Check Icon Library Usage

```bash
# Wrong icon libraries
grep -nE "from ['\"]lucide-react['\"]" --include="*.tsx" [files]
grep -nE "from ['\"]@heroicons" --include="*.tsx" [files]
grep -nE "from ['\"]react-icons" --include="*.tsx" [files]
```

**Report findings as:**
```markdown
### Icon Library Violations (Must Fix)

| File | Line | Library | Action |
| ---- | ---- | ------- | ------ |
| src/components/Header.tsx | 3 | lucide-react | Replace with @phosphor-icons/react |
```

### Step 6: Check ClassName Length

```bash
# Find potentially long classNames (rough heuristic)
grep -nE 'className="[^"]{150,}"' --include="*.tsx" [files]
```

Flag any className over ~150 characters as likely re-implementing a component.

### Step 7: Check Component Imports

Verify imports are from the design system index:

```bash
# Should import from @/components/ui, not individual files
grep -nE "from ['\"]@/components/ui/[^'\"]+['\"]" --include="*.tsx" [files]
```

**Correct pattern:**
```tsx
import { Button, Input, Card } from "@/components/ui";
```

**Incorrect pattern:**
```tsx
import { Button } from "@/components/ui/button";
```

### Step 8: Generate Report

```markdown
## Design Review Report

### Summary
- Files reviewed: X
- Design violations found: Y
- Severity: [PASS | NEEDS ATTENTION | BLOCKING]

### Critical Violations (Must Fix)

#### Raw HTML Elements
[List any raw button/input/select/table usage]

#### Hardcoded Colors
[List any hex values or rgb()]

#### Wrong Icon Library
[List any non-Phosphor imports]

### Token Tier Violations
[List primitive usage where higher tier exists]

### Style Violations
[List hardcoded spacing, radius, shadows]

### Long ClassNames (Potential Component Extraction)
[List any className > 150 chars]

### Recommendations
1. [Specific fixes for each violation]

### Checklist for Author
- [ ] Replace raw HTML with design system components
- [ ] Convert hardcoded colors to tokens
- [ ] Replace icon imports with Phosphor
- [ ] Use Tailwind spacing scale
- [ ] Verify dark mode
```

### Step 9: Offer Fixes

After presenting the report, offer to help:

- "Would you like me to replace the raw buttons with `<Button>` components?"
- "Should I convert these hardcoded colors to the appropriate tokens?"
- "Want me to swap the Lucide icons to Phosphor equivalents?"

## Severity Levels

| Level | Criteria | Action |
| ----- | -------- | ------ |
| PASS | No violations | Ready to merge |
| NEEDS ATTENTION | Minor token issues | Fix recommended |
| BLOCKING | Raw HTML, wrong icons, hardcoded colors | Must fix before merge |

## Quick Reference: Common Fixes

| Violation | Fix |
| --------- | --- |
| `<button className="...">` | `<Button variant="primary">` |
| `<input type="text">` | `<Input>` |
| `<input type="search">` | `<SearchInput>` |
| `bg-[#0A3D2C]` | `bg-[var(--button-primary-background)]` |
| `text-[#DC2626]` | `text-[var(--foreground-error)]` |
| `p-[24px]` | `p-6` |
| `rounded-[16px]` | `rounded-[var(--radius-card)]` |
| `import { X } from "lucide-react"` | `import { X } from "@phosphor-icons/react"` |
