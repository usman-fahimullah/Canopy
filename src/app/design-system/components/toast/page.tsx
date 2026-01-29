"use client";

import React from "react";
import { Toast, Button } from "@/components/ui";
import { ComponentCard, UsageGuide, AccessibilityInfo } from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";
import { Bell, Info } from "@phosphor-icons/react";

const toastProps = [
  { name: "variant", type: '"success" | "critical" | "warning" | "info"', default: '"info"', description: "Visual style variant" },
  { name: "children", type: "ReactNode", required: true, description: "Toast message content" },
  { name: "icon", type: "ReactNode", default: "undefined", description: "Override the default icon for the variant" },
  { name: "hideIcon", type: "boolean", default: "false", description: "Hide the icon completely" },
  { name: "dismissible", type: "boolean", default: "false", description: "Show a dismiss button" },
  { name: "onDismiss", type: "() => void", default: "undefined", description: "Callback when the toast is dismissed" },
  { name: "actionLabel", type: "string", default: "undefined", description: "Text for an action button" },
  { name: "onAction", type: "() => void", default: "undefined", description: "Click handler for the action button" },
  { name: "autoDismiss", type: "number", default: "undefined", description: "Auto-dismiss after duration (in ms)" },
];

export default function ToastPage() {
  const [showDismissible, setShowDismissible] = React.useState(true);
  const [showWithAction, setShowWithAction] = React.useState(true);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Toast
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          Toasts provide brief, non-blocking notifications about app processes.
          They appear temporarily and are typically used to confirm actions or
          display status messages.
        </p>
      </div>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Simple toast notification"
      >
        <CodePreview
          code={`<Toast variant="success">
  Your changes have been saved successfully.
</Toast>`}
        >
          <Toast variant="success">
            Your changes have been saved successfully.
          </Toast>
        </CodePreview>
      </ComponentCard>

      {/* Variants */}
      <ComponentCard
        id="variants"
        title="Variants"
        description="Different toast types for various scenarios"
      >
        <div className="space-y-4 max-w-lg">
          <Toast variant="success">
            Your changes have been saved successfully.
          </Toast>
          <Toast variant="critical">
            Something went wrong. Please try again.
          </Toast>
          <Toast variant="warning">
            Your session will expire in 5 minutes.
          </Toast>
          <Toast variant="info">
            A new version is available.
          </Toast>
        </div>
      </ComponentCard>

      {/* Dismissible */}
      <ComponentCard
        id="dismissible"
        title="Dismissible Toast"
        description="Toasts that can be manually dismissed by the user"
      >
        <CodePreview
          code={`const [show, setShow] = useState(true);

{show && (
  <Toast
    variant="success"
    dismissible
    onDismiss={() => setShow(false)}
  >
    File uploaded successfully
  </Toast>
)}`}
        >
          <div className="space-y-4 max-w-lg">
            {showDismissible ? (
              <Toast
                variant="success"
                dismissible
                onDismiss={() => setShowDismissible(false)}
              >
                File uploaded successfully — click X to dismiss
              </Toast>
            ) : (
              <div className="flex items-center gap-4">
                <p className="text-body-sm text-foreground-muted">Toast dismissed</p>
                <Button variant="secondary" size="sm" onClick={() => setShowDismissible(true)}>
                  Show again
                </Button>
              </div>
            )}
          </div>
        </CodePreview>
      </ComponentCard>

      {/* With Action */}
      <ComponentCard
        id="with-action"
        title="With Action Button"
        description="Toasts with an actionable button"
      >
        <CodePreview
          code={`<Toast
  variant="info"
  actionLabel="Undo"
  onAction={() => console.log("Undo clicked")}
>
  Item moved to trash
</Toast>

<Toast
  variant="success"
  actionLabel="View"
  onAction={() => console.log("View clicked")}
  dismissible
>
  Job posting published
</Toast>`}
        >
          <div className="space-y-4 max-w-lg">
            <Toast
              variant="info"
              actionLabel="Undo"
              onAction={() => console.log("Undo clicked")}
            >
              Item moved to trash
            </Toast>
            {showWithAction ? (
              <Toast
                variant="success"
                actionLabel="View"
                onAction={() => console.log("View clicked")}
                dismissible
                onDismiss={() => setShowWithAction(false)}
              >
                Job posting published
              </Toast>
            ) : (
              <div className="flex items-center gap-4">
                <p className="text-body-sm text-foreground-muted">Toast dismissed</p>
                <Button variant="secondary" size="sm" onClick={() => setShowWithAction(true)}>
                  Show again
                </Button>
              </div>
            )}
          </div>
        </CodePreview>
      </ComponentCard>

      {/* With Custom Icon */}
      <ComponentCard
        id="custom-icon"
        title="Custom Icon"
        description="Override the default variant icon"
      >
        <div className="space-y-4 max-w-lg">
          <Toast variant="info" icon={<Bell size={18} weight="fill" className="text-white" />}>
            You have 3 new notifications.
          </Toast>
          <Toast variant="success" icon={<Info size={18} weight="fill" className="text-white" />}>
            Profile updated with custom icon.
          </Toast>
        </div>
      </ComponentCard>

      {/* Hidden Icon */}
      <ComponentCard
        id="hidden-icon"
        title="Hidden Icon"
        description="Toast without any icon"
      >
        <div className="space-y-4 max-w-lg">
          <Toast variant="success" hideIcon>
            Changes saved (no icon).
          </Toast>
          <Toast variant="critical" hideIcon>
            Error occurred (no icon).
          </Toast>
        </div>
      </ComponentCard>

      {/* Auto-Dismiss */}
      <ComponentCard
        id="auto-dismiss"
        title="Auto-Dismiss"
        description="Toasts that automatically disappear after a set duration"
      >
        <CodePreview
          code={`<Toast variant="success" autoDismiss={5000}>
  Changes saved successfully!
</Toast>

<Toast variant="info" autoDismiss={3000}>
  Link copied to clipboard
</Toast>`}
        >
          <div className="space-y-4 max-w-lg">
            <p className="text-body-sm text-foreground-muted mb-4">
              Use <code className="bg-background-muted px-1 rounded">autoDismiss</code> to automatically
              hide toasts after a specified duration (in milliseconds). Recommended: 3-5 seconds for
              simple confirmations.
            </p>
            <Toast variant="success" autoDismiss={5000}>
              This toast will dismiss in 5 seconds
            </Toast>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Animation */}
      <ComponentCard
        id="animation"
        title="Animation"
        description="Toasts animate smoothly on enter and exit"
      >
        <div className="space-y-6">
          <div>
            <p className="text-body-sm text-foreground-muted mb-4">
              Toasts use subtle slide and fade animations for a polished feel. They enter from the
              bottom and exit downward when dismissed.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-background-subtle rounded-lg">
                <p className="text-caption-strong text-foreground mb-2">Enter Animation</p>
                <ul className="text-caption text-foreground-muted space-y-1">
                  <li>• Fade in from 0% to 100% opacity</li>
                  <li>• Slide up from +8px offset</li>
                  <li>• Duration: 200ms</li>
                  <li>• Easing: ease-out</li>
                </ul>
              </div>
              <div className="p-4 bg-background-subtle rounded-lg">
                <p className="text-caption-strong text-foreground mb-2">Exit Animation</p>
                <ul className="text-caption text-foreground-muted space-y-1">
                  <li>• Fade out from 100% to 0% opacity</li>
                  <li>• Slide down to +8px offset</li>
                  <li>• Duration: 200ms</li>
                  <li>• Easing: ease-out</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="p-4 border border-border-muted rounded-lg">
            <p className="text-caption-strong text-foreground mb-2">Reduced Motion</p>
            <p className="text-caption text-foreground-muted">
              Animations automatically respect the user&apos;s <code className="bg-background-muted px-1 rounded">prefers-reduced-motion</code> setting.
              When enabled, animations are disabled for accessibility.
            </p>
          </div>
        </div>
      </ComponentCard>

      {/* Use Cases */}
      <ComponentCard
        id="use-cases"
        title="Use Cases"
        description="Common toast scenarios in an ATS"
      >
        <div className="space-y-4 max-w-lg">
          <div>
            <p className="text-caption-strong text-foreground-muted mb-3">Form Submissions</p>
            <Toast variant="success">
              Job posting published successfully.
            </Toast>
          </div>
          <div>
            <p className="text-caption-strong text-foreground-muted mb-3">Error Handling</p>
            <Toast variant="critical" dismissible>
              File exceeds the maximum size limit of 10MB.
            </Toast>
          </div>
          <div>
            <p className="text-caption-strong text-foreground-muted mb-3">Undoable Actions</p>
            <Toast variant="info" actionLabel="Undo">
              Candidate moved to Rejected stage.
            </Toast>
          </div>
          <div>
            <p className="text-caption-strong text-foreground-muted mb-3">Warnings</p>
            <Toast variant="warning">
              Complete your company profile to improve job visibility.
            </Toast>
          </div>
        </div>
      </ComponentCard>

      {/* Props */}
      <ComponentCard id="props" title="Props">
        <PropsTable props={toastProps} />
      </ComponentCard>

      {/* Accessibility */}
      <AccessibilityInfo
        items={[
          "**Role**: Uses `role=\"alert\"` for screen reader announcements",
          "**Aria-live**: Critical toasts use `aria-live=\"assertive\"`, others use `aria-live=\"polite\"`",
          "**Dismiss button**: Has `aria-label=\"Dismiss toast\"` for screen readers",
          "**Auto-dismiss timing**: Should be long enough to read (5+ seconds recommended)",
          "**Color contrast**: All variants meet WCAG AA standards",
          "**Not color alone**: Icons help convey status alongside color",
        ]}
      />

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Use for brief, non-critical feedback",
          "Auto-dismiss informational toasts after 5 seconds",
          "Keep messages concise and actionable",
          "Use dismissible for errors so users can acknowledge them",
          "Include an Undo action for reversible operations",
          "Stack multiple toasts if needed (implement a toast queue)",
        ]}
        donts={[
          "Don't auto-dismiss error/critical toasts",
          "Don't use for critical confirmations (use dialogs)",
          "Don't show too many toasts at once",
          "Don't use for permanent information",
          "Don't use for long messages that need reading time",
          "Don't use toasts for form validation (use InlineMessage)",
        ]}
      />

      <PageNavigation currentPath="/design-system/components/toast" />
    </div>
  );
}
