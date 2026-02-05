"use client";

import React from "react";
import { CurrencyInput, SalaryRangeInput, Label, Card, CardContent } from "@/components/ui";
import {
  ComponentCard,
  UsageGuide,
  AccessibilityInfo,
  RelatedComponents,
  RealWorldExample,
} from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";

// ============================================
// PROPS DEFINITIONS
// ============================================

const currencyInputProps = [
  {
    name: "value",
    type: "string",
    required: true,
    description: 'Raw numeric string value (e.g. "60000")',
  },
  {
    name: "onValueChange",
    type: "(value: string) => void",
    required: true,
    description: "Callback when value changes - returns raw numeric string",
  },
  {
    name: "currency",
    type: '"USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "CHF" | "INR"',
    default: '"USD"',
    description: "Currency code for symbol and formatting",
  },
  {
    name: "locale",
    type: "string",
    default: '"en-US"',
    description: "Locale for number formatting (e.g. de-DE for German)",
  },
  {
    name: "allowCalculations",
    type: "boolean",
    default: "true",
    description: 'Enable math expressions like "50k * 2"',
  },
  {
    name: "allowDecimals",
    type: "boolean",
    default: "false",
    description: "Allow decimal values (cents)",
  },
  {
    name: "min",
    type: "number",
    description: "Minimum allowed value (clamped on blur)",
  },
  {
    name: "max",
    type: "number",
    description: "Maximum allowed value (clamped on blur)",
  },
  {
    name: "clearable",
    type: "boolean",
    default: "false",
    description: "Show clear button when field has value",
  },
  {
    name: "helperText",
    type: "string",
    description: "Helper text displayed below input",
  },
  {
    name: "error",
    type: "boolean",
    default: "false",
    description: "Error state styling",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disabled state",
  },
];

const salaryRangeInputProps = [
  {
    name: "value",
    type: "{ min: string; max: string }",
    required: true,
    description: "Current value as object with raw numeric strings",
  },
  {
    name: "onValueChange",
    type: "(value: { min: string; max: string }) => void",
    required: true,
    description: "Callback when either value changes",
  },
  {
    name: "currency",
    type: "CurrencyCode",
    default: '"USD"',
    description: "Currency code for both inputs",
  },
  {
    name: "locale",
    type: "string",
    default: '"en-US"',
    description: "Locale for formatting",
  },
  {
    name: "minPlaceholder",
    type: "string",
    default: '"e.g. 60k"',
    description: "Placeholder for minimum input",
  },
  {
    name: "maxPlaceholder",
    type: "string",
    default: '"e.g. 120k"',
    description: "Placeholder for maximum input",
  },
  {
    name: "clearable",
    type: "boolean",
    default: "false",
    description: "Show clear buttons on each input",
  },
  {
    name: "helperText",
    type: "string",
    description: "Helper text displayed below inputs",
  },
  {
    name: "error",
    type: "boolean",
    default: "false",
    description: "Error state",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disabled state",
  },
];

// ============================================
// PAGE COMPONENT
// ============================================

export default function CurrencyInputPage() {
  // Basic currency input state
  const [salary, setSalary] = React.useState("");

  // Salary range state
  const [salaryRange, setSalaryRange] = React.useState({ min: "", max: "" });

  // Different currencies
  const [euroValue, setEuroValue] = React.useState("");
  const [poundValue, setPoundValue] = React.useState("");

  // With decimals
  const [price, setPrice] = React.useState("");

  // With constraints
  const [constrained, setConstrained] = React.useState("");

  return (
    <div className="space-y-12">
      {/* ============================================
          OVERVIEW
          ============================================ */}
      <div>
        <h1 id="overview" className="mb-2 text-heading-lg font-bold text-foreground">
          Currency Input
        </h1>
        <p className="mb-4 text-body text-foreground-muted">
          A smart currency input with support for shortcuts (60k, 1.5m), math expressions (50k * 2),
          international currencies, and locale-aware formatting. Includes a SalaryRangeInput for
          min/max ranges.
        </p>

        {/* When to Use / When Not to Use */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="bg-[var(--background-success)]/10 rounded-lg border border-[var(--border-success)] p-4">
            <h3 className="mb-2 font-semibold text-[var(--foreground-success)]">When to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>• Salary expectations or ranges</li>
              <li>• Price inputs for products or services</li>
              <li>• Budget or financial planning fields</li>
              <li>• Any monetary value that benefits from shortcuts</li>
            </ul>
          </div>
          <div className="bg-[var(--background-error)]/10 rounded-lg border border-[var(--border-error)] p-4">
            <h3 className="mb-2 font-semibold text-[var(--foreground-error)]">When not to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>• Simple numeric inputs without currency context</li>
              <li>• Quantities or counts (use regular Input)</li>
              <li>• Percentage values (use Slider or Input)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ============================================
          BASIC USAGE
          ============================================ */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="A simple currency input with automatic formatting"
      >
        <CodePreview
          code={`import { CurrencyInput } from "@/components/ui";

const [salary, setSalary] = React.useState("");

<CurrencyInput
  value={salary}
  onValueChange={setSalary}
  placeholder="e.g. 60k"
/>`}
        >
          <div className="max-w-sm space-y-2">
            <Label>Annual Salary</Label>
            <CurrencyInput value={salary} onValueChange={setSalary} placeholder="e.g. 60k" />
            <p className="text-caption text-foreground-muted">
              Current value:{" "}
              <code className="rounded bg-[var(--background-muted)] px-1">
                {salary || "(empty)"}
              </code>
            </p>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SMART SHORTCUTS
          ============================================ */}
      <ComponentCard
        id="shortcuts"
        title="Smart Shortcuts"
        description="Type shortcuts like 60k, 1.5m, or 2b for quick entry"
      >
        <div className="space-y-6">
          <div className="rounded-lg bg-[var(--background-subtle)] p-4">
            <h4 className="mb-3 font-medium">Supported Shortcuts</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <code className="rounded bg-[var(--background-muted)] px-2 py-1">60k</code>
                <span className="ml-2 text-foreground-muted">→ $60,000</span>
              </div>
              <div>
                <code className="rounded bg-[var(--background-muted)] px-2 py-1">1.5m</code>
                <span className="ml-2 text-foreground-muted">→ $1,500,000</span>
              </div>
              <div>
                <code className="rounded bg-[var(--background-muted)] px-2 py-1">2b</code>
                <span className="ml-2 text-foreground-muted">→ $2,000,000,000</span>
              </div>
            </div>
          </div>

          <CodePreview
            code={`// Try typing: 60k, 1.5m, or 2b
<CurrencyInput
  value={value}
  onValueChange={setValue}
  placeholder="Type 60k, 1.5m, or 2b"
  helperText="Shortcuts: k = thousands, m = millions, b = billions"
/>`}
          >
            <div className="max-w-sm">
              <CurrencyInput
                value={salary}
                onValueChange={setSalary}
                placeholder="Type 60k, 1.5m, or 2b"
                helperText="Shortcuts: k = thousands, m = millions, b = billions"
              />
            </div>
          </CodePreview>
        </div>
      </ComponentCard>

      {/* ============================================
          MATH EXPRESSIONS
          ============================================ */}
      <ComponentCard
        id="calculations"
        title="Math Expressions"
        description="Perform calculations directly in the input"
      >
        <div className="space-y-6">
          <div className="rounded-lg bg-[var(--background-subtle)] p-4">
            <h4 className="mb-3 font-medium">Supported Operations</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <code className="rounded bg-[var(--background-muted)] px-2 py-1">50k * 2</code>
                <span className="ml-2 text-foreground-muted">→ $100,000</span>
              </div>
              <div>
                <code className="rounded bg-[var(--background-muted)] px-2 py-1">100k + 20k</code>
                <span className="ml-2 text-foreground-muted">→ $120,000</span>
              </div>
              <div>
                <code className="rounded bg-[var(--background-muted)] px-2 py-1">1m / 12</code>
                <span className="ml-2 text-foreground-muted">→ $83,333</span>
              </div>
              <div>
                <code className="rounded bg-[var(--background-muted)] px-2 py-1">50 * 2080</code>
                <span className="ml-2 text-foreground-muted">→ $104,000 (hourly → annual)</span>
              </div>
            </div>
          </div>

          <CodePreview
            code={`// allowCalculations is true by default
<CurrencyInput
  value={value}
  onValueChange={setValue}
  placeholder="e.g. 50k * 2"
  helperText="Math works: 50k * 2, 100k + 20k, 1m / 12"
/>`}
          >
            <div className="max-w-sm">
              <CurrencyInput
                value={salary}
                onValueChange={setSalary}
                placeholder="e.g. 50k * 2"
                helperText="Math works: 50k * 2, 100k + 20k, 1m / 12"
              />
            </div>
          </CodePreview>
        </div>
      </ComponentCard>

      {/* ============================================
          SALARY RANGE
          ============================================ */}
      <ComponentCard
        id="salary-range"
        title="Salary Range Input"
        description="Min/max range with built-in validation"
      >
        <CodePreview
          code={`import { SalaryRangeInput } from "@/components/ui";

const [range, setRange] = React.useState({ min: "", max: "" });

<SalaryRangeInput
  value={range}
  onValueChange={setRange}
  minPlaceholder="e.g. 60k"
  maxPlaceholder="e.g. 120k"
  helperText="Type 60k for $60,000 or use math like 50k * 2"
/>`}
        >
          <div className="max-w-lg space-y-2">
            <Label>Salary Expectations</Label>
            <SalaryRangeInput
              value={salaryRange}
              onValueChange={setSalaryRange}
              minPlaceholder="e.g. 60k"
              maxPlaceholder="e.g. 120k"
              helperText="Type 60k for $60,000 or use math like 50k * 2"
            />
            <p className="text-caption text-foreground-muted">
              Current range: ${salaryRange.min || "?"} – ${salaryRange.max || "?"}
            </p>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          INTERNATIONAL CURRENCIES
          ============================================ */}
      <ComponentCard
        id="currencies"
        title="International Currencies"
        description="Support for multiple currencies with proper symbols"
      >
        <CodePreview
          code={`<CurrencyInput
  value={euroValue}
  onValueChange={setEuroValue}
  currency="EUR"
  locale="de-DE"
  placeholder="e.g. 50k"
/>

<CurrencyInput
  value={poundValue}
  onValueChange={setPoundValue}
  currency="GBP"
  locale="en-GB"
  placeholder="e.g. 50k"
/>`}
        >
          <div className="grid max-w-lg grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Euro (EUR)</Label>
              <CurrencyInput
                value={euroValue}
                onValueChange={setEuroValue}
                currency="EUR"
                locale="de-DE"
                placeholder="e.g. 50k"
              />
            </div>
            <div className="space-y-2">
              <Label>British Pound (GBP)</Label>
              <CurrencyInput
                value={poundValue}
                onValueChange={setPoundValue}
                currency="GBP"
                locale="en-GB"
                placeholder="e.g. 50k"
              />
            </div>
          </div>
        </CodePreview>

        <div className="mt-4 rounded-lg bg-[var(--background-subtle)] p-4">
          <h4 className="mb-2 font-medium">Supported Currencies</h4>
          <div className="grid grid-cols-4 gap-2 text-sm">
            <div>
              <code>USD</code> – $
            </div>
            <div>
              <code>EUR</code> – €
            </div>
            <div>
              <code>GBP</code> – £
            </div>
            <div>
              <code>JPY</code> – ¥
            </div>
            <div>
              <code>CAD</code> – CA$
            </div>
            <div>
              <code>AUD</code> – A$
            </div>
            <div>
              <code>CHF</code> – CHF
            </div>
            <div>
              <code>INR</code> – ₹
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================
          WITH DECIMALS
          ============================================ */}
      <ComponentCard
        id="decimals"
        title="With Decimals"
        description="Allow decimal values for precise pricing"
      >
        <CodePreview
          code={`<CurrencyInput
  value={price}
  onValueChange={setPrice}
  allowDecimals
  placeholder="e.g. 99.99"
  helperText="Accepts decimal values"
/>`}
        >
          <div className="max-w-sm space-y-2">
            <Label>Product Price</Label>
            <CurrencyInput
              value={price}
              onValueChange={setPrice}
              allowDecimals
              placeholder="e.g. 99.99"
              helperText="Accepts decimal values"
            />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          WITH CONSTRAINTS
          ============================================ */}
      <ComponentCard
        id="constraints"
        title="With Min/Max Constraints"
        description="Clamp values to a specific range on blur"
      >
        <CodePreview
          code={`<CurrencyInput
  value={constrained}
  onValueChange={setConstrained}
  min={30000}
  max={200000}
  placeholder="e.g. 60k"
  helperText="Value will be clamped between $30,000 and $200,000"
/>`}
        >
          <div className="max-w-sm space-y-2">
            <Label>Salary (min $30k, max $200k)</Label>
            <CurrencyInput
              value={constrained}
              onValueChange={setConstrained}
              min={30000}
              max={200000}
              placeholder="e.g. 60k"
              helperText="Value will be clamped between $30,000 and $200,000"
            />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          CLEARABLE
          ============================================ */}
      <ComponentCard
        id="clearable"
        title="Clearable"
        description="Show a clear button when the field has a value"
      >
        <CodePreview
          code={`<CurrencyInput
  value={salary}
  onValueChange={setSalary}
  clearable
  placeholder="e.g. 60k"
/>`}
        >
          <div className="max-w-sm space-y-2">
            <Label>Annual Salary</Label>
            <CurrencyInput
              value={salary}
              onValueChange={setSalary}
              clearable
              placeholder="e.g. 60k"
            />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          STATES
          ============================================ */}
      <ComponentCard id="states" title="States" description="Error and disabled states">
        <div className="grid max-w-lg grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Error State</Label>
            <CurrencyInput value="invalid" onValueChange={() => {}} error placeholder="e.g. 60k" />
          </div>
          <div className="space-y-2">
            <Label>Disabled State</Label>
            <CurrencyInput value="60000" onValueChange={() => {}} disabled placeholder="e.g. 60k" />
          </div>
        </div>
      </ComponentCard>

      {/* ============================================
          PROPS TABLES
          ============================================ */}
      <ComponentCard id="props-currency" title="CurrencyInput Props">
        <PropsTable props={currencyInputProps} />
      </ComponentCard>

      <ComponentCard id="props-range" title="SalaryRangeInput Props">
        <PropsTable props={salaryRangeInputProps} />
      </ComponentCard>

      {/* ============================================
          USAGE GUIDE
          ============================================ */}
      <UsageGuide
        dos={[
          "Use for salary, price, or budget inputs where shortcuts help",
          "Provide helper text explaining available shortcuts",
          "Use SalaryRangeInput when you need min/max values",
          "Choose the appropriate currency for your users' locale",
        ]}
        donts={[
          "Don't use for non-monetary numeric values",
          "Don't disable calculations without good reason",
          "Don't forget to handle the raw string value in your form logic",
          "Don't use allowDecimals for whole-number salaries",
        ]}
      />

      {/* ============================================
          ACCESSIBILITY
          ============================================ */}
      <AccessibilityInfo
        items={[
          "**Keyboard**: Standard input keyboard navigation, Tab to focus",
          "**inputMode**: Uses 'text' to allow letter shortcuts (k, m, b)",
          "**Clear button**: Has aria-label for screen readers",
          "**Error states**: Uses aria-invalid for form validation",
          "**Labels**: Always pair with a Label component for accessibility",
        ]}
      />

      {/* ============================================
          REAL-WORLD EXAMPLES
          ============================================ */}
      <RealWorldExample
        title="In an Onboarding Form"
        description="Collecting salary expectations during job seeker onboarding"
      >
        <Card className="max-w-lg">
          <CardContent className="space-y-4 p-6">
            <div>
              <h3 className="text-heading-sm font-semibold">Salary Expectations</h3>
              <p className="text-caption text-foreground-muted">
                Optional — helps us match you with the right opportunities
              </p>
            </div>
            <SalaryRangeInput
              value={salaryRange}
              onValueChange={setSalaryRange}
              minPlaceholder="e.g. 60k"
              maxPlaceholder="e.g. 120k"
              helperText="Type 60k for $60,000 or 1.5m for $1,500,000. Math works too: 50k * 2"
            />
          </CardContent>
        </Card>
      </RealWorldExample>

      {/* ============================================
          RELATED COMPONENTS
          ============================================ */}
      <RelatedComponents
        components={[
          {
            name: "Input",
            href: "/design-system/components/input",
            description: "Base text input component",
          },
          {
            name: "Slider",
            href: "/design-system/components/slider",
            description: "For visual range selection",
          },
          {
            name: "Form Section",
            href: "/design-system/components/form-section",
            description: "Group form fields together",
          },
        ]}
      />

      {/* ============================================
          PAGE NAVIGATION
          ============================================ */}
      <PageNavigation currentPath="/design-system/components/currency-input" />
    </div>
  );
}
