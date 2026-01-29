"use client";

import React from "react";
import { SegmentedController, Label } from "@/components/ui";
import { ComponentCard, UsageGuide } from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";

const segmentedControllerProps = [
  { name: "options", type: "{ value: string; label: string; icon?: ReactNode }[]", required: true, description: "Array of options to display" },
  { name: "value", type: "string", default: "undefined", description: "Controlled selected value" },
  { name: "defaultValue", type: "string", default: "undefined", description: "Default selected value" },
  { name: "onValueChange", type: "(value: string) => void", default: "undefined", description: "Change handler" },
  { name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Size of the controller" },
  { name: "disabled", type: "boolean", default: "false", description: "Disables the controller" },
];

export default function SegmentedControllerPage() {
  const [view, setView] = React.useState("list");
  const [filter, setFilter] = React.useState("all");

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Segmented Controller
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          Segmented controllers allow users to choose between 2-5 mutually exclusive
          options with a toggle-style interface.
        </p>
      </div>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Simple segmented controller"
      >
        <CodePreview
          code={`<SegmentedController
  options={[
    { value: "all", label: "All Jobs" },
    { value: "remote", label: "Remote" },
    { value: "hybrid", label: "Hybrid" },
  ]}
  defaultValue="all"
/>`}
        >
          <SegmentedController
            options={[
              { value: "all", label: "All Jobs" },
              { value: "remote", label: "Remote" },
              { value: "hybrid", label: "Hybrid" },
            ]}
            defaultValue="all"
          />
        </CodePreview>
      </ComponentCard>

      {/* Controlled */}
      <ComponentCard
        id="controlled"
        title="Controlled Controller"
        description="Manage selection state externally"
      >
        <div className="space-y-4">
          <SegmentedController
            options={[
              { value: "list", label: "List" },
              { value: "grid", label: "Grid" },
              { value: "kanban", label: "Kanban" },
            ]}
            value={view}
            onValueChange={setView}
          />
          <p className="text-caption text-foreground-muted">
            Current view: <span className="font-medium text-foreground">{view}</span>
          </p>
        </div>
      </ComponentCard>

      {/* Two Options */}
      <ComponentCard
        id="two-options"
        title="Two Options"
        description="Binary toggle pattern"
      >
        <div className="space-y-4">
          <Label className="block">Job status</Label>
          <SegmentedController
            options={[
              { value: "active", label: "Active" },
              { value: "paused", label: "Paused" },
            ]}
            defaultValue="active"
          />
        </div>
      </ComponentCard>

      {/* Filter Use Case */}
      <ComponentCard
        id="filter-example"
        title="Filter Example"
        description="Common pattern for filtering content"
      >
        <div className="space-y-4">
          <SegmentedController
            options={[
              { value: "all", label: "All" },
              { value: "applied", label: "Applied" },
              { value: "screening", label: "Screening" },
              { value: "interview", label: "Interview" },
              { value: "offer", label: "Offer" },
            ]}
            value={filter}
            onValueChange={setFilter}
          />
          <div className="p-4 border border-border rounded-lg bg-background-subtle">
            <p className="text-body-sm text-foreground-muted">
              Showing candidates in: <span className="font-medium text-foreground">{filter}</span> stage
            </p>
          </div>
        </div>
      </ComponentCard>

      {/* States */}
      <ComponentCard
        id="states"
        title="States"
        description="Disabled state"
      >
        <div className="space-y-4">
          <Label className="block text-foreground-muted">Disabled</Label>
          <SegmentedController
            options={[
              { value: "option1", label: "Option 1" },
              { value: "option2", label: "Option 2" },
              { value: "option3", label: "Option 3" },
            ]}
            defaultValue="option1"
            disabled
          />
        </div>
      </ComponentCard>

      {/* Props */}
      <ComponentCard id="props" title="Props">
        <PropsTable props={segmentedControllerProps} />
      </ComponentCard>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Use for 2-5 mutually exclusive options",
          "Keep labels short and clear",
          "Use for view switching or filtering",
          "Place prominently for important toggles",
        ]}
        donts={[
          "Don't use for more than 5 options (use Select)",
          "Don't use for non-exclusive choices (use Checkbox)",
          "Don't mix with other form inputs inline",
          "Don't use for navigation (use Tabs)",
        ]}
      />

      <PageNavigation currentPath="/design-system/components/segmented-controller" />
    </div>
  );
}
