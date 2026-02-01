"use client";

import React from "react";
import { RoleTemplateCard } from "@/components/ui";
import { ComponentCard, UsageGuide } from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";

const roleTemplateCardProps = [
  {
    name: "onSaveTemplate",
    type: "() => void",
    required: true,
    description: "Callback when 'Save as Role Template' is clicked",
  },
  {
    name: "isSaved",
    type: "boolean",
    default: "false",
    description: "Whether the role is already saved as a template",
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    description: "Loading state for the save action",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Additional CSS classes",
  },
];

export default function RoleTemplateCardPage() {
  const [isSaved, setIsSaved] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setIsSaved(true);
      setLoading(false);
    }, 1500);
  };

  const handleReset = () => {
    setIsSaved(false);
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="mb-2 text-heading-lg text-foreground">
          Role Template Card
        </h1>
        <p className="max-w-2xl text-body text-foreground-muted">
          RoleTemplateCard is a promotional card that encourages users to save their role
          configuration as a reusable template. Features an engaging design with clear
          call-to-action.
        </p>
      </div>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Promotional card for saving role templates"
      >
        <CodePreview
          code={`<RoleTemplateCard
  onSaveTemplate={() => console.log("Save template")}
/>`}
        >
          <div className="max-w-md">
            <RoleTemplateCard
              // eslint-disable-next-line no-console
              onSaveTemplate={() => console.log("Save template")}
            />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Interactive Example */}
      <ComponentCard
        id="interactive"
        title="Interactive Example"
        description="Click to save and see the saved state"
      >
        <div className="max-w-md space-y-4">
          <RoleTemplateCard onSaveTemplate={handleSave} isSaved={isSaved} loading={loading} />
          {isSaved && (
            <button onClick={handleReset} className="text-sm text-primary-600 hover:underline">
              Reset to unsaved state
            </button>
          )}
        </div>
      </ComponentCard>

      {/* States */}
      <ComponentCard id="states" title="States" description="Different card states">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="mb-3 text-caption-strong text-foreground-muted">Default</p>
            <RoleTemplateCard onSaveTemplate={() => {}} />
          </div>
          <div>
            <p className="mb-3 text-caption-strong text-foreground-muted">Loading</p>
            <RoleTemplateCard onSaveTemplate={() => {}} loading />
          </div>
          <div>
            <p className="mb-3 text-caption-strong text-foreground-muted">Saved</p>
            <RoleTemplateCard onSaveTemplate={() => {}} isSaved />
          </div>
        </div>
      </ComponentCard>

      {/* In Context */}
      <ComponentCard id="in-context" title="In Context" description="Card in a job form sidebar">
        <div className="max-w-sm space-y-4 rounded-lg border border-border p-4">
          <h3 className="font-medium">Form Actions</h3>
          <div className="space-y-2">
            <button className="w-full rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700">
              Save Draft
            </button>
            <button className="w-full rounded-lg border border-border px-4 py-2 text-sm hover:bg-background-subtle">
              Preview
            </button>
          </div>
          <div className="border-t border-border pt-4">
            <RoleTemplateCard
              // eslint-disable-next-line no-console
              onSaveTemplate={() => console.log("Save template")}
            />
          </div>
        </div>
      </ComponentCard>

      {/* Props */}
      <ComponentCard id="props" title="RoleTemplateCard Props">
        <PropsTable props={roleTemplateCardProps} />
      </ComponentCard>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Place in job form sidebar or after form completion",
          "Show saved state clearly after action",
          "Use loading state during save operation",
          "Position prominently to encourage template creation",
        ]}
        donts={[
          "Don't show if templates aren't supported",
          "Don't hide the card after saving (show saved state)",
          "Don't use for non-job-template purposes",
          "Don't place in the main form flow (use sidebar)",
        ]}
      />

      <PageNavigation currentPath="/design-system/components/role-template-card" />
    </div>
  );
}
