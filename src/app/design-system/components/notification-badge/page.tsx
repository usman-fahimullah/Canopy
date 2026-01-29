"use client";

import React from "react";
import { NotificationBadge, Badge, Button, Label } from "@/components/ui";
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
  Bell,
  EnvelopeSimple,
  ChatCircle,
  Users,
  Briefcase,
  CheckCircle,
  Info,
} from "@phosphor-icons/react";

// ============================================
// PROPS DOCUMENTATION
// ============================================
const notificationBadgeProps = [
  {
    name: "count",
    type: "number",
    required: true,
    description: "The count to display in the badge",
  },
  {
    name: "variant",
    type: '"alert" | "count"',
    default: '"alert"',
    description: "Visual style - alert (red) for urgent, count (neutral) for general",
  },
  {
    name: "size",
    type: '"sm" | "default" | "lg"',
    default: '"default"',
    description: "Size of the notification badge",
  },
  {
    name: "max",
    type: "number",
    default: "99",
    description: 'Maximum count to display before showing "99+" format',
  },
  {
    name: "showZero",
    type: "boolean",
    default: "false",
    description: "Whether to show the badge when count is 0 (defaults to hiding)",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Additional CSS classes",
  },
];

export default function NotificationBadgePage() {
  const [count, setCount] = React.useState(5);
  const [messages, setMessages] = React.useState(12);

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
          Notification Badge
        </h1>
        <p className="text-body text-foreground-muted mb-4 max-w-2xl">
          Notification Badges are small numeric indicators used to display counts
          for notifications, unread messages, or other countable items. They support
          two variants: alert (red) for urgent notifications and count (neutral) for
          general counters.
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
              <li>* Unread notification counts</li>
              <li>* New message indicators</li>
              <li>* Item counts in navigation</li>
              <li>* Pending action indicators</li>
              <li>* Cart item quantities</li>
            </ul>
          </div>
          <div className="p-4 bg-[var(--background-error)]/30 rounded-lg border border-[var(--border-error)]">
            <h3 className="font-semibold text-[var(--foreground-error)] mb-2">
              When not to use
            </h3>
            <ul className="text-sm space-y-1 text-foreground-muted">
              <li>* For status labels (use Badge instead)</li>
              <li>* For non-numeric indicators (use Badge with dot)</li>
              <li>* For large numbers that need context</li>
              <li>* When the count is always visible (consider inline text)</li>
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
        description="The notification badge is a simple single-element component"
      >
        <ComponentAnatomy
          parts={[
            { name: "Container", description: "Rounded background with min-width 20px" },
            { name: "Count", description: "Bold numeric text (14px DM Sans Bold)" },
          ]}
        />
        <div className="mt-6 p-4 bg-background-subtle rounded-lg">
          <p className="text-caption text-foreground-muted mb-4">Live anatomy example:</p>
          <div className="flex items-center gap-8">
            <div className="relative inline-flex">
              <NotificationBadge count={24} />
              <div className="absolute -top-4 left-0 w-5 h-5 bg-[var(--foreground-brand)] text-white rounded-full flex items-center justify-center text-xs font-medium">
                1
              </div>
              <div className="absolute -top-4 left-3 w-5 h-5 bg-[var(--foreground-brand)] text-white rounded-full flex items-center justify-center text-xs font-medium">
                2
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
        description="The simplest way to use a notification badge"
      >
        <CodePreview
          code={`import { NotificationBadge } from "@/components/ui";

<NotificationBadge count={5} />
<NotificationBadge count={12} variant="count" />
<NotificationBadge count={99} />
<NotificationBadge count={150} /> {/* Shows 99+ */}`}
        >
          <div className="flex flex-wrap items-center gap-4">
            <div className="space-y-2 text-center">
              <NotificationBadge count={5} />
              <p className="text-caption-sm text-foreground-muted">count: 5</p>
            </div>
            <div className="space-y-2 text-center">
              <NotificationBadge count={12} variant="count" />
              <p className="text-caption-sm text-foreground-muted">variant: count</p>
            </div>
            <div className="space-y-2 text-center">
              <NotificationBadge count={99} />
              <p className="text-caption-sm text-foreground-muted">count: 99</p>
            </div>
            <div className="space-y-2 text-center">
              <NotificationBadge count={150} />
              <p className="text-caption-sm text-foreground-muted">count: 150 (99+)</p>
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SECTION 4: VARIANTS
          ============================================ */}
      <ComponentCard
        id="variants"
        title="Variants"
        description="Two variants for different urgency levels"
      >
        <div className="space-y-6">
          {/* Alert */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label className="font-semibold">Alert (Default)</Label>
              <span className="text-caption text-foreground-muted">- Red background for urgent notifications</span>
            </div>
            <CodePreview
              code={`<NotificationBadge count={5} variant="alert" />`}
            >
              <div className="flex items-center gap-4">
                <NotificationBadge count={1} variant="alert" />
                <NotificationBadge count={5} variant="alert" />
                <NotificationBadge count={24} variant="alert" />
                <NotificationBadge count={99} variant="alert" />
                <NotificationBadge count={150} variant="alert" />
              </div>
            </CodePreview>
          </div>

          {/* Count */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label className="font-semibold">Count</Label>
              <span className="text-caption text-foreground-muted">- Neutral background for general counts</span>
            </div>
            <CodePreview
              code={`<NotificationBadge count={5} variant="count" />`}
            >
              <div className="flex items-center gap-4">
                <NotificationBadge count={1} variant="count" />
                <NotificationBadge count={5} variant="count" />
                <NotificationBadge count={24} variant="count" />
                <NotificationBadge count={99} variant="count" />
                <NotificationBadge count={150} variant="count" />
              </div>
            </CodePreview>
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
          code={`<NotificationBadge count={5} size="sm" />
<NotificationBadge count={5} size="default" />
<NotificationBadge count={5} size="lg" />`}
        >
          <div className="flex flex-wrap items-center gap-6">
            <div className="space-y-2 text-center">
              <NotificationBadge count={5} size="sm" />
              <p className="text-caption-sm text-foreground-muted">sm (16px)</p>
            </div>
            <div className="space-y-2 text-center">
              <NotificationBadge count={5} size="default" />
              <p className="text-caption-sm text-foreground-muted">default (20px)</p>
            </div>
            <div className="space-y-2 text-center">
              <NotificationBadge count={5} size="lg" />
              <p className="text-caption-sm text-foreground-muted">lg (24px)</p>
            </div>
          </div>
        </CodePreview>

        <div className="mt-6">
          <h4 className="text-body-strong text-foreground mb-3">Size comparison with icons</h4>
          <div className="flex items-center gap-8">
            <div className="relative inline-flex">
              <Bell size={20} className="text-foreground" />
              <NotificationBadge count={3} size="sm" className="absolute -top-1 -right-1" />
            </div>
            <div className="relative inline-flex">
              <Bell size={24} className="text-foreground" />
              <NotificationBadge count={3} size="default" className="absolute -top-1.5 -right-1.5" />
            </div>
            <div className="relative inline-flex">
              <Bell size={32} className="text-foreground" />
              <NotificationBadge count={3} size="lg" className="absolute -top-2 -right-2" />
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================
          SECTION 6: MAX COUNT
          ============================================ */}
      <ComponentCard
        id="max-count"
        title="Max Count"
        description="Customize the maximum displayed count"
      >
        <CodePreview
          code={`// Default max is 99
<NotificationBadge count={150} />         {/* Shows 99+ */}

// Custom max value
<NotificationBadge count={150} max={999} /> {/* Shows 150 */}
<NotificationBadge count={1500} max={999} /> {/* Shows 999+ */}

// Lower max for compact display
<NotificationBadge count={15} max={9} />   {/* Shows 9+ */}`}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="space-y-2 text-center">
                <NotificationBadge count={150} />
                <p className="text-caption-sm text-foreground-muted">max: 99 (default)</p>
              </div>
              <div className="space-y-2 text-center">
                <NotificationBadge count={150} max={999} />
                <p className="text-caption-sm text-foreground-muted">max: 999</p>
              </div>
              <div className="space-y-2 text-center">
                <NotificationBadge count={1500} max={999} />
                <p className="text-caption-sm text-foreground-muted">count: 1500, max: 999</p>
              </div>
              <div className="space-y-2 text-center">
                <NotificationBadge count={15} max={9} />
                <p className="text-caption-sm text-foreground-muted">max: 9</p>
              </div>
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SECTION 7: ZERO STATE
          ============================================ */}
      <ComponentCard
        id="zero-state"
        title="Zero State"
        description="By default, badges hide when count is 0"
      >
        <CodePreview
          code={`// Badge is hidden when count is 0 (default)
<NotificationBadge count={0} />

// Force showing zero
<NotificationBadge count={0} showZero />`}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-8">
              <div className="space-y-2 text-center">
                <div className="h-5 flex items-center justify-center">
                  <NotificationBadge count={0} />
                  <span className="text-caption text-foreground-muted italic">(hidden)</span>
                </div>
                <p className="text-caption-sm text-foreground-muted">count: 0 (default)</p>
              </div>
              <div className="space-y-2 text-center">
                <NotificationBadge count={0} showZero />
                <p className="text-caption-sm text-foreground-muted">showZero: true</p>
              </div>
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SECTION 8: INTERACTIVE EXAMPLE
          ============================================ */}
      <ComponentCard
        id="interactive"
        title="Interactive Example"
        description="See how the badge updates dynamically"
      >
        <CodePreview
          code={`const [count, setCount] = useState(5);

<div className="flex items-center gap-4">
  <Button onClick={() => setCount(c => Math.max(0, c - 1))}>-</Button>
  <NotificationBadge count={count} />
  <Button onClick={() => setCount(c => c + 1)}>+</Button>
</div>`}
        >
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCount(c => Math.max(0, c - 1))}
              >
                -
              </Button>
              <div className="w-12 text-center">
                <NotificationBadge count={count} showZero />
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCount(c => c + 1)}
              >
                +
              </Button>
              <span className="text-caption text-foreground-muted">Alert variant</span>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setMessages(c => Math.max(0, c - 1))}
              >
                -
              </Button>
              <div className="w-12 text-center">
                <NotificationBadge count={messages} variant="count" showZero />
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setMessages(c => c + 1)}
              >
                +
              </Button>
              <span className="text-caption text-foreground-muted">Count variant</span>
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SECTION 9: COMMON PATTERNS
          ============================================ */}
      <ComponentCard
        id="patterns"
        title="Common Patterns"
        description="Typical ways to use notification badges"
      >
        <div className="space-y-8">
          {/* With Icons */}
          <div>
            <h4 className="text-body-strong text-foreground mb-3">With Navigation Icons</h4>
            <CodePreview
              code={`<div className="relative inline-flex">
  <Bell size={24} />
  <NotificationBadge
    count={5}
    className="absolute -top-1 -right-1"
  />
</div>`}
            >
              <div className="flex items-center gap-8">
                <div className="relative inline-flex">
                  <Bell size={24} className="text-foreground" />
                  <NotificationBadge count={5} className="absolute -top-1 -right-1" />
                </div>
                <div className="relative inline-flex">
                  <EnvelopeSimple size={24} className="text-foreground" />
                  <NotificationBadge count={12} className="absolute -top-1 -right-1" />
                </div>
                <div className="relative inline-flex">
                  <ChatCircle size={24} className="text-foreground" />
                  <NotificationBadge count={3} className="absolute -top-1 -right-1" />
                </div>
              </div>
            </CodePreview>
          </div>

          {/* With Buttons */}
          <div>
            <h4 className="text-body-strong text-foreground mb-3">With Buttons</h4>
            <CodePreview
              code={`<Button variant="secondary" className="relative">
  <Bell size={20} className="mr-2" />
  Notifications
  <NotificationBadge count={3} className="ml-2" />
</Button>`}
            >
              <div className="flex items-center gap-4">
                <Button variant="secondary" className="relative">
                  <Bell size={20} className="mr-2" />
                  Notifications
                  <NotificationBadge count={3} className="ml-2" />
                </Button>
                <Button variant="secondary" className="relative">
                  <EnvelopeSimple size={20} className="mr-2" />
                  Messages
                  <NotificationBadge count={12} variant="count" className="ml-2" />
                </Button>
              </div>
            </CodePreview>
          </div>

          {/* In Navigation */}
          <div>
            <h4 className="text-body-strong text-foreground mb-3">In Sidebar Navigation</h4>
            <div className="max-w-xs border rounded-lg p-2 space-y-1">
              <div className="flex items-center justify-between p-2 rounded hover:bg-background-subtle cursor-pointer">
                <div className="flex items-center gap-2">
                  <Briefcase size={20} className="text-foreground-muted" />
                  <span className="text-body text-foreground">Jobs</span>
                </div>
                <NotificationBadge count={3} variant="count" />
              </div>
              <div className="flex items-center justify-between p-2 rounded hover:bg-background-subtle cursor-pointer">
                <div className="flex items-center gap-2">
                  <Users size={20} className="text-foreground-muted" />
                  <span className="text-body text-foreground">Candidates</span>
                </div>
                <NotificationBadge count={24} />
              </div>
              <div className="flex items-center justify-between p-2 rounded hover:bg-background-subtle cursor-pointer">
                <div className="flex items-center gap-2">
                  <EnvelopeSimple size={20} className="text-foreground-muted" />
                  <span className="text-body text-foreground">Messages</span>
                </div>
                <NotificationBadge count={8} />
              </div>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================
          SECTION 10: PROPS TABLE
          ============================================ */}
      <ComponentCard id="props" title="Props">
        <PropsTable props={notificationBadgeProps} />
      </ComponentCard>

      {/* ============================================
          SECTION 11: USAGE GUIDELINES
          ============================================ */}
      <UsageGuide
        dos={[
          "Use alert variant for urgent notifications requiring action",
          "Use count variant for general, non-urgent counts",
          "Position consistently across the interface",
          "Set an appropriate max value for your use case",
          "Hide the badge when count is zero (default behavior)",
        ]}
        donts={[
          "Don't use for non-numeric status (use Badge instead)",
          "Don't show too many notification badges at once",
          "Don't use alert variant for non-urgent information",
          "Don't make badges too large for their context",
          "Don't position badges inconsistently",
        ]}
      />

      {/* ============================================
          SECTION 12: ACCESSIBILITY
          ============================================ */}
      <AccessibilityInfo
        items={[
          "**Role**: Uses `role=\"status\"` for screen reader updates",
          "**ARIA Label**: Includes `aria-label` with count (e.g., '5 notifications')",
          "**Color contrast**: Both variants meet WCAG AA standards",
          "**Not color alone**: Numbers provide meaning without relying on color",
          "**Dynamic updates**: Count changes are announced to screen readers",
        ]}
      />

      {/* ============================================
          SECTION 13: RELATED COMPONENTS
          ============================================ */}
      <RelatedComponents
        components={[
          {
            name: "Badge",
            href: "/design-system/components/badge",
            description: "Text-based status indicators and tags",
          },
          {
            name: "Avatar",
            href: "/design-system/components/avatar",
            description: "User avatars with optional status indicators",
          },
          {
            name: "Button",
            href: "/design-system/components/buttons",
            description: "Buttons that can include notification badges",
          },
        ]}
      />

      {/* ============================================
          SECTION 14: REAL-WORLD EXAMPLES
          ============================================ */}
      <RealWorldExample
        title="Dashboard Header Navigation"
        description="Notification badges in a typical dashboard header"
      >
        <CodePreview
          code={`<header className="flex items-center justify-between p-4 border-b">
  <h1>Canopy ATS</h1>
  <div className="flex items-center gap-4">
    <button className="relative p-2 hover:bg-background-subtle rounded">
      <Bell size={24} />
      <NotificationBadge count={5} className="absolute top-0 right-0" />
    </button>
    <button className="relative p-2 hover:bg-background-subtle rounded">
      <EnvelopeSimple size={24} />
      <NotificationBadge count={12} className="absolute top-0 right-0" />
    </button>
  </div>
</header>`}
        >
          <header className="flex items-center justify-between p-4 border rounded-lg">
            <h1 className="text-body-strong text-foreground">Canopy ATS</h1>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-background-subtle rounded">
                <Bell size={24} className="text-foreground" />
                <NotificationBadge count={5} className="absolute top-0 right-0" />
              </button>
              <button className="relative p-2 hover:bg-background-subtle rounded">
                <EnvelopeSimple size={24} className="text-foreground" />
                <NotificationBadge count={12} className="absolute top-0 right-0" />
              </button>
            </div>
          </header>
        </CodePreview>
      </RealWorldExample>

      <RealWorldExample
        title="ATS Pipeline Summary"
        description="Showing candidate counts per pipeline stage"
      >
        <CodePreview
          code={`<div className="flex gap-4">
  {stages.map(stage => (
    <div key={stage.name} className="flex items-center gap-2">
      <span>{stage.name}</span>
      <NotificationBadge count={stage.count} variant="count" />
    </div>
  ))}
</div>`}
        >
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-background-subtle rounded">
              <span className="text-body text-foreground">New</span>
              <NotificationBadge count={8} variant="count" />
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-background-subtle rounded">
              <span className="text-body text-foreground">Screening</span>
              <NotificationBadge count={15} variant="count" />
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-background-subtle rounded">
              <span className="text-body text-foreground">Interview</span>
              <NotificationBadge count={6} variant="count" />
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-background-subtle rounded">
              <span className="text-body text-foreground">Offer</span>
              <NotificationBadge count={2} variant="count" />
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-background-subtle rounded">
              <span className="text-body text-foreground">Urgent Review</span>
              <NotificationBadge count={3} />
            </div>
          </div>
        </CodePreview>
      </RealWorldExample>

      <RealWorldExample
        title="Job Listing with Application Count"
        description="Showing application counts on job cards"
      >
        <CodePreview
          code={`<div className="p-4 border rounded-lg">
  <div className="flex items-start justify-between mb-2">
    <div>
      <h3 className="font-semibold">Solar Installation Manager</h3>
      <p className="text-caption text-foreground-muted">San Francisco, CA</p>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-caption text-foreground-muted">Applications</span>
      <NotificationBadge count={24} />
    </div>
  </div>
</div>`}
        >
          <div className="max-w-md p-4 border rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-foreground">Solar Installation Manager</h3>
                <p className="text-caption text-foreground-muted">San Francisco, CA</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-caption text-foreground-muted">Applications</span>
                <NotificationBadge count={24} />
              </div>
            </div>
            <div className="flex items-center gap-3 text-caption text-foreground-muted">
              <span>Posted 5 days ago</span>
              <span>*</span>
              <span>12 new today</span>
            </div>
          </div>
        </CodePreview>
      </RealWorldExample>

      {/* Navigation */}
      <PageNavigation currentPath="/design-system/components/notification-badge" />
    </div>
  );
}
