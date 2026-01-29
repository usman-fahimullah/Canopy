"use client";

import React from "react";
import { InlineMessage, Badge, Input, Label, Button, Textarea } from "@/components/ui";
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
  CheckCircle,
  Warning,
  WarningDiamond,
  Info,
  LightbulbFilament,
  ShieldCheck,
} from "@phosphor-icons/react";

// ============================================
// PROPS DOCUMENTATION
// ============================================
const inlineMessageProps = [
  {
    name: "variant",
    type: '"info" | "success" | "warning" | "critical"',
    default: '"info"',
    description: "The visual style variant which determines colors and icon",
  },
  {
    name: "children",
    type: "ReactNode",
    required: true,
    description: "The message content to display",
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
    name: "className",
    type: "string",
    default: "undefined",
    description: "Additional CSS classes",
  },
];

export default function InlineMessagePage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const emailError = email && !email.includes("@") ? "Please enter a valid email address" : null;
  const passwordWeak = password && password.length < 8;
  const passwordStrong = password && password.length >= 12;

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
          Inline Message
        </h1>
        <p className="text-body text-foreground-muted mb-4 max-w-2xl">
          Inline Messages are compact feedback components for contextual information,
          form validation, and helper text. They display an icon and text without a
          background, making them perfect for inline use within forms and content areas.
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
              <li>* Form field validation messages</li>
              <li>* Helpful hints and contextual information</li>
              <li>* Success confirmation for field-level actions</li>
              <li>* Warning messages within content areas</li>
              <li>* Character count or requirement indicators</li>
            </ul>
          </div>
          <div className="p-4 bg-[var(--background-error)]/30 rounded-lg border border-[var(--border-error)]">
            <h3 className="font-semibold text-[var(--foreground-error)] mb-2">
              When not to use
            </h3>
            <ul className="text-sm space-y-1 text-foreground-muted">
              <li>* For system-wide announcements (use Banner)</li>
              <li>* For transient notifications (use Toast)</li>
              <li>* When a prominent alert is needed (use Alert)</li>
              <li>* For long, detailed messages</li>
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
        description="The inline message component consists of these parts"
      >
        <ComponentAnatomy
          parts={[
            { name: "Icon", description: "18px icon indicating the message type" },
            { name: "Message", description: "Text content (14px regular)" },
          ]}
        />
        <div className="mt-6 p-4 bg-background-subtle rounded-lg">
          <p className="text-caption text-foreground-muted mb-4">Live anatomy example:</p>
          <div className="flex items-center gap-8">
            <div className="relative inline-flex">
              <InlineMessage variant="success">Your changes have been saved</InlineMessage>
              <div className="absolute -top-3 -left-1 w-5 h-5 bg-[var(--foreground-brand)] text-white rounded-full flex items-center justify-center text-xs font-medium">
                1
              </div>
              <div className="absolute -top-3 left-6 w-5 h-5 bg-[var(--foreground-brand)] text-white rounded-full flex items-center justify-center text-xs font-medium">
                2
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
        description="The simplest way to use an inline message"
      >
        <CodePreview
          code={`import { InlineMessage } from "@/components/ui";

<InlineMessage>This is an informational message</InlineMessage>

<InlineMessage variant="success">
  Your changes have been saved
</InlineMessage>

<InlineMessage variant="warning">
  This action cannot be undone
</InlineMessage>

<InlineMessage variant="critical">
  Please fix the errors below
</InlineMessage>`}
        >
          <div className="space-y-3">
            <InlineMessage>This is an informational message</InlineMessage>
            <InlineMessage variant="success">Your changes have been saved</InlineMessage>
            <InlineMessage variant="warning">This action cannot be undone</InlineMessage>
            <InlineMessage variant="critical">Please fix the errors below</InlineMessage>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SECTION 4: VARIANTS
          ============================================ */}
      <ComponentCard
        id="variants"
        title="Variants"
        description="All available inline message variants"
      >
        <div className="space-y-6">
          {/* Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label className="font-semibold">Info (Default)</Label>
              <span className="text-caption text-foreground-muted">- General information and hints</span>
            </div>
            <InlineMessage variant="info">
              Use 8 or more characters with a mix of letters and numbers
            </InlineMessage>
          </div>

          {/* Success */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label className="font-semibold">Success</Label>
              <span className="text-caption text-foreground-muted">- Positive confirmations</span>
            </div>
            <InlineMessage variant="success">
              Email address verified successfully
            </InlineMessage>
          </div>

          {/* Warning */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label className="font-semibold">Warning</Label>
              <span className="text-caption text-foreground-muted">- Cautionary messages</span>
            </div>
            <InlineMessage variant="warning">
              This email is already associated with another account
            </InlineMessage>
          </div>

          {/* Critical */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label className="font-semibold">Critical</Label>
              <span className="text-caption text-foreground-muted">- Errors and validation failures</span>
            </div>
            <InlineMessage variant="critical">
              Please enter a valid email address
            </InlineMessage>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================
          SECTION 5: CUSTOM ICONS
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
            <CodePreview
              code={`import { LightbulbFilament, ShieldCheck } from "@phosphor-icons/react";

<InlineMessage
  icon={<LightbulbFilament size={18} weight="fill" className="text-[var(--primitive-yellow-500)]" />}
>
  Pro tip: Add climate-related keywords to improve candidate matching
</InlineMessage>

<InlineMessage
  variant="success"
  icon={<ShieldCheck size={18} weight="fill" className="text-[var(--primitive-green-600)]" />}
>
  Your account is protected with 2FA
</InlineMessage>`}
            >
              <div className="space-y-3">
                <InlineMessage
                  icon={<LightbulbFilament size={18} weight="fill" className="text-[var(--primitive-yellow-500)]" />}
                >
                  Pro tip: Add climate-related keywords to improve candidate matching
                </InlineMessage>
                <InlineMessage
                  variant="success"
                  icon={<ShieldCheck size={18} weight="fill" className="text-[var(--primitive-green-600)]" />}
                >
                  Your account is protected with 2FA
                </InlineMessage>
              </div>
            </CodePreview>
          </div>

          {/* Hidden Icon */}
          <div>
            <h4 className="text-body-strong text-foreground mb-3">Hidden Icon</h4>
            <CodePreview
              code={`<InlineMessage hideIcon>
  This message has no icon
</InlineMessage>`}
            >
              <InlineMessage hideIcon>
                This message has no icon
              </InlineMessage>
            </CodePreview>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================
          SECTION 6: WITH FORM FIELDS
          ============================================ */}
      <ComponentCard
        id="form-usage"
        title="With Form Fields"
        description="Common pattern for form validation and helper text"
      >
        <CodePreview
          code={`<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    placeholder="you@company.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
  {emailError ? (
    <InlineMessage variant="critical">{emailError}</InlineMessage>
  ) : (
    <InlineMessage variant="info">
      We'll use this for notifications
    </InlineMessage>
  )}
</div>`}
        >
          <div className="space-y-6 max-w-md">
            {/* Email field */}
            <div className="space-y-2">
              <Label htmlFor="demo-email">Email</Label>
              <Input
                id="demo-email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError ? (
                <InlineMessage variant="critical">{emailError}</InlineMessage>
              ) : (
                <InlineMessage variant="info">
                  We&apos;ll use this for notifications
                </InlineMessage>
              )}
            </div>

            {/* Password field with strength indicator */}
            <div className="space-y-2">
              <Label htmlFor="demo-password">Password</Label>
              <Input
                id="demo-password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {password === "" && (
                <InlineMessage variant="info">
                  Use 8 or more characters with a mix of letters and numbers
                </InlineMessage>
              )}
              {passwordWeak && !passwordStrong && (
                <InlineMessage variant="warning">
                  Password is weak - consider adding more characters
                </InlineMessage>
              )}
              {passwordStrong && (
                <InlineMessage variant="success">
                  Strong password!
                </InlineMessage>
              )}
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SECTION 7: MULTIPLE MESSAGES
          ============================================ */}
      <ComponentCard
        id="multiple"
        title="Multiple Messages"
        description="Displaying multiple inline messages"
      >
        <CodePreview
          code={`<div className="space-y-1">
  <InlineMessage variant="critical">
    Password must be at least 8 characters
  </InlineMessage>
  <InlineMessage variant="critical">
    Password must contain at least one number
  </InlineMessage>
  <InlineMessage variant="critical">
    Password must contain at least one special character
  </InlineMessage>
</div>`}
        >
          <div className="space-y-1">
            <InlineMessage variant="critical">
              Password must be at least 8 characters
            </InlineMessage>
            <InlineMessage variant="critical">
              Password must contain at least one number
            </InlineMessage>
            <InlineMessage variant="critical">
              Password must contain at least one special character
            </InlineMessage>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SECTION 8: PROPS TABLE
          ============================================ */}
      <ComponentCard id="props" title="Props">
        <PropsTable props={inlineMessageProps} />
      </ComponentCard>

      {/* ============================================
          SECTION 9: USAGE GUIDELINES
          ============================================ */}
      <UsageGuide
        dos={[
          "Keep messages concise and actionable",
          "Use immediately below the related field or content",
          "Use the appropriate variant for the message type",
          "Provide helpful guidance, not just error statements",
          "Update messages in real-time during form validation",
        ]}
        donts={[
          "Don't use for system-wide announcements",
          "Don't display too many messages at once",
          "Don't use critical variant for non-error messages",
          "Don't repeat information already visible elsewhere",
          "Don't use vague messages like 'Invalid input'",
        ]}
      />

      {/* ============================================
          SECTION 10: ACCESSIBILITY
          ============================================ */}
      <AccessibilityInfo
        items={[
          "**Role**: Uses `role=\"status\"` with `aria-live=\"polite\"` for screen reader announcements",
          "**Color contrast**: All variants meet WCAG AA standards (4.5:1 minimum)",
          "**Icons**: Decorative icons use `aria-hidden=\"true\"`",
          "**Not color alone**: Icons convey meaning alongside color",
          "**Form association**: Place directly after the input for logical reading order",
          "**Dynamic updates**: Changes are announced to screen readers automatically",
        ]}
      />

      {/* ============================================
          SECTION 11: RELATED COMPONENTS
          ============================================ */}
      <RelatedComponents
        components={[
          {
            name: "Banner",
            href: "/design-system/components/banner",
            description: "Full-width alerts for system-wide messages",
          },
          {
            name: "Toast",
            href: "/design-system/components/toast",
            description: "Transient notifications that auto-dismiss",
          },
          {
            name: "Alert",
            href: "/design-system/components/alert",
            description: "Prominent alert boxes for important messages",
          },
          {
            name: "Input",
            href: "/design-system/components/input",
            description: "Form inputs commonly paired with inline messages",
          },
        ]}
      />

      {/* ============================================
          SECTION 12: REAL-WORLD EXAMPLES
          ============================================ */}
      <RealWorldExample
        title="Job Posting Form Validation"
        description="Inline messages providing real-time form feedback"
      >
        <CodePreview
          code={`<div className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="job-title">Job Title</Label>
    <Input id="job-title" value="Solar Engineer" />
    <InlineMessage variant="success">
      Great title! Clear and searchable.
    </InlineMessage>
  </div>

  <div className="space-y-2">
    <Label htmlFor="salary">Salary Range</Label>
    <Input id="salary" value="$50,000 - $70,000" />
    <InlineMessage variant="info">
      Jobs with transparent salaries get 30% more applications
    </InlineMessage>
  </div>
</div>`}
        >
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="job-title-demo">Job Title</Label>
              <Input id="job-title-demo" defaultValue="Solar Engineer" />
              <InlineMessage variant="success">
                Great title! Clear and searchable.
              </InlineMessage>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary-demo">Salary Range</Label>
              <Input id="salary-demo" defaultValue="$50,000 - $70,000" />
              <InlineMessage variant="info">
                Jobs with transparent salaries get 30% more applications
              </InlineMessage>
            </div>
          </div>
        </CodePreview>
      </RealWorldExample>

      <RealWorldExample
        title="Candidate Application Status"
        description="Inline messages showing application field status"
      >
        <CodePreview
          code={`<div className="space-y-4">
  <div className="space-y-2">
    <Label>Resume</Label>
    <div className="p-3 border rounded-lg bg-background-subtle">
      resume_sarah_chen.pdf
    </div>
    <InlineMessage variant="success">
      Resume parsed successfully - 5 years experience detected
    </InlineMessage>
  </div>

  <div className="space-y-2">
    <Label>LinkedIn Profile</Label>
    <Input placeholder="https://linkedin.com/in/..." />
    <InlineMessage variant="warning">
      Adding a LinkedIn profile increases match accuracy by 40%
    </InlineMessage>
  </div>
</div>`}
        >
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label>Resume</Label>
              <div className="p-3 border rounded-lg bg-background-subtle text-foreground">
                resume_sarah_chen.pdf
              </div>
              <InlineMessage variant="success">
                Resume parsed successfully - 5 years experience detected
              </InlineMessage>
            </div>

            <div className="space-y-2">
              <Label>LinkedIn Profile</Label>
              <Input placeholder="https://linkedin.com/in/..." />
              <InlineMessage variant="warning">
                Adding a LinkedIn profile increases match accuracy by 40%
              </InlineMessage>
            </div>
          </div>
        </CodePreview>
      </RealWorldExample>

      <RealWorldExample
        title="Career Page Editor Hints"
        description="Helpful tips during career page customization"
      >
        <CodePreview
          code={`<div className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="tagline">Company Tagline</Label>
    <Textarea
      id="tagline"
      placeholder="Describe your company mission..."
      defaultValue="Building a sustainable future through renewable energy innovation"
    />
    <InlineMessage
      icon={<LightbulbFilament size={18} weight="fill" className="text-[var(--primitive-yellow-500)]" />}
    >
      Tip: Mention climate impact to attract mission-driven candidates
    </InlineMessage>
  </div>
</div>`}
        >
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="tagline-demo">Company Tagline</Label>
              <Textarea
                id="tagline-demo"
                placeholder="Describe your company mission..."
                defaultValue="Building a sustainable future through renewable energy innovation"
              />
              <InlineMessage
                icon={<LightbulbFilament size={18} weight="fill" className="text-[var(--primitive-yellow-500)]" />}
              >
                Tip: Mention climate impact to attract mission-driven candidates
              </InlineMessage>
            </div>
          </div>
        </CodePreview>
      </RealWorldExample>

      {/* Navigation */}
      <PageNavigation currentPath="/design-system/components/inline-message" />
    </div>
  );
}
