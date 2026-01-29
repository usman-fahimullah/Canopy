"use client";

import React from "react";
import {
  CoachTip,
  CoachTipTrigger,
  CoachTipContent,
  SimpleCoachTip,
  Button,
  Badge,
} from "@/components/ui";
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
  Lightbulb,
  Sparkle,
  ArrowRight,
  ArrowLeft,
  X,
  Plus,
  MagnifyingGlass,
  FunnelSimple,
} from "@phosphor-icons/react";

// ============================================
// PROPS DOCUMENTATION
// ============================================
const simpleCoachTipProps = [
  {
    name: "children",
    type: "ReactNode",
    required: true,
    description: "The trigger element that the coach tip anchors to",
  },
  {
    name: "title",
    type: "string",
    description: "Title text displayed in the header (not shown for single-no-title type)",
  },
  {
    name: "content",
    type: "ReactNode",
    required: true,
    description: "Main content/description of the coach tip",
  },
  {
    name: "type",
    type: '"paginated" | "single" | "single-no-title"',
    default: '"single"',
    description: "Type of coach tip - determines the layout and available features",
  },
  {
    name: "caret",
    type: '"top" | "bottom" | "left" | "right"',
    default: '"top"',
    description: "Position of the caret/arrow pointing to the trigger",
  },
  {
    name: "open",
    type: "boolean",
    description: "Controlled open state",
  },
  {
    name: "defaultOpen",
    type: "boolean",
    default: "false",
    description: "Default open state for uncontrolled usage",
  },
  {
    name: "onOpenChange",
    type: "(open: boolean) => void",
    description: "Callback when open state changes",
  },
  {
    name: "currentStep",
    type: "number",
    description: "Current step number (for paginated type)",
  },
  {
    name: "totalSteps",
    type: "number",
    description: "Total number of steps (for paginated type)",
  },
  {
    name: "primaryLabel",
    type: "string",
    default: '"Next"',
    description: "Label for the primary action button (paginated only)",
  },
  {
    name: "secondaryLabel",
    type: "string",
    default: '"Back"',
    description: "Label for the secondary action button (paginated only)",
  },
  {
    name: "onPrimaryClick",
    type: "() => void",
    description: "Callback for primary action button click",
  },
  {
    name: "onSecondaryClick",
    type: "() => void",
    description: "Callback for secondary action button click",
  },
];

const coachTipContentProps = [
  {
    name: "type",
    type: '"paginated" | "single" | "single-no-title"',
    default: '"single"',
    description: "Type of coach tip layout",
  },
  {
    name: "title",
    type: "string",
    description: "Title text (not shown for single-no-title)",
  },
  {
    name: "children",
    type: "ReactNode",
    required: true,
    description: "Main content of the coach tip",
  },
  {
    name: "caret",
    type: '"top" | "bottom" | "left" | "right"',
    default: '"top"',
    description: "Position of the caret arrow",
  },
  {
    name: "showClose",
    type: "boolean",
    default: "true",
    description: "Whether to show the close button",
  },
  {
    name: "currentStep",
    type: "number",
    description: "Current step (paginated only)",
  },
  {
    name: "totalSteps",
    type: "number",
    description: "Total steps (paginated only)",
  },
  {
    name: "primaryLabel",
    type: "string",
    default: '"Next"',
    description: "Primary button text",
  },
  {
    name: "secondaryLabel",
    type: "string",
    default: '"Back"',
    description: "Secondary button text",
  },
  {
    name: "onPrimaryClick",
    type: "() => void",
    description: "Primary button click handler",
  },
  {
    name: "onSecondaryClick",
    type: "() => void",
    description: "Secondary button click handler",
  },
];

export default function CoachTipPage() {
  const [step, setStep] = React.useState(1);
  const [singleOpen, setSingleOpen] = React.useState(false);
  const [paginatedOpen, setPaginatedOpen] = React.useState(false);

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
          Coach Tip
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl mb-4">
          An interactive tooltip for onboarding, feature tours, and contextual guidance.
          Unlike simple tooltips, Coach Tips are persistent, can contain rich content,
          and support multi-step tours with pagination.
        </p>

        {/* Component Metadata */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge variant="secondary">Overlay</Badge>
          <Badge variant="secondary">Radix UI</Badge>
          <Badge variant="secondary">Onboarding</Badge>
          <Badge variant="secondary">Accessible</Badge>
        </div>

        {/* When to Use / When Not to Use */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-[var(--background-success)] rounded-lg border border-[var(--border-success)]">
            <h3 className="font-semibold text-[var(--foreground-success)] mb-2">
              When to use
            </h3>
            <ul className="text-sm space-y-1 text-foreground-muted">
              <li>• Onboarding new users to features</li>
              <li>• Multi-step feature tours</li>
              <li>• Highlighting new or updated functionality</li>
              <li>• Contextual tips that require user acknowledgment</li>
            </ul>
          </div>
          <div className="p-4 bg-[var(--background-error)] rounded-lg border border-[var(--border-error)]">
            <h3 className="font-semibold text-[var(--foreground-error)] mb-2">
              When not to use
            </h3>
            <ul className="text-sm space-y-1 text-foreground-muted">
              <li>• Simple hover hints (use Tooltip instead)</li>
              <li>• Blocking critical user actions</li>
              <li>• Showing too many tips at once</li>
              <li>• Content that can be discovered naturally</li>
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
        description="Coach Tips are composed of these parts"
      >
        <ComponentAnatomy
          parts={[
            {
              name: "CoachTip",
              description: "Root component that manages open state",
              required: true,
            },
            {
              name: "CoachTipTrigger",
              description: "Element that the coach tip anchors to",
              required: true,
            },
            {
              name: "CoachTipAnchor",
              description: "Alternative to trigger for positioning without click interaction",
            },
            {
              name: "CoachTipContent",
              description: "The popup content with caret, close button, and optional pagination",
              required: true,
            },
            {
              name: "SimpleCoachTip",
              description: "Convenience wrapper combining all parts",
            },
          ]}
        />
      </ComponentCard>

      {/* ============================================
          SECTION 3: TYPES
          ============================================ */}
      <ComponentCard
        id="types"
        title="Types"
        description="Three types of coach tips for different use cases"
      >
        <div className="space-y-8">
          {/* Paginated */}
          <div className="space-y-3">
            <h4 className="text-body-strong">Paginated</h4>
            <p className="text-caption text-foreground-muted">
              Full coach tip with title, content, pagination indicator, and navigation buttons.
              Best for multi-step tours.
            </p>
            <div className="flex items-center gap-4 py-4">
              <SimpleCoachTip
                type="paginated"
                title="Welcome to Canopy!"
                content="Let's take a quick tour of the dashboard features."
                caret="bottom"
                currentStep={step}
                totalSteps={3}
                open={paginatedOpen}
                onOpenChange={setPaginatedOpen}
                onPrimaryClick={() => setStep(Math.min(3, step + 1))}
                onSecondaryClick={() => setStep(Math.max(1, step - 1))}
              >
                <Button onClick={() => setPaginatedOpen(true)}>
                  <Sparkle size={16} className="mr-2" />
                  Start Tour
                </Button>
              </SimpleCoachTip>
            </div>
          </div>

          {/* Single */}
          <div className="space-y-3">
            <h4 className="text-body-strong">Single</h4>
            <p className="text-caption text-foreground-muted">
              Title, content, and close button. Good for one-time tips or feature announcements.
            </p>
            <div className="flex items-center gap-4 py-4">
              <SimpleCoachTip
                type="single"
                title="New Feature"
                content="You can now filter candidates by skills and certifications."
                caret="bottom"
                open={singleOpen}
                onOpenChange={setSingleOpen}
              >
                <Button variant="secondary" onClick={() => setSingleOpen(true)}>
                  <Lightbulb size={16} className="mr-2" />
                  Show Tip
                </Button>
              </SimpleCoachTip>
            </div>
          </div>

          {/* Single No Title */}
          <div className="space-y-3">
            <h4 className="text-body-strong">Single No Title</h4>
            <p className="text-caption text-foreground-muted">
              Content and close button only. Most minimal variant, similar to an enhanced tooltip.
            </p>
            <div className="flex items-center gap-4 py-4">
              <CoachTip>
                <CoachTipTrigger asChild>
                  <Button variant="tertiary">
                    Quick Tip
                  </Button>
                </CoachTipTrigger>
                <CoachTipContent type="single-no-title" caret="bottom">
                  Click here to add a new job posting.
                </CoachTipContent>
              </CoachTip>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================
          SECTION 4: CARET POSITIONS
          ============================================ */}
      <ComponentCard
        id="positions"
        title="Caret Positions"
        description="The caret can point in any direction"
      >
        <div className="flex flex-wrap items-center justify-center gap-8 py-8">
          <CoachTip defaultOpen>
            <CoachTipTrigger asChild>
              <Button variant="secondary">Top</Button>
            </CoachTipTrigger>
            <CoachTipContent type="single-no-title" caret="top">
              Caret points up
            </CoachTipContent>
          </CoachTip>

          <CoachTip defaultOpen>
            <CoachTipTrigger asChild>
              <Button variant="secondary">Bottom</Button>
            </CoachTipTrigger>
            <CoachTipContent type="single-no-title" caret="bottom">
              Caret points down
            </CoachTipContent>
          </CoachTip>

          <CoachTip defaultOpen>
            <CoachTipTrigger asChild>
              <Button variant="secondary">Left</Button>
            </CoachTipTrigger>
            <CoachTipContent type="single-no-title" caret="left">
              Caret points left
            </CoachTipContent>
          </CoachTip>

          <CoachTip defaultOpen>
            <CoachTipTrigger asChild>
              <Button variant="secondary">Right</Button>
            </CoachTipTrigger>
            <CoachTipContent type="single-no-title" caret="right">
              Caret points right
            </CoachTipContent>
          </CoachTip>
        </div>
      </ComponentCard>

      {/* ============================================
          SECTION 5: BASIC USAGE
          ============================================ */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Using the SimpleCoachTip wrapper"
      >
        <CodePreview
          code={`import { SimpleCoachTip, Button } from "@/components/ui";

<SimpleCoachTip
  type="single"
  title="Welcome!"
  content="This is a helpful tip for new users."
  caret="bottom"
>
  <Button>Show Tip</Button>
</SimpleCoachTip>`}
        >
          <CoachTip>
            <CoachTipTrigger asChild>
              <Button>Show Tip</Button>
            </CoachTipTrigger>
            <CoachTipContent
              type="single"
              title="Welcome!"
              caret="bottom"
            >
              This is a helpful tip for new users.
            </CoachTipContent>
          </CoachTip>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SECTION 6: CONTROLLED USAGE
          ============================================ */}
      <ComponentCard
        id="controlled"
        title="Controlled Usage"
        description="Managing open state externally for tours"
      >
        <CodePreview
          code={`const [open, setOpen] = React.useState(false);
const [step, setStep] = React.useState(1);

<SimpleCoachTip
  type="paginated"
  title={\`Step \${step}: Feature Overview\`}
  content="Learn about this feature..."
  caret="bottom"
  open={open}
  onOpenChange={setOpen}
  currentStep={step}
  totalSteps={3}
  onPrimaryClick={() => {
    if (step < 3) setStep(step + 1);
    else setOpen(false);
  }}
  onSecondaryClick={() => setStep(Math.max(1, step - 1))}
>
  <Button onClick={() => { setOpen(true); setStep(1); }}>
    Start Tour
  </Button>
</SimpleCoachTip>`}
        >
          <SimpleCoachTip
            type="paginated"
            title={`Step ${step}: Feature Overview`}
            content="Learn about this amazing feature that will help you work more efficiently."
            caret="bottom"
            open={paginatedOpen}
            onOpenChange={setPaginatedOpen}
            currentStep={step}
            totalSteps={3}
            onPrimaryClick={() => {
              if (step < 3) setStep(step + 1);
              else setPaginatedOpen(false);
            }}
            onSecondaryClick={() => setStep(Math.max(1, step - 1))}
          >
            <Button onClick={() => { setPaginatedOpen(true); setStep(1); }}>
              Start Controlled Tour
            </Button>
          </SimpleCoachTip>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SECTION 7: PRIMITIVE COMPONENTS
          ============================================ */}
      <ComponentCard
        id="primitives"
        title="Primitive Components"
        description="Using individual components for more control"
      >
        <CodePreview
          code={`import {
  CoachTip,
  CoachTipTrigger,
  CoachTipContent,
} from "@/components/ui";

<CoachTip>
  <CoachTipTrigger asChild>
    <Button>Trigger</Button>
  </CoachTipTrigger>
  <CoachTipContent
    type="single"
    title="Custom Coach Tip"
    caret="right"
  >
    Full control over the coach tip behavior.
  </CoachTipContent>
</CoachTip>`}
        >
          <CoachTip>
            <CoachTipTrigger asChild>
              <Button variant="tertiary">Click for Tip</Button>
            </CoachTipTrigger>
            <CoachTipContent
              type="single"
              title="Custom Coach Tip"
              caret="right"
            >
              Full control over the coach tip behavior.
            </CoachTipContent>
          </CoachTip>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SECTION 8: PROPS TABLES
          ============================================ */}
      <ComponentCard id="props-simple" title="SimpleCoachTip Props">
        <PropsTable props={simpleCoachTipProps} />
      </ComponentCard>

      <ComponentCard id="props-content" title="CoachTipContent Props">
        <PropsTable props={coachTipContentProps} />
      </ComponentCard>

      {/* ============================================
          SECTION 9: USAGE GUIDELINES
          ============================================ */}
      <UsageGuide
        dos={[
          "Use for onboarding new users to key features",
          "Keep coach tip content concise and actionable",
          "Allow users to dismiss tips and not see them again",
          "Use paginated tips for related features in sequence",
          "Position tips so they don't obstruct the feature being explained",
        ]}
        donts={[
          "Don't use for simple hints (use Tooltip instead)",
          "Don't show multiple coach tips simultaneously",
          "Don't use for critical information users must see",
          "Don't block user progress with mandatory tips",
          "Don't overwhelm users with too many tips at once",
        ]}
      />

      {/* ============================================
          SECTION 10: ACCESSIBILITY
          ============================================ */}
      <AccessibilityInfo
        items={[
          "**Focus management**: Focus is trapped within the coach tip when open",
          "**Keyboard**: Press Escape to dismiss, Tab to navigate between buttons",
          "**Screen readers**: Content is announced when the coach tip opens",
          "**ARIA**: Uses appropriate dialog and button roles",
          "**Touch devices**: Works well on mobile with tap to open/close",
        ]}
      />

      {/* ============================================
          SECTION 11: RELATED COMPONENTS
          ============================================ */}
      <RelatedComponents
        components={[
          {
            name: "Tooltip",
            href: "/design-system/components/tooltip",
            description: "Simple hover hints for quick information",
          },
          {
            name: "Popover",
            href: "/design-system/components/popover",
            description: "Interactive content anchored to an element",
          },
          {
            name: "Dialog",
            href: "/design-system/components/dialog",
            description: "For important information requiring acknowledgment",
          },
        ]}
      />

      {/* ============================================
          SECTION 12: REAL-WORLD EXAMPLES
          ============================================ */}
      <RealWorldExample
        title="Dashboard Onboarding Tour"
        description="Multi-step tour introducing dashboard features"
      >
        <div className="p-4 bg-[var(--background-subtle)] rounded-lg">
          <div className="flex items-center gap-4 mb-4">
            <CoachTip>
              <CoachTipTrigger asChild>
                <Button variant="primary" leftIcon={<Plus size={16} />}>
                  New Job
                </Button>
              </CoachTipTrigger>
              <CoachTipContent
                type="paginated"
                title="Create Job Postings"
                caret="bottom"
                currentStep={1}
                totalSteps={3}
              >
                Click here to create a new job posting for your climate-focused roles.
              </CoachTipContent>
            </CoachTip>

            <CoachTip>
              <CoachTipTrigger asChild>
                <Button variant="secondary" leftIcon={<MagnifyingGlass size={16} />}>
                  Search
                </Button>
              </CoachTipTrigger>
              <CoachTipContent
                type="single"
                title="Find Candidates"
                caret="bottom"
              >
                Use the search to find candidates by skills, location, or certifications.
              </CoachTipContent>
            </CoachTip>

            <CoachTip>
              <CoachTipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <FunnelSimple size={20} />
                </Button>
              </CoachTipTrigger>
              <CoachTipContent type="single-no-title" caret="bottom">
                Filter candidates by stage, score, or date applied.
              </CoachTipContent>
            </CoachTip>
          </div>
          <p className="text-caption text-foreground-muted">
            Click each element to see its coach tip
          </p>
        </div>
      </RealWorldExample>

      <RealWorldExample
        title="Feature Announcement"
        description="Highlighting a new feature to existing users"
      >
        <CodePreview
          code={`<SimpleCoachTip
  type="single"
  title="New: AI Candidate Matching"
  content="We've added AI-powered matching to help you find the best candidates faster."
  caret="left"
>
  <Badge variant="feature" icon={<Sparkle size={14} />}>
    New
  </Badge>
</SimpleCoachTip>`}
        >
          <div className="flex items-center gap-4">
            <span className="text-body-strong">Match Score</span>
            <CoachTip>
              <CoachTipTrigger asChild>
                <Badge variant="feature" icon={<Sparkle size={14} />} className="cursor-pointer">
                  New
                </Badge>
              </CoachTipTrigger>
              <CoachTipContent
                type="single"
                title="New: AI Candidate Matching"
                caret="left"
              >
                We&apos;ve added AI-powered matching to help you find the best candidates faster.
              </CoachTipContent>
            </CoachTip>
          </div>
        </CodePreview>
      </RealWorldExample>

      <PageNavigation currentPath="/design-system/components/coach-tip" />
    </div>
  );
}
