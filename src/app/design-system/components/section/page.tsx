"use client";

import React from "react";
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionActions,
  SectionContent,
  SectionFooter,
  Card,
  CardContent,
  Button,
  Badge,
  Label,
  Input,
} from "@/components/ui";
import {
  ComponentCard,
  UsageGuide,
  AccessibilityInfo,
} from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";
import { Plus, Gear, Users, Lightning } from "@phosphor-icons/react";

// ============================================
// PROPS DEFINITIONS
// ============================================

const sectionProps = [
  {
    name: "spacing",
    type: '"compact" | "default" | "spacious"',
    default: '"default"',
    description: "Vertical gap between children (compact=12px, default=16px, spacious=24px)",
  },
  {
    name: "as",
    type: '"section" | "div" | "aside" | "article"',
    default: '"section"',
    description: "HTML element to render as",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes",
  },
  {
    name: "children",
    type: "ReactNode",
    required: true,
    description: "Section content (SectionHeader, SectionContent, etc.)",
  },
];

const sectionTitleProps = [
  {
    name: "as",
    type: '"h1" | "h2" | "h3" | "h4"',
    default: '"h2"',
    description: "Heading level to render",
  },
  {
    name: "description",
    type: "string",
    description: "Optional description text below the title",
  },
  {
    name: "children",
    type: "ReactNode",
    required: true,
    description: "Title text content",
  },
];

// ============================================
// PAGE
// ============================================

export default function SectionPage() {
  return (
    <div className="space-y-12">
      {/* Overview */}
      <div>
        <h1 id="overview" className="mb-2 text-heading-lg font-bold text-foreground">
          Section
        </h1>
        <p className="mb-4 text-body text-foreground-muted">
          Semantic grouping of content with a standardized header structure. Section is always
          transparent — compose with Card for visual containers.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="bg-[var(--background-success)]/10 rounded-lg border border-[var(--border-success)] p-4">
            <h3 className="mb-2 font-semibold text-[var(--foreground-success)]">When to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>Grouping related content on a page (settings, dashboard sections)</li>
              <li>Creating consistent title + actions headers</li>
              <li>Establishing spacing between page regions</li>
            </ul>
          </div>
          <div className="bg-[var(--background-error)]/10 rounded-lg border border-[var(--border-error)] p-4">
            <h3 className="mb-2 font-semibold text-[var(--foreground-error)]">When not to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>For visual containers with borders/shadows — use Card instead</li>
              <li>For form-specific grouping — use FormCard + FormSection</li>
              <li>For page-level padding/max-width — use Container instead</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Anatomy */}
      <ComponentCard
        id="anatomy"
        title="Anatomy"
        description="Section is composed of sub-components that can be mixed and matched"
      >
        <div className="space-y-2 rounded-lg bg-[var(--background-subtle)] p-6 font-mono text-sm">
          <div className="text-[var(--foreground-muted)]">{"<Section>"}</div>
          <div className="ml-4 text-[var(--foreground-muted)]">{"<SectionHeader>"}</div>
          <div className="ml-8">
            <span className="text-[var(--foreground-brand)]">{"<SectionTitle>"}</span>
            <span className="text-[var(--foreground-muted)]">
              {" "}
              — heading + optional description
            </span>
          </div>
          <div className="ml-8">
            <span className="text-[var(--foreground-brand)]">{"<SectionActions>"}</span>
            <span className="text-[var(--foreground-muted)]"> — right-aligned buttons</span>
          </div>
          <div className="ml-4 text-[var(--foreground-muted)]">{"</SectionHeader>"}</div>
          <div className="ml-4">
            <span className="text-[var(--foreground-brand)]">{"<SectionContent>"}</span>
            <span className="text-[var(--foreground-muted)]"> — main content area</span>
          </div>
          <div className="ml-4">
            <span className="text-[var(--foreground-brand)]">{"<SectionFooter>"}</span>
            <span className="text-[var(--foreground-muted)]">
              {" "}
              — optional footer with border-top
            </span>
          </div>
          <div className="text-[var(--foreground-muted)]">{"</Section>"}</div>
        </div>
      </ComponentCard>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="The simplest Section with a title and content"
      >
        <CodePreview
          code={`<Section>
  <SectionTitle>Team Members</SectionTitle>
  <SectionContent>
    <p>Content goes here...</p>
  </SectionContent>
</Section>`}
        >
          <Section>
            <SectionTitle>Team Members</SectionTitle>
            <SectionContent>
              <div className="rounded-lg border border-[var(--border-default)] p-4">
                <p className="text-body text-[var(--foreground-muted)]">Content goes here...</p>
              </div>
            </SectionContent>
          </Section>
        </CodePreview>
      </ComponentCard>

      {/* With Header and Actions */}
      <ComponentCard
        id="with-actions"
        title="With Header & Actions"
        description="Use SectionHeader to place title and actions on the same row"
      >
        <CodePreview
          code={`<Section>
  <SectionHeader>
    <SectionTitle description="Manage access levels">
      Team Members
    </SectionTitle>
    <SectionActions>
      <Button variant="tertiary" size="sm">
        <Plus size={16} weight="bold" /> Invite
      </Button>
    </SectionActions>
  </SectionHeader>
  <SectionContent>
    <Card variant="outlined">
      <CardContent className="pt-6">
        {/* Table or list content */}
      </CardContent>
    </Card>
  </SectionContent>
</Section>`}
        >
          <Section>
            <SectionHeader>
              <SectionTitle description="Manage your team access levels">Team Members</SectionTitle>
              <SectionActions>
                <Button variant="tertiary" size="sm" leftIcon={<Plus size={16} weight="bold" />}>
                  Invite
                </Button>
              </SectionActions>
            </SectionHeader>
            <SectionContent>
              <Card variant="outlined">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--background-brand-subtle)]">
                          <Users size={16} className="text-[var(--foreground-brand)]" />
                        </div>
                        <div>
                          <p className="text-body-sm font-medium">Sarah Chen</p>
                          <p className="text-caption text-[var(--foreground-muted)]">Admin</p>
                        </div>
                      </div>
                      <Badge variant="success" size="sm">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--background-brand-subtle)]">
                          <Users size={16} className="text-[var(--foreground-brand)]" />
                        </div>
                        <div>
                          <p className="text-body-sm font-medium">Alex Rivera</p>
                          <p className="text-caption text-[var(--foreground-muted)]">Member</p>
                        </div>
                      </div>
                      <Badge variant="success" size="sm">
                        Active
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </SectionContent>
          </Section>
        </CodePreview>
      </ComponentCard>

      {/* Spacing Variants */}
      <ComponentCard
        id="spacing"
        title="Spacing Variants"
        description="Control the gap between section children"
      >
        <div className="space-y-8">
          {(["compact", "default", "spacious"] as const).map((spacing) => (
            <div key={spacing} className="space-y-2">
              <Label className="capitalize">
                {spacing} — gap-{spacing === "compact" ? "3" : spacing === "default" ? "4" : "6"}
              </Label>
              <div className="rounded-lg border border-[var(--border-default)] p-4">
                <Section spacing={spacing}>
                  <SectionTitle as="h3">Section Title</SectionTitle>
                  <SectionContent>
                    <div className="rounded bg-[var(--background-subtle)] p-3 text-caption text-[var(--foreground-muted)]">
                      Content area
                    </div>
                  </SectionContent>
                  <SectionFooter>
                    <p className="text-caption text-[var(--foreground-muted)]">Footer content</p>
                  </SectionFooter>
                </Section>
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* Composition with Card */}
      <ComponentCard
        id="composition"
        title="Composition with Card"
        description="Section is transparent — wrap content in Card for visual boundaries"
      >
        <CodePreview
          code={`// Header outside card (settings pattern)
<Section>
  <SectionHeader>
    <SectionTitle>Company Profile</SectionTitle>
    <SectionActions>
      <Button variant="tertiary" size="sm">Edit</Button>
    </SectionActions>
  </SectionHeader>
  <SectionContent>
    <Card variant="outlined">
      <CardContent className="pt-6">
        {/* Form fields */}
      </CardContent>
    </Card>
  </SectionContent>
</Section>`}
        >
          <Section>
            <SectionHeader>
              <SectionTitle>Company Profile</SectionTitle>
              <SectionActions>
                <Button variant="tertiary" size="sm" leftIcon={<Gear size={16} />}>
                  Edit
                </Button>
              </SectionActions>
            </SectionHeader>
            <SectionContent>
              <Card variant="outlined">
                <CardContent className="space-y-4 pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-caption text-[var(--foreground-muted)]">Name</span>
                    <span className="text-body-sm">Solaris Energy Co.</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-caption text-[var(--foreground-muted)]">Industry</span>
                    <span className="text-body-sm">Renewable Energy</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-caption text-[var(--foreground-muted)]">Location</span>
                    <span className="text-body-sm">San Francisco, CA</span>
                  </div>
                </CardContent>
              </Card>
            </SectionContent>
          </Section>
        </CodePreview>
      </ComponentCard>

      {/* Multiple Sections */}
      <ComponentCard
        id="multiple"
        title="Multiple Sections"
        description="Stack sections with consistent spacing using space-y-6 or space-y-8"
      >
        <div className="space-y-8 rounded-lg border border-[var(--border-default)] p-6">
          <Section>
            <SectionHeader>
              <SectionTitle>General</SectionTitle>
            </SectionHeader>
            <SectionContent>
              <div className="rounded bg-[var(--background-subtle)] p-4 text-body-sm text-[var(--foreground-muted)]">
                General settings content...
              </div>
            </SectionContent>
          </Section>

          <Section>
            <SectionHeader>
              <SectionTitle>Notifications</SectionTitle>
              <SectionActions>
                <Button variant="ghost" size="sm">
                  Reset
                </Button>
              </SectionActions>
            </SectionHeader>
            <SectionContent>
              <div className="rounded bg-[var(--background-subtle)] p-4 text-body-sm text-[var(--foreground-muted)]">
                Notification settings content...
              </div>
            </SectionContent>
          </Section>

          <Section>
            <SectionHeader>
              <SectionTitle description="These actions cannot be undone">Danger Zone</SectionTitle>
            </SectionHeader>
            <SectionContent>
              <div className="bg-[var(--background-error)]/5 rounded border border-[var(--border-error)] p-4 text-body-sm text-[var(--foreground-muted)]">
                Destructive actions content...
              </div>
            </SectionContent>
          </Section>
        </div>
      </ComponentCard>

      {/* Props Tables */}
      <ComponentCard id="props-section" title="Section Props">
        <PropsTable props={sectionProps} />
      </ComponentCard>

      <ComponentCard id="props-title" title="SectionTitle Props">
        <PropsTable props={sectionTitleProps} />
      </ComponentCard>

      <ComponentCard
        id="props-subcomponents"
        title="Sub-component Props"
        description="SectionHeader, SectionActions, SectionContent, and SectionFooter accept standard div HTML attributes"
      >
        <div className="rounded-lg bg-[var(--background-subtle)] p-4 text-body-sm text-[var(--foreground-muted)]">
          <p>
            All sub-components are{" "}
            <code className="rounded bg-[var(--background-muted)] px-1">forwardRef</code> components
            that accept <code className="rounded bg-[var(--background-muted)] px-1">className</code>{" "}
            and standard HTML div attributes.
          </p>
        </div>
      </ComponentCard>

      {/* Do's and Don'ts */}
      <UsageGuide
        dos={[
          "Use SectionHeader for title + actions rows — it handles alignment automatically",
          "Use SectionTitle with description prop for secondary context",
          "Compose with Card for visual containers — Section is always transparent",
          "Use consistent spacing variants within a page (don't mix compact and spacious)",
        ]}
        donts={[
          "Don't use Section for visual containers — use Card instead",
          "Don't put raw <h2> tags with flex wrappers — use Section components",
          "Don't nest Sections more than one level deep",
          "Don't use Section for single-element wrappers — it's for groups",
        ]}
      />

      {/* Accessibility */}
      <AccessibilityInfo
        items={[
          "**Semantic HTML**: Section renders as `<section>` by default for landmark navigation",
          "**Heading hierarchy**: Use the `as` prop on SectionTitle to maintain heading levels (h1 → h2 → h3)",
          "**Screen readers**: Section + heading creates a navigable landmark region",
          "**Keyboard**: No special keyboard handling — focus follows content within",
        ]}
      />

      {/* Navigation */}
      <PageNavigation currentPath="/design-system/components/section" />
    </div>
  );
}
