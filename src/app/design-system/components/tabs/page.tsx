"use client";

import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsListUnderline,
  TabsTriggerUnderline,
} from "@/components/ui/tabs";
import { ComponentCard, UsageGuide } from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";

const tabsProps = [
  {
    name: "defaultValue",
    type: "string",
    default: "undefined",
    description: "Initial active tab value",
  },
  {
    name: "value",
    type: "string",
    default: "undefined",
    description: "Controlled active tab value",
  },
  {
    name: "onValueChange",
    type: "(value: string) => void",
    default: "undefined",
    description: "Called when active tab changes",
  },
  {
    name: "orientation",
    type: '"horizontal" | "vertical"',
    default: '"horizontal"',
    description: "Tab orientation",
  },
];

const tabsTriggerProps = [
  { name: "value", type: "string", required: true, description: "Unique value for the tab" },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Whether the tab is disabled",
  },
];

export default function TabsPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="mb-2 text-heading-lg text-foreground">
          Tabs
        </h1>
        <p className="max-w-2xl text-body text-foreground-muted">
          Tabs organize content into multiple sections and allow users to navigate between them. Use
          tabs to group related content at the same hierarchical level.
        </p>
      </div>

      {/* Basic Usage */}
      <ComponentCard id="basic-usage" title="Basic Usage" description="Default pill-style tabs">
        <CodePreview
          code={`<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="candidates">Candidates</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Overview content...</TabsContent>
  <TabsContent value="candidates">Candidates content...</TabsContent>
  <TabsContent value="settings">Settings content...</TabsContent>
</Tabs>`}
        >
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="candidates">Candidates</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4">
              <div className="rounded-lg bg-background-muted p-4">
                <p className="text-body-sm text-foreground-muted">Overview content goes here...</p>
              </div>
            </TabsContent>
            <TabsContent value="candidates" className="mt-4">
              <div className="rounded-lg bg-background-muted p-4">
                <p className="text-body-sm text-foreground-muted">Candidates list goes here...</p>
              </div>
            </TabsContent>
            <TabsContent value="settings" className="mt-4">
              <div className="rounded-lg bg-background-muted p-4">
                <p className="text-body-sm text-foreground-muted">Settings form goes here...</p>
              </div>
            </TabsContent>
          </Tabs>
        </CodePreview>
      </ComponentCard>

      {/* Pill Style */}
      <ComponentCard
        id="pill-style"
        title="Pill Style"
        description="Default tab style with pill-shaped backgrounds"
      >
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-4">
            <div className="rounded-lg bg-background-muted p-4">
              <p className="text-body-sm text-foreground-muted">Overview content goes here...</p>
            </div>
          </TabsContent>
          <TabsContent value="candidates" className="mt-4">
            <div className="rounded-lg bg-background-muted p-4">
              <p className="text-body-sm text-foreground-muted">Candidates list goes here...</p>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="mt-4">
            <div className="rounded-lg bg-background-muted p-4">
              <p className="text-body-sm text-foreground-muted">Analytics dashboard goes here...</p>
            </div>
          </TabsContent>
          <TabsContent value="settings" className="mt-4">
            <div className="rounded-lg bg-background-muted p-4">
              <p className="text-body-sm text-foreground-muted">Settings form goes here...</p>
            </div>
          </TabsContent>
        </Tabs>
      </ComponentCard>

      {/* Underline Style */}
      <ComponentCard
        id="underline-style"
        title="Underline Style"
        description="Alternative tab style with underline indicator"
      >
        <CodePreview
          code={`<Tabs defaultValue="profile">
  <TabsListUnderline>
    <TabsTriggerUnderline value="profile">Profile</TabsTriggerUnderline>
    <TabsTriggerUnderline value="resume">Resume</TabsTriggerUnderline>
    <TabsTriggerUnderline value="activity">Activity</TabsTriggerUnderline>
  </TabsListUnderline>
  <TabsContent value="profile">Profile content...</TabsContent>
</Tabs>`}
        >
          <Tabs defaultValue="profile">
            <TabsListUnderline>
              <TabsTriggerUnderline value="profile">Profile</TabsTriggerUnderline>
              <TabsTriggerUnderline value="resume">Resume</TabsTriggerUnderline>
              <TabsTriggerUnderline value="activity">Activity</TabsTriggerUnderline>
            </TabsListUnderline>
            <TabsContent value="profile" className="mt-4">
              <div className="rounded-lg bg-background-muted p-4">
                <p className="text-body-sm text-foreground-muted">Profile information...</p>
              </div>
            </TabsContent>
            <TabsContent value="resume" className="mt-4">
              <div className="rounded-lg bg-background-muted p-4">
                <p className="text-body-sm text-foreground-muted">Resume viewer...</p>
              </div>
            </TabsContent>
            <TabsContent value="activity" className="mt-4">
              <div className="rounded-lg bg-background-muted p-4">
                <p className="text-body-sm text-foreground-muted">Activity timeline...</p>
              </div>
            </TabsContent>
          </Tabs>
        </CodePreview>
      </ComponentCard>

      {/* With Disabled Tab */}
      <ComponentCard
        id="disabled"
        title="Disabled Tabs"
        description="Individual tabs can be disabled"
      >
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="archived" disabled>
              Archived
            </TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-4">
            <div className="rounded-lg bg-background-muted p-4">
              <p className="text-body-sm text-foreground-muted">Active items...</p>
            </div>
          </TabsContent>
          <TabsContent value="pending" className="mt-4">
            <div className="rounded-lg bg-background-muted p-4">
              <p className="text-body-sm text-foreground-muted">Pending items...</p>
            </div>
          </TabsContent>
        </Tabs>
      </ComponentCard>

      {/* Use Cases */}
      <ComponentCard id="use-cases" title="Use Cases" description="Common tab usage in an ATS">
        <div className="space-y-8">
          <div>
            <p className="mb-3 text-caption-strong text-foreground-muted">Job Details View</p>
            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div>
            <p className="mb-3 text-caption-strong text-foreground-muted">Candidate Profile</p>
            <Tabs defaultValue="profile">
              <TabsListUnderline>
                <TabsTriggerUnderline value="profile">Profile</TabsTriggerUnderline>
                <TabsTriggerUnderline value="resume">Resume</TabsTriggerUnderline>
                <TabsTriggerUnderline value="notes">Notes</TabsTriggerUnderline>
                <TabsTriggerUnderline value="activity">Activity</TabsTriggerUnderline>
              </TabsListUnderline>
            </Tabs>
          </div>
        </div>
      </ComponentCard>

      {/* Props */}
      <ComponentCard id="props" title="Props">
        <div className="space-y-6">
          <div>
            <h4 className="mb-3 text-body-strong">Tabs</h4>
            <PropsTable props={tabsProps} />
          </div>
          <div>
            <h4 className="mb-3 text-body-strong">TabsTrigger</h4>
            <PropsTable props={tabsTriggerProps} />
          </div>
        </div>
      </ComponentCard>

      {/* Accessibility */}
      <ComponentCard
        id="accessibility"
        title="Accessibility"
        description="Tabs accessibility features"
      >
        <div className="max-w-lg rounded-lg border border-border bg-background-subtle p-4">
          <ul className="space-y-2 text-body-sm">
            <li className="flex gap-2">
              <span className="text-semantic-success">✓</span>
              Uses proper{" "}
              <code className="rounded bg-background-muted px-1 text-caption">
                role=&quot;tablist&quot;
              </code>{" "}
              and{" "}
              <code className="rounded bg-background-muted px-1 text-caption">
                role=&quot;tab&quot;
              </code>
            </li>
            <li className="flex gap-2">
              <span className="text-semantic-success">✓</span>
              Arrow keys navigate between tabs
            </li>
            <li className="flex gap-2">
              <span className="text-semantic-success">✓</span>
              Tab panels are properly associated with triggers
            </li>
            <li className="flex gap-2">
              <span className="text-semantic-success">✓</span>
              Focus is visible on active tab
            </li>
          </ul>
        </div>
      </ComponentCard>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Use tabs for related content at the same level",
          "Keep tab labels short and descriptive",
          "Use pill style for primary navigation",
          "Use underline style for secondary/content tabs",
        ]}
        donts={[
          "Don't use more than 5-6 tabs",
          "Don't use tabs for unrelated content",
          "Don't nest tabs within tabs",
          "Don't use tabs for sequential workflows (use stepper)",
        ]}
      />

      <PageNavigation currentPath="/design-system/components/tabs" />
    </div>
  );
}
