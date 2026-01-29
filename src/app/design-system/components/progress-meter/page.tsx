"use client";

import React from "react";
import {
  ProgressMeterCircular,
  ProgressMeterLinear,
  ProgressMeterSteps,
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
import {
  ChatCircle,
  Handshake,
  PiggyBank,
  Folder,
  Trophy,
  Target,
} from "@phosphor-icons/react";

const circularProps = [
  {
    name: "goal",
    type: '"interviewing" | "networking" | "compensation" | "organization"',
    default: '"interviewing"',
    description: "The goal type determines colors and icon. Each type has a unique color scheme.",
  },
  {
    name: "size",
    type: '"sm" | "lg"',
    default: '"lg"',
    description: "Size of the circular progress (48px small, 96px large).",
  },
  {
    name: "value",
    type: "number",
    default: "25",
    description: "Progress value from 0 to 100.",
  },
  {
    name: "image",
    type: "string",
    default: "undefined",
    description: "Optional image URL to show as background instead of the icon.",
  },
  {
    name: "icon",
    type: "React.ReactNode",
    default: "undefined",
    description: "Custom icon to override the default icon for the goal type.",
  },
];

const linearProps = [
  {
    name: "goal",
    type: '"interviewing" | "networking" | "compensation" | "organization"',
    default: '"interviewing"',
    description: "The goal type determines the fill color.",
  },
  {
    name: "value",
    type: "number",
    default: "25",
    description: "Progress value from 0 to 100.",
  },
  {
    name: "showLabel",
    type: "boolean",
    default: "true",
    description: "Whether to show the percentage label.",
  },
  {
    name: "labelText",
    type: "string",
    default: '"Complete"',
    description: "Custom label text shown after the percentage.",
  },
];

const stepsProps = [
  {
    name: "goal",
    type: '"interviewing" | "networking" | "compensation" | "organization"',
    default: '"interviewing"',
    description: "The goal type determines the fill color of completed steps.",
  },
  {
    name: "totalSteps",
    type: "number",
    default: "4",
    description: "Total number of steps in the progress.",
  },
  {
    name: "currentStep",
    type: "number",
    default: "1",
    description: "Current step (1-indexed). Steps up to this number will be filled.",
  },
  {
    name: "showLabel",
    type: "boolean",
    default: "true",
    description: "Whether to show the percentage label.",
  },
  {
    name: "labelText",
    type: "string",
    default: '"Complete"',
    description: "Custom label text shown after the percentage.",
  },
];

const goalTypes = [
  {
    goal: "interviewing" as const,
    label: "Interviewing",
    description: "Track interview preparation and practice sessions.",
    color: "orange-500",
    icon: ChatCircle,
  },
  {
    goal: "networking" as const,
    label: "Networking",
    description: "Monitor networking goals and connections made.",
    color: "blue-500",
    icon: Handshake,
  },
  {
    goal: "compensation" as const,
    label: "Compensation",
    description: "Track salary research and negotiation prep.",
    color: "green-500",
    icon: PiggyBank,
  },
  {
    goal: "organization" as const,
    label: "Organization",
    description: "Monitor organizational tasks and applications.",
    color: "purple-500",
    icon: Folder,
  },
];

export default function ProgressMeterPage() {
  const [animatedValue, setAnimatedValue] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setAnimatedValue((prev) => (prev >= 100 ? 0 : prev + 5));
    }, 500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1
          id="overview"
          className="text-heading-lg text-foreground mb-2"
        >
          Progress Meter
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          Goal-oriented progress indicators in circular, linear, and step-based
          formats. Each variant supports different goal types (interviewing,
          networking, compensation, organization) with unique colors and icons.
        </p>
      </div>

      {/* When to use */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-background-success/10 rounded-lg border border-border-success">
          <h3 className="font-semibold text-foreground-success mb-2">
            When to use
          </h3>
          <ul className="text-sm space-y-1 text-foreground-muted">
            <li>Display goal completion progress in job search apps</li>
            <li>Show milestones in multi-step workflows</li>
            <li>Track career development activities</li>
            <li>Visualize achievement progress with contextual icons</li>
          </ul>
        </div>
        <div className="p-4 bg-background-error/10 rounded-lg border border-border-error">
          <h3 className="font-semibold text-foreground-error mb-2">
            When not to use
          </h3>
          <ul className="text-sm space-y-1 text-foreground-muted">
            <li>For general loading states (use Progress or Spinner)</li>
            <li>For file upload progress (use Progress component)</li>
            <li>When you need semantic color variants (success/error)</li>
            <li>For simple percentage displays without goal context</li>
          </ul>
        </div>
      </div>

      {/* Component Types Overview */}
      <ComponentCard
        id="overview-types"
        title="Three Types"
        description="Progress Meter comes in three formats for different use cases"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center gap-4 p-6 bg-background-subtle rounded-lg">
            <ProgressMeterCircular goal="networking" value={65} size="lg" />
            <div className="text-center">
              <p className="font-semibold text-foreground">Circular</p>
              <p className="text-caption text-foreground-muted">
                For prominent, visual goal tracking
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 p-6 bg-background-subtle rounded-lg">
            <div className="w-full">
              <ProgressMeterLinear goal="compensation" value={45} />
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground">Linear</p>
              <p className="text-caption text-foreground-muted">
                For inline progress bars with labels
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 p-6 bg-background-subtle rounded-lg">
            <div className="w-full">
              <ProgressMeterSteps goal="organization" totalSteps={5} currentStep={3} />
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground">Steps</p>
              <p className="text-caption text-foreground-muted">
                For discrete milestone tracking
              </p>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================
          CIRCULAR PROGRESS METER
          ============================================ */}
      <div className="pt-8 border-t border-border-muted">
        <h2 className="text-heading-sm text-foreground mb-6">
          Circular Progress Meter
        </h2>
      </div>

      {/* Circular Basic */}
      <ComponentCard
        id="circular-basic"
        title="Basic Circular"
        description="Circular progress with icon and ring indicator"
      >
        <CodePreview
          code={`import { ProgressMeterCircular } from "@/components/ui";

<ProgressMeterCircular goal="interviewing" value={75} />`}
        >
          <div className="flex items-center justify-center">
            <ProgressMeterCircular goal="interviewing" value={75} />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Circular Goal Types */}
      <ComponentCard
        id="circular-goals"
        title="Goal Types"
        description="Each goal type has a unique color and icon"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {goalTypes.map(({ goal, label, description, color, icon: Icon }) => (
            <div key={goal} className="flex flex-col items-center gap-3">
              <ProgressMeterCircular goal={goal} value={60} size="lg" />
              <div className="text-center">
                <p className="font-semibold text-foreground">{label}</p>
                <p className="text-caption text-foreground-muted">{color}</p>
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* Circular Sizes */}
      <ComponentCard
        id="circular-sizes"
        title="Sizes"
        description="Small (48px) and large (96px) sizes"
      >
        <CodePreview
          code={`<ProgressMeterCircular goal="networking" value={50} size="sm" />
<ProgressMeterCircular goal="networking" value={50} size="lg" />`}
        >
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <ProgressMeterCircular goal="networking" value={50} size="sm" />
              <span className="text-caption text-foreground-muted">Small (48px)</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <ProgressMeterCircular goal="networking" value={50} size="lg" />
              <span className="text-caption text-foreground-muted">Large (96px)</span>
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Circular with Custom Icon */}
      <ComponentCard
        id="circular-custom-icon"
        title="Custom Icon"
        description="Override the default icon for special cases"
      >
        <CodePreview
          code={`import { Trophy, Target } from "@phosphor-icons/react";

<ProgressMeterCircular
  goal="compensation"
  value={100}
  icon={<Trophy weight="fill" size={48} className="text-[var(--primitive-green-500)]" />}
/>`}
        >
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <ProgressMeterCircular
                goal="compensation"
                value={100}
                icon={
                  <Trophy
                    weight="fill"
                    size={48}
                    className="text-[var(--primitive-green-500)]"
                  />
                }
              />
              <span className="text-caption text-foreground-muted">Trophy icon</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <ProgressMeterCircular
                goal="interviewing"
                value={85}
                icon={
                  <Target
                    weight="fill"
                    size={48}
                    className="text-[var(--primitive-orange-500)]"
                  />
                }
              />
              <span className="text-caption text-foreground-muted">Target icon</span>
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Circular with Image */}
      <ComponentCard
        id="circular-image"
        title="With Image Background"
        description="Use an image instead of a solid background with icon"
      >
        <CodePreview
          code={`<ProgressMeterCircular
  goal="networking"
  value={75}
  image="https://i.pravatar.cc/96?img=1"
/>`}
        >
          <div className="flex items-center gap-8">
            <ProgressMeterCircular
              goal="networking"
              value={75}
              image="https://i.pravatar.cc/96?img=1"
            />
            <ProgressMeterCircular
              goal="compensation"
              value={45}
              image="https://i.pravatar.cc/96?img=5"
            />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Circular Animated */}
      <ComponentCard
        id="circular-animated"
        title="Animated Progress"
        description="Progress updates smoothly with CSS transitions"
      >
        <div className="flex items-center gap-8">
          <ProgressMeterCircular goal="organization" value={animatedValue} size="lg" />
          <div>
            <p className="text-body-strong text-foreground">{animatedValue}% Complete</p>
            <p className="text-caption text-foreground-muted">
              Watch the ring animate as progress updates
            </p>
          </div>
        </div>
      </ComponentCard>

      {/* Circular Props */}
      <ComponentCard id="circular-props" title="Circular Props">
        <PropsTable props={circularProps} />
      </ComponentCard>

      {/* ============================================
          LINEAR PROGRESS METER
          ============================================ */}
      <div className="pt-8 border-t border-border-muted">
        <h2 className="text-heading-sm text-foreground mb-6">
          Linear Progress Meter
        </h2>
      </div>

      {/* Linear Basic */}
      <ComponentCard
        id="linear-basic"
        title="Basic Linear"
        description="Simple progress bar with percentage label"
      >
        <CodePreview
          code={`import { ProgressMeterLinear } from "@/components/ui";

<ProgressMeterLinear goal="interviewing" value={60} />`}
        >
          <div className="max-w-md">
            <ProgressMeterLinear goal="interviewing" value={60} />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Linear Goal Types */}
      <ComponentCard
        id="linear-goals"
        title="Goal Types"
        description="Each goal type has a distinct fill color"
      >
        <div className="space-y-6 max-w-md">
          {goalTypes.map(({ goal, label }) => (
            <div key={goal}>
              <p className="text-caption-strong text-foreground-muted mb-2">
                {label}
              </p>
              <ProgressMeterLinear goal={goal} value={65} />
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* Linear Custom Label */}
      <ComponentCard
        id="linear-labels"
        title="Custom Labels"
        description="Customize the label text or hide it entirely"
      >
        <CodePreview
          code={`<ProgressMeterLinear goal="networking" value={80} labelText="Connections made" />
<ProgressMeterLinear goal="compensation" value={45} labelText="of salary research" />
<ProgressMeterLinear goal="organization" value={30} showLabel={false} />`}
        >
          <div className="space-y-6 max-w-md">
            <div>
              <p className="text-caption text-foreground-muted mb-1">Custom label text</p>
              <ProgressMeterLinear goal="networking" value={80} labelText="Connections made" />
            </div>
            <div>
              <p className="text-caption text-foreground-muted mb-1">Alternative label</p>
              <ProgressMeterLinear goal="compensation" value={45} labelText="of salary research" />
            </div>
            <div>
              <p className="text-caption text-foreground-muted mb-1">No label</p>
              <ProgressMeterLinear goal="organization" value={30} showLabel={false} />
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Linear Props */}
      <ComponentCard id="linear-props" title="Linear Props">
        <PropsTable props={linearProps} />
      </ComponentCard>

      {/* ============================================
          STEPS PROGRESS METER
          ============================================ */}
      <div className="pt-8 border-t border-border-muted">
        <h2 className="text-heading-sm text-foreground mb-6">
          Steps Progress Meter
        </h2>
      </div>

      {/* Steps Basic */}
      <ComponentCard
        id="steps-basic"
        title="Basic Steps"
        description="Discrete step-based progress indicator"
      >
        <CodePreview
          code={`import { ProgressMeterSteps } from "@/components/ui";

<ProgressMeterSteps goal="interviewing" totalSteps={5} currentStep={3} />`}
        >
          <div className="max-w-md">
            <ProgressMeterSteps goal="interviewing" totalSteps={5} currentStep={3} />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Steps Goal Types */}
      <ComponentCard
        id="steps-goals"
        title="Goal Types"
        description="Each goal type colors the completed steps differently"
      >
        <div className="space-y-6 max-w-md">
          {goalTypes.map(({ goal, label }) => (
            <div key={goal}>
              <p className="text-caption-strong text-foreground-muted mb-2">
                {label}
              </p>
              <ProgressMeterSteps goal={goal} totalSteps={4} currentStep={2} />
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* Steps Different Counts */}
      <ComponentCard
        id="steps-counts"
        title="Different Step Counts"
        description="Works with any number of steps"
      >
        <CodePreview
          code={`<ProgressMeterSteps goal="networking" totalSteps={3} currentStep={1} />
<ProgressMeterSteps goal="networking" totalSteps={5} currentStep={3} />
<ProgressMeterSteps goal="networking" totalSteps={8} currentStep={6} />`}
        >
          <div className="space-y-6 max-w-md">
            <div>
              <p className="text-caption text-foreground-muted mb-1">3 steps</p>
              <ProgressMeterSteps goal="networking" totalSteps={3} currentStep={1} />
            </div>
            <div>
              <p className="text-caption text-foreground-muted mb-1">5 steps</p>
              <ProgressMeterSteps goal="networking" totalSteps={5} currentStep={3} />
            </div>
            <div>
              <p className="text-caption text-foreground-muted mb-1">8 steps</p>
              <ProgressMeterSteps goal="networking" totalSteps={8} currentStep={6} />
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Steps All States */}
      <ComponentCard
        id="steps-states"
        title="Progress States"
        description="From not started to complete"
      >
        <div className="space-y-4 max-w-md">
          <div>
            <p className="text-caption text-foreground-muted mb-1">Not started</p>
            <ProgressMeterSteps goal="compensation" totalSteps={4} currentStep={0} />
          </div>
          <div>
            <p className="text-caption text-foreground-muted mb-1">In progress (25%)</p>
            <ProgressMeterSteps goal="compensation" totalSteps={4} currentStep={1} />
          </div>
          <div>
            <p className="text-caption text-foreground-muted mb-1">Halfway (50%)</p>
            <ProgressMeterSteps goal="compensation" totalSteps={4} currentStep={2} />
          </div>
          <div>
            <p className="text-caption text-foreground-muted mb-1">Almost done (75%)</p>
            <ProgressMeterSteps goal="compensation" totalSteps={4} currentStep={3} />
          </div>
          <div>
            <p className="text-caption text-foreground-muted mb-1">Complete (100%)</p>
            <ProgressMeterSteps goal="compensation" totalSteps={4} currentStep={4} />
          </div>
        </div>
      </ComponentCard>

      {/* Steps Props */}
      <ComponentCard id="steps-props" title="Steps Props">
        <PropsTable props={stepsProps} />
      </ComponentCard>

      {/* ============================================
          REAL WORLD EXAMPLES
          ============================================ */}
      <div className="pt-8 border-t border-border-muted">
        <h2 className="text-heading-sm text-foreground mb-6">
          Real-World Examples
        </h2>
      </div>

      {/* Goal Dashboard */}
      <RealWorldExample
        title="Goal Dashboard"
        description="Career goal tracking dashboard with multiple progress meters"
      >
        <div className="bg-surface rounded-xl p-6 space-y-6">
          <h3 className="text-body-strong text-foreground">Weekly Goals</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center gap-3 p-4 bg-background-subtle rounded-lg">
              <ProgressMeterCircular goal="interviewing" value={80} size="sm" />
              <div className="text-center">
                <p className="text-caption-strong text-foreground">Interview Prep</p>
                <p className="text-caption text-foreground-muted">4 of 5 sessions</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 p-4 bg-background-subtle rounded-lg">
              <ProgressMeterCircular goal="networking" value={60} size="sm" />
              <div className="text-center">
                <p className="text-caption-strong text-foreground">Networking</p>
                <p className="text-caption text-foreground-muted">3 of 5 events</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 p-4 bg-background-subtle rounded-lg">
              <ProgressMeterCircular goal="compensation" value={100} size="sm" />
              <div className="text-center">
                <p className="text-caption-strong text-foreground">Salary Research</p>
                <p className="text-caption text-foreground-muted">Complete!</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 p-4 bg-background-subtle rounded-lg">
              <ProgressMeterCircular goal="organization" value={40} size="sm" />
              <div className="text-center">
                <p className="text-caption-strong text-foreground">Applications</p>
                <p className="text-caption text-foreground-muted">8 of 20</p>
              </div>
            </div>
          </div>
        </div>
      </RealWorldExample>

      {/* Job Application Progress */}
      <RealWorldExample
        title="Application Progress Card"
        description="Tracking progress through the application process"
      >
        <div className="bg-surface rounded-xl p-6 max-w-md space-y-4">
          <div className="flex items-center gap-4">
            <ProgressMeterCircular goal="organization" value={60} size="sm" />
            <div>
              <h3 className="text-body-strong text-foreground">Senior Developer at Eco Tech</h3>
              <p className="text-caption text-foreground-muted">Application in progress</p>
            </div>
          </div>
          <ProgressMeterSteps
            goal="organization"
            totalSteps={5}
            currentStep={3}
            labelText="of application complete"
          />
          <div className="flex justify-between text-caption text-foreground-muted">
            <span>Applied</span>
            <span>Screen</span>
            <span>Interview</span>
            <span>Offer</span>
            <span>Hired</span>
          </div>
        </div>
      </RealWorldExample>

      {/* Skills Progress */}
      <RealWorldExample
        title="Skills Progress"
        description="Track skill development in different areas"
      >
        <div className="bg-surface rounded-xl p-6 max-w-lg space-y-4">
          <h3 className="text-body-strong text-foreground mb-4">Skill Development</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-body-sm text-foreground">Technical Interview Skills</span>
                <span className="text-caption text-foreground-muted">Advanced</span>
              </div>
              <ProgressMeterLinear goal="interviewing" value={85} showLabel={false} />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-body-sm text-foreground">Industry Networking</span>
                <span className="text-caption text-foreground-muted">Intermediate</span>
              </div>
              <ProgressMeterLinear goal="networking" value={55} showLabel={false} />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-body-sm text-foreground">Salary Negotiation</span>
                <span className="text-caption text-foreground-muted">Beginner</span>
              </div>
              <ProgressMeterLinear goal="compensation" value={25} showLabel={false} />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-body-sm text-foreground">Application Materials</span>
                <span className="text-caption text-foreground-muted">Expert</span>
              </div>
              <ProgressMeterLinear goal="organization" value={95} showLabel={false} />
            </div>
          </div>
        </div>
      </RealWorldExample>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Use circular meters for prominent goal displays",
          "Use linear meters for inline progress in lists or cards",
          "Use step meters when showing discrete milestones",
          "Match goal type to the context (interviewing for interviews, etc.)",
          "Include labels to provide context for the progress value",
        ]}
        donts={[
          "Don't use for general loading states (use Spinner or Progress)",
          "Don't mix goal types inconsistently in the same context",
          "Don't use step meters for continuous progress (use linear instead)",
          "Don't hide labels when the context isn't clear from surrounding UI",
          "Don't use images that obscure the progress ring in circular meters",
        ]}
      />

      {/* Accessibility */}
      <AccessibilityInfo
        items={[
          "All meters use role=\"progressbar\" for screen readers",
          "aria-valuenow, aria-valuemin, and aria-valuemax are properly set",
          "Steps meter includes aria-valuetext for step context (\"Step X of Y\")",
          "Progress transitions are smooth and respect prefers-reduced-motion",
          "Icons are decorative and marked with aria-hidden=\"true\"",
          "Color is not the only indicator - values are always available",
        ]}
      />

      {/* Related Components */}
      <RelatedComponents
        components={[
          {
            name: "Progress",
            href: "/design-system/components/progress",
            description: "General purpose progress bars with semantic variants",
          },
          {
            name: "Spinner",
            href: "/design-system/components/spinner",
            description: "Loading indicators for indeterminate states",
          },
          {
            name: "StageBadge",
            href: "/design-system/components/stage-badge",
            description: "Pipeline stage indicators for ATS workflows",
          },
        ]}
      />

      <PageNavigation currentPath="/design-system/components/progress-meter" />
    </div>
  );
}
