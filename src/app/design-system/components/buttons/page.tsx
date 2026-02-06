"use client";

import React from "react";
import { Button, SaveButton, Label, Card, CardContent } from "@/components/ui";
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
  Plus,
  Star,
  ArrowRight,
  Download,
  Trash,
  Check,
  Upload,
  PencilSimple,
  Users,
  Briefcase,
  BookmarkSimple,
  CheckCircle,
} from "@/components/Icons";

// ============================================
// PROPS DEFINITIONS
// ============================================

const buttonProps = [
  {
    name: "variant",
    type: '"primary" | "secondary" | "tertiary" | "inverse" | "destructive" | "ghost" | "outline" | "link"',
    default: '"primary"',
    description: "Visual style of the button. Primary is the default CTA style.",
  },
  {
    name: "size",
    type: '"sm" | "default" | "lg" | "icon" | "icon-sm"',
    default: '"default"',
    description: "Size of the button. Use 'icon' or 'icon-sm' for icon-only buttons.",
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    description: "Shows a loading spinner and disables the button. Use for async operations.",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disables the button and applies reduced opacity styling.",
  },
  {
    name: "leftIcon",
    type: "ReactNode",
    description: "Icon element to display before the button text.",
  },
  {
    name: "rightIcon",
    type: "ReactNode",
    description: "Icon element to display after the button text.",
  },
  {
    name: "asChild",
    type: "boolean",
    default: "false",
    description:
      "When true, renders the button as a Slot, allowing you to pass a custom element (e.g., Link).",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes to apply to the button.",
  },
];

const saveButtonProps = [
  {
    name: "saved",
    type: "boolean",
    default: "false",
    description: "Whether the item is currently saved. Controls background color and icon.",
  },
  {
    name: "size",
    type: '"default" | "lg"',
    default: '"default"',
    description:
      "Size of the button. Default uses 14px font and 20px icons. Large uses 18px font and 24px icons.",
  },
  {
    name: "iconOnly",
    type: "boolean",
    default: "false",
    description: "Show only the icon without label text. Uses compact padding.",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disables the button and applies reduced opacity styling.",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes to apply to the button.",
  },
];

// ============================================
// PAGE COMPONENT
// ============================================

export default function ButtonsPage() {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleAsyncAction = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="space-y-12">
      {/* ============================================ */}
      {/* 1. OVERVIEW */}
      {/* ============================================ */}
      <div id="overview">
        <h1 className="mb-2 text-heading-lg text-foreground">Button</h1>
        <p className="max-w-3xl text-body text-foreground-muted">
          Buttons are interactive elements that trigger actions when clicked. They are fundamental
          to user interactions and should communicate their purpose clearly through labels, icons,
          and visual hierarchy.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-background-brand-subtle px-3 py-1 text-caption font-medium text-foreground-brand">
            Interactive
          </span>
          <span className="rounded-full bg-background-subtle px-3 py-1 text-caption text-foreground-muted">
            8 Variants
          </span>
          <span className="rounded-full bg-background-subtle px-3 py-1 text-caption text-foreground-muted">
            5 Sizes
          </span>
        </div>

        {/* When to Use / When Not to Use */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border-success bg-background-success p-4">
            <h3 className="mb-2 font-semibold text-foreground-success">When to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>• Triggering form submissions</li>
              <li>• Initiating user actions (save, delete, create)</li>
              <li>• Navigation to important destinations</li>
              <li>• Confirming or canceling modal dialogs</li>
              <li>• Starting workflows or multi-step processes</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border-error bg-background-error p-4">
            <h3 className="mb-2 font-semibold text-foreground-error">When not to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>• For simple navigation (use Link instead)</li>
              <li>• When the action is just toggling a state (use Switch)</li>
              <li>• For selecting options (use Checkbox/Radio)</li>
              <li>• When displaying information only (use Badge)</li>
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
            description:
              "The clickable outer element with rounded corners (16px radius) and padding based on size variant",
            required: true,
          },
          {
            name: "Left Icon",
            description:
              "Optional icon displayed before the label, typically for indicating action type",
          },
          {
            name: "Label",
            description:
              "The text content describing the action. Should be concise and action-oriented",
            required: true,
          },
          {
            name: "Right Icon",
            description:
              "Optional icon displayed after the label, often used for directional cues (arrows) or status",
          },
          {
            name: "Loading Spinner",
            description:
              "Animated spinner shown during async operations, replaces left icon position",
          },
        ]}
      />

      {/* ============================================ */}
      {/* 3. BASIC USAGE */}
      {/* ============================================ */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="The simplest implementation uses the primary variant with a clear label"
      >
        <CodePreview
          code={`import { Button } from "@/components/ui";

<Button>Save Changes</Button>`}
        >
          <Button>Save Changes</Button>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 4. VARIANTS */}
      {/* ============================================ */}
      <ComponentCard
        id="variants"
        title="Variants"
        description="Choose the appropriate variant based on the action's importance and context"
      >
        <div className="space-y-8">
          {/* Primary */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-body-strong">Primary</Label>
              <span className="text-caption text-foreground-muted">
                — Main CTA, highest visual emphasis
              </span>
            </div>
            <p className="mb-3 text-caption text-foreground-muted">
              Use for the single most important action on a page or in a modal. Background:
              green-800, hover: green-700.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary Button</Button>
              <Button variant="primary" rightIcon={<ArrowRight size={16} />}>
                Continue
              </Button>
            </div>
          </div>

          {/* Secondary */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-body-strong">Secondary</Label>
              <span className="text-caption text-foreground-muted">— Supporting actions</span>
            </div>
            <p className="mb-3 text-caption text-foreground-muted">
              Use alongside primary buttons for secondary actions. Background: blue-200, hover:
              blue-300.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="secondary" leftIcon={<Download size={16} />}>
                Download
              </Button>
            </div>
          </div>

          {/* Tertiary */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-body-strong">Tertiary</Label>
              <span className="text-caption text-foreground-muted">— Subtle, low emphasis</span>
            </div>
            <p className="mb-3 text-caption text-foreground-muted">
              Use for less important actions or in dense UIs. Background: neutral-200, hover:
              neutral-300.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="tertiary">Tertiary Button</Button>
              <Button variant="tertiary" leftIcon={<PencilSimple size={16} />}>
                Edit
              </Button>
            </div>
          </div>

          {/* Inverse */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-body-strong">Inverse</Label>
              <span className="text-caption text-foreground-muted">— For dark backgrounds</span>
            </div>
            <p className="mb-3 text-caption text-foreground-muted">
              Use on dark or colored backgrounds where primary wouldn&apos;t contrast well.
              Background: white, hover: green-100.
            </p>
            <div className="rounded-lg bg-background-brand p-4">
              <div className="flex flex-wrap gap-4">
                <Button variant="inverse">Inverse Button</Button>
                <Button variant="inverse" rightIcon={<ArrowRight size={16} />}>
                  Learn More
                </Button>
              </div>
            </div>
          </div>

          {/* Destructive */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-body-strong">Destructive</Label>
              <span className="text-caption text-foreground-muted">
                — Dangerous or irreversible actions
              </span>
            </div>
            <p className="mb-3 text-caption text-foreground-muted">
              Use only for actions that delete data or cannot be undone. Background: red-500, hover:
              red-600.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="destructive">Delete</Button>
              <Button variant="destructive" leftIcon={<Trash size={16} />}>
                Remove Candidate
              </Button>
            </div>
          </div>

          {/* Ghost */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-body-strong">Ghost</Label>
              <span className="text-caption text-foreground-muted">
                — Minimal presence until hover
              </span>
            </div>
            <p className="mb-3 text-caption text-foreground-muted">
              Use for tertiary actions in toolbars or when many buttons are present. Transparent
              background, visible on hover.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="ghost" leftIcon={<Star size={16} />}>
                Favorite
              </Button>
            </div>
          </div>

          {/* Outline */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-body-strong">Outline</Label>
              <span className="text-caption text-foreground-muted">
                — Border style for neutral actions
              </span>
            </div>
            <p className="mb-3 text-caption text-foreground-muted">
              Use when you need a button that doesn&apos;t compete with primary actions but needs
              more presence than ghost.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline">Outline Button</Button>
              <Button variant="outline" leftIcon={<Upload size={16} />}>
                Upload File
              </Button>
            </div>
          </div>

          {/* Link */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-body-strong">Link</Label>
              <span className="text-caption text-foreground-muted">
                — Text-only, looks like a link
              </span>
            </div>
            <p className="mb-3 text-caption text-foreground-muted">
              Use for navigation or when button styling would be too heavy. Uses brand color text.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="link">View all jobs</Button>
              <Button variant="link" rightIcon={<ArrowRight size={16} />}>
                See more
              </Button>
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
        description="Choose the appropriate size based on context and available space"
      >
        <div className="space-y-6">
          {/* Text Buttons */}
          <div className="space-y-3">
            <Label>Text Button Sizes</Label>
            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-2">
                <span className="block text-caption text-foreground-muted">Small (32px)</span>
                <Button variant="primary" size="sm">
                  Small
                </Button>
              </div>
              <div className="space-y-2">
                <span className="block text-caption text-foreground-muted">Default (48px)</span>
                <Button variant="primary" size="default">
                  Default
                </Button>
              </div>
              <div className="space-y-2">
                <span className="block text-caption text-foreground-muted">Large (56px)</span>
                <Button variant="primary" size="lg">
                  Large
                </Button>
              </div>
            </div>
          </div>

          {/* Icon Buttons */}
          <div className="space-y-3 border-t border-border-muted pt-4">
            <Label>Icon Button Sizes</Label>
            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-2">
                <span className="block text-caption text-foreground-muted">Icon Small</span>
                <Button variant="primary" size="icon-sm">
                  <Plus size={16} />
                </Button>
              </div>
              <div className="space-y-2">
                <span className="block text-caption text-foreground-muted">Icon Default</span>
                <Button variant="primary" size="icon">
                  <Plus size={20} />
                </Button>
              </div>
            </div>
            <p className="mt-2 text-caption text-foreground-muted">
              Icon buttons should always include an{" "}
              <code className="rounded bg-background-muted px-1">aria-label</code> for
              accessibility.
            </p>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 6. STATES */}
      {/* ============================================ */}
      <ComponentCard
        id="states"
        title="States"
        description="Visual states for different interaction scenarios"
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label>Default</Label>
            <Button variant="primary">Default</Button>
            <p className="text-caption text-foreground-muted">Ready for interaction</p>
          </div>
          <div className="space-y-2">
            <Label>Hover</Label>
            <Button variant="primary" className="bg-[var(--button-primary-background-hover)]">
              Hover
            </Button>
            <p className="text-caption text-foreground-muted">Cursor over button</p>
          </div>
          <div className="space-y-2">
            <Label>Focus</Label>
            <Button
              variant="primary"
              className="ring-2 ring-[var(--primitive-green-500)] ring-offset-2"
            >
              Focus
            </Button>
            <p className="text-caption text-foreground-muted">Keyboard focused state</p>
          </div>
          <div className="space-y-2">
            <Label>Active / Pressed</Label>
            <Button variant="primary" className="scale-[0.98]">
              Pressed
            </Button>
            <p className="text-caption text-foreground-muted">During click/tap</p>
          </div>
          <div className="space-y-2">
            <Label>Loading</Label>
            <Button variant="primary" loading>
              Loading
            </Button>
            <p className="text-caption text-foreground-muted">Async operation in progress</p>
          </div>
          <div className="space-y-2">
            <Label>Disabled</Label>
            <Button variant="primary" disabled>
              Disabled
            </Button>
            <p className="text-caption text-foreground-muted">Cannot be interacted with</p>
          </div>
        </div>

        {/* All variants disabled */}
        <div className="mt-8 border-t border-border-muted pt-6">
          <Label className="mb-4 block">All Variants Disabled</Label>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" disabled>
              Primary
            </Button>
            <Button variant="secondary" disabled>
              Secondary
            </Button>
            <Button variant="tertiary" disabled>
              Tertiary
            </Button>
            <Button variant="destructive" disabled>
              Destructive
            </Button>
            <Button variant="ghost" disabled>
              Ghost
            </Button>
            <Button variant="outline" disabled>
              Outline
            </Button>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 7. WITH ICONS */}
      {/* ============================================ */}
      <ComponentCard
        id="with-icons"
        title="With Icons"
        description="Buttons can include icons for visual context"
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <Label>Left Icon</Label>
            <p className="text-caption text-foreground-muted">
              Use left icons to indicate the type of action (add, download, etc.)
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" leftIcon={<Plus size={16} />}>
                Add Job
              </Button>
              <Button variant="secondary" leftIcon={<Download size={16} />}>
                Export Report
              </Button>
              <Button variant="tertiary" leftIcon={<PencilSimple size={16} />}>
                Edit Details
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Right Icon</Label>
            <p className="text-caption text-foreground-muted">
              Use right icons for directional cues or to indicate continuation
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" rightIcon={<ArrowRight size={16} />}>
                Continue
              </Button>
              <Button variant="secondary" rightIcon={<ArrowRight size={16} />}>
                View Details
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Icon Only</Label>
            <p className="text-caption text-foreground-muted">
              For toolbars and compact spaces. Always include aria-label.
            </p>
            <CodePreview
              code={`<Button variant="primary" size="icon" aria-label="Add new item">
  <Plus size={20} />
</Button>`}
            >
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" size="icon" aria-label="Add new item">
                  <Plus size={20} />
                </Button>
                <Button variant="secondary" size="icon" aria-label="Download file">
                  <Download size={20} />
                </Button>
                <Button variant="tertiary" size="icon" aria-label="Edit">
                  <PencilSimple size={20} />
                </Button>
                <Button variant="destructive" size="icon" aria-label="Delete item">
                  <Trash size={20} />
                </Button>
              </div>
            </CodePreview>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 8. LOADING STATE */}
      {/* ============================================ */}
      <ComponentCard
        id="loading"
        title="Loading State"
        description="Show loading state during async operations"
      >
        <CodePreview
          code={`const [isLoading, setIsLoading] = React.useState(false);

const handleClick = async () => {
  setIsLoading(true);
  await saveData();
  setIsLoading(false);
};

<Button loading={isLoading} onClick={handleClick}>
  Save Changes
</Button>`}
        >
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" loading={isLoading} onClick={handleAsyncAction}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
              <Button variant="secondary" loading>
                Processing
              </Button>
              <Button variant="tertiary" loading>
                Loading
              </Button>
            </div>
            <p className="text-caption text-foreground-muted">
              Click &quot;Save Changes&quot; to see the loading state in action
            </p>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 9. PROPS TABLE */}
      {/* ============================================ */}
      <ComponentCard id="props" title="Props Reference">
        <PropsTable props={buttonProps} />
      </ComponentCard>

      {/* ============================================ */}
      {/* 10. USAGE GUIDELINES */}
      {/* ============================================ */}
      <div id="guidelines">
        <h2 className="mb-4 text-heading-sm text-foreground">Usage Guidelines</h2>
        <UsageGuide
          dos={[
            "Use primary variant for the single most important action on a page",
            "Keep button labels short and action-oriented (2-3 words max)",
            "Use loading state for operations that take more than 200ms",
            "Pair destructive buttons with confirmation dialogs",
            "Use left icons to indicate action type (add, download, edit)",
            "Use right icons for directional cues (arrows, external links)",
            "Maintain consistent button sizing within a group",
            "Always provide aria-label for icon-only buttons",
          ]}
          donts={[
            "Don't use multiple primary buttons in the same section",
            "Don't use destructive variant for non-destructive actions",
            "Don't use vague labels like 'Click here' or 'Submit'",
            "Don't disable buttons without providing context why",
            "Don't mix different button sizes in a button group",
            "Don't use buttons for navigation (use Link component)",
            "Don't hide important actions behind ghost buttons",
            "Don't use loading state without changing the button text",
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 11. ACCESSIBILITY */}
      {/* ============================================ */}
      <div id="accessibility">
        <AccessibilityInfo
          items={[
            "**Keyboard**: Buttons are focusable with Tab and activated with Enter or Space",
            "**Focus ring**: Visible 2px green focus ring with 2px offset for clear keyboard navigation",
            "**aria-busy**: Set to true during loading state to communicate state to screen readers",
            "**aria-disabled**: Applied when button is disabled, preventing keyboard interaction",
            "**aria-label**: Required for icon-only buttons to provide accessible name",
            "**Color contrast**: All variants meet WCAG AA standards (4.5:1 minimum)",
            "**Motion**: Active press animation respects prefers-reduced-motion",
            "**Screen readers**: Loading spinner includes sr-only text 'Loading...'",
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 12. RELATED COMPONENTS */}
      {/* ============================================ */}
      <div id="related">
        <RelatedComponents
          components={[
            {
              name: "Link",
              href: "/design-system/components/navigation",
              description: "For navigation without action semantics",
            },
            {
              name: "Icon Button",
              href: "/design-system/components/toolbar",
              description: "Specialized icon-only actions in toolbars",
            },
            {
              name: "Dialog",
              href: "/design-system/components/dialog",
              description: "Confirm destructive actions with modal dialogs",
            },
            {
              name: "Form",
              href: "/design-system/components/form-controls",
              description: "Use buttons for form submissions",
            },
            {
              name: "Dropdown Menu",
              href: "/design-system/components/dropdown-menu",
              description: "Button triggers for menu actions",
            },
            {
              name: "Toast",
              href: "/design-system/components/toast",
              description: "Feedback after button actions complete",
            },
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 13. REAL-WORLD EXAMPLES */}
      {/* ============================================ */}
      <div id="examples" className="space-y-6">
        <h2 className="text-heading-sm text-foreground">Real-World Examples</h2>

        <RealWorldExample
          title="Job Posting Actions"
          description="Button hierarchy in a job management interface"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-body-strong text-foreground">
                    Senior Sustainability Analyst
                  </h3>
                  <p className="text-caption text-foreground-muted">
                    San Francisco, CA • Full-time • $120k-$150k
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon-sm" aria-label="Edit job">
                    <PencilSimple size={16} />
                  </Button>
                  <Button variant="secondary" leftIcon={<Users size={16} />}>
                    24 Applicants
                  </Button>
                  <Button variant="primary">View Pipeline</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </RealWorldExample>

        <RealWorldExample
          title="Candidate Review Actions"
          description="Action buttons in candidate review workflow"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background-brand-subtle">
                    <span className="font-semibold text-foreground-brand">JD</span>
                  </div>
                  <div>
                    <h3 className="text-body-strong text-foreground">Jane Doe</h3>
                    <p className="text-caption text-foreground-muted">
                      Applied for Solar Installation Lead
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="destructive" size="sm" leftIcon={<Trash size={14} />}>
                    Reject
                  </Button>
                  <Button variant="tertiary" size="sm">
                    Schedule Later
                  </Button>
                  <Button variant="primary" size="sm" leftIcon={<Check size={14} />}>
                    Move to Interview
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </RealWorldExample>

        <RealWorldExample title="Empty State CTA" description="Primary action in an empty state">
          <div className="px-6 py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background-brand-subtle">
              <Briefcase size={32} className="text-foreground-brand" />
            </div>
            <h3 className="mb-2 text-heading-sm text-foreground">No jobs posted yet</h3>
            <p className="mx-auto mb-6 max-w-md text-body text-foreground-muted">
              Create your first job posting to start attracting climate-focused talent to your
              organization.
            </p>
            <Button variant="primary" size="lg" leftIcon={<Plus size={20} />}>
              Post Your First Job
            </Button>
          </div>
        </RealWorldExample>

        <RealWorldExample
          title="Form Submission"
          description="Primary and secondary actions in a form footer"
        >
          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="mb-6">
              <Label className="mb-2 block">Job Title</Label>
              <input
                type="text"
                className="w-full rounded-lg border border-border-muted px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primitive-green-500)]"
                placeholder="e.g., Renewable Energy Engineer"
              />
            </div>
            <div className="flex items-center justify-between border-t border-border-muted pt-4">
              <Button variant="ghost">Save as Draft</Button>
              <div className="flex items-center gap-3">
                <Button variant="tertiary">Cancel</Button>
                <Button variant="primary" rightIcon={<ArrowRight size={16} />}>
                  Continue to Details
                </Button>
              </div>
            </div>
          </div>
        </RealWorldExample>
      </div>

      {/* ============================================ */}
      {/* 14. SAVE BUTTON */}
      {/* ============================================ */}
      <div id="save-button" className="space-y-8">
        <div>
          <h2 className="mb-2 text-heading-sm text-foreground">Save Button</h2>
          <p className="max-w-3xl text-body text-foreground-muted">
            A specialized button for save/bookmark actions with two visual states. Uses distinct
            color tokens separate from the standard Button variants.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-background-info px-3 py-1 text-caption font-medium text-foreground-info">
              Dedicated Component
            </span>
            <span className="rounded-full bg-background-subtle px-3 py-1 text-caption text-foreground-muted">
              2 States
            </span>
            <span className="rounded-full bg-background-subtle px-3 py-1 text-caption text-foreground-muted">
              2 Sizes
            </span>
          </div>
        </div>

        {/* Save Button — Basic Usage */}
        <ComponentCard
          id="save-button-usage"
          title="Basic Usage"
          description="The SaveButton toggles between unsaved (blue) and saved (green) states"
        >
          <CodePreview
            code={`import { SaveButton } from "@/components/ui";

<SaveButton />
<SaveButton saved />`}
          >
            <div className="flex flex-wrap items-center gap-4">
              <SaveButton />
              <SaveButton saved />
            </div>
          </CodePreview>
        </ComponentCard>

        {/* Save Button — Sizes */}
        <ComponentCard
          id="save-button-sizes"
          title="Sizes"
          description="Default (14px font, 20px icon) and Large (18px font, 24px icon)"
        >
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Default Size</Label>
              <div className="flex flex-wrap items-center gap-4">
                <SaveButton />
                <SaveButton saved />
              </div>
            </div>
            <div className="space-y-3">
              <Label>Large Size</Label>
              <div className="flex flex-wrap items-center gap-4">
                <SaveButton size="lg" />
                <SaveButton size="lg" saved />
              </div>
            </div>
          </div>
        </ComponentCard>

        {/* Save Button — Icon Only */}
        <ComponentCard
          id="save-button-icon-only"
          title="Icon Only"
          description="Compact icon-only variant for tight spaces like cards"
        >
          <CodePreview
            code={`<SaveButton iconOnly />
<SaveButton iconOnly saved />
<SaveButton iconOnly size="lg" />
<SaveButton iconOnly size="lg" saved />`}
          >
            <div className="flex flex-wrap items-center gap-4">
              <SaveButton iconOnly />
              <SaveButton iconOnly saved />
              <SaveButton iconOnly size="lg" />
              <SaveButton iconOnly size="lg" saved />
            </div>
          </CodePreview>
        </ComponentCard>

        {/* Save Button — States */}
        <ComponentCard
          id="save-button-states"
          title="States"
          description="Visual states for interaction scenarios"
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label>Unsaved (Default)</Label>
              <SaveButton />
              <p className="text-caption text-foreground-muted">
                Blue background with BookmarkSimple icon
              </p>
            </div>
            <div className="space-y-2">
              <Label>Unsaved (Hover)</Label>
              <SaveButton className="bg-[var(--save-button-background-hover)]" />
              <p className="text-caption text-foreground-muted">Darker blue on hover</p>
            </div>
            <div className="space-y-2">
              <Label>Saved</Label>
              <SaveButton saved />
              <p className="text-caption text-foreground-muted">
                Green background with CheckCircle icon
              </p>
            </div>
            <div className="space-y-2">
              <Label>Saved (Hover)</Label>
              <SaveButton saved className="bg-[var(--save-button-saved-background-hover)]" />
              <p className="text-caption text-foreground-muted">Darker green on hover</p>
            </div>
            <div className="space-y-2">
              <Label>Disabled</Label>
              <SaveButton disabled />
              <p className="text-caption text-foreground-muted">Reduced opacity, no interaction</p>
            </div>
          </div>
        </ComponentCard>

        {/* Save Button — Color Tokens */}
        <ComponentCard
          id="save-button-tokens"
          title="Color Tokens"
          description="SaveButton uses dedicated component tokens, not standard Button variants"
        >
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-muted text-left">
                    <th className="pb-2 pr-4 font-semibold text-foreground">Token</th>
                    <th className="pb-2 pr-4 font-semibold text-foreground">Light</th>
                    <th className="pb-2 font-semibold text-foreground">Usage</th>
                  </tr>
                </thead>
                <tbody className="text-foreground-muted">
                  <tr className="border-b border-border-muted">
                    <td className="py-2 pr-4">
                      <code className="rounded bg-background-muted px-1 text-xs">
                        --save-button-background
                      </code>
                    </td>
                    <td className="py-2 pr-4">
                      <span className="inline-flex items-center gap-2">
                        <span className="inline-block h-4 w-4 rounded border border-border-muted bg-[var(--primitive-blue-100)]" />
                        blue-100
                      </span>
                    </td>
                    <td className="py-2">Unsaved default background</td>
                  </tr>
                  <tr className="border-b border-border-muted">
                    <td className="py-2 pr-4">
                      <code className="rounded bg-background-muted px-1 text-xs">
                        --save-button-background-hover
                      </code>
                    </td>
                    <td className="py-2 pr-4">
                      <span className="inline-flex items-center gap-2">
                        <span className="inline-block h-4 w-4 rounded border border-border-muted bg-[var(--primitive-blue-200)]" />
                        blue-200
                      </span>
                    </td>
                    <td className="py-2">Unsaved hover background</td>
                  </tr>
                  <tr className="border-b border-border-muted">
                    <td className="py-2 pr-4">
                      <code className="rounded bg-background-muted px-1 text-xs">
                        --save-button-foreground
                      </code>
                    </td>
                    <td className="py-2 pr-4">
                      <span className="inline-flex items-center gap-2">
                        <span className="inline-block h-4 w-4 rounded border border-border-muted bg-[var(--primitive-green-800)]" />
                        green-800
                      </span>
                    </td>
                    <td className="py-2">Unsaved text + icon color</td>
                  </tr>
                  <tr className="border-b border-border-muted">
                    <td className="py-2 pr-4">
                      <code className="rounded bg-background-muted px-1 text-xs">
                        --save-button-saved-background
                      </code>
                    </td>
                    <td className="py-2 pr-4">
                      <span className="inline-flex items-center gap-2">
                        <span className="inline-block h-4 w-4 rounded border border-border-muted bg-[var(--primitive-green-200)]" />
                        green-200
                      </span>
                    </td>
                    <td className="py-2">Saved default background</td>
                  </tr>
                  <tr className="border-b border-border-muted">
                    <td className="py-2 pr-4">
                      <code className="rounded bg-background-muted px-1 text-xs">
                        --save-button-saved-background-hover
                      </code>
                    </td>
                    <td className="py-2 pr-4">
                      <span className="inline-flex items-center gap-2">
                        <span className="inline-block h-4 w-4 rounded border border-border-muted bg-[var(--primitive-green-300)]" />
                        green-300
                      </span>
                    </td>
                    <td className="py-2">Saved hover background</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">
                      <code className="rounded bg-background-muted px-1 text-xs">
                        --save-button-saved-foreground
                      </code>
                    </td>
                    <td className="py-2 pr-4">
                      <span className="inline-flex items-center gap-2">
                        <span className="inline-block h-4 w-4 rounded border border-border-muted bg-[var(--primitive-green-700)]" />
                        green-700
                      </span>
                    </td>
                    <td className="py-2">Saved text + icon color</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </ComponentCard>

        {/* Save Button — Real-World Example */}
        <RealWorldExample
          title="Job Detail Page"
          description="SaveButton in a job listing header alongside the Apply button"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-body-strong text-foreground">Solar Installation Lead</h3>
                  <p className="text-caption text-foreground-muted">
                    San Francisco, CA · Full-time · $95k–$120k
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <SaveButton size="lg" />
                  <Button variant="primary" size="lg">
                    Apply Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </RealWorldExample>

        {/* Save Button — Props Table */}
        <ComponentCard id="save-button-props" title="SaveButton Props">
          <PropsTable props={saveButtonProps} />
        </ComponentCard>
      </div>

      {/* Page Navigation */}
      <PageNavigation currentPath="/design-system/components/buttons" />
    </div>
  );
}
