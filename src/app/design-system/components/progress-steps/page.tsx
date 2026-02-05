"use client";

import React from "react";
import { ProgressStep, ProgressStepsBar } from "@/components/ui";
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
import { Label } from "@/components/ui/label";

const progressStepProps = [
  {
    name: "step",
    type: '"saved" | "applied" | "interviewing" | "offers" | "hired"',
    required: true,
    description: "The step type determines colors and label.",
  },
  {
    name: "count",
    type: "number",
    default: "undefined",
    description: 'Count to display when active. Shows "-" when inactive/undefined.',
  },
  {
    name: "active",
    type: "boolean",
    default: "false",
    description: "Whether the step is active (has data). Active steps show color and count.",
  },
  {
    name: "position",
    type: '"start" | "middle" | "end"',
    default: '"middle"',
    description: "Position in the bar determines the SVG shape (arrow direction).",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Additional CSS classes.",
  },
];

const progressStepsBarProps = [
  {
    name: "data",
    type: "{ saved?: number; applied?: number; interviewing?: number; offers?: number; hired?: boolean; }",
    required: true,
    description:
      "Object containing counts for each step. Steps with values > 0 are shown as active.",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Additional CSS classes for the container.",
  },
];

const stepTypes = [
  {
    step: "saved" as const,
    label: "Saved",
    description: "Jobs the user has bookmarked for later.",
    color: "Blue",
    bgToken: "--primitive-blue-200",
    textToken: "--primitive-blue-600",
  },
  {
    step: "applied" as const,
    label: "Applied",
    description: "Jobs where the user has submitted an application.",
    color: "Purple",
    bgToken: "--primitive-purple-200",
    textToken: "--primitive-purple-600",
  },
  {
    step: "interviewing" as const,
    label: "Interviewing",
    description: "Jobs where the user is in the interview process.",
    color: "Orange",
    bgToken: "--primitive-orange-200",
    textToken: "--primitive-orange-600",
  },
  {
    step: "offers" as const,
    label: "Offers",
    description: "Jobs where the user has received an offer.",
    color: "Green",
    bgToken: "--primitive-green-200",
    textToken: "--primitive-green-600",
  },
  {
    step: "hired" as const,
    label: "Hired",
    description: "Jobs where the user has been hired. Shows confetti icon.",
    color: "Rainbow Gradient",
    bgToken: "Rainbow gradient",
    textToken: "--primitive-neutral-900",
  },
];

export default function ProgressStepsPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="mb-2 text-heading-lg text-foreground">
          Progress Steps
        </h1>
        <p className="max-w-2xl text-body text-foreground-muted">
          A visual pipeline component for job seeker dashboards. Shows the stages of the job
          application journey: Saved, Applied, Interviewing, Offers, and Hired. Each step uses a
          chevron/arrow shape and displays a count when active.
        </p>
      </div>

      {/* When to use */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="bg-background-success/10 rounded-lg border border-border-success p-4">
          <h3 className="mb-2 font-semibold text-foreground-success">When to use</h3>
          <ul className="space-y-1 text-sm text-foreground-muted">
            <li>Job seeker dashboards to show pipeline overview</li>
            <li>Displaying application funnel metrics</li>
            <li>Visualizing the job search journey progress</li>
            <li>Summary statistics in onboarding flows</li>
          </ul>
        </div>
        <div className="bg-background-error/10 rounded-lg border border-border-error p-4">
          <h3 className="mb-2 font-semibold text-foreground-error">When not to use</h3>
          <ul className="space-y-1 text-sm text-foreground-muted">
            <li>For general step/wizard navigation (use Stepper)</li>
            <li>For ATS pipeline stages (use StageBadge or StageProgress)</li>
            <li>For progress percentages (use ProgressMeter)</li>
            <li>For compact inline status (use Badge)</li>
          </ul>
        </div>
      </div>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="The ProgressStepsBar component takes a data object with counts for each stage"
      >
        <CodePreview
          code={`import { ProgressStepsBar } from "@/components/ui";

<ProgressStepsBar
  data={{
    saved: 24,
    applied: 12,
    interviewing: 6,
    offers: 3,
    hired: true,
  }}
/>`}
        >
          <div className="overflow-x-auto">
            <ProgressStepsBar
              data={{
                saved: 24,
                applied: 12,
                interviewing: 6,
                offers: 3,
                hired: true,
              }}
            />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* All Inactive */}
      <ComponentCard
        id="inactive-state"
        title="Inactive State"
        description="When no data is provided, all steps appear in their inactive gray state"
      >
        <CodePreview
          code={`<ProgressStepsBar
  data={{}}
/>`}
        >
          <div className="overflow-x-auto">
            <ProgressStepsBar data={{}} />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Partial Progress */}
      <ComponentCard
        id="partial-progress"
        title="Partial Progress"
        description="Only steps with data show as active. This example shows early-stage job search."
      >
        <CodePreview
          code={`<ProgressStepsBar
  data={{
    saved: 15,
    applied: 5,
  }}
/>`}
        >
          <div className="overflow-x-auto">
            <ProgressStepsBar
              data={{
                saved: 15,
                applied: 5,
              }}
            />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Step Types */}
      <ComponentCard
        id="step-types"
        title="Step Types"
        description="Each step has a unique color scheme when active"
      >
        <div className="space-y-8">
          {stepTypes.map(({ step, label, description, color, bgToken, textToken }) => (
            <div key={step} className="flex items-center gap-6">
              <div className="flex-shrink-0">
                <ProgressStep
                  step={step}
                  active
                  count={step === "hired" ? undefined : 10}
                  position={step === "saved" ? "start" : step === "hired" ? "end" : "middle"}
                />
              </div>
              <div>
                <p className="font-semibold text-foreground">{label}</p>
                <p className="text-caption text-foreground-muted">{description}</p>
                <p className="mt-1 text-caption text-foreground-subtle">
                  {color} • Background: {bgToken} • Text: {textToken}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* Active vs Inactive */}
      <ComponentCard
        id="states"
        title="Active vs Inactive States"
        description="Side-by-side comparison of active and inactive states for each step"
      >
        <div className="grid grid-cols-2 gap-8">
          <div>
            <Label className="mb-4 block">Inactive</Label>
            <div className="space-y-4">
              {stepTypes.map(({ step }) => (
                <ProgressStep
                  key={step}
                  step={step}
                  active={false}
                  position={step === "saved" ? "start" : step === "hired" ? "end" : "middle"}
                />
              ))}
            </div>
          </div>
          <div>
            <Label className="mb-4 block">Active</Label>
            <div className="space-y-4">
              {stepTypes.map(({ step }) => (
                <ProgressStep
                  key={step}
                  step={step}
                  active
                  count={step === "hired" ? undefined : 10}
                  position={step === "saved" ? "start" : step === "hired" ? "end" : "middle"}
                />
              ))}
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Anatomy */}
      <ComponentCard
        id="anatomy"
        title="Anatomy"
        description="The component is made up of these parts"
      >
        <ComponentAnatomy
          parts={[
            {
              name: "Container",
              description: "Flex container that holds all steps with negative margin overlap",
            },
            {
              name: "SVG Shape",
              description: "Chevron/arrow shape that varies based on position (start, middle, end)",
            },
            {
              name: "Count Display",
              description: "Large number (48px) showing the count, or dash when inactive",
            },
            {
              name: "Label",
              description: "Step name displayed below the count (bold, 18px)",
            },
            {
              name: "Confetti Icon",
              description: "Phosphor confetti icon shown instead of count for the Hired step",
            },
          ]}
        />
      </ComponentCard>

      {/* Individual Step */}
      <ComponentCard
        id="individual-step"
        title="Individual ProgressStep"
        description="You can use ProgressStep directly for custom layouts"
      >
        <CodePreview
          code={`import { ProgressStep } from "@/components/ui";

// Start position (flat left, arrow right)
<ProgressStep step="saved" active count={24} position="start" />

// Middle position (arrow both sides)
<ProgressStep step="applied" active count={12} position="middle" />

// End position (arrow left, flat right)
<ProgressStep step="hired" active position="end" />`}
        >
          <div className="flex flex-col gap-4">
            <div>
              <Label className="mb-2 block">Start Position</Label>
              <ProgressStep step="saved" active count={24} position="start" />
            </div>
            <div>
              <Label className="mb-2 block">Middle Position</Label>
              <ProgressStep step="applied" active count={12} position="middle" />
            </div>
            <div>
              <Label className="mb-2 block">End Position</Label>
              <ProgressStep step="hired" active position="end" />
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ProgressStep Props */}
      <ComponentCard id="progress-step-props" title="ProgressStep Props">
        <PropsTable props={progressStepProps} />
      </ComponentCard>

      {/* ProgressStepsBar Props */}
      <ComponentCard id="progress-steps-bar-props" title="ProgressStepsBar Props">
        <PropsTable props={progressStepsBarProps} />
      </ComponentCard>

      {/* Real World Examples */}
      <div className="border-t border-border-muted pt-8">
        <h2 className="mb-6 text-heading-sm text-foreground">Real-World Examples</h2>
      </div>

      <RealWorldExample
        title="Job Seeker Dashboard Header"
        description="Progress steps as a visual summary at the top of a job seeker dashboard"
      >
        <div className="space-y-6 rounded-xl bg-surface p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-heading-sm text-foreground">Your Job Search</h3>
              <p className="text-body-sm text-foreground-muted">
                Track your progress across all applications
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <ProgressStepsBar
              data={{
                saved: 24,
                applied: 12,
                interviewing: 6,
                offers: 3,
                hired: true,
              }}
            />
          </div>
        </div>
      </RealWorldExample>

      <RealWorldExample
        title="Early Stage Job Search"
        description="A job seeker who just started their search"
      >
        <div className="space-y-6 rounded-xl bg-surface p-6">
          <div>
            <h3 className="text-heading-sm text-foreground">Getting Started</h3>
            <p className="text-body-sm text-foreground-muted">
              You&apos;ve saved some jobs - now start applying!
            </p>
          </div>
          <div className="overflow-x-auto">
            <ProgressStepsBar
              data={{
                saved: 8,
              }}
            />
          </div>
        </div>
      </RealWorldExample>

      <RealWorldExample
        title="Active Interview Stage"
        description="A job seeker actively interviewing at multiple companies"
      >
        <div className="space-y-6 rounded-xl bg-surface p-6">
          <div>
            <h3 className="text-heading-sm text-foreground">Interview Season</h3>
            <p className="text-body-sm text-foreground-muted">
              You&apos;re making great progress with 6 active interviews!
            </p>
          </div>
          <div className="overflow-x-auto">
            <ProgressStepsBar
              data={{
                saved: 45,
                applied: 20,
                interviewing: 6,
                offers: 1,
              }}
            />
          </div>
        </div>
      </RealWorldExample>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Use as a dashboard summary for job search progress",
          "Show all 5 steps to maintain visual consistency",
          "Use counts to show meaningful data (not percentages)",
          "Place prominently at the top of dashboards",
          "Ensure the component has enough horizontal space to display fully",
        ]}
        donts={[
          "Don't use for step-by-step wizards or forms",
          "Don't use for ATS recruiter views (use StageProgress instead)",
          "Don't truncate or hide steps on smaller screens - use horizontal scroll",
          "Don't show decimals or percentages in the count",
          "Don't use negative numbers or values over 99 (design shows 2-digit max)",
        ]}
      />

      {/* Accessibility */}
      <AccessibilityInfo
        items={[
          "Each step includes the step name as text content for screen readers",
          'Inactive steps show "-" which is announced as "dash" or interpreted as empty',
          "The Hired step uses a decorative confetti icon with aria-hidden",
          "Color is not the only indicator - each step has a text label",
          'Recommend adding aria-label to the container with summary like "Job search progress: 24 saved, 12 applied..."',
          "SVG shapes are decorative and marked appropriately",
        ]}
      />

      {/* Related Components */}
      <RelatedComponents
        components={[
          {
            name: "ProgressMeter",
            href: "/design-system/components/progress-meter",
            description: "Goal-oriented progress indicators for career development",
          },
          {
            name: "StageBadge",
            href: "/design-system/components/stage-badge",
            description: "Pipeline stage indicators for ATS workflows",
          },
          {
            name: "Progress",
            href: "/design-system/components/progress",
            description: "General purpose progress bars",
          },
          {
            name: "StatCard",
            href: "/design-system/components/stat-card",
            description: "Numeric statistics display cards",
          },
        ]}
      />

      <PageNavigation currentPath="/design-system/components/progress-steps" />
    </div>
  );
}
