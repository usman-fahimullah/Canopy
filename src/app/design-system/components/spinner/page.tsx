"use client";

import React from "react";
import { Spinner, LoadingOverlay, LoadingInline, Button } from "@/components/ui";
import { ComponentCard, UsageGuide } from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";

const spinnerProps = [
  { name: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"md"', description: "Size of the spinner" },
  { name: "variant", type: '"default" | "muted" | "inverse" | "current"', default: '"default"', description: "Color variant" },
  { name: "label", type: "string", default: '"Loading"', description: "Accessible label for screen readers" },
];

const loadingOverlayProps = [
  { name: "label", type: "string", default: '"Loading..."', description: "Text displayed below the spinner" },
  { name: "spinnerSize", type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"lg"', description: "Size of the spinner" },
];

const loadingInlineProps = [
  { name: "label", type: "string", default: "undefined", description: "Text displayed next to the spinner" },
  { name: "spinnerSize", type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"sm"', description: "Size of the spinner" },
];

export default function SpinnerPage() {
  const [showOverlay, setShowOverlay] = React.useState(false);

  React.useEffect(() => {
    if (showOverlay) {
      const timer = setTimeout(() => setShowOverlay(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showOverlay]);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Spinner
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          Spinners indicate that an action is in progress. Use them for loading states,
          form submissions, and async operations.
        </p>
      </div>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Simple loading spinner"
      >
        <CodePreview
          code={`<Spinner />
<Spinner size="lg" />
<Spinner variant="muted" />`}
        >
          <div className="flex items-center gap-6">
            <Spinner />
            <Spinner size="lg" />
            <Spinner variant="muted" />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Sizes */}
      <ComponentCard
        id="sizes"
        title="Sizes"
        description="Available spinner sizes"
      >
        <div className="flex items-end gap-8">
          {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <Spinner size={size} />
              <span className="text-caption text-foreground-muted">{size}</span>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* Variants */}
      <ComponentCard
        id="variants"
        title="Variants"
        description="Different color variants"
      >
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <Spinner variant="default" />
            <span className="text-caption text-foreground-muted">default</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner variant="muted" />
            <span className="text-caption text-foreground-muted">muted</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 bg-primary-600 rounded-lg">
            <Spinner variant="inverse" />
            <span className="text-caption text-white/70">inverse</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-semantic-success">
            <Spinner variant="current" />
            <span className="text-caption">current</span>
          </div>
        </div>
      </ComponentCard>

      {/* Loading Inline */}
      <ComponentCard
        id="loading-inline"
        title="Loading Inline"
        description="Inline spinner with optional label"
      >
        <div className="space-y-4">
          <LoadingInline label="Loading candidates..." />
          <LoadingInline label="Saving changes..." />
          <LoadingInline spinnerSize="xs" label="Syncing..." />
        </div>
      </ComponentCard>

      {/* Button Loading State */}
      <ComponentCard
        id="button-loading"
        title="Button Loading State"
        description="Using the current variant inside buttons"
      >
        <div className="flex gap-4">
          <Button disabled>
            <Spinner size="sm" variant="current" className="mr-2" />
            Saving...
          </Button>
          <Button variant="secondary" disabled>
            <Spinner size="sm" variant="current" className="mr-2" />
            Loading...
          </Button>
        </div>
      </ComponentCard>

      {/* Loading Overlay */}
      <ComponentCard
        id="loading-overlay"
        title="Loading Overlay"
        description="Full-page loading overlay"
      >
        <div className="space-y-4">
          <Button onClick={() => setShowOverlay(true)}>
            Show Loading Overlay (2s)
          </Button>
          <p className="text-caption text-foreground-muted">
            Click the button to see a full-page loading overlay that auto-dismisses after 2 seconds.
          </p>
        </div>
        {showOverlay && <LoadingOverlay label="Processing your request..." />}
      </ComponentCard>

      {/* Card Loading State */}
      <ComponentCard
        id="card-loading"
        title="Card Loading State"
        description="Spinner centered in a loading card"
      >
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <div className="h-32 border border-border rounded-lg flex items-center justify-center">
            <Spinner size="lg" />
          </div>
          <div className="h-32 border border-border rounded-lg p-4">
            <p className="text-body-sm font-medium">Candidate Details</p>
            <p className="text-caption text-foreground-muted">Loaded content here</p>
          </div>
        </div>
      </ComponentCard>

      {/* Props - Spinner */}
      <ComponentCard id="props-spinner" title="Spinner Props">
        <PropsTable props={spinnerProps} />
      </ComponentCard>

      {/* Props - LoadingOverlay */}
      <ComponentCard id="props-overlay" title="LoadingOverlay Props">
        <PropsTable props={loadingOverlayProps} />
      </ComponentCard>

      {/* Props - LoadingInline */}
      <ComponentCard id="props-inline" title="LoadingInline Props">
        <PropsTable props={loadingInlineProps} />
      </ComponentCard>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Use for operations that take longer than 300ms",
          "Provide descriptive labels for screen readers",
          "Use appropriate size for the context",
          "Use current variant inside colored containers",
        ]}
        donts={[
          "Don't use for instant operations",
          "Don't show multiple spinners simultaneously",
          "Don't use spinner without communicating progress",
          "Don't make loading overlays dismissible by user",
        ]}
      />

      <PageNavigation currentPath="/design-system/components/spinner" />
    </div>
  );
}
