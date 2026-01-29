"use client";

import React from "react";
import { Progress, CircularProgress } from "@/components/ui/progress";
import { ComponentCard, UsageGuide } from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";

const progressProps = [
  { name: "value", type: "number", default: "0", description: "Progress value (0-100)" },
  { name: "size", type: '"sm" | "md" | "lg" | "xl"', default: '"md"', description: "Height of the progress bar" },
  { name: "variant", type: '"default" | "success" | "warning" | "error" | "info"', default: '"default"', description: "Color variant" },
  { name: "showLabel", type: "boolean", default: "false", description: "Show percentage label" },
  { name: "formatLabel", type: "(value: number) => string", default: "undefined", description: "Custom label format function" },
  { name: "indeterminate", type: "boolean", default: "false", description: "Indeterminate loading state" },
];

const circularProgressProps = [
  { name: "value", type: "number", default: "0", description: "Progress value (0-100)" },
  { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Size of the circular progress" },
  { name: "strokeWidth", type: "number", default: "4", description: "Width of the progress stroke" },
  { name: "showLabel", type: "boolean", default: "false", description: "Show percentage label in center" },
  { name: "variant", type: '"default" | "success" | "warning" | "error" | "info"', default: '"default"', description: "Color variant" },
];

export default function ProgressPage() {
  const [progress, setProgress] = React.useState(60);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 10));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Progress
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          Progress indicators show the completion status of a task or operation.
          Use them for file uploads, form submissions, or any process that takes time.
        </p>
      </div>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Linear progress bar with value"
      >
        <CodePreview
          code={`<Progress value={60} />`}
        >
          <div className="max-w-md">
            <Progress value={60} />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Sizes */}
      <ComponentCard
        id="sizes"
        title="Sizes"
        description="Different height options for the progress bar"
      >
        <div className="space-y-6 max-w-md">
          <div>
            <p className="text-caption-strong text-foreground-muted mb-2">Small</p>
            <Progress value={40} size="sm" />
          </div>
          <div>
            <p className="text-caption-strong text-foreground-muted mb-2">Medium (default)</p>
            <Progress value={60} size="md" />
          </div>
          <div>
            <p className="text-caption-strong text-foreground-muted mb-2">Large</p>
            <Progress value={80} size="lg" />
          </div>
          <div>
            <p className="text-caption-strong text-foreground-muted mb-2">Extra Large</p>
            <Progress value={90} size="xl" />
          </div>
        </div>
      </ComponentCard>

      {/* Variants */}
      <ComponentCard
        id="variants"
        title="Variants"
        description="Color variants for different contexts"
      >
        <div className="space-y-4 max-w-md">
          <div>
            <p className="text-caption-strong text-foreground-muted mb-2">Default</p>
            <Progress value={70} variant="default" />
          </div>
          <div>
            <p className="text-caption-strong text-foreground-muted mb-2">Success</p>
            <Progress value={100} variant="success" />
          </div>
          <div>
            <p className="text-caption-strong text-foreground-muted mb-2">Warning</p>
            <Progress value={50} variant="warning" />
          </div>
          <div>
            <p className="text-caption-strong text-foreground-muted mb-2">Error</p>
            <Progress value={25} variant="error" />
          </div>
          <div>
            <p className="text-caption-strong text-foreground-muted mb-2">Info</p>
            <Progress value={65} variant="info" />
          </div>
        </div>
      </ComponentCard>

      {/* With Label */}
      <ComponentCard
        id="with-label"
        title="With Label"
        description="Show percentage completion"
      >
        <CodePreview
          code={`<Progress value={75} showLabel />`}
        >
          <div className="max-w-md">
            <Progress value={75} showLabel />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Indeterminate */}
      <ComponentCard
        id="indeterminate"
        title="Indeterminate"
        description="For unknown completion time"
      >
        <CodePreview
          code={`<Progress indeterminate />`}
        >
          <div className="max-w-md">
            <Progress indeterminate />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Circular Progress */}
      <ComponentCard
        id="circular"
        title="Circular Progress"
        description="Circular variant for compact spaces"
      >
        <div className="flex flex-wrap items-end gap-6">
          <div className="text-center">
            <CircularProgress value={25} size="sm" />
            <p className="text-caption text-foreground-muted mt-2">Small</p>
          </div>
          <div className="text-center">
            <CircularProgress value={50} size="md" />
            <p className="text-caption text-foreground-muted mt-2">Medium</p>
          </div>
          <div className="text-center">
            <CircularProgress value={75} size="lg" showLabel />
            <p className="text-caption text-foreground-muted mt-2">Large with label</p>
          </div>
        </div>
      </ComponentCard>

      {/* Circular Variants */}
      <ComponentCard
        id="circular-variants"
        title="Circular Variants"
        description="Color variants for circular progress"
      >
        <div className="flex flex-wrap items-center gap-6">
          <CircularProgress value={80} variant="default" showLabel />
          <CircularProgress value={100} variant="success" showLabel />
          <CircularProgress value={50} variant="warning" showLabel />
          <CircularProgress value={30} variant="error" showLabel />
          <CircularProgress value={65} variant="info" showLabel />
        </div>
      </ComponentCard>

      {/* Animated Example */}
      <ComponentCard
        id="animated"
        title="Animated"
        description="Progress updates in real-time"
      >
        <div className="space-y-4 max-w-md">
          <Progress value={progress} showLabel variant="success" />
          <div className="flex items-center gap-4">
            <CircularProgress value={progress} showLabel />
            <p className="text-body-sm text-foreground-muted">
              Simulating a file upload...
            </p>
          </div>
        </div>
      </ComponentCard>

      {/* Use Cases */}
      <ComponentCard
        id="use-cases"
        title="Use Cases"
        description="Common progress scenarios in an ATS"
      >
        <div className="space-y-6 max-w-md">
          <div>
            <p className="text-caption-strong text-foreground-muted mb-2">Resume Upload</p>
            <Progress value={85} showLabel variant="default" />
          </div>
          <div>
            <p className="text-caption-strong text-foreground-muted mb-2">Profile Completion</p>
            <Progress value={60} showLabel variant="info" />
          </div>
          <div>
            <p className="text-caption-strong text-foreground-muted mb-2">Application Progress</p>
            <div className="flex items-center gap-4">
              <CircularProgress value={75} size="lg" showLabel variant="success" />
              <div>
                <p className="text-body-sm font-medium">3 of 4 steps completed</p>
                <p className="text-caption text-foreground-muted">Almost there!</p>
              </div>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Props */}
      <ComponentCard id="props" title="Props">
        <div className="space-y-6">
          <div>
            <h4 className="text-body-strong mb-3">Progress</h4>
            <PropsTable props={progressProps} />
          </div>
          <div>
            <h4 className="text-body-strong mb-3">CircularProgress</h4>
            <PropsTable props={circularProgressProps} />
          </div>
        </div>
      </ComponentCard>

      {/* Accessibility */}
      <ComponentCard
        id="accessibility"
        title="Accessibility"
        description="Progress accessibility features"
      >
        <div className="p-4 border border-border rounded-lg bg-background-subtle max-w-lg">
          <ul className="space-y-2 text-body-sm">
            <li className="flex gap-2">
              <span className="text-semantic-success">✓</span>
              Uses <code className="text-caption bg-background-muted px-1 rounded">role="progressbar"</code>
            </li>
            <li className="flex gap-2">
              <span className="text-semantic-success">✓</span>
              Includes <code className="text-caption bg-background-muted px-1 rounded">aria-valuenow</code>, <code className="text-caption bg-background-muted px-1 rounded">aria-valuemin</code>, <code className="text-caption bg-background-muted px-1 rounded">aria-valuemax</code>
            </li>
            <li className="flex gap-2">
              <span className="text-semantic-success">✓</span>
              Screen readers announce progress updates
            </li>
            <li className="flex gap-2">
              <span className="text-semantic-success">✓</span>
              Color is not the only indicator (values shown)
            </li>
          </ul>
        </div>
      </ComponentCard>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Use for operations with known completion percentage",
          "Show labels for important progress indicators",
          "Use indeterminate for unknown durations",
          "Match variant color to context (success, error, etc.)",
        ]}
        donts={[
          "Don't use for instant operations",
          "Don't show progress for very short tasks (<1s)",
          "Don't hide progress during long operations",
          "Don't use circular progress when space isn't limited",
        ]}
      />

      <PageNavigation currentPath="/design-system/components/progress" />
    </div>
  );
}
