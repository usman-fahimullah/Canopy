"use client";

import React from "react";
import { Badge, Label } from "@/components/ui";
import {
  ComponentCard,
  ComponentAnatomy,
  UsageGuide,
  AccessibilityInfo,
  RelatedComponents,
  RealWorldExample,
} from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";
import {
  CheckCircle,
  Warning,
  WarningCircle,
  Info,
  Flag,
  Circle,
  User,
  Briefcase,
  Lightning,
  Leaf,
} from "@phosphor-icons/react";

// ============================================
// PROPS DOCUMENTATION
// ============================================
const badgeProps = [
  {
    name: "variant",
    type: '"default" | "secondary" | "success" | "warning" | "error" | "info" | "critical" | "feature" | "neutral" | "outline" | "outline-primary" | "outline-error" | "outline-info"',
    default: '"default"',
    description: "Visual style variant of the badge",
  },
  {
    name: "size",
    type: '"sm" | "default" | "lg"',
    default: '"default"',
    description: "Size of the badge",
  },
  {
    name: "icon",
    type: "ReactNode",
    default: "undefined",
    description: "Optional icon to display before the text",
  },
  {
    name: "dot",
    type: "boolean",
    default: "false",
    description: "Shows a status dot indicator (legacy, prefer icon)",
  },
  {
    name: "dotColor",
    type: "string",
    default: "undefined",
    description: "Custom color for the dot indicator",
  },
  {
    name: "children",
    type: "ReactNode",
    required: true,
    description: "Badge content/label text",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Additional CSS classes",
  },
];

export default function BadgePage() {
  return (
    <div className="space-y-12">
      {/* ============================================
          SECTION 1: OVERVIEW
          ============================================ */}
      <div>
        <h1
          id="overview"
          className="text-heading-lg text-foreground mb-2"
        >
          Badge
        </h1>
        <p className="text-body text-foreground-muted mb-4 max-w-2xl">
          Badges are compact visual indicators used to highlight status, count,
          categorize items, or draw attention to important information. They
          provide quick visual cues about the state or type of content.
        </p>

        {/* Category Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge variant="feature" icon={<Info size={14} weight="bold" />}>
            Data Display
          </Badge>
          <Badge
            variant="neutral"
            icon={<CheckCircle size={14} weight="bold" />}
          >
            Stable
          </Badge>
        </div>

        {/* When to Use / When Not to Use */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-[var(--background-success)]/30 rounded-lg border border-[var(--border-success)]">
            <h3 className="font-semibold text-[var(--foreground-success)] mb-2">
              When to use
            </h3>
            <ul className="text-sm space-y-1 text-foreground-muted">
              <li>• Indicating status (active, pending, closed)</li>
              <li>• Categorizing or tagging items</li>
              <li>• Showing counts or quantities</li>
              <li>• Highlighting new or featured content</li>
              <li>• Displaying pipeline stages</li>
            </ul>
          </div>
          <div className="p-4 bg-[var(--background-error)]/30 rounded-lg border border-[var(--border-error)]">
            <h3 className="font-semibold text-[var(--foreground-error)] mb-2">
              When not to use
            </h3>
            <ul className="text-sm space-y-1 text-foreground-muted">
              <li>• For clickable actions (use Button instead)</li>
              <li>• For long text content (keep badges concise)</li>
              <li>• As the sole indicator of critical information</li>
              <li>• When there are too many badges in one view</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ============================================
          SECTION 2: ANATOMY
          ============================================ */}
      <ComponentCard
        id="anatomy"
        title="Anatomy"
        description="The badge component consists of these parts"
      >
        <ComponentAnatomy
          parts={[
            { name: "Container", description: "Pill-shaped background with rounded corners" },
            { name: "Icon (optional)", description: "Leading icon for visual context" },
            { name: "Dot (optional)", description: "Small status indicator dot" },
            { name: "Label", description: "Text content of the badge" },
          ]}
        />
        <div className="mt-6 p-4 bg-background-subtle rounded-lg">
          <p className="text-caption text-foreground-muted mb-4">Live anatomy example:</p>
          <div className="flex items-center gap-8">
            <div className="relative">
              <Badge variant="success" icon={<CheckCircle size={14} weight="bold" />}>
                Hired
              </Badge>
              <div className="absolute -top-3 -left-2 w-5 h-5 bg-[var(--foreground-brand)] text-white rounded-full flex items-center justify-center text-xs font-medium">
                1
              </div>
            </div>
            <div className="relative">
              <Badge variant="warning" dot>
                Pending
              </Badge>
              <div className="absolute -top-3 left-1 w-5 h-5 bg-[var(--foreground-brand)] text-white rounded-full flex items-center justify-center text-xs font-medium">
                3
              </div>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================
          SECTION 3: BASIC USAGE
          ============================================ */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="The simplest way to use a badge"
      >
        <CodePreview
          code={`import { Badge } from "@/components/ui";

<Badge>Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>`}
        >
          <div className="flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SECTION 4: VARIANTS
          ============================================ */}
      <ComponentCard
        id="variants"
        title="Variants"
        description="All available badge variants for different use cases"
      >
        <div className="space-y-8">
          {/* Status Variants */}
          <div>
            <h4 className="text-body-strong text-foreground mb-3">Status Variants</h4>
            <p className="text-caption text-foreground-muted mb-4">
              Use for communicating state or status information
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <div className="space-y-2 text-center">
                <Badge variant="success">Success</Badge>
                <p className="text-caption-sm text-foreground-muted">success</p>
              </div>
              <div className="space-y-2 text-center">
                <Badge variant="warning">Warning</Badge>
                <p className="text-caption-sm text-foreground-muted">warning</p>
              </div>
              <div className="space-y-2 text-center">
                <Badge variant="error">Error</Badge>
                <p className="text-caption-sm text-foreground-muted">error</p>
              </div>
              <div className="space-y-2 text-center">
                <Badge variant="critical">Critical</Badge>
                <p className="text-caption-sm text-foreground-muted">critical</p>
              </div>
              <div className="space-y-2 text-center">
                <Badge variant="info">Info</Badge>
                <p className="text-caption-sm text-foreground-muted">info</p>
              </div>
            </div>
          </div>

          {/* Neutral Variants */}
          <div>
            <h4 className="text-body-strong text-foreground mb-3">Neutral Variants</h4>
            <p className="text-caption text-foreground-muted mb-4">
              Use for categorization, tags, or non-status labels
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <div className="space-y-2 text-center">
                <Badge variant="default">Default</Badge>
                <p className="text-caption-sm text-foreground-muted">default</p>
              </div>
              <div className="space-y-2 text-center">
                <Badge variant="secondary">Secondary</Badge>
                <p className="text-caption-sm text-foreground-muted">secondary</p>
              </div>
              <div className="space-y-2 text-center">
                <Badge variant="neutral">Neutral</Badge>
                <p className="text-caption-sm text-foreground-muted">neutral</p>
              </div>
              <div className="space-y-2 text-center">
                <Badge variant="feature">Feature</Badge>
                <p className="text-caption-sm text-foreground-muted">feature</p>
              </div>
            </div>
          </div>

          {/* Outline Variants */}
          <div>
            <h4 className="text-body-strong text-foreground mb-3">Outline Variants</h4>
            <p className="text-caption text-foreground-muted mb-4">
              Use for subtle emphasis or when solid badges are too prominent
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <div className="space-y-2 text-center">
                <Badge variant="outline">Outline</Badge>
                <p className="text-caption-sm text-foreground-muted">outline</p>
              </div>
              <div className="space-y-2 text-center">
                <Badge variant="outline-primary">Primary</Badge>
                <p className="text-caption-sm text-foreground-muted">outline-primary</p>
              </div>
              <div className="space-y-2 text-center">
                <Badge variant="outline-error">Error</Badge>
                <p className="text-caption-sm text-foreground-muted">outline-error</p>
              </div>
              <div className="space-y-2 text-center">
                <Badge variant="outline-info">Info</Badge>
                <p className="text-caption-sm text-foreground-muted">outline-info</p>
              </div>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================
          SECTION 5: SIZES
          ============================================ */}
      <ComponentCard
        id="sizes"
        title="Sizes"
        description="Available badge sizes for different contexts"
      >
        <CodePreview
          code={`<Badge size="sm">Small</Badge>
<Badge size="default">Default</Badge>
<Badge size="lg">Large</Badge>`}
        >
          <div className="flex flex-wrap items-center gap-4">
            <div className="space-y-2 text-center">
              <Badge size="sm" variant="success">Small</Badge>
              <p className="text-caption-sm text-foreground-muted">sm • h-6</p>
            </div>
            <div className="space-y-2 text-center">
              <Badge size="default" variant="success">Default</Badge>
              <p className="text-caption-sm text-foreground-muted">default • h-7</p>
            </div>
            <div className="space-y-2 text-center">
              <Badge size="lg" variant="success">Large</Badge>
              <p className="text-caption-sm text-foreground-muted">lg • h-8</p>
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SECTION 6: STATES & DECORATIONS
          ============================================ */}
      <ComponentCard
        id="states"
        title="Icons & Status Dots"
        description="Adding visual indicators to badges"
      >
        <div className="space-y-8">
          {/* With Icons */}
          <div>
            <h4 className="text-body-strong text-foreground mb-3">With Icons</h4>
            <p className="text-caption text-foreground-muted mb-4">
              Add icons to provide additional visual context
            </p>
            <CodePreview
              code={`import { CheckCircle, Warning, WarningCircle, Info, Flag } from "@phosphor-icons/react";

<Badge variant="success" icon={<CheckCircle size={14} weight="bold" />}>
  Verified
</Badge>
<Badge variant="warning" icon={<Warning size={14} weight="bold" />}>
  Pending
</Badge>
<Badge variant="critical" icon={<WarningCircle size={14} weight="bold" />}>
  Critical
</Badge>
<Badge variant="info" icon={<Info size={14} weight="bold" />}>
  Info
</Badge>
<Badge variant="feature" icon={<Flag size={14} weight="bold" />}>
  Featured
</Badge>`}
            >
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="success" icon={<CheckCircle size={14} weight="bold" />}>
                  Verified
                </Badge>
                <Badge variant="warning" icon={<Warning size={14} weight="bold" />}>
                  Pending
                </Badge>
                <Badge variant="critical" icon={<WarningCircle size={14} weight="bold" />}>
                  Critical
                </Badge>
                <Badge variant="info" icon={<Info size={14} weight="bold" />}>
                  Info
                </Badge>
                <Badge variant="feature" icon={<Flag size={14} weight="bold" />}>
                  Featured
                </Badge>
              </div>
            </CodePreview>
          </div>

          {/* With Status Dots */}
          <div>
            <h4 className="text-body-strong text-foreground mb-3">With Status Dots</h4>
            <p className="text-caption text-foreground-muted mb-4">
              Add a dot indicator for real-time or live status
            </p>
            <CodePreview
              code={`<Badge variant="success" dot>Online</Badge>
<Badge variant="warning" dot>Away</Badge>
<Badge variant="error" dot>Offline</Badge>
<Badge variant="info" dot>In Progress</Badge>`}
            >
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="success" dot>Online</Badge>
                <Badge variant="warning" dot>Away</Badge>
                <Badge variant="error" dot>Offline</Badge>
                <Badge variant="info" dot>In Progress</Badge>
              </div>
            </CodePreview>
          </div>

          {/* Custom Dot Color */}
          <div>
            <h4 className="text-body-strong text-foreground mb-3">Custom Dot Color</h4>
            <p className="text-caption text-foreground-muted mb-4">
              Override the dot color for special cases
            </p>
            <CodePreview
              code={`<Badge variant="secondary" dot dotColor="var(--primitive-purple-500)">
  Custom
</Badge>`}
            >
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary" dot dotColor="var(--primitive-purple-500)">
                  Custom
                </Badge>
                <Badge variant="secondary" dot dotColor="var(--primitive-blue-500)">
                  Custom Blue
                </Badge>
              </div>
            </CodePreview>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================
          SECTION 7: COMMON PATTERNS
          ============================================ */}
      <ComponentCard
        id="patterns"
        title="Common Patterns"
        description="Frequently used badge patterns in ATS applications"
      >
        <div className="space-y-8">
          {/* Job Status */}
          <div>
            <h4 className="text-body-strong text-foreground mb-3">Job Status</h4>
            <div className="flex flex-wrap gap-3">
              <Badge variant="success" icon={<CheckCircle size={14} weight="bold" />}>
                Published
              </Badge>
              <Badge variant="warning" icon={<Warning size={14} weight="bold" />}>
                Draft
              </Badge>
              <Badge variant="secondary">Paused</Badge>
              <Badge variant="error">Closed</Badge>
            </div>
          </div>

          {/* Pipeline Stages */}
          <div>
            <h4 className="text-body-strong text-foreground mb-3">Pipeline Stages</h4>
            <div className="flex flex-wrap gap-3">
              <Badge variant="info" dot>New</Badge>
              <Badge variant="warning" dot>Screening</Badge>
              <Badge variant="default" dot>Interview</Badge>
              <Badge variant="feature" dot>Offer</Badge>
              <Badge variant="success" dot>Hired</Badge>
              <Badge variant="error" dot>Rejected</Badge>
            </div>
          </div>

          {/* Climate Categories */}
          <div>
            <h4 className="text-body-strong text-foreground mb-3">Climate Job Categories</h4>
            <div className="flex flex-wrap gap-3">
              <Badge variant="neutral" icon={<Lightning size={14} />}>
                Solar Energy
              </Badge>
              <Badge variant="neutral" icon={<Leaf size={14} />}>
                Sustainability
              </Badge>
              <Badge variant="neutral">Wind Power</Badge>
              <Badge variant="neutral">ESG</Badge>
              <Badge variant="neutral">Climate Tech</Badge>
            </div>
          </div>

          {/* Counts & Notifications */}
          <div>
            <h4 className="text-body-strong text-foreground mb-3">Counts & Notifications</h4>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-body text-foreground">Applications</span>
                <Badge variant="feature" size="sm">24</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-body text-foreground">Unread</span>
                <Badge variant="error" size="sm">3</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-body text-foreground">Interviews</span>
                <Badge variant="info" size="sm">5</Badge>
              </div>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================
          SECTION 8: PROPS TABLE
          ============================================ */}
      <ComponentCard id="props" title="Props">
        <PropsTable props={badgeProps} />
      </ComponentCard>

      {/* ============================================
          SECTION 9: USAGE GUIDELINES
          ============================================ */}
      <UsageGuide
        dos={[
          "Use consistent colors for the same status across the entire app",
          "Keep badge text short and descriptive (1-2 words ideal)",
          "Use icons to reinforce meaning alongside color",
          "Place badges near the content they describe",
          "Use status dots for real-time or live status indicators",
        ]}
        donts={[
          "Don't use too many different badge colors in one view",
          "Don't use badges for clickable actions (use buttons instead)",
          "Don't use long text content in badges",
          "Don't rely solely on color to convey meaning",
          "Don't use critical/error badges for non-critical information",
        ]}
      />

      {/* ============================================
          SECTION 10: ACCESSIBILITY
          ============================================ */}
      <AccessibilityInfo
        items={[
          "**Color contrast**: All badge variants meet WCAG AA standards (4.5:1 minimum)",
          "**Not color alone**: Always include text labels; don't rely solely on color",
          "**Screen readers**: Badge content is read as regular text",
          "**Icons are decorative**: Icons use `aria-hidden=\"true\"` as they supplement the text",
          "**Status communication**: For status badges, consider adding `role=\"status\"` for live updates",
        ]}
      />

      {/* ============================================
          SECTION 11: RELATED COMPONENTS
          ============================================ */}
      <RelatedComponents
        components={[
          {
            name: "StageBadge",
            href: "/design-system/components/stage-badge",
            description: "Specialized badge for pipeline stages",
          },
          {
            name: "Chip",
            href: "/design-system/components/chip",
            description: "Interactive tags that can be added or removed",
          },
          {
            name: "Avatar",
            href: "/design-system/components/avatar",
            description: "User avatars with optional status badges",
          },
          {
            name: "NotificationBadge",
            href: "/design-system/components/notification-badge",
            description: "Numeric indicators for notifications",
          },
        ]}
      />

      {/* ============================================
          SECTION 12: REAL-WORLD EXAMPLES
          ============================================ */}
      <RealWorldExample
        title="Candidate Pipeline Card"
        description="Badges showing candidate status and skills in an ATS context"
      >
        <CodePreview
          code={`<div className="p-4 border rounded-lg bg-surface">
  <div className="flex items-start justify-between mb-3">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-background-brand flex items-center justify-center">
        <User size={20} className="text-foreground-on-emphasis" weight="bold" />
      </div>
      <div>
        <p className="font-semibold">Sarah Chen</p>
        <p className="text-caption text-foreground-muted">Solar Installation Manager</p>
      </div>
    </div>
    <Badge variant="feature" dot>Interview</Badge>
  </div>
  <div className="flex flex-wrap gap-2 mb-3">
    <Badge variant="success" icon={<CheckCircle size={14} weight="bold" />} size="sm">
      NABCEP Certified
    </Badge>
    <Badge variant="neutral" size="sm">5+ years exp</Badge>
    <Badge variant="neutral" size="sm">Leadership</Badge>
  </div>
  <div className="flex items-center justify-between text-caption text-foreground-muted">
    <span>Match Score: 92%</span>
    <span>Applied 3 days ago</span>
  </div>
</div>`}
        >
          <div className="p-4 border rounded-lg bg-surface max-w-md">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--background-brand)] flex items-center justify-center">
                  <User size={20} className="text-white" weight="bold" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Sarah Chen</p>
                  <p className="text-caption text-foreground-muted">Solar Installation Manager</p>
                </div>
              </div>
              <Badge variant="feature" dot>Interview</Badge>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="success" icon={<CheckCircle size={14} weight="bold" />} size="sm">
                NABCEP Certified
              </Badge>
              <Badge variant="neutral" size="sm">5+ years exp</Badge>
              <Badge variant="neutral" size="sm">Leadership</Badge>
            </div>
            <div className="flex items-center justify-between text-caption text-foreground-muted">
              <span>Match Score: 92%</span>
              <span>Applied 3 days ago</span>
            </div>
          </div>
        </CodePreview>
      </RealWorldExample>

      <RealWorldExample
        title="Job Posting Header"
        description="Badges showing job status and attributes"
      >
        <CodePreview
          code={`<div className="p-4 border rounded-lg bg-surface">
  <div className="flex items-start justify-between mb-2">
    <h3 className="font-semibold text-lg">Senior Solar Engineer</h3>
    <Badge variant="success" icon={<CheckCircle size={14} weight="bold" />}>
      Published
    </Badge>
  </div>
  <p className="text-caption text-foreground-muted mb-3">
    SunPower Solutions • San Francisco, CA
  </p>
  <div className="flex flex-wrap gap-2">
    <Badge variant="secondary" size="sm">Full-time</Badge>
    <Badge variant="secondary" size="sm">Hybrid</Badge>
    <Badge variant="feature" size="sm">Featured</Badge>
  </div>
</div>`}
        >
          <div className="p-4 border rounded-lg bg-surface max-w-md">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg text-foreground">Senior Solar Engineer</h3>
              <Badge variant="success" icon={<CheckCircle size={14} weight="bold" />}>
                Published
              </Badge>
            </div>
            <p className="text-caption text-foreground-muted mb-3">
              SunPower Solutions • San Francisco, CA
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" size="sm">Full-time</Badge>
              <Badge variant="secondary" size="sm">Hybrid</Badge>
              <Badge variant="feature" size="sm">Featured</Badge>
            </div>
          </div>
        </CodePreview>
      </RealWorldExample>

      <RealWorldExample
        title="Dashboard Stats with Badges"
        description="Using badges for metrics and alerts in a dashboard"
      >
        <CodePreview
          code={`<div className="grid grid-cols-3 gap-4">
  <div className="p-4 border rounded-lg bg-surface">
    <div className="flex items-center justify-between mb-1">
      <span className="text-caption text-foreground-muted">Active Jobs</span>
      <Badge variant="success" size="sm">+3</Badge>
    </div>
    <p className="text-heading-sm">12</p>
  </div>
  <div className="p-4 border rounded-lg bg-surface">
    <div className="flex items-center justify-between mb-1">
      <span className="text-caption text-foreground-muted">New Applications</span>
      <Badge variant="feature" size="sm">24</Badge>
    </div>
    <p className="text-heading-sm">156</p>
  </div>
  <div className="p-4 border rounded-lg bg-surface">
    <div className="flex items-center justify-between mb-1">
      <span className="text-caption text-foreground-muted">Urgent Review</span>
      <Badge variant="critical" icon={<WarningCircle size={12} />} size="sm">5</Badge>
    </div>
    <p className="text-heading-sm">5</p>
  </div>
</div>`}
        >
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg bg-surface">
              <div className="flex items-center justify-between mb-1">
                <span className="text-caption text-foreground-muted">Active Jobs</span>
                <Badge variant="success" size="sm">+3</Badge>
              </div>
              <p className="text-heading-sm text-foreground">12</p>
            </div>
            <div className="p-4 border rounded-lg bg-surface">
              <div className="flex items-center justify-between mb-1">
                <span className="text-caption text-foreground-muted">New Applications</span>
                <Badge variant="feature" size="sm">24</Badge>
              </div>
              <p className="text-heading-sm text-foreground">156</p>
            </div>
            <div className="p-4 border rounded-lg bg-surface">
              <div className="flex items-center justify-between mb-1">
                <span className="text-caption text-foreground-muted">Urgent Review</span>
                <Badge variant="critical" icon={<WarningCircle size={12} weight="bold" />} size="sm">5</Badge>
              </div>
              <p className="text-heading-sm text-foreground">5</p>
            </div>
          </div>
        </CodePreview>
      </RealWorldExample>

      {/* Navigation */}
      <PageNavigation currentPath="/design-system/components/badge" />
    </div>
  );
}
