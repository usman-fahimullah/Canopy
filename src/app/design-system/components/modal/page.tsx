"use client";

import React from "react";
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalContentBox,
  ModalFooter,
  ModalClose,
  ModalIconBadge,
  Button,
  Input,
  Label,
  Textarea,
  Badge,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
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
  CheckCircle,
  Warning,
  User,
  Briefcase,
  MapPin,
  EnvelopeSimple,
  Phone,
  CalendarBlank,
  X,
  TextAlignLeft,
  CheckSquare,
  Upload,
  Circle,
  PencilSimple,
} from "@phosphor-icons/react";

// ============================================
// PROPS DOCUMENTATION
// ============================================
const modalProps = [
  {
    name: "open",
    type: "boolean",
    default: "undefined",
    description: "Controlled open state",
  },
  {
    name: "onOpenChange",
    type: "(open: boolean) => void",
    default: "undefined",
    description: "Called when open state changes",
  },
  {
    name: "defaultOpen",
    type: "boolean",
    default: "false",
    description: "Default open state (uncontrolled)",
  },
  {
    name: "modal",
    type: "boolean",
    default: "true",
    description: "Whether to render as a modal (blocks interaction with outside)",
  },
  {
    name: "children",
    type: "ReactNode",
    required: true,
    description: "Trigger and content elements",
  },
];

const modalContentProps = [
  {
    name: "size",
    type: '"default" | "md" | "lg" | "xl" | "full"',
    default: '"default"',
    description:
      "Modal size variant (default: 640px, md: 720px, lg: 800px, xl: 1024px, full: viewport)",
  },
  {
    name: "hideCloseButton",
    type: "boolean",
    default: "false",
    description: "Hide the default close button",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Additional CSS classes",
  },
];

const modalHeaderProps = [
  {
    name: "icon",
    type: "ReactNode",
    default: "undefined",
    description: "Icon element rendered inside a ModalIconBadge in the header row",
  },
  {
    name: "iconBg",
    type: "string",
    default: "undefined",
    description: 'Background class for the icon badge, e.g. "bg-[var(--primitive-blue-200)]"',
  },
  {
    name: "variant",
    type: '"default" | "feature"',
    default: '"default"',
    description:
      "Header layout variant. Default: icon + title + close in a row with border-b. Feature: close button above title (legacy style for feature moments)",
  },
  {
    name: "hideCloseButton",
    type: "boolean",
    default: "false",
    description: "Hide the close button in header",
  },
  {
    name: "children",
    type: "ReactNode",
    description: "Header content (typically ModalTitle)",
  },
];

const modalTitleProps = [
  {
    name: "variant",
    type: '"default" | "large"',
    default: '"default"',
    description:
      "Title size variant. Default: text-body font-medium. Large: text-heading-md font-medium (for feature moments)",
  },
  {
    name: "children",
    type: "ReactNode",
    required: true,
    description: "Title text content",
  },
];

const subComponentProps = [
  {
    name: "ModalTrigger",
    description: "Element that opens the modal. Use `asChild` to render as child element.",
  },
  {
    name: "ModalContent",
    description:
      "Container for modal content. Includes overlay and portal. Supports size variants.",
  },
  {
    name: "ModalHeader",
    description:
      "Header section. Default: icon + title + close button in a row with border-b. Feature variant: close button above title.",
  },
  {
    name: "ModalIconBadge",
    description:
      "Colored icon badge for the modal header. Renders a rounded container for an icon with a background color.",
  },
  {
    name: "ModalTitle",
    description:
      "Title text. Default: text-body font-medium. Large variant: text-heading-md for feature moments.",
  },
  {
    name: "ModalDescription",
    description: "Optional description text below title.",
  },
  {
    name: "ModalBody",
    description: "Main content area with px-8 py-4 padding.",
  },
  {
    name: "ModalContentBox",
    description: "Centered content container with subtle background. Used for feature moments.",
  },
  {
    name: "ModalFooter",
    description: "Footer area with border-t and right-aligned buttons (px-8 py-4).",
  },
  {
    name: "ModalClose",
    description: "Close button primitive (can be used anywhere).",
  },
];

export default function ModalPage() {
  const [isControlledOpen, setIsControlledOpen] = React.useState(false);

  return (
    <div className="space-y-12">
      {/* ============================================
          SECTION 1: OVERVIEW
          ============================================ */}
      <div>
        <h1 id="overview" className="mb-2 text-heading-lg text-foreground">
          Modal
        </h1>
        <p className="mb-4 max-w-2xl text-body text-foreground-muted">
          Modals are overlay panels for focused tasks like configuration, forms, and multi-step
          workflows. They block interaction with the page until dismissed. The default layout
          features a structured header with an icon badge, title, and close button in a row,
          separated by borders. A &quot;feature&quot; variant is available for special moments like
          onboarding or success confirmations.
        </p>

        {/* Category Tags */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Badge variant="feature" icon={<Info size={14} weight="bold" />}>
            Overlay
          </Badge>
          <Badge variant="neutral" icon={<CheckCircle size={14} weight="bold" />}>
            Stable
          </Badge>
        </div>

        {/* When to Use / When Not to Use */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="bg-[var(--background-success)]/30 rounded-lg border border-[var(--border-success)] p-4">
            <h3 className="mb-2 font-semibold text-[var(--foreground-success)]">When to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>• Complex forms (job posting, candidate profile)</li>
              <li>• Multi-step workflows</li>
              <li>• Content previews (resume viewer, document)</li>
              <li>• Settings or configuration panels</li>
              <li>• Tasks requiring focused attention</li>
            </ul>
          </div>
          <div className="bg-[var(--background-error)]/30 rounded-lg border border-[var(--border-error)] p-4">
            <h3 className="mb-2 font-semibold text-[var(--foreground-error)]">When not to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>• Simple confirmations (use Dialog instead)</li>
              <li>• Brief messages or alerts</li>
              <li>• Actions that need quick dismiss</li>
              <li>• Content that could be inline</li>
              <li>• Mobile-first experiences (consider sheets)</li>
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
        description="The modal component consists of these parts"
      >
        <ComponentAnatomy
          parts={[
            {
              name: "Overlay",
              description: "Semi-transparent backdrop that blocks page interaction",
            },
            { name: "Container", description: "Main modal panel with rounded corners and shadow" },
            {
              name: "Header (border-b)",
              description:
                "Default: icon badge + title + close button in a flex row. Feature: close button above title",
            },
            {
              name: "Icon Badge (optional)",
              description: "Colored icon container in the header (default variant only)",
            },
            { name: "Title", description: "Modal heading text (body weight by default)" },
            { name: "Close Button", description: "Tertiary button to dismiss the modal" },
            { name: "Body", description: "Main content area (px-8 py-4)" },
            {
              name: "Content Box (optional)",
              description: "Centered content with subtle background (feature variant)",
            },
            { name: "Footer (border-t)", description: "Right-aligned action buttons (px-8 py-4)" },
          ]}
        />
        <div className="mt-6 rounded-lg bg-background-subtle p-4">
          <p className="mb-4 text-caption text-foreground-muted">
            Default layout (standard pattern):
          </p>
          <div className="max-w-sm rounded-xl border bg-surface">
            <div className="space-y-0">
              {/* Header row */}
              <div className="flex items-center gap-3 border-b px-4 py-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primitive-blue-200)]">
                  <User size={16} className="text-foreground" />
                </div>
                <div className="h-4 flex-1 rounded bg-background-muted" />
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background-muted">
                  <X size={14} className="text-foreground-muted" />
                </div>
              </div>
              {/* Body */}
              <div className="space-y-2 px-4 py-3">
                <div className="h-3 w-full rounded bg-background-muted" />
                <div className="h-3 w-4/5 rounded bg-background-muted" />
                <div className="h-3 w-3/5 rounded bg-background-muted" />
              </div>
              {/* Footer */}
              <div className="flex justify-end gap-2 border-t px-4 py-3">
                <div className="h-8 w-16 rounded bg-background-muted" />
                <div className="h-8 w-20 rounded bg-[var(--background-brand)]" />
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
        description="The standard modal pattern with icon header, bordered sections, and action footer"
      >
        <CodePreview
          code={`import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  Button,
} from "@/components/ui";
import { User } from "@phosphor-icons/react";

<Modal>
  <ModalTrigger asChild>
    <Button>Open Modal</Button>
  </ModalTrigger>
  <ModalContent size="md">
    <ModalHeader
      icon={<User weight="regular" className="h-6 w-6 text-foreground" />}
      iconBg="bg-[var(--primitive-blue-200)]"
    >
      <ModalTitle>Modal Title</ModalTitle>
    </ModalHeader>
    <ModalBody>
      <p>Modal content goes here...</p>
    </ModalBody>
    <ModalFooter>
      <Button variant="tertiary">Cancel</Button>
      <Button variant="primary">Save</Button>
    </ModalFooter>
  </ModalContent>
</Modal>`}
        >
          <Modal>
            <ModalTrigger asChild>
              <Button>Open Modal</Button>
            </ModalTrigger>
            <ModalContent size="md">
              <ModalHeader
                icon={<User weight="regular" className="h-6 w-6 text-foreground" />}
                iconBg="bg-[var(--primitive-blue-200)]"
              >
                <ModalTitle>Modal Title</ModalTitle>
              </ModalHeader>
              <ModalBody>
                <p className="text-body text-foreground-muted">
                  This is the default modal layout. The header shows an icon badge, title, and close
                  button in a row, separated from the body and footer by borders.
                </p>
              </ModalBody>
              <ModalFooter>
                <ModalClose asChild>
                  <Button variant="tertiary">Cancel</Button>
                </ModalClose>
                <Button variant="primary">Save</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SECTION 4: SIZES
          ============================================ */}
      <ComponentCard id="sizes" title="Sizes" description="Available modal size variants">
        <CodePreview
          code={`<ModalContent size="default">  {/* 640px */}
<ModalContent size="md">       {/* 720px - configuration modals */}
<ModalContent size="lg">       {/* 800px */}
<ModalContent size="xl">       {/* 1024px */}
<ModalContent size="full">     {/* Full viewport */}`}
        >
          <div className="flex flex-wrap gap-3">
            <Modal>
              <ModalTrigger asChild>
                <Button variant="secondary" size="sm">
                  Default (640px)
                </Button>
              </ModalTrigger>
              <ModalContent size="default">
                <ModalHeader
                  icon={<Info weight="regular" className="h-6 w-6 text-foreground" />}
                  iconBg="bg-[var(--primitive-blue-200)]"
                >
                  <ModalTitle>Default Size</ModalTitle>
                </ModalHeader>
                <ModalBody>
                  <p className="text-body text-foreground-muted">
                    Default modal at 640px width. Suitable for simple forms and content.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <ModalClose asChild>
                    <Button variant="tertiary">Close</Button>
                  </ModalClose>
                </ModalFooter>
              </ModalContent>
            </Modal>

            <Modal>
              <ModalTrigger asChild>
                <Button variant="secondary" size="sm">
                  Medium (720px)
                </Button>
              </ModalTrigger>
              <ModalContent size="md">
                <ModalHeader
                  icon={<PencilSimple weight="regular" className="h-6 w-6 text-foreground" />}
                  iconBg="bg-[var(--primitive-green-200)]"
                >
                  <ModalTitle>Medium Size</ModalTitle>
                </ModalHeader>
                <ModalBody>
                  <p className="text-body text-foreground-muted">
                    Medium modal at 720px width. The standard size for configuration and settings
                    modals.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <ModalClose asChild>
                    <Button variant="tertiary">Close</Button>
                  </ModalClose>
                </ModalFooter>
              </ModalContent>
            </Modal>

            <Modal>
              <ModalTrigger asChild>
                <Button variant="secondary" size="sm">
                  Large (800px)
                </Button>
              </ModalTrigger>
              <ModalContent size="lg">
                <ModalHeader
                  icon={<Briefcase weight="regular" className="h-6 w-6 text-foreground" />}
                  iconBg="bg-[var(--primitive-green-200)]"
                >
                  <ModalTitle>Large Size</ModalTitle>
                </ModalHeader>
                <ModalBody>
                  <p className="text-body text-foreground-muted">
                    Large modal at 800px width. Good for complex forms with multiple columns or
                    larger content areas.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <ModalClose asChild>
                    <Button variant="tertiary">Close</Button>
                  </ModalClose>
                </ModalFooter>
              </ModalContent>
            </Modal>

            <Modal>
              <ModalTrigger asChild>
                <Button variant="secondary" size="sm">
                  XL (1024px)
                </Button>
              </ModalTrigger>
              <ModalContent size="xl">
                <ModalHeader>
                  <ModalTitle>Extra Large Size</ModalTitle>
                </ModalHeader>
                <ModalBody>
                  <p className="text-body text-foreground-muted">
                    Extra large modal at 1024px width. Ideal for complex layouts, side-by-side
                    content, or document previews.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <ModalClose asChild>
                    <Button variant="tertiary">Close</Button>
                  </ModalClose>
                </ModalFooter>
              </ModalContent>
            </Modal>

            <Modal>
              <ModalTrigger asChild>
                <Button variant="secondary" size="sm">
                  Full Screen
                </Button>
              </ModalTrigger>
              <ModalContent size="full">
                <ModalHeader>
                  <ModalTitle>Full Screen</ModalTitle>
                </ModalHeader>
                <ModalBody>
                  <p className="text-body text-foreground-muted">
                    Full screen modal that takes up the entire viewport minus margins. Use sparingly
                    for immersive experiences like document editors.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <ModalClose asChild>
                    <Button variant="tertiary">Close</Button>
                  </ModalClose>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SECTION 5: WITH DESCRIPTION
          ============================================ */}
      {/* ============================================
          SECTION 5: WITH ICON BADGE
          ============================================ */}
      <ComponentCard
        id="with-icon"
        title="With Icon Badge"
        description="Headers with colored icon badges for context"
      >
        <CodePreview
          code={`<ModalHeader
  icon={<User weight="regular" className="h-6 w-6 text-foreground" />}
  iconBg="bg-[var(--primitive-blue-200)]"
>
  <ModalTitle>Personal Details</ModalTitle>
</ModalHeader>

{/* Different icon colors for different contexts */}
<ModalHeader
  icon={<Briefcase weight="regular" className="h-6 w-6 text-foreground" />}
  iconBg="bg-[var(--primitive-green-200)]"
>
  <ModalTitle>Career Details</ModalTitle>
</ModalHeader>`}
        >
          <div className="flex flex-wrap gap-3">
            {[
              {
                icon: <User weight="regular" className="h-6 w-6 text-foreground" />,
                bg: "bg-[var(--primitive-blue-200)]",
                title: "Personal Details",
                label: "Blue",
              },
              {
                icon: <Briefcase weight="regular" className="h-6 w-6 text-foreground" />,
                bg: "bg-[var(--primitive-green-200)]",
                title: "Career Details",
                label: "Green",
              },
              {
                icon: <TextAlignLeft weight="regular" className="h-6 w-6 text-foreground" />,
                bg: "bg-[var(--primitive-blue-200)]",
                title: "Text Question",
                label: "Blue",
              },
              {
                icon: <Circle weight="regular" className="h-6 w-6 text-foreground" />,
                bg: "bg-[var(--primitive-red-100)]",
                title: "Yes/No Question",
                label: "Red",
              },
              {
                icon: <CheckSquare weight="regular" className="h-6 w-6 text-foreground" />,
                bg: "bg-[var(--primitive-yellow-100)]",
                title: "Multiple Choice",
                label: "Yellow",
              },
              {
                icon: <Upload weight="regular" className="h-6 w-6 text-foreground" />,
                bg: "bg-[var(--primitive-blue-200)]",
                title: "File Upload",
                label: "Blue",
              },
            ].map((item) => (
              <Modal key={item.title}>
                <ModalTrigger asChild>
                  <Button variant="secondary" size="sm">
                    {item.title}
                  </Button>
                </ModalTrigger>
                <ModalContent size="md">
                  <ModalHeader icon={item.icon} iconBg={item.bg}>
                    <ModalTitle>{item.title}</ModalTitle>
                  </ModalHeader>
                  <ModalBody>
                    <p className="text-body text-foreground-muted">
                      This modal uses a {item.label.toLowerCase()} icon badge to provide visual
                      context for the {item.title.toLowerCase()} configuration.
                    </p>
                  </ModalBody>
                  <ModalFooter>
                    <ModalClose asChild>
                      <Button variant="tertiary">Discard</Button>
                    </ModalClose>
                    <Button variant="primary">Apply Changes</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            ))}
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SECTION 6: WITH DESCRIPTION
          ============================================ */}
      <ComponentCard
        id="with-description"
        title="With Description"
        description="Modal with title and description text in the body"
      >
        <CodePreview
          code={`<ModalHeader
  icon={<CalendarBlank weight="regular" className="h-6 w-6 text-foreground" />}
  iconBg="bg-[var(--primitive-blue-200)]"
>
  <ModalTitle>Schedule Interview</ModalTitle>
</ModalHeader>
<ModalBody>
  <ModalDescription>
    Select a time slot for the candidate interview.
  </ModalDescription>
  {/* form content */}
</ModalBody>`}
        >
          <Modal>
            <ModalTrigger asChild>
              <Button>Schedule Interview</Button>
            </ModalTrigger>
            <ModalContent size="md">
              <ModalHeader
                icon={<CalendarBlank weight="regular" className="h-6 w-6 text-foreground" />}
                iconBg="bg-[var(--primitive-blue-200)]"
              >
                <ModalTitle>Schedule Interview</ModalTitle>
              </ModalHeader>
              <ModalBody>
                <ModalDescription>
                  Select a time slot and interview type for the candidate.
                </ModalDescription>
                <div className="w-full space-y-4">
                  <div className="space-y-2">
                    <Label>Interview Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="phone">Phone Screen</SelectItem>
                        <SelectItem value="video">Video Call</SelectItem>
                        <SelectItem value="onsite">On-site</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date & Time</Label>
                    <Input type="datetime-local" />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <ModalClose asChild>
                  <Button variant="tertiary">Cancel</Button>
                </ModalClose>
                <Button variant="primary">Schedule</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SECTION 7: FEATURE VARIANT
          ============================================ */}
      <ComponentCard
        id="feature-variant"
        title="Feature Variant"
        description="Alternative layout for feature moments, onboarding, and confirmations"
      >
        <CodePreview
          code={`{/* Feature variant: close button above title, large heading */}
<ModalHeader variant="feature">
  <ModalTitle variant="large">Welcome to Canopy</ModalTitle>
  <ModalDescription>
    Let's set up your hiring workspace.
  </ModalDescription>
</ModalHeader>
<ModalBody>
  <ModalContentBox>
    {/* Centered content for feature moments */}
  </ModalContentBox>
</ModalBody>`}
        >
          <Modal>
            <ModalTrigger asChild>
              <Button variant="secondary">View Feature Variant</Button>
            </ModalTrigger>
            <ModalContent>
              <ModalHeader variant="feature">
                <ModalTitle variant="large">Welcome to Canopy</ModalTitle>
                <ModalDescription>
                  Let&apos;s set up your hiring workspace for climate recruitment.
                </ModalDescription>
              </ModalHeader>
              <ModalBody>
                <ModalContentBox>
                  <CheckCircle
                    size={48}
                    weight="fill"
                    className="text-[var(--foreground-success)]"
                  />
                  <h3 className="text-heading-sm text-foreground">Ready to Hire</h3>
                  <p className="text-body text-foreground-muted">
                    Your workspace is configured. Start posting jobs and attracting top climate
                    talent.
                  </p>
                </ModalContentBox>
              </ModalBody>
              <ModalFooter>
                <ModalClose asChild>
                  <Button variant="tertiary">Skip for Now</Button>
                </ModalClose>
                <Button variant="primary">Get Started</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SECTION 8: CONTENT BOX
          ============================================ */}
      <ComponentCard
        id="content-box"
        title="Content Box"
        description="Use ModalContentBox for styled content sections (typically with feature variant)"
      >
        <CodePreview
          code={`<ModalBody>
  <ModalContentBox>
    <Icon />
    <h3>Centered Content</h3>
    <p>Content boxes are great for empty states,
       confirmations, or centered content.</p>
  </ModalContentBox>
</ModalBody>`}
        >
          <Modal>
            <ModalTrigger asChild>
              <Button variant="secondary">View Content Box</Button>
            </ModalTrigger>
            <ModalContent>
              <ModalHeader variant="feature">
                <ModalTitle variant="large">Job Published</ModalTitle>
              </ModalHeader>
              <ModalBody>
                <ModalContentBox>
                  <CheckCircle
                    size={48}
                    weight="fill"
                    className="text-[var(--foreground-success)]"
                  />
                  <h3 className="text-heading-sm text-foreground">Application Submitted</h3>
                  <p className="text-body text-foreground-muted">
                    Your job posting has been submitted for review. You&apos;ll receive a
                    notification once it&apos;s approved.
                  </p>
                </ModalContentBox>
              </ModalBody>
              <ModalFooter>
                <ModalClose asChild>
                  <Button>Done</Button>
                </ModalClose>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SECTION 7: CONTROLLED USAGE
          ============================================ */}
      <ComponentCard
        id="controlled"
        title="Controlled Usage"
        description="Control the modal open state programmatically"
      >
        <CodePreview
          code={`const [open, setOpen] = React.useState(false);

<Modal open={open} onOpenChange={setOpen}>
  <ModalTrigger asChild>
    <Button>Open Modal</Button>
  </ModalTrigger>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Controlled Modal</ModalTitle>
    </ModalHeader>
    <ModalBody>
      <p>This modal is controlled via state.</p>
    </ModalBody>
    <ModalFooter>
      <Button onClick={() => setOpen(false)}>Close</Button>
    </ModalFooter>
  </ModalContent>
</Modal>

<Button onClick={() => setOpen(true)}>
  Open via State
</Button>`}
        >
          <div className="flex gap-3">
            <Modal open={isControlledOpen} onOpenChange={setIsControlledOpen}>
              <ModalTrigger asChild>
                <Button>Open Modal</Button>
              </ModalTrigger>
              <ModalContent>
                <ModalHeader>
                  <ModalTitle>Controlled Modal</ModalTitle>
                </ModalHeader>
                <ModalBody>
                  <p className="text-body text-foreground-muted">
                    This modal&apos;s open state is controlled programmatically. Current state:{" "}
                    <code className="rounded bg-background-muted px-1">
                      {isControlledOpen.toString()}
                    </code>
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button variant="secondary" onClick={() => setIsControlledOpen(false)}>
                    Close via State
                  </Button>
                  <ModalClose asChild>
                    <Button>Close via ModalClose</Button>
                  </ModalClose>
                </ModalFooter>
              </ModalContent>
            </Modal>
            <Button variant="secondary" onClick={() => setIsControlledOpen(true)}>
              Open via External Button
            </Button>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SECTION 8: PROPS TABLES
          ============================================ */}
      <ComponentCard id="props" title="Modal Props">
        <PropsTable props={modalProps} />
      </ComponentCard>

      <ComponentCard id="props-content" title="ModalContent Props">
        <PropsTable props={modalContentProps} />
      </ComponentCard>

      <ComponentCard id="props-header" title="ModalHeader Props">
        <PropsTable props={modalHeaderProps} />
      </ComponentCard>

      <ComponentCard id="props-title" title="ModalTitle Props">
        <PropsTable props={modalTitleProps} />
      </ComponentCard>

      <ComponentCard id="sub-components" title="Sub-Components">
        <div className="space-y-3">
          {subComponentProps.map((comp) => (
            <div
              key={comp.name}
              className="flex items-start gap-4 rounded-lg bg-background-subtle p-3"
            >
              <code className="whitespace-nowrap rounded bg-background-muted px-2 py-1 font-mono text-caption text-[var(--foreground-brand)]">
                {comp.name}
              </code>
              <p className="text-caption text-foreground-muted">{comp.description}</p>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* ============================================
          SECTION 9: USAGE GUIDELINES
          ============================================ */}
      <UsageGuide
        dos={[
          "Use the default variant with icon badge for configuration and form modals",
          "Use the feature variant for onboarding, success confirmations, and special moments",
          "Use size='md' (720px) for standard configuration modals",
          "Provide Discard/Apply or Cancel/Save actions in the footer",
          "Choose icon badge colors that match the content context",
        ]}
        donts={[
          "Don't use for simple confirmations (use Dialog)",
          "Don't mix default and feature variants in the same flow",
          "Don't use the feature variant for routine configuration",
          "Don't hide critical actions below the fold",
          "Don't nest modals within modals",
        ]}
      />

      {/* ============================================
          SECTION 10: ACCESSIBILITY
          ============================================ */}
      <AccessibilityInfo
        items={[
          "**Focus management**: Focus is trapped within the modal when open",
          "**Escape key**: Press Escape to close the modal",
          "**Click outside**: Clicking the overlay closes the modal",
          "**ARIA**: Uses `role='dialog'` and `aria-modal='true'`",
          "**Screen readers**: Title is announced via `aria-labelledby`",
          "**Focus restoration**: Focus returns to trigger element on close",
        ]}
      />

      {/* ============================================
          SECTION 11: RELATED COMPONENTS
          ============================================ */}
      <RelatedComponents
        components={[
          {
            name: "Dialog",
            href: "/design-system/components/dialog",
            description: "Simpler overlay for confirmations and alerts",
          },
          {
            name: "Sheet",
            href: "/design-system/components/sheet",
            description: "Slide-in panel from screen edge",
          },
          {
            name: "Popover",
            href: "/design-system/components/popover",
            description: "Small contextual overlays anchored to elements",
          },
        ]}
      />

      {/* ============================================
          SECTION 12: REAL-WORLD EXAMPLES
          ============================================ */}
      <RealWorldExample
        title="Apply Form Configuration"
        description="Configuration modal for customizing apply form fields (standard pattern)"
      >
        <Modal>
          <ModalTrigger asChild>
            <Button>Configure Personal Details</Button>
          </ModalTrigger>
          <ModalContent size="md">
            <ModalHeader
              icon={<User weight="regular" className="h-6 w-6 text-foreground" />}
              iconBg="bg-[var(--primitive-blue-200)]"
            >
              <ModalTitle>Personal Details</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <ModalDescription>
                Configure which personal detail fields candidates must fill out.
              </ModalDescription>
              <div className="w-full overflow-hidden rounded-lg border border-[var(--border-muted)]">
                <table className="w-full text-body-sm">
                  <thead>
                    <tr className="border-b bg-background-subtle">
                      <th className="px-4 py-2 text-left font-medium text-foreground-muted">
                        Field
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-foreground-muted">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { field: "Full Name", status: "Required" },
                      { field: "Email Address", status: "Required" },
                      { field: "Phone Number", status: "Optional" },
                      { field: "Location", status: "Optional" },
                      { field: "LinkedIn URL", status: "Hidden" },
                    ].map((row) => (
                      <tr key={row.field} className="border-b last:border-0">
                        <td className="px-4 py-2 text-foreground">{row.field}</td>
                        <td className="px-4 py-2">
                          <Badge
                            variant={
                              row.status === "Required"
                                ? "success"
                                : row.status === "Optional"
                                  ? "neutral"
                                  : "secondary"
                            }
                            size="sm"
                          >
                            {row.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ModalBody>
            <ModalFooter>
              <ModalClose asChild>
                <Button variant="tertiary">Discard</Button>
              </ModalClose>
              <Button variant="primary">Apply Changes</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </RealWorldExample>

      <RealWorldExample
        title="Job Posting Form"
        description="Form modal with icon header for creating content"
      >
        <Modal>
          <ModalTrigger asChild>
            <Button variant="secondary">Create Job Posting</Button>
          </ModalTrigger>
          <ModalContent size="lg">
            <ModalHeader
              icon={<Briefcase weight="regular" className="h-6 w-6 text-foreground" />}
              iconBg="bg-[var(--primitive-green-200)]"
            >
              <ModalTitle>Create Job Posting</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <ModalDescription>
                Fill in the details for your new climate job posting.
              </ModalDescription>
              <div className="w-full space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="job-title" required>
                    Job Title
                  </Label>
                  <Input id="job-title" placeholder="e.g., Solar Energy Engineer" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="e.g., San Francisco, CA" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Employment Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" required>
                    Job Description
                  </Label>
                  <Textarea
                    id="description"
                    rows={4}
                    placeholder="Describe the role, responsibilities, and impact..."
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <ModalClose asChild>
                <Button variant="tertiary">Save as Draft</Button>
              </ModalClose>
              <Button variant="primary">Publish Job</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </RealWorldExample>

      <RealWorldExample
        title="Feature Moment Confirmation"
        description="Success confirmation using feature variant with ModalContentBox"
      >
        <Modal>
          <ModalTrigger asChild>
            <Button variant="tertiary">View Confirmation</Button>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader variant="feature" hideCloseButton>
              <ModalTitle variant="large">Job Published</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <ModalContentBox>
                <CheckCircle size={56} weight="fill" className="text-[var(--foreground-success)]" />
                <h3 className="text-heading-sm text-foreground">Successfully Published!</h3>
                <p className="max-w-sm text-body text-foreground-muted">
                  Your job posting &quot;Senior Solar Engineer&quot; is now live and visible to
                  candidates on the Green Jobs Board.
                </p>
              </ModalContentBox>
            </ModalBody>
            <ModalFooter>
              <ModalClose asChild>
                <Button variant="tertiary">View Job</Button>
              </ModalClose>
              <ModalClose asChild>
                <Button variant="primary">Done</Button>
              </ModalClose>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </RealWorldExample>

      {/* Navigation */}
      <PageNavigation currentPath="/design-system/components/modal" />
    </div>
  );
}
