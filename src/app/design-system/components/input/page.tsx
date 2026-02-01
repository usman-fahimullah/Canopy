"use client";

import React from "react";
import {
  Input,
  InputMessage,
  InputWithMessage,
  Label,
  Button,
  Card,
  CardContent,
} from "@/components/ui";
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
  Search,
  User,
  Mail,
  Lock,
  Eye,
  EyeSlash,
  Phone,
  Globe,
  Briefcase,
  Building,
  ArrowRight,
} from "@/components/Icons";

// ============================================
// PROPS DEFINITIONS
// ============================================

const inputProps = [
  {
    name: "type",
    type: '"text" | "email" | "password" | "number" | "tel" | "url" | "search"',
    default: '"text"',
    description: "The HTML input type attribute",
  },
  {
    name: "placeholder",
    type: "string",
    description: "Placeholder text shown when the input is empty",
  },
  {
    name: "variant",
    type: '"default" | "error" | "success"',
    default: '"default"',
    description: "Visual variant that affects border color",
  },
  {
    name: "inputSize",
    type: '"sm" | "default" | "lg"',
    default: '"default"',
    description: "Size of the input field affecting padding and font size",
  },
  {
    name: "error",
    type: "boolean",
    default: "false",
    description: "Applies error styling (red border). Overrides variant prop.",
  },
  {
    name: "success",
    type: "boolean",
    default: "false",
    description: "Applies success styling (green border). Overrides variant prop.",
  },
  {
    name: "leftAddon",
    type: "ReactNode",
    description: "Icon or element to display on the left side (rendered at 24px)",
  },
  {
    name: "rightAddon",
    type: "ReactNode",
    description: "Icon or element to display on the right side (rendered at 16px)",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disables the input and applies reduced opacity",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes to apply",
  },
];

const inputMessageProps = [
  {
    name: "status",
    type: '"error" | "success" | "info" | "warning"',
    default: '"info"',
    description: "The type of message, affects icon and color",
  },
  {
    name: "children",
    type: "ReactNode",
    required: true,
    description: "The message content to display",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes to apply",
  },
];

const inputWithMessageProps = [
  {
    name: "message",
    type: "string",
    description: "Message to display below the input",
  },
  {
    name: "messageStatus",
    type: '"error" | "success" | "info" | "warning"',
    default: '"info"',
    description: "Status of the message (icon and color)",
  },
  {
    name: "...InputProps",
    type: "InputProps",
    description: "All standard Input props are also accepted",
  },
];

// ============================================
// PAGE COMPONENT
// ============================================

export default function InputPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");

  const validateEmail = (value: string) => {
    setEmail(value);
    if (value && !value.includes("@")) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  return (
    <div className="space-y-12">
      {/* ============================================ */}
      {/* 1. OVERVIEW */}
      {/* ============================================ */}
      <div id="overview">
        <h1 className="mb-2 text-heading-lg text-foreground">Input</h1>
        <p className="max-w-3xl text-body text-foreground-muted">
          Input components allow users to enter and edit text. They are the foundation of forms and
          data entry, supporting various types including text, email, password, and numbers. The
          Input family includes InputMessage for validation feedback and InputWithMessage for
          convenience.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-background-brand-subtle px-3 py-1 text-caption font-medium text-foreground-brand">
            Form Control
          </span>
          <span className="rounded-full bg-background-subtle px-3 py-1 text-caption text-foreground-muted">
            Accessible
          </span>
          <span className="rounded-full bg-background-subtle px-3 py-1 text-caption text-foreground-muted">
            Validation Support
          </span>
        </div>

        {/* When to Use / When Not to Use */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border-success bg-background-success p-4">
            <h3 className="mb-2 font-semibold text-foreground-success">When to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>• Single-line text entry (names, emails, URLs)</li>
              <li>• Numeric data entry (phone numbers, quantities)</li>
              <li>• Password and secure text entry</li>
              <li>• Search queries and filters</li>
              <li>• Short text that doesn&apos;t need line breaks</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border-error bg-background-error p-4">
            <h3 className="mb-2 font-semibold text-foreground-error">When not to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>• Multi-line text (use Textarea instead)</li>
              <li>• Selecting from predefined options (use Select)</li>
              <li>• Dates or times (use DatePicker/TimePicker)</li>
              <li>• Binary choices (use Checkbox or Switch)</li>
              <li>• Rich formatted text (use Rich Text Editor)</li>
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
            description: "The outer wrapper with background (neutral-100), border, and 8px radius",
            required: true,
          },
          {
            name: "Left Addon",
            description:
              "Optional icon or element on the left, rendered at 24px with neutral-600 color",
          },
          {
            name: "Input Field",
            description: "The actual text input area with 18px font and black text color",
            required: true,
          },
          {
            name: "Right Addon",
            description:
              "Optional icon or element on the right, rendered at 16px with green-800 color",
          },
          {
            name: "Validation Message",
            description: "Optional InputMessage component below the input showing status feedback",
          },
        ]}
      />

      {/* ============================================ */}
      {/* 3. BASIC USAGE */}
      {/* ============================================ */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="The simplest implementation with a label and placeholder"
      >
        <CodePreview
          code={`import { Input, Label } from "@/components/ui";

<div className="space-y-2">
  <Label htmlFor="name">Full Name</Label>
  <Input id="name" placeholder="Enter your full name" />
</div>`}
        >
          <div className="max-w-sm space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Enter your full name" />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 4. VARIANTS */}
      {/* ============================================ */}
      <ComponentCard
        id="variants"
        title="Input Types"
        description="Different HTML input types for specific data entry needs"
      >
        <div className="space-y-8">
          <div className="grid max-w-3xl gap-6 md:grid-cols-2">
            {/* Text */}
            <div className="space-y-2">
              <Label htmlFor="text-type">Text</Label>
              <Input id="text-type" type="text" placeholder="Plain text input" />
              <p className="text-caption text-foreground-muted">
                Default type for general text entry
              </p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email-type">Email</Label>
              <Input
                id="email-type"
                type="email"
                placeholder="candidate@example.com"
                leftAddon={<Mail />}
              />
              <p className="text-caption text-foreground-muted">
                Validates email format on mobile keyboards
              </p>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password-type">Password</Label>
              <Input
                id="password-type"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                leftAddon={<Lock />}
                rightAddon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-inherit transition-opacity hover:opacity-70"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeSlash /> : <Eye />}
                  </button>
                }
              />
              <p className="text-caption text-foreground-muted">
                Obscures text by default, can toggle visibility
              </p>
            </div>

            {/* Number */}
            <div className="space-y-2">
              <Label htmlFor="number-type">Number</Label>
              <Input id="number-type" type="number" placeholder="0" min={0} max={100} />
              <p className="text-caption text-foreground-muted">
                Numeric keyboard on mobile, increment/decrement
              </p>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone-type">Phone</Label>
              <Input
                id="phone-type"
                type="tel"
                placeholder="+1 (555) 000-0000"
                leftAddon={<Phone />}
              />
              <p className="text-caption text-foreground-muted">Phone pad keyboard on mobile</p>
            </div>

            {/* URL */}
            <div className="space-y-2">
              <Label htmlFor="url-type">URL</Label>
              <Input
                id="url-type"
                type="url"
                placeholder="https://example.com"
                leftAddon={<Globe />}
              />
              <p className="text-caption text-foreground-muted">
                URL keyboard with .com and / keys
              </p>
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
        description="Different size options for various contexts"
      >
        <div className="max-w-md space-y-6">
          <div className="space-y-2">
            <Label>Small (12px padding, 14px font)</Label>
            <Input inputSize="sm" placeholder="Small input" />
          </div>
          <div className="space-y-2">
            <Label>Default (16px padding, 18px font)</Label>
            <Input inputSize="default" placeholder="Default input" />
          </div>
          <div className="space-y-2">
            <Label>Large (16px padding, 18px font, prominent)</Label>
            <Input inputSize="lg" placeholder="Large input" />
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
        <div className="grid max-w-4xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label>Default</Label>
            <Input placeholder="Default state" />
            <p className="text-caption text-foreground-muted">
              Neutral-200 border, ready for input
            </p>
          </div>
          <div className="space-y-2">
            <Label>Hover</Label>
            <Input placeholder="Hover state" className="border-[var(--primitive-neutral-300)]" />
            <p className="text-caption text-foreground-muted">Neutral-300 border on hover</p>
          </div>
          <div className="space-y-2">
            <Label>Focus</Label>
            <Input placeholder="Focus state" className="border-[var(--primitive-green-600)]" />
            <p className="text-caption text-foreground-muted">Green-600 border when focused</p>
          </div>
          <div className="space-y-2">
            <Label>Filled</Label>
            <Input defaultValue="John Doe" />
            <p className="text-caption text-foreground-muted">Black text when filled</p>
          </div>
          <div className="space-y-2">
            <Label>Error</Label>
            <Input error placeholder="Error state" />
            <InputMessage status="error">This field is required</InputMessage>
          </div>
          <div className="space-y-2">
            <Label>Success</Label>
            <Input success placeholder="Success state" />
            <InputMessage status="success">Valid email address</InputMessage>
          </div>
          <div className="space-y-2">
            <Label>Disabled</Label>
            <Input disabled placeholder="Disabled state" />
            <p className="text-caption text-foreground-muted">50% opacity, no interaction</p>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 7. CONTROLLED USAGE */}
      {/* ============================================ */}
      <ComponentCard
        id="controlled"
        title="Controlled Usage"
        description="Using Input with React state for validation"
      >
        <CodePreview
          code={`const [email, setEmail] = React.useState("");
const [emailError, setEmailError] = React.useState("");

const validateEmail = (value: string) => {
  setEmail(value);
  if (value && !value.includes("@")) {
    setEmailError("Please enter a valid email address");
  } else {
    setEmailError("");
  }
};

<InputWithMessage
  type="email"
  value={email}
  onChange={(e) => validateEmail(e.target.value)}
  placeholder="candidate@company.com"
  error={!!emailError}
  message={emailError || "We'll never share your email"}
  messageStatus={emailError ? "error" : "info"}
  leftAddon={<Mail />}
/>`}
        >
          <div className="max-w-sm space-y-4">
            <Label htmlFor="controlled-email">Email Address</Label>
            <InputWithMessage
              id="controlled-email"
              type="email"
              value={email}
              onChange={(e) => validateEmail(e.target.value)}
              placeholder="candidate@company.com"
              error={!!emailError}
              message={emailError || "We'll never share your email"}
              messageStatus={emailError ? "error" : "info"}
              leftAddon={<Mail />}
            />
            <p className="text-caption text-foreground-muted">
              Current value:{" "}
              <code className="rounded bg-background-muted px-1">{email || "(empty)"}</code>
            </p>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 8. INPUT MESSAGE */}
      {/* ============================================ */}
      <ComponentCard
        id="input-message"
        title="Input Message"
        description="Contextual messages for validation and helper text"
      >
        <div className="max-w-md space-y-6">
          <div className="space-y-1">
            <Label>Error Message</Label>
            <Input error placeholder="Invalid input" />
            <InputMessage status="error">This field is required</InputMessage>
          </div>

          <div className="space-y-1">
            <Label>Success Message</Label>
            <Input success defaultValue="valid@email.com" />
            <InputMessage status="success">Email address is valid</InputMessage>
          </div>

          <div className="space-y-1">
            <Label>Warning Message</Label>
            <Input placeholder="Username" />
            <InputMessage status="warning">Username should be at least 3 characters</InputMessage>
          </div>

          <div className="space-y-1">
            <Label>Info Message (Helper Text)</Label>
            <Input type="password" placeholder="Password" />
            <InputMessage status="info">Must contain at least 8 characters</InputMessage>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 9. WITH ADDONS */}
      {/* ============================================ */}
      <ComponentCard
        id="with-addons"
        title="With Addons"
        description="Icons and interactive elements within the input"
      >
        <div className="max-w-md space-y-6">
          <div className="space-y-2">
            <Label>Left Icon (24px, neutral-600)</Label>
            <Input placeholder="Search candidates..." leftAddon={<Search />} />
          </div>

          <div className="space-y-2">
            <Label>Right Icon (16px, green-800)</Label>
            <Input placeholder="Enter company name" rightAddon={<Building />} />
          </div>

          <div className="space-y-2">
            <Label>Both Addons</Label>
            <Input
              type="email"
              placeholder="Email address"
              leftAddon={<Mail />}
              rightAddon={<User />}
            />
          </div>

          <div className="space-y-2">
            <Label>Interactive Right Addon (Password Toggle)</Label>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter secure password"
              leftAddon={<Lock />}
              rightAddon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-inherit transition-opacity hover:opacity-70"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeSlash /> : <Eye />}
                </button>
              }
            />
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 10. PROPS TABLES */}
      {/* ============================================ */}
      <div id="props" className="space-y-6">
        <h2 className="text-heading-sm text-foreground">Props Reference</h2>

        <ComponentCard title="Input Props">
          <PropsTable props={inputProps} />
        </ComponentCard>

        <ComponentCard title="InputMessage Props">
          <PropsTable props={inputMessageProps} />
        </ComponentCard>

        <ComponentCard title="InputWithMessage Props">
          <PropsTable props={inputWithMessageProps} />
        </ComponentCard>
      </div>

      {/* ============================================ */}
      {/* 11. USAGE GUIDELINES */}
      {/* ============================================ */}
      <div id="guidelines">
        <h2 className="mb-4 text-heading-sm text-foreground">Usage Guidelines</h2>
        <UsageGuide
          dos={[
            "Always pair inputs with visible labels (not just placeholders)",
            "Use placeholder text as hints, showing expected format or example",
            "Use appropriate input types for data (email, tel, number, url)",
            "Show validation messages immediately after the input loses focus",
            "Provide clear error messages explaining how to fix the issue",
            "Use left icons to indicate the type of data expected",
            "Make inputs wide enough for expected content length",
          ]}
          donts={[
            "Don't use placeholder text as the only label",
            "Don't disable inputs without explaining why",
            "Don't show error styling before the user has interacted",
            "Don't use error colors (red) for non-error states",
            "Don't rely on color alone to indicate state (use icons too)",
            "Don't make inputs too narrow for typical content",
            "Don't use Input for multi-line text (use Textarea)",
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 12. ACCESSIBILITY */}
      {/* ============================================ */}
      <div id="accessibility">
        <AccessibilityInfo
          items={[
            "**Labels**: Always associate labels with inputs using htmlFor/id or wrap input in label",
            "**aria-invalid**: Automatically set to 'true' when error prop is true",
            "**aria-describedby**: Connect inputs to their error messages for screen readers",
            "**role='alert'**: InputMessage uses role='alert' for error status to announce immediately",
            "**role='status'**: InputMessage uses role='status' for non-error messages",
            "**Focus visible**: Clear green border (green-600) indicates keyboard focus",
            "**Placeholder contrast**: Neutral-600 placeholder meets contrast requirements",
            "**Icon buttons**: Password toggle includes aria-label for screen readers",
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 13. RELATED COMPONENTS */}
      {/* ============================================ */}
      <div id="related">
        <RelatedComponents
          components={[
            {
              name: "Textarea",
              href: "/design-system/components/textarea",
              description: "For multi-line text entry",
            },
            {
              name: "Select",
              href: "/design-system/components/select",
              description: "For choosing from predefined options",
            },
            {
              name: "Label",
              href: "/design-system/components/label",
              description: "Form field labels",
            },
            {
              name: "SearchInput",
              href: "/design-system/components/search-input",
              description: "Specialized search with recent searches",
            },
            {
              name: "Combobox",
              href: "/design-system/components/combobox",
              description: "Input with autocomplete suggestions",
            },
            {
              name: "DatePicker",
              href: "/design-system/components/date-picker",
              description: "For date and time input",
            },
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 14. REAL-WORLD EXAMPLES */}
      {/* ============================================ */}
      <div id="examples" className="space-y-6">
        <h2 className="text-heading-sm text-foreground">Real-World Examples</h2>

        <RealWorldExample
          title="Job Application Form"
          description="Contact information section of a job application"
        >
          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-4 text-body-strong text-foreground">Contact Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="applicant-name">Full Name *</Label>
                  <Input id="applicant-name" placeholder="Jane Doe" leftAddon={<User />} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="applicant-email">Email Address *</Label>
                  <Input
                    id="applicant-email"
                    type="email"
                    placeholder="jane@example.com"
                    leftAddon={<Mail />}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="applicant-phone">Phone Number</Label>
                  <Input
                    id="applicant-phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    leftAddon={<Phone />}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="applicant-linkedin">LinkedIn Profile</Label>
                  <Input
                    id="applicant-linkedin"
                    type="url"
                    placeholder="linkedin.com/in/janedoe"
                    leftAddon={<Globe />}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </RealWorldExample>

        <RealWorldExample title="Create Job Posting" description="Job details form in the ATS">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="job-title">Job Title *</Label>
                  <Input
                    id="job-title"
                    placeholder="e.g., Senior Sustainability Analyst"
                    leftAddon={<Briefcase />}
                  />
                  <InputMessage status="info">
                    Be specific - include seniority level and focus area
                  </InputMessage>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="job-company">Company Name</Label>
                    <Input
                      id="job-company"
                      placeholder="Your company name"
                      leftAddon={<Building />}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="job-salary">Salary Range (USD)</Label>
                    <Input id="job-salary" type="text" placeholder="e.g., $120,000 - $150,000" />
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-border-muted pt-4">
                  <Button variant="tertiary">Save Draft</Button>
                  <Button variant="primary" rightIcon={<ArrowRight size={16} />}>
                    Continue
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </RealWorldExample>

        <RealWorldExample
          title="Login Form with Validation"
          description="Email and password login with inline validation"
        >
          <div className="mx-auto max-w-sm">
            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-6 text-center text-heading-sm text-foreground">
                  Sign in to Canopy
                </h3>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@company.com"
                      leftAddon={<Mail />}
                      error
                    />
                    <InputMessage status="error">Please enter a valid email address</InputMessage>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      leftAddon={<Lock />}
                    />
                  </div>

                  <Button variant="primary" className="w-full">
                    Sign In
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </RealWorldExample>
      </div>

      {/* Page Navigation */}
      <PageNavigation currentPath="/design-system/components/input" />
    </div>
  );
}
