"use client";

import React from "react";
import { Banner, Badge, Button, Label } from "@/components/ui";
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
  Flag,
  Warning,
  WarningDiamond,
  CheckCircle,
  Info,
  Megaphone,
  Gift,
  ArrowRight,
  Sparkle,
} from "@phosphor-icons/react";

// ============================================
// PROPS DOCUMENTATION
// ============================================
const bannerProps = [
  {
    name: "type",
    type: '"critical" | "warning" | "success" | "info" | "feature"',
    default: '"info"',
    description: "The type/severity of the banner which determines colors and icon",
  },
  {
    name: "title",
    type: "ReactNode",
    required: true,
    description: "Main title text (required)",
  },
  {
    name: "description",
    type: "ReactNode",
    default: "undefined",
    description: "Optional description text below the title",
  },
  {
    name: "icon",
    type: "ReactNode",
    default: "undefined",
    description: "Custom icon to override the default variant icon",
  },
  {
    name: "hideIcon",
    type: "boolean",
    default: "false",
    description: "Hide the icon completely",
  },
  {
    name: "actionLabel",
    type: "string",
    default: "undefined",
    description: "Text for the action button",
  },
  {
    name: "onAction",
    type: "() => void",
    default: "undefined",
    description: "Click handler for the action button",
  },
  {
    name: "actionButtonProps",
    type: "ButtonProps",
    default: "undefined",
    description: "Additional props to pass to the action button (variant, size, leftIcon, rightIcon, loading, etc.)",
  },
  {
    name: "action",
    type: "ReactNode",
    default: "undefined",
    description: "Custom action element (overrides actionLabel and actionButtonProps)",
  },
  {
    name: "dismissible",
    type: "boolean",
    default: "true",
    description: "Whether the banner can be dismissed",
  },
  {
    name: "onDismiss",
    type: "() => void",
    default: "undefined",
    description: "Called when the banner is dismissed",
  },
  {
    name: "linkStyle",
    type: "boolean",
    default: "false",
    description: "Show action as a link with arrow instead of button",
  },
  {
    name: "fullWidth",
    type: "boolean",
    default: "false",
    description: "Full-width mode (no border radius, for page-top banners)",
  },
  {
    name: "subtle",
    type: "boolean",
    default: "false",
    description: "Use subtle styling (tinted background with dark text) instead of bold solid colors",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Additional CSS classes",
  },
];

export default function BannerPage() {
  const [showBanners, setShowBanners] = React.useState({
    dismissible1: true,
    dismissible2: true,
    dismissible3: true,
  });

  const resetBanners = () => {
    setShowBanners({
      dismissible1: true,
      dismissible2: true,
      dismissible3: true,
    });
  };

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
          Banner
        </h1>
        <p className="text-body text-foreground-muted mb-4 max-w-2xl">
          Banners are full-width notification components for displaying important
          messages, alerts, or promotional content. They support multiple severity
          levels and can include actions and dismissal controls.
        </p>

        {/* Category Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge variant="feature" icon={<Info size={14} weight="bold" />}>
            Feedback
          </Badge>
          <Badge
            variant="neutral"
            icon={<CheckCircle size={14} weight="bold" />}
          >
            Stable
          </Badge>
        </div>

        {/* When to Use / When Not to Use */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-[var(--background-success)]/30 rounded-lg border border-[var(--border-success)]">
            <h3 className="font-semibold text-[var(--foreground-success)] mb-2">
              When to use
            </h3>
            <ul className="text-sm space-y-1 text-foreground-muted">
              <li>* System-wide announcements or alerts</li>
              <li>* Important status messages that affect user workflow</li>
              <li>* Promotional messages or feature announcements</li>
              <li>* Critical warnings that need immediate attention</li>
              <li>* Success confirmations for major actions</li>
            </ul>
          </div>
          <div className="p-4 bg-[var(--background-error)]/30 rounded-lg border border-[var(--border-error)]">
            <h3 className="font-semibold text-[var(--foreground-error)] mb-2">
              When not to use
            </h3>
            <ul className="text-sm space-y-1 text-foreground-muted">
              <li>* For inline form validation (use InlineMessage)</li>
              <li>* For transient notifications (use Toast)</li>
              <li>* For contextual help text (use Tooltip)</li>
              <li>* When the message only affects a small area</li>
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
        description="The banner component consists of these parts"
      >
        <ComponentAnatomy
          parts={[
            { name: "Container", description: "Full-width background with rounded corners (8px)" },
            { name: "Icon", description: "Leading icon indicating the banner type (20px)" },
            { name: "Content", description: "Title (bold) and optional description text" },
            { name: "Action", description: "Optional button or custom action element" },
            { name: "Dismiss", description: "Close button to dismiss the banner" },
          ]}
        />
        <div className="mt-6 p-4 bg-background-subtle rounded-lg">
          <p className="text-caption text-foreground-muted mb-4">Live anatomy example:</p>
          <div className="relative">
            <Banner
              type="feature"
              title="New Feature Available"
              description="Check out our latest climate impact reporting tools."
              actionLabel="Learn More"
              dismissible={false}
            />
            <div className="absolute -top-2 left-2 w-5 h-5 bg-[var(--foreground-brand)] text-white rounded-full flex items-center justify-center text-xs font-medium z-10">
              1
            </div>
            <div className="absolute -top-2 left-9 w-5 h-5 bg-[var(--foreground-brand)] text-white rounded-full flex items-center justify-center text-xs font-medium z-10">
              2
            </div>
            <div className="absolute -top-2 left-36 w-5 h-5 bg-[var(--foreground-brand)] text-white rounded-full flex items-center justify-center text-xs font-medium z-10">
              3
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
        description="The simplest way to use a banner"
      >
        <CodePreview
          code={`import { Banner } from "@/components/ui";

<Banner title="This is an informational banner" />

<Banner
  type="success"
  title="Changes saved successfully"
/>

<Banner
  type="warning"
  title="Your session will expire in 5 minutes"
/>`}
        >
          <div className="space-y-4">
            <Banner title="This is an informational banner" dismissible={false} />
            <Banner type="success" title="Changes saved successfully" dismissible={false} />
            <Banner type="warning" title="Your session will expire in 5 minutes" dismissible={false} />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SECTION 4: VARIANTS/TYPES
          ============================================ */}
      <ComponentCard
        id="variants"
        title="Types"
        description="All available banner types for different use cases"
      >
        <div className="space-y-6">
          {/* Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label className="font-semibold">Info (Default)</Label>
              <span className="text-caption text-foreground-muted">- General information and announcements</span>
            </div>
            <Banner
              type="info"
              title="New candidates have been added to your pipeline"
              description="3 candidates were automatically matched to your Solar Engineer position."
              dismissible={false}
            />
          </div>

          {/* Feature */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label className="font-semibold">Feature</Label>
              <span className="text-caption text-foreground-muted">- Promotional content and new features</span>
            </div>
            <Banner
              type="feature"
              title="Introducing AI-Powered Candidate Matching"
              description="Our new AI matching system helps you find the best climate talent faster."
              dismissible={false}
            />
          </div>

          {/* Success */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label className="font-semibold">Success</Label>
              <span className="text-caption text-foreground-muted">- Successful actions and confirmations</span>
            </div>
            <Banner
              type="success"
              title="Job posting published successfully"
              description="Your Solar Installation Manager position is now live on Green Jobs Board."
              dismissible={false}
            />
          </div>

          {/* Warning */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label className="font-semibold">Warning</Label>
              <span className="text-caption text-foreground-muted">- Warnings that need attention</span>
            </div>
            <Banner
              type="warning"
              title="Your trial ends in 3 days"
              description="Upgrade now to keep access to all features and your candidate data."
              dismissible={false}
            />
          </div>

          {/* Critical */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label className="font-semibold">Critical</Label>
              <span className="text-caption text-foreground-muted">- Critical errors and urgent alerts</span>
            </div>
            <Banner
              type="critical"
              title="Payment failed"
              description="We couldn't process your payment. Please update your billing information."
              dismissible={false}
            />
          </div>
        </div>
      </ComponentCard>

      {/* ============================================
          SECTION 5: SUBTLE STYLE
          ============================================ */}
      <ComponentCard
        id="subtle"
        title="Subtle Style"
        description="A less visually intense version with tinted backgrounds and dark text"
      >
        <div className="space-y-4">
          <p className="text-body-sm text-foreground-muted mb-4">
            Use the <code className="bg-background-muted px-1 rounded">subtle</code> prop for banners that need
            to be present but shouldn&apos;t dominate the interface. Ideal for informational messages, hints,
            or secondary notifications.
          </p>
          <CodePreview
            code={`// Subtle banners have tinted backgrounds with dark text
<Banner type="info" title="Tip: Use keyboard shortcuts" subtle />
<Banner type="success" title="Changes auto-saved" subtle />
<Banner type="warning" title="Your session will expire soon" subtle />
<Banner type="critical" title="Some fields need attention" subtle />
<Banner type="feature" title="New: Dark mode is available" subtle />`}
          >
            <div className="space-y-3">
              <Banner type="info" title="Tip: Use keyboard shortcuts to navigate faster" subtle dismissible={false} />
              <Banner type="success" title="Changes auto-saved" subtle dismissible={false} />
              <Banner type="warning" title="Your session will expire in 5 minutes" subtle dismissible={false} />
              <Banner type="critical" title="Some required fields need attention" subtle dismissible={false} />
              <Banner type="feature" title="New: Dark mode is now available in settings" subtle dismissible={false} />
            </div>
          </CodePreview>
        </div>

        {/* Comparison */}
        <div className="mt-8 pt-6 border-t border-border-muted">
          <h4 className="text-body-strong text-foreground mb-4">Bold vs Subtle Comparison</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-caption-strong text-foreground-muted mb-3">Bold (Default)</p>
              <div className="space-y-3">
                <Banner type="feature" title="New feature available" dismissible={false} />
                <Banner type="success" title="Changes saved" dismissible={false} />
              </div>
            </div>
            <div>
              <p className="text-caption-strong text-foreground-muted mb-3">Subtle</p>
              <div className="space-y-3">
                <Banner type="feature" title="New feature available" subtle dismissible={false} />
                <Banner type="success" title="Changes saved" subtle dismissible={false} />
              </div>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================
          SECTION 6: WITH DESCRIPTION
          ============================================ */}
      <ComponentCard
        id="description"
        title="With Description"
        description="Banners can include additional descriptive text"
      >
        <CodePreview
          code={`<Banner
  type="feature"
  title="New Feature Available"
  description="Check out our latest climate impact reporting tools that help you track and showcase your organization's environmental efforts."
/>`}
        >
          <Banner
            type="feature"
            title="New Feature Available"
            description="Check out our latest climate impact reporting tools that help you track and showcase your organization's environmental efforts."
            dismissible={false}
          />
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SECTION 6: WITH ACTIONS
          ============================================ */}
      <ComponentCard
        id="actions"
        title="With Actions"
        description="Add action buttons to banners for user interaction"
      >
        <div className="space-y-6">
          {/* Themed Action Buttons */}
          <div>
            <h4 className="text-body-strong text-foreground mb-3">Themed Action Buttons</h4>
            <p className="text-body-sm text-foreground-muted mb-4">
              Action buttons automatically use themed styling that matches the banner variant.
              For bold banners, buttons use contrasting colors. For subtle banners, buttons use
              a lighter tint of the variant color.
            </p>
            <CodePreview
              code={`// Themed buttons match each banner variant automatically
<Banner type="feature" title="New feature" actionLabel="Try It" />
<Banner type="success" title="Action complete" actionLabel="View" />
<Banner type="warning" title="Action needed" actionLabel="Update" />
<Banner type="critical" title="Error occurred" actionLabel="Fix" />
<Banner type="info" title="Information" actionLabel="Details" />`}
            >
              <div className="space-y-3">
                <Banner
                  type="feature"
                  title="New AI-powered candidate matching"
                  actionLabel="Try It"
                  dismissible={false}
                />
                <Banner
                  type="success"
                  title="Job posting published successfully"
                  actionLabel="View"
                  dismissible={false}
                />
                <Banner
                  type="warning"
                  title="Your subscription expires soon"
                  actionLabel="Update"
                  dismissible={false}
                />
                <Banner
                  type="critical"
                  title="Integration connection failed"
                  actionLabel="Fix"
                  dismissible={false}
                />
                <Banner
                  type="info"
                  title="New candidates match your criteria"
                  actionLabel="Details"
                  dismissible={false}
                />
              </div>
            </CodePreview>
          </div>

          {/* Themed Subtle Buttons */}
          <div>
            <h4 className="text-body-strong text-foreground mb-3">Themed Buttons (Subtle Style)</h4>
            <p className="text-body-sm text-foreground-muted mb-4">
              Subtle banners also get themed action buttons with a softer appearance.
            </p>
            <CodePreview
              code={`// Subtle banners with themed buttons
<Banner type="feature" title="New feature" actionLabel="Try It" subtle />
<Banner type="success" title="Success" actionLabel="View" subtle />
<Banner type="warning" title="Warning" actionLabel="Update" subtle />
<Banner type="critical" title="Error" actionLabel="Fix" subtle />
<Banner type="info" title="Info" actionLabel="Details" subtle />`}
            >
              <div className="space-y-3">
                <Banner
                  type="feature"
                  title="New AI-powered candidate matching"
                  actionLabel="Try It"
                  subtle
                  dismissible={false}
                />
                <Banner
                  type="success"
                  title="Job posting published successfully"
                  actionLabel="View"
                  subtle
                  dismissible={false}
                />
                <Banner
                  type="warning"
                  title="Your subscription expires soon"
                  actionLabel="Update"
                  subtle
                  dismissible={false}
                />
                <Banner
                  type="critical"
                  title="Integration connection failed"
                  actionLabel="Fix"
                  subtle
                  dismissible={false}
                />
                <Banner
                  type="info"
                  title="New candidates match your criteria"
                  actionLabel="Details"
                  subtle
                  dismissible={false}
                />
              </div>
            </CodePreview>
          </div>

          {/* Simple Action */}
          <div>
            <h4 className="text-body-strong text-foreground mb-3">Using actionLabel</h4>
            <CodePreview
              code={`<Banner
  type="feature"
  title="New reporting features available"
  actionLabel="Learn More"
  onAction={() => console.log("Action clicked")}
/>`}
            >
              <Banner
                type="feature"
                title="New reporting features available"
                actionLabel="Learn More"
                onAction={() => console.log("Action clicked")}
                dismissible={false}
              />
            </CodePreview>
          </div>

          {/* With actionButtonProps */}
          <div>
            <h4 className="text-body-strong text-foreground mb-3">Using actionButtonProps</h4>
            <p className="text-body-sm text-foreground-muted mb-4">
              Customize the action button&apos;s appearance using <code className="bg-background-muted px-1 rounded">actionButtonProps</code>.
              You can pass any Button prop like <code className="bg-background-muted px-1 rounded">variant</code>, <code className="bg-background-muted px-1 rounded">size</code>, <code className="bg-background-muted px-1 rounded">leftIcon</code>, <code className="bg-background-muted px-1 rounded">rightIcon</code>, or <code className="bg-background-muted px-1 rounded">loading</code>.
            </p>
            <CodePreview
              code={`import { ArrowRight, Sparkle } from "@phosphor-icons/react";

// Primary button variant
<Banner
  type="feature"
  title="New AI matching is available"
  actionLabel="Try Now"
  actionButtonProps={{ variant: "primary" }}
/>

// With right icon
<Banner
  type="success"
  title="Your profile is complete"
  actionLabel="View Profile"
  actionButtonProps={{
    variant: "secondary",
    rightIcon: <ArrowRight size={16} />
  }}
/>

// With left icon
<Banner
  type="warning"
  title="Upgrade to unlock more features"
  actionLabel="Upgrade"
  actionButtonProps={{
    variant: "primary",
    leftIcon: <Sparkle size={16} weight="fill" />
  }}
  subtle
/>`}
            >
              <div className="space-y-4">
                <Banner
                  type="feature"
                  title="New AI matching is available"
                  actionLabel="Try Now"
                  actionButtonProps={{ variant: "primary" }}
                  dismissible={false}
                />
                <Banner
                  type="success"
                  title="Your profile is complete"
                  actionLabel="View Profile"
                  actionButtonProps={{
                    variant: "secondary",
                    rightIcon: <ArrowRight size={16} />
                  }}
                  dismissible={false}
                />
                <Banner
                  type="warning"
                  title="Upgrade to unlock more features"
                  actionLabel="Upgrade"
                  actionButtonProps={{
                    variant: "primary",
                    leftIcon: <Sparkle size={16} weight="fill" />
                  }}
                  subtle
                  dismissible={false}
                />
              </div>
            </CodePreview>
          </div>

          {/* Custom Action */}
          <div>
            <h4 className="text-body-strong text-foreground mb-3">Using custom action element</h4>
            <p className="text-body-sm text-foreground-muted mb-4">
              For complete control, use the <code className="bg-background-muted px-1 rounded">action</code> prop to render any custom element.
            </p>
            <CodePreview
              code={`<Banner
  type="success"
  title="Your career page is ready to publish"
  action={
    <Button variant="primary" size="sm">
      Publish Now <ArrowRight size={16} className="ml-1" />
    </Button>
  }
/>`}
            >
              <Banner
                type="success"
                title="Your career page is ready to publish"
                action={
                  <Button variant="primary" size="sm">
                    Publish Now <ArrowRight size={16} className="ml-1" />
                  </Button>
                }
                dismissible={false}
              />
            </CodePreview>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================
          SECTION 7: DISMISSIBLE BANNERS
          ============================================ */}
      <ComponentCard
        id="dismissible"
        title="Dismissible Banners"
        description="Banners are dismissible by default"
      >
        <div className="space-y-4">
          <CodePreview
            code={`const [showBanner, setShowBanner] = useState(true);

{showBanner && (
  <Banner
    type="info"
    title="Dismissible banner"
    dismissible={true}
    onDismiss={() => setShowBanner(false)}
  />
)}`}
          >
            <div className="space-y-4">
              {showBanners.dismissible1 && (
                <Banner
                  type="info"
                  title="Click the X to dismiss this banner"
                  onDismiss={() => setShowBanners(prev => ({ ...prev, dismissible1: false }))}
                />
              )}
              {showBanners.dismissible2 && (
                <Banner
                  type="success"
                  title="This banner can also be dismissed"
                  onDismiss={() => setShowBanners(prev => ({ ...prev, dismissible2: false }))}
                />
              )}
              {showBanners.dismissible3 && (
                <Banner
                  type="warning"
                  title="All banners are dismissible by default"
                  onDismiss={() => setShowBanners(prev => ({ ...prev, dismissible3: false }))}
                />
              )}
              {(!showBanners.dismissible1 || !showBanners.dismissible2 || !showBanners.dismissible3) && (
                <Button variant="secondary" size="sm" onClick={resetBanners}>
                  Reset Banners
                </Button>
              )}
            </div>
          </CodePreview>

          <div className="mt-4">
            <h4 className="text-body-strong text-foreground mb-3">Non-dismissible</h4>
            <CodePreview
              code={`<Banner
  type="critical"
  title="Critical system update required"
  dismissible={false}
  actionLabel="Update Now"
/>`}
            >
              <Banner
                type="critical"
                title="Critical system update required"
                dismissible={false}
                actionLabel="Update Now"
              />
            </CodePreview>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================
          SECTION 8: CUSTOM ICONS
          ============================================ */}
      <ComponentCard
        id="custom-icons"
        title="Custom Icons"
        description="Override the default icon or hide it completely"
      >
        <div className="space-y-6">
          {/* Custom Icon */}
          <div>
            <h4 className="text-body-strong text-foreground mb-3">Custom Icon</h4>
            <p className="text-body-sm text-foreground-muted mb-4">
              Custom icons automatically inherit the banner&apos;s icon color. Just pass the icon component
              without any color classes — the banner will handle the styling.
            </p>
            <CodePreview
              code={`import { Megaphone, Gift, Sparkle } from "@phosphor-icons/react";

// Icon color is automatically applied based on banner type
<Banner
  type="feature"
  title="Big announcement coming soon!"
  icon={<Megaphone weight="fill" />}
/>

<Banner
  type="success"
  title="You've earned a free month!"
  icon={<Gift weight="fill" />}
/>

<Banner
  type="warning"
  title="Limited time offer!"
  icon={<Sparkle weight="fill" />}
/>`}
            >
              <div className="space-y-4">
                <Banner
                  type="feature"
                  title="Big announcement coming soon!"
                  icon={<Megaphone weight="fill" />}
                  dismissible={false}
                />
                <Banner
                  type="success"
                  title="You've earned a free month!"
                  icon={<Gift weight="fill" />}
                  dismissible={false}
                />
                <Banner
                  type="warning"
                  title="Limited time offer!"
                  icon={<Sparkle weight="fill" />}
                  dismissible={false}
                />
              </div>
            </CodePreview>
          </div>

          {/* Hidden Icon */}
          <div>
            <h4 className="text-body-strong text-foreground mb-3">Hidden Icon</h4>
            <CodePreview
              code={`<Banner
  type="info"
  title="This banner has no icon"
  hideIcon
/>`}
            >
              <Banner
                type="info"
                title="This banner has no icon"
                hideIcon
                dismissible={false}
              />
            </CodePreview>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================
          SECTION 9: LINK STYLE ACTION
          ============================================ */}
      <ComponentCard
        id="link-style"
        title="Link Style Action"
        description="Show the action as a link with an arrow instead of a button"
      >
        <CodePreview
          code={`<Banner
  type="feature"
  title="New reporting features available"
  actionLabel="Learn more"
  linkStyle
  onAction={() => console.log("Link clicked")}
/>`}
        >
          <div className="space-y-4">
            <Banner
              type="feature"
              title="New reporting features available"
              actionLabel="Learn more"
              linkStyle
              onAction={() => console.log("Link clicked")}
              dismissible={false}
            />
            <Banner
              type="info"
              title="Check out our documentation"
              description="Learn how to make the most of Canopy's features."
              actionLabel="View docs"
              linkStyle
              onAction={() => console.log("Link clicked")}
              dismissible={false}
            />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SECTION 10: FULL WIDTH MODE
          ============================================ */}
      <ComponentCard
        id="full-width"
        title="Full Width Mode"
        description="Remove border radius for page-top placement"
      >
        <CodePreview
          code={`<Banner
  type="warning"
  title="Scheduled maintenance tonight at 11 PM EST"
  fullWidth
  dismissible={false}
/>`}
        >
          <div className="-mx-4">
            <Banner
              type="warning"
              title="Scheduled maintenance tonight at 11 PM EST"
              fullWidth
              dismissible={false}
            />
          </div>
        </CodePreview>
        <p className="text-caption text-foreground-muted mt-4">
          Use <code className="bg-background-muted px-1 rounded">fullWidth</code> for banners
          that span the full width of the page, typically placed at the very top of the viewport.
        </p>
      </ComponentCard>

      {/* ============================================
          SECTION 11: ANIMATION
          ============================================ */}
      <ComponentCard
        id="animation"
        title="Animation"
        description="Banners animate smoothly on enter and exit"
      >
        <div className="space-y-6">
          <div>
            <p className="text-body-sm text-foreground-muted mb-4">
              Banners use subtle slide and fade animations for a polished feel. The enter animation
              plays when the banner mounts, and the exit animation plays when dismissed.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-background-subtle rounded-lg">
                <p className="text-caption-strong text-foreground mb-2">Enter Animation</p>
                <ul className="text-caption text-foreground-muted space-y-1">
                  <li>• Fade in from 0% to 100% opacity</li>
                  <li>• Slide down from -8px offset</li>
                  <li>• Duration: 200ms</li>
                  <li>• Easing: ease-out</li>
                </ul>
              </div>
              <div className="p-4 bg-background-subtle rounded-lg">
                <p className="text-caption-strong text-foreground mb-2">Exit Animation</p>
                <ul className="text-caption text-foreground-muted space-y-1">
                  <li>• Fade out from 100% to 0% opacity</li>
                  <li>• Slide up to -8px offset</li>
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

      {/* ============================================
          SECTION 12: PROPS TABLE
          ============================================ */}
      <ComponentCard id="props" title="Props">
        <PropsTable props={bannerProps} />
      </ComponentCard>

      {/* ============================================
          SECTION 13: USAGE GUIDELINES
          ============================================ */}
      <UsageGuide
        dos={[
          "Use banners for important, system-wide messages",
          "Keep banner messages concise and actionable",
          "Use the appropriate type for the message severity",
          "Include a clear action when users need to take steps",
          "Allow users to dismiss non-critical banners",
          "Place banners at the top of the relevant content area",
        ]}
        donts={[
          "Don't show too many banners at once (max 2-3)",
          "Don't use banners for inline form validation",
          "Don't use critical type for non-urgent messages",
          "Don't hide important information in dismissible banners",
          "Don't use banners for transient feedback (use Toast)",
          "Don't make critical system banners dismissible",
        ]}
      />

      {/* ============================================
          SECTION 11: ACCESSIBILITY
          ============================================ */}
      <AccessibilityInfo
        items={[
          "**Role**: Uses `role=\"alert\"` for immediate screen reader announcement",
          "**Color contrast**: All variants meet WCAG AA standards (4.5:1 minimum)",
          "**Icons**: Decorative icons use `aria-hidden=\"true\"`",
          "**Dismiss button**: Has `aria-label=\"Dismiss banner\"` for screen readers",
          "**Focus management**: Dismiss button is keyboard accessible",
          "**Not color alone**: Icons and text convey meaning alongside color",
        ]}
      />

      {/* ============================================
          SECTION 12: RELATED COMPONENTS
          ============================================ */}
      <RelatedComponents
        components={[
          {
            name: "InlineMessage",
            href: "/design-system/components/inline-message",
            description: "Compact inline feedback for form validation",
          },
          {
            name: "Toast",
            href: "/design-system/components/toast",
            description: "Transient notifications that auto-dismiss",
          },
          {
            name: "Alert",
            href: "/design-system/components/alert",
            description: "Static alert boxes for contextual messages",
          },
          {
            name: "Dialog",
            href: "/design-system/components/dialog",
            description: "Modal dialogs for important confirmations",
          },
        ]}
      />

      {/* ============================================
          SECTION 13: REAL-WORLD EXAMPLES
          ============================================ */}
      <RealWorldExample
        title="Dashboard Announcement Banner"
        description="Feature announcement at the top of the dashboard"
      >
        <CodePreview
          code={`<Banner
  type="feature"
  title="Introducing AI-Powered Candidate Matching"
  description="Our new AI matching system analyzes skills, experience, and climate passion to find your perfect candidates."
  actionLabel="Try It Now"
  onAction={() => navigate('/candidates/ai-match')}
/>`}
        >
          <Banner
            type="feature"
            title="Introducing AI-Powered Candidate Matching"
            description="Our new AI matching system analyzes skills, experience, and climate passion to find your perfect candidates."
            actionLabel="Try It Now"
            dismissible={false}
          />
        </CodePreview>
      </RealWorldExample>

      <RealWorldExample
        title="Trial Expiration Warning"
        description="Warning banner for trial period ending"
      >
        <CodePreview
          code={`<Banner
  type="warning"
  title="Your free trial ends in 3 days"
  description="Upgrade to Pro to keep access to unlimited job postings, AI sourcing, and your candidate database."
  action={
    <div className="flex gap-2">
      <Button variant="primary" size="sm">Upgrade Now</Button>
      <Button variant="ghost" size="sm">View Plans</Button>
    </div>
  }
/>`}
        >
          <Banner
            type="warning"
            title="Your free trial ends in 3 days"
            description="Upgrade to Pro to keep access to unlimited job postings, AI sourcing, and your candidate database."
            action={
              <div className="flex gap-2">
                <Button variant="primary" size="sm">Upgrade Now</Button>
                <Button variant="ghost" size="sm">View Plans</Button>
              </div>
            }
            dismissible={false}
          />
        </CodePreview>
      </RealWorldExample>

      <RealWorldExample
        title="Job Publishing Success"
        description="Success banner after publishing a job"
      >
        <CodePreview
          code={`<Banner
  type="success"
  title="Job posted successfully!"
  description="Your Solar Installation Manager position is now live on Green Jobs Board and 5 partner sites."
  actionLabel="View Live Posting"
  onAction={() => window.open(jobUrl, '_blank')}
/>`}
        >
          <Banner
            type="success"
            title="Job posted successfully!"
            description="Your Solar Installation Manager position is now live on Green Jobs Board and 5 partner sites."
            actionLabel="View Live Posting"
            dismissible={false}
          />
        </CodePreview>
      </RealWorldExample>

      <RealWorldExample
        title="Payment Failure Alert"
        description="Critical banner for billing issues"
      >
        <CodePreview
          code={`<Banner
  type="critical"
  title="Payment failed - Action required"
  description="We couldn't process your last payment. Please update your billing information to avoid service interruption."
  actionLabel="Update Billing"
  dismissible={false}
/>`}
        >
          <Banner
            type="critical"
            title="Payment failed - Action required"
            description="We couldn't process your last payment. Please update your billing information to avoid service interruption."
            actionLabel="Update Billing"
            dismissible={false}
          />
        </CodePreview>
      </RealWorldExample>

      {/* Navigation */}
      <PageNavigation currentPath="/design-system/components/banner" />
    </div>
  );
}
