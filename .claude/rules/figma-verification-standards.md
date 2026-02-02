# Figma Verification Standards

---

## trigger: figma, design, implement, from figma, figma link, figma url, implement design

When implementing from a Figma design, this rule ensures pixel-perfect accuracy and complete design system compliance. Every Figma implementation MUST go through verification.

Related rules: `design-first-implementation.md` for workflow, `figma-implementation.md` for tokens, `design-audit-standards.md` for general design compliance.

Related commands: `/figma-implement` for guided implementation, `/figma-verify` for verification.

---

## Philosophy

A design is not "implemented" until it's verified. Visual approximations are not acceptable—we aim for pixel-perfect implementations that maintain design intent while using our design system infrastructure.

The goal is:
1. **Accuracy** — Implementation matches Figma exactly
2. **Maintainability** — Uses design system, not one-offs
3. **Scalability** — All variants and states work
4. **Accessibility** — Focus states, keyboard nav, screen readers

---

## Mandatory Verification Process

### When a Figma Link is Provided

Every time a Figma URL is shared for implementation, MUST follow this process:

```
1. EXTRACT   → Use Figma MCP tools to get design data
2. MAP       → Map Figma elements to design system components
3. RECONCILE → Map Figma values to CSS tokens
4. IMPLEMENT → Build with components and tokens
5. VERIFY    → Compare output to Figma source
6. DOCUMENT  → Add Figma link to code comments
```

**Never skip verification.** A component is not done until `/figma-verify` passes.

---

## Figma MCP Tool Usage

### Required Tools

| Tool | Purpose | When to Use |
| ---- | ------- | ----------- |
| `mcp__figma-desktop__get_design_context` | Extract layer structure, hierarchy, auto-layout | Always first |
| `mcp__figma-desktop__get_screenshot` | Capture visual reference | For comparison |
| `mcp__figma-desktop__get_metadata` | Get styles, colors, typography | For token mapping |
| `mcp__figma-desktop__get_variable_defs` | Get design token definitions | For token reconciliation |

### Extraction Checklist

Before writing any code, extract:

- [ ] Component hierarchy (all layers)
- [ ] All color values used
- [ ] All typography styles
- [ ] All spacing values
- [ ] All border radius values
- [ ] All shadow/elevation values
- [ ] All variants defined
- [ ] All states (hover, focus, active, disabled)
- [ ] Auto-layout properties (direction, gap, padding)
- [ ] Constraints and sizing behavior

---

## Token Mapping Requirements

### Mandatory Token Usage

Every visual property from Figma MUST map to a token:

| Property | Must Use | Never Use |
| -------- | -------- | --------- |
| Background colors | `var(--*)` token | Hex `#XXXXXX` |
| Text colors | `var(--foreground-*)` | Hex or rgb() |
| Borders | `var(--border-*)` | Hex or rgb() |
| Spacing | Tailwind scale (p-4, gap-6) | `[Xpx]` |
| Typography | Scale classes (text-body) | `text-[Xpx]` |
| Border radius | `var(--radius-*)` | `rounded-[Xpx]` |
| Shadows | `var(--shadow-*)` | Custom shadow-[...] |

### Token Tier Priority

When mapping, prefer higher tiers:

```
1. Component tokens (--button-*, --card-*, --input-*)
   ↳ Use when styling specific component types

2. Semantic tokens (--background-*, --foreground-*, --border-*)
   ↳ Use for general UI elements

3. Primitive tokens (--primitive-*)
   ↳ ONLY with documented justification
```

---

## Component Mapping Requirements

### Always Check Existing Components First

Before implementing anything, check `/src/components/ui/index.ts`:

```typescript
// Common Figma-to-Component mappings
Figma Frame "Card" → <Card>, <CardHeader>, <CardContent>, <CardFooter>
Figma Button → <Button variant="...">
Figma Input → <Input>, <SearchInput>, <Textarea>
Figma Select → <Dropdown>, <Select>
Figma Checkbox → <Checkbox>, <CheckboxWithLabel>
Figma Toggle → <Switch>, <SwitchWithLabel>
Figma Table → <DataTable>, <EnhancedDataTable>
Figma Modal → <Modal>, <Dialog>
Figma Tooltip → <SimpleTooltip>, <Tooltip>
Figma Tabs → <Tabs>, <SegmentedController>
Figma Avatar → <Avatar>, <AvatarGroup>
Figma Badge → <Badge>, <StageBadge>, <CategoryTag>
Figma Empty State → <EmptyState>
Figma Loading → <Spinner>, <Skeleton>
```

### If No Component Exists

When Figma element has no matching component:

1. **Check if reusable** — Will this pattern appear elsewhere?
2. **If yes** → Create new design system component
3. **If no** → Implement inline with tokens, add TODO comment

```tsx
{/* One-off: Promotional banner from Figma - not reusable
    Figma: https://figma.com/design/xxx?node-id=yyy
    TODO: Extract to <PromoBanner> if pattern recurs */}
<div className="bg-gradient-to-r from-[var(--primitive-green-700)] to-[var(--primitive-blue-600)]">
  ...
</div>
```

---

## State Implementation Requirements

### All States Must Match Figma

If Figma shows a state, it MUST be implemented:

| State | Figma Indicator | Code Implementation |
| ----- | --------------- | ------------------- |
| Default | Base frame | Default styling |
| Hover | Frame named "Hover" or variant | `:hover` pseudo-class or `hover:` |
| Focus | Frame named "Focus" or variant | `:focus` + visible ring |
| Active | Frame named "Active" or "Pressed" | `:active` pseudo-class |
| Disabled | Frame named "Disabled" or variant | `:disabled` + visual dimming |
| Loading | Frame with spinner or skeleton | Conditional render |
| Error | Frame with error styling | Error state styling |
| Selected | Frame with selection indicator | Aria + visual indicator |

### Focus State is Mandatory

**Every interactive element MUST have a visible focus state for accessibility.**

```tsx
// ❌ WRONG - no focus state
<button className="bg-[var(--button-primary-background)]">

// ✅ CORRECT - visible focus
<button className="bg-[var(--button-primary-background)] focus:ring-2 focus:ring-[var(--border-focus)] focus:outline-none">
```

---

## Variant Implementation Requirements

### Map Figma Variants to Props

Figma component properties become React props:

```
Figma: Size = "Small" | "Medium" | "Large"
Code:  size?: "sm" | "md" | "lg"

Figma: Type = "Primary" | "Secondary" | "Destructive"
Code:  variant?: "primary" | "secondary" | "destructive"

Figma: State = "Default" | "Loading"
Code:  isLoading?: boolean
```

### Default Values Must Match

If Figma has a default variant, the component prop default must match:

```tsx
// Figma default: Size = "Medium"
interface ButtonProps {
  size?: "sm" | "md" | "lg"; // md is default
}

export function Button({ size = "md" }: ButtonProps) { ... }
```

---

## Visual Verification Requirements

### Comparison Checklist

Before marking implementation complete:

| Check | How to Verify | Pass Criteria |
| ----- | ------------- | ------------- |
| Layout | Overlay comparison | Within 2px |
| Colors | Color picker tool | Exact match via token |
| Typography | Visual inspection | Same font, size, weight |
| Spacing | Measure tool | Exact match via Tailwind |
| Radius | Visual inspection | Matches token value |
| Shadows | Visual inspection | Matches token value |
| Icons | Visual inspection | Correct Phosphor icon, size |
| States | Interactive test | All states work |

### Dark Mode Verification

Every Figma implementation must work in dark mode:

- [ ] Render component in dark mode
- [ ] All colors switch appropriately
- [ ] Text remains readable
- [ ] Contrast ratios maintained
- [ ] No hardcoded light-mode values

---

## Documentation Requirements

### Figma Link in Code

Every component implemented from Figma MUST have source link:

```tsx
/**
 * JobCard - Displays a job listing in card format
 *
 * @figma https://figma.com/design/ABC123/Canopy?node-id=456:789
 * @designer Sarah Chen
 * @implemented 2026-02-01
 */
export function JobCard({ ... }: JobCardProps) {
```

### Implementation Notes

Document any deviations or decisions:

```tsx
/**
 * Note: Figma shows 15px spacing but we use p-4 (16px) to stay on
 * the Tailwind scale. Approved by design on 2026-02-01.
 */
```

---

## Verification Workflow

### Pre-Implementation

1. Receive Figma link
2. Run Figma MCP tools to extract design data
3. Document design specification
4. Map to existing components
5. Reconcile tokens
6. Flag any gaps or decisions needed

### During Implementation

1. Build with components and tokens
2. Implement all states
3. Implement all variants
4. Check token compliance continuously

### Post-Implementation

1. Run `/figma-verify [url] [path]`
2. Address any discrepancies
3. Visual comparison (screenshot overlay)
4. Dark mode check
5. Add Figma link to code
6. Run `/design-review` before commit

---

## Acceptance Criteria

A Figma implementation is ONLY complete when:

- [ ] `/figma-verify` passes with >95% match
- [ ] All design system components used where applicable
- [ ] All colors use CSS tokens (zero hex values)
- [ ] All spacing uses Tailwind scale
- [ ] All typography uses scale classes
- [ ] All states implemented and working
- [ ] All variants implemented and working
- [ ] Focus states visible (accessibility)
- [ ] Dark mode works correctly
- [ ] Figma link in code comments
- [ ] Design system docs updated (if new component)

---

## Common Mistakes to Avoid

| Mistake | Why It's Wrong | Correct Approach |
| ------- | -------------- | ---------------- |
| Eyeballing colors | Leads to off-brand colors | Use color picker → map to token |
| Approximate spacing | Inconsistent layouts | Measure in Figma → use Tailwind |
| Skipping states | Incomplete interaction | Implement all Figma states |
| Ignoring variants | Props don't match design | Implement all Figma variants |
| No focus state | Accessibility failure | Add visible focus ring |
| Hardcoded values | Breaks dark mode | Always use tokens |
| No verification | Hidden discrepancies | Always run /figma-verify |
