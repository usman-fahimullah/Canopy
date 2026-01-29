"use client";

import React from "react";
import { BenefitsSelector, defaultBenefitCategories, Badge } from "@/components/ui";
import { ComponentCard, UsageGuide } from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";

const benefitsSelectorProps = [
  { name: "categories", type: "BenefitCategory[]", required: true, description: "Available benefit categories with their items" },
  { name: "selectedBenefits", type: "string[]", required: true, description: "Currently selected benefit IDs" },
  { name: "onSelectionChange", type: "(benefitIds: string[]) => void", required: true, description: "Callback when selection changes" },
  { name: "useCompanyDefaults", type: "boolean", required: true, description: "Whether to use company default benefits" },
  { name: "onUseCompanyDefaultsChange", type: "(useDefaults: boolean) => void", required: true, description: "Callback when company defaults toggle changes" },
  { name: "companyName", type: "string", default: "undefined", description: "Company name for display" },
  { name: "disabled", type: "boolean", default: "false", description: "Disable the selector" },
  { name: "className", type: "string", default: "undefined", description: "Additional CSS classes" },
];

const benefitCategoryInterface = [
  { name: "id", type: "string", required: true, description: "Unique identifier" },
  { name: "name", type: "string", required: true, description: "Category display name" },
  { name: "icon", type: "ReactNode", default: "undefined", description: "Optional category icon" },
  { name: "benefits", type: "BenefitItem[]", required: true, description: "Benefits in this category" },
];

const benefitItemInterface = [
  { name: "id", type: "string", required: true, description: "Unique identifier" },
  { name: "label", type: "string", required: true, description: "Display label" },
  { name: "categoryId", type: "string", required: true, description: "Parent category ID" },
];

export default function BenefitsSelectorPage() {
  const [selectedBenefits, setSelectedBenefits] = React.useState<string[]>([]);
  const [useCompanyDefaults, setUseCompanyDefaults] = React.useState(true);
  const [selectedBenefits2, setSelectedBenefits2] = React.useState<string[]>([
    "health-insurance",
    "dental-coverage",
    "401k-matching",
  ]);
  const [useCompanyDefaults2, setUseCompanyDefaults2] = React.useState(false);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Benefits Selector
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          BenefitsSelector allows users to select job benefits from predefined
          categories. Supports company defaults toggle and custom benefit selection.
        </p>
      </div>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Select benefits from categories"
      >
        <CodePreview
          code={`const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);
const [useCompanyDefaults, setUseCompanyDefaults] = useState(true);

<BenefitsSelector
  categories={defaultBenefitCategories}
  selectedBenefits={selectedBenefits}
  onSelectionChange={setSelectedBenefits}
  useCompanyDefaults={useCompanyDefaults}
  onUseCompanyDefaultsChange={setUseCompanyDefaults}
  companyName="Green Energy Corp"
/>`}
        >
          <div className="max-w-2xl">
            <BenefitsSelector
              categories={defaultBenefitCategories}
              selectedBenefits={selectedBenefits}
              onSelectionChange={setSelectedBenefits}
              useCompanyDefaults={useCompanyDefaults}
              onUseCompanyDefaultsChange={setUseCompanyDefaults}
              companyName="Green Energy Corp"
            />
            <div className="mt-4">
              <p className="text-caption text-foreground-muted mb-2">
                Selected: {selectedBenefits.length} benefits
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedBenefits.map((id) => (
                  <Badge key={id} variant="success">{id}</Badge>
                ))}
              </div>
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* With Pre-selected Benefits */}
      <ComponentCard
        id="preselected"
        title="With Pre-selected Benefits"
        description="Start with some benefits already selected"
      >
        <div className="max-w-2xl">
          <BenefitsSelector
            categories={defaultBenefitCategories}
            selectedBenefits={selectedBenefits2}
            onSelectionChange={setSelectedBenefits2}
            useCompanyDefaults={useCompanyDefaults2}
            onUseCompanyDefaultsChange={setUseCompanyDefaults2}
            companyName="SunPower Inc"
          />
        </div>
      </ComponentCard>

      {/* Disabled State */}
      <ComponentCard
        id="disabled"
        title="Disabled State"
        description="Selector in disabled state"
      >
        <div className="max-w-2xl">
          <BenefitsSelector
            categories={defaultBenefitCategories}
            selectedBenefits={["health-insurance"]}
            onSelectionChange={() => {}}
            useCompanyDefaults={true}
            onUseCompanyDefaultsChange={() => {}}
            disabled
          />
        </div>
      </ComponentCard>

      {/* Default Categories */}
      <ComponentCard
        id="categories"
        title="Default Benefit Categories"
        description="Built-in categories available in the selector"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {defaultBenefitCategories.map((cat) => (
            <div key={cat.id} className="p-4 border border-border rounded-lg">
              <h4 className="font-medium text-foreground">{cat.name}</h4>
              <p className="text-caption text-foreground-muted mt-1">
                {cat.benefits.slice(0, 4).map(b => b.label).join(", ")}
                {cat.benefits.length > 4 && ` +${cat.benefits.length - 4} more`}
              </p>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* Props - BenefitsSelector */}
      <ComponentCard id="props-selector" title="BenefitsSelector Props">
        <PropsTable props={benefitsSelectorProps} />
      </ComponentCard>

      {/* Props - BenefitCategory Interface */}
      <ComponentCard id="props-category" title="BenefitCategory Interface">
        <PropsTable props={benefitCategoryInterface} />
      </ComponentCard>

      {/* Props - BenefitItem Interface */}
      <ComponentCard id="props-item" title="BenefitItem Interface">
        <PropsTable props={benefitItemInterface} />
      </ComponentCard>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Use company defaults toggle for consistency",
          "Group benefits by logical categories",
          "Allow customization for unique offerings",
          "Use for job posting creation",
        ]}
        donts={[
          "Don't have too many categories",
          "Don't hide the company defaults toggle",
          "Don't use for non-benefit selections",
          "Don't require too many selections",
        ]}
      />

      <PageNavigation currentPath="/design-system/components/benefits-selector" />
    </div>
  );
}
