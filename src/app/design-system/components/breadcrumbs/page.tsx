"use client";

import React from "react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ComponentCard, UsageGuide } from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";

const breadcrumbsProps = [
  { name: "items", type: "BreadcrumbItem[]", required: true, description: "Array of breadcrumb items" },
  { name: "separator", type: "ReactNode", default: '"/"', description: "Custom separator between items" },
  { name: "className", type: "string", default: "undefined", description: "Additional CSS classes" },
];

const breadcrumbItemProps = [
  { name: "label", type: "string", required: true, description: "Display text for the breadcrumb" },
  { name: "href", type: "string", default: "undefined", description: "Link destination (omit for current page)" },
];

export default function BreadcrumbsPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Breadcrumbs
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          Breadcrumbs show the user's current location within a site hierarchy and provide
          quick navigation to parent pages. Use them for deep navigation structures.
        </p>
      </div>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Simple breadcrumb trail"
      >
        <CodePreview
          code={`<Breadcrumbs
  items={[
    { label: "Jobs", href: "/jobs" },
    { label: "Solar Engineer", href: "/jobs/solar-engineer" },
    { label: "Candidates" },
  ]}
/>`}
        >
          <Breadcrumbs
            items={[
              { label: "Jobs", href: "/jobs" },
              { label: "Solar Engineer", href: "/jobs/solar-engineer" },
              { label: "Candidates" },
            ]}
          />
        </CodePreview>
      </ComponentCard>

      {/* Different Depths */}
      <ComponentCard
        id="depths"
        title="Different Depths"
        description="Breadcrumbs at various navigation depths"
      >
        <div className="space-y-6">
          <div>
            <p className="text-caption-strong text-foreground-muted mb-2">Two levels</p>
            <Breadcrumbs
              items={[
                { label: "Dashboard", href: "/" },
                { label: "Settings" },
              ]}
            />
          </div>
          <div>
            <p className="text-caption-strong text-foreground-muted mb-2">Three levels</p>
            <Breadcrumbs
              items={[
                { label: "Jobs", href: "/jobs" },
                { label: "Solar Engineer", href: "/jobs/solar-engineer" },
                { label: "Candidates" },
              ]}
            />
          </div>
          <div>
            <p className="text-caption-strong text-foreground-muted mb-2">Four levels</p>
            <Breadcrumbs
              items={[
                { label: "Dashboard", href: "/" },
                { label: "Settings", href: "/settings" },
                { label: "Team", href: "/settings/team" },
                { label: "Permissions" },
              ]}
            />
          </div>
        </div>
      </ComponentCard>

      {/* Use Cases */}
      <ComponentCard
        id="use-cases"
        title="Use Cases"
        description="Common breadcrumb patterns in an ATS"
      >
        <div className="space-y-6">
          <div>
            <p className="text-caption-strong text-foreground-muted mb-2">Job Pipeline</p>
            <Breadcrumbs
              items={[
                { label: "Jobs", href: "/jobs" },
                { label: "Solar Installation Lead", href: "/jobs/123" },
                { label: "Pipeline" },
              ]}
            />
          </div>
          <div>
            <p className="text-caption-strong text-foreground-muted mb-2">Candidate Profile</p>
            <Breadcrumbs
              items={[
                { label: "Candidates", href: "/candidates" },
                { label: "John Doe" },
              ]}
            />
          </div>
          <div>
            <p className="text-caption-strong text-foreground-muted mb-2">Settings</p>
            <Breadcrumbs
              items={[
                { label: "Settings", href: "/settings" },
                { label: "Integrations", href: "/settings/integrations" },
                { label: "Calendar Sync" },
              ]}
            />
          </div>
          <div>
            <p className="text-caption-strong text-foreground-muted mb-2">Career Page Editor</p>
            <Breadcrumbs
              items={[
                { label: "Career Page", href: "/career-page" },
                { label: "Edit", href: "/career-page/edit" },
                { label: "Hero Section" },
              ]}
            />
          </div>
        </div>
      </ComponentCard>

      {/* Props */}
      <ComponentCard id="props" title="Props">
        <div className="space-y-6">
          <div>
            <h4 className="text-body-strong mb-3">Breadcrumbs</h4>
            <PropsTable props={breadcrumbsProps} />
          </div>
          <div>
            <h4 className="text-body-strong mb-3">BreadcrumbItem</h4>
            <PropsTable props={breadcrumbItemProps} />
          </div>
        </div>
      </ComponentCard>

      {/* Accessibility */}
      <ComponentCard
        id="accessibility"
        title="Accessibility"
        description="Breadcrumb accessibility features"
      >
        <div className="p-4 border border-border rounded-lg bg-background-subtle max-w-lg">
          <ul className="space-y-2 text-body-sm">
            <li className="flex gap-2">
              <span className="text-semantic-success">✓</span>
              Uses <code className="text-caption bg-background-muted px-1 rounded">nav</code> with <code className="text-caption bg-background-muted px-1 rounded">aria-label="Breadcrumb"</code>
            </li>
            <li className="flex gap-2">
              <span className="text-semantic-success">✓</span>
              Current page marked with <code className="text-caption bg-background-muted px-1 rounded">aria-current="page"</code>
            </li>
            <li className="flex gap-2">
              <span className="text-semantic-success">✓</span>
              Separators are decorative and hidden from screen readers
            </li>
            <li className="flex gap-2">
              <span className="text-semantic-success">✓</span>
              Links are keyboard accessible
            </li>
          </ul>
        </div>
      </ComponentCard>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Use for hierarchical navigation (3+ levels)",
          "Start from a logical root (e.g., 'Dashboard' or section)",
          "Make the last item represent current page (non-clickable)",
          "Keep labels concise and consistent",
        ]}
        donts={[
          "Don't use for flat navigation structures",
          "Don't include the current page as a link",
          "Don't use breadcrumbs as primary navigation",
          "Don't show breadcrumbs with only one level",
        ]}
      />

      <PageNavigation currentPath="/design-system/components/breadcrumbs" />
    </div>
  );
}
