"use client";

import React from "react";
import { Container, Card, CardContent, Button, Label } from "@/components/ui";
import {
  ComponentCard,
  UsageGuide,
  AccessibilityInfo,
} from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";

// ============================================
// PROPS DEFINITIONS
// ============================================

const containerProps = [
  {
    name: "padding",
    type: '"none" | "compact" | "default" | "spacious" | "page"',
    default: '"default"',
    description: "Internal padding. 'page' matches the shell layout (px-8 py-6 lg:px-12)",
  },
  {
    name: "background",
    type: '"transparent" | "default" | "subtle" | "muted" | "emphasized" | "brand"',
    default: '"transparent"',
    description: "Background color using semantic tokens",
  },
  {
    name: "maxWidth",
    type: '"none" | "sm" | "md" | "lg" | "xl"',
    default: '"none"',
    description: "Maximum width constraint with auto centering",
  },
  {
    name: "rounded",
    type: '"none" | "default" | "lg"',
    default: '"none"',
    description: "Border radius (default uses --radius-card, lg uses rounded-2xl)",
  },
  {
    name: "as",
    type: '"div" | "section" | "main" | "article" | "aside"',
    default: '"div"',
    description: "HTML element to render as",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes",
  },
];

// ============================================
// PAGE
// ============================================

export default function ContainerPage() {
  return (
    <div className="space-y-12">
      {/* Overview */}
      <div>
        <h1 id="overview" className="mb-2 text-heading-lg font-bold text-foreground">
          Container
        </h1>
        <p className="mb-4 text-body text-foreground-muted">
          Generic wrapper for consistent padding, max-width, and background. Container has no border
          or shadow — that is Card&apos;s job.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="bg-[var(--background-success)]/10 rounded-lg border border-[var(--border-success)] p-4">
            <h3 className="mb-2 font-semibold text-[var(--foreground-success)]">When to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>Page-level content constraints (padding + max-width)</li>
              <li>Background zones (subtle, muted, emphasized)</li>
              <li>Responsive padding that matches the shell layout</li>
            </ul>
          </div>
          <div className="bg-[var(--background-error)]/10 rounded-lg border border-[var(--border-error)] p-4">
            <h3 className="mb-2 font-semibold text-[var(--foreground-error)]">When not to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>For visual containers with border/shadow — use Card</li>
              <li>For content grouping with headers — use Section</li>
              <li>For form layouts — use FormCard + FormSection</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Container with default padding"
      >
        <CodePreview
          code={`<Container>
  <p>Content with default padding (px-6 py-4)</p>
</Container>`}
        >
          <div className="rounded border border-dashed border-[var(--border-emphasis)]">
            <Container>
              <p className="text-body-sm text-[var(--foreground-muted)]">
                Content with default padding (px-6 py-4)
              </p>
            </Container>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Padding Variants */}
      <ComponentCard
        id="padding"
        title="Padding Variants"
        description="Different padding levels for different contexts"
      >
        <div className="space-y-4">
          {(["none", "compact", "default", "spacious", "page"] as const).map((padding) => (
            <div key={padding} className="space-y-1">
              <Label className="capitalize">{padding}</Label>
              <div className="rounded border border-dashed border-[var(--border-emphasis)]">
                <Container padding={padding} background="subtle" rounded="default">
                  <p className="text-caption text-[var(--foreground-muted)]">
                    padding=&quot;{padding}&quot;
                  </p>
                </Container>
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* Background Variants */}
      <ComponentCard
        id="background"
        title="Background Variants"
        description="Semantic background colors"
      >
        <div className="space-y-4">
          {(["transparent", "default", "subtle", "muted", "emphasized", "brand"] as const).map(
            (bg) => (
              <Container key={bg} padding="default" background={bg} rounded="default">
                <p className="text-caption">background=&quot;{bg}&quot;</p>
              </Container>
            )
          )}
        </div>
      </ComponentCard>

      {/* Max Width */}
      <ComponentCard
        id="max-width"
        title="Max Width"
        description="Constrain content width with auto centering"
      >
        <div className="space-y-4 rounded-lg bg-[var(--background-subtle)] p-4">
          {(["sm", "md", "lg", "xl"] as const).map((maxW) => (
            <Container
              key={maxW}
              maxWidth={maxW}
              padding="compact"
              background="default"
              rounded="default"
            >
              <p className="text-center text-caption text-[var(--foreground-muted)]">
                maxWidth=&quot;{maxW}&quot;
              </p>
            </Container>
          ))}
        </div>
      </ComponentCard>

      {/* Composition */}
      <ComponentCard
        id="composition"
        title="Composition with Section and Card"
        description="Container provides the outer constraint; Section and Card handle content structure"
      >
        <CodePreview
          code={`<Container padding="page" maxWidth="xl">
  <Section>
    <SectionHeader>
      <SectionTitle>Dashboard</SectionTitle>
    </SectionHeader>
    <SectionContent>
      <Card variant="outlined">
        <CardContent>...</CardContent>
      </Card>
    </SectionContent>
  </Section>
</Container>`}
        >
          <div className="rounded-lg border border-dashed border-[var(--border-emphasis)]">
            <Container padding="spacious" background="subtle">
              <div className="space-y-4">
                <h2 className="text-heading-sm font-medium text-[var(--foreground-default)]">
                  Dashboard
                </h2>
                <Card variant="outlined">
                  <CardContent className="pt-6">
                    <p className="text-body-sm text-[var(--foreground-muted)]">
                      Page content inside Container → Section → Card
                    </p>
                  </CardContent>
                </Card>
              </div>
            </Container>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Background Zone Example */}
      <ComponentCard
        id="background-zone"
        title="Background Zone"
        description="Use Container with background + rounded for callout areas"
      >
        <Container padding="default" background="brand" rounded="default">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--background-default)]">
              <span className="text-body-sm">💡</span>
            </div>
            <p className="text-body-sm">
              Tip: You can customize your career page branding in Settings.
            </p>
          </div>
        </Container>
      </ComponentCard>

      {/* Props Table */}
      <ComponentCard id="props" title="Props">
        <PropsTable props={containerProps} />
      </ComponentCard>

      {/* Do's and Don'ts */}
      <UsageGuide
        dos={[
          "Use Container for page-level padding and max-width constraints",
          "Use padding='page' to match the shell layout's responsive padding",
          "Use background variants for callout zones and tip areas",
          "Compose with Card inside Container for visual boundaries",
        ]}
        donts={[
          "Don't add border or shadow to Container — that's Card's job",
          "Don't use Container where Card is appropriate (visual boundaries)",
          "Don't nest Containers unnecessarily — one is usually enough per page section",
          "Don't use Container for form grouping — use FormCard",
        ]}
      />

      {/* Accessibility */}
      <AccessibilityInfo
        items={[
          "**Semantic HTML**: Use the `as` prop to render appropriate elements (`main`, `section`, `aside`)",
          "**Landmark roles**: Container with `as='main'` creates a main landmark for screen readers",
          "**Background contrast**: Ensure text on background variants meets WCAG AA contrast ratios",
        ]}
      />

      {/* Navigation */}
      <PageNavigation currentPath="/design-system/components/container" />
    </div>
  );
}
