"use client";

import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  Button,
  Input,
  Label,
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
  Warning,
  WarningCircle,
  Trash,
  CheckCircle,
  Info,
  UserPlus,
  PaperPlaneTilt,
  Archive,
  X,
} from "@phosphor-icons/react";

// ============================================
// PROPS DOCUMENTATION
// ============================================
const dialogProps = [
  {
    name: "open",
    type: "boolean",
    default: "undefined",
    description: "Controlled open state of the dialog",
  },
  {
    name: "onOpenChange",
    type: "(open: boolean) => void",
    default: "undefined",
    description: "Callback when open state changes",
  },
  {
    name: "defaultOpen",
    type: "boolean",
    default: "false",
    description: "Initial open state for uncontrolled usage",
  },
  {
    name: "modal",
    type: "boolean",
    default: "true",
    description: "Whether the dialog is modal (blocks interaction with rest of page)",
  },
  {
    name: "children",
    type: "ReactNode",
    required: true,
    description: "DialogTrigger and DialogContent",
  },
];

const dialogContentProps = [
  {
    name: "hideCloseButton",
    type: "boolean",
    default: "false",
    description: "Hide the default close button in the top-right corner",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Additional CSS classes for custom styling",
  },
  {
    name: "onOpenAutoFocus",
    type: "(event: Event) => void",
    default: "undefined",
    description: "Custom focus behavior when dialog opens",
  },
  {
    name: "onCloseAutoFocus",
    type: "(event: Event) => void",
    default: "undefined",
    description: "Custom focus behavior when dialog closes",
  },
  {
    name: "onEscapeKeyDown",
    type: "(event: KeyboardEvent) => void",
    default: "undefined",
    description: "Custom behavior when Escape is pressed",
  },
  {
    name: "onPointerDownOutside",
    type: "(event: PointerDownOutsideEvent) => void",
    default: "undefined",
    description: "Custom behavior when clicking outside",
  },
  {
    name: "onInteractOutside",
    type: "(event: Event) => void",
    default: "undefined",
    description: "Custom behavior for any outside interaction",
  },
  {
    name: "children",
    type: "ReactNode",
    required: true,
    description: "Dialog content (header, body, footer)",
  },
];

const dialogTriggerProps = [
  {
    name: "asChild",
    type: "boolean",
    default: "false",
    description: "Merge props onto child element instead of rendering a button",
  },
  {
    name: "children",
    type: "ReactNode",
    required: true,
    description: "Trigger element or content",
  },
];

const dialogCloseProps = [
  {
    name: "asChild",
    type: "boolean",
    default: "false",
    description: "Merge props onto child element",
  },
  {
    name: "children",
    type: "ReactNode",
    required: true,
    description: "Close button content",
  },
];

export default function DialogPage() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

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
          Dialog
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl mb-4">
          A modal window that interrupts user flow to convey important
          information or require a decision. Dialogs block interaction with the
          rest of the page until dismissed.
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
              <li>• Confirmations for destructive actions</li>
              <li>• Important alerts requiring acknowledgment</li>
              <li>• Quick data entry (1-3 fields)</li>
              <li>• Focused tasks that need user attention</li>
            </ul>
          </div>
          <div className="p-4 bg-[var(--background-error)] rounded-lg border border-[var(--border-error)]">
            <h3 className="font-semibold text-[var(--foreground-error)] mb-2">
              When not to use
            </h3>
            <ul className="text-sm space-y-1 text-foreground-muted">
              <li>• Simple notifications (use Toast instead)</li>
              <li>• Long forms (use a page or Modal)</li>
              <li>• Content that doesn't require acknowledgment</li>
              <li>• Frequent, non-critical updates</li>
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
        description="The Dialog component is composed of these parts"
      >
        <ComponentAnatomy
          parts={[
            {
              name: "Dialog",
              description: "Root component that manages open/close state",
              required: true,
            },
            {
              name: "DialogTrigger",
              description: "Element that opens the dialog when clicked",
              required: true,
            },
            {
              name: "DialogContent",
              description:
                "Container for the dialog content, rendered in a portal",
              required: true,
            },
            {
              name: "DialogHeader",
              description: "Container for title and description",
            },
            {
              name: "DialogTitle",
              description: "Heading that labels the dialog",
            },
            {
              name: "DialogDescription",
              description: "Additional context about the dialog purpose",
            },
            {
              name: "DialogFooter",
              description: "Container for action buttons",
            },
            {
              name: "DialogClose",
              description: "Element that closes the dialog when clicked",
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
        description="Simple dialog with trigger, title, description, and actions"
      >
        <CodePreview
          code={`import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
} from "@/components/ui";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>
        This is a brief description of the dialog content.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="secondary">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog Title</DialogTitle>
                <DialogDescription>
                  This is a brief description of the dialog content.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="secondary">Cancel</Button>
                <Button>Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SECTION 4: VARIANTS
          ============================================ */}
      <ComponentCard
        id="variants"
        title="Dialog Patterns"
        description="Common dialog patterns for different use cases"
      >
        <div className="space-y-8">
          {/* Confirmation Dialog */}
          <div>
            <h4 className="text-body-strong mb-3">Confirmation Dialog</h4>
            <p className="text-caption text-foreground-muted mb-4">
              Use for actions that need explicit user confirmation
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="tertiary">View Confirmation Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-[var(--background-info)]">
                      <Info
                        size={20}
                        weight="fill"
                        className="text-[var(--foreground-info)]"
                      />
                    </div>
                    <DialogTitle>Confirm Action</DialogTitle>
                  </div>
                  <DialogDescription>
                    Are you sure you want to proceed with this action?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="secondary">Cancel</Button>
                  </DialogClose>
                  <Button>Confirm</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Destructive Dialog */}
          <div>
            <h4 className="text-body-strong mb-3">Destructive Dialog</h4>
            <p className="text-caption text-foreground-muted mb-4">
              Use for dangerous or irreversible actions
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" leftIcon={<Trash size={16} />}>
                  Delete Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-[var(--background-error)]">
                      <WarningCircle
                        size={20}
                        weight="fill"
                        className="text-[var(--foreground-error)]"
                      />
                    </div>
                    <DialogTitle>Delete Job Posting</DialogTitle>
                  </div>
                  <DialogDescription>
                    This action cannot be undone. All associated candidates and
                    application data will be permanently removed.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="secondary">Cancel</Button>
                  </DialogClose>
                  <Button variant="destructive">Delete Permanently</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Success Dialog */}
          <div>
            <h4 className="text-body-strong mb-3">Success Dialog</h4>
            <p className="text-caption text-foreground-muted mb-4">
              Use to confirm successful completion of an action
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="tertiary">View Success Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-[var(--background-success)]">
                      <CheckCircle
                        size={20}
                        weight="fill"
                        className="text-[var(--foreground-success)]"
                      />
                    </div>
                    <DialogTitle>Job Published!</DialogTitle>
                  </div>
                  <DialogDescription>
                    Your job posting is now live and accepting applications.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button>View Job</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Warning Dialog */}
          <div>
            <h4 className="text-body-strong mb-3">Warning Dialog</h4>
            <p className="text-caption text-foreground-muted mb-4">
              Use to warn about potential issues before proceeding
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="tertiary">View Warning Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-[var(--background-warning)]">
                      <Warning
                        size={20}
                        weight="fill"
                        className="text-[var(--foreground-warning)]"
                      />
                    </div>
                    <DialogTitle>Unsaved Changes</DialogTitle>
                  </div>
                  <DialogDescription>
                    You have unsaved changes. Are you sure you want to leave
                    this page? Your progress will be lost.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="secondary">Stay on Page</Button>
                  </DialogClose>
                  <Button variant="destructive">Leave Without Saving</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================
          SECTION 5: FORM DIALOG
          ============================================ */}
      <ComponentCard
        id="form-dialog"
        title="Form Dialog"
        description="Dialog with form inputs for quick data entry"
      >
        <CodePreview
          code={`<Dialog>
  <DialogTrigger asChild>
    <Button leftIcon={<UserPlus size={16} />}>
      Invite Team Member
    </Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Invite Team Member</DialogTitle>
      <DialogDescription>
        Send an invitation to join your organization.
      </DialogDescription>
    </DialogHeader>
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          placeholder="colleague@company.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Input id="role" placeholder="e.g., Recruiter, Hiring Manager" />
      </div>
    </div>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="secondary">Cancel</Button>
      </DialogClose>
      <Button leftIcon={<PaperPlaneTilt size={16} />}>
        Send Invite
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button leftIcon={<UserPlus size={16} />}>
                Invite Team Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to join your organization.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="colleague@company.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" placeholder="e.g., Recruiter, Hiring Manager" />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <Button leftIcon={<PaperPlaneTilt size={16} />}>
                  Send Invite
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SECTION 6: CONTROLLED USAGE
          ============================================ */}
      <ComponentCard
        id="controlled"
        title="Controlled Usage"
        description="Manage dialog state programmatically with React state"
      >
        <CodePreview
          code={`const [isOpen, setIsOpen] = React.useState(false);

// Open programmatically
<Button onClick={() => setIsOpen(true)}>
  Open Dialog
</Button>

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Controlled Dialog</DialogTitle>
      <DialogDescription>
        State is managed externally via React state.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button onClick={() => setIsOpen(false)}>
        Close
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
        >
          <div className="space-y-4">
            <Button onClick={() => setIsOpen(true)}>
              Open Controlled Dialog
            </Button>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Controlled Dialog</DialogTitle>
                  <DialogDescription>
                    This dialog&apos;s state is managed by React state. You can
                    close it by clicking outside, pressing Escape, or using the
                    button below.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button onClick={() => setIsOpen(false)}>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <p className="text-caption text-foreground-muted">
              Dialog state:{" "}
              <code className="bg-[var(--background-muted)] px-1.5 py-0.5 rounded">
                {isOpen ? "open" : "closed"}
              </code>
            </p>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SECTION 7: HIDE CLOSE BUTTON
          ============================================ */}
      <ComponentCard
        id="hide-close"
        title="Hide Close Button"
        description="Remove the default close button for custom layouts"
      >
        <CodePreview
          code={`<DialogContent hideCloseButton>
  <DialogHeader>
    <DialogTitle>Custom Close Behavior</DialogTitle>
  </DialogHeader>
  {/* Custom close buttons in footer */}
  <DialogFooter>
    <DialogClose asChild>
      <Button variant="secondary">Cancel</Button>
    </DialogClose>
    <Button>Confirm</Button>
  </DialogFooter>
</DialogContent>`}
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="tertiary">Open (No Close Button)</Button>
            </DialogTrigger>
            <DialogContent hideCloseButton>
              <DialogHeader>
                <DialogTitle>No Default Close Button</DialogTitle>
                <DialogDescription>
                  The default X button is hidden. Use the footer buttons to
                  close.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <Button>Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SECTION 8: PROPS TABLE
          ============================================ */}
      <ComponentCard id="props-dialog" title="Dialog Props">
        <PropsTable props={dialogProps} />
      </ComponentCard>

      <ComponentCard id="props-content" title="DialogContent Props">
        <PropsTable props={dialogContentProps} />
      </ComponentCard>

      <ComponentCard id="props-trigger" title="DialogTrigger Props">
        <PropsTable props={dialogTriggerProps} />
      </ComponentCard>

      <ComponentCard id="props-close" title="DialogClose Props">
        <PropsTable props={dialogCloseProps} />
      </ComponentCard>

      {/* ============================================
          SECTION 9: USAGE GUIDELINES
          ============================================ */}
      <UsageGuide
        dos={[
          "Use for decisions that require explicit user confirmation",
          "Provide clear, action-oriented button labels (Save, Delete, Confirm)",
          "Keep dialog content concise and focused",
          "Use destructive styling for dangerous actions",
          "Include both confirmation and cancel options",
        ]}
        donts={[
          "Don't use for simple notifications (use Toast instead)",
          "Don't nest dialogs within dialogs",
          "Don't use for long forms (use a page or Modal instead)",
          "Don't auto-open dialogs on page load",
          "Don't block users from dismissing non-critical dialogs",
        ]}
      />

      {/* ============================================
          SECTION 10: ACCESSIBILITY
          ============================================ */}
      <AccessibilityInfo
        items={[
          "**Focus management**: Focus is trapped within the dialog when open",
          "**Escape key**: Press Escape to close the dialog",
          "**Click outside**: Clicking the overlay closes the dialog by default",
          "**ARIA attributes**: Uses `role='dialog'` and `aria-modal='true'`",
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
            name: "Modal",
            href: "/design-system/components/modal",
            description: "Larger overlay for complex content and forms",
          },
          {
            name: "Sheet",
            href: "/design-system/components/sheet",
            description: "Slide-in panel from screen edge",
          },
          {
            name: "Toast",
            href: "/design-system/components/toast",
            description: "Non-blocking notifications for simple feedback",
          },
          {
            name: "Popover",
            href: "/design-system/components/popover",
            description: "Contextual overlay anchored to an element",
          },
        ]}
      />

      {/* ============================================
          SECTION 12: REAL-WORLD EXAMPLES
          ============================================ */}
      <RealWorldExample
        title="Delete Candidate Confirmation"
        description="Confirmation dialog for removing a candidate from the pipeline"
      >
        <CodePreview
          code={`<Dialog>
  <DialogTrigger asChild>
    <Button variant="destructive" size="sm">
      <Trash size={14} />
      Remove Candidate
    </Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-[var(--background-error)]">
          <WarningCircle
            size={20}
            weight="fill"
            className="text-[var(--foreground-error)]"
          />
        </div>
        <DialogTitle>Remove Candidate</DialogTitle>
      </div>
      <DialogDescription>
        Are you sure you want to remove Sarah Chen from the
        Solar Installation Manager position? This will delete
        all their application data and cannot be undone.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="secondary">Keep Candidate</Button>
      </DialogClose>
      <Button variant="destructive">Remove Permanently</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm" leftIcon={<Trash size={14} />}>
                Remove Candidate
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-[var(--background-error)]">
                    <WarningCircle
                      size={20}
                      weight="fill"
                      className="text-[var(--foreground-error)]"
                    />
                  </div>
                  <DialogTitle>Remove Candidate</DialogTitle>
                </div>
                <DialogDescription>
                  Are you sure you want to remove Sarah Chen from the Solar
                  Installation Manager position? This will delete all their
                  application data and cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary">Keep Candidate</Button>
                </DialogClose>
                <Button variant="destructive">Remove Permanently</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CodePreview>
      </RealWorldExample>

      <RealWorldExample
        title="Archive Job Posting"
        description="Confirmation to archive a job posting"
      >
        <CodePreview
          code={`<Dialog>
  <DialogTrigger asChild>
    <Button variant="tertiary" size="sm">
      <Archive size={16} />
      Archive Job
    </Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-[var(--background-warning)]">
          <Archive
            size={20}
            weight="fill"
            className="text-[var(--foreground-warning)]"
          />
        </div>
        <DialogTitle>Archive Job Posting</DialogTitle>
      </div>
      <DialogDescription>
        Archiving will close this job to new applications.
        Existing candidates will remain in the pipeline.
        You can restore archived jobs at any time.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="secondary">Cancel</Button>
      </DialogClose>
      <Button>Archive Job</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="tertiary" size="sm" leftIcon={<Archive size={16} />}>
                Archive Job
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-[var(--background-warning)]">
                    <Archive
                      size={20}
                      weight="fill"
                      className="text-[var(--foreground-warning)]"
                    />
                  </div>
                  <DialogTitle>Archive Job Posting</DialogTitle>
                </div>
                <DialogDescription>
                  Archiving will close this job to new applications. Existing
                  candidates will remain in the pipeline. You can restore
                  archived jobs at any time.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <Button>Archive Job</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CodePreview>
      </RealWorldExample>

      <RealWorldExample
        title="Quick Note Entry"
        description="Simple form dialog for adding a note to a candidate"
      >
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogTrigger asChild>
            <Button variant="tertiary" size="sm">Add Quick Note</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Note</DialogTitle>
              <DialogDescription>
                Add a quick note about this candidate. Notes are visible to your
                team.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <textarea
                className="w-full h-24 px-3 py-2 text-sm border border-[var(--border-default)] rounded-lg bg-[var(--background-default)] focus:outline-none focus:ring-2 focus:ring-[var(--border-interactive-focus)]"
                placeholder="Enter your note..."
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button onClick={() => setConfirmOpen(false)}>Save Note</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </RealWorldExample>

      <PageNavigation currentPath="/design-system/components/dialog" />
    </div>
  );
}
