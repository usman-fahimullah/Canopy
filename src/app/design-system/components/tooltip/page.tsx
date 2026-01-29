"use client";

import React from "react";
import {
  SimpleTooltip,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  Button,
  Badge,
  Avatar,
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
  Info,
  Question,
  Star,
  Plus,
  Trash,
  PencilSimple,
  Copy,
  Share,
  Calendar,
  CheckCircle,
  Keyboard,
  User,
  Briefcase,
  MapPin,
} from "@phosphor-icons/react";

// ============================================
// PROPS DOCUMENTATION
// ============================================
const simpleTooltipProps = [
  {
    name: "content",
    type: "ReactNode",
    required: true,
    description: "Content to display in the tooltip (text, JSX, or rich content)",
  },
  {
    name: "children",
    type: "ReactNode",
    required: true,
    description: "The trigger element that activates the tooltip on hover/focus",
  },
  {
    name: "side",
    type: '"top" | "right" | "bottom" | "left"',
    default: '"top"',
    description: "Preferred side to display the tooltip",
  },
  {
    name: "align",
    type: '"start" | "center" | "end"',
    default: '"center"',
    description: "Alignment of tooltip relative to trigger",
  },
  {
    name: "delayDuration",
    type: "number",
    default: "200",
    description: "Delay in milliseconds before tooltip appears",
  },
  {
    name: "variant",
    type: '"light" | "dark"',
    default: '"light"',
    description: "Visual style variant - light (white bg) or dark (inverse)",
  },
  {
    name: "showArrow",
    type: "boolean",
    default: "true",
    description: "Whether to show the arrow/caret pointing to the trigger",
  },
];

const tooltipContentProps = [
  {
    name: "side",
    type: '"top" | "right" | "bottom" | "left"',
    default: '"top"',
    description: "Preferred side to display the tooltip",
  },
  {
    name: "sideOffset",
    type: "number",
    default: "8",
    description: "Distance in pixels from the trigger element",
  },
  {
    name: "align",
    type: '"start" | "center" | "end"',
    default: '"center"',
    description: "Alignment of tooltip relative to trigger",
  },
  {
    name: "alignOffset",
    type: "number",
    default: "0",
    description: "Offset from alignment position in pixels",
  },
  {
    name: "avoidCollisions",
    type: "boolean",
    default: "true",
    description: "Whether to flip to avoid viewport edges",
  },
  {
    name: "variant",
    type: '"light" | "dark"',
    default: '"light"',
    description: "Visual style variant - light (white bg) or dark (inverse)",
  },
  {
    name: "showArrow",
    type: "boolean",
    default: "true",
    description: "Whether to show the arrow/caret pointing to the trigger",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Additional CSS classes for styling",
  },
  {
    name: "children",
    type: "ReactNode",
    required: true,
    description: "Tooltip content",
  },
];

const tooltipProviderProps = [
  {
    name: "delayDuration",
    type: "number",
    default: "700",
    description: "Default delay for all tooltips in this provider",
  },
  {
    name: "skipDelayDuration",
    type: "number",
    default: "300",
    description: "Time to skip delay when moving between tooltips",
  },
  {
    name: "disableHoverableContent",
    type: "boolean",
    default: "false",
    description: "Prevent hovering over tooltip content from keeping it open",
  },
  {
    name: "children",
    type: "ReactNode",
    required: true,
    description: "Application content with tooltips",
  },
];

export default function TooltipPage() {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-12">
        {/* ============================================
            SECTION 1: OVERVIEW
            ============================================ */}
        <div>
          <h1
            id="overview"
            className="text-heading-lg text-foreground mb-2"
          >
            Tooltip
          </h1>
          <p className="text-body text-foreground-muted max-w-2xl mb-4">
            A popup that displays informative text when users hover over, focus
            on, or tap an element. Tooltips provide additional context without
            cluttering the UI.
          </p>

          {/* Component Metadata */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="secondary">Overlay</Badge>
            <Badge variant="secondary">Radix UI</Badge>
            <Badge variant="secondary">Accessible</Badge>
          </div>

          {/* When to Use / When Not to Use */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[var(--background-success)] rounded-lg border border-[var(--border-success)]">
              <h3 className="font-semibold text-[var(--foreground-success)] mb-2">
                When to use
              </h3>
              <ul className="text-sm space-y-1 text-foreground-muted">
                <li>• Supplementary information for UI elements</li>
                <li>• Labels for icon-only buttons</li>
                <li>• Explanations for abbreviations or technical terms</li>
                <li>• Preview or summary information</li>
              </ul>
            </div>
            <div className="p-4 bg-[var(--background-error)] rounded-lg border border-[var(--border-error)]">
              <h3 className="font-semibold text-[var(--foreground-error)] mb-2">
                When not to use
              </h3>
              <ul className="text-sm space-y-1 text-foreground-muted">
                <li>• Essential information users need to see</li>
                <li>• Interactive content (use Popover instead)</li>
                <li>• Long-form content or instructions</li>
                <li>• Touch-only contexts (no hover)</li>
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
          description="The Tooltip system is composed of these parts"
        >
          <ComponentAnatomy
            parts={[
              {
                name: "TooltipProvider",
                description: "Wraps app/section to manage tooltip state and timing",
                required: true,
              },
              {
                name: "Tooltip",
                description: "Root component for each tooltip instance",
                required: true,
              },
              {
                name: "TooltipTrigger",
                description: "Element that triggers the tooltip on hover/focus",
                required: true,
              },
              {
                name: "TooltipContent",
                description: "The popup content that appears",
                required: true,
              },
              {
                name: "SimpleTooltip",
                description: "Convenience wrapper combining all parts",
              },
            ]}
          />
        </ComponentCard>

        {/* ============================================
            SECTION 3: BASIC USAGE
            ============================================ */}
        <ComponentCard
          id="basic-usage"
          title="Basic Usage"
          description="The SimpleTooltip wrapper for common use cases"
        >
          <CodePreview
            code={`import { SimpleTooltip, TooltipProvider, Button } from "@/components/ui";

// Wrap your app or section with TooltipProvider
<TooltipProvider>
  <SimpleTooltip content="This is a tooltip">
    <Button>Hover me</Button>
  </SimpleTooltip>
</TooltipProvider>`}
          >
            <SimpleTooltip content="This is a tooltip">
              <Button>Hover me</Button>
            </SimpleTooltip>
          </CodePreview>
        </ComponentCard>

        {/* ============================================
            SECTION 4: POSITIONS
            ============================================ */}
        <ComponentCard
          id="positions"
          title="Positions"
          description="Tooltips can appear on any side of the trigger element"
        >
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-center gap-4 py-8">
              <SimpleTooltip content="I appear on top" side="top">
                <Button variant="secondary">Top</Button>
              </SimpleTooltip>
              <SimpleTooltip content="I appear on the right" side="right">
                <Button variant="secondary">Right</Button>
              </SimpleTooltip>
              <SimpleTooltip content="I appear on the bottom" side="bottom">
                <Button variant="secondary">Bottom</Button>
              </SimpleTooltip>
              <SimpleTooltip content="I appear on the left" side="left">
                <Button variant="secondary">Left</Button>
              </SimpleTooltip>
            </div>

            <div className="p-4 bg-[var(--background-subtle)] rounded-lg">
              <h4 className="text-body-strong mb-2">Alignment Options</h4>
              <div className="flex flex-wrap items-center gap-4">
                <SimpleTooltip content="Aligned to start" side="bottom" align="start">
                  <Button variant="tertiary" size="sm">Start</Button>
                </SimpleTooltip>
                <SimpleTooltip content="Aligned to center (default)" side="bottom" align="center">
                  <Button variant="tertiary" size="sm">Center</Button>
                </SimpleTooltip>
                <SimpleTooltip content="Aligned to end" side="bottom" align="end">
                  <Button variant="tertiary" size="sm">End</Button>
                </SimpleTooltip>
              </div>
            </div>
          </div>
        </ComponentCard>

        {/* ============================================
            SECTION 5: VARIANTS
            ============================================ */}
        <ComponentCard
          id="variants"
          title="Variants"
          description="Tooltips come in light and dark variants"
        >
          <div className="flex flex-wrap items-center gap-6 py-4">
            <div className="space-y-2 text-center">
              <SimpleTooltip content="Light variant (default)" variant="light">
                <Button variant="secondary">Light</Button>
              </SimpleTooltip>
              <p className="text-caption text-foreground-muted">Default</p>
            </div>
            <div className="space-y-2 text-center">
              <SimpleTooltip content="Dark variant for contrast" variant="dark">
                <Button variant="secondary">Dark</Button>
              </SimpleTooltip>
              <p className="text-caption text-foreground-muted">Inverse</p>
            </div>
            <div className="space-y-2 text-center">
              <SimpleTooltip content="No arrow shown" showArrow={false}>
                <Button variant="secondary">No Arrow</Button>
              </SimpleTooltip>
              <p className="text-caption text-foreground-muted">Without arrow</p>
            </div>
          </div>
        </ComponentCard>

        {/* ============================================
            SECTION 6: ON ICONS
            ============================================ */}
        <ComponentCard
          id="on-icons"
          title="Icon Tooltips"
          description="Essential pattern for icon-only buttons to ensure accessibility"
        >
          <CodePreview
            code={`<SimpleTooltip content="Add new job">
  <Button variant="primary" size="icon">
    <Plus size={20} />
  </Button>
</SimpleTooltip>

<SimpleTooltip content="Edit details">
  <Button variant="secondary" size="icon">
    <PencilSimple size={20} />
  </Button>
</SimpleTooltip>`}
          >
            <div className="flex items-center gap-4">
              <SimpleTooltip content="Add new job">
                <Button variant="primary" size="icon">
                  <Plus size={20} />
                </Button>
              </SimpleTooltip>
              <SimpleTooltip content="Edit details">
                <Button variant="secondary" size="icon">
                  <PencilSimple size={20} />
                </Button>
              </SimpleTooltip>
              <SimpleTooltip content="Delete">
                <Button variant="ghost" size="icon">
                  <Trash size={20} />
                </Button>
              </SimpleTooltip>
              <SimpleTooltip content="Copy to clipboard">
                <Button variant="ghost" size="icon">
                  <Copy size={20} />
                </Button>
              </SimpleTooltip>
              <SimpleTooltip content="Share">
                <Button variant="ghost" size="icon">
                  <Share size={20} />
                </Button>
              </SimpleTooltip>
            </div>
          </CodePreview>
        </ComponentCard>

        {/* ============================================
            SECTION 6: ON TEXT ELEMENTS
            ============================================ */}
        <ComponentCard
          id="on-text"
          title="On Text & Badges"
          description="Add context to badges, labels, and inline text"
        >
          <div className="flex flex-wrap items-center gap-4">
            <SimpleTooltip content="AI-calculated match score based on skills and experience">
              <Badge variant="success">92% Match</Badge>
            </SimpleTooltip>
            <SimpleTooltip content="This candidate is scheduled for interview">
              <Badge variant="info" dot>Interview</Badge>
            </SimpleTooltip>
            <SimpleTooltip content="North American Board of Certified Energy Practitioners">
              <span className="text-[var(--foreground-brand)] underline underline-offset-2 cursor-help text-body-sm">
                NABCEP Certified
              </span>
            </SimpleTooltip>
            <SimpleTooltip content="View candidate profile">
              <Avatar name="Sarah Chen" size="sm" interactive />
            </SimpleTooltip>
          </div>
        </ComponentCard>

        {/* ============================================
            SECTION 7: RICH CONTENT
            ============================================ */}
        <ComponentCard
          id="rich-content"
          title="Rich Content"
          description="Tooltips can contain formatted content, not just plain text"
        >
          <CodePreview
            code={`<SimpleTooltip
  content={
    <div className="max-w-xs">
      <p className="font-medium mb-1">Match Score Breakdown</p>
      <ul className="text-caption space-y-1">
        <li>Skills match: 95%</li>
        <li>Experience level: 85%</li>
        <li>Location preference: 100%</li>
      </ul>
    </div>
  }
>
  <Badge variant="success">92% Match</Badge>
</SimpleTooltip>`}
          >
            <div className="flex flex-wrap items-center gap-6">
              <SimpleTooltip
                content={
                  <div className="max-w-xs">
                    <p className="font-medium mb-1">Match Score Breakdown</p>
                    <ul className="text-caption space-y-1 opacity-90">
                      <li>• Skills match: 95%</li>
                      <li>• Experience level: 85%</li>
                      <li>• Location preference: 100%</li>
                    </ul>
                  </div>
                }
              >
                <Badge variant="success">92% Match</Badge>
              </SimpleTooltip>

              <SimpleTooltip
                content={
                  <div className="max-w-[200px]">
                    <p className="font-medium mb-1">Keyboard Shortcuts</p>
                    <div className="text-caption space-y-1 opacity-90">
                      <div className="flex justify-between">
                        <span>Search</span>
                        <kbd className="px-1.5 py-0.5 bg-[var(--background-muted)] rounded text-[10px]">⌘K</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span>New Job</span>
                        <kbd className="px-1.5 py-0.5 bg-[var(--background-muted)] rounded text-[10px]">⌘N</kbd>
                      </div>
                    </div>
                  </div>
                }
              >
                <Button variant="tertiary" size="sm" leftIcon={<Keyboard size={16} />}>
                  Shortcuts
                </Button>
              </SimpleTooltip>

              <SimpleTooltip
                content={
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} weight="fill" className="text-green-400" />
                    <span>Application submitted successfully</span>
                  </div>
                }
              >
                <Badge variant="success" icon={<CheckCircle size={14} weight="bold" />}>
                  Submitted
                </Badge>
              </SimpleTooltip>
            </div>
          </CodePreview>
        </ComponentCard>

        {/* ============================================
            SECTION 8: DELAY CONTROL
            ============================================ */}
        <ComponentCard
          id="delay"
          title="Delay Control"
          description="Control when tooltips appear with delayDuration"
        >
          <CodePreview
            code={`// No delay - appears immediately
<SimpleTooltip content="Instant!" delayDuration={0}>
  <Button>No delay</Button>
</SimpleTooltip>

// Default delay (200ms) - recommended
<SimpleTooltip content="Standard delay" delayDuration={200}>
  <Button>Default (200ms)</Button>
</SimpleTooltip>

// Longer delay for less important info
<SimpleTooltip content="Slow tooltip" delayDuration={500}>
  <Button>Slow (500ms)</Button>
</SimpleTooltip>`}
          >
            <div className="flex flex-wrap items-center gap-4">
              <SimpleTooltip content="I appear immediately!" delayDuration={0}>
                <Button variant="secondary">No delay</Button>
              </SimpleTooltip>
              <SimpleTooltip content="Standard 200ms delay" delayDuration={200}>
                <Button variant="secondary">Default (200ms)</Button>
              </SimpleTooltip>
              <SimpleTooltip content="I take a bit longer to show" delayDuration={500}>
                <Button variant="secondary">Slow (500ms)</Button>
              </SimpleTooltip>
              <SimpleTooltip content="Even slower for non-essential info" delayDuration={1000}>
                <Button variant="secondary">Very slow (1s)</Button>
              </SimpleTooltip>
            </div>
          </CodePreview>
        </ComponentCard>

        {/* ============================================
            SECTION 9: ADVANCED USAGE
            ============================================ */}
        <ComponentCard
          id="advanced"
          title="Advanced: Primitive Components"
          description="Use individual components for more control"
        >
          <CodePreview
            code={`import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui";

<TooltipProvider delayDuration={200}>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button>Hover me</Button>
    </TooltipTrigger>
    <TooltipContent side="right" sideOffset={8}>
      Custom positioned tooltip
    </TooltipContent>
  </Tooltip>
</TooltipProvider>`}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="tertiary">Advanced Tooltip</Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                Custom positioned with extra offset
              </TooltipContent>
            </Tooltip>
          </CodePreview>
        </ComponentCard>

        {/* ============================================
            SECTION 10: PROPS TABLES
            ============================================ */}
        <ComponentCard id="props-simple" title="SimpleTooltip Props">
          <PropsTable props={simpleTooltipProps} />
        </ComponentCard>

        <ComponentCard id="props-content" title="TooltipContent Props">
          <PropsTable props={tooltipContentProps} />
        </ComponentCard>

        <ComponentCard id="props-provider" title="TooltipProvider Props">
          <PropsTable props={tooltipProviderProps} />
        </ComponentCard>

        {/* ============================================
            SECTION 11: USAGE GUIDELINES
            ============================================ */}
        <UsageGuide
          dos={[
            "Use for supplementary, non-essential information",
            "Always add tooltips to icon-only buttons for accessibility",
            "Keep tooltip text concise (1-2 short sentences max)",
            "Use consistent positioning throughout your app",
            "Provide meaningful context, not just repeating visible text",
          ]}
          donts={[
            "Don't hide essential information in tooltips",
            "Don't use for interactive content (use Popover or Dropdown)",
            "Don't use on disabled elements without explaining why",
            "Don't make tooltips too long or complex",
            "Don't rely on tooltips for mobile/touch interfaces",
          ]}
        />

        {/* ============================================
            SECTION 12: ACCESSIBILITY
            ============================================ */}
        <AccessibilityInfo
          items={[
            "**Keyboard accessible**: Tooltips appear on focus as well as hover",
            "**ARIA role**: Uses `role='tooltip'` for screen readers",
            "**Screen reader support**: Content is announced when tooltip appears",
            "**Escape dismissal**: Press Escape to close an open tooltip",
            "**Touch fallback**: Consider alternative patterns for touch-only users",
            "**Don't trap focus**: Tooltips should not contain focusable elements",
          ]}
        />

        {/* ============================================
            SECTION 13: RELATED COMPONENTS
            ============================================ */}
        <RelatedComponents
          components={[
            {
              name: "Popover",
              href: "/design-system/components/popover",
              description: "For interactive content anchored to an element",
            },
            {
              name: "HoverCard",
              href: "/design-system/components/hover-card",
              description: "Rich preview cards on hover",
            },
            {
              name: "Dialog",
              href: "/design-system/components/dialog",
              description: "For important information requiring acknowledgment",
            },
            {
              name: "DropdownMenu",
              href: "/design-system/components/dropdown-menu",
              description: "For action menus triggered by click",
            },
          ]}
        />

        {/* ============================================
            SECTION 14: REAL-WORLD EXAMPLES
            ============================================ */}
        <RealWorldExample
          title="Action Toolbar"
          description="Icon tooltips in a candidate action toolbar"
        >
          <CodePreview
            code={`<div className="flex items-center gap-2 p-2 border rounded-lg bg-surface">
  <SimpleTooltip content="Schedule interview">
    <Button variant="ghost" size="icon">
      <Calendar size={18} />
    </Button>
  </SimpleTooltip>
  <SimpleTooltip content="Send email">
    <Button variant="ghost" size="icon">
      <PaperPlaneTilt size={18} />
    </Button>
  </SimpleTooltip>
  <SimpleTooltip content="Add to favorites">
    <Button variant="ghost" size="icon">
      <Star size={18} />
    </Button>
  </SimpleTooltip>
  <div className="w-px h-6 bg-border mx-1" />
  <SimpleTooltip content="Move to next stage">
    <Button variant="primary" size="sm">Advance</Button>
  </SimpleTooltip>
</div>`}
          >
            <div className="flex items-center gap-2 p-2 border border-[var(--border-default)] rounded-lg bg-surface max-w-fit">
              <SimpleTooltip content="Schedule interview">
                <Button variant="ghost" size="icon">
                  <Calendar size={18} />
                </Button>
              </SimpleTooltip>
              <SimpleTooltip content="Add to favorites">
                <Button variant="ghost" size="icon">
                  <Star size={18} />
                </Button>
              </SimpleTooltip>
              <SimpleTooltip content="Edit candidate">
                <Button variant="ghost" size="icon">
                  <PencilSimple size={18} />
                </Button>
              </SimpleTooltip>
              <div className="w-px h-6 bg-[var(--border-default)] mx-1" />
              <SimpleTooltip content="Move candidate to next pipeline stage">
                <Button variant="primary" size="sm">Advance</Button>
              </SimpleTooltip>
            </div>
          </CodePreview>
        </RealWorldExample>

        <RealWorldExample
          title="Candidate Card Details"
          description="Tooltips providing context for badges and metrics"
        >
          <div className="p-4 border border-[var(--border-default)] rounded-lg bg-surface max-w-sm">
            <div className="flex items-center gap-3 mb-3">
              <Avatar name="Sarah Chen" size="default" />
              <div>
                <p className="font-semibold text-foreground">Sarah Chen</p>
                <p className="text-caption text-foreground-muted">Solar Installation Manager</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <SimpleTooltip content="AI-calculated score based on job requirements match">
                <Badge variant="success">92% Match</Badge>
              </SimpleTooltip>
              <SimpleTooltip content="North American Board of Certified Energy Practitioners">
                <Badge variant="success" size="sm">NABCEP</Badge>
              </SimpleTooltip>
              <SimpleTooltip content="Leadership Experience and Soft Skills Assessment">
                <Badge variant="feature" size="sm">LESSA</Badge>
              </SimpleTooltip>
            </div>
            <div className="flex items-center gap-4 text-caption text-foreground-muted">
              <SimpleTooltip content="San Francisco, California">
                <span className="flex items-center gap-1 cursor-help">
                  <MapPin size={14} />
                  SF, CA
                </span>
              </SimpleTooltip>
              <SimpleTooltip content="5+ years in solar industry">
                <span className="flex items-center gap-1 cursor-help">
                  <Briefcase size={14} />
                  5+ yrs
                </span>
              </SimpleTooltip>
            </div>
          </div>
        </RealWorldExample>

        <RealWorldExample
          title="Help Icons"
          description="Contextual help tooltips for form fields"
        >
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-body-strong">Job Title</label>
                <SimpleTooltip
                  content="Use a clear, standard job title that candidates will search for"
                  side="right"
                >
                  <button className="text-foreground-muted hover:text-foreground transition-colors">
                    <Question size={16} />
                  </button>
                </SimpleTooltip>
              </div>
              <input
                type="text"
                placeholder="e.g., Senior Solar Engineer"
                className="w-full px-3 py-2 border border-[var(--border-default)] rounded-lg bg-[var(--background-default)]"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-body-strong">Climate Impact</label>
                <SimpleTooltip
                  content={
                    <div className="max-w-xs">
                      <p className="font-medium mb-1">Why include this?</p>
                      <p className="text-caption opacity-90">
                        Climate-focused candidates value understanding how their work
                        contributes to environmental goals.
                      </p>
                    </div>
                  }
                  side="right"
                >
                  <button className="text-foreground-muted hover:text-foreground transition-colors">
                    <Info size={16} />
                  </button>
                </SimpleTooltip>
              </div>
              <textarea
                placeholder="Describe the environmental impact of this role..."
                className="w-full px-3 py-2 border border-[var(--border-default)] rounded-lg bg-[var(--background-default)] h-20"
              />
            </div>
          </div>
        </RealWorldExample>

        <PageNavigation currentPath="/design-system/components/tooltip" />
      </div>
    </TooltipProvider>
  );
}
