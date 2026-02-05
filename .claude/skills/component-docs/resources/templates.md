# Component Documentation Templates

Complete templates for documenting Canopy UI components.

---

## Full Page Template

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

// Props documentation - must match component interface EXACTLY
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
];

export default function ComponentNamePage() {
  const [value, setValue] = React.useState("");

  return (
    <div className="space-y-12">
      {/* SECTION 1: OVERVIEW */}
      <div>
        <h1 id="overview" className="mb-2 text-heading-lg font-bold text-foreground">
          Component Name
        </h1>
        <p className="mb-4 text-body text-foreground-muted">
          Clear description of what this component does.
        </p>

        {/* When to Use / When Not to Use */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="bg-background-success/10 rounded-lg border border-border-success p-4">
            <h3 className="mb-2 font-semibold text-foreground-success">When to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>• Use case 1</li>
              <li>• Use case 2</li>
            </ul>
          </div>
          <div className="bg-background-error/10 rounded-lg border border-border-error p-4">
            <h3 className="mb-2 font-semibold text-foreground-error">When not to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>• Anti-pattern 1</li>
              <li>• Use [Alternative] instead</li>
            </ul>
          </div>
        </div>
      </div>

      {/* SECTION 2: ANATOMY */}
      <ComponentCard id="anatomy" title="Anatomy" description="Component parts">
        {/* Visual breakdown with numbered callouts */}
      </ComponentCard>

      {/* SECTION 3: BASIC USAGE */}
      <ComponentCard id="basic-usage" title="Basic Usage" description="Simplest example">
        <CodePreview code={`<ComponentName>Basic example</ComponentName>`}>
          <ComponentName>Basic example</ComponentName>
        </CodePreview>
      </ComponentCard>

      {/* SECTION 4: VARIANTS */}
      <ComponentCard id="variants" title="Variants" description="All visual styles">
        {/* Show each variant with label */}
      </ComponentCard>

      {/* SECTION 5: SIZES */}
      <ComponentCard id="sizes" title="Sizes" description="Size options">
        {/* Show all sizes side by side */}
      </ComponentCard>

      {/* SECTION 6: STATES */}
      <ComponentCard id="states" title="States" description="Interactive states">
        {/* Default, Hover, Focus, Active, Disabled, Loading, Error */}
      </ComponentCard>

      {/* SECTION 7: CONTROLLED USAGE */}
      <ComponentCard id="controlled" title="Controlled Usage" description="With React state">
        {/* Example with useState */}
      </ComponentCard>

      {/* SECTION 8: PROPS TABLE */}
      <ComponentCard id="props" title="Props">
        <PropsTable props={componentProps} />
      </ComponentCard>

      {/* SECTION 9: DO'S AND DON'TS */}
      <UsageGuide dos={["Do this", "And this"]} donts={["Don't do this", "Or this"]} />

      {/* SECTION 10: ACCESSIBILITY */}
      <AccessibilityInfo
        notes={[
          "**Keyboard**: Tab to focus, Enter/Space to activate",
          "**Screen readers**: Announces label and state",
          "**Color contrast**: WCAG AA compliant",
        ]}
      />

      {/* SECTION 11: RELATED COMPONENTS */}
      <ComponentCard id="related" title="Related Components">
        {/* Links to similar components */}
      </ComponentCard>

      {/* SECTION 12: REAL-WORLD EXAMPLES */}
      <ComponentCard id="examples" title="Real-World Examples">
        {/* 2-3 practical use cases */}
      </ComponentCard>

      <PageNavigation currentPath="/design-system/components/component-name" />
    </div>
  );
}
```

---

## Do's and Don'ts Template

Always include **visual examples**, not just text:

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

## Props Documentation Template

```tsx
const componentProps = [
  {
    name: "propName",
    type: "string | number | boolean",
    default: '"default"',
    description: "What this prop controls",
  },
  // Add all props from the component interface
];
```
