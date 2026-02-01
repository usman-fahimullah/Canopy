"use client";

import React from "react";
import {
  StageBadge,
  StageIndicator,
  StageProgress,
  StageList,
  Label,
  Card,
  CardContent,
} from "@/components/ui";
import {
  ComponentCard,
  UsageGuide,
  AccessibilityInfo,
  ComponentAnatomy,
  RelatedComponents,
  RealWorldExample,
} from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";

// ============================================
// PROPS DEFINITIONS
// ============================================

const stageBadgeProps = [
  {
    name: "variant",
    type: '"applied" | "qualified" | "screening" | "interview" | "offer" | "hired" | "rejected" | "withdrawn" | "on_hold" | "custom"',
    default: '"applied"',
    description: "Pre-defined stage variant with semantic colors",
  },
  {
    name: "color",
    type: "string",
    description: "Custom hex color (used when variant is 'custom')",
  },
  {
    name: "children",
    type: "ReactNode",
    description: "Stage label text",
    required: true,
  },
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    default: '"md"',
    description: "Size of the badge",
  },
  {
    name: "showDot",
    type: "boolean",
    default: "true",
    description: "Show colored dot indicator",
  },
];

const stageIndicatorProps = [
  {
    name: "variant",
    type: '"applied" | "qualified" | "interview" | "offer" | "hired" | "rejected" | "withdrawn" | "on_hold" | "custom"',
    default: '"applied"',
    description: "Stage type for color",
  },
  {
    name: "color",
    type: "string",
    description: "Custom hex color (used when variant is 'custom')",
  },
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    default: '"md"',
    description: "Size of the indicator dot",
  },
];

const stageProgressProps = [
  {
    name: "stages",
    type: "{ id: string; label: string; color?: string }[]",
    description: "Array of stages to display",
    required: true,
  },
  {
    name: "currentStageId",
    type: "string",
    description: "ID of the current active stage",
    required: true,
  },
];

const stageListProps = [
  {
    name: "stages",
    type: "{ id: string; label: string; color?: string }[]",
    description: "Array of stages to display",
    required: true,
  },
  {
    name: "currentStageId",
    type: "string",
    description: "ID of the current active stage",
    required: true,
  },
  {
    name: "orientation",
    type: '"horizontal" | "vertical"',
    default: '"horizontal"',
    description: "Layout direction",
  },
];

// ============================================
// SAMPLE DATA
// ============================================

const sampleStages = [
  { id: "applied", label: "Applied" },
  { id: "screening", label: "Screening" },
  { id: "interview", label: "Interview" },
  { id: "offer", label: "Offer" },
  { id: "hired", label: "Hired" },
];

// ============================================
// PAGE COMPONENT
// ============================================

export default function StageBadgePage() {
  return (
    <div className="space-y-12">
      {/* ============================================ */}
      {/* 1. OVERVIEW */}
      {/* ============================================ */}
      <div id="overview">
        <h1 className="mb-2 text-heading-lg text-foreground">Stage Badge</h1>
        <p className="max-w-3xl text-body text-foreground-muted">
          Visual indicators for candidate pipeline stages. Stage badges use semantic colors to
          communicate hiring progress at a glance. Includes related components for progress
          visualization and stage lists.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-background-brand-subtle px-3 py-1 text-caption font-medium text-foreground-brand">
            ATS Core
          </span>
          <span className="rounded-full bg-background-subtle px-3 py-1 text-caption text-foreground-muted">
            10 Variants
          </span>
          <span className="rounded-full bg-background-subtle px-3 py-1 text-caption text-foreground-muted">
            4 Sub-components
          </span>
        </div>

        {/* When to Use / When Not to Use */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border-success bg-background-success p-4">
            <h3 className="mb-2 font-semibold text-foreground-success">When to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>• Showing candidate pipeline status</li>
              <li>• Indicating hiring stage in lists and cards</li>
              <li>• Progress tracking in candidate profiles</li>
              <li>• Filtering and grouping by stage</li>
              <li>• Stage selection in dropdowns</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border-error bg-background-error p-4">
            <h3 className="mb-2 font-semibold text-foreground-error">When not to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>• For general status (use Badge component)</li>
              <li>• For non-hiring workflows</li>
              <li>• When color distinction isn&apos;t meaningful</li>
              <li>• For action buttons (use Button)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* 2. ANATOMY */}
      {/* ============================================ */}
      <ComponentAnatomy
        parts={[
          {
            name: "Container",
            description: "Pill-shaped container with rounded-full corners and padding",
            required: true,
          },
          {
            name: "Dot Indicator",
            description: "Colored circle showing the stage color (optional via showDot prop)",
          },
          {
            name: "Label",
            description: "Text content describing the stage name",
            required: true,
          },
        ]}
      />

      {/* ============================================ */}
      {/* 3. BASIC USAGE */}
      {/* ============================================ */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Simple stage badge with default styling"
      >
        <CodePreview
          code={`import { StageBadge } from "@/components/ui";

<StageBadge variant="applied">Applied</StageBadge>
<StageBadge variant="interview">Interview</StageBadge>
<StageBadge variant="hired">Hired</StageBadge>`}
        >
          <div className="flex flex-wrap gap-3">
            <StageBadge variant="applied">Applied</StageBadge>
            <StageBadge variant="interview">Interview</StageBadge>
            <StageBadge variant="hired">Hired</StageBadge>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 4. VARIANTS */}
      {/* ============================================ */}
      <ComponentCard
        id="variants"
        title="Stage Variants"
        description="All pre-defined pipeline stage variants with semantic colors"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            <div className="space-y-2">
              <Label className="text-caption">Applied</Label>
              <StageBadge variant="applied">Applied</StageBadge>
              <p className="text-caption text-foreground-muted">Purple</p>
            </div>
            <div className="space-y-2">
              <Label className="text-caption">Qualified</Label>
              <StageBadge variant="qualified">Qualified</StageBadge>
              <p className="text-caption text-foreground-muted">Blue</p>
            </div>
            <div className="space-y-2">
              <Label className="text-caption">Interview</Label>
              <StageBadge variant="interview">Interview</StageBadge>
              <p className="text-caption text-foreground-muted">Orange</p>
            </div>
            <div className="space-y-2">
              <Label className="text-caption">Offer</Label>
              <StageBadge variant="offer">Offer</StageBadge>
              <p className="text-caption text-foreground-muted">Green</p>
            </div>
            <div className="space-y-2">
              <Label className="text-caption">Hired</Label>
              <StageBadge variant="hired">Hired</StageBadge>
              <p className="text-caption text-foreground-muted">Green</p>
            </div>
            <div className="space-y-2">
              <Label className="text-caption">Rejected</Label>
              <StageBadge variant="rejected">Rejected</StageBadge>
              <p className="text-caption text-foreground-muted">Red</p>
            </div>
            <div className="space-y-2">
              <Label className="text-caption">Withdrawn</Label>
              <StageBadge variant="withdrawn">Withdrawn</StageBadge>
              <p className="text-caption text-foreground-muted">Gray</p>
            </div>
            <div className="space-y-2">
              <Label className="text-caption">On Hold</Label>
              <StageBadge variant="on_hold">On Hold</StageBadge>
              <p className="text-caption text-foreground-muted">Yellow</p>
            </div>
            <div className="space-y-2">
              <Label className="text-caption">Screening</Label>
              <StageBadge variant="screening">Screening</StageBadge>
              <p className="text-caption text-foreground-muted">Blue (alias)</p>
            </div>
            <div className="space-y-2">
              <Label className="text-caption">Custom</Label>
              <StageBadge variant="custom" color="#9333ea">
                Custom
              </StageBadge>
              <p className="text-caption text-foreground-muted">Any hex color</p>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 5. SIZES */}
      {/* ============================================ */}
      <ComponentCard
        id="sizes"
        title="Sizes"
        description="Three size options for different contexts"
      >
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-2">
            <Label>Small</Label>
            <StageBadge variant="interview" size="sm">
              Interview
            </StageBadge>
          </div>
          <div className="space-y-2">
            <Label>Medium (default)</Label>
            <StageBadge variant="interview" size="md">
              Interview
            </StageBadge>
          </div>
          <div className="space-y-2">
            <Label>Large</Label>
            <StageBadge variant="interview" size="lg">
              Interview
            </StageBadge>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 6. WITHOUT DOT */}
      {/* ============================================ */}
      <ComponentCard
        id="without-dot"
        title="Without Dot Indicator"
        description="Hide the colored dot for a cleaner look"
      >
        <CodePreview
          code={`<StageBadge variant="interview" showDot={false}>
  Interview
</StageBadge>`}
        >
          <div className="flex flex-wrap gap-3">
            <StageBadge variant="applied" showDot={false}>
              Applied
            </StageBadge>
            <StageBadge variant="interview" showDot={false}>
              Interview
            </StageBadge>
            <StageBadge variant="hired" showDot={false}>
              Hired
            </StageBadge>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 7. STAGE INDICATOR */}
      {/* ============================================ */}
      <ComponentCard
        id="stage-indicator"
        title="Stage Indicator"
        description="Standalone dot indicator without text"
      >
        <CodePreview
          code={`import { StageIndicator } from "@/components/ui";

<StageIndicator variant="applied" />
<StageIndicator variant="interview" size="lg" />
<StageIndicator variant="custom" color="#9333ea" />`}
        >
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <Label>Small</Label>
              <div className="flex gap-2">
                <StageIndicator variant="applied" size="sm" />
                <StageIndicator variant="interview" size="sm" />
                <StageIndicator variant="hired" size="sm" />
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Label>Medium</Label>
              <div className="flex gap-2">
                <StageIndicator variant="applied" size="md" />
                <StageIndicator variant="interview" size="md" />
                <StageIndicator variant="hired" size="md" />
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Label>Large</Label>
              <div className="flex gap-2">
                <StageIndicator variant="applied" size="lg" />
                <StageIndicator variant="interview" size="lg" />
                <StageIndicator variant="hired" size="lg" />
              </div>
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 8. STAGE PROGRESS */}
      {/* ============================================ */}
      <ComponentCard
        id="stage-progress"
        title="Stage Progress"
        description="Visual progress bar showing pipeline position"
      >
        <CodePreview
          code={`import { StageProgress } from "@/components/ui";

const stages = [
  { id: "applied", label: "Applied" },
  { id: "screening", label: "Screening" },
  { id: "interview", label: "Interview" },
  { id: "offer", label: "Offer" },
  { id: "hired", label: "Hired" },
];

<StageProgress stages={stages} currentStageId="interview" />`}
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>At Applied stage</Label>
              <StageProgress stages={sampleStages} currentStageId="applied" />
            </div>
            <div className="space-y-2">
              <Label>At Interview stage</Label>
              <StageProgress stages={sampleStages} currentStageId="interview" />
            </div>
            <div className="space-y-2">
              <Label>At Hired stage</Label>
              <StageProgress stages={sampleStages} currentStageId="hired" />
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 9. STAGE LIST */}
      {/* ============================================ */}
      <ComponentCard
        id="stage-list"
        title="Stage List"
        description="Compact list with labels showing pipeline stages"
      >
        <CodePreview
          code={`import { StageList } from "@/components/ui";

<StageList
  stages={stages}
  currentStageId="interview"
  orientation="horizontal"
/>`}
        >
          <div className="space-y-8">
            <div className="space-y-2">
              <Label>Horizontal</Label>
              <StageList
                stages={sampleStages}
                currentStageId="interview"
                orientation="horizontal"
              />
            </div>
            <div className="space-y-2">
              <Label>Vertical</Label>
              <StageList stages={sampleStages} currentStageId="interview" orientation="vertical" />
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 10. CUSTOM COLORS */}
      {/* ============================================ */}
      <ComponentCard
        id="custom-colors"
        title="Custom Colors"
        description="Use any hex color for custom pipeline stages"
      >
        <CodePreview
          code={`<StageBadge variant="custom" color="#9333ea">
  Technical Review
</StageBadge>
<StageBadge variant="custom" color="#0891b2">
  Background Check
</StageBadge>`}
        >
          <div className="flex flex-wrap gap-3">
            <StageBadge variant="custom" color="#9333ea">
              Technical Review
            </StageBadge>
            <StageBadge variant="custom" color="#0891b2">
              Background Check
            </StageBadge>
            <StageBadge variant="custom" color="#db2777">
              Culture Fit
            </StageBadge>
            <StageBadge variant="custom" color="#059669">
              Reference Check
            </StageBadge>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 11. PROPS TABLES */}
      {/* ============================================ */}
      <div id="props" className="space-y-8">
        <h2 className="text-heading-sm text-foreground">Props Reference</h2>

        <ComponentCard title="StageBadge Props">
          <PropsTable props={stageBadgeProps} />
        </ComponentCard>

        <ComponentCard title="StageIndicator Props">
          <PropsTable props={stageIndicatorProps} />
        </ComponentCard>

        <ComponentCard title="StageProgress Props">
          <PropsTable props={stageProgressProps} />
        </ComponentCard>

        <ComponentCard title="StageList Props">
          <PropsTable props={stageListProps} />
        </ComponentCard>
      </div>

      {/* ============================================ */}
      {/* 12. USAGE GUIDELINES */}
      {/* ============================================ */}
      <div id="guidelines">
        <h2 className="mb-4 text-heading-sm text-foreground">Usage Guidelines</h2>
        <UsageGuide
          dos={[
            "Use consistent stage colors across all views",
            "Show the dot indicator for quick scanning",
            "Use small size in compact spaces like tables",
            "Use StageProgress for candidate profile headers",
            "Use StageList in detailed pipeline views",
            "Keep stage names short (1-2 words)",
            "Use custom colors sparingly for special stages",
          ]}
          donts={[
            "Don't mix stage badges with regular badges for the same concept",
            "Don't change stage colors between views",
            "Don't use too many custom colors (limits recognizability)",
            "Don't hide the dot in contexts where color is the primary indicator",
            "Don't use stage badges for non-hiring status",
            "Don't use abbreviated text that's unclear",
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 13. ACCESSIBILITY */}
      {/* ============================================ */}
      <div id="accessibility">
        <AccessibilityInfo
          items={[
            "**Color + text**: Stage badges include text labels, not relying solely on color",
            "**Contrast**: All variants meet WCAG AA contrast requirements",
            "**Screen readers**: Full stage name is read aloud",
            "**Dot indicator**: Purely decorative, hidden from screen readers",
            "**Motion**: StageProgress transitions respect prefers-reduced-motion",
            "**Focus**: Not focusable by default (informational only)",
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 14. RELATED COMPONENTS */}
      {/* ============================================ */}
      <div id="related">
        <RelatedComponents
          components={[
            {
              name: "Badge",
              href: "/design-system/components/badge",
              description: "General-purpose status indicators",
            },
            {
              name: "Kanban Board",
              href: "/design-system/components/kanban",
              description: "Visual pipeline with stage columns",
            },
            {
              name: "Candidate Card",
              href: "/design-system/components/candidate-card",
              description: "Candidate display with stage badge",
            },
            {
              name: "Activity Feed",
              href: "/design-system/components/activity-feed",
              description: "Shows stage change events",
            },
            {
              name: "Progress",
              href: "/design-system/components/progress",
              description: "General progress indicators",
            },
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 15. REAL-WORLD EXAMPLES */}
      {/* ============================================ */}
      <div id="examples" className="space-y-6">
        <h2 className="text-heading-sm text-foreground">Real-World Examples</h2>

        <RealWorldExample
          title="Candidate Card with Stage"
          description="Stage badge in a candidate list item"
        >
          <Card className="max-w-md">
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-foreground">Sarah Chen</p>
                  <p className="text-caption text-foreground-muted">Solar Installation Engineer</p>
                </div>
                <StageBadge variant="interview" size="sm">
                  Interview
                </StageBadge>
              </div>
              <div className="mt-4">
                <StageProgress stages={sampleStages} currentStageId="interview" />
              </div>
            </CardContent>
          </Card>
        </RealWorldExample>

        <RealWorldExample title="Pipeline Stage Filter" description="Stage badges as filter chips">
          <div className="flex flex-wrap gap-2">
            <button className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 transition-colors hover:border-border-brand hover:bg-background-subtle">
              <StageIndicator variant="applied" size="sm" />
              <span className="text-caption">Applied (12)</span>
            </button>
            <button className="flex items-center gap-2 rounded-full border border-border-brand bg-background-brand-subtle px-3 py-1.5">
              <StageIndicator variant="interview" size="sm" />
              <span className="text-caption font-medium text-foreground-brand">Interview (5)</span>
            </button>
            <button className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 transition-colors hover:border-border-brand hover:bg-background-subtle">
              <StageIndicator variant="offer" size="sm" />
              <span className="text-caption">Offer (2)</span>
            </button>
            <button className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 transition-colors hover:border-border-brand hover:bg-background-subtle">
              <StageIndicator variant="hired" size="sm" />
              <span className="text-caption">Hired (8)</span>
            </button>
          </div>
        </RealWorldExample>

        <RealWorldExample
          title="Candidate Profile Header"
          description="Stage progress in profile context"
        >
          <div className="rounded-xl border border-border p-6">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background-brand-subtle">
                <span className="text-heading-sm text-foreground-brand">SC</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-heading-sm text-foreground">Sarah Chen</h2>
                  <StageBadge variant="interview">Interview</StageBadge>
                </div>
                <p className="text-body-sm text-foreground-muted">
                  Solar Installation Engineer • San Francisco, CA
                </p>
              </div>
            </div>
            <StageProgress stages={sampleStages} currentStageId="interview" />
          </div>
        </RealWorldExample>
      </div>

      {/* Page Navigation */}
      <PageNavigation currentPath="/design-system/components/stage-badge" />
    </div>
  );
}
