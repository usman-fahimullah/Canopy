# Figma Verify

Verify that a component or page implementation matches its Figma design source.

## Usage

```
/figma-verify <figma-url> <component-path>
/figma-verify https://figma.com/design/xxx src/components/ui/Button.tsx
/figma-verify https://figma.com/design/xxx src/app/jobs/page.tsx
```

## Instructions

When this command is invoked with a Figma URL and component path, perform a systematic design verification:

---

### Step 1: Extract Design Information from Figma

Use the Figma MCP tools to analyze the design:

```
1. Call mcp__figma-desktop__get_design_context with the Figma URL
   - Extract component structure
   - Identify layers and hierarchy
   - Note any auto-layout properties

2. Call mcp__figma-desktop__get_screenshot to capture the design
   - Get visual reference for comparison

3. Call mcp__figma-desktop__get_metadata for design properties
   - Colors, typography, spacing
   - Component variants
   - States (hover, focus, disabled)

4. Call mcp__figma-desktop__get_variable_defs for design tokens
   - Map Figma variables to CSS custom properties
   - Identify which tokens are used
```

---

### Step 2: Read the Implementation

Read the component/page file and extract:

```typescript
// Extract from the implementation:
- Component structure (JSX hierarchy)
- CSS classes used
- Token references (var(--*))
- Component imports from @/components/ui
- Props interface
- State management
- Interactive behaviors
```

---

### Step 3: Compare Structure

Create a side-by-side comparison:

```markdown
## Structure Comparison

### Figma Layers → Code Components

| Figma Layer | Expected Component | Actual Code | Match |
| ----------- | ------------------ | ----------- | ----- |
| Frame "Card" | `<Card>` | `<Card>` | ✅ |
| Text "Title" | `<h3>` with text-heading-sm | `<h3 className="text-heading-sm">` | ✅ |
| Icon "Arrow" | `<CaretRight>` | `<ChevronRight>` | ❌ Wrong icon |
| Button "CTA" | `<Button variant="primary">` | `<button className="...">` | ❌ Raw HTML |
```

---

### Step 4: Compare Visual Properties

#### Colors

```markdown
### Color Comparison

| Element | Figma Color | Expected Token | Actual Token | Match |
| ------- | ----------- | -------------- | ------------ | ----- |
| Background | #FAF9F7 | --background-subtle | --background-subtle | ✅ |
| Title text | #1F1D1C | --foreground-default | --foreground-default | ✅ |
| CTA button | #0A3D2C | --button-primary-background | #0A3D2C (hardcoded) | ❌ |
```

#### Typography

```markdown
### Typography Comparison

| Element | Figma Font | Figma Size | Expected Class | Actual Class | Match |
| ------- | ---------- | ---------- | -------------- | ------------ | ----- |
| Title | Inter | 24px | text-heading-sm | text-heading-sm | ✅ |
| Body | Inter | 18px | text-body | text-[18px] | ❌ Use scale |
| Caption | Inter | 14px | text-caption | text-sm | ❌ Use scale |
```

#### Spacing

```markdown
### Spacing Comparison

| Element | Figma Value | Expected Tailwind | Actual Value | Match |
| ------- | ----------- | ----------------- | ------------ | ----- |
| Card padding | 24px | p-6 | p-6 | ✅ |
| Stack gap | 16px | gap-4 | gap-[16px] | ❌ Use scale |
| Margin top | 32px | mt-8 | mt-8 | ✅ |
```

#### Border Radius

```markdown
### Border Radius Comparison

| Element | Figma Value | Expected Token | Actual Value | Match |
| ------- | ----------- | -------------- | ------------ | ----- |
| Card | 12px | --radius-card | rounded-[var(--radius-card)] | ✅ |
| Button | 8px | --radius-lg | rounded-lg | ✅ |
| Input | 6px | --radius-md | rounded-[6px] | ❌ Use token |
```

---

### Step 5: Compare States

Check all interactive states are implemented:

```markdown
### State Coverage

| State | In Figma | In Code | Match |
| ----- | -------- | ------- | ----- |
| Default | ✅ | ✅ | ✅ |
| Hover | ✅ | ✅ | ✅ |
| Focus | ✅ | ❌ Missing | ❌ |
| Active | ✅ | ❌ Missing | ❌ |
| Disabled | ✅ | ✅ | ✅ |
| Loading | ✅ | ❌ Missing | ❌ |
```

---

### Step 6: Compare Variants

If the Figma component has variants:

```markdown
### Variant Coverage

| Variant | In Figma | In Code | Match |
| ------- | -------- | ------- | ----- |
| Size: Small | ✅ | ✅ | ✅ |
| Size: Medium | ✅ | ✅ | ✅ |
| Size: Large | ✅ | ❌ Missing | ❌ |
| Type: Primary | ✅ | ✅ | ✅ |
| Type: Secondary | ✅ | ✅ | ✅ |
| Type: Destructive | ✅ | ❌ Missing | ❌ |
```

---

### Step 7: Visual Comparison

Request a screenshot of the implementation and compare:

```markdown
### Visual Comparison

1. **Figma Screenshot**: [captured via mcp__figma-desktop__get_screenshot]
2. **Implementation Screenshot**: [capture from browser or build preview]

#### Visual Differences Noted:
- [ ] Spacing looks tighter in implementation
- [ ] Button color slightly different
- [ ] Border radius appears larger
- [ ] Shadow missing on hover state
```

---

### Step 8: Generate Verification Report

```markdown
## Figma Verification Report

### Summary
- **Figma URL**: [url]
- **Component**: [path]
- **Overall Match**: X% (Y of Z checks passed)
- **Status**: [VERIFIED | NEEDS FIXES | MAJOR DISCREPANCIES]

### Critical Issues (Must Fix)
1. [List blocking discrepancies]

### Minor Issues (Should Fix)
1. [List non-blocking issues]

### Token Mapping Used
| Figma Variable | CSS Token |
| -------------- | --------- |
| colors/green/800 | --button-primary-background |
| spacing/6 | p-6 (24px) |
| radius/card | --radius-card |

### Checklist for Developer
- [ ] Fix critical issues
- [ ] Address minor issues
- [ ] Verify all states work
- [ ] Test dark mode
- [ ] Run /design-review before commit

### Recommended Fixes
[Specific code changes to match Figma exactly]
```

---

### Step 9: Offer Automated Fixes

After presenting the report:

- "Would you like me to fix the token violations?"
- "Should I add the missing focus state?"
- "Want me to replace the raw HTML with design system components?"

---

## Verification Criteria

### Pass Criteria
- All structure matches (components used correctly)
- All colors use correct tokens
- All spacing uses Tailwind scale
- All typography uses scale classes
- All states implemented
- All variants implemented

### Fail Criteria (Blocking)
- Wrong components used
- Hardcoded colors
- Missing interactive states
- Visual layout significantly different

### Warning Criteria
- Minor spacing differences (1-2px)
- Slightly different animation timing
- Missing optional variants

---

## Example Session

```
User: /figma-verify https://figma.com/design/abc123/Canopy?node-id=1234 src/components/ui/card.tsx

Claude: Fetching design context from Figma...
✓ Design context retrieved
✓ Screenshot captured
✓ Variables extracted

Reading implementation at src/components/ui/card.tsx...
✓ Component analyzed

## Figma Verification Report

### Summary
- **Overall Match**: 85% (17 of 20 checks passed)
- **Status**: NEEDS FIXES

### Critical Issues (2)
1. **Line 45**: Using `bg-[#FAF9F7]` instead of `bg-[var(--card-background)]`
2. **Line 67**: Missing focus ring on CardAction button

### Minor Issues (1)
1. **Line 23**: gap-[16px] should be gap-4

Would you like me to fix these issues?
```
