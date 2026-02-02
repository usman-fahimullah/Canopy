# Figma Implement

Guided implementation workflow from a Figma design to production-ready code.

## Usage

```
/figma-implement <figma-url>
/figma-implement <figma-url> --component    # New UI component
/figma-implement <figma-url> --page         # New page/route
/figma-implement <figma-url> --update       # Update existing component
```

## Instructions

When this command is invoked, follow this mandatory implementation workflow:

---

## Phase 1: Design Analysis

### Step 1.1: Fetch Design Context

Use Figma MCP tools to extract all design information:

```
1. mcp__figma-desktop__get_design_context
   - Component hierarchy
   - Layer structure
   - Auto-layout properties
   - Constraints

2. mcp__figma-desktop__get_screenshot
   - Visual reference (save for later comparison)
   - Note: Capture all states if multiple frames

3. mcp__figma-desktop__get_metadata
   - All style properties
   - Component properties (props)
   - Variants defined

4. mcp__figma-desktop__get_variable_defs
   - Design token mappings
   - Color variables
   - Spacing variables
```

### Step 1.2: Document Design Specs

Create a specification from the Figma data:

```markdown
## Design Specification

### Component: [Name from Figma]
**Figma URL**: [url]
**Captured**: [timestamp]

### Structure
```
Frame "[Name]"
├── Frame "Header"
│   ├── Text "Title"
│   └── Icon "Close"
├── Frame "Content"
│   └── Text "Body"
└── Frame "Footer"
    ├── Button "Cancel"
    └── Button "Confirm"
```

### Variants
| Property | Values |
| -------- | ------ |
| Size | sm, md, lg |
| Variant | primary, secondary |

### States
- Default
- Hover
- Focus
- Active
- Disabled

### Tokens Used
| Property | Figma Variable | CSS Token |
| -------- | -------------- | --------- |
| Background | colors/neutral/50 | --background-subtle |
| Border | colors/neutral/200 | --border-default |
| Title color | colors/neutral/900 | --foreground-default |
| Padding | spacing/6 | p-6 (24px) |
| Border radius | radius/lg | --radius-lg |
```

---

## Phase 2: Component Mapping

### Step 2.1: Map to Existing Components

Check `/src/components/ui/index.ts` for existing components that match Figma layers:

```markdown
### Component Mapping

| Figma Element | Design System Component | Notes |
| ------------- | ----------------------- | ----- |
| Frame "Card" | `<Card>` | Use CardHeader, CardContent, CardFooter |
| Button "Primary" | `<Button variant="primary">` | Matches exactly |
| Button "Secondary" | `<Button variant="secondary">` | Matches exactly |
| Text "Title" | Native `<h3>` with typography class | Use text-heading-sm |
| Icon "Close" | `<X>` from Phosphor | Use size={20} |
| Input field | `<Input>` | Already in design system |
| Dropdown | `<Dropdown>` | Already in design system |
```

### Step 2.2: Identify Gaps

If no matching component exists:

```markdown
### New Components Needed

| Figma Element | Recommended Name | Reason |
| ------------- | ---------------- | ------ |
| "Status Badge" | `<StatusBadge>` | No existing badge with this styling |
| "Progress Ring" | `<ProgressRing>` | Circular progress not in DS |

**Action**: Create these as new design system components following component-documentation.md rule.
```

---

## Phase 3: Token Reconciliation

### Step 3.1: Map All Visual Properties

Use the figma-implementation.md token reference to map every visual property:

```markdown
### Token Mapping Checklist

#### Colors
| Figma Value | Figma Variable | CSS Token | Tier |
| ----------- | -------------- | --------- | ---- |
| #FAF9F7 | colors/neutral/50 | --background-subtle | Semantic |
| #0A3D2C | colors/green/800 | --button-primary-background | Component |
| #DC2626 | colors/red/600 | --foreground-error | Semantic |

#### Typography
| Figma Style | CSS Class |
| ----------- | --------- |
| Heading/SM | text-heading-sm |
| Body/Default | text-body |
| Caption/Default | text-caption |

#### Spacing (based on 4px grid)
| Figma Value | Tailwind Class |
| ----------- | -------------- |
| 4px | p-1, gap-1, m-1 |
| 8px | p-2, gap-2, m-2 |
| 12px | p-3, gap-3, m-3 |
| 16px | p-4, gap-4, m-4 |
| 24px | p-6, gap-6, m-6 |
| 32px | p-8, gap-8, m-8 |

#### Border Radius
| Figma Value | CSS Token |
| ----------- | --------- |
| 4px | --radius-sm |
| 6px | --radius-md |
| 8px | --radius-lg |
| 12px | --radius-card |
| 16px | --radius-2xl |

#### Shadows
| Figma Effect | CSS Token |
| ------------ | --------- |
| Elevation 1 | --shadow-sm |
| Elevation 2 | --shadow-card |
| Elevation 3 | --shadow-lg |
| Focus ring | --shadow-focus |
```

### Step 3.2: Flag Unmapped Properties

If any Figma property doesn't have a token:

```markdown
### Unmapped Properties (Require Decision)

| Property | Figma Value | Options |
| -------- | ----------- | ------- |
| Gradient | linear-gradient(...) | 1. Add as new token, 2. One-off with comment |
| Custom shadow | 0 4px 12px ... | 1. Map to closest token, 2. Add new token |

**Recommendation**: [Provide recommendation based on reusability]
```

---

## Phase 4: Implementation

### Step 4.1: Generate Component Structure

Based on analysis, generate the component code:

```tsx
// Example generated structure
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui";
import { Button } from "@/components/ui";
import { X } from "@phosphor-icons/react";

interface ComponentNameProps {
  title: string;
  onClose: () => void;
  onConfirm: () => void;
  // ... props from Figma component properties
}

export function ComponentName({ title, onClose, onConfirm }: ComponentNameProps) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <h3 className="text-heading-sm text-[var(--foreground-default)]">
          {title}
        </h3>
        <button
          onClick={onClose}
          className="text-[var(--foreground-muted)] hover:text-[var(--foreground-default)]"
        >
          <X size={20} />
        </button>
      </CardHeader>
      <CardContent>
        {/* Content from Figma */}
      </CardContent>
      <CardFooter className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Confirm
        </Button>
      </CardFooter>
    </Card>
  );
}
```

### Step 4.2: Implement All States

For each state in Figma, ensure code handles it:

```tsx
// Hover state - typically via Tailwind
className="hover:bg-[var(--background-hover)]"

// Focus state - MUST have visible indicator
className="focus:ring-2 focus:ring-[var(--border-focus)] focus:outline-none"

// Active state
className="active:bg-[var(--background-active)]"

// Disabled state
className="disabled:opacity-50 disabled:cursor-not-allowed"

// Loading state
{isLoading && <Spinner size="sm" />}
```

### Step 4.3: Implement All Variants

If Figma has variants, implement via props:

```tsx
interface ButtonProps {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "destructive";
}

const sizeClasses = {
  sm: "px-3 py-1.5 text-caption",
  md: "px-4 py-2 text-body-sm",
  lg: "px-6 py-3 text-body",
};

const variantClasses = {
  primary: "bg-[var(--button-primary-background)] text-[var(--button-primary-foreground)]",
  secondary: "bg-[var(--button-secondary-background)] text-[var(--button-secondary-foreground)]",
  destructive: "bg-[var(--button-destructive-background)] text-white",
};
```

---

## Phase 5: Verification

### Step 5.1: Self-Review Checklist

Before marking complete, verify:

```markdown
### Implementation Checklist

#### Structure
- [ ] All Figma layers mapped to code elements
- [ ] Hierarchy matches exactly
- [ ] Auto-layout converted to Flexbox/Grid

#### Components
- [ ] Design system components used where they exist
- [ ] No raw HTML that should be components
- [ ] Imports from @/components/ui index

#### Tokens
- [ ] All colors use CSS tokens (no hex values)
- [ ] Spacing uses Tailwind scale
- [ ] Typography uses scale classes
- [ ] Border radius uses tokens
- [ ] Shadows use tokens

#### States
- [ ] Default state matches Figma
- [ ] Hover state implemented
- [ ] Focus state visible (accessibility!)
- [ ] Active state implemented
- [ ] Disabled state implemented
- [ ] Loading state (if applicable)

#### Variants
- [ ] All Figma variants implemented as props
- [ ] Default values match Figma defaults

#### Icons
- [ ] All icons are Phosphor
- [ ] Sizes match Figma
- [ ] Colors use tokens

#### Responsiveness
- [ ] Mobile breakpoint handled
- [ ] Tablet breakpoint handled
- [ ] Desktop matches Figma exactly
```

### Step 5.2: Visual Comparison

Render the component and compare with Figma:

```markdown
### Visual Comparison

1. Build/render the component
2. Take screenshot
3. Compare side-by-side with Figma screenshot

#### Pixel-Level Checks
- [ ] Spacing matches (within 1-2px)
- [ ] Colors match exactly
- [ ] Typography renders correctly
- [ ] Icons aligned properly
- [ ] Border radius consistent
- [ ] Shadows render correctly
```

### Step 5.3: Run Automated Verification

```
/figma-verify [figma-url] [component-path]
```

---

## Phase 6: Documentation

### Step 6.1: Add Figma Link Comment

Always link back to source design:

```tsx
/**
 * ComponentName
 *
 * @figma https://figma.com/design/xxx?node-id=yyy
 * @designer [Designer Name]
 * @implemented [Date]
 */
export function ComponentName() { ... }
```

### Step 6.2: Update Design System Docs

If this is a new component, follow design-system-sync.md:

1. Add to component exports
2. Add to navigation
3. Create documentation page

---

## Output Format

When implementation is complete, provide:

```markdown
## Implementation Complete

### Component Created
- **Path**: src/components/ui/component-name.tsx
- **Figma Source**: [url]

### Verification
- Structure match: ✅
- Token compliance: ✅
- State coverage: ✅
- Variant coverage: ✅

### Design System Updates
- [ ] Exported from index.ts
- [ ] Added to navigation
- [ ] Documentation page created

### Next Steps
1. Run `pnpm build` to verify
2. Test in browser with dark mode
3. Get design review from [Designer]
```
