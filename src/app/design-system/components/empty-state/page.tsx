"use client";

import React from "react";
import {
  EmptyState,
  EmptyStateNoCandidates,
  EmptyStateNoJobs,
  EmptyStateNoResults,
  EmptyStateNoActivity,
  EmptyStateError,
} from "@/components/ui";
import { ComponentCard, UsageGuide } from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";
import { Leaf } from "@/components/Icons";

const emptyStateProps = [
  { name: "preset", type: '"inbox" | "search" | "file" | "users" | "jobs" | "error"', default: "undefined", description: "Preset icon type" },
  { name: "icon", type: "ReactNode", default: "undefined", description: "Custom icon" },
  { name: "title", type: "string", required: true, description: "Title text" },
  { name: "description", type: "string", default: "undefined", description: "Description text" },
  { name: "action", type: "{ label: string; onClick: () => void; icon?: ReactNode }", default: "undefined", description: "Primary action button" },
  { name: "secondaryAction", type: "{ label: string; onClick: () => void }", default: "undefined", description: "Secondary action button" },
  { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Component size" },
];

export default function EmptyStatePage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Empty State
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          EmptyState displays a helpful message when no content is available.
          It guides users on what to do next with optional actions.
        </p>
      </div>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Simple empty state with preset"
      >
        <CodePreview
          code={`<EmptyState
  preset="users"
  title="No candidates yet"
  description="Add your first candidate to get started."
  action={{
    label: "Add Candidate",
    onClick: () => {},
  }}
/>`}
        >
          <EmptyState
            preset="users"
            title="No candidates yet"
            description="Add your first candidate to get started."
            action={{
              label: "Add Candidate",
              onClick: () => console.log("Add candidate"),
            }}
          />
        </CodePreview>
      </ComponentCard>

      {/* Preset Icons */}
      <ComponentCard
        id="presets"
        title="Preset Icons"
        description="Built-in icon presets for common scenarios"
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-4 border border-border rounded-lg">
            <EmptyState
              preset="inbox"
              title="Inbox"
              size="sm"
            />
          </div>
          <div className="p-4 border border-border rounded-lg">
            <EmptyState
              preset="search"
              title="Search"
              size="sm"
            />
          </div>
          <div className="p-4 border border-border rounded-lg">
            <EmptyState
              preset="file"
              title="File"
              size="sm"
            />
          </div>
          <div className="p-4 border border-border rounded-lg">
            <EmptyState
              preset="users"
              title="Users"
              size="sm"
            />
          </div>
          <div className="p-4 border border-border rounded-lg">
            <EmptyState
              preset="jobs"
              title="Jobs"
              size="sm"
            />
          </div>
          <div className="p-4 border border-border rounded-lg">
            <EmptyState
              preset="error"
              title="Error"
              size="sm"
            />
          </div>
        </div>
      </ComponentCard>

      {/* Custom Icon */}
      <ComponentCard
        id="custom-icon"
        title="Custom Icon"
        description="Use a custom icon"
      >
        <EmptyState
          icon={<Leaf className="w-8 h-8 text-primary-600" />}
          title="No green jobs found"
          description="Try adjusting your filters or search terms."
        />
      </ComponentCard>

      {/* With Actions */}
      <ComponentCard
        id="with-actions"
        title="With Actions"
        description="Primary and secondary action buttons"
      >
        <EmptyState
          preset="jobs"
          title="No jobs posted"
          description="Create your first job posting to start receiving applications."
          action={{
            label: "Create Job",
            onClick: () => console.log("Create job"),
          }}
          secondaryAction={{
            label: "Import Jobs",
            onClick: () => console.log("Import"),
          }}
        />
      </ComponentCard>

      {/* Sizes */}
      <ComponentCard
        id="sizes"
        title="Sizes"
        description="Available empty state sizes"
      >
        <div className="space-y-8">
          <div className="p-4 border border-border rounded-lg">
            <EmptyState
              preset="inbox"
              title="Small Empty State"
              description="Compact size for limited spaces."
              size="sm"
            />
          </div>
          <div className="p-4 border border-border rounded-lg">
            <EmptyState
              preset="inbox"
              title="Medium Empty State"
              description="Default size for most use cases."
              size="md"
            />
          </div>
          <div className="p-4 border border-border rounded-lg">
            <EmptyState
              preset="inbox"
              title="Large Empty State"
              description="Prominent size for full-page states."
              size="lg"
            />
          </div>
        </div>
      </ComponentCard>

      {/* Pre-built Variants */}
      <ComponentCard
        id="variants"
        title="Pre-built Variants"
        description="Ready-to-use empty state components"
      >
        <div className="space-y-8">
          <div className="p-4 border border-border rounded-lg">
            <p className="text-caption-strong text-foreground-muted mb-4">EmptyStateNoCandidates</p>
            <EmptyStateNoCandidates size="sm" />
          </div>
          <div className="p-4 border border-border rounded-lg">
            <p className="text-caption-strong text-foreground-muted mb-4">EmptyStateNoJobs</p>
            <EmptyStateNoJobs size="sm" />
          </div>
          <div className="p-4 border border-border rounded-lg">
            <p className="text-caption-strong text-foreground-muted mb-4">EmptyStateNoResults</p>
            <EmptyStateNoResults size="sm" />
          </div>
          <div className="p-4 border border-border rounded-lg">
            <p className="text-caption-strong text-foreground-muted mb-4">EmptyStateNoActivity</p>
            <EmptyStateNoActivity size="sm" />
          </div>
          <div className="p-4 border border-border rounded-lg">
            <p className="text-caption-strong text-foreground-muted mb-4">EmptyStateError</p>
            <EmptyStateError
              size="sm"
              action={{
                label: "Try Again",
                onClick: () => console.log("Retry"),
              }}
            />
          </div>
        </div>
      </ComponentCard>

      {/* Props */}
      <ComponentCard id="props" title="Props">
        <PropsTable props={emptyStateProps} />
      </ComponentCard>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Provide clear, actionable guidance",
          "Use appropriate preset icons",
          "Include primary action when applicable",
          "Keep descriptions brief and helpful",
        ]}
        donts={[
          "Don't leave users without a next step",
          "Don't use technical jargon in descriptions",
          "Don't show empty states for brief loading",
          "Don't use error preset for non-error states",
        ]}
      />

      <PageNavigation currentPath="/design-system/components/empty-state" />
    </div>
  );
}
