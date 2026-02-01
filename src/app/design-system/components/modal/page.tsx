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
    type: '"default" | "lg" | "xl" | "full"',
    default: '"default"',
    description: "Modal size variant (640px, 800px, 1024px, or full viewport)",
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

const subComponentProps = [
  {
    name: "ModalTrigger",
    description: "Element that opens the modal. Use `asChild` to render as child element.",
  },
  {
    name: "ModalContent",
    description: "Container for modal content. Includes overlay and portal.",
  },
  {
    name: "ModalHeader",
    description: "Header section with close button and title area.",
  },
  {
    name: "ModalTitle",
    description: "Title text, rendered as heading-md (36px).",
  },
  {
    name: "ModalDescription",
    description: "Optional description text below title.",
  },
  {
    name: "ModalBody",
    description: "Main content area with proper padding.",
  },
  {
    name: "ModalContentBox",
    description: "Styled content section with subtle background.",
  },
  {
    name: "ModalFooter",
    description: "Footer area with right-aligned buttons.",
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
          Modals are larger overlay panels for complex content like forms, previews, or multi-step
          workflows. They block interaction with the page until dismissed, making them suitable for
          focused tasks.
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
            { name: "Header", description: "Contains close button and title" },
            { name: "Close Button", description: "Button to dismiss the modal" },
            { name: "Title", description: "Modal heading text" },
            { name: "Body", description: "Main content area" },
            { name: "Content Box (optional)", description: "Styled section for grouped content" },
            { name: "Footer", description: "Action buttons area" },
          ]}
        />
        <div className="mt-6 rounded-lg bg-background-subtle p-4">
          <p className="mb-4 text-caption text-foreground-muted">Structure overview:</p>
          <div className="max-w-sm rounded-xl border bg-surface p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background-muted">
                  <X size={16} className="text-foreground-muted" />
                </div>
                <span className="text-caption-sm text-foreground-muted">Close</span>
              </div>
              <div className="h-6 w-2/3 rounded bg-background-muted" />
              <div className="space-y-2 rounded-lg bg-background-subtle p-4">
                <div className="h-3 w-full rounded bg-background-muted" />
                <div className="h-3 w-4/5 rounded bg-background-muted" />
              </div>
              <div className="flex justify-end gap-2 border-t pt-2">
                <div className="h-8 w-16 rounded bg-background-muted" />
                <div className="h-8 w-16 rounded bg-[var(--background-brand)]" />
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
        description="The simplest way to use a modal"
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

<Modal>
  <ModalTrigger asChild>
    <Button>Open Modal</Button>
  </ModalTrigger>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Modal Title</ModalTitle>
    </ModalHeader>
    <ModalBody>
      <p>Modal content goes here...</p>
    </ModalBody>
    <ModalFooter>
      <Button variant="secondary">Cancel</Button>
      <Button>Save</Button>
    </ModalFooter>
  </ModalContent>
</Modal>`}
        >
          <Modal>
            <ModalTrigger asChild>
              <Button>Open Modal</Button>
            </ModalTrigger>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>Modal Title</ModalTitle>
              </ModalHeader>
              <ModalBody>
                <p className="text-body text-foreground-muted">
                  This is the modal body content. It can contain any content including forms,
                  previews, or complex layouts.
                </p>
              </ModalBody>
              <ModalFooter>
                <ModalClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </ModalClose>
                <Button>Save</Button>
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
                <ModalHeader>
                  <ModalTitle>Default Size</ModalTitle>
                </ModalHeader>
                <ModalBody>
                  <p className="text-body text-foreground-muted">
                    This is the default modal size at 640px width. Suitable for most forms and
                    simple content.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <ModalClose asChild>
                    <Button variant="secondary">Close</Button>
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
                <ModalHeader>
                  <ModalTitle>Large Size</ModalTitle>
                </ModalHeader>
                <ModalBody>
                  <p className="text-body text-foreground-muted">
                    Large modal at 800px width. Good for more complex forms with multiple columns or
                    larger content areas.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <ModalClose asChild>
                    <Button variant="secondary">Close</Button>
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
                    <Button variant="secondary">Close</Button>
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
                    <Button variant="secondary">Close</Button>
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
      <ComponentCard
        id="with-description"
        title="With Description"
        description="Modal with title and description text"
      >
        <CodePreview
          code={`<ModalHeader>
  <ModalTitle>Schedule Interview</ModalTitle>
  <ModalDescription>
    Select a time slot for the candidate interview.
  </ModalDescription>
</ModalHeader>`}
        >
          <Modal>
            <ModalTrigger asChild>
              <Button>Schedule Interview</Button>
            </ModalTrigger>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>Schedule Interview</ModalTitle>
                <ModalDescription>
                  Select a time slot and interview type for the candidate.
                </ModalDescription>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
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
                  <Button variant="secondary">Cancel</Button>
                </ModalClose>
                <Button>Schedule</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SECTION 6: CONTENT BOX
          ============================================ */}
      <ComponentCard
        id="content-box"
        title="Content Box"
        description="Use ModalContentBox for styled content sections"
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
              <ModalHeader>
                <ModalTitle>Content Box Example</ModalTitle>
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
          "Use for complex forms or multi-step workflows",
          "Choose the appropriate size for your content",
          "Use ModalContentBox to organize sections visually",
          "Provide clear primary and secondary actions in footer",
          "Use ModalDescription for context when needed",
        ]}
        donts={[
          "Don't use for simple confirmations (use Dialog)",
          "Don't overcrowd with too much content",
          "Don't use full-screen modals unless necessary",
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
        title="Create Job Posting"
        description="Form modal for creating a new job posting"
      >
        <Modal>
          <ModalTrigger asChild>
            <Button>Create Job Posting</Button>
          </ModalTrigger>
          <ModalContent size="lg">
            <ModalHeader>
              <ModalTitle>Create Job Posting</ModalTitle>
              <ModalDescription>
                Fill in the details for your new climate job posting.
              </ModalDescription>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
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
                <Button variant="secondary">Save as Draft</Button>
              </ModalClose>
              <Button>Publish Job</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </RealWorldExample>

      <RealWorldExample
        title="Candidate Profile View"
        description="Modal displaying candidate details with content boxes"
      >
        <Modal>
          <ModalTrigger asChild>
            <Button variant="secondary">View Candidate</Button>
          </ModalTrigger>
          <ModalContent size="lg">
            <ModalHeader>
              <div className="flex items-center gap-3">
                <Avatar name="Sarah Johnson" />
                <div>
                  <ModalTitle>Sarah Johnson</ModalTitle>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="feature" size="sm">
                      Interview
                    </Badge>
                    <span className="text-caption text-foreground-muted">Match Score: 92%</span>
                  </div>
                </div>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="w-full space-y-4">
                <ModalContentBox>
                  <div className="grid w-full gap-3 text-left text-sm">
                    <div className="flex items-center gap-2">
                      <EnvelopeSimple size={16} className="text-foreground-muted" />
                      <span>sarah.johnson@email.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-foreground-muted" />
                      <span>(555) 123-4567</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-foreground-muted" />
                      <span>San Francisco, CA</span>
                    </div>
                  </div>
                </ModalContentBox>
                <div className="rounded-lg bg-background-subtle p-4">
                  <h4 className="mb-2 text-body-strong text-foreground">Experience</h4>
                  <p className="text-body-sm text-foreground-muted">
                    5+ years in solar energy systems. Previously at SunPower and Tesla Energy.
                    Specialized in commercial installations and NABCEP certified.
                  </p>
                </div>
                <div className="rounded-lg bg-background-subtle p-4">
                  <h4 className="mb-2 text-body-strong text-foreground">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" size="sm">
                      Solar PV
                    </Badge>
                    <Badge variant="secondary" size="sm">
                      AutoCAD
                    </Badge>
                    <Badge variant="secondary" size="sm">
                      Project Management
                    </Badge>
                    <Badge
                      variant="success"
                      size="sm"
                      icon={<CheckCircle size={12} weight="bold" />}
                    >
                      NABCEP Certified
                    </Badge>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <ModalClose asChild>
                <Button variant="destructive">Reject</Button>
              </ModalClose>
              <Button leftIcon={<CalendarBlank size={16} />}>Schedule Interview</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </RealWorldExample>

      <RealWorldExample
        title="Confirmation with Content Box"
        description="Success confirmation using ModalContentBox"
      >
        <Modal>
          <ModalTrigger asChild>
            <Button variant="tertiary">View Confirmation</Button>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader hideCloseButton>
              <ModalTitle>Job Published</ModalTitle>
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
                <Button variant="secondary">View Job</Button>
              </ModalClose>
              <ModalClose asChild>
                <Button>Done</Button>
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
