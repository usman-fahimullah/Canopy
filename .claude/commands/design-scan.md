# Design Scan

Run a comprehensive design system compliance audit across the entire codebase.

## Usage

```
/design-scan                    # Full design system audit
/design-scan --tokens           # Token usage analysis only
/design-scan --components       # Component usage analysis only
/design-scan --quick            # Fast scan (critical issues only)
```

## Instructions

When this command is invoked, perform a systematic audit of design system compliance:

---

### Phase 1: Component Usage Audit

Analyze how design system components are (or aren't) being used:

```bash
# Count raw HTML elements that should be components
echo "=== Raw HTML Element Count ==="
echo "Raw <button>: $(grep -r '<button' --include='*.tsx' src/ | grep -v 'node_modules' | wc -l)"
echo "Raw <input>: $(grep -r '<input' --include='*.tsx' src/ | grep -v 'node_modules' | wc -l)"
echo "Raw <select>: $(grep -r '<select' --include='*.tsx' src/ | grep -v 'node_modules' | wc -l)"
echo "Raw <table>: $(grep -r '<table' --include='*.tsx' src/ | grep -v 'node_modules' | wc -l)"
echo "Raw <textarea>: $(grep -r '<textarea' --include='*.tsx' src/ | grep -v 'node_modules' | wc -l)"

# Count design system component usage
echo "=== Design System Component Usage ==="
echo "<Button>: $(grep -r '<Button' --include='*.tsx' src/ | wc -l)"
echo "<Input>: $(grep -r '<Input' --include='*.tsx' src/ | wc -l)"
echo "<Dropdown>/<Select>: $(grep -rE '<(Dropdown|Select)' --include='*.tsx' src/ | wc -l)"
echo "<DataTable>: $(grep -r '<DataTable' --include='*.tsx' src/ | wc -l)"
echo "<Card>: $(grep -r '<Card' --include='*.tsx' src/ | wc -l)"
echo "<Modal>/<Dialog>: $(grep -rE '<(Modal|Dialog)' --include='*.tsx' src/ | wc -l)"
echo "<Badge>: $(grep -r '<Badge' --include='*.tsx' src/ | wc -l)"
echo "<Tabs>: $(grep -r '<Tabs' --include='*.tsx' src/ | wc -l)"
echo "<Avatar>: $(grep -r '<Avatar' --include='*.tsx' src/ | wc -l)"
```

**Report Format:**

```markdown
## Component Usage Audit

### Design System Adoption Rate

| Element Type | Raw HTML | DS Component | Adoption % |
| ------------ | -------- | ------------ | ---------- |
| Buttons | X | Y | Z% |
| Inputs | X | Y | Z% |
| Selects | X | Y | Z% |
| Tables | X | Y | Z% |
| Cards | X | Y | Z% |

### Files with Most Raw HTML (Top 10)
| File | Raw Elements | Priority |
| ---- | ------------ | -------- |
[List files with highest raw element count]
```

---

### Phase 2: Token Compliance Audit

Analyze token usage vs hardcoded values:

```bash
# Hardcoded colors
echo "=== Hardcoded Color Count ==="
echo "Hex colors (#XXX): $(grep -rE '#[0-9A-Fa-f]{3,8}' --include='*.tsx' src/ | wc -l)"
echo "RGB/RGBA: $(grep -rE 'rgb\(|rgba\(' --include='*.tsx' src/ | wc -l)"

# Token usage by tier
echo "=== Token Usage by Tier ==="
echo "Component tokens (--button-*, --card-*, --input-*): $(grep -rE '\-\-(button|card|input|badge|switch|select)-' --include='*.tsx' src/ | wc -l)"
echo "Semantic tokens (--background-*, --foreground-*, --border-*): $(grep -rE '\-\-(background|foreground|border)-' --include='*.tsx' src/ | wc -l)"
echo "Primitive tokens (--primitive-*): $(grep -r '\-\-primitive-' --include='*.tsx' src/ | wc -l)"

# Hardcoded spacing
echo "=== Hardcoded Spacing ==="
echo "Bracket pixels [Xpx]: $(grep -rE '\[[\d]+px\]' --include='*.tsx' src/ | wc -l)"

# Hardcoded radius
echo "=== Hardcoded Radius ==="
echo "rounded-[Xpx]: $(grep -rE 'rounded-\[[\d]+px\]' --include='*.tsx' src/ | wc -l)"
```

**Report Format:**

```markdown
## Token Compliance Audit

### Token Tier Usage
| Tier | Count | Percentage | Status |
| ---- | ----- | ---------- | ------ |
| Tier 3 (Component) | X | Y% | [GOOD/NEEDS WORK] |
| Tier 2 (Semantic) | X | Y% | [GOOD/NEEDS WORK] |
| Tier 1 (Primitive) | X | Y% | [REVIEW NEEDED] |

### Hardcoded Values
| Type | Count | Status |
| ---- | ----- | ------ |
| Hex colors | X | [OK/CRITICAL] |
| RGB/RGBA | X | [OK/CRITICAL] |
| Pixel spacing | X | [OK/WARNING] |
| Pixel radius | X | [OK/WARNING] |

### Files with Most Hardcoded Values (Top 10)
| File | Hardcoded Count | Priority |
| ---- | --------------- | -------- |
[List files with highest hardcoded value count]
```

---

### Phase 3: Icon Library Audit

Check icon library compliance:

```bash
# Icon library usage
echo "=== Icon Library Usage ==="
echo "Phosphor (correct): $(grep -r '@phosphor-icons' --include='*.tsx' src/ | wc -l)"
echo "Lucide (wrong): $(grep -r 'lucide-react' --include='*.tsx' src/ | wc -l)"
echo "Heroicons (wrong): $(grep -r '@heroicons' --include='*.tsx' src/ | wc -l)"
echo "React Icons (wrong): $(grep -r 'react-icons' --include='*.tsx' src/ | wc -l)"

# List files with wrong icons
grep -rl 'lucide-react\|@heroicons\|react-icons' --include='*.tsx' src/
```

**Report Format:**

```markdown
## Icon Library Audit

### Library Usage
| Library | Imports | Status |
| ------- | ------- | ------ |
| @phosphor-icons/react | X | ✅ CORRECT |
| lucide-react | X | ❌ MUST REPLACE |
| @heroicons/* | X | ❌ MUST REPLACE |
| react-icons | X | ❌ MUST REPLACE |

### Files Requiring Icon Migration
| File | Wrong Library | Icons to Replace |
| ---- | ------------- | ---------------- |
[List files using wrong libraries]
```

---

### Phase 4: Typography Audit

Check typography scale compliance:

```bash
# Typography class usage
echo "=== Typography Scale Usage ==="
echo "text-display: $(grep -r 'text-display' --include='*.tsx' src/ | wc -l)"
echo "text-heading-lg: $(grep -r 'text-heading-lg' --include='*.tsx' src/ | wc -l)"
echo "text-heading-md: $(grep -r 'text-heading-md' --include='*.tsx' src/ | wc -l)"
echo "text-heading-sm: $(grep -r 'text-heading-sm' --include='*.tsx' src/ | wc -l)"
echo "text-body: $(grep -r 'text-body[^-]' --include='*.tsx' src/ | wc -l)"
echo "text-body-sm: $(grep -r 'text-body-sm' --include='*.tsx' src/ | wc -l)"
echo "text-caption: $(grep -r 'text-caption[^-]' --include='*.tsx' src/ | wc -l)"

# Off-scale text sizes
echo "=== Off-Scale Font Sizes ==="
echo "Custom text-[Xpx]: $(grep -rE 'text-\[[\d]+px\]' --include='*.tsx' src/ | wc -l)"
```

---

### Phase 5: Dark Mode Readiness

Check for patterns that break dark mode:

```bash
# Hardcoded light-mode colors
echo "=== Dark Mode Risk Patterns ==="
echo "Hardcoded white: $(grep -rE 'bg-white|text-white' --include='*.tsx' src/ | wc -l)"
echo "Hardcoded black: $(grep -rE 'bg-black|text-black' --include='*.tsx' src/ | wc -l)"
echo "Gray colors: $(grep -rE 'gray-\d+|neutral-\d+' --include='*.tsx' src/ | wc -l)"
```

---

### Phase 6: Design System Documentation Sync

Check if components and docs are in sync:

```bash
# List components in /components/ui/
ls -1 src/components/ui/*.tsx | wc -l

# List documented components
ls -1 src/app/design-system/components/*/page.tsx 2>/dev/null | wc -l
```

---

### Phase 7: Generate Summary Dashboard

```markdown
## Design System Audit Summary

### Overall Compliance Score: X/100

| Category | Score | Status |
| -------- | ----- | ------ |
| Component Adoption | X/25 | [PASS/WARN/FAIL] |
| Token Compliance | X/25 | [PASS/WARN/FAIL] |
| Icon Library | X/25 | [PASS/WARN/FAIL] |
| Typography | X/25 | [PASS/WARN/FAIL] |

### Critical Issues (Must Fix)
1. [List blocking issues - raw HTML, wrong icons, etc.]

### High Priority (Should Fix)
1. [List high priority - hardcoded colors, primitive tokens]

### Technical Debt Summary
- Raw HTML elements: X
- Hardcoded colors: Y
- Wrong icon imports: Z
- Primitive token overuse: W

### Recommended Next Steps
1. [Prioritized action items]

### Files Requiring Most Work (Top 10)
| File | Issues | Priority |
| ---- | ------ | -------- |
[List files with most violations]
```

## Scoring Guide

| Category | Full Score (25) | Partial | Zero |
| -------- | --------------- | ------- | ---- |
| Component Adoption | >90% DS components | 50-90% | <50% or raw HTML in new code |
| Token Compliance | No hardcoded colors | <20 hardcoded | >100 hardcoded |
| Icon Library | 100% Phosphor | <5 wrong imports | >20 wrong imports |
| Typography | 100% scale classes | <10 custom sizes | >50 custom sizes |

## Output Options

### `--tokens` Flag
Only runs Phase 2 (Token Compliance) for quick token audit.

### `--components` Flag
Only runs Phase 1 (Component Usage) for component adoption check.

### `--quick` Flag
Runs abbreviated scan:
- Count of critical violations only
- No file-by-file breakdown
- Pass/Fail verdict
