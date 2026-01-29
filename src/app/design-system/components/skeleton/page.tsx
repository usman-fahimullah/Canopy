"use client";

import React from "react";
import { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard, SkeletonTable } from "@/components/ui/skeleton";
import { ComponentCard, UsageGuide } from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";

const skeletonProps = [
  { name: "variant", type: '"default" | "circular" | "text"', default: '"default"', description: "Shape variant" },
  { name: "animation", type: '"pulse" | "shimmer" | "none"', default: '"pulse"', description: "Animation style" },
  { name: "className", type: "string", default: "undefined", description: "Additional CSS classes for sizing" },
];

const skeletonTextProps = [
  { name: "lines", type: "number", default: "3", description: "Number of text lines to show" },
];

const skeletonAvatarProps = [
  { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Avatar size" },
];

const skeletonTableProps = [
  { name: "rows", type: "number", default: "5", description: "Number of table rows" },
  { name: "columns", type: "number", default: "4", description: "Number of table columns" },
];

export default function SkeletonPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Skeleton
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          Skeleton loaders provide visual placeholders while content is loading.
          They improve perceived performance by showing the page structure before data arrives.
        </p>
      </div>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Simple skeleton placeholder"
      >
        <CodePreview
          code={`<Skeleton className="h-4 w-[200px]" />`}
        >
          <Skeleton className="h-4 w-[200px]" />
        </CodePreview>
      </ComponentCard>

      {/* Variants */}
      <ComponentCard
        id="variants"
        title="Variants"
        description="Different shape variants"
      >
        <div className="space-y-6">
          <div>
            <p className="text-caption-strong text-foreground-muted mb-2">Default (rounded rectangle)</p>
            <Skeleton className="h-12 w-48" />
          </div>
          <div>
            <p className="text-caption-strong text-foreground-muted mb-2">Circular</p>
            <Skeleton variant="circular" className="h-12 w-12" />
          </div>
          <div>
            <p className="text-caption-strong text-foreground-muted mb-2">Text</p>
            <Skeleton variant="text" className="w-64" />
          </div>
        </div>
      </ComponentCard>

      {/* Animations */}
      <ComponentCard
        id="animations"
        title="Animations"
        description="Different animation styles"
      >
        <div className="space-y-6">
          <div>
            <p className="text-caption-strong text-foreground-muted mb-2">Pulse (default)</p>
            <Skeleton animation="pulse" className="h-8 w-48" />
          </div>
          <div>
            <p className="text-caption-strong text-foreground-muted mb-2">Shimmer</p>
            <Skeleton animation="shimmer" className="h-8 w-48" />
          </div>
          <div>
            <p className="text-caption-strong text-foreground-muted mb-2">None</p>
            <Skeleton animation="none" className="h-8 w-48" />
          </div>
        </div>
      </ComponentCard>

      {/* Skeleton Text */}
      <ComponentCard
        id="skeleton-text"
        title="Skeleton Text"
        description="Preset for text content"
      >
        <CodePreview
          code={`<SkeletonText lines={3} />`}
        >
          <div className="max-w-md">
            <SkeletonText lines={3} />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Skeleton Avatar */}
      <ComponentCard
        id="skeleton-avatar"
        title="Skeleton Avatar"
        description="Preset for avatar placeholders"
      >
        <div className="flex items-center gap-4">
          <div className="text-center">
            <SkeletonAvatar size="sm" />
            <p className="text-caption text-foreground-muted mt-2">Small</p>
          </div>
          <div className="text-center">
            <SkeletonAvatar size="md" />
            <p className="text-caption text-foreground-muted mt-2">Medium</p>
          </div>
          <div className="text-center">
            <SkeletonAvatar size="lg" />
            <p className="text-caption text-foreground-muted mt-2">Large</p>
          </div>
        </div>
      </ComponentCard>

      {/* Skeleton Card */}
      <ComponentCard
        id="skeleton-card"
        title="Skeleton Card"
        description="Preset for card placeholders"
      >
        <CodePreview
          code={`<SkeletonCard />`}
        >
          <div className="max-w-sm">
            <SkeletonCard />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Skeleton Table */}
      <ComponentCard
        id="skeleton-table"
        title="Skeleton Table"
        description="Preset for table placeholders"
      >
        <CodePreview
          code={`<SkeletonTable rows={3} columns={4} />`}
        >
          <SkeletonTable rows={3} columns={4} />
        </CodePreview>
      </ComponentCard>

      {/* Use Cases */}
      <ComponentCard
        id="use-cases"
        title="Use Cases"
        description="Common skeleton patterns in an ATS"
      >
        <div className="space-y-8">
          <div>
            <p className="text-caption-strong text-foreground-muted mb-3">Candidate Card Loading</p>
            <div className="max-w-sm border border-border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-4">
                <SkeletonAvatar />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <SkeletonText lines={2} />
              <div className="flex gap-2 mt-4">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-14 rounded-full" />
              </div>
            </div>
          </div>
          <div>
            <p className="text-caption-strong text-foreground-muted mb-3">Job List Loading</p>
            <div className="space-y-3 max-w-lg">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3 border border-border rounded-lg">
                  <Skeleton className="h-10 w-10 rounded" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-48 mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Custom Composition */}
      <ComponentCard
        id="composition"
        title="Custom Composition"
        description="Build complex loading states"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-start gap-3">
              <SkeletonAvatar size="lg" />
              <div className="flex-1">
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-3 w-32 mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20 rounded" />
                  <Skeleton className="h-8 w-24 rounded" />
                </div>
              </div>
            </div>
          </div>
          <div className="border border-border rounded-lg p-4">
            <Skeleton className="h-32 w-full rounded-lg mb-4" />
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </ComponentCard>

      {/* Props */}
      <ComponentCard id="props" title="Props">
        <div className="space-y-6">
          <div>
            <h4 className="text-body-strong mb-3">Skeleton</h4>
            <PropsTable props={skeletonProps} />
          </div>
          <div>
            <h4 className="text-body-strong mb-3">SkeletonText</h4>
            <PropsTable props={skeletonTextProps} />
          </div>
          <div>
            <h4 className="text-body-strong mb-3">SkeletonAvatar</h4>
            <PropsTable props={skeletonAvatarProps} />
          </div>
          <div>
            <h4 className="text-body-strong mb-3">SkeletonTable</h4>
            <PropsTable props={skeletonTableProps} />
          </div>
        </div>
      </ComponentCard>

      {/* Accessibility */}
      <ComponentCard
        id="accessibility"
        title="Accessibility"
        description="Skeleton accessibility considerations"
      >
        <div className="p-4 border border-border rounded-lg bg-background-subtle max-w-lg">
          <ul className="space-y-2 text-body-sm">
            <li className="flex gap-2">
              <span className="text-semantic-success">✓</span>
              Use <code className="text-caption bg-background-muted px-1 rounded">aria-busy="true"</code> on loading containers
            </li>
            <li className="flex gap-2">
              <span className="text-semantic-success">✓</span>
              Announce loading state to screen readers
            </li>
            <li className="flex gap-2">
              <span className="text-semantic-success">✓</span>
              Respect reduced motion preferences
            </li>
            <li className="flex gap-2">
              <span className="text-semantic-warning">!</span>
              Avoid flashing for very quick loads (&lt;200ms)
            </li>
          </ul>
        </div>
      </ComponentCard>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Match skeleton shape to actual content",
          "Use consistent animation throughout the app",
          "Show skeleton for loading times > 200ms",
          "Compose skeletons to match your layouts",
        ]}
        donts={[
          "Don't use for instant operations",
          "Don't change layout when content loads",
          "Don't show skeleton for cached content",
          "Don't use excessive animations",
        ]}
      />

      <PageNavigation currentPath="/design-system/components/skeleton" />
    </div>
  );
}
