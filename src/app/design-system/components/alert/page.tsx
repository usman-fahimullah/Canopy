"use client";

import React from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui";
import { ComponentCard, UsageGuide, AccessibilityInfo } from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";

const alertProps = [
  { name: "variant", type: '"feature" | "critical" | "warning" | "success" | "info"', default: '"info"', description: "Visual style variant" },
  { name: "children", type: "ReactNode", required: true, description: "Alert message content" },
  { name: "title", type: "ReactNode", default: "undefined", description: "Optional title displayed above the message" },
  { name: "icon", type: "ReactNode", default: "undefined", description: "Custom icon (auto-selected by variant)" },
  { name: "hideIcon", type: "boolean", default: "false", description: "Hide the icon" },
  { name: "actionLabel", type: "string", default: "undefined", description: "Action button text" },
  { name: "onAction", type: "() => void", default: "undefined", description: "Action button click handler" },
  { name: "action", type: "ReactNode", default: "undefined", description: "Custom action element" },
  { name: "dismissible", type: "boolean", default: "true", description: "Show close button" },
  { name: "onDismiss", type: "() => void", default: "undefined", description: "Callback when dismissed" },
  { name: "autoDismiss", type: "number", default: "undefined", description: "Auto-dismiss after duration (in milliseconds)" },
  { name: "showProgress", type: "boolean", default: "false", description: "Show progress bar during auto-dismiss countdown" },
];

export default function AlertPage() {
  const [showDismissible, setShowDismissible] = React.useState(true);
  const [showAutoDismiss, setShowAutoDismiss] = React.useState(true);
  const [showAutoDismissProgress, setShowAutoDismissProgress] = React.useState(true);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Alert
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          Alerts display important messages to users with a left border accent.
          Use them for inline notifications, status updates, or contextual messages.
        </p>
      </div>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Simple alert with message content"
      >
        <CodePreview
          code={`<Alert variant="info">
  This is an informational message for the user.
</Alert>`}
        >
          <Alert variant="info">
            This is an informational message for the user.
          </Alert>
        </CodePreview>
      </ComponentCard>

      {/* Variants */}
      <ComponentCard
        id="variants"
        title="Variants"
        description="Different alert types for various contexts"
      >
        <div className="space-y-4">
          <Alert variant="feature">
            New feature available! Check out our AI-powered candidate matching.
          </Alert>
          <Alert variant="critical">
            Failed to save changes. Please try again.
          </Alert>
          <Alert variant="warning">
            Your session will expire in 5 minutes.
          </Alert>
          <Alert variant="success">
            The job posting has been published and is now live.
          </Alert>
          <Alert variant="info">
            Your profile has been updated successfully.
          </Alert>
        </div>
      </ComponentCard>

      {/* With Title */}
      <ComponentCard
        id="with-title"
        title="With Title"
        description="Alerts can include a title for additional context"
      >
        <CodePreview
          code={`<Alert variant="warning" title="Action Required">
  Please review the pending items before continuing.
</Alert>

<Alert variant="success" title="Job Published">
  Your Solar Engineer position is now live on the job board.
</Alert>`}
        >
          <div className="space-y-4">
            <Alert variant="warning" title="Action Required">
              Please review the pending items before continuing.
            </Alert>
            <Alert variant="success" title="Job Published">
              Your Solar Engineer position is now live on the job board.
            </Alert>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* With Action */}
      <ComponentCard
        id="with-action"
        title="With Action Button"
        description="Alert with an action button for user interaction"
      >
        <div className="space-y-4">
          <Alert variant="feature" actionLabel="Upgrade" onAction={() => console.log("Upgrade clicked")}>
            Upgrade to Pro to unlock AI-powered candidate sourcing.
          </Alert>
          <Alert variant="warning" actionLabel="Review" onAction={() => console.log("Review clicked")}>
            3 candidates are awaiting review in your pipeline.
          </Alert>
        </div>
      </ComponentCard>

      {/* Without Icon */}
      <ComponentCard
        id="without-icon"
        title="Without Icon"
        description="Clean alert without the icon"
      >
        <Alert variant="info" hideIcon>
          You can use drag and drop to reorder candidates in the pipeline.
        </Alert>
      </ComponentCard>

      {/* Dismissible */}
      <ComponentCard
        id="dismissible"
        title="Dismissible"
        description="Alert that can be closed by the user"
      >
        <div className="space-y-4">
          {showDismissible ? (
            <Alert
              variant="feature"
              dismissible
              onDismiss={() => setShowDismissible(false)}
            >
              Welcome to Canopy! Get started by creating your first job posting.
            </Alert>
          ) : (
            <div className="flex items-center gap-4">
              <p className="text-body-sm text-foreground-muted">Alert dismissed</p>
              <Button variant="secondary" size="sm" onClick={() => setShowDismissible(true)}>
                Show again
              </Button>
            </div>
          )}
        </div>
      </ComponentCard>

      {/* Non-dismissible */}
      <ComponentCard
        id="non-dismissible"
        title="Non-dismissible"
        description="Important alerts that cannot be dismissed"
      >
        <Alert variant="critical" dismissible={false}>
          System maintenance scheduled for tonight at 11 PM EST.
        </Alert>
      </ComponentCard>

      {/* Auto-dismiss */}
      <ComponentCard
        id="auto-dismiss"
        title="Auto-Dismiss"
        description="Alerts that automatically disappear after a set duration"
      >
        <CodePreview
          code={`<Alert variant="success" autoDismiss={5000}>
  Changes saved successfully!
</Alert>

<Alert variant="success" autoDismiss={5000} showProgress>
  Changes saved - this alert will dismiss with a progress bar
</Alert>`}
        >
          <div className="space-y-4">
            {showAutoDismiss ? (
              <Alert
                variant="success"
                autoDismiss={5000}
                onDismiss={() => setShowAutoDismiss(false)}
              >
                Changes saved successfully! (auto-dismisses in 5 seconds)
              </Alert>
            ) : (
              <div className="flex items-center gap-4">
                <p className="text-body-sm text-foreground-muted">Alert auto-dismissed</p>
                <Button variant="secondary" size="sm" onClick={() => setShowAutoDismiss(true)}>
                  Show again
                </Button>
              </div>
            )}

            {showAutoDismissProgress ? (
              <Alert
                variant="info"
                autoDismiss={8000}
                showProgress
                onDismiss={() => setShowAutoDismissProgress(false)}
              >
                This alert shows a progress bar as it counts down (8 seconds)
              </Alert>
            ) : (
              <div className="flex items-center gap-4">
                <p className="text-body-sm text-foreground-muted">Progress alert auto-dismissed</p>
                <Button variant="secondary" size="sm" onClick={() => setShowAutoDismissProgress(true)}>
                  Show again
                </Button>
              </div>
            )}
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Use Cases */}
      <ComponentCard
        id="use-cases"
        title="Use Cases"
        description="Common alert scenarios in an ATS"
      >
        <div className="space-y-4">
          <div>
            <p className="text-caption-strong text-foreground-muted mb-2">Feature Announcement</p>
            <Alert variant="feature" actionLabel="Learn More" dismissible>
              New: AI-Powered Matching is now available for all Pro users.
            </Alert>
          </div>
          <div>
            <p className="text-caption-strong text-foreground-muted mb-2">Error State</p>
            <Alert variant="critical" actionLabel="Retry">
              Failed to load candidates. Please check your connection.
            </Alert>
          </div>
          <div>
            <p className="text-caption-strong text-foreground-muted mb-2">Warning with Title</p>
            <Alert variant="warning" title="Subscription Expiring" actionLabel="Renew">
              Your Pro subscription expires in 3 days.
            </Alert>
          </div>
          <div>
            <p className="text-caption-strong text-foreground-muted mb-2">Success Message</p>
            <Alert variant="success">
              Job posting approved and now visible on all job boards.
            </Alert>
          </div>
          <div>
            <p className="text-caption-strong text-foreground-muted mb-2">Info Message</p>
            <Alert variant="info">
              Tip: Use keyboard shortcuts to navigate faster. Press ? for help.
            </Alert>
          </div>
        </div>
      </ComponentCard>

      {/* Animation */}
      <ComponentCard
        id="animation"
        title="Animation"
        description="Alerts animate smoothly on enter and exit"
      >
        <div className="space-y-6">
          <div>
            <p className="text-body-sm text-foreground-muted mb-4">
              Alerts use subtle slide and fade animations for a polished feel. The enter animation
              plays when the alert mounts, and the exit animation plays when dismissed.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-background-subtle rounded-lg">
                <p className="text-caption-strong text-foreground mb-2">Enter Animation</p>
                <ul className="text-caption text-foreground-muted space-y-1">
                  <li>• Fade in from 0% to 100% opacity</li>
                  <li>• Slide down from -4px offset</li>
                  <li>• Duration: 200ms</li>
                  <li>• Easing: ease-out</li>
                </ul>
              </div>
              <div className="p-4 bg-background-subtle rounded-lg">
                <p className="text-caption-strong text-foreground mb-2">Exit Animation</p>
                <ul className="text-caption text-foreground-muted space-y-1">
                  <li>• Fade out from 100% to 0% opacity</li>
                  <li>• Slide up to -4px offset</li>
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

      {/* Props */}
      <ComponentCard id="props" title="Props">
        <PropsTable props={alertProps} />
      </ComponentCard>

      {/* Accessibility */}
      <AccessibilityInfo
        items={[
          "**Role**: Uses `role=\"alert\"` for screen reader announcements",
          "**Aria-live**: Critical alerts use `aria-live=\"assertive\"`, others use `aria-live=\"polite\"`",
          "**Icons**: Have appropriate contrast and use `aria-hidden=\"true\"`",
          "**Dismiss button**: Keyboard accessible with `aria-label=\"Dismiss alert\"`",
          "**Focus ring**: Visible focus indicator on interactive elements",
          "**Color contrast**: All variants meet WCAG AA standards (4.5:1 ratio)",
          "**Not color alone**: Icons differentiate alert types alongside color",
        ]}
      />

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Use appropriate variant for the message type",
          "Keep alert messages concise and actionable",
          "Use dismissible for non-critical alerts",
          "Position alerts prominently where relevant",
          "Use action buttons for clear next steps",
          "Use autoDismiss for success confirmations",
          "Add title for alerts with important context",
        ]}
        donts={[
          "Don't use alerts for marketing messages",
          "Don't show too many alerts at once",
          "Don't use critical variant for non-error messages",
          "Don't auto-dismiss important alerts",
          "Don't make critical system alerts dismissible",
          "Don't use autoDismiss with very short durations (< 3 seconds)",
        ]}
      />

      <PageNavigation currentPath="/design-system/components/alert" />
    </div>
  );
}
