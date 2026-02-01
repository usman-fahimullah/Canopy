# Component Documentation Rule

---

## trigger: component, ui, create component, update component, new component, modify component, documentation

> Based on industry best practices for design system documentation.

When creating or modifying UI components in `/src/components/ui/`, always ensure proper documentation exists.

---

## Pre-Implementation Checklist

### 1. Determine if New or Existing Component

Before writing any code, **always check if the component already exists**:

```bash
# Search for existing component
grep -r "ComponentName" src/components/ui/
ls src/app/design-system/components/
```

**If component exists:**

- Read the existing implementation thoroughly
- Understand current props, variants, and behavior
- Identify what needs to change vs. what should stay the same
- **ASK THE USER** before making changes: "I found an existing [ComponentName] component. Should I update it or create a new variant?"

**If component is new:**

- Confirm with user: "This will be a new component. Should I proceed with creating [ComponentName]?"
- Check for similar existing components that might be extended instead

### 2. Verify User Intent

**ALWAYS ask the user before committing to changes:**

- "I'm about to [create/modify] the [ComponentName] component. This will [describe changes]. Should I proceed?"
- For significant changes: "This change will affect [X] existing usages. Are you sure?"

---

## Required Steps

### 1. Read the Component Source First

Before creating or updating documentation, **always read the actual component file** to understand:

- Exact prop names and types from the interface/type definition
- Default values from destructuring or defaultProps
- Available variants/sizes from CVA or similar
- Any re-exported sub-components

### 2. Use Design Tokens (Never Hardcode Colors)

All colors must use CSS variables from the token system:

```tsx
// ✅ CORRECT
className = "bg-[var(--button-primary-background)] text-[var(--primitive-green-800)]";

// ❌ WRONG - Never hardcode hex values
className = "bg-[#0A3D2C] text-[#072924]";
```

For dark mode with opacity, use Tailwind's opacity syntax:

```tsx
// ✅ CORRECT
className = "dark:bg-[var(--primitive-green-500)]/15";

// ❌ WRONG - Don't use rgba with hardcoded values
className = "dark:bg-[rgba(94,204,112,0.15)]";
```

### 3. Verify Exports

Check `/src/components/ui/index.ts` to ensure:

- The component is exported
- All sub-components are exported (e.g., `DialogTrigger`, `DialogContent`)
- Any helper types or constants are exported if needed in docs

### 4. Update Navigation Config

Add the component to `/src/lib/design-system-nav.ts`:

- Add to appropriate category in `navigationConfig`
- Add to `searchIndex` for searchability

---

## Documentation Page Structure

Create a page at `/src/app/design-system/components/[component-name]/page.tsx`.

Every component documentation page **MUST** include these sections in this order:

### Required Sections

| #   | Section                 | Required           | Description                                             |
| --- | ----------------------- | ------------------ | ------------------------------------------------------- |
| 1   | **Overview**            | ✅                 | Purpose, when to use, when NOT to use                   |
| 2   | **Anatomy**             | ✅                 | Visual breakdown of component parts                     |
| 3   | **Basic Usage**         | ✅                 | Simplest working example with code                      |
| 4   | **Variants**            | ✅                 | All visual variants with labels                         |
| 5   | **Sizes**               | ✅ (if applicable) | All size options side-by-side                           |
| 6   | **States**              | ✅                 | Default, hover, focus, active, disabled, loading, error |
| 7   | **Controlled Usage**    | ✅ (for inputs)    | Example with React state                                |
| 8   | **Props Table**         | ✅                 | Complete API documentation                              |
| 9   | **Do's and Don'ts**     | ✅                 | Visual examples of correct/incorrect usage              |
| 10  | **Accessibility**       | ✅                 | Keyboard, ARIA, screen reader info                      |
| 11  | **Related Components**  | Recommended        | Links to similar components                             |
| 12  | **Real-World Examples** | Recommended        | 2-3 practical use cases                                 |

---

## Comprehensive Documentation Template

```tsx
"use client";

import React from "react";
import { ComponentName, Button, Label } from "@/components/ui";
import {
  ComponentCard,
  UsageGuide,
  AccessibilityInfo,
} from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";

// ============================================
// PROPS DOCUMENTATION
// Must match component interface EXACTLY
// ============================================
const componentProps = [
  {
    name: "variant",
    type: '"primary" | "secondary" | "tertiary"',
    default: '"primary"',
    description: "Visual style variant",
  },
  {
    name: "size",
    type: '"sm" | "default" | "lg"',
    default: '"default"',
    description: "Size of the component",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disables interaction and applies disabled styling",
  },
  // Include ALL props from the interface
];

export default function ComponentNamePage() {
  // State for interactive examples
  const [value, setValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <div className="space-y-12">
      {/* ============================================
          SECTION 1: OVERVIEW
          Purpose, when to use, when NOT to use
          ============================================ */}
      <div>
        <h1 id="overview" className="mb-2 text-heading-lg font-bold text-foreground">
          Component Name
        </h1>
        <p className="mb-4 text-body text-foreground-muted">
          Clear, concise description of what this component does and its primary purpose.
        </p>

        {/* When to Use / When Not to Use */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="bg-background-success/10 rounded-lg border border-border-success p-4">
            <h3 className="mb-2 font-semibold text-foreground-success">When to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>• Use case 1</li>
              <li>• Use case 2</li>
              <li>• Use case 3</li>
            </ul>
          </div>
          <div className="bg-background-error/10 rounded-lg border border-border-error p-4">
            <h3 className="mb-2 font-semibold text-foreground-error">When not to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>• Anti-pattern 1</li>
              <li>• Anti-pattern 2</li>
              <li>• Use [Alternative] instead for X</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ============================================
          SECTION 2: ANATOMY
          Visual breakdown of component parts
          ============================================ */}
      <ComponentCard
        id="anatomy"
        title="Anatomy"
        description="The component is made up of these parts"
      >
        <div className="relative rounded-lg bg-background-subtle p-8">
          {/* Component with callouts pointing to each part */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <ComponentName />
              {/* Add numbered callouts */}
              <div className="absolute -left-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground-brand text-xs text-white">
                1
              </div>
            </div>
          </div>
          {/* Legend */}
          <div className="mt-6 grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="rounded bg-background-muted px-1 font-mono">1</span> Container
            </div>
            <div>
              <span className="rounded bg-background-muted px-1 font-mono">2</span> Icon (optional)
            </div>
            <div>
              <span className="rounded bg-background-muted px-1 font-mono">3</span> Label
            </div>
            <div>
              <span className="rounded bg-background-muted px-1 font-mono">4</span> Helper text
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================
          SECTION 3: BASIC USAGE
          Simplest working example
          ============================================ */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="The simplest way to use this component"
      >
        <CodePreview
          code={`import { ComponentName } from "@/components/ui";

<ComponentName>
  Basic example
</ComponentName>`}
        >
          <ComponentName>Basic example</ComponentName>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SECTION 4: VARIANTS
          All visual variants with labels
          ============================================ */}
      <ComponentCard id="variants" title="Variants" description="All available visual styles">
        <div className="space-y-6">
          {/* Show each variant with label and description */}
          {[
            { variant: "primary", description: "Use for primary actions" },
            { variant: "secondary", description: "Use for secondary actions" },
            { variant: "tertiary", description: "Use for tertiary/subtle actions" },
            { variant: "destructive", description: "Use for destructive actions" },
          ].map(({ variant, description }) => (
            <div key={variant} className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="font-semibold capitalize">{variant}</Label>
                <span className="text-caption text-foreground-muted">— {description}</span>
              </div>
              <ComponentName variant={variant}>{variant}</ComponentName>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* ============================================
          SECTION 5: SIZES
          All size options
          ============================================ */}
      <ComponentCard id="sizes" title="Sizes" description="Available size options">
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-2">
            <Label>Small</Label>
            <ComponentName size="sm">Small</ComponentName>
          </div>
          <div className="space-y-2">
            <Label>Default</Label>
            <ComponentName size="default">Default</ComponentName>
          </div>
          <div className="space-y-2">
            <Label>Large</Label>
            <ComponentName size="lg">Large</ComponentName>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================
          SECTION 6: STATES
          All interactive states
          ============================================ */}
      <ComponentCard id="states" title="States" description="Interactive and visual states">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Default</Label>
            <ComponentName />
          </div>
          <div className="space-y-2">
            <Label>Hover</Label>
            <ComponentName className="[&]:bg-[var(--button-primary-background-hover)]" />
          </div>
          <div className="space-y-2">
            <Label>Focus</Label>
            <ComponentName className="ring-2 ring-[var(--primitive-green-500)] ring-offset-2" />
          </div>
          <div className="space-y-2">
            <Label>Active</Label>
            <ComponentName className="scale-[0.98]" />
          </div>
          <div className="space-y-2">
            <Label>Disabled</Label>
            <ComponentName disabled />
          </div>
          <div className="space-y-2">
            <Label>Loading</Label>
            <ComponentName loading />
          </div>
        </div>

        {/* Error state for form components */}
        <div className="mt-6 border-t border-border-muted pt-6">
          <Label className="mb-2">Error State</Label>
          <ComponentName error errorMessage="This field is required" />
        </div>
      </ComponentCard>

      {/* ============================================
          SECTION 7: CONTROLLED USAGE
          Example with React state (for inputs)
          ============================================ */}
      <ComponentCard
        id="controlled"
        title="Controlled Usage"
        description="Using the component with React state"
      >
        <CodePreview
          code={`const [value, setValue] = React.useState("");

<ComponentName
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Type something..."
/>

{/* Current value: {value} */}`}
        >
          <div className="space-y-4">
            <ComponentName
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Type something..."
            />
            <p className="text-caption text-foreground-muted">
              Current value:{" "}
              <code className="rounded bg-background-muted px-1">{value || "(empty)"}</code>
            </p>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SECTION 8: PROPS TABLE
          Complete API documentation
          ============================================ */}
      <ComponentCard id="props" title="Props">
        <PropsTable props={componentProps} />
      </ComponentCard>

      {/* ============================================
          SECTION 9: DO'S AND DON'TS
          Visual examples of correct/incorrect usage
          ============================================ */}
      <UsageGuide
        dos={[
          "Use primary variant for the main action on a page",
          "Keep button labels concise and action-oriented",
          "Provide visual feedback for loading states",
          "Use appropriate size for the context",
        ]}
        donts={[
          "Don't use multiple primary buttons in the same section",
          "Don't disable buttons without explaining why",
          "Don't use generic labels like 'Click here'",
          "Don't mix button sizes in the same group",
        ]}
      />

      {/* ============================================
          SECTION 10: ACCESSIBILITY
          Keyboard, ARIA, screen reader info
          ============================================ */}
      <AccessibilityInfo
        notes={[
          "**Keyboard**: Focusable with Tab, activated with Enter or Space",
          "**Focus indicator**: Visible focus ring using green-500",
          "**Screen readers**: Announces button label and state (disabled, loading)",
          "**ARIA**: Uses `aria-disabled` and `aria-busy` for state communication",
          "**Color contrast**: Meets WCAG AA standards (4.5:1 ratio)",
        ]}
      />

      {/* ============================================
          SECTION 11: RELATED COMPONENTS
          Links to similar components
          ============================================ */}
      <ComponentCard
        id="related"
        title="Related Components"
        description="Components that work well with this one"
      >
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <a
            href="/design-system/components/button"
            className="rounded-lg border border-border-muted p-4 transition-colors hover:border-border-brand"
          >
            <p className="font-medium">Button</p>
            <p className="text-caption text-foreground-muted">For actions</p>
          </a>
          <a
            href="/design-system/components/input"
            className="rounded-lg border border-border-muted p-4 transition-colors hover:border-border-brand"
          >
            <p className="font-medium">Input</p>
            <p className="text-caption text-foreground-muted">For text entry</p>
          </a>
        </div>
      </ComponentCard>

      {/* ============================================
          SECTION 12: REAL-WORLD EXAMPLES
          Practical use cases
          ============================================ */}
      <ComponentCard
        id="examples"
        title="Real-World Examples"
        description="Common patterns and use cases"
      >
        <div className="space-y-8">
          {/* Example 1: In a Form */}
          <div>
            <h4 className="mb-3 text-body-strong">In a Form</h4>
            <CodePreview
              code={`<form onSubmit={handleSubmit}>
  <Label htmlFor="email">Email address</Label>
  <ComponentName
    id="email"
    type="email"
    placeholder="you@example.com"
    required
  />
  <Button type="submit">Submit</Button>
</form>`}
            >
              <form className="max-w-md space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <ComponentName id="email" type="email" placeholder="you@example.com" />
                </div>
                <Button type="submit">Submit</Button>
              </form>
            </CodePreview>
          </div>

          {/* Example 2: In a Card */}
          <div>
            <h4 className="mb-3 text-body-strong">In a Card</h4>
            <CodePreview
              code={`<Card>
  <CardHeader>
    <CardTitle>Search</CardTitle>
  </CardHeader>
  <CardContent>
    <ComponentName placeholder="Search..." />
  </CardContent>
</Card>`}
            >
              {/* Live example */}
            </CodePreview>
          </div>
        </div>
      </ComponentCard>

      {/* Navigation */}
      <PageNavigation currentPath="/design-system/components/component-name" />
    </div>
  );
}
```

---

## Do's and Don'ts Visual Examples

When documenting do's and don'ts, **always include visual examples**, not just text:

```tsx
<ComponentCard id="dos-donts" title="Do's and Don'ts">
  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
    {/* DO */}
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-foreground-success">
        <CheckCircle size={20} weight="fill" />
        <span className="font-semibold">Do</span>
      </div>
      <div className="rounded-lg border-2 border-border-success p-4">
        <Button variant="primary">Save changes</Button>
      </div>
      <p className="text-sm text-foreground-muted">
        Use action-oriented labels that describe what will happen.
      </p>
    </div>

    {/* DON'T */}
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-foreground-error">
        <XCircle size={20} weight="fill" />
        <span className="font-semibold">Don't</span>
      </div>
      <div className="rounded-lg border-2 border-border-error p-4">
        <Button variant="primary">Click here</Button>
      </div>
      <p className="text-sm text-foreground-muted">
        Avoid generic labels that don't describe the action.
      </p>
    </div>
  </div>
</ComponentCard>
```

---

## Accessibility Documentation Requirements

Every component must document:

| Requirement        | Description                                      |
| ------------------ | ------------------------------------------------ |
| **Keyboard**       | How to navigate and interact using keyboard only |
| **Focus**          | Visible focus indicator styling                  |
| **Screen Readers** | What is announced and when                       |
| **ARIA**           | Roles, states, and properties used               |
| **Color Contrast** | WCAG compliance level                            |
| **Motion**         | Respects `prefers-reduced-motion`                |

---

## Common Mistakes to Avoid

### Prop Mismatches

- **Wrong**: Using `description` when component uses `helpText`
- **Wrong**: Using `size="md"` when valid values are `"sm" | "default" | "lg"`
- **Wrong**: Using `variant="green"` when valid values are `"success" | "warning" | "error"`

### Missing Type Imports

```tsx
import { DateRange } from "react-day-picker";
```

### Assuming Props Exist

Never assume a component has props like:

- `asChild` (Radix pattern - verify it's implemented)
- `onBlur` (might be `onEditEnd` or similar)
- `value`/`onChange` (component might be uncontrolled only)

### Hardcoded Colors

```tsx
// ❌ WRONG
className = "text-[#8EE07E]";

// ✅ CORRECT
className = "text-[var(--primitive-green-400)]";
```

### Incomplete Documentation

Don't just show basic usage—include ALL variants, ALL sizes, ALL states.

---

## Verification Checklist

Before committing changes:

- [ ] **Verified if component exists** - checked for existing implementation
- [ ] **Asked user for confirmation** - confirmed approach before making changes
- [ ] Read the component source file
- [ ] Props in documentation match interface exactly
- [ ] All prop types are correct
- [ ] Default values match component defaults
- [ ] **All colors use CSS variables** - no hardcoded hex values
- [ ] Component is exported from UI index
- [ ] Required icons are exported from Icons index
- [ ] **Documentation includes ALL 12 sections** (see table above)
- [ ] **Variants section shows ALL variants**
- [ ] **States section shows ALL states**
- [ ] **Do's and Don'ts have visual examples**
- [ ] **Accessibility section is complete**
- [ ] **Code examples are copy-paste ready** - include imports
- [ ] Run `pnpm build` to verify no type errors
- [ ] Navigation config updated

---

## Inspiration & References

Study exemplary open-source design systems for documentation best practices.
Focus on systems known for: multi-audience documentation, deep component anatomy,
comprehensive usage guidelines, excellent organization, and multi-framework coverage.
